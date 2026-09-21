# OneSpace Revised Implementation Plan

## Purpose

The previous implementation missed the product goal. It created small local demonstration catalogs and treated them as the final discovery experience. This plan replaces that assumption.

The next implementation must deliver:

- Global destination, game, movie, and series discovery
- Real photographs and real descriptions where the provider supplies them
- User-added locations
- A functional shortlist and trip board
- Proper movie and series search and selection
- Working game discovery by genre and search
- A visible cinematic presentation across the complete application
- Automated and browser verification of every tab and major action

This is an implementation brief for the next coding agent. It is not complete until the acceptance criteria at the end pass.

## Non-Negotiable Corrections

1. Do not treat a static list of 12 destinations as global Explore functionality.
2. Do not treat local seed games as “all games in the world.”
3. Do not treat a small movie/series seed list as global Movies & Series functionality.
4. Do not use conceptual SVG illustrations as the main destination experience when the requirement is real pictures.
5. Do not add a shortlist button without implementing save, remove, notes, trip status, ordering, and reload persistence.
6. Do not place “More To Explore” near the primary Explore controls. It must be the final section on the page.
7. Every visible selection label must start with an uppercase first word: `City break`, `Nature`, `Series`, `Action`, `Winter`, and so on. Do not expose lowercase enum values to users.
8. Do not claim that a page is cinematic because CSS files exist. The effect must be visible in the browser and checked with screenshots/video-style interaction checks.
9. Do not declare the work complete without testing every top-level tab at desktop and mobile sizes.

## Product And Technical Reality

A static local page cannot safely provide an exhaustive global catalog by itself. The application needs a provider-backed discovery layer.

Use a small server-side proxy or API adapter layer so provider credentials are never placed in browser JavaScript. The current `_static-server.js` is only a file server and cannot protect API keys. Upgrade the local development server or add a small API service with environment variables.

Recommended provider adapters:

- Destinations and places: a place/geocoding provider plus Wikimedia Commons or another licensed photo provider for real destination photography and attribution.
- Movies and series: TMDB or another licensed global movie/TV catalog provider with poster/backdrop image URLs, type, genres, overview, release information, and series metadata.
- Games: IGDB or RAWG with a provider adapter for global game search, genres, platforms, covers, artwork, descriptions, release dates, and external links.

The exact provider may change, but the interface must remain provider-neutral and support loading, empty, rate-limit, authentication, timeout, and provider-error states.

Do not scrape websites. Do not download copyrighted images into the repository without permission. Use provider image URLs according to their terms, show attribution where required, and retain a local deterministic fallback only for outages.

## Current Gaps To Fix

- `explore-data.js` contains only 12 editorial destinations.
- Explore currently renders local SVG destination art and a deterministic fallback instead of real destination photography.
- Explore shortlist records only a destination ID, creation time, and notes. There is no actual trip board workflow.
- `games.js` initializes the library from `DEFAULT_GAMES` and only searches the local catalog.
- `movies.js` uses `SEED_MOVIES` plus custom entries and cannot search the global movie/series universe.
- Existing cinematic CSS and page artwork are not sufficient evidence that the experience visibly feels cinematic.
- Existing test documentation reports local acceptance, not global provider-backed discovery acceptance.

## Phase 1: Define The Provider Architecture

1. Create a provider-neutral API contract for:
   - Destination search
   - Destination details
   - Destination photos
   - Game search
   - Game details
   - Movie search
   - Series search
   - Movie/series details
2. Add a local API service or proxy route. Keep provider keys in environment variables.
3. Define normalized response shapes so the UI never depends directly on TMDB, IGDB, RAWG, geocoding, or photo-provider response formats.
4. Add request cancellation with `AbortController` when a user changes a search quickly.
5. Add loading, empty, timeout, rate-limit, offline, authentication, and provider-error states.
6. Add request caching with a short TTL so repeated searches do not issue unnecessary requests.
7. Add result pagination or infinite loading. Never silently cap global search results at 8 or 12.
8. Add attribution and provider/source links to result details.
9. Add a local mock provider for automated tests so tests do not depend on internet access or API quotas.
10. Add a clear configuration error when provider credentials are missing. The UI must explain what is unavailable instead of showing a fake local catalog as if it were global.

## Phase 2: Explore Rebuild

### Search And Selection

1. Replace the 12-record Explore catalog as the primary source of results.
2. Let the user search any city, country, region, landmark, beach, park, island, museum, or other place supported by the place provider.
3. Let the user add a location manually when no provider result exists.
4. A manually added location must support:
   - Name
   - Country or region
   - Description
   - Category
   - Optional coordinates
   - Optional website
   - User-supplied image URL or uploaded image
   - Notes
5. Normalize provider records and manually added records into the same destination card/detail model.
6. Add selection controls for:
   - Destination type
   - Region
   - Country
   - Season
   - Trip length
   - Budget
   - Travel style
   - Climate
   - Interests
7. Make every visible option label start with an uppercase first word. Use labels such as `City break`, `Nature`, `Beach`, `Culture`, `Food`, `Wellness`, and `Adventure`.
8. Keep internal values normalized and lowercase if needed, but never display raw internal values.
9. When a selection changes, return matching destinations from the provider or cached provider results and explain the match.
10. Provide pagination/load-more so the user can explore beyond the first page.
11. Add a clear `Search Worldwide` action and a separate `Add Location` action.

### Real Images And Descriptions

1. Use real provider photographs or licensed image URLs for destination cards and details.
2. Show photographer/provider attribution where required.
3. Show provider descriptions and normalized local summaries.
4. Keep deterministic generated art only as an outage fallback, never as the main successful result.
5. Preserve image aspect ratios and responsive object positioning.
6. Test successful images, slow images, 404 images, and missing images.

### Functional Shortlist And Trip Board

Implement the trip board as a real workflow, not a heading and a notes field.

1. Save a destination to the shortlist.
2. Remove a destination from the shortlist.
3. Open the saved destination detail.
4. Assign a trip status:
   - Idea
   - Researching
   - Planned
   - Visited
5. Add and edit trip notes.
6. Add optional trip dates.
7. Add a priority or ranking.
8. Reorder saved destinations.
9. Add a board view with columns or clearly separated groups by trip status.
10. Move a destination between statuses.
11. Create a trip plan from a saved destination.
12. Add itinerary notes or day-level entries to a trip plan.
13. Delete a saved destination only after confirmation.
14. Persist every board change and verify it after reload.
15. Show an empty board with an actionable `Search Worldwide` button.
16. Put `More To Explore` at the very end of the Explore page, after the trip board and all primary discovery functionality.
17. `More To Explore` may contain secondary links, editorial suggestions, or related categories, but it must never push the selection, results, or trip board below the primary workflow.

## Phase 3: Games Global Discovery

1. Keep the existing Games tracker, sessions, journal, themes, and task progress.
2. Replace local-only discovery with provider-backed search.
3. Search the global game catalog by:
   - Game name
   - Genre
   - Platform
   - Release year
   - Developer or publisher where available
   - Player style or tags where available
4. Display real provider artwork, cover art, screenshots, descriptions, release dates, platforms, genres, and source links.
5. Add pagination/load-more and do not limit the experience to `DEFAULT_GAMES`.
6. Keep local seeded games as offline examples only, clearly labeled as cached/local data.
7. Let the user add any provider result to My Games.
8. When a game is added, initialize default tasks based on genre and tracker type without duplicating tasks after reload.
9. Add a game detail screen containing:
   - Overview
   - Genres and platforms
   - Official website
   - News/update links
   - Build and guide links
   - Community links
   - User tasks
   - Progress
10. Keep resource links data-driven and available for every game, not only Diablo Immortal.
11. Add a visible provider error state rather than silently falling back to a five-game local catalog.
12. Verify genre selection returns multiple provider results and that a search for a known game returns the expected result.

## Phase 4: Movies And Series Global Discovery

1. Keep the current `movies` route for compatibility, but present it as `Movies & Series`.
2. Replace the small seed-only discovery flow with provider-backed global search.
3. Provide separate selection controls for:
   - Movies
   - Series
   - Genre
   - Country or language
   - Release year or decade
   - Rating
   - Runtime or episode duration
   - Streaming/service metadata where legally available
4. Search both movie and series records from the same user-facing search experience.
5. Return real posters, backdrops, descriptions, genres, release dates, cast/creator metadata, season counts, episode counts, and provider links where available.
6. Let the user add any result to the library or watchlist.
7. Show type clearly with title-case labels: `Movie` and `Series`.
8. Make series details work independently from movies.
9. Support series fields such as seasons, episodes, episode runtime, status, and first/last air date.
10. Keep title-level watch state unless episode-level tracking is explicitly added later.
11. Add a details view with full description and source attribution.
12. Add pagination/load-more and never imply that the local seed list is the full catalog.
13. Add tests proving that a movie result and a series result can be found, displayed, saved, removed, and restored after reload.

## Phase 5: Cinematic Presentation And Modern Icons

The visual work must be implemented and visibly demonstrated, not merely described.

1. Create a visual direction for each top-level experience:
   - Work: drafting room / command center
   - Personal: calm ritual space
   - Explore: world atlas / travel window
   - Games: game-world spotlight
   - Movies & Series: theater / streaming marquee
2. Add an entry transition when each tab opens.
3. Add hero scene movement or parallax that responds to pointer movement on desktop and remains stable on touch devices.
4. Add staggered reveal for primary content cards.
5. Add meaningful transitions for:
   - Search result arrival
   - Filter changes
   - Detail panel opening
   - Save/remove actions
   - Board status changes
   - Task completion
6. Add cinematic loading states that match the section rather than generic blank spinners.
7. Add real image crossfades and sensible crop positioning for provider artwork.
8. Add fallback art only on failed media requests.
9. Use one consistent modern inline SVG icon system or a properly installed icon library.
10. Replace text-only actions such as bare `Edit`, `Delete`, `Back`, and `More` where an icon is clearer, while retaining accessible labels and tooltips.
11. Verify visible contrast, focus rings, touch targets, and reduced-motion behavior.
12. Add an explicit visual QA checklist with screenshots for Home, Work, Personal, Explore, Games, Movies & Series, Shortcuts, Productivity, Notes, Settings, desktop, tablet, and mobile.
13. Do not mark cinematic work complete if the screenshots show the old static presentation or missing animation states.

## Phase 6: Work And Personal Regression Check

The new global discovery work must not regress the already requested core features.

1. Work must still support projects, stories, defects, analysis, plan, execution, deadlines, reminders, tasks, task checkboxes, close, reopen, backlog, and history.
2. Personal must still support add, edit, complete, delete confirmation, goals, routines, habits, and Personal shortcuts.
3. Shortcut ownership must remain isolated between Work, Personal, and Explore.
4. Backup and restore must include all new board, provider cache, game, movie, series, Work, and Personal records as appropriate.
5. Provider cache must be safe to clear without deleting user-owned records.
6. A missing provider or offline state must not erase existing user data.

## Phase 7: Testing Strategy

### Unit And Integration Tests

Add tests for:

1. Provider response normalization.
2. Provider errors, timeout, rate limits, and empty responses.
3. Pagination and load-more behavior.
4. Destination filtering across multiple groups.
5. Manual destination creation and validation.
6. Real destination photo URL handling and fallback behavior.
7. Shortlist save/remove/reload.
8. Trip board status changes and ordering.
9. Trip notes and dates.
10. Game global search normalization and genre filtering.
11. Game add flow and idempotent default task initialization.
12. Movie and series search, details, library, watchlist, and reload.
13. Provider cache expiration and cache clearing.
14. Backup, restore, reset, and preservation of unrelated localStorage keys.
15. Work lifecycle rules.
16. Personal delete confirmation behavior.

### Browser Acceptance Tests

Use a mock provider for deterministic automated browser tests and run a smaller live-provider smoke test when credentials are available.

Test these flows:

1. Open every top-level tab.
2. Confirm the tab title, hero, primary controls, and main content are visible.
3. Search worldwide destinations.
4. Filter destinations by at least three selections.
5. Load more destination results.
6. Add a manual location.
7. Open destination details.
8. Save a destination.
9. Move it from `Idea` to `Researching` to `Planned`.
10. Add dates, notes, and ordering.
11. Reload and confirm the trip board remains correct.
12. Remove a saved destination with confirmation.
13. Verify `More To Explore` is the final Explore section.
14. Search Games by title and genre.
15. Open a game detail and verify real artwork, description, resource links, and default tasks.
16. Add a game and reload it.
17. Search Movies and Series separately.
18. Open a movie detail and save it.
19. Open a series detail and verify season/episode information.
20. Reload the movie/series library and watchlist.
21. Exercise Work creation, tasks, close, backlog, and reopen.
22. Exercise Personal add, edit, completion, and delete confirmation.
23. Exercise Shortcuts ownership and description.
24. Test backup export/import after adding data in every domain.
25. Test provider failure, missing image, empty search, and offline states.
26. Test keyboard navigation, Escape handling, focus restoration, and screen-reader labels.
27. Test reduced motion.
28. Check screenshots at 1440px, 1024px, 760px, and 390px widths.
29. Check for horizontal overflow, overlapping text, broken images, uncaught console errors, and failed requests.

## Acceptance Criteria

The next agent may only report completion when all of these are true:

- Explore is not limited to 12 hard-coded locations.
- A user can search worldwide places and receive paginated provider results.
- A user can manually add a location.
- Destination cards use real photos when provider data is available.
- Destination descriptions come from normalized provider data.
- Shortlist and trip board operations actually work and survive reload.
- `More To Explore` is the final Explore section.
- Every visible selection begins with an uppercase first word.
- Games can be searched globally and filtered by genre through the provider layer.
- Movies and Series can both be searched globally and filtered independently.
- Series details display correctly and are not treated as movies.
- Every major result has a real image or an explicit loading/error fallback.
- Cinematic entry, reveal, hover, image, and state-change effects are visible in browser screenshots.
- Icons are consistent, modern, labeled, keyboard accessible, and tooltip-supported where necessary.
- Work, Personal, Shortcuts, Games, Movies & Series, Explore, Productivity, Notes, Settings, and Home all work after reload.
- Automated tests pass.
- Browser acceptance tests pass.
- No uncaught console errors remain on the tested routes.
- Documentation clearly states provider setup, API limits, image licensing/attribution, offline behavior, and fallback behavior.

## Required Deliverables

1. Updated implementation in the project repository.
2. Provider adapter or mock-provider implementation.
3. Provider setup documentation with environment variables.
4. Updated storage and backup validation.
5. Unit/integration tests.
6. Browser acceptance tests.
7. Visual QA screenshots or an equivalent recorded verification artifact.
8. Updated `README.md`.
9. A concise verification report listing every tested tab and result.

## Out Of Scope Unless Explicitly Approved

- Scraping third-party websites.
- Exposing private API keys in browser code.
- Claiming exhaustive global results without a provider-backed search.
- Background push notifications after the page closes.
- Cloud synchronization and multi-user collaboration.
- Full episode-by-episode series tracking.
- Downloading copyrighted provider images into the repository without permission.
