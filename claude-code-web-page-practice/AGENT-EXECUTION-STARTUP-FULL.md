# Use when starting a new chat, switching to a new agent, or beginning a major work session that requires full project-state recovery.

# OneSpace Agent Execution — Full Startup

Use this template when starting a new agent session, handing the project to a new coding agent, or resuming after a substantial break.

You are continuing implementation of the existing OneSpace repository.

Before changing any code, establish the project state from the repository and project documentation.

Do not assume that any previous agent summary, chat message, checked box, phase status, test count, acceptance claim, or remembered implementation state is correct unless current repository evidence proves it.

---

## 1. Read the authoritative project documents

Read these files completely, in this exact order:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `VERIFICATION.md`
4. `docs/REVISED-IMPLEMENTATION-PLAN.md`
5. `README.md`

Use this authority model:

### `docs/agent-instructions.md`

Current standing plan and product authority.

Defines **WHAT** must be delivered.

### `docs/IMPLEMENTATION-STEPS.md`

Execution and verification authority.

Defines:

* HOW implementation work is performed;
* HOW completion is proven;
* checklist execution order;
* statuses;
* evidence requirements;
* phase gates;
* interruption/resume behavior;
* verification requirements.

Its Mandatory Execution and Verification Contract is authoritative.

### `VERIFICATION.md`

Final acceptance runbook and verification record.

Defines how the completed product must be re-tested and how final acceptance evidence must be recorded.

### `docs/REVISED-IMPLEMENTATION-PLAN.md`

Historical/non-authoritative context only.

Do not restore or introduce historical requirements when they conflict with the current standing plan or implementation checklist.

### `README.md`

Current descriptive product and architecture documentation.

It does not override the standing plan or implementation checklist.

### Conflict rule

If any documents conflict:

1. use the higher-authority source;
2. use the stricter verification requirement;
3. do not silently resolve ambiguity by weakening or removing a requirement.

---

## 2. Recover the actual repository state

After reading the documents, inspect the repository itself.

Run:

```sh
git status --short --untracked-files=all
git diff
git diff --cached
```

Also inspect:

* current source code relevant to the active phase;
* current automated tests;
* `docs/implementation-evidence/`;
* the Progress table;
* detailed checklist statuses;
* phase acceptance evidence;
* currently changed or untracked files.

Determine from repository evidence:

* current active phase;
* last independently VERIFIED checklist item;
* first unresolved checklist item;
* every `PENDING` item;
* every `IMPLEMENTED / NOT VERIFIED` item;
* every `BLOCKED` item;
* every `DEFERRED TO PHASE 12` item;
* every `APPROVED EXCEPTION`;
* whether any phase gate is incorrectly marked complete;
* whether any work was skipped during a previous interruption or context compaction.

Do not use previous conversation history as completion evidence.

---

## 3. Validate document/checklist consistency

Before implementation, verify:

* Progress table matches detailed checklist state;
* checked items have valid evidence;
* previous phase gates have not hidden unresolved requirements;
* deferred work is explicitly allowed;
* evidence files actually support the checklist requirement they claim to prove;
* total test counts are not being used as substitutes for requirement-level acceptance;
* historical documentation is not being mistaken for current authority.

If an inconsistency exists, correct the project state/evidence/checklist before continuing forward.

---

## 4. Current cinematic requirement

Phase 5 is reopened under the clarified live cinematic requirement.

Previous generic Phase 5 verification is not sufficient.

Every distinct top-level OneSpace experience must have a recognizable, domain-specific cinematic identity.

The required lifecycle is:

`ENTRY / WAKE-UP → SETTLE → AMBIENT / ALIVE → EXIT / RESET`

### Full mode

On genuine navigation into a tab:

* begin a clearly visible cinematic sequence;
* target approximately 2–5 seconds;
* use multiple staged visual events;
* use meaningful domain-specific imagery/art;
* remain immediately interactive;
* settle smoothly;
* continue into a quieter living ambient state.

A page does not pass merely because it has:

* a fade;
* a static hero;
* generic particles;
* a slow gradient;
* barely visible parallax;
* animation code that is technically running.

The result must visually feel like a short film opening for that page.

### Distinct scenes

The ten distinct experiences are:

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

Projects uses the Work scene.

Each scene must visually represent its own domain through:

* imagery/art;
* motion language;
* depth;
* atmosphere;
* transitions.

Modern icon treatment must also be verified across the application.

### Replay behavior

* genuine tab re-entry should replay the cinematic entry;
* internal re-rendering within the same tab should not restart the full cinematic opening.

### Modes

Verify:

* Full
* Subtle
* Off
* reduced motion

Follow every Phase 5.3A requirement in `docs/IMPLEMENTATION-STEPS.md`.

Static screenshots alone are not sufficient evidence of timed cinematic behavior.

---

## 5. Mandatory Phase 0–9 audit

Do not begin Phase 10 until the Mandatory Phase 0–9 Audit defined in `docs/IMPLEMENTATION-STEPS.md` is clean.

The audit must not trust:

* previous checked boxes;
* previous phase status;
* previous chat summaries;
* historical test totals.

If the audit finds an earlier requirement incomplete:

1. reopen it;
2. fix it;
3. verify it;
4. retain evidence;
5. update the checklist;
6. rerun the affected gate.

Only then continue forward.

---

## 6. Report recovered state before editing

Before touching code, report briefly:

* current active phase;
* last independently VERIFIED checklist item;
* first unresolved checklist item;
* any inconsistent or incorrectly closed earlier requirement;
* any reopened work;
* current automated-test state;
* current evidence state;
* exact checklist ID you will execute next.

Do not begin implementation until this report is complete.

---

## 7. Execute checklist items strictly in order

Work in the exact execution order defined by `docs/IMPLEMENTATION-STEPS.md`.

Do not jump ahead.

Do not batch unrelated requirements merely for convenience.

For every checklist item:

1. Read the complete requirement.
2. Read its acceptance criteria.
3. Inspect the specified/relevant files.
4. Inspect existing implementation before changing it.
5. Implement the requirement.
6. Run targeted automated verification.
7. Run applicable regression checks.
8. Run browser/manual acceptance when required.
9. Verify persistence/reload behavior where applicable.
10. Verify cancel/error/rollback behavior where applicable.
11. Verify keyboard/focus behavior where applicable.
12. Verify responsive behavior where applicable.
13. Save persistent evidence under `docs/implementation-evidence/`.
14. Update the exact checklist item.
15. Mark `[x]` only when the execution contract allows the item to be closed.
16. Only then continue to the next checklist item.

---

## 8. Verification rules

A checklist item is not verified merely because:

* code exists;
* the browser route opens;
* automated tests are green;
* a screenshot exists;
* another phase happened to exercise the same code;
* a previous agent said it passed.

Evidence must prove the exact requirement.

A total test count is supporting evidence only.

Phase 12 is final regression and must not be used as an excuse to avoid phase-local verification.

---

## 9. Defect handling

If a defect is found:

1. record the defect before editing where practical;
2. identify the affected requirement/checklist item;
3. reproduce it;
4. add/update regression coverage where appropriate;
5. fix it;
6. verify the fix;
7. run related regression;
8. retain persistent evidence;
9. update the checklist/gate.

Do not weaken the requirement to make the defect disappear.

---

## 10. Context-compaction safety

If the conversation is compacted, interrupted, rate-limited, resumed, or handed to another agent:

do not continue directly from the summary.

Repeat the repository recovery procedure.

Persistent repository evidence and project documents determine project state.

---

## 11. Completion rule

Do not mark a phase complete unless:

* all phase-local mandatory requirements are resolved;
* all required verification has passed;
* evidence exists;
* the Progress table matches detailed status;
* the phase gate passes.

Proceed from the first genuinely incomplete checklist item, not from where a previous conversation claimed the project had reached.
