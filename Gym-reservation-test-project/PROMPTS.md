# PROMPTS — Gym Class Reservation assessment

Record of the prompts used with Claude Code CLI during this assessment, including follow-up and refinement prompts.

This is assessment evidence, not a session transcript. Claude Code responses are not reproduced here.

Model used: Claude Opus 5 (1M context).

---

## Session 1 — project setup and requirements

### P-01 — Initialize project guidance

Slash command: `/init`

> Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository.

*(Standard `/init` command. At this point the folder contained only `BRD.md` and `Assessment-Handoff.md`.)*

### P-02 — Setup decisions (answers to clarifying questions)

Claude asked which assessment role was being performed, what implementation shape to fix, and how to handle Git. Answers given:

- **Role:** DEV — build the Gym Class Reservation web application.
- **Implementation shape:** a single static `index.html`, all HTML/CSS/JS inline, opened directly in a browser.
- **Git:** initialize a repository in this folder rather than using the parent `ClaudeCode` repository.

### P-03 — Refinement: check the plan against the source documents

> Before proceeding, carefully re-read both BRD.md and Assessment-Handoff.md from start to finish and cross-check the current plan against them so no requirement, assessment rule, artifact, constraint, Git step, or important detail has been missed or misinterpreted. The project root is C:\Users\btodorovic\Projects\ClaudeCode\Gym-reservation-test-project; based strictly on those two documents, create any required subfolders and initialize this folder as its own Git repository with git init if it is not already initialized, verify that Git root is this exact folder rather than the parent ClaudeCode repository, and follow the required initial-commit-before-substantial-AI-work sequence. If anything in the current plan or intended project structure conflicts with either source document, correct the plan first, then proceed in the required assessment order without inventing unnecessary files, folders, commands, or requirements. If anything is not clear, please stop and ask questions.

**Why this prompt was issued:** the first plan covered only `CLAUDE.md`. Checking it against `Assessment-Handoff.md` showed three genuine defects, which this prompt caused to be corrected:

1. The Git steps (Required Common Work 3–4: `git init` plus an initial commit *before* serious AI work) were missing entirely. `git rev-parse --show-toplevel` confirmed the folder was only an untracked entry in the parent repository.
2. The ordering was wrong — the handoff numbers `REQUIREMENTS.md` (5–6) before `CLAUDE.md` (7).
3. Steps 8–14 (`PROMPTS.md`, the application, checking, refinement, acceptance, final commit) were absent.

It also established the rule that nothing may be created which the two source documents do not require. Grepping both documents for referenced filenames produced exactly `BRD.md`, `REQUIREMENTS.md`, `CLAUDE.md`, `PROMPTS.md`, and `Support-Case.md` (the last belongs to the Product Support role and was correctly not created). **No subfolders were created**, since neither document names one and `BRD.md` §18 explicitly declines to prescribe file structure.

### P-04 — Confirm the model before implementation

> I want to check the model that we are using before we start implementation.

*(Confirmed as Claude Opus 5, 1M context, and set as the session default via `/model`.)*

### P-05 — Execute the plan

> as everything is clear, you can proceed with implementing the plan. Please stick with to the plan, go line by line, and do not miss anything, try avoiding potential bugs. If something is not clear, please stop with implementation and ask the questions.

### P-06 — Re-check the documents and correct the Git layout

> It looks right, but I want you to go though documents again and make sure that nothing is missed. Also, root repo is claude-code-web-page-practice that is the repo where git init is already initiazlied, all other sub folders should not have git initialized, please check and make sure that our gym-reservation-test-project do not have it. After you confirm that everything looks right, you can proceed.

**Effect:** triggered a second full pass over `BRD.md` and `Assessment-Handoff.md` (recorded as C-06) and corrected the Git layout (C-02). The nested repository created under P-03 was the wrong structure for this workspace and had already been removed; `CLAUDE.md` and this file were corrected where they still described this folder as its own repository.

---

## Checks performed

Record here what was checked before accepting Claude Code output, and any evidence that prompted refinement.

### C-01 — `REQUIREMENTS.md` verified against `BRD.md`

Checked mechanically rather than by reading alone:

- all 19 BRD sections (`§1`–`§19`) are referenced;
- the four-row price table `diff`s identical against the BRD;
- all twelve session availability rows `diff` identical against the BRD, including `Pilates — Saturday 11:30 → 0`, the one session that starts full;
- requirement IDs run contiguously R-01 through R-68.

### C-02 — Git layout verified and corrected

A nested repository was first created in this folder with `git init`, following P-03. That was wrong for this workspace and was removed.

The corrected, verified layout: the workspace has **exactly one** Git repository, at `C:\Users\btodorovic\Projects\ClaudeCode`. A `find` for `.git` directories across the workspace returns only that one. Every project folder — `claude-code-web-page-practice`, `FashionSwitchboard`, `personal-web-calculator`, and this one — is a tracked subfolder of it, and none has a repository of its own.

Consequence for the assessment: the commits required by Required Common Work 4 and 13 are made in the `ClaudeCode` repository, scoped to `Gym-reservation-test-project/` so that unrelated work in sibling project folders is not swept into them.

### C-03 — `index.html` checked by static inspection

Executed greps over the finished file:

- **No persistence.** No `localStorage`, `sessionStorage`, `IndexedDB`, or `document.cookie` anywhere — only a source comment explaining why they are forbidden. This is what makes R-40 (refresh restores initial availability) hold.
- **No personal data.** The file contains exactly one `<input>`, `type="number"` for the participant count, and no `<form>`. Nothing asks for a name, email, phone, address, account, or payment detail (R-63, R-64).
- **No external dependency.** No `http(s)://` URL, no `src=`, no `@import`, no `fetch(` or `XMLHttpRequest`. The page works offline from the filesystem.
- **Data matches the BRD.** The four prices and all twelve session availabilities extracted from the JavaScript match `BRD.md` §3 and §4 exactly, including `Saturday 11:30 → 0`.

### C-04 — Behaviour executed against the real script

The `<script>` block was extracted from `index.html` and executed under Node against a minimal DOM stub, so the shipped code itself ran rather than a copy. **34 checks, 34 passed, 0 failed**, covering:

| Area | Checks | Requirements |
|---|---|---|
| Initial state, class rendering | 3 | R-05, R-46 |
| Session display and availability text | 3 | R-15, R-16, R-17 |
| Full session not selectable | 3 | R-09, R-18, R-50 |
| Price calculation and summary fields | 5 | R-23, R-27–R-31 |
| Participant bounds and blocked confirmation | 7 | R-19–R-22, R-48, R-49, R-51 |
| Deduction on confirmation | 6 | R-33–R-35, R-37, R-38 |
| Start another reservation keeps deductions | 4 | R-42, R-43, R-44 |
| Reserving the last place makes a session full | 2 | R-09, R-37 |
| Confirm guard with incomplete selection | 1 | R-45, R-47 |

Two small improvements were made during construction, before any commit: a grammar fix to the over-capacity message ("1 place remains" rather than "1 place remain") and removal of a helper function left unused by that fix. Neither arose from a behavioural defect.

This harness is a checking aid only. It lives outside the project folder and is deliberately not part of the deliverable, since the DEV role does not require automated tests.

### C-05 — Human checks in the browser

Performed by the participant with `index.html` open in a browser, covering: deduction after confirming 2 of 6 places on Yoga Wednesday 19:00 (§12); the €36 total for three Functional Training places (§9); Pilates Saturday 11:30 being unselectable (§4, §7); blocked confirmation when asking for 3 places on Spinning Thursday 18:00 (§8, §14); form reset with deductions retained after starting another reservation (§13); availability restored to the initial table after a refresh (§12); no personal-data field anywhere in the interface (§16).

Outcome: accepted. No defect was found, so no refinement iteration was performed — `Assessment-Handoff.md` explicitly warns against introducing an artificial problem to demonstrate another iteration.

### C-06 — Second full pass over both source documents

Re-checked after acceptance, at the participant's request:

- every BRD section `§1`–`§19` is referenced in `REQUIREMENTS.md`;
- all five blocked-confirmation cases from §14 are present in `index.html`;
- all 34 behavioural checks from C-04 still pass against the finished file;
- Required Common Work items 1, 2, 5, 6, 7, 8, 9, 10, 11, 12 and 14 are satisfied, with 3, 4 and 13 resolved by the corrected Git layout in C-02;
- every file listed under *Evidence to Retain* exists;
- no file or subfolder was created that neither source document requires. `Support-Case.md` belongs to the Product Support role and was correctly not created.
