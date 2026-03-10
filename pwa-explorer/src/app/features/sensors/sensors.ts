import {
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy,
    inject,
    signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DeviceMotion, DeviceMotionData, DeviceOrientation } from '../../core/services/device-motion';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-sensors',
  imports: [MatButton, MatIcon, SupportBadge],
  templateUrl: './sensors.html',
  styleUrl: './sensors.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sensors implements OnDestroy {
  private readonly sensorService = inject(DeviceMotion);
  private readonly zone = inject(NgZone);
  private orientationSub?: Subscription;
  private motionSub?: Subscription;

  protected readonly isSupported = this.sensorService.isSensorSupported;
  protected readonly isActive = signal(false);
  protected readonly permissionError = signal<string | null>(null);
  protected readonly orientation = signal<DeviceOrientation | null>(null);
  protected readonly motion = signal<DeviceMotionData | null>(null);

  ngOnDestroy(): void {
    this.stopSensors();
  }

  protected async startSensors(): Promise<void> {
    this.permissionError.set(null);
    const perm = await this.sensorService.requestPermission();
    if (perm === 'denied') {
      this.permissionError.set('Permission denied. Re-open the page to try again.');
      return;
    }
    this.isActive.set(true);
    this.orientationSub = this.sensorService.orientation$().subscribe(o =>
      this.zone.run(() => this.orientation.set(o)),
    );
    this.motionSub = this.sensorService.motion$().subscribe(m =>
      this.zone.run(() => this.motion.set(m)),
    );
  }

  protected stopSensors(): void {
    this.orientationSub?.unsubscribe();
    this.motionSub?.unsubscribe();
    this.isActive.set(false);
  }

  protected compassDeg(): number {
    return this.orientation()?.alpha ?? 0;
  }
}

