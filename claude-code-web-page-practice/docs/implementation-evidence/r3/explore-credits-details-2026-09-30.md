# Explore credits control, scene stability and destination details — 2026-09-30

**IMPLEMENTED / NOT VERIFIED.** R3 OPEN; Explore step 19 PENDING. Work and Personal remain VERIFIED. No Games work started. Existing Explore changes and older evidence remain intact; main / HEAD `6a68232`, uncommitted work preserved.

## Relevant authority and active requirements

Reopened the relevant sections, rather than repeating the full authority reconstruction:

- `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md` §6.2: portal cards open their mapped surface; §15.3–15.5: local/bundled/user-owned Explore search, summaries and five portals; §16.1: destination cards/details, attribution and fallback imagery.
- `docs/IMPLEMENTATION-STEPS.md` items 300–303: licensed local card/hero imagery, substantive destination-specific descriptions (what/why/season/length/budget/activities), short summaries vs long-form details, alt/failure fallback, colocated source ledger.
- R3 steps 10–12: static/responsive containment, actual native 200% and keyboard/focus/ARIA/touch; steps 15–18: unavailable/media failure, routes, regression, evidence. First unresolved remains step 11. Step 12 interaction confirmation also remains pending.

No authority requires a page-wide invisible credits disclosure. The user's explicit preference supersedes that implementation choice. Whole-card portal buttons remain intentional, as already documented. Credits are supporting provenance; destination content belongs in the existing detail experience.

## Reproduction: the empty click and apparent enlargement

The supposedly empty region was the native credits SUMMARY below the five portals. Its `display:flex; min-height:44px` made it stretch across the available width, with no bordered control and no visible disclosure marker. At 2048px viewport it measured **1949×44px**, while the short text occupied only the left side. A real click at **x1175/y1178**, below the Travel Guides area and far from the text, opened the credits DETAILS.

Opening it inserted credits into normal scene flow. In the reproduced 2048×1440 viewport, the world/scene/image height changed **1440 -> 1652.47px**. The decorative image uses `object-fit:cover`; its rendering scale changed **1.5303 -> 1.7556** (about 14.7% larger), changing the crop. Foreground hero/portal dimensions, width, CSS transform and CSS zoom stayed unchanged. Thus the perceived enlargement was a **background-layout defect**, rather than a transform scaling the entire UI. Downstream tools also moved because the inline content grew.

The earlier portal-boundary record remains historical: it correctly identified intentional inside-card behavior, but did not identify this page-wide SUMMARY as the source of the user's empty-space credits click. This record resolves that specific report.

## Implemented behavior

- Replaced DETAILS/SUMMARY with a visibly bordered **Scene & photo credits** BUTTON and decorative book icon, with `aria-haspopup="dialog"` / `aria-controls="domainOverlay"`. The surrounding row is inert. The visible target measured approximately **204×46px** at the desktop check, rather than 1949px wide.
- The button opens the existing semantic domain dialog, with its existing focus trap, Close/Escape and return-to-opener behavior. No inline disclosure, stretched target or invisible expansion region remains. Provenance is held in a TEMPLATE outside rendered layout and occupies the full dialog width when opened.
- Empty row/above/below clicks do nothing. The reported x1175/y1178 blank point stays inert. Native Enter and Space activate the button; Escape closes and returns focus. Source/license links remain available, with 44px targets in this provenance dialog.
- Keeping provenance outside scene flow prevents background recropping and downstream page movement. No global overflow hiding, page-scale workaround, new timer/store/provider or generated/replaced asset added.
- Destination detail hero imagery now spans the full available dialog width at 16:9; it was previously confined to one column of the shared form grid. This CSS is scoped to Explore.
- Existing destination map/planning links are labelled **Planning link**, rather than implying they are an official destination website. Other domain link labels are unchanged.
- User-added destinations lacking source metadata now state **User-added location; no image source or license supplied**, instead of reusing the generic bundled-artwork provenance text. Supplied metadata is retained.

Implementation files: `explore/explore-redesign.js`, `explore/explore-redesign.css`, `explore/local-discovery.js`, `explore/discovery-ui.js`. Coverage: new `tests/explore-credits-audit.mjs`, expanded `tests/explore-redesign.test.js` / `tests/explore-imagery.test.js`. README/checklist/progress and evidence updated.

## Destination-content verification

Descriptions were **already present and had not been replaced by credits**. Featured **Explore →** buttons open existing full details; destination search cards show an excerpt and a **Details** action. The local normalizer passes each maintained record's `details` to the actual renderer's separate `provider-description` paragraph. The detail dialog presents hero imagery, full travel description, supplied metadata and source/license links. Missing description/image states are explicit; absent fields are not fabricated. Photography still falls back locally only after an actual image error.

All twelve maintained places were opened through the actual search/detail UI; each loaded its intended local hero image and had two photo source/license links:

| Place | Description words | Photo/source state |
|---|---:|---|
| São Miguel | 102 | Loaded / CC BY-SA 4.0 |
| Ubud | 108 | Loaded / CC BY-SA 4.0 |
| Budapest | 101 | Loaded / CC0 |
| Chiang Mai | 106 | Loaded / CC BY 4.0 |
| Monteverde | 104 | Loaded / CC BY-SA 4.0 |
| Crete | 102 | Loaded / CC BY-SA 3.0 |
| Edinburgh | 101 | Loaded / CC BY 2.0 |
| Kyoto | 99 | Loaded / CC BY-SA 4.0 |
| Lisbon | 94 | Loaded / CC BY 4.0 |
| Québec City | 101 | Loaded / CC0 |
| Lake Bohinj | 105 | Loaded / CC BY-SA 4.0 |
| Valencia | 106 | Loaded / CC BY-SA 3.0 |

Existing catalog/file checks verify all 12 card WebPs at 640×420, hero WebPs at 1600×900, deterministic SVG fallbacks, meaningful alt text and source/manifest/ledger agreement. Added actual-renderer checks verify exact long-form descriptions, hero paths, original source/license links, separate provenance and truthful missing user-entry states. A real handler regression checks initial photo, error-only fallback and terminal unavailable state. No live API dependency introduced. The authoritative local catalog and stored records are unchanged.

## Browser and regression evidence

`explore-credits-details-audit-2026-09-30.json` preserves the pre-fix reproduction, actual outside clicks, all 12 detail records and post-fix measurements.

- At widths **3440/2048/1920/1715/1440/1024/857/760/390/320**, credits-boundary, all five portal-boundary and page-containment audits passed. Each target was brought into view before its audit. Thirty real blank-space clicks (three per width) kept the credits closed.
- Direct pointer activation kept scene/world/frame/hero/summary/portal/owner geometry, page width and scroll position unchanged. This compares actual pointer clicks, avoiding automation's own scroll-to-control behavior.
- Full-width final provenance layout rechecked at **2048/857/390/320**: unchanged scene geometry, bounded dialog and no internal horizontal overflow. Destination dialog rechecked at the same widths: loaded full-width hero, description retained, bounded dialog/document and no horizontal overflow.
- Enter/Space/Close/Escape and focus return verified. All five portal owner/availability actions preserved; settled Experiences/Travel Guides show their respective truthful notice, Destinations focuses search, Bucket List focuses the board, Discover More focuses the final resource control. Normal browser error log empty.
- Physically inspected settled screenshots: `screenshots/explore-credits-control-postfix.png`, `explore-credits-dialog-postfix.png`, `explore-destination-detail-postfix.png`. The final Lisbon capture confirms a loaded hero at opacity 1, full-width imagery and full description. Initial captures during the image fade were replaced with settled captures; they were not treated as missing-media acceptance evidence.
- **57/57 focused**, **214/214 full**, zero failures/skips; `git diff --check` passes. Focused command uses explore-redesign, explore-preservation, explore-imagery, discovery-ui-write-failure, scenes, redesign-foundation and structure tests. Full command: `node --preserve-symlinks --preserve-symlinks-main --test tests/`.

These are in-app viewport checks, **not actual native Edge zoom evidence**. No Computer Use or external-browser control used.

## Required manual checks and exact next checkpoint

Hard-refresh Edge, then complete and report **native 100% and native 200% separately**:

1. Confirm the bordered **Scene & photo credits** button is clearly visible. Click empty space below/beside all five portals, including the previously problematic point: it must not open credits or activate a portal. Click inside a portal: whole-card activation still applies.
2. Open credits using its button. Only a provenance dialog should appear; the travel room and page beneath must not enlarge, recrop, shift or scroll. Verify author/source/license links remain readable/reachable. Close and confirm the same page position. Repeat with Tab, Enter, Space and Escape; focus must return to the button.
3. Open featured destination **Explore →** and search-result **Details**. Confirm full-width destination image, distinct substantive description and separate source/license information; scroll the dialog to reach all content/actions. Browse/load all twelve maintained destinations and confirm their image/description/source state. No current prices/weather/live claims are expected.
4. Complete the remaining layout check: hero/navigation, summaries, all portal rows, travel tools, trip board, shortcuts and More To Explore. Verify aligned edges, readable/reachable controls and no horizontal document movement or off-screen empty region. Navigate away/back and recheck.

Required screenshots at **both** zoom levels: (a) portal rows + bordered credits button + empty surrounding area, pointer at the previously problematic point; (b) open credits dialog; (c) destination detail showing image/description, with an additional scrolled capture for source/license and actions if needed; (d) top/middle/bottom page containment. Include Edge's **200% indicator** in one capture. Also report the click/keyboard/shift results; static images alone cannot prove behavior. A before/after pair around opening/closing credits is useful if any room/page shift persists.

**Next unresolved: R3 Explore step 11, post-fix native Edge 100% / 200% layout confirmation; step 12 credits/portal/detail interaction manual confirmation remains pending.** Reconcile those results and remaining independent evidence in documented order before making the step 19 decision. Explore remains IMPLEMENTED / NOT VERIFIED until those manual checks pass. No next world begins here.
