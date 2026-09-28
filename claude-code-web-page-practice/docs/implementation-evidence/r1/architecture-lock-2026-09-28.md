# R1.1 — canonical architecture lock

Status: VERIFIED 2026-09-28. This fixes implementation contracts before R1.2 shared visual work; it does not claim any redesigned route or UI is implemented. Gate R0 evidence and the eight inspected reference files are in `docs/implementation-evidence/r0/`.

## Shell and top-level registry

One responsive shell owns brand/header, primary world navigation, contextual search/Quick Capture entry, utility entry, announcements/dialogs and active state. The same shell is used across worlds. The canonical eight-world order and internal IDs are:

| Order | World | ID | Reference |
|---:|---|---|---|
| 1 | Home | `home` | `docs/ui-reference/00-home.png` |
| 2 | Work | `work` | `docs/ui-reference/01-work.png` |
| 3 | Personal / Fitness | `personal` | `docs/ui-reference/02-personal-fitness.png` |
| 4 | Explore | `explore` | `docs/ui-reference/03-explore.png` |
| 5 | Games | `games` | `docs/ui-reference/04-games.png` |
| 6 | Movies & Series | `movies` | `docs/ui-reference/05-movies-series.png` |
| 7 | Projects & Notes | `projects-notes` | `docs/ui-reference/06-projects-notes.png` |
| 8 | Settings | `settings` | `docs/ui-reference/07-settings.png` |

Reference screenshot navigation differs by world; it is treated as visual composition, not a different route model. Home's “Media & Games” portal offers separate Games and Movies destinations. `Today` and `AI Assistant / Command` are utility/subview surfaces, not main worlds. AI actions may only be enabled where the product has an actual implementation and data source; the shell can expose truthful unavailable states.

Shortcuts, Productivity, Notes and the legacy Projects alias stay accessible as compatibility surfaces. They inherit the shared shell, accessible controls and coherent tokens, with a restrained neutral scene treatment; no ninth reference-led world is invented. Legacy `projects` resolves to Work → Projects. The new `projects-notes` world is a distinct aggregation route. Existing `movies` remains canonical; no new `media` route is required. Any future `media` alias must normalize to `movies`.

## Route and history grammar

R1.2/R4 build a small registry around the current `goToPage` function rather than duplicate page-switching logic. Use hash routes on the static single-page host:

| Shape | Meaning |
|---|---|
| `#/w/<world-id>` | Main world overview |
| `#/w/<world-id>/<submodule-id>` | Dedicated submodule surface |
| `#/w/<world-id>/<submodule-id>/<encoded-record-id>` | Owner-backed detail/task surface |
| `#/u/<utility-id>` | Today, Command, Shortcuts, Productivity or Notes compatibility utility |

Route IDs are registry keys, not free-form display labels. Encode record IDs as one URL component and validate after decoding. The route registry yields `{world, submodule?, recordId?, owner, activeParent}`. `goToPage` remains the bridge for existing page content until each world migrates. Hash navigation is user-visible and participates in browser Back/Forward; hash changes must not create a second history entry. Initial empty hash reads the legacy `orbit-page` preference, normalizes known aliases and replaces the URL with a canonical route; direct hash wins over `orbit-page`. A route change updates `orbit-page` only through its existing safe write path; a rejected write must leave the visible route/state consistent and show feedback. No domain record is written by routing. Unknown world/submodule and deleted/orphan record routes render a recoverable missing state with a parent link and do not silently invent data. Each nested route keeps its parent world's navigation item active; utility compatibility routes get their own utility state. Reload, direct entry and Back/Forward must be tested for every implemented family.

## Submodule registry and data ownership

The following is the complete planned portal registry. Each entry must become a dedicated usable surface or an explicitly labelled unavailable/future-disabled surface under R4/R5. A visual card that merely redirects to a generic parent does not satisfy the contract. Portal ordering follows the R5 authority. Ownership indicates where persisted state belongs; an entry with no implemented source cannot display invented state.

| Parent | Submodules in required order | Canonical owner / boundary |
|---|---|---|
| Work | Projects; Kanban Board; Team; Documents; Meetings; Templates | Work owns projects, work items, tasks and history. Team, documents, meetings and templates use Work-owned records only when implemented; otherwise truthful future-disabled states. |
| Personal / Fitness | Mindfulness; Fitness; Nutrition; Recovery; Personal Life; Home Wellbeing | Personal owns goals, routines and habits. Exercise/workout state belongs to the Personal/Fitness domain when built. External biometric, food or device metrics need user entry/approved provider or unavailable state. |
| Explore | Destinations; Experiences; Travel Guides; Bucket List; Discover More | Explore owns trip board, saved places and local discovery records; optional destination enrichment is separate. |
| Games | My Games; Missions & Quests; Game Library; Game Sessions; Discover Games; Game Settings | Games owns library, stories/objectives, weekly tasks, sessions, journal and preferences. Bundled catalogue is the default discovery source. |
| Movies & Series | Continue Watching; Watchlist & Library; supported discovery/new-release/recommendation/genre surfaces; Title Detail | Movies owns library, watchlist, notes and preferences. Bundled catalogue is the default discovery source. “Continue Watching” cannot imply playback tracking beyond actual user-entered/local state. |
| Projects & Notes | All Projects; Notes & Knowledge; Documents; Idea Inbox; Templates; Archive | Aggregates Work-owned projects and Notes-owned notes. Any cross-domain document/template/idea record needs an explicit canonical owner before persistence; no parallel Projects & Notes datastore. |
| Settings | Appearance & Theme; Connected Devices; Notifications; Privacy & Security; Quick Settings; Routines & Automation; System Health; Account/Profile | Settings owns preferences only. Productivity owns generic task/timer/countdown state; Shortcuts owns shortcut records. Device/account/billing/system claims require a real integration or unavailable state. |

Home reads from canonical owners for Now/Today/Next/Pulse and links to these worlds; it does not own copies of their records. Work → Projects is the R4 pilot, establishing route, record detail, empty/error and active-parent patterns before R5 repeats them. Notes compatibility and Projects & Notes both use the existing Notes owner; legacy `projects` and Work Projects use the existing Work owner.

## Data, scenes, storage and failure contracts

Every dynamic world value gets a source tag: `LOCAL_CORE`, `LOCAL_DERIVED`, `USER_ENTERED`, `OPTIONAL_PROVIDER` or `FUTURE_DISABLED`. Local catalogues and user records work without credentials. Optional providers have separate loading/unavailable/error states and never override saved local data. Sample screenshots are not data fixtures. No weather, health/device/account, friend, playback or release claim appears as live without a real source.

Shared scene host accepts a world ID and has distinct production scene registries per reference, with documented asset provenance/license/attribution, ordered layers, loading/error fallback and no composite screenshot as a runtime background. One lifecycle controller handles route ENTRY/WAKE-UP → SETTLE → AMBIENT/ALIVE → EXIT/RESET. Internal record selection is a lighter transition, not a route entry. Full/Subtle/Off, reduced motion and touch/no-hover are first-class modes. Scene failure never blocks controls; decorative layers cannot intercept them.

Current storage remains `orbit-*` localStorage and version-4 backup with v2/v3/v4 import. No new storage version is needed for R1 foundation. Any later new persisted shape requires a versioned non-destructive migration, old-data fixture, failed-write/rollback proof, export/import proof and ownership review. Modules register behind isolated boundaries so missing media, optional provider, malformed preference or one submodule failure does not prevent shell navigation or another domain from working.

## R1.1 verification and next action

The seven R1.1 checklist contracts above were compared with the R0 record, `docs/IMPLEMENTATION-STEPS.md`, the two redesign authorities, `docs/ui-reference/MANIFEST.md` and the current `index.html` route/storage code. No route, schema or UI was changed by this architecture lock. First unresolved item is **R1.2 — Shared visual foundation**. R1.3 asset reconstruction follows before Gate R1. Persistent R1 evidence lives under `docs/implementation-evidence/r1/`.
