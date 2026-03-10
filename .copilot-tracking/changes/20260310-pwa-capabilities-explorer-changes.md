# Changes: PWA Capabilities Explorer App

## Implementation Date: 2026-03-10

## Added

### Project Root (`pwa-explorer/`)
- `README.md` — Updated with project docs, setup instructions, Vercel deployment guide
- `vercel.json` — Vercel deployment config (SPA rewrites, API routes, env vars)
- `angular.json` — Updated: Leaflet CSS, html5-qrcode scripts, budget limits
- `ngsw-config.json` — Angular service worker config (PWA caching)

### Frontend (`pwa-explorer/src/`)
- `src/main.ts` — App bootstrap
- `src/styles.scss` — Global styles with Angular Material theme
- `src/index.html` — Updated with theme-color meta tag
- `src/custom-sw.js` — Custom push event + notificationclick handler
- `src/environments/environment.ts` — Dev environment (apiUrl, vapidPublicKey)
- `src/environments/environment.prod.ts` — Prod environment
- `src/app/app.ts` — App shell with toolbar + bottom nav (signals, RouterLink)
- `src/app/app.html` — App shell template
- `src/app/app.scss` — Mobile-first layout (fixed bottom nav, safe-area-inset)
- `src/app/app.routes.ts` — Lazy-loaded routes for all 11 feature pages
- `src/app/app.config.ts` — provideRouter, provideAnimationsAsync, provideHttpClient, provideServiceWorker
- `src/app/shared/models/capability.model.ts` — Capability, SupportLevel, CapabilityCategory interfaces
- `src/app/features/_feature-page.scss` — Shared feature page styles partial

### Core Services (`src/app/core/services/`)
- `capability-detection.ts` — 15 capabilities across 4 categories, computed selectors
- `pwa-install.ts` — BeforeInstallPromptEvent handler, canInstall signal, iOS detection
- `camera.ts` — getUserMedia wrapper, photo capture, front/back toggle
- `geolocation.ts` — getCurrentPosition/watchPosition Observables
- `barcode.ts` — BarcodeDetector native API wrapper
- `device-motion.ts` — DeviceOrientation/Motion Observables with iOS permission
- `file-system.ts` — File System Access API + OPFS + storage estimate
- `share.ts` — Web Share API wrapper
- `clipboard.ts` — Clipboard read/write/image API
- `vibration.ts` — Vibration preset patterns + custom; VIBRATION_PATTERNS const
- `wake-lock.ts` — Screen Wake Lock API with isActive signal
- `notification.ts` — Push subscription, VAPID, HTTP backend integration

### Shared Components (`src/app/shared/components/`)
- `support-badge/` (ts, html, scss) — SupportLevel visual badge
- `capability-card/` (ts, html, scss) — Capability card with RouterLink
- `install-banner/` (ts, html, scss) — PWA install prompt + iOS hint

### Feature Components (`src/app/features/`)
- `home/` (ts, html, scss) — Dashboard grouped by category
- `camera/` (ts, html, scss) — Camera demo with photo gallery
- `location/` (ts, html, scss) — Geolocation with Leaflet map
- `barcode/` (ts, html, scss) — html5-qrcode scanner
- `sensors/` (ts, html, scss) — Orientation/motion compass visualization
- `files/` (ts, html, scss) — FSA + OPFS + storage quota demo
- `share/` (ts, html, scss) — Web Share API form
- `clipboard/` (ts, html, scss) — Clipboard read/write demo
- `device/` (ts, html, scss) — Vibration patterns + Wake Lock toggle
- `notifications/` (ts, html, scss) — Push subscribe/unsubscribe + test send
- `compare/` (ts, html, scss) — 18-row PWA vs Native capability matrix

### Push Backend (`pwa-explorer/server/`)
- `package.json` — Express, web-push, CORS, dotenv dependencies
- `tsconfig.json` — TypeScript config for Node.js
- `src/index.ts` — Express server entry point
- `src/vapid.ts` — VAPID key management (env or auto-generate)
- `src/push.controller.ts` — subscribe, unsubscribe, send-notification endpoints
- `.env.example` — Environment variable template

### Vercel Serverless Functions (`pwa-explorer/api/`)
- `vapid-public-key.ts` — GET /api/vapid-public-key
- `subscribe.ts` — POST/DELETE /api/subscribe
- `send-notification.ts` — POST /api/send-notification

## Modified

- `public/manifest.webmanifest` — Updated name to "PWA Explorer"
- `angular.json` — Added Leaflet CSS, html5-qrcode scripts, updated budget limits

## Notes

- Angular CLI 21.2.1 used (not v19 as originally planned — v21 is latest)
- Angular 21 conventions: no `standalone: true`, no class suffixes, `inject()` preferred
- Build passes cleanly: `npx ng build` — 0 errors, 1 warning (from html5-qrcode library, not our code)
- Task 7.2 (mobile verification) requires actual Vercel deployment with VAPID keys
- `src/custom-sw.js` registers push/notificationclick handlers; complementary to NGSW
