import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush, { PushSubscription } from 'web-push';

function initVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL || 'admin@pwa-explorer.example.com';
  if (!publicKey || !privateKey) throw new Error('VAPID keys not configured');
  webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
}

// Vercel serverless: store subscriptions in an in-memory store.
// In production, swap this for a database (Vercel KV, PlanetScale, etc.)
const subscriptions = new Map<string, PushSubscription>();

export function getSubscriptions() {
  return subscriptions;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
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
    subscriptions.set(sub.endpoint, sub);
    res.status(201).json({ message: 'Subscribed successfully' });
  } else if (req.method === 'DELETE') {
    const sub = req.body as PushSubscription;
    if (sub?.endpoint) subscriptions.delete(sub.endpoint);
    res.json({ message: 'Unsubscribed' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
