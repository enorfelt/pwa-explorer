import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { BackgroundSyncService } from '../../core/services/background-sync';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-background-sync',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatInput, MatIcon, SupportBadge],
  templateUrl: './background-sync.html',
  styleUrl: './background-sync.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundSync {
  private readonly backgroundSyncService = inject(BackgroundSyncService);

  protected readonly isSupported = this.backgroundSyncService.isSupported;
  protected readonly status = signal<string | null>(null);
  protected readonly pendingTags = signal<string[]>([]);
  protected tagName = 'pwa-explorer-sync';

  protected async register(): Promise<void> {
    try {
      await this.backgroundSyncService.register(this.tagName);
      this.status.set(`Tag "${this.tagName}" registered.`);
    } catch (e) {
      this.status.set(`Error: ${(e as Error).message}`);
    }
  }

  protected async loadTags(): Promise<void> {
    try {
      const tags = await this.backgroundSyncService.getTags();
      this.pendingTags.set(tags);
      this.status.set(`Loaded ${tags.length} pending tag(s).`);
    } catch (e) {
      this.status.set(`Error: ${(e as Error).message}`);
    }
  }
}
