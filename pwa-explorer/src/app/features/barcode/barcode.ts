import {
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy,
    inject,
    signal
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

declare class Html5QrcodeScanner {
  constructor(
    elementId: string,
    config: object,
    verbose: boolean,
  );
  render(
    onSuccess: (decodedText: string, result: { result: { format: { formatName: string } } }) => void,
    onError: (error: string) => void,
  ): void;
  clear(): Promise<void>;
}

export interface ScanResult {
  text: string;
  format: string;
  timestamp: Date;
}

@Component({
  selector: 'app-barcode',
  imports: [MatButton, MatIcon, MatList, MatListItem, SupportBadge],
  templateUrl: './barcode.html',
  styleUrl: './barcode.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Barcode implements OnDestroy {
  private readonly zone = inject(NgZone);
  private scanner?: Html5QrcodeScanner;

  protected readonly isScanning = signal(false);
  protected readonly isNativeSupported = signal('BarcodeDetector' in window);
  protected readonly results = signal<ScanResult[]>([]);
  protected readonly error = signal<string | null>(null);

  ngOnDestroy(): void {
    this.stopScanner();
  }

  protected startScanner(): void {
    this.error.set(null);
    this.isScanning.set(true);

    setTimeout(() => {
      try {
        this.scanner = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          false,
        );
        this.scanner.render(
          (decodedText, result) => {
            this.zone.run(() => {
              this.results.update(r => [
                {text: decodedText, format: result?.result?.format?.formatName ?? 'Unknown', timestamp: new Date()},
                ...r,
              ].slice(0, 20));
            });
          },
          () => { /* ignore scan errors */ },
        );
      } catch (e) {
        this.zone.run(() => {
          this.error.set((e as Error).message);
          this.isScanning.set(false);
        });
      }
    }, 100);
  }

  protected stopScanner(): void {
    this.scanner?.clear().catch(() => undefined);
    this.isScanning.set(false);
  }

  protected clearResults(): void {
    this.results.set([]);
  }
}

