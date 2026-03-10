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

declare class Html5Qrcode {
  constructor(elementId: string, verbose?: boolean);
  start(
    cameraIdOrConfig: string | MediaTrackConstraints,
    configuration: { fps?: number; qrbox?: { width: number; height: number } },
    qrCodeSuccessCallback: (
      decodedText: string,
      result: { result: { format?: { formatName: string } } },
    ) => void,
    qrCodeErrorCallback?: (errorMessage: string) => void,
  ): Promise<null>;
  stop(): Promise<void>;
  clear(): void;
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
  private scanner?: Html5Qrcode;

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
      if (!this.isScanning()) return;
      try {
        this.scanner = new Html5Qrcode('qr-reader');
        this.scanner
          .start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText, result) => {
              this.zone.run(() => {
                this.results.update((r) =>
                  [
                    {
                      text: decodedText,
                      format: result?.result?.format?.formatName ?? 'Unknown',
                      timestamp: new Date(),
                    },
                    ...r,
                  ].slice(0, 20),
                );
              });
            },
            () => {
              /* ignore per-frame scan errors */
            },
          )
          .catch((e: Error) => {
            this.zone.run(() => {
              this.error.set(e.message);
              this.isScanning.set(false);
            });
          });
      } catch (e) {
        this.zone.run(() => {
          this.error.set((e as Error).message);
          this.isScanning.set(false);
        });
      }
    }, 100);
  }

  protected stopScanner(): void {
    this.isScanning.set(false);
    if (this.scanner) {
      const scanner = this.scanner;
      this.scanner = undefined;
      scanner.stop().catch(() => undefined);
    }
  }

  protected clearResults(): void {
    this.results.set([]);
  }
}

