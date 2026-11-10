# MyPortfolio

A standalone, responsive developer portfolio built with **HTML, CSS and vanilla JavaScript**. It includes a project cover-flow, project-specific story windows, the Visual Archive, accessibility controls, and interactive project demonstrations.

This repository is an evolving learning project. The implementation intentionally uses web platform APIs rather than a framework or a build system. It is currently packaged as a **single HTML file for zero-dependency previewing**; asset and module extraction is tracked under technical debt.

## Running the site

1. Open `index.html` in a modern browser for a quick offline review. Some external images and `iframe` demos require Internet access. `file://` also limits cross-origin integration.
2. To test more realistically, start a local HTTP server in the repository root (for example, `python -m http.server 8000`) and open `http://localhost:8000`.
3. After approval, merge the tested source into `main`. GitHub Pages should publish from the selected production branch; see `docs/RELEASE_WORKFLOW.md`.

No dependencies, API keys or npm install steps are required. Do not treat a local preview as proof that a remote iframe bridge works on the public domain.

## How it works

- **Page shell**: masthead, hero, navigation curtain, site preferences, contact, and scroll progress.
- **Selected Work**: a custom element with its own Shadow DOM. Its cover-flow uses pointer events and `requestAnimationFrame` with velocity, damping and snapping. Clicking an album opens a project story.
- **Visual Archive**: another custom element with a pan/zoom canvas-like artwork grid and fullscreen artwork viewer.
- **Shared viewer**: both components now instantiate the **same `initViewer` controller**, sharing media navigation, inertia/snap, keyboard, responsive overlay, closing, native-size toggle and focus return. Different catalogs and captions are passed to the controller.
- **Popup manager**: common outside-click / Escape controller, which works through normal DOM and Shadow DOM via `event.composedPath()`.
- **Project presets**: saved locally by project ID. Preview scale is 50–400%, with focus X/Y. Changes saved to localStorage affect that browser, *not all site visitors*.
- **WSLX Interactive simulation**: browser-only path converter. It converts `C:\...` ↔ `/mnt/c/...`, supports examples and copies the result. It does not execute a shell, access WSL or modify files.
- **DVD embed**: the original website is displayed in an iframe; its game physics are unchanged. The page may sync border/title via a same-origin observer or an origin-checked `postMessage` bridge when the remote bridge is deployed. Cross-origin live-color synchronization is not yet verified.

## Key JavaScript functions (plain-English explanation)

| Function/API | Role | Example |
|---|---|---|
| `initViewer(doc, items, labelType)` | Builds the shared gallery behavior | `const viewer = initViewer(doc, works, type => type)` |
| `viewer.open(index, sourceElement)` | Opens an Archive image at an index | `window.VisualViewer.open(2, clickedImage)` |
| `viewer.openCollection(items, index, element)` | Opens a *project* media set with the same viewer engine | `window.PortfolioProjectViewer.openCollection([{original: imageUrl, title: 'Screenshot', type: 'Project'}], 0, clickedImage)` |
| `viewer.close()` | Dismisses and restores focus | `window.PortfolioProjectViewer.close()` |
| `window.CoverFlowEngine.restoreSession(state)` | Restores the selected cover-flow mode and project | `window.CoverFlowEngine.restoreSession({mode:'simple',projectId:'dls'})` |
| `window.PortfolioPopupManager.register(...)` | Registers a single click-away/Escape policy | See example below |
| `window.PortfolioProjectPrefs.get('dls')` | Reads per-project local presentation preferences | `console.log(window.PortfolioProjectPrefs.get('dls'))` |

### Shared popup example

```js
const unregister = window.PortfolioPopupManager.register({
  panel,
  trigger: openButton,
  isOpen: () => !panel.hidden,
  close: () => { panel.hidden = true; }
});
// Call unregister() if the component is destroyed.
```

### Media catalog example

```js
const images = [
  { original: 'images/screenshot-1.webp', title: 'Sign in', type: 'DLS' },
  { original: 'images/screenshot-2.webp', title: 'Dashboard', type: 'DLS' }
];
window.PortfolioProjectViewer.openCollection(images, 0, clickedPreview);
```

Large project screenshots use `object-fit: cover` in the small card preview to fill available space, with editable focus coordinates. The fullscreen viewer uses `contain` to display the entire image without distortion; **Actual size** shows its source pixel dimensions when possible.

## Accessibility and UI

- One SVG gear path is reused for the site and project settings; the Archive retains the same graphic.
- Custom scrollbars use shared tokens across the main document and Shadow DOM components, with native touch scrolling preserved where possible.
- Hover animation is optional and reduced motion is respected.
- Gallery arrows and Escape work on keyboards; pointer drag works on mouse and touch.

## Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md): modules, state and data flow, boundaries, iframe bridge.
- [`CHANGELOG.md`](CHANGELOG.md): what was changed, why and which tests were run.
- [`TECHNICAL_DEBT.md`](TECHNICAL_DEBT.md): known duplication, risk and next refactors.
- [`TEST_CHECKLIST.md`](TEST_CHECKLIST.md): desktop/phone acceptance checks.
- [`docs/RELEASE_WORKFLOW.md`](docs/RELEASE_WORKFLOW.md): develop / main / old-version branching and Pages policy.

## Branches

- `old-version`: permanent snapshot of the original March 2026 profile.
- `develop`: working version and tests, **not automatically the public site**.
- `main`: approved production website, published only after the owner signs off.
