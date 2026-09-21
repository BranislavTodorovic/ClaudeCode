/* ===========================================================================
 * Movie Nights static data: preference vocab, seed catalogue, and platform
 * labels. Pure data — no DOM/localStorage access happens in this file.
 * Loaded before movies.js.
 *
 * Seed titles use sharp original illustrations where licensed high-resolution artwork is unavailable.
 * See assets/manifest.json and assets/SOURCES.md for provenance and crops.
 * ===================================================================== */
(function () {
  "use strict";

  window.MOVIE_GENRES = ["Action", "Drama", "Sci-Fi", "Comedy", "Horror", "Thriller", "Animation", "Fantasy", "Crime", "Romance", "Adventure"];
  window.MOVIE_MOODS = ["Intense", "Feel-good", "Mind-bending", "Nostalgic", "Dark", "Heartwarming", "Suspenseful", "Epic"];
  window.MOVIE_DECADES = ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  window.MOVIE_DURATIONS = ["Under 90 min", "90-120 min", "Over 120 min"];
  window.MOVIE_LANGUAGES = ["English", "Japanese", "Korean", "French"];
  window.MOVIE_TYPES = ["movie", "series"];
  window.MOVIE_PLATFORMS = ["Netflix", "Prime Video", "Disney+", "HBO Max", "In Theaters", "Own It"];

  window.SEED_MOVIES = [
    {
      id: "mv-godfather", title: "The Godfather", genre: ["Crime", "Drama"], year: 1972, decade: "1970s",
      durationMinutes: 175, language: "English", type: "movie", platforms: ["Own It", "Prime Video"], rating: 9.2,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Epic", "Dark", "Nostalgic"], tags: ["Mafia", "Family", "Classic"], accent: "#8a1f1f",
      blurb: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son."
    },
    {
      id: "mv-jurassic-park", title: "Jurassic Park", genre: ["Adventure", "Sci-Fi"], year: 1993, decade: "1990s",
      durationMinutes: 127, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.9,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Epic", "Suspenseful"], tags: ["Dinosaurs", "Adventure", "Spielberg"], accent: "#2f6b3a",
      blurb: "A billionaire's cloned-dinosaur theme park spirals into chaos when the safety systems fail."
    },
    {
      id: "mv-matrix", title: "The Matrix", genre: ["Sci-Fi", "Action"], year: 1999, decade: "1990s",
      durationMinutes: 136, language: "English", type: "movie", platforms: ["HBO Max", "Own It"], rating: 8.7,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Mind-bending", "Intense"], tags: ["Cyberpunk", "Action", "Philosophical"], accent: "#1f8a5a",
      blurb: "A hacker learns that reality as he knows it is a simulation, and joins a rebellion to break free."
    },
    {
      id: "mv-spirited-away", title: "Spirited Away", genre: ["Animation", "Fantasy"], year: 2001, decade: "2000s",
      durationMinutes: 125, language: "Japanese", type: "movie", platforms: ["HBO Max", "Own It"], rating: 8.6,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Heartwarming", "Nostalgic"], tags: ["Studio Ghibli", "Coming-of-age", "Fantasy"], accent: "#c77b3f",
      blurb: "A young girl wanders into a spirit world and must work in a bathhouse to save her parents and find her way home."
    },
    {
      id: "mv-inception", title: "Inception", genre: ["Sci-Fi", "Thriller"], year: 2010, decade: "2010s",
      durationMinutes: 148, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.8,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Mind-bending", "Intense", "Suspenseful"], tags: ["Dreams", "Heist", "Nolan"], accent: "#2b4b7a",
      blurb: "A thief who steals secrets from within dreams is offered a chance to have his criminal record erased."
    },
    {
      id: "mv-jaws", title: "Jaws", genre: ["Thriller", "Horror"], year: 1975, decade: "1970s",
      durationMinutes: 124, language: "English", type: "movie", platforms: ["Own It"], rating: 8.1,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Suspenseful", "Dark"], tags: ["Shark", "Classic", "Spielberg"], accent: "#0f5f7a",
      blurb: "A giant great white shark terrorizes a New England beach town, forcing three men to hunt it down."
    },
    {
      id: "mv-back-to-the-future", title: "Back to the Future", genre: ["Adventure", "Comedy", "Sci-Fi"], year: 1985, decade: "1980s",
      durationMinutes: 116, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.5,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Feel-good", "Nostalgic"], tags: ["Time Travel", "Comedy", "Classic"], accent: "#c9711a",
      blurb: "A teenager is accidentally sent 30 years into the past in a time-traveling DeLorean built by his eccentric friend."
    },
    {
      id: "mv-pulp-fiction", title: "Pulp Fiction", genre: ["Crime", "Drama"], year: 1994, decade: "1990s",
      durationMinutes: 154, language: "English", type: "movie", platforms: ["Prime Video", "Own It"], rating: 8.9,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Dark", "Intense"], tags: ["Nonlinear", "Tarantino", "Crime"], accent: "#b8860b",
      blurb: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence."
    },
    {
      id: "mv-dark-knight", title: "The Dark Knight", genre: ["Action", "Crime", "Thriller"], year: 2008, decade: "2000s",
      durationMinutes: 152, language: "English", type: "movie", platforms: ["HBO Max", "Own It"], rating: 9.0,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Intense", "Dark", "Epic"], tags: ["Superhero", "Batman", "Crime"], accent: "#1a1a2e",
      blurb: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy."
    },
    {
      id: "mv-parasite", title: "Parasite", genre: ["Drama", "Thriller"], year: 2019, decade: "2010s",
      durationMinutes: 132, language: "Korean", type: "movie", platforms: ["Prime Video", "Own It"], rating: 8.6,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Dark", "Suspenseful"], tags: ["Class", "Satire", "Oscar Winner"], accent: "#3a4a3a",
      blurb: "Greed and class discrimination threaten the newly formed symbiotic relationship between a wealthy family and a poor one."
    },
    {
      id: "mv-la-la-land", title: "La La Land", genre: ["Romance", "Comedy", "Drama"], year: 2016, decade: "2010s",
      durationMinutes: 128, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.0,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Feel-good", "Nostalgic"], tags: ["Musical", "Romance", "Jazz"], accent: "#d94f70",
      blurb: "A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles."
    },
    {
      id: "mv-get-out", title: "Get Out", genre: ["Horror", "Thriller"], year: 2017, decade: "2010s",
      durationMinutes: 104, language: "English", type: "movie", platforms: ["Netflix"], rating: 7.7,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Dark", "Suspenseful"], tags: ["Social Thriller", "Horror"], accent: "#8b0000",
      blurb: "A young Black man uncovers a disturbing secret when he meets his white girlfriend's family for the first time."
    },
    {
      id: "mv-toy-story", title: "Toy Story", genre: ["Animation", "Comedy", "Adventure"], year: 1995, decade: "1990s",
      durationMinutes: 81, language: "English", type: "movie", platforms: ["Disney+", "Own It"], rating: 8.3,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Feel-good", "Heartwarming"], tags: ["Pixar", "Family", "Animation"], accent: "#2266cc",
      blurb: "A cowboy doll's world is turned upside down when a spaceman action figure becomes his owner's new favorite toy."
    },
    {
      id: "mv-mad-max-fury-road", title: "Mad Max: Fury Road", genre: ["Action", "Adventure"], year: 2015, decade: "2010s",
      durationMinutes: 120, language: "English", type: "movie", platforms: ["HBO Max", "Own It"], rating: 8.1,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Intense", "Epic"], tags: ["Post-apocalyptic", "Action", "Chase"], accent: "#c25a1a",
      blurb: "In a post-apocalyptic wasteland, Max joins a rebel convoy fleeing a tyrant across the desert."
    },
    {
      id: "mv-shawshank", title: "The Shawshank Redemption", genre: ["Drama"], year: 1994, decade: "1990s",
      durationMinutes: 142, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 9.3,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Heartwarming", "Epic", "Nostalgic"], tags: ["Prison", "Friendship", "Hope"], accent: "#5a4a3a",
      blurb: "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency."
    },
    {
      id: "mv-amelie", title: "Amelie", genre: ["Romance", "Comedy"], year: 2001, decade: "2000s",
      durationMinutes: 122, language: "French", type: "movie", platforms: ["Prime Video", "Own It"], rating: 8.3,
      poster: { kind: "generated" }, backdrop: { kind: "generated" },
      moods: ["Feel-good", "Heartwarming"], tags: ["Paris", "Whimsical", "Romance"], accent: "#c23b6b",
      blurb: "A shy waitress in Paris decides to change the lives of those around her for the better, while struggling with her own."
    }
  ];
})();

/* Offline series metadata: TVmaze, CC BY-SA; see movies/SOURCES.md. */
window.SEED_MOVIES.push(...[
  {
    "id": "tv-dark",
    "title": "Dark",
    "type": "series",
    "seasons": 3,
    "genre": [
      "Sci-Fi",
      "Thriller"
    ],
    "year": 2017,
    "decade": "2010s",
    "durationMinutes": 56,
    "language": "German",
    "platforms": [
      "Netflix"
    ],
    "rating": 8.2,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/17861/dark",
    "moods": [
      "Mind-bending",
      "Dark"
    ],
    "tags": [
      "Time travel",
      "Family secrets"
    ],
    "accent": "#48666a",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A child’s disappearance exposes connections between several families in a German town. The story asks viewers to follow relationships across generations, making it a good choice for an intricate mystery watched in sequence."
  },
  {
    "id": "tv-queens-gambit",
    "title": "The Queen’s Gambit",
    "type": "series",
    "seasons": 1,
    "genre": [
      "Drama"
    ],
    "year": 2020,
    "decade": "2020s",
    "durationMinutes": 56,
    "language": "English",
    "platforms": [
      "Netflix"
    ],
    "rating": 8.5,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/41428/the-queens-gambit",
    "moods": [
      "Intense",
      "Thought-provoking"
    ],
    "tags": [
      "Chess",
      "Limited series"
    ],
    "accent": "#a87547",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "An orphan discovers an extraordinary talent for chess and enters a fiercely competitive world. Her pursuit of mastery unfolds alongside loneliness and dependence, giving this contained series both tournament suspense and a personal story."
  },
  {
    "id": "tv-good-place",
    "title": "The Good Place",
    "type": "series",
    "seasons": 4,
    "genre": [
      "Comedy",
      "Fantasy"
    ],
    "year": 2016,
    "decade": "2010s",
    "durationMinutes": 31,
    "language": "English",
    "platforms": [
      "NBC"
    ],
    "rating": 7.6,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/2790/the-good-place",
    "moods": [
      "Feel-good",
      "Thought-provoking"
    ],
    "tags": [
      "Ethics",
      "Friendship"
    ],
    "accent": "#5d9991",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A woman arrives in an apparently perfect afterlife and suspects a mistake. Fast jokes and changing alliances lead into questions about responsibility, friendship, and whether people can learn to become better."
  },
  {
    "id": "tv-chernobyl",
    "title": "Chernobyl",
    "type": "series",
    "seasons": 1,
    "genre": [
      "Drama",
      "History"
    ],
    "year": 2019,
    "decade": "2010s",
    "durationMinutes": 70,
    "language": "English",
    "platforms": [
      "HBO"
    ],
    "rating": 8.9,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/30770/chernobyl",
    "moods": [
      "Intense",
      "Dark"
    ],
    "tags": [
      "Historical drama",
      "Limited series"
    ],
    "accent": "#778565",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "Scientists, officials, and emergency workers confront the aftermath of the 1986 nuclear disaster. This dramatization focuses on institutional denial and human cost; its sustained tension suits viewers seeking a serious limited series."
  },
  {
    "id": "tv-breaking-bad",
    "title": "Breaking Bad",
    "type": "series",
    "seasons": 5,
    "genre": [
      "Crime",
      "Drama",
      "Thriller"
    ],
    "year": 2008,
    "decade": "2000s",
    "durationMinutes": 60,
    "language": "English",
    "platforms": [
      "AMC"
    ],
    "rating": 9.2,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/169/breaking-bad",
    "moods": [
      "Dark",
      "Intense"
    ],
    "tags": [
      "Moral choices",
      "Crime saga"
    ],
    "accent": "#70824e",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A chemistry teacher begins manufacturing drugs after a life-changing diagnosis. What starts as a financial scheme becomes a study of ambition, secrecy, and damaged relationships, with consequences that accumulate across five seasons."
  },
  {
    "id": "tv-better-call-saul",
    "title": "Better Call Saul",
    "type": "series",
    "seasons": 6,
    "genre": [
      "Crime",
      "Drama"
    ],
    "year": 2015,
    "decade": "2010s",
    "durationMinutes": 64,
    "language": "English",
    "platforms": [
      "AMC"
    ],
    "rating": 8.6,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/618/better-call-saul",
    "moods": [
      "Dark",
      "Thought-provoking"
    ],
    "tags": [
      "Legal drama",
      "Character study"
    ],
    "accent": "#ae7040",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A struggling lawyer searches for professional respect while making increasingly costly compromises. Patient character development and legal maneuvering gradually connect his personal relationships to the criminal world of Breaking Bad."
  },
  {
    "id": "tv-sherlock",
    "title": "Sherlock",
    "type": "series",
    "seasons": 4,
    "genre": [
      "Crime",
      "Thriller"
    ],
    "year": 2010,
    "decade": "2010s",
    "durationMinutes": 90,
    "language": "English",
    "platforms": [
      "BBC One"
    ],
    "rating": 8.9,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/335/sherlock",
    "moods": [
      "Mind-bending",
      "Suspenseful"
    ],
    "tags": [
      "Detective",
      "London"
    ],
    "accent": "#596e9e",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "Sherlock Holmes and John Watson investigate elaborate crimes in contemporary London. Long episodes give each case room for deduction and spectacle, while an ongoing rivalry links the mysteries across the series."
  },
  {
    "id": "tv-firefly",
    "title": "Firefly",
    "type": "series",
    "seasons": 1,
    "genre": [
      "Sci-Fi",
      "Adventure"
    ],
    "year": 2002,
    "decade": "2000s",
    "durationMinutes": 64,
    "language": "English",
    "platforms": [
      "FOX"
    ],
    "rating": 9,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/180/firefly",
    "moods": [
      "Nostalgic",
      "Heartwarming"
    ],
    "tags": [
      "Space western",
      "Found family"
    ],
    "accent": "#ae7954",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A small transport crew takes risky jobs on the edges of a powerful interplanetary government. Western influences, banter, and conflicting loyalties make the ship’s relationships as central as the episodic adventures."
  },
  {
    "id": "tv-fleabag",
    "title": "Fleabag",
    "type": "series",
    "seasons": 2,
    "genre": [
      "Comedy",
      "Drama"
    ],
    "year": 2016,
    "decade": "2010s",
    "durationMinutes": 30,
    "language": "English",
    "platforms": [
      "BBC Three"
    ],
    "rating": 8.1,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/16149/fleabag",
    "moods": [
      "Dark",
      "Thought-provoking"
    ],
    "tags": [
      "Grief",
      "Relationships"
    ],
    "accent": "#a87983",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A sharp and self-destructive Londoner addresses the audience while navigating family conflict, loss, and intimacy. Brief episodes mix awkward humor with emotional consequences, forming a compact two-season character portrait."
  },
  {
    "id": "tv-avatar",
    "title": "Avatar: The Last Airbender",
    "type": "series",
    "seasons": 3,
    "genre": [
      "Animation",
      "Adventure",
      "Fantasy"
    ],
    "year": 2005,
    "decade": "2000s",
    "durationMinutes": 30,
    "language": "English",
    "platforms": [
      "Nickelodeon"
    ],
    "rating": 8.8,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/555/avatar-the-last-airbender",
    "moods": [
      "Epic",
      "Heartwarming"
    ],
    "tags": [
      "Elemental magic",
      "Coming-of-age"
    ],
    "accent": "#63a5b5",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A young airbender and his friends travel through a world divided by elemental powers and war. The animated adventure balances humor with responsibility, developing its characters and conflicts across three connected seasons."
  },
  {
    "id": "tv-gravity-falls",
    "title": "Gravity Falls",
    "type": "series",
    "seasons": 2,
    "genre": [
      "Animation",
      "Comedy",
      "Adventure"
    ],
    "year": 2012,
    "decade": "2010s",
    "durationMinutes": 30,
    "language": "English",
    "platforms": [
      "Disney XD"
    ],
    "rating": 8.8,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/396/gravity-falls",
    "moods": [
      "Feel-good",
      "Suspenseful"
    ],
    "tags": [
      "Summer mystery",
      "Siblings"
    ],
    "accent": "#797cad",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "Twins spend a summer with their great-uncle in a town filled with supernatural oddities. Standalone adventures gradually reveal a larger mystery, pairing visual comedy with clues that reward attention across both seasons."
  },
  {
    "id": "tv-over-garden-wall",
    "title": "Over the Garden Wall",
    "type": "series",
    "seasons": 1,
    "genre": [
      "Animation",
      "Fantasy"
    ],
    "year": 2014,
    "decade": "2010s",
    "durationMinutes": 15,
    "language": "English",
    "platforms": [
      "Cartoon Network"
    ],
    "rating": 8.1,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/1744/over-the-garden-wall",
    "moods": [
      "Nostalgic",
      "Dark"
    ],
    "tags": [
      "Folklore",
      "Limited series"
    ],
    "accent": "#bc8b52",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "Two brothers become lost in an unfamiliar woodland and encounter strange communities on their way home. Short chapters combine autumnal folklore, songs, and unease into a self-contained animated journey."
  },
  {
    "id": "tv-hill-house",
    "title": "The Haunting of Hill House",
    "type": "series",
    "seasons": 1,
    "genre": [
      "Horror",
      "Drama"
    ],
    "year": 2018,
    "decade": "2010s",
    "durationMinutes": 58,
    "language": "English",
    "platforms": [
      "Netflix"
    ],
    "rating": 8.3,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/29191/the-haunting-of-hill-house",
    "moods": [
      "Dark",
      "Suspenseful"
    ],
    "tags": [
      "Haunted house",
      "Family trauma"
    ],
    "accent": "#6c777e",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "Adult siblings revisit the childhood experiences that fractured their family in a haunted house. The story moves between past and present, connecting supernatural scares to grief and unresolved memories across a single season."
  },
  {
    "id": "tv-band-of-brothers",
    "title": "Band of Brothers",
    "type": "series",
    "seasons": 1,
    "genre": [
      "Action",
      "Drama",
      "History"
    ],
    "year": 2001,
    "decade": "2000s",
    "durationMinutes": 59,
    "language": "English",
    "platforms": [
      "HBO"
    ],
    "rating": 9,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/465/band-of-brothers",
    "moods": [
      "Epic",
      "Intense"
    ],
    "tags": [
      "War drama",
      "Limited series"
    ],
    "accent": "#7f8462",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "A dramatized account follows a company of American paratroopers through World War II. Different viewpoints emphasize fear, endurance, and bonds between soldiers, making this a substantial historical series rather than a casual episodic watch."
  },
  {
    "id": "tv-expanse",
    "title": "The Expanse",
    "type": "series",
    "seasons": 6,
    "genre": [
      "Sci-Fi",
      "Thriller",
      "Adventure"
    ],
    "year": 2015,
    "decade": "2010s",
    "durationMinutes": 55,
    "language": "English",
    "platforms": [
      "Prime Video"
    ],
    "rating": 8.7,
    "ratingSource": "TVmaze",
    "metadataDate": "2026-09-21",
    "metadataUrl": "https://www.tvmaze.com/shows/1825/the-expanse",
    "moods": [
      "Epic",
      "Suspenseful"
    ],
    "tags": [
      "Space politics",
      "Ensemble"
    ],
    "accent": "#4785a0",
    "poster": {
      "kind": "generated"
    },
    "backdrop": {
      "kind": "generated"
    },
    "blurb": "Tensions between Earth, Mars, and the asteroid belt frame an investigation that becomes a much larger threat. Interlocking political and personal stories reward sustained viewing, with the crew’s loyalties tested across six seasons."
  }
]);
window.SEED_MOVIES.forEach(function(m){[[m.genre,window.MOVIE_GENRES],[m.moods,window.MOVIE_MOODS],[[m.language],window.MOVIE_LANGUAGES],[m.platforms,window.MOVIE_PLATFORMS]].forEach(function(pair){pair[0].forEach(function(v){if(!pair[1].includes(v))pair[1].push(v);});});});
