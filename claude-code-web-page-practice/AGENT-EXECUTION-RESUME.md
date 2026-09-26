Continue the existing OneSpace project from the current repository state.

Do not start coding immediately.

Your first task is to recover the exact project state, read the complete authority set in the required order, inspect the persistent evidence, inspect the approved UI references, and identify the exact first unresolved checklist item.

## 1. Repository recovery

Before making any edit, report:

1. current working directory;
2. Git root;
3. current branch;
4. current HEAD;
5. `git status --short --untracked-files=all`;
6. staged changes;
7. modified files;
8. untracked files;
9. latest relevant automated test result;
10. latest browser/visual verification result;
11. latest VERIFIED checklist item;
12. current IN PROGRESS / IMPLEMENTED-NOT-VERIFIED item;
13. exact first unresolved item;
14. known blockers.

Preserve all unknown or existing local work.

Do not use:
- `git reset --hard`;
- destructive checkout;
- force push;
- history rewriting;
- deletion of unknown files.

## 2. Read the authority documents completely

Read these documents in this exact order:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `docs/REVISED-IMPLEMENTATION-PLAN.md`
4. `docs/REDESIGN-INTEGRATION-GATE.md`
5. `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md`
6. `docs/ui-reference/MANIFEST.md`
7. `VERIFICATION.md`
8. `README.md`

Do not skim only headings.

Do not rely on previous chat summaries as authority.

When two documents appear to overlap, use their documented authority roles rather than choosing arbitrarily:
- `agent-instructions.md` = product scope and working rules;
- `IMPLEMENTATION-STEPS.md` = execution order, checklist status, gates and evidence;
- `REVISED-IMPLEMENTATION-PLAN.md` = technical/architecture contracts;
- `REDESIGN-INTEGRATION-GATE.md` = transition/classification rules;
- `LIVE-EXPERIENCE-REDESIGN-SPEC.md` = redesign/product/UI requirements;
- `docs/ui-reference/MANIFEST.md` + reference images = approved visual direction;
- `VERIFICATION.md` = proof and acceptance;
- `README.md` = delivered-product documentation, not implementation proof.

If you find any contradiction, STOP before coding and report:
- the exact conflicting documents/sections;
- why they conflict;
- which authority rule resolves it;
- whether the documentation needs correction before implementation.

Do not silently invent a resolution.

## 3. Inspect the approved UI references

The approved UI reference folder is:

`docs/ui-reference/`

It contains:

- `00-home.png`
- `01-work.png`
- `02-personal-fitness.png`
- `03-explore.png`
- `04-games.png`
- `05-movies-series.png`
- `06-projects-notes.png`
- `07-settings.png`

These images are visual authority inputs, not loose inspiration.

Before implementing or verifying any redesigned world:

1. open the actual corresponding image;
2. inspect the pixels visually;
3. record what is actually visible;
4. identify:
   - composition;
   - visual hierarchy;
   - scene subject;
   - depth;
   - lighting;
   - materials;
   - hero proportions;
   - panel/card proportions;
   - search/capture placement;
   - quick actions;
   - summary cards;
   - portal/submodule cards;
   - information density;
   - responsive risks;
   - scene-specific cinematic/motion opportunities.

Do not treat the filename or MANIFEST description as a substitute for opening the image.

Do not use the composite reference screenshot itself as the production page background because its UI is baked into the image.

Create/retain clean production scene assets and real HTML/CSS/JS UI above them.

## 4. Preserve the approved redesign model

There are exactly eight reference-led main worlds:

1. Home
2. Work
3. Personal / Fitness
4. Explore
5. Games
6. Movies & Series
7. Projects & Notes
8. Settings

Do not invent additional full cinematic worlds unless the authority documents explicitly require them.

Today / AI Assistant / legacy compatibility routes must follow their documented classification.

A portal card is not decorative.

Every required portal/submodule must lead to a real dedicated UI surface.

Example:

`Work -> Projects / Kanban Board / Team / Documents / Meetings / Templates`

The same principle applies to every main world.

Where a submodule contains meaningful objects/workflows, implement the required detail/create/edit/task surfaces as defined by the redesign specification.

Do not stop at attractive landing pages.

## 5. Follow the execution sequence exactly

Do not reorder phases for convenience.

Do not skip ahead to more visually interesting work.

Use `docs/IMPLEMENTATION-STEPS.md` as the sole authority for the exact next checklist item.

The expected high-level flow is:

`current unresolved Phase 12 item`
→ remaining Phase 12
→ Gate 12
→ R0 transition/classification gate
→ R1 redesign foundation
→ R2 Home fidelity checkpoint
→ R3 main worlds one at a time
→ R4 Work -> Projects nested pilot
→ R5 required submodule rollout
→ R6 cross-world/redesign integration
→ remaining reclassified/hardening obligations
→ Gate 25
→ Phase 26
→ Gate 26
→ Phase 13.3 FINAL

But do not assume the current unresolved item from this message.

Verify it from the current checklist/evidence before proceeding.

## 6. One checklist item at a time

For each current item:

1. state the checklist ID and exact requirement;
2. identify affected files;
3. identify applicable architecture contracts;
4. identify applicable reference image, if visual;
5. identify the required acceptance criteria;
6. inspect the current implementation before editing;
7. make the smallest safe change;
8. run the exact targeted automated checks;
9. run the required browser/manual verification;
10. verify persistence/reload/error/cancel/focus behavior where applicable;
11. verify responsive/accessibility behavior where applicable;
12. capture persistent evidence;
13. update the checklist status only when acceptance actually passes;
14. move to the next item only after the current item reaches a valid terminal state.

Never mark an item VERIFIED only because:
- code exists;
- the page looks approximately correct;
- a broad test suite is green;
- a screenshot exists;
- previous chat says it was done.

If implementation exists but exact acceptance is incomplete, use:

`IMPLEMENTED / NOT VERIFIED`

Do not invent hybrid statuses.

## 7. Visual implementation order

For every reference-led world use this order:

1. inspect reference;
2. document image-specific observations;
3. map visible UI;
4. map actions and routes;
5. classify data sources;
6. resolve screenshot-vs-application semantics;
7. build static structure;
8. bind preserved real functionality;
9. implement missing required real behavior;
10. implement real portal/submodule navigation;
11. achieve static visual fidelity;
12. verify desktop reference fidelity;
13. adapt responsive layouts;
14. verify keyboard/accessibility;
15. only then add cinematic motion;
16. verify Full/Subtle/Off;
17. verify reduced motion;
18. verify missing/corrupt asset fallback;
19. verify reload/deep link/Back/Forward;
20. run targeted regression;
21. capture evidence;
22. mark VERIFIED only when all applicable acceptance passes.

Do not add cinematic effects before static fidelity is stable.

## 8. Cinematic behavior

Preserve the shared cinematic lifecycle:

`ENTRY / WAKE-UP`
→ `SETTLE`
→ `AMBIENT / ALIVE`
→ `EXIT / RESET`

Full entry should remain approximately 2–5 seconds where specified.

Support:
- Full;
- Subtle;
- Off;
- `prefers-reduced-motion`.

The page must remain usable while entry motion is running.

Motion must be derived from the actual world scene/reference.

Do not reuse one generic:
- starfield;
- particle field;
- glow loop;
- parallax effect

as the identity of every world.

For example:
- Work motion should feel like the Work studio;
- Explore should feel like the travel/environment scene;
- Games should feel like the gaming room;
- Movies should feel like the home cinema;
- Personal should feel calm/wellness-oriented.

## 9. Data honesty and providers

Core OneSpace is local-first and credential-free by default.

Do not make TMDB, RAWG, IGDB, destination APIs, cloud accounts, AI services or other network dependencies mandatory unless explicitly approved/configured.

Optional providers must fail safely.

Missing provider credentials must not block the credential-free product.

Do not fabricate live values merely to imitate the reference image.

For dynamic screenshot concepts such as:
- weather;
- HRV;
- sleep;
- stress;
- calories;
- friends online;
- connected devices;
- account/billing;
- premium state;
- live new releases;

use the data-source rules from the authority documents.

If no legitimate source exists, show the documented unavailable/local/future-disabled behavior instead of fake live data.

## 10. Route and data ownership

Preserve existing canonical data/storage ownership.

Do not create duplicate datastores merely because a redesigned world visually aggregates existing information.

In particular, follow the documented ownership rules for:
- Work / Projects;
- Notes;
- Productivity;
- Shortcuts;
- Movies;
- Games;
- Explore;
- Projects & Notes.

Preserve existing route/storage compatibility unless a checklist item explicitly defines a migration.

## 11. Responsive and accessibility

For redesign work, perform the full required viewport matrix defined by the authority documents.

Use the approved 2048×1152 view for initial fidelity where required, then verify the remaining desktop/tablet/mobile widths.

Also verify:
- 200% zoom;
- keyboard-only use;
- visible focus;
- ARIA/state semantics;
- touch/no-hover behavior;
- portrait/landscape where applicable;
- long text/translation tolerance where required;
- reduced motion;
- no horizontal overflow;
- no clipping;
- readable contrast.

## 12. Failure and regression discipline

Where applicable test:

- first run;
- empty data;
- large data;
- malformed/corrupt storage;
- rejected writes;
- migration rollback;
- missing/corrupt assets;
- module registration failure;
- animation cancellation;
- route change during animation;
- duplicate event listeners;
- duplicate timers / RAF loops;
- multi-tab/localStorage collisions;
- offline operation;
- optional-provider failure;
- XSS/untrusted content;
- console errors;
- unhandled promise rejections;
- obvious runtime/memory/CPU regressions.

Do not remove legacy tests just because the UI changed.

Previously VERIFIED functionality remains protected unless actual regression evidence proves otherwise.

## 13. Evidence

Every VERIFIED item must have persistent evidence under the project's evidence structure.

For visual/motion work, use appropriate evidence:
- screenshots for static fidelity;
- measurements where needed;
- motion recording/equivalent for motion-critical behavior;
- browser evidence for interaction;
- exact automated test result;
- persistence/reload evidence.

A single screenshot cannot prove:
- motion;
- responsiveness;
- persistence;
- keyboard behavior;
- failure handling.

## 14. Session discipline

At the end of every substantial session report:

### Repository
- branch;
- HEAD;
- clean/dirty state.

### Verification
- latest automated result;
- latest browser result;
- latest visual/fidelity result.

### Ledger
- last VERIFIED item;
- current item;
- first unresolved item.

### Current redesign context
- world/submodule;
- reference image;
- current classification/gate where relevant.

### Files
- changed files.

### Issues
- blockers;
- known non-blocking issues.

### Resume
- exact next action.

A future session must never have to guess where work stopped.

---

For this first response, DO NOT EDIT ANY FILE.

After reading everything and inspecting the current repository/evidence, report only:

1. repository/Git state;
2. confirmation that all authority documents were read;
3. confirmation that the UI reference folder and all eight reference images were inspected/are accessible;
4. exact current checklist/resume point;
5. current phase/gate status;
6. any documentation contradiction you found;
7. the exact next checklist item you intend to execute.

Stop there and wait for confirmation before making code changes.