# MyPortfolio architecture — Work Package 1

## Existing design

The site is one standalone HTML entry with internal styles, inline JavaScript and custom Shadow DOM components for Things I've Built and Visual Archive. R1.5 uses a shared gallery viewer. The coverflow engine and project story controller are not duplicated by WP1.

## New settings contract

- `PortfolioSettingsController.get()` returns the current settings, `set(key,value)` updates one value, `undo()` / `redo()` move through a bounded history, `restoreLastSaved()` restores the latest checkpoint and `saveCheckpoint()` updates that checkpoint.
- Previous local settings storage: `dor.hero.settings.v1`. New checkpoint storage: `dor.hero.last-saved.v1`. Undo state is deliberately only in memory.
- Visitor Accessibility has a separate storage namespace for text/contrast, plus `dor.portfolio.a11y-lens.v1` for the reading lens. Calm Mode migrates previously saved `simpleMode` and `reducedMotion` to one visible control.
- Portrait variables: `--portrait-x`, `--portrait-y`, `--portrait-zoom`. X/Y are percentages; Zoom is 100–250%.
- All slider reset buttons set the given field to its configured base default, preserving other settings. Checkpoint operations are distinct from Reset Default.

## Media edit model

- `window.WORK_PROJECTS` remains the catalog. Entries have stable original media IDs (`original-N`) and optional `__disabled`, `__removed`, and session-only `__session` flags.
- Viewer filters disabled/removed media and updates when the manager emits `portfolio:media-changed`. It keeps using the same R1.5 shared fullscreen controller.
- Original-photo metadata is serialized into `dor.portfolio.media-metadata.v1`; new file uploads remain session-only unless included in exported publish draft. Large image data should move to IndexedDB or asset files in Phase 2.
- `PortfolioMediaManager.export()` produces a versioned manifest with captions, state, order and imported media bytes. Exported data must be validated before publishing.

## Publishing design

- HTML contains a safe inline marker `__PUBLISHED_CONFIG_START__/END` and reads `window.PORTFOLIO_PUBLISHED_CONFIG`, which has a `settings` object and a versioned media manifest. Browser-edited drafts are not silently published.
- Export Draft downloads version-1 JSON. `tools/Publish-To-Develop.ps1` performs the explicit authorized action: validates the draft, encodes it as Base64 JSON (avoids injection into the HTML source), copies approved assets, commits and pushes **only** to `develop` using the user's Git credentials.
- The local publisher does **not** change GitHub Pages settings, and Pages must be configured separately in GitHub's admin UI.
- Client JavaScript never stores or requests a GitHub access token. Hidden Developer Mode is an interface affordance, not authentication.

## Future refactor targets

External JS modules and immutable media catalogs, more robust asset storage, per-project asset IDs that survive migrations, an accessible common settings control component, WCAG-tested magnifier, optional authenticated publishing app, modular photo engine, structured presets and CI.

## R1.6 WP2 additions (2026-11-10)
- **Card polish:** selected-work Shadow DOM styles isolate ASCuarium's cover decoration from other projects. The real ASCuarium icon remains embedded as a lossless image.
- **Confetti:** canvas is sized only as needed, uses adaptive DPR and particle budget, caps paint updates to 60 FPS on high-refresh displays, and pauses offscreen. State is not tied to the coverflow physics engine.
- **Coverflow reflections:** `is-animating`/`dragging` classes are toggled on the viewport; expensive blurred reflections are disabled while moving, restored at idle. No physics coefficients changed.
- **Carousel audio:** `window.PortfolioCarouselAudio.tick(velocity, projectId)` is a narrow optional hook called only when selected card changes. It is muted until user interaction and uses short WebAudio voices with a 72 ms creation guard. Its controls are under Developer Settings.
- **Published config:** inline `window.PORTFOLIO_PUBLISHED_CONFIG` remains an offline fallback; a synchronous `published-config.js` script may override it before core initialization. The owner can edit this small file using GitHub on a phone; repository authentication, not Developer Mode, protects the commit. Draft exports include sound settings.