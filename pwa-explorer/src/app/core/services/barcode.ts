import { Injectable } from '@angular/core';

export interface BarcodeResult {
  format: string;
  rawValue: string;
  cornerPoints?: { x: number; y: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class Barcode {
  get isNativeSupported(): boolean {
    return 'BarcodeDetector' in window;
  }

  /** Detect barcodes natively from an image source */
  async detectNative(source: ImageBitmapSource): Promise<BarcodeResult[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any)['BarcodeDetector']({
      formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e'],
    });
    const results = await detector.detect(source);
    return results.map((r: { format: string; rawValue: string; cornerPoints?: { x: number; y: number }[] }) => ({
      format: r.format,
      rawValue: r.rawValue,
      cornerPoints: r.cornerPoints,
    }));
  }
}

