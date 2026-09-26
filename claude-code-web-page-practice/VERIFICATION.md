**# OneSpace — Final Verification and Acceptance Runbook V2**

**## Authority**

This file records final acceptance within the coordinated redesign authority set: `docs/agent-instructions.md`, `docs/IMPLEMENTATION-STEPS.md`, `docs/REVISED-IMPLEMENTATION-PLAN.md`, `docs/REDESIGN-INTEGRATION-GATE.md`, `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md`, `docs/ui-reference/MANIFEST.md`, the eight actual reference images, `VERIFICATION.md`, and `README.md`.

It does not replace requirement-level evidence under \`docs/implementation-evidence/\` and does not override the execution/status authority in \`docs/IMPLEMENTATION-STEPS.md\`.

Do not pre-mark a result as passing.

A green automated suite alone is not final acceptance.

\---


**## Redesign integration verification amendment**

- Gate 12 must pass before R0 starts.
- R0 must pass before post-Gate-12 redesign implementation.
- R0 is transition/classification only; it does not implement Home/world/submodule UI.
- Redesign execution is strictly `R1 shared foundation -> R2 Home -> R3 main worlds -> R4 Work->Projects pilot -> R5 submodules -> R6 cross-world integration/regression`. Phase 14 may not start before Gate R6.
- Credential-free local/bundled catalogues are the default production path. Optional providers are tested only when explicitly approved/configured and are not required for final PASS.
- The historical “SVG/CSS only / no new binary assets” restriction is superseded: properly licensed repository-local scene/media assets are allowed and must have provenance plus fallbacks.
- Before a world can pass visual/cinematic acceptance, the matching reference image must have been **opened and inspected**, with image-specific observations recorded. Filename/manifest review alone is insufficient.
- Cinematic acceptance must prove `ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET`, approximately 2–5s Full entry, Full/Subtle/Off/reduced-motion behavior, and world-specific motion derived from the corresponding reference rather than generic space treatment.
- Static fidelity must be accepted before cinematic motion for every main world; motion cannot hide structural/layout drift.
- Main-world and submodule responsive acceptance includes **200% browser zoom** in addition to the viewport matrix; no clipping, hidden actions or horizontal overflow is accepted.
- Gate R1 proves shared architecture/UI/asset primitives before Home.
- Gate R2 proves Home before any other world rollout.
- Gate R3 proves every remaining main world individually.
- Gate R4 proves the Work -> Projects nested pattern before broad submodule replication.
- Gate R5 proves every required portal has a dedicated functional target UI and applicable detail/task surfaces.
- Gate R6 proves redesign-wide integration/regression before reclassified Phase 14–25 hardening/acceptance.
- R6/final redesign verification also covers deterministic clock/date-boundary fixtures, canonical test data, migration backup/rollback, first-run/empty state, multi-tab storage collisions, large-data stress, malformed preferences/import schemas, animation cancellation, duplicate listeners/timers/RAF, repeated-navigation memory/CPU growth, module-registration failure isolation, long translations/RTL, portrait/landscape where relevant, and console/unhandled-rejection health.

**# 1. Run metadata**

Record:

\- date/time;

\- Git commit and intentional working-tree changes;

\- Node version;

\- browser/version;

\- OS;

\- application origin;

\- disposable test origin;

\- configured live providers;

\- intentionally unconfigured providers.

\---

**# 2. Final automated suite**

Run:

\`\`\`sh

node --test tests/

\`\`\`

Record the **\*\*current\*\*** pass/fail count after the final code change.

Do not reuse a historical count.

Result: \`PASS / FAIL\`

Evidence: \`\<path>\`

\---

**# 3. Structure and load order**

Verify:

\- all script/style references resolve;

\- repo-relative requires resolve;

\- local assets resolve;

\- classic-script order remains correct;

\- required globals exist;

\- side-effect module ownership/load order remains correct;

\- no duplicate Work/Explore/provider mount;

\- no config/secrets reference from browser sources.

Result: \`PASS / FAIL\`

\---

**# 4. Legacy data and migration**

Verify:

\- schema validation;

\- v2 complete import;

\- v3 complete import;

\- v4 complete import;

\- current v4 export;

\- malformed/partial backup rejection;

\- unrelated localStorage preservation;

\- rollback behavior;

\- reset preferences;

\- reset all data.

Result: \`PASS / FAIL\`

\---

**# 5. Original-domain regression**

Reverify all applicable existing contracts for:

\- Home;

\- Work / Projects / Backlog / History;

\- Personal;

\- Shortcuts;

\- Productivity;

\- Notes;

\- Settings;

\- Movies & Series local behavior;

\- Games local behavior;

\- Explore curated behavior.

No V2 feature may regress an earlier accepted domain.

Result: \`PASS / FAIL\`

\---

**# 6. Secrets and security**

Verify:

\`\`\`sh

git ls-files config/secrets

git check-ignore -v config/secrets/\<real-local-secret-file>

\`\`\`

Verify server denial for representative \`.json\` and otherwise-servable \`.js\` secret paths.

Inspect browser source/network.

No API key, client secret, token, Authorization value or raw secret file may be browser-visible.

Result: \`PASS / FAIL\`

\---

**# 7. Optional-provider contract matrix — conditional**

Run this section only when provider adapter code is retained or an optional provider was explicitly approved. Otherwise record `NOT APPLICABLE / NOT REQUIRED` and continue. For each applicable Movies, Games and Destinations provider contract test deterministic:

\- success;

\- empty;

\- page 2/load-more;

\- timeout;

\- rate-limit;

\- auth/config failure;

\- offline/network;

\- generic provider failure;

\- malformed response;

\- partial metadata;

\- cancellation.

Result: \`PASS / FAIL\`

\---

**# 8. Optional live provider smoke — conditional**

This is separate from mock verification and runs only for providers explicitly approved/configured by the user. If none are configured, record `NOT CONFIGURED / NOT REQUIRED` and continue; this does not block final acceptance.

For each configured provider record one status:

\- \`LIVE VERIFIED\`

\- \`NOT CONFIGURED\`

\- \`FAILED\`

Movies/Series smoke:

\- search;

\- movie + series;

\- details;

\- poster/backdrop;

\- normalized metadata;

\- explicit Add.

Games smoke:

\- search;

\- details;

\- cover/background where available;

\- genres/platforms;

\- tracker signals;

\- explicit Add.

Destinations smoke:

\- search beyond curated 12;

\- details;

\- image;

\- normalized location/context;

\- attribution;

\- explicit Save.

Mock success must never be reported as live verification.

\---

**# 9. Local/provider result separation — conditional provider checks**

For Movies, Games and Explore always verify the local/bundled source is truthful. If an optional provider is configured, additionally verify:

\- local results can appear immediately;

\- provider results are separately identifiable;

\- provider loading/errors do not falsely label local records as global results;

\- offline/unconfigured provider state is explicit.

Result: \`PASS / FAIL\`

\---

**# 10. Duplicate prevention — optional-provider records**

For each configured/retained provider domain (otherwise `NOT APPLICABLE`):

1\. add one provider item;

2\. add the same provider identity again.

Verify:

\- one local user record;

\- no duplicate tracker/watch/saved state;

\- UI indicates existing item appropriately.

Result: \`PASS / FAIL\`

\---

**# 11. Ambiguous local/provider collision**

Use an intentionally ambiguous same/similar-name case.

Verify no fuzzy title/name-only silent merge occurs.

Where deterministic mapping exists, verify the documented link/merge behavior.

Result: \`PASS / FAIL\`

\---

**# 12. Provider-origin persistence offline**

Add one provider-origin:

\- Movie/Series;

\- Game;

\- Destination.

Disable provider access and reload.

Verify each remains meaningful and normal local user state still works.

Result: \`PASS / FAIL\`

\---

**# 13. Provider refresh ownership**

Where refresh exists:

1\. add item;

2\. change user-owned state;

3\. return changed provider metadata;

4\. refresh.

Verify provider metadata can update without overwriting user-owned status, notes, progress, tracker choice, tasks, sessions, journal, saved/trip state.

Result: \`PASS / FAIL\`

\---

**# 14. Rejected-write/atomicity test**

Force supported storage failure.

Verify:

\- no false success UI;

\- memory/model/storage agree;

\- multi-key Add/Save does not leave impossible partial state;

\- rollback/recovery behavior matches contract.

Result: \`PASS / FAIL\`

\---

**# 15. Provider-origin backup round trip**

On disposable origin:

1\. add one provider title;

2\. add one provider game;

3\. save one provider destination;

4\. modify user-owned state;

5\. export v4;

6\. clear disposable OneSpace data;

7\. import backup;

8\. disable provider access;

9\. reopen all three.

Verify identity, user state and compatible provider metadata survive.

Result: \`PASS / FAIL\`

\---

**# 16. Server provider-input validation**

Test malformed/unsupported:

\- provider/kind;

\- provider ID;

\- page/page-size;

\- cursor;

\- oversized query;

\- unsupported method/route.

Verify rejection happens safely before arbitrary upstream forwarding.

Result: \`PASS / FAIL\`

\---

**# 17. No-open-proxy / SSRF test**

Attempt to make provider/media endpoints fetch:

\- arbitrary external URL;

\- unsupported provider host;

\- localhost/private-network reference where technically applicable.

The server must reject it.

Result: \`PASS / FAIL\`

\---

**# 18. Provider media safety**

Where a local media route is used, verify:

\- known-provider references only;

\- host allowlist;

\- image content type;

\- timeout;

\- response-size bound;

\- no credential leakage;

\- non-image content rejection.

Result: \`PASS / FAIL\`

\---

**# 19. XSS/untrusted-provider-text**

Mock provider returns HTML/script-like text in title/description/tags/attribution.

Verify it renders as harmless text and executes nothing.

Verify provider-origin external links pass safe protocol rules.

Result: \`PASS / FAIL\`

\---

**# 20. Search request race**

Create Query A -> B -> C with intentionally reordered response timing.

Verify final UI belongs to C.

Older success/error cannot:

\- replace current results;

\- clear current results;

\- announce stale ARIA output.

Result: \`PASS / FAIL\`

\---

**# 21. Detail request race**

Open A, then close/navigate/select B before A details finish.

A's late response must not:

\- reopen UI;

\- replace B;

\- mutate another route;

\- replace current environmental art.

Result: \`PASS / FAIL\`

\---

**# 22. Movies & Series complete flow**

Verify:

\- local typeahead;

\- provider typeahead;

\- movie/series parity;

\- pagination;

\- explicit Add;

\- status choice;

\- library;

\- detail;

\- poster/backdrop;

\- watchlist;

\- untrack;

\- custom-delete semantics;

\- reload;

\- provider unavailable;

\- offline;

\- image failure;

\- keyboard behavior.

Result: \`PASS / FAIL\`

\---

**# 23. Games complete flow**

Verify:

\- local/provider search;

\- detail;

\- explicit Add;

\- weekly inference;

\- story inference;

\- user correction;

\- objective/task initialization;

\- sessions;

\- journal;

\- resources;

\- spotlight eligibility;

\- edit/delete;

\- reload/offline;

\- image failure;

\- keyboard behavior.

Result: \`PASS / FAIL\`

\---

**# 24. Explore curated flow**

Verify all 12 curated destinations and:

\- preferences;

\- deterministic ranking;

\- recommendation explanations;

\- Surprise Me;

\- detail;

\- card/hero photography;

\- alt text;

\- fallback;

\- Save/remove;

\- trip board;

\- Explore-only shortcuts;

\- More To Explore is final.

Result: \`PASS / FAIL\`

\---

**# 25. Explore global destination flow**

Search a destination not in the curated 12.

Verify:

\- provider search;

\- pagination/progressive result;

\- detail;

\- image;

\- description/context;

\- source/attribution;

\- Save/shortlist;

\- trip board;

\- reload;

\- offline reopen;

\- fallback;

\- curated Explore remains intact.

Result: \`PASS / FAIL\`

\---

**# 26. Content-aware Movies environment**

Select a title with backdrop.

Verify:

\- correct title owns art;

\- Movies base identity remains;

\- readable contrast;

\- controls unaffected;

\- artwork ignores pointer events;

\- no major layout shift.

Rapidly change selection; latest item must own final art.

Result: \`PASS / FAIL\`

\---

**# 27. Content-aware Games environment**

Repeat for curated and provider-origin game artwork.

Result: \`PASS / FAIL\`

\---

**# 28. Content-aware Explore environment**

Repeat for curated and provider-origin destination hero art.

Result: \`PASS / FAIL\`

\---

**# 29. Environmental-art failure**

Force failure separately for:

\- Movie backdrop;

\- Game background;

\- Destination hero.

Verify:

\- base scene remains;

\- detail/actions remain;

\- only failed media role falls back;

\- no broken-image UI.

Result: \`PASS / FAIL\`

\---

**# 30. Cross-domain scene cleanup**

Navigate:

Movies -> Games -> Explore -> Work -> Home

Verify no stale:

\- art;

\- theme class;

\- CSS variable;

\- loading flag;

\- selected-content environment

leaks across domains.

Result: \`PASS / FAIL\`

\---

**# 31. Cinematic lifecycle**

Reverify route lifecycle:

\`ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET\`

Internal content selection must not replay full page ENTRY unnecessarily.

Result: \`PASS / FAIL\`

\---

**# 32. Motion preferences**

Verify:

\- Full;

\- Subtle;

\- Off;

\- \`prefers-reduced-motion\`.

Reduced motion is genuinely still: no optional parallax, ambient transform drift or stagger.

Result: \`PASS / FAIL\`

\---

**# 33. Keyboard and accessibility**

Verify applicable:

\- visible focus;

\- logical tab order;

\- Enter/Space;

\- Escape;

\- modal focus trap;

\- inert background;

\- focus return;

\- typeahead arrows/Escape;

\- explicit Add/Save;

\- meaningful image alt;

\- decorative art hidden appropriately;

\- \`aria-live\` for useful async/save/error feedback;

\- no stale-request announcement;

\- mobile/coarse-pointer usability.



**## Global modern icon system**

Across Home, Work/Projects, Personal, Explore, Games, Movies & Series, Shortcuts, Productivity, Notes and Settings verify:

\- one coherent application-control icon language;

\- shared actions use consistent recognizable glyphs where context permits;

\- no broken/missing icon;

\- no accidental emoji/Unicode substitute control icon;

\- no obvious clipping, baseline drift, disproportionate sizing or visual mismatch;

\- icons remain crisp/readable in light/dark and supported palettes;

\- icon-only controls retain accessible names, visible focus and adequate touch targets;

\- decorative icons do not create redundant assistive-technology output;

\- legitimate favicons/provider/source/brand marks remain intentionally distinct from application UI icons.

Inspect representative navigation, headings, cards, forms/dialogs, filters/search and shared action controls at the required responsive widths.

Result: \`PASS / FAIL\`

\---

**# 33A. Approved reference-image fidelity**

For Home, Work, Personal/Fitness, Explore, Games, Movies & Series, Projects & Notes and Settings:

- open the actual corresponding image file under `docs/ui-reference/`;
- verify the delivered world belongs to the same shared OneSpace visual family;
- verify its world-specific scene subject, props, composition, depth, lighting and motion opportunities come from that image;
- verify the image itself is not shipped as a baked-in composite UI background;
- verify no generic starfield/space treatment has replaced the approved scene;
- verify no stale legacy screenshot target overrides the approved reference;
- record the exact reference filename used in evidence.

Result: `PASS / FAIL`

---

**# 34. Responsive matrix**

Preserve existing acceptance widths:

\- 1440;

\- 1024;

\- 760;

\- 390.

Add media-rich wide-desktop checks:

\- approximately 1920×1080;

\- approximately 2048×1152.

Verify:

\- no horizontal overflow;

\- no clipped controls;

\- modal/sheet placement;

\- search dropdown;

\- readable art treatment;

\- sensible media crop;

\- touch targets.

Result: \`PASS / FAIL\`

\---

**# 35. Performance/network sanity**

Inspect provider/search behavior:

\- no request for empty input;

\- debounce works;

\- obsolete requests cancel/are ignored;

\- duplicate in-flight requests are avoided where defined;

\- valid short-TTL cache prevents unnecessary repeat calls;

\- pagination is deliberate;

\- full hero media is not fetched for every card;

\- every cache is bounded.

Result: \`PASS / FAIL\`

\---

**# 36. Console/network health**

Across final flows verify:

\- no uncaught exception;

\- no unintended 404;

\- no duplicate mount/listener symptoms;

\- no secret-bearing logs/responses;

\- no unexpected provider/media request leakage.

Result: \`PASS / FAIL\`

\---

**# 37. Offline final pass**

With providers unavailable verify:

\- application opens;

\- Work/Personal/Productivity/Notes/Shortcuts/Settings work;

\- local/saved Movies work;

\- local/saved Games work;

\- curated Explore works;

\- saved local/imported destinations and trip board work;

\- local/bundled discovery remains available;

\- any explicitly approved optional provider shows an explicit unavailable/degraded state when offline;

\- local content is not mislabeled as live provider results.

Result: \`PASS / FAIL\`

\---



**# FINAL FIDELITY ACCEPTANCE EXTENSION — PHASES 20–25**

Gate mapping:

\- Gate 20 — full-viewport cinematic fidelity

\- Gate 21 — global icon visual quality

\- Gate 22 — credential-free catalogue/real media completion + optional-provider boundary

\- Gate 23 — game enrichment and tracker intelligence

\- Gate 24 — global search/filter integration

\- Gate 25 — final user-visible product acceptance

\- Gate 26 — whole-project final integrity and release readiness

Gate 25 authorizes Phase 26. Phase 13.3 and final PASS remain blocked until Gate 26 passes.



**# A. Full cinematic acceptance**

Full reference-led cinematic acceptance applies to exactly eight redesigned main worlds:

\- Home

\- Work

\- Personal / Fitness

\- Explore

\- Games

\- Movies & Series

\- Projects & Notes

\- Settings

For each, the actual corresponding reference image must be opened and visually inspected. Shortcuts, Productivity, Notes and the legacy Projects alias remain mandatory compatibility/functionality surfaces and receive the visual treatment assigned by R0; they are not automatically extra cinematic worlds.

Verify in Full mode:

\- visible staged entry;

\- approximately 2–5 seconds;

\- usable during entry;

\- smooth settle;

\- persistent ambient alive state;

\- distinct route visual subject;

\- not merely fade/gradient;

\- not merely central-hero animation;

\- full-page environment remains visible at wide sizes.

Record per route:

\`PASS / IMPLEMENTED-NOT-VERIFIED / FAIL\`

If a normal user could reasonably describe the page as static or generic, it is not PASS.

\---

**# B. Responsive and ultrawide matrix**

Verify every route at:

\- 390

\- 760

\- 1024

\- 1440

\- 1920

\- representative ultrawide, preferably \~3440×1440

Check:

\- no overflow;

\- no broken media;

\- no unintended clipping;

\- intentional scene crop;

\- readable content;

\- usable controls;

\- no dead side-space cinematic failure;

\- no decorative pointer interception.

\---

**# C. Scene intensity matrix**

Verify:

\- Full — visibly cinematic;

\- Subtle — observably reduced;

\- Off — still;

\- prefers-reduced-motion — genuinely still;

\- touch/coarse pointer — no hover/parallax dependency.

Record actual browser evidence.

\---

**# D. Global icon quality**

Across all routes/themes/widths verify:

\- modern visual language;

\- consistent geometry;

\- optical size;

\- alignment;

\- stroke/fill philosophy;

\- contrast;

\- shared action semantics;

\- hover/focus/pressed states;

\- touch targets;

\- accessible names;

\- no emoji/Unicode substitute controls.

Do not PASS solely because SVG elements exist.

\---

**# E. Secret/configuration verification**

Verify:

\`\`\`sh

git ls-files config/secrets

git check-ignore -v config/secrets/\<representative-real-secret-file>

\`\`\`

Verify:

\- secret JSON path denied;

\- representative \`.js\` secret path denied;

\- browser source does not reference secret files;

\- no API key/client secret/token appears in browser network/errors/logs.

The agent must not fabricate a credential.

For each optional provider explicitly approved/configured, record:

\`LIVE VERIFIED / NOT CONFIGURED / FAILED\`

If no provider is approved/configured, record `NOT CONFIGURED / NOT REQUIRED`; this is not a failure.

\---

**# F. Optional live Movies & Series E2E — conditional**

Run only if the Movies & Series provider is explicitly approved/configured; otherwise record `NOT CONFIGURED / NOT REQUIRED`. When run, record provider and exact test titles.

Verify:

\- live movie search;

\- live series search;

\- provenance;

\- details;

\- description;

\- poster where available;

\- backdrop where available;

\- normalized metadata;

\- pagination;

\- cancellation/latest-request ownership;

\- explicit Add;

\- reload;

\- offline reopen;

\- optional-provider-disabled saved-record reopen when applicable;

\- untrack/remove.

Mock success is not live proof.

\---

**# G. Optional live Games E2E — conditional**

Run only if the Games provider is explicitly approved/configured; otherwise record `NOT CONFIGURED / NOT REQUIRED`. When run, record provider and exact test games.

Verify:

\- live search;

\- provenance;

\- details;

\- description;

\- cover where available;

\- background/key art where available;

\- genres/tags;

\- platforms;

\- release metadata;

\- tracker signals;

\- pagination;

\- cancellation/latest-request ownership;

\- explicit Add;

\- reload;

\- provider-disabled offline reopen.

\---

**# H. Added/imported game immediate enrichment**

Run against the normal local/bundled Add flow. If a provider-origin record exists, include it as an additional conditional case. Immediately after Add verify:

\- local card exists;

\- available real cover is visible;

\- description is visible;

\- detail opens;

\- background/key art is available to the Games environment where supplied;

\- tracker exists;

\- no second manual metadata-setup step is required;

\- reload preserves the record.

If optional-provider metadata/media is absent, or the record is local/bundled, verify explicit local media/fallback rather than fabricated content.

\---

**# I. Tracker inference**

Test:

1\. Diablo Immortal

2\. at least one additional live-service game

3\. at least one campaign game

4\. at least one insufficient-signal/custom case if supported

Verify:

\- visible inferred type;

\- user correction before save;

\- confirmed type persistence;

\- provider refresh does not silently change confirmed type.

\---

**# J. Weekly/live-service tracker**

For Diablo Immortal and another live-service game verify:

\- weekly inferred correctly;

\- weekly tracker created;

\- game-specific recurring data used when approved source/template exists;

\- reset cadence works;

\- state persists;

\- unrelated Diablo tasks are not reused for the other game.

\---

**# K. Progression-source proof**

Before accepting any game as \`complete progression\`, record:

\- exact source/provider;

\- access mode;

\- licensing/terms/attribution;

\- source version/update marker;

\- declared completeness;

\- hierarchy depth;

\- mission/quest coverage;

\- objective/step coverage;

\- stable identity strategy.

Do not accept a generic game catalog provider as proof of full mission data unless its delivered contract actually provides it.

\---

**# L. Complete campaign progression**

Use at least one campaign game with an approved complete progression source.

Verify:

\`Act/Chapter/Region/Level -> Mission/Quest -> ordered Objective/Step\`

Check:

\- all missions represented by approved source are present;

\- canonical order;

\- grouping;

\- objectives/steps where source provides them;

\- stable IDs;

\- completion;

\- progress calculation;

\- reload;

\- backup/export/import;

\- provenance;

\- source version;

\- refresh does not erase completion.

Never accept hallucinated/generated mission data.

\---

**# M. Incomplete progression behavior**

Use at least one campaign game without an approved complete source.

Verify:

\- no invented missions;

\- no false \`complete\` claim;

\- explicit unavailable/incomplete state;

\- usable generic/custom story tracker;

\- available image/description retained;

\- later enrichment supported;

\- prior user progress preserved.

\---

**# N. Global search/filter semantics**

For every visible criterion in Movies/Series, Games and Explore record:

\- provider-side;

\- canonical post-filter;

\- local-only;

\- unsupported globally.

Test representative combinations.

No selected visible criterion may be silently ignored while the UI implies that it affected global results.

\---

**# O. Real media and fallback**

Verify exact roles:

Movies:

\- poster

\- backdrop

Games:

\- cover

\- background

Explore:

\- card

\- hero

For each:

\- valid provider media renders when available;

\- forced failure falls back;

\- details/actions remain usable;

\- one role failure does not incorrectly discard another valid role;

\- media route does not permit arbitrary URL proxying.

\---

**# P. Final Phase 20–25 reconciliation**

Before Phase 26:

\- [ ] Gate 20 PASS

\- [ ] Gate 21 PASS

\- [ ] Gate 22 PASS

\- [ ] Gate 23 PASS

\- [ ] Gate 24 PASS

\- [ ] Gate 25 PASS

No unresolved Phase 20–25 item may remain as:

\- PENDING

\- IMPLEMENTED / NOT VERIFIED

\- BLOCKED

unless the user explicitly approved a terminal exception.

\---


\---

**# Q. Phase 26 — Final Whole-Project Integrity and Release-Readiness Verification**

Phase 26 is executed only after Gate 25 is PASS.

Record the normal user-data origin and a disposable test origin before Phase 26. Destructive reset/import/failure-path tests run on the disposable origin unless the user explicitly authorizes otherwise.

It verifies the fully assembled final candidate as one system. It does not replace earlier requirement-level evidence and it does not blindly replay every historical test. Reuse still-valid evidence where appropriate, but re-run every subsystem affected by later changes and execute the complete final automated suite after the last implementation fix.

**## Q1. Final candidate metadata**

Record:

\- working directory;

\- Git root;

\- branch;

\- HEAD/commit;

\- `git status --short --untracked-files=all`;

\- `git diff`;

\- intentional uncommitted changes;

\- confirmation that Gate 25 is PASS.

Result: `PASS / FAIL`

Evidence: `<path>`

**## Q2. Git and repository hygiene**

Verify:

\- no unexplained temp/debug/copy/backup/generated artifact;

\- no obsolete duplicate loaded module;

\- no accidental OneSpace file outside project scope;

\- no unrelated broad change;

\- final tracked/untracked state is understood;

\- no destructive cleanup was used to manufacture a clean result.

Result: `PASS / FAIL`

**## Q3. `.gitignore` and local secret placement**

Without exposing values, verify:

\- real secret files are ignored;

\- example/template config contains placeholders only;

\- no real secret file is tracked;

\- representative intended local secret paths are matched by `git check-ignore`;

\- Git path history for secret/config paths is inspected without printing raw secret values;

\- if a real credential was ever committed/pushed, rotation/revocation and the chosen history-remediation decision are recorded;

\- no real credential is copied into evidence.

Result: `PASS / FAIL`

**## Q4. Server/browser credential isolation**

Verify:

\- representative secret `.json` path is denied;

\- representative otherwise-servable secret `.js` path is denied;

\- browser HTML/JavaScript contains no provider credential;

\- browser Network/Sources cannot retrieve local secret files;

\- browser-visible errors contain no credentials;

\- server logs/evidence/screenshots/fixtures contain no real credential;

\- Authorization/client-secret material remains server-side.

Any confirmed real-secret exposure is `FAIL` until appropriate remediation/rotation is recorded.

Result: `PASS / FAIL`

**## Q5. Final source structure and load order**

Verify:

\- every loaded script resolves;

\- every loaded stylesheet resolves;

\- repo-relative require/import references resolve;

\- assets resolve or use the approved fallback;

\- classic-script execution order is correct;

\- side-effect module ordering remains intentional;

\- no duplicate mount/controller exists;

\- Home remains the allowed cross-domain aggregator;

\- domain-boundary rules remain intact.

Result: `PASS / FAIL`

**## Q6. Whole-app route/UI walkthrough**

Inspect:

\- Home;

\- Work / Projects;

\- Personal;

\- Explore;

\- Games;

\- Movies & Series;

\- Shortcuts;

\- Productivity;

\- Notes;

\- Settings;

\- Projects alias.

For every route verify applicable:

\- hierarchy/header/hero;

\- typography/spacing;

\- cards/grids;

\- forms/controls;

\- dialogs/sheets;

\- loading/empty/error/disabled/success states;

\- tooltip/focus;

\- long text;

\- media/fallback;

\- overall visual consistency.

A route must be usable and visually finished, not merely free from runtime errors.

Result: `PASS / FAIL`

**## Q7. Final icon-system audit**

Across all routes/shared UI verify:

\- coherent modern application-control SVG language;

\- consistent shared-action glyphs;

\- no accidental emoji/unrelated Unicode application controls;

\- no missing/broken/clipped/misaligned icon;

\- icon-only controls remain accessible;

\- light/dark/palette contrast remains acceptable;

\- brand/provider/content marks remain legitimate source-identity exceptions.

Result: `PASS / FAIL`

**## Q8. Final cinematic audit**

For each main world, record the exact reference filename that was opened and at least one image-specific composition/lighting/depth/motion observation before accepting its cinematic implementation. A generic route checklist without actual-image inspection fails Q8.

For each of the eight reference-led main-world scenes verify:

\- domain identity;

\- Full ENTRY / WAKE-UP;

\- SETTLE;

\- AMBIENT / ALIVE;

\- EXIT / RESET;

\- visible staged Full-mode opening;

\- page-level rather than hero-only composition;

\- 1920 and ultrawide environmental side-field composition;

\- selected Movie/Game/Destination art integration;

\- internal selection does not replay full ENTRY;

\- route cleanup prevents art/theme/CSS-variable leakage;

\- Subtle is observably reduced;

\- Off is still;

\- reduced motion is genuinely still;

\- touch/coarse pointer is safe;

\- decorative layers do not capture controls;

\- text/control readability is preserved.

Technically present but visually imperceptible/generic motion is `FAIL`.

Result: `PASS / FAIL`

**## Q9. Themes and Settings integration**

Verify together:

\- Auto/light/dark;

\- every delivered palette;

\- accents;

\- density;

\- scene intensity;

\- motion;

\- start page;

\- Games themes;

\- Movies themes;

\- provider status;

\- reset preferences;

\- reset all;

\- export/import entry points;

\- reload persistence;

\- no unintended destruction of unrelated user state.

Result: `PASS / FAIL`

**## Q10. Core-domain integrated regression**

Use earlier detailed evidence as baseline, then re-run every path affected by later changes.

Verify final integrated behavior for:

\- Home aggregation/Quick Access/navigation;

\- Work projects/Board/stories/defects/tasks/filters/reminders/close/reopen/Backlog/History;

\- Personal goals/routines/habits/optional target/add/edit/delete/cancel;

\- Productivity tasks/timer/countdowns/reminders;

\- Notes create/edit/delete/pin/unpin/search;

\- Shortcuts built-ins/hide/restore/custom add/edit/delete/order/categories/Gaming/duplicate handling.

Result: `PASS / FAIL`

**## Q11. Movies & Series final integration**

Verify:

\- bundled/local discovery;

\- movie/series distinction;

\- search/typeahead;

\- local filter semantics;

\- details;

\- valid local poster/backdrop or deterministic fallback;

\- explicit Add/Track;

\- watchlist/status/watched;

\- untrack/remove;

\- reload/offline reopen;

\- provenance/attribution;

\- selected-content cinematic integration;

\- if an optional provider is explicitly approved/configured: discovery, supported filters/pagination/details/media and provider-available -> unavailable -> saved-record reopen.

Result: `PASS / FAIL`

**## Q12. Games final integration**

Verify:

\- bundled/local discovery;

\- supported local filters;

\- optional provider discovery/filters only when explicitly approved/configured;

\- cover/background;

\- description/metadata;

\- explicit Add;

\- tracker inference;

\- user correction before persistence;

\- Diablo Immortal weekly/live-service reference;

\- at least one additional live-service example;

\- campaign/story example;

\- approved complete-progression example;

\- incomplete/unknown progression safe fallback;

\- resources;

\- sessions;

\- journal;

\- progress preservation through refresh/enrichment;

\- reload;

\- offline reopen;

\- optional-provider-disabled saved-record reopen when applicable;

\- selected-content cinematic integration.

No mission/chapter/level/quest/objective/progression data may be invented.

Result: `PASS / FAIL`

**## Q13. Explore final integration**

Verify:

\- curated/bundled destination discovery;

\- optional global provider discovery only when explicitly approved/configured;

\- preferences;

\- combined filters;

\- ranking/recommendation explanations;

\- Surprise Me;

\- detail;

\- valid imagery/fallback;

\- Save/remove;

\- trip-board notes;

\- priority;

\- status;

\- ordering;

\- reload;

\- provider-disabled saved destination;

\- provenance/attribution;

\- selected-content cinematic integration.

Result: `PASS / FAIL`

**## Q14. Responsive final matrix**

Verify all eight reference-led main worlds at the full matrix below. Also verify every retained compatibility route/surface at every applicable width required by its R0 classification; compatibility does not imply a separate reference-led cinematic world.

Widths:

\- 390;

\- 760;

\- 1024;

\- 1440;

\- 1920;

\- representative ultrawide, preferably approximately 3440×1440.

For each applicable route/width verify:

\- no horizontal document overflow;

\- no unintended overlap;

\- no clipped control;

\- no broken visible media;

\- dialogs/sheets remain usable;

\- environmental crop is intentional;

\- content remains readable;

\- density remains coherent.

Result: `PASS / FAIL`

**## Q15. Accessibility and input**

Verify:

\- keyboard-only navigation;

\- logical Tab order;

\- Enter/Space;

\- Escape;

\- visible focus;

\- focus trap;

\- focus return;

\- accessible names;

\- `aria-live`;

\- `aria-current`;

\- `aria-expanded`;

\- `aria-pressed`;

\- checkbox/radio semantics;

\- touch targets;

\- no critical hover-only behavior;

\- reduced-motion compliance.

Result: `PASS / FAIL`

**## Q16. Storage, backup, migration, rollback and reset**

Verify final:

\- v4 export;

\- complete v2 import;

\- complete v3 import;

\- complete v4 import;

\- malformed/invalid import rejection;

\- rejected-write/rollback behavior;

\- unrelated-key preservation where required;

\- provider-origin Movies/Games/Destinations;

\- game tracker/progression;

\- Work/Personal/Notes/Explore state;

\- reset preferences;

\- reset all.

Result: `PASS / FAIL`

**## Q17. Local-first persistence and optional-provider offline transition**

For Movies/Series, Games and Destinations first verify the normal credential-free path:

1. search/browse bundled or local data;
2. Add/Save a representative record;
3. reload;
4. reopen the saved record.

Verify normalized local records remain meaningful, user-owned state remains intact, media/fallback behavior is correct, and no network provider is required.

If an optional provider is explicitly configured, additionally test provider available -> Add/Save -> reload -> provider unavailable -> reopen saved record, and verify truthful degraded state with preserved local data.

`NOT CONFIGURED` is an allowed terminal state for optional providers and does not block Gate 26.

Result: `PASS / FAIL`

**## Q18. Console, network and runtime health**

During final browser passes verify:

\- no uncaught application exception;

\- no accidental application 404;

\- no secret leakage;

\- no duplicate mount/listener symptom;

\- no uncontrolled provider request storm;

\- stale provider responses cannot overwrite current UI;

\- late details cannot reopen closed/stale UI;

\- no cross-route theme/art leakage;

\- no runaway timer/animation loop or obvious unbounded DOM/runtime growth;

\- no repeated full-resolution provider-media fetch for card/list roles;

\- observed network behavior matches the documented browser -> local server -> provider boundary;

\- disposable test servers/processes are stopped after their evidence is complete.

Result: `PASS / FAIL`

**## Q19. Final complete automated run**

After the last implementation fix run:

\`\`\`sh

node --test tests/

\`\`\`

Also run every repository-required specialized structural/browser/provider/storage/tracker suite not included by that command.

Record actual final pass/fail counts.

Historical counts are context only.

Result: `PASS / FAIL`

Evidence: `<path>`

**## Q20. Evidence integrity**

Audit `docs/implementation-evidence/`, audit JSONL and final visual/test artifacts.

Verify:

\- every required terminal state has current evidence;

\- evidence corresponds to current code;

\- mock/live evidence is distinct;

\- visual evidence matches claimed states/widths;

\- no credential appears in evidence;

\- no stale evidence is used after invalidating changes;

\- asset/provider provenance and licensing/attribution records match the assets/data actually shipped or displayed;

\- approved exceptions are explicit;

\- no unexplained PENDING, IMPLEMENTED / NOT VERIFIED or BLOCKED remains.

Result: `PASS / FAIL`

**## Q21. Full redesign-authority synchronization**

Compare in full:

- `docs/agent-instructions.md`;
- `docs/IMPLEMENTATION-STEPS.md`;
- `docs/REVISED-IMPLEMENTATION-PLAN.md`;
- `docs/REDESIGN-INTEGRATION-GATE.md`;
- `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md`;
- `docs/ui-reference/MANIFEST.md`;
- the eight actual images under `docs/ui-reference/`;
- `VERIFICATION.md`;
- `README.md`.

Verify agreement on:

\- delivered scope;

\- execution order;

- local-first/optional-provider architecture and conditional live-vs-mock semantics;

\- secrets policy;

- reference-led cinematic contract and scene-asset rules;

\- icon contract;

\- Games tracker/progression contract;

\- filter semantics;

\- backup compatibility;

\- final verification truth.

This is technical consistency verification. Final prose reconciliation remains Phase 13.3.

Result: `PASS / FAIL`

**## Q22. Final Git/diff**

Record final:

\- `git status --short --untracked-files=all`;

\- `git diff`;

\- project scope;

\- absence of secret/temp artifacts;

\- absence of unrelated outside-project changes.

Result: `PASS / FAIL`

**## Gate 26 — Whole-Project Final Integrity**

Gate 26 is PASS only when every Q1–Q22 check is satisfied and there is no unresolved functional, visual/UI, icon, cinematic, responsive, accessibility, persistence/backup, provider/media, secret/security, Git/repository, runtime/console/network, automated-test, evidence or authority-consistency issue. Every explicitly approved/configured provider must satisfy its declared verification scope. Optional providers may remain `NOT CONFIGURED / NOT REQUIRED` without blocking the credential-free product.

If Phase 26 finds a defect:

\`identify -> minimally fix -> affected tests -> affected browser/visual verification -> evidence update -> continue Phase 26\`

Do not formally reopen an old phase solely to record a Phase 26 regression fix.

Result: `PASS / FAIL`

\---

**# R. Final documentation sequence**

Only after Gate 26:

1\. reconcile README with actual delivered behavior;

2\. reconcile \`docs/agent-instructions.md\`;

3\. reconcile \`docs/REVISED-IMPLEMENTATION-PLAN.md\`;

4\. update VERIFICATION with current final results;

5\. run Phase 13.3;

6\. record final status.

\`FINAL STATUS: PASS\` is prohibited before Gate 26 and Phase 13.3 complete.



**# 38. Checklist reconciliation**

Inspect \`docs/IMPLEMENTATION-STEPS.md\`.

Final delivery requires no unresolved item in:

\- PENDING;

\- IMPLEMENTED / NOT VERIFIED;

\- BLOCKED.

Only explicitly permitted terminal states are allowed.

Gate 26 must pass before final documentation completion.

\---

**# 39. Documentation reconciliation**

After implementation/acceptance only:

\- \`README.md\` describes actual delivered behavior;

\- \`docs/agent-instructions.md\` matches approved scope;

\- \`docs/REVISED-IMPLEMENTATION-PLAN.md\` matches actual architecture;

\- this file contains current final results rather than historical assumptions.

\---

**# FINAL STATUS**

\`FINAL ONESPACE STATUS: PASS / FAIL\`

If FAIL, list exact unresolved checklist IDs and evidence gaps.

A final PASS requires original-plan, V2, Phases 20–25 acceptance, Phase 26 whole-project integrity, Gate 26, and Phase 13.3 completion.