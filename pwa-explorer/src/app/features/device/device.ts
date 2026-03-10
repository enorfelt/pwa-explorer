import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Vibration, VIBRATION_PATTERNS } from '../../core/services/vibration';
import { WakeLock } from '../../core/services/wake-lock';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';
import { SupportLevel } from '../../shared/models/capability.model';

@Component({
  selector: 'app-device',
  imports: [MatButton, MatIcon, SupportBadge],
  templateUrl: './device.html',
  styleUrl: './device.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Device {
  private readonly vibration = inject(Vibration);
  private readonly wakeLock = inject(WakeLock);

  protected readonly vibrationSupported: SupportLevel = this.vibration.isSupported ? 'supported' : 'unsupported';
  protected readonly wakeLockSupported: SupportLevel = this.wakeLock.isSupported ? 'supported' : 'unsupported';
  protected readonly wakeLockActive = this.wakeLock.isActive;
  protected readonly vibrationStatus = signal<string | null>(null);
  protected readonly wakeLockStatus = signal<string | null>(null);

  protected readonly patterns = VIBRATION_PATTERNS;
  protected readonly patternKeys = Object.keys(this.patterns) as Array<keyof typeof VIBRATION_PATTERNS>;

  protected vibrate(key: keyof typeof this.patterns): void {
    this.vibration.vibrate(this.patterns[key]);
    this.vibrationStatus.set(`Playing pattern: ${key}`);
  }

  protected stopVibration(): void {
    this.vibration.stop();
    this.vibrationStatus.set('Stopped');
  }

  protected async toggleWakeLock(): Promise<void> {
    try {
      if (this.wakeLockActive()) {
        await this.wakeLock.release();
        this.wakeLockStatus.set('Wake lock released.');
      } else {
        await this.wakeLock.request();
        this.wakeLockStatus.set('Wake lock acquired — screen will stay on.');
      }
    } catch (e) {
      this.wakeLockStatus.set(`Error: ${(e as Error).message}`);
    }
  }
}

