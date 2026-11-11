# Development Pages policy — 2026-11-10

## Decision
- For this active iteration, **GitHub Pages should publish `develop`**, not `main`, so the owner can review work in the browser before a stable version is declared.
- `old-version` remains the original website backup.
- `main` remains the stable release line, currently the original site.
- `release/r1.5` remains a frozen previous R1.5 candidate.
- `feature/r1.6-settings` is where unfinished R1.6 settings work begins. Merge vetted changes to `develop` for live inspection.

## One-time Pages change (owner action)
Open repository **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, branch `develop`, folder `/(root)`, then **Save**. Only repository admins/maintainers can change Pages settings. The GitHub connector cannot perform this admin action. Verify the displayed Pages URL and check the deployed commit after publishing.

## Before publishing the latest user-tested R1.5
The newest independently uploaded `MyPortfolio-R1.5(1).html` **is not byte-identical** to `develop/index.html` at previous commit `567e097d392104931498870d275a7b387a419f02`. Do not assume the latest owner-tested changes were committed. The owner has a locally generated publishing kit with a SHA-256-locked source HTML that can safely commit the exact tested file to `develop` and sync it to `feature/r1.6-settings`; no production merge is needed. Keep the separate carousel sound proof-of-concept on the feature branch, not in the released `index.html`.

## Development workflow
1. Work in `feature/r1.6-settings` (or a smaller feature branch), with no GitHub secret stored in client code.
2. Verify scripts, responsive layouts, accessibility, controls and project embeds.
3. Integrate reviewed changes into `develop` and inspect hosted Pages on desktop and real phone.
4. Record what changed, how it was implemented, tests actually performed and remaining issues in bullet points.
5. When a stable version is approved, create a PR from `develop` or a frozen stable snapshot to `main`; merge only after QA.
6. Optionally switch Pages back to `main` after the development/review period.

**Warning:** While Pages points to `develop`, its content is public. No unpublished secrets or unreviewed broken states should be merged there.

## Updated evidence: 2026-11-11

A GitHub Pages build/deployment workflow completed successfully for WP2 HTML commit `94cf380` on branch `develop`: https://github.com/DorManDel/Dor-s-Profile-Site/actions/runs/43109657133 . The site code is in the branch; independent public URL/manual Samsung visual checks remain pending.
