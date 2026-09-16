/* ===========================================================================
 * GameVault static data: preference vocab, default games, weekly task
 * template, and the suggestion catalog. Pure data — no DOM/localStorage
 * access happens in this file. Loaded before games.js.
 * ===================================================================== */
(function () {
  "use strict";

  window.GAMES_PLATFORMS = ["PC", "PS5", "Xbox", "Nintendo Switch", "Mobile"];
  window.GAMES_GENRES = ["Action", "Horror", "RPG", "Adventure", "Story-rich", "Open world", "Survival", "Racing"];
  window.GAMES_PLAYSTYLES = ["Single-player", "Multiplayer", "Co-op", "Short sessions", "Long sessions"];
  window.GAMES_MOODS = ["Relaxed", "Challenging", "Dark", "Atmospheric", "Competitive"];

  window.DIABLO_WEEKLY_TEMPLATE = [
    { id: "bounties", label: "Complete daily bounties" },
    { id: "elder-rift", label: "Complete Elder Rift activities" },
    { id: "challenge-rift", label: "Complete Challenge Rift activity" },
    { id: "helliquary", label: "Complete Helliquary activity" },
    { id: "pvp", label: "Complete PvP activity" },
    { id: "weekly-goal", label: "Reach the weekly activity goal" },
    { id: "claim-rewards", label: "Claim weekly rewards" }
  ];

  window.DEFAULT_GAMES = [
    {
      id: "game-alan-wake-2",
      name: "Alan Wake 2",
      platform: "PC",
      genre: "Survival Horror",
      accent: "#e8892b",
      logo: { kind: "asset", src: "assets/game-art/alan-wake-2-logo.png" },
      artwork: "assets/game-art/alan-wake-2.webp",
      world: "amber",
      tagline: "Some stories never let you go.",
      trackerType: "story",
      custom: false,
      story: {
        chapters: [
          {
            id: "c1", title: "Initiation: Author's Nightmare", expanded: true,
            objectives: [
              { id: "o1", text: "Escape the recurring nightmare visions", done: false },
              { id: "o2", text: "Find your way through the misty woods", done: false },
              { id: "o3", text: "Confront the shape in the darkness", done: false }
            ]
          },
          {
            id: "c2", title: "Return 1: Bright Falls Investigation", expanded: false,
            objectives: [
              { id: "o4", text: "Investigate the ritual murder scene as Saga", done: false },
              { id: "o5", text: "Interview witnesses around Bright Falls", done: false },
              { id: "o6", text: "Uncover the Cult of the Tree", done: false }
            ]
          },
          {
            id: "c3", title: "Return 2: The Oceanview Motel", expanded: false,
            objectives: [
              { id: "o7", text: "Explore the Dark Place manifestation", done: false },
              { id: "o8", text: "Collect scattered manuscript pages", done: false },
              { id: "o9", text: "Escape the Poet's pursuit", done: false }
            ]
          },
          {
            id: "c4", title: "Initiation: The Return", expanded: false,
            objectives: [
              { id: "o10", text: "Rewrite the town with the Clicker", done: false },
              { id: "o11", text: "Face the Dark Presence's true form", done: false },
              { id: "o12", text: "Reach the end of Alan's story", done: false }
            ]
          }
        ]
      }
    },
    {
      id: "game-resident-evil-4",
      name: "Resident Evil 4",
      platform: "PS5",
      genre: "Survival Horror",
      accent: "#8a1f1f",
      logo: { kind: "asset", src: "assets/game-art/resident-evil-4-logo.png" },
      artwork: "assets/game-art/resident-evil-4.jpg",
      world: "crimson",
      tagline: "Survival is only the beginning.",
      trackerType: "story",
      custom: false,
      story: {
        chapters: [
          {
            id: "c1", title: "Chapter 1: The Village", expanded: true,
            objectives: [
              { id: "o1", text: "Survive the initial villager ambush", done: false },
              { id: "o2", text: "Reach the village chief's house", done: false },
              { id: "o3", text: "Defeat El Gigante", done: false }
            ]
          },
          {
            id: "c2", title: "Chapter 2: The Lake", expanded: false,
            objectives: [
              { id: "o4", text: "Cross the lake by boat", done: false },
              { id: "o5", text: "Evade the Lake Monster", done: false },
              { id: "o6", text: "Reach the abandoned factory", done: false }
            ]
          },
          {
            id: "c3", title: "Chapter 3: Castle Salazar", expanded: false,
            objectives: [
              { id: "o7", text: "Escort Ashley through the castle halls", done: false },
              { id: "o8", text: "Solve the courtyard puzzle", done: false },
              { id: "o9", text: "Defeat the Bella Sisters", done: false }
            ]
          },
          {
            id: "c4", title: "Chapter 4: The Island", expanded: false,
            objectives: [
              { id: "o10", text: "Infiltrate the island military base", done: false },
              { id: "o11", text: "Rescue Ashley from the lab", done: false },
              { id: "o12", text: "Defeat Krauser", done: false },
              { id: "o13", text: "Confront Saddler", done: false }
            ]
          }
        ]
      }
    },
    {
      id: "game-diablo-immortal",
      name: "Diablo Immortal",
      platform: "Mobile",
      genre: "Action RPG",
      accent: "#a855f7",
      logo: { kind: "asset", src: "assets/game-art/diablo-immortal-logo.png" },
      artwork: "assets/game-art/diablo-immortal.webp",
      artworkMobile: "assets/game-art/diablo-immortal-mobile.webp",
      world: "violet",
      tagline: "Your next legend starts here.",
      trackerType: "weekly",
      custom: false
    },
    {
      id: "game-cyberpunk-2077",
      name: "Cyberpunk 2077",
      platform: "PC",
      genre: "Open world",
      accent: "#00f0ff",
      logo: { kind: "asset", src: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/logo.png" },
      artwork: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_hero.jpg",
      world: "neon",
      tagline: "Choose your life. Or let it choose you.",
      trackerType: "story",
      custom: false,
      story: { chapters: [{ id: "c1", title: "Night City", expanded: true, objectives: [{ id: "o1", text: "Complete the opening mission chain", done: false }, { id: "o2", text: "Set up your first apartment and contacts", done: false }, { id: "o3", text: "Hit the first major street-level gig", done: false }] }, { id: "c2", title: "Cybernetics and choices", expanded: false, objectives: [{ id: "o4", text: "Upgrade cyberware and weapons", done: false }, { id: "o5", text: "Take on a side contract in Watson", done: false }, { id: "o6", text: "Unlock a major faction questline", done: false }] }] }
    },
    {
      id: "game-hades",
      name: "Hades",
      platform: "Nintendo Switch",
      genre: "Action RPG",
      accent: "#ff6b57",
      logo: { kind: "asset", src: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/logo.png" },
      artwork: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_hero.jpg",
      world: "crimson",
      tagline: "Every escape is a new beginning.",
      trackerType: "story",
      custom: false,
      story: { chapters: [{ id: "c1", title: "The house of Hades", expanded: true, objectives: [{ id: "o1", text: "Escape the first few chambers cleanly", done: false }, { id: "o2", text: "Unlock a new weapon or boon route", done: false }, { id: "o3", text: "Reach the final boss room with a stronger build", done: false }] }, { id: "c2", title: "The gods' feud", expanded: false, objectives: [{ id: "o4", text: "Clear a full heat run with a stable build", done: false }, { id: "o5", text: "Learn the late-game boon synergies", done: false }, { id: "o6", text: "Finish a boss encounter without dying", done: false }] }] }
    },
    {
      id: "game-death-stranding",
      name: "Death Stranding",
      platform: "PS5",
      genre: "Adventure",
      accent: "#7cc2ff",
      logo: { kind: "asset", src: "https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/logo.png" },
      artwork: "https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/library_hero.jpg",
      world: "aurora",
      tagline: "A connection is all you need.",
      trackerType: "story",
      custom: false,
      story: { chapters: [{ id: "c1", title: "The coast", expanded: true, objectives: [{ id: "o1", text: "Deliver the first major package route", done: false }, { id: "o2", text: "Upgrade your equipment and balance", done: false }, { id: "o3", text: "Reach the next foothold settlement", done: false }] }, { id: "c2", title: "The road ahead", expanded: false, objectives: [{ id: "o4", text: "Create a more reliable supply chain", done: false }, { id: "o5", text: "Complete a delivery in difficult weather", done: false }, { id: "o6", text: "Unlock a regionally significant branch route", done: false }] }] }
    }
  ];

  window.SUGGESTION_CATALOG = [
    { id: "sg-hades", title: "Hades", genres: ["Action", "RPG"], platforms: ["PC", "PS5", "Xbox", "Nintendo Switch"], playstyles: ["Single-player", "Short sessions"], moods: ["Challenging", "Atmospheric"], accent: "#e0483e", blurb: "A roguelike dungeon-crawler with sharp combat and a story that unfolds a little more with every run." },
    { id: "sg-hollow-knight", title: "Hollow Knight", genres: ["Adventure", "Action"], platforms: ["PC", "Nintendo Switch", "Xbox", "PS5"], playstyles: ["Single-player", "Long sessions"], moods: ["Atmospheric", "Dark", "Challenging"], accent: "#6f8fae", blurb: "A moody hand-drawn metroidvania about a ruined kingdom of bugs, packed with secrets." },
    { id: "sg-elden-ring", title: "Elden Ring", genres: ["RPG", "Open world", "Action"], platforms: ["PC", "PS5", "Xbox"], playstyles: ["Single-player", "Long sessions"], moods: ["Challenging", "Dark", "Atmospheric"], accent: "#b08d57", blurb: "A sprawling open-world action RPG built around punishing, rewarding combat and exploration." },
    { id: "sg-gow-ragnarok", title: "God of War Ragnarök", genres: ["Action", "Adventure", "Story-rich"], platforms: ["PS5"], playstyles: ["Single-player", "Long sessions"], moods: ["Dark", "Atmospheric", "Challenging"], accent: "#3a6ea5", blurb: "A cinematic, story-driven action epic following Kratos and Atreus toward Ragnarök." },
    { id: "sg-bg3", title: "Baldur's Gate 3", genres: ["RPG", "Story-rich", "Adventure"], platforms: ["PC", "PS5", "Xbox"], playstyles: ["Single-player", "Co-op", "Long sessions"], moods: ["Atmospheric", "Challenging"], accent: "#c0392b", blurb: "A deep, choice-driven RPG with tabletop-style freedom and a huge, reactive story." },
    { id: "sg-stardew", title: "Stardew Valley", genres: ["Adventure", "Open world"], platforms: ["PC", "Nintendo Switch", "Mobile", "PS5", "Xbox"], playstyles: ["Single-player", "Co-op", "Short sessions"], moods: ["Relaxed"], accent: "#7cae52", blurb: "An easygoing farming-life sim you can pick up for ten minutes or ten hours." },
    { id: "sg-it-takes-two", title: "It Takes Two", genres: ["Adventure", "Action"], platforms: ["PC", "PS5", "Xbox"], playstyles: ["Co-op", "Short sessions"], moods: ["Relaxed", "Atmospheric", "Competitive"], accent: "#3f9ab0", blurb: "A two-player co-op adventure that reinvents its mechanics in almost every level." },
    { id: "sg-forza5", title: "Forza Horizon 5", genres: ["Racing", "Open world"], platforms: ["PC", "Xbox"], playstyles: ["Single-player", "Multiplayer", "Short sessions"], moods: ["Relaxed", "Competitive"], accent: "#f39c12", blurb: "An open-world racer set in a vibrant Mexico, equally fun solo or against friends." },
    { id: "sg-dead-cells", title: "Dead Cells", genres: ["Action", "Survival"], platforms: ["PC", "PS5", "Xbox", "Nintendo Switch", "Mobile"], playstyles: ["Single-player", "Short sessions"], moods: ["Challenging", "Competitive"], accent: "#8e44ad", blurb: "A fast, brutal roguelite-metroidvania built for quick, replayable runs." },
    { id: "sg-outer-wilds", title: "Outer Wilds", genres: ["Adventure", "Story-rich"], platforms: ["PC", "PS5", "Xbox", "Nintendo Switch"], playstyles: ["Single-player", "Long sessions"], moods: ["Atmospheric", "Relaxed"], accent: "#2c3e6b", blurb: "A curious, mysterious solar system on a 22-minute time loop, built entirely around exploration." },
    { id: "sg-persona5", title: "Persona 5 Royal", genres: ["RPG", "Story-rich"], platforms: ["PC", "PS5", "Xbox", "Nintendo Switch"], playstyles: ["Single-player", "Long sessions"], moods: ["Atmospheric", "Challenging"], accent: "#c0272d", blurb: "A stylish turn-based RPG about a group of students leading double lives as phantom thieves." },
    { id: "sg-genshin", title: "Genshin Impact", genres: ["RPG", "Open world", "Adventure"], platforms: ["PC", "PS5", "Mobile"], playstyles: ["Single-player", "Co-op", "Short sessions"], moods: ["Relaxed", "Atmospheric"], accent: "#5dade2", blurb: "A free-to-play open-world action RPG you can dip into for a short session or an afternoon." }
  ];
})();
