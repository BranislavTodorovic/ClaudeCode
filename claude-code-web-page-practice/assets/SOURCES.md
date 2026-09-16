# OneSpace artwork, cinematic edition

The authoritative inventory is `manifest.json`. It records all nine page scenes, six default games, sixteen movies, downloadable suggestion assets, accent colors, image dimensions, byte sizes, responsive positioning, and source URLs. No API or remote image host is needed at runtime.

## Page artwork

Home and Work retain their original local OneSpace artwork. Seven new environments were generated with the built-in OpenAI image generation tool on 2026-09-16. See `page-art/PROMPTS.md` for the final prompt set. PNG masters are retained; the application loads smaller WebP encodings with identical composition. They are original concept scenes, not photographs of actual places.

## Games

Alan Wake 2, Resident Evil 4, and Diablo Immortal retain the project's existing official key art and logos; see `game-art/SOURCES.md`. Cyberpunk 2077, Hades, Death Stranding, and eleven suggestion catalog entries use publisher-supplied Steam library artwork, headers, and logos, downloaded locally. Exact URLs are recorded per file in the manifest. Genshin Impact, which has no Steam art in this collection, uses a deterministic locally drawn discovery illustration.

## Movies

All sixteen default films now have distinct locally downloaded poster and landscape background files. The film identities were resolved by IMDb ID through the public Cinemeta metadata service (`https://v3-cinemeta.strem.io/meta/movie/{imdbId}.json`). Artwork was downloaded from the metadata's Metahub poster and background URLs. See the manifest for original and redirected URLs. This replaces the earlier genre-based hero scenes and the SVG poster stand-ins. Previous source files remain for provenance; they are no longer used by default film records.

Game and movie artwork belongs to the respective publishers/studios and is retained for this personal local prototype. Downloading does not grant redistribution rights.

## Responsive composition and fallback

Posters preserve a 2:3 frame. Landscape scenes use `object-fit: cover` and desktop/mobile object positioning; mobile copy is anchored below the subject under a stronger shade. Diablo retains its dedicated original mobile key art. No duplicate low-quality upscaled files are generated.

Known movie poster failures first try that title's own local background; a failed hero can try its own poster. Other failures display an original, deterministic SVG composition and emit a console warning including the failed source. User-created project covers are generated from the complete name and tags; they require no remote images. Unavailable custom artwork uses deterministic illustration, never a browser broken-image icon.
