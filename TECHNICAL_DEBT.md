# Technical Debt Register

Severity is relative to upcoming MyPortfolio Stage 2, not a claim of production outage.

| ID | Priority | Debt | Impact | Recommended remedy / completion criterion |
|---|---|---|---|---|
| TD-01 | High | 3 MB standalone HTML with embedded image data, JS modules and CSS | Source navigation, code review and caching are difficult | Extract `assets/`, `styles/`, `src/`, keep a zero-build option; snapshot test before/after |
| TD-02 | High | DVD remote bridge remains in a draft PR | Parent border/title cannot reliably track remote logo color across origins | Review/deploy the `dm:DVD:STATE` bridge, verify origin checks, phone animation tests |
| TD-03 | Medium | Fullscreen viewer CSS has prior legacy `full-shot-*` rules | Dead styles make further changes harder | Remove dead rules after all viewers and project skins pass visual regression tests |
| TD-04 | Medium | ASCuarium original icon shown in feedback does not match what owner expects | Wrong project branding | Ask for the actual authored source file or confirmed asset path; replace without inventing a new icon |
| TD-05 | Medium | More WSLX screenshots were referenced but are unavailable as editable assets | Gallery incomplete | Import owner-provided original files and captions; keep existing authentic shots intact |
| TD-06 | Medium | Other duplicated button/icon/modal styles remain in the standalone CSS | Visual inconsistencies may recur | Consolidate shared design tokens and controls progressively; preserve project skin overrides |
| TD-07 | Medium | No CI pipeline for branch gates and regression checks | Visual regressions may reach `main` | Add syntax and Playwright smoke workflow for `develop` and PRs, then acceptance checklist |
| TD-08 | Low | Native-sized media uses browser scrolling rather than a dedicated pan/zoom image engine | Limited zoom experience on tiny screens | Add inertial pan only if acceptance tests show demand; do not fork viewer again |
| TD-09 | Medium | Album animation and iframe performance not measured on physical Samsung hardware | FPS uncertainty | Use Chrome DevTools Performance/remote debugging and real phone tests; log measured frame data |

**Principle:** refactor only when it removes known duplication or solves a measured problem. Avoid 'architecture for architecture's sake'.