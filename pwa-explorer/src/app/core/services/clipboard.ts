import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Clipboard {
  get isSupported(): boolean {
    return 'clipboard' in navigator;
  }

  async writeText(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  }

  async readText(): Promise<string> {
    return navigator.clipboard.readText();
  }

  async writeImage(imageDataUrl: string): Promise<void> {
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  }
}

