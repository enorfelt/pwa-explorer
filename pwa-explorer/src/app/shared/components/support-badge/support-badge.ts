import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SupportLevel } from '../../models/capability.model';

@Component({
  selector: 'app-support-badge',
  imports: [],
  templateUrl: './support-badge.html',
  styleUrl: './support-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportBadge {
  readonly level = input.required<SupportLevel>();

  readonly label = computed(() => {
    switch (this.level()) {
      case 'supported':
        return 'Supported';
      case 'partial':
        return 'Partial';
      case 'unsupported':
        return 'Not Supported';
      case 'unknown':
        return 'Unknown';
    }
  });

  readonly cssClass = computed(() => `badge badge--${this.level()}`);
}
