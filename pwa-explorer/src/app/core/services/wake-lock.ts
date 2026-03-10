import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WakeLock {
  private lock: WakeLockSentinel | null = null;
  readonly isActive = signal(false);

  get isSupported(): boolean {
    return 'wakeLock' in navigator;
  }

  async request(): Promise<void> {
    this.lock = await navigator.wakeLock.request('screen');
    this.isActive.set(true);
    this.lock.addEventListener('release', () => {
      this.isActive.set(false);
      this.lock = null;
    });
  }

  async release(): Promise<void> {
    if (this.lock) {
      await this.lock.release();
    }
  }
}

