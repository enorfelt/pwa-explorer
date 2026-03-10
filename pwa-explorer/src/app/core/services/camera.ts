import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Camera {
  private stream: MediaStream | null = null;

  async start(facingMode: 'user' | 'environment' = 'environment'): Promise<MediaStream> {
    await this.stop();
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    return this.stream;
  }

  async stop(): Promise<void> {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  capturePhoto(videoEl: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');
    ctx.drawImage(videoEl, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  async listCameras(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(d => d.kind === 'videoinput');
  }

  get isSupported(): boolean {
    return 'mediaDevices' in navigator && typeof navigator.mediaDevices.getUserMedia === 'function';
  }
}

