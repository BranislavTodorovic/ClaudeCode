# R2 Home reference analysis — steps 1–5

Status: analysis complete; Home implementation and Gate R2 remain **IN PROGRESS**. The actual `docs/ui-reference/00-home.png` was reopened at original resolution immediately after Gate R1. This file is the approved visual authority for Home, not a production background.

## Step 2 — image-specific observations

The reference is 2048×1152. A dark, leafy left foreground frames a deep living-room scene. Amber bookcase strips and a fireplace light the middle depth; the right third opens to floor-to-ceiling glass, water/city sunset and a lounge chair. The scene remains visible behind the entire page, including the lower portals. Navy translucent cards have thin blue/white edges and controlled glass blur; blue/cyan highlights draw the eye without replacing the warm room light. No generic space/starfield treatment belongs here.

The global brand starts at top-left; compact pill navigation sits near top center, utilities at top-right. Hero content occupies the left upper third: context strip, large greeting, short subtitle, luminous capture bar and a one-line action chip row. The capture field is about 45% of viewport width. Four summary panels form one row around mid-page, from x≈45 to 2000 and y≈500 to 740. The six image portals form a lower row around y≈755–1090. The Now, Today, Next and Pulse cards have much denser content than the hero, with small headings, list cells, timer ring, thumbnails, tiny chart and counters. Portal images occupy most of each tile, with dark title strips at the bottom. Responsive risks are the eight-world navigation, four-card row, six-portal row and long local values; these must reflow rather than clip at 1920/1440/1024/760/390 and 200% zoom. Motion cues: slow practical-light/fire/foliage ambience, restrained scene depth, timer ring/waveform activity, card hover, staged hero/summary/portal entry; static contrast and reduced-motion fallbacks are mandatory.

## Step 3 — complete visible region/control inventory

| Region | Visible controls or content |
|---|---|
| Global shell | OneSpace brand/Home link; Home, Today, Explore and AI Assistant/Command sample nav; search icon; notification bell; profile/avatar/dropdown. Canonical shell must expose all eight worlds and compatibility utility access even though reference nav shows only four sample labels. |
| Hero | Date/weather context strip; greeting and subtitle; large capture/search input; Ctrl+K affordance; submit arrow; quick actions Plan my day, Brainstorm ideas, Track my progress, Find a place to visit. |
| Now | Header/action arrow; active focus label and duration; timer ring and remaining time; ambience artwork/title/description/waveform; media/action arrow. |
| Today | Header count and Add button; three illustrated task rows with status circles, title and time. Each row/status affordance needs a real action if rendered interactive. |
| Next | Header count/action arrow; two upcoming rows with icon, title/description/date. |
| OneSpace Pulse | Header/action arrow; waveform/progress art; qualitative status; four small metric cells. |
| Portal row | Work, Personal/Fitness, Discover/Explore, Media & Games, Projects & Notes, Settings; each image tile has a label, subtitle and arrow/activation target. Media & Games offers two explicit destinations. |

## Step 4 — data and action classifications

| Reference value/action | Classification and truthful implementation rule |
|---|---|
| Date and time-of-day greeting | `LOCAL_DERIVED` from current clock with deterministic test-clock injection; locale formatting. No fixed “Tue Apr 9” or “Good morning” at other times. |
| “Alex” avatar/name | `USER_ENTERED` only if profile name is explicitly stored; otherwise neutral “you”/profile control. Do not copy sample face. |
| Sunny weather, 18°C, clear skies | `OPTIONAL_PROVIDER` only if approved and configured; otherwise omit with no fake weather. |
| Capture input and Ctrl+K | `LOCAL_CORE`: route to existing OneSpace search/command or actual Quick Capture workflow. Never silently save text as an unrelated record. |
| Four quick-action chips | `LOCAL_CORE`: Productivity day planner; Notes/idea capture; real local progress destination; Explore destinations. Route/perform the named action with focus feedback. |
| Focus session time/ring/status | `LOCAL_CORE` current Productivity timer state, `LOCAL_DERIVED` ring/progress. Show stopped/ready if idle; do not use sample 32:00. |
| Forest Ambience artwork/waveform | Only if an actual local ambience selection/media controller exists (`USER_ENTERED`/`LOCAL_CORE`); otherwise a truthful neutral “No ambience selected” state and no fake waveform/playback. |
| Today task count/titles/completion | `LOCAL_DERIVED` from real Productivity tasks (and only supported owner data), with `USER_ENTERED` titles/due times. Add/complete route to actual task actions. No copied sample tasks or schedule. |
| Next count/title/date | `LOCAL_DERIVED` from real upcoming dated tasks/countdowns/work items where valid. Empty state when none. No copied trip/article names/dates. |
| Pulse plot and focus/activity/balance/mood | `LOCAL_DERIVED` only where there is transparent source/meaning; unsupported psychological/wellness/device values are `FUTURE_DISABLED` or omitted. No “great flow”, 3.2h or fabricated mood. A small local summary can show explicitly named counts such as open tasks, active projects and saved notes with no speculative score. |
| Portal labels and scene art | Labels are `LOCAL_CORE` navigation; clean generated scene assets are repository-local decorative media with recorded provenance. No sample screenshot tiles or third-party art. |
| Notification/account buttons | `LOCAL_CORE` only where actual notifications/profile controls exist; otherwise explicit unavailable/hidden. No unread badge, avatar, subscription or profile name without source. |

## Step 5 — conflicts resolved before coding

The reference's compact nav omits several approved worlds; use the R1.1 eight-world canonical shell, with Today/Command utilities. The “Media & Games” tile is a two-destination group, never a ninth datastore/world. The old `projects` route remains Work Projects while `projects-notes` is its own aggregate world; until its R3 implementation, Home must show an honest unavailable state rather than relabel Work as Projects & Notes. The approved composite screenshot cannot be a runtime background; use `assets/scenes/home/hero.png` and independent DOM cards/controls. The sample date, profile, weather, tasks, focus, ambience, pulse, counts and destination imagery must be replaced by real local/derived/user data or honest empty/unavailable states. Existing backup v4 and canonical Work/Notes/Productivity/Shortcuts owners remain untouched.

Next unresolved R2 step: **6. Build clean background/scene assets**. The R1.3 Home scene is already present and its asset contract verified; R2 still needs to bind it into the Home host and verify fallback in the actual page before static structure/fidelity acceptance.

Subsequent completion: steps 6–12 are recorded in `home-static-fidelity-2026-09-29.md`; steps 13–17 and Gate R2 in `home-acceptance-2026-09-29.md`. The sentence above is the historical resume point at the end of this step 1–5 analysis.
