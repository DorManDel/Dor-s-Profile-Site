# R1.6 WP1 test checklist

## Actually executed

- [x] Source file preservation: original uploaded R1.5 HTML has unchanged SHA-256.
- [x] Owner's `.ico` file inspected and included in `images/ASCuarium.ico`.
- [x] Six inline JS scripts extracted; all pass Node.js `--check`.
- [x] Static HTML assertions for Accessibility public-only, portrait inputs, media manager elements, source icon and draft export contract.
- [ ] Chromium browser automation: unavailable/blocked by hosting security policy, **not passed**.

## Required local desktop manual acceptance

- [ ] Confirm desktop site opens without console errors, broken image assets or horizontal overflow.
- [ ] Public Settings contains Accessibility only; hidden Developer controls accessible after the established quick-tap unlock.
- [ ] Calm Mode hides the aquarium/reduces motion and keeps system reduced-motion behavior; older DM1 settings import safely.
- [ ] Larger Text, High Contrast and the reading lens can be toggled; screen reader and keyboard use still work.
- [ ] Portrait X, Y and Zoom work and per-slider Reset restores only that control.
- [ ] Undo/Redo across multiple drag operations and Last Saved checkpoint restore the expected previous values.
- [ ] Media Manager can reorder, disable/enable, remove/restore, caption, import an image (preview only), Undo and export; current project gallery updates when reopened.
- [ ] ASCuarium coverflow image and project modal show the supplied aquarium picture rather than a generated text logo.
- [ ] Steam/Discord use SVG icons and are correctly **not clickable** until URLs are configured.
- [ ] Export publish draft → publisher embeds saved settings; Git commit contains no secret; GitHub Pages deploys develop once configured.

## Device QA and regression

- [ ] Samsung Internet and Samsung Chrome, portrait + landscape: touch and scroll, settings, image view, page overflow, hit targets.
- [ ] DLS image crop/viewer, WSLX interactive demo, DVD original embed, Visual Archive fullscreen viewer and page navigation remain intact.
- [ ] Reduced motion, keyboard focus, Escape handling, last-page restoration and settings panel close behavior.
- [ ] Confirm the public Pages URL shows intended R1.6 and reports the correct deployed commit.

## R1.6 WP2 additions
- [x] All seven nonempty inline JS blocks and the external config have valid JavaScript syntax.
- [x] Chromium render at 1440 and 390 widths: zero uncaught errors and no horizontal overflow.
- [x] ASCuarium original artwork retained; album-specific ASCII glyph and cover label hidden.
- [x] Four sourced icons rendered as SVG; Email/GitHub remain links, Discord/Steam remain disabled until provided URLs.
- [x] Developer Sound & FX change/preview callbacks update state without JS errors.
- [ ] Actual manual listening and adaptive carousel tick behavior on desktop and phone.
- [ ] Verify confetti timing/visual appearance on Chrome and Samsung Internet; record baseline/optimized FPS and long-frame counts.
- [ ] On hosted GitHub Pages, test phone Copy GitHub config -> GitHub editor commit -> fresh-session public reload.
- [ ] Approve the isolated photo-engine performance changes before broad animation optimization.