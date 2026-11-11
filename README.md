# MyPortfolio — R1.6 Work Package 3 preview (develop)

**Base**: the owner-uploaded `MyPortfolio-R1.5(1).html` (SHA-256 `197ddbde9f67a4636436b937cc97baf09dd330b22860b6a5fb6d95c0a0194f22`), NOT the separate carousel sound demo. The original was not overwritten.

**GitHub status (2026-11-11):** The owner-reviewed WP2 source is committed on `develop` (`94cf380`); the exact original ASCuarium icon, portable static checks and CI are committed in `1053fe1`. Pages reported a successful deploy for source commit `94cf380`. Real mobile acceptance and direct hosted-site smoke tests are still pending.

## Opening and testing

- Open `index.html` in Chrome for a standalone preview. `Preview locally.cmd` is a Windows shortcut. Network-loaded projects may require hosted HTTP rather than `file://`.
- In Settings, make five quick taps on the accessibility icon to unlock Developer Mode; public controls still show only Accessibility. Test X/Y/Zoom controls under Appearance, gallery management under Projects, and History & Export under Tools.
- In Developer Settings → Tools → History & Export, click **Export publish draft** when finished. Move the downloaded `myportfolio-publish-draft.json` alongside `index.html` in this folder, or leave the last 24-hour export at `Downloads/myportfolio-publish-draft.json`.
- Use **Save checkpoint**, **Revert to last saved**, **Undo/Redo**, or individual `↺ Reset` controls. Undo stack is bounded and session-only; the last-saved checkpoint is kept locally on that browser/origin.
- Use `tools/Check-JavaScript.ps1` for local syntax verification with Node.js.

## Publish with one deliberate Windows click

- Double-click **Publish to develop.cmd**. It uses your existing Git for Windows authentication (Git Credential Manager), clones/fetches into `%USERPROFILE%\Documents\MyPortfolio-Workspace`, refuses to overwrite dirty local work, commits exactly the expected files, and pushes **only** to `develop`.
- If you exported a draft, the publisher embeds the settings and media manifest in the HTML as encoded data (no executable user markup); otherwise it publishes the included defaults. **Read the `git diff` in your local workspace before a final stable release.**
- The first time, configure GitHub Pages → Settings → Pages → Deploy from a branch → **develop** and **/(root)**. This administrative settings operation is not performed by the script. Subsequent pushes to `develop` trigger deployment based on Pages configuration.
- A direct browser-to-GitHub publish button is **not** available on this unauthenticated public static site; it would expose credentials. The local one-click publisher is our secure first iteration.

## Implemented in WP1

- Correct owner-supplied ASCuarium aquarium ICO artwork (the exact file is included under `images/ASCuarium.ico`; its pixels are also embedded losslessly into the standalone HTML for project and album cards).
- Contact: Steam and Discord as SVG-based disabled slots until actual profile URLs are supplied. No fake profile link.
- Public Settings: Accessibility only (larger text, contrast, unified Calm Mode and a simple desktop reading magnifier). Remember last position and Easter Egg moved to developer subsections. Calm Mode migrates legacy Reduced/Simple Mode values and hides the animated background.
- Appearance: portrait horizontal alignment, vertical alignment and zoom (100–250%) with per-control reset, persisted locally.
- History: bounded Undo/Redo, saved checkpoint and last-saved restore for main settings, plus per-slider reset. Imported `DM1-` codes still work.
- Developer Projects Media Manager v1: select project, caption, reorder, disable/enable, reversible remove, session image import, undo, metadata persistence for original images and explicit export. **Image imports must be exported before refresh**; durable asset library/IndexedDB belongs in later work.
- Export authoring draft for local publisher; no secrets, GitHub authentication or direct browser push.

## New in WP2 — contact cleanup, performance, Sound & FX, mobile publishing

- Removes redundant footer sentence and substitutes *actual* source SVGs: GitHub/Discord/Steam from Simple Icons; Email from Bootstrap Icons. See `docs/CONTACT_ICON_SOURCES.md`.
- On the ASCuarium album cover only, removes the fake ASCII fish pseudo-element and project category label so the owner's fish-and-coral artwork is visually clean.
- Reduces confetti canvas backing resolution (especially mobile), particle counts, repeated filtering/allocations, and pauses rendering when backgrounded. Coverflow blurred reflections are disabled **only while moving** to reduce GPU cost; approved coverflow movement math is unchanged.
- Adds **Developer Settings → Things I've Built · Sound & FX** with off-by-default WebAudio selection clicks, volume, velocity response, style presets, preview, and an optional imported short clip (session only).
- Adds **Tools → Publish from Phone**: Copy GitHub config + Open GitHub editor. `published-config.js` is the small publishable override, loaded synchronously before site initialization. GitHub's normal authentication authorizes the commit; no tokens are stored in the site. See `docs/MOBILE_PUBLISH.md`.
- Keeps the same Windows `Publish to develop.cmd` and protects any existing `published-config.js` edited on GitHub unless a new explicit draft is exported.

## New in R1.6 WP3 — experimental controls (2026-11-12)

**Access:** open Accessibility, tap the icon five times quickly to unlock Developer Settings. The public menu remains Accessibility-only. Developer Settings now have searchable, ordered groups.

- **Things I've Built → Sound & FX:** the default sound toggle remains OFF. A short optimized excerpt derived from the owner's Spin-09 MP3 is bundled as `audio/spin-09-click.mp3`, with 1–3 clicks per album, volume (default 40%), velocity response, and audio preview. The full original and Space Cadet reference are not published by default. Uploaded clips remain session-only.
- **Interaction FX → Water Ripple V2:** OFF by default; actual WaterRipple V2 engine sits behind the hero card and over the fish, with optional independent haptics and synthesized plop (both OFF). Works with native page scroll.
- **Interaction FX → Prism Tilt:** OFF by default. Lightweight photo overlay prototype using preferred Main Profile settings. Pointer movement works for desktop preview; Device Orientation requires explicit enable/permission on supported mobile browsers. Not a replacement for the high-fidelity standalone Prism Lab.
- **Interaction FX → Haptic Engine:** optional light pulses when using Things I've Built, with 4–35 ms duration and a test button; cannot set motor amplitude from the browser.
- **Tools → Performance HUD:** opt-in FPS/rAF debug overlay with mean and p95 frametime; stops when page is backgrounded.
- **Accessibility → Reading magnifier:** desktop pointer lens continues; mobile touch/drag now shows a separate enlarged text panel above the touch point. Native pinch zoom works independently.
- **Contact:** provided Steam and Discord links are now active, with GitHub/email unchanged.
- **Publish from Phone:** copy the exported config to `published-config.js` using GitHub authentication. WP3 settings can be published as `fx.wp3`, but remain local preferences by default.

**Testing:** CI checks syntax and asset linkage. Real Samsung Chrome/Samsung Internet, iPad Safari, audio perception, permission behavior and FPS comparisons require manual acceptance. This is a `develop` preview, not a reviewed stable `main` release.

## Pending verification and future R1.6 work

- JavaScript syntax check passed for six inline scripts. Chromium has since been tested by rendering the HTML directly into an `about:blank` document at 1440×900 and 390×844. This is an automated browser smoke test, **not** live GitHub Pages or physical Samsung testing.
- Must manually verify settings, SVG accessibility, portrait, media manager, imports, undo, gallery updates, and public Pages behavior.
- Full native photo engine swipe/physics smoothing, advanced carousel audio-timing/audio asset publishing, cursor designer, translucent positioning inspector, embedded ECG Manual access, and advanced section/text editor are **not** implemented in WP1.
- Magnifier is a first text lens on pointer devices; keyboard/touch magnification and broader WCAG testing remain pending.

## Files

- `index.html` — actual local work-in-progress site.
- `images/ASCuarium.ico` — authentic owner-provided artwork.
- `Publish to develop.cmd` — one-click Windows publisher entrypoint.
- `tools/Publish-To-Develop.ps1` — Git commit/push, draft import, safety checks.
- `tools/Check-JavaScript.ps1` — syntax test.
- `docs/` — detailed roadmap and release policy.
- `QA_REPORT.md`, `TEST_CHECKLIST.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `TECHNICAL_DEBT.md` — truthful progress and remaining risks.