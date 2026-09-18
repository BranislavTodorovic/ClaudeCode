# OneSpace — Implementation Steps

The working checklist for the plan in `agent-instructions.md`. That document holds the reasoning and the evidence; this one holds the boxes to tick.

Tick a box only when its **Check** actually passes. If a step is skipped, replace its `[ ]` with `[~]` and write the reason on the line — an unexplained unchecked box at the end of Phase 12 blocks delivery.

---

## DO NOT BREAK

These hold through every phase. Any change that violates one is wrong, however good it looks.

- **Entry URL** stays `http://localhost:8973/` serving root `index.html`.
- **Every `localStorage` key is unchanged.** A refactor must never rename, drop or re-shape a key. The canonical list is in `storage-utils.js:7-18`.
- **Every public browser global keeps its name:** `OneSpace`, `OneSpaceStorage`, `OneSpaceCatalog`, `OneSpaceShortcuts`, `OneSpaceShortcutUI`, `OneSpaceUI`, `OneSpaceVisual`, `makePersonalController`, `OneSpaceWork`, `OneSpaceTrips`, `DESTINATIONS`, `OneSpaceLocalDiscovery`, `OneSpaceDiscovery`, `OneSpaceExplore`, `OneSpaceGameResources`, `DEFAULT_GAMES`, `SUGGESTION_CATALOG`, `DIABLO_WEEKLY_TEMPLATE`, `GAMES_*`, `OneSpaceGameDiscovery`, `OneSpace.playGamesEntryAnimation`, `SEED_MOVIES`, `MOVIE_*`, `OneSpaceTitleDiscovery`.
- **Script load order is load-bearing.** All 22 `<script src>` tags are classic scripts with no `defer`; they execute in document order. Never reorder, merge, split or add `defer`.
- **`storage-utils.js` is the only persistence validation boundary.** New keys get validators there, not ad-hoc checks in domain code.
- **Backup compatibility:** v3 is current, complete v2 backups stay accepted, all existing fixtures stay valid.
- **No behaviour change during Phase 1.** Found a bug mid-move? Write it down, fix it in a later phase.
- **No CDN and no new browser runtime dependency.** The server may call configured providers; the browser bundle may not.

**Commands** — PowerShell is the shell on this machine, so `PORT=x cmd` is a parse error:

```powershell
node --test tests/
node server/_static-server.js          # after Phase 1; before it, node _static-server.js
$env:PORT = '18974'; node tests/browser-server.js
```

If a sandboxed Windows Node install reports EPERM during path resolution, prefix with `--preserve-symlinks --preserve-symlinks-main`.

---

## Progress

| Phase | Title | Status |
|---|---|---|
| 13.1–13.2 | Standing plan + this checklist | Done |
| 0 | Freeze the baseline | Not started |
| 1 | Repository regrouping | Not started |
| 2 | Development tracker UI and layout | Not started |
| 3 | Domain boundaries + Home module | Not started |
| 4 | Settings and themes | Not started |
| 5 | Living cinematic scenes | Not started |
| 6 | Provider search and typeahead | Not started |
| 7 | Shortcuts add/remove | Not started |
| 8 | Games trackers | Not started |
| 9 | Movies and series | Not started |
| 10 | Explore | Not started |
| 11 | Personal regression | Not started |
| 12 | Verification and delivery | Not started |
| 13.3 | Final documentation | Not started |

Phases 0 → 1 → 2 → 3 are strictly sequential. Phases 4–11 are independent and may be reordered or run in parallel. Phase 12 runs last.

---

## Phase 13.1–13.2 — Documents first

- [x] **13.1** Replace `agent-instructions.md` with the combined standing plan.
      *Files:* `agent-instructions.md`. *Check:* the file contains Part A in full, Part B as status tables, Part C, Product Decisions, Further Considerations, Scope Boundaries and the defect table.
- [x] **13.2** Create this checklist.
      *Files:* `docs/IMPLEMENTATION-STEPS.md`. *Check:* every actionable step below names its files and its acceptance check.

---

## Phase 0 — Freeze the baseline

- [ ] **0.1** Run the suite and record the result with a timestamp.
      *Check:* `node --test tests/data-regression.test.js tests/tracker-regression.test.js` → 31 pass, 0 fail.
- [ ] **0.2** Note the file count the parse test covers.
      *Check:* recorded, for comparison after Phase 1 makes the walk recursive.
- [ ] **0.3** Start the server and walk all 11 routes.
      *Check:* zero console errors and zero failed requests on home, work, projects, personal, explore, games, movies, shortcuts, productivity, notes, settings.
- [ ] **0.4** Record storage keys, backup version, router pages, script load order, and the `onespace:data-changed` / `onespace:page-changed` / `onespace:motion-changed` events.
      *Check:* written down durably, not just observed.
- [ ] **0.5** Build the interaction inventory — every button, tab, link, form, checkbox, select, modal action and page jump, with owner, expected state change, persistence key, success feedback, error behaviour, focus return and reload behaviour.
      *Check:* this list is the acceptance checklist for Phase 12; step 12.11 tests against it.
- [ ] **0.6** Capture "before" screenshots of Work, Games, Movies and Settings at 1440 / 1024 / 760 / 390 px.
      *Check:* 16 images stored for side-by-side comparison.
- [ ] **0.7** Export a v3 backup from the live origin.
      *Check:* the file exists on disk and re-imports cleanly into a disposable origin.
- [ ] **GATE 0:** green baseline recorded, inventory written, backup taken.

---

## Phase 1 — Repository regrouping

Move in batches. Re-run the suite after **every** batch — not at the end. Use `git mv` throughout so history survives.

- [ ] **1.1** Batch 1 — `shared/`: move `storage-utils.js`, `catalog-utils.js`, `shortcut-utils.js`, `shortcut-surface.js`, `domain-ui.js`, `tooltip-utils.js`, `visual-utils.js`, `cinematic-scenes.js`. Repoint `storage-utils.js:49` to `../explore/trip-board`. Update `index.html` and both test files.
      *Check:* suite green; app loads with no 404s.
- [ ] **1.2** Batch 2 — `styles/`: move `pages.css`, `cinematic-refinement.css`; prefix all five `url()` paths in `cinematic-refinement.css` (lines 72, 73, 100, 101, 102) with `../`.
      *Check:* all five background images still render in the browser.
- [ ] **1.3** Batch 3 — `games/`: move `games.js`, `games-data.js`, `game-resources.js`, `games.css`, `games-cinematic.css`.
      *Check:* suite green; Games page renders with art.
- [ ] **1.4** Batch 4 — `movies/`: move `movies.js`, `movies-data.js`, `movies.css`, `movies-cinematic.css`.
      *Check:* suite green; Movies page mounts.
- [ ] **1.5** Batch 5 — `explore/`: move `explore.js`, `explore-data.js`, `explore-global.js`, `discovery-integration.js`, `discovery-ui.js`, `local-discovery.js`, `trip-board.js`, `discovery.css`.
      *Check:* the `storage-utils` → `trip-board` require resolves; suite green. **Do not** add `explore.js` to `index.html` — that is step 10.3.
- [ ] **1.6** Batch 6 — `work/` + `personal/`: move `projects.js`, `work-tracker.js`, `tracker.css`, `personal-controller.js`. **In the same batch**, change the server block list at `_static-server.js:11` to `['tests','node_modules','outputs','api','server','config','secrets']`.
      *Check:* `work/projects.js`, `work/work-tracker.js` and `work/tracker.css` all load with no 404 — this is the proof the block-list fix landed.
- [ ] **1.7** Batch 7 — `server/`, `config/`, `docs/`, `.gitignore`: move `_static-server.js` and the empty `providers/`; move `REVISED-IMPLEMENTATION-PLAN.md` and `agent-instructions.md` into `docs/`; create `config/secrets/.gitkeep`, `config/secrets.example.json` (placeholders for `TMDB_API_KEY`, `IGDB_CLIENT_ID`, `IGDB_CLIENT_SECRET`, `RAWG_API_KEY`) and the root `.gitignore`.
      *Check:* `curl -I http://localhost:8973/config/secrets/probe.js` returns 404 — the `.js` case is the one that matters, since `.js` is in the MIME allowlist. Also `git check-ignore -v config/secrets/api-keys.json`.
- [ ] **1.8** Batch 8 — make the parse loop recursive at `tests/data-regression.test.js:132`, excluding `tests/`, `node_modules/`, `config/` and `assets/`.
      *Check:* the parse test reports a file count matching step 0.2 — **not ~0**. A passing test covering zero files is the exact failure this guards against.
- [ ] **1.9** Add `tests/structure.test.js` asserting: every `<script src>` and `<link href>` resolves; every repo-relative `require` resolves; every `assets/...` literal and CSS `url()` resolves; the parse walk visits the expected count; no `config/` file is referenced from any browser script; the 22 script tags appear in exactly the expected order; every `assets/...` literal still satisfies the three `^assets/` validators in `shared/storage-utils.js:36`, `explore/local-discovery.js:5` and `explore/trip-board.js:6`.
      *Check:* the new test passes, and fails when a path is deliberately broken.
- [ ] **1.10** Update `README.md` (server command at L8 and L14, load-order paragraph at L67, file refs at L35/43/54/65/67) and `VERIFICATION.md` (full test paths at L8; correct the port **18973 → 18974**).
      *Check:* every command in both files runs as written.
- [ ] **GATE 1:** `node --test tests/` green; all 11 routes load with zero 404s and zero console errors; no duplicate script execution; `git log --follow games/games.js` shows history across the move.

---

## Phase 2 — Development tracker UI and layout

- [ ] **2.1** Consolidate Projects into Work as sub-views (Board / Projects / Backlog / History). Keep `projects` in `PAGES` as a redirect alias so the 14 existing `goToPage` and `data-page-jump` call sites keep working.
      *Files:* `index.html`, `work/work-tracker.js`, `work/projects.js`. *Check:* every existing jump to `projects` lands on Work's Projects sub-view; saved `orbit-page` values still resolve.
- [ ] **2.2** Move `#homeOverview` rendering out of `work/projects.js:40-43` (it lands in step 3.1) and delete the Work-overview fallback at `projects.js:44-47`.
      *Check:* Home still renders its overview; Work never shows an `orbit-tasks` count.
- [ ] **2.3** Results grid: replace the 2-column lock in `tracker.css:2` with `repeat(auto-fill, minmax(320px, 1fr))`.
      *Check:* at 1440 px the grid uses three or more columns; no overflow at 390 px.
- [ ] **2.4** Detail region: move `#workDetail` from a full-width block below the grid into a right-side drawer at ≥1100 px and a full-screen sheet below, reusing the `OneSpaceUI` modal stack, focus trap, Escape handling and inert background.
      *Files:* `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. *Check:* Escape closes it and focus returns to the invoking card; no second dialog implementation was added.
- [ ] **2.5** Remove the 352 px focus rail from Work and normalise the width clamp at `index.html:93` to match other pages.
      *Check:* Work's content width equals other pages' at ≥1280 px.
- [ ] **2.6** Rebuild the filter bar: live filtering (debounced text, immediate selects), dismissible active-filter chips, a result count, and a **sort control** — none exists today; sorting is hardcoded priority→deadline→createdAt at `work-tracker.js:29`.
      *Check:* results update without a submit button; sort order changes visibly and survives a re-render.
- [ ] **2.7** Fix the overview tiles at `work-tracker.js:51` — emit `.overview-tile-top` / `.overview-tile-bottom` and render as `<button data-page-jump>` like `projects.js:29`.
      *Check:* Work's tiles match Home's structurally and are clickable.
- [ ] **2.8** Rebuild work item cards: type glyph (story vs defect), priority as a colour-coded rail, **capitalised** status labels (raw lowercase today at `work-tracker.js:59`), and a task progress bar replacing the "n / m tasks complete" text.
      *Check:* no lowercase enum value is visible anywhere on the card.
- [ ] **2.9** Emit the `.page-section-head h2 > .icon` tile the tracker never provides, and add the missing `data-reveal` to `#workTracker` (`index.html:484`).
      *Check:* the tracker heading matches every other section heading in the app.
- [ ] **2.10** Scope re-renders to the changed region instead of rewriting the whole section's `innerHTML` (`work-tracker.js:52`); remove the focus-restoration hack at `:50,64`.
      *Check:* typing in the filter keeps the caret; the detail drawer keeps scroll position; a task toggle does not rebuild the filter bar.
- [ ] **2.11** Re-verify all 21 preserved Phase 2 behaviours listed in `agent-instructions.md` §2.6.
      *Check:* each still works after the redesign.
- [ ] **GATE 2:** every Work action from inventory 0.5 works; suite green; screenshots at all four widths show no overflow and no overlap versus the 0.6 baseline.

---

## Phase 3 — Domain boundaries and the Home module

- [ ] **3.1** Create `home/home-overview.js` — the only module permitted to read across domains. It takes over `#homeOverview`, gains the cross-domain tiles removed from Explore, and adds space labels to Quick Access.
      *Files:* new `home/home-overview.js`, `index.html` (new script tag), `tests/structure.test.js` (the expected script count and order change **here**, not in Phase 1).
      *Check:* the structural test passes with the updated expectation.
- [ ] **3.2** Remove leaks 1–6 from Work: the `orbit-tasks` overview tile, the "General daily tasks" button (`index.html:482`), the Productivity hero CTA (`:471`), the focus rail and its mobile toggle (`:153-159`, `:466`), and the asymmetric project-deadline push at `work-tracker.js:75`.
      *Check:* no Work DOM node reads `orbit-tasks`, `orbit-countdowns` or `orbit-notes-list`.
- [ ] **3.3** Fix leaks 7–8 on Home: label Quick Access tiles with their space; make "Shortcuts available" count all spaces rather than following the Shortcuts page's selection (`index.html:1368`).
      *Check:* changing the space picker on Shortcuts no longer changes a number on Home.
- [ ] **3.4** Fix leaks 9–10: make `Gaming` reachable in `visibleCategories()` (`index.html:1172-1176`) and stop relabelling every non-Travel explore link as "Relax & Play" (`:1167`).
      *Check:* Gaming shortcuts appear under Gaming.
- [ ] **3.5** Fix leaks 11–12: remove the Games / Movies / Productivity tiles from Explore (`index.html:553-555`) — they move to Home — and stop `#endWorkdayBtn` relocating the user to Explore (`:2100-2109`).
      *Check:* the Productivity tile no longer renders Personal's hero art (`cinematic-refinement.css:102`).
- [ ] **3.6** Fix leaks 13–14: scope `data-games-theme` / `data-movies-theme` to their view roots or clear them in `goToPage` (`games.js:693`, `movies.js:954`); delete the dead pre-router CSS at `index.html:89-90`.
      *Check:* visiting Games then Settings leaves no `data-games-theme` on `<body>`.
- [ ] **3.7** Leak 15: inject domain validators into `shared/storage-utils.js` instead of `require`-ing across into `explore/trip-board.js` (`:49`).
      *Check:* `storage-utils.js` contains no cross-domain `require`; the `orbit-trip-board` validator still rejects malformed records.
- [ ] **GATE 3:** a new test asserts each page's DOM subtree reads only its own domain's storage keys, with `home/home-overview.js` the single allowed exception.

---

## Phase 4 — Settings and themes

- [ ] **4.1** Replace the index-based Settings grouping at `cinematic-scenes.js:26-34` with a declared `data-settings-group` attribute per field. **Do this before adding any setting.**
      *Check:* adding a field mid-card does not move other controls between headings.
- [ ] **4.2** Make light/dark orthogonal to palette — `index.html:1574-1581` currently resets `paletteChoice` to `"classic"` and strips `data-palette`.
      *Check:* select Aurora, toggle dark, toggle light — Aurora survives both.
- [ ] **4.3** Give "Deep Space" (`midnight`) a real CSS variable block; today it appears only in the dark selector lists at `index.html:21` and `34-36`.
      *Check:* Deep Space and plain dark are visibly different.
- [ ] **4.4** Resolve the duplicate `--page-accent` definition between `cinematic-refinement.css:4-15` and `pages.css:193-195`; one owner only.
      *Check:* per-page accent is stable regardless of stylesheet order.
- [ ] **4.5** Fix "Reset preferences" (`index.html:1656-1689`) — stop it wiping favorites, recents, collapsed sections and search provider, and make it reset `orbit-theme` too.
      *Check:* after a reset, favorites survive and the theme returns to default.
- [ ] **4.6** Add new palettes beside the existing five, including at least one **warm** direction.
      *Check:* each defines the full token set in light and dark, passes WCAG AA for body text and controls, and shows a swatch in `.theme-choices`.
- [ ] **4.7** Add the new settings: per-tab scene intensity (Full / Subtle / Off), the Games and Movies sub-theme pickers, the Removed-shortcuts restore list, and the provider status panel.
      *Check:* each persists across reload and appears under the correct group heading.
- [ ] **GATE 4:** every pre-existing setting still works and keeps its storage key.

---

## Phase 5 — Living cinematic scenes

- [ ] **5.1** Collapse the three entry-animation systems (`index.html:1797-1799`, `discovery-integration.js:14`, `cinematic-refinement.css:131-132`) and the two parallax variable sets (`--px`/`--py`, which currently has no consumer, and `--scene-x`/`--scene-y`) into one scene controller on `window.OneSpace`.
      *Check:* one code path owns entry, parallax, ambient motion and reveal.
- [ ] **5.2** Build a layered animated scene for each of the 11 routes: drawn SVG backdrop, parallax depth layer, slow ambient layer, contrast scrim. Keep the nine existing `assets/page-art/*` stills as an optional art slot behind the drawn layers.
      *Check:* every route is visibly in motion at rest and visually distinct from its neighbours.
- [ ] **5.3** Give Games and Movies a `.page-hero` with eyebrow, headline and caption, and add them to the `scenes` map at `cinematic-scenes.js:5` — currently 01–09 with both absent.
      *Check:* both pages carry a scene number like every other route.
- [ ] **5.4** Ship hero markup for `#moviesView` in the document — it is an empty `<div id="moviesMount">` (`index.html:570-572`) until `movies.js` mounts.
      *Check:* the Movies hero is visible on first paint, before scripts run.
- [ ] **5.5** Clean up the dead visual code: the `projects-scene` class with no matching selector (`index.html:494`), the unstyled `neon` / `aurora` game worlds, the `nth-child` icon injection (`cinematic-scenes.js:13-22`), and the gradient-only fallback heroes (`pages.css:81, 113, 136, 148, 171`).
      *Check:* no class in the markup lacks a matching rule.
- [ ] **5.6** Route `index.html:1183`, `games.js:97`, `games.js:468` and `movies.js:87` through `prefersReducedMotion()` instead of querying `matchMedia` directly.
      *Check:* setting Motion to "Full motion" is honoured on every page, Games and Movies included.
- [ ] **5.7** Work the [OPEN] rows of `agent-instructions.md` §5.4: entry transitions, meaningful state transitions, section-matched loading states, full interactive-state coverage, ARIA live regions, and long-text handling.
      *Check:* each row has visible evidence.
- [ ] **GATE 5:** every route captured in normal motion, in reduced motion and at 390 px; reduced motion is genuinely still, not slowed; the browser bundle still issues zero external requests.

---

## Phase 6 — Provider search and typeahead

- [ ] **6.1** Add the server proxy reading credentials from `config/secrets/` — `/api/search/titles`, `/api/search/games`, `/api/details/:kind/:id`. Never expose a key to the browser.
      *Check:* no credential string appears in any file the server will serve.
- [ ] **6.2** Normalise provider responses into the app's existing record shapes; add `AbortController` cancellation, a short-TTL cache clearable without touching user records, and pagination.
      *Check:* the UI never receives a raw TMDB or IGDB payload.
- [ ] **6.3** Add the local mock provider used by all automated tests.
      *Check:* the full suite runs with networking disabled.
- [ ] **6.4** Extend both typeaheads (`games.js:1009-1028`, `movies.js:802-821`): debounce, two result groups ("In your catalog" then "Search results" with a loading row), and an **explicit** add control — today selecting a row adds immediately with no confirmation (`games.js:1004`, `movies.js:797`).
      *Check:* typing adds nothing until the add control is used.
- [ ] **6.5** Give series parity in search and capitalise the type filter labels to `Movie` / `Series` (`movies.js:1396`).
      *Check:* one query returns both movies and series, correctly labelled.
- [ ] **6.6** Reconcile the two competing search experiences — `discovery-integration.js:3-9` mounts a second Discover panel into Movies and rewrites the typeahead placeholder; Games has the same split.
      *Check:* one search experience per domain, one result-card design.
- [ ] **6.7** Add explicit loading, empty, timeout, rate-limit, offline, authentication and configuration-error states.
      *Check:* with credentials removed, the UI says what is unavailable — it does **not** show the local catalog as if it were global.
- [ ] **GATE 6:** with the network disabled the app is fully usable and honestly labelled.

---

## Phase 7 — Shortcuts

- [ ] **7.1** Add the `orbit-hidden-links` key with a validator in `shared/storage-utils.js`, plus a fixture and a backup round-trip test.
      *Check:* a hidden list survives export and import.
- [ ] **7.2** Add a Remove control to **every** shortcut card, built-in and custom, on both the full card (`index.html:1215-1237`) and the compact card (`shortcut-surface.js:4-7`). Custom deletes; built-in hides.
      *Check:* all 47 built-ins can be removed.
- [ ] **7.3** Add the Removed-shortcuts restore panel in Settings, and replace the hardcoded `HIDDEN_DEFAULT_IDS` (`index.html:1163`) with real user data — seeding those three ids on first run so nothing visibly changes for existing users.
      *Check:* a removed built-in restores to its original position.
- [ ] **7.4** Add an add-shortcut control to Work; it has none, unlike Personal (`index.html:528`) and Explore (`:559`).
      *Check:* a shortcut added from Work defaults to the work space.
- [ ] **7.5** Make `index.html:2498` read the `[data-add-space]` attribute it currently ignores; fix `shortcut-surface.js:9` calling `renderExplorePage()` with no argument; implement or remove the "Duplicate" stub (`index.html:2585`).
      *Check:* favoriting a shortcut on Explore no longer clears the Explore search filter.
- [ ] **7.6** Modernise the card and launch wall: inline SVG icons with a favicon/hostname fallback chain, full interactive states, mobile touch targets, keyboard-accessible reordering, hostname shown on the compact card, `rel="noopener noreferrer"` preserved.
      *Check:* add, edit, favorite, reorder and delete all work by keyboard alone; no broken icons at any of the four widths.
- [ ] **GATE 7:** ownership isolation between work / personal / explore is unchanged.

---

## Phase 8 — Games trackers

- [ ] **8.1** Add `trackerType` to every `SUGGESTION_CATALOG` record (`games-data.js:182-195`) and to the provider normaliser — today `games.js:843` defaults everything to `"story"`.
      *Check:* no catalog entry relies on the default.
- [ ] **8.2** Infer the tracker type from genre and tags (live-service / MMO / looter / gacha / battle-royale → weekly; campaign / story-rich / single-player → story) and show the inferred choice in the add flow so it can be corrected before saving.
      *Check:* adding a live-service game yields a weekly tracker; adding a campaign game yields chapters.
- [ ] **8.3** Give story games real chapter outlines — `game-resources.js:25` always produces one `"Your first milestones"` chapter today.
      *Check:* a mission game arrives with a multi-chapter outline.
- [ ] **8.4** Reconcile `story` data when a game's type changes; `games.js:669-673` leaves it orphaned.
      *Check:* weekly → story → weekly round-trips without duplicate or stale objectives.
- [ ] **8.5** Remove the four Diablo hardcodes: `cloneWeeklyTemplate` (`games.js:208`), the `defaultTasks` injection (`games-data.js:202,204`), the Overview stat tile (`games.js:724-725,744`) and the `"Diablo Weekly Tasks"` heading (`games.js:1422`). Fix the cascade order at `game-resources.js:24`, where the `defaultTasks` check wrongly precedes the `trackerType === 'weekly'` branch.
      *Check:* a second weekly game behaves identically to Diablo Immortal.
- [ ] **8.6** Fix `resetWeekly()` (`games.js:581`) calling `cloneWeeklyTemplate()` with no argument.
      *Check:* "Reset Weekly Tasks" on Diablo Immortal restores its 7 tasks, not 3 generic ones. Add a test.
- [ ] **8.7** Make `saveLibrary()` (`games.js:175`) and `saveWeekly()` (`:180`) honour `safeSet`'s failure return, using the read-back-and-rollback pattern from `commitGameChanges()` (`:176-179`).
      *Check:* a forced write failure surfaces an error and the UI never shows a state storage does not hold.
- [ ] **8.8** Reproduce C.4 in the browser before assuming 8.7 fixed it. Secondary suspects in order: ISO-week rollover discarding `done` flags via `ensureWeekly` (`:211-220`, reached from every render); `findChapter` scoped to `selectedStoryGameId` (`:498-502`); `toggleWeeklyTask` requiring an ancestor `.gv-tracker[data-game-id]` (`:1565`).
      *Check:* toggle an objective and a weekly task ten times each — model, percentage and DOM agree every time, and after reload. Add an involution regression test.
- [ ] **8.9** Fix the remaining games defects: `featuredGames()` excluding artwork-less games from the spotlight (`:1261-1263`); the unescaped selector in `withFocusPreserved` (`:1608`); `revealedKeys` bleeding between games via colliding `default-0..n` and `c1..c4` ids (`:71`, `:104`).
      *Check:* a custom game can appear in the spotlight; reveal animations do not skip.
- [ ] **GATE 8:** all preserved Phase 5 behaviours in `agent-instructions.md` §8.4 still pass.

---

## Phase 9 — Movies and series

- [ ] **9.1** Separate Untrack from Delete. Drop the `!m.custom` guard on the untrack path (`movies.js:458`), render the untrack control unconditionally (`:619`), and keep permanent delete restricted to `custom`.
      *Check:* track a catalog movie, untrack it — it leaves Library, "Titles tracked" decreases, it returns to Suggestions, and it is still untracked after reload.
- [ ] **9.2** Reconcile the watchlist's two sources — the legacy id array and `status === 'watchlist'` (`movies.js:360-363`) — while `addToWatchlist` (`:465-467`) only writes the status.
      *Check:* one source of truth; the watchlist count matches the rendered list.
- [ ] **9.3** Move `deleteMovie`'s native `window.confirm` (`movies.js:459`) to `OneSpaceUI.confirm`.
      *Check:* the dialog is themed, Escape-closable and returns focus.
- [ ] **9.4** Re-source posters at ≥1000×1500, keep a small card variant, serve both via `srcset`/`sizes`, bring `pulp-fiction-background.jpg` to 1920×1080, and add a CSS guard against upscaling past intrinsic width. Review `.mv-poster-img { object-fit: contain }` (`movies.css:97`), which letterboxes rather than fills.
      *Check:* at 1440 px / 2× DPR no `<img>` renders wider than its `naturalWidth`; posters report `naturalWidth >= 1000`.
- [ ] **9.5** Update `assets/manifest.json` and `assets/movie-art/SOURCES.md` with new dimensions, bytes and provenance.
      *Check:* the manifest matches the files on disk.
- [ ] **9.6** Expand the series catalog to 12–15 titles with real artwork; remove every `kind:'placeholder'`; populate `platforms`, `rating`, `moods`, `tags` and a substantive `blurb`.
      *Check:* the Series filter returns a full illustrated grid; zero placeholder records remain in `movies-data.js`.
- [ ] **GATE 9:** all preserved Phase 6 behaviours in `agent-instructions.md` §9.4 still pass.

---

## Phase 10 — Explore

- [ ] **10.1** Replace the 12 conceptual destination SVGs with real licensed photography at hero and card resolutions, following the 9.4 sizing rules. Keep everything under root `assets/destinations/` so the three `^assets/` validators keep accepting saved records.
      *Check:* every destination shows a photograph; a forced 404 still leaves a usable card; previously-saved destinations still validate.
- [ ] **10.2** Write substantive per-destination descriptions: what the place is, why it suits its categories, best season and why, trip length, budget character, what a traveller actually does there. `summary` stays short for cards; `details` carries the long form.
      *Check:* no destination has a thin `details` field.
- [ ] **10.3** Resolve the `explore.js` discrepancy — required by `tests/tracker-regression.test.js:4`, absent from `index.html`'s 22 scripts. It auto-mounts on load, so simply adding a tag would double-mount.
      *Check:* the test and the browser agree; exactly one mount occurs.
- [ ] **10.4** Move "More to explore" (`index.html:551`) to be the **last** Explore section; it is currently third of four.
      *Check:* section order ends with More to explore.
- [ ] **GATE 10:** all preserved Phase 4 behaviours in `agent-instructions.md` §10.4 still pass.

---

## Phase 11 — Personal regression

- [ ] **11.1** Confirm Work's five removed surfaces landed correctly: next-up tasks, timer mirror and countdowns on **Productivity**; quick note on **Notes**; recents on **Shortcuts/Home**. None goes to Personal.
      *Check:* each surface exists exactly once, on its owning page.
- [ ] **11.2** Re-verify Personal add / edit / check / delete / cancel after re-render and reload.
      *Check:* deletion still shows the confirm modal, the toast and the `aria-live` message.
- [ ] **GATE 11:** goals, routines and habits are unchanged in behaviour and storage.

---

## Phase 12 — Verification and delivery

- [ ] **12.1** `node --test tests/` — all suites, including `structure.test.js`.
- [ ] **12.2** New tests present and passing: structural (1.9), domain boundaries (Gate 3), hidden-shortcut round trip (7.1), tracker-type inference (8.2), weekly reset (8.6), toggle involution (8.8), untrack (9.1), provider normalisation and error/offline states (6.3).
- [ ] **12.3** Browser smoke over all 11 routes via `tests/browser-smoke.mjs` — `routes(tab)`, `layout(tab)`, `workLifecycle(tab)`.
- [ ] **12.4** Navigation, add/edit/delete, modal cancel, reload persistence, filters, checkboxes, close/reopen, backlog/history, reminders, image fallback, external links.
- [ ] **12.5** Work hierarchy and close-all; Personal delete confirmation; Explore explanations and fallback; game links and defaults across genres **and both tracker types**; movie and series genre views.
- [ ] **12.6** Backup export/import with all new data; reset behaviour; unrelated `localStorage` keys preserved.
- [ ] **12.7** Keyboard-only pass and reduced-motion pass — every route genuinely still.
- [ ] **12.8** Layout pass at 1440 / 1024 / 760 / 390 px against the 0.6 baseline — no overflow, no overlap, no broken images.
- [ ] **12.9** Offline pass — provider unreachable gives a visible degraded state, never a silent local fallback presented as global results.
- [ ] **12.10** Image-fallback pass: `$env:MISSING_ASSET = 'assets/destinations/azores.svg'` on the disposable server.
- [ ] **12.11** Every button from inventory 0.5 has a success test and an applicable cancel / error / persistence test.
- [ ] **12.12** Every box in this file is ticked, or carries a `[~]` and a written reason.
- [ ] **GATE 12:** zero uncaught console errors on every tested route.

---

## Phase 13.3 — Final documentation

- [ ] **13.3a** `README.md` — folder structure, data model, provider setup and offline behaviour, server command, test commands, backup compatibility, cinematic interaction rules, accessibility behaviour, scope limits.
- [ ] **13.3b** `VERIFICATION.md` — a fresh acceptance run recording what was actually tested and what was not.
- [ ] **13.3c** `docs/REVISED-IMPLEMENTATION-PLAN.md` — reconcile with what Phase 6 actually delivered, so the two documents stop contradicting each other on the provider question.
- [ ] **13.3d** Update the Progress table at the top of this file.
