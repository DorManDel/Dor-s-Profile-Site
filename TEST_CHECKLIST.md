# Round 1.5 — verification checklist

This file separates **automated results** from **owner/device acceptance**. A checked Chromium test is not proof of Samsung Internet behavior.

## Automated (2026-11-09)

- [x] JavaScript `node --check`: 4/4 embedded scripts.
- [x] Chromium 1440×900: both custom elements mount, no page errors or horizontal overflow.
- [x] Chromium 390×844: same mount, no page errors or horizontal overflow.
- [x] Shared project viewer opens a two-image collection, Next advances, size toggle changes label, Close dismisses.
- [x] Existing Visual Archive artwork viewer opens a real artwork, advances and closes.
- [x] Real DLS project opens, shows `Tap to enlarge`, fullscreen view opens DLS sign-in with caption and 01/07 count.
- [x] Viewer controller declaration appears only once in compiled source; old project fullscreen DOM node removed.
- [x] Site `main` left untouched; no public site deployment triggered by this candidate.

## Manual desktop/phone acceptance (not yet performed)

- [ ] Open the same `index.html` in desktop Chrome and on physical Samsung Chrome/Samsung Internet.
- [ ] Confirm the site settings gear, Archive gear, and Project settings gear look like the same SVG; one-second click burst and hover stay centered.
- [ ] Confirm themed scrollbars in the page, site settings, project settings and Archive settings (mobile browsers may hide them when idle).
- [ ] DLS screenshots fill preview, do not distort and open the complete originals in the shared viewer.
- [ ] WSLX first gallery page says **Interactive simulation**, converts `C:\Users\Dor\Projects` to `/mnt/c/Users/Dor/Projects`, converts back, and copying works in the hosted browser.
- [ ] PokeDor pixel art remains sharp; button click opens fullscreen using the same controls as Archive.
- [ ] Viewer swipes and taps work correctly on the device; arrows, Escape, outside click, Actual size / Fit screen work.
- [ ] Preview Scale 50%–400% and focus X/Y still work; saved presets persist after reload.
- [ ] Visual Archive coverflow/honeycomb inertia, photos, navigation and settings still work.
- [ ] Album inertia values 5 and 95 are noticeably different on desktop and phone.
- [ ] DVD remains sharp; frame/color/title matches original logo **after** bridge deployment; measure motion smoothness with remote device tools.
- [ ] Confirm original ASCuarium favicon asset visually matches the desired brand image; replace once correct original asset is provided.
- [ ] Import and verify remaining WSLX screenshots when available.
- [ ] Approve or reject this candidate before PR to `main`.

## Release checklist

- [ ] Verify the GitHub Pages setting in Repo Settings → Pages: source branch is `main` (or a specific Actions workflow restricted to `main`).
- [ ] Review `develop` → `main` PR and all changed files.
- [ ] Merge only after owner acceptance.
- [ ] Verify public URL shows the approved commit; run smoke tests on the hosted page.