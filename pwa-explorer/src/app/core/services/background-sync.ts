import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackgroundSyncService {
  get isSupported(): boolean {
    return 'serviceWorker' in navigator && 'SyncManager' in window;
  }

  async register(tag: string): Promise<void> {
    ((await navigator.serviceWorker.ready) as any).sync.register(tag);
  }

  async getTags(): Promise<string[]> {
    return ((await navigator.serviceWorker.ready) as any).sync.getTags();
  }
}
