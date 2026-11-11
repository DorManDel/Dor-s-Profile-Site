# Official project artwork — sources and reuse policy

Project artwork must come from owner-supplied assets or verified primary sources. Never replace an existing project logo with a generated approximation without the owner's explicit instruction.

## WSLX — original, unchanged

- **Source:** https://raw.githubusercontent.com/DorManDel/wslx/93c2fc772ee41be2a0bcf42d0677fb725c13da34/assets/wslx-logo.svg
- **Repository:** `DorManDel/wslx`, exact commit `93c2fc772ee41be2a0bcf42d0677fb725c13da34`.
- **Vendored copy:** `images/wslx-logo.svg` (original SVG source bytes, unchanged).
- **Standalone support:** `window.WORK_PROJECTS` already includes an exact base64-encoded copy of this original SVG so a single-file offline portfolio preview still works.
- **Carousel album:** `PROJECTS` reuses `WORK_PROJECTS`'s exact original logo (with vendored SVG fallback), not a separately generated illustration.
- **Coverage:** `tests/site_smoke.py` compares the embedded SVG bytes to the vendored source and guards the carousel linkage.

Any future asset change should have its own source, provenance and user approval. Cosmetic frames around artwork are separate from changes to the actual logo.
