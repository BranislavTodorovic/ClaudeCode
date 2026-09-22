# OneSpace — Revised Implementation and Architecture Plan V2

## Authority and purpose

This document explains the architecture and design rationale behind the standing plan.

Execution order, item status, evidence and gates are controlled by `docs/IMPLEMENTATION-STEPS.md`.

Product scope is controlled by `docs/agent-instructions.md`.

This document must never silently expand or weaken those authorities.

---

# 1. Product model

OneSpace is a local-first personal dashboard covering:

- Home aggregation;
- Work / Projects / Backlog / History;
- Personal goals, routines and habits;
- Explore / travel inspiration;
- Games;
- Movies & Series;
- Shortcuts;
- Productivity;
- Notes;
- Settings.

Home is the only cross-domain aggregator.

Every other page remains strictly domain-owned.

User-owned records stay local. There are no required user accounts, cloud sync or multi-user collaboration.

---

# 2. Core compatibility contracts

Preserve unless an explicit checklist item changes them:

- root `index.html` entry;
- local origin behavior at `http://localhost:8973/`;
- router and route aliases;
- existing `localStorage` keys;
- backup format version 4;
- complete v2/v3/v4 import support;
- public browser globals;
- classic-script load-order dependencies;
- UMD dual-export patterns;
- `shared/storage-utils.js` as persistence validation boundary;
- existing modal/focus/accessibility conventions.

No architecture improvement may silently break previously saved user data.

---

# 3. Local-first does not mean local-only

User data remains local.

Provider-backed discovery is optional enrichment for rich-content domains.

Architecture:

```text
Browser
  -> OneSpace local server
  -> provider-neutral adapter
  -> configured external provider
```

The browser never receives provider credentials and does not depend on raw provider response shapes.

When provider functionality is unavailable, local/saved content remains usable and global discovery displays an explicit degraded state.

---

# 4. Provider domains

## 4.1 Movies & Series

Global title discovery may use TMDB or the configured equivalent.

Normalize available:

- source/provider ID;
- movie/series type;
- title;
- overview;
- poster;
- backdrop;
- genres;
- release/year;
- runtime;
- series metadata where available;
- attribution/source metadata where required.

## 4.2 Games

Global game discovery may use IGDB, RAWG or the configured equivalent.

Normalize available:

- source/provider ID;
- title;
- description;
- cover;
- background/key art;
- genres/tags;
- platforms;
- release metadata;
- tracker-inference signals.

## 4.3 Explore / Destinations

V2 adds provider-neutral global place/destination discovery.

Provider selection is implementation work because licensing, imagery and practical API access must be evaluated.

Normalize available:

- source/provider ID;
- destination name;
- city/region/country;
- summary;
- details/context;
- categories/themes;
- season/trip-character hints;
- budget/duration hints;
- card media;
- hero media;
- source/license/attribution metadata.

The curated 12-destination catalog remains the stable offline recommendation set.

---

# 5. Provider adapter contract

Provider adapters own vendor-specific:

- authentication;
- upstream URL construction;
- pagination translation;
- error translation;
- raw payload parsing.

Domain UI sees normalized OneSpace records.

Conceptual operations:

```text
searchTitles(query, options)
getTitleDetails(providerId, kind)

searchGames(query, options)
getGameDetails(providerId)

searchDestinations(query, options)
getDestinationDetails(providerId)
```

Names are illustrative; behavior is authoritative.

---

# 6. Provider search state machine

Provider search supports:

- idle;
- debounced pending;
- loading;
- success;
- empty;
- load-more/pagination;
- timeout;
- auth/configuration failure;
- rate-limit;
- offline/network failure;
- provider error;
- invalid/malformed upstream response;
- partial metadata.

Every request has ownership/generation.

A stale response or stale error cannot replace newer UI.

Closing a detail, selecting another item or navigating away invalidates the old detail generation.

---

# 7. Local + provider search composition

Local/catalog results are immediate.

Provider results arrive asynchronously.

The UI keeps provenance understandable, for example:

- `In your catalog`
- `Search results`

Do not present the local catalog as successful global results when the provider is unavailable.

Provider results require explicit Add/Save/Track before they become user-owned.

---

# 8. Deterministic provider identity

Provider-origin identity is based on:

`domain/kind + provider/source + provider item ID`

Do not use title/name alone.

Adding the exact same provider identity is idempotent.

Fuzzy title/name similarity cannot silently merge records.

Deterministic mapping may link a provider result to a known local seed record; otherwise keep records distinct or require explicit reconciliation.

---

# 9. Canonical validation and persistence

Persisting a provider result follows:

1. normalize;
2. sanitize;
3. validate canonical schema;
4. write;
5. verify success/read-back where applicable;
6. update UI.

UI must not claim success before persistence succeeds.

Provider normalization never bypasses `shared/storage-utils.js`.

Optional provider fields should remain backward-compatible with legacy records.

---

# 10. Provider metadata ownership vs user state

Provider-owned metadata may be refreshed.

User-owned state must not be silently overwritten.

Examples of user-owned state:

- library/watch status;
- notes;
- favorites;
- confirmed game tracker type;
- objectives/tasks/progress;
- sessions;
- journal;
- shortlist/saved/trip-board state.

Merge policy must preserve user state even when upstream fields disappear or change.

---

# 11. Multi-key transactions

One logical user action can touch multiple structures.

Examples:

- game + tracker/task initialization;
- destination + saved/trip-board relation;
- title + tracking/watch state where applicable.

Use existing transactional/rollback semantics when consistency spans multiple keys.

A failed partial write cannot be reported as a completed Add/Save.

---

# 12. Offline persisted provider records

A provider-origin record must remain meaningful without a fresh provider request.

Persist enough normalized metadata for local identification and normal user state.

Provider refresh is enhancement, not a prerequisite to reopen a saved record.

Provider outage never deletes a valid local record.

---

# 13. Secrets and configuration

Real credentials are:

- server-side only;
- ignored by Git;
- absent from browser JS and HTML;
- absent from committed examples;
- inaccessible through the static server.

Committed configuration contains placeholders only.

If a credential is ever committed/pushed, rotate/revoke it before continuing.

---

# 14. Server input validation

Provider endpoints validate/allowlist browser input.

Bound applicable:

- query length;
- kind/type;
- provider;
- provider ID;
- page/page size;
- pagination cursor;
- supported method/route.

Do not blindly forward arbitrary query parameters upstream.

---

# 15. No open proxy / SSRF

The server does not fetch arbitrary browser-supplied URLs.

Adapters choose known upstream endpoints server-side.

Provider and media hosts are allowlisted.

Browser input cannot turn OneSpace into a generic external, localhost or private-network fetcher.

---

# 16. Provider media architecture

Where external provider art is needed and the browser-network contract requires mediation:

```text
Browser
  -> OneSpace local media route
  -> known provider media host
```

The browser receives a safe local media reference or provider-neutral media identity, not an arbitrary user-supplied upstream URL.

Media handling enforces:

- known provider;
- host allowlist;
- HTTPS upstream where supported;
- image content type;
- timeout;
- sensible response-size bound;
- no credential leakage.

Do not proxy arbitrary HTML/scripts/documents through an image route.

---

# 17. Media caching and licensing

Caching is allowed only where provider terms permit it.

Every cache is bounded by finite entry count and/or storage size and has an expiry/invalidation policy.

Clearing provider/media cache cannot remove user-owned records.

If persistent artwork caching is not permitted, save metadata/reference and use a deterministic local fallback when offline.

Licensing/attribution terms override convenience.

---

# 18. Media roles

Rich domains distinguish media by role:

- search/card thumbnail;
- poster/cover;
- hero;
- backdrop/environment;
- fallback.

Do not load full hero/backdrop media for every search row.

Use role-appropriate source size, lazy loading and responsive media where applicable.

Do not upscale tiny thumbnails into large cinematic surfaces.

---

# 19. Untrusted provider data

Provider text is untrusted input.

Never inject raw provider HTML.

Use safe text/escaping helpers.

Provider-origin URLs pass protocol validation and safe external-link conventions.

Provider errors returned to the browser are normalized and sanitized; no credentials, raw Authorization headers or secret-bearing stack traces are exposed.

Server logs redact credentials.

---

# 20. Provider cache

Short-TTL query/details caching may reduce quota/load.

Requirements:

- deterministic key;
- bounded size;
- expiry;
- stale/fresh semantics defined;
- clearable without deleting user records;
- identical in-flight request dedup where useful.

Do not issue provider requests for empty input or unnecessarily repeat valid cached requests.

---

# 21. Mock and live evidence

Automated tests use deterministic mock providers.

Mock verification proves adapter/contract behavior.

Live configured provider smoke is a separate evidence class.

Never claim live E2E verification from mocks.

---

# 22. Games tracker inference

Provider metadata feeds an initial tracker recommendation.

Live-service/MMO/looter/gacha/battle-royale-like signals generally suggest weekly.

Campaign/story-rich/single-player-like signals generally suggest story/chapter.

The inferred choice is visible and user-correctable before save.

Once confirmed, tracker type is user-owned state and provider refresh cannot silently change it.

---

# 23. Explore two-source model

Explore has:

1. curated/local recommendation catalog;
2. global provider search.

The curated catalog remains deterministic and offline.

Global discovery is broader but provider-dependent.

Saving a global destination normalizes it into a durable local record.

Curated recommendation ranking must not become network-dependent.

---

# 24. Unified cinematic architecture

One scene controller owns:

- route entry;
- settle;
- ambient state;
- exit/reset;
- pointer parallax;
- reveal;
- reduced-motion behavior.

Lifecycle:

`ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET`

Projects remains a Work alias.

No V2 feature creates a second animation controller.

---

# 25. Domain base scenes

Base scene identities remain:

- Home — observatory / command deck;
- Work — drafting room / command centre;
- Personal — calm ritual space;
- Explore — world atlas / travel window;
- Games — game-world spotlight;
- Movies & Series — theater / streaming marquee;
- Shortcuts — launch wall;
- Productivity — focus/timer studio;
- Notes — quiet capture desk;
- Settings — control room.

Base scenes work even with no provider art.

---

# 26. Selected-content environmental art

Movies, Games and Explore may add one optional selected-content media layer behind the existing scene.

Layer stack conceptually:

```text
base domain scene
+ optional selected-content media
+ depth/glow/ambient treatment
+ contrast scrim
+ normal content UI
```

The environmental layer is decorative and subordinate.

It cannot move/capture controls or reduce readability.

---

# 27. Content-art ownership and races

A media load applies only if all still match:

- current route;
- selected record identity;
- current content-art generation.

Rapid A -> B -> C selection must finish on C.

Internal selection uses a light crossfade/transition, not full route ENTRY.

Leaving the domain clears transient content-art state and prevents scene leakage.

---

# 28. Motion accessibility

Full / Subtle / Off remain supported.

`prefers-reduced-motion` removes optional motion entirely rather than merely slowing it.

No essential information depends on motion.

Coarse-pointer/touch devices do not depend on hover or pointer parallax.

---

# 29. Repository/domain ownership

Keep new behavior out of the inline shell where a domain/shared module is appropriate.

Home remains the only cross-domain aggregator.

Provider transport can be shared/server-side; domain normalization/UI mapping remains domain-owned.

Provider work must not reintroduce the cross-domain leaks removed by Phase 3.

---


# 30. Global modern icon design system

OneSpace uses one coherent application-control icon language across every tab.

The preferred implementation is shared inline SVG or equivalent reusable local SVG markup; do not introduce an external icon CDN or a mixed third-party icon dependency merely for polish.

The icon system applies to application UI such as:

- navigation;
- page/section headings;
- buttons;
- search/filter/sort;
- add/edit/remove/save/restore;
- dialogs and sheets;
- favorite/status actions;
- expand/collapse;
- retry/error/empty-state actions.

Shared actions should reuse the same recognizable glyph where context permits.

Visual consistency includes:

- geometry/viewBox conventions;
- stroke/fill philosophy;
- stroke weight;
- optical size;
- alignment;
- spacing;
- active/disabled/focus treatment.

Domain-specific icons may have distinct silhouettes, but they must still belong to the same visual family.

Modernization is **selective**, not churn: an existing icon that is already clear, modern, aligned and consistent should be retained.

Application UI must not fall back to random emoji or Unicode symbols as substitute control icons.

Accessibility remains mandatory:

- icon-only actions require an accessible name;
- focus remains visible;
- touch targets remain adequate;
- required ARIA state remains accurate;
- decorative icons are hidden from assistive technology when appropriate;
- text labels are not removed when the icon alone would be ambiguous.

Legitimate source/content identity is explicitly outside the UI-glyph normalization rule. Preserve appropriate:

- website favicons;
- provider attribution marks;
- service/game/movie logos;
- other content-owned brand marks.

The icon system is verified across all tabs, supported themes and responsive widths. It must not clip, drift off baseline, become blurry, or lose contrast at supported sizes.


# 31. Backup/migration contract

Current export: version 4.

Supported complete imports: v2, v3, v4.

Optional provider metadata should not force a version bump.

A version bump requires explicit migration design, fixtures and old/new round-trip tests.

Final acceptance includes provider-origin records in export/import.

---

# 32. Verification strategy

Automated coverage includes:

- normalization;
- pagination;
- cancellation;
- error classes;
- timeout;
- rate-limit;
- offline;
- malformed/partial responses;
- duplicate prevention;
- refresh merge ownership;
- storage failure rollback;
- XSS-safe rendering;
- open-proxy/SSRF rejection;
- media validation;
- content-art race ownership.
- global icon consistency, accessibility and responsive visual quality.

Browser acceptance includes:

- local+provider search;
- Add/Save;
- reload/offline;
- media/fallback;
- cinematic environment;
- keyboard/focus/ARIA;
- responsive layouts;
- console/network health.

Live provider smoke is separate from mock automation.

---

# 33. Final architectural principle

Provider integrations must be removable without destroying OneSpace.

If every provider is unavailable:

- user-owned records survive;
- curated catalogs survive;
- Work/Personal/Productivity/Notes/Shortcuts/Settings survive;
- saved Movies/Games/Destinations remain locally meaningful;
- base scenes survive;
- global discovery becomes explicitly unavailable.

That is the required definition of local-first.
