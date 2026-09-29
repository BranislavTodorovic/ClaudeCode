# R3 Work acceptance — steps 7–19

Status: **Work VERIFIED** on 2026-09-29. Gate R3 remains **PENDING** until the other six post-Home worlds pass separately. The first unresolved item is **R3 Personal / Fitness step 1: open `docs/ui-reference/02-personal-fitness.png`**. Work steps 1–6 and the approved-image analysis are recorded in `work-analysis-2026-09-29.md`.

## 7–9. Static structure, local assets and real behavior

- The R3 Work landing is inside the canonical `#workView` and R1 scene/shell. `index.html` loads `work/work-redesign.css` and `work/work-redesign.js` after their dependencies. The prior Work tracker, projects form, timeline, filters, item/task dialogs and history remain below the landing or in the Work Projects subview. The new layer adds no storage key, route parser or animation scheduler.
- `assets/scenes/work/hero-r3.png` is a separate clean 1672×940 imagegen scene (source ID `exec-fecd4dcb-431f-4ca1-9482-68b4c7b2d8be`), with monitors high on the right and a sunset city window. The R1 original `hero.png` remains intact. `assets/scenes/manifest.json` and the R1 world registry name the R3 scene. The scene is decorative; UI remains live HTML.
- Six generated portal PNG originals remain intact, and `assets/scenes/work/portals/manifest.json` records their scene subjects, runtime fallback and 640px quality-82 JPEG display derivatives. The six JPEGs total **637,564 bytes**, down from 13,457,156 bytes of PNG originals. All six displayed at natural width 640 with `data-asset-state="ready"` in the browser. The focused asset test checks the exact portal order, both file families/signatures and an 800 KB display budget.
- Work item, project, task and reminder values come from the existing Work owner. Productivity remains the owner of the timer; Notes remains the owner of notes. Work summary counts, Today/This Week/All date filters, saved project progress, local reminder times, task completion and task rows use those owners without sample data. Unsupported meeting schedules, ambience, profile/weather and focus scores are not fabricated. Team, Documents, Meetings and Templates say they are coming in the Work submodule rollout and give a truthful notice on activation; R4/R5 must implement their dedicated surfaces.
- New task chooses an active Work item and opens the existing `New task` dialog; if there is no active item it hands off to the existing `New work item` dialog. Task rows now open the owning Work detail panel and focus the exact task checkbox (or the row when the checkbox is disabled). New project opens the existing Work Projects form; Board opens the existing Work board; Meeting notes and Focus session focus the existing Notes and Productivity controls. Search hands off to the Work filter. Rejected navigation leaves the current page and search state alone.

## 10–11. Approved-reference fidelity and responsive matrix

The actual `docs/ui-reference/01-work.png` was reopened and inspected at original pixels before the R3 fidelity work. The settled [2048×1152 Work capture](screenshots/onespace-r3-work-2048.jpg) was visually compared with it: a warm productive desk studio with left foliage, central sunset depth, visible monitors on the right, a left hero/search/action cluster, four dark glass summary panels and six image portals beneath. The screenshot contains actual local task, reminder and project data; the reference's illustrative names, weather, meeting times and metrics were not copied. At smaller widths the canonical eight-world navigation and cards reflow rather than reproducing the reference's incomplete sample nav.

| Browser CSS viewport | Summary columns | Portal columns | Document width / overflow | Evidence |
|---|---:|---:|---:|---|
| 2048×1152 | 4 | 6 | 2033 / none | [desktop](screenshots/onespace-r3-work-2048.jpg) |
| 1920×900 | 4 | 6 | 1905 / none | Browser layout matrix |
| 1440×900 | 4 | 3 | 1425 / none | Browser layout matrix |
| 1024×900 | 2 | 3 | 1009 / none | Browser layout matrix |
| 760×900 | 2 | 2 | 745 / none | [tablet](screenshots/onespace-r3-work-760.jpg) |
| 390×844 | 1 | 1 | 375 / none | [mobile](screenshots/onespace-r3-work-390.jpg) |
| 1024×576 effective 200% case | 2 | 3 | 1009 / none | [effective zoom](screenshots/onespace-r3-work-200pct-equivalent.jpg) |

The effective 200% case halves the 2048 reference's CSS viewport to 1024×576, as in R2. The available in-app browser did not provide a reliable native page-zoom control, so this is explicitly a scale-equivalent rendering, not a claim of native zoom automation. The 390 and 760 captures were opened and visually inspected. All widths retained the Work controls and no horizontal document overflow.

## 12–14. Access and cinematic lifecycle

- Keyboard Enter on New task expanded the chooser, moved focus to its Work-item select and showed a visible focus outline. Enter on Cancel collapsed it, restored focus to the New task trigger and reset `aria-expanded`. Buttons, inputs, date tabs, portal actions and task rows have accessible names; portal actions cover their cards. On touch widths, date tabs, inline actions, rows and key inputs reach at least 44px height. The shared `@media (hover: none)` rule removes transform-only hover effects; `:focus-visible` remains distinct.
- Only after the static comparison, Work-specific scene wake, hero/card/portal reveal and a very restrained practical-light opacity loop were attached to the existing `shared/cinematic-scenes.js` state machine. Full entered with a 2350ms scene wake and reached ambient; Subtle entered with 1050ms and no ambient loop; Off entered `still` with no reveal animation; the app's reduced-motion setting entered `still` and removed transitions. The shared controller owns exit/reset, and eight Work→Home→Work cycles retained exactly one Work stage, one scene host and six portal cards.

## 15–17. Failure, navigation, regression and performance

- A fresh isolated browser origin showed zero tasks/items/projects and truthful empty next actions, with no invented meeting or account data. A separate local test server deliberately returned 404 for the R3 Work scene and Projects portal image. The scene and card both reported `fallback`; the gradient, labels, controls and Work summaries remained legible, and the image-less Projects portal still opened `#/w/work/projects`. The generic scene-host regression also checks loading, image error and stale completion handling. The temporary server was removed after the check.
- The Work Projects direct hash and reload both kept the Projects form visible and the main landing hidden. Work→Projects Back/Forward restored the matching subview. Home's Work portal loaded the revised scene and still navigated to Work. The Team portal gave an availability notice; the live Kanban portal reached the existing board. Meeting notes reached `#/u/notes` with `notesNewBody` focused; Focus session reached `#/u/productivity` with `focusStart` focused. The Work search reached the Work filter with the entered query and focus.
- Browser creation of a disposable Work item and dated task updated My Tasks from 0/0 to 0/1; checking its task in the owning detail panel changed it to 1/1 and Open tasks to 0. A saved 15:00 local Work reminder appeared in Today's Schedule as 3:00 PM. Today, This Week and All tabs changed pressed state and showed the expected task. Task-row activation focused that exact task in the owning panel. The test origin is separate from the user's normal OneSpace origin.
- Focused regression: `node --preserve-symlinks --preserve-symlinks-main --test tests/work-redesign.test.js tests/redesign-foundation.test.js tests/structure.test.js` → **18/18 passed**. Final full regression: `node --preserve-symlinks --preserve-symlinks-main --test tests/` → **183/183 passed, 0 failed, 0 skipped** after the task-focus change. This includes existing Work/project rejected-write coverage and the new owner-handoff/deleted-target tests. `git diff --check` exited 0.
- A 30-run Node model stress check with 10,000 tasks, 3,000 items and 3,000 projects had a 6.12ms median and 18.03ms maximum on this machine; the rendered landing caps visible task and project rows at four each. The six portal transfer images total 637,564 bytes. Eight SPA navigation cycles did not duplicate Work stage/scene/portal nodes.

## 18–19. Decision

The Work-specific static, behavior, responsive, access, motion, fallback, route, regression and performance evidence above satisfies R3 Work steps 7–18. **Work is VERIFIED**. The first unresolved checklist step is **R3 Personal / Fitness step 1**, and Gate R3 remains pending.
