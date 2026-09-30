# Explore portal activation boundary — 2026-09-30

Explore remains **IMPLEMENTED / NOT VERIFIED**. R3 remains OPEN; step 19 is PENDING. No next world started.

## Report and authority

The user reported activation directly below a portal icon, with arrows pointing to the lower portal area. Original screenshot is preserved as `screenshots/explore-portal-manual-report.png`. This is active R3 acceptance work: step 12 (keyboard/focus/ARIA/touch and control boundaries), alongside the still-unresolved step 11 native Edge 100% / 200% layout check.

The current authority, `docs/LIVE-EXPERIENCE-REDESIGN-SPEC.md` §6.2 and §15.5, describes the portal card as the control opening its submodule and lists these five Explore portals. It does not specify an icon-only target. Whole-card activation is consistent with the existing Home, Work and Personal patterns; R2 `home-static-fidelity-2026-09-29.md` explicitly records full-tile portal actions. R3/R5 availability classifications and canonical owner mappings remain as recorded in the Explore analysis. Experiences and Travel Guides continue to disclose future availability; no new dedicated submodule is claimed.

## Reproduction and cause

Before this change at a 2048px in-app viewport, each portal had a DIV card containing an absolutely positioned transparent button (`inset:0; width:100%`). Its button measured about 370×228px inside a 372×230px visible card; the visible arrow measured only 30×30px. Thus clicking 7px below the icon while still inside the card activated the full-card button. A real pointer click at that point in Experiences displayed its existing availability notice and focused its button.

A separate real click 8px below the visible Experiences card did not activate it: the status stayed hidden, focus stayed on BODY, and scroll stayed at 0. Read-only hit testing below all five cards resolved to the surrounding page rather than a portal action. Activation outside the card was **not reproduced**. The screenshot alone cannot establish exact coordinates, zoom or whether a click occurred inside the card. The shared hover lift also moved card boundaries by 4px; this has been removed for Explore portals to keep their edge stable.

**Conclusion:** activation below the arrow inside the card is intended whole-card behavior. The transparent overlay made the interaction boundary ambiguous. We have removed that overlay rather than narrowing the target to an icon without authority support. No evidence establishes an outside-card activation defect; that must be checked manually in the user's Edge scenario.

## Change and preservation

- Each visible Explore portal is now the single semantic BUTTON, including its photo, caption and decorative arrow. No nested action control or stretched transparent overlay remains.
- The whole card has a pointer cursor, accessible name, existing focus outline and hover border feedback. Hover no longer translates the card. The 30px arrow is decorative and does not form a separate target; the full card exceeds the 44px target requirement.
- Future labels, existing owner actions, photo/scene assets, fallback handlers, saved trips/preferences, canonical data, and the global containment fix are preserved. No assets generated/replaced; no global overflow suppression added.

Implementation files: `explore/explore-redesign.js`, `explore/explore-redesign.css`. Coverage: `tests/explore-portal-audit.mjs`, `tests/explore-redesign.test.js`. README/checklist/progress updated; older evidence retained unchanged.

## Verification

`explore-portal-boundary-audit-2026-09-30.json` records the DOM audit and real outside clicks. All five cards passed at viewport widths **3440, 2048, 1920, 1715, 1440, 1024, 857, 760, 390 and 320**: one labelled semantic button, no interactive descendants, stable card boundary, hidden decorative icon, four inside points mapping to the correct portal, and four adjacent outside points mapping to no Explore action. Existing document-width/centering/section-alignment checks also passed at all ten widths. Each card was scrolled into view before testing its boundary; an initial off-screen 320px observation was rejected by the audit and then explicitly rechecked, with both observations retained.

At 2048px, **20 real pointer clicks** at the top/bottom/left/right outside points left route, scroll and portal status unchanged. Clicking the Experiences photo activated its truthful notice. Travel Guides displayed its own notice. Destinations focused the existing owner `q` input; Bucket List focused `.trip-board`; Discover More focused existing `explore-random`. Tab from Travel Guides focused Bucket List; Enter activated its canonical trip board. Screenshot `screenshots/explore-portal-postfix-desktop.png` was physically inspected: all five captions/arrows visible, aligned cards, focused card outlined, owner sections retained.

Five added regressions check action leakage, nested overlays, moving boundaries, inactive inside areas/small targets and untested off-screen points. Focused Explore suite: **50/50**, full suite: **207/207**, zero failures/skips. `git diff --check` passes. Normal supported width checks are in-app viewport evidence; they are **not native Edge zoom evidence**. No Computer Use or external browser control used.

Git: main / HEAD `6a68232`; all pre-existing valid uncommitted Explore work and evidence retained. No commit made.

## Required manual check and next checkpoint

Hard-refresh Edge. At native **100% and 200%**, separately:

1. For each of the five portals, click its photo, caption, arrow, and space below the arrow **inside the visible card**. Each should invoke the same one action: Destinations -> search; Experiences/Travel Guides -> truthful availability notice; Bucket List -> trip board; Discover More -> final resource control.
2. Click empty space immediately below and beside each card **outside its visible border**, including the positions marked in the user's screenshot. No portal action, unexpected scrolling/navigation or new availability notice should result. Hover must not move the boundary. Nearby actual credits controls should retain their own function.
3. Tab through portals: one focus stop per card, clearly visible outline; Enter and Space each activate once. No second arrow focus stop.
4. Complete the outstanding layout check through hero/navigation, summaries, portals, expanded credits, travel tools, trip board, shortcuts and More To Explore. Confirm section alignment, no clipped required controls and no horizontal page movement/off-screen empty area at top/middle/bottom; navigate away/back and recheck.

Required captures at **both zoom levels**: (a) all portal rows including visible lower borders/gaps, pointer positioned at the formerly problematic empty point; (b) focused card showing its outline; (c) hero/navigation and summaries; (d) expanded credits/travel-tools transition; (e) trip board/shortcuts/More To Explore, using extra captures where necessary. Include Edge's **200% indicator** in one capture. Report which inside/outside clicks passed or failed; static screenshots cannot prove activation boundaries.

First unresolved item remains **R3 Explore step 11** (native Edge 100% / 200% layout confirmation), with **step 12 portal boundary manual confirmation also pending**. After the user supplies passing results and evidence, reconcile those steps and assess remaining acceptance through steps 18–19 in order before starting Games. This turn does not mark either manual check passed.
