# OneSpace Development, Discovery, and Cinematic Interaction Tracker

## Context

OneSpace is a local-first single-page dashboard (`index.html` + 24 sibling JS files + 8 sibling CSS files, all flat at the repository root). It already has working Games, Movies, Explore, Work and Personal modules, a storage validation boundary, a cinematic visual system, and a Node test suite.

Three things are being done here, and they are deliberately kept separate:

1. **Repository regrouping (new in this revision).** Every source file currently sits at the repository root. With ~34 flat files the domain ownership is invisible, and "all games files" cannot be tracked as a unit. Files must be regrouped into top-level domain folders so each file lives in the folder that owns it.
2. **Feature work (the existing plan, preserved).** Extend the dashboard into a complete development tracker and richer personal/discovery hub, without replacing its router, storage boundary, Games/Movie modules, or cinematic visual system.
3. **Reported defects and experience gaps (Part C).** Seven issues raised from using the app: a tracked movie can never be untracked, large movie images are blurred, series are effectively missing, game tracker checkboxes cannot be un-checked, destinations lack real photography and substantive descriptions, shortcuts look dated, and the app should feel warm and alive with per-tab cinematic treatment. Two of these are confirmed code defects with root causes identified; one needs reproducing before it is changed. Each is folded into the Part B phase that owns it rather than duplicated.

Additionally, there is **no credentials handling of any kind today**: no `.gitignore`, no `package.json`, and the `providers/` folder is empty. A dedicated, git-ignored secrets folder must be created now so that a future provider-backed phase has a safe place for API keys, and so no key is ever committed by accident.

The intended outcome is a repository where domain ownership is obvious from the folder tree, secrets can never be committed or served over HTTP, and the application's runtime behavior, URL, storage keys and test commands are byte-for-byte unchanged by the reorganization.

---

## Part A — Repository Organization (Phase 1.5)

### A.1 Target Structure

Top-level domain folders. `index.html` and `assets/` stay at the repository root.

```
repo/
  index.html                 (stays — entry URL and document-relative asset base)
  assets/                    (stays — see A.3)
    destinations/ game-art/ game-logos/ movie-art/ page-art/
  games/
    games.js  games-data.js  game-resources.js
    games.css  games-cinematic.css
  movies/
    movies.js  movies-data.js
    movies.css  movies-cinematic.css
  explore/
    explore.js  explore-data.js  explore-global.js
    discovery-integration.js  discovery-ui.js  local-discovery.js
    trip-board.js
    discovery.css
  work/
    projects.js  work-tracker.js
    tracker.css
  personal/
    personal-controller.js
  shared/
    storage-utils.js  catalog-utils.js
    shortcut-utils.js  shortcut-surface.js
    domain-ui.js  tooltip-utils.js  visual-utils.js  cinematic-scenes.js
  styles/
    pages.css  cinematic-refinement.css
  server/
    _static-server.js
    providers/               (replaces the empty root providers/; future adapters only)
  config/
    secrets.example.json     (committed template)
    secrets/                 (git-ignored — see A.5)
      .gitkeep
  tests/
    data-regression.test.js  tracker-regression.test.js
    browser-server.js  browser-smoke.mjs
    structure.test.js        (NEW — see A.6)
    fixtures/
  docs/
    REVISED-IMPLEMENTATION-PLAN.md
  README.md
  VERIFICATION.md
  .gitignore                 (NEW)
```

### A.2 Complete File Move Map

Every existing source file and its destination. No file stays at the root except `index.html`, `README.md`, `VERIFICATION.md`.

| Current path | Destination |
|---|---|
| `games.js` | `games/games.js` |
| `games-data.js` | `games/games-data.js` |
| `game-resources.js` | `games/game-resources.js` |
| `games.css` | `games/games.css` |
| `games-cinematic.css` | `games/games-cinematic.css` |
| `movies.js` | `movies/movies.js` |
| `movies-data.js` | `movies/movies-data.js` |
| `movies.css` | `movies/movies.css` |
| `movies-cinematic.css` | `movies/movies-cinematic.css` |
| `explore.js` | `explore/explore.js` |
| `explore-data.js` | `explore/explore-data.js` |
| `explore-global.js` | `explore/explore-global.js` |
| `discovery-integration.js` | `explore/discovery-integration.js` |
| `discovery-ui.js` | `explore/discovery-ui.js` |
| `local-discovery.js` | `explore/local-discovery.js` |
| `trip-board.js` | `explore/trip-board.js` |
| `discovery.css` | `explore/discovery.css` |
| `projects.js` | `work/projects.js` |
| `work-tracker.js` | `work/work-tracker.js` |
| `tracker.css` | `work/tracker.css` |
| `personal-controller.js` | `personal/personal-controller.js` |
| `storage-utils.js` | `shared/storage-utils.js` |
| `catalog-utils.js` | `shared/catalog-utils.js` |
| `shortcut-utils.js` | `shared/shortcut-utils.js` |
| `shortcut-surface.js` | `shared/shortcut-surface.js` |
| `domain-ui.js` | `shared/domain-ui.js` |
| `tooltip-utils.js` | `shared/tooltip-utils.js` |
| `visual-utils.js` | `shared/visual-utils.js` |
| `cinematic-scenes.js` | `shared/cinematic-scenes.js` |
| `pages.css` | `styles/pages.css` |
| `cinematic-refinement.css` | `styles/cinematic-refinement.css` |
| `_static-server.js` | `server/_static-server.js` |
| `providers/` (empty) | `server/providers/` |
| `REVISED-IMPLEMENTATION-PLAN.md` | `docs/REVISED-IMPLEMENTATION-PLAN.md` |

Use `git mv` for every move so history is preserved.

### A.3 Assets Stay at the Root — and Why

Asset paths inside JS (`'assets/game-art/hades-hero.jpg'` in `games-data.js`, `movies-data.js`, `explore-data.js`) are **document-relative**: the browser resolves them against `index.html`'s URL, not against the script's own location. Because `index.html` stays at the root, moving the JS files changes nothing about these ~40 strings.

Moving `assets/` into domain folders would require rewriting all of them plus `SOURCES.md` files and the `MISSING_ASSET` test hook, for no runtime benefit. Therefore **`assets/` stays at the repository root**, with its existing per-domain subfolders (`game-art/`, `movie-art/`, `destinations/`, `page-art/`) providing the domain grouping.

There is a second, stronger reason. Three validators hardcode an `^assets/` prefix and run against **data already saved in the user's browser**:

- `local-discovery.js:5` — `/^assets\/[\w./-]+$/`
- `storage-utils.js:36` — `/^assets\/[\w/-]+\.(svg|webp|png|jpg)$/` (destination `image` field)
- `trip-board.js:6` — `/^assets\/[\w./-]+$/`

Relocating `assets/` would make every previously-saved destination, trip-board entry and discovery record fail validation on load — silent data loss for anyone already using the app. Keeping `assets/` at the root avoids this entirely and leaves all three regexes untouched.

Also unaffected for the same document-relative reason: the nine `<img src="assets/page-art/...">` tags in `index.html` (lines 169, 227, 290, 468, 494, 503, 537, 577, 601).

CSS `url()` paths are the opposite case — they resolve **relative to the stylesheet**. All five occurrences are in one file, `cinematic-refinement.css` (lines 72, 73, 100, 101, 102), moving to `styles/`. Each needs a `../` prefix:

```
url('assets/game-art/cyberpunk-2077-hero.jpg')  ->  url('../assets/game-art/cyberpunk-2077-hero.jpg')
url('assets/movie-art/inception-background.jpg') ->  url('../assets/movie-art/inception-background.jpg')
url('assets/game-art/hades-hero.jpg')            ->  url('../assets/game-art/hades-hero.jpg')
url('assets/movie-art/matrix-background.jpg')    ->  url('../assets/movie-art/matrix-background.jpg')
url('assets/page-art/personal-cinematic.webp')   ->  url('../assets/page-art/personal-cinematic.webp')
```

No other CSS file contains an asset `url()`.

### A.4 Blocking Issues That Must Be Fixed As Part Of The Move

These are not optional cleanups. Each one silently breaks the app or the test suite the moment files move.

**1. The static server 404s a `work/` folder.** `_static-server.js:11` rejects any request whose path contains a segment in `['providers','tests','node_modules','work','outputs','api']`. Creating a top-level `work/` folder makes `work/projects.js`, `work/work-tracker.js` and `work/tracker.css` unreachable, and the Work page dies with no obvious cause. The list must become:

```
blocked segments: ['tests','node_modules','outputs','api','server','config','secrets']
```

— `'work'` removed (it is now a served source folder), `'providers'` removed (now covered by blocking `'server'`), and `'server'`, `'config'`, `'secrets'` added. The existing special case `decoded === '/_static-server.js'` can be dropped once `'server'` is blocked, but keeping it is harmless.

**2. The parse test silently stops covering anything.** `tests/data-regression.test.js:132` is `fs.readdirSync(root).filter(name => name.endsWith('.js'))` — non-recursive. After the move the root holds no application JS, so this loop would parse ~0 files and still pass, destroying the suite's core guarantee. It must be replaced with a recursive walk over the source folders, excluding `tests/`, `node_modules/`, `config/` and `assets/`.

**3. `shared/storage-utils.js` has a runtime require into the Explore domain.** `storage-utils.js:49` calls `require('./trip-board')` inside the `orbit-trip-board` validator. After the move this becomes `require('../explore/trip-board')`. Update the path in this pass; do **not** restructure the dependency. Note it as an architectural smell (the shared storage boundary reaching into a domain) and leave a follow-up to inject the validator instead — behavior must not change here.

**4. Script execution order is load-bearing.** All 22 `<script src>` tags are classic scripts with no `defer` and no `type="module"`, so they execute strictly in document order. Six run *before* the large inline controller script (line 879–3087) and sixteen run *after* it. The move must rewrite only the `src` prefixes and must not reorder, merge, split, or add `defer` to a single tag.

The order encodes real module-scope dependencies, any of which breaks with a silent `undefined` if disturbed:

- `trip-board.js` → before `storage-utils.js` (the `orbit-trip-board` validator reads `OneSpaceTrips`).
- All six batch-1 files → before the inline shell (it reads `OneSpaceStorage`, `OneSpaceShortcuts`, `makePersonalController`).
- The inline shell (which defines `window.OneSpace` at line 3079) → before **every** batch-2 file; each reads `window.OneSpace` at module scope.
- `domain-ui.js` → before `projects.js`, `games.js`, `discovery-ui.js`, `explore-global.js`.
- `work-tracker.js` → before `projects.js` (reads `OneSpaceWork`).
- `explore-data.js` → before `discovery-ui.js` and `explore-global.js` (read `DESTINATIONS`).
- `local-discovery.js` → before `discovery-ui.js`.
- `game-resources.js` → before `games-data.js` (guarded `if (window.OneSpaceGameResources)`).
- `games.js` and `movies.js` → before `discovery-integration.js` (reads `OneSpaceGameDiscovery`, `OneSpaceTitleDiscovery`).
- `games.js` mutates `window.OneSpace.playGamesEntryAnimation`, so the inline shell must have created the object first.

Note also that `work-tracker.js` and `explore.js` **auto-invoke `api.mount(root)` at load time** in the browser branch of their UMD wrapper. Loading either one twice, or loading `explore.js` for the first time, mounts a second instance — which is exactly why A.4 item 5 forbids adding `explore.js` to `index.html` during the move.

**5. `explore.js` is a pre-existing discrepancy — do not "fix" it.** `explore.js` is required by `tests/tracker-regression.test.js` but is **not** referenced by any `<script>` tag in `index.html`; the browser uses `explore-global.js` instead. Move `explore.js` to `explore/` and update the test require, but do **not** add it to `index.html` as part of the regrouping. Record it as a separate question to resolve in Part B Phase 4.

### A.5 Secrets and Credentials Folder (new — nothing exists today)

There is no `.gitignore`, no `package.json`, and `providers/` is empty. Create:

- **`config/secrets/`** — real credential files live here. Contains a committed `.gitkeep` so the folder exists in a fresh clone. Everything else in it is ignored.
- **`config/secrets.example.json`** — committed template with placeholder values documenting every key a future provider phase will need (e.g. TMDB, IGDB/RAWG, a place/geocoding provider). Never contains a real value.
- **`.gitignore`** (new file at the repository root):

```
config/secrets/*
!config/secrets/.gitkeep
.env
.env.*
*.local.json
node_modules/
```

Three rules govern this folder, and all three must hold:

1. **Server-only.** No file under `config/` may ever be referenced by `index.html`, by any browser script, or by any `<script>`/`<link>` tag. Browser JavaScript is fully readable by the user, so a key placed there is a published key.
2. **Not servable.** `'config'` and `'secrets'` are added to the static server's blocked-segment list (A.4 item 1) so the folder cannot be fetched over HTTP even if a file lands there.

   The server's extension allowlist is a useful second layer but **not sufficient on its own**. `_static-server.js` serves only the extensions in its MIME map (`.html .js .css .svg .webp .png .jpg .jpeg .ico .woff2`), so a `secrets.json` would 404 incidentally — but a credential file named `.js` **would be served in full**. The segment block is the real control; do not rely on the extension allowlist. Note also that `tests/browser-server.js` has *no* deny list at all and does serve `.json`, so it must never be pointed at a tree containing real credentials.
3. **Not used yet.** This phase creates the folder, the template and the ignore rules only. No credential is read, and no provider adapter is written — that is explicitly out of scope (see Scope Boundaries).

### A.6 Reference Updates — Exhaustive Checklist

**`index.html`** — 8 `<link rel="stylesheet">` (lines 103–110) and 22 `<script src>` (lines 872–878 and 3088–3103). Rewrite each `href`/`src` with its new folder prefix, preserving exact order:

- Stylesheets: `games/games.css`, `games/games-cinematic.css`, `styles/pages.css`, `movies/movies.css`, `movies/movies-cinematic.css`, `styles/cinematic-refinement.css`, `work/tracker.css`, `explore/discovery.css`
- Pre-inline scripts (keep this order): `explore/trip-board.js`, `shared/storage-utils.js`, `shared/catalog-utils.js`, `shared/tooltip-utils.js`, `shared/shortcut-utils.js`, `personal/personal-controller.js`
- Post-inline scripts (keep this order): `shared/visual-utils.js`, `shared/domain-ui.js`, `shared/shortcut-surface.js`, `work/projects.js`, `work/work-tracker.js`, `explore/explore-data.js`, `explore/local-discovery.js`, `explore/discovery-ui.js`, `explore/explore-global.js`, `games/game-resources.js`, `games/games-data.js`, `games/games.js`, `movies/movies-data.js`, `movies/movies.js`, `shared/cinematic-scenes.js`, `explore/discovery-integration.js`

The `<link rel="icon">` on line 7 is an inline `data:` URI — leave it alone.

**`tests/data-regression.test.js`** — `require('../storage-utils.js')` (L7) → `../shared/storage-utils.js`; `require('../catalog-utils.js')` (L8) → `../shared/catalog-utils.js`; the `vm.runInContext` loads at L12–13 of `game-resources.js`, `games-data.js`, `movies-data.js` → `games/game-resources.js`, `games/games-data.js`, `movies/movies-data.js`; the recursive parse walk (A.4 item 2, L131–137). The `root/index.html` read at L135 is unchanged. Fixture paths under `tests/fixtures/` are unchanged.

**`tests/tracker-regression.test.js`** — line 4 requires become `../shared/storage-utils`, `../work/work-tracker`, `../explore/explore`, `../shared/shortcut-utils`, `../games/game-resources`; line 80 `../catalog-utils` → `../shared/catalog-utils`; line 12's `vm.runInContext` list becomes `['games/game-resources.js','games/games-data.js','movies/movies-data.js','explore/explore-data.js']`; line 87's `personal-controller.js` → `personal/personal-controller.js`.

**`tests/browser-server.js`** — resolves `root = path.resolve(__dirname,'..')` and serves any relative path with no block list, so it keeps working unchanged. Confirm the `MISSING_ASSET` hook still points at `assets/destinations/azores.svg` (valid, since assets do not move).

**`shared/storage-utils.js`** — the `require('./trip-board')` on line 49 (A.4 item 3).

**`README.md`** — `node _static-server.js` (L8) and the `--preserve-symlinks` variant (L14) become `node server/_static-server.js`; the prose load-order paragraph (L67); and the file references at L35 (`explore-data.js`), L43 (`storage-utils.js`), L54 (`explore-data.js`), L65 (`index.html`), L67 (`domain-ui.js`, `tracker.css`). The `tests/*` and `assets/destinations/azores.svg` references (L72, 81, 84, 86) are unchanged.

**`VERIFICATION.md`** — L8 names `data-regression.test.js` and `tracker-regression.test.js` as bare filenames with no `tests/` prefix; update them to full paths while editing. L9 and L33 (`tests/browser-smoke.mjs`, `assets/destinations/azores.svg`) are unchanged. Separately, VERIFICATION.md cites a port `18973` that no code defines (`tests/browser-server.js` defaults to `18974`) — a pre-existing doc error worth correcting in the same pass.

**Out of scope, record only.** The audit found unreferenced assets: the whole `assets/game-logos/` folder (6 SVGs), 16 year-stamped files in `assets/movie-art/`, the 7 `.png` twins of the `.webp` heroes in `assets/page-art/`, and `assets/game-art/cyberpunk-2077.svg` / `hades.svg`. Do **not** delete these during the regrouping — deletion is a behavior change and needs its own review. Note them for a later cleanup.

**Structural verification test (`tests/structure.test.js`, new).** Asserts, by reading files rather than by convention:
- every `<script src>` and `<link href>` in `index.html` resolves to a file that exists on disk;
- every `require(...)` of a repo-relative path in every source and test file resolves;
- every `assets/...` string literal in JS and every `url(...)` in CSS resolves to an existing file;
- the recursive parse walk visits a file count matching the expected source inventory (guards against A.4 item 2 regressing again);
- no file under `config/` is referenced from `index.html` or any browser script;
- the 22 `<script src>` values appear in exactly the expected order (guards the load-order coupling in A.4 item 4);
- every `assets/...` literal still satisfies the three `^assets/` validators in `shared/storage-utils.js`, `explore/local-discovery.js` and `explore/trip-board.js` (guards the A.3 decision against a later accidental asset move).

### A.7 Execution Order for the Regrouping

Run the full test suite and capture a green baseline **before** touching anything. Then move in small batches, updating references and re-running tests after each batch:

1. `shared/` (highest fan-in — do it first so later batches update against final paths), including the `storage-utils` → `trip-board` require.
2. `styles/` + the five `url()` rewrites in `cinematic-refinement.css`.
3. `games/`.
4. `movies/`.
5. `explore/` (includes `trip-board.js`; verify the `storage-utils` require resolves).
6. `work/` + `personal/` — **and in this same batch** update the static server's blocked-segment list, since `work/` is unreachable until then.
7. `server/` + `config/` + `.gitignore` + `docs/`.
8. Add `tests/structure.test.js` and the recursive parse walk.

After every batch: `node --test tests/` must pass, and the app must load at `http://localhost:8973` with no 404s, no console errors, no duplicate script execution and unchanged global initialization order.

### A.8 Invariants — Must Not Change

- The entry URL stays `http://localhost:8973/` serving root `index.html`.
- All `localStorage` keys are unchanged (`orbit-work-projects`, `orbit-trip-board`, etc.). A folder move must never touch a storage key.
- All public browser globals keep their names. The complete set, by owning file:

  | Owner (new path) | Global(s) |
  |---|---|
  | `index.html` inline | `OneSpace` |
  | `shared/storage-utils.js` | `OneSpaceStorage` |
  | `shared/catalog-utils.js` | `OneSpaceCatalog` |
  | `shared/shortcut-utils.js` | `OneSpaceShortcuts` |
  | `shared/shortcut-surface.js` | `OneSpaceShortcutUI` |
  | `shared/domain-ui.js` | `OneSpaceUI` |
  | `shared/visual-utils.js` | `OneSpaceVisual` |
  | `personal/personal-controller.js` | `makePersonalController` |
  | `work/work-tracker.js` | `OneSpaceWork` |
  | `explore/trip-board.js` | `OneSpaceTrips` |
  | `explore/explore-data.js` | `DESTINATIONS` |
  | `explore/local-discovery.js` | `OneSpaceLocalDiscovery` |
  | `explore/discovery-ui.js` | `OneSpaceDiscovery` |
  | `explore/explore.js` | `OneSpaceExplore` (test-only today) |
  | `games/game-resources.js` | `OneSpaceGameResources` |
  | `games/games-data.js` | `DEFAULT_GAMES`, `SUGGESTION_CATALOG`, `DIABLO_WEEKLY_TEMPLATE`, `GAMES_GENRES`, `GAMES_MOODS`, `GAMES_PLATFORMS`, `GAMES_PLAYSTYLES` |
  | `games/games.js` | `OneSpaceGameDiscovery`, plus `OneSpace.playGamesEntryAnimation` |
  | `movies/movies-data.js` | `SEED_MOVIES`, `MOVIE_DECADES`, `MOVIE_DURATIONS`, `MOVIE_GENRES`, `MOVIE_LANGUAGES`, `MOVIE_MOODS`, `MOVIE_PLATFORMS`, `MOVIE_TYPES` |
  | `movies/movies.js` | `OneSpaceTitleDiscovery` |

  `work/projects.js`, `shared/tooltip-utils.js`, `shared/cinematic-scenes.js`, `explore/explore-global.js` and `explore/discovery-integration.js` export nothing — they are pure side-effect modules and must keep their exact position in the load order.
- The UMD dual-export pattern (`typeof module === 'object' && module.exports ? ... : root.X = api`) stays in every file that has it.
- Test commands stay `node --test tests/data-regression.test.js tests/tracker-regression.test.js`.
- Backup format version 2 and all existing fixtures remain valid.
- No compatibility shims unless an external tool demands one; if any is added, document it in `README.md`.
- **No behavior change of any kind in Part A.** If a bug is found mid-move, note it and fix it in Part B.

---

## Part B — Feature Work (existing plan, preserved)

### Current Findings

- `index.html` is the single-page shell and router. `goToPage()` controls Home, Work, Projects, Personal, Explore, Games, Movies, Shortcuts, Productivity, Notes, and Settings.
- `projects.js` owns project records in `orbit-work-projects` (name, description, tags, URL, status, progress). Work renders a read-only project summary and generic Productivity tasks.
- Personal uses `makeCheckListController()` inside `index.html` for goals, routines, and habits. Add/check/delete work, but delete is immediate and there is no edit flow.
- Explore filters and randomizes existing Travel and Relax & Play links. There is no destination preference model, catalog, recommendation explanation, saved list, or imagery model.
- Games is the strongest reference implementation: local catalog, genre preferences, add-to-library, story objectives, weekly task templates, sessions, journal, links, progress, themes, persistence.
- Movies has catalog, library, suggestions, watchlist and details infrastructure, but is movie-focused; series are not first-class.
- `storage-utils.js` strictly validates known keys and complete version-2 backups. New domain keys require validation rules, fixture updates, and migration decisions.
- Automated coverage is concentrated in `tests/data-regression.test.js` and `tests/tracker-regression.test.js`.
- Visual infrastructure includes local page art, fallback illustrations, `visual-utils.js`, `cinematic-scenes.js`, responsive layouts, inline SVG icons, motion overrides, and cinematic CSS. New work must make effects observable in the browser, not infer them from CSS presence.

### Product Decisions

- Local-first. No backend, authentication, provider credentials, or cloud sync in the core iteration.
- Core Work hierarchy: `project -> work item -> task`. A work item is a `story` or `defect`.
- Work item statuses: `open`, `in-progress`, `blocked`, `closed`.
- Tasks have independent completion state, but closing a work item closes all remaining child tasks.
- Closed work items are preserved in a Work Log/Backlog history rather than deleted; the backlog supports filtering and reopening.
- Analysis, plan and execution are editable text fields on each story/defect.
- Add priority, labels, estimate, created/updated dates, deadline and reminder fields.
- Browser-native date/time values with local reminders while the page is open. No promise of notifications after the page closes.
- Personal deletion uses the existing modal/confirmation conventions and shows a toast on success.
- Explore uses a curated local destination catalog: city break, nature, beach, culture/history, food, wellness, adventure.
- Explore recommendations explain the matched preferences and always show a local image or deterministic fallback.
- Explore shortcuts are stored/tagged as `explore` and must not appear in Work or Personal.
- Games retains the existing catalog and gains a per-game detail/resource surface (official news, builds/guides, updates, community, platform links). Adding a game creates default tracker tasks/objectives from the selected tracker type.
- Movies becomes Movies & Series while preserving the existing `movies` route and storage keys, using a first-class `movie`/`series` type filter. No full episode-level tracking unless separately approved.
- Keep the current cinematic direction and the existing inline SVG icon system for all new actions.

### Phase 1: Baseline and Contracts

1. Run `node --test tests/data-regression.test.js tests/tracker-regression.test.js` and capture the green baseline.
2. Parse every JavaScript file and the inline script in `index.html`.
3. Start the static server and inspect the app at `http://localhost:8973`.
4. Record current storage keys, backup format, router pages, script load order, and `onespace:data-changed` / `onespace:page-changed` events.
5. Inventory every button, tab, link, form, checkbox, select, modal action, keyboard shortcut and page jump. For each, record owner, expected state change, persistence key, success feedback, error behavior, focus return and reload behavior.
6. Treat `shared/storage-utils.js` as the only persistence validation boundary.
7. Define schemas for projects, work items, tasks, work history, destinations, destination preferences, saved destinations, Personal records, game resources, game default tasks, and movie/series metadata.
8. Include generated IDs, timestamps, status enums, optional fields and maximum lengths in every schema.
9. Decide migration behavior for existing projects, Personal arrays, Games, Movies and version-2 backups.
10. Ensure existing records remain readable and new fields receive safe defaults.
11. Do not begin provider-backed global discovery in this iteration.

### Phase 1.5: Repository Regrouping

**See Part A above** — this is the detailed, binding specification. It runs after the Phase 1 baseline is captured and before any Part B feature work begins.

### Phase 2: Work Tracker Core

1. Stabilize `work/work-tracker.js` as the module home instead of growing the inline script.
2. Keep `work/projects.js` compatible with current project summaries and Home/Work cards.
3. Add storage keys and validation for projects, work items, tasks and work log/history.
4. Update backup, restore, reset, complete, invalid, legacy and current fixtures.
5. Project CRUD: name, description, link, tags, status, progress, deadline.
6. Story/defect CRUD under a selected project.
7. Story/defect fields: name, type, status, priority, analysis, plan, execution notes, labels, deadline, reminder time, optional links.
8. Validate required name, project, type and status fields.
9. Reject invalid URLs and invalid dates.
10. Task CRUD: title, details, priority, due date, estimate, `done` state.
11. Accessible task checkboxes with completion styling and progress counts.
12. Open, reopen, in-progress, blocked and close lifecycle behavior.
13. Closing a story/defect marks all child tasks complete, stores completion time, creates a log entry and removes it from active views.
14. Closed items persist in the backlog and reopen without losing task history.
15. Work views: active projects, active stories/defects, due soon, overdue, blocked, backlog, history.
16. Filters by project, type, status, priority, deadline and search text.
17. Replace the generic Work timeline with real story/defect and task priorities.
18. Keep a link to Productivity for general daily tasks.
19. Local due-soon and overdue badges, reminder panels and page-entry toast notifications.
20. Respect reduced-motion settings for reminder and state-change animations.
21. Verify every Work button: create, edit, detail, hide, lifecycle, status, task add/edit/delete/toggle, filters, backlog, history, project links, deletion confirmation.

### Phase 3: Personal and Shortcut Scope

1. Refactor `makeCheckListController()` into reusable add, edit, toggle and delete operations.
2. Route deletion through the existing modal/confirmation pattern.
3. Toast and `aria-live` message after successful deletion.
4. Keep separate storage for goals, routines and habits.
5. Completion counts and progress summaries.
6. Optional habit frequency or target metadata.
7. Clear empty states.
8. Extend the shortcut modal with a short description field and explicit space/category ownership.
9. Adding from Personal defaults the shortcut to Personal.
10. Adding from Explore forces the shortcut to Explore.
11. Enforce ownership in shortcut sanitization and `linkSpace()` so links cannot leak between spaces.
12. Edit and delete confirmation for custom shortcuts.
13. Show name, description, hostname, icon fallback, favorite action, recent action, safe external-link behavior.
14. Regression tests for Personal deletion, descriptions, space filtering, duplicate URLs and backup round trips.
15. Verify Personal add/edit/check/delete/cancel, shortcut add/edit/favorite/recent/reorder/delete/cancel and empty-state actions after rerender and reload.

### Phase 4: Explore Destination Discovery

1. `explore/explore-data.js` holds the curated local destination catalog.
2. Destination fields: ID, name, country/region, categories, budget, duration, season, travel style, tags, summary, details, links, image, fallback metadata.
3. `explore/explore.js` holds persisted destination preferences. **Resolve the Part A.4 item 5 discrepancy here**: decide whether `explore.js` is loaded by `index.html` or whether its logic belongs in `explore-global.js`, and make the test and the browser agree.
4. Support destination type, climate/season, trip length, budget, travel pace, interests and departure-region assumptions.
5. Keep recommendation ranking deterministic and explainable.
6. Show why each destination was recommended.
7. Replace Explore content with preference controls, recommendation cards, destination details, save/favorite behavior, shortlist/trip board and Explore-only shortcuts.
8. Keep "Surprise me" as a filtered random recommendation.
9. Responsive destination images with fallback handling modeled on `shared/visual-utils.js`.
10. Accessible image alt text; never render blank destination cards.
11. Tests for preference filtering, stable ranking, saved destinations, Explore-only shortcuts and malformed destination data.
12. Verify preference controls, search/filter submission, recommendation cards, detail open/close, save/remove, notes, trip-board actions, Surprise Me, image fallback and reload.
13. Keep "More To Explore" after the primary controls, recommendations, details and trip board.

### Phase 5: Games Resource and Task Enrichment

1. Extend `games/games-data.js` records with official, news, build, guide, update, community and platform links.
2. Add default task/objective templates to game records.
3. Keep the resource model data-driven so Diablo Immortal is only one example.
4. Extend `games/games.js` with a per-game detail/resource panel.
5. Group resources into news/updates, builds/guides, official links, community links and game-specific tasks.
6. Catalog, suggestions, wishlist and custom-game flows initialize the correct story or daily/weekly tasks.
7. Avoid duplicate task initialization after rerender or reload.
8. Keep every built-in and custom game discoverable through genre filtering, search, add, edit, delete, progress and resource flows.
9. Preserve existing sessions, journal, themes, story objectives and weekly behavior.
10. Tests for resource mapping, default task creation, genre filtering and deletion cleanup.
11. Verify every Games tab, filter, search, suggestion, library, wishlist, details, resource link, task, session, journal, theme, add, edit, delete and confirmation action.

### Phase 6: Movies and Series

1. Extend `movies/movies-data.js` with first-class `type: movie|series`.
2. Add series metadata, explanations, seasons and relevant details.
3. Add type and genre filters.
4. Update `movies/movies.js` cards, search, details, suggestions and watchlist views.
5. Preserve the existing `movies` route and storage keys.
6. Keep episode tracking lightweight unless scope is expanded.
7. Series-specific validation in `shared/storage-utils.js`.
8. Update backup fixtures and migration handling.
9. Tests for mixed movie/series search, type and genre filtering, suggestion explanations, watchlist behavior and malformed series data.
10. Verify every Movies & Series tab, type filter, genre filter, search, suggestion, detail, add/remove, watched state, watchlist, library and reload flow.

### Phase 7: Visual, Cinematic, Icon and Interaction Direction

1. Visual direction per experience: Home = observatory / personal command deck; Work = drafting room / command center; Personal = calm ritual space; Explore = world atlas / travel window; Games = game-world spotlight; Movies & Series = theater / streaming marquee; Shortcuts = navigable launch wall; Productivity = focused timer studio; Notes = quiet capture desk; Settings = control room.
2. Entry transition when each tab opens — short, consistent, content-first, never delaying interaction.
3. Hero scene movement or parallax responding to pointer on desktop, stable on touch.
4. Parallax only on explicitly marked decorative scene layers. Clamp pointer values, use `transform: translate3d`, avoid layout shifts, never move essential text, forms, buttons or focus targets.
5. Scroll-linked depth effects only where they improve hierarchy, via IntersectionObserver or CSS scroll-driven behavior with a fallback.
6. Staggered reveal for primary content cards and sections — visible content only, no long queues, modest durations.
7. Meaningful transitions for search result arrival, filter changes, detail panel opening, save/remove, board status changes, task completion, tab changes, image loading and fallback replacement.
8. Cinematic loading states matched to the section rather than generic spinners.
9. Real image crossfades and sensible crop positioning for local artwork and destination/game/movie media.
10. Fallback art only on failed media requests; broken media still leaves a usable card with text and controls.
11. One consistent modern inline SVG icon system, with accessible text or labels retained for unfamiliar actions.
12. Hover, focus, active, empty, loading, error, disabled and success states for every interactive surface.
13. Accessible labels, tooltips for unfamiliar icons, `aria-pressed`, `aria-expanded`, `aria-current`, and `aria-live` messages for saves, reminders, task completion, close/reopen and deletion.
14. Route all motion through `prefersReducedMotion()` and the existing motion setting. Reduced motion removes parallax, scroll-linked transforms, stagger delays, persistent ambient animation and nonessential transitions while preserving state clarity.
15. Touch targets large enough for mobile; hover-only behavior disabled on coarse pointers.
16. Test layouts at 1440px+, 1024px, 760px and 390px. Cards, forms, lists, tables, modals, badges, task controls and tab bars must not overlap or overflow.
17. Handle long user-entered text safely: project names, destination titles, game titles, series titles, notes, labels, URLs, provider-like metadata.
18. Verify modal focus return and focus preservation after dynamic rerenders.
19. Capture visual evidence that effects are visible in normal motion, stable on touch/mobile, and disabled in reduced-motion mode.

### Phase 8: Verification and Delivery

1. Expand the Node tests for pure Work, Explore, shortcut, game, movie, visual-state and migration helpers.
2. Test schema validation, migration defaults, backup/restore, reset and storage rollback.
3. Browser-level smoke tests for every top-level route.
4. Test navigation, add/edit/delete, modal close/cancel, persistence after reload, filters, task checkboxes, close/reopen, backlog/history, reminders, image fallback and external links.
5. Run the complete recursive JavaScript parse test and all Node tests.
6. Start the static server and inspect the browser console for uncaught errors and failed local assets.
7. Verify Work hierarchy and close-all behavior.
8. Verify Personal delete confirmation.
9. Verify Explore recommendation explanations and image fallback.
10. Verify game-specific links and default tasks for multiple genres.
11. Verify movie and series genre views.
12. Verify backup export/import with all new data.
13. Verify reset behavior and unrelated `localStorage` preservation.
14. Verify keyboard-only navigation and reduced-motion mode.
15. Verify desktop, tablet and mobile layouts.
16. Verify each button from the Phase 1 inventory has a successful action test and an applicable cancel/error/persistence test.
17. Update documentation with the folder structure, data model, local-only behavior, server command, test commands, backup compatibility, cinematic interaction rules, accessibility behavior and scope limits.

---

## Part C — Reported Defects and Experience Gaps

These are additions raised after the original plan. Each one is folded into the Part B phase that owns it, so nothing here duplicates work described above — the cross-reference says where it executes. Where a root cause was verified by reading the code, it is stated as confirmed; where it was not, it is labelled a hypothesis to be proven in the browser first.

### C.1 A tracked movie can never be untracked — **confirmed defect**

*Executes in Phase 6.*

**Symptom (user-reported).** Once a movie is tracked it cannot be untracked.

**Root cause — confirmed by reading `movies.js`.** It is two independent blocks, and both must be lifted:

1. `addSeedToLibrary()` (line 442) sets `clone.custom = false` on every catalog title added to the library.
2. `libraryCardHtml()` (line 619) renders the delete button **only** when `movie.custom` is truthy: `var deleteBtn = movie.custom ? '<button … data-action="delete-movie" …>' : "";`. For a tracked catalog title no remove control is ever drawn.
3. `deleteMovie()` (line 456) independently guards `if (!m || !m.custom) return;`. So even if the action were dispatched, it would return early.

The only reversal the UI offers is the status `<select>` (Unwatched / Watched / Watchlist), which keeps the record in `library` — it still counts toward the "Titles tracked" stat tile (line 661). `removeFromWatchlist()` (line 468) likewise only downgrades status to `unwatched`; it never removes the record.

**Fix.** Separate two distinct concepts that are currently conflated under `custom`:

- **Untrack / Remove from library** — available for **every** tracked title, catalog or custom. Removes the record from `library` (and from `watchlist`), returning the title to an untracked catalog entry that can be re-added later. Confirmation via the existing `OneSpaceUI.confirm` modal, then a toast.
- **Delete custom title** — unchanged, remains restricted to `movie.custom`, since a custom record has no catalog entry to fall back to and its deletion is genuinely irreversible.

Drop the `!m.custom` guard from the untrack path, render the untrack control unconditionally on library cards and in the details panel, and make the "Titles tracked" count drop when a title is untracked.

**Verify.** Track a catalog movie → untrack it → it disappears from Library, the tracked count decreases, and it reappears as an untracked suggestion. Reload and confirm it stays untracked. Repeat for a series and for a custom title (which must still offer permanent delete).

### C.2 Large movie images are blurred — **confirmed cause**

*Executes in Phase 6, with the media rules in Phase 7.*

**Symptom (user-reported).** Big movie pictures are badly blurred; they should be sharp.

**Root cause — confirmed from `assets/manifest.json`.** This is not a CSS `blur()` filter; there is none on movie artwork in `movies.css` or `movies-cinematic.css`. The source files are simply too small. Every poster in `assets/movie-art/` is **300 × 450** (13–29 KB). Backdrops are fine at 1920 × 1080 (the one exception is `pulp-fiction-background.jpg` at 1280 × 720).

A 300 px-wide source shown in a detail panel at roughly 400–600 CSS px, on a 2× display, is being upscaled three to four times — which is precisely the reported blur.

**Fix.**

1. Re-source posters at a minimum of **1000 × 1500** for detail/hero use, keeping the existing 2:3 aspect ratio and file naming.
2. Keep a small variant for grid cards and serve both via `srcset` / `sizes`, so cards stay light while detail views are sharp.
3. Bring `pulp-fiction-background.jpg` up to 1920 × 1080 to match the rest.
4. Add a CSS guard so no image is ever scaled beyond its intrinsic width, making a future undersized asset visibly wrong rather than quietly blurry.
5. Update `assets/manifest.json` with the new dimensions and byte sizes, and record provenance in `assets/movie-art/SOURCES.md`.
6. Respect the existing licensing constraint in Scope Boundaries — no scraping, no unlicensed downloads. Where a properly licensed high-resolution image is unavailable for a title, render the existing deterministic fallback rather than shipping an upscaled blur.

**Verify.** Open a detail view at 1440 px on a 2× display and confirm the poster is sharp; check the Network panel shows the large variant only for detail views; confirm no image reports a rendered width greater than its `naturalWidth`.

### C.3 Series are effectively missing

*Executes in Phase 6.*

**Symptom (user-reported).** "Currently we do not have any series."

**Finding.** Series are not entirely absent, but they are close to invisible, which explains the report. `movies-data.js` defines `window.MOVIE_TYPES = ["movie", "series"]` (line 17) and contains exactly **4** `type:'series'` records (`tv-dark`, `tv-queens-gambit`, `tv-good-place`, and one more, lines 138–141) against 17 movies. Critically, **all 4 series carry `poster:{kind:'placeholder'}` and `backdrop:{kind:'placeholder'}`**, plus `platforms:[]` and `rating:0` — so they render as empty placeholder tiles with no artwork, next to 17 fully-illustrated movies.

**Fix.**

1. Expand the series catalog to a credible size — at least 12–15 titles spanning the same genre range as the movie catalog, so type filtering returns a useful result set.
2. Give every series real local artwork at the C.2 resolutions; remove all `kind:'placeholder'` entries from the seed data.
3. Populate the fields left empty: `platforms`, `rating`, `moods`, `tags`, and a substantive `blurb`.
4. Make the `movie` / `series` type filter first-class and visible in the UI, with correctly capitalized labels (`Movie`, `Series`) per the existing labelling rule.
5. Keep series cards honest about their shape — seasons and approximate episode length, which `libraryCardHtml` already formats (line 627) — without adding episode-by-episode tracking, which stays out of scope.

**Verify.** Filter by Series and confirm a full, illustrated grid with no placeholder tiles; confirm search returns mixed movie and series results; confirm a series can be tracked, watchlisted and untracked per C.1.

### C.4 Game tracker checkboxes cannot be un-checked — **hypothesis, reproduce first**

*Executes in Phase 5.*

**Symptom (user-reported).** Game tracker checkboxes do not behave as expected — once checked they cannot be returned to unchecked.

**What inspection established.** The toggle functions themselves read correctly and are genuinely two-way: `toggleObjective()` (`games.js:511`) does `obj.done = !obj.done`, and `toggleWeeklyTask()` (line 571) does `task.done = !task.done`. Both persist and re-render. I also ruled out a double-fire: the `click` delegate's `switch` (lines 1527–1555) has **no** case for `toggle-objective` or `toggle-weekly-task`, so those are handled only by the `change` listener (line 1558) and are not toggled twice per interaction. `ensureWeekly()` (line 211) only regenerates tasks when the ISO week key changes, so it is not resetting state mid-session.

**I did not run the app, so the cause is not yet proven.** The first task is to reproduce it in the browser and identify the mechanism before changing anything. Narrowed suspects, in the order worth checking:

1. **Re-render vs. DOM state.** Checkboxes are re-created by `innerHTML` with `(o.done ? "checked" : "")`. If any render path for the tracker panel does not actually re-run, the DOM keeps whatever the user clicked while the model diverges — or the reverse, where a stale render re-applies `checked`.
2. **Focus restoration re-triggering change.** `withFocusPreserved()` (line 1599) re-focuses the matching element by selector after the re-render; confirm this cannot re-dispatch a `change` event on the checkbox.
3. **The transient highlight classes.** `lastCheckedObjectiveId` / `lastCheckedTaskId` are set and cleared around the render, and drive `is-just-checked` styling (`games.css:730`, `860`). Confirm that styling is not what makes an unchecked box still *look* checked.
4. **A rejected write.** If `saveLibrary()` / `saveWeekly()` fails validation in the storage boundary and rolls back, the next render restores the old `done:true`. Check for a silent transaction failure.
5. **Label/input hit area.** The weekly task is a `<label>` wrapping the `<input>` (line 397); confirm a click is not being counted twice through label forwarding on some browsers.

**Fix.** Determined by the reproduction. Whatever the mechanism, the outcome must be that objectives and weekly tasks toggle freely in both directions, survive reload, and keep progress percentages consistent.

**Verify.** Check and uncheck an objective and a weekly task ten times each; confirm the percentage and the persisted value follow every time, and that the state is correct after reload. Add a regression test that asserts the toggle is a true involution — two toggles return the original state — so this cannot silently return.

### C.5 Every destination needs real imagery and a substantive description

*Executes in Phase 4.*

**Symptom (user-reported).** Every destination should have pictures and a detailed explanation of the place.

**Finding.** `explore-data.js` holds 12 destinations, each pointing at `assets/destinations/<id>.svg` (line 18). These are **conceptual SVG illustrations, not photographs** — the existing `REVISED-IMPLEMENTATION-PLAN.md` already flags this as a missed requirement. Each record carries a `summary` and a `details` field, but the depth is uneven.

**Fix.**

1. Give every destination real, properly licensed local imagery at a resolution suitable for hero and card use, following the same sizing and `srcset` rules as C.2.
2. Write a substantive description per destination: what the place is, why it suits the categories it is tagged with, the best season and why, rough trip length, budget character, and what a traveller actually does there. This is the "detailed explanation" being asked for — the existing `summary` stays short for cards, and `details` carries the long form.
3. Keep every destination non-blank: alt text always present, and the deterministic fallback illustration used only on a genuinely failed image request.
4. Maintain the licensing constraint — no scraping, no unlicensed downloads, attribution recorded in a `SOURCES.md` beside the assets.
5. Keep all destination art under the root `assets/destinations/` path so the three `^assets/` validators described in A.3 continue to accept previously-saved user records.

**Verify.** Every one of the 12 destinations renders a photograph and a full description; force a 404 on one asset and confirm the card stays usable with the fallback; confirm saved destinations still validate after the content change.

### C.6 Shortcuts need modernizing

*Executes in Phase 3, with the visual work in Phase 7.*

**Symptom (user-reported).** All shortcuts need to be modernized.

**Fix.** The existing Phase 3 work already adds descriptions, space ownership and edit/delete confirmation. This adds the presentation layer on top:

1. Rebuild the shortcut card and the launch wall on the current inline SVG icon system, replacing any dated iconography, with a clean favicon/hostname fallback chain that never renders a broken image.
2. Give shortcuts a modern grid with proper hover, focus, active, empty, loading and error states, and touch targets large enough for mobile.
3. Support drag-to-reorder with a keyboard-accessible equivalent, and make favorites and recents visually distinct rather than text-labelled.
4. Show name, description and hostname in a clear hierarchy, with safe external-link behavior (`rel="noopener noreferrer"`).
5. Keep Explore-owned shortcuts visually consistent but still strictly scoped — the ownership enforcement in Phase 3 is unchanged.

**Verify.** Add, edit, favorite, reorder and delete shortcuts by mouse and by keyboard alone; confirm state survives reload; confirm no broken icons at 1440, 1024, 760 and 390 px.

### C.7 The whole app should feel warm, alive and cinematic per tab

*Executes in Phase 7, which it extends rather than replaces.*

**Symptom (user-reported).** The whole page should be warm and alive, with cinematic, visual and animation effects that change based on the selected tab. Whatever is needed to build it should be used.

**Fix.** Phase 7 already defines a per-page visual direction, entry transitions, parallax, staggered reveals, media crossfades and the reduced-motion contract. This adds the parts the request makes explicit and the existing plan left implicit:

1. **Warmth is a palette decision, not an animation one.** Today's `--os-*` tokens in `cinematic-refinement.css` run cool. Introduce a warmer base — warmer neutrals, warmer light sources in the scene art — while preserving contrast ratios for accessibility.
2. **Per-tab identity must be unmistakable.** Each route already sets `body[data-page="…"]`; drive an accent, a scene treatment and an entry transition from that single hook so switching tabs visibly changes the room the user is standing in, not just the content.
3. **Ambient life within the motion budget.** Slow, low-amplitude ambient movement in decorative scene layers only, so a resting page is not static — subject without exception to `prefersReducedMotion()`, which must remove it entirely.
4. **The existing constraints still bind.** Parallax only on marked decorative layers, never on text, forms, buttons or focus targets; every effect purposeful and subordinate to content; a reduced-motion equivalent for each.
5. **"Whatever needs to be used" has one limit.** Point 4 of Scope Boundaries still holds: no external CDNs, no new runtime dependencies, and nothing that breaks the local-first, offline guarantee. The app currently makes zero network requests, and that property must survive this work.

**Verify.** Capture each route in normal motion, in reduced-motion mode, and at 390 px; confirm the tab identity reads at a glance, that reduced-motion is genuinely still, and that the Network panel still shows no external requests.

---

## Critical Files

| File | Role |
|---|---|
| `index.html` | Shell, router, inline controllers, 22 script + 8 style references. Stays at root. |
| `server/_static-server.js` | Local server. **Blocked-segment list must change** or `work/` 404s. |
| `shared/storage-utils.js` | Sole persistence validation boundary; has a cross-domain `require`. |
| `tests/data-regression.test.js` | **Non-recursive parse loop must become recursive.** |
| `tests/tracker-regression.test.js` | Six `require` paths + a `vm.runInContext` file list to update. |
| `styles/cinematic-refinement.css` | The only CSS file with asset `url()` paths — all 5 need `../`. |
| `games/games.js`, `games/games-data.js` | Reference implementation for catalogs, tasks, resources, themes. |
| `movies/movies.js`, `movies/movies-data.js` | Catalog, filters, watchlist, details, series metadata. |
| `explore/explore-global.js`, `explore/explore.js` | Browser vs test entry point discrepancy to resolve in Phase 4. |
| `work/work-tracker.js`, `work/projects.js` | Work hierarchy, lifecycle, tasks, reminders, filters, history. |
| `config/secrets.example.json`, `.gitignore` | New credential handling. Server-only, never served, never committed. |
| `README.md`, `VERIFICATION.md` | Commands and paths to update. |
| `movies/movies.js` lines 442, 456, 468, 619 | **C.1** — the `custom` guards that make a tracked title permanently untrackable. |
| `assets/movie-art/*-poster.jpg`, `assets/manifest.json` | **C.2** — all posters are 300×450 and must be re-sourced; manifest records the new dimensions. |
| `movies/movies-data.js` lines 138–141 | **C.3** — the 4 placeholder-art series records to replace and expand. |
| `games/games.js` lines 511, 571, 1558, 1599 | **C.4** — the checkbox toggle, change delegate and focus-restore paths to reproduce against. |
| `explore/explore-data.js`, `assets/destinations/` | **C.5** — conceptual SVGs to replace with real imagery plus long-form descriptions. |
| `shared/shortcut-surface.js`, `shared/shortcut-utils.js` | **C.6** — shortcut card rendering and ownership rules. |
| `styles/cinematic-refinement.css` | **C.7** — the `--os-*` token palette to warm, and the `body[data-page]` per-tab hooks. |

## Verification

**After each regrouping batch and at the end:**

```
node --test tests/data-regression.test.js tests/tracker-regression.test.js tests/structure.test.js
node server/_static-server.js
```

Then open `http://localhost:8973` and confirm, per route (Home, Work, Projects, Personal, Explore, Games, Movies, Shortcuts, Productivity, Notes, Settings):

- No 404s in the Network panel — in particular `work/projects.js`, `work/work-tracker.js` and `work/tracker.css` load, proving the server block-list fix.
- No console errors; no duplicate script execution; global initialization order unchanged.
- All five `cinematic-refinement.css` background images render.
- Game art, movie art and destination art still resolve (proving the document-relative assumption in A.3).

**Regrouping-specific checks:**

- `curl -I http://localhost:8973/config/secrets/api-keys.json` returns 404.
- `curl -I http://localhost:8973/config/secrets/probe.js` also returns 404 — this is the check that matters, since `.js` is in the server's MIME allowlist and would otherwise be served in full.
- `git status --porcelain` shows no untracked file under `config/secrets/` other than `.gitkeep`; `git check-ignore -v config/secrets/api-keys.json` confirms the rule that catches it.
- `git log --follow games/games.js` shows history across the move (proves `git mv` was used).
- The recursive parse test reports a file count matching the source inventory, not ~1.

**Part C defect checks (each must fail before the fix and pass after):**

| Item | Check |
|---|---|
| C.1 untrack | Track a catalog movie, untrack it: it leaves Library, "Titles tracked" decreases, it returns to Suggestions, and it is still untracked after reload. A custom title still offers permanent delete. |
| C.2 sharpness | In a detail view at 1440 px / 2× DPR, no `<img>` has a rendered width greater than its `naturalWidth`; posters report `naturalWidth >= 1000`. |
| C.3 series | The Series filter returns 12+ illustrated titles; zero records with `kind:'placeholder'` remain in `movies-data.js`; search returns mixed movies and series. |
| C.4 checkboxes | Toggle an objective and a weekly task ten times each: model, percentage and DOM agree every time, and state is correct after reload. A regression test asserts two toggles return the original state. |
| C.5 destinations | All 12 destinations show a photograph and long-form description; a forced 404 leaves the card usable via fallback; saved destinations still validate. |
| C.6 shortcuts | Add, edit, favorite, reorder and delete by keyboard alone; no broken icons at 1440 / 1024 / 760 / 390 px. |
| C.7 cinematic | Each route is visually distinct; reduced-motion mode is genuinely still; the Network panel shows zero external requests. |

**Browser harness:**

```
node tests/browser-server.js
```

with `tests/browser-smoke.mjs` exports `routes(tab)`, `layout(tab)` and `workLifecycle(tab)`. Set `MISSING_ASSET='assets/destinations/azores.svg'` to exercise the image-fallback path.

## Scope Boundaries

**Included:** local-first data; CRUD; Work tracking and lifecycle; filters and in-page reminders; curated destination discovery; game resources and tasks; movie and series catalogs; local images and fallbacks; cinematic UI, parallax, micro-interactions and accessibility; persistence, backup, restore, reset; automated and browser verification; **repository regrouping into domain folders; a git-ignored, non-servable secrets folder with a committed example template; and all of Part C — reversible movie tracking, high-resolution movie artwork, a real series catalog, the game checkbox toggle defect, destination photography with long-form descriptions, modernized shortcuts, and per-tab warm cinematic treatment.**

**Excluded unless separately approved:** server accounts; multi-user collaboration; cloud sync; real-time external APIs; **reading or using any API credential — this pass creates the secrets folder and ignore rules only**; true push notifications after the browser closes; full Jira integration; episode-by-episode TV tracking (C.3 adds series as a type, not an episode tracker); scraping or unlicensed image downloading (this constrains C.2, C.3 and C.5 — where no licensed high-resolution image exists, ship the deterministic fallback rather than an upscaled blur); **moving `assets/` into domain folders**; **any external CDN or new runtime dependency for C.7 — the app makes zero network requests today and must still make zero afterwards**; any behavior change during Part A.

## Further Considerations

1. The Explore catalog is local and curated, so content and images are maintained in code and assets. A later API-backed phase can reuse the same recommendation interface — and now has `config/secrets/` and `server/providers/` waiting for it.
2. A full Jira clone is too broad for a single-page local app. The proposed hierarchy and lifecycle deliver the requested development workflow while staying maintainable.
3. The inline `index.html` script should not grow further. New domain behavior belongs in the domain folders, with only small markup and router hooks in `index.html`.
4. The app should feel cinematic through layered scenes, restrained motion, depth and responsive state changes — not decorative animation everywhere.
5. Every visual effect must have a purpose, stay subordinate to content and controls, and have a reduced-motion equivalent.
6. `shared/storage-utils.js` reaching into `explore/trip-board.js` is a layering violation carried over from the flat structure. The regrouping makes it visible; fixing it (dependency injection of domain validators) is a good Part B follow-up.


Please ask the questions if something is not clear.