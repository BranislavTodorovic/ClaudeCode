# OneSpace UI Reference Manifest

**Folder:** `docs/ui-reference/`  
**Expected local path:**  
`C:\Users\banek\Documents\Projects\ClaudeCode\claude-code-web-page-practice\docs\ui-reference`

This folder contains the approved visual references for the OneSpace Live Experience Redesign.

These images are **visual authority references**, not loose inspiration.

Do not use composite screenshots themselves as production page backgrounds because they contain interface elements baked into the image.

Production scenes, thumbnails, and motion assets must be created separately.

---


# 0. Mandatory Pixel Inspection Rule

The agent must **open the actual image file** before implementing or accepting its world. Reading this manifest, the filename, a textual summary, or prior notes is not equivalent. Evidence must record at least: composition, dominant depth layers, lighting direction/contrast, scene subject, surface/material character, UI density, hero/portal proportions, and the motion opportunities implied by the still image.

The cinematic implementation must animate the atmosphere of that exact world reference. Generic starfields/space particles or one recycled scene language across all worlds do not satisfy fidelity.


## Shared visual family / world-specific identity

The eight approved references form one coherent OneSpace family: premium warm architectural interiors, layered depth, nature/plants, controlled glass/dark UI surfaces and cinematic practical lighting. Preserve that shared family across the shell. Each world must still derive its own scene subject, props, composition and motion from its corresponding reference. Do not flatten all worlds into a generic space/starfield theme, and do not make them so unrelated that the application loses a coherent OneSpace identity.

# 1. Expected Reference Set

Recommended filenames:

```text
00-home.png
01-work.png
02-personal-fitness.png
03-explore.png
04-games.png
05-movies-series.png
06-projects-notes.png
07-settings.png
```

If existing filenames differ:

1. either rename them to the canonical names above;
2. or update this manifest with the exact real filenames.

Do not silently guess which image belongs to which world.

---


## Canonical repository filenames

The repository authority set uses exactly these eight filenames directly under `docs/ui-reference/`:

| Canonical file | World |
|---|---|
| `00-home.png` | Home |
| `01-work.png` | Work |
| `02-personal-fitness.png` | Personal / Fitness |
| `03-explore.png` | Explore |
| `04-games.png` | Games |
| `05-movies-series.png` | Movies & Series |
| `06-projects-notes.png` | Projects & Notes |
| `07-settings.png` | Settings |

These are the approved visual authorities. Do not introduce duplicate earlier exports, alternate filenames, or an `approved/` subfolder without deliberately updating every authority reference first. Runtime/chat attachment names are not repository paths.

# 2. Reference Meanings

## 00-home.png

Represents:

- Home / primary landing world;
- global visual language;
- hero hierarchy;
- Quick Capture;
- Now;
- Today;
- Next;
- OneSpace Pulse;
- main world portals.

## 01-work.png

Represents:

- Work world;
- Work hero;
- work search/capture;
- work quick actions;
- work summary cards;
- Work portals:
  - Projects;
  - Kanban Board;
  - Team;
  - Documents;
  - Meetings;
  - Templates.

## 02-personal-fitness.png

Represents:

- Personal / Fitness world;
- wellness/fitness atmosphere;
- Personal quick actions;
- wellness summary;
- Personal portals:
  - Mindfulness;
  - Fitness;
  - Nutrition;
  - Recovery;
  - Personal Life;
  - Home Wellbeing.

## 03-explore.png

Represents:

- Explore world;
- destination/travel atmosphere;
- destination search;
- travel filters;
- Featured Destinations;
- Saved Places;
- Upcoming Trips;
- Explore portals:
  - Destinations;
  - Experiences;
  - Travel Guides;
  - Bucket List;
  - Discover More.

## 04-games.png

Represents:

- Games world;
- premium gaming-room atmosphere;
- game search;
- game quick actions;
- Continue Playing;
- game progress/activity;
- Games portals:
  - My Games;
  - Missions & Quests;
  - Game Library;
  - Game Sessions;
  - Discover Games;
  - Game Settings.

## 05-movies-series.png

Represents:

- Movies & Series world;
- premium home-cinema atmosphere;
- media search;
- quick actions;
- Continue Watching;
- Watchlist & Library;
- Featured Tonight;
- genre browsing.

## 06-projects-notes.png

Represents:

- Projects & Notes world;
- creative studio atmosphere;
- project/note search;
- quick actions;
- Project Overview;
- Recent Notes;
- Idea Inbox;
- Pinned Ideas;
- portals:
  - All Projects;
  - Notes & Knowledge;
  - Documents;
  - Idea Inbox;
  - Templates;
  - Archive.

## 07-settings.png

Represents:

- Settings as its own separate main world;
- calm control-focused atmosphere;
- settings search;
- quick categories;
- Your Setup;
- System Health;
- Privacy & Security;
- Account/Profile concept;
- Settings portals:
  - Appearance & Theme;
  - Connected Devices;
  - Notifications;
  - Privacy & Security;
  - Quick Settings;
  - Routines & Automation;
  - System Health;
  - Account/Profile.

---


# 2A. Reference Semantics — What Is Visual vs Functional

The references are authoritative for **composition, hierarchy, atmosphere, proportions and world identity**, but sample labels/data/content do not automatically redefine architecture or create new data sources.

Rules:

- top-navigation differences between images do not create per-page navigation models; use the one canonical route/navigation contract;
- Home's `Media & Games` tile is a visual grouping that must lead to the separate Games and Movies & Series experiences, not a new hidden world;
- `Today` and `AI Assistant` shown in screenshot navigation are shell utility/subview concepts unless separately approved as full worlds;
- branded movie/game artwork, titles, people, dates, weather, health metrics, device counts, account/billing states and travel values are illustrative unless the project has a legitimate local/licensed source;
- do not copy protected/third-party imagery merely to match a screenshot; use existing licensed/local assets or lawful replacements with equivalent compositional role;
- sample counts/statuses are not acceptance values; bind real local/derived/user-entered data or show an honest empty/unavailable/future-disabled state;
- reference fidelity never overrides storage ownership, route compatibility, accessibility, security or data honesty.

# 3. Required Analysis Before Implementing a World

Before coding:

1. open the corresponding image;
2. inspect the complete composition;
3. map global-shell elements;
4. map hero elements;
5. map search/capture;
6. map quick actions;
7. map summary cards;
8. map portals;
9. identify implied submodules;
10. identify dynamic values;
11. classify every dynamic value by real data source;
12. identify values that cannot be copied literally because no real source exists;
13. identify responsive risks;
14. identify accessibility risks;
15. identify motion opportunities;
16. identify reduced-motion fallback;
17. identify static fallback;
18. identify asset requirements;
19. identify navigation/deep-link implications;
20. identify which old functionality is being reused.

Do not code from memory.

---

# 4. Fidelity Rule

References define:

- composition;
- hierarchy;
- atmosphere;
- panel treatment;
- spacing character;
- color character;
- image prominence;
- portal identity;
- world identity.

Implementation should be as faithful as practical while preserving:

- truthful data;
- accessibility;
- responsiveness;
- performance;
- maintainability;
- local-first behavior.

Unexplained visual drift is not acceptable.

---

# 5. Reference Conflict Rule

If two reference images disagree on a global rule:

- do not implement the inconsistency;
- use the canonical architecture/navigation rule;
- document the chosen canonical behavior;
- keep the global shell consistent.

Typical conflicts may include:

- navigation ordering;
- sample data;
- counts;
- weather values;
- profile labels;
- AI Assistant position.

---

# 6. Production Asset Separation

Reference assets:

`docs/ui-reference/`

Production assets should live elsewhere, for example:

```text
assets/scenes/home/
assets/scenes/work/
assets/scenes/personal/
assets/scenes/explore/
assets/scenes/games/
assets/scenes/media/
assets/scenes/projects-notes/
assets/scenes/settings/
```

Reference screenshots must never become the sole production scene asset.

---

# 7. Submodule Rule

Portal cards are not decorative.

A portal shown as part of the approved product must:

- open a real dedicated UI;
- or be explicitly unavailable/future-disabled with a truthful explanation.

Do not ship dead portal cards.

---

# 8. Data Honesty Rule

The reference may contain illustrative values.

Do not copy illustrative values as if live.

Examples:

- weather;
- sleep;
- HRV;
- friends online;
- subscription tier;
- connected devices;
- new releases;
- health/wellness score.

Use:

- real local data;
- real derived data;
- user-entered data;
- approved optional providers;
- or honest unavailable states.

---

# 9. Fidelity Baseline

Primary visual comparison:

- 2048 × 1152.

Then verify:

- 1920;
- 1440;
- 1024;
- 760;
- 390;
- 200% zoom;
- no-hover/touch;
- reduced motion;
- static fallback.

Do not hardcode only for the reference viewport.

---

# Execution linkage

The references are consumed in checklist order, not ad hoc: R2 opens/analyzes Home first; R3 opens/analyzes Work, Personal/Fitness, Explore, Games, Movies & Series, Projects & Notes and Settings one at a time; R4/R5 reuse the relevant parent-world image while building nested submodule UIs. R0 only inventories/inspects all eight references and does not implement the redesign.
