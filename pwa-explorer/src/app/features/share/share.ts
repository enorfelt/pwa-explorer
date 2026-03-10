import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Share as ShareService } from '../../core/services/share';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-share',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatInput, MatIcon, SupportBadge],
  templateUrl: './share.html',
  styleUrl: './share.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Share {
  private readonly shareService = inject(ShareService);

  protected readonly isSupported = this.shareService.isSupported;
  protected readonly lastResult = signal<string | null>(null);
  protected title = 'PWA Explorer';
  protected text = 'Check out this PWA capabilities demo!';
  protected url = 'https://pwa-explorer.vercel.app';

  protected async share(): Promise<void> {
    try {
      await this.shareService.share({ title: this.title, text: this.text, url: this.url });
      this.lastResult.set('Shared successfully!');
    } catch (e) {
      if ((e as DOMException).name !== 'AbortError') {
        this.lastResult.set(`Error: ${(e as Error).message}`);
      }
    }
  }
}

