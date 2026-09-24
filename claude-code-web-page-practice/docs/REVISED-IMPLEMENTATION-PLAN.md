**# OneSpace — Revised Implementation and Architecture Plan V2**

**## Authority and purpose**

This document explains the architecture and design rationale behind the standing plan.

OneSpace uses a coordinated five-document authority set:

1. \`docs/agent-instructions.md\` — product scope and required outcomes;
2. \`docs/IMPLEMENTATION-STEPS.md\` — execution order, item status, evidence and gates;
3. \`docs/REVISED-IMPLEMENTATION-PLAN.md\` — architecture and technical rationale;
4. \`VERIFICATION.md\` — final verification/runbook truth;
5. \`README.md\` — delivered-product documentation.

When roles differ, scope comes from the standing plan and execution/completion comes from the checklist. This architecture document must stay consistent with both and must never silently expand or weaken them.

\---

**# 1. Product model**

OneSpace is a local-first personal dashboard covering:

\- Home aggregation;

\- Work / Projects / Backlog / History;

\- Personal goals, routines and habits;

\- Explore / travel inspiration;

\- Games;

\- Movies & Series;

\- Shortcuts;

\- Productivity;

\- Notes;

\- Settings.

Home is the only cross-domain aggregator.

Every other page remains strictly domain-owned.

User-owned records stay local. There are no required user accounts, cloud sync or multi-user collaboration.

\---

**# 2. Core compatibility contracts**

Preserve unless an explicit checklist item changes them:

\- root \`index.html\` entry;

\- local origin behavior at \`http\://localhost:8973/\`;

\- router and route aliases;

\- existing \`localStorage\` keys;

\- backup format version 4;

\- complete v2/v3/v4 import support;

\- public browser globals;

\- classic-script load-order dependencies;

\- UMD dual-export patterns;

\- \`shared/storage-utils.js\` as persistence validation boundary;

\- existing modal/focus/accessibility conventions.

No architecture improvement may silently break previously saved user data.

\---

**# 3. Local-first does not mean local-only**

User data remains local.

Provider-backed discovery is optional enrichment for rich-content domains.

Architecture:

\`\`\`text

Browser

  -> OneSpace local server

  -> provider-neutral adapter

  -> configured external provider

\`\`\`

The browser never receives provider credentials and does not depend on raw provider response shapes.

When provider functionality is unavailable, local/saved content remains usable and global discovery displays an explicit degraded state.

\---

**# 4. Provider domains**

**## 4.1 Movies & Series**

Global title discovery may use TMDB or the configured equivalent.

Normalize available:

\- source/provider ID;

\- movie/series type;

\- title;

\- overview;

\- poster;

\- backdrop;

\- genres;

\- release/year;

\- runtime;

\- series metadata where available;

\- attribution/source metadata where required.

**## 4.2 Games**

Global game discovery may use IGDB, RAWG or the configured equivalent.

Normalize available:

\- source/provider ID;

\- title;

\- description;

\- cover;

\- background/key art;

\- genres/tags;

\- platforms;

\- release metadata;

\- tracker-inference signals.

**## 4.3 Explore / Destinations**

V2 adds provider-neutral global place/destination discovery.

Provider selection is implementation work because licensing, imagery and practical API access must be evaluated.

Normalize available:

\- source/provider ID;

\- destination name;

\- city/region/country;

\- summary;

\- details/context;

\- categories/themes;

\- season/trip-character hints;

\- budget/duration hints;

\- card media;

\- hero media;

\- source/license/attribution metadata.

The curated 12-destination catalog remains the stable offline recommendation set.

\---

**# 5. Provider adapter contract**

Provider adapters own vendor-specific:

\- authentication;

\- upstream URL construction;

\- pagination translation;

\- error translation;

\- raw payload parsing.

Domain UI sees normalized OneSpace records.

Conceptual operations:

\`\`\`text

searchTitles(query, options)

getTitleDetails(providerId, kind)

searchGames(query, options)

getGameDetails(providerId)

searchDestinations(query, options)

getDestinationDetails(providerId)

\`\`\`

Names are illustrative; behavior is authoritative.

\---

**# 6. Provider search state machine**

Provider search supports:

\- idle;

\- debounced pending;

\- loading;

\- success;

\- empty;

\- load-more/pagination;

\- timeout;

\- auth/configuration failure;

\- rate-limit;

\- offline/network failure;

\- provider error;

\- invalid/malformed upstream response;

\- partial metadata.

Every request has ownership/generation.

A stale response or stale error cannot replace newer UI.

Closing a detail, selecting another item or navigating away invalidates the old detail generation.

\---

**# 7. Local + provider search composition**

Local/catalog results are immediate.

Provider results arrive asynchronously.

The UI keeps provenance understandable, for example:

\- \`In your catalog\`

\- \`Search results\`

Do not present the local catalog as successful global results when the provider is unavailable.

Provider results require explicit Add/Save/Track before they become user-owned.

\---

**# 8. Deterministic provider identity**

Provider-origin identity is based on:

\`domain/kind + provider/source + provider item ID\`

Do not use title/name alone.

Adding the exact same provider identity is idempotent.

Fuzzy title/name similarity cannot silently merge records.

Deterministic mapping may link a provider result to a known local seed record; otherwise keep records distinct or require explicit reconciliation.

\---

**# 9. Canonical validation and persistence**

Persisting a provider result follows:

1\. normalize;

2\. sanitize;

3\. validate canonical schema;

4\. write;

5\. verify success/read-back where applicable;

6\. update UI.

UI must not claim success before persistence succeeds.

Provider normalization never bypasses \`shared/storage-utils.js\`.

Optional provider fields should remain backward-compatible with legacy records.

\---

**# 10. Provider metadata ownership vs user state**

Provider-owned metadata may be refreshed.

User-owned state must not be silently overwritten.

Examples of user-owned state:

\- library/watch status;

\- notes;

\- favorites;

\- confirmed game tracker type;

\- objectives/tasks/progress;

\- sessions;

\- journal;

\- shortlist/saved/trip-board state.

Merge policy must preserve user state even when upstream fields disappear or change.

\---

**# 11. Multi-key transactions**

One logical user action can touch multiple structures.

Examples:

\- game + tracker/task initialization;

\- destination + saved/trip-board relation;

\- title + tracking/watch state where applicable.

Use existing transactional/rollback semantics when consistency spans multiple keys.

A failed partial write cannot be reported as a completed Add/Save.

\---

**# 12. Offline persisted provider records**

A provider-origin record must remain meaningful without a fresh provider request.

Persist enough normalized metadata for local identification and normal user state.

Provider refresh is enhancement, not a prerequisite to reopen a saved record.

Provider outage never deletes a valid local record.

\---

**# 13. Secrets and configuration**

Real credentials are:

\- server-side only;

\- ignored by Git;

\- absent from browser JS and HTML;

\- absent from committed examples;

\- inaccessible through the static server.

Committed configuration contains placeholders only.

If a credential is ever committed/pushed, rotate/revoke it before continuing.

\---

**# 14. Server input validation**

Provider endpoints validate/allowlist browser input.

Bound applicable:

\- query length;

\- kind/type;

\- provider;

\- provider ID;

\- page/page size;

\- pagination cursor;

\- supported method/route.

Do not blindly forward arbitrary query parameters upstream.

\---

**# 15. No open proxy / SSRF**

The server does not fetch arbitrary browser-supplied URLs.

Adapters choose known upstream endpoints server-side.

Provider and media hosts are allowlisted.

Browser input cannot turn OneSpace into a generic external, localhost or private-network fetcher.

\---

**# 16. Provider media architecture**

Where external provider art is needed and the browser-network contract requires mediation:

\`\`\`text

Browser

  -> OneSpace local media route

  -> known provider media host

\`\`\`

The browser receives a safe local media reference or provider-neutral media identity, not an arbitrary user-supplied upstream URL.

Media handling enforces:

\- known provider;

\- host allowlist;

\- HTTPS upstream where supported;

\- image content type;

\- timeout;

\- sensible response-size bound;

\- no credential leakage.

Do not proxy arbitrary HTML/scripts/documents through an image route.

\---

**# 17. Media caching and licensing**

Caching is allowed only where provider terms permit it.

Every cache is bounded by finite entry count and/or storage size and has an expiry/invalidation policy.

Clearing provider/media cache cannot remove user-owned records.

If persistent artwork caching is not permitted, save metadata/reference and use a deterministic local fallback when offline.

Licensing/attribution terms override convenience.

\---

**# 18. Media roles**

Rich domains distinguish media by role:

\- search/card thumbnail;

\- poster/cover;

\- hero;

\- backdrop/environment;

\- fallback.

Do not load full hero/backdrop media for every search row.

Use role-appropriate source size, lazy loading and responsive media where applicable.

Do not upscale tiny thumbnails into large cinematic surfaces.

\---

**# 19. Untrusted provider data**

Provider text is untrusted input.

Never inject raw provider HTML.

Use safe text/escaping helpers.

Provider-origin URLs pass protocol validation and safe external-link conventions.

Provider errors returned to the browser are normalized and sanitized; no credentials, raw Authorization headers or secret-bearing stack traces are exposed.

Server logs redact credentials.

\---

**# 20. Provider cache**

Short-TTL query/details caching may reduce quota/load.

Requirements:

\- deterministic key;

\- bounded size;

\- expiry;

\- stale/fresh semantics defined;

\- clearable without deleting user records;

\- identical in-flight request dedup where useful.

Do not issue provider requests for empty input or unnecessarily repeat valid cached requests.

\---

**# 21. Mock and live evidence**

Automated tests use deterministic mock providers.

Mock verification proves adapter/contract behavior.

Live configured provider smoke is a separate evidence class.

Never claim live E2E verification from mocks.

\---

**# 22. Games tracker inference**

Provider metadata feeds an initial tracker recommendation.

Live-service/MMO/looter/gacha/battle-royale-like signals generally suggest weekly.

Campaign/story-rich/single-player-like signals generally suggest story/chapter.

The inferred choice is visible and user-correctable before save.

Once confirmed, tracker type is user-owned state and provider refresh cannot silently change it.

\---

**# 23. Explore two-source model**

Explore has:

1\. curated/local recommendation catalog;

2\. global provider search.

The curated catalog remains deterministic and offline.

Global discovery is broader but provider-dependent.

Saving a global destination normalizes it into a durable local record.

Curated recommendation ranking must not become network-dependent.

\---

**# 24. Unified cinematic architecture**

One scene controller owns:

\- route entry;

\- settle;

\- ambient state;

\- exit/reset;

\- pointer parallax;

\- reveal;

\- reduced-motion behavior.

Lifecycle:

\`ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET\`

Projects remains a Work alias.

No V2 feature creates a second animation controller.

\---

**# 25. Domain base scenes**

Base scene identities remain:

\- Home — observatory / command deck;

\- Work — drafting room / command centre;

\- Personal — calm ritual space;

\- Explore — world atlas / travel window;

\- Games — game-world spotlight;

\- Movies & Series — theater / streaming marquee;

\- Shortcuts — launch wall;

\- Productivity — focus/timer studio;

\- Notes — quiet capture desk;

\- Settings — control room.

Base scenes work even with no provider art.

\---

**# 26. Selected-content environmental art**

Movies, Games and Explore may add one optional selected-content media layer behind the existing scene.

Layer stack conceptually:

\`\`\`text

base domain scene

\+ optional selected-content media

\+ depth/glow/ambient treatment

\+ contrast scrim

\+ normal content UI

\`\`\`

The environmental layer is decorative and subordinate.

It cannot move/capture controls or reduce readability.

\---

**# 27. Content-art ownership and races**

A media load applies only if all still match:

\- current route;

\- selected record identity;

\- current content-art generation.

Rapid A -> B -> C selection must finish on C.

Internal selection uses a light crossfade/transition, not full route ENTRY.

Leaving the domain clears transient content-art state and prevents scene leakage.

\---

**# 28. Motion accessibility**

Full / Subtle / Off remain supported.

\`prefers-reduced-motion\` removes optional motion entirely rather than merely slowing it.

No essential information depends on motion.

Coarse-pointer/touch devices do not depend on hover or pointer parallax.

\---

**# 29. Repository/domain ownership**

Keep new behavior out of the inline shell where a domain/shared module is appropriate.

Home remains the only cross-domain aggregator.

Provider transport can be shared/server-side; domain normalization/UI mapping remains domain-owned.

Provider work must not reintroduce the cross-domain leaks removed by Phase 3.

\---



**# 30. Global modern icon design system**

OneSpace uses one coherent application-control icon language across every tab.

The preferred implementation is shared inline SVG or equivalent reusable local SVG markup; do not introduce an external icon CDN or a mixed third-party icon dependency merely for polish.

The icon system applies to application UI such as:

\- navigation;

\- page/section headings;

\- buttons;

\- search/filter/sort;

\- add/edit/remove/save/restore;

\- dialogs and sheets;

\- favorite/status actions;

\- expand/collapse;

\- retry/error/empty-state actions.

Shared actions should reuse the same recognizable glyph where context permits.

Visual consistency includes:

\- geometry/viewBox conventions;

\- stroke/fill philosophy;

\- stroke weight;

\- optical size;

\- alignment;

\- spacing;

\- active/disabled/focus treatment.

Domain-specific icons may have distinct silhouettes, but they must still belong to the same visual family.

Modernization is **\*\*selective\*\***, not churn: an existing icon that is already clear, modern, aligned and consistent should be retained.

Application UI must not fall back to random emoji or Unicode symbols as substitute control icons.

Accessibility remains mandatory:

\- icon-only actions require an accessible name;

\- focus remains visible;

\- touch targets remain adequate;

\- required ARIA state remains accurate;

\- decorative icons are hidden from assistive technology when appropriate;

\- text labels are not removed when the icon alone would be ambiguous.

Legitimate source/content identity is explicitly outside the UI-glyph normalization rule. Preserve appropriate:

\- website favicons;

\- provider attribution marks;

\- service/game/movie logos;

\- other content-owned brand marks.

The icon system is verified across all tabs, supported themes and responsive widths. It must not clip, drift off baseline, become blurry, or lose contrast at supported sizes.



**# 31. Backup/migration contract**

Current export: version 4.

Supported complete imports: v2, v3, v4.

Optional provider metadata should not force a version bump.

A version bump requires explicit migration design, fixtures and old/new round-trip tests.

Final acceptance includes provider-origin records in export/import.

\---

**# 32. Verification strategy**

Automated coverage includes:

\- normalization;

\- pagination;

\- cancellation;

\- error classes;

\- timeout;

\- rate-limit;

\- offline;

\- malformed/partial responses;

\- duplicate prevention;

\- refresh merge ownership;

\- storage failure rollback;

\- XSS-safe rendering;

\- open-proxy/SSRF rejection;

\- media validation;

\- content-art race ownership.

\- global icon consistency, accessibility and responsive visual quality.

Browser acceptance includes:

\- local+provider search;

\- Add/Save;

\- reload/offline;

\- media/fallback;

\- cinematic environment;

\- keyboard/focus/ARIA;

\- responsive layouts;

\- console/network health.

Live provider smoke is separate from mock automation.

\---

**# 33. Final architectural principle**

Provider integrations must be removable without destroying OneSpace.

If every provider is unavailable:

\- user-owned records survive;

\- curated catalogs survive;

\- Work/Personal/Productivity/Notes/Shortcuts/Settings survive;

\- saved Movies/Games/Destinations remain locally meaningful;

\- base scenes survive;

\- global discovery becomes explicitly unavailable.

That is the required definition of local-first.

\---

**# FINAL APPROVED ARCHITECTURE EXTENSION — PHASES 20–26**

Execution mapping:

\- Phase 20: page-level cinematic/wide-screen architecture

\- Phase 21: modern icon quality remains a UI-system concern governed by the standing plan/checklist

\- Phase 22: live provider and real-media architecture

\- Phase 23: game Add/enrichment/tracker/progression architecture

\- Phase 24: canonical search/filter mapping architecture

\- Phase 25: final user-visible integrated acceptance; no new parallel product architecture is introduced

\- Phase 26: final whole-project integrity and release-readiness audit over the fully assembled repository/application

\- Phase 13.3: final reconciliation only after Gate 26



**# 2. Cinematic lifecycle state machine**

Canonical state:

\`ENTRY -> SETTLE -> AMBIENT -> EXIT/RESET\`

The controller distinguishes:

\- genuine route entry;

\- internal content selection;

\- filtering/search rerender;

\- modal/detail transition;

\- task/status update;

\- selected-content media transition.

Only genuine route entry triggers full ENTRY choreography.

Internal updates use shorter lightweight transitions.

\---

**# 3. Wide and ultrawide composition contract**

At >=1920 px and representative ultrawide widths:

\- route art/depth may occupy side fields around bounded content;

\- side fields remain visually intentional;

\- forms/cards are not stretched merely to consume width;

\- route-specific artwork uses safe anchoring/cropping;

\- readability and focus remain stable.

A scene may expose conceptual route parameters such as:

\`\`\`js

{

  artAnchor,

  wideDepthScale,

  wideLightPosition,

  ambientAmplitude,

  heroSafeZone

}

\`\`\`

Names are illustrative; behavior is authoritative.

\---

**# 4. Canonical provider search options**

Domain UI never passes vendor-specific payload fields.

Conceptual contracts:

\`\`\`js

searchTitles(query, {

  kind,

  genres,

  yearFrom,

  yearTo,

  page,

  cursor

})

searchGames(query, {

  genres,

  tags,

  platforms,

  releaseFrom,

  releaseTo,

  page,

  cursor

})

searchDestinations(query, {

  themes,

  season,

  budget,

  duration,

  region,

  page,

  cursor

})

\`\`\`

Each canonical criterion maps to one classification:

\`provider-side | canonical-post-filter | local-only | unsupported\`

Provider adapters map only supported fields.

Unsupported criteria are not silently ignored.

Post-filtering must account for provider pagination and must not imply that one page is exhaustive global coverage.

\---

**# 5. Provider media roles**

Canonical roles:

Movies/Series:

\- poster

\- backdrop

Games:

\- cover

\- background/key art

Destinations:

\- card

\- hero

Each role has independent:

\- loading;

\- success;

\- failure;

\- fallback;

\- race ownership.

Failure of one role does not invalidate another valid role.

\---

**# 6. Game Add transaction**

A provider game Add is one logical transaction.

Conceptual flow:

\`\`\`text

provider search result

 -> fetch/resolve required detail

 -> normalize metadata

 -> sanitize

 -> validate

 -> infer tracker type

 -> user confirms/corrects tracker type

 -> resolve supported progression/template data if required

 -> prepare game record

 -> prepare tracker record

 -> prepare dependent progression/template state

 -> atomic/rollback-safe persist

 -> UI success

\`\`\`

UI success is prohibited before required persistence succeeds.

If the game record persists but required dependent tracker creation fails, the logical Add has not completed successfully.

\---

**# 7. Game tracker inference architecture**

Inference uses signals such as:

\- provider genres/tags;

\- MMO/live-service tags;

\- recurring/seasonal/service model;

\- campaign/story metadata;

\- known curated mappings;

\- progression metadata;

\- explicit user correction.

Do not infer by fuzzy title similarity.

Canonical types:

\`\`\`text

weekly

story

custom

\`\`\`

User correction becomes user-owned state.

Provider refresh cannot silently overwrite confirmed tracker type.

\---

**# 8. Weekly tracker source contract**

A weekly tracker template is game-specific data.

Approved sources:

1\. provenance-documented curated local template;

2\. legitimate external recurring-activity source via dedicated adapter;

3\. user-authored custom template.

Conceptual schema:

\`\`\`js

{

  gameIdentity,

  source,

  sourceVersion,

  cadence: "weekly",

  groups: [

    {

      id,

      title,

      objectives: [...]

    }

  ]

}

\`\`\`

Rules:

\- stable IDs;

\- explicit source/version;

\- no cross-game copying of unrelated objectives;

\- reset semantics are data-driven where possible.

\---

**# 9. Progression-data source boundary**

Full mission/quest/objective data is a separate concern from ordinary game-catalog metadata.

A game-catalog provider such as RAWG/IGDB or another catalog must not be assumed to contain complete walkthrough/progression data.

Before a game is marked \`complete progression\`, define a progression-source contract containing:

\`\`\`text

source/provider

access mode: API | curated-local | approved maintained dataset

license/terms/attribution

source version/update marker

completeness: complete | partial | unknown

available hierarchy depth

mission/quest coverage

objective/step coverage

stable identity strategy

\`\`\`

If progression data comes from an external service:

\- use a separate provider-neutral server adapter;

\- keep credentials server-side;

\- validate inputs;

\- prevent arbitrary proxy behavior;

\- respect rate/terms/licensing constraints.

If progression data is curated locally:

\- store provenance beside the dataset;

\- use deterministic stable IDs;

\- record source/update version.

No scraping or unlicensed walkthrough ingestion.

No generated/hallucinated mission content.

\---

**# 10. Campaign progression manifest**

Conceptual schema:

\`\`\`js

{

  gameIdentity,

  completeness: "complete|partial|unknown",

  source,

  sourceVersion,

  groups: [

    {

      id,

      type: "act|chapter|region|level",

      title,

      order,

      missions: [

        {

          id,

          title,

          order,

          objectives: [

            {

              id,

              title,

              order

            }

          ]

        }

      ]

    }

  ]

}

\`\`\`

A \`complete\` declaration is allowed only when the approved source supports that claim.

Stable IDs are required so progress survives source updates.

\---

**# 11. Supported complete-progression Add behavior**

For a game with an approved complete progression integration:

\- resolve the relevant progression manifest during supported Add/enrichment;

\- populate canonical groups/missions/objectives automatically;

\- do not require the user to manually rebuild the campaign;

\- persist tracker + progression state consistently;

\- do not report the tracker as complete if manifest loading fails.

If external progression retrieval is temporarily unavailable:

\- game metadata may still be safely persisted according to the transaction contract;

\- tracker must explicitly remain incomplete/unavailable;

\- UI must not falsely claim complete progression.

\---

**# 12. Progression ownership and merge**

Progression metadata may update:

\- source display text;

\- grouping metadata;

\- canonical order;

\- source version;

\- provider-owned descriptions.

User-owned state remains protected:

\- completion;

\- notes;

\- custom tasks;

\- custom objectives;

\- sessions;

\- journal;

\- confirmed tracker type.

Merge rules:

\- map by stable deterministic identity;

\- never wipe completion because source text changed;

\- unmatched user-owned entries are preserved or explicitly reconciled;

\- duplicates are prevented.

\---

**# 13. Unsupported progression state**

When no approved complete source exists:

\`\`\`text

progressionCompleteness = unavailable | partial

\`\`\`

UI behavior:

\- explain that complete mission data is unavailable/incomplete;

\- offer generic/custom story tracker;

\- do not present generic items as official complete campaign content;

\- permit later enrichment;

\- preserve prior user progress.

\---

**# 14. Credentials and live-verification boundary**

Mocks prove:

\- adapter contracts;

\- parsing;

\- state machines;

\- deterministic failure handling;

\- race handling;

\- normalization behavior.

Live credentials prove:

\- real authentication;

\- real upstream compatibility;

\- real search;

\- real details;

\- real media;

\- real pagination;

\- real provider behavior.

Mocks and live evidence remain separate evidence classes.

The agent never fabricates credentials.

\---

**# 15. Filter mapping architecture**

Maintain a domain-level filter capability map.

Conceptual example:

\`\`\`js

{

  movies: {

    kind: "provider-side",

    genre: "provider-side",

    year: "provider-side"

  },

  games: {

    platform: "provider-side",

    genre: "provider-side",

    someLocalPreference: "local-only"

  }

}

\`\`\`

The exact mapping depends on the delivered provider.

UI behavior must reflect the actual mapping.

No silent unsupported behavior.

\---

**# 16. Media security and fallback**

Provider media must use the approved safe media boundary.

Requirements:

\- allowlisted provider hosts;

\- no arbitrary browser-supplied URL fetch;

\- HTTPS where available;

\- image content-type validation;

\- response-size limits;

\- timeout;

\- bounded cache;

\- no credential/header leakage;

\- role-specific fallback.

Fallback selection order follows delivered provider terms and local/offline contracts.

\---

**# 17. Phase 26 — final whole-project integrity architecture**

Phase 26 does not create another implementation architecture.

It verifies that all previously delivered architecture layers work together coherently as one finished release candidate.

The final audit treats OneSpace as this integrated stack:

\`\`\`text

Git / repository state

  -> source and domain structure

  -> local server and secret boundary

  -> browser shell / router / shared UI

  -> domain modules

  -> provider adapters and media

  -> persistence / backup / migration

  -> cinematic / theme / icon systems

  -> responsive / accessibility behavior

  -> tests / persistent evidence

  -> authority documentation

\`\`\`

A release-readiness claim requires consistency across the complete stack, not merely a passing isolated subsystem.

**## 17.1 Final-state evidence model**

Earlier VERIFIED evidence is preserved.

Phase 26 follows these rules:

\- unchanged evidence may be reused when later implementation did not invalidate it;

\- any subsystem changed after its earlier acceptance must receive affected re-verification;

\- every top-level route and major integrated system must still receive final-state coverage;

\- final console/network/runtime health must be inspected;

\- the complete automated suite must run after the last implementation fix;

\- historical pass counts are context, not final proof.

Phase 26 evidence should act as an integration manifest that points to reused valid evidence and records newly executed final-state checks.

Destructive import/reset/failure-path verification belongs on a disposable test origin so final acceptance does not damage the user's normal local-storage origin.

**## 17.2 Repository and module integrity**

The final architecture includes repository hygiene as a release concern.

Verify:

\- intentional file placement;

\- valid script/style/asset references;

\- valid classic-script ordering;

\- one owner per mount/controller responsibility;

\- no obsolete duplicate loaded module;

\- no accidental cross-domain ownership regression;

\- no temporary/debug file treated as product source;

\- no OneSpace work written outside the project scope.

The audit does not use destructive reset/clean operations to create the appearance of correctness.

**## 17.3 Final secret boundary**

The production credential flow remains:

\`\`\`text

ignored local secret

  -> OneSpace local server

  -> provider-neutral adapter

  -> configured provider

\`\`\`

Never:

\`\`\`text

real credential

  -> browser JavaScript / HTML

  -> browser-readable file

  -> screenshot / persistent evidence

  -> client-visible error/log

\`\`\`

Final verification covers:

\- `.gitignore`;

\- tracked-file state;

\- representative secret-path denial;

\- browser Source/Network isolation;

\- server-side credential ownership;

\- log/error redaction;

\- evidence safety.

A confirmed real-secret exposure is a Gate 26 failure until appropriate remediation/rotation is recorded.

The final audit also inspects Git path history for secret/config paths without echoing raw secret values. If a real credential was ever committed or pushed, the rotation/revocation state and chosen history-remediation decision are part of release-readiness evidence.

**## 17.4 Final UI-system integration**

The assembled shell must preserve one coherent product language across:

\- navigation;

\- page hierarchy;

\- cards/forms/dialogs;

\- iconography;

\- typography/spacing;

\- themes/palettes;

\- focus/accessibility behavior;

\- responsive layouts;

\- route-specific cinematic environments.

The audit is explicitly allowed to identify integration defects that isolated phase checks could not reveal.

**## 17.5 Final icon architecture**

The shared application-control icon contract remains authoritative.

Phase 26 verifies the final UI, including controls added or changed after Phase 21.

Requirements remain:

\- shared action semantics;

\- coherent SVG geometry/weight/alignment;

\- accessible icon-only controls;

\- no accidental emoji/unrelated Unicode control replacement;

\- legitimate brand/provider/content identity exceptions remain untouched.

**## 17.6 Final cinematic architecture**

The unified scene controller remains the single owner.

Phase 26 verifies the final combination of:

\`\`\`text

route base scene

 + ENTRY / WAKE-UP

 + SETTLE

 + AMBIENT / ALIVE

 + EXIT / RESET

 + wide / ultrawide environmental composition

 + selected-content media layer

 + Full / Subtle / Off

 + reduced-motion behavior

 + route cleanup

\`\`\`

No second animation controller is introduced for final verification.

A scene fails final acceptance if motion technically exists but the route still appears static, generic, visually empty or indistinguishable from another domain.

**## 17.7 Final provider architecture**

The provider boundary remains:

\`\`\`text

Browser

  -> OneSpace local server

  -> provider-neutral adapter

  -> configured external provider

\`\`\`

Phase 26 verifies the integrated behavior of:

\- live search/details;

\- filter mapping;

\- normalized media/data;

\- explicit Add/Save;

\- persistence;

\- refresh ownership;

\- offline reopen;

\- degraded/error state;

\- async race ownership;

\- media safety;

\- secret isolation.

Mock evidence remains adapter/contract evidence and can never substitute for live configured E2E evidence.

Every intended production provider must be `LIVE VERIFIED` before Gate 26 unless the user explicitly approved a provider-specific terminal exception. `NOT CONFIGURED` and mock-only evidence are not final release-readiness states for an intended production provider.

**## 17.8 Final live-to-offline invariant**

For each intended production rich domain, release readiness includes the real configured provider path unless the user explicitly approved a provider-specific terminal exception:

\`\`\`text

live provider

 -> search/details

 -> explicit Add/Save

 -> validated local persistence

 -> reload

 -> provider unavailable

 -> saved record still meaningful

\`\`\`

User-owned state remains authoritative throughout the transition.

**## 17.9 Final persistence architecture**

Final audit covers:

\- canonical storage validation;

\- transactional/rollback behavior;

\- provider-origin records;

\- tracker/progression state;

\- reload;

\- v2/v3/v4 import compatibility;

\- current v4 export;

\- reset semantics.

Provider refresh/enrichment may update provider-owned metadata but must not erase user-owned progress, notes, custom tasks, tracker choice, sessions, journal or saved-state fields.

**## 17.10 Final responsive and accessibility architecture**

Final acceptance is performed on the assembled product, not one isolated page.

The final matrix includes:

\- 390;

\- 760;

\- 1024;

\- 1440;

\- 1920;

\- representative ultrawide, preferably approximately 3440×1440.

The architecture must preserve readable content bounds while using surrounding wide-screen space for meaningful environmental composition.

Keyboard, focus, ARIA, touch-target and reduced-motion contracts remain product-wide invariants.

**## 17.11 Defect handling discovered by Phase 26**

If the final audit discovers a defect:

\`\`\`text

detect

 -> identify owning subsystem

 -> minimally fix

 -> affected automated regression

 -> affected browser / visual verification

 -> persistent evidence update

 -> continue Phase 26

\`\`\`

Do not create a new parallel subsystem and do not formally reopen a historical phase solely to record the final-audit fix.

**## 17.12 Authority consistency boundary**

Before Gate 26, the five authority documents must agree on:

\- delivered scope;

\- phase/gate order;

\- provider architecture and live-vs-mock truth;

\- secret handling;

\- cinematic behavior;

\- icon behavior;

\- Games progression behavior;

\- global filter semantics;

\- backup compatibility;

\- final verification state.

Phase 26 checks technical consistency.

Phase 13.3 performs the final documentation reconciliation and wording cleanup.

\---

**# 18. Final architecture reconciliation**

Only after Gate 26 may Phase 13.3 reconcile this architecture document against the actual delivered implementation.

Do not leave planned-but-undelivered architecture written as delivered fact.

If actual implementation differs from this plan:

\- document the approved delivered architecture;

\- retain unresolved requirements visibly in verification;

\- do not silently weaken the requirement after failure.