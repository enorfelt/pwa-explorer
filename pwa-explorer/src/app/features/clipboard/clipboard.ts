import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Clipboard as ClipboardService } from '../../core/services/clipboard';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-clipboard',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatInput, MatIcon, SupportBadge],
  templateUrl: './clipboard.html',
  styleUrl: './clipboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clipboard {
  private readonly clipboardService = inject(ClipboardService);

  protected readonly isSupported = this.clipboardService.isSupported;
  protected readonly message = signal<string | null>(null);
  protected writeText = 'Hello from PWA Explorer!';
  protected pastedText = signal<string | null>(null);

  protected async copy(): Promise<void> {
    try {
      await this.clipboardService.writeText(this.writeText);
      this.message.set('Copied to clipboard!');
    } catch (e) {
      this.message.set(`Copy failed: ${(e as Error).message}`);
    }
  }

  protected async paste(): Promise<void> {
    try {
      const text = await this.clipboardService.readText();
      this.pastedText.set(text);
    } catch (e) {
      this.message.set(`Paste failed: ${(e as Error).message}`);
    }
  }
}

