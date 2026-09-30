# Explore native-200% failure and layout fix — 2026-09-30

Status: IMPLEMENTED / NOT VERIFIED. Step 11 FAILED in the user's native Edge check; post-fix native check REQUIRED. Step 19 PENDING. Gate R3 OPEN. Personal VERIFIED. Main / HEAD 6a68232; prior legitimate uncommitted work preserved.

## Failed native evidence

The user reported sideways page movement revealing off-screen/empty content at actual native Edge 200%, and did not pass the remaining native checks. Five supplied screenshots are preserved unmodified as `screenshots/explore-native-edge-200-failed-1.png` through `-5.png`. They show portals/credits, travel tools, empty board, six shortcuts and final More To Explore. Native provenance is the user's explicit report; cropped captures without browser chrome do not independently show the zoom setting. No failed evidence is replaced.

SHA256, in attachment order:

1. 46EEAF9E7EA6F2C8FE03E3E6E970D6F85D3F705832230A0D6F531C0C990118FF
2. 291379D00620285FCEECD1B2D959A07454D3F394D1DC5E7B6D5DBD4838F22AFC
3. D3E3559259060B578C862DE1C3D80DBB183D5E204ADB3CC8FA00FBF9EE9F4AF3
4. 7F18D7110E40204BD9F98558C1B77E261CA7A3EC11DAC6F41C5764C6F2B94CA5
5. E46FD74D92856313D9A4E044AEF95BD8DC52533818FB2E14F2F465EA69F5CF15

## Diagnosis and limits

In-app Browser does not expose actual native Edge zoom; Chrome/Edge and Computer Use were not controlled. Normal in-app widths including 1715 (approximately half the supplied 3429px screenshot) did not reproduce the reported Edge-only sideways movement. The exact Edge/native-zoom trigger is not established by viewport substitution.

The stronger audit found a real content-bound defect missed by the previous root-width-only check: at width 320/client 305, Command's right bound was 318.65625, outside the viewport, while root scrollWidth still reported 305. Legacy body overflow:hidden and world overflow:clip could mask required content overflow. Legacy body::before is a fixed 720px glow with right:-230px and animated translation/scale, outside the viewport and belonging to the old background. This is a layout risk, not proof that it alone caused the user's native failure. Retained travel body used implicit grid track sizing.

## Fix

Explore-scoped utilities/summary headers wrap; flexible fields/labels shrink; credits and owner text wrap. Travel body uses width:min(100%,1800px), minmax(0,1fr), border-box sizing and matching page padding. Owner fields/buttons are bounded and headers/actions wrap. Hero/nav, summaries, portals, credits, travel tools, discovery, trip board, shortcuts and More To Explore retain their owners/data.

Explore disables old off-screen body pseudo-glows. Its bounded scene host remains the decorative background; artwork and portal crops are locally contained. Explore body overflow is explicitly visible and the outer world mask is removed, so content cannot be hidden to pass. No new global overflow:hidden/clip rule. Other worlds' accepted work unchanged.

## Verification

`tests/explore-layout-audit.mjs` reads rendered root, 11 region scroll/client widths, and control/heading/disclosure bounds. It detects clipped controls even when root width masks overflow. The canonical tablet nav's intentional internal scroll is distinguished from page overflow. Three new regressions cover reproduced Command bounds, region/document overflow, and bounded reflow with scrollbar/subpixel rounding. The same helper ran against actual in-app Browser DOM.

Expanded credits and a disposable saved Lisbon owner record passed at 2048/1920/1715/1440/1024/857/760/640/520/390/320: root width equals client width, all 11 regions fit, all applicable controls fit (109–117 checked). Command wraps at 320. Results: `explore-overflow-audit-2026-09-30.json`. Responsive evidence is NOT native-200% acceptance. Disposable record removed through original owner UI.

Focused Explore/owner/scene/foundation/structure: **43/43**; full `node --preserve-symlinks --preserve-symlinks-main --test tests/`: **200/200**; zero failures/skips. `git diff --check` passes. Final CSS/helper reviewed; prior implementation/evidence retained. No generated assets, provider/storage/routing changes.

## Exact next check

Refresh in the same native Edge window, set actual menu zoom 200%, and attempt horizontal scrolling/panning at top, expanded credits and bottom. Scroll all sections; verify no sideways movement/empty side area and no clipped/overlapping controls or portal captions/arrows. Expand credits and search filters. Check trip board, shortcuts and final More To Explore. Include saved-card actions if data exists; no new trip is required for the empty check.

Screenshot groups: (1) hero/nav with zoom menu showing 200%; (2) portals and expanded credits, full left/right edges; (3) travel tools/trip board, shortcuts and More To Explore, extra captures if needed. Report whether sideways movement succeeds anywhere. Step 11 remains open until new native evidence; do not begin Games or mark step 19 VERIFIED.
