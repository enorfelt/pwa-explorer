import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InstallBanner } from './shared/components/install-banner/install-banner';
import { UpdatePrompt } from './shared/components/update-prompt/update-prompt';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  exact: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbar, MatIcon, InstallBanner, UpdatePrompt],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly navItems: NavItem[] = [
    { path: '/', icon: 'home', label: 'Home', exact: true },
    { path: '/camera', icon: 'camera_alt', label: 'Camera', exact: false },
    { path: '/location', icon: 'location_on', label: 'Location', exact: false },
    { path: '/notifications', icon: 'notifications', label: 'Notify', exact: false },
    { path: '/compare', icon: 'compare', label: 'Compare', exact: false },
  ];
}
