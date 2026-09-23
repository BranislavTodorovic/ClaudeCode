# OneSpace — Final Verification and Acceptance Runbook V2

## Authority

This file records final acceptance. It does not replace requirement-level evidence under `docs/implementation-evidence/` and does not override `docs/IMPLEMENTATION-STEPS.md`.

Do not pre-mark a result as passing.

A green automated suite alone is not final acceptance.

---

# 1. Run metadata

Record:

- date/time;
- Git commit and intentional working-tree changes;
- Node version;
- browser/version;
- OS;
- application origin;
- disposable test origin;
- configured live providers;
- intentionally unconfigured providers.

---

# 2. Final automated suite

Run:

```sh
node --test tests/
```

Record the **current** pass/fail count after the final code change.

Do not reuse a historical count.

Result: `PASS / FAIL`

Evidence: `<path>`

---

# 3. Structure and load order

Verify:

- all script/style references resolve;
- repo-relative requires resolve;
- local assets resolve;
- classic-script order remains correct;
- required globals exist;
- side-effect module ownership/load order remains correct;
- no duplicate Work/Explore/provider mount;
- no config/secrets reference from browser sources.

Result: `PASS / FAIL`

---

# 4. Legacy data and migration

Verify:

- schema validation;
- v2 complete import;
- v3 complete import;
- v4 complete import;
- current v4 export;
- malformed/partial backup rejection;
- unrelated localStorage preservation;
- rollback behavior;
- reset preferences;
- reset all data.

Result: `PASS / FAIL`

---

# 5. Original-domain regression

Reverify all applicable existing contracts for:

- Home;
- Work / Projects / Backlog / History;
- Personal;
- Shortcuts;
- Productivity;
- Notes;
- Settings;
- Movies & Series local behavior;
- Games local behavior;
- Explore curated behavior.

No V2 feature may regress an earlier accepted domain.

Result: `PASS / FAIL`

---

# 6. Secrets and security

Verify:

```sh
git ls-files config/secrets
git check-ignore -v config/secrets/<real-local-secret-file>
```

Verify server denial for representative `.json` and otherwise-servable `.js` secret paths.

Inspect browser source/network.

No API key, client secret, token, Authorization value or raw secret file may be browser-visible.

Result: `PASS / FAIL`

---

# 7. Mock provider matrix

For Movies, Games and Destinations test deterministic:

- success;
- empty;
- page 2/load-more;
- timeout;
- rate-limit;
- auth/config failure;
- offline/network;
- generic provider failure;
- malformed response;
- partial metadata;
- cancellation.

Result: `PASS / FAIL`

---

# 8. Live configured provider smoke

This is separate from mock verification.

For each configured provider record one status:

- `LIVE VERIFIED`
- `NOT CONFIGURED`
- `FAILED`

Movies/Series smoke:
- search;
- movie + series;
- details;
- poster/backdrop;
- normalized metadata;
- explicit Add.

Games smoke:
- search;
- details;
- cover/background where available;
- genres/platforms;
- tracker signals;
- explicit Add.

Destinations smoke:
- search beyond curated 12;
- details;
- image;
- normalized location/context;
- attribution;
- explicit Save.

Mock success must never be reported as live verification.

---

# 9. Local/provider result separation

For Movies, Games and Explore verify:

- local results can appear immediately;
- provider results are separately identifiable;
- provider loading/errors do not falsely label local records as global results;
- offline/unconfigured provider state is explicit.

Result: `PASS / FAIL`

---

# 10. Duplicate prevention

For each provider domain:

1. add one provider item;
2. add the same provider identity again.

Verify:

- one local user record;
- no duplicate tracker/watch/saved state;
- UI indicates existing item appropriately.

Result: `PASS / FAIL`

---

# 11. Ambiguous local/provider collision

Use an intentionally ambiguous same/similar-name case.

Verify no fuzzy title/name-only silent merge occurs.

Where deterministic mapping exists, verify the documented link/merge behavior.

Result: `PASS / FAIL`

---

# 12. Provider-origin persistence offline

Add one provider-origin:

- Movie/Series;
- Game;
- Destination.

Disable provider access and reload.

Verify each remains meaningful and normal local user state still works.

Result: `PASS / FAIL`

---

# 13. Provider refresh ownership

Where refresh exists:

1. add item;
2. change user-owned state;
3. return changed provider metadata;
4. refresh.

Verify provider metadata can update without overwriting user-owned status, notes, progress, tracker choice, tasks, sessions, journal, saved/trip state.

Result: `PASS / FAIL`

---

# 14. Rejected-write/atomicity test

Force supported storage failure.

Verify:

- no false success UI;
- memory/model/storage agree;
- multi-key Add/Save does not leave impossible partial state;
- rollback/recovery behavior matches contract.

Result: `PASS / FAIL`

---

# 15. Provider-origin backup round trip

On disposable origin:

1. add one provider title;
2. add one provider game;
3. save one provider destination;
4. modify user-owned state;
5. export v4;
6. clear disposable OneSpace data;
7. import backup;
8. disable provider access;
9. reopen all three.

Verify identity, user state and compatible provider metadata survive.

Result: `PASS / FAIL`

---

# 16. Server provider-input validation

Test malformed/unsupported:

- provider/kind;
- provider ID;
- page/page-size;
- cursor;
- oversized query;
- unsupported method/route.

Verify rejection happens safely before arbitrary upstream forwarding.

Result: `PASS / FAIL`

---

# 17. No-open-proxy / SSRF test

Attempt to make provider/media endpoints fetch:

- arbitrary external URL;
- unsupported provider host;
- localhost/private-network reference where technically applicable.

The server must reject it.

Result: `PASS / FAIL`

---

# 18. Provider media safety

Where a local media route is used, verify:

- known-provider references only;
- host allowlist;
- image content type;
- timeout;
- response-size bound;
- no credential leakage;
- non-image content rejection.

Result: `PASS / FAIL`

---

# 19. XSS/untrusted-provider-text

Mock provider returns HTML/script-like text in title/description/tags/attribution.

Verify it renders as harmless text and executes nothing.

Verify provider-origin external links pass safe protocol rules.

Result: `PASS / FAIL`

---

# 20. Search request race

Create Query A -> B -> C with intentionally reordered response timing.

Verify final UI belongs to C.

Older success/error cannot:

- replace current results;
- clear current results;
- announce stale ARIA output.

Result: `PASS / FAIL`

---

# 21. Detail request race

Open A, then close/navigate/select B before A details finish.

A's late response must not:

- reopen UI;
- replace B;
- mutate another route;
- replace current environmental art.

Result: `PASS / FAIL`

---

# 22. Movies & Series complete flow

Verify:

- local typeahead;
- provider typeahead;
- movie/series parity;
- pagination;
- explicit Add;
- status choice;
- library;
- detail;
- poster/backdrop;
- watchlist;
- untrack;
- custom-delete semantics;
- reload;
- provider unavailable;
- offline;
- image failure;
- keyboard behavior.

Result: `PASS / FAIL`

---

# 23. Games complete flow

Verify:

- local/provider search;
- detail;
- explicit Add;
- weekly inference;
- story inference;
- user correction;
- objective/task initialization;
- sessions;
- journal;
- resources;
- spotlight eligibility;
- edit/delete;
- reload/offline;
- image failure;
- keyboard behavior.

Result: `PASS / FAIL`

---

# 24. Explore curated flow

Verify all 12 curated destinations and:

- preferences;
- deterministic ranking;
- recommendation explanations;
- Surprise Me;
- detail;
- card/hero photography;
- alt text;
- fallback;
- Save/remove;
- trip board;
- Explore-only shortcuts;
- More To Explore is final.

Result: `PASS / FAIL`

---

# 25. Explore global destination flow

Search a destination not in the curated 12.

Verify:

- provider search;
- pagination/progressive result;
- detail;
- image;
- description/context;
- source/attribution;
- Save/shortlist;
- trip board;
- reload;
- offline reopen;
- fallback;
- curated Explore remains intact.

Result: `PASS / FAIL`

---

# 26. Content-aware Movies environment

Select a title with backdrop.

Verify:

- correct title owns art;
- Movies base identity remains;
- readable contrast;
- controls unaffected;
- artwork ignores pointer events;
- no major layout shift.

Rapidly change selection; latest item must own final art.

Result: `PASS / FAIL`

---

# 27. Content-aware Games environment

Repeat for curated and provider-origin game artwork.

Result: `PASS / FAIL`

---

# 28. Content-aware Explore environment

Repeat for curated and provider-origin destination hero art.

Result: `PASS / FAIL`

---

# 29. Environmental-art failure

Force failure separately for:

- Movie backdrop;
- Game background;
- Destination hero.

Verify:

- base scene remains;
- detail/actions remain;
- only failed media role falls back;
- no broken-image UI.

Result: `PASS / FAIL`

---

# 30. Cross-domain scene cleanup

Navigate:

Movies -> Games -> Explore -> Work -> Home

Verify no stale:

- art;
- theme class;
- CSS variable;
- loading flag;
- selected-content environment

leaks across domains.

Result: `PASS / FAIL`

---

# 31. Cinematic lifecycle

Reverify route lifecycle:

`ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET`

Internal content selection must not replay full page ENTRY unnecessarily.

Result: `PASS / FAIL`

---

# 32. Motion preferences

Verify:

- Full;
- Subtle;
- Off;
- `prefers-reduced-motion`.

Reduced motion is genuinely still: no optional parallax, ambient transform drift or stagger.

Result: `PASS / FAIL`

---

# 33. Keyboard and accessibility

Verify applicable:

- visible focus;
- logical tab order;
- Enter/Space;
- Escape;
- modal focus trap;
- inert background;
- focus return;
- typeahead arrows/Escape;
- explicit Add/Save;
- meaningful image alt;
- decorative art hidden appropriately;
- `aria-live` for useful async/save/error feedback;
- no stale-request announcement;
- mobile/coarse-pointer usability.


## Global modern icon system

Across Home, Work/Projects, Personal, Explore, Games, Movies & Series, Shortcuts, Productivity, Notes and Settings verify:

- one coherent application-control icon language;
- shared actions use consistent recognizable glyphs where context permits;
- no broken/missing icon;
- no accidental emoji/Unicode substitute control icon;
- no obvious clipping, baseline drift, disproportionate sizing or visual mismatch;
- icons remain crisp/readable in light/dark and supported palettes;
- icon-only controls retain accessible names, visible focus and adequate touch targets;
- decorative icons do not create redundant assistive-technology output;
- legitimate favicons/provider/source/brand marks remain intentionally distinct from application UI icons.

Inspect representative navigation, headings, cards, forms/dialogs, filters/search and shared action controls at the required responsive widths.

Result: `PASS / FAIL`

---

# 34. Responsive matrix

Preserve existing acceptance widths:

- 1440;
- 1024;
- 760;
- 390.

Add media-rich wide-desktop checks:

- approximately 1920×1080;
- approximately 2048×1152.

Verify:

- no horizontal overflow;
- no clipped controls;
- modal/sheet placement;
- search dropdown;
- readable art treatment;
- sensible media crop;
- touch targets.

Result: `PASS / FAIL`

---

# 35. Performance/network sanity

Inspect provider/search behavior:

- no request for empty input;
- debounce works;
- obsolete requests cancel/are ignored;
- duplicate in-flight requests are avoided where defined;
- valid short-TTL cache prevents unnecessary repeat calls;
- pagination is deliberate;
- full hero media is not fetched for every card;
- every cache is bounded.

Result: `PASS / FAIL`

---

# 36. Console/network health

Across final flows verify:

- no uncaught exception;
- no unintended 404;
- no duplicate mount/listener symptoms;
- no secret-bearing logs/responses;
- no unexpected provider/media request leakage.

Result: `PASS / FAIL`

---

# 37. Offline final pass

With providers unavailable verify:

- application opens;
- Work/Personal/Productivity/Notes/Shortcuts/Settings work;
- local/saved Movies work;
- local/saved Games work;
- curated Explore works;
- saved provider destinations/trip board work;
- global search shows explicit unavailable/degraded state;
- local content is not mislabeled as live global results.

Result: `PASS / FAIL`

---


# FINAL FIDELITY ACCEPTANCE EXTENSION — PHASES 20–25

Gate mapping:

- Gate 20 — full-viewport cinematic fidelity
- Gate 21 — global icon visual quality
- Gate 22 — live provider search and real media
- Gate 23 — game enrichment and tracker intelligence
- Gate 24 — global search/filter integration
- Gate 25 — final user-visible product acceptance

Phase 13.3 and final PASS remain blocked until Gate 25 passes.


# A. Full cinematic acceptance

For every top-level experience:

- Home
- Work/Projects
- Personal
- Explore
- Games
- Movies & Series
- Shortcuts
- Productivity
- Notes
- Settings

Verify in Full mode:

- visible staged entry;
- approximately 2–5 seconds;
- usable during entry;
- smooth settle;
- persistent ambient alive state;
- distinct route visual subject;
- not merely fade/gradient;
- not merely central-hero animation;
- full-page environment remains visible at wide sizes.

Record per route:

`PASS / IMPLEMENTED-NOT-VERIFIED / FAIL`

If a normal user could reasonably describe the page as static or generic, it is not PASS.

---

# B. Responsive and ultrawide matrix

Verify every route at:

- 390
- 760
- 1024
- 1440
- 1920
- representative ultrawide, preferably ~3440×1440

Check:

- no overflow;
- no broken media;
- no unintended clipping;
- intentional scene crop;
- readable content;
- usable controls;
- no dead side-space cinematic failure;
- no decorative pointer interception.

---

# C. Scene intensity matrix

Verify:

- Full — visibly cinematic;
- Subtle — observably reduced;
- Off — still;
- prefers-reduced-motion — genuinely still;
- touch/coarse pointer — no hover/parallax dependency.

Record actual browser evidence.

---

# D. Global icon quality

Across all routes/themes/widths verify:

- modern visual language;
- consistent geometry;
- optical size;
- alignment;
- stroke/fill philosophy;
- contrast;
- shared action semantics;
- hover/focus/pressed states;
- touch targets;
- accessible names;
- no emoji/Unicode substitute controls.

Do not PASS solely because SVG elements exist.

---

# E. Secret/configuration verification

Verify:

```sh
git ls-files config/secrets
git check-ignore -v config/secrets/<representative-real-secret-file>
```

Verify:

- secret JSON path denied;
- representative `.js` secret path denied;
- browser source does not reference secret files;
- no API key/client secret/token appears in browser network/errors/logs.

The agent must not fabricate a credential.

Record each live provider:

`LIVE VERIFIED / NOT CONFIGURED / FAILED`

---

# F. Live Movies & Series E2E

Record provider and exact test titles.

Verify:

- live movie search;
- live series search;
- provenance;
- details;
- description;
- poster where available;
- backdrop where available;
- normalized metadata;
- pagination;
- cancellation/latest-request ownership;
- explicit Add;
- reload;
- provider-disabled offline reopen;
- untrack/remove.

Mock success is not live proof.

---

# G. Live Games E2E

Record provider and exact test games.

Verify:

- live search;
- provenance;
- details;
- description;
- cover where available;
- background/key art where available;
- genres/tags;
- platforms;
- release metadata;
- tracker signals;
- pagination;
- cancellation/latest-request ownership;
- explicit Add;
- reload;
- provider-disabled offline reopen.

---

# H. Provider-added game immediate enrichment

Immediately after Add verify:

- local card exists;
- available real cover is visible;
- description is visible;
- detail opens;
- background/key art is available to the Games environment where supplied;
- tracker exists;
- no second manual metadata-setup step is required;
- reload preserves the record.

If provider metadata/media is absent, verify explicit fallback rather than fabricated content.

---

# I. Tracker inference

Test:

1. Diablo Immortal
2. at least one additional live-service game
3. at least one campaign game
4. at least one insufficient-signal/custom case if supported

Verify:

- visible inferred type;
- user correction before save;
- confirmed type persistence;
- provider refresh does not silently change confirmed type.

---

# J. Weekly/live-service tracker

For Diablo Immortal and another live-service game verify:

- weekly inferred correctly;
- weekly tracker created;
- game-specific recurring data used when approved source/template exists;
- reset cadence works;
- state persists;
- unrelated Diablo tasks are not reused for the other game.

---

# K. Progression-source proof

Before accepting any game as `complete progression`, record:

- exact source/provider;
- access mode;
- licensing/terms/attribution;
- source version/update marker;
- declared completeness;
- hierarchy depth;
- mission/quest coverage;
- objective/step coverage;
- stable identity strategy.

Do not accept a generic game catalog provider as proof of full mission data unless its delivered contract actually provides it.

---

# L. Complete campaign progression

Use at least one campaign game with an approved complete progression source.

Verify:

`Act/Chapter/Region/Level -> Mission/Quest -> ordered Objective/Step`

Check:

- all missions represented by approved source are present;
- canonical order;
- grouping;
- objectives/steps where source provides them;
- stable IDs;
- completion;
- progress calculation;
- reload;
- backup/export/import;
- provenance;
- source version;
- refresh does not erase completion.

Never accept hallucinated/generated mission data.

---

# M. Incomplete progression behavior

Use at least one campaign game without an approved complete source.

Verify:

- no invented missions;
- no false `complete` claim;
- explicit unavailable/incomplete state;
- usable generic/custom story tracker;
- available image/description retained;
- later enrichment supported;
- prior user progress preserved.

---

# N. Global search/filter semantics

For every visible criterion in Movies/Series, Games and Explore record:

- provider-side;
- canonical post-filter;
- local-only;
- unsupported globally.

Test representative combinations.

No selected visible criterion may be silently ignored while the UI implies that it affected global results.

---

# O. Real media and fallback

Verify exact roles:

Movies:

- poster
- backdrop

Games:

- cover
- background

Explore:

- card
- hero

For each:

- valid provider media renders when available;
- forced failure falls back;
- details/actions remain usable;
- one role failure does not incorrectly discard another valid role;
- media route does not permit arbitrary URL proxying.

---

# P. Final Phase 20–25 reconciliation

Before Phase 13.3:

- [ ] Gate 20 PASS
- [ ] Gate 21 PASS
- [ ] Gate 22 PASS
- [ ] Gate 23 PASS
- [ ] Gate 24 PASS
- [ ] Gate 25 PASS

No unresolved Phase 20–25 item may remain as:

- PENDING
- IMPLEMENTED / NOT VERIFIED
- BLOCKED

unless the user explicitly approved a terminal exception.

---

# Q. Final documentation sequence

Only after Gate 25:

1. reconcile README with actual delivered behavior;
2. reconcile `docs/agent-instructions.md`;
3. reconcile `docs/REVISED-IMPLEMENTATION-PLAN.md`;
4. update VERIFICATION with current final results;
5. run Phase 13.3;
6. record final status.

`FINAL STATUS: PASS` is prohibited before Gate 25 and Phase 13.3 complete.


# 38. Checklist reconciliation

Inspect `docs/IMPLEMENTATION-STEPS.md`.

Final delivery requires no unresolved item in:

- PENDING;
- IMPLEMENTED / NOT VERIFIED;
- BLOCKED.

Only explicitly permitted terminal states are allowed.

Gate 25 must pass before final documentation completion.

---

# 39. Documentation reconciliation

After implementation/acceptance only:

- `README.md` describes actual delivered behavior;
- `docs/agent-instructions.md` matches approved scope;
- `docs/REVISED-IMPLEMENTATION-PLAN.md` matches actual architecture;
- this file contains current final results rather than historical assumptions.

---

# FINAL STATUS

`FINAL ONESPACE STATUS: PASS / FAIL`

If FAIL, list exact unresolved checklist IDs and evidence gaps.

A final PASS requires original-plan, V2, Phases 20–25 acceptance, Gate 25, and Phase 13.3 completion.
