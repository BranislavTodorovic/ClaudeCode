# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Assessment project building the **Gym Class Reservation** web application described in `BRD.md`. The participant role is **DEV**: the deliverable is a working, browser-openable application plus the files needed to demonstrate it.

## Sources of truth

- **`BRD.md` is the authoritative business source.** It is never edited as part of this work.
- **`REQUIREMENTS.md`** is the derived working representation, with every requirement tagged by BRD section (`§1`–`§19`) and numbered `R-01`–`R-68`. Cite these IDs when discussing behaviour.
- On any conflict between the two, **`BRD.md` wins** unless a human has approved a requirement change. AI-proposed requirement changes are proposals, never approved requirements.
- `Assessment-Handoff.md` governs process and deliverables, not product behaviour.

## Running

```
start index.html
```

Opened directly from the filesystem — no server needed.

There is **no build, lint, package manager, or test suite** in this project, and none should be added unless asked. Do not invent commands for this section.

## Implementation constraints

- Everything lives in a single `index.html`: markup, `<style>`, and `<script>` inline. No separate CSS/JS files unless asked.
- No npm, bundler, framework, CDN, or any network dependency — the page must work offline from the filesystem.
- No backend, database, or API calls (§17).

## Business constants

Do not paraphrase these from memory. Maximum capacity is **10 participants per session** (§4); the numbers below are the *initial* free places, which are not always the capacity.

| Class | €/participant | Sessions → initial free places |
|---|---:|---|
| Yoga | 8 | Mon 18:00 → 10 · Wed 19:00 → 6 · Sat 10:00 → 2 |
| Pilates | 10 | Tue 18:00 → 8 · Thu 19:00 → 4 · **Sat 11:30 → 0** |
| Functional Training | 12 | Mon 19:30 → 5 · Wed 18:00 → 10 · Fri 18:30 → 3 |
| Spinning | 11 | Tue 19:30 → 7 · Thu 18:00 → 1 · Sun 10:00 → 10 |

Total price = participants × price per participant (§9). No payment is processed.

## State rules

Availability lives in **in-memory JavaScript only**.

- **Do not use `localStorage`, `sessionStorage`, cookies, or IndexedDB.** §12 requires that refreshing or reopening the app restores the initial availability in the table above, so any persistence would actively violate the requirement. This needs saying explicitly, because persisting reservations is the default instinct.
- Confirming a reservation deducts those places from that session for the remainder of the page session (§12).
- "Start another reservation" resets the form but **keeps** deductions already made during this page session (§13).
- No cross-user or cross-tab synchronization (§12).

## Validation

Block confirmation when any of these hold (§8, §14):

- no class selected;
- no session selected;
- participants < 1;
- participants > places currently remaining;
- the selected session has 0 places.

Full sessions are not reservable at all (§4, §7). The user must get visible feedback explaining why confirmation is blocked (§14).

Each session must display its day and time, whether places remain, and how many (§7). The pre-confirmation summary must show all five of: class, session, participant count, price per participant, total price (§10).

## Privacy and scope boundaries

- Collect **no personal data of any kind** — no name, email, phone, address, account, or payment field. Reservations are anonymous (§16).
- Do not build unless explicitly asked (§17): user accounts, authentication, memberships, subscriptions, payments, discounts, database storage, backend, live multi-user availability, waiting lists, personal-trainer scheduling, cancellation, rescheduling, trainer management, email/SMS confirmation, calendar integration, external APIs, or date/calendar arithmetic.

## Git

- **This folder is not its own repository, and must never become one.** The single repository for this workspace lives at `C:/Users/btodorovic/Projects/ClaudeCode`; this project is a tracked subfolder of it, as are `claude-code-web-page-practice`, `FashionSwitchboard`, and `personal-web-calculator`. **Do not run `git init` here.**
- That repository holds several unrelated projects, so **scope every commit to this folder** — `git add Gym-reservation-test-project` — and never `git add -A`, which would sweep in a sibling project's work.
- The assessment requires a baseline commit of the source documents and a final commit closing the work.

## Assessment artifacts

Keep these current; they are the evidence retained for review:

| File | Role |
|---|---|
| `BRD.md` | Authoritative requirements (never edited) |
| `REQUIREMENTS.md` | Derived working requirements, R-01–R-68 |
| `CLAUDE.md` | This guidance |
| `PROMPTS.md` | Running record of prompts used — append as work proceeds |
| `index.html` | The application |

No other files or subfolders are required by `BRD.md` or `Assessment-Handoff.md`; do not create any without being asked.
