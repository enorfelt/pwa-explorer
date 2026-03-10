import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FileSystem } from '../../core/services/file-system';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-files',
  imports: [MatButton, MatIcon, MatProgressBar, SupportBadge],
  templateUrl: './files.html',
  styleUrl: './files.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Files {
  private readonly fsService = inject(FileSystem);

  protected readonly isFileSystemAccessSupported = this.fsService.isFileSystemAccessSupported;
  protected readonly fileContent = signal<{ name: string; content: string; type: string } | null>(null);
  protected readonly storageEstimate = signal<{ usage: number; quota: number; usagePercent: number } | null>(null);
  protected readonly opfsContent = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly opfsMessage = signal<string | null>(null);

  constructor() {
    this.loadStorageEstimate();
  }

  protected async openFile(): Promise<void> {
    this.error.set(null);
    this.isLoading.set(true);
    try {
      const result = this.isFileSystemAccessSupported
        ? await this.fsService.openFile()
        : await this.fsService.readFileViaInput();
      this.fileContent.set(result);
    } catch (e) {
      if ((e as DOMException).name !== 'AbortError') {
        this.error.set((e as Error).message);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async saveFile(): Promise<void> {
    const content = this.fileContent()?.content ?? 'Hello from PWA Explorer!';
    try {
      await this.fsService.saveFile(content, 'pwa-example.txt');
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }

  protected async writeOpfs(): Promise<void> {
    try {
      await this.fsService.writeToOpfs('pwa-demo.txt', `Written at ${new Date().toISOString()}`);
      this.opfsMessage.set('Written to OPFS successfully!');
    } catch (e) {
      this.opfsMessage.set(`OPFS write failed: ${(e as Error).message}`);
    }
  }

  protected async readOpfs(): Promise<void> {
    const content = await this.fsService.readFromOpfs('pwa-demo.txt');
    this.opfsContent.set(content ?? '(file not found)');
  }

  protected formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  private async loadStorageEstimate(): Promise<void> {
    const estimate = await this.fsService.getStorageEstimate();
    this.storageEstimate.set(estimate);
  }
}

