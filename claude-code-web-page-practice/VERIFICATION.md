# Acceptance run — September 17, 2026

Implemented and verified in the existing project without replacing its router or original Games/Movie modules.

## Automated checks

- Baseline: 14/14 existing Node tests passed.
- Final: 31/31 tests passed across `tests/data-regression.test.js` and `tests/tracker-regression.test.js`.
- Every application `.js` file and the inline shell script parsed; `tests/browser-smoke.mjs` also passed `node --check`.
- Tests cover lifecycle close/reopen and idempotence, archived task snapshots, combined filters, local date boundaries, invalid fields, orphan references, transactional quota rollback, version-2 migration, version-3 completeness, backup round trips, reset isolation, destination ranking and malformed catalog entries, shortcut ownership/duplicates, Personal confirmation and failed saves, game resources/templates/deletion cleanup, and movie/series metadata and watchlists.

## Browser checks

Performed through the Codex in-app Browser. The normal app at localhost:8973 was inspected; mutable acceptance tests used the separate localhost:18974 origin. A second disposable server at localhost:18974 deliberately withheld one destination SVG.

| Check | Result |
| --- | --- |
| All 11 top-level routes | Passed route smoke checks; no uncaught console errors on the normal test server. |
| Project creation and deadline | Created QA Development, saved description/deadline, and saw it in Work summaries. |
| Story and task creation | Saved analysis and deadline; created a task with an estimate. |
| Close / backlog / reopen | Close completed the task (1/1); backlog contained the story; reopen and reload retained task completion. |
| Defect and blocked state | Edited an imported story to a blocked defect and saved execution notes; task checkbox updated counts. |
| Personal deletion | Cancel retained the goal; confirmed deletion removed it and produced a success toast. |
| Explore matching | Nature + medium budget returned São Miguel and Lake Bohinj, each with the matching reasons. |
| Shortlist and preferences | Saved destination and preference choices survived reload. |
| Shortcut ownership | Explore creation locked ownership, retained a description, and produced no matching link in Work or Personal. Editing changed the description; deletion cancel retained the shortcut. |
| Games resources | Diablo Immortal showed official, Blizzard news, guide, community and Battle.net resources and seven game-specific default tasks. |
| Games defaults and filters | A custom Racing weekly tracker started with three weekly tasks; genre filtering found it; reload kept exactly three tasks. |
| Movies & Series | Series + Comedy returned The Good Place with explanation, four-season details and successful watchlist addition. |
| Real backup export/import | Downloaded a version-3 JSON file, verified its Work item/task/history and saved destination fields, restored that exact file, and confirmed the original Work completion and Explore data returned. |
| Complete fixture import | Version-3 fixture restored notes, project hierarchy, task, deadline and reminder metadata. |
| Reset | Reset the disposable test origin; confirmed zero Work cards, no saved destinations, no QA shortcut, and the fresh welcome state. |
| Image fallback | With `assets/destinations/azores.svg` intentionally returning 404, details still displayed a 180px illustrated fallback and readable content. The expected failed request was confined to that test server. |
| Responsive layouts | Explore checked at 1440, 1024, 760 and 390px. Work, Projects, Personal, Explore, Games and Movies checked on mobile without document overflow or broken visible images. Work edit dialog fit a 390px viewport (355px dialog). |
| Keyboard and motion | Reduced-motion setting checked, keyboard Enter used for Personal add, task checkboxes exercised, Escape closed the destination dialog and returned focus to Surprise me. Mobile navigation was tested through More. |

The download event was not reported by the browser bridge, but the actual exported file was found on disk, inspected and successfully re-imported. Native restore/reset confirmations also outlived individual browser calls; final visible state confirmed both operations completed.

## Scope and limits

- Reminders run while the page is open; there are no background push notifications.
- Destination illustrations and recommendations are local editorial content, not live travel inventory or photos.
- Game resource links include direct curated links and clearly labeled search links; third-party destination availability was not exhaustively crawled.
- Series track title-level watch state and optional seasons, not episode-level progress.
- Automated tests prove unrelated storage preservation using an in-memory storage implementation; existing user data on the normal app origin was not reset.
- Browser coverage is a smoke/acceptance run, not exhaustive screen-reader certification or coverage of every possible browser engine and media query.

See README.md for architecture, schema limits, migration behavior and repeatable commands. The disposable test data was reset after verification.
