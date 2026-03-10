import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'camera',
    loadComponent: () => import('./features/camera/camera').then(m => m.Camera),
  },
  {
    path: 'location',
    loadComponent: () => import('./features/location/location').then(m => m.Location),
  },
  {
    path: 'barcode',
    loadComponent: () => import('./features/barcode/barcode').then(m => m.Barcode),
  },
  {
    path: 'files',
    loadComponent: () => import('./features/files/files').then(m => m.Files),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notifications').then(m => m.Notifications),
  },
  {
    path: 'sensors',
    loadComponent: () => import('./features/sensors/sensors').then(m => m.Sensors),
  },
  {
    path: 'share',
    loadComponent: () => import('./features/share/share').then(m => m.Share),
  },
  {
    path: 'clipboard',
    loadComponent: () => import('./features/clipboard/clipboard').then(m => m.Clipboard),
  },
  {
    path: 'device',
    loadComponent: () => import('./features/device/device').then(m => m.Device),
  },
  {
    path: 'compare',
    loadComponent: () => import('./features/compare/compare').then(m => m.Compare),
  },
  { path: '**', redirectTo: '' },
];
