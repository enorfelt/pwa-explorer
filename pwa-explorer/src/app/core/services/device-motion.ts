import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DeviceOrientation {
  alpha: number | null; // compass 0-360
  beta: number | null;  // front-back tilt -180 to 180
  gamma: number | null; // left-right tilt -90 to 90
  absolute: boolean;
}

export interface DeviceAcceleration {
  x: number | null;
  y: number | null;
  z: number | null;
}

export interface DeviceMotionData {
  acceleration: DeviceAcceleration;
  accelerationIncludingGravity: DeviceAcceleration;
  rotationRate: { alpha: number | null; beta: number | null; gamma: number | null };
  interval: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeviceMotion {
  get isSensorSupported(): boolean {
    return 'DeviceOrientationEvent' in window;
  }

  async requestPermission(): Promise<'granted' | 'denied' | 'not-required'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      const result = await DOE.requestPermission();
      return result === 'granted' ? 'granted' : 'denied';
    }
    return 'not-required';
  }

  orientation$(): Observable<DeviceOrientation> {
    return new Observable(observer => {
      const handler = (e: DeviceOrientationEvent) => {
        observer.next({
          alpha: e.alpha,
          beta: e.beta,
          gamma: e.gamma,
          absolute: e.absolute,
        });
      };
      window.addEventListener('deviceorientation', handler);
      return () => window.removeEventListener('deviceorientation', handler);
    });
  }

  motion$(): Observable<DeviceMotionData> {
    return new Observable(observer => {
      const handler = (e: DeviceMotionEvent) => {
        observer.next({
          acceleration: {
            x: e.acceleration?.x ?? null,
            y: e.acceleration?.y ?? null,
            z: e.acceleration?.z ?? null,
          },
          accelerationIncludingGravity: {
            x: e.accelerationIncludingGravity?.x ?? null,
            y: e.accelerationIncludingGravity?.y ?? null,
            z: e.accelerationIncludingGravity?.z ?? null,
          },
          rotationRate: {
            alpha: e.rotationRate?.alpha ?? null,
            beta: e.rotationRate?.beta ?? null,
            gamma: e.rotationRate?.gamma ?? null,
          },
          interval: e.interval,
        });
      };
      window.addEventListener('devicemotion', handler);
      return () => window.removeEventListener('devicemotion', handler);
    });
  }
}

