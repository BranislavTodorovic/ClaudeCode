# R3 Explore reference analysis — steps 1–6

2026-09-30. The approved `docs/ui-reference/03-explore.png` and separate clean `assets/scenes/explore/hero.png` were physically opened. Analysis is complete; Explore is NOT VERIFIED. R3 remains OPEN. Personal finalization is consistently persisted at main / 6a68232, with its documented native Edge 200% screenshot SHA256 matching 6158EE4474792E9431CF7F958C5B05424D9A75C3610E996CFF0BF21871FC1B9C. No Personal acceptance is repeated.

## 2. Reference observations

The approved 1672×940 frame uses a warm travel library: books and map wall left/center, camera and globe, plants, table and tall sunset coast windows right. This is architectural depth, not a space theme. Header is above the left-aligned cyan-violet hero around x110/y175; contextual search around y274, six compact filters around y340. Three dark glass summary panels occupy y404–710: Featured Destinations is about half width with three photographs, Saved Places and Upcoming Trips about one quarter each. Five photographic portals occupy y721–910 with dark lower labels and circular arrows. Thin blue-gray edges, restrained glow and warm visible room detail carry the image. At 2048×1152 preserve this hierarchy and density; smaller widths reflow rather than shrink targets. Motion, after static acceptance, should gently wake the travel room and stagger copy/panels; avoid false live weather, inventory, date changes, or animated trip totals.

## 3–4. Inventory and portal requirements

| Region | Owner / behavior |
|---|---|
| Header | Canonical eight-world R1 shell; Today, Shortcuts, Notes and Command utilities |
| Hero | Explore a brighter world; local editorial travel context without fake profile/weather |
| Contextual search | Existing destination discovery form; preserve stored preferences, ranking, search/detail/save |
| Filter chips | Destinations -> search; Experiences -> truthful future notice; Travel Dates -> trip-board date editing; Interests, Budget, Travel Style -> existing filters |
| Featured Destinations | First three maintained editorial catalog destinations; existing detail modal and save action |
| Saved Places | Actual trip board, ordered by canonical order, including manually entered places; open owner record |
| Upcoming Trips | Actual planned trips with valid nonpast start dates, sorted by date; no invented schedules |
| Destinations portal | Existing search/detail/save/trip board now; R5 dedicated destination family later |
| Experiences portal | R5 activity discovery/detail/save family; explicitly unavailable now |
| Travel Guides portal | R5 guide reading/saving family; explicitly unavailable now |
| Bucket List portal | Existing saved trip board now; R5 dedicated bucket-list family later |
| Discover More portal | Existing final More To Explore resource action now; R5 dedicated discovery family later |
| Surprise me | Existing deterministic local discovery owner action, retained |
| Follow-on sections | Existing discovery, trip board, shortcuts and chill tools remain; More To Explore stays FINAL |

## 5. Data ownership and sample reconciliation

Reference Santorini/Dolomites/Lofoten/Amalfi/Patagonia and sample 2024 dates are illustrative. Use actual twelve-destination local catalog and `orbit-trip-board`; keep `orbit-explore-preferences` and existing migration behavior. No second store, provider, credential or fake saved trip is introduced. Trip board remains sole writer; landing summaries read through shared storage and use existing controls/details. Historical UI samples do not override canonical shell or owners.

## 6. Dynamic classifications

LOCAL_CORE: maintained catalog descriptions, destination identity, licensed local photos and attribution. USER_ENTERED: saved/manual trip locations, notes, planned dates, status and priority. LOCAL_DERIVED: saved count, editorial first-three selection, sorted upcoming dated planned trips. FUTURE_DISABLED: Experiences and Travel Guides dedicated modules, plus later dedicated R5 pages for other portals. OPTIONAL_PROVIDER: none approved/configured for this implementation; no live prices, availability, weather or generated factual travel guidance.

## Asset plan and next step

Reuse the separate generated clean Explore room, source ID recorded in the R1 scene manifest. Reuse licensed local destination photography for destination/experience/discover thumbnails, with existing catalog attribution visible in landing UI; use distinct room crops for map/globe guide and bucket-list context. CSS cropping changes framing only, never uses a composite reference screenshot as a production background. Next: step 7 static structure, then owner binding and complete acceptance checks. Native actual 200% zoom will require the smallest human check after all independent work; viewport resizing cannot satisfy it.
