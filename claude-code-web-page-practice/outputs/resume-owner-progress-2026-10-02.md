# Continued owner review — in progress

Current repository baseline: main, `979d3b4ea49b8052c286271b602c73b73d87db09`.
This is an intermediate recovery checkpoint, not final verification or user acceptance.

The previous 173 landing-control rows are retained. The ongoing raw matrix is appended at:
`C:/Users/btodorovic/Documents/Codex/2026-10-02/files-pasted-by-the-user-onespace/work/review-control-trials.json`.
Earlier failed attempts and browser-connection retries remain in that file. A successful tool action is not, by itself, proof of correct application behavior.

## Completed owner workflows so far

- Work: disposable project/item/task creation, editing, validation, completion/reopening, repeat completion, history, cancellation, confirmation and actual deletion; reload checks.
- Personal: goals/routines/habits creation and editing, validation, completion/repetition, cancellation, confirmation and actual deletion; reload checks. Empty Add fields now provide native accessible validation, including whitespace constraints.
- Explore: manual location/trip editing, dates/notes/day itinerary, date-order rejection, saved-location details/editing, status and ordering, disabled ordering boundaries, removal confirmation/deletion, reload; exact/partial/unmatched/empty local searches, paging, filter/disclosure keyboard paths, bundled shortlist saves and removal; 24 current shortcut action buttons exercised.
- Games: eight existing compatibility tabs exercised with pointer and native roving arrow-key navigation followed by Enter/Space; library search/filter controls and Add/Edit Game forms; disposable story game created and edited. Mission tracker review is underway.

## Proven fixes

- Nested Work dialogs now have stack-order z-indexes, inert lower-layer pointer exclusion, and restoration of existing z-indexes.
- Personal empty Add forms now validate the actual required text and receive accessible names.
- Scene entry cleanup handles activation while the document is hidden and hiding during entry.
- Explore's offered categories/interests previously exceeded the storage preference validator. Its validator now accepts current UI choices and preserves legacy choices; a regression test exercises every offered saved preference. Six Explore preservation tests pass.
- The remaining visible Games section label says “YOUR GAMES”. Existing handlers, IDs and stores remain intact.

## Current limitations and remaining work

The in-app browser did not expose a targetable native file chooser for Explore's local-image upload. File selection remains unverified; no unsupported upload API or hidden browser-state mutation was used. Existing owner-callback tests cover local PNG data and provenance, but do not replace native chooser evidence.

The browser occasionally removes owned review tabs. Raw failures are retained, and qualified retries reconnect through the supported Browser API. Inactive Games tabs are intentionally outside the ordinary Tab order; the audit now uses their existing native roving keyboard path.

Remaining: Games tracker/session/journal/suggestion/resource workflows; remaining current shortcut/support controls; affected shared-modal regression subset; final visual/motion/geometry/performance/startup/search/portal/fallback/race/runtime checks and full fresh tests after the last production edit. Full viewport scene assets and provenance are installed, but final acceptance remains pending.

Games step 11: IN PROGRESS / IMPLEMENTED / NOT VERIFIED. Steps 12 and 13 remain unstarted. Gate R3 stays OPEN; R4 and R5 remain pending. Do not ask native Games acceptance yet.
