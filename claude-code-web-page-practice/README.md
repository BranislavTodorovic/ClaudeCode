# OneSpace

A local-first dashboard with development tracking, Personal lists, destination discovery, Games, and Movies & Series. No backend, accounts, cloud sync or API keys are required.

## Run

```sh
node server/_static-server.js
```

Open http://localhost:8973. Keep the same hostname and port: browser storage is isolated by origin. If a sandboxed Windows Node installation reports an EPERM during path resolution, use:

```sh
node --preserve-symlinks --preserve-symlinks-main server/_static-server.js
```

## Work

Create a project in Projects, then add stories or defects in Work. Each item has analysis, plan, execution notes, labels, priority, links, a deadline and an optional local reminder time. Add child tasks with details, priority, due date and estimated hours.

Closing an item atomically completes unfinished tasks and records completion timestamps and a snapshot in history. Closed items move out of active results into Backlog / closed. Reopening retains completed tasks and their history; uncheck individual tasks if they need further work. Deleting an item or project preserves snapshots in Work history. Project status and percentage remain manually controlled and compatible with the Home/Projects summaries.

Filter work by project, type, status, priority, deadline and text. Due soon means within the next three days, through the local end of the due date. Reminders appear in the panel and as session-deduplicated toasts, checked every 30 seconds and on Work page entry. **No reminder runs after the page is closed.** Productivity retains general daily tasks.

## Personal and shortcuts

Goals, routines and habits support add, edit, completion and confirmed deletion. Habits can record daily, weekly or monthly frequency. This is a simple completion list, not a streak calendar.

Custom shortcuts retain a short description and explicit Work, Personal or Explore ownership. Creating from Explore forces Explore ownership; creating from Personal defaults to Personal. Editing permits an intentional space change. Category normalization and the same scope helper govern loading and rendering, including Work's recent list. Duplicate normalized URLs are rejected. Space cards expose favorite, edit and confirmed-delete controls; opening links records recent usage. External links use HTTP(S), a new tab and `noopener noreferrer`.

## Discovery

Explore includes 12 editorial destinations with local SVG illustrations and a deterministic illustrated fallback. It matches every selected preference group and sorts by match score, then stable destination ID. Departure region only adds a ranking preference; location is never detected. Relative budgets exclude flights. Save destinations and trip notes to a shortlist. Surprise me samples only the current matching results.

These are maintained travel ideas, not current travel advice, quotes or availability. Illustrations are conceptual, not destination photographs. Edit `explore/explore-data.js` and `assets/destinations/` to maintain the catalog.

Games retains existing trackers, sessions, journal, themes and weekly resets. Resources are grouped into official, news/updates, builds/guides, community and platform links. Direct official links are included where curated; other resources are clearly labeled title-specific searches. Edit resources from a tracked game's details. Story and weekly template sets are separate, and completion is initialized only when adding a tracker or starting a new ISO week. Game deletion cleans up tasks and sessions atomically while retaining journal text without a game association. Custom genres are searchable and filterable in My Games.

Movies & Series keeps the `movies` route and existing storage keys. The catalog includes movies and four complete series, type/genre filters, recommendation explanations, details and a watchlist. Series record season counts and approximate episode duration; there is no episode-by-episode tracking. Custom titles can be movies or series. Legacy Movie/Series values normalize to lowercase; legacy Documentary values normalize to movie.

## Data and backup contracts

`shared/storage-utils.js` is the validation boundary. It owns known keys, date/URL checks, complete backup validation, transactional writes, rollback and reset. New Work multi-key operations validate parent references and disallow incomplete tasks under closed items before any write. Failed writes leave prior records intact when the browser permits rollback. If rollback itself fails, export data before closing the page; the transaction error retains recovery values.

New exports are complete **version 3** backups. Complete version-2 backups remain accepted: the original key set must be present and the five new keys default to null. Partial or malformed backups are rejected. Restore replaces known OneSpace values, while unrelated localStorage keys remain untouched. Reset removes the known keys; application startup may recreate default preferences and the original seed Games library. Existing version-1 shortcut import behavior is retained by the shell.

| Domain | Key / data source | Contract |
| --- | --- | --- |
| Projects | `orbit-work-projects` | ID, name ≤100, description ≤2000, HTTP(S) URL ≤2048, tags, active/blocked/done, progress 0–100; optional deadline and ISO created/updated timestamps. Existing records need no rewrite. |
| Work items | `orbit-work-items` | ID and project ID, name ≤160; story/defect; open/in-progress/blocked/closed; low/medium/high/urgent; analysis/plan/execution ≤10000 each; ≤30 labels of ≤80 characters, ≤12 links; dates and required ISO created/updated timestamps. Completion timestamp is set on close. |
| Work tasks | `orbit-work-tasks` | ID and item ID; title ≤160, details ≤5000, priority, due date, estimate 0–10000 hours, boolean done, ISO created/updated and optional completed timestamps. |
| Work history | `orbit-work-history` | Generated event ID, retained project/item IDs and name, allowed action, ISO event time, item snapshot and task snapshots. Deleting current work does not erase history. |
| Personal | `orbit-personal-goals`, `orbit-personal-routines`, `orbit-personal-habits` | ID, text ≤80, boolean done, optional daily/weekly/monthly frequency and ISO timestamps. Legacy arrays are read without destructive migration. |
| Destinations | `explore/explore-data.js` | Stable editorial ID, name/country ≤100, category/budget/season/duration/style/climate/region enums, tags, summary ≤1000, details ≤5000, local image path and fallback seed, HTTP(S) resource links. Static catalog records are code-versioned, not mutable user records. |
| Destination preferences | `orbit-explore-preferences` | Enumerated string arrays for categories, seasons, duration, budget, pace, climate, interests and departure. The current UI chooses one value per group. |
| Shortlist | `orbit-explore-saved` | Generated ID, destination ID, ISO created time, trip notes ≤2000. |
| Shortcut additions | `orbit-custom-links` | Existing IDs and URLs; description ≤240 and explicit work/personal/explore space. Legacy ownership derives from category. |
| Game additions | Existing `orbit-games-*` keys | Resources: ≤30 entries, group ≤60, label ≤120, HTTP(S) URL ≤2048. Default tasks: ≤30 text entries ≤200; separate story/weekly template sets. Existing story/weekly completion data stays readable. |
| Movie additions | Existing `orbit-movies-*` keys | movie/series type; optional integer seasons 1–100; title ≤160, blurb ≤5000; finite year, duration and rating metadata. Existing IDs and watchlist state are preserved. |

New mutable Work IDs use the shell ID generator; Work IDs and foreign IDs are restricted to letters, digits, underscores and hyphens. Record arrays have a 20,000-record validation cap. Work history consumes browser quota over time; export backups regularly. Empty optional dates remain empty; date-only values use `YYYY-MM-DD`, reminder controls use local `YYYY-MM-DDTHH:mm`, timestamps use ISO UTC.

## Architecture

The router remains `goToPage()` in `index.html`, with Home, Work, Projects, Personal, Explore, Games, Movies, Shortcuts, Productivity, Notes and Settings routes. It emits `onespace:page-changed` with `detail.page`. Saves emit `onespace:data-changed` with `detail.key`; atomic Work commits emit for each affected key after success. Motion remains controlled by `prefersReducedMotion()` and the existing settings override.

Load order: storage/catalog/tooltip/shortcut/Personal helpers → inline shell and router → visual helpers → shared domain dialogs and shortcut surfaces → Projects → Work → Explore data and UI → game resources/data/UI → movie data/UI → cinematic refinements. `shared/domain-ui.js` uses the shell's modal stack, focus trap, Escape handling and inert background. New forms and cards live in modules, with responsive styles in `work/tracker.css`; the inline shell is smaller than before this extension.

## Verify

```sh
node --test tests/data-regression.test.js tests/tracker-regression.test.js
```

The same two `--preserve-symlinks` flags can precede `--test` in restricted Windows environments. The suite includes parsing every application `.js` and the shell inline script, Work lifecycle and reference checks, rollback, legacy and current backups, reset, Personal confirmation, shortcut ownership, destination ranking, game defaults/cleanup, and mixed movie/series metadata.

For a disposable browser origin:

```powershell
$env:PORT = '18974'
node tests/browser-server.js
```

To exercise missing-image fallback, set `$env:MISSING_ASSET = 'assets/destinations/azores.svg'` before starting that test server. It only serves the local app and intentionally returns 404 for that asset.

`tests/browser-smoke.mjs` exports browser-client checks: `routes(tab)`, `layout(tab)` and `workLifecycle(tab)`. Use the Browser skill's connected tab, without installing a second browser framework. `workLifecycle` expects a disposable project containing one story named `QA story lifecycle` and one child task. The route smoke check is intended for the desktop navigation; mobile uses the More menu and shorter accessible space names.

Test backup fixtures include a complete v3 snapshot, a complete legacy v2 snapshot and invalid snapshots. Import them only into a disposable origin. Test at 1440, 1024, 760 and 390 pixels, and verify keyboard focus, Escape, reduced motion, image failure, reload persistence, local export/import, and reset. See `VERIFICATION.md` for the recorded acceptance run.
