import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NfcService } from '../../core/services/nfc';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-nfc',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatInput, MatIcon, SupportBadge],
  templateUrl: './nfc.html',
  styleUrl: './nfc.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nfc {
  private readonly nfcService = inject(NfcService);

  protected readonly isSupported = this.nfcService.isSupported;
  protected readonly scanning = signal(false);
  protected readonly lastTag = signal<any | null>(null);
  protected readonly status = signal<string | null>(null);
  protected writeText = '';

  protected async startScan(): Promise<void> {
    try {
      this.scanning.set(true);
      this.status.set('Scanning — bring an NFC tag close…');
      await this.nfcService.startScan((event: any) => {
        this.lastTag.set(event);
        this.status.set(`Tag read: ${event.serialNumber}`);
      });
    } catch (e) {
      this.scanning.set(false);
      this.status.set(`Scan error: ${(e as Error).message}`);
    }
  }

  protected stopScan(): void {
    this.nfcService.stopScan();
    this.scanning.set(false);
    this.status.set('Scan stopped.');
  }

  protected async writeTag(): Promise<void> {
    try {
      this.status.set('Writing — bring an NFC tag close…');
      await this.nfcService.write(this.writeText);
      this.status.set('Tag written successfully!');
    } catch (e) {
      this.status.set(`Write error: ${(e as Error).message}`);
    }
  }
}
