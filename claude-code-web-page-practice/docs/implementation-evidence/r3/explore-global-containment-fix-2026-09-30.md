# Explore global frame containment fix — 2026-09-30

Status: IMPLEMENTED / NOT VERIFIED. Step 19 PENDING; Gate R3 OPEN. User reported continued global misalignment after the earlier overflow fix. Prior changes, screenshots and evidence are preserved. Main / HEAD 6a68232, uncommitted work retained.

## Authority and failure classification

Reopened the relevant R3 sequence in IMPLEMENTATION-STEPS.md, rather than restarting full authority analysis. This is active Explore acceptance: step 10 static composition/common frame, step 11 desktop/responsive/actual 200% containment, and step 16 consistency when returning from legacy routes. Earlier viewport overflow checks were insufficient: two individually bounded and centered containers can still disagree on the page's intended width. Step 11 remains the next unresolved item until new user confirmation.

## Reproduced cause

At a normal 3440px viewport (3425px client width), the landing frame is capped at 2048px: left 688.5, right 2736.5, content left 730.5/right 2694.5. The retained travel body was separately capped at 1800px: left 812.5/right 2612.5, content left 854.5/right 2570.5. The content edges differ by 124px on both sides. Root scrollWidth equals clientWidth, so previous overflow-only tests falsely treated that page as layout-consistent. The discrepancy also exists at ordinary 1920px desktop width, once the retained body's independent cap applies.

The inherited legacy `.wrap` also retains a width/margin-left transition used by the old sidebar layout. Explore overrides final width/margin, but had not removed that unrelated transition. It is now disabled for Explore to keep its outer frame stable when resizing/returning from legacy pages; no claim is made that this transition alone caused the reported native sideways scrolling.

Inspected actual root/body/wrap/view/scene/landing/owner geometry, constraints, transforms and transitions. Root/body/view were full client width and untransformed; scene imagery remains locally contained in its decorative host; portal image cropping remains local. Retained grids, owner forms, trip board, shortcuts and More To Explore were within viewport but used the narrower inconsistent frame.

## Fix

Explore landing `.osr-frame` and retained `.page-body` now share one CSS sizing contract: width:min(100%,var(--osr-content-max)), border-box, min-width:0, identical inline padding and auto margins. The existing shared max is 2048px. Removed the independent 1800px cap. The Explore root view explicitly fits its parent; the legacy wrap has no width/margin transition in Explore. Prior field/header/utility wrapping and open overflow are preserved; no new global overflow hiding or required-content clipping added. No owner, storage, routing or scene asset changes.

At 3440px, both frame boxes now read 688.5–2736.5, and both content edges 730.5–2694.5. Physical full-page screenshot inspection confirms landing summaries/portals and travel tools/board/shortcuts/More To Explore share common left/right edges. The deliberate inset hero copy, room's full-bleed decorative image and one-card final section are not treated as content overflow.

## Regression and verification

Extended the real DOM helper (`tests/explore-layout-audit.mjs`) to check outer wrap/view/scene bounds, centered frame, identical landing/owner frame bounds, and six corresponding section content edges. It still checks 11 section scroll widths and all applicable visible controls. Two new regressions reject the measured wide-desktop cap mismatch despite no root overflow, and require proper centering/matching edges.

Browser audit with expanded credits passes at 3840/3440/2560/2048/1920/1715/1440/1024/857/760/390/320, with zero containment/alignment/overflow violations. Document width equals client width at each. Machine-readable results: `explore-global-containment-audit-2026-09-30.json`. Return from Settings, reload, and populated original-owner trip board also pass at 1920; disposable Lisbon record removed via owner confirmation. Normal page logs zero errors. Full-page wide screenshot: `screenshots/explore-containment-postfix-wide.png`.

Focused Explore/owner/scene/foundation/structure: **45/45**; full suite: **202/202**; zero failures/skips. Commands use `node --preserve-symlinks --preserve-symlinks-main --test`. `git diff --check` passes. Final CSS/helper changes reviewed; Work/Personal accepted evidence and unrelated state preserved.

These are actual in-app rendered layout measurements, NOT native Edge 200% evidence. No Computer Use or Chrome/Edge control. Native 200% remains user-only and unpassed; previous five failed native screenshots remain valid failure history.

## Resume and manual check

Step 10's affected frame geometry and independent step 11 widths are rechecked. Exact next unresolved item: Explore step 11, new manual normal-width and native-200% result. Keep step 19 pending and do not begin Games. After genuine manual confirmation, reconcile step 11 and make the documented step 19 decision.

In the same native Edge window, hard-refresh the current files. At normal 100% inspect the full page, checking common centered left/right edges from summaries/portals through travel tools, board, shortcuts and More To Explore. Resize once, navigate to another existing page and return to Explore. Repeat at actual menu zoom 200%, with credits and search filters expanded; attempt sideways scrolling/panning at top, middle and bottom and confirm no shifted frame/empty off-screen area, clipped controls or overlapping portal captions/arrows.

Required screenshots: normal-100% full-page capture or top/middle/bottom captures showing both horizontal edges; at 200%, hero/nav with Edge zoom menu, portals plus expanded credits, and lower travel-tools/board/shortcuts/More To Explore (additional capture if needed). Report separately whether 100% and 200% pass and whether sideways movement succeeds anywhere. No new saved trip is required; include existing card actions if present.
