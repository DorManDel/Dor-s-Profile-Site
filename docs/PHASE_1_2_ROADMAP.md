# MyPortfolio — Phase 1 / Phase 2 roadmap

Updated: 2026-11-10. Status rules: **verified** = checked from repository or user-provided artifact; **pending** = not coded or not verified; **prototype** = standalone experiment not integrated.

## Phase 1: functional completion of the portfolio (finish R1.5, then R1.6)

### Baseline and deployment
- [x] Original site on `main` and backup on `old-version`.
- [x] Former R1.5 development candidate and 19/19 reported Chromium assertions committed on `develop`.
- [x] `release/r1.5` snapshot and `feature/r1.6-settings` created.
- [x] Owner uploaded exact latest R1.5 HTML and separate sound prototype. R1.5: all four inline script blocks passed `node --check`.
- [ ] Push the **latest uploaded** R1.5 HTML to `develop`. Previous GitHub candidate differs in blob identity from the upload.
- [ ] Owner switches GitHub Pages source to `develop` / `(root)`; verify public URL and loaded SHA.
- [ ] Complete Samsung Chrome/Samsung Internet, desktop and tablet QA on **deployed** R1.5.

### R1.6 P0 — settings and authoring
- [ ] Reusable site/project/archive settings shell (consistent toggle, close, Escape, outside click, accessibility/focus, gear behavior).
- [ ] Translucent and positionable live inspector; navigate on selecting setting, not each slider input.
- [ ] Per-control reset and defaults with explicit global → project → image scope.
- [ ] Developer image manager: add assets, captions, reorder, disable, restore, remove with confirmation/undo, versioned export.
- [ ] MVP content editing for text and links; section visibility/reordering/template-based additions with undo and export.
- [ ] Preferences: validate, decode/import/export `DM1-` and JSON, persistence and reversible change log.

### R1.6 P1 — experiences
- [ ] Add carousel sound prototype as isolated add-on; keep physics unchanged, support velocity, mute, volume, style, user-provided audio and reduced-motion behavior.
- [ ] ECG button style switch `classic ↔ ecg` (not screenshot/gallery).
- [ ] Keep original ECG embedded manual accessible; troubleshoot iframe clipping/viewport.
- [ ] Make public accessibility clear and available regardless of Developer Mode.
- [ ] Contextual explanations for numeric controls including min/max/default/effect.
- [ ] Add Discord/Steam contact slots (profile links must be confirmed).
- [ ] Re-test project galleries, crop/zoom, WSLX, DLS, archive, mobile, animation, keyboard.

### Phase 1 exit gate
- [ ] R1.6 user acceptance on GitHub Pages (`develop`), documentation and regression pass.
- [ ] Snapshot accepted stable version; PR/merge into `main` only after owner approval.

## Phase 2: advanced visual CMS + modular architecture
- [ ] Move giant standalone HTML into reviewed JS/CSS/assets modules while preserving compatibility.
- [ ] Build extendable section templates and an advanced visual style/button editor.
- [ ] Versioned content manifest, media optimization/migration, import diffs and friendly export.
- [ ] Better named checkpoints/change-diff viewer and restore points.
- [ ] Reusable interactions/effects lab integration; elaborate About and gaming/interests area.
- [ ] Performance optimization, asset caching, low-end device benchmarks, automated cross-browser CI and branch previews.
- [ ] Optional authenticated repository publishing workflow; **never** store GitHub tokens in static client code.

## Reporting
Every work session must report as bullets:
- **Proposed** — priority, purpose and acceptance test.
- **Changed/how** — file names, functional behavior and implementation.
- **Tested** — actual evidence and limitations.
- **GitHub** — branch, commit, release/deploy state.
