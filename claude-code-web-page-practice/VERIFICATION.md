# OneSpace — Verification Plan and Final Acceptance Runbook

> [!IMPORTANT]
> **Current verification authority and historical-record notice**
>
> This document defines the final verification procedure for the current OneSpace implementation.
>
> The acceptance run performed on September 17, 2026 is historical evidence only. It must not be used as proof that the current implementation is verified.
>
> Current authority order:
>
> 1. `docs/agent-instructions.md` — current standing plan and product requirements; defines **WHAT** must be delivered.
> 2. `docs/IMPLEMENTATION-STEPS.md` — execution and verification authority; defines **HOW implementation completion is proven**, including statuses, evidence, phase gates and resume behavior.
> 3. `docs/REVISED-IMPLEMENTATION-PLAN.md` — historical/non-authoritative implementation brief pending reconciliation in Phase 13.3.
> 4. `VERIFICATION.md` — this document; defines and records the final acceptance run.
>
> If this document conflicts with `docs/agent-instructions.md` or `docs/IMPLEMENTATION-STEPS.md`, those documents take precedence.
>
> The historical Revised Implementation Plan must not reintroduce requirements that are absent from the current standing plan.
>
> In particular, historical requirements for provider-backed global destination discovery must not be reintroduced unless they are present in the current standing plan or explicitly approved by the user.
>
> A completely fresh verification run is required after Phase 12 implementation work is complete and before Gate 13.3 may pass.

---

# 1. Purpose

This verification run exists to prove that the delivered OneSpace application:

* satisfies the current standing plan;
* satisfies every applicable item in `docs/IMPLEMENTATION-STEPS.md`;
* preserves all locked storage, routing, backup and compatibility contracts;
* works through real browser user flows rather than only through unit tests;
* survives reload, error, cancellation and persistence scenarios;
* behaves correctly across desktop, tablet and mobile widths;
* is keyboard accessible for the tested workflows;
* respects reduced-motion and scene-intensity settings;
* does not expose provider credentials or local secrets;
* contains no unresolved regression hidden by a green aggregate test count;
* and has persistent evidence sufficient for another agent/session to independently reconstruct the acceptance result.

The purpose is not to prove that code exists.

The purpose is to prove that the application behaves as required.

---

# 2. Verification status model

Use only these verification results:

* **PASS** — the exact acceptance criterion was executed and passed with retained evidence.
* **FAIL** — the acceptance criterion was executed and failed.
* **BLOCKED** — the check could not be executed; the exact blocker is documented.
* **NOT RUN** — the check has not yet been executed.
* **APPROVED EXCEPTION** — the original requirement cannot be delivered as written and the approved alternative, reason and evidence are recorded.

Do not use ambiguous results such as:

* mostly passed;
* appears correct;
* probably fixed;
* verified except;
* looks good;
* tests are green so assumed passed.

Any FAIL, BLOCKED or NOT RUN result that applies to a mandatory requirement prevents the final verification result from being PASS.

---

# 3. Non-negotiable completion rule

The application is not verified merely because:

* automated tests are green;
* a feature exists in source code;
* screenshots were captured;
* a phase previously said `Verified`;
* a previous chat summary said a phase was complete;
* a phase-level `acceptance.json` exists;
* browser smoke tests open the routes;
* or no obvious error is visible.

Final verification requires requirement-level evidence.

Phase 12 must re-run final regression even for items already verified during their implementation phases.

Phase 12 does not retroactively fix missing phase-local verification. Any deficiency found during the final run must be fixed, re-tested and recorded before final delivery.

---

# 4. Required evidence structure

Final evidence belongs under:

```text
docs/implementation-evidence/final/
```

Recommended layout:

```text
docs/implementation-evidence/final/
├── metadata.json
├── automated-tests.txt
├── repository-integrity.txt
├── route-smoke.json
├── console-network.json
├── storage-backup.json
├── security.json
├── offline-provider.json
├── keyboard-accessibility.json
├── reduced-motion.json
├── responsive-layouts.json
├── interaction-inventory.json
├── visual-comparison.json
├── work/
├── settings/
├── scenes/
├── providers/
├── shortcuts/
├── games/
├── movies/
├── explore/
├── personal/
└── screenshots/
```

Evidence filenames may differ, but they must remain understandable without conversation context.

Every important result must map back to:

* a checklist ID;
* an acceptance requirement;
* or a named final verification check.

A total test count is supporting evidence, not complete evidence by itself.

---

# 5. Pre-verification startup procedure

Before running any acceptance test, re-establish the project state from the repository.

## Step 5.1 — Read the authority documents

Read completely, in this order:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `docs/REVISED-IMPLEMENTATION-PLAN.md`
4. `VERIFICATION.md`

### Why

Context compaction and previous session summaries may be incomplete or stale. Repository documents are the persistent source of truth.

### PASS condition

The active phase, current requirements, historical requirements and verification rules are clearly distinguished.

---

## Step 5.2 — Inspect Git state

Run:

```bash
git status --short --untracked-files=all
git diff
git diff --cached
```

Record the current branch and commit:

```bash
git branch --show-current
git rev-parse HEAD
```

### Why

The verification report must identify exactly which implementation was tested.

### PASS condition

The tested commit/state is recorded. Unexpected changes are investigated before verification continues.

---

## Step 5.3 — Reconcile the checklist

Inspect the complete `docs/IMPLEMENTATION-STEPS.md`.

Count and classify all checklist items by status.

Confirm:

* no earlier phase has unresolved `PENDING`;
* no earlier phase has unresolved `IMPLEMENTED / NOT VERIFIED`;
* no earlier phase has unresolved `BLOCKED`;
* every `DEFERRED TO PHASE 12` item is explicitly allowed by the standing plan;
* every `APPROVED EXCEPTION` has a reason and evidence.

### Why

Final testing must not hide unfinished implementation work.

### PASS condition

The checklist is internally consistent and its Progress table matches detailed phase status.

---

# 6. Mandatory Phase 0–9 audit prerequisite

Before Phase 10 may begin, the strict Phase 0–9 audit defined in `IMPLEMENTATION-STEPS.md` must have passed.

Verify that its evidence exists.

At minimum confirm:

* every Phase 0–9 checked box was audited;
* every Phase 0–9 gate was re-run;
* visual phases were inspected visually;
* security and secrets checks were executed;
* storage and backup invariants were preserved;
* interrupted/context-compacted work was reconciled;
* Progress-table contradictions were corrected.

### PASS condition

The mandatory Phase 0–9 audit is recorded as clean, or all issues found by the audit have subsequently been fixed and re-verified.

---

# 7. Repository and structural integrity

## Step 7.1 — Run the complete automated suite

Run:

```bash
node --test tests/
```

Record:

* number of tests;
* passes;
* failures;
* skipped tests;
* duration if available;
* exact command.

### Why

The final report must contain the real final test count, not historical counts such as 31/31, 54, 59, 71 or 79 from intermediate phases.

### PASS condition

All mandatory automated tests pass.

---

## Step 7.2 — JavaScript parse/structure verification

Confirm the recursive parser covers the complete current application source inventory.

Confirm:

* application JS parses;
* inline `index.html` script parses;
* repository-relative `require(...)` references resolve;
* script and stylesheet paths resolve;
* asset references resolve;
* script execution order matches the expected contract;
* no duplicate script execution exists.

### PASS condition

All structural assertions pass against the current repository.

---

## Step 7.3 — Preserve movement/history contract

Run:

```bash
git log --follow games/games.js
```

Also inspect representative moved files from other domains where appropriate.

### Why

The regrouping phase explicitly required history-preserving moves.

### PASS condition

History is preserved across the move.

---

# 8. Static server and route smoke verification

Start the production-style local server:

```bash
node server/_static-server.js
```

Primary entry remains:

```text
http://localhost:8973/
```

Verify all 11 route identities.

Remember:

* there are 11 retained routes;
* Projects is an alias into Work;
* there are 10 distinct page scenes.

For each route verify:

* expected route opens;
* expected title/heading is visible;
* primary controls exist;
* no uncaught console exception;
* no unexpected failed application asset;
* no duplicate mount;
* route change does not corrupt another route.

### PASS condition

All routes pass.

---

# 9. Console and network verification

Across the complete route pass inspect:

* uncaught exceptions;
* rejected promises;
* unexpected 404s;
* unexpected local asset failures;
* unexpected external browser requests;
* duplicate provider calls;
* requests to `config/`;
* requests containing credentials.

Expected deliberately induced failures during specific fallback tests must be documented separately and must not be mistaken for application defects.

### PASS condition

No unexplained runtime error or failed required resource remains.

---

# 10. Work verification

Verify the current consolidated Work experience.

## Step 10.1 — Route/sub-view structure

Verify:

* Board is the default Work sub-view;
* Projects is reachable inside Work;
* Backlog is reachable;
* History is reachable;
* legacy Projects navigation reaches Work with Projects selected.

### Why

The route consolidation must preserve old navigation while presenting one coherent Work domain.

---

## Step 10.2 — Project CRUD

Test:

* create;
* edit;
* validation;
* cancel;
* delete/confirmation if supported;
* reload persistence.

Verify project fields required by the standing plan.

---

## Step 10.3 — Story and defect CRUD

Test:

* create story;
* create defect;
* change type where supported;
* edit analysis;
* edit plan;
* edit execution;
* priority;
* status;
* labels;
* deadline;
* reminder;
* links;
* invalid URL/date rejection.

---

## Step 10.4 — Task lifecycle

Test:

* create task;
* edit task;
* complete/uncomplete;
* delete cancel;
* delete confirm;
* priority;
* due date;
* estimate.

Verify progress counts and visual state agree with stored state.

---

## Step 10.5 — Work-item lifecycle

Test:

```text
open
→ in progress
→ blocked
→ closed
→ backlog
→ reopen
```

Verify:

* closing completes remaining child tasks;
* completion timestamp is stored;
* history/log entry is created;
* closed item leaves active view;
* backlog retains it;
* reopen restores the item;
* historical task completion is retained;
* state survives reload.

---

## Step 10.6 — Filters and sorting

Verify:

* text filtering is live/debounced as designed;
* select filters apply immediately;
* active filter chips can be removed;
* result count updates;
* sort control works;
* focus/caret is preserved where required.

---

## Step 10.7 — Work visual redesign

At 1440 / 1024 / 760 / 390 verify:

* Work visibly reads as a modern development tool;
* Board/Projects/Backlog/History feel coherent;
* cards have clear hierarchy;
* type glyphs are visible;
* status labels are correctly capitalised;
* priority treatment is visible;
* progress bars are meaningful;
* detail drawer works at desktop;
* full-screen sheet behavior works below the breakpoint;
* no historical Focus Rail overlap remains;
* no horizontal overflow exists.

If the implementation exists but looks effectively unchanged from the baseline, visual verification fails.

---

# 11. Domain-boundary verification

Verify Home remains the only cross-domain aggregator.

Confirm:

* Work does not read generic Productivity tasks/notes as Work content;
* Explore does not host Games/Movies/Productivity content that belongs elsewhere;
* Home may aggregate cross-domain summaries;
* Games/Movies page theme attributes do not leak after route changes;
* shared storage no longer directly owns Explore domain logic where Phase 3 removed that dependency;
* shortcut ownership remains correctly scoped.

### PASS condition

Boundary tests pass and browser behavior agrees with them.

---

# 12. Settings and theme verification

Verify:

* Settings groups are explicit, not position/index dependent;
* light/dark is independent from palette selection;
* palette does not silently reset to Classic;
* Deep Space has distinct tokens/appearance;
* every new palette defines required tokens;
* warm-theme requirement is visibly satisfied;
* body/control contrast meets the intended acceptance requirements;
* scene intensity control exists;
* Games sub-theme setting exists;
* Movies sub-theme setting exists;
* Removed shortcuts restore panel exists;
* provider-status panel exists;
* preferences survive reload.

## Reset preferences

Verify preference reset:

* resets actual preferences;
* does not wipe unrelated user records;
* does not wipe unrelated favorites/recents unless explicitly required;
* correctly resets theme state;
* handles failed writes with rollback.

## Reset all data

Verify separately and only on disposable test data.

---

# 13. Cinematic scene verification

There must be:

* 10 distinct page scenes;
* Projects alias sharing Work's scene.

Verify these pages individually:

* Home
* Work
* Personal
* Explore
* Games
* Movies & Series
* Shortcuts
* Productivity
* Notes
* Settings

For every distinct page confirm:

* scene subject matches domain;
* backdrop is present;
* depth layer is present;
* ambient layer is present;
* contrast scrim is effective;
* page content remains readable;
* decorative movement never moves interactive text/forms;
* scene is visually distinct from other pages.

## Full mode

Verify motion is clearly perceptible but restrained.

## Subtle mode

Verify motion is observably reduced.

## Off mode

Verify ambient/parallax scene motion stops.

## Reduced motion

Verify motion is genuinely still, not merely slowed.

## Games and Movies

Verify both visibly have proper page heroes in the initial document experience.

## Visual threshold

The scene requirement fails if the technical implementation exists but the visible result is only a barely noticeable opacity or gradient change.

---

# 14. Provider verification

Current provider scope follows the standing plan, not the historical Revised Implementation Plan.

Verify configured provider functionality for the domains currently required by the standing plan.

## Server-side security

Confirm provider credentials are read server-side only.

Browser code must never contain the real key/token/secret.

## Search behavior

Verify:

* local matches appear immediately where designed;
* provider search is debounced;
* changing query cancels obsolete requests;
* pagination/load-more works;
* load-more does not cancel itself;
* duplicate results are handled correctly;
* selecting a result goes through the required explicit add flow;
* Movies/Series status choice works;
* Games tracker-type flow works.

## Error states

Test:

* provider not configured;
* offline;
* timeout;
* authentication failure;
* rate limit;
* empty result;
* generic provider failure.

The UI must present explicit degraded/error state.

It must never represent the local seed catalog as global search results.

## Cache

Verify:

* repeated eligible request can use cache;
* TTL behavior is correct;
* clearing provider cache does not delete user-owned data.

## Automated tests

Provider automated tests must use deterministic mocks and must not consume live API quota.

---

# 15. Shortcuts verification

Verify built-in and custom shortcut behavior.

## Built-ins

Test:

* Remove hides instead of destroying catalog definition;
* hidden state persists;
* Settings restore restores the shortcut;
* restored state persists.

## Custom shortcuts

Test:

* add;
* edit;
* description;
* favorite;
* delete cancel;
* delete confirmation;
* duplicate handling;
* external-link safety.

## Ownership

Verify:

* Work add control defaults correctly;
* Personal defaults correctly;
* Explore forces/retains Explore ownership;
* `[data-add-space]` actually honors its declared space;
* favoriting does not clear the Explore filter.

## Ordering

Verify:

* pointer drag reorder;
* keyboard reorder;
* persistence after reload;
* focus remains usable after moving a card.

## Responsive/icon behavior

At 1440 / 1024 / 760 / 390 verify no broken favicon/art fallback and usable touch targets.

---

# 16. Games verification

## Tracker inference

Test at minimum:

* known live-service game -> weekly tracker;
* known campaign/story game -> chapters;
* inferred tracker type is visible before saving;
* user can correct the inference.

## Templates

Verify game-specific templates rather than generic one-size-fits-all templates.

Test multiple games.

## Weekly tracker

Verify:

* game-specific weekly template;
* Diablo reset preserves all seven game-specific tasks if that remains the current template;
* week rollover behavior is correct;
* default tasks do not duplicate after reload.

## Story tracker

Verify:

* mission/story games receive meaningful chapter structure;
* objectives remain associated with the correct game.

## Toggle regression

For one story objective and one weekly task:

* toggle ten times each;
* after every toggle compare model, DOM and percentage;
* after an even number of toggles state returns to the original state;
* reload and confirm stored state;
* simulate rejected storage write and verify UI/model rollback.

## Tracker-type change

Switch:

```text
weekly → story
story → weekly
```

Verify required completion/history behavior is preserved according to the current implementation contract.

## Spotlight

Confirm provider-added and custom games can appear through the deterministic fallback artwork path.

## Resources

Confirm resources remain data-driven and not Diablo-specific.

## Focus restoration

Test focus with an identifier/value that would have broken the historical unescaped-selector implementation.

## Responsive

Verify Games at all four widths.

---

# 17. Movies & Series verification

## Untrack

Test separately:

* catalog movie;
* catalog series;
* custom title.

For catalog movie/series:

* add;
* confirm tracked count increases;
* untrack;
* confirm Library removal;
* confirm watchlist cleanup;
* confirm tracked count decreases;
* confirm title is available to add again;
* reload;
* confirm it remains untracked.

For custom title:

* verify untrack behavior;
* verify permanent delete remains a distinct custom-only operation where required.

## Watchlist

Confirm there is one authoritative watchlist state model.

No stale secondary source should resurrect removed titles.

## Confirmation

Confirm shared `OneSpaceUI.confirm` behavior is used, including:

* focus trap;
* Escape;
* inert background;
* focus return.

## Series catalog

Verify:

* Series filter returns the required useful seeded set;
* at least the standing-plan-required count is available;
* no prohibited placeholder seed records remain;
* metadata is substantive;
* Movies and Series are clearly labelled;
* search can return both types.

## Artwork

Verify:

* properly sized images use responsive source behavior where supplied;
* no image is silently stretched into obvious blur;
* deterministic generated fallback is used where licensing prevents redistribution;
* the documented artwork exception is retained where applicable;
* attribution/provenance documentation matches shipped assets.

## Responsive

Verify Movies & Series at all four widths.

---

# 18. Explore verification

Use the current standing-plan Explore model.

Do not reintroduce historical global destination-provider functionality unless the standing plan has been explicitly amended.

## Destination catalog

Verify all required curated destinations.

For every destination confirm:

* real properly licensed local imagery where required/available;
* substantive long-form description;
* short card summary;
* category/tag metadata;
* season;
* trip length;
* budget character;
* actual activity/context description;
* alt text;
* deterministic fallback.

## Saved destination compatibility

Verify existing saved destinations still validate after imagery/data changes.

## Preference flow

Test:

* destination type;
* climate/season;
* trip length;
* budget;
* pace;
* interests;
* departure region if currently supported.

Verify recommendations are deterministic/explainable where designed.

## Details

Verify open/close/focus behavior and complete destination content.

## Save/remove

Verify persistence and reload.

## Trip board

Verify all trip-board functionality that exists in the current standing plan/checklist.

Do not infer requirements only from the historical Revised Implementation Plan.

## Surprise Me

Verify it honors the active filtering model.

## Image failure

Use the deliberate `MISSING_ASSET` mechanism against the current expected asset.

Confirm:

* failed image does not blank the card/detail;
* fallback is usable;
* alt/readable content remains;
* failure is limited to the deliberate test.

## Explore script discrepancy

Confirm the final decision around `explore.js` vs `explore-global.js` is reflected identically in:

* browser behavior;
* tests;
* script load structure.

No double mount is allowed.

## Section order

Confirm:

**More to explore is the final Explore section.**

---

# 19. Personal verification

Test:

* add goal/routine/habit;
* edit;
* complete/uncomplete;
* progress/count update;
* delete cancel;
* delete confirm;
* success toast/aria-live;
* reload persistence.

Verify deletion uses the shared confirmation conventions.

Verify Work content removed during boundary cleanup did not migrate into Personal.

---

# 20. Productivity and Notes regression

Because content was removed from Work but retained in its owning domains, verify:

## Productivity

* generic daily tasks;
* timer/Pomodoro behavior;
* countdowns;
* relevant persistence.

## Notes

* notes remain available;
* add/edit/delete behavior still works where applicable;
* reload persistence.

### Why

Removing cross-domain mirrors must not accidentally remove the underlying owning-domain functionality.

---

# 21. Backup, restore and migration verification

Current export format:

```text
Version 4
```

Current compatibility requirement:

```text
Import complete versions 2, 3 and 4
```

Test using disposable origin/data.

## Version 4 export

Populate representative data across all relevant domains, then export.

Verify:

* correct version;
* required keys;
* Work hierarchy;
* tasks/history;
* Personal;
* shortcuts;
* Games;
* Movies/Series;
* Explore;
* settings/new optional preference keys where applicable.

## Version 4 restore

Modify/delete data, restore the exported file, verify representative records and state.

## Version 2/3 compatibility

Import complete supported historical fixtures.

Verify safe defaults for fields introduced later.

## Invalid/incomplete import

Verify correct rejection behavior and no destructive partial write.

## Transactional rollback

Induce storage failure where supported and verify previous data remains consistent.

---

# 22. Reset verification

On disposable data verify separately:

## Reset preferences

Only preference-scoped data changes.

User-owned domain records remain.

## Reset all data

Expected user-owned records are removed.

Fresh-state UI appears.

## Unrelated storage

Where the contract requires unrelated localStorage preservation, verify it explicitly.

---

# 23. Security and secrets verification

This section is mandatory.

## Step 23.1 — Tracked secret paths

Run:

```bash
git ls-files config/secrets
```

Expected:

```text
config/secrets/.gitkeep
```

or another explicitly approved non-secret placeholder only.

No real credential file may be tracked.

---

## Step 23.2 — Ignore rule

For the real local secret filename, without exposing its contents:

```bash
git check-ignore -v config/secrets/<local-secret-file>
```

Expected result must identify the intended ignore rule.

---

## Step 23.3 — Server denial

Run:

```bash
curl -I http://localhost:8973/config/secrets/api-keys.json
curl -I http://localhost:8973/config/secrets/probe.js
```

Sensitive paths must not be served.

`probe.js` is important because `.js` is otherwise a servable type.

---

## Step 23.4 — Browser-reference prohibition

Confirm no browser-facing source references `config/`.

Structural tests should enforce this.

---

## Step 23.5 — Hard-coded credential audit

Inspect staged/tracked browser-facing files for suspicious API key/token/password assignments.

If the repository has the recommended secret-scanner script/hook, run it.

Any match must be investigated, not automatically ignored.

---

## Step 23.6 — Provider secret boundary

Confirm:

```text
Browser
  ↓
local server/API proxy
  ↓
provider credential
  ↓
external provider
```

Browser code must not receive the private provider credential.

### PASS condition

All six security checks pass.

---

# 24. Offline and failure-state verification

Disconnect or mock failure as appropriate.

Verify:

* app still opens;
* user-owned data remains available;
* provider-backed search shows visible degraded state;
* no user data is erased;
* no local seed result is falsely represented as global provider output;
* cached/local content is honestly labelled where necessary;
* failed media uses fallback;
* retry/recovery works where designed.

---

# 25. Keyboard and accessibility verification

Perform keyboard-only testing for major workflows.

Verify:

* logical tab order;
* visible focus;
* Enter/Space activation;
* Escape closes dialogs;
* focus returns to invoking control;
* modal focus trap;
* inert background behavior;
* shortcut keyboard reorder;
* Work task controls;
* search/typeahead arrow navigation;
* search Escape behavior;
* confirmation cancel/confirm;
* relevant `aria-pressed`;
* relevant `aria-expanded`;
* relevant `aria-current`;
* `aria-live` status messages;
* accessible labels for icon-only actions.

This is an acceptance check, not a claim of full accessibility certification.

---

# 26. Reduced-motion verification

Test:

* OS/browser reduced-motion preference;
* OneSpace motion override behavior;
* Full mode;
* Subtle mode;
* Off mode.

Verify all known motion systems route through the current motion contract.

Reduced motion must remove:

* parallax;
* ambient drift;
* stagger;
* scroll-linked transforms;
* unnecessary state-change animation.

It must be genuinely still where required.

---

# 27. Responsive verification matrix

Every required visual route must be inspected at:

```text
1440 px
1024 px
760 px
390 px
```

For each record:

* document scroll width;
* viewport width;
* overflow;
* overlap;
* clipped text;
* clipped dialogs;
* broken images;
* offscreen controls;
* unusable touch targets;
* unreadable text.

At minimum inspect:

* Home
* Work
* Personal
* Explore
* Games
* Movies & Series
* Shortcuts
* Productivity
* Notes
* Settings

Projects alias should also be exercised through its navigation path.

---

# 28. Visual before/after verification

Use Phase 0 baseline screenshots where available.

Compare the final implementation at equivalent widths.

Specifically inspect:

## Work

Is the redesign clearly visible and meaningful?

## Settings

Are new theme/palette changes clearly distinguishable?

## Scenes

Does every route visibly feel distinct and alive in Full mode?

## Shortcuts

Is the launch wall/card experience visibly modernised and coherent?

## Games

Are trackers/resources/spotlight visually usable?

## Movies & Series

Are cards/details/artwork/fallbacks visually credible?

## Explore

Do real destination imagery/descriptions materially improve the experience?

### Failure rule

If code technically satisfies structure but the before/after visual difference is negligible relative to the requirement, verification fails and implementation must be improved.

---

# 29. Interaction inventory verification

Phase 0 created the control inventory.

Final verification must reconcile every applicable inventory row.

For each control verify as applicable:

* visible/enabled state;
* click/keyboard action;
* expected state change;
* persistence key;
* success feedback;
* cancel path;
* error path;
* focus return;
* reload state.

Do not sample only a few buttons if the checklist requires the complete inventory.

Store final outcomes in a machine-readable or clearly tabular evidence file.

---

# 30. Final route/action smoke

After all fixes from the verification run are complete, repeat a final smoke pass over every top-level route.

Do not reuse results from before the last code fix.

Confirm:

* navigation;
* primary action;
* modal open/close;
* persistence;
* no console exception;
* no required-resource failure.

### Why

A late fix in one domain can regress shared shell behavior.

---

# 31. Final automated test re-run

After every verification defect has been fixed, run again:

```bash
node --test tests/
```

The result recorded as the final automated-test count must come from this run.

Do not use an earlier run from before the last fix.

---

# 32. Final Git/repository check

Run:

```bash
git status --short --untracked-files=all
git diff --check
git diff
git diff --cached
```

Confirm:

* no accidental temporary scripts;
* no credential file;
* no unreviewed generated evidence in source folders;
* no accidental deletion;
* no whitespace/error issue reported by `git diff --check`;
* intended evidence files are where expected.

---

# 33. Final checklist reconciliation

Re-read all of `docs/IMPLEMENTATION-STEPS.md`.

Record:

* total checklist items;
* VERIFIED;
* APPROVED EXCEPTION;
* DEFERRED TO PHASE 12 and now resolved;
* BLOCKED;
* PENDING;
* IMPLEMENTED / NOT VERIFIED.

Final delivery may not claim PASS while mandatory:

* BLOCKED;
* PENDING;
* IMPLEMENTED / NOT VERIFIED

items remain.

Any Phase-12 deferral must now be resolved.

---

# 34. Documentation reconciliation

Before Gate 13.3 passes:

## README.md

Must match actual delivered:

* folder structure;
* server command;
* architecture;
* storage model;
* backup compatibility;
* provider setup;
* offline behavior;
* scene/motion behavior;
* accessibility expectations;
* scope limitations.

## VERIFICATION.md

Must contain the actual fresh acceptance result from this run.

## docs/REVISED-IMPLEMENTATION-PLAN.md

Reconcile it with the final current architecture.

Historical requirements that were superseded must no longer appear as active current requirements.

## docs/agent-instructions.md

Must remain consistent with the delivered product or explicitly identify any approved exception.

## docs/IMPLEMENTATION-STEPS.md

Progress table and detailed item states must agree.

---

# 35. Final acceptance criteria

Final status may be **PASS** only if all of the following are true:

* complete automated suite passes;
* all mandatory browser acceptance checks pass;
* every top-level route works;
* no unexplained console error remains;
* no required asset is broken;
* Work lifecycle passes;
* domain boundaries pass;
* Settings/theme behavior passes;
* cinematic-scene acceptance passes;
* provider behavior and degraded states pass;
* shortcuts pass;
* Games tracker and rollback regressions pass;
* Movies & Series untrack/watchlist/series acceptance passes;
* Explore acceptance passes;
* Personal passes;
* Productivity/Notes regression passes;
* backup v4 export/restore passes;
* supported v2/v3 import compatibility passes;
* reset behavior passes;
* secrets/security checks pass;
* offline behavior passes;
* keyboard acceptance passes;
* reduced-motion acceptance passes;
* responsive checks pass at all required widths;
* visual before/after acceptance passes;
* complete interaction inventory is reconciled;
* final checklist has no disallowed unresolved state;
* documentation matches delivered behavior.

---

# 36. Failure handling

When any acceptance check fails:

1. Record the failure before editing.
2. Identify the corresponding checklist requirement.
3. Reproduce the defect deterministically if practical.
4. Add/update regression coverage where appropriate.
5. Fix the implementation.
6. Run the targeted check.
7. Run related domain regression checks.
8. Update persistent evidence.
9. Re-run any phase gate affected by the fix.
10. Re-run the final full automated suite before final delivery.

Never delete or weaken the acceptance requirement merely to obtain a PASS result.

---

# 37. Approved exceptions

Every approved exception must record:

```text
Requirement:
Original expected behavior:
Why it cannot be delivered as written:
Approved alternative:
User approval / source:
Implementation:
Verification performed:
Evidence:
Residual limitation:
```

An exception is not an undocumented shortcut.

---

# 38. Final Verification Report

## Verification metadata

* Date:
* Local timezone:
* Git branch:
* Git commit:
* Application entry:
* Verification server:
* Disposable test server:
* Backup format:
* Supported import formats:
* Node version:
* Browser/environment:
* Standing plan:
* Checklist:
* Mandatory Phase 0–9 audit:
* Gate 12 status:

---

## Verification authority check

| Check                                                          | Result  | Evidence |
| -------------------------------------------------------------- | ------- | -------- |
| `docs/agent-instructions.md` fully reviewed                    | NOT RUN |          |
| `docs/IMPLEMENTATION-STEPS.md` fully reconciled                | NOT RUN |          |
| Historical Revised plan correctly treated as non-authoritative | NOT RUN |          |
| Mandatory Phase 0–9 audit complete                             | PASS    | `docs/implementation-evidence/audit-phase0-9/AUDIT.md` and `audit.json`. |
| Gate 12 complete                                               | NOT RUN |          |
| No unresolved PENDING items                                    | NOT RUN |          |
| No unresolved IMPLEMENTED / NOT VERIFIED items                 | NOT RUN |          |
| No unresolved BLOCKED items                                    | NOT RUN |          |
| Approved exceptions documented                                 | NOT RUN |          |

---

## Final result

* **Overall status:** NOT RUN
* Automated tests:
* Browser acceptance:
* Responsive acceptance:
* Keyboard/accessibility:
* Reduced motion:
* Backup/restore:
* Migration compatibility:
* Offline/provider:
* Security/secrets:
* Console errors:
* Broken assets:
* Approved exceptions:

Do not change `Overall status` to PASS until every mandatory final acceptance condition above has passed.

---

## Phase gate results

| Phase | Gate    | Result  | Evidence |
| ----- | ------- | ------- | -------- |
| 0     | Gate 0  | PASS    | Mandatory Phase 0–9 audit; baseline contract/routes/inventory re-read. |
| 1     | Gate 1  | PASS    | Mandatory audit; 82/82 suite, structural/load-order/secret-denial checks. |
| 2     | Gate 2  | PASS    | Mandatory audit; Work regression plus four-width before/after visual review. |
| 3     | Gate 3  | PASS    | Mandatory audit; current boundary/ownership/validation regressions. |
| 4     | Gate 4  | PASS    | Mandatory audit; palette/contrast/reset tests and four-width visual review. |
| 5     | Gate 5  | PASS    | `docs/implementation-evidence/phase5/gate5-rerun.json` — clarified 5.3A matrix, 82/82 tests, clean console/media and four-width browser evidence. |
| 6     | Gate 6  | PASS    | Mandatory audit; current provider/API/security regressions and Phase 6 evidence. |
| 7     | Gate 7  | PASS    | Mandatory audit; shortcut tests and browser ownership/restore/reorder evidence. |
| 8     | Gate 8  | PASS    | Mandatory audit; current Games defect regressions and Phase 8 browser matrix. |
| 9     | Gate 9  | PASS    | Mandatory audit; current Movies regressions, browser matrix and approved art exceptions. |
| 10    | Gate 10 | NOT RUN |          |
| 11    | Gate 11 | NOT RUN |          |
| 12    | Gate 12 | NOT RUN |          |

Use the actual gate names/structure from the current checklist if they differ.

---

# 39. Automated verification results

Record:

```text
Command:
Date/time:
Tests:
Passed:
Failed:
Skipped:
Result:
Evidence file:
```

Also record structural/parser results separately.

---

# 40. Browser acceptance matrix

| Route           | Core actions | Persistence | Keyboard | Console | 1440 | 1024 | 760 | 390 | Result |
| --------------- | ------------ | ----------- | -------- | ------- | ---- | ---- | --- | --- | ------ |
| Home            |              |             |          |         |      |      |     |     |        |
| Work            |              |             |          |         |      |      |     |     |        |
| Projects alias  |              |             |          |         |      |      |     |     |        |
| Personal        |              |             |          |         |      |      |     |     |        |
| Explore         |              |             |          |         |      |      |     |     |        |
| Games           |              |             |          |         |      |      |     |     |        |
| Movies & Series |              |             |          |         |      |      |     |     |        |
| Shortcuts       |              |             |          |         |      |      |     |     |        |
| Productivity    |              |             |          |         |      |      |     |     |        |
| Notes           |              |             |          |         |      |      |     |     |        |
| Settings        |              |             |          |         |      |      |     |     |        |

---

# 41. Domain result summary

## Work

* Status:
* Checks:
* Defects found:
* Fixes:
* Evidence:

## Domain boundaries / Home

* Status:
* Checks:
* Defects found:
* Fixes:
* Evidence:

## Settings

* Status:
* Checks:
* Evidence:

## Scenes / visual system

* Status:
* Full:
* Subtle:
* Off:
* Reduced motion:
* Visual delta:
* Evidence:

## Providers

* Status:
* Search:
* Pagination:
* Cancellation:
* Cache:
* Error states:
* Offline:
* Credentials:
* Evidence:

## Shortcuts

* Status:
* Built-in remove/restore:
* Custom CRUD:
* Ownership:
* Ordering:
* Keyboard:
* Evidence:

## Games

* Status:
* Tracker inference:
* Templates:
* Toggle regression:
* Rollback:
* Reset:
* Spotlight:
* Resources:
* Evidence:

## Movies & Series

* Status:
* Untrack:
* Watchlist:
* Series:
* Artwork:
* Confirmation:
* Evidence:

## Explore

* Status:
* Destination records:
* Images:
* Details:
* Preferences:
* Saved destinations:
* Fallback:
* More to explore order:
* Evidence:

## Personal

* Status:
* CRUD:
* Confirmation:
* Persistence:
* Evidence:

## Productivity / Notes

* Status:
* Regression:
* Persistence:
* Evidence:

---

# 42. Backup / restore / migration result

* v4 export:
* v4 restore:
* v2 import:
* v3 import:
* invalid import:
* rollback:
* reset preferences:
* reset all:
* unrelated storage preservation:
* Evidence:

---

# 43. Security result

| Check                                        | Result  | Evidence |
| -------------------------------------------- | ------- | -------- |
| Real secret not tracked                      | NOT RUN |          |
| `config/secrets` ignore works                | NOT RUN |          |
| `.gitkeep`/allowed placeholders only tracked | NOT RUN |          |
| `config/` not referenced by browser          | NOT RUN |          |
| secret `.json` not servable                  | NOT RUN |          |
| secret `.js` probe not servable              | NOT RUN |          |
| no browser hard-coded provider secret        | NOT RUN |          |
| provider credential server-side only         | NOT RUN |          |

---

# 44. Offline and failure-state result

Record:

* provider unconfigured:
* offline:
* timeout:
* authentication:
* rate limit:
* empty result:
* provider error:
* image failure:
* persistence after failure:
* Evidence:

---

# 45. Responsive result

| Route           | 1440 | 1024 | 760 | 390 | Overflow | Broken images | Result |
| --------------- | ---- | ---- | --- | --- | -------- | ------------- | ------ |
| Home            |      |      |     |     |          |               |        |
| Work            |      |      |     |     |          |               |        |
| Personal        |      |      |     |     |          |               |        |
| Explore         |      |      |     |     |          |               |        |
| Games           |      |      |     |     |          |               |        |
| Movies & Series |      |      |     |     |          |               |        |
| Shortcuts       |      |      |     |     |          |               |        |
| Productivity    |      |      |     |     |          |               |        |
| Notes           |      |      |     |     |          |               |        |
| Settings        |      |      |     |     |          |               |        |

---

# 46. Keyboard/accessibility result

Record:

* tab order:
* focus visibility:
* Enter/Space:
* Escape:
* modal focus trap:
* focus return:
* typeahead keyboard navigation:
* shortcut keyboard reorder:
* aria-live:
* icon labels:
* relevant ARIA state:
* Result:
* Evidence:

---

# 47. Reduced-motion result

Record:

* OS reduced-motion:
* app Full override:
* app Subtle:
* app Off:
* parallax:
* ambient drift:
* stagger:
* scroll effects:
* Results:
* Evidence:

---

# 48. Visual before/after result

For every visual phase record:

```text
Requirement:
Baseline screenshot:
Final screenshot:
Widths checked:
Expected visible difference:
Observed difference:
Result:
Evidence:
```

Do not mark PASS if the visual requirement technically exists but the intended visible improvement is negligible.

---

# 49. Approved exceptions

For each approved exception record:

* Requirement:
* Reason:
* Approved alternative:
* Approval reference:
* Verification:
* Evidence:
* Remaining limitation:

If none:

```text
None.
```

---

# 50. Known limitations

Only genuine intentionally accepted product limitations belong here.

Do not use this section for unfinished checklist items.

Examples of valid limitations may include:

* reminders only while page is open;
* no cloud sync;
* no multi-user collaboration;
* no episode-by-episode tracking;
* provider functionality unavailable when credentials/network are unavailable;
* explicitly approved artwork licensing fallback.

---

# 51. Final checklist reconciliation

* Total checklist items:
* VERIFIED:
* APPROVED EXCEPTION:
* DEFERRED TO PHASE 12:
* BLOCKED:
* PENDING:
* IMPLEMENTED / NOT VERIFIED:

At final delivery:

```text
DEFERRED TO PHASE 12 = 0 unresolved
BLOCKED = 0 mandatory unresolved
PENDING = 0 mandatory unresolved
IMPLEMENTED / NOT VERIFIED = 0 mandatory unresolved
```

---

# 52. Gate 13.3 decision

Gate 13.3 may pass only when:

* Gate 12 passes;
* final automated tests pass;
* final browser acceptance passes;
* security checks pass;
* final evidence exists;
* checklist reconciliation is clean;
* documentation matches the actual implementation;
* all approved exceptions are documented;
* no mandatory unfinished work remains.

Final Gate 13.3 result:

```text
NOT RUN
```

Evidence:

```text
Pending final verification.
```

---

# Historical verification records

Historical runs are retained only for audit/history.

They are not proof of the current implementation.

## Acceptance run — September 17, 2026

Status:

```text
SUPERSEDED AS CURRENT VERIFICATION
HISTORICAL EVIDENCE ONLY
```

The complete September 17, 2026 acceptance record may remain below this heading unchanged for historical traceability.

Do not copy its historical test counts, backup version or results into the current Final Verification Report unless independently re-run and confirmed against the current implementation.
