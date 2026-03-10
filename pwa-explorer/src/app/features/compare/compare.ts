import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CapabilityDetection } from '../../core/services/capability-detection';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';
import { SupportLevel } from '../../shared/models/capability.model';

interface CompareRow {
  feature: string;
  pwa: SupportLevel;
  native: SupportLevel;
  notes: string;
}

@Component({
  selector: 'app-compare',
  imports: [SupportBadge],
  templateUrl: './compare.html',
  styleUrl: './compare.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Compare {
  private readonly capDetection = inject(CapabilityDetection);

  protected readonly capabilities = this.capDetection.capabilities;
  protected readonly supportedCount = this.capDetection.supportedCount;
  protected readonly totalCount = this.capDetection.totalCount;

  protected readonly rows: CompareRow[] = [
    { feature: 'Camera Access', pwa: 'supported', native: 'supported', notes: 'Both support front/back camera. PWA via getUserMedia.' },
    { feature: 'Geolocation', pwa: 'supported', native: 'supported', notes: 'Both GPS + network. PWA slightly slower first fix.' },
    { feature: 'Push Notifications', pwa: 'partial', native: 'supported', notes: 'PWA push requires browser-level permission. iOS added in Safari 16.4.' },
    { feature: 'Background Sync', pwa: 'partial', native: 'supported', notes: 'Background Sync API limited on iOS. Natives have full background execution.' },
    { feature: 'Offline Storage', pwa: 'supported', native: 'supported', notes: 'PWA: IndexedDB + OPFS + Cache API. Native: SQLite / app storage.' },
    { feature: 'Barcode Scanning', pwa: 'partial', native: 'supported', notes: 'BarcodeDetector API (Chrome/Edge). Fallback: html5-qrcode via camera.' },
    { feature: 'Device Sensors', pwa: 'partial', native: 'supported', notes: 'DeviceMotion/Orientation. iOS requires user permission request.' },
    { feature: 'File System', pwa: 'partial', native: 'supported', notes: 'File System Access API (no Safari). OPFS for sandboxed storage.' },
    { feature: 'Web Share', pwa: 'partial', native: 'supported', notes: 'Web Share API works on mobile browsers. Desktop Chrome/Edge too.' },
    { feature: 'Clipboard', pwa: 'partial', native: 'supported', notes: 'Clipboard API needs HTTPS. Read requires user gesture/permission.' },
    { feature: 'Vibration', pwa: 'partial', native: 'supported', notes: 'Vibration API: Android Chrome/Firefox. Not supported on iOS.' },
    { feature: 'Screen Wake Lock', pwa: 'partial', native: 'supported', notes: 'Wake Lock API: Chrome/Edge. No Safari support.' },
    { feature: 'Bluetooth', pwa: 'partial', native: 'supported', notes: 'Web Bluetooth: Chrome/Edge only. No Firefox or Safari.' },
    { feature: 'NFC', pwa: 'partial', native: 'supported', notes: 'Web NFC: Chrome Android only. Very limited coverage.' },
    { feature: 'Contacts Picker', pwa: 'partial', native: 'supported', notes: 'Contact Picker API: Chrome Android + Safari iOS 14+.' },
    { feature: 'App Install', pwa: 'partial', native: 'supported', notes: 'A2HS on Android. iOS users must use Share → Add to Home Screen.' },
    { feature: 'Background Processing', pwa: 'unsupported', native: 'supported', notes: 'Limited to Web Workers; no true background execution in PWA.' },
    { feature: 'Custom App Icons', pwa: 'partial', native: 'supported', notes: 'Dynamic icons not possible in PWAs. Static manifest icons only.' },
  ];
}

