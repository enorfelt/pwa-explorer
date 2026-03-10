import { Injectable } from '@angular/core';

export const VIBRATION_PATTERNS = {
  short: [100],
  medium: [300],
  long: [600],
  double: [100, 100, 100],
  sos: [100, 100, 100, 200, 400, 200, 100, 100, 100],
  heartbeat: [100, 100, 200, 500],
} as const;

@Injectable({
  providedIn: 'root',
})
export class Vibration {
  get isSupported(): boolean {
    return 'vibrate' in navigator;
  }

  vibrate(pattern: number | readonly number[]): boolean {
    return navigator.vibrate(typeof pattern === 'number' ? pattern : Array.from(pattern));
  }

  stop(): void {
    navigator.vibrate(0);
  }
}

