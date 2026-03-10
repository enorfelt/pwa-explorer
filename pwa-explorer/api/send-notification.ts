import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';
import { getSubscriptions } from './subscribe';

function initVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL || 'admin@pwa-explorer.example.com';
  if (!publicKey || !privateKey) throw new Error('VAPID keys not configured');
  webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    initVapid();
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
    return;
  }

  const { title = 'PWA Explorer', body = 'Hello!', icon = '/icons/icon-192x192.png', url = '/' } = req.body as {
    title?: string;
    body?: string;
    icon?: string;
    url?: string;
  };

  const subscriptions = getSubscriptions();
  if (subscriptions.size === 0) {
    res.status(400).json({ error: 'No subscribers' });
    return;
  }

  const payload = JSON.stringify({ title, body, icon, url });
  let sent = 0;
  let failed = 0;

  for (const [endpoint, sub] of subscriptions) {
    try {
      await webpush.sendNotification(sub as unknown as webpush.PushSubscription, payload);
      sent++;
    } catch (err) {
      failed++;
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) subscriptions.delete(endpoint);
    }
  }

  res.json({ sent, failed });
}
