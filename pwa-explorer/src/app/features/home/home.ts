import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CapabilityDetection } from '../../core/services/capability-detection';
import { CapabilityCard } from '../../shared/components/capability-card/capability-card';

@Component({
  selector: 'app-home',
  imports: [CapabilityCard, MatIcon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly capSvc = inject(CapabilityDetection);

  protected readonly sections = [
    {
      title: 'Media & Sensors',
      icon: 'camera_alt',
      id: 'media-heading',
      caps: this.capSvc.mediaCapabilities,
    },
    {
      title: 'System Integration',
      icon: 'settings',
      id: 'system-heading',
      caps: this.capSvc.systemCapabilities,
    },
    {
      title: 'Communication',
      icon: 'notifications',
      id: 'comm-heading',
      caps: this.capSvc.communicationCapabilities,
    },
    {
      title: 'Device Hardware',
      icon: 'devices',
      id: 'device-heading',
      caps: this.capSvc.deviceCapabilities,
    },
  ];
}
