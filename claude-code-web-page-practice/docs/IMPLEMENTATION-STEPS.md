# OneSpace — Numbered implementation checklist

Authority: `agent-instructions.md` (moves to `docs/agent-instructions.md` in Phase 1). Original step references are retained. Execution order: **13.1 → 13.2 → 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 14 → 15 → 16 → 17 → 18 → 19 → 13.3**. Subordinate requirements retain their source order, except the explicitly prescribed Phase 1 move-batch order.

**Execution authority:** completion, status, evidence, phase-gate and resume behavior are governed by the `Mandatory execution and verification contract` below. The standing plan defines **what** must be delivered; this checklist governs **how completion is proven**.

## Do not break

- Entry URL stays `http://localhost:8973/` serving root `index.html`.
- All `localStorage` keys unchanged. A folder move must never touch a storage key.
- All public browser globals keep their names: `OneSpace` (inline), `OneSpaceStorage`, `OneSpaceCatalog`, `OneSpaceShortcuts`, `OneSpaceShortcutUI`, `OneSpaceUI`, `OneSpaceVisual`, `makePersonalController`, `OneSpaceWork`, `OneSpaceTrips`, `DESTINATIONS`, `OneSpaceLocalDiscovery`, `OneSpaceDiscovery`, `OneSpaceExplore`, `OneSpaceGameResources`, `DEFAULT_GAMES` / `SUGGESTION_CATALOG` / `DIABLO_WEEKLY_TEMPLATE` / `GAMES_*`, `OneSpaceGameDiscovery` + `OneSpace.playGamesEntryAnimation`, `SEED_MOVIES` / `MOVIE_*`, `OneSpaceTitleDiscovery`.
- `work/projects.js`, `shared/tooltip-utils.js`, `shared/cinematic-scenes.js`, `explore/explore-global.js` and `explore/discovery-integration.js` export nothing — pure side-effect modules that must keep their exact load position.
- The UMD dual-export pattern stays in every file that has it.
- Backup format version 4 (and v2/v3 acceptance) and all existing fixtures remain valid.
- **No behaviour change of any kind in Phase 1.** If a bug is found mid-move, note it and fix it in a later phase.

The three user-confirmed clarifications in the standing plan apply. Existing DONE markers describe the old implementation, not verification in this run. Do not mark a requirement verified without evidence. No step may be skipped. Repeated requirements remain separately traceable to their original phases.


## Mandatory execution and verification contract

These rules apply to **every checklist item, every phase, every gate, every resume after interruption, and every final verification step**.

They override any weaker or ambiguous completion wording elsewhere in this checklist.

### 1. Completion rule

A phase is **NOT** complete merely because:

- code exists;
- a feature appears to work;
- a total test count is green;
- screenshots exist;
- a previous chat summary says the phase is complete;
- a phase-level `acceptance.json` exists;
- an earlier run marked the phase `Verified`;
- or the implementation "looks close enough".

A phase is complete **ONLY** when every phase-local checklist item is in one of these terminal states:

- **VERIFIED**
- **DEFERRED TO PHASE 12** — only when the standing plan explicitly assigns that exact acceptance check to Phase 12
- **APPROVED EXCEPTION** — only when the requirement cannot be delivered as written and the approved alternative, reason and evidence are permanently recorded

A phase gate must remain open if any item in that phase is:

- **PENDING**
- **IMPLEMENTED / NOT VERIFIED**
- **BLOCKED**

Phase 12 is **final regression and delivery verification**. It does not replace phase-local verification unless the standing plan explicitly assigns that exact check to Phase 12.

---

### 2. Allowed statuses

Use **only** these statuses:

- **PENDING** — work has not started.
- **IMPLEMENTED / NOT VERIFIED** — implementation exists, but the exact acceptance criterion has not yet passed.
- **VERIFIED** — implementation exists and the exact acceptance criterion has passed with persistent evidence.
- **DEFERRED TO PHASE 12** — allowed only when the standing plan explicitly assigns that exact acceptance check to Phase 12.
- **BLOCKED** — work cannot proceed; the exact blocker must be recorded.
- **APPROVED EXCEPTION** — the requirement cannot be delivered as written and the approved alternative/reason/evidence is recorded.

Do not invent hybrid statuses such as:

- `Verified; mostly complete`
- `Verified except...`
- `Verified with follow-through...`
- `Verified pending...`
- `Done enough`
- `Implemented and probably correct`

If required follow-through remains and that follow-through is not explicitly assigned to a later phase by the standing plan, the item is **IMPLEMENTED / NOT VERIFIED**, not VERIFIED.

---

### 3. Checkbox rule

A checked box `[x]` means one of only two things:

- **VERIFIED**
- **APPROVED EXCEPTION**

If implementation exists but verification is incomplete:

- keep `[ ]`
- set status to **IMPLEMENTED / NOT VERIFIED**

If an acceptance check is explicitly assigned to Phase 12:

- the implementation item may be VERIFIED when its own phase-local acceptance passes;
- the separate Phase 12 regression item remains pending until Phase 12.

Never check a box merely because code was written.

---

### 4. Requirement-level evidence rule

Evidence must be **specific to the checklist item**.

A total test count is supporting evidence only. It is not sufficient evidence by itself.

If a phase-level file such as `acceptance.json` is used, it must contain a named result that maps directly to:

- this checklist step ID; or
- this exact acceptance criterion.

Good evidence examples:

- `docs/implementation-evidence/phase8/acceptance.json -> 8.5.2 selectorEscaping: PASS`
- `tests/games-lifecycle.test.js -> "focus restoration handles quoted ids"`
- `phase5/work-1440-after.png`
- `phase6/provider-unconfigured.json -> status: PASS`
- browser measurement showing exact width / overflow / focus / persistence result

Not sufficient by itself:

- `71 tests pass`
- `browser checks passed`
- `acceptance.json`
- `looks correct`
- `verified in previous session`

Every VERIFIED item must have persistent evidence that another session can inspect without relying on chat memory.

---

### 5. Phase gate rule

Before marking any `Gate X` VERIFIED:

1. Re-read every checklist item belonging to that phase.
2. Confirm there are zero **PENDING**, **IMPLEMENTED / NOT VERIFIED**, or **BLOCKED** items in that phase.
3. Confirm every **DEFERRED TO PHASE 12** item is explicitly assigned there by the standing plan.
4. Re-run the phase gate automated tests.
5. Re-run the phase's required browser/manual acceptance checks.
6. Confirm required persistence/reload/error/cancel/focus behavior where applicable.
7. Confirm required responsive checks where applicable.
8. Confirm required visual acceptance where applicable.
9. Store persistent evidence in `docs/implementation-evidence/`.
10. Update the `Progress` table so it exactly matches the detailed checklist.

The `Progress` table must never contradict the detailed checklist.

If it does, the detailed evidence wins and the Progress table must be corrected immediately.

---

### 6. Visual acceptance rule

For requirements whose purpose includes:

- visual redesign;
- cinematic quality;
- "alive" interaction;
- hierarchy improvement;
- modernisation;
- motion;
- artwork quality;
- responsive presentation;

structural implementation is **not sufficient**.

Verification must include rendered before/after evidence where a baseline exists.

At the required widths:

- **1440 px**
- **1024 px**
- **760 px**
- **390 px**

verify all applicable criteria:

- the intended visual difference is clearly observable;
- hierarchy is visibly improved;
- the feature does not merely exist in DOM/CSS;
- required Full-mode motion is visibly perceptible without being distracting;
- Subtle mode is observably reduced;
- Off mode is still;
- reduced-motion mode is genuinely still;
- no overlap exists;
- no clipping exists;
- no horizontal overflow exists;
- no broken artwork exists;
- no unreadable contrast exists;
- touch targets remain usable;
- keyboard focus remains visible.

If the implementation technically exists but the visible difference is negligible, mark:

**IMPLEMENTED / NOT VERIFIED**

and improve it before closing the phase.

---

### 7. Functional acceptance rule

For CRUD, persistence, tracker, shortcut, movie, game, Work, Personal, Explore and Settings functionality, verification must test the actual user path where applicable:

1. open the correct route;
2. perform the action;
3. verify immediate UI state;
4. verify success feedback;
5. verify persisted storage state;
6. reload;
7. verify state remains correct;
8. verify cancel behavior where applicable;
9. verify validation/error behavior where applicable;
10. verify focus return / keyboard behavior where applicable.

A helper/unit test alone does not replace the browser/user-flow acceptance check when the checklist requires browser behavior.

---

### 8. Defect verification rule

For a defect fix:

1. reproduce the defect before the fix whenever practical;
2. retain failing evidence or a regression test that fails against the old behavior;
3. implement the fix;
4. make the regression test pass;
5. verify the actual browser/user flow;
6. verify persistence/reload if the defect involves stored state;
7. record the result against the exact defect checklist ID.

A defect is not VERIFIED merely because the changed function appears correct by inspection.

---

### 9. Cross-phase requirement rule

Some requirements originate in one phase but are completed in another.

For every such requirement:

- record the owning source step;
- record the implementation phase;
- record the verification phase;
- never mark the source requirement VERIFIED until its own acceptance condition is actually satisfied.

Do not hide unfinished work behind phrases such as `follow-through in Phase X`.

If later-phase work is required and not explicitly deferred by the standing plan, use **IMPLEMENTED / NOT VERIFIED**.

---

### 10. Phase 12 deferral rule

`DEFERRED TO PHASE 12` is valid only when the standing plan explicitly assigns the exact check to Phase 12.

Phase 12 may repeat:

- full action matrices;
- complete route smoke regression;
- all-width regression;
- keyboard-only regression;
- reduced-motion regression;
- backup/import/reset regression;
- offline provider regression;
- full button inventory regression.

Phase 12 may **not** be used to avoid a phase-local gate.

If Phase X requires a specific action to work before advancing, verify it in Phase X and re-verify it in Phase 12.

---

### 11. Resume-after-interruption rule

After any:

- context compaction;
- usage-limit interruption;
- permission interruption;
- agent restart;
- new session;
- long pause;
- manual user interruption;

do this **before editing code**:

1. Read this contract.
2. Read the active phase in `docs/agent-instructions.md`.
3. Read the matching section in this checklist.
4. Inspect `git status`.
5. Inspect `git diff`.
6. Inspect the actual current implementation.
7. Inspect existing evidence files for the active phase.
8. Identify the last checklist item whose evidence independently proves VERIFIED.
9. Resume from that exact item.

Never advance to the next phase merely because a previous chat summary said the current phase was complete.

Chat summaries are navigation aids, not verification evidence.

---

### 12. Context-compaction safety rule

Important implementation facts must survive outside conversation context.

Do not keep any of these only in chat:

- unresolved defects;
- approved exceptions;
- skipped acceptance checks;
- current blockers;
- failed checks;
- phase evidence;
- changed plan interpretation;
- changed file ownership;
- deferred requirements.

Persist them in:

- this checklist;
- `docs/implementation-evidence/`;
- the standing plan when the plan itself changes.

---

### 13. No-skip rule

Every numbered checklist entry is mandatory.

The agent must not:

- silently skip an item;
- collapse several distinct items into one generic verification claim;
- mark a later gate VERIFIED while earlier items remain unresolved;
- interpret a broad passing test suite as proof for every item;
- rewrite the checklist to hide missing work;
- remove requirements simply because implementation became difficult.

If a requirement becomes impossible or contradictory:

1. stop that requirement;
2. mark **BLOCKED**;
3. document the exact contradiction;
4. resolve it against the standing plan and confirmed user decisions;
5. then continue.

---

### 14. Acceptance-file mapping rule

Each phase evidence folder should contain enough information to reconstruct verification without chat history.

Recommended structure:

```text
docs/implementation-evidence/
  phaseX/
    acceptance.json
    tests.txt
    browser-checks.json
    screenshots/
    notes.md
```

`acceptance.json` should map checklist IDs to explicit results, for example:

```json
{
  "phase": 8,
  "results": {
    "8.1.1": {
      "status": "PASS",
      "evidence": [
        "tests/games-lifecycle.test.js: tracker type inference",
        "browser-checks.json: add-live-service-game"
      ]
    }
  }
}
```

The exact file format may differ, but the mapping from checklist ID to evidence must remain explicit.

---

### 15. Progress-table rule

The `Progress` table is a summary only.

It must be updated immediately whenever:

- a phase gate changes;
- an audit downgrades a previously Verified item;
- an Approved Exception is added;
- a Blocked item appears;
- a phase is completed.

The Progress table must never claim:

- `Verified`
- `Complete`
- or equivalent

when the detailed phase gate is not VERIFIED.

---

### 16. Mandatory audit before Phase 10

Before beginning **Phase 10**, stop feature implementation and perform a strict audit of **Phases 0 through 9**.

Do not trust:

- existing `[x]` boxes;
- existing `Verified` labels;
- previous chat summaries;
- previous total test counts.

Reinspect the actual repository and evidence.

For every checklist item in Phases 0–9 classify it as exactly one of:

- VERIFIED
- IMPLEMENTED / NOT VERIFIED
- DEFERRED TO PHASE 12
- BLOCKED
- APPROVED EXCEPTION

During this audit:

1. verify every checked box against actual evidence;
2. downgrade any item whose evidence is insufficient;
3. correct any Progress-table contradiction;
4. re-run every phase gate from 0 through 9;
5. re-check visual phases visually;
6. re-check defect acceptance criteria;
7. confirm secrets/server-denial requirements;
8. confirm storage/backup invariants;
9. confirm route/load-order/domain-boundary invariants;
10. confirm no requirement was skipped during context compaction or interruption.

Do **not** start Phase 10 until this audit is clean.

At the end, persist an audit report under:

```text
docs/implementation-evidence/audit-phase0-9/
```

The report must list:

- VERIFIED items;
- IMPLEMENTED / NOT VERIFIED items;
- DEFERRED TO PHASE 12 items;
- BLOCKED items;
- APPROVED EXCEPTION items;
- corrected checkboxes;
- corrected Progress-table entries;
- every phase gate result;
- visual before/after findings;
- any implementation that technically exists but does not meaningfully satisfy the intended UX.

Any required Phase 0–9 item found incomplete must be finished and verified before Phase 10 begins.

---

### 17. Specific visual audit requirements before Phase 10

Re-audit at minimum these phases:

#### Phase 2 — Work redesign

The result must visibly read as a modern development tool.

Verify:

- Board, Projects, Backlog and History feel like one coherent Work surface;
- Work cards have clear hierarchy;
- status labels are readable/capitalised;
- priority treatment is visible;
- progress bars are meaningful;
- the responsive detail drawer/sheet is clearly improved;
- filters feel live and usable;
- no old Work rail overlap remains;
- before/after difference is clearly visible at all four widths.

If the user-visible difference is negligible, Phase 2 is not visually VERIFIED.

#### Phase 4 — Settings/themes

Verify:

- new palettes are visibly distinct;
- warm palette direction is clearly visible;
- light/dark is orthogonal to palette;
- Deep Space is actually visually distinct;
- Games and Movies sub-theme controls are visible;
- reset behavior is correct;
- controls persist after reload.

#### Phase 5 — Living scenes

Verify:

- 10 distinct pages have distinct scenes;
- Projects alias uses Work scene;
- every scene matches its domain;
- Full mode is visibly alive;
- Subtle is observably reduced;
- Off is still;
- reduced-motion is still;
- Games and Movies visibly have proper page heroes;
- the scene is more than a barely perceptible opacity/gradient change;
- no scene compromises content readability or interaction.

If the scenes technically exist but the user-visible difference is weak, mark Phase 5 visual items **IMPLEMENTED / NOT VERIFIED** and improve them before continuing.

#### Phase 7 — Shortcuts

Verify:

- every built-in and custom shortcut has the correct remove behavior;
- removed built-ins restore from Settings;
- add-space ownership is correct;
- drag reorder works;
- keyboard reorder works;
- focus is preserved;
- icons never break at all four widths.

#### Phase 8 — Games

Verify the explicit defect acceptance checks, including:

- live-service add -> weekly tracker;
- campaign add -> chapters;
- inferred tracker type visible/correctable;
- story and weekly toggles survive ten alternations;
- two toggles return original state;
- rejected writes rollback UI/model/storage consistently;
- Diablo reset preserves its full game-specific task list;
- user/provider/custom games can reach spotlight;
- tracker-type changes preserve required history.

#### Phase 9 — Movies & Series

Verify:

- catalog movie untrack;
- series untrack;
- custom title untrack;
- custom permanent delete remains distinct;
- tracked count changes correctly;
- watchlist has one source of truth;
- reload preserves untracked state;
- Series filter returns the required seeded set;
- placeholder series records are gone where required;
- artwork exception is explicit and compliant;
- confirmation uses shared modal behavior.

---

### 18. Security and secret-protection rule

Before every phase gate after Phase 1 and again in Phase 12, confirm:

- no real secret is tracked;
- `git ls-files config/secrets` contains only allowed placeholder/`.gitkeep` content;
- `git check-ignore` confirms real secret paths are ignored;
- `config/` is not referenced by browser code;
- secret paths are not servable by the production/local server;
- no API key/token/password is hard-coded in browser-facing source;
- provider credentials remain server-side only.

If a real secret is ever found in Git history or a pushed commit:

1. stop;
2. rotate/revoke the credential;
3. remove it from tracking/history as appropriate;
4. only then continue.

---

### 19. Final delivery rule

Before `Gate 13.3` can pass:

- every implementation item must be VERIFIED, DEFERRED-then-VERIFIED in Phase 12, or APPROVED EXCEPTION;
- Phase 12 must pass;
- no unchecked implementation requirement may remain without an explicit allowed terminal state;
- README must match actual delivered behavior;
- VERIFICATION must describe the fresh final run;
- REVISED-IMPLEMENTATION-PLAN must no longer contradict the delivered provider architecture;
- Progress table must match final detailed status;
- repository evidence must be sufficient to reconstruct what was delivered.

No final "complete" statement is allowed until these conditions are true.

---


## Progress

| Phase | Status | Evidence |
|---|---|---|
| 13.1 | Verified | Standing plan and user-confirmed clarifications |
| 13.2 | Verified | 355 numbered entries; coverage reviewed before Phase 0. |
| 0 | Verified | All Phase 0 evidence is in docs/implementation-evidence. |
| 1 | Verified | 39/39 tests; all seven batch gates, structural assertions, secret-path denial, exact script order and git history preservation verified. |
| 2 | Verified | Phase 2 acceptance evidence; assigned Phase 3/12 follow-through remains pending. |
| 3 | Verified | 44 tests; Home ownership, Work/Explore boundaries, theme cleanup and injected validators verified. |
| 4 | Verified; follow-through in 5–7 | Settings, palette, contrast, reset, persistence and layout checks passed. |
| 5 | Verified; final width regression in Phase 12 | Ten distinct SVG scenes, unified motion controller; 54 tests; 40 responsive checks. |
| 6 | Verified | TMDB/RAWG proxy, one typeahead per domain, visible degradation; local mock verified. |
| 7 | Verified | Removable built-ins, restore panel, scoped add, persisted ordering and accessible controls. |
| 8 | Verified; full action matrix in Phase 12 | Tracker inference, game-specific templates, rollback, history preservation, spotlight and focus verified. |
| 9 | Verified with documented 9.2.6 artwork exception | Untrack, single watchlist truth, 15 series, shared confirmation, responsive fallback; full action matrix in Phase 12. |
| 10 | Not started | Pending |
| 11 | Not started | Pending |
| 12 | Not started | Pending |
| 13.3 | Not started | Pending |

## Phase 13.1 — Standing plan

1. [x] **13.1.1** — Replace the stale "Current Findings" section with the verified baseline and the `[DONE]`/`[OPEN]`/`[NEW]`/`[FIX]` status model.

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

2. [x] **13.1.2** — Apply the five corrections listed at the top of this document (the 17-vs-16 movie count, the fourth series record, the missing C.4 root cause, the file count, and the completion status of Part B).

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

3. [x] **13.1.3** — Carry the Product Decisions, Further Considerations, Scope Boundaries and defect-acceptance table verbatim.

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

4. [x] **13.1.4** — Record the scope amendment: provider-backed search replaces the zero-network-requests guarantee for the server, while the browser bundle keeps it.

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

5. [x] **Gate 13.1** — Verify the standing plan incorporates the three confirmed resolutions

   Files: `agent-instructions.md`. Acceptance: The confirmed decisions are explicit.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

## Phase 13.2 — Checklist

6. [x] **13.2.1** — One checkbox per actionable step, in execution order, phase by phase.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

7. [x] **13.2.2** — Each step names the file(s) it touches and its acceptance check.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

8. [x] **13.2.3** — Each phase ends with its gate (tests green, no 404s, screenshots captured) as an explicit checkbox.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

9. [x] **13.2.4** — A "Do not break" header block listing the invariants from 1.9 — storage keys, global names, load order, entry URL, backup compatibility.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

10. [x] **13.2.5** — A status column an implementer updates as work lands, so progress is visible without reading a diff.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

11. [x] **Gate 13.2** — Verify this checklist against the complete standing plan

   Files: `docs/IMPLEMENTATION-STEPS.md`, `agent-instructions.md`. Acceptance: Every actionable source requirement is traceable in execution order.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

## Phase 0 — Freeze the baseline

> Carried from old Part B Phase 1 (Baseline and Contracts).

12. [x] **0.1** — Run the two test files; record the 31/31 result with a timestamp — [DONE] — re-run before starting

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/baseline-tests.txt: 31 pass, 0 fail; every root application JS and inline script parsed. |

13. [x] **0.2** — Parse every JS file and the inline `index.html` script — [DONE] — covered by the existing parse test

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/baseline-tests.txt: 31 pass, 0 fail; every root application JS and inline script parsed. |

14. [x] **0.3** — Start `node _static-server.js`; inspect all 11 routes at `http://localhost:8973` — [OPEN]

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | baseline-routes.json: all 11 route identities and rendered headings verified; no broken visible images or console errors. Existing smoke helper has an outdated Explore heading, recorded for Phase 12. |

15. [x] **0.4** — Record current storage keys, backup format, router pages, script load order, and the `onespace:data-changed` / `onespace:page-changed` events — [OPEN]

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | baseline-contract.json records all 62 keys, version 4 exports and 2/3/4 imports, 11 routes, 22 scripts, 8 styles and event contracts; user-confirmed correction recorded. |

16. [x] **0.5** — Inventory every button, tab, link, form, checkbox, select, modal action, shortcut and page jump — recording owner, expected state change, persistence key, success feedback, error behaviour, focus return and reload behaviour — [OPEN] — this inventory is the acceptance checklist for Phase 12

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | interaction-inventory.json and INTERACTION-INVENTORY.md record source control templates and required acceptance fields; baseline-routes.json records visible route controls. Phase 12 outcomes remain pending. |

17. [x] **0.6** — Treat `storage-utils.js` as the only persistence validation boundary — [DONE] — holds today; must not regress

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

18. [x] **0.7** — Schemas for projects, work items, tasks, history, destinations, preferences, saved destinations, Personal records, game resources, game default tasks, movie/series metadata — [DONE] — all present and validated

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

19. [x] **0.8** — Generated IDs, timestamps, status enums, optional fields, maximum lengths in every schema — [DONE]

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

20. [x] **0.9–0.10** — Migration behaviour and safe defaults for existing records and v2 backups — [DONE] — v2 and v3 accepted, v4 current

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

21. [x] **0.11** — Capture "before" screenshots of Work, Games, Movies and Settings at 1440 / 1024 / 760 / 390 px — [NEW] — comparison set for the redesign

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 16 before screenshots in docs/implementation-evidence/before; widths 1440/1024/760/390. Layout measurements in before-layouts.json. Existing Work sidebar overlap recorded for Phase 2. |

22. [x] **0.12** — Export a v4 backup from the live origin before any other phase runs — [NEW] — no later phase can then lose real data

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | live-origin-baseline-v4.json exported using the actual Settings control; all 62 keys validate and restore round trip succeeds. See baseline-backup-validation.json. |

23. [x] **Gate 0** — Verify baseline tests, all routes, contracts, interaction inventory, 16 screenshots, and live-origin v4 backup

   Files: `docs/implementation-evidence/`. Acceptance: Phase 0 evidence exists before any application change.

   | Status | Evidence |
   |---|---|
   | Verified | 31/31 baseline tests, 11 routes, contracts, interaction inventory, 16 screenshots and genuine live-origin backup retained. |

## Phase 1 — Repository regrouping

### §1.8 batch 1 — shared

24. [x] **1.8.1.move1** — Use git mv for `storage-utils.js` → `shared/storage-utils.js`, preserving its contents (§1.2)

   Files: `storage-utils.js`, `shared/storage-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

25. [x] **1.8.1.move2** — Use git mv for `catalog-utils.js` → `shared/catalog-utils.js`, preserving its contents (§1.2)

   Files: `catalog-utils.js`, `shared/catalog-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

26. [x] **1.8.1.move3** — Use git mv for `shortcut-utils.js` → `shared/shortcut-utils.js`, preserving its contents (§1.2)

   Files: `shortcut-utils.js`, `shared/shortcut-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

27. [x] **1.8.1.move4** — Use git mv for `shortcut-surface.js` → `shared/shortcut-surface.js`, preserving its contents (§1.2)

   Files: `shortcut-surface.js`, `shared/shortcut-surface.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

28. [x] **1.8.1.move5** — Use git mv for `domain-ui.js` → `shared/domain-ui.js`, preserving its contents (§1.2)

   Files: `domain-ui.js`, `shared/domain-ui.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

29. [x] **1.8.1.move6** — Use git mv for `tooltip-utils.js` → `shared/tooltip-utils.js`, preserving its contents (§1.2)

   Files: `tooltip-utils.js`, `shared/tooltip-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

30. [x] **1.8.1.move7** — Use git mv for `visual-utils.js` → `shared/visual-utils.js`, preserving its contents (§1.2)

   Files: `visual-utils.js`, `shared/visual-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

31. [x] **1.8.1.move8** — Use git mv for `cinematic-scenes.js` → `shared/cinematic-scenes.js`, preserving its contents (§1.2)

   Files: `cinematic-scenes.js`, `shared/cinematic-scenes.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

32. [x] **1.8.1.require** — Set the temporary storage validator require to ../trip-board (confirmed resolution)

   Files: `shared/storage-utils.js`. Acceptance: The validator dependency resolves before Explore moves.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

33. [x] **1.8.1.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

34. [x] **1.8.1.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 2 — styles

35. [x] **1.8.2.move1** — Use git mv for `pages.css` → `styles/pages.css`, preserving its contents (§1.2)

   Files: `pages.css`, `styles/pages.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

36. [x] **1.8.2.move2** — Use git mv for `cinematic-refinement.css` → `styles/cinematic-refinement.css`, preserving its contents (§1.2)

   Files: `cinematic-refinement.css`, `styles/cinematic-refinement.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

37. [x] **1.3.url1** — Prefix CSS assets/game-art/cyberpunk-2077-hero.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

38. [x] **1.3.url2** — Prefix CSS assets/movie-art/inception-background.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

39. [x] **1.3.url3** — Prefix CSS assets/game-art/hades-hero.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

40. [x] **1.3.url4** — Prefix CSS assets/movie-art/matrix-background.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

41. [x] **1.3.url5** — Prefix CSS assets/page-art/personal-cinematic.webp with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

42. [x] **1.8.2.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

43. [x] **1.8.2.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 3 — games

44. [x] **1.8.3.move1** — Use git mv for `games.js` → `games/games.js`, preserving its contents (§1.2)

   Files: `games.js`, `games/games.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

45. [x] **1.8.3.move2** — Use git mv for `games-data.js` → `games/games-data.js`, preserving its contents (§1.2)

   Files: `games-data.js`, `games/games-data.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

46. [x] **1.8.3.move3** — Use git mv for `game-resources.js` → `games/game-resources.js`, preserving its contents (§1.2)

   Files: `game-resources.js`, `games/game-resources.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

47. [x] **1.8.3.move4** — Use git mv for `games.css` → `games/games.css`, preserving its contents (§1.2)

   Files: `games.css`, `games/games.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

48. [x] **1.8.3.move5** — Use git mv for `games-cinematic.css` → `games/games-cinematic.css`, preserving its contents (§1.2)

   Files: `games-cinematic.css`, `games/games-cinematic.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

49. [x] **1.8.3.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

50. [x] **1.8.3.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 4 — movies

51. [x] **1.8.4.move1** — Use git mv for `movies.js` → `movies/movies.js`, preserving its contents (§1.2)

   Files: `movies.js`, `movies/movies.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

52. [x] **1.8.4.move2** — Use git mv for `movies-data.js` → `movies/movies-data.js`, preserving its contents (§1.2)

   Files: `movies-data.js`, `movies/movies-data.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

53. [x] **1.8.4.move3** — Use git mv for `movies.css` → `movies/movies.css`, preserving its contents (§1.2)

   Files: `movies.css`, `movies/movies.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

54. [x] **1.8.4.move4** — Use git mv for `movies-cinematic.css` → `movies/movies-cinematic.css`, preserving its contents (§1.2)

   Files: `movies-cinematic.css`, `movies/movies-cinematic.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

55. [x] **1.8.4.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

56. [x] **1.8.4.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 5 — explore

57. [x] **1.8.5.move1** — Use git mv for `explore.js` → `explore/explore.js`, preserving its contents (§1.2)

   Files: `explore.js`, `explore/explore.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

58. [x] **1.8.5.move2** — Use git mv for `explore-data.js` → `explore/explore-data.js`, preserving its contents (§1.2)

   Files: `explore-data.js`, `explore/explore-data.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

59. [x] **1.8.5.move3** — Use git mv for `explore-global.js` → `explore/explore-global.js`, preserving its contents (§1.2)

   Files: `explore-global.js`, `explore/explore-global.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

60. [x] **1.8.5.move4** — Use git mv for `discovery-integration.js` → `explore/discovery-integration.js`, preserving its contents (§1.2)

   Files: `discovery-integration.js`, `explore/discovery-integration.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

61. [x] **1.8.5.move5** — Use git mv for `discovery-ui.js` → `explore/discovery-ui.js`, preserving its contents (§1.2)

   Files: `discovery-ui.js`, `explore/discovery-ui.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

62. [x] **1.8.5.move6** — Use git mv for `local-discovery.js` → `explore/local-discovery.js`, preserving its contents (§1.2)

   Files: `local-discovery.js`, `explore/local-discovery.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

63. [x] **1.8.5.move7** — Use git mv for `trip-board.js` → `explore/trip-board.js`, preserving its contents (§1.2)

   Files: `trip-board.js`, `explore/trip-board.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

64. [x] **1.8.5.move8** — Use git mv for `discovery.css` → `explore/discovery.css`, preserving its contents (§1.2)

   Files: `discovery.css`, `explore/discovery.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

65. [x] **1.8.5.require** — Set the final storage validator require to ../explore/trip-board

   Files: `shared/storage-utils.js`. Acceptance: The moved dependency resolves.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

66. [x] **1.8.5.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

67. [x] **1.8.5.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 6 — work

68. [x] **1.8.6.move1** — Use git mv for `projects.js` → `work/projects.js`, preserving its contents (§1.2)

   Files: `projects.js`, `work/projects.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

69. [x] **1.8.6.move2** — Use git mv for `work-tracker.js` → `work/work-tracker.js`, preserving its contents (§1.2)

   Files: `work-tracker.js`, `work/work-tracker.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

70. [x] **1.8.6.move3** — Use git mv for `tracker.css` → `work/tracker.css`, preserving its contents (§1.2)

   Files: `tracker.css`, `work/tracker.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

71. [x] **1.8.6.move4** — Use git mv for `personal-controller.js` → `personal/personal-controller.js`, preserving its contents (§1.2)

   Files: `personal-controller.js`, `personal/personal-controller.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

72. [x] **1.4.1** — In this same batch, replace the static-server blocked segments with tests, node_modules, outputs, api, server, config, secrets

   Files: `_static-server.js`. Acceptance: Work files are served and sensitive directories remain inaccessible.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

73. [x] **1.8.6.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

74. [x] **1.8.6.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 7 — server

75. [x] **1.8.7.move1** — Use git mv for `_static-server.js` → `server/_static-server.js`, preserving its contents (§1.2)

   Files: `_static-server.js`, `server/_static-server.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

76. [x] **1.8.7.move2** — Use git mv for `providers/` → `server/providers/`, preserving its contents (§1.2)

   Files: `providers/`, `server/providers/`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

77. [x] **1.8.7.move3** — Use git mv for `REVISED-IMPLEMENTATION-PLAN.md` → `docs/REVISED-IMPLEMENTATION-PLAN.md`, preserving its contents (§1.2)

   Files: `REVISED-IMPLEMENTATION-PLAN.md`, `docs/REVISED-IMPLEMENTATION-PLAN.md`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

78. [x] **1.8.7.move4** — Use git mv for `agent-instructions.md` → `docs/agent-instructions.md`, preserving its contents (§1.2)

   Files: `agent-instructions.md`, `docs/agent-instructions.md`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

79. [x] **1.5.1** — **`config/secrets/`** with a committed `.gitkeep`; everything else in it is ignored.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

80. [x] **1.5.2** — **`config/secrets.example.json`** — committed template, placeholder values only. **[NEW]** it now documents the keys Phase 6 will actually consume: `TMDB_API_KEY`, and `IGDB_CLIENT_ID` + `IGDB_CLIENT_SECRET` or `RAWG_API_KEY`.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

81. [x] **1.5.3** — **`.gitignore`** at the repository root:

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

82. [x] **1.5.4** — **Server-only.** No file under `config/` may be referenced by `index.html` or any browser script. Browser JS is fully readable, so a key placed there is a published key.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

83. [x] **1.5.5** — **Not servable.** `config` and `secrets` are in the block list (1.4 item 1). The extension allowlist is a useful second layer but **not sufficient alone** — `_static-server.js` serves only its MIME-mapped extensions, so `secrets.json` would 404 incidentally, but a credential file named `.js` **would be served in full**. The segment block is the real control. `tests/browser-server.js` has *no* deny list and does serve `.json`, so it must never point at a tree containing real credentials.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

84. [x] **1.5.6** — **Not used in this phase.** Phase 1 creates the folder, template and ignore rules only.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

85. [x] **1.8.7.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

86. [x] **1.8.7.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

87. [x] **1.8.8.parse** — Replace the flat parse loop with a recursive source walk excluding tests, node_modules, config and assets (§1.4.2)

   Files: `tests/data-regression.test.js`. Acceptance: The recursive file count matches the source inventory.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

88. [x] **1.7.1** — every `<script src>` and `<link href>` in `index.html` resolves to a file on disk

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

89. [x] **1.7.2** — every repo-relative `require(...)` in every source and test file resolves

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

90. [x] **1.7.3** — every `assets/...` string literal in JS and every `url(...)` in CSS resolves

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

91. [x] **1.7.4** — the recursive parse walk visits a file count matching the expected source inventory (guards 1.4 item 2 from regressing)

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

92. [x] **1.7.5** — no file under `config/` is referenced from `index.html` or any browser script

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

93. [x] **1.7.6** — the 22 `<script src>` values appear in exactly the expected order (guards 1.4 item 4)

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

94. [x] **1.7.7** — every `assets/...` literal still satisfies the three `^assets/` validators (guards the 1.3 decision against a later accidental asset move)

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

95. [x] **1.6.browser-server** — Confirm the disposable server resolves the repository root and retains its MISSING_ASSET hook

   Files: `tests/browser-server.js`. Acceptance: The forced assets/destinations/azores.svg failure still works.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

96. [x] **1.6.README** — Update server commands, load-order paragraph and file references listed in §1.6

   Files: `README.md`. Acceptance: Commands and paths match the regrouped files; final content rewrite remains §13.3.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

97. [x] **1.6.VERIFICATION** — Correct bare test filenames and the 18973 → 18974 port error listed in §1.6

   Files: `VERIFICATION.md`. Acceptance: Documented paths and port match the test server.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

98. [x] **Gate 1** — 31 baseline tests remain green; structural assertions pass; zero 404s; follow history across games/games.js; probe.js under config/secrets returns 404

   Files: `tests/`, `server/_static-server.js`, Git history. Acceptance: Record every §1.9 gate result.

   | Status | Evidence |
   |---|---|
   | Verified | 39/39 tests pass; all seven batch HTTP/browser gates pass; config/secrets/probe.js and api-keys.json blocked; commit 6b4e27e preserves git log --follow games/games.js history. |

## Phase 2

> The first step of the tracker rebuild, and the first feature phase after the regroup.

## 2.1 Route consolidation [NEW]

99. [x] **2.1.1** — Merge Projects into Work as a sub-view. `projects` stays in the `PAGES` array as a **redirect alias** to `work` with the Projects sub-view selected, so existing `orbit-page` values and the 14 hardcoded `goToPage` / `data-page-jump` call sites keep working. Storage keys untouched.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

100. [x] **2.1.2** — One route, four sub-views under a single header:

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

101. [x] **2.1.3** — **Board** (default) — active stories and defects

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

102. [x] **2.1.4** — **Projects** — project CRUD, moved wholesale from the Projects route

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

103. [x] **2.1.5** — **Backlog** — closed items

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

104. [x] **2.1.6** — **History** — the event log

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

105. [x] **2.1.7** — `work/projects.js` keeps owning `orbit-work-projects` CRUD and its card component; only its mount target changes. Its two foreign responsibilities move out: `#homeOverview` rendering (`projects.js:40-43`) goes to a Home aggregator module, and the Work-overview fallback (`projects.js:44-47`) is deleted — `work-tracker.js:51` already overwrites it, and it is a domain leak (Phase 3).

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

## 2.2 Layout [NEW]

106. [x] **2.2.1** — **Results region** — `.domain-grid` is locked to 2 columns until 1440px (`tracker.css:2`). Becomes `repeat(auto-fill, minmax(320px, 1fr))`.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

107. [x] **2.2.2** — **Detail region** — `#workDetail` renders full-width *below* the grid as one long prose column (`work-tracker.js:52,66-69`). Becomes a right-side drawer at ≥1100px and a full-screen sheet below, reusing the existing `OneSpaceUI` modal stack, focus trap, Escape handling and inert background from `shared/domain-ui.js` — not a new dialog implementation.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

108. [x] **2.2.3** — **Focus rail** — the fixed 352px `#focusRail` costs Work ~170px of content width versus every other page (`index.html:93`). Its contents are non-work-domain (Phase 3 empties it), so the rail leaves Work and the width clamp is normalised.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

## 2.3 Filters [NEW]

109. [x] **2.3.1** — `.domain-filters` puts 5 selects + a search field + a submit button into a fixed 3-column grid, and filtering requires pressing "Apply filters". Rebuild as one responsive filter bar with **live filtering** (debounced text, immediate selects), a dismissible active-filter chip row, and a result count. Add the **sort control that does not exist today** — sorting is hardcoded priority→deadline→createdAt at `work-tracker.js:29`.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify every stated criterion and retain the visual or automated evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

## 2.4 Card and tile quality [NEW]

110. [x] **2.4.1** — **Overview tiles**: `work-tracker.js:51` emits bare `<div><span>…</span><strong>n</strong></div>`, omitting `.overview-tile-top` / `.overview-tile-bottom`, so none of the icon-slot and arrow styling in `pages.css:248-251` applies — three unstyled labels over oversized serif numerals. Emit the same structure as every other overview tile, as `<button data-page-jump>` like `projects.js:29`.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

111. [x] **2.4.2** — **Work item cards**: a flat gradient rectangle printing raw lowercase `esc(i.status)` / `esc(i.priority)` (`work-tracker.js:59`). Add a type glyph (story vs defect) from the existing inline SVG set, priority as a colour-coded rail rather than a word, **capitalised status labels** per the standing labelling rule, and a real task progress bar replacing the "n / m tasks complete" text.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

112. [x] **2.4.3** — **Section heading**: emit the `.page-section-head h2 > .icon` tile that `cinematic-refinement.css:76-77` already styles and the tracker alone never provides.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

113. [x] **2.4.4** — `#workTracker` (`index.html:484`) has no `data-reveal` unlike its siblings — add it.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

## 2.5 Render mechanics [NEW]

114. [x] **2.5.1** — `work-tracker.js:52` rewrites the whole section's `innerHTML` on every mutation, forcing the manual focus-restoration hack at `:50,64` and a cosmetic "is-updating" pulse. Scope re-renders to the changed region (results list, detail drawer, filter bar) so focus, scroll position and the caret survive naturally. Keep `OneSpaceUI.confirm` for destructive actions.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

## 2.6 Behaviour preserved from old Part B Phase 2

> All already built; must not regress. Re-verify each after the redesign.

115. [x] **2.6.1** — Stabilise `work-tracker.js` as the module home instead of growing the inline script — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

116. [x] **2.6.2** — Keep `projects.js` compatible with Home/Work project summaries — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

117. [x] **2.6.3** — Storage keys and validation for projects, items, tasks, history — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

118. [x] **2.6.4** — Backup / restore / reset / complete / invalid / legacy / current fixtures updated — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

119. [x] **2.6.5** — Project CRUD: name, description, link, tags, status, progress, deadline — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

120. [x] **2.6.6** — Story/defect CRUD under a selected project — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

121. [x] **2.6.7** — Item fields: name, type, status, priority, analysis, plan, execution, labels, deadline, reminder, links — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

122. [x] **2.6.8** — Validate required name, project, type and status fields — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

123. [x] **2.6.9** — Reject invalid URLs and invalid dates — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

124. [x] **2.6.10** — Task CRUD: title, details, priority, due date, estimate, done — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

125. [x] **2.6.11** — Accessible task checkboxes with completion styling and progress counts — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

126. [x] **2.6.12** — Open / reopen / in-progress / blocked / close lifecycle — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

127. [x] **2.6.13** — Closing an item completes all child tasks, stores completion time, creates a log entry, removes it from active views — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

128. [x] **2.6.14** — Closed items persist in backlog and reopen without losing task history — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

129. [x] **2.6.15** — Views: active projects, active items, due soon, overdue, blocked, backlog, history — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

130. [x] **2.6.16** — Filters by project, type, status, priority, deadline, search text — [DONE] — upgraded to live in 2.3

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

131. [x] **2.6.17** — Replace the generic Work timeline with real item and task priorities — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

132. [x] **2.6.18** — Keep a link to Productivity for general daily tasks — **[FIX] reversed** — this is a domain leak; removed in Phase 3

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

133. [x] **2.6.19** — Due-soon / overdue badges, reminder panels, page-entry toasts — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

134. [x] **2.6.20** — Respect reduced motion for reminder and state-change animations — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase2/acceptance.json; 40 tests pass; Work viewport and drawer screenshots at four widths. |

135. [ ] **2.6.21** — Verify every Work button end to end — [OPEN] — Phase 12

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

136. [x] **Gate 2** — every Work action from the Phase 0.5 inventory still works; 31/31 green; side-by-side screenshots at all four widths show no overflow and no overlap.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Record the stated gate results.

   | Status | Evidence |
   |---|---|
   | Verified | 40 tests pass; browser lifecycle and four-width geometry in phase2/acceptance.json. Viewport captures verify layout without full-page capture artifacts. |

## Phase 3

> Home is the only aggregator. Every other tab renders only its own domain. Each row is a confirmed leak.

137. [x] **3.row1** — 1 — Work overview tile counts `orbit-tasks` (generic daily tasks) — `projects.js:44-47` — Delete the fallback path

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

138. [x] **3.row2** — 2 — "General daily tasks" button in Work's timeline head — `index.html:482` — Remove

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

139. [x] **3.row3** — 3 — Work hero CTA "Start a focus session" → Productivity — `index.html:471` — Replace with a work-domain action

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

140. [x] **3.row4** — 4 — Work-only focus rail renders `orbit-tasks`, countdowns, `orbit-notes-list`, recents — `index.html:153-159`, fed `1980-1985`, `2049-2053`, `2761-2765` — Rail leaves Work (2.2); its content belongs to Productivity and Notes. Note `index.html:61` already hides three of its five sections, leaving dead markup

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

141. [x] **3.row5** — 5 — Mobile "Today & Focus" toggle on Work — `index.html:466` — Remove with the rail

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

142. [x] **3.row6** — 6 — Project deadlines pushed into Work reminders *after* the timeline list is already written — `work-tracker.js:75` — Fold into the Projects sub-view consistently

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

143. [x] **3.row7** — 7 — Home Quick Access mixes all three spaces unfiltered — `index.html:1354-1365` — Allowed — Home is the aggregator. Label each tile with its space

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

144. [x] **3.row8** — 8 — Home's "Shortcuts available" count follows the *Shortcuts page's* selected space — `index.html:1368` via `activeLinks()` — Count all spaces, or state which space

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

145. [x] **3.row9** — 9 — 8 Gaming built-ins + `youtube` / `maps` routed into Explore, then relabelled "Relax & Play" — `shortcut-utils.js:3`, `index.html:1167` — Make Gaming a real category (Phase 7)

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

146. [x] **3.row10** — 10 — `Gaming` exists in `CATEGORIES` but `visibleCategories()` never returns it — `index.html:1117`, `1172-1176` — Make reachable

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

147. [x] **3.row11** — 11 — Explore tiles jump to Games / Movies / Productivity; the Productivity tile uses **Personal's** hero art — `index.html:553-555`, `cinematic-refinement.css:102` — Remove cross-domain tiles from Explore; they belong on Home

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

148. [x] **3.row12** — 12 — `#endWorkdayBtn` (a Work control) calls `applySpace("explore")` + `goToPage("explore")` — `index.html:2100-2109` — Stop relocating the user out of Work

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

149. [x] **3.row13** — 13 — Games and Movies write `data-games-theme` / `data-movies-theme` to `<body>` and never clear them — `games.js:693`, `movies.js:954` — Scope to the view root, or clear in `goToPage`

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

150. [x] **3.row14** — 14 — Dead pre-router CSS hiding nodes that now live inside `[data-page-when]` sections — `index.html:89-90` — Delete

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

151. [x] **3.row15** — 15 — **The shared storage boundary reaches into a domain** — `shared/storage-utils.js:49` calls `require('../explore/trip-board')` inside the `orbit-trip-board` validator — `storage-utils.js:49` — Inject domain validators instead of requiring across domains. Phase 1 only repoints the path because it forbids behaviour change; the real fix lands here

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

> **Productivity keeps** the generic `orbit-tasks` list, the timer and countdowns — it is their owning domain. Nothing is deleted from the app; content moves to the tab that owns it.

## 3.1 The Home aggregator module [NEW]

> Home is the only page allowed to read across domains, so it needs a real owner rather than being rendered from inside `work/projects.js`.

152. [x] **3.1.1** — Create `home/home-overview.js` (a new top-level domain folder, following the Phase 1 structure) which:

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

153. [x] **3.1.2** — Takes over `#homeOverview` from `projects.js:40-43`, reading `orbit-work-projects`, `orbit-tasks` and `orbit-notes-list` as it does today.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

154. [x] **3.1.3** — Becomes the single place cross-domain aggregation is permitted, so the Phase 3 boundary test can allow exactly this one module and forbid everything else.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

155. [x] **3.1.4** — Gains the cross-domain destination tiles removed from Explore (row 11) and the space labels required by rows 7 and 8.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

156. [x] **3.1.5** — Is a pure side-effect module in the load order, placed after the inline shell and after `work/projects.js` (it reads `window.OneSpace` and the same storage helpers).

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

157. [x] **3.1.6** — Its `<script src>` tag is added to `index.html` in this phase, not in Phase 1 — Phase 1 forbids behaviour change, and the structural test from 1.7 asserts an exact script count and order, so that expectation is updated here alongside the new tag.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

158. [x] **Gate 3** — a new test asserting each page's DOM subtree reads only its own domain's storage keys, with `home/home-overview.js` the single allowed exception.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Record the stated gate results.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase3-acceptance.json; 44 tests pass including four domain-boundary tests. |

## Phase 4

## 4.1 Fix what blocks new themes [FIX]

> Not extra scope — the requested theme work cannot land without these:

159. [x] **4.1.1** — **`cinematic-scenes.js:26-34` groups the Settings card by field *index*** (slices `[0,2)`, `[2,7)`, `[7,]`). Adding any new setting silently files controls under the wrong heading. Replace index slicing with declared membership (a `data-settings-group` attribute per field) **before** adding settings.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

160. [x] **4.1.2** — **The header theme toggle destroys the palette** — `index.html:1574-1581` forcibly resets `paletteChoice` to `"classic"` and removes `data-palette`, wiping a selected Aurora / Graphite / Deep Space choice. Make light/dark orthogonal to palette.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

161. [x] **4.1.3** — **"Deep Space" (`midnight`) has no CSS variable block** — it appears only in the dark-mode selector lists at `index.html:21` and `34-36`, so it renders identically to plain dark. Give it real tokens.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

162. [x] **4.1.4** — **`--page-accent` is defined twice and fights over cascade order** — `cinematic-refinement.css:4-15` sets per-page hex values; `pages.css:193-195` sets a different set then `body { --page-accent: var(--accent) }`. Establish one owner.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

163. [x] **4.1.5** — **Reset correctness** — `index.html:1656-1689` "Reset preferences" also wipes favorites, recents, collapsed sections and search provider, and does **not** reset `orbit-theme`, so a dark theme survives a reset while unrelated user data is destroyed. Reset preferences only.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

## 4.2 New themes [NEW]

164. [x] **4.2.1** — Extend the `data-palette` system (tokens `--bg`, `--bg-2`, `--surface`, `--surface-2`, `--surface-3`, `--accent`, `--accent-2`, `--accent-soft`, `--line`, `--text`, `--muted`, `--faint`) with new palettes beside the existing five (Auto, Classic Light, Deep Space, Aurora, Graphite) and four accents (blue, purple, green, amber).

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

165. [x] **4.2.2** — Each new palette must: define the complete token set in both light and dark; pass WCAG AA contrast for body text and controls; ship a swatch preview in the existing `.theme-choices` radiogroup. Per old C.7 point 1, at least one is a **warm** direction — today's `--os-*` tokens run cool.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify every stated criterion and retain the visual or automated evidence.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

## 4.3 New settings [NEW]

166. [x] **4.3.1** — **Per-tab scene intensity** — Full / Subtle / Off, governing Phase 5 ambient motion independently of the motion override.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

167. [x] **4.3.2** — **Surface the Games and Movies sub-themes.** `games.js:168-173` (midnight / neon / crimson / aurora) and `movies.js:162-167` (marquee / noir / velvet / golden) are real theme systems with their own storage keys that Settings never exposes.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

168. [x] **4.3.3** — **Removed shortcuts** restore list (Phase 7).

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

169. [x] **4.3.4** — **Provider status** panel (Phase 6) — configured / not configured / offline.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

## 4.4 Preserved settings behaviour

170. [x] **4.4.1** — Existing settings (palette, background, start page, accent, density, productivity area, clock format, motion) and the Data block (export / import / backup status / reset preferences / reset all data) keep their storage keys and behaviour. [DONE] — must not regress.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

171. [x] **Gate 4** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/phase4/acceptance.json; 49 tests. Cross-phase controls remain assigned to Phases 5–7. |

## Phase 5

> Delivers old Part B Phase 7 and old C.7, using **code-drawn animated scenes**: layered inline SVG + CSS driven by `body[data-page]`. No new binary assets, no external requests. The Games page already proves the technique with its five-layer stack (`gv-scene-art` / `-shade` / `-glow` / `-fog` / `-particles`).

## 5.1 One scene system, replacing three [FIX]

172. [x] **5.1.1** — Three uncoordinated entry-animation systems run today: `.is-page-entering` (`index.html:1797-1799`), `.scene-enter` (`discovery-integration.js:14`), and the CSS `osEnter` keyframe (`cinematic-refinement.css:131-132`). Two independent parallax variable sets exist — `--px` / `--py` (`index.html:2961-2970`, with **no consumer in the stylesheets**) and `--scene-x` / `--scene-y` (`discovery-integration.js:15`). Collapse into one scene controller owning entry transition, parallax, ambient motion and reveal, exposed on `window.OneSpace`.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

## 5.2 Per-tab scenes [NEW]

173. [x] **5.2.1** — Each of the 10 distinct pages gets a layered scene; the 11th route, Projects, redirects to Work and shares its scene (user-confirmed). Each page has a scene whose subject matches its domain, following the visual directions already agreed: **Home** = observatory / personal command deck; **Work** = drafting room / command centre; **Personal** = calm ritual space; **Explore** = world atlas / travel window; **Games** = game-world spotlight; **Movies & Series** = theater / streaming marquee; **Shortcuts** = navigable launch wall; **Productivity** = focused timer studio; **Notes** = quiet capture desk; **Settings** = control room.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

174. [x] **5.2.2** — Every scene composes: a drawn SVG backdrop; a depth layer with pointer parallax; a slow ambient layer (drifting light, motes, gradient shift); and a shade scrim guaranteeing text contrast. The nine existing `assets/page-art/*` stills are retained as an optional art slot behind the drawn layers, so a real render can replace a drawn backdrop later without code changes.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

## 5.3 Close the gaps [FIX]

175. [x] **5.3.1** — **Games and Movies get a `.page-hero`** with eyebrow, headline and scene caption, and join the scene numbering — currently 01–09 with both absent from the `scenes` map in `cinematic-scenes.js:5`.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

176. [x] **5.3.2** — `#moviesView` is an empty `<div id="moviesMount">` (`index.html:570-572`) until `movies.js` mounts, so it renders nothing cinematic on first paint. Ship hero markup in the document.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

177. [x] **5.3.3** — `index.html:494` uses class `projects-scene`, which **has no matching selector anywhere** — a dead class.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

178. [x] **5.3.4** — Games `world` values `neon` and `aurora` exist in `games-data.js` with **no CSS rule** and silently fall back to the amber default.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

179. [x] **5.3.5** — `cinematic-scenes.js:13-22` injects heading icons by brittle `nth-child` position — move to explicit markup hooks.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

180. [x] **5.3.6** — Gradient-only fallback heroes now dead behind the art layer (`pages.css:81, 113, 136, 148, 171`) — remove or repurpose.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

## 5.4 Interaction rules carried from old Phase 7

181. [x] **5.4.1** — Entry transition per tab — short, content-first, never delaying interaction — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

182. [x] **5.4.2** — Hero scene movement / parallax on pointer, stable on touch — [DONE] — unify in 5.1

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

183. [x] **5.4.3** — Parallax only on explicitly marked decorative layers; clamp values, use `translate3d`, never move text, forms, buttons or focus targets — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

184. [x] **5.4.4** — Scroll-linked depth only where it improves hierarchy, via IntersectionObserver with a fallback — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

185. [x] **5.4.5** — Staggered reveal for primary cards — visible content only, modest durations — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

186. [x] **5.4.6** — Meaningful transitions for search results, filter changes, detail open, save/remove, board status, task completion, tab change, image load and fallback — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

187. [x] **5.4.7** — Cinematic loading states matched to the section, not generic spinners — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

188. [x] **5.4.8** — Real image crossfades and sensible crop positioning — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

189. [x] **5.4.9** — Fallback art only on failed media requests; broken media still leaves a usable card — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

190. [x] **5.4.10** — One consistent inline SVG icon system, accessible labels retained — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

191. [x] **5.4.11** — Hover, focus, active, empty, loading, error, disabled, success states for every interactive surface — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

192. [x] **5.4.12** — Accessible labels, tooltips, `aria-pressed` / `aria-expanded` / `aria-current`, `aria-live` for saves, reminders, completion, close/reopen, deletion — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

193. [x] **5.4.13** — Touch targets sized for mobile; hover-only behaviour disabled on coarse pointers — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

194. [ ] **5.4.14** — Test at 1440 / 1024 / 760 / 390 px — no overlap or overflow — [OPEN] — Phase 12

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

195. [x] **5.4.15** — Handle long user text safely across all domains — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

196. [x] **5.4.16** — Modal focus return and focus preservation after dynamic rerenders — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

197. [x] **5.4.17** — Capture visual evidence that effects are visible, stable on touch, and disabled in reduced motion — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |

## 5.5 Motion contract [FIX]

198. [x] **5.5.1** — All motion routes through `prefersReducedMotion()` (`index.html:1705-1709`, exported at `:3084`). Four paths re-query `matchMedia` directly and therefore **ignore the user's "Full motion" override**: `index.html:1183`, `games.js:97`, `games.js:468`, `movies.js:87`. Route them through the helper. Reduced motion removes parallax, ambient drift, stagger and scroll-linked transforms **entirely** — genuinely still, not slowed.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 54 Node tests pass; ten scene screenshots and 40 viewport measurements in docs/implementation-evidence/phase5; reduced motion leaves all ten routes still; pointer regression covers clamp/reset/touch/Off. Final complete control matrix remains in Phase 12. |


## 5.6 Global icon modernization and consistency [NEW V2]

198A. [ ] **5.6.1** — Audit every visible application-control icon across Home, Work/Projects, Personal, Explore, Games, Movies & Series, Shortcuts, Productivity, Notes, Settings and shared navigation/dialog/search/filter/card surfaces.

   Files: `index.html`, `shared/`, `styles/`, domain JS/CSS files as required. Acceptance: Produce an inventory/audit showing which existing icons are retained and which require improvement; content/source brand marks and favicons are identified as exceptions rather than application-control icons.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

198B. [ ] **5.6.2** — Modernize only dated, inconsistent, ambiguous, poorly aligned or visually weak application icons into one coherent inline-SVG visual language.

   Files: `index.html`, `shared/`, `styles/`, affected domain files. Acceptance: Shared UI icons use consistent geometry, stroke/fill philosophy, optical sizing, alignment and spacing without unrelated redesign or icon churn.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

198C. [ ] **5.6.3** — Normalize shared action semantics so the same action uses the same recognizable glyph where context permits.

   Files: shared icon helpers/markup and affected domain surfaces. Acceptance: Add/edit/remove/back/more/favorite/search/filter/sort/save/restore/open/navigation/close/retry/expand-collapse do not use conflicting or random glyphs without an explicit reason; no accidental emoji/Unicode substitute controls remain.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

198D. [ ] **5.6.4** — Preserve icon accessibility and interaction quality.

   Files: affected markup/styles/shared UI helpers. Acceptance: Icon-only actions have accessible names, visible focus, adequate touch targets, correct ARIA state where applicable and tooltips where useful; decorative icons do not create redundant announcements; clear text labels are not removed merely to add icons.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

198E. [ ] **5.6.5** — Verify global icon quality across required themes and responsive widths.

   Files: all affected UI files; `docs/implementation-evidence/phase5/`; browser verification. Acceptance: All tabs are inspected at the active required desktop/tablet/mobile widths; no broken/missing/clipped/misaligned UI icons remain; icons are crisp/readable in light/dark and supported palettes; representative visual evidence covers navigation, headings, cards, forms/dialogs and shared actions. Brand/provider/source logos and favicons remain intentionally distinct.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |


199. [ ] **Gate 5** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `index.html`, `shared/`, `styles/`, affected domain files, `docs/implementation-evidence/phase5/`. Acceptance: Existing Phase 5 cinematic/motion evidence remains valid, and the newly approved 5.6 global icon-modernization requirements are also VERIFIED before Gate 5 closes again.

   | Status | Evidence |
   |---|---|
   | Pending | Gate 5 was previously Verified under the pre-5.6 scope. Prior Phase 5 evidence is retained; the gate is reopened only because the newly approved global icon-modernization requirement must now be completed and evidenced. |

## Phase 6

## 6.1 Server layer

200. [x] **6.1.1** — Extend `server/_static-server.js` (or add `server/api.js`) with a proxy reading credentials from `config/secrets/` — **server-side only, never in browser JS**. Routes: `/api/search/titles`, `/api/search/games`, `/api/details/:kind/:id`.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

> Carried from the old REVISED plan's provider requirements:

201. [x] **6.1.2** — Provider-neutral contract for title search, game search, and details.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

202. [x] **6.1.3** — Normalise every provider response into the app's existing record shapes, so the UI never sees a TMDB or IGDB payload.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

203. [x] **6.1.4** — `AbortController` cancellation when the query changes quickly.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

204. [x] **6.1.5** — Explicit loading, empty, timeout, rate-limit, offline, authentication and provider-error states.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

205. [x] **6.1.6** — Short-TTL response cache; cache must be clearable without deleting user records.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

206. [x] **6.1.7** — Pagination / load-more — never silently cap results.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

207. [x] **6.1.8** — Attribution and source links in details where the provider requires it.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

208. [x] **6.1.9** — A **local mock provider** so automated tests never need network access or quota.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

209. [x] **6.1.10** — A clear configuration-error state when credentials are missing — the UI explains what is unavailable rather than showing the local catalog as if it were global.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

## 6.2 Typeahead

210. [x] **6.2.1** — Both Games (`#gvGameSearch`, wired `games.js:1009-1028`) and Movies (`#mvMovieSearch`, wired `movies.js:802-821`) **already have real ARIA combobox typeaheads** over the local catalog, with arrow-key navigation, Escape, click-outside close, and an "Add Custom" row. [DONE] Keep both and extend:

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

211. [x] **6.2.2** — **Debounce input** — both currently fire on every keystroke.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

212. [x] **6.2.3** — **Two result groups** in one dropdown: "In your catalog" (local, instant) then "Search results" (provider, async) with a loading row.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

213. [x] **6.2.4** — **Explicit add affordance.** Selecting a row currently calls `addSuggestionToLibrary` / `addSeedToLibrary` **immediately**, with no confirmation and no status choice (`games.js:1004`, `movies.js:797`). Add an explicit add control, and for titles a status choice — matching the Discover panel (`discovery-ui.js:31`), which already does this properly.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

214. [x] **6.2.5** — **Series parity** — series are first-class in the same search; the type filter (`movies.js:1396`) gets capitalised `Movie` / `Series` labels.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

215. [x] **6.2.6** — **Offline / unconfigured state** is visible and explicit.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

## 6.3 Reconcile the two search experiences [FIX]

216. [x] **6.3.1** — `discovery-integration.js:3-9` mounts a second, unrelated Discover panel into Movies, renames the tab, wraps the existing preference chips into a `<details>`, and rewrites the typeahead placeholder. Games has the same split. Reconcile into one search experience per domain with one result-card design.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

217. [x] **Gate 6** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Verified | 59 tests pass; browser add/cancel/pagination/status/reload/keyboard/error/4-width checks in docs/implementation-evidence/phase6. Live credentials absent and visibly reported; provider tests use mocks. |

## Phase 7

## 7.1 Removable built-ins [NEW]

> All 47 built-ins (`index.html:1060-1112`) have **no delete and no edit control** — `cardHtml` (`index.html:1223`) and `shortcut-surface.js:6` both gate those on `custom`. The only removal mechanism is the hardcoded `HIDDEN_DEFAULT_IDS = ["hm","zara","maxmara"]` (`index.html:1163`).

218. [x] **7.1.1** — Add an `orbit-hidden-links` array key with a validator in `shared/storage-utils.js`, a fixture, and a backup round-trip test.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

219. [x] **7.1.2** — Every shortcut card — built-in or custom, full (`index.html:1215-1237`) and compact (`shortcut-surface.js:4-7`) — gets a Remove control. Custom keeps destructive delete; built-in hides.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

220. [x] **7.1.3** — A **Removed shortcuts** panel in Settings restores any of them.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

221. [x] **7.1.4** — Replace `HIDDEN_DEFAULT_IDS` with real user data, seeding those three ids on first run so nothing visibly changes for existing users.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

## 7.2 Add-control fixes [FIX]

222. [x] **7.2.1** — **Work has no add-shortcut control at all**, unlike Personal (`index.html:528`) and Explore (`index.html:559`). Add one.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

223. [x] **7.2.2** — **`index.html:2498` binds every `[data-add-space]` button to `openShortcutModal(null)` and never reads the attribute**, so the declared space is discarded and the modal guesses from `currentPage` / `currentSpace` (`:2478`). Honour the attribute.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

224. [x] **7.2.3** — `shortcut-surface.js:9` calls `renderExplorePage()` with no argument, silently clearing the Explore search filter whenever any shortcut is favorited.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

225. [x] **7.2.4** — "Duplicate" (`index.html:2585`) is a stub that only shows a toast. Implement or remove.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

## 7.3 Modernisation — old C.6

226. [x] **7.3.1** — Rebuild the card and launch wall on the inline SVG icon system with a favicon/hostname fallback chain that never renders a broken image.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

227. [x] **7.3.2** — Modern grid with proper hover, focus, active, empty, loading and error states; mobile-sized touch targets.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

228. [x] **7.3.3** — Drag-to-reorder **with a keyboard-accessible equivalent**; favorites and recents visually distinct rather than text-labelled.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

229. [x] **7.3.4** — Name, description and hostname in a clear hierarchy, with `rel="noopener noreferrer"` preserved.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

230. [x] **7.3.5** — Explore-owned shortcuts stay visually consistent but strictly scoped.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

## 7.4 Ownership rules preserved from old Part B Phase 3

231. [x] **7.4.1** — Shortcut modal has a description field and explicit space ownership — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

232. [x] **7.4.2** — Adding from Personal defaults to Personal; adding from Explore forces Explore — [DONE] — but see the 7.2 attribute bug

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

233. [x] **7.4.3** — Enforce ownership in sanitization and `linkSpace()` so links cannot leak between spaces — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

234. [x] **7.4.4** — Edit and delete confirmation for custom shortcuts — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

235. [x] **7.4.5** — Show name, description, hostname, icon fallback, favorite, recent, safe external-link behaviour — [OPEN] — hostname is not shown on the compact card

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

236. [x] **7.4.6** — Regression tests for deletion, descriptions, space filtering, duplicate URLs, backup round trips — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

237. [x] **Gate 7** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Verified | 62 tests; hide/restore/custom CRUD/keyboard order/reload/Explore filter and 20 responsive checks in docs/implementation-evidence/phase7. New preference keys are optional for legacy v4 imports. |

## Phase 8

## 8.1 Tracker type must be correct at add time [NEW]

> A tracker **is** already created at add time — `starterStory()` at `games.js:846`, `:676`, `:1641`, and `ensureWeekly()` for weekly. The real defect is that **the type is almost always wrong**: `SUGGESTION_CATALOG` (`games-data.js:182-195`) carries **no `trackerType`**, and `games.js:843` defaults to `g.trackerType || "story"`. Every one of the 12 suggestions — and every future provider result — becomes a story game with one generic 3-objective chapter.

238. [x] **8.1.1** — Add `trackerType` to every catalog record and to the provider normaliser.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

239. [x] **8.1.2** — Infer the default from genre and tags (live-service, MMO, looter, gacha, battle-royale → **weekly**; campaign, story-rich, single-player → **story**), and **show the inferred choice in the add flow so it can be corrected before saving**. The two `.gv-tracker-choice` pills (`index.html:729-732`) already exist for custom games.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

240. [x] **8.1.3** — Mission-based games get **real chapters**, not one catch-all. `OneSpaceGameResources.story` (`game-resources.js:25`) currently always produces a single `"Your first milestones"` chapter; extend the catalog so story games ship a chapter outline.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

241. [x] **8.1.4** — Editing a game from weekly → story leaves the old `story` object orphaned (`games.js:669-673`). Reconcile on type change.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

## 8.2 De-Diablo-ify the weekly tracker [FIX]

> Old Phase 5 step 3 required the resource model be data-driven "so Diablo Immortal is only one example". The weekly system is generic in its toggle logic but hardcodes Diablo in four places:

242. [x] **8.2.1** — `cloneWeeklyTemplate` special-cases `game.id === "game-diablo-immortal"` (`games.js:208`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

243. [x] **8.2.2** — `defaultTasks` / `defaultTaskTemplates.weekly` injection (`games-data.js:202,204`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

244. [x] **8.2.3** — the Overview stat tile (`games.js:724-725,744`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

245. [x] **8.2.4** — the literal heading `"Diablo Weekly Tasks"` (`games.js:1422`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

246. [x] **8.2.5** — Make all four data-driven so any weekly game behaves identically. Also fix the cascade order in `game-resources.js:24`, where the `defaultTasks` check precedes the `trackerType === 'weekly'` branch, so a record with story-flavoured `defaultTasks` reuses them as weekly tasks.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

247. [x] **8.2.6** — **[FIX] `resetWeekly()` destroys Diablo's task list.** `games.js:581` calls `cloneWeeklyTemplate()` with **no argument**, so `library.find(g => g.id === undefined)` yields `{}`, the Diablo special case does not match, and `OneSpaceGameResources.weekly({})` returns 3 generic tasks. Pressing "Reset Weekly Tasks" on Diablo Immortal replaces its 7 real tasks with 3 generic ones until the next ISO-week rollover restores them. Pass the game id. This phase already rewrites `cloneWeeklyTemplate`, so fix it in the same pass and add a test asserting reset preserves the game's own template.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

## 8.3 C.4 — checkboxes that will not un-check (approved root cause)

> `saveLibrary()` (`games.js:175`) and `saveWeekly()` (`:180`) **discard the boolean return from `safeSet`**, which returns `false` and toasts on a quota or validation failure (`index.html:927-939`). In-memory state flips, the UI re-renders checked, storage is unchanged — and the state reverts on reload. This is the most probable mechanism behind the report, and it was missing from the old plan's suspect list.

248. [x] **8.3.1** — **Fix.** Route both through the same read-back-and-rollback pattern as `commitGameChanges()` (`games.js:176-179`), surface a real error, and add regression tests asserting (a) the toggle is an involution — two toggles return the original state — and (b) a rejected write never leaves the UI showing a state storage does not hold.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

> **Secondary contributors to check during reproduction, in order:**

249. [x] **8.3.2** — **Week rollover mid-interaction.** `ensureWeekly` (`:211-220`) discards all `done` flags and re-clones the template whenever the ISO week key changes, and it is reached from **every render** via `weeklyStats` (`:238`).

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

250. [x] **8.3.3** — **`findChapter` is scoped to `selectedStoryGameId`** (`:498-502`), so an objective rendered for any other game silently no-ops.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

251. [x] **8.3.4** — `toggleWeeklyTask` depends on an ancestor `.gv-tracker[data-game-id]` (`:1565`); a weekly checkbox rendered elsewhere gets no handler.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

252. [x] **8.3.5** — Ruled out by inspection: the click delegate's `switch` (`:1522-1557`) has **no** case for `toggle-objective` or `toggle-weekly-task`, so they are handled only by the `change` listener (`:1558`) and are not double-fired.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

253. [x] **8.3.6** — Also ruled out: `is-just-checked` styling is applied only when the new state is `done === true` (`:351`, `:396-397`), so it cannot make an unchecked box look checked.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

## 8.4 Games behaviour preserved from old Part B Phase 5

254. [x] **8.4.1** — Records carry official, news, build, guide, update, community and platform links — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

255. [x] **8.4.2** — Default task/objective templates on game records — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

256. [x] **8.4.3** — Resource model data-driven, Diablo only one example — **[OPEN]** — see 8.2

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

257. [x] **8.4.4** — Per-game detail/resource panel — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

258. [x] **8.4.5** — Resources grouped into news/updates, builds/guides, official, community, game-specific tasks — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

259. [x] **8.4.6** — Catalog, suggestions, wishlist and custom flows initialise the correct story or weekly tasks — **[OPEN]** — see 8.1

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

260. [x] **8.4.7** — No duplicate task initialisation after rerender or reload — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

261. [x] **8.4.8** — Every built-in and custom game discoverable via genre filter, search, add, edit, delete, progress, resources — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

262. [x] **8.4.9** — Sessions, journal, themes, story objectives and weekly behaviour preserved — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

263. [x] **8.4.10** — Tests for resource mapping, default task creation, genre filtering, deletion cleanup — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

264. [ ] **8.4.11** — Verify every Games tab, filter, search, suggestion, library, wishlist, details, resource link, task, session, journal, theme, add, edit, delete and confirmation action — [OPEN] — Phase 12

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 8.5 Remaining games defects [FIX]

265. [x] **8.5.1** — **User-added games can never reach the spotlight.** `featuredGames()` (`games.js:1261-1263`) filters the spotlight rail to games that have `artwork`, and custom or provider-added games have none. Fall back to the deterministic `gameScene(game)` generator (`games.js:264-274`) that cards already use, so every tracked game is eligible.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

266. [x] **8.5.2** — **Unescaped selector in focus restoration.** `withFocusPreserved` (`games.js:1608`) concatenates attribute values into a `querySelector` string without escaping. Ids come from `uid()` today so it is safe, but a `data-id` containing a quote throws out of `querySelector` and aborts refocus. Use `CSS.escape`, or match by element reference rather than by selector.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

267. [x] **8.5.3** — **Reveal state bleeds between games.** Weekly task ids are `default-0..n` for every non-Diablo game (`game-resources.js:26`) and default chapter ids are `c1..c4` across games (`games-data.js`), while `revealedKeys` (`games.js:71`, `:104`) is a flat map. A freshly-rendered row therefore skips its reveal animation because another game already claimed that key. Namespace the reveal key by game id.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

268. [x] **8.5.4** — **Games `world` values `neon` and `aurora` have no CSS rule** and silently fall back to the amber default — also listed in Phase 5.3; fix in whichever phase runs first.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

269. [x] **Gate 8** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 8 acceptance.json; 71 Node tests; browser tracker lifecycle and four widths passed. Full action matrix assigned to Phase 12. |

## Phase 9

## 9.1 C.1 — a tracked title can never be untracked (confirmed defect)

> **Root cause, verified.** Every seed-add path — search dropdown (`movies.js:797`), suggestion cards (`:1247-1249`), hero (`:1048`), watchlist (`:1250-1251`), details modal (`:1234-1235`) — flows through `addSeedToLibrary`, which hard-sets `clone.custom = false` (`:442`). That single flag both suppresses the delete button (`:619`) and makes `deleteMovie` return early (`:458`). Line 460 is the **only** place anything is removed from `library`. The three status options are `unwatched | watched | watchlist` — none means "not tracked" — and `renderOverviewStats` counts `library.length` as "Titles tracked" (`:661`).

270. [x] **9.1.1** — **Fix.** Separate two concepts currently conflated under `custom`:

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

271. [x] **9.1.2** — **Untrack / Remove from library** — available for **every** tracked title, catalog or custom. Removes the record from `library` and the watchlist, returning it to an untracked catalog entry that can be re-added. `OneSpaceUI.confirm` then a toast.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

272. [x] **9.1.3** — **Delete custom title** — unchanged, still `custom`-only, since a custom record has no catalog entry to fall back to.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

273. [x] **9.1.4** — Drop the `!m.custom` guard from the untrack path, render the untrack control unconditionally on library cards and in the details panel, and make "Titles tracked" drop when a title is untracked.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

274. [x] **9.1.5** — **Also fix [FIX]:** the watchlist is derived from two sources at once — the legacy `watchlist` id array **and** `status === 'watchlist'` (`watchlistItems()` `:360-363`) — while `addToWatchlist` (`:465-467`) only ever writes the status. Reconcile to one source of truth.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

275. [x] **9.1.6** — **Verify.** Track a catalog movie → untrack it → it leaves Library, the tracked count decreases, it reappears as an untracked suggestion, and it is still untracked after reload. Repeat for a series and for a custom title, which must still offer permanent delete.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

## 9.2 C.2 — large movie images are blurred (confirmed cause)

> Not a CSS `blur()` — there is none on movie artwork. Per `assets/manifest.json`, every poster in `assets/movie-art/` is **300 × 450** (13–29 KB). Backdrops are 1920 × 1080 except `pulp-fiction-background.jpg` at 1280 × 720. A 300px source shown at 400–600 CSS px on a 2× display is upscaled 3–4×.

276. [x] **9.2.1** — Re-source posters at a minimum of **1000 × 1500** for detail/hero use, keeping the 2:3 ratio and file naming.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

277. [x] **9.2.2** — Keep a small variant for grid cards; serve both via `srcset` / `sizes`.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

278. [x] **9.2.3** — Bring `pulp-fiction-background.jpg` to 1920 × 1080.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

279. [x] **9.2.4** — Add a CSS guard so no image is scaled beyond its intrinsic width — a future undersized asset then looks visibly wrong rather than quietly blurry.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

280. [x] **9.2.5** — Update `assets/manifest.json` dimensions and bytes; record provenance in `assets/movie-art/SOURCES.md`.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

281. [x] **9.2.6** — Licensing constraint holds: no scraping, no unlicensed downloads. Where no licensed high-resolution image exists, render the deterministic fallback rather than shipping an upscaled blur.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

282. [x] **9.2.7** — Note `.mv-poster-img { object-fit: contain }` (`movies.css:97`) letterboxes posters rather than filling — review alongside the resolution change.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify every stated criterion and retain the visual or automated evidence.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

## 9.3 C.3 — series are effectively invisible

> `MOVIE_TYPES = ["movie","series"]` exists (`movies-data.js:17`) and there are exactly **4** series (`movies-data.js:137-142`: `tv-dark`, `tv-queens-gambit`, `tv-good-place`, `tv-chernobyl`) against 16 movies. All four carry `poster:{kind:'placeholder'}` and `backdrop:{kind:'placeholder'}`, plus `platforms:[]` and `rating:0` — so they render as generated SVG next to fully-illustrated movies, and `ratingLabel` prints `—`. They also land in the hero carousel as pure generated SVG, since the featured pool is all of `SEED_MOVIES` (`movies.js:1004`).

283. [x] **9.3.1** — Expand to at least 12–15 series spanning the same genre range, so type filtering returns a useful set.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

284. [x] **9.3.2** — Real local artwork at the 9.2 resolutions; remove every `kind:'placeholder'` from seed data.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

285. [x] **9.3.3** — Populate `platforms`, `rating`, `moods`, `tags` and a substantive `blurb`.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

286. [x] **9.3.4** — Make the `movie` / `series` filter first-class and visible, with capitalised `Movie` / `Series` labels.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

287. [x] **9.3.5** — Keep series cards honest about shape — seasons and approximate episode length, which `libraryCardHtml` already formats — **without** episode-by-episode tracking, which stays out of scope.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

> Phase 6's provider search makes catalog size far less critical, but the seeded set must still look credible offline.

## 9.4 Movies behaviour preserved from old Part B Phase 6

288. [x] **9.4.1** — First-class `type: movie\|series` in `movies-data.js` — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

289. [x] **9.4.2** — Series metadata, explanations, seasons — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

290. [x] **9.4.3** — Type and genre filters — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

291. [x] **9.4.4** — Cards, search, details, suggestions, watchlist views updated — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

292. [x] **9.4.5** — `movies` route and storage keys preserved — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

293. [x] **9.4.6** — Episode tracking stays lightweight — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

294. [x] **9.4.7** — Series-specific validation in `storage-utils.js` — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

295. [x] **9.4.8** — Backup fixtures and migration handling — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

296. [x] **9.4.9** — Tests for mixed search, type/genre filtering, suggestion explanations, watchlist, malformed series data — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

297. [ ] **9.4.10** — Verify every Movies & Series tab, type filter, genre filter, search, suggestion, detail, add/remove, watched state, watchlist, library and reload flow — [OPEN] — Phase 12

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 9.5 Confirmation dialog consistency [FIX]

298. [x] **9.5.1** — `deleteMovie` (`movies.js:459`) uses native `window.confirm`, while every other domain uses `OneSpaceUI.confirm` (`shared/domain-ui.js:26`) with the shell's modal stack, focus trap, Escape handling and inert background. A native dialog cannot be styled, ignores reduced-motion and theme, and breaks the focus-return contract the rest of the app honours. Move it to `OneSpaceUI.confirm`, which the new untrack flow in 9.1 already requires.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

299. [x] **Gate 9** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Verified | Phase 9 acceptance.json; 79 tests and browser lifecycle passed. Artwork uses explicit 9.2.6 licensing exception documented in assets/movie-art/SOURCES.md. |

## Phase 10

## 10.1 C.5 — real imagery and substantive descriptions

> `explore-data.js` holds 12 destinations, each pointing at `assets/destinations/<id>.svg`. These are **conceptual SVG illustrations, not photographs** — the old REVISED plan already flagged this as a missed requirement. Each record has `summary` and `details`, but the depth is uneven.

300. [ ] **10.1.1** — Real, properly licensed local imagery per destination at hero and card resolutions, following the 9.2 sizing and `srcset` rules.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

301. [ ] **10.1.2** — A substantive description per destination: what the place is, why it suits its tagged categories, best season and why, rough trip length, budget character, and what a traveller actually does there. `summary` stays short for cards; `details` carries the long form.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

302. [ ] **10.1.3** — Never blank: alt text always present; the deterministic fallback used only on a genuinely failed request.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

303. [ ] **10.1.4** — Licensing constraint maintained; attribution in a `SOURCES.md` beside the assets.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

304. [ ] **10.1.5** — **All destination art stays under root `assets/destinations/`** so the three `^assets/` validators (`storage-utils.js:36`, `local-discovery.js:5`, `trip-board.js:6`) keep accepting previously-saved user records.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 10.2 Resolve the `explore.js` discrepancy [OPEN]

305. [ ] **10.2.1** — Confirmed open: `explore.js` is required by `tests/tracker-regression.test.js:4` but is **not** among the 22 `<script src>` tags — the browser uses `explore-global.js`. Decide whether `explore.js` is loaded by `index.html` or whether its logic belongs in `explore-global.js`, and make the test and the browser agree. Note `explore.js` **auto-invokes `api.mount(root)` at load**, so simply adding the tag would double-mount.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 10.3 "More to explore" is not the final section [FIX]

306. [ ] **10.3.1** — Both the old REVISED plan (non-negotiable #6) and old Part B Phase 4 step 13 require "More to explore" be the last Explore section. It is currently **third of four**: Destinations → **More to explore** (`index.html:551`) → Explore shortcuts → chill strip. Move it last.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 10.4 Explore behaviour preserved from old Part B Phase 4

307. [ ] **10.4.1** — `explore-data.js` holds the curated destination catalog — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

308. [ ] **10.4.2** — Destination fields: ID, name, country/region, categories, budget, duration, season, style, tags, summary, details, links, image, fallback — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

309. [ ] **10.4.3** — `explore.js` holds persisted destination preferences — [DONE] — but see 10.2

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

310. [ ] **10.4.4** — Destination type, climate/season, trip length, budget, pace, interests, departure region — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

311. [ ] **10.4.5** — Deterministic, explainable recommendation ranking — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

312. [ ] **10.4.6** — Show why each destination was recommended — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

313. [ ] **10.4.7** — Preference controls, recommendation cards, details, save/favorite, shortlist/trip board, Explore-only shortcuts — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

314. [ ] **10.4.8** — "Surprise me" as a filtered random recommendation — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

315. [ ] **10.4.9** — Responsive destination images with fallback modelled on `visual-utils.js` — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

316. [ ] **10.4.10** — Accessible alt text; never a blank destination card — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

317. [ ] **10.4.11** — Tests for filtering, stable ranking, saved destinations, Explore-only shortcuts, malformed data — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

318. [ ] **10.4.12** — Verify preference controls, search/filter submission, recommendation cards, detail open/close, save/remove, notes, trip-board actions, Surprise Me, image fallback and reload — [OPEN] — Phase 12

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

319. [ ] **10.4.13** — Keep "More To Explore" last — **[OPEN]** — see 10.3

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

320. [ ] **Gate 10** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 11

> Old Part B Phase 3, personal half. All delivered; must not regress.

321. [ ] **11.1** — `makeCheckListController()` refactored into reusable add / edit / toggle / delete — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

322. [ ] **11.2** — Deletion routed through the existing modal/confirmation pattern — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

323. [ ] **11.3** — Toast and `aria-live` message after successful deletion — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

324. [ ] **11.4** — Separate storage for goals, routines and habits — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

325. [ ] **11.5** — Completion counts and progress summaries — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

326. [ ] **11.6** — Optional habit frequency / target metadata — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

327. [ ] **11.7** — Clear empty states — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

328. [ ] **11.8** — Verify add / edit / check / delete / cancel after rerender and reload — [OPEN] — Phase 12

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> **[NEW] Where Work's removed content lands.** Phase 3 strips five non-work surfaces from the Work page. None of them moves to Personal:

329. [ ] **11.9** — Next-up tasks (`orbit-tasks`) — Productivity — Productivity owns that key

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

330. [ ] **11.10** — Pomodoro timer mirror — Productivity — Already lives there

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

331. [ ] **11.11** — Countdowns (`orbit-countdowns`) — Productivity — Already rendered there

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

332. [ ] **11.12** — Quick note (`orbit-notes-list`) — Notes — Notes owns that key

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

333. [ ] **11.13** — Recently-opened shortcuts — Shortcuts / Home — Space-scoped surface

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> Personal's own goals, routines and habits are unchanged. Nothing is deleted — each surface already exists on its owning page, so this is removal from Work, not a migration.

334. [ ] **Gate 11** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 12

> Old Part B Phase 8, extended.

335. [ ] **12.1** — Run the complete recursive JavaScript parse test and all Node tests: `node --test tests/`.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

336. [ ] **12.2** — **New tests** added by this plan: structural assertions (1.7); domain-boundary assertions (Phase 3); hidden-shortcut round trip (7.1); tracker-type inference and the toggle-involution regression (8.1, 8.3); untrack behaviour (9.1); provider normalisation, error, timeout, rate-limit and offline states against the mock provider (6.1).

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

337. [ ] **12.3** — Expand Node tests for pure Work, Explore, shortcut, game, movie, visual-state and migration helpers.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

338. [ ] **12.4** — Test schema validation, migration defaults, backup/restore, reset and storage rollback.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

339. [ ] **12.5** — Browser-level smoke tests for every top-level route; `tests/browser-smoke.mjs` exports `routes(tab)`, `layout(tab)` and `workLifecycle(tab)`.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

340. [ ] **12.6** — Test navigation, add/edit/delete, modal close/cancel, persistence after reload, filters, task checkboxes, close/reopen, backlog/history, reminders, image fallback and external links.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

341. [ ] **12.7** — Start the static server and inspect the console for uncaught errors and failed local assets.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

342. [ ] **12.8** — Verify Work hierarchy and close-all behaviour; Personal delete confirmation; Explore recommendation explanations and image fallback; game-specific links and default tasks across multiple genres and **both tracker types**; movie and series genre views.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

343. [ ] **12.9** — Verify backup export/import with all new data; reset behaviour and unrelated `localStorage` preservation.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

344. [ ] **12.10** — Verify keyboard-only navigation and reduced-motion mode — every route genuinely still.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

345. [ ] **12.11** — Verify desktop, tablet and mobile layouts at 1440 / 1024 / 760 / 390 px.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

346. [ ] **12.12** — **Offline pass:** provider unreachable → visible degraded state, no silent local fallback presented as global results.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

347. [ ] **12.13** — Verify every button from the Phase 0.5 inventory has a success test and an applicable cancel / error / persistence test.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

348. [ ] **12.14** — Set `MISSING_ASSET='assets/destinations/azores.svg'` on `tests/browser-server.js` to exercise the image-fallback path.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

349. [ ] **12.15** — Tick off every remaining **original Phase 0–12** box and confirm none is left unchecked without a stated reason. V2 Phases 14–19 intentionally follow this checkpoint.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

350. [ ] **12.16** — Do not perform final documentation here. V2 Phases 14–19 run next; final documentation remains **Phase 13.3 after Gate 19**.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

351. [ ] **Gate 12** — Complete the original-plan Phase 0–12 verification checkpoint before advancing to V2 Phase 14

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: All planned verification checks pass with retained evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |



# V2 EXTENSION — Phases 14–19

> These items extend the existing checklist without rewriting historical item numbers, statuses or evidence.
>
> The same Mandatory execution and verification contract applies. No V2 item may be skipped.

## Phase 14 — Provider truth audit and V2 scope reconciliation

- [ ] **14.1 — Audit Movies/Series provider truth: adapter, live configured path, search, details, normalization, poster/backdrop, pagination, cancellation, error/offline states and mock-vs-live status.**

  Files: `server/`, `server/providers/`, `movies/`, provider tests, `docs/implementation-evidence/phase14/`.

  Acceptance: Evidence separately states mock/contract status and live configured E2E status. Mock success is not live-provider proof.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **14.2 — Audit Games provider truth with the same live-vs-mock separation, including cover/background, genres/tags/platforms and tracker signals.**

  Files: `server/`, `server/providers/`, `games/`, provider tests, `docs/implementation-evidence/phase14/`.

  Acceptance: The actual delivered live capability is evidenced without invalidating unrelated prior phases.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **14.3 — Audit provider secrets/security boundary.**

  Files: `.gitignore`, `config/`, `server/`, security tests, evidence.

  Acceptance: No real secret is tracked or browser-readable; config/secrets paths, including a representative otherwise-servable extension such as `.js`, are denied.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **14.4 — Reconcile approved V2 scope across standing plan, checklist and architecture authority.**

  Files: `docs/agent-instructions.md`, `docs/IMPLEMENTATION-STEPS.md`, `docs/REVISED-IMPLEMENTATION-PLAN.md`.

  Acceptance: Local-first != local-only; Destinations global discovery, first-class provider records, content-art, offline/security/integrity rules are represented consistently.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **Gate 14 — Provider truth and V2 authority gate.**

  Files: `docs/implementation-evidence/phase14/`, authoritative docs.

  Acceptance: Actual current provider capability is known and the V2 scope is authoritative before implementation advances.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |


## Phase 15 — Global destination discovery

- [ ] **15.1 — Select/document a legitimate provider-neutral destination source and its licensing/attribution constraints.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: Provider choice is justified; Explore UI is not coupled to raw vendor payloads.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **15.2 — Implement destination search/details through the local server adapter.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: Success, empty, pagination, timeout, rate-limit, auth/config, offline, provider-error, malformed and partial-data states are normalized.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **15.3 — Implement canonical destination normalization.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: Available provider identity, location, summary/details, categories, trip metadata, card/hero media and attribution map into an Explore-compatible shape without inventing missing facts.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **15.4 — Add deterministic mock destination provider fixtures.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: Automated tests cover success and all required failure states without live quota.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **15.5 — Integrate local + provider destination search UX.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: Curated/local and global/provider results are distinct; obsolete requests are canceled/ignored; pagination/load-more works.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **15.6 — Implement provider destination detail and explicit Save/shortlist/trip-board actions.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: Detail remains usable with partial metadata; attribution is shown where required; save is explicit.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **15.7 — Persist saved provider destination locally and prove offline reopen.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: A saved provider destination validates, survives reload and remains meaningful with provider access disabled.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **15.8 — Reverify all 12 curated destinations and existing Explore behavior.**

  Files: `explore/`, `server/`, `server/providers/`, `shared/storage-utils.js`, tests, evidence.

  Acceptance: Global discovery does not regress ranking, explanations, Surprise Me, curated images/fallbacks, save/remove or trip board.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **Gate 15 — Curated + global destination gate.**

  Files: Phase 15 evidence.

  Acceptance: Both Explore sources work coherently and neither is misrepresented as the other.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |


## Phase 16 — First-class provider records and data integrity

- [ ] **16.1 — Implement deterministic provider identity and duplicate-add prevention for Movies/Series, Games and Destinations.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: Adding the same provider identity twice cannot create duplicate local records or dependent state.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.2 — Define/test provider-vs-local collision policy.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: No fuzzy name-only auto-merge; deterministic mappings only, otherwise records remain distinct or require explicit reconciliation.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.3 — Prove provider Movie/Series records remain first-class offline.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: After Add and provider disable, library/detail/status/watchlist/untrack behavior remains valid from persisted local data.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.4 — Prove provider Game records remain first-class offline.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: After Add and provider disable, detail/tracker/sessions/journal/resources shell/edit/delete behavior remains valid.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.5 — Verify Game tracker inference and correction.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: A live-service example defaults weekly, a campaign example defaults story, and user correction is available before persistence.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.6 — Prove provider Destination records remain first-class offline.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: Saved detail, saved/shortlist and trip-board state remain valid without provider access.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.7 — Implement/test provider refresh merge ownership.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: Provider-owned metadata may update; user-owned status/notes/progress/tracker/tasks/sessions/journal/trip state never gets silently overwritten.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.8 — Verify rejected write and multi-key atomicity behavior.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: UI never reports success before persistence succeeds; partial multi-key Add/Save is rolled back or enters the explicitly documented recovery state.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **16.9 — Add provider-origin backup round trip.**

  Files: `movies/`, `games/`, `explore/`, `shared/storage-utils.js`, fixtures/tests, evidence.

  Acceptance: At least one provider-origin title, game and destination exports/imports under v4 and reopens offline; no version bump unless a real migration is required.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **Gate 16 — First-class provider-record integrity gate.**

  Files: Phase 16 evidence.

  Acceptance: Provider-origin content is durable local OneSpace data with duplicate, merge, storage and backup protections.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |


## Phase 17 — Content-aware cinematic environment

- [ ] **17.1 — Extend the existing unified scene controller with one optional selected-content environmental-art layer.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: No parallel animation controller is introduced.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.2 — Integrate selected Movie/Series backdrop with Movies base scene.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Readable, non-interactive environmental art; base domain identity retained.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.3 — Integrate selected Game key/background art with Games base scene, including provider-added games.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Same quality/behavior for seed and provider-origin games.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.4 — Integrate selected Destination hero art with Explore for curated and provider destinations.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Atmospheric treatment remains subordinate to controls/content.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.5 — Use lightweight internal content transition instead of full page ENTRY.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Selecting another item does not replay route-entry choreography.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.6 — Implement content-art race ownership.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Rapid A->B->C selection always finishes on C even if older media loads later.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.7 — Verify exact-role media fallback.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Movie backdrop/Game background/Destination hero failure falls back without removing detail/actions or unnecessarily invalidating other valid media roles.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.8 — Verify route cleanup.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Movies/Games/Explore art, classes, CSS variables and transient state do not leak into other routes.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **17.9 — Reverify Full/Subtle/Off/reduced-motion and coarse-pointer behavior.**

  Files: `shared/cinematic-scenes.js`, rich-domain UI/styles, visual helpers, tests/evidence.

  Acceptance: Reduced motion is genuinely still; touch does not depend on hover/pointer parallax.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **Gate 17 — Content-aware cinematic gate.**

  Files: Phase 17 screenshots/measurements/tests.

  Acceptance: Selected content enriches atmosphere without reducing usability, accessibility or lifecycle correctness.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |


## Phase 18 — Provider/media/async/security hardening

- [ ] **18.1 — Test query and detail races including stale success and stale errors.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: Older requests cannot replace newer UI, announce stale ARIA feedback, reopen closed detail or mutate another route.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **18.2 — Validate and bound provider server inputs.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: Unsupported kind/provider/method, malformed IDs/pages/cursors and oversized queries are rejected before upstream calls.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **18.3 — Prove no open proxy / SSRF path exists.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: Browser input cannot make the local server fetch arbitrary external, localhost or private-network URLs.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **18.4 — Harden provider media route where used.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: Known-provider references only; host allowlist, HTTPS where supported, content-type check, timeout, size bound, no secret leakage.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **18.5 — Add hostile provider-text/XSS regression.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: Provider markup/script-like strings render harmlessly as text; provider links use safe protocols.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **18.6 — Bound query/details/media caches and document policy.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: Caches have finite bounds/expiry/invalidation; clearing them does not delete user records.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **18.7 — Run full provider failure matrix for all enabled rich domains.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: No-credentials, auth, timeout, rate-limit, provider failure, offline, malformed, partial and image-failure states preserve valid local data.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **18.8 — Verify logging/error sanitization.**

  Files: `server/`, provider adapters/media route, rich-domain UI, tests/evidence.

  Acceptance: Browser and logs do not expose credentials, Authorization headers, raw secrets or sensitive upstream dumps.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **Gate 18 — Hardening/security gate.**

  Files: Phase 18 evidence.

  Acceptance: No tested provider/media failure corrupts, misrepresents or leaks valid local data or credentials.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |


## Phase 19 — Complete V2 final acceptance

- [ ] **19.1 — Run the complete current Node suite after the final implementation change.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Final current pass/fail count is recorded; historical counts are not reused.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.2 — Run browser smoke/regression across every top-level route.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: No unrelated domain regression, duplicate mount, uncaught error or failed expected local asset.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.3 — Verify complete Movies/Series local+provider flow.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Search, movie/series parity, pagination, explicit Add, detail/poster/backdrop, status/watchlist, untrack, reload, offline, errors and keyboard pass.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.4 — Verify complete Games local+provider flow.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Search, Add, tracker inference/correction, story+weekly, resources/sessions/journal/spotlight, reload/offline/errors pass.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.5 — Verify complete Explore curated+provider flow.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Curated ranking/preferences/Surprise Me plus global search/detail/save/trip-board/offline/fallback pass; More To Explore remains final.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.6 — Verify duplicate prevention, refresh ownership and rejected-write behavior.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: All integrity contracts pass.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.7 — Verify content-aware cinematic and route cleanup.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Movies/Games/Explore current selection owns its environmental art; stale/leaked art is absent.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.8 — Verify Full/Subtle/Off/reduced motion, keyboard/accessibility and the global modern icon system.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Focus, modal behavior, ARIA/async feedback, alt/decorative treatment, touch targets and motion contract pass; all tabs retain the verified coherent modern application-icon language with no broken, clipped, inconsistent or inaccessible icon-only controls.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.9 — Verify responsive matrix.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Existing 1440/1024/760/390 widths plus approximately 1920×1080 and 2048×1152 pass without overflow/clipping/unreadable media treatment.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.10 — Verify security and network/media behavior.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: Secrets blocked, no arbitrary proxy, safe media route, bounded caches, no secret-bearing console/network output.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.11 — Verify provider-origin backup/export/import and offline reopen.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: One title, game and destination round-trip successfully under the existing backup contract.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **19.12 — Reconcile every V2 checklist status and retained evidence.**

  Files: `tests/`, all domains, `docs/implementation-evidence/phase19/`, authoritative docs.

  Acceptance: No V2 item remains Pending, Implemented/Not Verified or Blocked.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |

- [ ] **Gate 19 — Final V2 delivery gate before Phase 13.3.**

  Files: `docs/IMPLEMENTATION-STEPS.md`, Phase 19 evidence, final current test/browser run.

  Acceptance: All original-plan and V2 requirements pass together. Phase 13.3 may now reconcile final documentation.

  | Status | Evidence |
  |---|---|
  | Pending | Pending |


## Phase 13.3 — Final documentation

352. [ ] **13.3.1** — `README.md` — folder structure, data model, provider setup and offline behaviour, server command, test commands, backup compatibility, cinematic interaction rules, accessibility behaviour, scope limits.

   Files: The document named in this step. Acceptance: Documentation matches actual delivered behavior and recorded verification.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

353. [ ] **13.3.2** — `VERIFICATION.md` — a fresh acceptance run at the end; fix the `18973` → `18974` port error and the bare test filenames.

   Files: The document named in this step. Acceptance: Documentation matches actual delivered behavior and recorded verification.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

354. [ ] **13.3.3** — `docs/REVISED-IMPLEMENTATION-PLAN.md` — reconcile with what Phase 6 actually delivers, so the two documents stop contradicting each other on the provider question.

   Files: The document named in this step. Acceptance: Documentation matches actual delivered behavior and recorded verification.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

355. [ ] **Gate 13.3** — Confirm every planned step is implemented and verified and report the actual delivery evidence

   Files: `docs/IMPLEMENTATION-STEPS.md`, `VERIFICATION.md`. Acceptance: No unchecked original-plan or V2 implementation requirement remains; Gate 19 has passed.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |
