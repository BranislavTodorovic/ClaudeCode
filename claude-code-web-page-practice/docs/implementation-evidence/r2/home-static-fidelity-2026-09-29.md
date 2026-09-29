# R2 Home static fidelity — steps 6–12

Status: static Home checkpoint accepted for implementation of step 13. Gate R2 remains open. This supplements `home-analysis-2026-09-28.md`; the approved visual authority is `docs/ui-reference/00-home.png` (2048×1152).

## 6–9. Scene, structure, behavior and route bridge

The Home runtime uses the independent local `assets/scenes/home/hero.png` in the shared scene host. Its cards, capture form, navigation and image portals are DOM controls, never pixels from the composite reference. The shared host reported `ready` in the normal browser and `fallback` when the Home hero request was deliberately withheld. The fallback retained the capture form and all six portals without horizontal overflow or a browser crash: [fallback capture](home-scene-fallback.png). R1's scene-load and missing-asset regression remains applicable.

The Home shell has the eight canonical worlds, utility links, Quick Capture, four live-data summary cards, six visual portals and the prior Home records/search/Quick Access below the reference-led region. Home values come from the existing local task, Work project, Notes, countdown and Productivity timer owners; unsupported reference weather, profile, mood and ambience claims are omitted or shown as honest empty states. Notes/task Quick Capture was browser-checked for save and reload persistence. Empty submission keeps input focus and explains the required text. Today Add opens the actual task form with focus. Media & Games has separate Games and Movies controls. Projects & Notes explains its future status while Work Projects and Quick Notes remain available.

The canonical route bridge was corrected to call `OneSpace.goToPage` directly, map `#/w/work/projects` to the existing Work Projects view, update the hash on Work view changes, restore views on Back/Forward, and normalize an unknown world to Home. The focused `homeRouteBridge`, `homeInteractions`, `routes` and `themeOverride` browser smoke flows passed after this change. A rejected page-persistence write reports failure and restores the URL to the page still displayed.

## 10. Approved-reference comparison at 2048×1152

The [2048 render](home-2048-static.png) was visually compared with `00-home.png`, not accepted from screenshot creation alone. The Home scene retains the reference's warm living-room lighting, dark leafy framing, bookcase/fire depth and skyline opening. Independent navy glass panels have restrained cyan/blue emphasis. At this viewport the greeting/capture/chips occupy the upper-left band, four summary cards form a single row around y≈483, and six image portals begin around y≈736 and end around y≈1071. The approved composite has corresponding bands around y≈495 and y≈755–1093. Exact sample values and sample controls were replaced by real or honest local states, as required by the R2 data classification. This is accepted static fidelity; the current route/interaction implementation has no page-specific motion yet.

## 11. Responsive and effective zoom comparison

Each capture below was opened and visually inspected against the actual Home reference. The comparison checked region order, scene visibility, card/portal density, control labels, image cropping and clipping as the reference composition reflows. The document `scrollWidth` stayed at or below the viewport width; the 15px difference shown below is the vertical scrollbar, not horizontal overflow. No portal image appeared broken.

| Viewport | Evidence | Visual result |
|---|---|---|
| 1920×1080 | [capture](home-1920-static.png) | Four summary cards and six portals remain in single rows, with the warm room visible behind both. |
| 1440×900 | [capture](home-1440-static.png) | Four summaries remain legible; portals reflow to three columns and nav remains exposed. |
| 1024×768 | [capture](home-1024-static.png) | Summaries reflow to two readable columns and portals to three; the former crowded Now/Today cards were corrected. |
| 760×900 | [capture](home-760-static.png) | Navigation is a 4×2 grid, summaries and portals two columns, with no clipped controls. |
| 390×844 | [top](home-390-static.png), [portals](home-390-portals.png) | Navigation is a 2×4 grid, summaries and portals one column; first-screen capture and lower portal controls remain usable. |
| Effective 200% scale | [capture](home-200pct-effective.png) | An isolated Edge render used a 1024×576 CSS viewport and 2× device scale, producing a 2048×1152 physical capture. This verifies the layout geometry and legibility at the effective viewport produced by 200% zoom; it is a scale-equivalent check, not a claim that the in-app browser's native zoom control changed. |

## 12. Keyboard, focus, ARIA and touch

Keyboard Tab traversed brand, all eight world links, four utilities, Quick Capture, quick actions, summary actions and portals in order. On a focused Work portal the action had `:focus-visible`, a 3px outline and its containing tile had a visible 3px focus halo. Enter activated the Games and Movies split destinations independently, and the unavailable Projects & Notes control announced its status instead of navigating to a false destination. Capture fields have labels, the summary/portal sections have accessible names, the Home world has `aria-current="page"`, and the status notice uses `role="status"`.

At 390px the eight nav links, four summary arrows, capture select/button and Media & Games buttons measure at least 44px tall; full-tile portal actions exceed that size. The touch/no-hover CSS removes hover translation. The viewport had no horizontal overflow. The initial mobile findings—scrolling nav, small summary arrows and 36px media controls—were corrected before acceptance.

Next unresolved R2 step: **13. Add Home-specific entry, settle, ambient and exit/reset behavior through the existing cinematic scene controller.** Then verify motion preferences, failure/performance states, regression and final item evidence before Gate R2.
