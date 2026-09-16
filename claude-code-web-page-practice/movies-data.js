/* ===========================================================================
 * Movie Nights static data: preference vocab, seed catalogue, and platform
 * labels. Pure data — no DOM/localStorage access happens in this file.
 * Loaded before movies.js.
 *
 * Image strategy: the 5 movies below with poster.kind === "asset" ship with
 * real theatrical poster art fetched into assets/movie-art/ (see
 * assets/movie-art/SOURCES.md for provenance/licensing notes). Every other
 * seed movie — and every custom movie a user adds later — uses
 * poster.kind === "placeholder", which movies.js renders as a CSS-gradient
 * card (keyed by the movie's `accent`) with the title and a film-icon
 * watermark, so no broken/blank image can ever appear.
 * ===================================================================== */
(function () {
  "use strict";

  window.MOVIE_GENRES = ["Action", "Drama", "Sci-Fi", "Comedy", "Horror", "Thriller", "Animation", "Fantasy", "Crime", "Romance", "Adventure"];
  window.MOVIE_MOODS = ["Intense", "Feel-good", "Mind-bending", "Nostalgic", "Dark", "Heartwarming", "Suspenseful", "Epic"];
  window.MOVIE_DECADES = ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  window.MOVIE_DURATIONS = ["Under 90 min", "90-120 min", "Over 120 min"];
  window.MOVIE_LANGUAGES = ["English", "Japanese", "Korean", "French"];
  window.MOVIE_TYPES = ["Movie", "Series", "Documentary"];
  window.MOVIE_PLATFORMS = ["Netflix", "Prime Video", "Disney+", "HBO Max", "In Theaters", "Own It"];

  window.SEED_MOVIES = [
    {
      id: "mv-godfather", title: "The Godfather", genre: ["Crime", "Drama"], year: 1972, decade: "1970s",
      durationMinutes: 175, language: "English", type: "Movie", platforms: ["Own It", "Prime Video"], rating: 9.2,
      poster: { kind: "asset", src: "assets/movie-art/godfather-1972.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/godfather-1972.jpg" },
      moods: ["Epic", "Dark", "Nostalgic"], tags: ["Mafia", "Family", "Classic"], accent: "#8a1f1f",
      blurb: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son."
    },
    {
      id: "mv-jurassic-park", title: "Jurassic Park", genre: ["Adventure", "Sci-Fi"], year: 1993, decade: "1990s",
      durationMinutes: 127, language: "English", type: "Movie", platforms: ["Netflix", "Own It"], rating: 8.9,
      poster: { kind: "asset", src: "assets/movie-art/jurassic-park-1993.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/jurassic-park-1993.jpg" },
      moods: ["Epic", "Suspenseful"], tags: ["Dinosaurs", "Adventure", "Spielberg"], accent: "#2f6b3a",
      blurb: "A billionaire's cloned-dinosaur theme park spirals into chaos when the safety systems fail."
    },
    {
      id: "mv-matrix", title: "The Matrix", genre: ["Sci-Fi", "Action"], year: 1999, decade: "1990s",
      durationMinutes: 136, language: "English", type: "Movie", platforms: ["HBO Max", "Own It"], rating: 8.7,
      poster: { kind: "asset", src: "assets/movie-art/the-matrix-1999.png" }, backdrop: { kind: "asset", src: "assets/movie-art/the-matrix-1999.png" },
      moods: ["Mind-bending", "Intense"], tags: ["Cyberpunk", "Action", "Philosophical"], accent: "#1f8a5a",
      blurb: "A hacker learns that reality as he knows it is a simulation, and joins a rebellion to break free."
    },
    {
      id: "mv-spirited-away", title: "Spirited Away", genre: ["Animation", "Fantasy"], year: 2001, decade: "2000s",
      durationMinutes: 125, language: "Japanese", type: "Movie", platforms: ["HBO Max", "Own It"], rating: 8.6,
      poster: { kind: "asset", src: "assets/movie-art/spirited-away-2001.png" }, backdrop: { kind: "asset", src: "assets/movie-art/spirited-away-2001.png" },
      moods: ["Heartwarming", "Nostalgic"], tags: ["Studio Ghibli", "Coming-of-age", "Fantasy"], accent: "#c77b3f",
      blurb: "A young girl wanders into a spirit world and must work in a bathhouse to save her parents and find her way home."
    },
    {
      id: "mv-inception", title: "Inception", genre: ["Sci-Fi", "Thriller"], year: 2010, decade: "2010s",
      durationMinutes: 148, language: "English", type: "Movie", platforms: ["Netflix", "Own It"], rating: 8.8,
      poster: { kind: "asset", src: "assets/movie-art/inception-2010.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/inception-2010.jpg" },
      moods: ["Mind-bending", "Intense", "Suspenseful"], tags: ["Dreams", "Heist", "Nolan"], accent: "#2b4b7a",
      blurb: "A thief who steals secrets from within dreams is offered a chance to have his criminal record erased."
    },
    {
      id: "mv-jaws", title: "Jaws", genre: ["Thriller", "Horror"], year: 1975, decade: "1970s",
      durationMinutes: 124, language: "English", type: "Movie", platforms: ["Own It"], rating: 8.1,
      poster: { kind: "asset", src: "assets/movie-art/jaws-1975.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/jaws-1975.svg" },
      moods: ["Suspenseful", "Dark"], tags: ["Shark", "Classic", "Spielberg"], accent: "#0f5f7a",
      blurb: "A giant great white shark terrorizes a New England beach town, forcing three men to hunt it down."
    },
    {
      id: "mv-back-to-the-future", title: "Back to the Future", genre: ["Adventure", "Comedy", "Sci-Fi"], year: 1985, decade: "1980s",
      durationMinutes: 116, language: "English", type: "Movie", platforms: ["Netflix", "Own It"], rating: 8.5,
      poster: { kind: "asset", src: "assets/movie-art/back-to-the-future-1985.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/back-to-the-future-1985.svg" },
      moods: ["Feel-good", "Nostalgic"], tags: ["Time Travel", "Comedy", "Classic"], accent: "#c9711a",
      blurb: "A teenager is accidentally sent 30 years into the past in a time-traveling DeLorean built by his eccentric friend."
    },
    {
      id: "mv-pulp-fiction", title: "Pulp Fiction", genre: ["Crime", "Drama"], year: 1994, decade: "1990s",
      durationMinutes: 154, language: "English", type: "Movie", platforms: ["Prime Video", "Own It"], rating: 8.9,
      poster: { kind: "asset", src: "assets/movie-art/pulp-fiction-1994.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/pulp-fiction-1994.svg" },
      moods: ["Dark", "Intense"], tags: ["Nonlinear", "Tarantino", "Crime"], accent: "#b8860b",
      blurb: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence."
    },
    {
      id: "mv-dark-knight", title: "The Dark Knight", genre: ["Action", "Crime", "Thriller"], year: 2008, decade: "2000s",
      durationMinutes: 152, language: "English", type: "Movie", platforms: ["HBO Max", "Own It"], rating: 9.0,
      poster: { kind: "asset", src: "assets/movie-art/dark-knight-2008.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/dark-knight-2008.svg" },
      moods: ["Intense", "Dark", "Epic"], tags: ["Superhero", "Batman", "Crime"], accent: "#1a1a2e",
      blurb: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy."
    },
    {
      id: "mv-parasite", title: "Parasite", genre: ["Drama", "Thriller"], year: 2019, decade: "2010s",
      durationMinutes: 132, language: "Korean", type: "Movie", platforms: ["Prime Video", "Own It"], rating: 8.6,
      poster: { kind: "asset", src: "assets/movie-art/parasite-2019.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/parasite-2019.svg" },
      moods: ["Dark", "Suspenseful"], tags: ["Class", "Satire", "Oscar Winner"], accent: "#3a4a3a",
      blurb: "Greed and class discrimination threaten the newly formed symbiotic relationship between a wealthy family and a poor one."
    },
    {
      id: "mv-la-la-land", title: "La La Land", genre: ["Romance", "Comedy", "Drama"], year: 2016, decade: "2010s",
      durationMinutes: 128, language: "English", type: "Movie", platforms: ["Netflix", "Own It"], rating: 8.0,
      poster: { kind: "asset", src: "assets/movie-art/la-la-land-2016.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/la-la-land-2016.svg" },
      moods: ["Feel-good", "Nostalgic"], tags: ["Musical", "Romance", "Jazz"], accent: "#d94f70",
      blurb: "A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles."
    },
    {
      id: "mv-get-out", title: "Get Out", genre: ["Horror", "Thriller"], year: 2017, decade: "2010s",
      durationMinutes: 104, language: "English", type: "Movie", platforms: ["Netflix"], rating: 7.7,
      poster: { kind: "asset", src: "assets/movie-art/get-out-2017.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/get-out-2017.svg" },
      moods: ["Dark", "Suspenseful"], tags: ["Social Thriller", "Horror"], accent: "#8b0000",
      blurb: "A young Black man uncovers a disturbing secret when he meets his white girlfriend's family for the first time."
    },
    {
      id: "mv-toy-story", title: "Toy Story", genre: ["Animation", "Comedy", "Adventure"], year: 1995, decade: "1990s",
      durationMinutes: 81, language: "English", type: "Movie", platforms: ["Disney+", "Own It"], rating: 8.3,
      poster: { kind: "asset", src: "assets/movie-art/toy-story-1995.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/toy-story-1995.svg" },
      moods: ["Feel-good", "Heartwarming"], tags: ["Pixar", "Family", "Animation"], accent: "#2266cc",
      blurb: "A cowboy doll's world is turned upside down when a spaceman action figure becomes his owner's new favorite toy."
    },
    {
      id: "mv-mad-max-fury-road", title: "Mad Max: Fury Road", genre: ["Action", "Adventure"], year: 2015, decade: "2010s",
      durationMinutes: 120, language: "English", type: "Movie", platforms: ["HBO Max", "Own It"], rating: 8.1,
      poster: { kind: "asset", src: "assets/movie-art/mad-max-fury-road-2015.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/mad-max-fury-road-2015.svg" },
      moods: ["Intense", "Epic"], tags: ["Post-apocalyptic", "Action", "Chase"], accent: "#c25a1a",
      blurb: "In a post-apocalyptic wasteland, Max joins a rebel convoy fleeing a tyrant across the desert."
    },
    {
      id: "mv-shawshank", title: "The Shawshank Redemption", genre: ["Drama"], year: 1994, decade: "1990s",
      durationMinutes: 142, language: "English", type: "Movie", platforms: ["Netflix", "Own It"], rating: 9.3,
      poster: { kind: "asset", src: "assets/movie-art/shawshank-1994.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/shawshank-1994.svg" },
      moods: ["Heartwarming", "Epic", "Nostalgic"], tags: ["Prison", "Friendship", "Hope"], accent: "#5a4a3a",
      blurb: "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency."
    },
    {
      id: "mv-amelie", title: "Amelie", genre: ["Romance", "Comedy"], year: 2001, decade: "2000s",
      durationMinutes: 122, language: "French", type: "Movie", platforms: ["Prime Video", "Own It"], rating: 8.3,
      poster: { kind: "asset", src: "assets/movie-art/amelie-2001.svg" }, backdrop: { kind: "asset", src: "assets/movie-art/amelie-2001.svg" },
      moods: ["Feel-good", "Heartwarming"], tags: ["Paris", "Whimsical", "Romance"], accent: "#c23b6b",
      blurb: "A shy waitress in Paris decides to change the lives of those around her for the better, while struggling with her own."
    }
  ];
})();
