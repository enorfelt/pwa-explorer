---
applyTo: ".copilot-tracking/changes/20260310-pwa-new-features-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: PWA New Feature Pages — Background Sync, Contacts, Bluetooth, NFC

## Overview

Add four dedicated exploration pages (Background Sync, Contacts Picker, Web Bluetooth, Web NFC) with services, components, routes, and capability-detection route updates.

## Objectives

- Create Angular services for all 4 APIs following existing `core/services/` patterns
- Create standalone feature components with `OnPush`, signals, and `SupportBadge` for all 4
- Register 4 new lazy-loaded routes in `app.routes.ts`
- Update 4 capability entries in `capability-detection.ts` to point to the new routes

## Research Summary

### Project Files

- `pwa-explorer/src/app/app.routes.ts` - Lazy-loaded route registry to extend
- `pwa-explorer/src/app/core/services/capability-detection.ts` - Capability registry with routes to update
- `pwa-explorer/src/app/features/_feature-page.scss` - Shared SCSS partial used by all features
- `pwa-explorer/src/app/core/services/share.ts` - Minimal service pattern reference
- `pwa-explorer/src/app/features/device/device.ts` - Multi-section component pattern reference

### External References

- #file:../research/20260310-pwa-new-features-research.md - Full API specs, browser support, and implementation patterns

### Standards References

- #file:../../.github/instructions/task-implementation.instructions.md - Task implementation instructions

## Implementation Checklist

### [x] Phase 1: Background Sync

- [x] Task 1.1: Create `core/services/background-sync.ts` and `background-sync.spec.ts`
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 13-31)

- [x] Task 1.2: Create `features/background-sync/` component (4 files)
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 33-57)

### [x] Phase 2: Contacts Picker

- [x] Task 2.1: Create `core/services/contacts.ts` and `contacts.spec.ts`
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 63-81)

- [x] Task 2.2: Create `features/contacts/` component (4 files)
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 83-105)

### [x] Phase 3: Web Bluetooth

- [x] Task 3.1: Create `core/services/bluetooth.ts` and `bluetooth.spec.ts`
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 111-130)

- [x] Task 3.2: Create `features/bluetooth/` component (4 files)
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 132-154)

### [x] Phase 4: Web NFC

- [x] Task 4.1: Create `core/services/nfc.ts` and `nfc.spec.ts`
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 160-179)

- [x] Task 4.2: Create `features/nfc/` component (4 files)
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 181-204)

### [x] Phase 5: Routing and Capability Detection Updates

- [x] Task 5.1: Add 4 routes to `app.routes.ts`
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 210-228)

- [x] Task 5.2: Update 4 capability routes in `capability-detection.ts`
  - Details: .copilot-tracking/details/20260310-pwa-new-features-details.md (Lines 230-245)

## Dependencies

- Angular 17+ standalone components with signals
- Angular Material (MatButton, MatIcon, MatFormField, MatInput already in project)
- No new npm packages required

## Success Criteria

- All 4 routes (`/background-sync`, `/contacts`, `/bluetooth`, `/nfc`) navigate to working pages
- Home page capability cards link to the new dedicated routes
- Support badges correctly reflect browser support on each page
- Unsupported browsers receive a clear, graceful fallback message
- All `should create` specs pass
