/* ===========================================================================
 * Movie Nights static data: preference vocab, seed catalogue, and platform
 * labels. Pure data — no DOM/localStorage access happens in this file.
 * Loaded before movies.js.
 *
 * All seed titles ship with their own local theatrical poster and landscape backdrop.
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
      poster: { kind: "asset", src: "assets/movie-art/godfather-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/godfather-background.jpg" },
      moods: ["Epic", "Dark", "Nostalgic"], tags: ["Mafia", "Family", "Classic"], accent: "#8a1f1f",
      blurb: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son."
    },
    {
      id: "mv-jurassic-park", title: "Jurassic Park", genre: ["Adventure", "Sci-Fi"], year: 1993, decade: "1990s",
      durationMinutes: 127, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.9,
      poster: { kind: "asset", src: "assets/movie-art/jurassic-park-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/jurassic-park-background.jpg" },
      moods: ["Epic", "Suspenseful"], tags: ["Dinosaurs", "Adventure", "Spielberg"], accent: "#2f6b3a",
      blurb: "A billionaire's cloned-dinosaur theme park spirals into chaos when the safety systems fail."
    },
    {
      id: "mv-matrix", title: "The Matrix", genre: ["Sci-Fi", "Action"], year: 1999, decade: "1990s",
      durationMinutes: 136, language: "English", type: "movie", platforms: ["HBO Max", "Own It"], rating: 8.7,
      poster: { kind: "asset", src: "assets/movie-art/matrix-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/matrix-background.jpg" },
      moods: ["Mind-bending", "Intense"], tags: ["Cyberpunk", "Action", "Philosophical"], accent: "#1f8a5a",
      blurb: "A hacker learns that reality as he knows it is a simulation, and joins a rebellion to break free."
    },
    {
      id: "mv-spirited-away", title: "Spirited Away", genre: ["Animation", "Fantasy"], year: 2001, decade: "2000s",
      durationMinutes: 125, language: "Japanese", type: "movie", platforms: ["HBO Max", "Own It"], rating: 8.6,
      poster: { kind: "asset", src: "assets/movie-art/spirited-away-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/spirited-away-background.jpg" },
      moods: ["Heartwarming", "Nostalgic"], tags: ["Studio Ghibli", "Coming-of-age", "Fantasy"], accent: "#c77b3f",
      blurb: "A young girl wanders into a spirit world and must work in a bathhouse to save her parents and find her way home."
    },
    {
      id: "mv-inception", title: "Inception", genre: ["Sci-Fi", "Thriller"], year: 2010, decade: "2010s",
      durationMinutes: 148, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.8,
      poster: { kind: "asset", src: "assets/movie-art/inception-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/inception-background.jpg" },
      moods: ["Mind-bending", "Intense", "Suspenseful"], tags: ["Dreams", "Heist", "Nolan"], accent: "#2b4b7a",
      blurb: "A thief who steals secrets from within dreams is offered a chance to have his criminal record erased."
    },
    {
      id: "mv-jaws", title: "Jaws", genre: ["Thriller", "Horror"], year: 1975, decade: "1970s",
      durationMinutes: 124, language: "English", type: "movie", platforms: ["Own It"], rating: 8.1,
      poster: { kind: "asset", src: "assets/movie-art/jaws-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/jaws-background.jpg" },
      moods: ["Suspenseful", "Dark"], tags: ["Shark", "Classic", "Spielberg"], accent: "#0f5f7a",
      blurb: "A giant great white shark terrorizes a New England beach town, forcing three men to hunt it down."
    },
    {
      id: "mv-back-to-the-future", title: "Back to the Future", genre: ["Adventure", "Comedy", "Sci-Fi"], year: 1985, decade: "1980s",
      durationMinutes: 116, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.5,
      poster: { kind: "asset", src: "assets/movie-art/back-to-the-future-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/back-to-the-future-background.jpg" },
      moods: ["Feel-good", "Nostalgic"], tags: ["Time Travel", "Comedy", "Classic"], accent: "#c9711a",
      blurb: "A teenager is accidentally sent 30 years into the past in a time-traveling DeLorean built by his eccentric friend."
    },
    {
      id: "mv-pulp-fiction", title: "Pulp Fiction", genre: ["Crime", "Drama"], year: 1994, decade: "1990s",
      durationMinutes: 154, language: "English", type: "movie", platforms: ["Prime Video", "Own It"], rating: 8.9,
      poster: { kind: "asset", src: "assets/movie-art/pulp-fiction-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/pulp-fiction-background.jpg" },
      moods: ["Dark", "Intense"], tags: ["Nonlinear", "Tarantino", "Crime"], accent: "#b8860b",
      blurb: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence."
    },
    {
      id: "mv-dark-knight", title: "The Dark Knight", genre: ["Action", "Crime", "Thriller"], year: 2008, decade: "2000s",
      durationMinutes: 152, language: "English", type: "movie", platforms: ["HBO Max", "Own It"], rating: 9.0,
      poster: { kind: "asset", src: "assets/movie-art/dark-knight-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/dark-knight-background.jpg" },
      moods: ["Intense", "Dark", "Epic"], tags: ["Superhero", "Batman", "Crime"], accent: "#1a1a2e",
      blurb: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy."
    },
    {
      id: "mv-parasite", title: "Parasite", genre: ["Drama", "Thriller"], year: 2019, decade: "2010s",
      durationMinutes: 132, language: "Korean", type: "movie", platforms: ["Prime Video", "Own It"], rating: 8.6,
      poster: { kind: "asset", src: "assets/movie-art/parasite-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/parasite-background.jpg" },
      moods: ["Dark", "Suspenseful"], tags: ["Class", "Satire", "Oscar Winner"], accent: "#3a4a3a",
      blurb: "Greed and class discrimination threaten the newly formed symbiotic relationship between a wealthy family and a poor one."
    },
    {
      id: "mv-la-la-land", title: "La La Land", genre: ["Romance", "Comedy", "Drama"], year: 2016, decade: "2010s",
      durationMinutes: 128, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 8.0,
      poster: { kind: "asset", src: "assets/movie-art/la-la-land-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/la-la-land-background.jpg" },
      moods: ["Feel-good", "Nostalgic"], tags: ["Musical", "Romance", "Jazz"], accent: "#d94f70",
      blurb: "A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles."
    },
    {
      id: "mv-get-out", title: "Get Out", genre: ["Horror", "Thriller"], year: 2017, decade: "2010s",
      durationMinutes: 104, language: "English", type: "movie", platforms: ["Netflix"], rating: 7.7,
      poster: { kind: "asset", src: "assets/movie-art/get-out-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/get-out-background.jpg" },
      moods: ["Dark", "Suspenseful"], tags: ["Social Thriller", "Horror"], accent: "#8b0000",
      blurb: "A young Black man uncovers a disturbing secret when he meets his white girlfriend's family for the first time."
    },
    {
      id: "mv-toy-story", title: "Toy Story", genre: ["Animation", "Comedy", "Adventure"], year: 1995, decade: "1990s",
      durationMinutes: 81, language: "English", type: "movie", platforms: ["Disney+", "Own It"], rating: 8.3,
      poster: { kind: "asset", src: "assets/movie-art/toy-story-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/toy-story-background.jpg" },
      moods: ["Feel-good", "Heartwarming"], tags: ["Pixar", "Family", "Animation"], accent: "#2266cc",
      blurb: "A cowboy doll's world is turned upside down when a spaceman action figure becomes his owner's new favorite toy."
    },
    {
      id: "mv-mad-max-fury-road", title: "Mad Max: Fury Road", genre: ["Action", "Adventure"], year: 2015, decade: "2010s",
      durationMinutes: 120, language: "English", type: "movie", platforms: ["HBO Max", "Own It"], rating: 8.1,
      poster: { kind: "asset", src: "assets/movie-art/mad-max-fury-road-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/mad-max-fury-road-background.jpg" },
      moods: ["Intense", "Epic"], tags: ["Post-apocalyptic", "Action", "Chase"], accent: "#c25a1a",
      blurb: "In a post-apocalyptic wasteland, Max joins a rebel convoy fleeing a tyrant across the desert."
    },
    {
      id: "mv-shawshank", title: "The Shawshank Redemption", genre: ["Drama"], year: 1994, decade: "1990s",
      durationMinutes: 142, language: "English", type: "movie", platforms: ["Netflix", "Own It"], rating: 9.3,
      poster: { kind: "asset", src: "assets/movie-art/shawshank-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/shawshank-background.jpg" },
      moods: ["Heartwarming", "Epic", "Nostalgic"], tags: ["Prison", "Friendship", "Hope"], accent: "#5a4a3a",
      blurb: "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency."
    },
    {
      id: "mv-amelie", title: "Amelie", genre: ["Romance", "Comedy"], year: 2001, decade: "2000s",
      durationMinutes: 122, language: "French", type: "movie", platforms: ["Prime Video", "Own It"], rating: 8.3,
      poster: { kind: "asset", src: "assets/movie-art/amelie-poster.jpg" }, backdrop: { kind: "asset", src: "assets/movie-art/amelie-background.jpg" },
      moods: ["Feel-good", "Heartwarming"], tags: ["Paris", "Whimsical", "Romance"], accent: "#c23b6b",
      blurb: "A shy waitress in Paris decides to change the lives of those around her for the better, while struggling with her own."
    }
  ];
})();

/* A finite, curated series selection. Season counts describe the complete titles. */
window.SEED_MOVIES.push(
 {id:'tv-dark',title:'Dark',type:'series',seasons:3,genre:['Sci-Fi','Thriller'],year:2017,decade:'2010s',durationMinutes:50,language:'German',platforms:[],rating:0,moods:['Mind-bending','Dark'],tags:['Time travel','Mystery'],accent:'#48666a',poster:{kind:'placeholder'},backdrop:{kind:'placeholder'},blurb:'A missing child draws a small town into an intricate mystery across generations. A match for patient, puzzle-focused viewing.'},
 {id:'tv-queens-gambit',title:'The Queen’s Gambit',type:'series',seasons:1,genre:['Drama'],year:2020,decade:'2020s',durationMinutes:55,language:'English',platforms:[],rating:0,moods:['Thought-provoking'],tags:['Chess','Limited series'],accent:'#a87547',poster:{kind:'placeholder'},backdrop:{kind:'placeholder'},blurb:'A gifted chess player pursues mastery while navigating personal challenges. A contained character-driven series.'},
 {id:'tv-good-place',title:'The Good Place',type:'series',seasons:4,genre:['Comedy','Fantasy'],year:2016,decade:'2010s',durationMinutes:22,language:'English',platforms:[],rating:0,moods:['Feel-good','Thought-provoking'],tags:['Ethics','Friendship'],accent:'#5d9991',poster:{kind:'placeholder'},backdrop:{kind:'placeholder'},blurb:'An unexpected afterlife becomes a comic exploration of friendship and what it means to be good. Suits shorter sessions.'},
 {id:'tv-chernobyl',title:'Chernobyl',type:'series',seasons:1,genre:['Drama','History'],year:2019,decade:'2010s',durationMinutes:60,language:'English',platforms:[],rating:0,moods:['Intense','Thought-provoking'],tags:['Limited series','Historical drama'],accent:'#778565',poster:{kind:'placeholder'},backdrop:{kind:'placeholder'},blurb:'A historical drama about the nuclear disaster and the people confronting its consequences. For viewers seeking a serious limited series.'}
);
window.SEED_MOVIES.forEach(function(m){m.genre.forEach(function(g){if(!window.MOVIE_GENRES.includes(g))window.MOVIE_GENRES.push(g);});});

window.SEED_MOVIES.forEach(function(m){if(!window.MOVIE_LANGUAGES.includes(m.language))window.MOVIE_LANGUAGES.push(m.language);m.moods.forEach(function(v){if(!window.MOVIE_MOODS.includes(v))window.MOVIE_MOODS.push(v);});});

(function(){var metadata={'Dark':{episodes:26,seriesStatus:'Ended',lastAirDate:'2020-06-27'},"The Queen's Gambit":{episodes:7,seriesStatus:'Ended',lastAirDate:'2020-10-23'},'The Good Place':{episodes:53,seriesStatus:'Ended',lastAirDate:'2020-01-30'},'Chernobyl':{episodes:5,seriesStatus:'Ended',lastAirDate:'2019-06-03'}};(window.SEED_MOVIES||[]).forEach(function(m){if(metadata[m.title])Object.assign(m,metadata[m.title]);});})();
