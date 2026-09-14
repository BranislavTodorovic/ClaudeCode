/* ===========================================================================
 * Movie Nights — Movies dashboard behavior.
 * Reuses window.OneSpace helpers (safeGet/safeSet/safeGetJSON/showToast/
 * openModal/closeModal/escapeHtml/uid) exposed by index.html instead of
 * redefining them. All storage keys are namespaced "orbit-movies-*" to avoid
 * collisions with OneSpace's / GameVault's existing "orbit-*" keys.
 *
 * The entire Movies UI is built and injected into #moviesMount on first
 * activation of the Movies page (lazy mount), then re-rendered in place —
 * index.html only ships the empty <section id="moviesView">/<div
 * id="moviesMount"> shell plus the Add Movie / Movie Details modals.
 * ===================================================================== */
(function () {
  "use strict";

  var OS = window.OneSpace || {};
  var safeGet = OS.safeGet, safeSet = OS.safeSet, safeGetJSON = OS.safeGetJSON;
  var showToast = OS.showToast, openModal = OS.openModal, closeModal = OS.closeModal;
  var esc = OS.escapeHtml || function (s) { return String(s == null ? "" : s); };
  var uid = OS.uid || function (prefix) { return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7); };

  var MK = {
    library: "orbit-movies-library",
    watchlist: "orbit-movies-watchlist",
    dismissed: "orbit-movies-dismissed",
    prefs: "orbit-movies-preferences",
    theme: "orbit-movies-theme",
    activeTab: "orbit-movies-active-tab",
    spotlight: "orbit-movies-spotlight",
    autoplay: "orbit-movies-autoplay"
  };

  var TABS = ["overview", "library", "suggestions", "watchlist", "appearance"];

  var ICON_CLOSE = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  var ICON_EDIT = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>';
  var ICON_DELETE = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';
  var ICON_PLUS = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';

  /* ---------------------------------------------------------------------
   * Icon set (inline SVG only — no emoji), mirroring GameVault's gvIcon().
   * ------------------------------------------------------------------- */
  var movieIcons = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    library: '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="17" y1="4" x2="17" y2="20"/><line x1="3" y1="9" x2="7" y2="9"/><line x1="3" y1="15" x2="7" y2="15"/><line x1="17" y1="9" x2="21" y2="9"/><line x1="17" y1="15" x2="21" y2="15"/>',
    suggestions: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
    watchlist: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
    appearance: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18Z"/>',
    previous: '<path d="m14 6-6 6 6 6"/>', next: '<path d="m10 6 6 6-6 6"/>',
    pause: '<path d="M9 5v14M15 5v14"/>', play: '<path d="m8 5 11 7-11 7Z"/>',
    film: '<path d="M4 8h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8Z"/><path d="M3 8 4.6 4.4A1 1 0 0 1 5.5 4h13a1 1 0 0 1 .9.6L21 8Z"/><path d="m7 4 1.5 4M12 4l1.5 4M17 4l1.2 4"/>',
    star: '<path d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6Z"/>',
    reel: '<circle cx="32" cy="32" r="20" stroke-width="3"/><circle cx="32" cy="14" r="4" fill="currentColor" stroke="none"/><circle cx="47" cy="32" r="4" fill="currentColor" stroke="none"/><circle cx="32" cy="50" r="4" fill="currentColor" stroke="none"/><circle cx="17" cy="32" r="4" fill="currentColor" stroke="none"/><circle cx="32" cy="32" r="4" fill="currentColor" stroke="none"/>'
  };
  function mvIcon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (movieIcons[name] || movieIcons.film) + '</svg>';
  }

  /* ---------------------------------------------------------------------
   * Scroll-triggered reveal (data-reveal / data-reveal-group), scoped to
   * #moviesMount — copied from GameVault's revealObserver pattern (games.js)
   * since window.OneSpace does not expose a shared one.
   * ------------------------------------------------------------------- */
  var revealObserver = null;
  var pendingReveals = new Set();
  var revealedKeys = {};
  function revealNow(el) {
    el.classList.add("is-visible", "is-revealing");
    var key = el.getAttribute("data-reveal-key");
    if (key) revealedKeys[key] = true;
  }
  function ensureRevealObserver() {
    if (revealObserver || !("IntersectionObserver" in window)) return revealObserver;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          revealObserver.unobserve(entry.target);
          pendingReveals.delete(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    return revealObserver;
  }
  function wireReveal(root) {
    pendingReveals.forEach(function (el) { if (!el.isConnected) { if (revealObserver) revealObserver.unobserve(el); pendingReveals.delete(el); } });
    var reduced = OS.prefersReducedMotion ? OS.prefersReducedMotion() : !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var counts = {};
    (root || document.getElementById("moviesMount") || document).querySelectorAll("[data-reveal]").forEach(function (el) {
      var group = el.getAttribute("data-reveal-group") || "default";
      counts[group] = counts[group] || 0;
      el.style.setProperty("--mv-reveal-delay", (Math.min(counts[group]++, 5) * 70) + "ms");
      var key = el.getAttribute("data-reveal-key");
      if (reduced || (key && revealedKeys[key])) { el.classList.add("is-visible"); return; }
      el.classList.remove("is-visible", "is-revealing");
      var obs = ensureRevealObserver();
      if (obs) { obs.observe(el); pendingReveals.add(el); } else revealNow(el);
    });
  }
  function resetReveals() {
    revealedKeys = {};
    document.querySelectorAll("#moviesMount [data-reveal]").forEach(function (el) {
      el.classList.remove("is-visible", "is-revealing");
      var obs = ensureRevealObserver();
      if (obs) obs.observe(el); else revealNow(el);
    });
  }
  document.addEventListener("animationend", function (e) {
    if (e.target.classList && e.target.classList.contains("is-revealing") && e.animationName === "mvRevealIn") {
      e.target.classList.remove("is-revealing");
    }
  });

  /* ---------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------- */
  function defaultPrefs() { return { genres: [], moods: [], decades: [], durations: [], languages: [], types: [], platforms: [] }; }

  var library = safeGetJSON(MK.library, []);
  /* Seed-sourced entries (custom:false) always resync their identity fields
     (poster/backdrop/blurb/tags/etc.) from the current movies-data.js
     definition, mirroring GameVault's DEFAULT_GAMES resync — a movie the
     user is tracking never loses its status, only its static metadata. */
  (window.SEED_MOVIES || []).forEach(function (def) {
    var existing = library.find(function (m) { return m.id === def.id && !m.custom; });
    if (existing) {
      existing.title = def.title; existing.genre = def.genre.slice(); existing.year = def.year; existing.decade = def.decade;
      existing.durationMinutes = def.durationMinutes; existing.language = def.language; existing.type = def.type;
      existing.platforms = (def.platforms || []).slice(); existing.rating = def.rating;
      existing.poster = def.poster; existing.backdrop = def.backdrop;
      existing.moods = (def.moods || []).slice(); existing.tags = (def.tags || []).slice();
      existing.blurb = def.blurb; existing.accent = def.accent;
    }
  });

  var watchlist = safeGetJSON(MK.watchlist, []);
  var dismissed = safeGetJSON(MK.dismissed, []);
  var prefs = safeGetJSON(MK.prefs, defaultPrefs());
  (function () { var d = defaultPrefs(); Object.keys(d).forEach(function (k) { if (!prefs[k]) prefs[k] = []; }); })();

  var activeTab = "overview";
  var libraryStatusFilter = "all";
  var editingMovieId = null;
  var draftGenres = [];
  var draftPosterDataUrl = null;
  var searchSelectedIndex = 0;
  var searchResults = [];
  var mounted = false;

  var PREF_GROUPS = [
    { key: "genres", label: "Genre", options: window.MOVIE_GENRES || [] },
    { key: "moods", label: "Mood", options: window.MOVIE_MOODS || [] },
    { key: "decades", label: "Decade", options: window.MOVIE_DECADES || [] },
    { key: "durations", label: "Duration", options: window.MOVIE_DURATIONS || [] },
    { key: "languages", label: "Language", options: window.MOVIE_LANGUAGES || [] },
    { key: "types", label: "Type", options: window.MOVIE_TYPES || [] },
    { key: "platforms", label: "Platform", options: window.MOVIE_PLATFORMS || [] }
  ];

  var THEME_DEFS = [
    { key: "marquee", label: "Marquee", preview: "linear-gradient(135deg,#170808,#e0323f,#d4af37)" },
    { key: "noir", label: "Noir", preview: "linear-gradient(135deg,#050505,#3a3a3a,#e8e8e8)" },
    { key: "velvet", label: "Velvet", preview: "linear-gradient(135deg,#160a2b,#6b2fb3,#c9a6ff)" },
    { key: "golden", label: "Golden Age", preview: "linear-gradient(135deg,#1a1408,#a9762f,#f2d98a)" }
  ];

  var ACCENT_PALETTE = ["#8a1f1f", "#2f6b3a", "#1f8a5a", "#c77b3f", "#2b4b7a", "#0f5f7a", "#c9711a", "#b8860b", "#1a1a2e", "#3a4a3a", "#d94f70", "#8b0000", "#2266cc", "#c25a1a", "#5a4a3a", "#c23b6b"];
  function hashAccent(title) {
    var sum = 0;
    for (var i = 0; i < title.length; i++) sum += title.charCodeAt(i);
    return ACCENT_PALETTE[sum % ACCENT_PALETTE.length];
  }

  /* -------------------------------------------------------------------
   * Illustrated hero scenes — one fully-drawn vector composition per
   * genre family, filling the entire hero (1600x900, "slice" fit so it
   * covers the frame the same way Games' photographic art does, but as
   * crisp vector art that can never pixelate at any size). Each is
   * colored from the movie's own accent, so every movie in the same
   * genre still reads as its own scene, and every genre gets a
   * distinct composition rather than a shared plain gradient.
   * ------------------------------------------------------------------- */
  function mix(accent, pct, base) { return "color-mix(in srgb," + accent + " " + pct + "%," + base + ")"; }
  function windowRow(x0, y0, cols, rows, gap, accent) {
    var out = "";
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      if ((r + c) % 3 === 0) continue;
      out += '<rect x="' + (x0 + c * gap) + '" y="' + (y0 + r * gap) + '" width="9" height="13" fill="' + accent + '"/>';
    }
    return out;
  }
  var SCENE_BUILDERS = {
    crime: function (a, id) {
      var g = "cg" + id, h = "ch" + id;
      var glow = mix(a, 70, "#ffdca0");
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + mix(a, 30, "#0a0510") + '"/><stop offset=".55" stop-color="' + mix(a, 22, "#050308") + '"/><stop offset="1" stop-color="#020103"/></linearGradient>' +
        '<radialGradient id="' + h + '" cx="50%" cy="88%" r="65%"><stop offset="0" stop-color="' + mix(a, 55, "#3a1414") + '"/><stop offset="1" stop-color="' + mix(a, 20, "#050308") + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<rect width="1600" height="900" fill="url(#' + h + ')"/>' +
        '<g fill="' + mix(a, 24, "#0a0710") + '">' +
          '<rect x="120" y="360" width="150" height="540"/><rect x="290" y="260" width="130" height="640"/><rect x="440" y="420" width="170" height="480"/>' +
          '<rect x="630" y="300" width="140" height="600"/><rect x="790" y="220" width="120" height="680"/><rect x="930" y="380" width="160" height="520"/>' +
          '<rect x="1110" y="280" width="140" height="620"/><rect x="1270" y="400" width="130" height="500"/><rect x="1420" y="320" width="150" height="580"/>' +
        "</g>" +
        '<g fill="' + glow + '" opacity=".7">' +
          windowRow(140, 390, 4, 9, 32, glow) + windowRow(310, 300, 3, 10, 32, glow) + windowRow(650, 340, 3, 9, 32, glow) +
          windowRow(810, 260, 3, 11, 32, glow) + windowRow(950, 420, 4, 8, 32, glow) + windowRow(1130, 320, 3, 10, 32, glow) + windowRow(1440, 360, 4, 8, 32, glow) +
        "</g>" +
        '<g stroke="' + mix(a, 45, "#000") + '" stroke-width="26" opacity=".3">' +
          '<line x1="-40" y1="140" x2="1640" y2="90"/><line x1="-40" y1="220" x2="1640" y2="170"/><line x1="-40" y1="300" x2="1640" y2="250"/>' +
        "</g>" +
        '<ellipse cx="800" cy="960" rx="900" ry="200" fill="#020103" opacity=".6"/>';
    },
    sciFi: function (a, id) {
      var g = "sg" + id, r = "sr" + id;
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05040c"/><stop offset="1" stop-color="' + mix(a, 30, "#05040c") + '"/></linearGradient>' +
        '<radialGradient id="' + r + '" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="' + mix(a, 65, "#fff") + '" stop-opacity=".9"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<circle cx="800" cy="380" r="360" fill="url(#' + r + ')"/>' +
        '<g fill="#fff" opacity=".7">' +
          '<circle cx="120" cy="90" r="1.6"/><circle cx="260" cy="180" r="1.2"/><circle cx="420" cy="60" r="1.8"/><circle cx="980" cy="120" r="1.4"/>' +
          '<circle cx="1180" cy="70" r="1.6"/><circle cx="1340" cy="160" r="1.2"/><circle cx="1500" cy="90" r="1.8"/><circle cx="700" cy="150" r="1.3"/>' +
        "</g>" +
        '<g stroke="' + mix(a, 60, "#fff") + '" stroke-width="1.5" opacity=".45">' +
          '<circle cx="800" cy="380" r="200" fill="none"/><circle cx="800" cy="380" r="280" fill="none"/>' +
        "</g>" +
        '<g stroke="' + mix(a, 50, "#000") + '" stroke-width="2" opacity=".55">' +
          '<path d="M0 900 L800 620 L1600 900"/><path d="M0 900 L800 700 L1600 900"/><path d="M0 900 L800 780 L1600 900"/><path d="M0 900 L800 860 L1600 900"/>' +
          '<line x1="800" y1="620" x2="800" y2="900"/><line x1="500" y1="900" x2="700" y2="660"/><line x1="1100" y1="900" x2="900" y2="660"/>' +
        "</g>";
    },
    animation: function (a, id) {
      var g = "ag" + id;
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + mix(a, 30, "#1b1330") + '"/><stop offset="1" stop-color="' + mix(a, 55, "#3a2350") + '"/></linearGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<circle cx="1220" cy="220" r="130" fill="' + mix(a, 40, "#fff4d6") + '" opacity=".85"/>' +
        '<circle cx="1220" cy="220" r="200" fill="' + mix(a, 25, "#fff4d6") + '" opacity=".25"/>' +
        '<path d="M0 620 C300 520 500 560 800 600 C1100 640 1300 560 1600 600 L1600 900 L0 900 Z" fill="' + mix(a, 45, "#160f24") + '"/>' +
        '<path d="M0 700 C260 640 560 680 820 700 C1120 725 1360 660 1600 700 L1600 900 L0 900 Z" fill="' + mix(a, 25, "#0e0a18") + '"/>' +
        '<g fill="' + mix(a, 60, "#ffe9b0") + '" opacity=".8">' +
          '<circle cx="220" cy="300" r="6"/><circle cx="340" cy="420" r="5"/><circle cx="470" cy="260" r="4"/><circle cx="600" cy="380" r="6"/>' +
          '<circle cx="980" cy="340" r="5"/><circle cx="1120" cy="440" r="4"/><circle cx="1360" cy="380" r="6"/>' +
        "</g>";
    },
    horror: function (a, id) {
      var g = "hg" + id, m = "hm" + id;
      var silhouette = mix(a, 30, "#04070a");
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + mix(a, 20, "#0a1012") + '"/><stop offset="1" stop-color="' + mix(a, 30, "#141c1e") + '"/></linearGradient>' +
        '<radialGradient id="' + m + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="' + mix(a, 60, "#f2f2ea") + '"/><stop offset=".7" stop-color="' + mix(a, 35, "#c9cfc8") + '"/><stop offset="1" stop-color="' + mix(a, 20, "#c9cfc8") + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<circle cx="1250" cy="200" r="220" fill="url(#' + m + ')" opacity=".9"/>' +
        '<circle cx="1250" cy="200" r="100" fill="' + mix(a, 55, "#f6f6ee") + '"/>' +
        '<g fill="' + mix(a, 22, "#0d1416") + '" opacity=".55">' +
          '<ellipse cx="300" cy="900" rx="500" ry="220"/><ellipse cx="1200" cy="900" rx="600" ry="240"/>' +
        "</g>" +
        '<path d="M0 900 L0 620 L70 500 L130 640 L210 440 L290 620 L380 460 L470 640 L560 420 L660 620 L760 460 L860 640 L970 440 L1080 620 L1190 460 L1300 640 L1400 480 L1500 620 L1600 500 L1600 900Z" fill="' + silhouette + '"/>' +
        '<g stroke="' + mix(a, 45, "#0a1012") + '" stroke-width="4" opacity=".8">' +
          '<path d="M210 440 L200 520 L230 560 M210 440 L180 500"/><path d="M660 420 L650 500 L680 540 M660 420 L630 480"/><path d="M1300 400 L1290 480 L1320 520 M1300 400 L1260 460"/>' +
        "</g>" +
        '<g fill="' + mix(a, 40, "#dfe6e0") + '" opacity=".18"><rect x="0" y="0" width="1600" height="900"/></g>';
    },
    action: function (a, id) {
      var g = "kg" + id, b = "kb" + id;
      var fg = mix(a, 38, "#0c0810");
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + mix(a, 55, "#140a10") + '"/><stop offset="1" stop-color="' + mix(a, 25, "#0a0612") + '"/></linearGradient>' +
        '<radialGradient id="' + b + '" cx="78%" cy="28%" r="58%"><stop offset="0" stop-color="' + mix(a, 85, "#fff2d8") + '"/><stop offset=".55" stop-color="' + mix(a, 55, "#fff2d8") + '"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<circle cx="1250" cy="240" r="480" fill="url(#' + b + ')"/>' +
        '<g stroke="' + mix(a, 78, "#fff6e6") + '" stroke-width="5" opacity=".55">' +
          '<line x1="1250" y1="240" x2="-100" y2="-40"/><line x1="1250" y1="240" x2="-100" y2="160"/><line x1="1250" y1="240" x2="-100" y2="360"/><line x1="1250" y1="240" x2="-100" y2="560"/>' +
          '<line x1="1250" y1="240" x2="150" y2="900"/><line x1="1250" y1="240" x2="480" y2="900"/><line x1="1250" y1="240" x2="820" y2="900"/>' +
        "</g>" +
        '<path d="M0 900 L0 700 L160 600 L340 720 L540 560 L760 740 L1000 580 L1250 730 L1600 620 L1600 900Z" fill="' + fg + '"/>' +
        '<g fill="' + mix(a, 60, "#fff") + '" opacity=".4"><polygon points="340,720 360,660 380,720 360,700"/><polygon points="760,740 785,670 810,740 785,715"/><polygon points="1250,730 1270,675 1290,730 1270,710"/></g>';
    },
    drama: function (a, id) {
      var g = "dg" + id, s = "ds" + id;
      var frame = mix(a, 26, "#100a10");
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + mix(a, 34, "#241825") + '"/><stop offset=".6" stop-color="' + mix(a, 48, "#3a222a") + '"/><stop offset="1" stop-color="' + mix(a, 22, "#160e18") + '"/></linearGradient>' +
        '<radialGradient id="' + s + '" cx="66%" cy="60%" r="48%"><stop offset="0" stop-color="' + mix(a, 82, "#ffe9c2") + '"/><stop offset=".6" stop-color="' + mix(a, 45, "#ffe9c2") + '"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<circle cx="1060" cy="560" r="340" fill="url(#' + s + ')"/>' +
        '<g fill="' + frame + '"><rect x="880" y="120" width="24" height="700"/><rect x="1220" y="120" width="24" height="700"/><rect x="880" y="120" width="364" height="24"/></g>' +
        '<g stroke="' + mix(a, 55, "#000") + '" stroke-width="20" opacity=".4">' +
          '<line x1="0" y1="260" x2="1600" y2="260"/><line x1="0" y1="400" x2="1600" y2="400"/><line x1="0" y1="540" x2="1600" y2="540"/><line x1="0" y1="680" x2="1600" y2="680"/>' +
        "</g>" +
        '<path d="M0 900 L0 720 C400 660 1200 660 1600 720 L1600 900Z" fill="' + mix(a, 24, "#080608") + '"/>';
    },
    romance: function (a, id) {
      var g = "rg" + id, s = "rs" + id;
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + mix(a, 34, "#2a1330") + '"/><stop offset="1" stop-color="' + mix(a, 55, "#4a2038") + '"/></linearGradient>' +
        '<radialGradient id="' + s + '" cx="50%" cy="66%" r="40%"><stop offset="0" stop-color="' + mix(a, 78, "#ffd8c8") + '"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<circle cx="800" cy="600" r="300" fill="url(#' + s + ')"/>' +
        '<g fill="' + mix(a, 55, "#ffe9dd") + '" opacity=".65">' +
          '<circle cx="240" cy="220" r="10"/><circle cx="360" cy="340" r="6"/><circle cx="480" cy="200" r="8"/><circle cx="1140" cy="260" r="9"/>' +
          '<circle cx="1280" cy="180" r="6"/><circle cx="1400" cy="320" r="8"/><circle cx="700" cy="150" r="5"/><circle cx="960" cy="180" r="6"/>' +
        "</g>" +
        '<path d="M0 900 C400 800 1200 800 1600 900 L1600 900 L0 900Z" fill="' + mix(a, 26, "#12081a") + '"/>';
    },
    adventure: function (a, id) {
      var g = "vg" + id, s = "vs" + id;
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + mix(a, 38, "#0c2420") + '"/><stop offset=".55" stop-color="' + mix(a, 30, "#0c1420") + '"/><stop offset="1" stop-color="' + mix(a, 55, "#152a2a") + '"/></linearGradient>' +
        '<radialGradient id="' + s + '" cx="72%" cy="24%" r="34%"><stop offset="0" stop-color="' + mix(a, 78, "#ffedc4") + '"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<circle cx="1150" cy="210" r="220" fill="url(#' + s + ')"/>' +
        '<circle cx="1150" cy="210" r="80" fill="' + mix(a, 60, "#fff6dd") + '"/>' +
        '<g fill="' + mix(a, 55, "#eaffd9") + '" opacity=".55"><circle cx="240" cy="140" r="2.4"/><circle cx="420" cy="90" r="1.8"/><circle cx="620" cy="170" r="2"/><circle cx="820" cy="100" r="1.6"/><circle cx="140" cy="240" r="1.8"/></g>' +
        '<path d="M0 560 L200 420 L360 520 L560 340 L760 500 L980 360 L1180 520 L1400 400 L1600 500 L1600 900 L0 900Z" fill="' + mix(a, 48, "#0a2018") + '"/>' +
        '<path d="M0 680 L220 540 L460 660 L700 500 L960 660 L1220 520 L1440 660 L1600 580 L1600 900 L0 900Z" fill="' + mix(a, 30, "#071612") + '"/>' +
        '<path d="M0 800 L300 700 L620 800 L900 680 L1200 800 L1600 720 L1600 900 L0 900Z" fill="' + mix(a, 18, "#040d0a") + '"/>';
    },
    marquee: function (a, id) {
      var g = "mg" + id, s = "ms" + id;
      return '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#08060c"/><stop offset="1" stop-color="' + mix(a, 30, "#08060c") + '"/></linearGradient>' +
        '<radialGradient id="' + s + '" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="' + mix(a, 60, "#fff") + '" stop-opacity=".55"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="1600" height="900" fill="url(#' + g + ')"/>' +
        '<path d="M800 0 L300 900 L1300 900 Z" fill="url(#' + s + ')"/>' +
        '<g fill="' + mix(a, 45, "#000") + '" opacity=".9"><rect x="0" y="0" width="140" height="900"/><rect x="1460" y="0" width="140" height="900"/></g>' +
        '<g stroke="' + mix(a, 55, "#fff") + '" stroke-width="2" opacity=".35"><line x1="140" y1="120" x2="1460" y2="120"/><line x1="140" y1="780" x2="1460" y2="780"/></g>';
    }
  };
  var GENRE_TO_SCENE = {
    Crime: "crime", "Sci-Fi": "sciFi", Animation: "animation", Fantasy: "animation",
    Horror: "horror", Thriller: "horror", Action: "action", Drama: "drama",
    Romance: "romance", Comedy: "romance", Adventure: "adventure"
  };
  function sceneKeyFor(movie) {
    var genres = movie.genre || [];
    for (var i = 0; i < genres.length; i++) { if (GENRE_TO_SCENE[genres[i]]) return GENRE_TO_SCENE[genres[i]]; }
    return "marquee";
  }
  function buildMovieSceneSvg(movie) {
    var accent = movie.accent || hashAccent(movie.title || "");
    var key = sceneKeyFor(movie);
    var builder = SCENE_BUILDERS[key] || SCENE_BUILDERS.marquee;
    return '<svg class="mv-scene-illustration" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + builder(accent, movie.id.replace(/[^a-z0-9]/gi, "")) + "</svg>";
  }

  function saveLibrary() { safeSet(MK.library, JSON.stringify(library)); }
  function saveWatchlist() { safeSet(MK.watchlist, JSON.stringify(watchlist)); }
  function saveDismissed() { safeSet(MK.dismissed, JSON.stringify(dismissed)); }
  function savePrefs() { safeSet(MK.prefs, JSON.stringify(prefs)); }
  saveLibrary();

  /* ---------------------------------------------------------------------
   * Small helpers
   * ------------------------------------------------------------------- */
  function findSeed(id) { return (window.SEED_MOVIES || []).find(function (m) { return m.id === id; }); }
  function findLibrary(id) { return library.find(function (m) { return m.id === id; }); }
  function statusLabel(status) { return status === "watched" ? "Watched" : status === "watchlist" ? "Watchlist" : "Unwatched"; }
  function durationBucket(minutes) {
    if (minutes < 90) return "Under 90 min";
    if (minutes <= 120) return "90-120 min";
    return "Over 120 min";
  }
  function durationLabel(minutes) {
    minutes = minutes || 0;
    var h = Math.floor(minutes / 60), m = minutes % 60;
    return h > 0 ? (h + "h" + (m ? " " + m + "m" : "")) : (m + "m");
  }
  function ratingLabel(rating) { return (rating == null ? 0 : rating).toFixed(1); }

  /* ---------------------------------------------------------------------
   * Poster rendering — every non-fetched movie renders a CSS-gradient
   * placeholder cover (keyed by accent) with a film-icon watermark and the
   * title, so no broken/blank image can ever appear. A failed asset/upload
   * <img> falls back to the same cover, wired once via capture-phase error
   * listener on #moviesMount (mirrors GameVault's wireLogoFallback).
   * ------------------------------------------------------------------- */
  function posterCoverHtml(movie, cls) {
    var accent = movie.accent || hashAccent(movie.title || "");
    return '<div class="' + cls + ' mv-poster-cover" style="background:linear-gradient(160deg,' + esc(accent) + ',color-mix(in srgb,' + esc(accent) + ' 40%,#0b0b14))">' + mvIcon("film") + '<span>' + esc(movie.title) + '</span></div>';
  }
  function posterHtml(movie, extraClass) {
    var cls = "mv-poster" + (extraClass ? " " + extraClass : "");
    var p = movie.poster || { kind: "placeholder" };
    if ((p.kind === "asset" || p.kind === "upload") && p.src) {
      var fallbackAttrs = ' data-fallback-title="' + esc(movie.title) + '" data-fallback-accent="' + esc(movie.accent || hashAccent(movie.title || "")) + '" data-fallback-class="' + esc(cls) + '"';
      return '<img class="' + cls + ' mv-poster-img" src="' + esc(p.src) + '" alt="' + esc(movie.title) + ' poster" loading="lazy"' + fallbackAttrs + '>';
    }
    return posterCoverHtml(movie, cls);
  }
  function wirePosterFallback() {
    var root = document.getElementById("moviesMount");
    if (!root) return;
    root.addEventListener("error", function (e) {
      var img = e.target;
      if (!img.classList || !img.classList.contains("mv-poster-img")) return;
      var title = img.getAttribute("data-fallback-title") || "";
      var accent = img.getAttribute("data-fallback-accent") || "#7a8fff";
      var cls = img.getAttribute("data-fallback-class") || "mv-poster";
      var cover = document.createElement("div");
      cover.className = cls + " mv-poster-cover";
      cover.style.background = "linear-gradient(160deg," + accent + ",color-mix(in srgb," + accent + " 40%,#0b0b14))";
      cover.innerHTML = mvIcon("film") + "<span>" + esc(title) + "</span>";
      img.replaceWith(cover);
    }, true);
  }

  /* ---------------------------------------------------------------------
   * Library mutations
   * ------------------------------------------------------------------- */
  function addSeedToLibrary(id, status) {
    var seed = findSeed(id);
    if (!seed) return;
    var existing = findLibrary(id);
    if (existing) {
      existing.status = status;
      saveLibrary();
      showToast(seed.title + " marked as " + statusLabel(status) + ".");
      renderAll();
      return;
    }
    var clone = JSON.parse(JSON.stringify(seed));
    clone.status = status;
    clone.custom = false;
    library.push(clone);
    saveLibrary();
    showToast(status === "watched" ? (seed.title + " marked as watched.") : (seed.title + " added to your library."));
    renderAll();
  }
  function changeStatus(id, status) {
    var m = findLibrary(id);
    if (!m) return;
    m.status = status;
    saveLibrary();
    showToast(m.title + " marked as " + statusLabel(status) + ".");
    renderAll();
  }
  function deleteMovie(id) {
    var m = findLibrary(id);
    if (!m || !m.custom) return;
    if (!window.confirm('Delete "' + m.title + '"? This cannot be undone.')) return;
    library = library.filter(function (x) { return x.id !== id; });
    saveLibrary();
    showToast("Movie deleted.");
    renderAll();
  }
  function addToWatchlist(id) {
    if (watchlist.indexOf(id) === -1) { watchlist.push(id); saveWatchlist(); showToast("Added to watchlist."); }
    renderWatchlist();
    renderOverviewWatchlistNext();
    renderOverviewStats();
  }
  function removeFromWatchlist(id) {
    watchlist = watchlist.filter(function (x) { return x !== id; });
    saveWatchlist();
    renderWatchlist();
    renderOverviewWatchlistNext();
    renderOverviewStats();
  }
  function moveWatchlistToWatched(id) {
    addSeedToLibrary(id, "watched");
    removeFromWatchlist(id);
  }
  function dismissSuggestion(id) {
    if (dismissed.indexOf(id) === -1) dismissed.push(id);
    saveDismissed();
    renderSuggestions();
    showToast("Suggestion dismissed.");
  }

  /* ---------------------------------------------------------------------
   * Suggestions — deterministic scoring, never random. Each active
   * preference group contributes at most one point per movie, and every
   * matched group produces a plain-language reason so whyRecommended is
   * always traceable to the real selected inputs.
   * ------------------------------------------------------------------- */
  function fieldMatch(movie, key, selected) {
    if (!selected || !selected.length) return { matched: false, values: [] };
    switch (key) {
      case "genres": { var g = (movie.genre || []).filter(function (x) { return selected.indexOf(x) !== -1; }); return { matched: g.length > 0, values: g }; }
      case "moods": { var mo = (movie.moods || []).filter(function (x) { return selected.indexOf(x) !== -1; }); return { matched: mo.length > 0, values: mo }; }
      case "decades": return { matched: selected.indexOf(movie.decade) !== -1, values: [movie.decade] };
      case "durations": { var bucket = durationBucket(movie.durationMinutes); return { matched: selected.indexOf(bucket) !== -1, values: [bucket] }; }
      case "languages": return { matched: selected.indexOf(movie.language) !== -1, values: [movie.language] };
      case "types": return { matched: selected.indexOf(movie.type) !== -1, values: [movie.type] };
      case "platforms": { var p = (movie.platforms || []).filter(function (x) { return selected.indexOf(x) !== -1; }); return { matched: p.length > 0, values: p }; }
      default: return { matched: false, values: [] };
    }
  }
  function reasonText(group, values) {
    var uniq = values.filter(function (v, i) { return values.indexOf(v) === i; });
    var joined = uniq.join("/");
    switch (group.key) {
      case "genres": return "Matches your " + joined + " genre pick";
      case "moods": return "Fits your " + joined + " mood";
      case "decades": return "From your " + joined + " decade filter";
      case "durations": return "Matches your " + joined + " length preference";
      case "languages": return "In your " + joined + " language filter";
      case "types": return "Matches your " + joined + " type filter";
      case "platforms": return "Available on " + joined + ", one of your platforms";
      default: return "";
    }
  }
  function computeSuggestions() {
    var activeGroups = PREF_GROUPS.filter(function (g) { return (prefs[g.key] || []).length; });
    if (!activeGroups.length) return { active: false, results: [] };
    var results = (window.SEED_MOVIES || [])
      .filter(function (m) { return dismissed.indexOf(m.id) === -1; })
      .map(function (m) {
        var score = 0, reasons = [];
        activeGroups.forEach(function (g) {
          var r = fieldMatch(m, g.key, prefs[g.key]);
          if (r.matched) { score++; reasons.push(reasonText(g, r.values)); }
        });
        return { movie: m, score: score, reasons: reasons };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score || b.movie.rating - a.movie.rating || a.movie.title.localeCompare(b.movie.title); });
    return { active: true, results: results.slice(0, 8) };
  }
  function renderPrefGroups() {
    var el = document.getElementById("mvPrefGroups");
    if (!el) return;
    el.innerHTML = PREF_GROUPS.map(function (group) {
      var opts = group.options.map(function (opt) {
        var checked = (prefs[group.key] || []).indexOf(opt) !== -1;
        return (
          '<label class="mv-pref-chip' + (checked ? " is-checked" : "") + '">' +
            '<input type="checkbox" data-pref-group="' + group.key + '" data-pref-value="' + esc(opt) + '" ' + (checked ? "checked" : "") + ">" +
            "<span>" + esc(opt) + "</span>" +
          "</label>"
        );
      }).join("");
      return '<fieldset class="mv-pref-group"><legend>' + esc(group.label) + "</legend><div class=\"mv-pref-options\">" + opts + "</div></fieldset>";
    }).join("");
  }
  function handlePrefChange(input) {
    var group = input.getAttribute("data-pref-group");
    var value = input.getAttribute("data-pref-value");
    var arr = prefs[group] || (prefs[group] = []);
    var idx = arr.indexOf(value);
    if (input.checked && idx === -1) arr.push(value);
    if (!input.checked && idx !== -1) arr.splice(idx, 1);
    var chip = input.closest(".mv-pref-chip");
    if (chip) chip.classList.toggle("is-checked", input.checked);
    savePrefs();
  }
  function renderSuggestions() {
    var el = document.getElementById("mvSuggestResults");
    if (!el) return;
    var data = computeSuggestions();
    if (!data.active) { el.innerHTML = '<p class="mv-empty">Pick a few preferences above, then select Get Movie Suggestions.</p>'; return; }
    if (!data.results.length) { el.innerHTML = '<p class="mv-empty">No movies match those filters yet — try clearing a few.</p>'; return; }
    el.innerHTML = data.results.map(function (r) {
      var m = r.movie;
      return (
        '<article class="mv-suggest-card" data-reveal data-reveal-group="suggestions" data-reveal-key="' + esc(m.id) + '" style="--mv-brand:' + esc(m.accent) + '">' +
          '<div class="mv-suggest-poster">' + posterHtml(m, "mv-suggest-poster-img") + "</div>" +
          '<div class="mv-suggest-body">' +
            '<div class="mv-suggest-top"><h3>' + esc(m.title) + '</h3><span class="mv-rating">' + mvIcon("star") + ratingLabel(m.rating) + "</span></div>" +
            '<p class="mv-suggest-meta">' + esc((m.genre || []).join(", ")) + " · " + m.year + " · " + durationLabel(m.durationMinutes) + "</p>" +
            '<div class="mv-tag-row">' + (m.tags || []).map(function (t) { return '<span class="mv-tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
            '<p class="mv-suggest-why">' + esc(r.reasons.join("; ") + ".") + "</p>" +
            '<div class="mv-suggest-actions">' +
              '<button type="button" class="btn btn-ghost" data-action="suggest-details" data-id="' + esc(m.id) + '">View Details</button>' +
              '<button type="button" class="btn" data-action="suggest-watchlist" data-id="' + esc(m.id) + '">Add to Watchlist</button>' +
              '<button type="button" class="btn btn-primary" data-action="suggest-watched" data-id="' + esc(m.id) + '">Mark as Watched</button>' +
              '<button type="button" class="btn btn-ghost" data-action="suggest-dismiss" data-id="' + esc(m.id) + '">Dismiss</button>' +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
    wireReveal(el);
  }

  /* ---------------------------------------------------------------------
   * Watchlist panel
   * ------------------------------------------------------------------- */
  function renderWatchlist() {
    var list = document.getElementById("mvWatchlistList");
    if (!list) return;
    if (!watchlist.length) { list.innerHTML = '<p class="mv-empty">Your watchlist is empty — add movies from Suggestions.</p>'; return; }
    list.innerHTML = watchlist.map(function (id) {
      var m = findSeed(id);
      if (!m) return "";
      return (
        '<div class="mv-watchlist-item" data-reveal data-reveal-group="watchlist" data-reveal-key="' + esc(id) + '" style="--mv-brand:' + esc(m.accent) + '">' +
          posterHtml(m, "mv-watchlist-poster") +
          '<span class="mv-watchlist-name"><strong>' + esc(m.title) + "</strong><small>" + esc((m.genre || []).join(", ")) + " · " + m.year + "</small></span>" +
          '<div class="mv-watchlist-actions">' +
            '<button type="button" class="btn" data-action="watchlist-watched" data-id="' + esc(m.id) + '">Mark as Watched</button>' +
            '<button type="button" class="btn btn-ghost" data-action="watchlist-remove" data-id="' + esc(m.id) + '">Remove</button>' +
          "</div>" +
        "</div>"
      );
    }).join("");
    wireReveal(list);
  }

  /* ---------------------------------------------------------------------
   * Library ("My Movies") panel
   * ------------------------------------------------------------------- */
  function filteredLibrary() {
    if (libraryStatusFilter === "all") return library;
    return library.filter(function (m) { return m.status === libraryStatusFilter; });
  }
  function libraryCardHtml(movie) {
    var deleteBtn = movie.custom ? '<button type="button" class="btn btn-icon btn-ghost" data-action="delete-movie" data-id="' + esc(movie.id) + '" aria-label="Delete ' + esc(movie.title) + '" title="Delete movie">' + ICON_DELETE + "</button>" : "";
    var editBtn = movie.custom ? '<button type="button" class="btn btn-icon btn-ghost" data-action="edit-movie" data-id="' + esc(movie.id) + '" aria-label="Edit ' + esc(movie.title) + '" title="Edit movie">' + ICON_EDIT + "</button>" : "";
    return (
      '<article class="mv-card" data-movie-id="' + esc(movie.id) + '" data-reveal data-reveal-group="library" data-reveal-key="' + esc(movie.id) + '" style="--mv-brand:' + esc(movie.accent || "#e0323f") + '">' +
        '<button type="button" class="mv-card-poster-btn" data-action="view-library-details" data-id="' + esc(movie.id) + '" aria-label="View ' + esc(movie.title) + ' details">' + posterHtml(movie, "mv-card-poster-img") + "</button>" +
        '<div class="mv-card-body">' +
          '<h3 class="mv-card-title">' + esc(movie.title) + "</h3>" +
          '<div class="mv-card-meta"><span>' + esc((movie.genre || []).join(", ")) + " · " + movie.year + '</span><span class="mv-rating">' + mvIcon("star") + ratingLabel(movie.rating) + "</span></div>" +
          '<p class="mv-card-duration">' + durationLabel(movie.durationMinutes) + " · " + esc(movie.language || "English") + "</p>" +
          '<div class="mv-card-status-row">' +
            '<span class="mv-status mv-status-' + esc(movie.status) + '">' + statusLabel(movie.status) + "</span>" +
            '<select class="mv-status-select" data-action="change-status" data-id="' + esc(movie.id) + '" aria-label="Change status for ' + esc(movie.title) + '">' +
              '<option value="unwatched"' + (movie.status === "unwatched" ? " selected" : "") + ">Unwatched</option>" +
              '<option value="watched"' + (movie.status === "watched" ? " selected" : "") + ">Watched</option>" +
              '<option value="watchlist"' + (movie.status === "watchlist" ? " selected" : "") + ">Watchlist</option>" +
            "</select>" +
          "</div>" +
          '<div class="mv-card-actions">' + editBtn + deleteBtn + "</div>" +
        "</div>" +
      "</article>"
    );
  }
  function renderLibraryGrid() {
    var el = document.getElementById("mvLibraryGrid");
    if (!el) return;
    var items = filteredLibrary();
    el.innerHTML = items.length
      ? items.map(libraryCardHtml).join("")
      : '<p class="mv-empty">' + (library.length ? "No movies match this filter." : "Your library is empty — search above or add a custom movie.") + "</p>";
    wireReveal(el);
  }

  /* ---------------------------------------------------------------------
   * Overview panel
   * ------------------------------------------------------------------- */
  function renderOverviewStats() {
    var el = document.getElementById("mvOverviewStats");
    if (!el) return;
    var watched = library.filter(function (m) { return m.status === "watched"; }).length;
    var watchlistCount = watchlist.length + library.filter(function (m) { return m.status === "watchlist"; }).length;
    el.innerHTML =
      '<div class="mv-stat-tile"><strong>' + library.length + "</strong><span>Movies tracked</span></div>" +
      '<div class="mv-stat-tile"><strong>' + watched + "</strong><span>Watched</span></div>" +
      '<div class="mv-stat-tile"><strong>' + watchlistCount + "</strong><span>On your watchlist</span></div>";
  }
  function renderOverviewWatchlistNext() {
    var el = document.getElementById("mvOverviewWatchlistNext");
    if (!el) return;
    var nextId = watchlist[0];
    var next = nextId ? findSeed(nextId) : null;
    if (!next) {
      el.innerHTML = "<h3>Up Next</h3><p>Your watchlist is empty. Get suggestions to find something to watch.</p>" +
        '<button type="button" class="btn btn-primary" data-action="goto-suggestions">Get Suggestions</button>';
      return;
    }
    el.innerHTML =
      "<h3>Up Next</h3>" +
      '<div class="mv-next-card" style="--mv-brand:' + esc(next.accent) + '">' + posterHtml(next, "mv-next-poster") +
        "<div><strong>" + esc(next.title) + "</strong><span>" + esc((next.genre || []).join(", ")) + " · " + next.year + "</span></div></div>" +
      '<button type="button" class="btn btn-primary" data-action="watchlist-watched" data-id="' + esc(next.id) + '">Mark as Watched</button>';
  }
  function renderOverviewMiniRow() {
    var el = document.getElementById("mvOverviewMiniRow");
    if (!el) return;
    if (!library.length) { el.innerHTML = ""; return; }
    el.innerHTML = library.slice(0, 8).map(function (m) {
      return '<button type="button" class="mv-mini-card" data-action="view-library-details" data-id="' + esc(m.id) + '">' + posterHtml(m, "mv-mini-poster") + '<span class="mv-mini-card-body"><strong>' + esc(m.title) + "</strong><span>" + statusLabel(m.status) + "</span></span></button>";
    }).join("");
  }

  /* ---------------------------------------------------------------------
   * Movie details modal (works for seed movies and library/custom movies)
   * ------------------------------------------------------------------- */
  function openMovieDetails(movie) {
    var inLibraryEntry = findLibrary(movie.id);
    var isSeed = !!findSeed(movie.id);
    document.getElementById("movieDetailsTitle").textContent = movie.title;
    var actionsHtml = isSeed
      ? ('<div class="mv-details-actions">' +
          '<button type="button" class="btn" data-action="details-watchlist" data-id="' + esc(movie.id) + '">Add to Watchlist</button>' +
          '<button type="button" class="btn btn-primary" data-action="details-watched" data-id="' + esc(movie.id) + '">Mark as Watched</button>' +
        "</div>")
      : "";
    document.getElementById("movieDetailsBody").innerHTML =
      '<div class="mv-details-poster">' + posterHtml(movie, "mv-details-poster-img") + "</div>" +
      (movie.blurb ? "<p>" + esc(movie.blurb) + "</p>" : "") +
      "<p><strong>Genre:</strong> " + esc((movie.genre || []).join(", ")) + "</p>" +
      "<p><strong>Year:</strong> " + movie.year + " · <strong>Duration:</strong> " + durationLabel(movie.durationMinutes) + "</p>" +
      "<p><strong>Language:</strong> " + esc(movie.language || "—") + " · <strong>Rating:</strong> " + ratingLabel(movie.rating) + "</p>" +
      (movie.platforms && movie.platforms.length ? "<p><strong>Platforms:</strong> " + esc(movie.platforms.join(", ")) + "</p>" : "") +
      (inLibraryEntry ? "<p><strong>Status:</strong> " + statusLabel(inLibraryEntry.status) + "</p>" : "") +
      actionsHtml;
    openModal(document.getElementById("movieDetailsOverlay"), document.getElementById("movieDetailsClose"));
  }
  function openSeedDetails(id) { var m = findSeed(id); if (m) openMovieDetails(m); }
  function openLibraryDetails(id) { var m = findLibrary(id); if (m) openMovieDetails(m); }
  function wireMovieDetailsModal() {
    document.getElementById("movieDetailsClose").addEventListener("click", function () { closeModal(document.getElementById("movieDetailsOverlay")); });
  }

  /* ---------------------------------------------------------------------
   * Quick search — searches BOTH the static SEED_MOVIES catalogue and the
   * user's own tracked library by title (GameVault's search only covers
   * its static catalog; this fixes that gap for Movies), with keyboard
   * navigation and an "Add Custom Movie" fallback, mirroring games.js's
   * filterCatalog/combobox pattern.
   * ------------------------------------------------------------------- */
  function mergedPool() {
    var map = {};
    (window.SEED_MOVIES || []).forEach(function (m) { map[m.id] = m; });
    library.forEach(function (m) { map[m.id] = m; });
    return Object.keys(map).map(function (k) { return map[k]; });
  }
  function filterCatalog(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    var starts = [], contains = [];
    mergedPool().forEach(function (m) {
      var title = (m.title || "").toLowerCase();
      if (title.indexOf(q) === 0) starts.push(m);
      else if (title.indexOf(q) !== -1) contains.push(m);
    });
    return starts.concat(contains).slice(0, 8);
  }
  function searchOptionHtml(m, index) {
    var inLib = !!findLibrary(m.id);
    return (
      '<li class="mv-search-option" id="mv-search-opt-' + index + '" role="option" data-index="' + index + '" data-id="' + esc(m.id) + '" aria-selected="' + (index === searchSelectedIndex ? "true" : "false") + '">' +
        posterHtml(m, "mv-search-thumb") +
        "<span>" + esc(m.title) + (inLib ? " <small>(in your library)</small>" : "") + "</span>" +
      "</li>"
    );
  }
  function searchAddCustomHtml(query, index) {
    return (
      '<li class="mv-search-option mv-search-option-add" id="mv-search-opt-' + index + '" role="option" data-index="' + index + '" data-add-custom="1" aria-selected="' + (index === searchSelectedIndex ? "true" : "false") + '">' +
        ICON_PLUS +
        '<span>Add Custom Movie: "' + esc(query) + '"</span>' +
      "</li>"
    );
  }
  function renderSearchDropdown(query) {
    var dropdown = document.getElementById("mvSearchDropdown");
    var input = document.getElementById("mvMovieSearch");
    if (!dropdown || !input) return;
    var q = query.trim();
    if (!q) { closeSearchDropdown(); return; }
    searchResults = filterCatalog(q);
    searchSelectedIndex = 0;
    var html = searchResults.length
      ? searchResults.map(function (m, i) { return searchOptionHtml(m, i); }).join("")
      : '<li class="mv-search-empty">No catalogue matches for "' + esc(q) + '".</li>';
    html += searchAddCustomHtml(q, searchResults.length);
    dropdown.innerHTML = html;
    dropdown.hidden = false;
    input.setAttribute("aria-expanded", "true");
    highlightSearchOption(0);
  }
  function closeSearchDropdown() {
    var dropdown = document.getElementById("mvSearchDropdown");
    var input = document.getElementById("mvMovieSearch");
    if (dropdown) { dropdown.hidden = true; dropdown.innerHTML = ""; }
    if (input) { input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); }
    searchResults = [];
  }
  function highlightSearchOption(index) {
    var dropdown = document.getElementById("mvSearchDropdown");
    if (!dropdown) return;
    var items = dropdown.querySelectorAll(".mv-search-option");
    if (!items.length) return;
    searchSelectedIndex = (index + items.length) % items.length;
    items.forEach(function (item, i) { item.setAttribute("aria-selected", String(i === searchSelectedIndex)); });
    if (items[searchSelectedIndex].scrollIntoView) items[searchSelectedIndex].scrollIntoView({ block: "nearest" });
    document.getElementById("mvMovieSearch").setAttribute("aria-activedescendant", items[searchSelectedIndex].id);
  }
  function selectSearchOption(index) {
    var dropdown = document.getElementById("mvSearchDropdown");
    var input = document.getElementById("mvMovieSearch");
    if (!dropdown || !input) return;
    var item = dropdown.querySelector('.mv-search-option[data-index="' + index + '"]');
    if (!item) return;
    if (item.getAttribute("data-add-custom")) {
      var query = input.value.trim();
      closeSearchDropdown();
      input.value = "";
      openAddMovieModal(null);
      document.getElementById("addMovieTitleInput").value = query;
    } else {
      var id = item.getAttribute("data-id");
      if (findLibrary(id)) { showToast("Already in your library."); openLibraryDetails(id); }
      else addSeedToLibrary(id, "unwatched");
      closeSearchDropdown();
      input.value = "";
    }
  }
  function wireMovieSearch() {
    var input = document.getElementById("mvMovieSearch");
    var dropdown = document.getElementById("mvSearchDropdown");
    if (!input || !dropdown) return;
    input.addEventListener("input", function () { renderSearchDropdown(input.value); });
    input.addEventListener("keydown", function (e) {
      if (dropdown.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); highlightSearchOption(searchSelectedIndex + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); highlightSearchOption(searchSelectedIndex - 1); }
      else if (e.key === "Enter") { e.preventDefault(); selectSearchOption(searchSelectedIndex); }
      else if (e.key === "Escape") { closeSearchDropdown(); }
    });
    dropdown.addEventListener("click", function (e) {
      var item = e.target.closest(".mv-search-option");
      if (item && !item.classList.contains("mv-search-empty")) selectSearchOption(parseInt(item.getAttribute("data-index"), 10));
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".mv-quick-add")) closeSearchDropdown();
    });
  }
  function wireStatusFilter() {
    document.querySelectorAll("#mvStatusFilter [data-status-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        libraryStatusFilter = btn.getAttribute("data-status-filter");
        document.querySelectorAll("#mvStatusFilter .mv-filter-chip").forEach(function (b) { b.classList.toggle("active", b === btn); });
        renderLibraryGrid();
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Add / Edit Movie modal
   * ------------------------------------------------------------------- */
  function populateLanguageSelect() {
    var sel = document.getElementById("addMovieLanguage");
    if (!sel || sel.dataset.populated) return;
    sel.innerHTML = (window.MOVIE_LANGUAGES || []).map(function (l) { return '<option value="' + esc(l) + '">' + esc(l) + "</option>"; }).join("");
    sel.dataset.populated = "1";
  }
  function renderGenreChoices() {
    var el = document.getElementById("addMovieGenreChoices");
    if (!el) return;
    el.innerHTML = (window.MOVIE_GENRES || []).map(function (g) {
      var checked = draftGenres.indexOf(g) !== -1;
      return '<label class="mv-genre-chip' + (checked ? " is-checked" : "") + '"><input type="checkbox" value="' + esc(g) + '" ' + (checked ? "checked" : "") + "><span>" + esc(g) + "</span></label>";
    }).join("");
  }
  function openAddMovieModal(editId) {
    populateLanguageSelect();
    var movie = editId ? findLibrary(editId) : null;
    document.getElementById("addMovieTitle").textContent = movie ? "Edit Movie" : "Add Movie";
    document.getElementById("addMovieId").value = movie ? movie.id : "";
    document.getElementById("addMovieTitleInput").value = movie ? movie.title : "";
    document.getElementById("addMovieYear").value = movie ? movie.year : "";
    document.getElementById("addMovieDuration").value = movie ? movie.durationMinutes : "";
    document.getElementById("addMovieLanguage").value = movie ? movie.language : "English";
    document.getElementById("addMovieRating").value = movie && movie.rating != null ? movie.rating : "";
    document.getElementById("addMovieStatus").value = movie ? movie.status : "unwatched";
    draftGenres = movie ? (movie.genre || []).slice() : [];
    renderGenreChoices();
    draftPosterDataUrl = (movie && movie.poster && movie.poster.kind === "upload") ? movie.poster.src : null;
    var preview = document.getElementById("addMoviePosterPreview");
    if (draftPosterDataUrl) { preview.querySelector("img").src = draftPosterDataUrl; preview.hidden = false; } else { preview.hidden = true; }
    document.getElementById("addMoviePosterFile").value = "";
    document.getElementById("addMovieError").textContent = "";
    editingMovieId = editId || null;
    openModal(document.getElementById("addMovieOverlay"), document.getElementById("addMovieTitleInput"));
  }
  function wireAddMovieModal() {
    document.getElementById("mvAddMovieBtn").addEventListener("click", function () { openAddMovieModal(null); });
    document.getElementById("addMovieClose").addEventListener("click", function () { closeModal(document.getElementById("addMovieOverlay")); });
    document.getElementById("addMovieCancel").addEventListener("click", function () { closeModal(document.getElementById("addMovieOverlay")); });
    document.getElementById("addMovieGenreChoices").addEventListener("change", function (e) {
      var input = e.target;
      if (!input.matches('input[type="checkbox"]')) return;
      var idx = draftGenres.indexOf(input.value);
      if (input.checked && idx === -1) draftGenres.push(input.value);
      if (!input.checked && idx !== -1) draftGenres.splice(idx, 1);
      var chip = input.closest(".mv-genre-chip");
      if (chip) chip.classList.toggle("is-checked", input.checked);
    });
    document.getElementById("addMoviePosterFile").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      var errorEl = document.getElementById("addMovieError");
      errorEl.textContent = "";
      if (!file) return;
      if (!/^image\//.test(file.type)) { errorEl.textContent = "Please choose an image file."; e.target.value = ""; return; }
      if (file.size > 1.5 * 1024 * 1024) { errorEl.textContent = "Poster image is too large (max 1.5MB)."; e.target.value = ""; return; }
      var reader = new FileReader();
      reader.onload = function () {
        draftPosterDataUrl = reader.result;
        var preview = document.getElementById("addMoviePosterPreview");
        preview.querySelector("img").src = draftPosterDataUrl;
        preview.hidden = false;
      };
      reader.readAsDataURL(file);
    });
    document.getElementById("addMoviePosterRemove").addEventListener("click", function () {
      draftPosterDataUrl = null;
      document.getElementById("addMoviePosterFile").value = "";
      document.getElementById("addMoviePosterPreview").hidden = true;
    });
    document.getElementById("addMovieForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var errorEl = document.getElementById("addMovieError");
      var title = document.getElementById("addMovieTitleInput").value.trim();
      if (!title) { errorEl.textContent = "Please enter a movie title."; document.getElementById("addMovieTitleInput").focus(); return; }
      var id = document.getElementById("addMovieId").value || uid("movie");
      var year = parseInt(document.getElementById("addMovieYear").value, 10) || new Date().getFullYear();
      var duration = parseInt(document.getElementById("addMovieDuration").value, 10) || 100;
      var language = document.getElementById("addMovieLanguage").value || "English";
      var rating = parseFloat(document.getElementById("addMovieRating").value);
      if (isNaN(rating)) rating = 0;
      rating = Math.max(0, Math.min(10, rating));
      var status = document.getElementById("addMovieStatus").value || "unwatched";
      var genre = draftGenres.length ? draftGenres.slice() : ["Custom"];
      var poster = draftPosterDataUrl ? { kind: "upload", src: draftPosterDataUrl } : { kind: "placeholder" };
      var backdrop = draftPosterDataUrl ? { kind: "upload", src: draftPosterDataUrl } : { kind: "placeholder" };
      var decade = (Math.floor(year / 10) * 10) + "s";
      var accent = hashAccent(title);
      var existing = findLibrary(id);
      if (existing) {
        existing.title = title; existing.genre = genre; existing.year = year; existing.decade = decade;
        existing.durationMinutes = duration; existing.language = language; existing.rating = rating;
        existing.status = status; existing.poster = poster; existing.backdrop = backdrop;
        existing.accent = existing.accent || accent;
      } else {
        library.push({
          id: id, title: title, genre: genre, year: year, decade: decade, durationMinutes: duration,
          language: language, type: "Movie", platforms: [], rating: rating, poster: poster, backdrop: backdrop,
          moods: [], tags: [], blurb: "", accent: accent, status: status, custom: true
        });
      }
      saveLibrary();
      closeModal(document.getElementById("addMovieOverlay"));
      showToast(existing ? "Movie updated." : "Movie added to your library.");
      editingMovieId = null;
      renderAll();
    });
  }

  /* ---------------------------------------------------------------------
   * Theme switcher (header pills + Appearance tab swatches)
   * ------------------------------------------------------------------- */
  function applyMoviesTheme(theme) {
    var root = document.getElementById("moviesRoot");
    if (!root) return;
    root.setAttribute("data-movies-theme", theme);
    document.body.setAttribute("data-movies-theme", theme);
    document.querySelectorAll(".mv-theme-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-movies-theme-choice") === theme;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    safeSet(MK.theme, theme);
    renderAppearancePanel();
  }
  function wireThemeSwitcher() {
    document.querySelectorAll(".mv-theme-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { applyMoviesTheme(btn.getAttribute("data-movies-theme-choice")); });
    });
    var validThemes = THEME_DEFS.map(function (t) { return t.key; });
    var saved = validThemes.indexOf(safeGet(MK.theme)) !== -1 ? safeGet(MK.theme) : "marquee";
    applyMoviesTheme(saved);
  }
  function renderAppearancePanel() {
    var el = document.getElementById("mvThemeSwatches");
    if (!el) return;
    var current = safeGet(MK.theme) || "marquee";
    el.innerHTML = THEME_DEFS.map(function (t) {
      return '<button type="button" class="mv-swatch-card' + (t.key === current ? " active" : "") + '" data-action="apply-movies-theme" data-theme="' + t.key + '"><div class="mv-swatch-preview" style="background:' + t.preview + '"></div><strong>' + t.label + "</strong></button>";
    }).join("");
  }

  /* ---------------------------------------------------------------------
   * Cinematic spotlight — the hero carousel. Only the 5 seed movies with
   * fetched (poster.kind === "asset") real art are featured here, so the
   * hero always has real imagery regardless of what the user has tracked.
   * Mirrors GameVault's spotlight cross-fade + --px/--py pointer-parallax.
   * ------------------------------------------------------------------- */
  function safeMatchMedia(query) {
    if (window.matchMedia) return window.matchMedia(query);
    return { matches: false, addEventListener: function () {}, removeEventListener: function () {} };
  }
  /* .matches reflects OneSpace's manual Settings override first (if the user
     forced reduced/full motion), falling back to the OS-level media query. */
  var osMotionQuery = safeMatchMedia("(prefers-reduced-motion: reduce)");
  var motionQuery = {
    get matches() {
      if (OS.prefersReducedMotion) return OS.prefersReducedMotion();
      return osMotionQuery.matches;
    },
    addEventListener: function (type, fn) { osMotionQuery.addEventListener(type, fn); }
  };
  var finePointerQuery = safeMatchMedia("(hover: hover) and (pointer: fine)");
  /* Every seed movie gets an illustrated hero scene (see buildMovieSceneSvg),
     so the spotlight carousel is no longer limited to the handful of movies
     that happen to have a fetched poster image. */
  function featuredMovies() { return window.SEED_MOVIES || []; }
  var spotlight = {
    id: safeGet(MK.spotlight) || (featuredMovies()[0] && featuredMovies()[0].id) || null,
    paused: safeGet(MK.autoplay) === "paused",
    hover: false, focus: false, visible: true, timer: null,
    frame: null, x: 0, y: 0, targetX: 0, targetY: 0
  };
  function spotlightMovie() {
    var list = featuredMovies();
    if (!list.length) return null;
    return list.find(function (m) { return m.id === spotlight.id; }) || list[0];
  }
  function selectSpotlight(id, reason) {
    var movie = featuredMovies().find(function (m) { return m.id === id; });
    if (!movie) return;
    var changed = spotlight.id !== id;
    spotlight.id = id;
    safeSet(MK.spotlight, id);
    if (changed) renderSpotlight(reason);
    if (reason === "manual") { var ann = document.getElementById("mvSpotlightAnnouncement"); if (ann) ann.textContent = movie.title + " selected."; }
    syncSpotlightPlayback();
  }
  function advanceSpotlight(direction, reason) {
    var list = featuredMovies();
    if (!list.length) return;
    var index = list.findIndex(function (m) { return m.id === spotlight.id; });
    selectSpotlight(list[(index + direction + list.length) % list.length].id, reason);
  }
  function renderSpotlight(reason) {
    var hero = document.getElementById("mvSpotlight");
    var movie = spotlightMovie();
    if (!hero || !movie) return;
    spotlight.id = movie.id;
    var list = featuredMovies();
    var index = list.findIndex(function (m) { return m.id === movie.id; });
    hero.dataset.movieId = movie.id;
    var inLib = findLibrary(movie.id);
    var content = document.getElementById("mvHeroContent");
    content.innerHTML =
      '<p class="mv-hero-tagline">' + esc((movie.tags && movie.tags[0]) || "Featured Tonight") + "</p>" +
      '<h1 class="mv-hero-title">' + esc(movie.title) + "</h1>" +
      '<div class="mv-hero-meta"><span>' + esc((movie.genre || []).join(", ")) + "</span><span>" + movie.year + "</span><span>" + durationLabel(movie.durationMinutes) + '</span><span class="mv-hero-rating">' + mvIcon("star") + ratingLabel(movie.rating) + "</span></div>" +
      '<p class="mv-hero-blurb">' + esc(movie.blurb || "") + "</p>" +
      '<div class="mv-hero-actions">' +
        '<button type="button" class="btn mv-hero-primary" data-action="suggest-watched" data-id="' + esc(movie.id) + '">' + mvIcon("play") + (inLib && inLib.status === "watched" ? "Watched" : "Mark as Watched") + "</button>" +
        '<button type="button" class="btn mv-hero-secondary" data-action="suggest-details" data-id="' + esc(movie.id) + '">View Details</button>' +
        '<button type="button" class="btn mv-hero-secondary" data-action="change-spotlight">Next Feature ' + mvIcon("next") + "</button>" +
      "</div>";
    var art = document.getElementById("mvSceneArt");
    if (art.dataset.movieId !== movie.id) {
      art.dataset.movieId = movie.id;
      art.querySelectorAll(".mv-scene-bg").forEach(function (p) { p.classList.remove("is-active"); });
      var scene = document.createElement("div");
      scene.className = "mv-scene-bg";
      scene.innerHTML = buildMovieSceneSvg(movie);
      art.appendChild(scene);
      requestAnimationFrame(function () { scene.classList.add("is-active"); });
      setTimeout(function () { Array.from(art.children).forEach(function (p) { if (p !== art.lastElementChild) p.remove(); }); }, 650);
    }
    var heroIndexEl = document.getElementById("mvHeroIndex");
    function pad2(n) { return n < 10 ? "0" + n : String(n); }
    if (heroIndexEl) heroIndexEl.textContent = index < 0 ? "FEATURED" : pad2(index + 1) + " / " + pad2(list.length);
    [document.getElementById("mvHeroDots"), document.getElementById("mvSpotlightRail")].forEach(function (root, type) {
      if (!root) return;
      var sig = list.map(function (m) { return m.id; }).join(",");
      if (root.dataset.signature !== sig) {
        root.dataset.signature = sig;
        root.innerHTML = list.map(function (m, i) {
          return '<button type="button" class="' + (type ? "mv-spotlight-card" : "mv-dot") + '" data-spotlight-id="' + esc(m.id) + '" aria-label="Show ' + esc(m.title) + '">' +
            (type ? (posterHtml(m, "mv-rail-poster") + "<span><small>0" + (i + 1) + " / " + esc((m.genre && m.genre[0]) || "") + "</small><strong>" + esc(m.title) + "</strong></span>" + mvIcon("next")) : "<span></span>") +
            "</button>";
        }).join("");
      }
      root.querySelectorAll("[data-spotlight-id]").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-spotlight-id") === movie.id));
      });
    });
    if (reason !== "refresh") {
      hero.classList.remove("is-hero-entering", "is-hero-switching");
      void hero.offsetWidth;
      hero.classList.add(reason === "entry" ? "is-hero-entering" : "is-hero-switching");
      clearTimeout(hero._mvEntranceTimer);
      hero._mvEntranceTimer = setTimeout(function () { hero.classList.remove("is-hero-entering", "is-hero-switching"); }, 1500);
    }
  }
  function syncSpotlightPlayback() {
    clearTimeout(spotlight.timer); spotlight.timer = null;
    var hero = document.getElementById("mvSpotlight");
    if (!hero) return;
    var isMovies = document.body.getAttribute("data-page") === "movies";
    var blocked = spotlight.paused || motionQuery.matches || spotlight.hover || spotlight.focus || document.hidden || !isMovies || activeTab !== "overview" || !spotlight.visible;
    hero.dataset.playing = String(!blocked);
    var button = document.getElementById("mvAutoplay");
    if (button) {
      var controlState = spotlight.paused || motionQuery.matches ? "play" : "pause";
      if (button.dataset.state !== controlState) {
        button.dataset.state = controlState;
        button.innerHTML = mvIcon(controlState) + "<span>" + (controlState === "play" ? "Play" : "Pause") + "</span>";
      }
      button.disabled = motionQuery.matches;
      button.setAttribute("aria-label", motionQuery.matches ? "Automatic rotation disabled for reduced motion" : spotlight.paused ? "Start automatic rotation" : "Pause automatic rotation");
    }
    if (!blocked) spotlight.timer = setTimeout(function () { advanceSpotlight(1, "auto"); }, 6500);
    if (document.hidden || !isMovies || motionQuery.matches || !finePointerQuery.matches || !spotlight.visible || spotlight.paused) {
      cancelAnimationFrame(spotlight.frame); spotlight.frame = null;
      spotlight.x = spotlight.y = spotlight.targetX = spotlight.targetY = 0;
      hero.style.setProperty("--px", "0"); hero.style.setProperty("--py", "0");
    }
  }
  function animatePointer() {
    spotlight.x += (spotlight.targetX - spotlight.x) * .085;
    spotlight.y += (spotlight.targetY - spotlight.y) * .085;
    var hero = document.getElementById("mvSpotlight");
    if (!hero) { spotlight.frame = null; return; }
    hero.style.setProperty("--px", spotlight.x.toFixed(4)); hero.style.setProperty("--py", spotlight.y.toFixed(4));
    spotlight.frame = Math.abs(spotlight.x - spotlight.targetX) + Math.abs(spotlight.y - spotlight.targetY) > .002 ? requestAnimationFrame(animatePointer) : null;
  }
  function initSpotlight() {
    var hero = document.getElementById("mvSpotlight");
    if (!hero) return;
    document.getElementById("mvPrevious").innerHTML = mvIcon("previous");
    document.getElementById("mvNext").innerHTML = mvIcon("next");
    document.getElementById("mvPrevious").addEventListener("click", function () { advanceSpotlight(-1, "manual"); });
    document.getElementById("mvNext").addEventListener("click", function () { advanceSpotlight(1, "manual"); });
    document.getElementById("mvAutoplay").addEventListener("click", function () { spotlight.paused = !spotlight.paused; safeSet(MK.autoplay, spotlight.paused ? "paused" : "playing"); syncSpotlightPlayback(); });
    document.getElementById("moviesMount").addEventListener("click", function (e) {
      var button = e.target.closest("[data-spotlight-id]");
      if (button) selectSpotlight(button.getAttribute("data-spotlight-id"), "manual");
    });
    hero.addEventListener("keydown", function (e) {
      if (e.target.matches("input,select,textarea")) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault(); advanceSpotlight(e.key === "ArrowLeft" ? -1 : 1, "manual");
    });
    [hero, document.getElementById("mvSpotlightRail")].forEach(function (region) {
      region.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") { spotlight.hover = true; syncSpotlightPlayback(); } });
      region.addEventListener("pointerleave", function () { spotlight.hover = false; spotlight.targetX = spotlight.targetY = 0; if (!spotlight.frame && !motionQuery.matches) spotlight.frame = requestAnimationFrame(animatePointer); syncSpotlightPlayback(); });
      region.addEventListener("focusin", function () { spotlight.focus = true; syncSpotlightPlayback(); });
      region.addEventListener("focusout", function () { setTimeout(function () { spotlight.focus = hero.contains(document.activeElement) || document.getElementById("mvSpotlightRail").contains(document.activeElement); syncSpotlightPlayback(); }, 0); });
    });
    hero.addEventListener("pointermove", function (e) {
      if (motionQuery.matches || !finePointerQuery.matches || document.hidden || spotlight.paused) return;
      var rect = hero.getBoundingClientRect();
      spotlight.targetX = (e.clientX - rect.left) / rect.width - .5;
      spotlight.targetY = (e.clientY - rect.top) / rect.height - .5;
      if (!spotlight.frame) spotlight.frame = requestAnimationFrame(animatePointer);
    }, { passive: true });
    var touch = null;
    hero.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch" && !e.target.closest("button")) touch = { x: e.clientX, y: e.clientY }; });
    hero.addEventListener("pointerup", function (e) { if (!touch) return; var dx = e.clientX - touch.x, dy = e.clientY - touch.y; touch = null; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) advanceSpotlight(dx > 0 ? -1 : 1, "manual"); });
    hero.addEventListener("pointercancel", function () { touch = null; });
    document.addEventListener("visibilitychange", function () { syncSpotlightPlayback(); });
    motionQuery.addEventListener("change", function () { wireReveal(document.getElementById("moviesMount")); syncSpotlightPlayback(); });
    finePointerQuery.addEventListener("change", syncSpotlightPlayback);
    document.addEventListener("onespace:page-changed", syncSpotlightPlayback);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (entries) { spotlight.visible = entries[0].isIntersecting; syncSpotlightPlayback(); }, { threshold: .1 }).observe(hero);
  }

  /* ---------------------------------------------------------------------
   * Tabs + animations
   * ------------------------------------------------------------------- */
  function applyTabVisibility(tab) {
    document.querySelectorAll(".mv-tab").forEach(function (btn) {
      var active = btn.getAttribute("data-mv-tab") === tab;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll(".mv-panel").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== tab;
    });
    var spotlightEl = document.getElementById("mvSpotlight");
    var railEl = document.getElementById("mvSpotlightRail");
    if (spotlightEl) spotlightEl.hidden = tab !== "overview";
    if (railEl) railEl.hidden = tab !== "overview";
    syncSpotlightPlayback();
  }
  function playPanelAnimation(tab) {
    var panel = document.querySelector('.mv-panel[data-panel="' + tab + '"]');
    if (!panel) return;
    panel.classList.remove("is-entering");
    void panel.offsetWidth;
    panel.classList.add("is-entering");
    clearTimeout(panel._mvAnimCleanup);
    panel._mvAnimCleanup = setTimeout(function () { panel.classList.remove("is-entering"); }, 1400);
  }
  function switchTab(tab) {
    if (TABS.indexOf(tab) === -1) tab = "overview";
    activeTab = tab;
    safeSet(MK.activeTab, tab);
    applyTabVisibility(tab);
    playPanelAnimation(tab);
    wireReveal(document.querySelector('.mv-panel[data-panel="' + tab + '"]'));
  }
  function focusPanel(name) {
    var panel = document.querySelector('.mv-panel[data-panel="' + name + '"]');
    if (!panel) return;
    panel.tabIndex = -1;
    panel.focus({ preventScroll: true });
    if (panel.scrollIntoView) panel.scrollIntoView({ behavior: motionQuery.matches ? "auto" : "smooth", block: "start" });
  }
  function wireTabs() {
    document.querySelectorAll(".mv-tab").forEach(function (btn) {
      btn.addEventListener("click", function () { switchTab(btn.getAttribute("data-mv-tab")); });
      btn.addEventListener("keydown", function (e) {
        var index = TABS.indexOf(btn.getAttribute("data-mv-tab"));
        if (e.key === "ArrowRight") index = (index + 1) % TABS.length;
        else if (e.key === "ArrowLeft") index = (index + TABS.length - 1) % TABS.length;
        else if (e.key === "Home") index = 0;
        else if (e.key === "End") index = TABS.length - 1;
        else return;
        e.preventDefault(); switchTab(TABS[index]);
        document.querySelector('[data-mv-tab="' + TABS[index] + '"]').focus();
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Delegated event wiring for #moviesMount dynamic content
   * ------------------------------------------------------------------- */
  function wireDelegatedEvents() {
    var root = document.getElementById("moviesMount");
    if (!root) return;
    root.addEventListener("click", function (e) {
      var target = e.target.closest("[data-action]");
      if (!target) return;
      var action = target.getAttribute("data-action");
      var id = target.getAttribute("data-id");
      switch (action) {
        case "change-spotlight": advanceSpotlight(1, "manual"); break;
        case "view-library-details": openLibraryDetails(id); break;
        case "suggest-details": openSeedDetails(id); break;
        case "suggest-watchlist": addToWatchlist(id); break;
        case "suggest-watched": addSeedToLibrary(id, "watched"); break;
        case "suggest-dismiss": dismissSuggestion(id); break;
        case "watchlist-watched": moveWatchlistToWatched(id); break;
        case "watchlist-remove": removeFromWatchlist(id); break;
        case "details-watchlist": addToWatchlist(id); closeModal(document.getElementById("movieDetailsOverlay")); break;
        case "details-watched": addSeedToLibrary(id, "watched"); closeModal(document.getElementById("movieDetailsOverlay")); break;
        case "edit-movie": openAddMovieModal(id); break;
        case "delete-movie": deleteMovie(id); break;
        case "apply-movies-theme": applyMoviesTheme(target.getAttribute("data-theme")); break;
        case "goto-suggestions": switchTab("suggestions"); focusPanel("suggestions"); break;
      }
    });
    root.addEventListener("change", function (e) {
      var t = e.target;
      if (t.matches && t.matches('[data-action="change-status"]')) {
        changeStatus(t.getAttribute("data-id"), t.value);
      } else if (t.matches && t.matches("[data-pref-group]")) {
        handlePrefChange(t);
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Suggestions toolbar buttons
   * ------------------------------------------------------------------- */
  function wireSuggestionsButtons() {
    document.getElementById("mvGetSuggestions").addEventListener("click", function () { renderSuggestions(); });
    document.getElementById("mvClearFilters").addEventListener("click", function () {
      prefs = defaultPrefs();
      savePrefs();
      renderPrefGroups();
      renderSuggestions();
      showToast("Filters cleared.");
    });
    document.getElementById("mvResetPreferences").addEventListener("click", function () {
      prefs = defaultPrefs();
      savePrefs();
      renderPrefGroups();
      document.getElementById("mvSuggestResults").innerHTML = '<p class="mv-empty">Pick a few preferences above, then select Get Movie Suggestions.</p>';
      showToast("Preferences reset.");
    });
  }

  /* ---------------------------------------------------------------------
   * Render everything
   * ------------------------------------------------------------------- */
  function renderAll() {
    renderLibraryGrid();
    renderOverviewStats();
    renderOverviewWatchlistNext();
    renderOverviewMiniRow();
    renderWatchlist();
    renderSuggestions();
    renderAppearancePanel();
    renderSpotlight("refresh");
  }

  function playEntryAnimation() {
    var root = document.getElementById("moviesRoot");
    if (!root) return;
    var now = Date.now();
    if (now - (root._mvLastEntryAnim || 0) < 80) return;
    root._mvLastEntryAnim = now;
    activeTab = TABS.indexOf(safeGet(MK.activeTab)) !== -1 ? safeGet(MK.activeTab) : "overview";
    applyTabVisibility(activeTab);
    renderSpotlight("entry");
    resetReveals();
    root.classList.remove("is-entering-view");
    void root.offsetWidth;
    root.classList.add("is-entering-view");
    clearTimeout(root._mvAnimCleanup);
    root._mvAnimCleanup = setTimeout(function () { root.classList.remove("is-entering-view"); }, 2400);
    playPanelAnimation(activeTab);
  }

  /* ---------------------------------------------------------------------
   * Shell markup — built once into #moviesMount on first activation.
   * ------------------------------------------------------------------- */
  function buildShellHtml() {
    return (
      '<div id="moviesRoot" class="mv-root" data-movies-theme="marquee">' +
        '<div class="mv-header">' +
          '<div class="mv-brand" role="img" aria-label="Movie Nights — your watch tracker">' +
            '<span class="mv-emblem" aria-hidden="true"><span class="mv-emblem-ring"></span>' + mvIcon("reel") + "</span>" +
            '<span class="mv-wordmark">Movie Nights</span>' +
            '<span class="mv-tagline">Discover, track, and decide what\'s next</span>' +
          "</div>" +
          '<div class="mv-header-actions">' +
            '<div class="mv-theme-switch" role="group" aria-label="Movies theme">' +
              THEME_DEFS.map(function (t) { return '<button type="button" class="mv-theme-btn" data-movies-theme-choice="' + t.key + '" aria-pressed="false">' + t.label + "</button>"; }).join("") +
            "</div>" +
            '<button type="button" class="btn btn-primary" id="mvAddMovieBtn">' + ICON_PLUS + " Add Movie</button>" +
          "</div>" +
        "</div>" +

        '<section id="mvSpotlight" class="mv-spotlight" aria-label="Featured movie" aria-roledescription="carousel" tabindex="0">' +
          '<div class="mv-scene" aria-hidden="true">' +
            '<div id="mvSceneArt" class="mv-scene-art"></div>' +
            '<div class="mv-scene-shade"></div>' +
            '<div class="mv-scene-spotcones"></div>' +
            '<div class="mv-scene-filmstrip mv-scene-filmstrip-top"></div>' +
            '<div class="mv-scene-filmstrip mv-scene-filmstrip-bottom"></div>' +
          "</div>" +
          '<div class="mv-hero-topline"><span><span class="mv-status-light"></span> FEATURED TONIGHT</span><span id="mvHeroIndex">01 / 05</span></div>' +
          '<div id="mvHeroContent" class="mv-hero-content"></div>' +
          '<div class="mv-hero-footer">' +
            '<div class="mv-hero-controls" role="group" aria-label="Spotlight controls">' +
              '<button type="button" id="mvPrevious" class="mv-control" aria-label="Previous movie"></button>' +
              '<div id="mvHeroDots" class="mv-hero-dots" role="group" aria-label="Choose featured movie"></div>' +
              '<button type="button" id="mvNext" class="mv-control" aria-label="Next movie"></button>' +
              '<button type="button" id="mvAutoplay" class="mv-control mv-autoplay" aria-label="Pause automatic rotation"></button>' +
            "</div>" +
          "</div>" +
        "</section>" +
        '<div id="mvSpotlightRail" class="mv-spotlight-rail" role="group" aria-label="Featured movies"></div>' +
        '<p id="mvSpotlightAnnouncement" class="visually-hidden" aria-live="polite" aria-atomic="true"></p>' +

        '<nav class="mv-tabs" aria-label="Movies sections" role="tablist">' +
          '<button type="button" class="mv-tab active" data-mv-tab="overview" role="tab" aria-selected="true">' + mvIcon("overview") + "<span>Overview</span></button>" +
          '<button type="button" class="mv-tab" data-mv-tab="library" role="tab" aria-selected="false">' + mvIcon("library") + "<span>My Movies</span></button>" +
          '<button type="button" class="mv-tab" data-mv-tab="suggestions" role="tab" aria-selected="false">' + mvIcon("suggestions") + "<span>Suggestions</span></button>" +
          '<button type="button" class="mv-tab" data-mv-tab="watchlist" role="tab" aria-selected="false">' + mvIcon("watchlist") + "<span>Watchlist</span></button>" +
          '<button type="button" class="mv-tab" data-mv-tab="appearance" role="tab" aria-selected="false">' + mvIcon("appearance") + "<span>Appearance</span></button>" +
        "</nav>" +

        '<section class="mv-panel" data-panel="overview" role="tabpanel">' +
          '<div class="mv-overview-stats" id="mvOverviewStats" data-reveal data-reveal-key="overview-stats"></div>' +
          '<div class="mv-overview-columns">' +
            '<div class="mv-watchlist-next" id="mvOverviewWatchlistNext" data-reveal data-reveal-key="overview-next"></div>' +
            '<div class="mv-mini-row" id="mvOverviewMiniRow"></div>' +
          "</div>" +
        "</section>" +

        '<section class="mv-panel" data-panel="library" role="tabpanel" hidden>' +
          '<div class="mv-quick-add">' +
            '<label class="visually-hidden" for="mvMovieSearch">Search a movie to track or add</label>' +
            '<input type="text" id="mvMovieSearch" placeholder="Search a movie to track or add…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="mvSearchDropdown" aria-haspopup="listbox">' +
            '<ul class="mv-search-dropdown" id="mvSearchDropdown" role="listbox" hidden></ul>' +
          "</div>" +
          '<div class="mv-status-filter" id="mvStatusFilter" role="group" aria-label="Filter by status">' +
            '<button type="button" class="mv-filter-chip active" data-status-filter="all">All</button>' +
            '<button type="button" class="mv-filter-chip" data-status-filter="watched">Watched</button>' +
            '<button type="button" class="mv-filter-chip" data-status-filter="unwatched">Unwatched</button>' +
            '<button type="button" class="mv-filter-chip" data-status-filter="watchlist">Watchlist</button>' +
          "</div>" +
          '<div class="mv-grid" id="mvLibraryGrid"></div>' +
        "</section>" +

        '<section class="mv-panel" data-panel="suggestions" role="tabpanel" hidden>' +
          '<div class="mv-suggestions" aria-labelledby="mvSuggestTitle">' +
            '<div class="mv-suggest-head"><h2 id="mvSuggestTitle">Movie Suggestions</h2><p>Tell us what you\'re in the mood for and we\'ll point you at something worth watching.</p></div>' +
            '<div class="mv-pref-groups" id="mvPrefGroups"></div>' +
            '<div class="mv-suggest-actions">' +
              '<button type="button" class="btn btn-primary" id="mvGetSuggestions">Get Movie Suggestions</button>' +
              '<button type="button" class="btn" id="mvClearFilters">Clear Filters</button>' +
              '<button type="button" class="btn btn-ghost" id="mvResetPreferences">Reset Preferences</button>' +
            "</div>" +
            '<div class="mv-suggest-results" id="mvSuggestResults"></div>' +
          "</div>" +
        "</section>" +

        '<section class="mv-panel" data-panel="watchlist" role="tabpanel" hidden>' +
          '<div class="mv-watchlist" aria-labelledby="mvWatchlistTitle">' +
            '<h2 id="mvWatchlistTitle">Your Watchlist</h2>' +
            '<div class="mv-watchlist-list" id="mvWatchlistList"></div>' +
          "</div>" +
        "</section>" +

        '<section class="mv-panel" data-panel="appearance" role="tabpanel" hidden>' +
          '<div class="mv-theme-swatches" id="mvThemeSwatches"></div>' +
        "</section>" +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------- */
  function mount() {
    if (mounted) return;
    var mountEl = document.getElementById("moviesMount");
    if (!mountEl) return;
    mounted = true;
    mountEl.innerHTML = buildShellHtml();

    initSpotlight();
    renderPrefGroups();
    document.getElementById("mvSuggestResults").innerHTML = '<p class="mv-empty">Pick a few preferences above, then select Get Movie Suggestions.</p>';

    wireAddMovieModal();
    wireMovieDetailsModal();
    wireThemeSwitcher();
    wireSuggestionsButtons();
    wireMovieSearch();
    wireStatusFilter();
    wireTabs();
    wireDelegatedEvents();
    wirePosterFallback();

    renderAll();
    activeTab = TABS.indexOf(safeGet(MK.activeTab)) !== -1 ? safeGet(MK.activeTab) : "overview";
    applyTabVisibility(activeTab);
  }

  function init() {
    document.addEventListener("onespace:page-changed", function (e) {
      if (e.detail && e.detail.page === "movies") { mount(); playEntryAnimation(); }
    });
    if (document.body.getAttribute("data-page") === "movies") { mount(); playEntryAnimation(); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
