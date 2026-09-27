# OneSpace — Redesign Integration Gate

**File:** `docs/REDESIGN-INTEGRATION-GATE.md`  
**Status:** ACTIVE CHANGE-CONTROL GATE  
**Applies to:** Existing OneSpace implementation transitioning into the Live Experience Redesign  
**Related specification:** `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md`  
**Visual references:** `docs/ui-reference/`  
**Expected local path:** `C:\Users\banek\Documents\Projects\ClaudeCode\claude-code-web-page-practice\docs\ui-reference`

---

# 1. Purpose

This gate prevents duplicated work, accidental regression, contradictory authority, and unnecessary polishing of UI that has already been superseded by the approved Live Experience Redesign.

The existing OneSpace implementation must **not** be thrown away. Its verified core remains the foundation for the redesign.

The gate determines:

1. what existing work must still be completed before redesign;
2. what existing work remains fully valid;
3. what existing UI work must be reverified after redesign;
4. what obsolete visual work is replaced;
5. when redesign becomes active;
6. how the agent resumes without losing history or skipping requirements.

---

# 2. Non-Negotiable Principle

Do **not**:

```text
finish every old visual-polish task
→ complete old screenshot/motion acceptance
→ immediately replace that UI
→ repeat the same visual work again
```

Use this flow instead:

```text
finish required functional correctness
→ finish current audit/action verification
→ reach this gate
→ classify the remaining legacy work
→ protect the functional baseline
→ activate the approved redesign
→ implement redesigned worlds and submodules
→ run targeted regression throughout
→ run one final full regression and acceptance
```

---

# 3. When This Gate Must Run

Run this gate **exactly after Gate 12 passes and before R1 begins**. The current resume point is Phase 12 item 347; finish the remaining Phase 12 audit and Gate 12 first. Historical Phase 14 does not begin immediately after R0; it waits until redesign Gates R1–R6 have completed.

Activation conditions:

- the current functional/button/action audit is complete enough to provide a reliable baseline;
- core storage/persistence behavior is known;
- critical functional blockers are known;
- remaining work starts to include final legacy visual polish, old-layout screenshots, old-scene acceptance, or other presentation work the approved redesign will replace.

Do **not** activate it:

- merely because redesign files exist;
- while a critical functional item is half-implemented;
- to bypass unresolved data, storage, security, migration, validation, or action defects.

The transition point is no longer ambiguous: **Gate 12 -> R0 -> R1 -> R2 -> R3 -> R4 -> R5 -> R6 -> reclassified post-Gate-12 Phase 14–25 work**. The agent must still inspect every remaining unresolved item and classify it, but may not move R0 later to avoid the redesign or earlier to bypass Phase 12.

---

# 4. Repository Recovery Before Classification

Before classifying anything, report:

1. current working directory;
2. Git root;
3. branch;
4. HEAD;
5. `git status`;
6. staged files;
7. modified files;
8. untracked files;
9. latest automated test result;
10. latest browser verification result;
11. latest VERIFIED ledger item;
12. current IN PROGRESS item;
13. first unresolved item;
14. known blockers;
15. current storage/schema version if available.

Unknown local work must be preserved.

Never use this gate to justify `git reset --hard`, force-push, destructive history rewriting, or deletion of unknown work.

---


## Shared visual family / world-specific identity

The eight approved references form one coherent OneSpace family: premium warm architectural interiors, layered depth, nature/plants, controlled glass/dark UI surfaces and cinematic practical lighting. Preserve that shared family across the shell. Each world must still derive its own scene subject, props, composition and motion from its corresponding reference. Do not flatten all worlds into a generic space/starfield theme, and do not make them so unrelated that the application loses a coherent OneSpace identity.

The preserved cinematic lifecycle is **`ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET`**. Full entry is approximately 2–5 seconds, remains usable while playing, then settles into restrained scene-derived ambient motion. Full/Subtle/Off and `prefers-reduced-motion` remain mandatory. This lifecycle is shared; the actual motion must be plausible for each world reference rather than generic starfield/particle reuse.

# 5. Required Reading Order

At the gate, read:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `docs/REVISED-IMPLEMENTATION-PLAN.md`
4. `VERIFICATION.md`
5. `docs/REDESIGN-INTEGRATION-GATE.md`
6. `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md`
7. `docs/ui-reference/MANIFEST.md`, if present

Then inspect every relevant reference image under:

`docs/ui-reference/`

The repository-relative path is authoritative. The expected Windows path is:

`C:\Users\banek\Documents\Projects\ClaudeCode\claude-code-web-page-practice\docs\ui-reference`

No `approved` subfolder is required.

---

# 6. Authority During Transition

Before this gate:

- existing implementation steps remain active;
- existing functional requirements remain authoritative.

After this gate is completed:

- `docs/agent-instructions.md` defines how work is performed;
- `docs/IMPLEMENTATION-STEPS.md` defines execution order;
- `docs/REVISED-IMPLEMENTATION-PLAN.md` defines technical contracts;
- `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md` defines redesigned product/UI requirements;
- `docs/ui-reference/` defines approved visual direction;
- `VERIFICATION.md` defines proof and acceptance;
- old visual requirements explicitly marked `SUPERSEDED BY APPROVED REDESIGN` stop being active visual targets.

A superseded visual target must not be silently revived later.

---


# 6A. Explicit Conflict Reconciliation

The following historical requirements are superseded at this gate:

1. **Mandatory live-provider scope:** TMDB/RAWG/IGDB/destination-provider integration is optional, not required. Core Movies, Games and Explore use bundled/local data and remain credential-free by default. Provider-specific work executes only when explicitly approved/configured. Missing provider credentials do not block final release.
2. **No-new-binary-assets rule:** the old SVG/CSS-only restriction is superseded. Properly licensed repository-local raster/vector scene/media assets are allowed when they improve reference fidelity. Composite reference screenshots may not be shipped as baked-in production UI backgrounds.
3. **Old visual/cinematic composition:** old-layout screenshots, old hero proportions and generic space/starfield composition are replaced by the approved world references. Functional behavior survives and is reverified after redesign.

The following remain authoritative and are not weakened: storage/persistence/migrations, data integrity, CRUD/action behavior, security/secrets, accessibility, responsive behavior, fallback/offline behavior, backup compatibility, licensing/provenance and regression evidence.

# 7. Required Classification Model

Every remaining legacy requirement must become exactly one of:

## 7.1 KEEP

Use when the requirement remains valid and must still be completed normally.

Typical examples:

- storage;
- persistence;
- migrations;
- data integrity;
- CRUD behavior;
- action/button functionality;
- reminders;
- search behavior;
- import/export correctness;
- validation;
- security;
- non-layout-specific fallback behavior;
- business logic;
- catalogue/source correctness;
- licensing/source integrity;
- automated tests validating core behavior.

A `KEEP` item must still be completed and VERIFIED.

## 7.2 REVERIFY AFTER REDESIGN

Use when the behavior remains valid, but the redesign changes the DOM, layout, navigation, or interaction surface enough that UI verification must be repeated.

Typical examples:

- keyboard navigation;
- focus order;
- dialogs;
- responsive behavior;
- active navigation;
- tab/portal interaction;
- search UI;
- button placement;
- accessibility states;
- touch behavior;
- modal focus restoration;
- route transitions.

Existing valid functional evidence is preserved.

## 7.3 SUPERSEDED BY APPROVED REDESIGN

Use only when the item is specifically tied to an obsolete visual implementation replaced by the approved redesign.

Typical examples:

- final spacing of old Home;
- old Home screenshot matrix;
- old tab/card proportions;
- old cinematic composition;
- old color/glow treatment;
- obsolete portal layout;
- obsolete visual screenshots.

`SUPERSEDED` does **not** mean:

- skip functionality;
- delete tests;
- discard evidence;
- ignore accessibility;
- ignore responsive behavior;
- abandon persistence;
- ignore fallback behavior.

It only replaces the obsolete visual target.

## 7.4 BLOCKED

Use when the item cannot safely progress because of a real dependency or unresolved defect.

A BLOCKED item must record:

- blocker;
- affected items;
- required resolution;
- whether redesign may continue elsewhere safely.

---

# 8. Classification Record Format

For every remaining unresolved item record:

```text
Item ID:
Title:
Current status:
Classification:
Reason:
Functional behavior preserved:
Post-redesign verification required:
Replacement redesign section:
Evidence retained:
Blocker, if any:
```

No unresolved item may disappear from the ledger merely because redesign is planned.

---

# 9. Classification Safety Rules

Do not classify as `SUPERSEDED` anything primarily validating:

- data correctness;
- save/reload;
- transactional integrity;
- migration;
- destructive action safety;
- security;
- validation;
- fallback logic;
- accessibility semantics independent of layout;
- keyboard semantics independent of layout;
- catalogue/source correctness;
- licensing;
- offline behavior;
- performance of core data operations.

When uncertain:

- between `KEEP` and `REVERIFY`, prefer `KEEP` for core behavior and add post-redesign verification;
- between `REVERIFY` and `SUPERSEDED`, ask:

> Would this requirement still matter if the page had a completely different visual layout?

If yes, it is probably `REVERIFY`.

---

# 10. Required Gate Output

Before redesign activation, persist:

## Repository State

- branch;
- HEAD;
- clean/dirty state;
- changed files.

## Functional Baseline

- latest automated suite result;
- latest browser result;
- storage/schema version;
- migration version;
- known functional limitations;
- known blockers.

## Classification Summary

- remaining item count;
- KEEP count;
- REVERIFY count;
- SUPERSEDED count;
- BLOCKED count.

## Exact Transition

- last legacy item completed before redesign;
- first redesign item;
- exact next action.

The gate is not complete until this record exists.

---

# 11. Functional Baseline Gate

Before redesign:

- current automated suite must be green, or all failures must be explicitly understood;
- no unresolved critical storage corruption;
- no unresolved critical migration defect;
- no known secret exposure;
- no unknown destructive Git state;
- current data must be recoverable/backed up;
- application must load;
- critical core navigation must work;
- current local data must remain readable;
- critical actions must not be known to fail silently.

Do not hide a core defect behind new UI.

---

# 12. Backup and Rollback Gate

Before structural redesign or schema change:

1. record stable pre-redesign commit;
2. record current storage/schema version;
3. export/snapshot canonical test data;
4. preserve known-good pre-redesign state;
5. document rollback procedure;
6. confirm rollback does not depend on destructive Git history rewriting.

If a new schema is required:

- version it;
- test migration;
- test repeated migration;
- test failure/rollback;
- avoid mixed old/new storage;
- preserve recovery behavior.

---

# 13. Visual Reference Gate

Before implementing any redesigned main world:

1. inspect its matching image under `docs/ui-reference/`;
2. inventory every global control;
3. inventory every world-level control;
4. inventory summary cards;
5. inventory portal cards;
6. inventory filters/segments;
7. inventory utility actions;
8. identify implied submodules;
9. identify functional vs decorative elements;
10. classify every displayed data value by source;
11. identify unsupported data that needs an honest fallback;
12. identify asset needs;
13. identify responsive risks;
14. identify accessibility risks;
15. identify motion/reduced-motion needs.

Do not code from memory.

Do not use the composite reference image as the actual production background because UI is baked into it.

---

# 14. Reference Conflict Gate

Concept images can contain small inconsistencies.

Examples:

- top-nav order;
- labels;
- weather values;
- profile names;
- AI Assistant placement;
- sample counts;
- sample data.

Do not copy contradictions page-by-page.

For every conflict:

1. identify it;
2. classify it as structural/textual/data;
3. apply canonical architecture/spec rule;
4. document the chosen behavior;
5. keep the global shell consistent.

---

# 15. Functional Honesty Gate

Every dynamic widget must declare one source category:

- `LOCAL_CORE`
- `LOCAL_DERIVED`
- `USER_ENTERED`
- `OPTIONAL_PROVIDER`
- `FUTURE_DISABLED`

Special caution:

- weather;
- HRV;
- sleep;
- stress;
- friends online;
- connected devices;
- smart-home controls;
- account/billing;
- subscription tier;
- live new releases;
- AI-generated content.

If no real source exists:

- hide the live value;
- show an honest unavailable/not-configured state;
- use supported local data;
- or mark the feature future-disabled.

Never invent a live value to match a screenshot.

---

# 16. Post-Gate Architecture/Execution Map

R0 must record the architecture delta and exact execution map, but **must not implement the redesign UI itself**.

Required post-gate sequence:

`Gate R0 -> R1 Shared Foundation -> Gate R1 -> R2 Home Fidelity -> Gate R2 -> R3 Main Worlds -> Gate R3 -> R4 Work->Projects Pilot -> Gate R4 -> R5 Submodule Families -> Gate R5 -> R6 Cross-World Integration/Regression -> Gate R6 -> reclassified Phase 14–25 -> Gate 25 -> Phase 26 -> Gate 26 -> Phase 13.3`

Before Gate R0, document: canonical shell/navigation; exact eight-world registry; Today/AI utility treatment; compatibility treatment for Shortcuts/Productivity/Notes/legacy Projects; world/submodule/detail route model; canonical data owners; scene/asset/provenance model; data-source classification policy; storage/migration impact; failure boundaries; and R1–R6 evidence locations.

---

# 17. Gate R0 Acceptance

Gate R0 passes only when Phase 12/Gate 12 is already VERIFIED; repository/Git/evidence state is recorded; unknown local work is preserved; all eight reference images were actually opened/inspected; every remaining Phase 14–25 item is classified KEEP/REVERIFY/SUPERSEDED/BLOCKED; mandatory-live-provider conflicts are reconciled to local-first/credential-free default; the old SVG/CSS-only/no-binary-asset rule is explicitly superseded; storage/schema/backup baseline is protected; route/data ownership is recorded; and the exact R1–R6 sequence is recorded.

Persistent evidence must be stored under the R0 evidence location defined by the checklist.

---

# 18. Required R0 Handoff

Record repository/Git state, current test/browser results, storage/schema version, backup/test dataset, rollback point, Gate 12 result, classification record, blockers, Gate R0 result, eight reference paths/inspection evidence, canonical route/world/submodule decisions and the exact first R1 item. A future session must resume without guessing.

---

# 19. Final R0 Status

Only after all R0 acceptance conditions pass:

> **R0 — REDESIGN INTEGRATION GATE: VERIFIED**

Then and only then begin R1.
