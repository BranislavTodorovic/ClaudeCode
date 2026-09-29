# R2 Home acceptance and Gate R2

Status: R2 steps 1–17 **VERIFIED**; Gate R2 **VERIFIED** on 2026-09-29. The first unresolved work is R3 Work step 1, physically inspect `docs/ui-reference/01-work.png`. The preceding step 1–5 analysis is in `home-analysis-2026-09-28.md`; steps 6–12 and the visually compared responsive captures are in `home-static-fidelity-2026-09-29.md`.

## 13. Home scene lifecycle

After the static comparison passed, Home-specific scene/image, hero, card and portal CSS was attached to the existing `shared/cinematic-scenes.js` controller. There is no second animation scheduler. In the disposable browser, Full motion entered with `data-scene-state="entry"`, `osrHomeWake` on the local image and `osrHomeRise` on the hero. The controller then reached `settle` and `ambient`; [the settled 2048×1152 capture](home-2048-ambient.png) was visually inspected against the approved Home image and kept its scene/cards/portals legible. Ambient adds only a slow practical-light opacity change. Navigating to Work made Home `idle` and removed its entry class/animation; Back to Home replayed entry once. Eight repeated Work→Home cycles retained exactly one Home stage, one scene host, six portals and one Now timer node. No browser errors were recorded.

## 14. Motion preferences

Settings controls were exercised through the browser on the disposable origin. Full selected `osrHomeWake` at 2.35 seconds and the ambient glow. Subtle selected `osrHomeSubtleWake` at 1.05 seconds and settled with no ambient loop. Off entered the controller's `still` state with no image, hero or glow animation. The app's Reduced motion override also entered `still` with all three animations absent. The shared controller's automated reduced-motion/Off lifecycle tests passed. Home and shared CSS now follow the existing `force-full-motion` override when the device requests reduced motion, consistent with the Settings label; Auto/reduced keeps the page still.

## 15. Failure, empty and performance behavior

- The Home hero was deliberately withheld on a separate disposable `MISSING_ASSET=assets/scenes/home/hero.png` origin. The shared host reported `fallback`; [the final fallback capture](home-scene-fallback.png) showed a complete, legible Home with six portals and controls. The scene-host regression covers its image-error path, including corrupt/decode failure, and stale completion handling.
- The Work portal artwork was deliberately withheld on another disposable origin. The tile reported `fallback`, the existing generated local art fallback appeared within the Home portal, the other five tile images loaded, and [the capture](home-portal-fallback.png) was visually checked. Its Work button still opened `#/w/work` without a browser error.
- Fresh-origin Home showed truthful zero tasks/projects/notes, no upcoming item, no made-up weather/ambience/profile claim, and an empty-state next action. A rejected/unknown route normalizes safely; Projects & Notes presents its future status. Quick Capture keeps the draft and reports failure if the owner form does not persist a record.
- The Home model processed a stress fixture of 10,000 tasks, 3,000 projects and 3,000 notes in 53 ms on this machine, while rendering at most three Today rows and two Next rows. The once-per-second timer sync was changed from replacing the whole Now body to updating its text nodes. A focused browser regression held keyboard focus on “Open timer” across a clock tick. The eight navigation cycles had stable Home element counts and zero console errors.

## 16–17. Regression, evidence and gate decision

- Full suite: `node --preserve-symlinks --preserve-symlinks-main --test tests/` → **178 passed, 0 failed, 0 skipped** after the final code changes.
- Focused in-app browser smoke: `homeRouteBridge`, `homeInteractions`, `homeTimerFocus`, `routes`, `themeOverride` all passed. This covered direct Work Projects, Board hash updates, Back/Forward, Home direct/unknown links, keyboard activation of Games/Movies portals, Today Add focus, empty capture focus/notice, every existing world/utility route and appearance reload. Browser error log: empty.
- `git diff --check` exited 0. The tracked source diff was reviewed after the final changes. Original approved references remain under `docs/ui-reference/`; runtime assets come from `assets/scenes/`.
- The responsive [capture matrix](home-static-fidelity-2026-09-29.md) includes the scale-equivalent 200% rendering method and explicitly distinguishes it from the in-app browser's native zoom control. It checks the 1024 CSS-pixel viewport and 2× physical scale relevant to the 2048-pixel reference. The layout and controls passed at that effective scale.

Gate R2 decision: **VERIFIED**. Home structure, real local behavior, static/reference fidelity, responsive/accessibility behavior, one-controller cinematic lifecycle, motion preferences, failure/empty states, persistence/routes and evidence passed. Continue immediately with R3 Work in the documented per-world order.
