Continue the existing OneSpace project from the current repository state.

Before changing code, read the complete current authority/documentation set from the beginning and in the documented order:

1. `docs/agent-instructions.md`
2. `docs/IMPLEMENTATION-STEPS.md`
3. `docs/REVISED-IMPLEMENTATION-PLAN.md`
4. `docs/REDESIGN-INTEGRATION-GATE.md`
5. `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md`
6. `docs/ui-reference/MANIFEST.md`
7. `VERIFICATION.md`
8. `README.md`

Also inspect:

- current Git/repository state;
- implementation evidence;
- current checklist/progress state;
- approved UI references under `docs/ui-reference/`.

Read the documents from the beginning, but do not restart already VERIFIED implementation from Phase 0.

Use the repository, checklist and persistent evidence to identify the exact first unresolved item and resume implementation from that point.

The current synchronized plan intentionally places all newly added Live Experience redesign work after the remaining Phase 12 work and Gate 12, so follow `docs/IMPLEMENTATION-STEPS.md` exactly and do not skip ahead.

After reconstructing the current state:

- continue with the exact first unresolved checklist item;
- complete and verify it according to its acceptance criteria;
- persist required evidence;
- update its status correctly;
- then continue to the next unresolved checklist item;
- proceed phase by phase and gate by gate in the documented order.

Do not stop merely to ask whether you should continue to the next normal checklist item or phase.

However, if a real permission is required — for example file-system access, launching/using a local server or local IP, browser/tool access, credential access, or another action that explicitly requires user approval — request that permission normally.

Also stop and report if you encounter:
- a genuine authority contradiction that cannot be resolved by the documented precedence rules;
- a missing required reference/file;
- a hard technical blocker;
- an action that requires explicit user permission.

For redesign work, follow the authority documents and approved images exactly.

The approved references are under:

`docs/ui-reference/`

When a redesigned world becomes active, open and visually inspect the actual relevant reference image. Do not rely only on filenames, MANIFEST text, or previous notes.

Use the approved images as visual authority for:
- composition;
- hierarchy;
- scene identity;
- lighting;
- depth;
- surfaces/materials;
- hero proportions;
- search/capture placement;
- quick actions;
- summary cards;
- portal/submodule cards;
- information density;
- and cinematic/motion direction.

Build the real UI and clean production scene assets from those references; do not use the composite screenshots themselves as baked-in page backgrounds.

Follow the documented hierarchy completely:

- main world;
- required portal/submodule;
- required detail/edit/task surfaces.

Do not stop at attractive main landing pages.

For example, Work must have its full world presentation, and Projects, Kanban Board, Team, Documents, Meetings and Templates must lead to their required dedicated UI surfaces. Apply the same rule to every other main world and its required portals/submodules.

Follow the cinematic lifecycle and motion rules from the documents. Each world must derive its cinematic behavior from its own approved scene/reference rather than using one generic effect for every page.

Follow the no-skip, verification, evidence, responsive, accessibility, persistence, routing, fallback, offline, security and regression requirements exactly as documented.

Begin now:

1. read the full authority set;
2. inspect Git/repository/evidence;
3. inspect the UI reference folder;
4. determine the exact first unresolved checklist item;
5. then immediately continue implementation from that item in the documented order.