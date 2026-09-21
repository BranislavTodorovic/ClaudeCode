# OneSpace — Numbered implementation checklist

Authority: `agent-instructions.md` (moves to `docs/agent-instructions.md` in Phase 1). Original step references are retained. Execution order: **13.1 → 13.2 → 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13.3**. Subordinate requirements retain their source order, except the explicitly prescribed Phase 1 move-batch order.

## Do not break

- Entry URL stays `http://localhost:8973/` serving root `index.html`.
- All `localStorage` keys unchanged. A folder move must never touch a storage key.
- All public browser globals keep their names: `OneSpace` (inline), `OneSpaceStorage`, `OneSpaceCatalog`, `OneSpaceShortcuts`, `OneSpaceShortcutUI`, `OneSpaceUI`, `OneSpaceVisual`, `makePersonalController`, `OneSpaceWork`, `OneSpaceTrips`, `DESTINATIONS`, `OneSpaceLocalDiscovery`, `OneSpaceDiscovery`, `OneSpaceExplore`, `OneSpaceGameResources`, `DEFAULT_GAMES` / `SUGGESTION_CATALOG` / `DIABLO_WEEKLY_TEMPLATE` / `GAMES_*`, `OneSpaceGameDiscovery` + `OneSpace.playGamesEntryAnimation`, `SEED_MOVIES` / `MOVIE_*`, `OneSpaceTitleDiscovery`.
- `work/projects.js`, `shared/tooltip-utils.js`, `shared/cinematic-scenes.js`, `explore/explore-global.js` and `explore/discovery-integration.js` export nothing — pure side-effect modules that must keep their exact load position.
- The UMD dual-export pattern stays in every file that has it.
- Backup format version 4 (and v2/v3 acceptance) and all existing fixtures remain valid.
- **No behaviour change of any kind in Phase 1.** If a bug is found mid-move, note it and fix it in a later phase.

The three user-confirmed clarifications in the standing plan apply. Existing DONE markers describe the old implementation, not verification in this run. Do not mark a requirement verified without evidence. No step may be skipped. Repeated requirements remain separately traceable to their original phases.

## Progress

| Phase | Status | Evidence |
|---|---|---|
| 13.1 | Verified | Standing plan and user-confirmed clarifications |
| 13.2 | Verified | 355 numbered entries; coverage reviewed before Phase 0. |
| 0 | Verified | All Phase 0 evidence is in docs/implementation-evidence. |
| 1 | In progress | Move batch 1 next. |
| 2 | Not started | Pending |
| 3 | Not started | Pending |
| 4 | Not started | Pending |
| 5 | Not started | Pending |
| 6 | Not started | Pending |
| 7 | Not started | Pending |
| 8 | Not started | Pending |
| 9 | Not started | Pending |
| 10 | Not started | Pending |
| 11 | Not started | Pending |
| 12 | Not started | Pending |
| 13.3 | Not started | Pending |

## Phase 13.1 — Standing plan

1. [x] **13.1.1** — Replace the stale "Current Findings" section with the verified baseline and the `[DONE]`/`[OPEN]`/`[NEW]`/`[FIX]` status model.

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

2. [x] **13.1.2** — Apply the five corrections listed at the top of this document (the 17-vs-16 movie count, the fourth series record, the missing C.4 root cause, the file count, and the completion status of Part B).

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

3. [x] **13.1.3** — Carry the Product Decisions, Further Considerations, Scope Boundaries and defect-acceptance table verbatim.

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

4. [x] **13.1.4** — Record the scope amendment: provider-backed search replaces the zero-network-requests guarantee for the server, while the browser bundle keeps it.

   Files: `agent-instructions.md`. Acceptance: All specified content exists in the standing plan.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

5. [x] **Gate 13.1** — Verify the standing plan incorporates the three confirmed resolutions

   Files: `agent-instructions.md`. Acceptance: The confirmed decisions are explicit.

   | Status | Evidence |
   |---|---|
   | Verified | Standing plan inspected; user confirmed the three clarifications. |

## Phase 13.2 — Checklist

6. [x] **13.2.1** — One checkbox per actionable step, in execution order, phase by phase.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

7. [x] **13.2.2** — Each step names the file(s) it touches and its acceptance check.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

8. [x] **13.2.3** — Each phase ends with its gate (tests green, no 404s, screenshots captured) as an explicit checkbox.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

9. [x] **13.2.4** — A "Do not break" header block listing the invariants from 1.9 — storage keys, global names, load order, entry URL, backup compatibility.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

10. [x] **13.2.5** — A status column an implementer updates as work lands, so progress is visible without reading a diff.

   Files: `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Inspect checklist coverage, ordering, file references and acceptance fields.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

11. [x] **Gate 13.2** — Verify this checklist against the complete standing plan

   Files: `docs/IMPLEMENTATION-STEPS.md`, `agent-instructions.md`. Acceptance: Every actionable source requirement is traceable in execution order.

   | Status | Evidence |
   |---|---|
   | Verified | 355 numbered entries reviewed against the standing plan; original phases, preserved requirements, gates and confirmed resolutions retained. |

## Phase 0 — Freeze the baseline

> Carried from old Part B Phase 1 (Baseline and Contracts).

12. [x] **0.1** — Run the two test files; record the 31/31 result with a timestamp — [DONE] — re-run before starting

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/baseline-tests.txt: 31 pass, 0 fail; every root application JS and inline script parsed. |

13. [x] **0.2** — Parse every JS file and the inline `index.html` script — [DONE] — covered by the existing parse test

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | docs/implementation-evidence/baseline-tests.txt: 31 pass, 0 fail; every root application JS and inline script parsed. |

14. [x] **0.3** — Start `node _static-server.js`; inspect all 11 routes at `http://localhost:8973` — [OPEN]

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | baseline-routes.json: all 11 route identities and rendered headings verified; no broken visible images or console errors. Existing smoke helper has an outdated Explore heading, recorded for Phase 12. |

15. [x] **0.4** — Record current storage keys, backup format, router pages, script load order, and the `onespace:data-changed` / `onespace:page-changed` events — [OPEN]

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | baseline-contract.json records all 62 keys, version 4 exports and 2/3/4 imports, 11 routes, 22 scripts, 8 styles and event contracts; user-confirmed correction recorded. |

16. [x] **0.5** — Inventory every button, tab, link, form, checkbox, select, modal action, shortcut and page jump — recording owner, expected state change, persistence key, success feedback, error behaviour, focus return and reload behaviour — [OPEN] — this inventory is the acceptance checklist for Phase 12

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | interaction-inventory.json and INTERACTION-INVENTORY.md record source control templates and required acceptance fields; baseline-routes.json records visible route controls. Phase 12 outcomes remain pending. |

17. [x] **0.6** — Treat `storage-utils.js` as the only persistence validation boundary — [DONE] — holds today; must not regress

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

18. [x] **0.7** — Schemas for projects, work items, tasks, history, destinations, preferences, saved destinations, Personal records, game resources, game default tasks, movie/series metadata — [DONE] — all present and validated

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

19. [x] **0.8** — Generated IDs, timestamps, status enums, optional fields, maximum lengths in every schema — [DONE]

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

20. [x] **0.9–0.10** — Migration behaviour and safe defaults for existing records and v2 backups — [DONE] — v2 and v3 accepted, v4 current

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Verified | Storage boundary and schemas inspected; baseline-tests.txt verifies validation, IDs, dates, migration defaults, backup compatibility and rollback. Existing version 4 output is preserved by the confirmed correction. |

21. [x] **0.11** — Capture "before" screenshots of Work, Games, Movies and Settings at 1440 / 1024 / 760 / 390 px — [NEW] — comparison set for the redesign

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | 16 before screenshots in docs/implementation-evidence/before; widths 1440/1024/760/390. Layout measurements in before-layouts.json. Existing Work sidebar overlap recorded for Phase 2. |

22. [x] **0.12** — Export a v4 backup from the live origin before any other phase runs — [NEW] — no later phase can then lose real data

   Files: `index.html`, `storage-utils.js`, application modules, `tests/`, `docs/implementation-evidence/`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Verified | live-origin-baseline-v4.json exported using the actual Settings control; all 62 keys validate and restore round trip succeeds. See baseline-backup-validation.json. |

23. [x] **Gate 0** — Verify baseline tests, all routes, contracts, interaction inventory, 16 screenshots, and live-origin v4 backup

   Files: `docs/implementation-evidence/`. Acceptance: Phase 0 evidence exists before any application change.

   | Status | Evidence |
   |---|---|
   | Verified | 31/31 baseline tests, 11 routes, contracts, interaction inventory, 16 screenshots and genuine live-origin backup retained. |

## Phase 1 — Repository regrouping

### §1.8 batch 1 — shared

24. [x] **1.8.1.move1** — Use git mv for `storage-utils.js` → `shared/storage-utils.js`, preserving its contents (§1.2)

   Files: `storage-utils.js`, `shared/storage-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

25. [x] **1.8.1.move2** — Use git mv for `catalog-utils.js` → `shared/catalog-utils.js`, preserving its contents (§1.2)

   Files: `catalog-utils.js`, `shared/catalog-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

26. [x] **1.8.1.move3** — Use git mv for `shortcut-utils.js` → `shared/shortcut-utils.js`, preserving its contents (§1.2)

   Files: `shortcut-utils.js`, `shared/shortcut-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

27. [x] **1.8.1.move4** — Use git mv for `shortcut-surface.js` → `shared/shortcut-surface.js`, preserving its contents (§1.2)

   Files: `shortcut-surface.js`, `shared/shortcut-surface.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

28. [x] **1.8.1.move5** — Use git mv for `domain-ui.js` → `shared/domain-ui.js`, preserving its contents (§1.2)

   Files: `domain-ui.js`, `shared/domain-ui.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

29. [x] **1.8.1.move6** — Use git mv for `tooltip-utils.js` → `shared/tooltip-utils.js`, preserving its contents (§1.2)

   Files: `tooltip-utils.js`, `shared/tooltip-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

30. [x] **1.8.1.move7** — Use git mv for `visual-utils.js` → `shared/visual-utils.js`, preserving its contents (§1.2)

   Files: `visual-utils.js`, `shared/visual-utils.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

31. [x] **1.8.1.move8** — Use git mv for `cinematic-scenes.js` → `shared/cinematic-scenes.js`, preserving its contents (§1.2)

   Files: `cinematic-scenes.js`, `shared/cinematic-scenes.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

32. [x] **1.8.1.require** — Set the temporary storage validator require to ../trip-board (confirmed resolution)

   Files: `shared/storage-utils.js`. Acceptance: The validator dependency resolves before Explore moves.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

33. [x] **1.8.1.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

34. [x] **1.8.1.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch1-tests.txt and phase1-batch1-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 2 — styles

35. [x] **1.8.2.move1** — Use git mv for `pages.css` → `styles/pages.css`, preserving its contents (§1.2)

   Files: `pages.css`, `styles/pages.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

36. [x] **1.8.2.move2** — Use git mv for `cinematic-refinement.css` → `styles/cinematic-refinement.css`, preserving its contents (§1.2)

   Files: `cinematic-refinement.css`, `styles/cinematic-refinement.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

37. [x] **1.3.url1** — Prefix CSS assets/game-art/cyberpunk-2077-hero.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

38. [x] **1.3.url2** — Prefix CSS assets/movie-art/inception-background.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

39. [x] **1.3.url3** — Prefix CSS assets/game-art/hades-hero.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

40. [x] **1.3.url4** — Prefix CSS assets/movie-art/matrix-background.jpg with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

41. [x] **1.3.url5** — Prefix CSS assets/page-art/personal-cinematic.webp with ../

   Files: `styles/cinematic-refinement.css`. Acceptance: The CSS URL resolves and the background renders.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

42. [x] **1.8.2.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

43. [x] **1.8.2.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch2-tests.txt and phase1-batch2-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 3 — games

44. [x] **1.8.3.move1** — Use git mv for `games.js` → `games/games.js`, preserving its contents (§1.2)

   Files: `games.js`, `games/games.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

45. [x] **1.8.3.move2** — Use git mv for `games-data.js` → `games/games-data.js`, preserving its contents (§1.2)

   Files: `games-data.js`, `games/games-data.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

46. [x] **1.8.3.move3** — Use git mv for `game-resources.js` → `games/game-resources.js`, preserving its contents (§1.2)

   Files: `game-resources.js`, `games/game-resources.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

47. [x] **1.8.3.move4** — Use git mv for `games.css` → `games/games.css`, preserving its contents (§1.2)

   Files: `games.css`, `games/games.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

48. [x] **1.8.3.move5** — Use git mv for `games-cinematic.css` → `games/games-cinematic.css`, preserving its contents (§1.2)

   Files: `games-cinematic.css`, `games/games-cinematic.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

49. [x] **1.8.3.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

50. [x] **1.8.3.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch3-tests.txt and phase1-batch3-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 4 — movies

51. [x] **1.8.4.move1** — Use git mv for `movies.js` → `movies/movies.js`, preserving its contents (§1.2)

   Files: `movies.js`, `movies/movies.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

52. [x] **1.8.4.move2** — Use git mv for `movies-data.js` → `movies/movies-data.js`, preserving its contents (§1.2)

   Files: `movies-data.js`, `movies/movies-data.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

53. [x] **1.8.4.move3** — Use git mv for `movies.css` → `movies/movies.css`, preserving its contents (§1.2)

   Files: `movies.css`, `movies/movies.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

54. [x] **1.8.4.move4** — Use git mv for `movies-cinematic.css` → `movies/movies-cinematic.css`, preserving its contents (§1.2)

   Files: `movies-cinematic.css`, `movies/movies-cinematic.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

55. [x] **1.8.4.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

56. [x] **1.8.4.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch4-tests.txt and phase1-batch4-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 5 — explore

57. [x] **1.8.5.move1** — Use git mv for `explore.js` → `explore/explore.js`, preserving its contents (§1.2)

   Files: `explore.js`, `explore/explore.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

58. [x] **1.8.5.move2** — Use git mv for `explore-data.js` → `explore/explore-data.js`, preserving its contents (§1.2)

   Files: `explore-data.js`, `explore/explore-data.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

59. [x] **1.8.5.move3** — Use git mv for `explore-global.js` → `explore/explore-global.js`, preserving its contents (§1.2)

   Files: `explore-global.js`, `explore/explore-global.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

60. [x] **1.8.5.move4** — Use git mv for `discovery-integration.js` → `explore/discovery-integration.js`, preserving its contents (§1.2)

   Files: `discovery-integration.js`, `explore/discovery-integration.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

61. [x] **1.8.5.move5** — Use git mv for `discovery-ui.js` → `explore/discovery-ui.js`, preserving its contents (§1.2)

   Files: `discovery-ui.js`, `explore/discovery-ui.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

62. [x] **1.8.5.move6** — Use git mv for `local-discovery.js` → `explore/local-discovery.js`, preserving its contents (§1.2)

   Files: `local-discovery.js`, `explore/local-discovery.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

63. [x] **1.8.5.move7** — Use git mv for `trip-board.js` → `explore/trip-board.js`, preserving its contents (§1.2)

   Files: `trip-board.js`, `explore/trip-board.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

64. [x] **1.8.5.move8** — Use git mv for `discovery.css` → `explore/discovery.css`, preserving its contents (§1.2)

   Files: `discovery.css`, `explore/discovery.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

65. [x] **1.8.5.require** — Set the final storage validator require to ../explore/trip-board

   Files: `shared/storage-utils.js`. Acceptance: The moved dependency resolves.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

66. [x] **1.8.5.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

67. [x] **1.8.5.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch5-tests.txt and phase1-batch5-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 6 — work

68. [x] **1.8.6.move1** — Use git mv for `projects.js` → `work/projects.js`, preserving its contents (§1.2)

   Files: `projects.js`, `work/projects.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

69. [x] **1.8.6.move2** — Use git mv for `work-tracker.js` → `work/work-tracker.js`, preserving its contents (§1.2)

   Files: `work-tracker.js`, `work/work-tracker.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

70. [x] **1.8.6.move3** — Use git mv for `tracker.css` → `work/tracker.css`, preserving its contents (§1.2)

   Files: `tracker.css`, `work/tracker.css`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

71. [x] **1.8.6.move4** — Use git mv for `personal-controller.js` → `personal/personal-controller.js`, preserving its contents (§1.2)

   Files: `personal-controller.js`, `personal/personal-controller.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

72. [x] **1.4.1** — In this same batch, replace the static-server blocked segments with tests, node_modules, outputs, api, server, config, secrets

   Files: `_static-server.js`. Acceptance: Work files are served and sensitive directories remain inaccessible.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

73. [x] **1.8.6.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

74. [x] **1.8.6.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch6-tests.txt and phase1-batch6-http.json; browser reloaded with expected page and no console errors. |

### §1.8 batch 7 — server

75. [x] **1.8.7.move1** — Use git mv for `_static-server.js` → `server/_static-server.js`, preserving its contents (§1.2)

   Files: `_static-server.js`, `server/_static-server.js`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

76. [x] **1.8.7.move2** — Use git mv for `providers/` → `server/providers/`, preserving its contents (§1.2)

   Files: `providers/`, `server/providers/`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

77. [x] **1.8.7.move3** — Use git mv for `REVISED-IMPLEMENTATION-PLAN.md` → `docs/REVISED-IMPLEMENTATION-PLAN.md`, preserving its contents (§1.2)

   Files: `REVISED-IMPLEMENTATION-PLAN.md`, `docs/REVISED-IMPLEMENTATION-PLAN.md`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

78. [x] **1.8.7.move4** — Use git mv for `agent-instructions.md` → `docs/agent-instructions.md`, preserving its contents (§1.2)

   Files: `agent-instructions.md`, `docs/agent-instructions.md`. Acceptance: The tracked move matches §1.2; assets stay at root.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

79. [x] **1.5.1** — **`config/secrets/`** with a committed `.gitkeep`; everything else in it is ignored.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

80. [x] **1.5.2** — **`config/secrets.example.json`** — committed template, placeholder values only. **[NEW]** it now documents the keys Phase 6 will actually consume: `TMDB_API_KEY`, and `IGDB_CLIENT_ID` + `IGDB_CLIENT_SECRET` or `RAWG_API_KEY`.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

81. [x] **1.5.3** — **`.gitignore`** at the repository root:

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

82. [x] **1.5.4** — **Server-only.** No file under `config/` may be referenced by `index.html` or any browser script. Browser JS is fully readable, so a key placed there is a published key.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

83. [x] **1.5.5** — **Not servable.** `config` and `secrets` are in the block list (1.4 item 1). The extension allowlist is a useful second layer but **not sufficient alone** — `_static-server.js` serves only its MIME-mapped extensions, so `secrets.json` would 404 incidentally, but a credential file named `.js` **would be served in full**. The segment block is the real control. `tests/browser-server.js` has *no* deny list and does serve `.json`, so it must never point at a tree containing real credentials.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

84. [x] **1.5.6** — **Not used in this phase.** Phase 1 creates the folder, template and ignore rules only.

   Files: `config/`, `.gitignore`, `server/_static-server.js`. Acceptance: Template contains placeholders only; ignore and server-block checks pass.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

85. [x] **1.8.7.references** — Apply the §1.6 reference updates for this batch, preserving script order, globals, root entry URL, document-relative assets and behavior

   Files: `index.html`, `tests/data-regression.test.js`, `tests/tracker-regression.test.js`, affected source files. Acceptance: All moved references resolve; unchanged script execution order.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

86. [x] **1.8.7.gate** — Run node --test tests/ and inspect the live app after this batch

   Files: `tests/`, live http://localhost:8973. Acceptance: Tests pass; no 404s, console errors, duplicate script execution or init-order changes.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

87. [x] **1.8.8.parse** — Replace the flat parse loop with a recursive source walk excluding tests, node_modules, config and assets (§1.4.2)

   Files: `tests/data-regression.test.js`. Acceptance: The recursive file count matches the source inventory.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

88. [x] **1.7.1** — every `<script src>` and `<link href>` in `index.html` resolves to a file on disk

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

89. [x] **1.7.2** — every repo-relative `require(...)` in every source and test file resolves

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

90. [x] **1.7.3** — every `assets/...` string literal in JS and every `url(...)` in CSS resolves

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

91. [x] **1.7.4** — the recursive parse walk visits a file count matching the expected source inventory (guards 1.4 item 2 from regressing)

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

92. [x] **1.7.5** — no file under `config/` is referenced from `index.html` or any browser script

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

93. [x] **1.7.6** — the 22 `<script src>` values appear in exactly the expected order (guards 1.4 item 4)

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

94. [x] **1.7.7** — every `assets/...` literal still satisfies the three `^assets/` validators (guards the 1.3 decision against a later accidental asset move)

   Files: `tests/structure.test.js`. Acceptance: This assertion passes against the regrouped repository.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

95. [x] **1.6.browser-server** — Confirm the disposable server resolves the repository root and retains its MISSING_ASSET hook

   Files: `tests/browser-server.js`. Acceptance: The forced assets/destinations/azores.svg failure still works.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-final-tests.txt: 39 pass, 0 fail; 24 application scripts recursively parsed, exact 22-script order, references/assets/validators and server denial checks pass. Disposable server MISSING_ASSET hook retained. |

96. [x] **1.6.README** — Update server commands, load-order paragraph and file references listed in §1.6

   Files: `README.md`. Acceptance: Commands and paths match the regrouped files; final content rewrite remains §13.3.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

97. [x] **1.6.VERIFICATION** — Correct bare test filenames and the 18973 → 18974 port error listed in §1.6

   Files: `VERIFICATION.md`. Acceptance: Documented paths and port match the test server.

   | Status | Evidence |
   |---|---|
   | Verified | phase1-batch7-tests.txt and phase1-batch7-http.json; browser reloaded with expected page and no console errors. |

98. [ ] **Gate 1** — 31 baseline tests remain green; structural assertions pass; zero 404s; follow history across games/games.js; probe.js under config/secrets returns 404

   Files: `tests/`, `server/_static-server.js`, Git history. Acceptance: Record every §1.9 gate result.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 2

> The first step of the tracker rebuild, and the first feature phase after the regroup.

## 2.1 Route consolidation [NEW]

99. [ ] **2.1.1** — Merge Projects into Work as a sub-view. `projects` stays in the `PAGES` array as a **redirect alias** to `work` with the Projects sub-view selected, so existing `orbit-page` values and the 14 hardcoded `goToPage` / `data-page-jump` call sites keep working. Storage keys untouched.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

100. [ ] **2.1.2** — One route, four sub-views under a single header:

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

101. [ ] **2.1.3** — **Board** (default) — active stories and defects

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

102. [ ] **2.1.4** — **Projects** — project CRUD, moved wholesale from the Projects route

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

103. [ ] **2.1.5** — **Backlog** — closed items

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

104. [ ] **2.1.6** — **History** — the event log

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

105. [ ] **2.1.7** — `work/projects.js` keeps owning `orbit-work-projects` CRUD and its card component; only its mount target changes. Its two foreign responsibilities move out: `#homeOverview` rendering (`projects.js:40-43`) goes to a Home aggregator module, and the Work-overview fallback (`projects.js:44-47`) is deleted — `work-tracker.js:51` already overwrites it, and it is a domain leak (Phase 3).

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 2.2 Layout [NEW]

106. [ ] **2.2.1** — **Results region** — `.domain-grid` is locked to 2 columns until 1440px (`tracker.css:2`). Becomes `repeat(auto-fill, minmax(320px, 1fr))`.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

107. [ ] **2.2.2** — **Detail region** — `#workDetail` renders full-width *below* the grid as one long prose column (`work-tracker.js:52,66-69`). Becomes a right-side drawer at ≥1100px and a full-screen sheet below, reusing the existing `OneSpaceUI` modal stack, focus trap, Escape handling and inert background from `shared/domain-ui.js` — not a new dialog implementation.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

108. [ ] **2.2.3** — **Focus rail** — the fixed 352px `#focusRail` costs Work ~170px of content width versus every other page (`index.html:93`). Its contents are non-work-domain (Phase 3 empties it), so the rail leaves Work and the width clamp is normalised.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 2.3 Filters [NEW]

109. [ ] **2.3.1** — `.domain-filters` puts 5 selects + a search field + a submit button into a fixed 3-column grid, and filtering requires pressing "Apply filters". Rebuild as one responsive filter bar with **live filtering** (debounced text, immediate selects), a dismissible active-filter chip row, and a result count. Add the **sort control that does not exist today** — sorting is hardcoded priority→deadline→createdAt at `work-tracker.js:29`.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify every stated criterion and retain the visual or automated evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 2.4 Card and tile quality [NEW]

110. [ ] **2.4.1** — **Overview tiles**: `work-tracker.js:51` emits bare `<div><span>…</span><strong>n</strong></div>`, omitting `.overview-tile-top` / `.overview-tile-bottom`, so none of the icon-slot and arrow styling in `pages.css:248-251` applies — three unstyled labels over oversized serif numerals. Emit the same structure as every other overview tile, as `<button data-page-jump>` like `projects.js:29`.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

111. [ ] **2.4.2** — **Work item cards**: a flat gradient rectangle printing raw lowercase `esc(i.status)` / `esc(i.priority)` (`work-tracker.js:59`). Add a type glyph (story vs defect) from the existing inline SVG set, priority as a colour-coded rail rather than a word, **capitalised status labels** per the standing labelling rule, and a real task progress bar replacing the "n / m tasks complete" text.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

112. [ ] **2.4.3** — **Section heading**: emit the `.page-section-head h2 > .icon` tile that `cinematic-refinement.css:76-77` already styles and the tracker alone never provides.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

113. [ ] **2.4.4** — `#workTracker` (`index.html:484`) has no `data-reveal` unlike its siblings — add it.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 2.5 Render mechanics [NEW]

114. [ ] **2.5.1** — `work-tracker.js:52` rewrites the whole section's `innerHTML` on every mutation, forcing the manual focus-restoration hack at `:50,64` and a cosmetic "is-updating" pulse. Scope re-renders to the changed region (results list, detail drawer, filter bar) so focus, scroll position and the caret survive naturally. Keep `OneSpaceUI.confirm` for destructive actions.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 2.6 Behaviour preserved from old Part B Phase 2

> All already built; must not regress. Re-verify each after the redesign.

115. [ ] **2.6.1** — Stabilise `work-tracker.js` as the module home instead of growing the inline script — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

116. [ ] **2.6.2** — Keep `projects.js` compatible with Home/Work project summaries — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

117. [ ] **2.6.3** — Storage keys and validation for projects, items, tasks, history — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

118. [ ] **2.6.4** — Backup / restore / reset / complete / invalid / legacy / current fixtures updated — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

119. [ ] **2.6.5** — Project CRUD: name, description, link, tags, status, progress, deadline — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

120. [ ] **2.6.6** — Story/defect CRUD under a selected project — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

121. [ ] **2.6.7** — Item fields: name, type, status, priority, analysis, plan, execution, labels, deadline, reminder, links — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

122. [ ] **2.6.8** — Validate required name, project, type and status fields — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

123. [ ] **2.6.9** — Reject invalid URLs and invalid dates — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

124. [ ] **2.6.10** — Task CRUD: title, details, priority, due date, estimate, done — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

125. [ ] **2.6.11** — Accessible task checkboxes with completion styling and progress counts — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

126. [ ] **2.6.12** — Open / reopen / in-progress / blocked / close lifecycle — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

127. [ ] **2.6.13** — Closing an item completes all child tasks, stores completion time, creates a log entry, removes it from active views — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

128. [ ] **2.6.14** — Closed items persist in backlog and reopen without losing task history — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

129. [ ] **2.6.15** — Views: active projects, active items, due soon, overdue, blocked, backlog, history — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

130. [ ] **2.6.16** — Filters by project, type, status, priority, deadline, search text — [DONE] — upgraded to live in 2.3

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

131. [ ] **2.6.17** — Replace the generic Work timeline with real item and task priorities — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

132. [ ] **2.6.18** — Keep a link to Productivity for general daily tasks — **[FIX] reversed** — this is a domain leak; removed in Phase 3

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

133. [ ] **2.6.19** — Due-soon / overdue badges, reminder panels, page-entry toasts — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

134. [ ] **2.6.20** — Respect reduced motion for reminder and state-change animations — [DONE]

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

135. [ ] **2.6.21** — Verify every Work button end to end — [OPEN] — Phase 12

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

136. [ ] **Gate 2** — every Work action from the Phase 0.5 inventory still works; 31/31 green; side-by-side screenshots at all four widths show no overflow and no overlap.

   Files: `index.html`, `work/projects.js`, `work/work-tracker.js`, `work/tracker.css`, `shared/domain-ui.js`. Acceptance: Record the stated gate results.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 3

> Home is the only aggregator. Every other tab renders only its own domain. Each row is a confirmed leak.

137. [ ] **3.row1** — 1 — Work overview tile counts `orbit-tasks` (generic daily tasks) — `projects.js:44-47` — Delete the fallback path

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

138. [ ] **3.row2** — 2 — "General daily tasks" button in Work's timeline head — `index.html:482` — Remove

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

139. [ ] **3.row3** — 3 — Work hero CTA "Start a focus session" → Productivity — `index.html:471` — Replace with a work-domain action

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

140. [ ] **3.row4** — 4 — Work-only focus rail renders `orbit-tasks`, countdowns, `orbit-notes-list`, recents — `index.html:153-159`, fed `1980-1985`, `2049-2053`, `2761-2765` — Rail leaves Work (2.2); its content belongs to Productivity and Notes. Note `index.html:61` already hides three of its five sections, leaving dead markup

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

141. [ ] **3.row5** — 5 — Mobile "Today & Focus" toggle on Work — `index.html:466` — Remove with the rail

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

142. [ ] **3.row6** — 6 — Project deadlines pushed into Work reminders *after* the timeline list is already written — `work-tracker.js:75` — Fold into the Projects sub-view consistently

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

143. [ ] **3.row7** — 7 — Home Quick Access mixes all three spaces unfiltered — `index.html:1354-1365` — Allowed — Home is the aggregator. Label each tile with its space

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

144. [ ] **3.row8** — 8 — Home's "Shortcuts available" count follows the *Shortcuts page's* selected space — `index.html:1368` via `activeLinks()` — Count all spaces, or state which space

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

145. [ ] **3.row9** — 9 — 8 Gaming built-ins + `youtube` / `maps` routed into Explore, then relabelled "Relax & Play" — `shortcut-utils.js:3`, `index.html:1167` — Make Gaming a real category (Phase 7)

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

146. [ ] **3.row10** — 10 — `Gaming` exists in `CATEGORIES` but `visibleCategories()` never returns it — `index.html:1117`, `1172-1176` — Make reachable

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

147. [ ] **3.row11** — 11 — Explore tiles jump to Games / Movies / Productivity; the Productivity tile uses **Personal's** hero art — `index.html:553-555`, `cinematic-refinement.css:102` — Remove cross-domain tiles from Explore; they belong on Home

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

148. [ ] **3.row12** — 12 — `#endWorkdayBtn` (a Work control) calls `applySpace("explore")` + `goToPage("explore")` — `index.html:2100-2109` — Stop relocating the user out of Work

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

149. [ ] **3.row13** — 13 — Games and Movies write `data-games-theme` / `data-movies-theme` to `<body>` and never clear them — `games.js:693`, `movies.js:954` — Scope to the view root, or clear in `goToPage`

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

150. [ ] **3.row14** — 14 — Dead pre-router CSS hiding nodes that now live inside `[data-page-when]` sections — `index.html:89-90` — Delete

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

151. [ ] **3.row15** — 15 — **The shared storage boundary reaches into a domain** — `shared/storage-utils.js:49` calls `require('../explore/trip-board')` inside the `orbit-trip-board` validator — `storage-utils.js:49` — Inject domain validators instead of requiring across domains. Phase 1 only repoints the path because it forbids behaviour change; the real fix lands here

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> **Productivity keeps** the generic `orbit-tasks` list, the timer and countdowns — it is their owning domain. Nothing is deleted from the app; content moves to the tab that owns it.

## 3.1 The Home aggregator module [NEW]

> Home is the only page allowed to read across domains, so it needs a real owner rather than being rendered from inside `work/projects.js`.

152. [ ] **3.1.1** — Create `home/home-overview.js` (a new top-level domain folder, following the Phase 1 structure) which:

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

153. [ ] **3.1.2** — Takes over `#homeOverview` from `projects.js:40-43`, reading `orbit-work-projects`, `orbit-tasks` and `orbit-notes-list` as it does today.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

154. [ ] **3.1.3** — Becomes the single place cross-domain aggregation is permitted, so the Phase 3 boundary test can allow exactly this one module and forbid everything else.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

155. [ ] **3.1.4** — Gains the cross-domain destination tiles removed from Explore (row 11) and the space labels required by rows 7 and 8.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

156. [ ] **3.1.5** — Is a pure side-effect module in the load order, placed after the inline shell and after `work/projects.js` (it reads `window.OneSpace` and the same storage helpers).

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

157. [ ] **3.1.6** — Its `<script src>` tag is added to `index.html` in this phase, not in Phase 1 — Phase 1 forbids behaviour change, and the structural test from 1.7 asserts an exact script count and order, so that expectation is updated here alongside the new tag.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

158. [ ] **Gate 3** — a new test asserting each page's DOM subtree reads only its own domain's storage keys, with `home/home-overview.js` the single allowed exception.

   Files: `index.html`, `home/home-overview.js`, `work/projects.js`, `work/work-tracker.js`, `shared/storage-utils.js`, `shared/shortcut-utils.js`, `games/games.js`, `movies/movies.js`, boundary tests. Acceptance: Record the stated gate results.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 4

## 4.1 Fix what blocks new themes [FIX]

> Not extra scope — the requested theme work cannot land without these:

159. [ ] **4.1.1** — **`cinematic-scenes.js:26-34` groups the Settings card by field *index*** (slices `[0,2)`, `[2,7)`, `[7,]`). Adding any new setting silently files controls under the wrong heading. Replace index slicing with declared membership (a `data-settings-group` attribute per field) **before** adding settings.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

160. [ ] **4.1.2** — **The header theme toggle destroys the palette** — `index.html:1574-1581` forcibly resets `paletteChoice` to `"classic"` and removes `data-palette`, wiping a selected Aurora / Graphite / Deep Space choice. Make light/dark orthogonal to palette.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

161. [ ] **4.1.3** — **"Deep Space" (`midnight`) has no CSS variable block** — it appears only in the dark-mode selector lists at `index.html:21` and `34-36`, so it renders identically to plain dark. Give it real tokens.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

162. [ ] **4.1.4** — **`--page-accent` is defined twice and fights over cascade order** — `cinematic-refinement.css:4-15` sets per-page hex values; `pages.css:193-195` sets a different set then `body { --page-accent: var(--accent) }`. Establish one owner.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

163. [ ] **4.1.5** — **Reset correctness** — `index.html:1656-1689` "Reset preferences" also wipes favorites, recents, collapsed sections and search provider, and does **not** reset `orbit-theme`, so a dark theme survives a reset while unrelated user data is destroyed. Reset preferences only.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 4.2 New themes [NEW]

164. [ ] **4.2.1** — Extend the `data-palette` system (tokens `--bg`, `--bg-2`, `--surface`, `--surface-2`, `--surface-3`, `--accent`, `--accent-2`, `--accent-soft`, `--line`, `--text`, `--muted`, `--faint`) with new palettes beside the existing five (Auto, Classic Light, Deep Space, Aurora, Graphite) and four accents (blue, purple, green, amber).

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

165. [ ] **4.2.2** — Each new palette must: define the complete token set in both light and dark; pass WCAG AA contrast for body text and controls; ship a swatch preview in the existing `.theme-choices` radiogroup. Per old C.7 point 1, at least one is a **warm** direction — today's `--os-*` tokens run cool.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify every stated criterion and retain the visual or automated evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 4.3 New settings [NEW]

166. [ ] **4.3.1** — **Per-tab scene intensity** — Full / Subtle / Off, governing Phase 5 ambient motion independently of the motion override.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

167. [ ] **4.3.2** — **Surface the Games and Movies sub-themes.** `games.js:168-173` (midnight / neon / crimson / aurora) and `movies.js:162-167` (marquee / noir / velvet / golden) are real theme systems with their own storage keys that Settings never exposes.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

168. [ ] **4.3.3** — **Removed shortcuts** restore list (Phase 7).

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

169. [ ] **4.3.4** — **Provider status** panel (Phase 6) — configured / not configured / offline.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 4.4 Preserved settings behaviour

170. [ ] **4.4.1** — Existing settings (palette, background, start page, accent, density, productivity area, clock format, motion) and the Data block (export / import / backup status / reset preferences / reset all data) keep their storage keys and behaviour. [DONE] — must not regress.

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

171. [ ] **Gate 4** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `index.html`, `shared/cinematic-scenes.js`, `shared/storage-utils.js`, `styles/pages.css`, `styles/cinematic-refinement.css`, Settings module. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 5

> Delivers old Part B Phase 7 and old C.7, using **code-drawn animated scenes**: layered inline SVG + CSS driven by `body[data-page]`. No new binary assets, no external requests. The Games page already proves the technique with its five-layer stack (`gv-scene-art` / `-shade` / `-glow` / `-fog` / `-particles`).

## 5.1 One scene system, replacing three [FIX]

172. [ ] **5.1.1** — Three uncoordinated entry-animation systems run today: `.is-page-entering` (`index.html:1797-1799`), `.scene-enter` (`discovery-integration.js:14`), and the CSS `osEnter` keyframe (`cinematic-refinement.css:131-132`). Two independent parallax variable sets exist — `--px` / `--py` (`index.html:2961-2970`, with **no consumer in the stylesheets**) and `--scene-x` / `--scene-y` (`discovery-integration.js:15`). Collapse into one scene controller owning entry transition, parallax, ambient motion and reveal, exposed on `window.OneSpace`.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 5.2 Per-tab scenes [NEW]

173. [ ] **5.2.1** — Each of the 10 distinct pages gets a layered scene; the 11th route, Projects, redirects to Work and shares its scene (user-confirmed). Each page has a scene whose subject matches its domain, following the visual directions already agreed: **Home** = observatory / personal command deck; **Work** = drafting room / command centre; **Personal** = calm ritual space; **Explore** = world atlas / travel window; **Games** = game-world spotlight; **Movies & Series** = theater / streaming marquee; **Shortcuts** = navigable launch wall; **Productivity** = focused timer studio; **Notes** = quiet capture desk; **Settings** = control room.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

174. [ ] **5.2.2** — Every scene composes: a drawn SVG backdrop; a depth layer with pointer parallax; a slow ambient layer (drifting light, motes, gradient shift); and a shade scrim guaranteeing text contrast. The nine existing `assets/page-art/*` stills are retained as an optional art slot behind the drawn layers, so a real render can replace a drawn backdrop later without code changes.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 5.3 Close the gaps [FIX]

175. [ ] **5.3.1** — **Games and Movies get a `.page-hero`** with eyebrow, headline and scene caption, and join the scene numbering — currently 01–09 with both absent from the `scenes` map in `cinematic-scenes.js:5`.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

176. [ ] **5.3.2** — `#moviesView` is an empty `<div id="moviesMount">` (`index.html:570-572`) until `movies.js` mounts, so it renders nothing cinematic on first paint. Ship hero markup in the document.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

177. [ ] **5.3.3** — `index.html:494` uses class `projects-scene`, which **has no matching selector anywhere** — a dead class.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

178. [ ] **5.3.4** — Games `world` values `neon` and `aurora` exist in `games-data.js` with **no CSS rule** and silently fall back to the amber default.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

179. [ ] **5.3.5** — `cinematic-scenes.js:13-22` injects heading icons by brittle `nth-child` position — move to explicit markup hooks.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

180. [ ] **5.3.6** — Gradient-only fallback heroes now dead behind the art layer (`pages.css:81, 113, 136, 148, 171`) — remove or repurpose.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 5.4 Interaction rules carried from old Phase 7

181. [ ] **5.4.1** — Entry transition per tab — short, content-first, never delaying interaction — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

182. [ ] **5.4.2** — Hero scene movement / parallax on pointer, stable on touch — [DONE] — unify in 5.1

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

183. [ ] **5.4.3** — Parallax only on explicitly marked decorative layers; clamp values, use `translate3d`, never move text, forms, buttons or focus targets — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

184. [ ] **5.4.4** — Scroll-linked depth only where it improves hierarchy, via IntersectionObserver with a fallback — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

185. [ ] **5.4.5** — Staggered reveal for primary cards — visible content only, modest durations — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

186. [ ] **5.4.6** — Meaningful transitions for search results, filter changes, detail open, save/remove, board status, task completion, tab change, image load and fallback — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

187. [ ] **5.4.7** — Cinematic loading states matched to the section, not generic spinners — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

188. [ ] **5.4.8** — Real image crossfades and sensible crop positioning — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

189. [ ] **5.4.9** — Fallback art only on failed media requests; broken media still leaves a usable card — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

190. [ ] **5.4.10** — One consistent inline SVG icon system, accessible labels retained — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

191. [ ] **5.4.11** — Hover, focus, active, empty, loading, error, disabled, success states for every interactive surface — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

192. [ ] **5.4.12** — Accessible labels, tooltips, `aria-pressed` / `aria-expanded` / `aria-current`, `aria-live` for saves, reminders, completion, close/reopen, deletion — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

193. [ ] **5.4.13** — Touch targets sized for mobile; hover-only behaviour disabled on coarse pointers — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

194. [ ] **5.4.14** — Test at 1440 / 1024 / 760 / 390 px — no overlap or overflow — [OPEN] — Phase 12

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

195. [ ] **5.4.15** — Handle long user text safely across all domains — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

196. [ ] **5.4.16** — Modal focus return and focus preservation after dynamic rerenders — [DONE]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

197. [ ] **5.4.17** — Capture visual evidence that effects are visible, stable on touch, and disabled in reduced motion — [OPEN]

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 5.5 Motion contract [FIX]

198. [ ] **5.5.1** — All motion routes through `prefersReducedMotion()` (`index.html:1705-1709`, exported at `:3084`). Four paths re-query `matchMedia` directly and therefore **ignore the user's "Full motion" override**: `index.html:1183`, `games.js:97`, `games.js:468`, `movies.js:87`. Route them through the helper. Reduced motion removes parallax, ambient drift, stagger and scroll-linked transforms **entirely** — genuinely still, not slowed.

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

199. [ ] **Gate 5** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `index.html`, `shared/cinematic-scenes.js`, `styles/`, `games/`, `movies/`, `explore/discovery-integration.js`. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 6

## 6.1 Server layer

200. [ ] **6.1.1** — Extend `server/_static-server.js` (or add `server/api.js`) with a proxy reading credentials from `config/secrets/` — **server-side only, never in browser JS**. Routes: `/api/search/titles`, `/api/search/games`, `/api/details/:kind/:id`.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> Carried from the old REVISED plan's provider requirements:

201. [ ] **6.1.2** — Provider-neutral contract for title search, game search, and details.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

202. [ ] **6.1.3** — Normalise every provider response into the app's existing record shapes, so the UI never sees a TMDB or IGDB payload.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

203. [ ] **6.1.4** — `AbortController` cancellation when the query changes quickly.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

204. [ ] **6.1.5** — Explicit loading, empty, timeout, rate-limit, offline, authentication and provider-error states.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

205. [ ] **6.1.6** — Short-TTL response cache; cache must be clearable without deleting user records.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

206. [ ] **6.1.7** — Pagination / load-more — never silently cap results.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

207. [ ] **6.1.8** — Attribution and source links in details where the provider requires it.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

208. [ ] **6.1.9** — A **local mock provider** so automated tests never need network access or quota.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

209. [ ] **6.1.10** — A clear configuration-error state when credentials are missing — the UI explains what is unavailable rather than showing the local catalog as if it were global.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 6.2 Typeahead

210. [ ] **6.2.1** — Both Games (`#gvGameSearch`, wired `games.js:1009-1028`) and Movies (`#mvMovieSearch`, wired `movies.js:802-821`) **already have real ARIA combobox typeaheads** over the local catalog, with arrow-key navigation, Escape, click-outside close, and an "Add Custom" row. [DONE] Keep both and extend:

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

211. [ ] **6.2.2** — **Debounce input** — both currently fire on every keystroke.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

212. [ ] **6.2.3** — **Two result groups** in one dropdown: "In your catalog" (local, instant) then "Search results" (provider, async) with a loading row.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

213. [ ] **6.2.4** — **Explicit add affordance.** Selecting a row currently calls `addSuggestionToLibrary` / `addSeedToLibrary` **immediately**, with no confirmation and no status choice (`games.js:1004`, `movies.js:797`). Add an explicit add control, and for titles a status choice — matching the Discover panel (`discovery-ui.js:31`), which already does this properly.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

214. [ ] **6.2.5** — **Series parity** — series are first-class in the same search; the type filter (`movies.js:1396`) gets capitalised `Movie` / `Series` labels.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

215. [ ] **6.2.6** — **Offline / unconfigured state** is visible and explicit.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 6.3 Reconcile the two search experiences [FIX]

216. [ ] **6.3.1** — `discovery-integration.js:3-9` mounts a second, unrelated Discover panel into Movies, renames the tab, wraps the existing preference chips into a `<details>`, and rewrites the typeahead placeholder. Games has the same split. Reconcile into one search experience per domain with one result-card design.

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

217. [ ] **Gate 6** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `server/_static-server.js`, `server/providers/`, `config/secrets.example.json`, `games/games.js`, `movies/movies.js`, `explore/discovery-integration.js`, provider tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 7

## 7.1 Removable built-ins [NEW]

> All 47 built-ins (`index.html:1060-1112`) have **no delete and no edit control** — `cardHtml` (`index.html:1223`) and `shortcut-surface.js:6` both gate those on `custom`. The only removal mechanism is the hardcoded `HIDDEN_DEFAULT_IDS = ["hm","zara","maxmara"]` (`index.html:1163`).

218. [ ] **7.1.1** — Add an `orbit-hidden-links` array key with a validator in `shared/storage-utils.js`, a fixture, and a backup round-trip test.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

219. [ ] **7.1.2** — Every shortcut card — built-in or custom, full (`index.html:1215-1237`) and compact (`shortcut-surface.js:4-7`) — gets a Remove control. Custom keeps destructive delete; built-in hides.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

220. [ ] **7.1.3** — A **Removed shortcuts** panel in Settings restores any of them.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

221. [ ] **7.1.4** — Replace `HIDDEN_DEFAULT_IDS` with real user data, seeding those three ids on first run so nothing visibly changes for existing users.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 7.2 Add-control fixes [FIX]

222. [ ] **7.2.1** — **Work has no add-shortcut control at all**, unlike Personal (`index.html:528`) and Explore (`index.html:559`). Add one.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

223. [ ] **7.2.2** — **`index.html:2498` binds every `[data-add-space]` button to `openShortcutModal(null)` and never reads the attribute**, so the declared space is discarded and the modal guesses from `currentPage` / `currentSpace` (`:2478`). Honour the attribute.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

224. [ ] **7.2.3** — `shortcut-surface.js:9` calls `renderExplorePage()` with no argument, silently clearing the Explore search filter whenever any shortcut is favorited.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

225. [ ] **7.2.4** — "Duplicate" (`index.html:2585`) is a stub that only shows a toast. Implement or remove.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 7.3 Modernisation — old C.6

226. [ ] **7.3.1** — Rebuild the card and launch wall on the inline SVG icon system with a favicon/hostname fallback chain that never renders a broken image.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

227. [ ] **7.3.2** — Modern grid with proper hover, focus, active, empty, loading and error states; mobile-sized touch targets.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

228. [ ] **7.3.3** — Drag-to-reorder **with a keyboard-accessible equivalent**; favorites and recents visually distinct rather than text-labelled.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

229. [ ] **7.3.4** — Name, description and hostname in a clear hierarchy, with `rel="noopener noreferrer"` preserved.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

230. [ ] **7.3.5** — Explore-owned shortcuts stay visually consistent but strictly scoped.

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 7.4 Ownership rules preserved from old Part B Phase 3

231. [ ] **7.4.1** — Shortcut modal has a description field and explicit space ownership — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

232. [ ] **7.4.2** — Adding from Personal defaults to Personal; adding from Explore forces Explore — [DONE] — but see the 7.2 attribute bug

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

233. [ ] **7.4.3** — Enforce ownership in sanitization and `linkSpace()` so links cannot leak between spaces — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

234. [ ] **7.4.4** — Edit and delete confirmation for custom shortcuts — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

235. [ ] **7.4.5** — Show name, description, hostname, icon fallback, favorite, recent, safe external-link behaviour — [OPEN] — hostname is not shown on the compact card

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

236. [ ] **7.4.6** — Regression tests for deletion, descriptions, space filtering, duplicate URLs, backup round trips — [DONE]

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

237. [ ] **Gate 7** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `index.html`, `shared/shortcut-utils.js`, `shared/shortcut-surface.js`, `shared/storage-utils.js`, Settings module, shortcut tests and fixtures. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 8

## 8.1 Tracker type must be correct at add time [NEW]

> A tracker **is** already created at add time — `starterStory()` at `games.js:846`, `:676`, `:1641`, and `ensureWeekly()` for weekly. The real defect is that **the type is almost always wrong**: `SUGGESTION_CATALOG` (`games-data.js:182-195`) carries **no `trackerType`**, and `games.js:843` defaults to `g.trackerType || "story"`. Every one of the 12 suggestions — and every future provider result — becomes a story game with one generic 3-objective chapter.

238. [ ] **8.1.1** — Add `trackerType` to every catalog record and to the provider normaliser.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

239. [ ] **8.1.2** — Infer the default from genre and tags (live-service, MMO, looter, gacha, battle-royale → **weekly**; campaign, story-rich, single-player → **story**), and **show the inferred choice in the add flow so it can be corrected before saving**. The two `.gv-tracker-choice` pills (`index.html:729-732`) already exist for custom games.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

240. [ ] **8.1.3** — Mission-based games get **real chapters**, not one catch-all. `OneSpaceGameResources.story` (`game-resources.js:25`) currently always produces a single `"Your first milestones"` chapter; extend the catalog so story games ship a chapter outline.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

241. [ ] **8.1.4** — Editing a game from weekly → story leaves the old `story` object orphaned (`games.js:669-673`). Reconcile on type change.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 8.2 De-Diablo-ify the weekly tracker [FIX]

> Old Phase 5 step 3 required the resource model be data-driven "so Diablo Immortal is only one example". The weekly system is generic in its toggle logic but hardcodes Diablo in four places:

242. [ ] **8.2.1** — `cloneWeeklyTemplate` special-cases `game.id === "game-diablo-immortal"` (`games.js:208`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

243. [ ] **8.2.2** — `defaultTasks` / `defaultTaskTemplates.weekly` injection (`games-data.js:202,204`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

244. [ ] **8.2.3** — the Overview stat tile (`games.js:724-725,744`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

245. [ ] **8.2.4** — the literal heading `"Diablo Weekly Tasks"` (`games.js:1422`)

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

246. [ ] **8.2.5** — Make all four data-driven so any weekly game behaves identically. Also fix the cascade order in `game-resources.js:24`, where the `defaultTasks` check precedes the `trackerType === 'weekly'` branch, so a record with story-flavoured `defaultTasks` reuses them as weekly tasks.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

247. [ ] **8.2.6** — **[FIX] `resetWeekly()` destroys Diablo's task list.** `games.js:581` calls `cloneWeeklyTemplate()` with **no argument**, so `library.find(g => g.id === undefined)` yields `{}`, the Diablo special case does not match, and `OneSpaceGameResources.weekly({})` returns 3 generic tasks. Pressing "Reset Weekly Tasks" on Diablo Immortal replaces its 7 real tasks with 3 generic ones until the next ISO-week rollover restores them. Pass the game id. This phase already rewrites `cloneWeeklyTemplate`, so fix it in the same pass and add a test asserting reset preserves the game's own template.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 8.3 C.4 — checkboxes that will not un-check (approved root cause)

> `saveLibrary()` (`games.js:175`) and `saveWeekly()` (`:180`) **discard the boolean return from `safeSet`**, which returns `false` and toasts on a quota or validation failure (`index.html:927-939`). In-memory state flips, the UI re-renders checked, storage is unchanged — and the state reverts on reload. This is the most probable mechanism behind the report, and it was missing from the old plan's suspect list.

248. [ ] **8.3.1** — **Fix.** Route both through the same read-back-and-rollback pattern as `commitGameChanges()` (`games.js:176-179`), surface a real error, and add regression tests asserting (a) the toggle is an involution — two toggles return the original state — and (b) a rejected write never leaves the UI showing a state storage does not hold.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> **Secondary contributors to check during reproduction, in order:**

249. [ ] **8.3.2** — **Week rollover mid-interaction.** `ensureWeekly` (`:211-220`) discards all `done` flags and re-clones the template whenever the ISO week key changes, and it is reached from **every render** via `weeklyStats` (`:238`).

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

250. [ ] **8.3.3** — **`findChapter` is scoped to `selectedStoryGameId`** (`:498-502`), so an objective rendered for any other game silently no-ops.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

251. [ ] **8.3.4** — `toggleWeeklyTask` depends on an ancestor `.gv-tracker[data-game-id]` (`:1565`); a weekly checkbox rendered elsewhere gets no handler.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

252. [ ] **8.3.5** — Ruled out by inspection: the click delegate's `switch` (`:1522-1557`) has **no** case for `toggle-objective` or `toggle-weekly-task`, so they are handled only by the `change` listener (`:1558`) and are not double-fired.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

253. [ ] **8.3.6** — Also ruled out: `is-just-checked` styling is applied only when the new state is `done === true` (`:351`, `:396-397`), so it cannot make an unchecked box look checked.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 8.4 Games behaviour preserved from old Part B Phase 5

254. [ ] **8.4.1** — Records carry official, news, build, guide, update, community and platform links — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

255. [ ] **8.4.2** — Default task/objective templates on game records — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

256. [ ] **8.4.3** — Resource model data-driven, Diablo only one example — **[OPEN]** — see 8.2

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

257. [ ] **8.4.4** — Per-game detail/resource panel — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

258. [ ] **8.4.5** — Resources grouped into news/updates, builds/guides, official, community, game-specific tasks — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

259. [ ] **8.4.6** — Catalog, suggestions, wishlist and custom flows initialise the correct story or weekly tasks — **[OPEN]** — see 8.1

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

260. [ ] **8.4.7** — No duplicate task initialisation after rerender or reload — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

261. [ ] **8.4.8** — Every built-in and custom game discoverable via genre filter, search, add, edit, delete, progress, resources — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

262. [ ] **8.4.9** — Sessions, journal, themes, story objectives and weekly behaviour preserved — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

263. [ ] **8.4.10** — Tests for resource mapping, default task creation, genre filtering, deletion cleanup — [DONE]

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

264. [ ] **8.4.11** — Verify every Games tab, filter, search, suggestion, library, wishlist, details, resource link, task, session, journal, theme, add, edit, delete and confirmation action — [OPEN] — Phase 12

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 8.5 Remaining games defects [FIX]

265. [ ] **8.5.1** — **User-added games can never reach the spotlight.** `featuredGames()` (`games.js:1261-1263`) filters the spotlight rail to games that have `artwork`, and custom or provider-added games have none. Fall back to the deterministic `gameScene(game)` generator (`games.js:264-274`) that cards already use, so every tracked game is eligible.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

266. [ ] **8.5.2** — **Unescaped selector in focus restoration.** `withFocusPreserved` (`games.js:1608`) concatenates attribute values into a `querySelector` string without escaping. Ids come from `uid()` today so it is safe, but a `data-id` containing a quote throws out of `querySelector` and aborts refocus. Use `CSS.escape`, or match by element reference rather than by selector.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

267. [ ] **8.5.3** — **Reveal state bleeds between games.** Weekly task ids are `default-0..n` for every non-Diablo game (`game-resources.js:26`) and default chapter ids are `c1..c4` across games (`games-data.js`), while `revealedKeys` (`games.js:71`, `:104`) is a flat map. A freshly-rendered row therefore skips its reveal animation because another game already claimed that key. Namespace the reveal key by game id.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

268. [ ] **8.5.4** — **Games `world` values `neon` and `aurora` have no CSS rule** and silently fall back to the amber default — also listed in Phase 5.3; fix in whichever phase runs first.

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

269. [ ] **Gate 8** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `games/games.js`, `games/games-data.js`, `games/game-resources.js`, `server/providers/`, game tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 9

## 9.1 C.1 — a tracked title can never be untracked (confirmed defect)

> **Root cause, verified.** Every seed-add path — search dropdown (`movies.js:797`), suggestion cards (`:1247-1249`), hero (`:1048`), watchlist (`:1250-1251`), details modal (`:1234-1235`) — flows through `addSeedToLibrary`, which hard-sets `clone.custom = false` (`:442`). That single flag both suppresses the delete button (`:619`) and makes `deleteMovie` return early (`:458`). Line 460 is the **only** place anything is removed from `library`. The three status options are `unwatched | watched | watchlist` — none means "not tracked" — and `renderOverviewStats` counts `library.length` as "Titles tracked" (`:661`).

270. [ ] **9.1.1** — **Fix.** Separate two concepts currently conflated under `custom`:

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

271. [ ] **9.1.2** — **Untrack / Remove from library** — available for **every** tracked title, catalog or custom. Removes the record from `library` and the watchlist, returning it to an untracked catalog entry that can be re-added. `OneSpaceUI.confirm` then a toast.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

272. [ ] **9.1.3** — **Delete custom title** — unchanged, still `custom`-only, since a custom record has no catalog entry to fall back to.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

273. [ ] **9.1.4** — Drop the `!m.custom` guard from the untrack path, render the untrack control unconditionally on library cards and in the details panel, and make "Titles tracked" drop when a title is untracked.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

274. [ ] **9.1.5** — **Also fix [FIX]:** the watchlist is derived from two sources at once — the legacy `watchlist` id array **and** `status === 'watchlist'` (`watchlistItems()` `:360-363`) — while `addToWatchlist` (`:465-467`) only ever writes the status. Reconcile to one source of truth.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

275. [ ] **9.1.6** — **Verify.** Track a catalog movie → untrack it → it leaves Library, the tracked count decreases, it reappears as an untracked suggestion, and it is still untracked after reload. Repeat for a series and for a custom title, which must still offer permanent delete.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 9.2 C.2 — large movie images are blurred (confirmed cause)

> Not a CSS `blur()` — there is none on movie artwork. Per `assets/manifest.json`, every poster in `assets/movie-art/` is **300 × 450** (13–29 KB). Backdrops are 1920 × 1080 except `pulp-fiction-background.jpg` at 1280 × 720. A 300px source shown at 400–600 CSS px on a 2× display is upscaled 3–4×.

276. [ ] **9.2.1** — Re-source posters at a minimum of **1000 × 1500** for detail/hero use, keeping the 2:3 ratio and file naming.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

277. [ ] **9.2.2** — Keep a small variant for grid cards; serve both via `srcset` / `sizes`.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

278. [ ] **9.2.3** — Bring `pulp-fiction-background.jpg` to 1920 × 1080.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

279. [ ] **9.2.4** — Add a CSS guard so no image is scaled beyond its intrinsic width — a future undersized asset then looks visibly wrong rather than quietly blurry.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

280. [ ] **9.2.5** — Update `assets/manifest.json` dimensions and bytes; record provenance in `assets/movie-art/SOURCES.md`.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

281. [ ] **9.2.6** — Licensing constraint holds: no scraping, no unlicensed downloads. Where no licensed high-resolution image exists, render the deterministic fallback rather than shipping an upscaled blur.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

282. [ ] **9.2.7** — Note `.mv-poster-img { object-fit: contain }` (`movies.css:97`) letterboxes posters rather than filling — review alongside the resolution change.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify every stated criterion and retain the visual or automated evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 9.3 C.3 — series are effectively invisible

> `MOVIE_TYPES = ["movie","series"]` exists (`movies-data.js:17`) and there are exactly **4** series (`movies-data.js:137-142`: `tv-dark`, `tv-queens-gambit`, `tv-good-place`, `tv-chernobyl`) against 16 movies. All four carry `poster:{kind:'placeholder'}` and `backdrop:{kind:'placeholder'}`, plus `platforms:[]` and `rating:0` — so they render as generated SVG next to fully-illustrated movies, and `ratingLabel` prints `—`. They also land in the hero carousel as pure generated SVG, since the featured pool is all of `SEED_MOVIES` (`movies.js:1004`).

283. [ ] **9.3.1** — Expand to at least 12–15 series spanning the same genre range, so type filtering returns a useful set.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

284. [ ] **9.3.2** — Real local artwork at the 9.2 resolutions; remove every `kind:'placeholder'` from seed data.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

285. [ ] **9.3.3** — Populate `platforms`, `rating`, `moods`, `tags` and a substantive `blurb`.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

286. [ ] **9.3.4** — Make the `movie` / `series` filter first-class and visible, with capitalised `Movie` / `Series` labels.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

287. [ ] **9.3.5** — Keep series cards honest about shape — seasons and approximate episode length, which `libraryCardHtml` already formats — **without** episode-by-episode tracking, which stays out of scope.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> Phase 6's provider search makes catalog size far less critical, but the seeded set must still look credible offline.

## 9.4 Movies behaviour preserved from old Part B Phase 6

288. [ ] **9.4.1** — First-class `type: movie\|series` in `movies-data.js` — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

289. [ ] **9.4.2** — Series metadata, explanations, seasons — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

290. [ ] **9.4.3** — Type and genre filters — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

291. [ ] **9.4.4** — Cards, search, details, suggestions, watchlist views updated — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

292. [ ] **9.4.5** — `movies` route and storage keys preserved — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

293. [ ] **9.4.6** — Episode tracking stays lightweight — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

294. [ ] **9.4.7** — Series-specific validation in `storage-utils.js` — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

295. [ ] **9.4.8** — Backup fixtures and migration handling — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

296. [ ] **9.4.9** — Tests for mixed search, type/genre filtering, suggestion explanations, watchlist, malformed series data — [DONE]

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

297. [ ] **9.4.10** — Verify every Movies & Series tab, type filter, genre filter, search, suggestion, detail, add/remove, watched state, watchlist, library and reload flow — [OPEN] — Phase 12

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 9.5 Confirmation dialog consistency [FIX]

298. [ ] **9.5.1** — `deleteMovie` (`movies.js:459`) uses native `window.confirm`, while every other domain uses `OneSpaceUI.confirm` (`shared/domain-ui.js:26`) with the shell's modal stack, focus trap, Escape handling and inert background. A native dialog cannot be styled, ignores reduced-motion and theme, and breaks the focus-return contract the rest of the app honours. Move it to `OneSpaceUI.confirm`, which the new untrack flow in 9.1 already requires.

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

299. [ ] **Gate 9** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `movies/movies.js`, `movies/movies-data.js`, `movies/movies.css`, `assets/movie-art/`, `assets/manifest.json`, movie tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 10

## 10.1 C.5 — real imagery and substantive descriptions

> `explore-data.js` holds 12 destinations, each pointing at `assets/destinations/<id>.svg`. These are **conceptual SVG illustrations, not photographs** — the old REVISED plan already flagged this as a missed requirement. Each record has `summary` and `details`, but the depth is uneven.

300. [ ] **10.1.1** — Real, properly licensed local imagery per destination at hero and card resolutions, following the 9.2 sizing and `srcset` rules.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

301. [ ] **10.1.2** — A substantive description per destination: what the place is, why it suits its tagged categories, best season and why, rough trip length, budget character, and what a traveller actually does there. `summary` stays short for cards; `details` carries the long form.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

302. [ ] **10.1.3** — Never blank: alt text always present; the deterministic fallback used only on a genuinely failed request.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

303. [ ] **10.1.4** — Licensing constraint maintained; attribution in a `SOURCES.md` beside the assets.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

304. [ ] **10.1.5** — **All destination art stays under root `assets/destinations/`** so the three `^assets/` validators (`storage-utils.js:36`, `local-discovery.js:5`, `trip-board.js:6`) keep accepting previously-saved user records.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 10.2 Resolve the `explore.js` discrepancy [OPEN]

305. [ ] **10.2.1** — Confirmed open: `explore.js` is required by `tests/tracker-regression.test.js:4` but is **not** among the 22 `<script src>` tags — the browser uses `explore-global.js`. Decide whether `explore.js` is loaded by `index.html` or whether its logic belongs in `explore-global.js`, and make the test and the browser agree. Note `explore.js` **auto-invokes `api.mount(root)` at load**, so simply adding the tag would double-mount.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 10.3 "More to explore" is not the final section [FIX]

306. [ ] **10.3.1** — Both the old REVISED plan (non-negotiable #6) and old Part B Phase 4 step 13 require "More to explore" be the last Explore section. It is currently **third of four**: Destinations → **More to explore** (`index.html:551`) → Explore shortcuts → chill strip. Move it last.

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the complete stated behavior and applicable acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## 10.4 Explore behaviour preserved from old Part B Phase 4

307. [ ] **10.4.1** — `explore-data.js` holds the curated destination catalog — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

308. [ ] **10.4.2** — Destination fields: ID, name, country/region, categories, budget, duration, season, style, tags, summary, details, links, image, fallback — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

309. [ ] **10.4.3** — `explore.js` holds persisted destination preferences — [DONE] — but see 10.2

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

310. [ ] **10.4.4** — Destination type, climate/season, trip length, budget, pace, interests, departure region — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

311. [ ] **10.4.5** — Deterministic, explainable recommendation ranking — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

312. [ ] **10.4.6** — Show why each destination was recommended — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

313. [ ] **10.4.7** — Preference controls, recommendation cards, details, save/favorite, shortlist/trip board, Explore-only shortcuts — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

314. [ ] **10.4.8** — "Surprise me" as a filtered random recommendation — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

315. [ ] **10.4.9** — Responsive destination images with fallback modelled on `visual-utils.js` — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

316. [ ] **10.4.10** — Accessible alt text; never a blank destination card — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

317. [ ] **10.4.11** — Tests for filtering, stable ranking, saved destinations, Explore-only shortcuts, malformed data — [DONE]

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

318. [ ] **10.4.12** — Verify preference controls, search/filter submission, recommendation cards, detail open/close, save/remove, notes, trip-board actions, Surprise Me, image fallback and reload — [OPEN] — Phase 12

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

319. [ ] **10.4.13** — Keep "More To Explore" last — **[OPEN]** — see 10.3

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

320. [ ] **Gate 10** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `explore/`, `index.html`, `assets/destinations/`, `assets/manifest.json`, Explore tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 11

> Old Part B Phase 3, personal half. All delivered; must not regress.

321. [ ] **11.1** — `makeCheckListController()` refactored into reusable add / edit / toggle / delete — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

322. [ ] **11.2** — Deletion routed through the existing modal/confirmation pattern — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

323. [ ] **11.3** — Toast and `aria-live` message after successful deletion — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

324. [ ] **11.4** — Separate storage for goals, routines and habits — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

325. [ ] **11.5** — Completion counts and progress summaries — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

326. [ ] **11.6** — Optional habit frequency / target metadata — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

327. [ ] **11.7** — Clear empty states — [DONE]

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Re-verify this preserved requirement through the applicable regression and browser checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

328. [ ] **11.8** — Verify add / edit / check / delete / cancel after rerender and reload — [OPEN] — Phase 12

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> **[NEW] Where Work's removed content lands.** Phase 3 strips five non-work surfaces from the Work page. None of them moves to Personal:

329. [ ] **11.9** — Next-up tasks (`orbit-tasks`) — Productivity — Productivity owns that key

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

330. [ ] **11.10** — Pomodoro timer mirror — Productivity — Already lives there

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

331. [ ] **11.11** — Countdowns (`orbit-countdowns`) — Productivity — Already rendered there

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

332. [ ] **11.12** — Quick note (`orbit-notes-list`) — Notes — Notes owns that key

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

333. [ ] **11.13** — Recently-opened shortcuts — Shortcuts / Home — Space-scoped surface

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Verify the stated behavior and retain evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

> Personal's own goals, routines and habits are unchanged. Nothing is deleted — each surface already exists on its owning page, so this is removal from Work, not a migration.

334. [ ] **Gate 11** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `personal/personal-controller.js`, `index.html`, Personal tests. Acceptance: Applicable regression tests pass and specified UI behavior is verified.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 12

> Old Part B Phase 8, extended.

335. [ ] **12.1** — Run the complete recursive JavaScript parse test and all Node tests: `node --test tests/`.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

336. [ ] **12.2** — **New tests** added by this plan: structural assertions (1.7); domain-boundary assertions (Phase 3); hidden-shortcut round trip (7.1); tracker-type inference and the toggle-involution regression (8.1, 8.3); untrack behaviour (9.1); provider normalisation, error, timeout, rate-limit and offline states against the mock provider (6.1).

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

337. [ ] **12.3** — Expand Node tests for pure Work, Explore, shortcut, game, movie, visual-state and migration helpers.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

338. [ ] **12.4** — Test schema validation, migration defaults, backup/restore, reset and storage rollback.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

339. [ ] **12.5** — Browser-level smoke tests for every top-level route; `tests/browser-smoke.mjs` exports `routes(tab)`, `layout(tab)` and `workLifecycle(tab)`.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

340. [ ] **12.6** — Test navigation, add/edit/delete, modal close/cancel, persistence after reload, filters, task checkboxes, close/reopen, backlog/history, reminders, image fallback and external links.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

341. [ ] **12.7** — Start the static server and inspect the console for uncaught errors and failed local assets.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

342. [ ] **12.8** — Verify Work hierarchy and close-all behaviour; Personal delete confirmation; Explore recommendation explanations and image fallback; game-specific links and default tasks across multiple genres and **both tracker types**; movie and series genre views.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

343. [ ] **12.9** — Verify backup export/import with all new data; reset behaviour and unrelated `localStorage` preservation.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

344. [ ] **12.10** — Verify keyboard-only navigation and reduced-motion mode — every route genuinely still.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

345. [ ] **12.11** — Verify desktop, tablet and mobile layouts at 1440 / 1024 / 760 / 390 px.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

346. [ ] **12.12** — **Offline pass:** provider unreachable → visible degraded state, no silent local fallback presented as global results.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

347. [ ] **12.13** — Verify every button from the Phase 0.5 inventory has a success test and an applicable cancel / error / persistence test.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

348. [ ] **12.14** — Set `MISSING_ASSET='assets/destinations/azores.svg'` on `tests/browser-server.js` to exercise the image-fallback path.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

349. [ ] **12.15** — Tick off every remaining box in `docs/IMPLEMENTATION-STEPS.md` and confirm none is left unchecked without a stated reason.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

350. [ ] **12.16** — All documentation updates are **Phase 13.3** — do not duplicate them here.

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: Verify this requirement with its phase acceptance checks.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

351. [ ] **Gate 12** — Complete this phase’s requirements and applicable defect acceptance checks before advancing

   Files: `tests/`, `docs/implementation-evidence/`, `docs/IMPLEMENTATION-STEPS.md`. Acceptance: All planned verification checks pass with retained evidence.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

## Phase 13.3 — Final documentation

352. [ ] **13.3.1** — `README.md` — folder structure, data model, provider setup and offline behaviour, server command, test commands, backup compatibility, cinematic interaction rules, accessibility behaviour, scope limits.

   Files: The document named in this step. Acceptance: Documentation matches actual delivered behavior and recorded verification.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

353. [ ] **13.3.2** — `VERIFICATION.md` — a fresh acceptance run at the end; fix the `18973` → `18974` port error and the bare test filenames.

   Files: The document named in this step. Acceptance: Documentation matches actual delivered behavior and recorded verification.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

354. [ ] **13.3.3** — `docs/REVISED-IMPLEMENTATION-PLAN.md` — reconcile with what Phase 6 actually delivers, so the two documents stop contradicting each other on the provider question.

   Files: The document named in this step. Acceptance: Documentation matches actual delivered behavior and recorded verification.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |

355. [ ] **Gate 13.3** — Confirm every planned step is implemented and verified and report the actual delivery evidence

   Files: `docs/IMPLEMENTATION-STEPS.md`, `VERIFICATION.md`. Acceptance: No unchecked implementation requirement remains.

   | Status | Evidence |
   |---|---|
   | Pending | Pending |
