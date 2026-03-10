import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type NotificationPermission = 'granted' | 'denied' | 'default';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);

  readonly permission = signal<NotificationPermission>(
    ('Notification' in window ? Notification.permission : 'denied') as NotificationPermission,
  );
  readonly isSubscribed = signal(false);

  get isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    this.permission.set(result as NotificationPermission);
    return result as NotificationPermission;
  }

  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.isSupported) return null;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as unknown as ArrayBuffer,
    });
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/subscribe`, sub.toJSON()),
    );
    this.isSubscribed.set(true);
    return sub;
  }

  async unsubscribe(): Promise<void> {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/subscribe`, { body: sub.toJSON() }),
      );
      await sub.unsubscribe();
    }
    this.isSubscribed.set(false);
  }

  async sendTestNotification(): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/send-notification`, {
        title: 'PWA Explorer',
        body: 'Test push notification from your PWA! 🚀',
        icon: '/icons/icon-192x192.png',
        url: '/',
      }),
    );
  }

  async getSubscriptionStatus(): Promise<void> {
    if (!this.isSupported) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    this.isSubscribed.set(!!sub);
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }
}

