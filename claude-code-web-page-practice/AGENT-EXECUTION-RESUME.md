# Use after context compaction, interruption, usage limits, restart, or any paused session where the agent must safely recover the exact repository state before continuing.

# OneSpace Agent Execution — Resume After Interruption

Use this template after:

* context compaction;
* conversation interruption;
* usage/rate limit;
* agent restart;
* resumed coding session;
* substantial pause;
* handoff between agents.

Do not continue directly from the previous conversation summary.

A conversation summary is navigation context only.

It is not implementation or verification evidence.

---

## 1. Re-read project authority

Before editing anything, read completely:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `VERIFICATION.md`
4. `docs/REVISED-IMPLEMENTATION-PLAN.md`
5. `README.md`

Use this authority order:

* `agent-instructions.md` = WHAT must be delivered
* `IMPLEMENTATION-STEPS.md` = HOW work is executed and verified
* `VERIFICATION.md` = final acceptance procedure/evidence
* `REVISED-IMPLEMENTATION-PLAN.md` = historical context only
* `README.md` = descriptive documentation

Do not allow historical documentation or the previous chat summary to override the current standing plan/checklist.

---

## 2. Recover repository state

Run:

```sh
git status --short --untracked-files=all
git diff
git diff --cached
```

Then inspect:

* source code for the active/recent phase;
* current tests;
* `docs/implementation-evidence/`;
* Progress table;
* detailed checklist;
* evidence for the most recently claimed completed items.

Find:

* the last independently VERIFIED checklist item;
* the first unresolved checklist item;
* any earlier `PENDING` item;
* any `IMPLEMENTED / NOT VERIFIED` item;
* any `BLOCKED` item;
* any incomplete deferred verification;
* any incorrectly closed phase gate.

Do not assume the previous session's stopping point is correct until repository evidence confirms it.

---

## 3. Check for interrupted work

Determine whether the interruption occurred:

* before implementation;
* during implementation;
* after implementation but before tests;
* during testing;
* after tests but before browser acceptance;
* after acceptance but before evidence was saved;
* after evidence but before checklist status was updated.

If any part of a checklist item's required acceptance is incomplete, that item remains unresolved.

Do not mark it complete based on partial work from the previous session.

---

## 4. Current cinematic reminder

Phase 5 remains subject to the clarified cinematic contract.

Do not rely on historical Phase 5 completion claims.

Verify according to Phase 5.3A:

`ENTRY / WAKE-UP → SETTLE → AMBIENT / ALIVE → EXIT / RESET`

Full mode must feel like a short domain-specific cinematic opening, approximately 2–5 seconds, with meaningful staged visual storytelling and domain-relevant imagery/art.

Modern icon requirements and time-sequenced evidence also apply.

Do not continue to Phase 10 unless the Mandatory Phase 0–9 Audit is clean.

---

## 5. Report recovered state

Before editing, briefly report:

* current active phase;
* last independently VERIFIED checklist item;
* first unresolved checklist item;
* whether interrupted work is partially implemented;
* any contradictions found;
* any reopened requirement;
* current test/evidence state;
* exact checklist item to resume.

---

## 6. Resume safely

Resume from the first unresolved checklist item.

For that item:

1. re-read the entire requirement and acceptance criteria;
2. inspect the current implementation;
3. determine exactly what was completed before interruption;
4. finish any missing implementation;
5. rerun targeted verification even if it was reportedly run previously;
6. run applicable regression/browser checks;
7. save persistent evidence;
8. update the exact checklist item;
9. mark it complete only if the verification contract permits it.

Only then move to the next checklist item.

---

## 7. Non-negotiable resume rules

* Do not skip forward because code looks mostly complete.
* Do not trust previous chat claims without repository evidence.
* Do not treat partial evidence as full verification.
* Do not silently mark interrupted work complete.
* Do not replace requirement-level evidence with an overall test count.
* Do not defer missing phase-local acceptance unless explicitly allowed.
* Do not weaken requirements.
* Persist new findings and defects before proceeding.

Continue strictly from the first genuinely unresolved checklist item.
