import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Capability } from '../../models/capability.model';
import { SupportBadge } from '../support-badge/support-badge';

@Component({
  selector: 'app-capability-card',
  imports: [RouterLink, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatIcon, SupportBadge],
  templateUrl: './capability-card.html',
  styleUrl: './capability-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapabilityCard {
  readonly capability = input.required<Capability>();
}
