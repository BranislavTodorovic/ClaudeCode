# R3 Work reference analysis — steps 1–6

Status: actual `docs/ui-reference/01-work.png` opened and inspected at original pixels on 2026-09-29. Steps 1–6 are analysis; Work implementation and Gate R3 are **NOT VERIFIED**. The R2 Home gate passed before this analysis.

## 2. Image-specific composition and motion observations

The approved Work frame is 1672×941, using the same warm premium interior family as Home but with a distinctly productive desk studio. Soft leaves and string lights frame the left foreground. A city/sunset window, warm task lamp, shelves and plants form middle depth. Large generic monitors, keyboard and chair anchor the right side. Amber practical light contrasts with near-black/navy glass and restrained cyan/blue/green progress accents. The rendered UI floats in front of this scene; monitor content in the composite is scene context, not production UI to copy.

The brand sits upper left, compact sample navigation upper center and search/bell/avatar controls upper right. Hero copy/search/actions fill x≈60–850 and y≈135–390. Four dense summary panels span x≈35–1640 and y≈405–680. Six image portals run in one row around y≈690–900, with lower title strips and arrows. The four summaries are materially denser than Home: tabs and check states in My Tasks; time-stamped rows in Schedule; four progress rows; a focus ring plus ambience/media/metrics. Responsive risks are the eight-world canonical nav, dense four-card row, long task/project labels, progress bars and six portal targets. At narrower widths these must reflow and preserve keyboard/touch controls. Plausible world-specific motion is a short warm desk/monitor wake, restrained practical-light ambience and staged hero/cards/portals; real timer/progress changes can animate only when backed by state. Off/reduced motion must be fully legible and still.

## 3–4. Visible inventory and portal map

| Region | Reference controls/content | Canonical action or later submodule |
|---|---|---|
| Global shell | Brand; Home/Today/Work/Explore/AI Assistant sample nav; search, notification and profile controls | Reuse R1 eight-world shell and its Today/Shortcuts/Notes/Command utilities. No invented account/notification/AI state. |
| Hero | Date/weather line, large Work greeting, subtitle, capture/search input, Ctrl+K and arrow | Local date/greeting; real Work-context capture/search or a clearly named owner handoff; command shortcut. Omit unsupported weather/name. |
| Quick actions | New task; New project; Open board; Meeting notes; Focus session | Existing Work/Projects, Work board, Notes and Productivity actions where the named operation is real. Do not imply a dedicated Meetings editor before R5. |
| My Tasks | Today/This Week/All tabs, 6/10 completion ring, four checked/open rows and row arrows | Work-owned `orbit-work-tasks` plus related items; actual completion and detail actions, date filters only where Work dates support them. No sample 6/10 or sample titles. |
| Today's Schedule | View Calendar and four timestamped meeting/work rows | No Work meeting/time schedule owner exists yet. Show truthful empty/unavailable schedule and link to the actual local planner where useful; no fictional meeting times or sync. |
| Project Progress | View All, four project icon/title/progress/arrow rows | Actual Work-owned projects and their saved progress or a documented task-derived figure; route to current Work Projects. No sample names/percentages. |
| Focus & Productivity | Overflow menu, timer ring, ambience artwork/waveform/control, focus/task/flow/mindset metrics | Existing Productivity timer and actual task state only. Omit unsupported ambience, focus history, psychological/flow/mindset scores and fake playback. |
| Projects portal | Image, label, subtitle, arrow | Current Work Projects UI; R4 later deepens its nested route/detail contract. |
| Kanban Board portal | Image, label, subtitle, arrow | Existing Work Board is an interim real Work surface; R5 implements the full dedicated Kanban contract. |
| Team portal | Image, label, subtitle, arrow | R5 Work-owned local team directory; explicitly future-disabled until implemented. |
| Documents portal | Image, label, subtitle, arrow | R5 Work-owned documents; explicitly future-disabled until implemented. |
| Meetings portal | Image, label, subtitle, arrow | R5 Work-owned meetings; explicitly future-disabled until implemented. |
| Templates portal | Image, label, subtitle, arrow | R5 Work-owned template library; explicitly future-disabled until implemented. |

The R1 portal registry fixes Work order and slugs as `projects`, `kanban-board`, `team`, `documents`, `meetings`, `templates`. A card may not silently redirect to a generic parent. A later-phase submodule may remain an explicitly labelled unavailable surface while R3 builds the main world, in accord with the manifest's portal rule and the R1 architecture lock; R4/R5 must replace those states with dedicated usable UIs.

## 5. Reference and architecture conflicts resolved

The sample navigation is not a different Work-only shell; use the canonical eight-world order and utility routes. “Alex”, avatar, sunny weather, 18°C, unread notification, monitor dashboard, sample tasks, scheduled meetings, project names/percentages, forest ambience, 3.2h focus, 6/10 tasks, High flow and Calm mindset are illustrative. They must not be presented as live. The source image contains baked UI, so runtime Work art must be an independent clean scene. R1 created and proved `assets/scenes/work/hero.png`; R3 subsequently added the separately documented `assets/scenes/work/hero-r3.png` for closer approved-image composition while preserving the R1 original. Work projects, work items, tasks and history remain Work-owned. The generic Productivity timer/tasks and Notes stay with their existing owners; a Work action may navigate to those utilities but must not create a parallel Work record or quietly mix stores. Work → Projects is the R4 pilot after R3; R3 keeps the current Projects functionality and cannot claim R4 detail acceptance early.

## 6. Dynamic-value source classification

| Value or state | Classification | Rule |
|---|---|---|
| Date, time-of-day greeting | `LOCAL_DERIVED` | Current local clock; deterministic time injection in focused tests. |
| User name/avatar/weather/unread/account | `FUTURE_DISABLED` or `OPTIONAL_PROVIDER` | Omit unless an explicit user profile or approved provider exists; no sample values. |
| Work task names/completion and filtered counts | `USER_ENTERED` + `LOCAL_DERIVED` | Work-owned item/task records only; invalid/empty state remains truthful. |
| Schedule entries/times/calendar sync | `FUTURE_DISABLED` until Work Meetings exists; local planner link is `LOCAL_CORE` | No meeting schedule or external calendar claim from screenshot. |
| Project names/status/progress | `USER_ENTERED` + `LOCAL_DERIVED` | Existing Work project owner; label saved vs task-derived progress honestly. |
| Focus timer/status | `LOCAL_CORE` | Existing Productivity timer; link to its controls rather than duplicate timer ownership. |
| Ambience/media playback and focus/flow/mindset metrics | `FUTURE_DISABLED` | No real controller/history/psychological source; use neutral empty state or omit. |
| Quick actions and implemented portal routes | `LOCAL_CORE` | Reuse canonical owner action and hash route with success/failure feedback. |
| Team/Documents/Meetings/Templates cards | `FUTURE_DISABLED` until R5 | Visible status and useful parent return, with no dead interactive card. |
| Work scene/portal artwork | Decorative local asset | R1 manifest provenance; independent scene and fallback, never the approved composite screenshot. |

Work steps 7–19 and the R3 Work VERIFIED decision are recorded in `work-acceptance-2026-09-29.md`. The next unresolved checklist step is R3 Personal / Fitness step 1; Gate R3 remains pending.
