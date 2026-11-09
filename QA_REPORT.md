# Round 1.5 — implementation and verification report

Date: 2026-11-09 · Candidate branch: `develop` · Status: **ready for owner QA, not production-approved**.

## Measured automated verification

- JavaScript syntax: 4 inline scripts passed `node --check`.
- Chromium 1440×900, 768×860, 390×844: no startup JavaScript errors, no page-level horizontal overflow, both component mounts successful.
- Three gear SVG paths compared equal (site, project settings, Visual Archive).
- DLS: real source screenshot displayed with `object-fit:cover`, `Tap to enlarge`; opened shared fullscreen image viewer (01/07), ArrowRight advanced to 02/07, Escape dismissed.
- Project settings: editor gear opened the correct panel, max image scale 400%, click-away closed panel.
- WSLX: browser simulation exists and uses label `Interactive simulation`, two examples, Windows→WSL and WSL→Windows conversion worked.
- **19/19 browser assertions passed**; see `TEST_CHECKLIST.md` for checks still awaiting physical-device validation.

## Before → after

| Reported issue | Change | Status |
|---|---|---|
| Duplicate fullscreen gallery engines | Both contexts invoke one `initViewer` controller and share its markup/styles; old project viewer controller removed | Implemented; browser tested |
| DLS preview blank bands | Small clickable screenshots now `cover` with user focus/scale controls; fullscreen remains uncropped | Implemented; browser tested |
| Different Project Settings icon | Uses exact Archive gear SVG, hover/click burst; right-hand placement preserved | Implemented; path matched |
| Inconsistent scrolling visuals | Global and shadow-root scrollbar tokens | Implemented; physical mobile visuals pending |
| Unclear WSLX demo | Renamed `Interactive simulation`, example presets, two conversion modes and copy button | Implemented; conversion tested |
| Enlarged-image control labels | `Actual size` ↔ `Fit screen` shared button | Implemented; browser tested |
| Missing authentic WSLX images | Existing original screenshots retained; no new photos fabricated | Pending owner uploads |
| Wrong ASCuarium icon | Current repository favicon source retained, still not owner-approved | Pending correct asset |
| DVD border/title must match logo | Existing observer/postMessage logic preserved, no independent fake color animation; draft child bridge remains unpublished | Pending hosted test/bridge review |
| DVD blurry/jerky | Existing iframe native pixel scaling retained, no physics changes | Mobile FPS/clarity not verified |

## GitHub safety

`main` and `old-version` remain on the March 2026 site. Round 1.5 is being staged on `develop` only. Github Pages deployment source selection still requires confirmation from Repo Settings → Pages.