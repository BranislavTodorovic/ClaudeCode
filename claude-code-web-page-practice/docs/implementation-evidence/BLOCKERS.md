# Baseline blockers — September 21, 2026

## Backup version contract: awaiting user clarification

Phase 0.4 source inspection found that `storage-utils.js:107` exports version 4, while `storage-utils.js:109–112` accepts versions 2, 3 and 4 with version-specific required-key lists. `orbit-trip-board` was added after the version 3 key snapshot. `index.html:2637` also explicitly accepts version 4 imports.

The standing plan describes version 3 as current (§0.9–0.10), requires a live-origin version 3 export (§0.12), and protects version 3 as an invariant (§1.9). Those requirements disagree with the existing implementation. No export or storage mutation has been attempted to resolve the conflict.

Proposed correction, not yet applied: retain version 4 as current, retain version 2 and version 3 import compatibility and all existing keys, and capture a genuine version 4 backup from the live origin at §0.12. Update the standing plan/checklist references accordingly after confirmation.

Work stopped at §0.4. Steps 0.1–0.3 have evidence; 0.4 is partially recorded in `baseline-contract.json`. Later baseline work, regrouping, features and final verification have not started. Only documentation and implementation-support scripts have changed; application sources are unchanged.

## Existing browser smoke helper has an outdated assertion

`tests/browser-smoke.mjs:7` expects Explore to contain “Your next change of scenery”; the actual visible heading is “Somewhere new”. The helper therefore fails at Explore. Direct route inspection verified the correct body page identity and rendered headings for all 11 routes, with no console errors or broken visible images. See `baseline-routes.json`.

Retain this finding for the already planned Phase 12 browser smoke update; do not present the existing helper as passing.

## Resolution — September 21, 2026

The user authorized fixing the backup-version conflict and proceeding. Version 4 remains current, version 2/3 imports remain supported, and Phase 0.12 will export version 4. The plan and checklist now reflect this correction. The backup-version blocker is resolved.
