# Architecture — MyPortfolio Round 1.5

## Goals

Keep a personal, expressive site readable and lightweight: **one responsibility per component**, one implementation per repeated behavior, no unnecessary framework, and clear separation of project data, rendering, state, and integrations.

## Current composition

```text
Browser document (index.html)
├── Header / Hero / Navigation / Footer
├── Accessibility & Developer Settings
│   ├── PopupManager (single click-away/Escape handler)
│   └── shared scrollbar and icon design tokens
├── <selected-work>  [Shadow DOM]
│   ├── projects/catalog — project metadata and screenshot sources
│   ├── CoverFlowEngine — card physics, pointer controls, mode
│   ├── ProjectStory — overlay, skins, navigation, preview settings
│   ├── initViewer — SAME gallery controller as Archive
│   └── live demos — external iframe or browser-only WSLX converter
├── <visual-archive> [Shadow DOM]
│   ├── Artwork catalog
│   ├── HoneyPlane — pan, zoom, render and restore
│   ├── initViewer — SAME gallery controller as Selected Work
│   └── Archive controls
├── localStorage
│   ├── site preferences
│   ├── remembered section/cover-flow state
│   └── project-specific visual presets
└── External projects (separate repositories and origins)
    ├── DVD Logo Bounce (iframe + optional origin-checked message bridge)
    ├── ASCuarium (iframe)
    └── ECG demo (iframe)
```

## Shared image viewer contract

**Source of truth**: `initViewer(document, initialWorks, readableType)` in the embedded Archive viewer implementation. It is called once per mounted Shadow DOM, not copied or rewritten for individual projects. The visual markup is cloned from the Visual Archive `<template>` into the project component; the subset of viewer styles is shared by the two instances.

```js
const viewer = initViewer(scopedDocument(shadowRoot), [], type => type);
viewer.openCollection([
  { original: 'images/example.webp', title: 'Dashboard', type: 'Project' }
], 0, imageElement);
```

The controller provides `open`, `openCollection`, `close`, and `isOpen`. Both instances share *one implementation*; they do not share the same DOM instance, so each gallery remains isolated in its Shadow DOM. A separate project fullscreen swipe controller was removed.

When opened, the viewer owns arrow navigation, pointer inertial scrolling/snap, keyboard arrows/Escape, source-image preloading, focus restoration, an optional original-image link, and a size toggle.

## Viewer state and data flow

1. Project catalog provides screenshots and captions; the story card previews the selected screenshot.
2. The card preview uses `cover`, but never distorts the source image.
3. Clicking/pressing Enter on the preview builds a `{original,title,type}` catalog and calls `PortfolioProjectViewer.openCollection(...)`.
4. The controller renders nearby slides and provides the same navigation behavior used by the Visual Archive.
5. Closing returns focus to the previously focused element.

The project story design uses a skin for each project (DLS, WSLX terminal, PokeDor Game Boy, DVD, etc.) but should not contain duplicate navigation engines.

## Settings and persistence

- **Visitor preferences**: larger text, contrast, simplified mode, reduced motion and recall of where the visitor left off.
- **Project rendering preferences**: preview scale (50–400%), focus X/Y, and where relevant DVD demo size/speed/color-sync flags.
- They live under distinct localStorage keys and must remain independently editable.
- Saving a preset in localStorage only updates that browser. Publishing a preset for everybody requires changing the checked-in default configuration and deploying.

## Iframes / security boundary

Remote apps run in a separate browsing context. In a cross-origin iframe, the parent **cannot read** an app's DOM or CSS. DVD colors therefore require an explicit event bridge:

```js
// App (child) posts a state event to the trusted portfolio origin.
window.parent.postMessage({ type: 'dm:DVD:STATE', color: '#38bdf8' }, 'https://dormandel.github.io');
// Portfolio checks event.origin AND event.source before applying color.
```

The parent already implements an origin/source-checked listener and retains a same-origin observer fallback. A draft bridge exists in `DVD-Logo-Bounce-HTML` but is not deployed, so live cross-origin color sync is **not certified**. No changes to the DVD collision or animation physics are needed for this bridge.

## Performance

- Cover-flow uses `requestAnimationFrame`, delta time, transform/opacity rendering and damping instead of expensive layout updates every frame.
- Modal animations use native Web Animations API when available, with reduced-motion fallback.
- Image sources are currently embedded as data URIs, increasing HTML size and parsing cost. External optimized media and separate modules are a *planned* improvement, not a prerequisite for a working Round 1.5.
- Hidden live iframes are removed instead of continuing to run in the background.

## Coding conventions and guardrails

- Prefer `const` and small pure functions with explicit inputs/outputs.
- Avoid creating another component if one existing controller can accept a new data collection.
- Keep authentic project assets; never fabricate missing screenshots.
- Respect responsive display, keyboard use, touch input and reduced motion.
- Document public methods with one real usage example.
- Tests must distinguish automated desktop emulation from real Samsung Internet hardware.
