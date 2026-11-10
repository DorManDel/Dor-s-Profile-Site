# Changelog

## Round 1.5 — develop candidate (2026-11-09)

**Status**: Prepared for owner review; not merged into `main` and not approved for public release.

### Shared gallery engine
- Removed the independent project fullscreen viewer markup/controller and now instantiate the **existing `initViewer` implementation** from Visual Archive for project galleries too.
- Project story passes a screenshot catalog to `openCollection` with proper caption, count and full-size originals.
- Unified close button, carousel arrows, pointer/keyboard navigation, sizing control (**Actual size** / **Fit screen**) and focus return.
- Added a native-size toggle to the existing Visual Archive viewer as well, so both gallery contexts get the feature.
- Aligned controls and responsive overlays without changing the existing Archive honeycomb/camera code.

### Project cards and settings
- Preview images use aspect-ratio preserving `object-fit:cover` with per-project editable focus X/Y and 50–400% scale; the large viewer preserves the original image.
- Standardized **Tap to enlarge** on every clickable project screenshot.
- Replaced full-width **Project settings** button with the SVG gear from the Archive, keeping it on the right. Site settings gear now uses that same path too.
- Added the same hover and click-burst motion for the project gear, respecting reduced motion.
- Added shared scrollbar tokens for the page and both Shadow DOM components.

### WSLX
- Renamed the first gallery item to **Interactive simulation**.
- Retained browser-only Windows ↔ WSL conversion and added example buttons plus a result-copy control.
- Real WSL process execution is intentionally not offered by the browser preview.

### DVD
- Kept the colorful border behavior and title sync logic. Its source of truth remains the original DVD app color message/observable CSS variable.
- Left the original bounce physics untouched.
- Live cross-origin sync and real phone FPS require approval of the existing bridge PR and device QA; not represented as complete.

### Files and release management
- `old-version` retains the historic site; `develop` is the review branch; `main` stays on the old site until approved.
- Added README, ARCHITECTURE, TECHNICAL_DEBT and TEST_CHECKLIST to support a reproducible release review.

### Automated checks
- All four inline JavaScript blocks pass `node --check`.
- Chromium 1440×900 and 390×844: two viewer instances present, no JS errors, gallery opens, navigates, toggles size, closes; no body horizontal overflow.
- Real Archive item opened and advanced without errors; a real DLS story screenshot opened using the shared viewer with correct caption and a full viewport overlay.

### Pending
- Real Samsung Internet and Chrome device acceptance.
- WSLX additional owner-provided screenshots.
- Exact owner-created ASCuarium icon validation (current code references the `ASCuarium/images/favicon.ico` in the repo, but screenshot feedback indicates mismatch).
- Deployed DVD bridge color sync and frame-rate behavior.
- Long-term extraction of large media/data-URI payloads and CSS modules.

### Final QA correction (same candidate)
- Fixed a higher-priority DLS/project-skin CSS rule that initially overrode `object-fit:cover` in the shared preview.
- Removed a stale `closeFullShot()` call left behind by the deleted per-project fullscreen controller. The first WSLX close regression test exposed it.
- Re-ran desktop, tablet, and phone-width browser checks: **19/19 passing** (see `QA_REPORT.md`).