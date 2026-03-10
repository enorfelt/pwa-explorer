import { Injectable } from '@angular/core';

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

@Injectable({
  providedIn: 'root',
})
export class Share {
  get isSupported(): boolean {
    return 'share' in navigator;
  }

  canShare(data: ShareData): boolean {
    return 'canShare' in navigator && navigator.canShare(data);
  }

  async share(data: ShareData): Promise<void> {
    await navigator.share(data);
  }
}

