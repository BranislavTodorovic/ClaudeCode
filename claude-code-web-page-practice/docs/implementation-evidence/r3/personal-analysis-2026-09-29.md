# R3 Personal / Fitness reference analysis — steps 1–6

Status: the actual `docs/ui-reference/02-personal-fitness.png` was opened at original pixels on 2026-09-29. Steps 1–6 below are analysis only; **Personal / Fitness is NOT VERIFIED**, and Gate R3 remains pending. Work was individually VERIFIED before this step. The next unresolved step is **Personal / Fitness step 7: build the reference-led static structure and clean local portal assets**.

## 2. Image-specific composition and motion observations

The 1669×940 approved frame belongs to the same warm interior family as Home and Work but reads as a wellness studio joined to a calm living room. Dark foliage, candlelight and a soft sofa anchor the left foreground. Amber shelves and practical lamps, plants and a dumbbell rack form middle depth. A mat, blocks, water bottle and exercise ball mark the central floor. Tall right windows carry pink-orange sunset and city depth. The UI is dark glass with fine light borders; cyan/green, violet, warm orange and blue accents distinguish sample wellness categories without changing the overall room palette.

The brand and conceptual nav occupy the first 110px. Hero copy, wide search/capture field and five small quick actions occupy roughly x≈105–900 and y≈150–398. Four dense summary cards span x≈30–1640 and y≈416–681: a large radial graphic with components, an untidy-time risk in the plan rows, colorful habit dots, and compact health metrics. Six image portals run across x≈30–1640 and y≈694–909 with a dark lower label strip and arrow. Narrow widths must reflow the dense four-card and six-card rows while keeping the canonical eight-world nav, search and action targets usable. Plausible motion is a short warm-room/lamplight wake, gentle staged hero/card/portal reveal and very quiet ambient light; no animated score, heart-rate wave or habit streak is allowed without real state. Off/reduced motion remains fully readable and still.

## 3–4. Visible controls, dynamic regions and portal map

| Region | Approved-image controls/content | R3 owner/action or later phase |
|---|---|
| Global shell | Brand, sample Home/Today/Explore/Personal/AI nav, search, bell, avatar | Reuse the canonical R1 eight-world shell and utility access. No invented profile, unread or AI provider. |
| Hero | Local date/weather line, personal greeting, search/capture, command shortcut | Use local date and owner-backed Personal search or clear handoff. Omit unsupported name and weather. |
| Quick actions | Start a workout; Meditate now; Log a meal; Plan my day; Track a habit | Workout, mindfulness and meal flows belong to R5 and require truthful unavailable states until built. Plan my day can hand off to the existing Productivity owner; Track a habit can focus the existing Personal habit form. |
| Today's Wellness | Score 82 ring; Movement/Mind/Nutrition/Recovery bars | No total score formula or category activity records exist. Show actual Personal goal/routine/habit completion components and label them accurately, or an empty state; do not copy 82 or category percentages. |
| Today's Plan | Five scheduled meditation/workout/meal/focus/wind-down rows, completion controls and add | Existing Personal routines have text/done only, without date/time. Do not present them as timed appointments. An honest untimed Personal routine list and handoff to Productivity Today may be shown; a dated Personal planner is R5/R6 work. |
| Habits & Goals | Four sample activities with weekly counts and day dots | Existing `orbit-personal-habits` and goals contain text, optional habit frequency/target and one boolean done flag. Render actual completion, targets and counts; no daily history, streak or claimed weekly frequency can be derived from the boolean. |
| Health & Recovery | Sleep, HRV, steps, calories, stress, mini graphs | No such local records or provider exists. Show a clear future-disabled/empty health state and no fabricated biometrics or diagnosis. |
| Mindfulness portal | Image, label, subtitle, arrow | R5 Personal Mindfulness submodule; future-disabled until real guided/session UI exists. |
| Fitness portal | Image, label, subtitle, arrow | R5 Fitness/workout/exercise submodule; future-disabled until implemented. |
| Nutrition portal | Image, label, subtitle, arrow | R5 local meal/nutrition submodule; future-disabled until implemented. |
| Recovery portal | Image, label, subtitle, arrow | R5 recovery logging submodule; future-disabled until implemented. |
| Personal Life portal | Image, label, subtitle, arrow | Existing Personal goals/routines/habits are an interim real owner surface; R5 later provides the dedicated submodule. |
| Home Wellbeing portal | Image, label, subtitle, arrow | R5 local home-routines/preferences submodule; future-disabled until implemented; no smart-home claim without a provider. |

The R1 portal registry fixes the order `mindfulness`, `fitness`, `nutrition`, `recovery`, `personal-life`, `home-wellbeing`. An R3 card must provide its implemented owner action or an explicit unavailable explanation. R5 must replace future-disabled cards with dedicated usable surfaces; R3 cannot claim R5 acceptance early.

## 5. Reference and architecture reconciliation

The screenshot's “Alex”, avatar, sunny 18°C weather, alerts, score 82, 7:00–20:00 plan, weekly streak dots, HRV 78ms, sleep 7h32m, steps 8420, 420 calories, stress level and graphs are illustrative. The Personal owner currently persists only `orbit-personal-goals`, `orbit-personal-routines` and `orbit-personal-habits`, with text/done and optional habit frequency/target. The existing Personal controller provides add, edit, delete and completion with safe-write rollback; it is retained. Productivity owns generic tasks and timer. No Personal-specific workouts, meditation sessions, meals, sleep or biometrics are currently stored. The R1 `assets/scenes/personal/hero.png` is a separate clean local scene, visually inspected after the reference; it already has plants, warm lighting, equipment, mat and right sunset window and can be used without baking in the composite UI.

The reference's compact sample nav does not override the canonical eight-world order. Personal/Fitness stays one main world. Its portal destinations are later R5 submodules under Personal ownership, not extra main worlds. New persisted health/workout data would need the documented schema/migration/backup contract when R5 reaches those items.

## 6. Dynamic-value source classification

| Value/state | Class | R3 rule |
|---|---|---|
| Local date and greeting | `LOCAL_DERIVED` | Device clock only; no inferred user name/weather. |
| Personal goals, routines, habits, booleans and habit targets | `USER_ENTERED` + `LOCAL_DERIVED` | Read existing Personal owner and derive truthful counts/progress; do not call a single checkbox a daily streak. |
| Productivity task/timer handoff | `LOCAL_CORE` | Navigate to the existing owner without copying its records into Personal. |
| Wellness total score and specialty activity percentages | `FUTURE_DISABLED` | Omit until a documented formula and domain records exist. |
| Timed personal plan | `FUTURE_DISABLED` | Existing routines are untimed; never give them synthetic schedule times. |
| Workout, meditation, meal and recovery records | `FUTURE_DISABLED` until R5 | Show clear availability/next-action state, not a non-saving imitation. |
| Sleep, HRV, steps, calories, stress, weather, profile and unread alerts | `OPTIONAL_PROVIDER` or `FUTURE_DISABLED` | No current source; omit sample numbers and external sync claims. |
| Personal scene and portal artwork | Decorative local asset | Independent production files, manifest provenance and gradient fallback; no composite screenshot as runtime background. |

Next unresolved step: **R3 Personal / Fitness step 7**. Build static main-world structure and clean local portal assets after confirming the retained Personal form/control wiring; then execute steps 8–19 in order.
