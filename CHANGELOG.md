## R1.6 WP3 artwork correction — WSLX (2026-11-12)
- Fixed Things I've Built carousel to use the exact owner-provided WSLX SVG rather than a separately generated cover logo. The WORK_PROJECTS logo was already byte-exact; now both views share it.
- Vendored unchanged `images/wslx-logo.svg` from the pinned WSLX commit; added source-policy notes and smoke test against accidental substitution.
- No effect on `main`, `old-version`, other project images, or carousel behavior.

## R1.6 WP3 — search, optional visuals, mobile accessibility and real social links (2026-11-12)
- Resorted developer controls into coherent sections, added text search across setting names and descriptions, without hiding public Accessibility.
- Added user-provided WaterRipple V2 (optional, initially OFF) above HTML fish and behind the hero card. Calm Mode/reduced motion turns it off. Optional throttled ripple haptic and synthesized water plop are OFF.
- Added experimental Prism overlay preview (initially OFF), Main Profile 74/68/16°/13px/4/35 prefilled and optional DeviceOrientation with permission handling. This is a lightweight integration preview, not yet full Prism Lab visual parity.
- Added optional developer FPS/frame-time HUD with mean and p95 intervals; pauses when hidden.
- Added throttled optional work/navigation haptic engine (duration not hardware amplitude) and touch reading magnifier; native pinch zoom remains.
- Activated user-provided Steam and Discord links while keeping sourced contact SVGs.
- Recovered Spin-09 from owner's media Library and committed a short 0.18-second optimized excerpt as `audio/spin-09-click.mp3`; 1–3 adjustable clicks/album with velocity-sensitive playback. Original full 2.2-second source and copyrighted Space Cadet reference are NOT bundled as website defaults.
- Published FX configuration can be copied to `published-config.js` through authenticated GitHub editor; users' local overrides remain separate.
- Production `main` and `old-version` unchanged. Requires real mobile/browser behavior and audio listening QA before stable release.

# MyPortfolio — Changelog

## R1.6 WP2 — cover polish, adaptive confetti, developer Sound & FX and mobile config (2026-11-10)
- Removed redundant page-status/footer sentence.
- Replaced four hand-made contact SVGs with authentic sourced icons (see `docs/CONTACT_ICON_SOURCES.md`), maintaining disabled Steam and Discord until URLs arrive.
- Removed ASCII fish pseudo-element and category strip from the ASCuarium *album cover* only; official owner image retained.
- Reduced confetti overdraw and canvas resolution with adaptive density and visibility pause. Avoided blurred reflection compositing during cover motion while keeping original physics.
- Added opt-in Sound & FX settings tied to actual card-selection transitions: volume, motion response, soft/mechanical/digital and session custom sound.
- Added phone editor handoff via `published-config.js` and copy-to-clipboard, secured by GitHub-authenticated commits.
- Tests: seven nonempty inline scripts and external configuration passed `node --check`; headless Chromium direct HTML render showed 0 JS errors and no horizontal overflow at desktop and mobile widths; full public Pages and physical-device QA still pending.
- GitHub: **WP2 source is packaged locally, not automatically pushed or deployed.**

# MyPortfolio changelog

## R1.6 — Work Package 1 (local preview; 2026-11-10)

- **Added**: correct owner-supplied ASCuarium icon in the coverflow and project story logo; original ICO included as an asset.
- **Added**: Steam and Discord contact SVG placeholders; disabled until real profile URLs are known.
- **Changed**: public Settings exposes Accessibility only. Remember-where-I-left-off and Easter Egg controls now live in Developer Mode. Reduced Motion / Simple Mode appear as one Calm Mode checkbox with legacy settings migration.
- **Added**: first reading magnifier for desktop pointer users, with local preference persistence.
- **Added**: portrait X/Y/Zoom, individual slider resets, reversible settings history and last-saved checkpoint.
- **Added**: developer Projects Media Manager MVP (metadata, reorder, disable, reversible remove, session import, export, undo).
- **Added**: publish-draft export and a local Git-to-develop Windows launcher; repository authentication is handled by Git Credential Manager, not website code.
- **Preserved**: R1.5 shared viewer, coverflow dynamics, Visual Archive mechanics and existing hosted demos.
- **Not implemented**: native photo physics tuning, carousel sound/FX, full cursor designer, full content/section editor, real Steam/Discord profile links, complete accessible magnification.
- **Verification**: 6 inline JavaScript blocks passed `node --check`; real browser and mobile acceptance not completed.

## Source baseline

Uploaded `MyPortfolio-R1.5(1).html`: SHA-256 `197ddbde9f67a4636436b937cc97baf09dd330b22860b6a5fb6d95c0a0194f22`. No past repo branches or releases were overwritten in this deliverable.