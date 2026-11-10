# MyPortfolio — development and release workflow

_Last updated: 2026-11-09_

## Repository

- Source repository: https://github.com/DorManDel/Dor-s-Profile-Site
- `old-version`: permanent snapshot of the original March 2026 profile site, created directly from the former `main` commit `e74bf69593b2e92a91ccbb3600744ff04dbb967b`. Do not modify this branch.
- `main`: public release branch. Currently still serves the old site until the upgraded portfolio is approved and merged. After that, it will serve the upgraded site. Do not push unreviewed builds here.
- `develop`: integration branch for the next candidate release.
- `feature/<short-description>` (optional): isolated changes before merging into `develop`.

The original site's source is already preserved on `old-version` independently of future `main` changes. The old profile site also remains on `main` until the replacement portfolio is explicitly approved.
`VisualArchive` is a separate repository; we should identify which components need to be
shared or reused without silently overwriting that project's source.

## GitHub Pages

Historical evidence: a successful "pages build and deployment" workflow run was triggered
from `main` on 2026-03-31. **The exact current Pages source setting has not been read.**

Inspect: Repository → **Settings → Pages → Build and deployment**.

For this static website, the simplest recommended configuration is:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

If the repository instead uses a GitHub Actions deployment workflow, keep the production
deployment trigger restricted to `main`. Avoid having two competing deployment methods.

Changing the Pages source requires repository administration privileges. Do not infer that a
push to `develop` changes the public site; it should not.

## Repeatable release process

1. Implement and document Round N changes on `develop` or a dedicated feature branch.
2. Keep an executable preview and the original project assets together; verify relative URLs.
3. Run syntax/interaction tests, desktop responsive checks and phone smoke checks.
4. Write/update `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`,
   `TECHNICAL_DEBT.md`, and `TEST_CHECKLIST.md` for the candidate version.
5. Provide a concrete checklist of defects fixed and features still unverified.
6. **Wait for the owner's approval** before changing production `main`.
7. Create a pull request from `develop` to `main`; review changed files and possible regressions.
8. Merge only the approved candidate. Confirm GitHub Pages reports successful deployment
   for that exact `main` commit.
9. Test the public URL in desktop and mobile browsers. Record acceptance and any follow-up bugs.

## Version acceptance criteria

- Main site, Visual Archive and project gallery work on desktop and mobile.
- All gallery images and accessibility labels work; no significant horizontal overflow.
- Popups, scrolling, keyboard behavior, touch navigation and reduced motion are tested.
- Per-project settings and visitor preferences persist as intended.
- The DVD iframe bridge (when shipped) does not modify the original bounce physics and
  is validated on its actual hosted origin.
- Known limitations are recorded, not reported as complete.
- The site has no private tokens, local machine paths or sensitive files exposed in the repo.

## Documentation map (candidate release)

| File | Purpose |
|---|---|
| `README.md` | What the portfolio is, how to run and extend it, key technologies |
| `ARCHITECTURE.md` | Modules, data flow, iframe communication, persistence, responsibilities |
| `CHANGELOG.md` | Version-by-version human-readable changes and rationale |
| `TECHNICAL_DEBT.md` | Duplicated logic, risks, priority, owner and remediation criteria |
| `TEST_CHECKLIST.md` | Actual test steps, observed results, unresolved checks |
| `docs/RELEASE_WORKFLOW.md` | Branch, review and deployment policy (this document) |

Every reusable component (image viewer, modal manager, settings controls, gallery, etc.)
should have a short usage example in the README or architecture documentation.

## Architecture guardrails

- Prefer one implementation per shared behavior, with style variants instead of cloned logic.
- Favor plain, readable JavaScript/CSS and simple interfaces over unnecessary abstractions.
- Use a shared design token system for gear icons, controls, modals and scrollbars.
- Preserve external project behavior when embedding via iframes; communicate via a small,
  origin-checked `postMessage` contract when cross-origin state is needed.
- Separate persisted visitor preferences from per-project presentation settings.
- Keep original image assets. Use crop/focus for card previews and full image for zoomed views.
- Don't rewrite approved Visual Archive interactions merely to match an implementation elsewhere.

## First pending candidate

Round 1.5 is **not yet approved**. The standalone Round 1.4 review build exists outside
this repository; it has known follow-up issues and must not overwrite `main`.

Once the Round 1.5 source and assets are validated, commit the complete deployable site
to `develop`, then submit the approved version to `main` via a PR.
