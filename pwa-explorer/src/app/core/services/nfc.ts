import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NfcService {
  private reader: any = null;

  get isSupported(): boolean {
    return 'NDEFReader' in window;
  }

  async startScan(onReading: (event: any) => void): Promise<void> {
    const reader = new (window as any).NDEFReader();
    reader.onreading = onReading;
    await reader.scan();
    this.reader = reader;
  }

  stopScan(): void {
    this.reader = null;
  }

  async write(text: string): Promise<void> {
    const writer = new (window as any).NDEFReader();
    await writer.write({ records: [{ recordType: 'text', data: text }] });
  }
}
