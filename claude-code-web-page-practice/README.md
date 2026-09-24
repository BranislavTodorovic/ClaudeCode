**# OneSpace**

OneSpace is a local-first personal dashboard that brings development work, personal organization, travel inspiration, games, movies and series, shortcuts, productivity, notes and settings into a single application.

The application is intentionally lightweight and uses the existing vanilla HTML/CSS/JavaScript architecture. It does not require user accounts or cloud synchronization.

Some discovery features can use optional provider-backed search through the local Node server. Provider credentials are kept server-side and must never be exposed to browser JavaScript.

\> [!IMPORTANT]

\> OneSpace is actively being implemented and verified against the current standing plan.

\>

\> Do not infer final completion from this README alone.

\>

\> Current implementation status, open work, verification evidence and phase gates are tracked in:

\>

\> - \`docs/agent-instructions.md\`

\> - \`docs/IMPLEMENTATION-STEPS.md\`

\> - \`VERIFICATION.md\`

\---

**## Table of contents**

\- [Quick start]\(#quick-start)

\- [Project authority]\(#project-authority)

\- [Application structure]\(#application-structure)

\- [Routes and navigation]\(#routes-and-navigation)

\- [Live cinematic experience]\(#live-cinematic-experience)

\- [Work]\(#work)

\- [Personal]\(#personal)

\- [Explore]\(#explore)

\- [Games]\(#games)

\- [Movies & Series]\(#movies--series)

\- [Shortcuts]\(#shortcuts)

\- [Productivity and Notes]\(#productivity-and-notes)

\- [Settings and themes]\(#settings-and-themes)

\- [Provider-backed discovery]\(#provider-backed-discovery)

\- [Secrets and security]\(#secrets-and-security)

\- [Offline and degraded behavior]\(#offline-and-degraded-behavior)

\- [Storage and data contracts]\(#storage-and-data-contracts)

\- [Backup, restore and migration]\(#backup-restore-and-migration)

\- [Testing]\(#testing)

\- [Browser acceptance]\(#browser-acceptance)

\- [Responsive behavior]\(#responsive-behavior)

\- [Accessibility and keyboard behavior]\(#accessibility-and-keyboard-behavior)

\- [Known limitations]\(#known-limitations)

\- [Verification and delivery status]\(#verification-and-delivery-status)

\- [Final whole-project release-readiness audit]\(#14-final-whole-project-release-readiness-audit)

\---

**# Quick start**

Start the local OneSpace server from the repository root:

\`\`\`sh

node server/\_static-server.js

\`\`\`

Then open:

\`\`\`text

http\://localhost:8973/

\`\`\`

Keep the same hostname and port when working with existing local data because browser storage is isolated by origin.

If a restricted Windows Node environment reports an \`EPERM\` error while resolving paths, use:

\`\`\`sh

node --preserve-symlinks --preserve-symlinks-main server/\_static-server.js

\`\`\`

\---

**# Project authority**

OneSpace uses several project documents with different responsibilities.

**## 1. \`docs/agent-instructions.md\`**

The standing plan.

It defines:

\- what must be delivered;

\- product behavior;

\- architecture decisions;

\- scope;

\- phase requirements;

\- accepted product decisions.

This is the primary product and implementation authority.

**## 2. \`docs/IMPLEMENTATION-STEPS.md\`**

The execution and verification authority.

It defines:

\- exact execution order;

\- numbered implementation steps;

\- allowed statuses;

\- acceptance criteria;

\- required evidence;

\- phase gates;

\- resume-after-interruption behavior;

\- the strict completion contract.

A phase is not complete merely because code exists or automated tests are green.

**## 3. \`VERIFICATION.md\`**

The final verification runbook and acceptance record.

It defines how the final implementation is re-tested across:

\- automation;

\- browser flows;

\- persistence;

\- responsive layouts;

\- security;

\- offline behavior;

\- accessibility;

\- reduced motion;

\- visual quality.

**## 4. \`docs/REVISED-IMPLEMENTATION-PLAN.md\`**

The architecture and technical-rationale authority.

It is subordinate to \`docs/agent-instructions.md\` for product scope and to \`docs/IMPLEMENTATION-STEPS.md\` for execution/status, but it must be reconciled rather than ignored when a conflict appears.

**## 5. \`README.md\`**

The delivered-product documentation authority.

It describes what the application actually does, how to run/configure it, its user-visible behavior and verified limitations. During Phase 13.3 it must be reconciled against the final evidence rather than treated as proof by itself.

\---

**# Application structure**

OneSpace remains a single application with the original shell and router.

The project is organized by domain while preserving existing browser globals, storage keys, load-order contracts and backup compatibility.

A representative structure is:

\`\`\`text

/

├── index.html

├── README.md

├── VERIFICATION.md

│

├── shared/

│   ├── storage-utils.js

│   ├── catalog-utils.js

│   ├── shortcut-utils.js

│   ├── shortcut-surface.js

│   ├── domain-ui.js

│   ├── tooltip-utils.js

│   ├── visual-utils.js

│   └── cinematic-scenes.js

│

├── work/

│   ├── projects.js

│   ├── work-tracker.js

│   └── tracker.css

│

├── personal/

│   └── personal-controller.js

│

├── explore/

│   ├── explore.js

│   ├── explore-data.js

│   ├── explore-global.js

│   ├── discovery-integration.js

│   ├── discovery-ui.js

│   ├── local-discovery.js

│   ├── trip-board.js

│   └── discovery.css

│

├── games/

│   ├── games.js

│   ├── games-data.js

│   ├── game-resources.js

│   ├── games.css

│   └── games-cinematic.css

│

├── movies/

│   ├── movies.js

│   ├── movies-data.js

│   ├── movies.css

│   └── movies-cinematic.css

│

├── styles/

│   ├── pages.css

│   └── cinematic-refinement.css

│

├── server/

│   ├── \_static-server.js

│   └── providers/

│

├── config/

│   ├── secrets.example.json

│   └── secrets/

│

├── assets/

├── tests/

└── docs/

    ├── agent-instructions.md

    ├── IMPLEMENTATION-STEPS.md

    ├── REVISED-IMPLEMENTATION-PLAN.md

    └── implementation-evidence/

\`\`\`

The exact repository state should always be confirmed from Git and the current checklist.

\---

**# Routes and navigation**

The existing shell/router remains in \`index.html\`.

The retained routes are:

\- Home

\- Work

\- Projects

\- Personal

\- Explore

\- Games

\- Movies

\- Shortcuts

\- Productivity

\- Notes

\- Settings

Projects remains a compatibility route but resolves into the Work experience with the Projects sub-view selected.

This preserves older page references while avoiding a separate competing Work/Projects product model.

OneSpace emits route and data events used by domain modules:

\`\`\`text

onespace\:page-changed

onespace\:data-changed

\`\`\`

Existing public browser globals and storage keys must remain compatible unless explicitly changed by the standing plan.

\---

**# Live cinematic experience**

The cinematic layer is a core OneSpace product requirement.

It is not decorative polish added after functionality.

Each distinct top-level experience must visually feel alive and must represent its own domain.

**## Cinematic lifecycle**

When the user genuinely enters a tab in **\*\*Full\*\*** scene mode, the page should behave like a short film opening:

\`\`\`text

ENTRY / WAKE-UP

        ↓

      SETTLE

        ↓

  AMBIENT / ALIVE

        ↓

    EXIT / RESET

\`\`\`

**### Entry / Wake-up**

A genuine page entry triggers a short, visible cinematic sequence.

The intended Full-mode duration is approximately:

\`\`\`text

2–5 seconds

\`\`\`

The sequence must contain staged visual changes rather than only:

\- one opacity fade;

\- one gradient transition;

\- generic floating particles;

\- barely visible parallax.

Possible techniques include:

\- layered image reveals;

\- depth movement;

\- light sweeps;

\- focus changes;

\- route or blueprint drawing;

\- atmosphere;

\- particles or motes;

\- glow activation;

\- image crop movement;

\- domain-specific object motion.

The page must remain usable during the sequence.

**### Settle**

The opening sequence resolves smoothly into the normal page composition.

Interactive controls, text and focus targets must remain stable.

**### Ambient / Alive**

After the opening sequence ends, the page should still feel quietly alive.

Ambient movement may include:

\- slow depth drift;

\- soft lighting changes;

\- restrained particles;

\- image breathing;

\- subtle crop movement;

\- atmospheric glow;

\- slow background motion.

Ambient motion must never compete with content.

**### Exit / Reset**

Leaving the page resets scene-specific entry state.

Returning to the page should replay the cinematic entry.

Internal re-renders such as:

\- filtering;

\- editing;

\- completing a task;

\- opening a detail view;

must not restart the full cinematic entry.

\---

**## Scene intensity**

OneSpace supports three scene-intensity levels.

**### Full**

\- complete cinematic entry;

\- visible staged motion;

\- living ambient state.

**### Subtle**

\- shorter/lower-amplitude entry;

\- reduced ambient movement;

\- still recognizably cinematic.

**### Off**

\- no cinematic movement;

\- complete static visual composition remains.

**### Reduced motion**

When reduced motion applies, OneSpace immediately displays the final static composition.

It removes:

\- parallax;

\- ambient transforms;

\- stagger;

\- scroll-linked movement;

\- unnecessary cinematic transitions.

Reduced motion must never remove information, controls, artwork or contrast.

\---

**## Domain-specific cinematic direction**

Each distinct scene must visually represent its own part of OneSpace.

**### Home**

**\*\*Observatory / personal command deck\*\***

Possible visual language:

\- orbital lines;

\- constellation paths;

\- controlled light sweep;

\- navigation geometry;

\- command surfaces.

**### Work**

**\*\*Development command center / drafting room\*\***

Possible visual language:

\- blueprint/grid depth;

\- project/work lines;

\- structured data pulses;

\- panel activation;

\- professional technical movement.

**### Personal**

**\*\*Calm ritual / reflection space\*\***

Possible visual language:

\- warm depth;

\- soft lighting;

\- gentle organic movement;

\- calm visual pacing.

**### Explore**

**\*\*World atlas / travel window\*\***

Possible visual language:

\- maps;

\- routes;

\- geographic layers;

\- horizon/cloud movement;

\- destination imagery;

\- travel-light transitions.

**### Games**

**\*\*Game-world spotlight\*\***

Possible visual language:

\- game artwork;

\- depth;

\- scan/spotlight reveal;

\- restrained energy/glow;

\- world-specific visual identity.

**### Movies & Series**

**\*\*Theater / streaming marquee\*\***

Possible visual language:

\- projector beams;

\- poster/backdrop reveal;

\- marquee light;

\- cinematic framing;

\- theater-like transitions.

**### Shortcuts**

**\*\*Spatial launch wall\*\***

Possible visual language:

\- shortcut tiles waking in sequence;

\- modern icon movement;

\- spatial depth;

\- launch feedback.

**### Productivity**

**\*\*Focus / timer studio\*\***

Possible visual language:

\- timer/ring progression;

\- focus field;

\- restrained light movement.

**### Notes**

**\*\*Quiet capture desk\*\***

Possible visual language:

\- paper/ink/light;

\- capture/writing reveal;

\- subtle depth.

**### Settings**

**\*\*Control room\*\***

Possible visual language:

\- panels waking in sequence;

\- theme/token transitions;

\- system-like control activation.

Projects uses the Work cinematic scene because Projects is a Work sub-view/compatibility alias.

\---

**## Cinematic imagery**

Each distinct scene must contain meaningful domain-relevant artwork or imagery.

The cinematic system must not rely only on generic gradients.

Allowed sources include:

\- local page artwork;

\- properly licensed local imagery;

\- project-approved deterministic/generated artwork;

\- layered SVG illustration;

\- provider imagery where the current provider contract permits it.

Pages such as:

\- Explore;

\- Games;

\- Movies & Series;

should use imagery especially strongly where licensing and project constraints permit.

The project must not:

\- scrape copyrighted assets;

\- commit unapproved copyrighted provider images;

\- expose provider-only image contracts incorrectly;

\- visibly upscale poor-resolution artwork;

\- reuse one generic image as the identity for every page.

\---

**# Work**

Work is the development-oriented domain.

Projects is integrated into Work rather than operating as a competing standalone experience.

The primary Work sub-views are:

\- Board

\- Projects

\- Backlog

\- History

**## Work items**

Work supports stories and defects with fields such as:

\- project;

\- type;

\- status;

\- priority;

\- analysis;

\- plan;

\- execution notes;

\- labels;

\- links;

\- deadline;

\- reminder;

\- child tasks.

**## Tasks**

Child tasks can include:

\- title;

\- details;

\- priority;

\- due date;

\- estimate;

\- completion state.

**## Lifecycle**

Work supports lifecycle transitions including:

\`\`\`text

open

→ in progress

→ blocked

→ closed

→ backlog

→ reopen

\`\`\`

Closing an item must preserve its history and task snapshots according to the storage contract.

Reopening must not silently destroy previously recorded completion state/history.

**## Filters and sorting**

Work supports live filtering, active-filter feedback, result counts and explicit sorting.

The Work UI should visually read as a modern development tool rather than a generic collection of cards.

\---

**# Personal**

Personal contains user-owned goals, routines and habits.

Supported flows include:

\- add;

\- edit;

\- complete/uncomplete;

\- confirmed delete;

\- persistence;

\- reload.

Habit frequency may use supported daily/weekly/monthly semantics.

Personal remains separate from Work.

Cross-domain content should not be mirrored into Personal merely to make another page appear populated.

\---

**# Explore**

Explore is the travel-inspiration domain.

The current standing plan uses a curated/local destination model rather than treating the browser as an exhaustive worldwide travel inventory.

The current catalog contains a maintained set of destinations and recommendation metadata.

Explore should support:

\- preference-driven matching;

\- deterministic/explainable recommendations;

\- destination details;

\- saved destinations;

\- trip notes/planning behavior defined by the current checklist;

\- \`Surprise Me\`;

\- fallback behavior when imagery is missing;

\- a final \`More to explore\` section.

**## Destination imagery**

The current implementation plan improves the destination experience with meaningful, properly sourced imagery where required.

Conceptual/generated artwork may remain as an explicit fallback when licensing or availability prevents shipping a suitable real image.

The fallback must never appear as if it were live travel inventory.

**## Travel-data limitation**

Explore content is inspiration/planning content.

It is not guaranteed to represent:

\- current prices;

\- live availability;

\- visa requirements;

\- safety advisories;

\- real-time weather;

\- live transportation inventory.

\---

**# Games**

Games retains the existing tracking experience while supporting richer discovery.

Core behavior includes:

\- tracked games;

\- tracker type;

\- story/chapter tracking;

\- weekly/live-service tracking;

\- tasks/objectives;

\- sessions;

\- journal;

\- themes;

\- resources;

\- game details;

\- spotlight behavior.

**## Tracker type**

A game may use different tracking models, for example:

\- story/campaign;

\- weekly/live-service.

Tracker type should be inferred from known data where possible and remain visible/correctable when required by the current implementation contract.

**## Templates**

Story and weekly templates are game-aware.

The system must not silently apply one generic tracker template to every game.

**## Resources**

Game resources remain data-driven and may include:

\- official;

\- news/updates;

\- guides/builds;

\- community;

\- platform links.

Resources must not be hard-coded only for one title.

\---

**# Movies & Series**

The \`movies\` route is retained for compatibility, but the product experience is Movies & Series.

The catalog/library supports both:

\- Movie

\- Series

The current implementation includes a substantially expanded series catalog compared with the original four-series version.

**## Library behavior**

Tracked titles can be:

\- added;

\- untracked;

\- restored/re-added;

\- placed on the watchlist according to the current state model.

Custom titles may additionally support permanent deletion where defined by the current checklist.

**## Series**

Series records may include:

\- seasons;

\- episode count where available;

\- episode runtime;

\- status;

\- first/last air dates;

\- description;

\- artwork;

\- metadata.

OneSpace currently tracks title-level watch state unless the standing plan explicitly adds episode-level tracking later.

**## Artwork**

Artwork must follow the project's image-quality and licensing rules.

Where redistributable high-resolution artwork is unavailable, an explicitly documented deterministic/generated fallback may be used.

\---

**# Shortcuts**

Shortcuts provide domain-scoped launch links.

They support:

\- built-in shortcuts;

\- custom shortcuts;

\- favorite state;

\- recent usage;

\- descriptions;

\- domain ownership;

\- remove/hide;

\- restore;

\- custom deletion;

\- drag reorder;

\- keyboard reorder.

Built-in shortcut removal hides the built-in record rather than destroying the catalog definition.

Settings provides restoration for hidden built-ins.

**## Shortcut ownership**

Shortcuts can belong to:

\- Work;

\- Personal;

\- Explore.

Ownership must remain isolated.

Creating a shortcut from one domain must not silently populate unrelated domains.

\---

**# Productivity and Notes**

Productivity owns generic daily productivity functionality that does not belong inside Work.

Notes owns general note-taking functionality.

Domain cleanup must not remove the underlying Productivity or Notes features merely because cross-domain mirrors were removed elsewhere.

\---

**# Settings and themes**

Settings controls global application preferences.

Current areas may include:

\- palette;

\- appearance/light-dark behavior;

\- accent;

\- density;

\- start page;

\- productivity preferences;

\- clock format;

\- motion;

\- per-tab scene intensity;

\- Games sub-theme;

\- Movies sub-theme;

\- hidden-shortcut restoration;

\- provider status;

\- export/import;

\- reset preferences;

\- reset all data.

**## Theme behavior**

Light/dark appearance and palette are separate concepts.

Changing appearance must not silently reset the selected palette.

Every supported palette must define the complete token set required by the current theme system.

At least one warm visual direction is part of the current design requirements.

\---

**# Modern icon system**

OneSpace uses a shared inline SVG icon language.

Icons should be:

\- visually consistent;

\- modern;

\- optically balanced;

\- coherent in stroke/fill weight;

\- appropriately sized;

\- accessible.

Major actions should use recognizable modern glyphs where helpful, including:

\- add;

\- edit;

\- remove/delete;

\- back;

\- more;

\- favorite;

\- search;

\- filter;

\- sort;

\- save;

\- restore;

\- open/play;

\- navigation.

Icon-only actions must retain:

\- accessible names;

\- focus states;

\- tooltips where appropriate.

OneSpace should not replace clear text with ambiguous icons only for decoration.

Random emoji/fashion-icon substitutions are not part of the design language.

\---

**# Provider-backed discovery**

OneSpace remains local-first, but some discovery features can use provider-backed search through the local Node server.

The browser must not communicate with private provider credentials directly.

The intended architecture is:

\`\`\`text

Browser

   ↓

OneSpace local server / provider proxy

   ↓

provider adapter

   ↓

external provider

\`\`\`

Provider adapters normalize provider-specific responses before returning them to the UI.

The browser-facing experience should not depend directly on the response format of one external provider.

**## Provider behavior**

Provider-backed flows should support:

\- search;

\- cancellation with \`AbortController\`;

\- pagination/load-more;

\- loading state;

\- empty state;

\- timeout state;

\- authentication/configuration failure;

\- rate-limit state;

\- offline state;

\- generic provider error;

\- short-lived caching where defined by the current implementation.

Tests must use deterministic mock providers and must not consume live provider quotas.

**## Current scope**

Provider-backed discovery applies only where defined by the current standing plan and implementation checklist.

Historical requirements from \`docs/REVISED-IMPLEMENTATION-PLAN.md\` must not silently expand current provider scope.

\---

**# Secrets and security**

Provider secrets are server-side only.

Never place a real API key, token, password or client secret in:

\- \`index.html\`;

\- browser JavaScript;

\- committed browser configuration;

\- public asset files.

**## Secret storage**

The repository contains:

\`\`\`text

config/secrets/

\`\`\`

Only approved placeholder content such as \`.gitkeep\` may be tracked there.

Real local secret files must be ignored by Git.

The committed:

\`\`\`text

config/secrets.example.json

\`\`\`

contains placeholder/example configuration only.

**## Browser access**

\`config/\` and secret paths must be blocked by the local server.

This restriction must cover both:

\- \`.json\` secret files;

\- otherwise servable extensions such as \`.js\`.

The browser must never be able to retrieve real local credentials.

**## Recommended verification**

Examples of security checks used by the project include:

\`\`\`sh

git ls-files config/secrets

\`\`\`

and:

\`\`\`sh

git check-ignore -v config/secrets/\<local-secret-file>

\`\`\`

Server-denial checks should also verify that representative secret paths return no credential content.

If a real credential is ever committed or pushed, rotate/revoke it immediately before continuing.

\---

**# Offline and degraded behavior**

Provider failure must not damage local user data.

When provider functionality is unavailable:

\- the application still opens;

\- existing user-owned records remain available;

\- provider-backed functionality shows a visible degraded/configuration/error state;

\- cached/local content must not be falsely presented as live global provider results;

\- user data must not be erased;

\- failed imagery falls back gracefully.

A provider cache may be safe to clear, but clearing it must not delete user-owned records.

\---

**# Storage and data contracts**

\`shared/storage-utils.js\` is the persistence validation boundary.

It owns or coordinates:

\- known keys;

\- validation;

\- migration/default handling;

\- complete backup validation;

\- transactional writes;

\- rollback;

\- reset behavior.

Existing \`localStorage\` keys are compatibility contracts unless the standing plan explicitly changes them.

Representative domains include:

\| Domain | Data |

\|---|---|

\| Work | projects, work items, tasks, history |

\| Personal | goals, routines, habits |

\| Explore | preferences and saved destination/trip data |

\| Shortcuts | custom links, hidden built-ins, ordering/preferences |

\| Games | library, trackers, tasks, sessions, journal/resources |

\| Movies & Series | library, metadata, watchlist/state |

\| Settings | appearance, palette, motion and related preferences |

Exact schemas and validators are defined by the current implementation and test suite.

\---

**# Backup, restore and migration**

The current backup contract is:

\`\`\`text

Export format: version 4

\`\`\`

Supported complete imports:

\`\`\`text

version 2

version 3

version 4

\`\`\`

Older supported backups receive safe defaults for fields introduced later.

Malformed or incomplete backups must be rejected.

Restore must preserve unrelated browser storage that does not belong to OneSpace.

Transactional writes should leave previous valid state intact when a new write fails and rollback is possible.

**## Important**

Backup version 3 is historical.

New backups must use version 4.

\---

**# Testing**

Run the complete current Node suite from the repository root:

\`\`\`sh

node --test tests/

\`\`\`

Do not use a historical test count as proof of current correctness.

The final accepted test count must come from the most recent run after the last implementation fix.

The suite includes structural and domain regression coverage defined by the current repository.

\---

**# Browser acceptance**

Use the normal application server for read-only/manual inspection:

\`\`\`text

http\://localhost:8973/

\`\`\`

Use the project's disposable test origin for destructive acceptance scenarios.

A typical disposable server is:

\`\`\`powershell

$env\:PORT = '18974'

node tests/browser-server.js

\`\`\`

Use disposable data for operations such as:

\- destructive reset;

\- fixture import;

\- backup/restore;

\- intentional asset failure;

\- repeated lifecycle testing.

**## Missing-asset testing**

Where supported by the test server, use its \`MISSING_ASSET\` hook to deliberately fail a known asset and verify the fallback path.

The exact asset used should match the current implementation.

\---

**# Responsive behavior**

Final visual acceptance is performed at:

\`\`\`text

1440 px

1024 px

760 px

390 px

\`\`\`

At each width verify applicable routes for:

\- horizontal overflow;

\- clipped content;

\- overlapping text;

\- broken images;

\- off-screen dialogs;

\- inaccessible controls;

\- unreadable text;

\- unusable touch targets.

The final verification matrix is recorded in \`VERIFICATION.md\`.

\---

**# Accessibility and keyboard behavior**

OneSpace uses shared modal/dialog behavior where possible.

Final acceptance verifies applicable controls for:

\- visible focus;

\- logical keyboard order;

\- Enter/Space activation;

\- Escape handling;

\- modal focus trap;

\- inert background;

\- focus return;

\- accessible icon labels;

\- relevant ARIA state;

\- \`aria-live\` feedback;

\- typeahead keyboard navigation;

\- keyboard reorder where supported.

This project-level acceptance is not a claim of complete formal accessibility certification.

\---

**# Verification and delivery status**

Implementation completion is governed by:

\`\`\`text

docs/IMPLEMENTATION-STEPS.md

\`\`\`

Final acceptance is governed and recorded by:

\`\`\`text

VERIFICATION.md

\`\`\`

A requirement is not considered complete only because:

\- code exists;

\- tests are green;

\- screenshots exist;

\- a previous agent said it was complete.

Requirement-level acceptance evidence and phase gates are required.

The cinematic requirement is especially strict:

\> If a page technically contains animation but does not visibly feel like a short domain-specific cinematic opening followed by a living ambient state, the cinematic requirement has not passed.

\---

**# Known limitations**

Unless explicitly changed by the standing plan:

\- OneSpace does not provide cloud synchronization.

\- OneSpace does not provide multi-user collaboration.

\- User reminders are local/in-app behavior rather than background push notifications after the page is closed.

\- Movies & Series uses title-level watch state rather than full episode-by-episode tracking.

\- Live provider functionality depends on provider availability, network access and local provider configuration.

\- Explore is planning/inspiration content, not guaranteed real-time travel inventory.

\- Local browser storage remains the primary persistence layer.

\---

**# Development workflow**

At the start of a new coding-agent session or after context compaction/interruption:

1\. Read \`docs/agent-instructions.md\`.

2\. Read \`docs/IMPLEMENTATION-STEPS.md\`.

3\. Read \`docs/REVISED-IMPLEMENTATION-PLAN.md\`.

4\. Read \`VERIFICATION.md\`.

5\. Read \`README.md\`.

6\. Inspect \`git status --short --untracked-files=all\`.

7\. Inspect \`git diff\`.

8\. Inspect the actual implementation.

9\. Inspect \`docs/implementation-evidence/\` and the current audit/checkpoint records.

10\. Identify the last independently verified checklist item and the exact next unfinished item/facet.

11\. Continue from that exact point without repeating already-valid evidence.

Previous chat summaries are navigation aids, not completion evidence.

\---

**# Final documentation rule**

During final documentation reconciliation, this README must be checked against the actual delivered application.

Any section that describes planned behavior not present in the final implementation must be corrected before Gate 13.3 is allowed to pass. Gate 25 must pass before Phase 26 begins, Gate 26 must pass before Phase 13.3 begins, and final documentation must reflect the Phase 26 whole-project result.

The README must describe the product that actually exists, not an earlier plan, an older acceptance run or an intended feature that was never verified.

\---

**# Approved pending final-completion scope — Phases 20–26**

The approved final-fidelity execution sequence is:

\- **\*\*Phase 20 — Full-Viewport Cinematic Fidelity\*\***

\- **\*\*Phase 21 — Global Icon Visual-Quality Completion\*\***

\- **\*\*Phase 22 — Live Provider Search and Real Media Completion\*\***

\- **\*\*Phase 23 — Game Enrichment and Tracker Intelligence\*\***

\- **\*\*Phase 24 — Global Search / Filter Integration\*\***

\- **\*\*Phase 25 — Final User-Visible Product Acceptance\*\***

\- **\*\*Phase 26 — Final Whole-Project Integrity and Release-Readiness Audit\*\***

Phase 13.3 remains the final documentation step and runs only after Gate 26.



\> **\*\*Status:\*\*** approved requirements, not automatically a statement of current delivered behavior.

\>

\> The items in this section become delivered README facts only after their corresponding implementation items are VERIFIED and Gate 26 passes. During Phase 13.3, this section must be reconciled into the normal README and any undelivered claim must remain identified as unresolved rather than silently rewritten.

**# 2. Wide desktop and ultrawide behavior**

Explain that OneSpace intentionally:

\- keeps content readable within appropriate bounds;

\- uses surrounding viewport space for environmental scene composition;

\- does not simply stretch forms/cards to fill width.

List final verified widths, including the actual ultrawide viewport used.

Do not claim acceptance for an untested width.

\---

**# 3. Icon system**

Document:

\- shared inline-SVG application-control language;

\- shared action semantics;

\- accessible names/tooltips;

\- focus/pressed/current states;

\- touch-target behavior;

\- source-identity exceptions for provider marks/brand marks/favicons.

\---

**# 4. Local-first + global provider discovery**

Document the final delivered architecture:

\`\`\`text

Browser

 -> local OneSpace server

 -> provider-neutral adapter

 -> configured external provider

\`\`\`

Explain:

\- user-owned state remains local;

\- curated/local catalogs remain usable;

\- provider discovery expands search;

\- local and global results are visibly distinguished;

\- saved provider-origin records remain meaningful offline.

\---

**# 5. Provider configuration**

Document only providers actually delivered.

For each domain list:

\- provider name;

\- expected secret/config keys;

\- where local secrets are placed;

\- setup steps;

\- required attribution;

\- offline/degraded behavior.

Real credentials:

\- are local and ignored;

\- are never committed;

\- are never browser-visible;

\- are never served by the local/static server.

Do not include real secret values in README.

Final release-readiness also checks Git path history for accidental secret/config exposure without printing raw values. If a real credential was ever committed/pushed, its rotation/revocation and history-remediation decision must be recorded before final PASS.

\---

**# 6. Search and filter semantics**

For Movies/Series, Games and Explore, document which visible criteria are:

\- provider-side;

\- canonical post-filter;

\- local-only;

\- unsupported globally.

Do not imply that a visible filter affects live global results when it does not.

\---

**# 7. Movies & Series**

Document actual delivered behavior for:

\- live search;

\- Movie / Series parity;

\- poster;

\- backdrop;

\- details;

\- combined filters;

\- explicit Add;

\- local persistence;

\- offline reopen;

\- untrack/remove;

\- fallback behavior.

Do not claim every title has real artwork if fallback rules still apply.

\---

**# 8. Games — Add and enrichment**

Document the actual final Add flow.

A successfully added provider game should become a first-class local record containing available:

\- provider identity/source;

\- title;

\- cover;

\- background/key art;

\- description;

\- genres/tags;

\- platforms;

\- release metadata;

\- tracker type.

Explain fallback behavior when metadata is genuinely unavailable.

\---

**# 9. Games — tracker types**

Document delivered tracker types.

**## Weekly / live-service**

Explain:

\- recurring/live-service games infer weekly tracking;

\- Diablo Immortal is an acceptance reference, not a fuzzy-name rule;

\- game-specific recurring templates/data are used only when approved data exists;

\- user may correct inference before save;

\- confirmed tracker type is user-owned state.

**## Story / campaign**

Document hierarchy:

\`\`\`text

Game

 -> Act / Chapter / Region / Level

 -> Mission / Quest

 -> ordered Objective / Step

\`\`\`

\---

**# 10. Campaign progression sources**

A complete campaign tracker may be claimed only when a legitimate complete progression dataset exists.

For each supported complete-progression integration document:

\- exact progression source/provider or curated dataset;

\- access mode;

\- licensing/attribution where required;

\- source/update version strategy;

\- hierarchy depth;

\- mission coverage;

\- objective/step coverage;

\- known limitations.

State explicitly:

\- a normal game catalog provider is not automatically assumed to provide complete missions;

\- OneSpace does not invent missing missions;

\- partial/unavailable progression is labeled;

\- generic/custom story tracking remains available;

\- later enrichment preserves user progress.

\---

**# 11. Complete vs incomplete progression**

Explain the delivered states:

\- \`complete\`

\- \`partial\`

\- \`unavailable/unknown\`

For complete supported games explain that the tracker can automatically populate approved:

\- acts/chapters/regions/levels;

\- missions/quests;

\- ordered objectives/steps where source supplies them.

For unsupported games explain the safe fallback behavior.

\---

**# 12. Provider-origin offline behavior**

Document that after explicit Add/Save:

\- normalized metadata is local;

\- user state is local;

\- provider outage does not delete the record;

\- supported persisted/cached/local/fallback media behavior applies;

\- saved records remain meaningful offline.

\---

**# 13. Verification status**

README claims must match final evidence.

Do not state:

\- live provider is verified when only mock provider was tested;

\- all cinematic routes are accepted when only technical animation checks passed;

\- complete campaign progression exists when source coverage is partial;

\- global filters are provider-backed when they are local-only;

\- real media is available for a record when only deterministic fallback exists.

\---

**# 14. Final whole-project release-readiness audit**

Phase 26 is the final technical/product integrity pass over the fully assembled OneSpace system.

Destructive import/reset/failure-path acceptance is performed on a disposable test origin so the normal user-data origin is not damaged by final verification.

It is not a new feature phase and it does not erase valid historical evidence.

Its purpose is to prove that all completed work still fits together correctly after the final implementation changes.

**## 14.1 Repository and Git**

The final audit checks:

\- project-scoped file placement;

\- tracked/untracked state;

\- final diff;

\- accidental temp/debug/copy/backup artifacts;

\- obsolete duplicate loaded modules;

\- unintended changes outside the OneSpace project.

The audit does not use destructive cleanup merely to make the tree appear clean.

**## 14.2 Secrets and `.gitignore`**

The final audit verifies:

\- real credentials remain in approved local ignored storage;

\- committed examples contain placeholders only;

\- real secret files are not tracked;

\- representative secret files are confirmed ignored;

\- Git path history for secret/config paths is inspected without exposing raw values;

\- prior real-secret exposure, if any, has recorded rotation/revocation and history-remediation status;

\- secret paths are not servable;

\- browser code/network cannot retrieve credentials;

\- errors/logs/evidence/screenshots do not expose secrets.

README never contains real secret values.

**## 14.3 Full UI and icon consistency**

The final audit walks every route and reviews the assembled UI, including:

\- page hierarchy;

\- spacing/typography;

\- cards/forms/dialogs;

\- loading/empty/error/success states;

\- focus behavior;

\- long text;

\- media/fallbacks;

\- one coherent modern application-control icon language.

A route must be visually finished and usable, not merely free of JavaScript errors.

**## 14.4 Final cinematic consistency**

Every distinct scene is checked in final state for:

\- domain identity;

\- Full ENTRY / WAKE-UP;

\- SETTLE;

\- AMBIENT / ALIVE;

\- EXIT / RESET;

\- page-level rather than hero-only composition;

\- wide and ultrawide side-field composition;

\- selected-content Movies/Games/Explore art;

\- route cleanup;

\- Full / Subtle / Off;

\- reduced motion;

\- touch/coarse-pointer safety;

\- text/control readability.

Technically present but imperceptible/generic motion does not count as final cinematic acceptance.

**## 14.5 Final integrated domain behavior**

Phase 26 rechecks the assembled state of:

\- Home;

\- Work / Projects;

\- Personal;

\- Productivity;

\- Notes;

\- Shortcuts;

\- Movies & Series;

\- Games;

\- Explore;

\- Settings.

Still-valid earlier evidence may be referenced, but later changes require affected re-verification.

**## 14.6 Responsive and accessibility matrix**

The final product is checked at:

\- 390;

\- 760;

\- 1024;

\- 1440;

\- 1920;

\- representative ultrawide, preferably approximately 3440×1440.

Final audit also covers keyboard operation, focus, ARIA/state semantics, touch targets and reduced motion.

**## 14.7 Persistence, providers and offline behavior**

Final release readiness includes:

\- current v4 export;

\- v2/v3/v4 import;

\- rollback/rejected-write behavior;

\- reset semantics;

\- provider-origin local persistence;

\- every intended production provider is `LIVE VERIFIED` unless an explicit provider-specific terminal exception is approved;

\- live -> Add/Save -> reload -> provider unavailable -> local reopen;

\- explicit degraded provider state;

\- no mock result represented as live evidence.

**## 14.8 Runtime, tests and evidence**

After the last implementation fix, the final audit records:

\- current full automated test results;

\- specialized tests required by the repository;

\- browser console/network health;

\- absence of accidental 404s;

\- absence of request storms/stale-response regressions;

\- absence of runaway timer/animation loops, obvious unbounded DOM/runtime growth and inappropriate repeated full-resolution list/card media fetches;

\- disposable test servers/processes are stopped after evidence capture;

\- final evidence integrity, including asset/provider provenance and licensing/attribution consistency;

\- final authority-document consistency;

\- final Git status/diff.

Gate 26 must pass before Phase 13.3 begins.

\---

**# 15. Final documentation rule**

README is finalized only during Phase 13.3 after Gate 26.

If actual delivered implementation differs from this approved scope:

\- document the actual approved delivered behavior;

\- keep unresolved requirements visible in final verification;

\- do not silently rewrite a failed requirement into a weaker success criterion.

A final README release-readiness statement requires Gate 26 PASS plus completed Phase 13.3.