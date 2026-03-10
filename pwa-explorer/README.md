# PWA Explorer

A comprehensive **Angular 21 PWA** that demonstrates modern browser web APIs  built to evaluate what mobile web can do compared to native apps.

## Features

| Feature | API Used | Browser Support |
|---------|----------|----------------|
| Camera | `getUserMedia` | All modern browsers |
| Geolocation | `Geolocation API` + Leaflet map | All modern browsers |
| Barcode Scanner | `BarcodeDetector` + html5-qrcode fallback | Chrome/Edge (native); all via fallback |
| File System | `File System Access API` + OPFS | Chrome/Edge; fallback for others |
| Push Notifications | `Push API` + `Notification API` | All except older iOS |
| Device Sensors | `DeviceOrientation/Motion` | Mobile browsers |
| Web Share | `Web Share API` | Mobile + desktop Chrome/Edge |
| Clipboard | `Clipboard API` | All modern browsers (HTTPS required) |
| Vibration | `Vibration API` | Android Chrome/Firefox |
| Screen Wake Lock | `Wake Lock API` | Chrome/Edge 81+ |
| Compare | Live capability detection |  |

## Tech Stack

- **Angular 21**  standalone components, signals, native control flow
- **Angular Material 21**  Material 3, Azure/Blue theme
- **@angular/pwa**  Service worker, offline support
- **html5-qrcode**  Cross-browser barcode scanning
- **Leaflet**  Interactive maps
- **Node.js + Express**  Push backend (local dev)
- **Vercel**  Serverless functions for production

## Getting Started

### Frontend

```bash
cd pwa-explorer
npm install
npm start          # dev server  http://localhost:4200
npm run build      # production build  dist/pwa-explorer/browser/
```

### Push Notification Backend (local dev)

```bash
cd pwa-explorer/server
npm install
cp .env.example .env
# First run prints generated VAPID keys  copy to .env then restart
npm run dev        # Express server  http://localhost:3000
```

## Deployment to Vercel

1. Push to GitHub.
2. Import in vercel.com.
3. Set env vars: `VAPID_EMAIL`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`.
4. Update `src/environments/environment.prod.ts` with your VAPID public key.
5. Deploy  Vercel routes `/api/*` to serverless functions.

## Project Structure

```
pwa-explorer/
 src/app/
    core/services/       # camera, geolocation, barcode, notification, etc.
    features/            # home, camera, location, barcode, sensors, files,
                           # notifications, share, clipboard, device, compare
    shared/              # capability-card, support-badge, install-banner
 server/                  # Express push backend (local dev)
 api/                     # Vercel serverless functions
```

## Testing on Mobile

1. Deploy or run locally with `npm start`.
2. Open on Android/iOS  the home dashboard auto-detects API support.
3. Try each feature page.
4. Install as PWA (Android: install banner; iOS: Share -> Add to Home Screen).
5. Test push notifications after installing.
