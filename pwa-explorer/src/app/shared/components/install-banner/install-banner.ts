import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PwaInstall } from '../../../core/services/pwa-install';

@Component({
  selector: 'app-install-banner',
  imports: [MatIcon, MatIconButton],
  templateUrl: './install-banner.html',
  styleUrl: './install-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallBanner {
  protected readonly pwaInstall = inject(PwaInstall);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly isIos = signal(
    /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) && !('standalone' in window.navigator),
  );
  protected readonly showIosHint = signal(false);

  protected async install(): Promise<void> {
    const result = await this.pwaInstall.promptInstall();
    if (result === 'accepted') {
      this.snackBar.open('App installed!', 'Dismiss', { duration: 3000 });
    }
  }

  protected toggleIosHint(): void {
    this.showIosHint.update(v => !v);
  }
}
