# R1.2/R1.3 and Gate R1 evidence

Status: R1.2 VERIFIED; R1.3 VERIFIED; Gate R1 VERIFIED on 2026-09-28. First unresolved step: R2 step 1, open `docs/ui-reference/00-home.png` and conduct its image-specific Home fidelity analysis before Home coding.

## R1.2 shared foundation

- `shared/redesign-foundation.js` exports the exact eight-world registry, submodule slugs, canonical hash route builder/parser, legacy Projects → Work Projects and optional Media → Movies aliases, semantic shell creator/active-world control, and a decorative scene host. The host loads only registry-listed local images, leaves controls outside the decorative host, falls back to CSS on missing/corrupt art, ignores stale image completions and exposes no second animation controller. `shared/cinematic-scenes.js` remains the sole page motion controller.
- `styles/redesign-foundation.css` supplies namespaced typography, spacing/grid, dark glass/surface tokens, primary and secondary buttons, chips, cards/panels, image portals, search, brand, eight-world navigation, focus/hover/active/disabled states, scene scrim and gradient fallback. It includes 1450/1000/760/520 breakpoints, touch/no-hover treatment, Full/Subtle/Off-compatible transitions and `prefers-reduced-motion` override. The `osr-` namespace avoids a premature redesign of existing pages.
- `index.html` loads the shared stylesheet and module in the existing classic-script dependency chain. R1 creates primitives, not new world page content. The current shell/page switcher and `orbit-page` behavior remain the compatibility base for R2 integration.
- `tests/redesign-foundation.test.js` checks world uniqueness, canonical route/detail/alias behavior, rejected malformed routes, all eight separate local PNG scenes and their manifest provenance, and asset-failure/stale-load behavior. `tests/data-regression.test.js` and `tests/structure.test.js` source counts/script ordering were updated for the intentional module addition.

## R1.3 clean production scenes

Eight original 1672×941 PNG scene assets were created with the built-in OpenAI imagegen tool, inspected individually and copied into `assets/scenes/<world>/hero.png` in canonical world order. Their generation source IDs, subject, paired approved reference, provenance and fallback contract are in `assets/scenes/manifest.json`. The prompts specified architectural scene photography only, no baked UI/text/logos/characters or composite screenshot reproduction. The prompt set, in world order, was:

1. Home: warm living room with plants, sofa, fireplace and sunset city/window depth.
2. Work: productive desk studio with dual generic displays, chair, plants and sunset city depth.
3. Personal/Fitness: home wellness and training room with mat, dumbbells, soft seating and city dusk.
4. Explore: travel study with map, globe, camera, plants and sunset coast.
5. Games: premium gaming room with generic controllers, display and dusk skyline.
6. Movies & Series: home cinema with plush seating, generic landscape screen and amber shelving.
7. Projects & Notes: creative planning studio with blank notebook, laptop and pinboard.
8. Settings: calm lounge and fireplace with plants, generic devices and sunset city view.

All use realistic warm architectural materials, layered foreground/middle/distant depth, cool dusk contrast and upper-left space for independently rendered copy. The eight approved composite screenshots remain exclusively under `docs/ui-reference/`; no production asset path points to them. No third-party photo or branded media was used as generation input. The manifest records applicable rights/attribution review and the deterministic CSS gradient fallback. Dimensions and nonempty bytes of all eight files were verified from the saved PNGs.

## Verification and gate

- Full command: `node --preserve-symlinks --preserve-symlinks-main --test tests/` → **177 passed, 0 failed**. A first pass had exactly three expected source-inventory/order failures from adding the module; the source-order assertions were updated and the complete suite rerun green.
- In-app browser on disposable `http://localhost:18974/`: existing Games page loaded after the new references were included; clicking Home exposed the full Home region/search/overview/shortcuts controls. This confirms current entry/navigation compatibility. New component visual fidelity is R2's acceptance work, not claimed by Gate R1.
- `git diff --check` exited 0. Scene manifest and generated files were checked for path existence, PNG signature and 1672×941 dimensions.
- R1.1 architecture contracts are recorded in `architecture-lock-2026-09-28.md`. The shared primitives and assets now give R2 Home a fixed shell vocabulary, route grammar, scene source and fallback; no new storage rule or alternate motion controller is needed.

Gate R1: **VERIFIED**. Follow R2's exact 17-step Home sequence before starting R3 Work.
