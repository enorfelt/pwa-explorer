# Copilot Instructions

## Project Overview

Angular 21 PWA that demonstrates modern browser Web APIs to evaluate what mobile web can do compared to native apps. The Angular app lives in the `pwa-explorer/` subdirectory — **all commands must be run from there**.

## Build, Test, and Dev Commands

All commands run from `pwa-explorer/`:

```bash
npm start              # Dev server → http://localhost:4200
npm run build          # Production build → dist/pwa-explorer/browser/
npm run watch          # Dev build with watch mode
ng test                # Run all Karma/Jasmine unit tests
ng test --include=src/app/features/camera/camera.spec.ts  # Run a single test file
```

Push notification backend (local dev only):

```bash
cd pwa-explorer/server
npm install && npm run dev   # Express server → http://localhost:3000
```

## Architecture

```
pwa-explorer/
  src/app/
    core/services/     # One injectable service per Web API (camera, geolocation, barcode, etc.)
    features/          # One folder per capability — lazy-loaded standalone components
    shared/
      components/      # capability-card, support-badge, install-banner, update-prompt
      models/          # capability.model.ts — Capability, SupportLevel, CapabilityCategory types
  api/                 # Vercel serverless functions (production push backend)
  server/              # Express push backend (local dev only)
  src/environments/    # environment.ts (dev) and environment.prod.ts (prod)
```

The `CapabilityDetection` service (`core/services/capability-detection.ts`) is the single source of truth for which APIs are available. It builds the full capabilities array at construction time using a `check(primary, fallback?)` helper that returns `SupportLevel` (`'supported' | 'partial' | 'unsupported' | 'unknown'`).

The home page reads from `CapabilityDetection` and renders `CapabilityCard` components grouped by category. Each feature route is lazy-loaded via `loadComponent`.

In production, `/api/*` requests route to Vercel serverless functions (`api/`). In dev, they hit the local Express server at `http://localhost:3000`. The `environment.apiUrl` switches this automatically.

## Key Conventions

### Angular patterns

- All components use **`ChangeDetectionStrategy.OnPush`**
- State is managed with **Angular signals** (`signal()`, `computed()`) — not RxJS subjects or `ngModel` for local UI state
- Use **`inject()`** for dependency injection, never constructor injection
- Template-bound members use **`protected` visibility** (not `public`)
- All components are **standalone** (no NgModules)

### File naming

Files omit the `.component` / `.service` suffix — just `camera.ts`, `camera.html`, `camera.scss`, `camera.spec.ts`. Each feature lives in its own folder matching the route name.

### Adding a new capability

1. Create `core/services/<name>.ts` — injectable service wrapping the Web API with an `isSupported` getter
2. Create `features/<name>/` folder with `<name>.ts`, `<name>.html`, `<name>.scss`, `<name>.spec.ts`
3. Add a lazy route in `app.routes.ts`
4. Add an entry to `CapabilityDetection.buildCapabilities()` in `core/services/capability-detection.ts`

### Styling

- Feature pages import shared base styles from `features/_feature-page.scss` (`.feature-page`, `.page-title`, `.section-title`, `.unsupported-msg`, `.error-msg`, `.info-card`)
- Angular Material 3 tokens are used for theming (`var(--mat-sys-surface-container)`, `var(--mat-sys-error-container)`, etc.)
- Prettier: single quotes, print width 100, 2-space indent, SCSS

### Service worker

Two service workers coexist: Angular's `ngsw-config.json`-driven worker (registered as `sw.js` in `app.config.ts`) and a custom `src/custom-sw.js` for push handling. The `ngsw-config.json` prefetches app shell files and lazy-loads assets.
