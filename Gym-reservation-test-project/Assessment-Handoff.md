# Simple Web App in Claude Code — Assessment Handoff

## Purpose

This is an **individual progress assessment** for DEV, SDET, QA, BA, PM, and Product Support.

All participants work from the same **Gym Class Reservation** business requirements in `BRD.md`.

The purpose is to assess how well you can use **Claude Code CLI** to prepare a small project, perform a role-appropriate task, check the result, refine it when necessary, and demonstrate that you understand and own the work you submit.

The assessment is **not primarily a test of advanced professional role skill**.

---

## Common Rules

- **Claude Code CLI is mandatory.**
- The assessment is individual.
- You may ask colleagues for help.
- Receiving help does not reduce your result.
- You must still be able to demonstrate, inspect, explain, check, and own your submitted work.
- Use the concepts, commands, controls, and working practices already taught in the course.
- Later-course techniques are not required and do not provide additional credit.
- The **individual live review is decisive**. Submitted files and other evidence support the review.

The submission location, deadline, and review schedule will be provided separately.

---

## Required Common Work

Regardless of role, you must:

1. Prepare a suitable project folder.
2. Place the provided `BRD.md` in the project.
3. Initialize a Git repository.
4. Create an **initial Git commit** before serious AI work begins.
5. Create `REQUIREMENTS.md` from the BRD.
6. Check that `REQUIREMENTS.md` is a usable and faithful representation of the BRD.
7. Create and use a useful project-level `CLAUDE.md`.
8. Create `PROMPTS.md` and record the prompts you use during the assessment.
9. Perform your assigned role-specific work with Claude Code.
10. Check Claude Code output or changes before accepting them.
11. Refine from evidence when refinement is genuinely needed.
12. Accept the result when you consider the bounded work satisfactory.
13. Create a **final Git commit** after the assessment work is complete.
14. Keep the complete project available for the live review.

---

## BRD and `REQUIREMENTS.md`

`BRD.md` is the **authoritative business source** for the assessment.

`REQUIREMENTS.md` is your project working representation derived from the BRD.

You may use Claude Code to help create or refine `REQUIREMENTS.md`, but you are responsible for checking it before relying on it.

If `REQUIREMENTS.md` conflicts with `BRD.md`, the BRD remains authoritative unless a human-approved requirement change has been made.

---

## `CLAUDE.md`

Create and use a useful project-level `CLAUDE.md`.

Apply what you have already learned about stable project guidance, project structure, tools, boundaries, and sources of truth.

Your `CLAUDE.md` may differ from those created by participants in other roles.

---

## `PROMPTS.md`

`PROMPTS.md` is **mandatory assessment evidence**.

Record the prompts you use during the assessment, including relevant follow-up and refinement prompts.

You do not need to copy Claude Code responses or write a commentary about every interaction.

`PROMPTS.md` is not intended to be a complete session transcript.

---

## Checking and Refinement

Claude Code saying that the work is complete is **not enough** for acceptance.

You must perform checks appropriate to your assigned role.

If checking reveals a genuine problem or gap, use that evidence to guide the next prompt.

> **Do not introduce an artificial problem just to demonstrate another iteration. If the result is acceptable after checking, additional refinement is not required.**

There is no required number of prompts or iterations.

---

# Role Assignments

## DEV

Use Claude Code CLI to create the **Gym Class Reservation web application** described by `BRD.md` and your checked `REQUIREMENTS.md`.

### Deliverables

- a working browser-openable application;
- the project files needed to demonstrate it.

Before accepting the result, perform representative human checks of the application.

You are not expected to implement the application manually. Claude Code may create substantial parts or all of the code.

---

## QA

Use Claude Code CLI to analyze the Gym Class Reservation requirements and create a **usable manual test-design artifact**.

### Deliverable

- manual test-design artifact.

**Test execution is not required.**

Your test design should be grounded in `BRD.md` and your checked `REQUIREMENTS.md`.

Do not create separate test strategy, traceability matrix, execution report, defect report, or automation artifact unless you need something small as part of your own working process.

---

## SDET

Use Claude Code CLI to analyze the Gym Class Reservation requirements, identify a meaningful subset suitable for automation, and create an **automated-test design specification** for that subset.

### Deliverables

- a small test-analysis artifact identifying the areas considered for automation;
- an automated-test design specification for the selected subset.

**Implementation and execution of automated tests are not required.**

Your automation design should be grounded in `BRD.md` and your checked `REQUIREMENTS.md`.

Be prepared to explain any technical assumptions in the proposed automation design.

---

## BA

Use Claude Code CLI to review `BRD.md` and prepare a **requirements clarification and improvement proposal**.

### Deliverable

- requirements clarification and improvement proposal.

Your proposal should identify selected issues or improvement opportunities, propose clarifications or changes, and explain why they would improve the requirements.

`BRD.md` remains authoritative.

AI-generated requirement changes are **proposals**, not automatically approved requirements.

---

## PM

Use Claude Code CLI to analyze `BRD.md` and prepare a **compact delivery plan** for the Gym Class Reservation application.

### Deliverable

- one compact delivery-plan artifact.

The plan should remain proportionate to this small application.

It may include major activities, sequencing, responsibilities, dependencies, checkpoints, assumptions, and relevant small-project risks.

Do not create multiple separate PM documents unless they are genuinely needed for your chosen plan.

---

## Product Support

Use Claude Code CLI to investigate `Support-Case.md` against the Gym Class Reservation requirements and available evidence.

### Deliverable

- a final support response, clarification request, or escalation suitable for the client support platform.

You are **not required to fix defects or perform deep debugging**. Base your conclusion on evidence, not only on Claude Code's explanation.

---

## Evidence to Retain

Keep the complete assessment working folder.

At minimum, retain:

- `BRD.md`;
- `REQUIREMENTS.md`;
- `CLAUDE.md`;
- `PROMPTS.md`;
- your final role-specific artifact or artifacts;
- the Git repository and history with the initial and final commits;
- any other project files required for your result.

If the original Claude Code session remains available, it may also be useful during the review.

**Exporting a Claude Code session is not required.**

You do not need:

- screenshots of every interaction;
- a complete Claude Code session transcript;
- detailed activity logs;
- a remote Git repository unless separately requested.

---

## Individual Live Review

During the review, be prepared to show or explain, as appropriate:

- how you prepared the project;
- your initial Git baseline;
- how `REQUIREMENTS.md` was created from `BRD.md`;
- what you checked before relying on `REQUIREMENTS.md`;
- what stable guidance you placed in `CLAUDE.md`;
- the prompts recorded in `PROMPTS.md`;
- what work you delegated to Claude Code;
- what Claude Code created, changed, or proposed;
- how you checked the result;
- what evidence caused refinement, if refinement was needed;
- why you accepted the final result;
- your final Git state and commit;
- the role-specific artifact you are submitting;
- any known limitation or unresolved issue.

You do not need to prove that you could have produced the same result without AI.

You do need to show that you understand enough to **inspect, explain, check, and own the result**.

---

## Submission

Submit the required role-specific artifact or artifacts together with the working project files required for review.

The exact submission location, deadline, and review schedule will be provided separately.
