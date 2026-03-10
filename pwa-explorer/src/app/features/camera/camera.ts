import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    inject,
    signal,
    viewChild
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Camera as CameraService } from '../../core/services/camera';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-camera',
  imports: [MatButton, MatIconButton, MatIcon, MatProgressSpinner, SupportBadge],
  templateUrl: './camera.html',
  styleUrl: './camera.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Camera implements OnDestroy {
  private readonly cameraService = inject(CameraService);

  protected readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  protected readonly isSupported = this.cameraService.isSupported;
  protected readonly isStreaming = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly facingMode = signal<'user' | 'environment'>('environment');
  protected readonly capturedPhotos = signal<string[]>([]);
  protected readonly error = signal<string | null>(null);

  ngOnDestroy(): void {
    this.cameraService.stop();
  }

  protected async startCamera(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const stream = await this.cameraService.start(this.facingMode());
      const video = this.videoRef()?.nativeElement;
      if (video) {
        video.srcObject = stream;
        await video.play();
        this.isStreaming.set(true);
      }
    } catch (e) {
      this.error.set((e as Error).message ?? 'Camera access denied');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async stopCamera(): Promise<void> {
    await this.cameraService.stop();
    this.isStreaming.set(false);
    const video = this.videoRef()?.nativeElement;
    if (video) video.srcObject = null;
  }

  protected async toggleCamera(): Promise<void> {
    this.facingMode.update(m => (m === 'user' ? 'environment' : 'user'));
    if (this.isStreaming()) {
      await this.startCamera();
    }
  }

  protected capturePhoto(): void {
    const video = this.videoRef()?.nativeElement;
    if (!video) return;
    const dataUrl = this.cameraService.capturePhoto(video);
    this.capturedPhotos.update(photos => [dataUrl, ...photos].slice(0, 10));
  }

  protected removePhoto(index: number): void {
    this.capturedPhotos.update(photos => photos.filter((_, i) => i !== index));
  }
}

