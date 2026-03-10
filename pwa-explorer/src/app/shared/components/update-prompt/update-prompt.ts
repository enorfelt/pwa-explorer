import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-update-prompt',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePrompt implements OnInit {
  private readonly swUpdate = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(filter(e => e.type === 'VERSION_READY'))
      .subscribe(() => {
        const snack = this.snackBar.open('A new version is available', 'Update', {
          duration: 0,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        snack.onAction().subscribe(async () => {
          await this.swUpdate.activateUpdate();
          window.location.reload();
        });
      });
  }
}
