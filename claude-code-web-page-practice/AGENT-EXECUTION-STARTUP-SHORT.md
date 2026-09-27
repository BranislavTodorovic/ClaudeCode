# Use for normal day-to-day continuation of work in an existing agent session.

# OneSpace Agent Execution — Short Startup

Use this template when continuing normal implementation work in an existing OneSpace repository.

Before continuing implementation, recover the real project state from the repository first.

Do not continue from a previous chat summary, memory, phase-complete claim, checked box, or historical test count unless current repository evidence proves it.

## 1. Read the project documents

Read these files completely, in this order:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `VERIFICATION.md`
4. `docs/REVISED-IMPLEMENTATION-PLAN.md`
5. `README.md`

Authority:

* `docs/agent-instructions.md` = WHAT must be delivered
* `docs/IMPLEMENTATION-STEPS.md` = HOW work must be executed and verified
* `VERIFICATION.md` = final acceptance procedure and evidence
* `docs/REVISED-IMPLEMENTATION-PLAN.md` = historical/non-authoritative context
* `README.md` = descriptive documentation only

If documents conflict, follow the higher-authority document and the stricter verification requirement.

## 2. Recover repository state

Before editing code:

* run `git status --short --untracked-files=all`
* inspect `git diff`
* inspect `git diff --cached`
* inspect the source code relevant to the active phase
* inspect current tests
* inspect `docs/implementation-evidence/`
* compare the Progress table with the detailed checklist
* find the last independently VERIFIED checklist item
* find the first unresolved checklist item
* check for earlier `PENDING`, `IMPLEMENTED / NOT VERIFIED`, `BLOCKED`, `DEFERRED TO PHASE 12`, or `APPROVED EXCEPTION` items

## 3. Report state before coding

Before changing code, briefly report:

* current active phase
* last independently VERIFIED checklist item
* first unresolved checklist item
* any contradiction or reopened work
* current test/evidence state
* exact checklist item you will execute next

Do not start coding before this recovery is complete.

## 4. Execute strictly step by step

For every checklist item:

1. Read the exact requirement and acceptance criteria.
2. Inspect the current implementation.
3. Implement only that requirement and necessary integration.
4. Run targeted verification.
5. Run applicable regression and browser checks.
6. Verify persistence, reload, cancel, error, focus and responsive behavior where applicable.
7. Save persistent evidence.
8. Update that exact checklist item.
9. Mark `[x]` only when it is truly `VERIFIED` or an `APPROVED EXCEPTION`.
10. Only then move to the next item.

## 5. Non-negotiable rules

* Do not skip checklist items.
* Do not weaken requirements.
* Do not treat a green total test count as requirement-level proof.
* Do not defer phase-local verification to Phase 12 unless explicitly allowed.
* Do not mark a phase complete while unresolved mandatory items remain.
* Record defects and evidence persistently so they survive context compaction.
* After any interruption or context compaction, recover repository state again before editing.

## 6. Current cinematic requirement

Phase 5 is reopened under the clarified cinematic contract.

Each distinct top-level tab must implement the required domain-specific lifecycle:

`ENTRY / WAKE-UP → SETTLE → AMBIENT / ALIVE → EXIT / RESET`

In Full mode, the entry should visually feel like a short domain-specific film opening of approximately 2–5 seconds.

A simple fade, generic particles, slow gradient, static hero, or barely perceptible parallax does not pass.

Follow every Phase 5.3A requirement in `docs/IMPLEMENTATION-STEPS.md`.

Do not begin Phase 10 until the Mandatory Phase 0–9 Audit is clean.

Proceed from the first genuinely incomplete checklist item.

