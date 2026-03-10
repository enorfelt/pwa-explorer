import { Injectable, computed, signal } from '@angular/core';
import { Capability, CapabilityCategory, SupportLevel } from '../../shared/models/capability.model';

@Injectable({
  providedIn: 'root',
})
export class CapabilityDetection {
  private readonly _capabilities = signal<Capability[]>([]);

  readonly capabilities = this._capabilities.asReadonly();

  readonly mediaCapabilities = computed(() =>
    this._capabilities().filter(c => c.category === 'media'),
  );
  readonly systemCapabilities = computed(() =>
    this._capabilities().filter(c => c.category === 'system'),
  );
  readonly communicationCapabilities = computed(() =>
    this._capabilities().filter(c => c.category === 'communication'),
  );
  readonly deviceCapabilities = computed(() =>
    this._capabilities().filter(c => c.category === 'device'),
  );

  readonly supportedCount = computed(
    () => this._capabilities().filter(c => c.supportLevel === 'supported').length,
  );
  readonly totalCount = computed(() => this._capabilities().length);

  constructor() {
    this._capabilities.set(this.buildCapabilities());
  }

  private buildCapabilities(): Capability[] {
    return [
      // Media & Sensors
      {
        id: 'camera',
        name: 'Camera & Media',
        description: 'Capture photos and video using device camera',
        icon: 'camera_alt',
        route: '/camera',
        category: 'media' as CapabilityCategory,
        supportLevel: this.check(
          () => 'mediaDevices' in navigator && typeof navigator.mediaDevices.getUserMedia === 'function',
        ),
      },
      {
        id: 'location',
        name: 'Geolocation',
        description: 'Read GPS/network position with continuous tracking',
        icon: 'location_on',
        route: '/location',
        category: 'media' as CapabilityCategory,
        supportLevel: this.check(() => 'geolocation' in navigator),
      },
      {
        id: 'barcode',
        name: 'Barcode Scanner',
        description: 'Scan QR codes and barcodes via camera',
        icon: 'qr_code_scanner',
        route: '/barcode',
        category: 'media' as CapabilityCategory,
        supportLevel: this.check(
          () => 'BarcodeDetector' in window,
          () => true, // html5-qrcode library fallback always available
        ),
      },
      {
        id: 'sensors',
        name: 'Device Sensors',
        description: 'Read orientation, compass, tilt, and acceleration data',
        icon: 'sensors',
        route: '/sensors',
        category: 'media' as CapabilityCategory,
        supportLevel: this.check(() => 'DeviceOrientationEvent' in window),
      },
      // System Integration
      {
        id: 'files',
        name: 'File System',
        description: 'Open, read, and save files using File System Access API',
        icon: 'folder_open',
        route: '/files',
        category: 'system' as CapabilityCategory,
        supportLevel: this.check(
          () => 'showOpenFilePicker' in window,
          () => true, // input[type=file] fallback
        ),
      },
      {
        id: 'share',
        name: 'Web Share',
        description: 'Share content using native OS share sheet',
        icon: 'share',
        route: '/share',
        category: 'system' as CapabilityCategory,
        supportLevel: this.check(() => 'share' in navigator),
      },
      {
        id: 'clipboard',
        name: 'Clipboard',
        description: 'Read and write text and images to clipboard',
        icon: 'content_paste',
        route: '/clipboard',
        category: 'system' as CapabilityCategory,
        supportLevel: this.check(() => 'clipboard' in navigator),
      },
      {
        id: 'storage',
        name: 'Storage Manager',
        description: 'Check persistent storage quota and OPFS access',
        icon: 'storage',
        route: '/files',
        category: 'system' as CapabilityCategory,
        supportLevel: this.check(() => 'storage' in navigator && 'estimate' in navigator.storage),
      },
      // Communication
      {
        id: 'notifications',
        name: 'Push Notifications',
        description: 'Subscribe and receive server-sent push notifications',
        icon: 'notifications_active',
        route: '/notifications',
        category: 'communication' as CapabilityCategory,
        supportLevel: this.check(
          () => 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window,
        ),
      },
      {
        id: 'background-sync',
        name: 'Background Sync',
        description: 'Sync data when connectivity is restored',
        icon: 'sync',
        route: '/background-sync',
        category: 'communication' as CapabilityCategory,
        supportLevel: this.check(
          () => 'serviceWorker' in navigator && 'SyncManager' in window,
        ),
      },
      // Device Hardware
      {
        id: 'vibration',
        name: 'Vibration',
        description: 'Trigger haptic feedback with custom patterns',
        icon: 'vibration',
        route: '/device',
        category: 'device' as CapabilityCategory,
        supportLevel: this.check(() => 'vibrate' in navigator),
      },
      {
        id: 'wake-lock',
        name: 'Screen Wake Lock',
        description: 'Keep screen on while app is active',
        icon: 'screen_lock_portrait',
        route: '/device',
        category: 'device' as CapabilityCategory,
        supportLevel: this.check(() => 'wakeLock' in navigator),
      },
      {
        id: 'contacts',
        name: 'Contacts Picker',
        description: 'Select contacts from device address book',
        icon: 'contacts',
        route: '/contacts',
        category: 'device' as CapabilityCategory,
        supportLevel: this.check(
          () => 'contacts' in navigator && 'ContactsManager' in window,
        ),
      },
      {
        id: 'bluetooth',
        name: 'Web Bluetooth',
        description: 'Connect to nearby Bluetooth LE devices',
        icon: 'bluetooth',
        route: '/bluetooth',
        category: 'device' as CapabilityCategory,
        supportLevel: this.check(() => 'bluetooth' in navigator),
      },
      {
        id: 'nfc',
        name: 'Web NFC',
        description: 'Read and write NFC tags (Android Chrome only)',
        icon: 'nfc',
        route: '/nfc',
        category: 'device' as CapabilityCategory,
        supportLevel: this.check(() => 'NDEFReader' in window),
      },
    ];
  }

  private check(primary: () => boolean, fallback?: () => boolean): SupportLevel {
    try {
      if (primary()) return 'supported';
      if (fallback?.()) return 'partial';
      return 'unsupported';
    } catch {
      return 'unknown';
    }
  }
}

