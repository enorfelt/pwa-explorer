import { Request, Response, Router } from 'express';
import webpush, { PushSubscription } from 'web-push';
import { getVapidPublicKey } from './vapid';

export const pushRouter = Router();

// In-memory subscription store (replace with DB in production)
const subscriptions = new Map<string, PushSubscription>();

pushRouter.get('/vapid-public-key', (_req: Request, res: Response) => {
  res.json({ publicKey: getVapidPublicKey() });
});

pushRouter.post('/subscribe', (req: Request, res: Response) => {
  const subscription = req.body as PushSubscription;
  if (!subscription?.endpoint) {
    res.status(400).json({ error: 'Invalid subscription' });
    return;
  }
  subscriptions.set(subscription.endpoint, subscription);
  console.log(`Subscription registered. Total: ${subscriptions.size}`);
  res.status(201).json({ message: 'Subscribed successfully' });
});

pushRouter.delete('/unsubscribe', (req: Request, res: Response) => {
  const subscription = req.body as PushSubscription;
  if (subscription?.endpoint) {
    subscriptions.delete(subscription.endpoint);
    console.log(`Subscription removed. Total: ${subscriptions.size}`);
  }
  res.json({ message: 'Unsubscribed' });
});

pushRouter.post('/send-notification', async (req: Request, res: Response) => {
  const { title = 'PWA Explorer', body = 'Hello!', icon = '/icons/icon-192x192.png', url = '/' } = req.body as {
    title?: string;
    body?: string;
    icon?: string;
    url?: string;
  };

  if (subscriptions.size === 0) {
    res.status(400).json({ error: 'No subscribers registered' });
    return;
  }

  const payload = JSON.stringify({ title, body, icon, url });
  const results: Array<{ endpoint: string; success: boolean; error?: string }> = [];

  for (const [endpoint, sub] of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      results.push({ endpoint: endpoint.slice(-20), success: true });
    } catch (err) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      results.push({ endpoint: endpoint.slice(-20), success: false, error: String(err) });
      // Remove expired/invalid subscriptions
      if (statusCode === 404 || statusCode === 410) {
        subscriptions.delete(endpoint);
      }
    }
  }

  res.json({ sent: results.filter(r => r.success).length, failed: results.filter(r => !r.success).length, results });
});
