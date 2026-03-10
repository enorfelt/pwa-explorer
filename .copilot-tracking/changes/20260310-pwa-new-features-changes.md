<!-- markdownlint-disable-file -->

# Change Record: PWA New Feature Pages — Background Sync, Contacts, Bluetooth, NFC

## Added

- `pwa-explorer/src/app/core/services/background-sync.ts` — Injectable service wrapping the SyncManager API with `isSupported`, `register()`, and `getTags()` methods
- `pwa-explorer/src/app/core/services/background-sync.spec.ts` — Minimal `should create` spec for BackgroundSyncService
- `pwa-explorer/src/app/features/background-sync/background-sync.ts` — Standalone OnPush component for Background Sync with register/refresh tag UI
- `pwa-explorer/src/app/features/background-sync/background-sync.html` — Template with Register Tag section, Pending Tags list, and informational note about the sync event
- `pwa-explorer/src/app/features/background-sync/background-sync.scss` — Feature styles using `@use '../feature-page'` with `.tag-list`, `.tag-chip`, `.info-note`
- `pwa-explorer/src/app/features/background-sync/background-sync.spec.ts` — Minimal `should create` spec for BackgroundSync component
- `pwa-explorer/src/app/core/services/contacts.ts` — Injectable service wrapping the Contacts Picker API with `ContactInfo` interface, `isSupported`, `getProperties()`, and `select()` methods
- `pwa-explorer/src/app/core/services/contacts.spec.ts` — Minimal `should create` spec for ContactsService
- `pwa-explorer/src/app/features/contacts/contacts.ts` — Standalone OnPush component for Contacts Picker with `ngOnInit` property loading and `pickContacts()` flow
- `pwa-explorer/src/app/features/contacts/contacts.html` — Template with Available Properties chips, Pick Contacts button, and contact result cards
- `pwa-explorer/src/app/features/contacts/contacts.scss` — Feature styles with `.contact-card`, `.property-chips`, `.contact-field`
- `pwa-explorer/src/app/features/contacts/contacts.spec.ts` — Minimal `should create` spec for Contacts component
- `pwa-explorer/src/app/core/services/bluetooth.ts` — Injectable service wrapping Web Bluetooth API with `requestDevice()`, `connect()`, `disconnect()`, and `readBatteryLevel()` methods
- `pwa-explorer/src/app/core/services/bluetooth.spec.ts` — Minimal `should create` spec for BluetoothService
- `pwa-explorer/src/app/features/bluetooth/bluetooth.ts` — Standalone OnPush component with scan → connect → read battery → disconnect flow using signals
- `pwa-explorer/src/app/features/bluetooth/bluetooth.html` — Template with Device section (scan, connect/disconnect, connection indicator) and Battery section
- `pwa-explorer/src/app/features/bluetooth/bluetooth.scss` — Feature styles with `.device-card`, `.indicator`, `.battery-display` and `.connected` modifier
- `pwa-explorer/src/app/features/bluetooth/bluetooth.spec.ts` — Minimal `should create` spec for Bluetooth component
- `pwa-explorer/src/app/core/services/nfc.ts` — Injectable service wrapping NDEFReader API with `startScan()`, `stopScan()`, and `write()` methods
- `pwa-explorer/src/app/core/services/nfc.spec.ts` — Minimal `should create` spec for NfcService
- `pwa-explorer/src/app/features/nfc/nfc.ts` — Standalone OnPush component with Read (start/stop scan) and Write sections using signals
- `pwa-explorer/src/app/features/nfc/nfc.html` — Template with scan indicator with `.active` animation, tag record display, and write text input
- `pwa-explorer/src/app/features/nfc/nfc.scss` — Feature styles with `.scan-indicator`, `.tag-record`, `.record-list` and pulse animation
- `pwa-explorer/src/app/features/nfc/nfc.spec.ts` — Minimal `should create` spec for Nfc component

## Modified

- `pwa-explorer/src/app/app.routes.ts` — Added 4 lazy-loaded routes: `/background-sync`, `/contacts`, `/bluetooth`, `/nfc` before the wildcard redirect
- `pwa-explorer/src/app/core/services/capability-detection.ts` — Updated `route` for `background-sync`, `contacts`, `bluetooth`, and `nfc` capabilities from `/device` to their dedicated paths

## Removed

_(none)_

---

## Release Summary

All 4 new PWA feature pages have been implemented. Each follows the existing project patterns: `OnPush` change detection, Angular signals, standalone components, `SupportBadge` for browser support display, and `@use '../feature-page'` SCSS. The 4 new routes (`/background-sync`, `/contacts`, `/bluetooth`, `/nfc`) are registered as lazy-loaded routes, and the corresponding capability cards on the home page now link directly to these dedicated pages.

**Files added (24):**

- 4 services + 4 service specs in `core/services/`
- 4 component TypeScript files + 4 HTML templates + 4 SCSS files + 4 component specs in `features/`

**Files modified (2):**

- `app.routes.ts`
- `capability-detection.ts`
