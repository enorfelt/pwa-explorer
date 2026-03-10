import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import webpush, { PushSubscription } from 'web-push';

const redis = Redis.fromEnv();

export const KV_KEY = 'push_subscriptions';

function initVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL || 'admin@pwa-explorer.example.com';
  if (!publicKey || !privateKey) throw new Error('VAPID keys not configured');
  webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
}

export function endpointField(endpoint: string): string {
  return createHash('sha256').update(endpoint).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    initVapid();
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
    return;
  }

  if (req.method === 'POST') {
    const sub = req.body as PushSubscription;
    if (!sub?.endpoint) {
      res.status(400).json({ error: 'Invalid subscription' });
      return;
    }
    await redis.hset(KV_KEY, { [endpointField(sub.endpoint)]: JSON.stringify(sub) });
    res.status(201).json({ message: 'Subscribed successfully' });
  } else if (req.method === 'DELETE') {
    const sub = req.body as PushSubscription;
    if (sub?.endpoint) {
      await redis.hdel(KV_KEY, endpointField(sub.endpoint));
    }
    res.json({ message: 'Unsubscribed' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
