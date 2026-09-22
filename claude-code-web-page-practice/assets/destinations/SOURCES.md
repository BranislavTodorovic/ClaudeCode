# Destination photography sources

The 12 destination photographs were downloaded from Wikimedia Commons on 2026-09-22 and converted locally into two WebP crops per destination:

- `*-card.webp`: 640 × 420, quality 82, for Explore cards and the trip board.
- `*-hero.webp`: 1600 × 900, quality 84, for destination detail.
- `*.svg`: the pre-existing deterministic OneSpace illustration, retained only as an image-load fallback.

The WebP derivatives remain subject to each source photograph's license. Changes consist of resizing, centered cropping, color-space conversion to RGB and WebP encoding. The application links the photographer/source and license from every rendered card and detail.

| Destination | Local derivatives | Photograph / author | Source | License |
|---|---|---|---|---|
| Lisbon | `lisbon-card.webp`, `lisbon-hero.webp` | “Lisbon Skyline from Miradouro de São Pedro de Alcântara at Twilight” — Dale Cruse | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lisbon_Skyline_from_Miradouro_de_S%C3%A3o_Pedro_de_Alc%C3%A2ntara_at_Twilight_(54714276547).jpg) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Kyoto | `kyoto-card.webp`, `kyoto-hero.webp` | “Dry-sand Zen garden… Ginkaku-ji Kyoto” — Basile Morin | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dry-sand_Zen_garden_made_of_beige_stripes_a_sunny_day_at_Higashiyama_Jisho-ji_Buddhist_temple_Ginkaku-ji_Kyoto_Japan.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| São Miguel, Azores | `azores-card.webp`, `azores-hero.webp` | “View overlooking the Sete Cidades Lagoon…” — Gonçalo Torres | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:View_overlooking_the_Sete_Cidades_Lagoon,_S%C3%A3o_Miguel_island,_Azores_(Portugal).jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Crete | `crete-card.webp`, `crete-hero.webp` | “Coast in Agioi apostoli. Crete, Greece” — Ввласенко | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Coast_in_Agioi_apostoli._Crete,_Greece.jpg) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| Lake Bohinj, Slovenia | `slovenia-card.webp`, `slovenia-hero.webp` | “Aerial image of Lake Bohinj (view from the south)” — Carsten Steger | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aerial_image_of_Lake_Bohinj_(view_from_the_south).jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Budapest | `budapest-card.webp`, `budapest-hero.webp` | “Hungarian Parliament Building 2023-9” — Pierre Blaché | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hungarian_Parliament_Building_2023-9.jpg) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| Québec City | `quebec-card.webp`, `quebec-hero.webp` | “Petit Champlain at night, Quebec city” — Wilfredor | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Petit_Champlain_at_night,_Quebec_city.jpg) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| Monteverde, Costa Rica | `costa-rica-card.webp`, `costa-rica-hero.webp` | “Monteverde Reserve Costa Rica 02” — Cephas | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Monteverde_Reserve_Costa_Rica_02.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Ubud, Bali | `bali-card.webp`, `bali-hero.webp` | “1 Tegalalang rice terrace ubud bali” — chensiyuan | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:1_Tegalalang_rice_terrace_ubud_bali.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Valencia | `valencia-card.webp`, `valencia-hero.webp` | “City of arts and sciences” — Arthurguo | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:City_of_arts_and_sciences.jpg) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| Edinburgh | `edinburgh-card.webp`, `edinburgh-hero.webp` | “Skyline of Edinburgh” — Andrew Colin | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Skyline_of_Edinburgh.jpg) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| Chiang Mai | `chiang-mai-card.webp`, `chiang-mai-hero.webp` | “Chiang Mai Temple Thailand” — Philip Nalangan | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chiang_Mai_Temple_Thailand.jpg) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

The source metadata was retrieved through the Wikimedia Commons `imageinfo` API. No live remote image is required at runtime.
