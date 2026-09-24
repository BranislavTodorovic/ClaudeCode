# OneSpace — Combined Implementation Plan V2

**This is the standing product/scope plan for OneSpace.** It replaces the previous contents of this file, carrying forward **every step** of that earlier version (Part A regrouping, Part B Phases 1–8, Part C defects C.1–C.7), marking what is already delivered, correcting the errors found in it, and folding in the requirements raised since. It is self-contained for product scope and rationale, but execution is governed by the coordinated five-document authority set listed below; no single document should be used in isolation when resuming or declaring completion.

The working checklist derived from this plan is `docs/IMPLEMENTATION-STEPS.md`. This document holds the reasoning; that one holds the boxes to tick.

---

## Required startup procedure

At the beginning of every new agent session or after context compaction/interruption,
the agent must read:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `docs/REVISED-IMPLEMENTATION-PLAN.md`
4. `VERIFICATION.md`
5. `README.md`

Then inspect repository state, Git state, the actual implementation and persistent implementation evidence before editing code.

Previous chat summaries are not completion evidence.

---

## Execution authority

Execution and verification are governed by `docs/IMPLEMENTATION-STEPS.md`.

This standing plan defines WHAT must be delivered.
`docs/IMPLEMENTATION-STEPS.md` defines HOW implementation completion is proven.

A phase is not complete until its checklist gate satisfies the Mandatory Execution and Verification Contract defined in `docs/IMPLEMENTATION-STEPS.md`.

If completion wording is ambiguous, the stricter verification requirement applies.

No requirement in this standing plan may be silently removed, skipped, weakened, or treated as complete solely because code exists or the overall test suite is green.

---

## Context

The previous version of this plan was inspected against the actual repository, and **its "Current Findings" section described a pre-implementation state that no longer exists.** `README.md`, `VERIFICATION.md` and the code show that most of Part B Phases 2–6 are already built and verified. Running the suite confirms **31/31 tests pass** today.

What is genuinely open is a different, smaller list than the old document implies — plus seven new requirements:

1. Every tab needs a **living** cinematic background representing its domain. Games and Movies have **no page hero at all**; the nine pages that do have art use static stills.
2. Settings needs updating with new themes. A theme system exists but is partly broken.
3. Adding a game must immediately create the right tracker — **chapters for mission games, a weekly tracker for live-service games** like Diablo Immortal.
4. Movies / Series / Games search bars must suggest titles as you type, with an add affordance.
5. Every shortcut — including the 47 built-ins — needs an add/remove option.
6. The **Development tracker** needs a modern, clean, visually appealing rebuild, **starting with UI and layout**.
7. Each tab must contain only its own domain's content.

The intended outcome: a repository organised by domain, tabs that are strictly single-domain with Home as the only aggregator, a Development tracker that reads as a real tool, and a shell where every route visibly announces itself and feels alive — with no regression to storage keys, the router, or the green baseline.

---

## How to read this plan

Every step from the previous plan is preserved below with a status marker:

- **[DONE]** — verified present in the code; no work required, but it must not regress.
- **[OPEN]** — carried forward from the previous plan, still to do.
- **[NEW]** — added in this session.
- **[FIX]** — a defect found during this inspection.

**Execution order** (phase numbers group related work; this is the order to actually run them):

```
13.1 → 13.2   standing plan and strict checklist authority
0             freeze the baseline
1             repository regrouping
2             Development tracker UI/layout
3             domain boundaries + Home module
4             Settings and themes
5             living cinematic scenes
6             provider search and typeahead (existing titles/games contract)
7             shortcuts add/remove
8             games trackers
9             movies and series
10            explore curated/local work
11            personal regression
12            original-plan verification checkpoint
14            provider truth audit + V2 reconciliation
15            global destination discovery
16            first-class provider records + integrity
17            content-aware cinematic environment
18            provider/media/async/security hardening
19            complete V2 final acceptance
20            full-viewport cinematic fidelity
21            global icon visual-quality completion
22            live provider search + real media completion
23            game enrichment + tracker intelligence
24            global search/filter integration
25            final user-visible product acceptance
26            final whole-project integrity and release-readiness audit
13.3          final documentation (always last)
```

Execute phases in the numeric/approved order shown above. Existing Phases 0–12 retain their historical meaning and evidence. Phase 12 is the original-plan verification checkpoint; V2 Phases 14–19 follow it; additive final-fidelity Phases 20–25 follow Gate 19; Phase 26 performs the final whole-project integrity audit after Gate 25; and Phase 13.3 remains the final documentation step only after Gate 26.

---

## Execution clarifications confirmed by the user — September 21, 2026

1. Preserve the current `projects.js` before `work-tracker.js` script order during Phase 1.
2. During Phase 1 batch 1, use the temporary `../trip-board` require; change it to `../explore/trip-board` when that file moves in batch 5. References elsewhere to the final require path describe the completed regrouping.
3. Build 10 distinct page scenes. The retained Projects route is an alias and displays the Work scene. References to 11 routes include that alias.

These clarifications resolve the conflicts without removing planned functionality. Execute phases 4–11 in their listed numeric order, as requested by the user.

## Verified baseline

Executed, not assumed:

- `node --test tests/data-regression.test.js tests/tracker-regression.test.js` → **31 pass, 0 fail**.
- 33 source files flat at the repository root. `providers/` is empty. **No `.gitignore` and no `package.json` exist.**
- `index.html` contains exactly **22 `<script src>` tags** and **8 `<link rel="stylesheet">` tags**.
- 11 routes in `PAGES` (`index.html:1773`); router `goToPage()` at `index.html:1788-1818`; no hash or History API routing.
- `assets/page-art/` holds art for 9 routes — **none for games or movies**.
- Catalog contains **20 titles: 16 movies + 4 series**.

---

## Corrections to the previous plan document

These are errors in the previous version of this plan, found during inspection. **They are already corrected throughout this document** — the table is retained so the corrections are auditable rather than silent.

| # | Claim in the old plan | Reality |
|---|---|---|
| 1 | "Current Findings" describes Work as read-only summaries, Personal without edit, Explore without a preference model, Movies without first-class series | All of these were built. `orbit-work-items` / `-tasks` / `-history` exist with full lifecycle; Personal has edit and confirmed delete; Explore has `orbit-explore-preferences` and `orbit-explore-saved`; `MOVIE_TYPES` and a type filter exist |
| 2 | C.3: "**17** movies" | **16** movies (plus 4 series = 20 titles) |
| 3 | C.3: names 3 series "and one more, lines 138–141" | The fourth is `tv-chernobyl`; records span `movies-data.js:137-142` |
| 4 | C.4: lists 5 suspect mechanisms for the checkbox defect | Omits the most likely one — `saveLibrary`/`saveWeekly` discard `safeSet`'s failure return (see Phase 8.3) |
| 5 | Part A: "~34 flat files" | 33 source files (24 JS, 8 CSS, `index.html`) |

All other factual claims in the old plan were independently re-verified and are correct, including: the server block list containing `work` (`_static-server.js:11`), the non-recursive parse loop (`tests/data-regression.test.js:132`), the `storage-utils.js:49` cross-domain require, the three `^assets/` validators, the five `url()` paths in `cinematic-refinement.css`, and the `VERIFICATION.md` port error (it cites 18973; `tests/browser-server.js` defaults to 18974).

---

## Decisions locked in this session

| Decision | Choice |
|---|---|
| Repository regrouping | **Execute first**, before any feature work |
| Home page scope | **Home is the only aggregator**; every other tab is strictly single-domain |
| Work / Projects / Productivity | **One Work tab with sub-views**; generic daily tasks leave Work |
| Typeahead suggestion source | **Provider-backed global search** (TMDB; IGDB or RAWG) via a local server proxy |
| New tab artwork | **Code-drawn animated scenes** — layered inline SVG + CSS, no new binary assets |
| Built-in shortcut removal | **Hide per-user, with a restore list** in Settings |
| Extra defect approved | **Silent save failures in `games.js`** |

**Scope amendment this forces:** provider-backed search breaks the "zero network requests" guarantee asserted in the old plan's Scope Boundaries and C.7 point 5. The app must therefore still work fully offline with a **visible** degraded state — never a silent fallback to the local seed list presented as global results. This is an intentional amendment, recorded here so it is not mistaken for an oversight.

---

## Product decisions

Carried from the previous plan. These govern every phase below; where this session changed one, the change is marked.

- **Local-first for user data.** No accounts, no cloud sync, no multi-user. **Amended:** provider credentials now exist, server-side only, for search (Phase 6) — user records remain entirely local.
- Core Work hierarchy is `project → work item → task`. A work item is a `story` or a `defect`.
- Work item statuses: `open`, `in-progress`, `blocked`, `closed`.
- Tasks have independent completion state, but closing a work item closes all remaining child tasks.
- Closed work items are preserved in a Work Log / Backlog history rather than deleted; the backlog supports filtering and reopening.
- Analysis, plan and execution are editable text fields on each story/defect.
- Work items carry priority, labels, estimate, created/updated dates, deadline and reminder fields.
- Browser-native date/time values with local reminders **while the page is open**. No promise of notifications after the page closes.
- Personal deletion uses the existing modal/confirmation conventions and shows a toast on success.
- Explore uses a curated local destination catalog: city break, nature, beach, culture/history, food, wellness, adventure.
- Explore recommendations explain the matched preferences and always show a local image or a deterministic fallback.
- Explore shortcuts are stored/tagged as `explore` and must not appear in Work or Personal.
- Games retains the existing catalog and gains a per-game detail/resource surface. **Adding a game creates default tracker tasks/objectives from the selected tracker type** (Phase 8 makes that type correct).
- Movies becomes Movies & Series while preserving the existing `movies` route and storage keys, using a first-class `movie`/`series` type filter. **No episode-level tracking** unless separately approved.
- Keep the current cinematic direction and use **one coherent modern inline SVG icon language across the entire OneSpace UI**. Existing good icons may be retained; dated, inconsistent, generic, misaligned or visually weak UI icons must be improved during the global icon audit in Phase 5.6. Brand marks, provider attribution marks and site favicons/logos are content/source identity and are not forced into the OneSpace UI-icon style.
- **Every visible label starts with an uppercase first word** — `City break`, `Nature`, `Series`, `Action`, `Winter`. Never expose raw lowercase enum values.

**Superseded:** the previous plan's Phase 1 step 11, "Do not begin provider-backed global discovery in this iteration," is replaced by the decision recorded above. Phase 6 implements it.

---

---

# V2 APPROVED SCOPE — GLOBAL DISCOVERY, FIRST-CLASS PROVIDER RECORDS AND CONTENT-AWARE VISUALS

This V2 scope is an **extension of the complete existing OneSpace plan**, not a replacement for Work, Home, Personal, Settings, Shortcuts, Productivity, Notes, Games, Movies & Series, Explore, accessibility, responsive behavior, storage, backup, security, or the existing cinematic system.

Nothing already required by Phases 0–12 is removed or weakened.

## V2 product principle

OneSpace remains **local-first for user-owned data**, but local-first does **not** mean local-only.

The final architecture is:

**local user data + curated/local fallback content + provider-backed global discovery + normalized local persistence + graceful offline/degraded behavior**

Provider search expands discovery. It never becomes the source of truth for user-owned state.

## V2 discovery domains

Provider-backed global discovery applies to:

1. **Movies & Series**
2. **Games**
3. **Explore / Destinations**

The existing curated/local catalogs remain supported and are not replaced.

### Movies & Series

Global discovery must support, where available:

- movies and series;
- provider ID/source;
- title;
- overview/description;
- poster;
- backdrop/key artwork;
- genres;
- release/year metadata;
- runtime and series metadata supported by the provider;
- provider/source attribution where required.

A provider result is transient until the user explicitly chooses Add/Track.

After Add, the normalized record becomes a first-class local OneSpace record and participates in the existing Library, watchlist/status, details, untrack/remove, responsive, accessibility and cinematic behavior.

### Games

Global discovery must support, where available:

- provider ID/source;
- title;
- description;
- cover;
- key/background artwork;
- genres/tags;
- platforms;
- release metadata;
- tracker-inference signals.

Before saving, OneSpace infers **story/chapter** versus **weekly/live-service** tracker type and shows the inference so the user can correct it.

A provider-added game becomes a first-class local game: library, spotlight, detail, resources, sessions, journal, tracker, edit/delete, theme and visual environment must work without requiring a handcrafted seed-only artwork record.

### Explore / Destinations

Explore retains the existing curated 12-destination catalog, deterministic recommendation system, preferences, saved destinations, trip board, Surprise Me, local imagery and fallbacks.

V2 adds **provider-backed global destination discovery** beyond those 12 records.

A provider-neutral destination contract must support, where available:

- provider ID/source;
- destination name;
- city/region/country;
- short summary;
- substantive context/details;
- themes/categories;
- season/trip-character metadata where available;
- budget/duration hints where available;
- card image;
- hero image;
- source/license/attribution metadata where required.

The user can open details, save/shortlist and use the trip-board flow.

A saved provider destination remains meaningful when the provider is later unavailable.

## Explicit local/provider separation

Provider results and local/catalog results must never be silently conflated.

The UI must clearly distinguish:

- **In your catalog / local**
- **Global search results / provider**

When provider search is unavailable, the local catalog still works, but it must not be presented as if it were the live global result set.

## Provider result identity and duplicate prevention

A provider-origin record uses deterministic identity based on:

**domain/kind + provider/source + provider item ID**

Display title/name alone is never sufficient identity.

Adding the exact same provider identity twice is idempotent and must not create duplicate records, duplicate trackers or duplicate saved-destination state.

Do not fuzzy-auto-merge provider results into local records merely because names look similar. Automatic reconciliation requires deterministic identity evidence; otherwise preserve distinct records or require explicit user reconciliation.

## Provider metadata vs user-owned state

Provider metadata and user state have different ownership.

Provider-owned/snapshot metadata may include description, genres, release data, source artwork references and attribution.

User-owned state includes status, notes, favorites, watchlist/library membership, tracker choice after confirmation, tasks/objectives, progress, sessions, journal, saved/shortlist/trip-board state and custom edits supported by OneSpace.

A provider refresh must never silently overwrite user-owned state.

Missing upstream fields must not replace valid local values with null/empty values unless the canonical data contract explicitly defines that behavior.

## Persistence and atomic writes

A provider result becomes user-owned only after:

1. normalization;
2. sanitization;
3. canonical validation;
4. successful local persistence;
5. UI success confirmation.

Do not show a success state before storage success is known.

Where one logical Add/Save operation modifies multiple owned records, use the existing transactional/rollback model so a partial write cannot leave an impossible state.

## Saved provider records offline

Saved/tracked provider-origin content must remain meaningful without a provider request.

Persist enough normalized metadata for identification and normal local detail behavior.

Remote media is handled according to provider terms. Offline rendering uses, in order where available:

1. permitted local/cached media;
2. local role-appropriate OneSpace media;
3. deterministic domain fallback/base scene.

Provider failure never deletes a user-owned record.

## Browser/server/provider boundary

Private provider credentials never enter browser JavaScript.

Conceptual flow:

```text
Browser
  -> OneSpace local server
  -> provider-neutral adapter
  -> configured external provider
```

The browser UI consumes normalized OneSpace responses, not raw TMDB/RAWG/IGDB/destination-provider payloads.

## Provider request contract

Provider-backed search/details must support applicable:

- debounce;
- request cancellation (`AbortController` or equivalent);
- loading;
- empty;
- pagination/load-more;
- timeout;
- authentication/configuration failure;
- rate-limit;
- offline/network failure;
- provider error;
- malformed response handling;
- partial metadata handling;
- short-lived bounded caching.

Older/stale success **and** error responses are ignored after a newer request owns the UI.

If a detail surface is closed, another item is selected, or the user navigates away, a late details response must not reopen or mutate stale UI.

## Server input validation

Server endpoints validate and bound browser input.

Do not blindly forward arbitrary query parameters upstream.

Validate/allowlist applicable:

- search query;
- query length;
- kind/type;
- provider;
- provider ID;
- page/page-size;
- pagination cursor;
- supported method/route.

## No open proxy / SSRF

OneSpace must never become a generic network proxy.

Provider adapters choose upstream hosts server-side.

Do not accept an arbitrary browser-supplied URL and fetch it.

This rule applies to provider data and provider media.

## Provider media boundary

Where the browser-network contract requires server-mediated external access, provider art uses a **safe provider media route** rather than arbitrary raw external URLs.

A media route must:

- accept only known provider media identities/references;
- allowlist provider media hosts;
- use HTTPS upstream where supported;
- reject arbitrary URLs;
- reject non-image content;
- enforce timeout;
- enforce sensible response-size limits;
- validate content type;
- avoid leaking credentials/tokens;
- avoid reflecting sensitive upstream headers.

Media caching must be **bounded** and provider-license/terms compliant.

Clearing provider/media cache must never delete user-owned records.

## Untrusted provider content / XSS

All provider strings are untrusted input.

Never inject provider HTML.

Render titles, descriptions, genres, attribution and location strings with safe DOM/text/escaping helpers.

Provider-origin links pass the existing safe-link protocol policy and retain safe external-link behavior.

## Error and logging safety

Browser-visible provider errors are normalized categories, not raw upstream dumps.

Do not expose:

- API keys;
- client secrets;
- Authorization headers;
- raw secrets files;
- secret-bearing stack traces.

Server debug logging must redact credentials.

## Existing cinematic system remains authoritative

The existing scene lifecycle remains:

**ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET**

The existing 10 distinct page scenes remain, with Projects sharing Work.

The existing Full / Subtle / Off and `prefers-reduced-motion` behavior remain.

V2 **extends** this system with an optional selected-content environmental art layer.

### Selected-content visual enrichment

Where appropriate:

- selected Movie/Series backdrop influences the Movies environment;
- selected Game key/background art influences the Games environment;
- selected Destination hero art influences the Explore environment.

The treatment is restrained and may use controlled crop, opacity, masks, gradient/scrim, vignette, depth, blur and subtle decorative parallax.

It must never reduce readability, move controls, capture pointer events, create major layout shift or turn OneSpace into an uncontrolled wallpaper UI.

### Internal selection is not full page entry

Changing selected content inside the same tab uses a lightweight content/media transition.

It must not replay the complete page ENTRY choreography.

### Content-art race safety

A loaded image may be applied only if route + selected record identity + content-art generation still match.

Rapid A -> B -> C selection must finish on C even if A/B media completes later.

### Route cleanup

Movies art/theme state must not leak into Games, Explore, Work or Home; likewise for Games and Explore.

The unified scene controller owns transient cleanup.

## Live verification vs mock verification

Mock/provider-fixture verification and live configured provider verification are separate evidence classes.

Allowed status examples:

- **Adapter/contract VERIFIED via deterministic mock**
- **Live configured E2E VERIFIED**
- **Live configured E2E NOT RUN — credentials unavailable**

Never use mock success as proof that real credentials/live upstream access was tested.

## Backup compatibility

Existing backup format version 4 and complete v2/v3/v4 import support remain compatibility contracts.

Optional provider metadata should remain backward-compatible where possible.

Do not increment the backup format merely because optional provider fields are added.

If a real serialized-contract change requires a version bump, stop and add an explicit migration plan, fixtures, old-import tests and new round-trip tests before proceeding.

## V2 completion principle

OneSpace is not complete merely because API calls work.

The finished experience must preserve:

**reliable local application + useful global discovery + native first-class persistence + polished OneSpace presentation + graceful provider failure**

# PHASE 0 — Freeze the baseline

Carried from old Part B Phase 1 (Baseline and Contracts).

| Step | Status |
|---|---|
| 0.1 Run the two test files; record the 31/31 result with a timestamp | [DONE] — re-run before starting |
| 0.2 Parse every JS file and the inline `index.html` script | [DONE] — covered by the existing parse test |
| 0.3 Start `node _static-server.js`; inspect all 11 routes at `http://localhost:8973` | [OPEN] |
| 0.4 Record current storage keys, backup format, router pages, script load order, and the `onespace:data-changed` / `onespace:page-changed` events | [OPEN] |
| 0.5 Inventory every button, tab, link, form, checkbox, select, modal action, shortcut and page jump — recording owner, expected state change, persistence key, success feedback, error behaviour, focus return and reload behaviour | [OPEN] — this inventory is the acceptance checklist for Phase 12 |
| 0.6 Treat `storage-utils.js` as the only persistence validation boundary | [DONE] — holds today; must not regress |
| 0.7 Schemas for projects, work items, tasks, history, destinations, preferences, saved destinations, Personal records, game resources, game default tasks, movie/series metadata | [DONE] — all present and validated |
| 0.8 Generated IDs, timestamps, status enums, optional fields, maximum lengths in every schema | [DONE] |
| 0.9–0.10 Migration behaviour and safe defaults for existing records and v2 backups | [DONE] — v2 and v3 accepted, v4 current |
| 0.11 Capture "before" screenshots of Work, Games, Movies and Settings at 1440 / 1024 / 760 / 390 px | [NEW] — comparison set for the redesign |
| 0.12 Export a v4 backup from the live origin before any other phase runs | [NEW] — no later phase can then lose real data |

---

# PHASE 1 — Repository regrouping

Old Part A, reproduced in full. Runs first, before any feature work.

## 1.1 Target structure

`index.html` and `assets/` stay at the repository root.

```
repo/
  index.html                 (entry URL and document-relative asset base)
  assets/                    (destinations/ game-art/ game-logos/ movie-art/ page-art/)
  games/      games.js  games-data.js  game-resources.js  games.css  games-cinematic.css
  movies/     movies.js  movies-data.js  movies.css  movies-cinematic.css
  explore/    explore-data.js  explore-global.js  discovery-integration.js
              discovery-ui.js  local-discovery.js  trip-board.js  discovery.css
  work/       projects.js  work-tracker.js  tracker.css
  personal/   personal-controller.js
  home/       (created in Phase 3.1 — no file moves here, nothing exists to move)
  shared/     storage-utils.js  catalog-utils.js  shortcut-utils.js  shortcut-surface.js
              domain-ui.js  tooltip-utils.js  visual-utils.js  cinematic-scenes.js
  styles/     pages.css  cinematic-refinement.css
  server/     _static-server.js  providers/
  config/     secrets.example.json  secrets/.gitkeep
  tests/      data-regression.test.js  tracker-regression.test.js  browser-server.js
              browser-smoke.mjs  structure.test.js (NEW)  fixtures/
  docs/       REVISED-IMPLEMENTATION-PLAN.md  agent-instructions.md
  README.md  VERIFICATION.md  .gitignore (NEW)
```

## 1.2 Complete file move map

Use `git mv` for every move so history is preserved.

| Current | Destination |
|---|---|
| `games.js`, `games-data.js`, `game-resources.js`, `games.css`, `games-cinematic.css` | `games/` |
| `movies.js`, `movies-data.js`, `movies.css`, `movies-cinematic.css` | `movies/` |
| `explore-data.js`, `explore-global.js`, `discovery-integration.js`, `discovery-ui.js`, `local-discovery.js`, `trip-board.js`, `discovery.css` | `explore/` |
| `projects.js`, `work-tracker.js`, `tracker.css` | `work/` |
| `personal-controller.js` | `personal/` |
| `storage-utils.js`, `catalog-utils.js`, `shortcut-utils.js`, `shortcut-surface.js`, `domain-ui.js`, `tooltip-utils.js`, `visual-utils.js`, `cinematic-scenes.js` | `shared/` |
| `pages.css`, `cinematic-refinement.css` | `styles/` |
| `_static-server.js` | `server/` |
| `providers/` (empty) | `server/providers/` |
| `REVISED-IMPLEMENTATION-PLAN.md`, `agent-instructions.md` | `docs/` |

## 1.3 Assets stay at the root — and why

Asset paths inside JS are **document-relative**: the browser resolves them against `index.html`'s URL, not the script's location. Because `index.html` stays at the root, moving JS files changes nothing about those ~40 strings, nor the nine `<img src="assets/page-art/…">` tags in `index.html`.

The stronger reason: three validators hardcode an `^assets/` prefix and run against **data already saved in the user's browser** — `shared/storage-utils.js:36` (destination `image`), `explore/local-discovery.js:5`, `explore/trip-board.js:6`. Relocating `assets/` would make every previously-saved destination, trip-board entry and discovery record fail validation on load — silent data loss.

CSS `url()` paths are the opposite case: they resolve **relative to the stylesheet**. All five occurrences are in `cinematic-refinement.css` (lines 72, 73, 100, 101, 102) and each needs a `../` prefix:

```
url('assets/game-art/cyberpunk-2077-hero.jpg')   -> url('../assets/game-art/cyberpunk-2077-hero.jpg')
url('assets/movie-art/inception-background.jpg') -> url('../assets/movie-art/inception-background.jpg')
url('assets/game-art/hades-hero.jpg')            -> url('../assets/game-art/hades-hero.jpg')
url('assets/movie-art/matrix-background.jpg')    -> url('../assets/movie-art/matrix-background.jpg')
url('assets/page-art/personal-cinematic.webp')   -> url('../assets/page-art/personal-cinematic.webp')
```

No other CSS file contains an asset `url()`.

## 1.4 Blocking issues that must be fixed as part of the move

Each one silently breaks the app or the test suite the moment files move.

**1. The static server 404s a `work/` folder.** `_static-server.js:11` rejects any path containing a segment in `['providers','tests','node_modules','work','outputs','api']`. Creating a top-level `work/` makes its three files unreachable and the Work page dies with no obvious cause. The list becomes:

```
['tests','node_modules','outputs','api','server','config','secrets']
```

`work` removed (it is now a served source folder), `providers` removed (covered by blocking `server`), and `server`, `config`, `secrets` added.

**2. The parse test silently stops covering anything.** `tests/data-regression.test.js:132` is `fs.readdirSync(root).filter(name => name.endsWith('.js'))` — non-recursive. After the move the root holds no application JS, so this loop would parse ~0 files and still pass. Replace with a recursive walk over the source folders, excluding `tests/`, `node_modules/`, `config/` and `assets/`.

**3. `shared/storage-utils.js` has a runtime require into the Explore domain.** `storage-utils.js:49` calls `require('./trip-board')` inside the `orbit-trip-board` validator; it becomes `require('../explore/trip-board')`. Update the path only — do **not** restructure the dependency here, because Phase 1 forbids behaviour change. The real fix (injecting domain validators) is **Phase 3 row 15**.

**4. Script execution order is load-bearing.** All 22 `<script src>` tags are classic scripts with no `defer` and no `type="module"`, so they execute in document order. Six run *before* the large inline controller script and sixteen *after* it. Rewrite only the `src` prefixes — never reorder, merge, split, or add `defer`. The order encodes real dependencies, each of which breaks with a silent `undefined`:

- `trip-board.js` → before `storage-utils.js` (the `orbit-trip-board` validator reads `OneSpaceTrips`)
- all six batch-1 files → before the inline shell (it reads `OneSpaceStorage`, `OneSpaceShortcuts`, `makePersonalController`)
- the inline shell (defines `window.OneSpace`) → before **every** batch-2 file
- `domain-ui.js` → before `projects.js`, `games.js`, `discovery-ui.js`, `explore-global.js`
- `projects.js` → before `work-tracker.js` (user-confirmed: preserve the existing order); `explore-data.js` → before `discovery-ui.js` and `explore-global.js`; `local-discovery.js` → before `discovery-ui.js`; `game-resources.js` → before `games-data.js`
- `games.js` and `movies.js` → before `discovery-integration.js`

Note that `work-tracker.js` **auto-invokes `api.mount(root)` at load** in the browser branch of its UMD wrapper — loading it twice mounts a second instance. The obsolete auto-mounting `explore.js` was retired in Phase 10; `explore-global.js` is the sole Explore mount owner.

**5. `explore.js` was a pre-existing discrepancy — do not "fix" it during the move.** At this historical Phase 1 point it was required by `tests/tracker-regression.test.js` but absent from the browser scripts. Phase 10 resolved the mismatch by retiring that duplicate auto-mounting module, keeping `explore-global.js` as the sole UI mount, and making both browser search and regression tests call `local-discovery.js` for deterministic recommendation logic.

## 1.5 Secrets and credentials folder

Nothing exists today — no `.gitignore`, no `package.json`, and `providers/` is empty. Create:

- **`config/secrets/`** with a committed `.gitkeep`; everything else in it is ignored.
- **`config/secrets.example.json`** — committed template, placeholder values only. **[NEW]** it now documents the keys Phase 6 will actually consume: `TMDB_API_KEY`, and `IGDB_CLIENT_ID` + `IGDB_CLIENT_SECRET` or `RAWG_API_KEY`.
- **`.gitignore`** at the repository root:

```
config/secrets/*
!config/secrets/.gitkeep
.env
.env.*
*.local.json
node_modules/
```

Three rules govern this folder:

1. **Server-only.** No file under `config/` may be referenced by `index.html` or any browser script. Browser JS is fully readable, so a key placed there is a published key.
2. **Not servable.** `config` and `secrets` are in the block list (1.4 item 1). The extension allowlist is a useful second layer but **not sufficient alone** — `_static-server.js` serves only its MIME-mapped extensions, so `secrets.json` would 404 incidentally, but a credential file named `.js` **would be served in full**. The segment block is the real control. `tests/browser-server.js` has *no* deny list and does serve `.json`, so it must never point at a tree containing real credentials.
3. **Not used in this phase.** Phase 1 creates the folder, template and ignore rules only.

## 1.6 Reference updates — exhaustive checklist

**`index.html`** — 8 `<link>` (lines 103–110) and 22 `<script src>` (lines 872–878 and 3088–3103). Rewrite each path, preserving exact order:

- Stylesheets: `games/games.css`, `games/games-cinematic.css`, `styles/pages.css`, `movies/movies.css`, `movies/movies-cinematic.css`, `styles/cinematic-refinement.css`, `work/tracker.css`, `explore/discovery.css`
- Pre-inline scripts, in this order: `explore/trip-board.js`, `shared/storage-utils.js`, `shared/catalog-utils.js`, `shared/tooltip-utils.js`, `shared/shortcut-utils.js`, `personal/personal-controller.js`
- Post-inline scripts, in this order: `shared/visual-utils.js`, `shared/domain-ui.js`, `shared/shortcut-surface.js`, `work/projects.js`, `work/work-tracker.js`, `explore/explore-data.js`, `explore/local-discovery.js`, `explore/discovery-ui.js`, `explore/explore-global.js`, `games/game-resources.js`, `games/games-data.js`, `games/games.js`, `movies/movies-data.js`, `movies/movies.js`, `shared/cinematic-scenes.js`, `explore/discovery-integration.js`

The `<link rel="icon">` on line 7 is an inline `data:` URI — leave it alone.

**`tests/data-regression.test.js`** — `require('../storage-utils.js')` (L7) → `../shared/…`; `require('../catalog-utils.js')` (L8) → `../shared/…`; the `vm.runInContext` loads (L12–13) → `games/game-resources.js`, `games/games-data.js`, `movies/movies-data.js`; the recursive parse walk (1.4 item 2). The `root/index.html` read and `tests/fixtures/` paths are unchanged.

**`tests/tracker-regression.test.js`** — line 4 requires become `../shared/storage-utils`, `../work/work-tracker`, `../explore/explore`, `../shared/shortcut-utils`, `../games/game-resources`; line 80 → `../shared/catalog-utils`; line 12's file list becomes `['games/game-resources.js','games/games-data.js','movies/movies-data.js','explore/explore-data.js']`; line 87 → `personal/personal-controller.js`.

**`tests/browser-server.js`** — resolves `root` to the repo root with no block list, so it keeps working unchanged. Confirm the `MISSING_ASSET` hook still points at `assets/destinations/azores.svg`.

**`shared/storage-utils.js`** — the `require('./trip-board')` on line 49.

**`README.md`** — `node _static-server.js` (L8) and the `--preserve-symlinks` variant (L14) become `node server/_static-server.js`; the load-order paragraph (L67); file references at L35, L43, L54, L65, L67.

**`VERIFICATION.md`** — L8 names the two test files without the `tests/` prefix; update to full paths. Also correct the port: it cites **18973**, but `tests/browser-server.js` defaults to **18974**.

**Out of scope, record only.** Unreferenced assets found: the whole `assets/game-logos/` folder (6 SVGs), 16 year-stamped files in `assets/movie-art/`, the 7 `.png` twins of the `.webp` heroes in `assets/page-art/`, and `assets/game-art/cyberpunk-2077.svg` / `hades.svg`. Do **not** delete during regrouping — deletion is a behaviour change needing its own review.

## 1.7 New structural test — `tests/structure.test.js`

Asserts by reading files, not by convention:

- every `<script src>` and `<link href>` in `index.html` resolves to a file on disk
- every repo-relative `require(...)` in every source and test file resolves
- every `assets/...` string literal in JS and every `url(...)` in CSS resolves
- the recursive parse walk visits a file count matching the expected source inventory (guards 1.4 item 2 from regressing)
- no file under `config/` is referenced from `index.html` or any browser script
- the 22 `<script src>` values appear in exactly the expected order (guards 1.4 item 4)
- every `assets/...` literal still satisfies the three `^assets/` validators (guards the 1.3 decision against a later accidental asset move)

## 1.8 Execution order

Capture a green baseline first, then move in batches, updating references and re-running tests after each:

1. `shared/` (highest fan-in — first, so later batches update against final paths), including the `storage-utils` → `trip-board` require: temporarily `../trip-board`, then `../explore/trip-board` in batch 5 (user-confirmed): temporarily `../trip-board`, then `../explore/trip-board` in batch 5 (user-confirmed)
2. `styles/` + the five `url()` rewrites
3. `games/`
4. `movies/`
5. `explore/` (includes `trip-board.js`; verify the `storage-utils` require resolves)
6. `work/` + `personal/` — **and in the same batch** the server block-list fix, since `work/` is unreachable until then
7. `server/` + `config/` + `.gitignore` + `docs/`
8. Add `tests/structure.test.js` and the recursive parse walk

After every batch: `node --test tests/` passes, and the app loads at `http://localhost:8973` with no 404s, no console errors, no duplicate script execution, unchanged global init order.

## 1.9 Invariants — must not change

- Entry URL stays `http://localhost:8973/` serving root `index.html`.
- All `localStorage` keys unchanged. A folder move must never touch a storage key.
- All public browser globals keep their names: `OneSpace` (inline), `OneSpaceStorage`, `OneSpaceCatalog`, `OneSpaceShortcuts`, `OneSpaceShortcutUI`, `OneSpaceUI`, `OneSpaceVisual`, `makePersonalController`, `OneSpaceWork`, `OneSpaceTrips`, `DESTINATIONS`, `OneSpaceLocalDiscovery`, `OneSpaceDiscovery`, `OneSpaceGameResources`, `DEFAULT_GAMES` / `SUGGESTION_CATALOG` / `DIABLO_WEEKLY_TEMPLATE` / `GAMES_*`, `OneSpaceGameDiscovery` + `OneSpace.playGamesEntryAnimation`, `SEED_MOVIES` / `MOVIE_*`, `OneSpaceTitleDiscovery`.
- `work/projects.js`, `shared/tooltip-utils.js`, `shared/cinematic-scenes.js`, `explore/explore-global.js` and `explore/discovery-integration.js` export nothing — pure side-effect modules that must keep their exact load position.
- The UMD dual-export pattern stays in every file that has it.
- Backup format version 4 (and v2/v3 acceptance) and all existing fixtures remain valid.
- **No behaviour change of any kind in Phase 1.** If a bug is found mid-move, note it and fix it in a later phase.

**Gate:** 31/31 green; zero 404s; `git log --follow games/games.js` shows history across the move; `curl -I http://localhost:8973/config/secrets/probe.js` returns 404 (the check that matters, since `.js` is in the MIME allowlist).

---

# PHASE 2 — Development tracker: UI and layout redesign

The first step of the tracker rebuild, and the first feature phase after the regroup.

## 2.1 Route consolidation [NEW]

Merge Projects into Work as a sub-view. `projects` stays in the `PAGES` array as a **redirect alias** to `work` with the Projects sub-view selected, so existing `orbit-page` values and the 14 hardcoded `goToPage` / `data-page-jump` call sites keep working. Storage keys untouched.

One route, four sub-views under a single header:

- **Board** (default) — active stories and defects
- **Projects** — project CRUD, moved wholesale from the Projects route
- **Backlog** — closed items
- **History** — the event log

`work/projects.js` keeps owning `orbit-work-projects` CRUD and its card component; only its mount target changes. Its two foreign responsibilities move out: `#homeOverview` rendering (`projects.js:40-43`) goes to a Home aggregator module, and the Work-overview fallback (`projects.js:44-47`) is deleted — `work-tracker.js:51` already overwrites it, and it is a domain leak (Phase 3).

## 2.2 Layout [NEW]

- **Results region** — `.domain-grid` is locked to 2 columns until 1440px (`tracker.css:2`). Becomes `repeat(auto-fill, minmax(320px, 1fr))`.
- **Detail region** — `#workDetail` renders full-width *below* the grid as one long prose column (`work-tracker.js:52,66-69`). Becomes a right-side drawer at ≥1100px and a full-screen sheet below, reusing the existing `OneSpaceUI` modal stack, focus trap, Escape handling and inert background from `shared/domain-ui.js` — not a new dialog implementation.
- **Focus rail** — the fixed 352px `#focusRail` costs Work ~170px of content width versus every other page (`index.html:93`). Its contents are non-work-domain (Phase 3 empties it), so the rail leaves Work and the width clamp is normalised.

## 2.3 Filters [NEW]

`.domain-filters` puts 5 selects + a search field + a submit button into a fixed 3-column grid, and filtering requires pressing "Apply filters". Rebuild as one responsive filter bar with **live filtering** (debounced text, immediate selects), a dismissible active-filter chip row, and a result count. Add the **sort control that does not exist today** — sorting is hardcoded priority→deadline→createdAt at `work-tracker.js:29`.

## 2.4 Card and tile quality [NEW]

- **Overview tiles**: `work-tracker.js:51` emits bare `<div><span>…</span><strong>n</strong></div>`, omitting `.overview-tile-top` / `.overview-tile-bottom`, so none of the icon-slot and arrow styling in `pages.css:248-251` applies — three unstyled labels over oversized serif numerals. Emit the same structure as every other overview tile, as `<button data-page-jump>` like `projects.js:29`.
- **Work item cards**: a flat gradient rectangle printing raw lowercase `esc(i.status)` / `esc(i.priority)` (`work-tracker.js:59`). Add a type glyph (story vs defect) from the existing inline SVG set, priority as a colour-coded rail rather than a word, **capitalised status labels** per the standing labelling rule, and a real task progress bar replacing the "n / m tasks complete" text.
- **Section heading**: emit the `.page-section-head h2 > .icon` tile that `cinematic-refinement.css:76-77` already styles and the tracker alone never provides.
- `#workTracker` (`index.html:484`) has no `data-reveal` unlike its siblings — add it.

## 2.5 Render mechanics [NEW]

`work-tracker.js:52` rewrites the whole section's `innerHTML` on every mutation, forcing the manual focus-restoration hack at `:50,64` and a cosmetic "is-updating" pulse. Scope re-renders to the changed region (results list, detail drawer, filter bar) so focus, scroll position and the caret survive naturally. Keep `OneSpaceUI.confirm` for destructive actions.

## 2.6 Behaviour preserved from old Part B Phase 2

All already built; must not regress. Re-verify each after the redesign.

| Step | Status |
|---|---|
| Stabilise `work-tracker.js` as the module home instead of growing the inline script | [DONE] |
| Keep `projects.js` compatible with Home/Work project summaries | [DONE] |
| Storage keys and validation for projects, items, tasks, history | [DONE] |
| Backup / restore / reset / complete / invalid / legacy / current fixtures updated | [DONE] |
| Project CRUD: name, description, link, tags, status, progress, deadline | [DONE] |
| Story/defect CRUD under a selected project | [DONE] |
| Item fields: name, type, status, priority, analysis, plan, execution, labels, deadline, reminder, links | [DONE] |
| Validate required name, project, type and status fields | [DONE] |
| Reject invalid URLs and invalid dates | [DONE] |
| Task CRUD: title, details, priority, due date, estimate, done | [DONE] |
| Accessible task checkboxes with completion styling and progress counts | [DONE] |
| Open / reopen / in-progress / blocked / close lifecycle | [DONE] |
| Closing an item completes all child tasks, stores completion time, creates a log entry, removes it from active views | [DONE] |
| Closed items persist in backlog and reopen without losing task history | [DONE] |
| Views: active projects, active items, due soon, overdue, blocked, backlog, history | [DONE] |
| Filters by project, type, status, priority, deadline, search text | [DONE] — upgraded to live in 2.3 |
| Replace the generic Work timeline with real item and task priorities | [DONE] |
| Keep a link to Productivity for general daily tasks | **[FIX] reversed** — this is a domain leak; removed in Phase 3 |
| Due-soon / overdue badges, reminder panels, page-entry toasts | [DONE] |
| Respect reduced motion for reminder and state-change animations | [DONE] |
| Verify every Work button end to end | [OPEN] — Phase 12 |

**Gate:** every Work action from the Phase 0.5 inventory still works; 31/31 green; side-by-side screenshots at all four widths show no overflow and no overlap.

---

# PHASE 3 — Domain boundary cleanup [NEW]

Home is the only aggregator. Every other tab renders only its own domain. Each row is a confirmed leak.

| # | Leak | Location | Action |
|---|---|---|---|
| 1 | Work overview tile counts `orbit-tasks` (generic daily tasks) | `projects.js:44-47` | Delete the fallback path |
| 2 | "General daily tasks" button in Work's timeline head | `index.html:482` | Remove |
| 3 | Work hero CTA "Start a focus session" → Productivity | `index.html:471` | Replace with a work-domain action |
| 4 | Work-only focus rail renders `orbit-tasks`, countdowns, `orbit-notes-list`, recents | `index.html:153-159`, fed `1980-1985`, `2049-2053`, `2761-2765` | Rail leaves Work (2.2); its content belongs to Productivity and Notes. Note `index.html:61` already hides three of its five sections, leaving dead markup |
| 5 | Mobile "Today & Focus" toggle on Work | `index.html:466` | Remove with the rail |
| 6 | Project deadlines pushed into Work reminders *after* the timeline list is already written | `work-tracker.js:75` | Fold into the Projects sub-view consistently |
| 7 | Home Quick Access mixes all three spaces unfiltered | `index.html:1354-1365` | Allowed — Home is the aggregator. Label each tile with its space |
| 8 | Home's "Shortcuts available" count follows the *Shortcuts page's* selected space | `index.html:1368` via `activeLinks()` | Count all spaces, or state which space |
| 9 | 8 Gaming built-ins + `youtube` / `maps` routed into Explore, then relabelled "Relax & Play" | `shortcut-utils.js:3`, `index.html:1167` | Make Gaming a real category (Phase 7) |
| 10 | `Gaming` exists in `CATEGORIES` but `visibleCategories()` never returns it | `index.html:1117`, `1172-1176` | Make reachable |
| 11 | Explore tiles jump to Games / Movies / Productivity; the Productivity tile uses **Personal's** hero art | `index.html:553-555`, `cinematic-refinement.css:102` | Remove cross-domain tiles from Explore; they belong on Home |
| 12 | `#endWorkdayBtn` (a Work control) calls `applySpace("explore")` + `goToPage("explore")` | `index.html:2100-2109` | Stop relocating the user out of Work |
| 13 | Games and Movies write `data-games-theme` / `data-movies-theme` to `<body>` and never clear them | `games.js:693`, `movies.js:954` | Scope to the view root, or clear in `goToPage` |
| 14 | Dead pre-router CSS hiding nodes that now live inside `[data-page-when]` sections | `index.html:89-90` | Delete |
| 15 | **The shared storage boundary reaches into a domain** — `shared/storage-utils.js:49` calls `require('../explore/trip-board')` inside the `orbit-trip-board` validator | `storage-utils.js:49` | Inject domain validators instead of requiring across domains. Phase 1 only repoints the path because it forbids behaviour change; the real fix lands here |

**Productivity keeps** the generic `orbit-tasks` list, the timer and countdowns — it is their owning domain. Nothing is deleted from the app; content moves to the tab that owns it.

## 3.1 The Home aggregator module [NEW]

Home is the only page allowed to read across domains, so it needs a real owner rather than being rendered from inside `work/projects.js`.

Create `home/home-overview.js` (a new top-level domain folder, following the Phase 1 structure) which:

- Takes over `#homeOverview` from `projects.js:40-43`, reading `orbit-work-projects`, `orbit-tasks` and `orbit-notes-list` as it does today.
- Becomes the single place cross-domain aggregation is permitted, so the Phase 3 boundary test can allow exactly this one module and forbid everything else.
- Gains the cross-domain destination tiles removed from Explore (row 11) and the space labels required by rows 7 and 8.
- Is a pure side-effect module in the load order, placed after the inline shell and after `work/projects.js` (it reads `window.OneSpace` and the same storage helpers).

Its `<script src>` tag is added to `index.html` in this phase, not in Phase 1 — Phase 1 forbids behaviour change, and the structural test from 1.7 asserts an exact script count and order, so that expectation is updated here alongside the new tag.

**Gate:** a new test asserting each page's DOM subtree reads only its own domain's storage keys, with `home/home-overview.js` the single allowed exception.

---

# PHASE 4 — Settings and the theme system

## 4.1 Fix what blocks new themes [FIX]

Not extra scope — the requested theme work cannot land without these:

- **`cinematic-scenes.js:26-34` groups the Settings card by field *index*** (slices `[0,2)`, `[2,7)`, `[7,]`). Adding any new setting silently files controls under the wrong heading. Replace index slicing with declared membership (a `data-settings-group` attribute per field) **before** adding settings.
- **The header theme toggle destroys the palette** — `index.html:1574-1581` forcibly resets `paletteChoice` to `"classic"` and removes `data-palette`, wiping a selected Aurora / Graphite / Deep Space choice. Make light/dark orthogonal to palette.
- **"Deep Space" (`midnight`) has no CSS variable block** — it appears only in the dark-mode selector lists at `index.html:21` and `34-36`, so it renders identically to plain dark. Give it real tokens.
- **`--page-accent` is defined twice and fights over cascade order** — `cinematic-refinement.css:4-15` sets per-page hex values; `pages.css:193-195` sets a different set then `body { --page-accent: var(--accent) }`. Establish one owner.
- **Reset correctness** — `index.html:1656-1689` "Reset preferences" also wipes favorites, recents, collapsed sections and search provider, and does **not** reset `orbit-theme`, so a dark theme survives a reset while unrelated user data is destroyed. Reset preferences only.

## 4.2 New themes [NEW]

Extend the `data-palette` system (tokens `--bg`, `--bg-2`, `--surface`, `--surface-2`, `--surface-3`, `--accent`, `--accent-2`, `--accent-soft`, `--line`, `--text`, `--muted`, `--faint`) with new palettes beside the existing five (Auto, Classic Light, Deep Space, Aurora, Graphite) and four accents (blue, purple, green, amber).

Each new palette must: define the complete token set in both light and dark; pass WCAG AA contrast for body text and controls; ship a swatch preview in the existing `.theme-choices` radiogroup. Per old C.7 point 1, at least one is a **warm** direction — today's `--os-*` tokens run cool.

## 4.3 New settings [NEW]

- **Per-tab scene intensity** — Full / Subtle / Off, governing Phase 5 ambient motion independently of the motion override.
- **Surface the Games and Movies sub-themes.** `games.js:168-173` (midnight / neon / crimson / aurora) and `movies.js:162-167` (marquee / noir / velvet / golden) are real theme systems with their own storage keys that Settings never exposes.
- **Removed shortcuts** restore list (Phase 7).
- **Provider status** panel (Phase 6) — configured / not configured / offline.

## 4.4 Preserved settings behaviour

Existing settings (palette, background, start page, accent, density, productivity area, clock format, motion) and the Data block (export / import / backup status / reset preferences / reset all data) keep their storage keys and behaviour. [DONE] — must not regress.

---

# PHASE 5 — Living cinematic scenes for every tab

Delivers old Part B Phase 7 and old C.7, using **code-drawn animated scenes**: layered inline SVG + CSS driven by `body[data-page]`. No new binary assets, no external requests. The Games page already proves the technique with its five-layer stack (`gv-scene-art` / `-shade` / `-glow` / `-fog` / `-particles`).

## 5.1 One scene system, replacing three [FIX]

Three uncoordinated entry-animation systems run today: `.is-page-entering` (`index.html:1797-1799`), `.scene-enter` (`discovery-integration.js:14`), and the CSS `osEnter` keyframe (`cinematic-refinement.css:131-132`). Two independent parallax variable sets exist — `--px` / `--py` (`index.html:2961-2970`, with **no consumer in the stylesheets**) and `--scene-x` / `--scene-y` (`discovery-integration.js:15`). Collapse into one scene controller owning entry transition, parallax, ambient motion and reveal, exposed on `window.OneSpace`.

## 5.2 Per-tab scenes [NEW]

Each of the 10 distinct pages gets a layered scene; the 11th route, Projects, redirects to Work and shares its scene (user-confirmed). Each page has a scene whose subject matches its domain, following the visual directions already agreed: **Home** = observatory / personal command deck; **Work** = drafting room / command centre; **Personal** = calm ritual space; **Explore** = world atlas / travel window; **Games** = game-world spotlight; **Movies & Series** = theater / streaming marquee; **Shortcuts** = navigable launch wall; **Productivity** = focused timer studio; **Notes** = quiet capture desk; **Settings** = control room.

Every scene composes: a drawn SVG backdrop; a depth layer with pointer parallax; a slow ambient layer (drifting light, motes, gradient shift); and a shade scrim guaranteeing text contrast. The nine existing `assets/page-art/*` stills are retained as an optional art slot behind the drawn layers, so a real render can replace a drawn backdrop later without code changes.

## 5.3 Close the gaps [FIX]

- **Games and Movies get a `.page-hero`** with eyebrow, headline and scene caption, and join the scene numbering — currently 01–09 with both absent from the `scenes` map in `cinematic-scenes.js:5`.
- `#moviesView` is an empty `<div id="moviesMount">` (`index.html:570-572`) until `movies.js` mounts, so it renders nothing cinematic on first paint. Ship hero markup in the document.
- `index.html:494` uses class `projects-scene`, which **has no matching selector anywhere** — a dead class.
- Games `world` values `neon` and `aurora` exist in `games-data.js` with **no CSS rule** and silently fall back to the amber default.
- `cinematic-scenes.js:13-22` injects heading icons by brittle `nth-child` position — move to explicit markup hooks.
- Gradient-only fallback heroes now dead behind the art layer (`pages.css:81, 113, 136, 148, 171`) — remove or repurpose.

## 5.4 Interaction rules carried from old Phase 7

| Rule | Status |
|---|---|
| Entry transition per tab — short, content-first, never delaying interaction | [OPEN] |
| Hero scene movement / parallax on pointer, stable on touch | [DONE] — unify in 5.1 |
| Parallax only on explicitly marked decorative layers; clamp values, use `translate3d`, never move text, forms, buttons or focus targets | [DONE] |
| Scroll-linked depth only where it improves hierarchy, via IntersectionObserver with a fallback | [DONE] |
| Staggered reveal for primary cards — visible content only, modest durations | [DONE] |
| Meaningful transitions for search results, filter changes, detail open, save/remove, board status, task completion, tab change, image load and fallback | [OPEN] |
| Cinematic loading states matched to the section, not generic spinners | [OPEN] |
| Real image crossfades and sensible crop positioning | [DONE] |
| Fallback art only on failed media requests; broken media still leaves a usable card | [DONE] |
| One consistent inline SVG icon system, accessible labels retained | [DONE] |
| Hover, focus, active, empty, loading, error, disabled, success states for every interactive surface | [OPEN] |
| Accessible labels, tooltips, `aria-pressed` / `aria-expanded` / `aria-current`, `aria-live` for saves, reminders, completion, close/reopen, deletion | [OPEN] |
| Touch targets sized for mobile; hover-only behaviour disabled on coarse pointers | [DONE] |
| Test at 1440 / 1024 / 760 / 390 px — no overlap or overflow | [OPEN] — Phase 12 |
| Handle long user text safely across all domains | [OPEN] |
| Modal focus return and focus preservation after dynamic rerenders | [DONE] |
| Capture visual evidence that effects are visible, stable on touch, and disabled in reduced motion | [OPEN] |

## 5.5 Motion contract [FIX]

All motion routes through `prefersReducedMotion()` (`index.html:1705-1709`, exported at `:3084`). Four paths re-query `matchMedia` directly and therefore **ignore the user's "Full motion" override**: `index.html:1183`, `games.js:97`, `games.js:468`, `movies.js:87`. Route them through the helper. Reduced motion removes parallax, ambient drift, stagger and scroll-linked transforms **entirely** — genuinely still, not slowed.

---


## 5.6 Global icon modernization and consistency [NEW V2]

The existing requirement for a consistent inline SVG icon system remains valid, but V2 makes the quality bar explicit across **every OneSpace tab**, not only newly-added actions.

Audit all visible **interface icons** across:

- Home;
- Work / Projects;
- Personal;
- Explore;
- Games;
- Movies & Series;
- Shortcuts;
- Productivity;
- Notes;
- Settings;
- global navigation, dialogs, filters, search, cards, empty/error states and shared controls.

The goal is one polished, modern icon language rather than a mixture of unrelated, dated or generic glyphs.

### 5.6.1 Visual language

UI icons should use consistent:

- SVG geometry/viewBox conventions;
- stroke/fill philosophy;
- stroke weight where stroked icons are used;
- corner/line character;
- optical size;
- alignment;
- spacing inside buttons, chips, headings and navigation.

Domain icons may have distinct silhouettes appropriate to their domain, but still belong to the same visual family.

### 5.6.2 Action consistency

The same action should use the same recognizable glyph throughout the application where context permits, including:

- add;
- edit;
- remove/delete;
- back;
- more;
- favorite;
- search;
- filter;
- sort;
- save;
- restore;
- open/play;
- navigation;
- close;
- refresh/retry;
- expand/collapse.

Do not substitute random emoji, Unicode symbols or unrelated visual styles for application controls.

### 5.6.3 Improve, do not churn

Do not replace an existing icon merely because a different icon could also work.

Retain icons that are already clear, modern, correctly aligned and consistent.

Replace or refine icons only when they are:

- visually dated;
- inconsistent with the shared icon language;
- ambiguous;
- poorly aligned;
- disproportionately sized;
- low-quality at supported sizes;
- duplicated with conflicting meanings;
- using a text/emoji glyph where the application icon system should be used.

This is a global polish pass, not an excuse for unrelated UI redesign.

### 5.6.4 Accessibility and interaction

Icon-only controls must retain:

- an accessible name;
- keyboard focus visibility;
- appropriate tooltip where useful;
- required ARIA state;
- adequate touch target;
- clear hover/focus/active/disabled behavior.

Do not remove useful text labels merely to display more icons.

Decorative icons must not create redundant screen-reader announcements.

### 5.6.5 Brand/source exceptions

Do not restyle legitimate:

- website favicons;
- provider/source attribution marks;
- game/movie/service logos;
- other content-owned brand marks

into the OneSpace UI glyph style.

Those are source/content identity rather than application-control icons.

### 5.6.6 Verification

Verify the icon system across all tabs at the required desktop/tablet/mobile widths.

Acceptance requires:

- no broken or missing UI icons;
- no accidental emoji/text-glyph controls;
- no conflicting glyph for the same shared action without documented reason;
- no clipping, baseline drift or obvious size mismatch;
- icon-only actions remain accessible;
- icons remain crisp and readable in light/dark themes and supported palettes;
- brand/content icons remain distinguishable from application-control icons.

Retain visual evidence covering representative navigation, page headings, cards, forms/dialogs and shared actions.


# PHASE 6 — Provider-backed search with typeahead [NEW]

## 6.1 Server layer

Extend `server/_static-server.js` (or add `server/api.js`) with a proxy reading credentials from `config/secrets/` — **server-side only, never in browser JS**. Routes: `/api/search/titles`, `/api/search/games`, `/api/details/:kind/:id`.

Carried from the old REVISED plan's provider requirements:

1. Provider-neutral contract for title search, game search, and details.
2. Normalise every provider response into the app's existing record shapes, so the UI never sees a TMDB or IGDB payload.
3. `AbortController` cancellation when the query changes quickly.
4. Explicit loading, empty, timeout, rate-limit, offline, authentication and provider-error states.
5. Short-TTL response cache; cache must be clearable without deleting user records.
6. Pagination / load-more — never silently cap results.
7. Attribution and source links in details where the provider requires it.
8. A **local mock provider** so automated tests never need network access or quota.
9. A clear configuration-error state when credentials are missing — the UI explains what is unavailable rather than showing the local catalog as if it were global.

## 6.2 Typeahead

Both Games (`#gvGameSearch`, wired `games.js:1009-1028`) and Movies (`#mvMovieSearch`, wired `movies.js:802-821`) **already have real ARIA combobox typeaheads** over the local catalog, with arrow-key navigation, Escape, click-outside close, and an "Add Custom" row. [DONE] Keep both and extend:

- **Debounce input** — both currently fire on every keystroke.
- **Two result groups** in one dropdown: "In your catalog" (local, instant) then "Search results" (provider, async) with a loading row.
- **Explicit add affordance.** Selecting a row currently calls `addSuggestionToLibrary` / `addSeedToLibrary` **immediately**, with no confirmation and no status choice (`games.js:1004`, `movies.js:797`). Add an explicit add control, and for titles a status choice — matching the Discover panel (`discovery-ui.js:31`), which already does this properly.
- **Series parity** — series are first-class in the same search; the type filter (`movies.js:1396`) gets capitalised `Movie` / `Series` labels.
- **Offline / unconfigured state** is visible and explicit.

## 6.3 Reconcile the two search experiences [FIX]

`discovery-integration.js:3-9` mounts a second, unrelated Discover panel into Movies, renames the tab, wraps the existing preference chips into a `<details>`, and rewrites the typeahead placeholder. Games has the same split. Reconcile into one search experience per domain with one result-card design.

---

# PHASE 7 — Shortcuts: add and remove for every shortcut

## 7.1 Removable built-ins [NEW]

All 47 built-ins (`index.html:1060-1112`) have **no delete and no edit control** — `cardHtml` (`index.html:1223`) and `shortcut-surface.js:6` both gate those on `custom`. The only removal mechanism is the hardcoded `HIDDEN_DEFAULT_IDS = ["hm","zara","maxmara"]` (`index.html:1163`).

1. Add an `orbit-hidden-links` array key with a validator in `shared/storage-utils.js`, a fixture, and a backup round-trip test.
2. Every shortcut card — built-in or custom, full (`index.html:1215-1237`) and compact (`shortcut-surface.js:4-7`) — gets a Remove control. Custom keeps destructive delete; built-in hides.
3. A **Removed shortcuts** panel in Settings restores any of them.
4. Replace `HIDDEN_DEFAULT_IDS` with real user data, seeding those three ids on first run so nothing visibly changes for existing users.

## 7.2 Add-control fixes [FIX]

- **Work has no add-shortcut control at all**, unlike Personal (`index.html:528`) and Explore (`index.html:559`). Add one.
- **`index.html:2498` binds every `[data-add-space]` button to `openShortcutModal(null)` and never reads the attribute**, so the declared space is discarded and the modal guesses from `currentPage` / `currentSpace` (`:2478`). Honour the attribute.
- `shortcut-surface.js:9` calls `renderExplorePage()` with no argument, silently clearing the Explore search filter whenever any shortcut is favorited.
- "Duplicate" (`index.html:2585`) is a stub that only shows a toast. Implement or remove.

## 7.3 Modernisation — old C.6

1. Rebuild the card and launch wall on the inline SVG icon system with a favicon/hostname fallback chain that never renders a broken image.
2. Modern grid with proper hover, focus, active, empty, loading and error states; mobile-sized touch targets.
3. Drag-to-reorder **with a keyboard-accessible equivalent**; favorites and recents visually distinct rather than text-labelled.
4. Name, description and hostname in a clear hierarchy, with `rel="noopener noreferrer"` preserved.
5. Explore-owned shortcuts stay visually consistent but strictly scoped.

## 7.4 Ownership rules preserved from old Part B Phase 3

| Step | Status |
|---|---|
| Shortcut modal has a description field and explicit space ownership | [DONE] |
| Adding from Personal defaults to Personal; adding from Explore forces Explore | [DONE] — but see the 7.2 attribute bug |
| Enforce ownership in sanitization and `linkSpace()` so links cannot leak between spaces | [DONE] |
| Edit and delete confirmation for custom shortcuts | [DONE] |
| Show name, description, hostname, icon fallback, favorite, recent, safe external-link behaviour | [OPEN] — hostname is not shown on the compact card |
| Regression tests for deletion, descriptions, space filtering, duplicate URLs, backup round trips | [DONE] |

---

# PHASE 8 — Games: correct tracker on add

## 8.1 Tracker type must be correct at add time [NEW]

A tracker **is** already created at add time — `starterStory()` at `games.js:846`, `:676`, `:1641`, and `ensureWeekly()` for weekly. The real defect is that **the type is almost always wrong**: `SUGGESTION_CATALOG` (`games-data.js:182-195`) carries **no `trackerType`**, and `games.js:843` defaults to `g.trackerType || "story"`. Every one of the 12 suggestions — and every future provider result — becomes a story game with one generic 3-objective chapter.

1. Add `trackerType` to every catalog record and to the provider normaliser.
2. Infer the default from genre and tags (live-service, MMO, looter, gacha, battle-royale → **weekly**; campaign, story-rich, single-player → **story**), and **show the inferred choice in the add flow so it can be corrected before saving**. The two `.gv-tracker-choice` pills (`index.html:729-732`) already exist for custom games.
3. Mission-based games get **real chapters**, not one catch-all. `OneSpaceGameResources.story` (`game-resources.js:25`) currently always produces a single `"Your first milestones"` chapter; extend the catalog so story games ship a chapter outline.
4. Editing a game from weekly → story leaves the old `story` object orphaned (`games.js:669-673`). Reconcile on type change.

## 8.2 De-Diablo-ify the weekly tracker [FIX]

Old Phase 5 step 3 required the resource model be data-driven "so Diablo Immortal is only one example". The weekly system is generic in its toggle logic but hardcodes Diablo in four places:

- `cloneWeeklyTemplate` special-cases `game.id === "game-diablo-immortal"` (`games.js:208`)
- `defaultTasks` / `defaultTaskTemplates.weekly` injection (`games-data.js:202,204`)
- the Overview stat tile (`games.js:724-725,744`)
- the literal heading `"Diablo Weekly Tasks"` (`games.js:1422`)

Make all four data-driven so any weekly game behaves identically. Also fix the cascade order in `game-resources.js:24`, where the `defaultTasks` check precedes the `trackerType === 'weekly'` branch, so a record with story-flavoured `defaultTasks` reuses them as weekly tasks.

**[FIX] `resetWeekly()` destroys Diablo's task list.** `games.js:581` calls `cloneWeeklyTemplate()` with **no argument**, so `library.find(g => g.id === undefined)` yields `{}`, the Diablo special case does not match, and `OneSpaceGameResources.weekly({})` returns 3 generic tasks. Pressing "Reset Weekly Tasks" on Diablo Immortal replaces its 7 real tasks with 3 generic ones until the next ISO-week rollover restores them. Pass the game id. This phase already rewrites `cloneWeeklyTemplate`, so fix it in the same pass and add a test asserting reset preserves the game's own template.

## 8.3 C.4 — checkboxes that will not un-check (approved root cause)

`saveLibrary()` (`games.js:175`) and `saveWeekly()` (`:180`) **discard the boolean return from `safeSet`**, which returns `false` and toasts on a quota or validation failure (`index.html:927-939`). In-memory state flips, the UI re-renders checked, storage is unchanged — and the state reverts on reload. This is the most probable mechanism behind the report, and it was missing from the old plan's suspect list.

**Fix.** Route both through the same read-back-and-rollback pattern as `commitGameChanges()` (`games.js:176-179`), surface a real error, and add regression tests asserting (a) the toggle is an involution — two toggles return the original state — and (b) a rejected write never leaves the UI showing a state storage does not hold.

**Secondary contributors to check during reproduction, in order:**

1. **Week rollover mid-interaction.** `ensureWeekly` (`:211-220`) discards all `done` flags and re-clones the template whenever the ISO week key changes, and it is reached from **every render** via `weeklyStats` (`:238`).
2. **`findChapter` is scoped to `selectedStoryGameId`** (`:498-502`), so an objective rendered for any other game silently no-ops.
3. `toggleWeeklyTask` depends on an ancestor `.gv-tracker[data-game-id]` (`:1565`); a weekly checkbox rendered elsewhere gets no handler.
4. Ruled out by inspection: the click delegate's `switch` (`:1522-1557`) has **no** case for `toggle-objective` or `toggle-weekly-task`, so they are handled only by the `change` listener (`:1558`) and are not double-fired.
5. Also ruled out: `is-just-checked` styling is applied only when the new state is `done === true` (`:351`, `:396-397`), so it cannot make an unchecked box look checked.

## 8.4 Games behaviour preserved from old Part B Phase 5

| Step | Status |
|---|---|
| Records carry official, news, build, guide, update, community and platform links | [DONE] |
| Default task/objective templates on game records | [DONE] |
| Resource model data-driven, Diablo only one example | **[OPEN]** — see 8.2 |
| Per-game detail/resource panel | [DONE] |
| Resources grouped into news/updates, builds/guides, official, community, game-specific tasks | [DONE] |
| Catalog, suggestions, wishlist and custom flows initialise the correct story or weekly tasks | **[OPEN]** — see 8.1 |
| No duplicate task initialisation after rerender or reload | [DONE] |
| Every built-in and custom game discoverable via genre filter, search, add, edit, delete, progress, resources | [DONE] |
| Sessions, journal, themes, story objectives and weekly behaviour preserved | [DONE] |
| Tests for resource mapping, default task creation, genre filtering, deletion cleanup | [DONE] |
| Verify every Games tab, filter, search, suggestion, library, wishlist, details, resource link, task, session, journal, theme, add, edit, delete and confirmation action | [OPEN] — Phase 12 |

## 8.5 Remaining games defects [FIX]

1. **User-added games can never reach the spotlight.** `featuredGames()` (`games.js:1261-1263`) filters the spotlight rail to games that have `artwork`, and custom or provider-added games have none. Fall back to the deterministic `gameScene(game)` generator (`games.js:264-274`) that cards already use, so every tracked game is eligible.
2. **Unescaped selector in focus restoration.** `withFocusPreserved` (`games.js:1608`) concatenates attribute values into a `querySelector` string without escaping. Ids come from `uid()` today so it is safe, but a `data-id` containing a quote throws out of `querySelector` and aborts refocus. Use `CSS.escape`, or match by element reference rather than by selector.
3. **Reveal state bleeds between games.** Weekly task ids are `default-0..n` for every non-Diablo game (`game-resources.js:26`) and default chapter ids are `c1..c4` across games (`games-data.js`), while `revealedKeys` (`games.js:71`, `:104`) is a flat map. A freshly-rendered row therefore skips its reveal animation because another game already claimed that key. Namespace the reveal key by game id.
4. **Games `world` values `neon` and `aurora` have no CSS rule** and silently fall back to the amber default — also listed in Phase 5.3; fix in whichever phase runs first.

---

# PHASE 9 — Movies and Series

## 9.1 C.1 — a tracked title can never be untracked (confirmed defect)

**Root cause, verified.** Every seed-add path — search dropdown (`movies.js:797`), suggestion cards (`:1247-1249`), hero (`:1048`), watchlist (`:1250-1251`), details modal (`:1234-1235`) — flows through `addSeedToLibrary`, which hard-sets `clone.custom = false` (`:442`). That single flag both suppresses the delete button (`:619`) and makes `deleteMovie` return early (`:458`). Line 460 is the **only** place anything is removed from `library`. The three status options are `unwatched | watched | watchlist` — none means "not tracked" — and `renderOverviewStats` counts `library.length` as "Titles tracked" (`:661`).

**Fix.** Separate two concepts currently conflated under `custom`:

- **Untrack / Remove from library** — available for **every** tracked title, catalog or custom. Removes the record from `library` and the watchlist, returning it to an untracked catalog entry that can be re-added. `OneSpaceUI.confirm` then a toast.
- **Delete custom title** — unchanged, still `custom`-only, since a custom record has no catalog entry to fall back to.

Drop the `!m.custom` guard from the untrack path, render the untrack control unconditionally on library cards and in the details panel, and make "Titles tracked" drop when a title is untracked.

**Also fix [FIX]:** the watchlist is derived from two sources at once — the legacy `watchlist` id array **and** `status === 'watchlist'` (`watchlistItems()` `:360-363`) — while `addToWatchlist` (`:465-467`) only ever writes the status. Reconcile to one source of truth.

**Verify.** Track a catalog movie → untrack it → it leaves Library, the tracked count decreases, it reappears as an untracked suggestion, and it is still untracked after reload. Repeat for a series and for a custom title, which must still offer permanent delete.

## 9.2 C.2 — large movie images are blurred (confirmed cause)

Not a CSS `blur()` — there is none on movie artwork. Per `assets/manifest.json`, every poster in `assets/movie-art/` is **300 × 450** (13–29 KB). Backdrops are 1920 × 1080 except `pulp-fiction-background.jpg` at 1280 × 720. A 300px source shown at 400–600 CSS px on a 2× display is upscaled 3–4×.

1. Re-source posters at a minimum of **1000 × 1500** for detail/hero use, keeping the 2:3 ratio and file naming.
2. Keep a small variant for grid cards; serve both via `srcset` / `sizes`.
3. Bring `pulp-fiction-background.jpg` to 1920 × 1080.
4. Add a CSS guard so no image is scaled beyond its intrinsic width — a future undersized asset then looks visibly wrong rather than quietly blurry.
5. Update `assets/manifest.json` dimensions and bytes; record provenance in `assets/movie-art/SOURCES.md`.
6. Licensing constraint holds: no scraping, no unlicensed downloads. Where no licensed high-resolution image exists, render the deterministic fallback rather than shipping an upscaled blur.

Note `.mv-poster-img { object-fit: contain }` (`movies.css:97`) letterboxes posters rather than filling — review alongside the resolution change.

## 9.3 C.3 — series are effectively invisible

`MOVIE_TYPES = ["movie","series"]` exists (`movies-data.js:17`) and there are exactly **4** series (`movies-data.js:137-142`: `tv-dark`, `tv-queens-gambit`, `tv-good-place`, `tv-chernobyl`) against 16 movies. All four carry `poster:{kind:'placeholder'}` and `backdrop:{kind:'placeholder'}`, plus `platforms:[]` and `rating:0` — so they render as generated SVG next to fully-illustrated movies, and `ratingLabel` prints `—`. They also land in the hero carousel as pure generated SVG, since the featured pool is all of `SEED_MOVIES` (`movies.js:1004`).

1. Expand to at least 12–15 series spanning the same genre range, so type filtering returns a useful set.
2. Real local artwork at the 9.2 resolutions; remove every `kind:'placeholder'` from seed data.
3. Populate `platforms`, `rating`, `moods`, `tags` and a substantive `blurb`.
4. Make the `movie` / `series` filter first-class and visible, with capitalised `Movie` / `Series` labels.
5. Keep series cards honest about shape — seasons and approximate episode length, which `libraryCardHtml` already formats — **without** episode-by-episode tracking, which stays out of scope.

Phase 6's provider search makes catalog size far less critical, but the seeded set must still look credible offline.

## 9.4 Movies behaviour preserved from old Part B Phase 6

| Step | Status |
|---|---|
| First-class `type: movie\|series` in `movies-data.js` | [DONE] |
| Series metadata, explanations, seasons | [DONE] |
| Type and genre filters | [DONE] |
| Cards, search, details, suggestions, watchlist views updated | [DONE] |
| `movies` route and storage keys preserved | [DONE] |
| Episode tracking stays lightweight | [DONE] |
| Series-specific validation in `storage-utils.js` | [DONE] |
| Backup fixtures and migration handling | [DONE] |
| Tests for mixed search, type/genre filtering, suggestion explanations, watchlist, malformed series data | [DONE] |
| Verify every Movies & Series tab, type filter, genre filter, search, suggestion, detail, add/remove, watched state, watchlist, library and reload flow | [OPEN] — Phase 12 |

## 9.5 Confirmation dialog consistency [FIX]

`deleteMovie` (`movies.js:459`) uses native `window.confirm`, while every other domain uses `OneSpaceUI.confirm` (`shared/domain-ui.js:26`) with the shell's modal stack, focus trap, Escape handling and inert background. A native dialog cannot be styled, ignores reduced-motion and theme, and breaks the focus-return contract the rest of the app honours. Move it to `OneSpaceUI.confirm`, which the new untrack flow in 9.1 already requires.

---

# PHASE 10 — Explore

## 10.1 C.5 — real imagery and substantive descriptions

`explore-data.js` holds 12 destinations, each pointing at `assets/destinations/<id>.svg`. These are **conceptual SVG illustrations, not photographs** — the old REVISED plan already flagged this as a missed requirement. Each record has `summary` and `details`, but the depth is uneven.

1. Real, properly licensed local imagery per destination at hero and card resolutions, following the 9.2 sizing and `srcset` rules.
2. A substantive description per destination: what the place is, why it suits its tagged categories, best season and why, rough trip length, budget character, and what a traveller actually does there. `summary` stays short for cards; `details` carries the long form.
3. Never blank: alt text always present; the deterministic fallback used only on a genuinely failed request.
4. Licensing constraint maintained; attribution in a `SOURCES.md` beside the assets.
5. **All destination art stays under root `assets/destinations/`** so the three `^assets/` validators (`storage-utils.js:36`, `local-discovery.js:5`, `trip-board.js:6`) keep accepting previously-saved user records.

## 10.2 Resolve the `explore.js` discrepancy [RESOLVED]

Resolved in Phase 10: the obsolete auto-mounting `explore.js` was removed instead of being added to `index.html`. `explore-global.js` remains the sole browser mount owner, while deterministic recommendation logic lives in `local-discovery.js`, the exact module called by the browser discovery controller and imported by regression tests. This removes the duplicate implementation and makes browser/test behavior agree without creating a second mount.

## 10.3 "More to explore" is not the final section [FIX]

Both the old REVISED plan (non-negotiable #6) and old Part B Phase 4 step 13 require "More to explore" be the last Explore section. It is currently **third of four**: Destinations → **More to explore** (`index.html:551`) → Explore shortcuts → chill strip. Move it last.

## 10.4 Explore behaviour preserved from old Part B Phase 4

| Step | Status |
|---|---|
| `explore-data.js` holds the curated destination catalog | [DONE] |
| Destination fields: ID, name, country/region, categories, budget, duration, season, style, tags, summary, details, links, image, fallback | [DONE] |
| `explore-global.js` owns persisted destination preferences | [DONE] — re-verified in 10.4.3 |
| Destination type, climate/season, trip length, budget, pace, interests, departure region | [DONE] |
| Deterministic, explainable recommendation ranking | [DONE] |
| Show why each destination was recommended | [DONE] |
| Preference controls, recommendation cards, details, save/favorite, shortlist/trip board, Explore-only shortcuts | [DONE] |
| "Surprise me" as a filtered random recommendation | [DONE] |
| Responsive destination images with fallback modelled on `visual-utils.js` | [DONE] |
| Accessible alt text; never a blank destination card | [DONE] |
| Tests for filtering, stable ranking, saved destinations, Explore-only shortcuts, malformed data | [DONE] |
| Verify preference controls, search/filter submission, recommendation cards, detail open/close, save/remove, notes, trip-board actions, Surprise Me, image fallback and reload | [OPEN] — Phase 12 |
| Keep "More To Explore" last | **[OPEN]** — see 10.3 |

---

# PHASE 11 — Personal

Old Part B Phase 3, personal half. All delivered; must not regress.

| Step | Status |
|---|---|
| `makeCheckListController()` refactored into reusable add / edit / toggle / delete | [DONE] |
| Deletion routed through the existing modal/confirmation pattern | [DONE] |
| Toast and `aria-live` message after successful deletion | [DONE] |
| Separate storage for goals, routines and habits | [DONE] |
| Completion counts and progress summaries | [DONE] |
| Optional habit frequency / target metadata | [DONE] |
| Clear empty states | [DONE] |
| Verify add / edit / check / delete / cancel after rerender and reload | [OPEN] — Phase 12 |

**[NEW] Where Work's removed content lands.** Phase 3 strips five non-work surfaces from the Work page. None of them moves to Personal:

| Removed from Work | Goes to | Why |
|---|---|---|
| Next-up tasks (`orbit-tasks`) | Productivity | Productivity owns that key |
| Pomodoro timer mirror | Productivity | Already lives there |
| Countdowns (`orbit-countdowns`) | Productivity | Already rendered there |
| Quick note (`orbit-notes-list`) | Notes | Notes owns that key |
| Recently-opened shortcuts | Shortcuts / Home | Space-scoped surface |

Personal's own goals, routines and habits are unchanged. Nothing is deleted — each surface already exists on its owning page, so this is removal from Work, not a migration.

---

# PHASE 12 — Verification and delivery

Old Part B Phase 8, extended.

1. Run the complete recursive JavaScript parse test and all Node tests: `node --test tests/`.
2. **New tests** added by this plan: structural assertions (1.7); domain-boundary assertions (Phase 3); hidden-shortcut round trip (7.1); tracker-type inference and the toggle-involution regression (8.1, 8.3); untrack behaviour (9.1); provider normalisation, error, timeout, rate-limit and offline states against the mock provider (6.1).
3. Expand Node tests for pure Work, Explore, shortcut, game, movie, visual-state and migration helpers.
4. Test schema validation, migration defaults, backup/restore, reset and storage rollback.
5. Browser-level smoke tests for every top-level route; `tests/browser-smoke.mjs` exports `routes(tab)`, `layout(tab)` and `workLifecycle(tab)`.
6. Test navigation, add/edit/delete, modal close/cancel, persistence after reload, filters, task checkboxes, close/reopen, backlog/history, reminders, image fallback and external links.
7. Start the static server and inspect the console for uncaught errors and failed local assets.
8. Verify Work hierarchy and close-all behaviour; Personal delete confirmation; Explore recommendation explanations and image fallback; game-specific links and default tasks across multiple genres and **both tracker types**; movie and series genre views.
9. Verify backup export/import with all new data; reset behaviour and unrelated `localStorage` preservation.
10. Verify keyboard-only navigation and reduced-motion mode — every route genuinely still.
11. Verify desktop, tablet and mobile layouts at 1440 / 1024 / 760 / 390 px.
12. **Offline pass:** provider unreachable → visible degraded state, no silent local fallback presented as global results.
13. Verify every button from the Phase 0.5 inventory has a success test and an applicable cancel / error / persistence test.
14. Set `MISSING_ASSET='assets/destinations/azores-card.webp'` on `tests/browser-server.js` to exercise the current photograph-to-illustration fallback path. The historical `azores.svg` target became the fallback asset after Phase 10 replaced the primary image with licensed WebP photography; failing the SVG alone no longer triggers fallback.
15. Tick off every remaining **original Phase 0–12** box and confirm none is left unchecked without a stated reason.
16. Do not perform final documentation here. V2 Phases 14–19 execute after this checkpoint, followed by additive final-fidelity Phases 20–25 and then the Phase 26 whole-project integrity audit; **Phase 13.3 remains final and runs only after Gate 26**.

---

## Critical files

| File (post-regroup path) | Role |
|---|---|
| `index.html` | Shell, router `goToPage()` (`:1788-1818`), inline controllers, Settings markup (`:599-623`), 47 built-in links (`:1060-1112`), 22 script + 8 style refs |
| `server/_static-server.js` | Block list must change or `work/` 404s; gains the provider proxy |
| `shared/storage-utils.js` | Sole validation boundary; cross-domain require at `:49`; new `orbit-hidden-links` key |
| `tests/data-regression.test.js` | Non-recursive parse loop at `:132` must become recursive |
| `tests/tracker-regression.test.js` | Six `require` paths + a `vm.runInContext` file list to update |
| `work/work-tracker.js` | Tracker render (`:52`), overview tiles (`:51`), filters (`:118`), lifecycle, timeline leak (`:75`) |
| `work/projects.js` | Project CRUD; sheds `#homeOverview` (`:40-43`) and the Work-overview fallback (`:44-47`) |
| `work/tracker.css` | Grid locks (`:1-4`) driving the cramped layout |
| `shared/cinematic-scenes.js` | Index-based Settings grouping (`:26-34`), `nth-child` icon injection (`:13-22`), scene map missing games/movies (`:5`) |
| `styles/cinematic-refinement.css` | `--os-*` and `--page-accent` tokens; the 5 `url()` paths needing `../` |
| `styles/pages.css` | Competing `--page-accent` (`:193-195`); dead gradient heroes |
| `games/games.js` | `saveLibrary`/`saveWeekly` (`:175,180`), `addSuggestionToLibrary` (`:837`), `cloneWeeklyTemplate` (`:206`), typeahead (`:1009`), toggles (`:511,571`) |
| `games/games-data.js` | `SUGGESTION_CATALOG` missing `trackerType` (`:182-195`); Diablo injection (`:202,204`) |
| `games/game-resources.js` | Task cascade order bug (`:24`); single-chapter `story` (`:25`) |
| `movies/movies.js` | `custom` gating (`:442,458,619`), typeahead (`:802-821`), watchlist split (`:360-363`) |
| `movies/movies-data.js` | 4 placeholder-art series (`:137-142`) |
| `explore/explore-data.js`, `assets/destinations/` | Conceptual SVGs to replace; long-form descriptions |
| `explore/local-discovery.js`, `explore/explore-global.js` | Shared deterministic discovery model plus the sole browser mount owner after the Phase 10 discrepancy fix |
| `shared/shortcut-utils.js` | `space()` inference incl. `youtube`/`maps` exceptions (`:3`) |
| `shared/shortcut-surface.js` | Compact card, `custom`-gated controls (`:6`), `renderExplorePage()` arg bug (`:9`) |
| `movies/movies.css` | `.mv-poster-img { object-fit: contain }` (`:97`) letterboxes posters — review with 9.2 |
| `assets/manifest.json` | Records art dimensions and bytes; updated by 9.2, 9.3 and 10.1 |
| `home/home-overview.js` | **New in 3.1** — the only module permitted to read across domains |
| `config/secrets.example.json`, `.gitignore` | New; TMDB / IGDB or RAWG keys |
| `docs/IMPLEMENTATION-STEPS.md` | **New in 13.2** — the sequenced execution checklist, written before work begins |
| `README.md`, `VERIFICATION.md` | Commands, paths and the recorded acceptance run |
| `agent-instructions.md` | This document — the standing plan |

---

## Verification commands

```sh
node --test tests/                                       # all suites incl. structure.test.js
node server/_static-server.js                            # http://localhost:8973
curl -I http://localhost:8973/config/secrets/api-keys.json   # must 404
curl -I http://localhost:8973/config/secrets/probe.js        # must 404 — the check that matters
git check-ignore -v config/secrets/api-keys.json          # confirms the ignore rule
git log --follow games/games.js                           # proves git mv was used
$env:PORT = '18974'; node tests/browser-server.js         # disposable origin (PowerShell)
```

This machine is Windows with PowerShell as the primary shell, so `PORT=18974 node …` is a parse error — use the `$env:` form, as `README.md` already documents. If Node reports an EPERM during path resolution in a sandboxed Windows install, prefix with `--preserve-symlinks --preserve-symlinks-main`.

## Defect acceptance checks — each must FAIL before the fix and PASS after

| Item | Check |
|---|---|
| 9.1 untrack | Track a catalog movie, untrack it: it leaves Library, "Titles tracked" decreases, it returns to Suggestions, and it is still untracked after reload. A custom title still offers permanent delete. |
| 9.2 sharpness | In a detail view at 1440 px / 2× DPR, no `<img>` has a rendered width greater than its `naturalWidth`; posters report `naturalWidth >= 1000`. |
| 9.3 series | The Series filter returns 12+ illustrated titles; zero records with `kind:'placeholder'` remain in `movies-data.js`; search returns mixed movies and series. |
| 8.3 checkboxes | Toggle an objective and a weekly task ten times each: model, percentage and DOM agree every time, and state is correct after reload. A regression test asserts two toggles return the original state, and that a rejected write never leaves the UI ahead of storage. |
| 8.1 tracker type | Adding a live-service game from the catalog produces a **weekly** tracker; adding a campaign game produces **chapters**; the inferred type is visible and correctable before saving. |
| 10.1 destinations | All 12 destinations show a photograph and a long-form description; a forced 404 leaves the card usable via fallback; saved destinations still validate. |
| 7.1 shortcuts | Every shortcut, built-in included, offers Remove; a removed built-in is restorable from Settings; add, edit, favorite, reorder and delete work by keyboard alone; no broken icons at 1440 / 1024 / 760 / 390 px. |
| 5.x cinematic | Each route is visually distinct and visibly in motion; reduced-motion mode is genuinely still; the browser bundle still issues no external requests. |
| 5.6 icons | Every tab uses one coherent modern inline-SVG application icon language; shared actions are consistent, icon-only controls remain accessible, no broken/emoji substitute controls remain, and brand/provider/favicons are preserved as source identity. |
| 3.x boundaries | No page but Home reads a storage key belonging to another domain. |
| 10.3 Explore order | "More to explore" is the final section on the Explore page. |

---

## Further considerations

Carried from the previous plan; all still apply.

1. The Explore catalog is local and curated, so content and images are maintained in code and assets. Phase 6's provider layer reuses the same recommendation interface, and now has `config/secrets/` and `server/providers/` waiting for it.
2. A full Jira clone is too broad for a single-page local app. The hierarchy and lifecycle already built deliver the requested development workflow while staying maintainable — Phase 2 improves its presentation, not its scope.
3. **The inline `index.html` script must not grow further.** New domain behaviour belongs in the domain folders, with only small markup and router hooks in `index.html`. This constrains Phases 2, 4, 5 and 7, all of which touch shell-owned code today.
4. The app should feel cinematic through layered scenes, restrained motion, depth and responsive state changes — not decorative animation everywhere.
5. Every visual effect must have a purpose, stay subordinate to content and controls, and have a reduced-motion equivalent.
6. `shared/storage-utils.js` reaching into `explore/trip-board.js` is a layering violation carried over from the flat structure. The regrouping makes it visible. Phase 1 only repoints the path, because it forbids behaviour change; **Phase 3 row 15 injects domain validators instead.**

---

## Scope boundaries

**Included:** repository regrouping into domain folders; a git-ignored, non-servable secrets folder with a committed template; Work/Projects consolidation and the tracker redesign; domain boundary cleanup; theme system repair and new palettes; code-drawn animated scenes for all 11 routes; provider-backed search with typeahead; removable built-in shortcuts; games tracker-type correctness and the silent-save fix; Part C defects C.1, C.2, C.3, C.5, C.6, C.7; **every defect in the table above — none are deferred**; local-first data, CRUD, filters, in-page reminders, persistence, backup, restore, reset; automated and browser verification; and the documentation rewrite in Phase 13, including a new step-by-step execution checklist.

**Excluded unless separately approved:** server accounts; multi-user collaboration; cloud sync; true push notifications after the browser closes; full Jira integration; episode-by-episode TV tracking; scraping or unlicensed image downloading (this constrains 9.2, 9.3 and 10.1 — where no licensed high-resolution image exists, ship the deterministic fallback rather than an upscaled blur); moving `assets/` out of the repository root; any behaviour change during Phase 1.

**Amended:** the old plan's "no external CDN or new runtime dependency; the app makes zero network requests today and must still make zero afterwards" now applies to the **browser bundle's credential/provider-data access model**. External provider access is mediated through the local server/provider layer; provider media must follow the approved safe media contract. The app must still work with a visible degraded/offline state.

**V2 included additions:** global modernization/audit of the OneSpace UI icon system across every tab; provider-backed global destination discovery; deterministic provider identity and duplicate prevention; first-class local persistence for provider-origin Movies/Series, Games and Destinations; provider refresh merge safety; live-vs-mock evidence separation; server input validation; no-open-proxy/SSRF protections; safe bounded provider-media handling; untrusted-provider-text/XSS protection; async query/detail/content-art race protection; selected-content environmental art integrated into the existing cinematic controller; wide-desktop media-rich acceptance; complete V2 regression before final documentation.


---

## Defects found during inspection — all now in scope

Every defect surfaced by this inspection is assigned to a phase. Nothing is recorded-but-unplanned.

| Defect | Phase |
|---|---|
| `saveLibrary`/`saveWeekly` discard `safeSet` failures — silent data loss, likely C.4 root cause | 8.3 |
| `resetWeekly()` called with no argument, destroying Diablo's 7 weekly tasks | 8.2 |
| `featuredGames()` requires `artwork`, excluding every user-added game from the spotlight | 8.5.1 |
| `withFocusPreserved` builds an unescaped `querySelector` string | 8.5.2 |
| `revealedKeys` bleeds reveal state between games via colliding default ids | 8.5.3 |
| Games `world` values `neon` / `aurora` have no CSS rule | 5.3 / 8.5.4 |
| `movies.js:459` uses native `window.confirm` instead of `OneSpaceUI.confirm` | 9.5 |
| Movies watchlist derived from two conflicting sources | 9.1 |
| `shared/storage-utils.js` requires across into the Explore domain | 3.15 |
| Settings card grouped by field index — breaks on any new setting | 4.1 |
| Theme toggle silently resets the palette to Classic | 4.1 |
| "Deep Space" palette has no CSS variable block | 4.1 |
| `--page-accent` defined twice with a cascade conflict | 4.1 |
| "Reset preferences" wipes unrelated user data and skips `orbit-theme` | 4.1 |
| Four code paths bypass `prefersReducedMotion()`, ignoring the Full-motion override | 5.5 |
| `--px`/`--py` parallax variables have no consumer; two competing parallax systems | 5.1 |
| `projects-scene` is a dead class with no matching selector | 5.3 |
| `[data-add-space]` buttons never read their own attribute | 7.2 |
| `renderExplorePage()` called with no argument, clearing the Explore filter | 7.2 |
| "Duplicate shortcut" is a toast-only stub | 7.2 |
| ~~`explore.js` required by tests but absent from `index.html`~~ | Resolved in 10.2: duplicate module retired; browser and tests use `local-discovery.js` |
| "More to explore" is not the final Explore section | 10.3 |
| 14 cross-domain content leaks | Phase 3 |

---

---

# PHASE 14 — Provider truth audit and V2 scope reconciliation

This phase does not invalidate unrelated verified Phase 0–12 work.

Its purpose is to determine whether the existing Phase 6 provider implementation is mock-only, live-capable, or fully live-verified, and to reconcile the approved V2 scope.

## 14.1 Movies/Series provider audit

Prove separately:

- provider adapter exists;
- configured live path exists or does not exist;
- search route;
- details route;
- normalized movie/series response;
- poster/backdrop data;
- pagination;
- cancellation;
- loading/empty/error states;
- offline/unconfigured behavior;
- mock path.

If live credentials are unavailable, retain that as an explicit evidence limitation. Do not reinterpret mock verification as live E2E proof.

## 14.2 Games provider audit

Repeat for the configured IGDB/RAWG-equivalent path and prove:

- search;
- details;
- normalization;
- cover/background art;
- genres/tags/platforms;
- tracker signals;
- pagination/cancellation;
- errors/offline;
- mock vs live status.

## 14.3 Security audit

Prove:

- real secrets are ignored by Git;
- no real secret is tracked;
- no browser script references secret files;
- config/secrets are not servable;
- a representative otherwise-servable secret extension (for example `.js`) is denied;
- browser/network output contains no credential.

## Gate 14

The exact truth of current provider capability is retained as evidence and the V2 scope is reflected consistently in the standing plan/checklist before new V2 feature work advances.

---

# PHASE 15 — Global destination discovery

Add the missing provider-neutral destination capability while preserving all curated Explore behavior.

## 15.1 Provider selection and contract

Choose a legitimate destination/place provider according to:

- search usefulness;
- API practicality;
- imagery availability;
- licensing/attribution;
- server-side compatibility;
- rate limits.

Do not couple Explore UI directly to the selected vendor payload.

## 15.2 Server adapter

Implement normalized destination search/details through the local server.

Support:

- success;
- empty;
- pagination/progressive results;
- timeout;
- rate limit;
- configuration/auth failure;
- offline/network failure;
- provider error;
- malformed response;
- partial metadata.

## 15.3 Destination normalizer

Normalize available provider fields into the OneSpace-compatible model described in V2 scope.

## 15.4 Deterministic mock destination provider

Automated tests cover success, pagination, empty, timeout, auth/config, rate-limit, offline, malformed and partial-data cases without consuming live quota.

## 15.5 Explore integration

Present curated/local and global provider results coherently but distinctly.

Support explicit details and Save/shortlist/trip-board behavior.

## 15.6 Persistence

A saved provider destination becomes a validated local record and remains meaningful after reload with provider access disabled.

## 15.7 Curated regression

Reverify all 12 curated destinations, ranking, preference explanation, images, fallbacks, Surprise Me, save/remove and trip-board flows.

## Gate 15

Curated Explore and global destination discovery both work without misrepresenting one as the other.

---

# PHASE 16 — First-class provider-origin records and integrity

## 16.1 Deterministic identity / duplicates

For Movies, Games and Destinations:

- add provider item;
- attempt to add the same provider identity again;
- prove no duplicate user record or dependent state appears.

## 16.2 Provider/local collision policy

Do not fuzzy-auto-merge ambiguous names. Prove deterministic mapping behavior where such mapping exists.

## 16.3 Movies/Series local persistence

Add a provider title, disable provider access and prove normal local library/detail/status/untrack behavior still works.

## 16.4 Games local persistence

Add provider game, disable provider access and prove detail/tracker/sessions/journal/resources shell/edit/delete behavior remains valid.

## 16.5 Tracker inference

Prove one live-service example defaults to weekly and one campaign example defaults to story, with visible user correction before save.

## 16.6 Destination local persistence

Save provider destination, disable provider access and prove detail/saved/trip-board state remains usable.

## 16.7 Provider refresh merge safety

Where refresh exists, change user-owned state, return changed provider metadata, refresh, and prove provider metadata can update without overwriting user-owned state.

## 16.8 Rejected-write safety

Force supported persistence failure scenarios and prove UI/model/storage agree and multi-key operations roll back or enter the explicitly documented recovery state.

## 16.9 Backup round trip

Export/import at least one provider-origin record from each enabled rich domain and reopen them with provider access unavailable.

## Gate 16

Provider-origin content is first-class local OneSpace data, not temporary network-only UI.

---

# PHASE 17 — Content-aware cinematic environment

Extend the existing unified scene controller; do not create a parallel animation system.

## 17.1 Optional content-art layer

Add one scene-owned optional media layer that can receive selected Movie/Game/Destination environmental art.

## 17.2 Movies

Selected backdrop integrates with the Movies base scene without reducing text/control readability.

## 17.3 Games

Selected key/background art integrates with Games, including provider-added games.

## 17.4 Explore

Selected destination hero integrates with Explore for both curated and provider destinations.

## 17.5 Internal transition

Changing selected content uses a lighter content-media transition rather than replaying full page ENTRY.

## 17.6 Race safety

Rapid selection changes cannot allow an older media load to replace the current selected content.

## 17.7 Failure

Forced media failure returns to the domain base scene/fallback while detail/actions remain usable.

## 17.8 Route cleanup

Navigate across Movies -> Games -> Explore -> Work -> Home and prove no content-art/theme/CSS-variable leakage.

## 17.9 Motion modes

Reverify Full, Subtle, Off and reduced motion. Reduced motion is genuinely still.

## Gate 17

Selected rich content changes atmosphere without changing usability, accessibility, domain identity or lifecycle semantics.

---

# PHASE 18 — Provider, media, async and security hardening

## 18.1 Query/detail races

Prove stale success and stale failure cannot mutate newer search/detail state or reopen closed UI.

## 18.2 Server input validation

Reject unsupported/oversized/malformed provider requests before upstream calls.

## 18.3 No open proxy / SSRF

Prove browser input cannot request arbitrary external/internal URLs through provider or media routes.

## 18.4 Media proxy safety

Where a local media route is used, prove provider-host allowlisting, content-type checks, timeout, size bounds and secret isolation.

## 18.5 XSS

Mock hostile-looking provider strings and prove they render as harmless text.

## 18.6 Cache bounds

Prove query/details/media caches are bounded, have an expiry/invalidation policy, and clearing cache preserves user records.

## 18.7 Failure matrix

For all enabled provider domains, test:

- no credentials;
- auth/config failure;
- timeout;
- rate limit;
- provider failure;
- offline/network failure;
- malformed response;
- partial metadata;
- image failure.

## Gate 18

No tested provider/media failure corrupts, deletes, misrepresents or leaks valid local data or credentials.

---

# PHASE 19 — V2 final regression and acceptance

Phase 19 is the final V2 acceptance gate before the additive final-fidelity Phases 20–25.

Run the complete automated suite and browser acceptance after the final implementation change.

Verify together:

- all existing Phase 0–12 behavior;
- local and provider Movies/Series;
- local and provider Games;
- curated and provider Destinations;
- duplicate prevention;
- persistence/reload/offline;
- backup/import;
- tracker inference;
- provider error states;
- provider/live-vs-mock evidence;
- content-art scenes;
- route cleanup;
- Full/Subtle/Off/reduced motion;
- keyboard/focus/ARIA;
- responsive layouts;
- security;
- media proxy safety;
- console/network health.

Required responsive coverage preserves the established widths and adds wide-desktop checks at approximately 1920×1080 and 2048×1152 for the media-rich environment.

## Gate 19

No V2 item remains PENDING, IMPLEMENTED / NOT VERIFIED, or BLOCKED.

Only after Gate 19 passes may the additive final-fidelity Phases 20–25 begin. Gate 25 then authorizes Phase 26. Phase 13.3 remains blocked until Gate 26 passes.



# FINAL APPROVED COMPLETION EXTENSION — Phases 20–25

## 20–25 product acceptance authority

# 1. Final cinematic meaning — visibly alive, not technically animated

OneSpace must feel alive in normal use.

A top-level route does **not** pass cinematic acceptance merely because:

- an animation class exists;
- an SVG exists;
- a background image exists;
- CSS keyframes run;
- a screenshot proves that the page rendered;
- a test measures a transform or opacity change;
- motion exists but is too weak for a normal user to perceive;
- only the central hero moves while the rest of the page appears empty and static.

In **Full** scene mode, every top-level route must visibly read as a distinct, living, domain-specific environment.

The canonical lifecycle remains:

`ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET`

## 1.1 Full-mode opening

A genuine route entry should behave like a short cinematic opening.

Required behavior:

- approximately 2–5 seconds;
- multiple visible stages;
- not only one fade;
- not only one gradient transition;
- not only generic particles;
- not only barely perceptible parallax;
- page remains usable during the sequence;
- text, forms, buttons and focus targets remain stable;
- internal rerenders do not replay the full route opening.

Possible techniques include:

- layered art reveals;
- depth movement;
- controlled crop movement;
- focus/light changes;
- blueprint/route drawing;
- atmosphere;
- motes/particles;
- glow activation;
- domain-specific object motion.

## 1.2 Settle and ambient state

After the opening finishes, the scene must **not become dead**.

The ambient state may include restrained:

- depth drift;
- light movement;
- image breathing;
- atmospheric glow;
- slow crop movement;
- subtle route-specific motion.

Ambient motion must remain subordinate to content.

## 1.3 Failure condition

If a route technically contains animation but a normal user reasonably perceives it as:

- static;
- generic;
- almost unchanged;
- visually empty;
- indistinguishable from another route;

then the result is:

`IMPLEMENTED / NOT VERIFIED`

It must be improved before final completion.

---

# 2. Full-page, wide-screen and ultrawide environment

The cinematic environment is a **page-level environment**, not merely a hero-card decoration.

The central content column may remain comfortably bounded, but unused screen space must not become visually dead.

At wide desktop and ultrawide sizes:

- route-specific environmental art may extend beyond the content column;
- atmospheric light/depth may occupy otherwise unused side fields;
- decorative environment must remain pointer-transparent;
- readable content must not be stretched merely to fill width;
- scene layers must crop intentionally;
- important visual subjects must not be accidentally cut off;
- visual activity must remain restrained and purposeful.

Final visual acceptance must include:

- 390 px;
- 760 px;
- 1024 px;
- 1440 px;
- 1920 px;
- at least one representative ultrawide viewport, preferably approximately 3440×1440 or an equivalent browser width.

A wide layout fails if it looks like a small central island surrounded by large meaningless dark areas and therefore no longer feels cinematic.

---

# 3. Required route-specific visual identity

Each distinct route must have a recognizable visual subject.

Required directions:

- **Home** — observatory / personal command deck.
- **Work / Projects** — drafting room / development command centre.
- **Personal** — calm ritual / reflection space.
- **Explore** — world atlas / travel window.
- **Games** — game-world spotlight.
- **Movies & Series** — theater / streaming marquee.
- **Shortcuts** — navigable launch wall.
- **Productivity** — focused timer studio.
- **Notes** — quiet capture desk.
- **Settings** — control room.

Do not solve route identity by reusing one generic:

- starfield;
- gradient;
- particle field;
- abstract wallpaper;
- glow treatment;

with only different titles.

Projects continues to share the Work scene because it is a Work sub-view/route alias.

---

# 4. Modern icon quality — visible improvement required

The existing inline-SVG application-icon system remains the base.

Final acceptance requires one polished modern visual language across the product.

An existing icon may be retained only if it is already:

- clear;
- modern;
- optically aligned;
- semantically recognizable;
- consistently sized;
- consistent in stroke/fill philosophy;
- readable in supported themes/palettes.

Refine or replace icons that are:

- dated;
- generic;
- visually weak;
- ambiguous;
- misaligned;
- too small;
- too faint;
- inconsistent for the same shared action;
- dependent on emoji/Unicode substitutes.

Shared actions should use recognizable semantics for:

- add;
- edit;
- delete/remove;
- back;
- more;
- favorite;
- search;
- filter;
- sort;
- save;
- restore;
- open/play;
- close;
- retry;
- expand/collapse;
- navigation.

Brand marks, provider marks, favicons and site logos remain source identity and are not forcibly converted into the OneSpace application-icon style.

---

# 5. Live global discovery is a real delivered capability

OneSpace remains local-first for user-owned data, but local-first does not mean local-only.

Final discovery architecture:

`local user data + curated/local fallback content + provider-backed global discovery + normalized local persistence + graceful offline/degraded behavior`

Live configured global discovery applies to:

- Movies & Series;
- Games;
- Explore / Destinations.

Mock providers remain required for deterministic automated testing.

**Mock success is never evidence that live provider integration works.**

When credentials are configured:

- global search returns real provider results;
- details return normalized provider metadata;
- valid available provider imagery is used through the approved media boundary;
- provider results can be explicitly added/saved;
- saved records become first-class local OneSpace records;
- saved records reopen when the provider later becomes unavailable.

When credentials are not configured:

- local content still works;
- the UI must explicitly state that global provider search is unavailable;
- local content must never be presented as if it were a successful live global result.

---

# 6. Credentials and secret handling

Real provider credentials:

- remain server-side only;
- are stored only in ignored local secret configuration;
- are never committed;
- are never placed in browser JavaScript or HTML;
- are never returned in browser-visible errors;
- are never served by the static/local server.

The agent must **never invent or fabricate API keys**.

If live credentials are required but absent:

1. keep mock/contract testing separate;
2. record live E2E as `NOT CONFIGURED`;
3. continue other work that does not require the secret;
4. do not mark the live provider gate complete;
5. do not insert fake credentials;
6. only the user supplies real local credentials.

Final completion requires intended production providers to be live-verified unless the user explicitly approves a provider-specific exception.

---

# 7. Search and filter semantics must be explicit

A visible filter must never appear to affect global discovery while being silently ignored.

For every Movies/Series, Games and Explore search/filter control, assign exactly one behavior:

1. **Provider-side filter** — mapped into the live provider request.
2. **Canonical post-filter** — applied to normalized provider results with correct pagination semantics.
3. **Local-only filter** — affects only local/catalog results.
4. **Unsupported globally** — explicitly represented as unsupported for global discovery.

Where the chosen provider supports a selected criterion, that criterion must participate in global discovery.

Applicable examples include:

Movies & Series:

- movie vs series;
- genre;
- year/release range;
- other visible supported discovery criteria.

Games:

- genre;
- tag;
- platform;
- release criteria;
- live-service/campaign characteristics where exposed.

Explore:

- category/theme;
- destination/location criteria;
- season;
- budget/duration where supported;
- other provider-supported travel criteria.

Unsupported criteria must never be silently discarded.

---

# 8. Real media and fallback rules

For provider-origin content, use valid provider media when available and permitted.

Canonical roles:

Movies & Series:

- poster;
- backdrop.

Games:

- cover;
- background/key art.

Destinations:

- card image;
- hero image.

A deterministic fallback is used only when:

- the required media is genuinely absent;
- the request fails;
- the provider does not supply that media role;
- licensing/terms prevent using it.

Do not use a fallback merely because it is easier than rendering valid available provider art.

Do not scrape or ship unlicensed artwork.

Failure of one media role must not unnecessarily discard another valid media role.

---

# 9. Provider-added games become complete usable local records immediately

When a user explicitly adds a game from provider/global search, successful Add means that the game becomes a first-class local OneSpace record.

Before reporting success, resolve, normalize, validate and persist all provider data available under the approved contract, including where supplied:

- provider/source identity;
- title;
- description;
- cover image;
- background/key art;
- genres/tags;
- platforms;
- release metadata;
- tracker-inference signals;
- source/attribution metadata where required.

Immediately after successful Add:

- the game appears in the local library;
- its available real cover is visible;
- its description is visible;
- its detail view works;
- its background/key art can participate in the Games environment;
- a tracker exists;
- reload preserves the game and tracker;
- a second manual metadata-setup step is not required.

If description or media is genuinely unavailable, show the explicit fallback. Do not fabricate metadata.

---

# 10. Game tracker intelligence

Tracker inference must use actual game characteristics/signals, not fuzzy name similarity.

Canonical primary tracker types:

- `weekly / live-service`
- `story / campaign`
- `custom / unknown`

The inferred type must be visible and correctable before persistence.

The confirmed type becomes user-owned state and must not be silently changed by later provider refresh.

`Diablo Immortal` is the required reference example for weekly/live-service acceptance. It is **not** a title-name matching template.

---

# 11. Weekly / live-service tracker behavior

Games whose progression is primarily recurring, seasonal, MMO/live-service or reset-driven should default to a weekly tracker.

Where an approved game-specific recurring-data source or curated OneSpace template exists, populate applicable:

- daily/weekly activities;
- dungeons/raids;
- contracts/bounties;
- PvP activities;
- reset-driven objectives;
- seasonal/battle-pass objectives;
- other game-specific recurring tasks.

Rules:

- tasks must be specific to that game;
- Diablo-specific activities must not be copied into unrelated games;
- recurring template/source provenance must be recorded;
- reset cadence must be explicit;
- tracker state persists correctly.

---

# 12. Story / campaign tracker behavior

Games whose progression is mission/chapter/campaign based should default to a story/progression tracker.

Desired canonical hierarchy:

`Game -> Act / Chapter / Region / Level -> Mission / Quest -> ordered Objective / Step`

For games with approved complete progression integration, adding the game should automatically populate the supported progression structure without requiring the user to manually recreate the campaign.

Supported tracker behavior includes:

- canonical ordering;
- grouping by act/chapter/region/level where the game uses it;
- mission/quest completion;
- optional objective/step completion;
- progress calculation;
- reload persistence;
- backup/export/import persistence.

---

# 13. Complete progression requires an explicit legitimate source

A game may be described as having **complete mission tracking** only when OneSpace has a legitimate, maintainable, provenance-documented progression source.

Before implementing complete progression for a game or game family, explicitly record:

- progression source/provider name;
- access mode:
  - provider API;
  - curated bundled local data;
  - another approved maintained dataset;
- licensing/terms/attribution constraints;
- source version/update strategy;
- available hierarchy depth;
- whether acts/chapters/regions/levels are supplied;
- whether missions/quests are supplied;
- whether ordered objectives/steps are supplied;
- whether the source is `complete`, `partial`, or `unknown`;
- stable mission/objective identity strategy.

A general game catalog provider such as RAWG, IGDB, or another catalog must **not** be assumed to provide complete mission-level progression unless its actual delivered contract proves that data exists.

If the progression source is external, access it through a provider-neutral server-side adapter using the same secret/security principles as other provider integrations.

If the progression source is curated locally:

- record provenance beside the dataset;
- use deterministic stable IDs;
- record source/update version;
- do not silently invent missing material.

---

# 14. Complete campaign ingestion rules

For a game declared `complete progression`:

- include every mission/quest represented by the approved complete source;
- preserve canonical order;
- preserve act/chapter/region/level grouping where applicable;
- include ordered objectives/steps where the source supplies them;
- give missions/objectives stable identities;
- preserve user completion during source updates;
- persist progress across reload;
- include progression data in supported backup round trips.

**Never hallucinate:**

- mission names;
- chapter names;
- levels;
- quest order;
- objectives;
- completion steps.

For supported complete-progression games, progression population is part of successful tracker creation.

If the approved progression source is temporarily unavailable during Add:

- do not falsely claim a complete tracker was created;
- show an explicit enrichment/progression-unavailable state;
- preserve the game record and safe fallback behavior according to the implemented transaction contract.

---

# 15. Incomplete or unavailable progression

If no legitimate complete progression dataset exists:

- do not claim complete progression;
- show an explicit `Full progression data unavailable` / equivalent state;
- create a usable generic/custom story tracker;
- allow the user to add/customize progression;
- retain available image, description and metadata;
- allow later enrichment;
- preserve existing user progress when enrichment becomes available.

`partial` data must remain visibly distinguishable from `complete` data.

---

# 16. Progression refresh and ownership

Progression metadata and user-owned state have different ownership.

Source/provider metadata may update:

- grouping;
- display text;
- canonical order;
- source version;
- non-user metadata.

User-owned state must remain protected:

- completed state;
- notes;
- custom tasks;
- custom objectives;
- sessions;
- journal;
- confirmed tracker type;
- other supported user edits.

A refresh must never silently erase or reset user progress.

---

# 17. New mandatory final-completion gates

The historical plan is extended by:

- **Gate 20 — Full-Viewport Cinematic Fidelity**
- **Gate 21 — Global Icon Visual Quality**
- **Gate 22 — Live Provider Search and Real Media**
- **Gate 23 — Game Enrichment and Tracker Intelligence**
- **Gate 24 — Global Search / Filter Integration**
- **Gate 25 — Final User-Visible Product Acceptance**
- **Gate 26 — Whole-Project Final Integrity and Release Readiness**

Gate 25 does **not** authorize final documentation. It authorizes Phase 26.

Only after Gate 26 may Phase 13.3 finalize documentation.

Final execution tail:

`Gate 19 -> Phase 20 -> Gate 20 -> Phase 21 -> Gate 21 -> Phase 22 -> Gate 22 -> Phase 23 -> Gate 23 -> Phase 24 -> Gate 24 -> Phase 25 -> Gate 25 -> Phase 26 -> Gate 26 -> Phase 13.3 FINAL`



# PHASE 26 — Final Whole-Project Integrity and Release-Readiness Audit

Phase 26 is the last technical and product-quality audit before final documentation.

It introduces **no new feature family**. Its purpose is to inspect the fully assembled OneSpace repository and application as one finished system after every implementation and final-fidelity phase has completed.

Historical VERIFIED work remains valid evidence when it still matches the final code. Phase 26 does not blindly replay the entire project. It must, however, verify the integrated final state and re-verify every area whose later changes could invalidate earlier evidence.

## 26.1 Entry condition and final-candidate freeze

Phase 26 begins only after Gate 25 is VERIFIED.

Before any Phase 26 fix:

1. confirm working directory, Git root, branch and HEAD;
2. inspect `git status --short --untracked-files=all`;
3. inspect `git diff`;
4. record intentional uncommitted changes;
5. confirm the complete Phase 0–25 checklist/evidence state;
6. freeze unrelated feature expansion;
7. identify the normal user-data origin and a disposable test origin; destructive reset/import/failure tests run only on the disposable origin unless the user explicitly authorizes otherwise.

During Phase 26, code changes are allowed only to correct a discovered defect, regression, security issue, structural inconsistency, visual-quality failure, evidence mismatch or acceptance gap.

## 26.2 Git, repository and file hygiene

Audit the complete OneSpace tree.

Verify:

- no accidental file was created outside the OneSpace project directory;
- no unexplained temporary, debug, copy, backup or generated artifact remains;
- no obsolete duplicate module is unintentionally loaded;
- no unrelated broad change is mixed into the final diff;
- tracked and untracked files are intentional;
- cleanup is explicit and safe rather than achieved with destructive `reset`/`clean` commands.

## 26.3 `.gitignore`, secrets and credentials

Verify the final credential boundary end to end.

Requirements:

- real credentials exist only in approved local ignored storage;
- `config/secrets/` and approved local-secret patterns are ignored;
- committed example/template files contain placeholders only;
- `git ls-files` proves no real secret file is tracked;
- `git check-ignore` proves intended local secret files are ignored;
- Git path history is inspected for secret/config paths and any known prior exposure is evaluated without echoing raw secret values;
- if a real credential was ever committed or pushed, rotation/revocation and the chosen history-remediation decision are explicitly recorded before final PASS;
- browser HTML/JavaScript contains no provider credential;
- tests/fixtures contain no real credential;
- screenshots, evidence and logs contain no real credential;
- server/browser error messages do not leak credentials;
- representative `.json` and otherwise-servable `.js` secret paths are denied by the server;
- browser Network/Sources cannot retrieve secret files;
- server-side provider requests do not expose secret-bearing headers to the browser.

Never copy a real key/token/client secret into persistent evidence.

If a real credential is discovered in tracked history or published output, record the security failure and required rotation/remediation. Do not hide the finding.

## 26.4 Final project structure and load order

Audit the final root plus `shared/`, `home/`, `work/`, `personal/`, `explore/`, `games/`, `movies/`, `styles/`, `server/`, `config/`, `assets/`, `tests/` and `docs/`.

Verify:

- every loaded script exists;
- every loaded stylesheet exists;
- every repo-relative require/import resolves;
- every asset path resolves or follows its approved deterministic fallback;
- classic-script execution order remains valid;
- there is no duplicate mount or competing controller ownership;
- side-effect modules remain intentionally ordered;
- Home remains the only permitted cross-domain aggregator;
- domain boundaries remain intact.

## 26.5 Final route-by-route UI quality

Walk the fully assembled product through:

- Home;
- Work / Projects;
- Personal;
- Explore;
- Games;
- Movies & Series;
- Shortcuts;
- Productivity;
- Notes;
- Settings;
- Projects compatibility alias.

For every route inspect the final integrated state:

- page hierarchy;
- header/hero;
- typography;
- spacing;
- cards/grids;
- forms/controls;
- dialogs/sheets;
- loading;
- empty;
- error;
- disabled;
- success;
- tooltip;
- focus;
- long-text handling;
- image/media/fallback behavior;
- visual consistency with the rest of OneSpace.

A page does not pass merely because it renders without an exception. It must be usable, coherent and visually finished.

## 26.6 Final application-icon audit

Review all visible application-control icons across every route and shared UI.

Verify:

- one coherent modern SVG language;
- the same shared action uses the same recognizable glyph where context permits;
- no accidental emoji or unrelated Unicode control glyph remains;
- no broken/missing icon;
- optical size, baseline and alignment are consistent;
- light/dark/palette contrast is correct;
- icon-only controls retain accessible names, focus and state;
- brand/provider/content marks remain legitimate source-identity exceptions.

Do not replace already-good icons merely to create churn.

## 26.7 Final cinematic audit

Review every distinct OneSpace scene in its final assembled state.

Verify:

- domain-specific visual identity;
- Full-mode ENTRY / WAKE-UP;
- SETTLE;
- AMBIENT / ALIVE;
- EXIT / RESET;
- visible 2–5 second staged opening where required;
- final page-level composition, not hero-only animation;
- meaningful desktop side fields;
- wide/ultrawide composition;
- selected Movie/Game/Destination environmental art;
- internal content changes use lightweight transitions rather than replaying full ENTRY;
- route cleanup prevents art/theme/CSS-variable leakage;
- Full / Subtle / Off are visibly distinct;
- reduced motion is genuinely still;
- touch/coarse-pointer behavior is safe;
- decorative layers never intercept controls;
- text/control contrast remains readable.

A route that is technically animated but still reasonably appears static, generic or visually empty is not VERIFIED.

## 26.8 Themes and Settings integration

Verify the final interaction of:

- Auto/light/dark;
- every delivered palette;
- accents;
- density;
- scene intensity;
- motion preference;
- start page;
- Games themes;
- Movies themes;
- provider status;
- reset preferences;
- reset all;
- export/import entry points.

Settings must survive reload correctly and must not unexpectedly erase unrelated user state or palette/theme choices.

## 26.9 Core-domain integrated regression

Account for final integrated behavior in:

### Home
Aggregation, Quick Access, navigation and domain summaries.

### Work / Projects
Projects, Board, stories, defects, tasks, filters, reminders, close/reopen, Backlog, History and persistence.

### Personal
Goals/routines/habits, optional target behavior, add/edit/delete/cancel and persistence.

### Productivity
Tasks, timer, countdown/reminder behavior and persistence.

### Notes
Create/edit/delete, pin/unpin, search and persistence.

### Shortcuts
Built-ins, hide/restore, custom add/edit/delete, ordering, categories including Gaming, duplicates and persistence.

Use still-valid Phase 12 evidence where applicable. Re-run any path affected by later Phase 14–25 changes.

## 26.10 Movies & Series final integration

Verify together:

- local discovery;
- live provider discovery;
- movie/series distinction;
- search/typeahead;
- provider-supported filter semantics;
- pagination;
- details;
- real poster/backdrop where available;
- explicit Add/Track;
- watchlist/status;
- watched state;
- remove/untrack;
- reload;
- provider-disabled offline reopen;
- provenance/attribution;
- deterministic fallback;
- selected-content cinematic integration.

## 26.11 Games final integration

Verify together:

- local discovery;
- live provider discovery;
- provider-supported filters;
- cover/background;
- description and provider metadata;
- explicit Add;
- tracker inference;
- user correction before persistence;
- Diablo Immortal weekly/live-service reference behavior;
- at least one additional live-service example proving generality;
- campaign/story flow;
- approved complete-progression example;
- partial/unavailable progression behavior;
- resources;
- sessions;
- journal;
- user progress preservation through enrichment/refresh;
- reload;
- provider-disabled offline reopen;
- selected-content cinematic integration.

No mission, chapter, level, quest, objective or progression data may be invented.

## 26.12 Explore final integration

Verify together:

- all curated destinations;
- provider-backed global discovery;
- preferences;
- combined filters;
- ranking/recommendation explanations;
- Surprise Me;
- details;
- licensed/valid imagery and fallback;
- Save/remove;
- trip-board notes;
- priority;
- status;
- ordering;
- reload;
- provider-disabled saved-destination behavior;
- provenance/attribution;
- selected-content cinematic integration.

## 26.13 Responsive final matrix

Verify every top-level route at:

- 390 px;
- 760 px;
- 1024 px;
- 1440 px;
- 1920 px;
- representative ultrawide, preferably approximately 3440×1440.

For each applicable route/width verify:

- no horizontal document overflow;
- no unintended overlap;
- no clipped control;
- no broken visible media;
- usable dialogs/sheets;
- intentional environmental crop;
- readable content;
- coherent density;
- usable touch targets where applicable.

## 26.14 Accessibility and input audit

Verify:

- keyboard-only navigation;
- logical Tab order;
- Enter/Space;
- Escape;
- visible focus;
- modal/sheet focus trap;
- focus return;
- accessible names;
- `aria-live`;
- `aria-current`;
- `aria-expanded`;
- `aria-pressed`;
- checkbox/radio semantics;
- touch targets;
- no critical hover-only behavior;
- reduced-motion compliance.

## 26.15 Storage, backup, migration and reset integrity

Verify the final data contract:

- current v4 export;
- complete v2 import;
- complete v3 import;
- complete v4 import;
- malformed/invalid import rejection;
- rejected-write/rollback safety;
- unrelated-key preservation where required;
- provider-origin Movies;
- provider-origin Games;
- provider-origin Destinations;
- game tracker/progression state;
- Work state;
- Personal state;
- Notes;
- Explore/trip board;
- reset preferences;
- reset all.

No final feature may silently fall outside supported persistence/backup behavior.

## 26.16 Live-provider to offline transition

For every intended production provider domain, using the real configured production path required by Gate 22 unless the user explicitly approved a provider-specific exception:

1. start with live provider access;
2. perform representative real search;
3. Add/Save a representative record;
4. reload while online;
5. disable/fail provider access;
6. reopen the saved record.

Verify:

- normalized local record remains meaningful;
- user-owned state remains intact;
- local/curated content still works;
- global provider state is explicitly unavailable/degraded;
- local results are never mislabeled as live provider results;
- media follows the approved persisted/cached/local/fallback contract.

`NOT CONFIGURED` or mock-only evidence cannot satisfy Gate 26 for an intended production provider. If credentials are missing, record `NOT CONFIGURED`, continue unrelated checks, and keep Gate 26 blocked unless the user explicitly approved a provider-specific exception.

## 26.17 Console, network and runtime health

During final browser passes verify:

- no uncaught application exception;
- no accidental application 404;
- no secret leakage;
- no duplicate mount/listener symptoms;
- no uncontrolled provider request storm;
- stale provider responses cannot overwrite newer UI;
- late details cannot reopen closed/stale UI;
- no cross-route theme/art leakage;
- observed network behavior matches the documented server/provider boundary;
- no runaway timers/animation loops, uncontrolled DOM growth, duplicate listeners or obviously unbounded runtime work appears during representative navigation;
- no unnecessary full-resolution provider media is repeatedly fetched for list/card roles;
- disposable test servers/processes opened by the audit are cleanly stopped when their evidence is complete.

## 26.18 Final complete automated regression

After the **last** Phase 20–26 code change:

- run `node --test tests/`;
- run every repository-required specialized structural/browser/provider/storage/tracker suite not included by that command;
- record the actual final pass/fail counts;
- resolve every unexpected failure before Gate 26.

Historical test counts are context only. They are not final proof.

## 26.19 Evidence integrity

Audit `docs/implementation-evidence/`, audit JSONL and final acceptance records.

Verify:

- every required terminal checklist state has persistent evidence;
- evidence matches current code;
- mock and live provider evidence remain distinct;
- screenshots/measurements match claimed states and widths;
- no credential appears in evidence;
- no stale evidence is used after a relevant implementation change;
- asset/provider provenance, licensing/attribution manifests and source records still match the assets/data actually shipped or displayed;
- every approved exception is explicit;
- no unexplained PENDING, IMPLEMENTED / NOT VERIFIED or BLOCKED state remains.

## 26.20 Five-authority-document consistency

Compare in full:

1. `docs/agent-instructions.md`;
2. `docs/IMPLEMENTATION-STEPS.md`;
3. `docs/REVISED-IMPLEMENTATION-PLAN.md`;
4. `VERIFICATION.md`;
5. `README.md`.

They must agree on:

- delivered scope;
- execution order;
- provider architecture and live-vs-mock semantics;
- secrets policy;
- cinematic contract;
- icon contract;
- Games tracker/progression contract;
- filter semantics;
- backup compatibility;
- final verification truth.

Do not perform final prose reconciliation here. Phase 13.3 remains responsible for final documentation.

## 26.21 Final Git/diff review

At the end of Phase 26:

- inspect `git status --short --untracked-files=all`;
- inspect `git diff`;
- confirm every remaining change is intentional;
- confirm no secret or temp artifact is included;
- confirm no unrelated file outside OneSpace was modified;
- persist final repository-state evidence.

## Gate 26 — Whole-Project Final Integrity

Gate 26 passes only when every Phase 26 requirement is VERIFIED and the fully assembled OneSpace repository/application has **no unresolved functional, visual, UI, iconographic, cinematic, responsive, accessibility, persistence, backup, provider, media, security, secrets, Git, repository-structure, runtime, console/network, testing, evidence-integrity or authority-consistency issue**. Every intended production provider must also be `LIVE VERIFIED`, unless the user explicitly approved a provider-specific terminal exception.

If Phase 26 finds a defect:

`identify -> minimally fix -> affected automated regression -> affected browser/visual verification -> persistent evidence -> continue Phase 26`

Do not formally reopen a historical phase merely because Phase 26 found a regression. The fix is recorded in Phase 26 while retaining the original phase evidence.

Only after Gate 26 passes may Phase 13.3 begin.

---

# PHASE 13 — Project documentation

When Phase 13 was introduced, the repository already had `README.md`, `VERIFICATION.md`, `REVISED-IMPLEMENTATION-PLAN.md` and the standing plan, but it lacked the sequenced execution checklist. Phase 13.2 created `docs/IMPLEMENTATION-STEPS.md`; that historical reason for the split is retained here, while the current repository now uses all five documents as one coordinated authority set.

> **Sequencing — this phase runs in two parts, not at the end.**
> **13.1 and 13.2 run FIRST, before Phase 0.3**, because they are the working documents every later phase is executed against — a checklist written after the work is finished is a report, not a plan.
> **13.3 runs LAST, after Gate 26**, because it records what was actually delivered across the original plan, V2 scope, approved final-fidelity Phases 20–25 and the Phase 26 whole-project integrity audit.
> It is numbered 13 so the documentation deliverables stay together and readable; the numbering is not the execution order.

## 13.1 Rewrite `agent-instructions.md` — **[DONE]**

Completed: this file is that rewrite. It is now the single standing plan, superseding its own previous contents. What was applied:

1. Replace the stale "Current Findings" section with the verified baseline and the `[DONE]`/`[OPEN]`/`[NEW]`/`[FIX]` status model.
2. Apply the five corrections listed at the top of this document (the 17-vs-16 movie count, the fourth series record, the missing C.4 root cause, the file count, and the completion status of Part B).
3. Carry the Product Decisions, Further Considerations, Scope Boundaries and defect-acceptance table verbatim.
4. Record the scope amendment: provider-backed search replaces the zero-network-requests guarantee for the server, while the browser bundle keeps it.

## 13.2 Create `docs/IMPLEMENTATION-STEPS.md` — runs before Phase 0.3 [NEW]

A sequenced execution checklist — the working document, distinct from the plan's rationale:

- One checkbox per actionable step, in execution order, phase by phase.
- Each step names the file(s) it touches and its acceptance check.
- Each phase ends with its gate (tests green, no 404s, screenshots captured) as an explicit checkbox.
- A "Do not break" header block listing the invariants from 1.9 — storage keys, global names, load order, entry URL, backup compatibility.
- A status column an implementer updates as work lands, so progress is visible without reading a diff.

## 13.3 Keep the complete authority set current — runs after Gate 26

- `README.md` — folder structure, data model, provider setup and offline behaviour, server command, test commands, backup compatibility, cinematic interaction rules, accessibility behaviour, scope limits and final verified delivery status.
- `VERIFICATION.md` — a fresh acceptance record after the final code change, including the actual final test/browser/provider/security results.
- `docs/REVISED-IMPLEMENTATION-PLAN.md` — reconcile architecture language with what was actually delivered.
- `docs/agent-instructions.md` — reconcile standing-scope/status wording with the final delivered product without rewriting historical evidence.
- `docs/IMPLEMENTATION-STEPS.md` — ensure detailed statuses, Progress table, Gate 26 and Gate 13.3 exactly match the final evidence set.

Phase 13.3 is documentation reconciliation only. It must not silently weaken a failed requirement into a success criterion.

## Additional baseline correction confirmed by the user — September 21, 2026

Preserve the existing version 4 export format and acceptance of complete version 2 and version 3 imports. Phase 0.12 captures a genuine version 4 backup. The storage keys and existing fixtures stay unchanged. This corrects the standing plan's stale version 3 claim; it does not change application behavior.
