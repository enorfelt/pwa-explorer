import webpush from 'web-push';

let vapidPublicKey = '';
let vapidPrivateKey = '';

export function ensureVapidKeys(): void {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  } else {
    console.warn('VAPID keys not set in env — generating new keys for this session.');
    const keys = webpush.generateVAPIDKeys();
    vapidPublicKey = keys.publicKey;
    vapidPrivateKey = keys.privateKey;
    console.log('VAPID_PUBLIC_KEY:', vapidPublicKey);
    console.log('VAPID_PRIVATE_KEY:', vapidPrivateKey);
    console.log('Add these to your .env file to persist them across restarts.');
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL || 'admin@pwa-explorer.example.com'}`,
    vapidPublicKey,
    vapidPrivateKey,
  );
}

export function getVapidPublicKey(): string {
  return vapidPublicKey;
}
