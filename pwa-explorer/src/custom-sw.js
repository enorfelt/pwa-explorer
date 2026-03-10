// Custom service worker additions — merged with Angular's ngsw-worker.js at build time.
// This file handles push events and notification clicks.

/* global self, clients */

self.addEventListener('push', event => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'PWA Explorer', body: event.data.text(), url: '/' };
  }

  const { title = 'PWA Explorer', body = '', icon = '/icons/icon-192x192.png', badge = '/icons/icon-72x72.png', url = '/' } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: { url },
      vibrate: [100, 50, 100],
      actions: [{ action: 'open', title: 'Open App' }],
    }),
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
