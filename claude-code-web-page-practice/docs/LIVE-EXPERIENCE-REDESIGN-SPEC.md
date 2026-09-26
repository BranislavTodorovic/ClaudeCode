# OneSpace — Live Experience Redesign & Expansion Specification

**Status:** APPROVED POST-GATE-12 REDESIGN SPECIFICATION  
**Activation:** Immediately after Gate 12 passes and the R0 Redesign Integration Gate is completed.  
**Purpose:** Define the approved redesign, hierarchical UI architecture, exact visual direction, submodule expansion rules, implementation order, verification gates, and failure handling for the next OneSpace expansion.

---

# 0. How This Specification Must Be Used

This specification does **not** replace the existing OneSpace implementation history.

The agent must:

1. resume from the current first unresolved Phase 12 item (currently item 347);
2. finish the remaining Phase 12 audit in order and pass Gate 12;
3. execute `docs/REDESIGN-INTEGRATION-GATE.md` as R0;
4. establish the protected pre-redesign baseline and classify every remaining legacy requirement;
5. activate this redesign after Gate R0;
6. continue remaining legacy Phase 14–25 obligations only through their R0 classifications;
7. finish Phase 26 -> Gate 26 -> Phase 13.3 FINAL.

Previously VERIFIED work must not be retroactively rewritten unless a real defect or incompatibility is discovered.

The redesign is an expansion of the existing OneSpace product, not a separate throwaway implementation.

---

# 1. What This Redesign Actually Is

The approved direction is not merely a visual refresh.

It is a:

- product redesign;
- information-architecture expansion;
- navigation redesign;
- visual-system redesign;
- motion-system expansion;
- hierarchical module expansion;
- functionality expansion.

The product is organized into four UI levels.

## Level 1 — Global OneSpace Shell

Shared across the application:

- OneSpace identity;
- global navigation;
- global search / command access;
- notifications;
- profile;
- global design tokens;
- common glass/surface system;
- shared motion language;
- common accessibility rules;
- common responsive rules.

## Level 2 — Main Worlds

The **eight approved reference-led main worlds** are:

- Home;
- Work;
- Personal / Fitness;
- Explore;
- Games;
- Movies & Series;
- Projects & Notes;
- Settings.

These eight require dedicated full-page redesigned UI and reference-led cinematic acceptance.

`Today` and `AI Assistant / Command` are **shell utility/subview surfaces**, not additional reference-led cinematic worlds unless separately approved with their own requirements/reference. Existing compatibility domains/routes such as Shortcuts, Productivity, Notes and the legacy Projects alias must remain functional and reachable, but R0 decides whether they stay dedicated routes, become subviews/portals, or redirect compatibly. No ninth/tenth cinematic world may be invented from the concept-image navigation alone.

## Level 3 — Subspaces / Submodules

Major portal cards shown inside a world are not decorative placeholders.

Each major portal represents a real sub-experience and must open a dedicated UI surface.

Examples:

- Work → Projects, Kanban Board, Team, Documents, Meetings, Templates;
- Personal / Fitness → Mindfulness, Fitness, Nutrition, Recovery, Personal Life, Home Wellbeing;
- Explore → Destinations, Experiences, Travel Guides, Bucket List, Discover More;
- Games → My Games, Missions & Quests, Game Library, Game Sessions, Discover Games, Game Settings;
- Projects & Notes → All Projects, Notes & Knowledge, Documents, Idea Inbox, Templates, Archive;
- Settings → Appearance & Theme, Connected Devices, Notifications, Privacy & Security, Quick Settings, Routines & Automation, System Health, Account/Profile.

## Level 4 — Detail and Task Surfaces

Where a submodule contains meaningful objects or workflows, it must also provide appropriate detail/edit/task surfaces.

Examples:

- Project detail;
- Kanban card detail;
- Game detail;
- Movie/series detail;
- Destination detail;
- Trip detail;
- Exercise detail;
- Workout session;
- Note editor;
- Document detail;
- Template detail;
- Settings detail forms.

The redesign must therefore be implemented as a real application hierarchy, not as a set of attractive landing pages.

---


## Shared visual family / world-specific identity

The eight approved references form one coherent OneSpace family: premium warm architectural interiors, layered depth, nature/plants, controlled glass/dark UI surfaces and cinematic practical lighting. Preserve that shared family across the shell. Each world must still derive its own scene subject, props, composition and motion from its corresponding reference. Do not flatten all worlds into a generic space/starfield theme, and do not make them so unrelated that the application loses a coherent OneSpace identity.

The shared cinematic lifecycle is **`ENTRY / WAKE-UP -> SETTLE -> AMBIENT / ALIVE -> EXIT / RESET`**. In Full mode a genuine world entry should visibly evolve for approximately 2–5 seconds without delaying interaction, settle into restrained reference-derived ambient motion, and reset cleanly on exit. Subtle, Off and `prefers-reduced-motion` must remain distinct and testable.

# 2. Approved Visual References

The supplied images should be stored in the repository under a stable folder such as:

```text
docs/ui-reference/
    00-home.png
    01-work.png
    02-personal-fitness.png
    03-explore.png
    04-games.png
    05-movies-series.png
    06-projects-notes.png
    07-settings.png
```

These images are **approved main-world visual targets**.

Before implementing a world, the agent must inspect:

1. the corresponding approved reference image;
2. this specification;
3. the current design-system document;
4. the architecture document;
5. the verification requirements.

The images define the intended:

- layout hierarchy;
- world identity;
- composition;
- panel style;
- typography hierarchy;
- background treatment;
- image prominence;
- portal-card structure;
- quick-action structure;
- information density;
- visual atmosphere;
- accent behavior;
- cinematic quality.

They are not loose inspiration.

The implementation should reproduce the approved composition and visual intent as faithfully as practical while remaining:

- functional;
- responsive;
- accessible;
- performant;
- maintainable;
- truthful about its data.

---

# 3. Important Reference Conflict Rule

The generated concept images contain small inconsistencies in global navigation ordering.

The agent must **not** copy those inconsistencies page by page.

A canonical global navigation rule must be implemented.

The screenshots' nav labels/order are compositional examples, not an instruction to create different navigation per page. R0 architecture must choose one canonical shell navigation that exposes the eight main worlds plus any approved utility access (`Today`, local Command/Assistant, Shortcuts/Productivity compatibility) without overflow or contradictory ordering.

The chosen navigation must be documented once and applied consistently everywhere.

If a better canonical order is chosen during architecture work, it must be:

- documented once;
- applied consistently everywhere;
- verified across every main world.

Do not preserve contradictory tab ordering merely because different concept images happened to place the contextual tab differently.

---

# 4. Approved Desktop Fidelity Viewport

Use **2048 × 1152** as the initial visual-fidelity reference viewport.

Implementation order:

1. achieve high fidelity at 2048 × 1152;
2. then adapt structurally to 1920;
3. 1440;
4. 1024;
5. 760;
6. 390;
7. test 200% browser zoom;
8. test reduced motion;
9. test static fallback.

Do not hardcode the application exclusively for 2048 × 1152.

The reference viewport is a visual baseline, not the only supported viewport.

---

# 5. Global Shell

Every main world should preserve a common OneSpace shell.

## 5.1 Brand Area

Top-left:

- OneSpace logo;
- OneSpace name;
- contextual descriptor such as `Live Experience Vision`, `Games`, or `Movies & Series`;
- short supporting statement where appropriate.

The brand must remain recognizable across every world.

## 5.2 Global Navigation

The screenshots show a compact conceptual nav, not a complete route contract. The implemented shell must use **one canonical navigation model** that exposes the eight approved main worlds without contradictory per-page ordering or overflow. `Today` and local `AI Assistant / Command` are utility/subview access points unless separately approved as full worlds. Existing Shortcuts/Productivity/Notes/Projects compatibility access must remain reachable according to R0.

The active main world or active parent world for a subview must be visually obvious.

## 5.3 Global Utility Area

Top-right:

- Search;
- Notifications;
- Profile/avatar.

These controls must remain consistent across worlds.

## 5.4 Date / Context Strip

The references include:

- date;
- weather icon;
- temperature;
- weather state.

The **layout** is approved.

The **data must be truthful**.

If no weather provider is configured:

- do not fabricate live weather;
- either hide weather details;
- show a neutral unavailable/offline state;
- or use an explicitly configured optional provider.

Local date/time may be shown from the browser/system.

## 5.5 World Hero

Every world includes:

- a large contextual headline;
- highlighted user name/accent phrase;
- short world-specific subtitle.

Examples from the approved direction:

- Home: `Good morning, Alex`
- Work: `Build with intention, Alex.`
- Personal / Fitness: `A calmer, stronger you, Alex.`
- Explore: `Explore a brighter world.`
- Games: `Game on, Alex.`
- Movies & Series: `Set the evening scene, Alex.`
- Projects & Notes: `Turn ideas into reality, Alex.`
- Settings: `Make this space yours, Alex.`

Dynamic wording may vary later, but the visual hierarchy must remain faithful to the approved composition.

## 5.6 Context Search / Capture Bar

Each world includes a prominent wide search/capture control.

Its placeholder must be contextual.

Examples:

- Home: capture a thought/task/anything;
- Work: capture/search work;
- Personal: find workout, meditation, recipe, routine;
- Explore: where do you want to go next?;
- Games: search games, friends, guides, or local supported content;
- Movies & Series: search movies, series, genres, supported local catalogue;
- Projects & Notes: search projects, notes, ideas;
- Settings: search settings, supported devices, preferences.

The control should include command-shortcut affordance such as `Ctrl + K` where appropriate.

## 5.7 Quick Action Chips

Directly below the search/capture bar.

These are real actions or routes, not decorative text.

Every quick action requires:

- action definition;
- keyboard/focus behavior;
- success state;
- failure/empty behavior;
- correct destination or modal;
- reload-safe result where it changes data.

---

# 6. Component Taxonomy

To prevent ambiguity, every visual object in the references must be classified.

## 6.1 Summary Card

Displays a concise status/overview on a world landing page.

It may link to a detail/submodule but does not necessarily represent a separate world.

Examples:

- My Tasks;
- Today's Schedule;
- Project Progress;
- Today's Wellness;
- Saved Places;
- Continue Playing;
- Project Overview.

## 6.2 Portal Card

Represents a real submodule.

A portal card **must** open a dedicated UI surface.

Examples:

- Work → Kanban Board;
- Personal → Nutrition;
- Explore → Destinations;
- Games → Game Library;
- Projects & Notes → Idea Inbox;
- Settings → Privacy & Security.

## 6.3 Quick Action

Triggers:

- create;
- start;
- open;
- capture;
- filter;
- schedule;
- navigate.

It must not be a dead button.

## 6.4 Detail Surface

A dedicated page/panel/modal for a selected object.

Examples:

- project;
- task;
- destination;
- game;
- movie;
- workout;
- note.

## 6.5 Filter / Segment Control

Examples:

- Today / This Week / All;
- genre filters;
- dates;
- interests;
- budget;
- travel style.

Selected/unselected/focus states must be implemented.

---

# 6A. Domain Ownership and Compatibility Rule

The redesign may reorganize presentation, but it must not create duplicate owners for existing data.

- Work remains the owner of professional Work/Projects lifecycle data. The legacy `Projects` route/alias must continue to resolve safely into that Work-owned experience unless an explicit migration is approved.
- Notes remains the owner of existing note records. `Projects & Notes -> Notes & Knowledge` may present/use those records through the canonical Notes APIs/storage contract; it must not fork a second competing notes store.
- Productivity remains owner of generic tasks/timers/countdowns that were previously removed from Work. A redesigned world may link or summarize them without taking ownership.
- Shortcuts remains owner of shortcut records/settings. Home/other worlds may launch or summarize them without duplicating storage.
- `Projects & Notes` is therefore a redesigned portal/aggregation/creation surface over canonical owners unless a new record type is explicitly introduced with a documented schema/migration.
- Home remains an aggregator and owns no foreign-domain records.

The Home reference's `Media & Games` portal is a **visual grouping**, not a new canonical world or storage domain. It must expose real access to the separate `Games` and `Movies & Series` worlds (for example a split action, chooser, or equivalent accessible interaction) without creating a dead card or a third media domain.

# 7. Navigation and Route Contract

The application should support hierarchical navigation.

A route/hash/state model should be defined before implementation.

Recommended conceptual map:

```text
/home
# Today is a Home/shell subview or utility state unless a dedicated route is retained by architecture.
/today   (optional compatibility/subview route, not a ninth reference-led world)

/work
/work/projects
/work/kanban
/work/team
/work/documents
/work/meetings
/work/templates

/personal
/personal/mindfulness
/personal/fitness
/personal/nutrition
/personal/recovery
/personal/life
/personal/home-wellbeing

/explore
/explore/destinations
/explore/experiences
/explore/guides
/explore/bucket-list
/explore/discover-more

/games
/games/my-games
/games/missions
/games/library
/games/sessions
/games/discover
/games/settings

/movies                    # preserve existing canonical/compatibility route
/movies/continue
/movies/library
/movies/genres
/movies/new-releases
/movies/recommendations
/movies/title/:id
# `/media` may exist only as a documented alias if architecture chooses it; it must not replace/break `movies` silently.

/projects-notes
/projects-notes/projects
/projects-notes/notes
/projects-notes/documents
/projects-notes/idea-inbox
/projects-notes/templates
/projects-notes/archive

/settings
/settings/appearance
/settings/devices
/settings/notifications
/settings/privacy
/settings/quick-settings
/settings/automation
/settings/system-health
/settings/account

/assistant   # optional local command/assistant utility surface; not a ninth reference-led world

# Existing compatibility routes (Shortcuts, Productivity, Notes, Projects alias) remain reachable/redirect safely according to R0.
```

Exact technical routing may use hash/state rather than server routes.

Required behavior:

- browser Back works;
- browser Forward works;
- reload preserves the current valid route;
- direct/deep-link entry resolves correctly;
- unknown route has a safe fallback;
- deleted target does not create a broken page;
- active main-world navigation remains correct while inside a submodule;
- returning to the parent world restores sensible state.

---

# 8. Data-Source Integrity Rule

The references contain visual concepts that imply data which may not currently exist.

No UI may fabricate live data merely to look like the concept image.

Every card/metric/action must declare a source category:

```text
LOCAL_CORE
LOCAL_DERIVED
USER_ENTERED
OPTIONAL_PROVIDER
FUTURE_DISABLED
```

## 8.1 LOCAL_CORE

Existing/local application data.

Examples:

- tasks;
- projects;
- notes;
- routines;
- local catalogue;
- saved destinations;
- local workout definitions.

## 8.2 LOCAL_DERIVED

Computed from real local data.

Examples:

- project progress;
- task completion percentage;
- OneSpace Pulse;
- weekly activity summaries.

Derived metrics require documented formulas.

## 8.3 USER_ENTERED

Data entered manually by the user.

Examples:

- fitness preferences;
- nutrition logs;
- sleep/recovery notes;
- custom destinations;
- personal routines.

## 8.4 OPTIONAL_PROVIDER

Only available when a real optional integration exists.

Potential examples:

- live weather;
- health-device metrics;
- online friends/presence;
- smart-home devices;
- cloud account status.

The absence of a provider must not break the UI.

## 8.5 FUTURE_DISABLED

A visual route may exist in the product plan but must show an honest unavailable/not-configured state until a real implementation exists.

The concrete values/content visible in the supplied concept screenshots are **illustrative unless backed by a legitimate canonical source**. Visual fidelity does not authorize fabricated data.

Never display fake:

- HRV;
- sleep quality;
- friends online;
- live weather;
- billing state;
- connected-home devices;
- remote account tier;
- global new releases.

---

# 9. Local-First Compatibility Rules for Reference Features

Several reference concepts require explicit treatment.

## 9.1 AI Assistant

The product remains local-first and credential-free by default.

Unless a real approved AI provider is added:

- the AI Assistant entry should use a local command/assistant surface;
- it may search/navigate/create based on local OneSpace data;
- it must not pretend to be a generative remote AI;
- remote model use requires explicit approval and a separate security/credential gate.

## 9.2 Weather

The visual position may remain.

Without a configured provider:

- show date only;
- show a neutral offline/unavailable weather state;
- or hide the weather details.

Do not invent live weather.

## 9.3 Health & Recovery Metrics

Values such as HRV, sleep quality, steps, calories, or stress require a real source.

Allowed sources:

- manual entry;
- approved imported data;
- approved optional health integration.

Do not fabricate physiological metrics.

## 9.4 Account / Billing / Premium

If OneSpace has no real account/billing system:

- do not show false subscription status;
- replace with local profile / storage / backup controls where appropriate;
- or mark the account/billing surface as future-disabled.

## 9.5 Friends / Online Presence

If no online social system exists:

- use local contacts/session planning only;
- hide online-presence metrics;
- or mark the feature future-disabled.

## 9.6 Movies / Games / Explore Catalogues

By default:

- use bundled/local catalogue data;
- preserve credential-free operation;
- clearly handle unavailable catalogue fields;
- do not silently add TMDB, RAWG, or other external providers.

---

# 10. Home — Approved World Specification

Reference: `docs/ui-reference/00-home.png`

## 10.1 Scene

Warm premium living space combined with a large cinematic exterior/futuristic landscape.

The environment should feel:

- aspirational;
- calm;
- premium;
- spacious;
- alive.

The scene occupies the full page background.

## 10.2 Hero

Required hierarchy:

- date/context strip;
- greeting;
- subtitle;
- large capture bar;
- quick-action chips.

## 10.3 Quick Actions

Approved direction:

- Plan my day;
- Brainstorm ideas;
- Track my progress;
- Find a place to visit.

Each must become a real action/route.

## 10.4 Main Summary Row

Required:

### Now

- current focus/activity;
- timer/progress;
- current media/ambience or activity context;
- action arrow.

### Today

- current-day items;
- add action;
- times/status.

### Next

- upcoming items;
- date labels.

### OneSpace Pulse

- visual waveform/progress;
- transparent derived local metrics;
- no unexplained psychological scoring.

## 10.5 Main Portals

Required:

- Work;
- Personal / Fitness;
- Discover;
- Media & Games;
- Projects & Notes;
- Settings.

Work, Personal/Fitness, Discover/Explore, Projects & Notes and Settings open their corresponding full worlds. The reference's **Media & Games** portal is a visual grouping, not a ninth world: it must provide clear access to the separate Games and Movies & Series worlds (for example chooser/split actions) without creating duplicate media ownership.

---

# 11. Work — Approved World Specification

Reference: `docs/ui-reference/01-work.png`

## 11.1 Scene

Premium modern workspace with:

- multiple monitors;
- plants;
- warm architectural lighting;
- large window / city or cinematic exterior;
- focused dark foreground;
- blue/cyan UI accents.

Mood:

> Focus. Create. Ship.

## 11.2 Hero

Approved direction:

`Build with intention, Alex.`

Supporting idea:

`Focus today. Create tomorrow.`

## 11.3 Quick Actions

Required:

- New task;
- New project;
- Open board;
- Meeting notes;
- Focus session.

## 11.4 Main Summary Cards

### My Tasks

Must support:

- Today;
- This Week;
- All;
- completion state;
- open task/detail.

### Today's Schedule

Must support local schedule items.

Do not imply external calendar sync unless a provider is approved.

### Project Progress

Derived from real project/task state.

### Focus & Productivity

May show:

- focus timer;
- active ambience;
- real local focus history;
- task completion;
- locally derived flow indicator.

## 11.5 Work Portals

Required:

- Projects;
- Kanban Board;
- Team;
- Documents;
- Meetings;
- Templates.

Each must open a dedicated submodule UI.

---

# 12. Work Submodules

## 12.1 Projects

Dedicated UI should support:

- project list/grid;
- search;
- filters;
- status;
- progress;
- create project;
- open project;
- project detail;
- project tasks;
- project notes;
- timeline/history where supported;
- archive/delete with safe destructive behavior.

States:

- empty;
- populated;
- archived;
- invalid/deleted target;
- large dataset.

## 12.2 Kanban Board

Dedicated UI should support:

- board selector;
- columns;
- cards;
- create card;
- edit card;
- move/reorder;
- filters;
- keyboard alternative to drag;
- persistence;
- card detail;
- empty board;
- invalid stored order;
- reload.

## 12.3 Team

Local-first minimum:

- manually maintained people/team directory;
- role;
- notes;
- project association;
- meeting association.

Online presence must not be fabricated.

Future external collaboration may be added only through an approved provider.

## 12.4 Documents

Dedicated UI should support local OneSpace documents/knowledge records:

- list/grid;
- search;
- type/category;
- create;
- open;
- edit;
- safe text rendering;
- archive/delete;
- project association.

## 12.5 Meetings

Local-first meeting workspace:

- meetings list;
- meeting detail;
- agenda;
- notes;
- action items;
- participants;
- project link.

External calendar sync is optional and must not be assumed.

## 12.6 Templates

Local template library:

- project templates;
- task templates;
- meeting templates;
- note/document templates;
- preview;
- duplicate/use template;
- user-created template;
- safe delete.

---

# 13. Personal / Fitness — Approved World Specification

Reference: `docs/ui-reference/02-personal-fitness.png`

## 13.1 Scene

Warm wellness/fitness environment with:

- natural light;
- plants;
- workout equipment;
- calming interior;
- city/nature view;
- restorative atmosphere.

## 13.2 Hero

Approved direction:

`A calmer, stronger you, Alex.`

## 13.3 Quick Actions

Required:

- Start a workout;
- Meditate now;
- Log a meal;
- Plan my day;
- Track a habit.

## 13.4 Main Summary Cards

### Today's Wellness

Any overall score must have a documented local formula.

If a valid formula is not defined, use component progress without an arbitrary total score.

### Today's Plan

May include:

- meditation;
- workout;
- meal;
- focus block;
- wind-down routine.

### Habits & Goals

Real local completion state.

### Health & Recovery

Only show metrics for which real data exists.

No fabricated HRV/sleep/stress values.

## 13.5 Personal Portals

Required:

- Mindfulness;
- Fitness;
- Nutrition;
- Recovery;
- Personal Life;
- Home Wellbeing.

---

# 14. Personal Submodules

## 14.1 Mindfulness

UI should support:

- session library;
- local guided content where available;
- timers;
- favorites;
- history;
- routines;
- reduced-motion-friendly presentation.

## 14.2 Fitness

UI should support:

- profile/preferences;
- goals;
- level;
- training style;
- equipment;
- workout builder;
- exercise library;
- active workout;
- workout history;
- progress based on real local activity.

## 14.3 Nutrition

Local-first minimum:

- meal log;
- meal types;
- notes;
- user-defined goals;
- optional local recipe library.

Do not present medical/dietary diagnosis or unsupported physiological claims.

## 14.4 Recovery

May support:

- manual sleep/recovery logging;
- rest routine;
- recovery activities;
- user-entered observations;
- optional imported provider data.

## 14.5 Personal Life

May combine:

- personal routines;
- personal tasks;
- goals;
- reminders;
- personal notes;
- life planning.

## 14.6 Home Wellbeing

Local-first use:

- home routines;
- environment preferences;
- personal home checklist;
- wellbeing spaces.

Smart-home control requires a real provider and must not be fabricated.

---

# 15. Explore — Approved World Specification

Reference: `docs/ui-reference/03-explore.png`

## 15.1 Scene

Travel-library / premium exploration environment with:

- maps;
- books;
- camera;
- globe;
- destination view;
- warm golden light;
- cinematic exterior.

## 15.2 Hero

Approved direction:

`Explore a brighter world.`

## 15.3 Search / Filters

Approved controls:

- Destinations;
- Experiences;
- Travel Dates;
- Interests;
- Budget;
- Travel Style.

## 15.4 Main Summary

Required:

- Featured Destinations;
- Saved Places;
- Upcoming Trips.

All data must come from local/bundled/saved content unless an approved provider exists.

## 15.5 Explore Portals

Required:

- Destinations;
- Experiences;
- Travel Guides;
- Bucket List;
- Discover More.

---

# 16. Explore Submodules

## 16.1 Destinations

- browse;
- search;
- filters;
- destination cards;
- destination detail;
- save/unsave;
- notes;
- local imagery attribution;
- fallback imagery.

## 16.2 Experiences

- browse activity/experience types;
- save;
- link to destination;
- local descriptions;
- filters.

## 16.3 Travel Guides

- local guides;
- destination association;
- itinerary ideas;
- tips;
- source attribution where required.

## 16.4 Bucket List

- add;
- reorder;
- mark planned/completed;
- destination/experience linking;
- notes;
- persistence.

## 16.5 Discover More

Curated local discovery surface using supported catalogue data.

---

# 17. Games — Approved World Specification

Reference: `docs/ui-reference/04-games.png`

## 17.1 Scene

Premium gaming room with:

- gaming display;
- controllers;
- PC/console atmosphere;
- warm interior;
- cinematic exterior;
- restrained RGB/cyan/violet accents.

## 17.2 Hero

Approved direction:

`Game on, Alex.`

## 17.3 Quick Actions

Approved direction:

- Launch/Open game;
- View library;
- Track progress;
- Discover games;
- Find friends / sessions.

If direct game launching is not technically supported, use a truthful action such as opening the game detail or configured external link.

## 17.4 Main Summary

Required:

- Continue Playing;
- Today's Gaming;
- Game Progress;
- Gaming Pulse.

Friends-online metrics require a real source and must not be fabricated.

## 17.5 Game Portals

Required:

- My Games;
- Missions & Quests;
- Game Library;
- Game Sessions;
- Discover Games;
- Game Settings.

---

# 18. Games Submodules

## 18.1 My Games

- owned/saved games;
- progress;
- status;
- favorite;
- last played;
- notes.

## 18.2 Missions & Quests

- local quest/task tracker associated with games;
- status;
- priority;
- completion;
- notes.

## 18.3 Game Library

- bundled/local catalogue;
- filters;
- genres;
- platform metadata where available;
- detail page.

## 18.4 Game Sessions

- planned sessions;
- local friends/participants;
- date/time;
- notes;
- history.

Online multiplayer presence is optional-provider-only.

## 18.5 Discover Games

Local recommendations/discovery from bundled catalogue and user preferences.

No RAWG dependency unless explicitly approved.

## 18.6 Game Settings

Game-module preferences only.

Global application Settings remain a separate world.

---

# 19. Movies & Series — Approved World Specification

Reference: `docs/ui-reference/05-movies-series.png`

## 19.1 Scene

Premium home cinema environment with:

- large display;
- warm ambient lighting;
- cinematic memorabilia;
- comfortable seating;
- evening atmosphere.

## 19.2 Hero

Approved direction:

`Set the evening scene, Alex.`

## 19.3 Quick Actions

Required:

- Browse genres;
- My watchlist;
- Continue watching;
- New releases;
- Recommendations.

`New releases` must only use supported local data unless an approved provider exists.

## 19.4 Main Summary

Required:

- Continue Watching;
- Watchlist & Library;
- Featured Tonight.

## 19.5 Genre Surface

Approved genres shown in the reference include:

- Action;
- Drama;
- Sci-Fi;
- Fantasy;
- Thriller;
- Romance;
- Comedy;
- Documentary;
- Animation.

Genre cards are real filters/routes.

---

# 20. Movies & Series Submodules

Required dedicated surfaces:

## 20.1 Continue Watching

- progress;
- resume;
- remove from continue;
- detail route.

## 20.2 Watchlist & Library

- saved titles;
- watched/unwatched;
- search/filter;
- favorites;
- detail route.

## 20.3 Browse by Genre

- genre landing;
- local catalogue results;
- filter/sort.

## 20.4 New Releases

Local/bundled data only unless an approved provider exists.

Must not pretend catalogue data is live.

## 20.5 Recommendations

Deterministic local recommendations are acceptable.

Recommendation rules must be explainable.

## 20.6 Title Detail

- title;
- type;
- metadata;
- description;
- progress;
- watchlist state;
- notes/tags;
- local imagery/fallback.

---

# 21. Projects & Notes — Approved World Specification

Reference: `docs/ui-reference/06-projects-notes.png`

## 21.1 Scene

Creative studio environment with:

- planning wall;
- notes;
- sketches;
- laptop;
- plants;
- warm focused lighting;
- creative-work atmosphere.

## 21.2 Hero

Approved direction:

`Turn ideas into reality, Alex.`

## 21.3 Quick Actions

Required:

- New project;
- New note;
- New document;
- Capture idea;
- Use template.

## 21.4 Main Summary

Required:

- Project Overview;
- Recent Notes;
- Idea Inbox;
- Pinned Ideas.

## 21.5 Portals

Required:

- All Projects;
- Notes & Knowledge;
- Documents;
- Idea Inbox;
- Templates;
- Archive.

---

# 22. Projects & Notes Submodules

## 22.1 All Projects

Use shared project system where appropriate.

## 22.2 Notes & Knowledge

- notes list;
- search;
- tags/categories;
- editor;
- safe rendering;
- pin/favorite;
- associations.

## 22.3 Documents

- document list;
- editor/view;
- categories;
- project links.

## 22.4 Idea Inbox

- quick capture;
- categorize;
- promote idea into project/note/task;
- archive/delete;
- pin.

## 22.5 Templates

- project/note/document templates;
- preview;
- use;
- duplicate;
- custom template.

## 22.6 Archive

- archived projects;
- archived notes;
- archived ideas;
- restore;
- permanent delete with confirmation.

---

# 23. Settings — Approved World Specification

Reference: `docs/ui-reference/07-settings.png`

Settings is a separate world.

It must **not** be visually merged with Projects & Notes.

## 23.1 Scene

Calm premium control environment with:

- warm interior;
- fireplace / architectural lighting;
- clean surfaces;
- lower motion intensity;
- stronger sense of control and stability.

## 23.2 Hero

Approved direction:

`Make this space yours, Alex.`

## 23.3 Quick Categories

Approved:

- Appearance;
- Devices;
- Privacy;
- Notifications.

## 23.4 Main Summary

Reference concepts:

- Your Setup;
- System Health;
- Privacy & Security;
- OneSpace Account.

These must remain truthful to real functionality.

## 23.5 Settings Portals

Required:

- Appearance & Theme;
- Connected Devices;
- Notifications;
- Privacy & Security;
- Quick Settings;
- Routines & Automation;
- System Health;
- Account/Profile.

If billing does not exist, do not invent a billing system merely to match the image.

---

# 24. Settings Submodules

## 24.1 Appearance & Theme

- theme;
- palette;
- density;
- motion level;
- background/scene preference;
- language where appropriate.

## 24.2 Connected Devices

Only show real configured/supported devices.

Otherwise show a truthful empty/not-configured state.

## 24.3 Notifications

- local notification preferences;
- reminder preferences;
- quiet behavior where supported.

## 24.4 Privacy & Security

- local data controls;
- import/export;
- permissions explanations;
- secrets/provider status where appropriate;
- safe reset actions.

## 24.5 Quick Settings

Fast access to commonly used preferences.

## 24.6 Routines & Automation

Local routines/automation rules supported by OneSpace.

Do not imply unsupported external home automation.

## 24.7 System Health

Use real app-level health indicators such as:

- storage availability;
- local data integrity;
- scene fallback state;
- optional provider status;
- app version;
- backup state.

Do not fabricate smart-home/network health.

## 24.8 Account / Profile

If no cloud account exists:

- local profile;
- name/avatar;
- backup/export;
- personalization profile.

Do not show fake Premium/Billing state.

---

# 25. Shared Submodule UI Requirements

Every dedicated submodule page must include an appropriate subset of:

- parent-world identity;
- active submodule state;
- breadcrumb/back route where useful;
- page heading;
- contextual search/filter;
- create/add action where relevant;
- summary/overview;
- content list/grid/board;
- detail open behavior;
- empty state;
- invalid state;
- loading/poster state where relevant;
- error state;
- keyboard navigation;
- responsive layout;
- persistence;
- reload/deep-link behavior.

A portal is not VERIFIED until the dedicated target UI exists and works.

---

# 26. Visual Asset Reconstruction

The approved screenshots are composite concept images containing UI and scenery together.

They must not be used as the actual full-page background because the UI text is baked into the image.

For each world create clean scene assets that reproduce the approved visual direction without baked-in interface elements.

Required asset families per world:

```text
world-poster-desktop
world-motion-desktop
world-poster-tablet
world-poster-mobile
world-portal-thumbnail
world-fallback
```

Where motion is layered:

```text
background
midground
foreground
light/fog/atmosphere
optional motion overlay
```

Portal thumbnails should visually belong to the same scene family as the full world.

---

# 27. Visual Fidelity Requirements

At the approved 2048 × 1152 reference viewport, compare:

- element order;
- horizontal/vertical region placement;
- hero proportion;
- navigation position;
- search-bar width;
- quick-chip position;
- summary-card proportions;
- portal-row proportions;
- spacing;
- typography hierarchy;
- corner radii;
- translucency;
- panel opacity;
- blur;
- border/glow intensity;
- image crops;
- accent hierarchy.

Do not require literal pixel identity when doing so would break real text, accessibility, or responsiveness.

However, unexplained visual drift is not acceptable.

---

# 28. Motion Requirements

Motion is added **after static fidelity is accepted**.

## 28.1 Ambient Motion

Examples:

- slow natural light movement;
- subtle plant/scene movement;
- water/reflection motion;
- distant environmental movement;
- soft glow breathing.

## 28.2 Interaction Motion

- hover lift;
- focus glow;
- button press;
- portal depth;
- row completion;
- card reordering.

## 28.3 Context Transition

Moving between worlds should feel like changing environments inside the same OneSpace shell.

## 28.4 Reduced Motion

Must:

- disable/reduce parallax;
- simplify scene transitions;
- stop decorative loops;
- preserve essential state feedback.

## 28.5 No-Hover / Touch

No functionality may depend on pointer hover.

---

# 29. Canonical Redesign Execution Order

The execution authority is `docs/IMPLEMENTATION-STEPS.md`. This specification uses the same sequence and must not create a parallel A–P execution plan.

## R0 — Redesign Integration Gate
After Gate 12, R0 performs repository recovery, baseline protection, conflict reconciliation and classification of every remaining Phase 14–25 requirement. **R0 does not implement redesign UI.** It finishes with an exact R1–R6 handoff.

## R1 — Architecture Lock + Shared Foundation
Confirm canonical shell/navigation, eight-world registry, compatibility surfaces, submodule/detail routing, data ownership, scene/asset contracts, failure boundaries and shared visual/responsive/accessibility primitives. Reconstruct clean production scene assets separately from the composite references.

## R2 — Home Fidelity Checkpoint
Open/analyze `00-home.png`, build static structure and real data bindings, achieve 2048×1152 static fidelity, adapt all required widths/zoom/accessibility, then add/verify reference-derived cinematic motion. Do not scale the redesign to other worlds until Home passes.

## R3 — Main Worlds
Implement one at a time: Work -> Personal/Fitness -> Explore -> Games -> Movies & Series -> Projects & Notes -> Settings. Every world follows actual-image inspection -> UI/action/data inventory -> conflict resolution -> static structure -> real behavior -> static fidelity -> responsive/accessibility -> motion -> fallbacks/navigation -> regression/evidence -> VERIFIED.

## R4 — Nested UI Pilot
Implement `Work -> Projects` end-to-end as the first complete world -> submodule -> detail/create/edit pattern. Do not mass-produce submodules before this pilot passes.

## R5 — Submodule Families
Roll out dedicated submodule UIs family by family in the order recorded in the checklist. Each portal must open a real target UI; each meaningful object/workflow must expose appropriate Level-4 detail/task surfaces.

## R6 — Cross-World Integration + Redesign Regression
Integrate/reverify shared systems and compatibility surfaces, then run redesign-wide responsive/accessibility/motion/offline/security/persistence/navigation/performance/data-integrity regression, including deterministic-time, first-run, large-data, multi-tab, corrupt-state/import, listener/RAF/timer cleanup, memory/CPU growth and console/unhandled-rejection checks.

Only after Gate R6 may historical Phase 14–25 obligations continue through the R0 classification record. Phase 26, Gate 26 and Phase 13.3 remain the final whole-project tail.

---

# 30. Dedicated UI Workflow for Every Submodule

Every submodule follows this exact sequence.

1. inspect parent world reference and requirements;
2. define user purpose;
3. define route;
4. define data contract;
5. define create/read/update/delete capability where relevant;
6. define summary/list/grid/board form;
7. define detail view;
8. define empty state;
9. define invalid/orphan state;
10. define destructive actions;
11. implement static UI;
12. implement functionality;
13. verify persistence;
14. verify reload;
15. verify back/forward;
16. verify direct route;
17. verify keyboard;
18. verify touch;
19. verify responsive widths;
20. verify long text/localization;
21. apply world visual DNA;
22. apply restrained motion;
23. verify reduced motion;
24. verify failure fallback;
25. run adjacent regression;
26. capture evidence;
27. mark VERIFIED.

Do not skip directly from portal card to a partially functional placeholder.

---

# 31. Navigation Test Cases

Mandatory:

- Home → world;
- world → submodule;
- submodule → detail;
- detail → back;
- browser Back;
- browser Forward;
- refresh at world;
- refresh at submodule;
- refresh at detail;
- direct-link valid route;
- direct-link invalid route;
- deleted detail target;
- disabled module route;
- active top-level tab while inside submodule;
- command palette navigation;
- portal navigation;
- quick-action navigation.

---

# 32. State and Persistence Test Cases

For every mutable submodule where relevant:

- create;
- edit;
- save;
- cancel;
- delete;
- archive;
- restore;
- reorder;
- complete;
- reopen;
- reload;
- second session;
- multi-tab update;
- invalid stored state;
- storage quota failure.

---

# 33. Visual Test Matrix

Primary fidelity:

- 2048 × 1152.

Responsive:

- 1920;
- 1440;
- 1024;
- 760;
- 390.

Additional:

- 200% zoom;
- portrait/landscape where relevant;
- no-hover/touch;
- long translated strings;
- reduced motion;
- static fallback;
- missing image;
- missing scene;
- empty data;
- large data.

If light theme remains supported, structure/function must be verified there even though the approved image fidelity target is the dark cinematic theme.

---

# 34. Performance and Motion Bug Tests

Explicitly test:

- duplicate event listeners;
- duplicate RAF loops;
- duplicate timers;
- old scene continuing after navigation;
- two world scenes active simultaneously;
- video continuing in hidden browser tab;
- stale animation callback updating new world;
- rapid top-tab switching;
- rapid portal switching;
- resize during transition;
- theme change during transition;
- language change during transition;
- reduced-motion toggle during animation;
- memory growth after repeated navigation;
- CPU growth after repeated navigation;
- asset load failure loop.

Latest valid navigation state must win.

Time-sensitive behavior must support deterministic test control: use a deterministic clock/time fixture and canonical deterministic dataset so reminders, Today/Next, routines, weekly review, streaks and date-boundary behavior can be reproduced. Before any schema/migration-affecting redesign change, preserve a migration backup/rollback fixture.

Stress/recovery coverage must include first-run/empty state, large local datasets, multi-tab/localStorage collisions, long translations and RTL, portrait/landscape where relevant, autoplay/media-start failure where media exists, explicit animation cancellation on route changes, repeated-navigation memory/CPU growth, and console/unhandled-promise-rejection health.

---

# 35. Failure Isolation

A failure in one submodule must not unnecessarily crash:

- the parent world;
- global navigation;
- Home;
- command system;
- unrelated modules.

Test:

- missing scene;
- broken image;
- malformed local data;
- orphan route;
- failed module registration;
- invalid/corrupt preference;
- unsupported or malformed import/schema;
- module registration failure;
- quota failure;
- missing optional provider;
- failed destructive action/restore path where applicable.

---

# 36. Visual Acceptance Gate

A world or submodule is not visually VERIFIED merely because it is attractive.

Compare against its approved visual DNA.

For main worlds verify:

- reference composition;
- hero hierarchy;
- search/capture treatment;
- quick-action treatment;
- summary cards;
- portal row;
- scene identity;
- surface treatment;
- accent behavior;
- spacing/density.

For submodules verify:

- clear inheritance from the parent world;
- functional clarity;
- no generic unstyled fallback page;
- consistent shared shell;
- appropriate data density.

---

# 37. Functional Honesty Gate

Before marking any reference-derived widget VERIFIED ask:

1. Where does this data come from?
2. Is it real local data?
3. Is it derived from real local data?
4. Is it manual user data?
5. Is it an approved optional provider?
6. Is the feature actually unavailable?

If the answer is unknown, do not display a fake live value.

---

# 38. Final Regression

After all redesign/expansion items are implemented:

Run the complete original OneSpace verification again.

Then run all new redesign tests.

Verify at minimum:

- all old tabs/features;
- storage;
- reminders;
- search;
- existing catalogues;
- projects;
- notes;
- shortcuts;
- settings;
- current migrations;
- all new main worlds;
- every new submodule;
- every primary detail flow;
- responsive matrix;
- motion;
- reduced motion;
- offline;
- security;
- import/export;
- navigation history;
- data integrity;
- deterministic clock/date-boundary behavior;
- first-run and empty states;
- large-data stress;
- multi-tab collisions;
- import-schema validation and rollback;
- long translations/RTL;
- console/unhandled-rejection audit;
- listener/timer/RAF/memory cleanup.

No old stable capability may silently disappear.

---

# 39. Final Product Acceptance Run

Perform a complete realistic session:

1. open Home;
2. verify Home fidelity;
3. use Quick Capture;
4. open Work;
5. use Work quick actions;
6. open every Work portal;
7. create/edit at least one Work object;
8. open Personal / Fitness;
9. use every Personal portal;
10. start/complete a workout flow;
11. open Explore;
12. use every Explore portal;
13. save/open a destination;
14. open Games;
15. use every Games portal;
16. update a game/quest/session;
17. open Movies & Series;
18. use Continue/Watchlist/Genres;
19. open a title detail;
20. open Projects & Notes;
21. use every portal;
22. create note/project/idea;
23. open Settings;
24. inspect every Settings portal;
25. change theme/motion/language preference;
26. use browser Back/Forward;
27. deep-link/reload;
28. resize through required widths;
29. test touch/no-hover behavior;
30. test reduced motion;
31. simulate scene/image failure;
32. go offline;
33. verify local functionality;
34. export;
35. import into isolated state;
36. inspect console;
37. inspect storage integrity;
38. run final automated suite;
39. run final security/secrets checks;
40. record final evidence.

Any failure becomes a new unresolved checklist item.

---

# 40. Definition of Done

The redesign/expansion is complete only when:

- the pre-redesign functional baseline required through Gate 12 is completed/protected, R0 classification is complete, and all post-R0 KEEP/REVERIFY obligations are satisfied;
- the approved references are stored and documented;
- the global shell is consistent;
- canonical navigation is consistent;
- Home matches the approved visual direction;
- Work matches its approved world;
- Personal / Fitness matches its approved world;
- Explore matches its approved world;
- Games matches its approved world;
- Movies & Series matches its approved world;
- Projects & Notes matches its approved world;
- Settings remains a separate approved world;
- every required portal opens a dedicated UI;
- every dedicated UI has meaningful functionality;
- detail flows exist where required;
- no portal is merely decorative;
- data is truthful;
- unsupported integrations do not display fabricated states;
- local-first behavior remains intact;
- motion is stable;
- reduced motion works;
- scene fallback works;
- navigation history works;
- deep links/reload work;
- responsive matrix passes;
- touch/no-hover passes;
- accessibility passes;
- large-data behavior passes;
- offline behavior passes;
- security passes;
- migration/data integrity passes;
- full legacy regression passes;
- new automated tests pass;
- visual acceptance passes;
- motion acceptance passes;
- final full-product acceptance passes;
- documentation matches the delivered product;
- evidence is complete;
- Git state is clean.

Only then may the expansion be marked:

> **ONESPACE LIVE EXPERIENCE REDESIGN & EXPANSION — VERIFIED**
