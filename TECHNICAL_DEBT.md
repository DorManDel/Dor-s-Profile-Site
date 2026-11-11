# Technical debt — R1.6 WP1

- **P0: Runtime QA**. Chromium launch/navigation was blocked in the execution environment. Verify actual desktop and mobile behavior before publishing to the live development site.
- **P0: Publishing source freshness**. The one-click publisher copies its packaged `index.html`; if another developer changed `develop` since packaging, review the resulting diff carefully. A future version should enforce an expected-content hash and require explicit reconciliation.
- **P0: Durable media imports**. Imported photos are session-only until exported; use IndexedDB or relative asset files, deduplication and limits before promising reload persistence.
- **P1: Media edit history**. Metadata undo is bounded and independent of the settings undo stack. Need a unified transaction log and better remove confirmation/restore affordances.
- **P1: Scope inheritance**. Per-control reset currently uses original defaults, not full global/project/photo inheritance for all controls. Define schema-driven inheritance and per-item reset next.
- **P1: Accessibility**. The reading lens handles pointer text only and requires keyboard, touch and screen-reader alternatives; evaluate calm mode's impact on other motion classes.
- **P1: Settings architecture**. Main HTML still includes large embedded media and multiple settings blocks; extract modules without rewriting approved visuals.
- **P1: Image responsive motion**. Current R1.5 gallery physics unchanged. Instrument frame rate and touch smoothness before tuning.
- **P2: Cursor / button designer / content editor / sound engine**. Deferred from this first work package; no placeholders are represented as completed features.

## R1.6 WP2 follow-ups
- [ ] Profile animation frame-time breakdown on physical Samsung Chrome/Samsung Internet and desktop Chrome; headless Chromium smoke checks cannot substitute for field FPS measurements.
- [ ] Add a low-power visual quality selector in Developer tools and test default thresholds (blur, shadows, fish count, reflections, confetti). Preserve full-quality visual fidelity as selectable preset.
- [ ] Move embedded media assets out of the 3.2 MB single-file page; avoid base64 image decode and large JS parse on every reload.
- [ ] Sound uploads are session-only. Publish as real versioned assets in a dedicated manifest, with decoded clip caching, compression and save/restore.
- [ ] Native cursor editing and complex waveform/FX settings remain Phase 1 work. Avoid per-frame pointer effects unless strictly necessary.
- [ ] `published-config.js` is an authenticated GitHub edit path, not a one-tap in-site commit. A real authenticated publishing service and full mobile media upload are Phase 2 work.