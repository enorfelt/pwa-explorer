import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BluetoothService } from '../../core/services/bluetooth';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-bluetooth',
  imports: [MatButton, MatIcon, SupportBadge],
  templateUrl: './bluetooth.html',
  styleUrl: './bluetooth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bluetooth {
  private readonly bluetoothService = inject(BluetoothService);

  protected readonly isSupported = this.bluetoothService.isSupported;
  protected readonly device = signal<any | null>(null);
  protected readonly server = signal<any | null>(null);
  protected readonly batteryLevel = signal<number | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly connecting = signal(false);

  protected async scan(): Promise<void> {
    try {
      this.status.set('Scanning for devices…');
      const d = await this.bluetoothService.requestDevice();
      this.device.set(d);
      this.server.set(null);
      this.batteryLevel.set(null);
      this.status.set(`Found: ${d.name ?? 'Unknown device'}`);
    } catch (e) {
      if ((e as DOMException).name !== 'NotFoundError') {
        this.status.set(`Error: ${(e as Error).message}`);
      } else {
        this.status.set('Scan cancelled.');
      }
    }
  }

  protected async connect(): Promise<void> {
    const d = this.device();
    if (!d) return;
    this.connecting.set(true);
    try {
      const srv = await this.bluetoothService.connect(d);
      this.server.set(srv);
      this.status.set('Connected.');
    } catch (e) {
      this.status.set(`Connect error: ${(e as Error).message}`);
    } finally {
      this.connecting.set(false);
    }
  }

  protected disconnect(): void {
    const d = this.device();
    if (!d) return;
    this.bluetoothService.disconnect(d);
    this.server.set(null);
    this.batteryLevel.set(null);
    this.status.set('Disconnected.');
  }

  protected async readBattery(): Promise<void> {
    const srv = this.server();
    if (!srv) return;
    try {
      const level = await this.bluetoothService.readBatteryLevel(srv);
      this.batteryLevel.set(level);
      this.status.set(`Battery level: ${level}%`);
    } catch (e) {
      this.status.set(`Battery read error: ${(e as Error).message}`);
    }
  }
}
