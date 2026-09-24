/* ===========================================================================
 * GameVault — Games dashboard behavior.
 * Reuses window.OneSpace helpers (safeGet/safeSet/safeGetJSON/showToast/
 * openModal/closeModal) exposed by index.html instead of redefining them.
 * All storage keys are namespaced "orbit-games-*" to avoid collisions with
 * OneSpace's existing "orbit-*" keys.
 * ===================================================================== */
(function () {
  "use strict";

  var OS = window.OneSpace || {};
  var safeGet = OS.safeGet, safeSet = OS.safeSet, safeGetJSON = OS.safeGetJSON;
  var showToast = OS.showToast, openModal = OS.openModal, closeModal = OS.closeModal;

  /* Safe matchMedia: some environments (older WebViews, hardened browsers,
     test runners) don't implement window.matchMedia at all — fall back to a
     MediaQueryList-shaped stub so callers can always read .matches and
     attach a "change" listener without guarding every call site. */
  function safeMatchMedia(query) {
    if (window.matchMedia) return window.matchMedia(query);
    return { matches: false, addEventListener: function () {}, removeEventListener: function () {} };
  }

  var GK = {
    library: "orbit-games-library",
    weekly: "orbit-games-weekly",
    theme: "orbit-games-theme",
    wishlist: "orbit-games-wishlist",
    dismissed: "orbit-games-dismissed",
    prefs: "orbit-games-preferences",
    activeTab: "orbit-games-active-tab",
    selectedStory: "orbit-games-selected-story",
    selectedWeekly: "orbit-games-selected-weekly",
    sessions: "orbit-games-sessions",
    journal: "orbit-games-journal"
  };

  var TABS = ["overview", "library", "missions", "weekly", "suggestions", "sessions", "journal", "appearance"];

  var ICON_CLOSE = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  var ICON_EDIT = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>';
  var ICON_DELETE = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';
  var ICON_CHECK = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  var ICON_PLUS = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
  var ICON_CHEVRON = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"></polyline></svg>';

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function statusSlug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function uid(prefix) { return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7); }

  /* ---------------------------------------------------------------------
   * Scroll-triggered reveal (data-reveal / data-reveal-group) — a single
   * shared IntersectionObserver reused across every panel render, so cards
   * fade+slide in as they enter the viewport (not just when a tab opens).
   *
   * Render functions rebuild their container's innerHTML on every data
   * change too (checking a task, editing an objective, adding a journal
   * entry, ...), which would otherwise re-hide-then-reveal every card on
   * every unrelated interaction. revealedKeys remembers which items have
   * already played their reveal since the last Games entry (keyed by each
   * item's own id via data-reveal-key) so a re-render of already-seen
   * items shows them instantly, while a genuinely new item (or a fresh
   * Games entry, via resetReveals()) still gets the real reveal.
   * ------------------------------------------------------------------- */
  var revealObserver = null;
  var pendingReveals = new Set();
  var revealedKeys = {};
  /* .is-revealing only ever drives the one-shot CSS animation; it's removed
     as soon as that animation finishes (mirroring how .is-entering/
     .is-entering-view are cleared elsewhere) so a settled card's transform
     is never pinned by a finished-but-still-"both"-filling animation,
     which would otherwise block its own :hover lift. */
  function revealNow(el) {
    el.classList.add("is-visible", "is-revealing");
    var key = el.getAttribute("data-reveal-key");
    if (key) revealedKeys[key] = true;
  }
  function ensureRevealObserver(){if(!OS.scene)return null;if(!revealObserver)revealObserver={observe:function(el){OS.scene.observe(el,function(){revealNow(el);pendingReveals.delete(el);});},unobserve:function(el){OS.scene.unobserve(el);}};return revealObserver;}
  function wireReveal(root) {
    pendingReveals.forEach(function (el) { if (!el.isConnected) { if (revealObserver) revealObserver.unobserve(el); pendingReveals.delete(el); } });
    var reduced = OS.prefersReducedMotion();
    var counts = {};
    (root || document).querySelectorAll("[data-reveal]").forEach(function (el) {
      var group = el.getAttribute("data-reveal-group") || "default";
      counts[group] = counts[group] || 0;
      el.style.setProperty("--gv-reveal-delay", (Math.min(counts[group]++, 5) * 70) + "ms");
      var key = el.getAttribute("data-reveal-key");
      if (reduced || (key && revealedKeys[key])) { el.classList.add("is-visible"); return; }
      el.classList.remove("is-visible", "is-revealing");
      var obs = ensureRevealObserver();
      if (obs) { obs.observe(el); pendingReveals.add(el); } else revealNow(el);
    });
  }
  function resetReveals() {
    revealedKeys = {};
    document.querySelectorAll("#gamesView [data-reveal]").forEach(function (el) {
      el.classList.remove("is-visible", "is-revealing");
      var obs = ensureRevealObserver();
      if (obs) obs.observe(el); else revealNow(el);
    });
  }
  document.addEventListener("animationend", function (e) {
    if (e.target.classList && e.target.classList.contains("is-revealing") && e.animationName === "gvRevealIn") {
      e.target.classList.remove("is-revealing");
    }
  });

  /* ---------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------- */
  var library = safeGetJSON(GK.library, null);
  if (!library) {
    library = (window.DEFAULT_GAMES || []).map(function (g) { return JSON.parse(JSON.stringify(g)); });
  } else {
    /* Default games' identity fields (name/platform/genre/accent/logo) are never
       user-editable, so it's always safe to resync them from the current
       games-data.js definition (e.g. a logo asset path change) without touching
       any stored progress (story/trackerType stay untouched). */
    (window.DEFAULT_GAMES || []).forEach(function (def) {
      var existing = library.find(function (g) { return g.id === def.id && !g.custom; });
      if (existing) {
        existing.name = def.name; existing.platform = existing.platform || def.platform; existing.genre = def.genre;
        existing.accent = def.accent; existing.logo = def.logo;
        existing.artwork = def.artwork; existing.artworkMobile = def.artworkMobile; existing.cardArtwork = def.cardArtwork; existing.artworkPosition = def.artworkPosition;
        existing.world = def.world; existing.tagline = def.tagline; existing.defaultTaskTemplates=def.defaultTaskTemplates; existing.weeklyTemplate=def.weeklyTemplate; if(!existing.resources)existing.resources=def.resources;
      }
    });
  }
  var weekly = safeGetJSON(GK.weekly, {});
  var prefs = Object.assign({ platforms: [], genres: [], playstyles: [], moods: [] }, safeGetJSON(GK.prefs, {}));
  var sessions = safeGetJSON(GK.sessions, []);
  var journal = safeGetJSON(GK.journal, []);
  var draftTrackerType = "story",draftTrackerTouched=false;
  var draftLogoDataUrl = null;
  var activeTab = "overview";
  var selectedStoryGameId = null;
  var selectedWeeklyGameId = null;
  var editingJournalId = null;
  var lastCheckedObjectiveId = null;
  var lastCheckedTaskId = null;
  var searchSelectedIndex = 0;
  var searchResults = [];
  var sessionTickInterval = null;

  var PREF_GROUPS = [
    { key: "platforms", label: "Platforms", options: window.GAMES_PLATFORMS || [] },
    { key: "genres", label: "Genres", options: window.GAMES_GENRES || [] },
    { key: "playstyles", label: "Play styles", options: window.GAMES_PLAYSTYLES || [] },
    { key: "moods", label: "Mood", options: window.GAMES_MOODS || [] }
  ];

  var THEME_DEFS = [
    { key: "midnight", label: "Midnight", preview: "linear-gradient(135deg,#0a0e1f,#5d7bff)" },
    { key: "neon", label: "Neon", preview: "linear-gradient(135deg,#160a2b,#ff2fd6,#22e8ff)" },
    { key: "crimson", label: "Crimson", preview: "linear-gradient(135deg,#170808,#e0323f)" },
    { key: "aurora", label: "Aurora", preview: "linear-gradient(135deg,#04191c,#2fe7b0,#3fb4e8)" }
  ];

  function saveLibrary() { return commitGameChanges(); }
  function commitGameChanges() {
    var data={}; data[GK.library]=JSON.stringify(library);data[GK.weekly]=JSON.stringify(weekly);
    try { window.OneSpaceStorage.transaction(window.localStorage,data); return true; } catch(error) {library=safeGetJSON(GK.library,[]);weekly=safeGetJSON(GK.weekly,{});showToast(error.message);return false;}
  }
  function saveWeekly() { return commitGameChanges(); }
  function saveSessions() { if(safeSet(GK.sessions,JSON.stringify(sessions)))return true;sessions=safeGetJSON(GK.sessions,[]);return false; }
  function saveJournal() { if(safeSet(GK.journal,JSON.stringify(journal)))return true;journal=safeGetJSON(GK.journal,[]);return false; }

  /* ---------------------------------------------------------------------
   * ISO week helpers
   * ------------------------------------------------------------------- */
  function getISOWeekKey(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    var weekStr = weekNo < 10 ? "0" + weekNo : String(weekNo);
    return d.getUTCFullYear() + "-W" + weekStr;
  }
  function weekRangeLabel(date) {
    var d = new Date(date);
    var day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    var sunday = new Date(d);
    sunday.setDate(sunday.getDate() + 6);
    var fmt = function (x) { return x.toLocaleDateString(undefined, { month: "short", day: "numeric" }); };
    return fmt(d) + " – " + fmt(sunday);
  }
  function cloneWeeklyTemplate(gameId) {
    var game=library.find(function(g){return g.id===gameId;}) || {};
    return window.OneSpaceGameResources.weekly(game);
  }
  function ensureWeekly(gameId, persist) {
    var currentKey = getISOWeekKey(new Date());
    var entry = weekly[gameId];
    if (!entry || entry.weekKey !== currentKey) {
      entry = { weekKey: currentKey, tasks: cloneWeeklyTemplate(gameId) };
      weekly[gameId] = entry;
      if(persist !== false && !saveWeekly())return weekly[gameId] || {weekKey:currentKey,tasks:[]};
    }
    return entry;
  }

  /* ---------------------------------------------------------------------
   * Derived progress calculations
   * ------------------------------------------------------------------- */
  function storyStats(game) {
    var chapters = (game.story && game.story.chapters) || [];
    var flat = [];
    chapters.forEach(function (c) { (c.objectives || []).forEach(function (o) { flat.push(o); }); });
    var total = flat.length;
    var completed = flat.filter(function (o) { return o.done; }).length;
    var percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    var status = (total === 0 || completed === 0) ? "Not started" : (completed === total ? "Completed" : "In progress");
    var next = null;
    for (var i = 0; i < flat.length; i++) { if (!flat[i].done) { next = flat[i].text; break; } }
    return { total: total, completed: completed, percent: percent, status: status, next: next || (total ? "All objectives complete" : "Add your first objective") };
  }
  function weeklyStats(gameId) {
    var entry = ensureWeekly(gameId);
    var tasks = entry.tasks;
    var total = tasks.length;
    var completed = tasks.filter(function (t) { return t.done; }).length;
    var percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    var status = completed === 0 ? "Not started" : (completed === total ? "Completed" : "In progress");
    var next = null;
    for (var i = 0; i < tasks.length; i++) { if (!tasks[i].done) { next = tasks[i].label; break; } }
    return { total: total, completed: completed, percent: percent, status: status, next: next || "All weekly tasks complete", weekKey: entry.weekKey, tasks: tasks };
  }
  function statsFor(game) { return game.trackerType === "weekly" ? weeklyStats(game.id) : storyStats(game); }

  /* ---------------------------------------------------------------------
   * Logo rendering
   * ------------------------------------------------------------------- */
  function renderLogo(game) {
    var fallbackAttrs = ' data-fallback-name="' + esc(game.name) + '" data-fallback-accent="' + esc(game.accent || "#7a8fff") + '"';
    if (game.logo && game.logo.kind === "upload" && game.logo.src) {
      return '<img class="gv-logo-img" src="' + esc(game.logo.src) + '" alt="' + esc(game.name) + ' logo"' + fallbackAttrs + '>';
    }
    if (game.logo && game.logo.kind === "asset" && game.logo.src) {
      return '<img class="gv-logo-img" src="' + esc(game.logo.src) + '" alt="' + esc(game.name) + ' logo"' + fallbackAttrs + '>';
    }
    var accent = game.accent || "#7a8fff";
    return '<div class="gv-logo-cover" style="background:linear-gradient(135deg,' + esc(accent) + ',color-mix(in srgb,' + esc(accent) + ' 40%,#0b0b14))">' + esc(game.name) + "</div>";
  }
  function gameScene(game) {
    var name = game.title || game.name || 'Game';
    var hue = Array.from(name).reduce(function (sum, char) { return (sum * 31 + char.charCodeAt(0)) % 360; }, 0);
    var genre = (game.genre || (game.genres || []).join(' ')).toLowerCase();
    var subject = /horror|survival/.test(genre)
      ? '<path d="M330 285V150L407 65 488 150V285Z" fill="#101e29" stroke="#8aa5ad"/><path d="M383 285V210a23 23 0 0 1 46 0v75" fill="#d2c193"/><path d="M315 153L407 47 506 153" fill="none" stroke="#172733" stroke-width="14"/>'
      : /racing|sport/.test(genre)
      ? '<path d="M230 280L373 160H475L593 280" fill="none" stroke="#b4d7eb" stroke-width="8"/><path d="M280 244L323 216H437L480 244V276H280Z" fill="#253c58" stroke="#c4d6e8"/><path d="M335 210L355 182H415L434 210Z" fill="#719fac"/>'
      : '<path d="M320 287V138a92 92 0 0 1 184 0v149" fill="#112432" stroke="#8fbac5" stroke-width="12"/><path d="M343 287V141a69 69 0 0 1 138 0v146" fill="#659aa8" opacity=".6"/><path d="M286 316L344 271H480L540 316Z" fill="#214155"/><path d="M394 276V227Q410 209 426 227V276M399 276L392 303M421 276L432 303" fill="none" stroke="#122736" stroke-width="10"/><circle cx="410" cy="212" r="12" fill="#122736"/>';
    return '<svg class="gv-drawn-scene" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="340" fill="hsl(' + hue + ' 30% 19%)"/><circle cx="435" cy="107" r="93" fill="hsl(' + hue + ' 45% 69%)" opacity=".45"/><path d="M0 245L110 110 231 219 314 143 441 240 550 132 600 210V340H0Z" fill="#1b3343"/><path d="M0 289L200 210 359 280 550 250 600 280V340H0Z" fill="#11232f"/>' + subject + '<g fill="#d1e9e9"><circle cx="60" cy="49" r="1.5"/><circle cx="179" cy="84" r="2"/><circle cx="321" cy="38" r="1.5"/><circle cx="560" cy="49" r="2"/></g></svg>';
  }
  /* A failed asset/upload <img> falls back to the same text-cover badge used
     when a game has no logo at all, instead of a broken-image icon. Wired
     once on #gamesView (error events don't bubble, so this listener uses
     the capture phase) rather than per <img>, since renderLogo() is called
     from four different contexts (card, tracker header, mini-card, chip). */
  function wireLogoFallback() {
    var gamesView = document.getElementById("gamesView");
    if (!gamesView) return;
    gamesView.addEventListener("error", function (e) {
      var img = e.target;
      if (!img.classList || !img.classList.contains("gv-logo-img")) return;
      var name = img.getAttribute("data-fallback-name") || ""; console.warn('[OneSpace logo]',name,img.getAttribute('src'));
      var accent = img.getAttribute("data-fallback-accent") || "#7a8fff";
      var cover = document.createElement("div");
      cover.className = img.className.replace("gv-logo-img", "gv-logo-cover");
      cover.style.background = "linear-gradient(135deg," + accent + ",color-mix(in srgb," + accent + " 40%,#0b0b14))";
      cover.textContent = name;
      img.replaceWith(cover);
    }, true);
  }

  /* ---------------------------------------------------------------------
   * My Games card rendering
   * ------------------------------------------------------------------- */
  function cardHtml(game) {
    var isWeekly = game.trackerType === "weekly";
    var stats = statsFor(game);
    var deleteBtn = true
      ? '<button type="button" class="btn btn-icon btn-ghost" data-action="delete-game" data-id="' + esc(game.id) + '" aria-label="Delete ' + esc(game.name) + '" title="Delete game">' + ICON_DELETE + "</button>"
      : "";
    var weekBadge = isWeekly ? '<span class="gv-week-badge">Week ' + esc(stats.weekKey || "") + "</span>" : "";
    return (
      '<article class="gv-card" data-game-id="' + esc(game.id) + '" data-reveal data-reveal-group="library" data-reveal-key="' + esc(game.id) + '" style="--gv-brand:' + esc(game.accent || "#7a8fff") + '">' +
        '<button type="button" class="gv-card-logo" data-action="spotlight-game" data-id="' + esc(game.id) + '" aria-label="Spotlight ' + esc(game.name) + '">' + (game.artwork ? '<img class="gv-card-art" src="' + esc(game.cardArtwork || game.artwork) + '" alt="" loading="lazy" width="600" height="340">' : gameScene(game)) + renderLogo(game) + "</button>" +
        '<div class="gv-card-body">' +
          '<h3 class="gv-card-title">' + esc(game.name) + "</h3>" +
          '<div class="gv-card-meta"><span>' + esc(game.genre || "Custom") + " · " + esc(game.platform || "") + "</span>" + weekBadge + "</div>" +
          '<div class="gv-progress-row"><div class="gv-progress-bar"><span style="width:' + stats.percent + '%"></span></div><span class="gv-percent">' + stats.percent + "%</span></div>" +
          '<div class="gv-status-row"><span class="gv-status gv-status-' + statusSlug(stats.status) + '">' + esc(stats.status) + "</span><span class=\"gv-count\">" + stats.completed + "/" + stats.total + " " + (isWeekly ? "tasks" : "objectives") + "</span></div>" +
          '<p class="gv-next"><strong>Next:</strong> ' + esc(stats.next) + "</p>" +
          '<div class="gv-card-actions">' +
            '<button type="button" class="btn btn-primary" data-action="open-progress" data-id="' + esc(game.id) + '">Open Progress</button>' +
            '<button type="button" class="btn" data-action="suggest-details" data-id="' + esc(game.id) + '">Resources</button>' +
            '<button type="button" class="btn" data-action="edit-game" data-id="' + esc(game.id) + '">Edit</button>' +
            deleteBtn +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  var libraryGenre="",libraryQuery="";
  function renderLibraryGrid() {
    var el = document.getElementById("gvLibraryGrid");
    if (el) {
      var controls=document.getElementById('gameLibraryFilters');
      if(!controls){controls=document.createElement('div');controls.id='gameLibraryFilters';controls.className='domain-filters';el.before(controls);}
      var genres=Array.from(new Set(library.flatMap(function(g){return g.genres || [g.genre || 'Custom'];}))).sort();
      controls.innerHTML=window.OneSpaceUI.select('genre','My Games genre',[['','All genres']].concat(genres),libraryGenre)+window.OneSpaceUI.field('query','Search My Games',libraryQuery,'search');
      controls.querySelector('select').onchange=function(){libraryGenre=this.value;renderLibraryGrid();document.querySelector('#gameLibraryFilters select').focus();};
      controls.querySelector('input').oninput=function(){libraryQuery=this.value;var start=this.selectionStart;renderLibraryGrid();var input=document.querySelector('#gameLibraryFilters input');input.focus();input.setSelectionRange(start,start);};
      var filtered=window.OneSpaceCatalog.search(library,libraryQuery).filter(function(g){return !libraryGenre || (g.genres || [g.genre || 'Custom']).includes(libraryGenre);});
      el.innerHTML=filtered.length?filtered.map(cardHtml).join(''):'<p class="gv-empty">No games match your filters.</p>';wireReveal(el);
    }
  }

  /* ---------------------------------------------------------------------
   * Story / weekly tracker markup (rendered inside the Mission Progress /
   * Weekly Tasks tab panels, selected via a game-picker chip row)
   * ------------------------------------------------------------------- */
  function storyTrackerHtml(game) {
    var stats = storyStats(game);
    var chaptersHtml = (game.story.chapters || []).map(function (c) {
      var done = (c.objectives || []).filter(function (o) { return o.done; }).length;
      var objectivesHtml = (c.objectives || []).map(function (o) {
        return (
          '<div class="gv-objective' + (o.id === lastCheckedObjectiveId ? " is-just-checked" : "") + '" data-objective-id="' + esc(o.id) + '">' +
            '<label class="gv-objective-check">' +
              '<input type="checkbox" data-action="toggle-objective" data-game-id="' + esc(game.id) + '" data-chapter-id="' + esc(c.id) + '" data-objective-id="' + esc(o.id) + '" ' + (o.done ? "checked" : "") + ">" +
              '<span class="gv-objective-text">' + esc(o.text) + "</span>" +
            "</label>" +
            '<div class="gv-objective-actions">' +
              '<button type="button" class="btn btn-icon btn-ghost" data-action="edit-objective" data-chapter-id="' + esc(c.id) + '" data-objective-id="' + esc(o.id) + '" aria-label="Edit objective">' + ICON_EDIT + "</button>" +
              '<button type="button" class="btn btn-icon btn-ghost" data-action="delete-objective" data-chapter-id="' + esc(c.id) + '" data-objective-id="' + esc(o.id) + '" aria-label="Delete objective">' + ICON_DELETE + "</button>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      return (
        '<div class="gv-chapter' + (c.expanded ? " is-open" : "") + '" data-chapter-id="' + esc(c.id) + '" data-reveal data-reveal-group="missions" data-reveal-key="' + esc(game.id+':'+c.id) + '">' +
          '<button type="button" class="gv-chapter-head" data-action="toggle-chapter" data-chapter-id="' + esc(c.id) + '" aria-expanded="' + (!!c.expanded) + '">' +
            '<span class="gv-chevron" aria-hidden="true">' + ICON_CHEVRON + "</span>" +
            '<span class="gv-chapter-title">' + esc(c.title) + "</span>" +
            '<span class="gv-chapter-count">' + done + "/" + (c.objectives || []).length + "</span>" +
          "</button>" +
          '<div class="gv-objectives" ' + (c.expanded ? "" : "hidden") + ">" +
            objectivesHtml +
            '<form class="gv-add-objective" data-action="add-objective-form" data-chapter-id="' + esc(c.id) + '">' +
              '<input type="text" placeholder="Add an objective…" maxlength="140" aria-label="New objective text">' +
              '<button type="submit" class="btn">Add</button>' +
            "</form>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    return (
      '<div class="gv-tracker" data-game-id="' + esc(game.id) + '">' +
        '<div class="gv-tracker-head">' +
          '<div class="gv-tracker-title">' + renderLogo(game) + "<div><h2>" + esc(game.name) + "</h2><p>" + stats.completed + "/" + stats.total + " objectives · " + stats.percent + "% · " + esc(stats.status) + "</p></div></div>" +
        "</div>" +
        '<p class="gv-tracker-next"><strong>Next up:</strong> ' + esc(stats.next) + "</p>" +
        '<div class="gv-chapters">' + (chaptersHtml || '<form class="gv-add-objective" data-action="add-objective-form" data-chapter-id=""><input type="text" placeholder="Add your first objective…" maxlength="140" aria-label="New objective text"><button type="submit" class="btn">Add</button></form>') + "</div>" +
      "</div>"
    );
  }

  function weeklyTrackerHtml(game) {
    var stats = weeklyStats(game.id);
    var r = 40, circumference = 2 * Math.PI * r;
    var offset = circumference - (stats.percent / 100) * circumference;
    var tasksHtml = stats.tasks.map(function (t) {
      var justChecked = t.id === lastCheckedTaskId ? " is-just-checked" : "";
      return '<label class="gv-weekly-task' + justChecked + '" data-reveal data-reveal-group="weekly" data-reveal-key="' + esc(game.id+':'+t.id) + '"><input type="checkbox" data-action="toggle-weekly-task" data-game-id="' + esc(game.id) + '" data-task-id="' + esc(t.id) + '" ' + (t.done ? "checked" : "") + "><span>" + esc(t.label) + "</span></label>";
    }).join("");
    return (
      '<div class="gv-tracker" data-game-id="' + esc(game.id) + '">' +
        '<div class="gv-tracker-head">' +
          '<div class="gv-tracker-title">' + renderLogo(game) + "<div><h2>" + esc(game.name) + "</h2><p>Week of " + esc(weekRangeLabel(new Date())) + " · " + esc(stats.weekKey) + "</p></div></div>" +
        "</div>" +
        '<div class="gv-weekly-body">' +
          '<div class="gv-weekly-ring"><svg viewBox="0 0 100 100"><circle class="gv-ring-track" cx="50" cy="50" r="' + r + '"></circle><circle class="gv-ring-fill" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + circumference.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"></circle></svg><span class="gv-ring-label">' + stats.percent + "%</span></div>" +
          '<div class="gv-weekly-list">' + tasksHtml + "</div>" +
        "</div>" +
        '<p class="gv-tracker-next"><strong>Next up:</strong> ' + esc(stats.next) + " · " + stats.completed + "/" + stats.total + " tasks complete</p>" +
        '<div class="gv-weekly-actions"><button type="button" class="btn" data-action="reset-weekly" data-id="' + esc(game.id) + '">Reset Weekly Tasks</button></div>' +
      "</div>"
    );
  }

  function storyGames() { return library.filter(function (g) { return g.trackerType === "story"; }); }
  function weeklyGames() { return library.filter(function (g) { return g.trackerType === "weekly"; }); }
  function pickerChipHtml(game, action, selected) {
    return '<button type="button" class="gv-picker-chip' + (selected ? " active" : "") + '" data-action="' + action + '" data-id="' + esc(game.id) + '">' + renderLogo(game) + "<span>" + esc(game.name) + "</span></button>";
  }

  function renderMissionsPanel() {
    var games = storyGames();
    if (!selectedStoryGameId || !games.some(function (g) { return g.id === selectedStoryGameId; })) {
      selectedStoryGameId = games.length ? games[0].id : null;
    }
    var pickerEl = document.getElementById("gvMissionsPicker");
    var bodyEl = document.getElementById("gvMissionsBody");
    if (!pickerEl || !bodyEl) return;
    if (!games.length) {
      pickerEl.innerHTML = "";
      bodyEl.innerHTML = '<p class="gv-picker-empty">No story games yet. Add one from My Games to start tracking chapters and objectives.</p>';
      return;
    }
    pickerEl.innerHTML = games.map(function (g) { return pickerChipHtml(g, "pick-mission-game", g.id === selectedStoryGameId); }).join("");
    var selected = games.find(function (g) { return g.id === selectedStoryGameId; });
    bodyEl.innerHTML = selected ? storyTrackerHtml(selected) : "";
    wireReveal(bodyEl);
  }

  function renderWeeklyPanel() {
    var games = weeklyGames();
    if (!selectedWeeklyGameId || !games.some(function (g) { return g.id === selectedWeeklyGameId; })) {
      selectedWeeklyGameId = games.length ? games[0].id : null;
    }
    var pickerEl = document.getElementById("gvWeeklyPicker");
    var bodyEl = document.getElementById("gvWeeklyBody");
    if (!pickerEl || !bodyEl) return;
    if (!games.length) {
      pickerEl.innerHTML = "";
      bodyEl.innerHTML = '<p class="gv-picker-empty">No weekly-task games yet.</p>';
      return;
    }
    pickerEl.innerHTML = games.map(function (g) { return pickerChipHtml(g, "pick-weekly-game", g.id === selectedWeeklyGameId); }).join("");
    var selected = games.find(function (g) { return g.id === selectedWeeklyGameId; });
    bodyEl.innerHTML = selected ? weeklyTrackerHtml(selected) : "";
    animateRingDraw(bodyEl);
    wireReveal(bodyEl);
  }

  /* The ring's fill is rendered directly at its final stroke-dashoffset (a plain
     CSS transition can't animate a value on first paint, since it only animates
     *changes*). To make it genuinely sweep from empty to the real percentage,
     snap it to "fully empty" with transitions suspended, force a reflow, then
     let the next frame ease it back to the real target — the existing
     `transition: stroke-dashoffset .35s ease` on .gv-ring-fill does the rest. */
  function animateRingDraw(container) {
    var circle = container && container.querySelector(".gv-ring-fill");
    if (!circle) return;
    if (OS.prefersReducedMotion()) return;
    var target = circle.getAttribute("stroke-dashoffset");
    var circumference = circle.getAttribute("stroke-dasharray");
    circle.style.transition = "none";
    circle.setAttribute("stroke-dashoffset", circumference);
    void circle.getBoundingClientRect();
    requestAnimationFrame(function () {
      circle.style.transition = "";
      circle.setAttribute("stroke-dashoffset", target);
    });
  }

  function goToTracker(id) {
    var game = library.find(function (g) { return g.id === id; });
    if (!game) return;
    if(selectSpotlight(id, "tracker")===false)return false;
    if (game.trackerType === "weekly") {
      switchTab("weekly");
    } else {
      switchTab("missions");
    }
    focusPanel(activeTab);
    return true;
  }

  function findChapter(chapterId, gameId) {
    var game = library.find(function (g) { return g.id === (gameId || selectedStoryGameId); });
    if (!game || !game.story) return null;
    return game.story.chapters.find(function (c) { return c.id === chapterId; });
  }

  function toggleChapter(chapterId) {
    var chapter = findChapter(chapterId);
    if (!chapter) return;
    var next=library.map(function(game){if(game.id!==selectedStoryGameId)return game;return Object.assign({},game,{story:Object.assign({},game.story,{chapters:game.story.chapters.map(function(c){return c.id===chapterId?Object.assign({},c,{expanded:!c.expanded}):c;})})});});
    if(!safeSet(GK.library,JSON.stringify(next)))return false;
    library=next;
    withFocusPreserved(renderAll);
    return true;
  }
  function toggleObjective(chapterId, objectiveId, gameId) {
    var chapter = findChapter(chapterId, gameId);
    if (!chapter) return;
    var obj = chapter.objectives.find(function (o) { return o.id === objectiveId; });
    if (!obj) return;
    obj.done = !obj.done;
    var saved=saveLibrary();
    lastCheckedObjectiveId = saved && obj.done ? objectiveId : null;
    withFocusPreserved(renderAll);
    lastCheckedObjectiveId = null;
  }
  function addObjective(chapterId, text) {
    var chapter = findChapter(chapterId);
    if (!chapter && !chapterId) {
      var game = library.find(function (g) { return g.id === selectedStoryGameId; });
      if (game && game.story && !game.story.chapters.length) {
        chapter = { id: uid("c"), title: "My goals", expanded: true, objectives: [] };
        game.story.chapters.push(chapter);
      }
    }
    if (!chapter) return;
    chapter.objectives.push({ id: uid("o"), text: text, done: false });
    chapter.expanded = true;
    saveLibrary();
    renderAll();
  }
  function deleteObjective(chapterId, objectiveId, confirmed) {
    var chapter = findChapter(chapterId);
    if (!chapter) return false;
    var objective=chapter.objectives.find(function(o){return o.id===objectiveId;});
    if(!objective)return false;
    if(!confirmed){window.OneSpaceUI.confirm('Delete objective?', 'Remove '+objective.text+' from this chapter?',function(){return deleteObjective(chapterId,objectiveId,true);});return;}
    var next=library.map(function(game){if(game.id!==selectedStoryGameId)return game;return Object.assign({},game,{story:Object.assign({},game.story,{chapters:game.story.chapters.map(function(c){if(c.id!==chapterId)return c;return Object.assign({},c,{objectives:c.objectives.filter(function(o){return o.id!==objectiveId;})});})})});});
    if(!safeSet(GK.library,JSON.stringify(next)))return false;
    library=next;
    renderAll();
    showToast('Objective deleted.');
    setTimeout(function(){var heading=Array.from(document.querySelectorAll('[data-action="toggle-chapter"]')).find(function(el){return el.getAttribute('data-chapter-id')===chapterId;});heading?.focus({preventScroll:true});},0);
    return true;
  }
  function startEditObjective(chapterId, objectiveId) {
    var row = document.querySelector('.gv-objective[data-objective-id="' + CSS.escape(objectiveId) + '"]');
    var chapter = findChapter(chapterId);
    if (!row || !chapter) return;
    var obj = chapter.objectives.find(function (o) { return o.id === objectiveId; });
    if (!obj) return;
    row.classList.add("is-editing");
    row.innerHTML =
      '<form class="gv-objective-edit-form" data-chapter-id="' + esc(chapterId) + '" data-objective-id="' + esc(objectiveId) + '">' +
        '<input type="text" value="' + esc(obj.text) + '" maxlength="140" aria-label="Edit objective text">' +
        '<button type="submit" class="btn btn-icon btn-ghost" aria-label="Save">' + ICON_CHECK + "</button>" +
        '<button type="button" class="btn btn-icon btn-ghost" data-action="cancel-objective-edit" aria-label="Cancel">' + ICON_CLOSE + "</button>" +
        '<span class="form-error" role="alert"></span>' +
      "</form>";
    var input = row.querySelector("input");
    input.focus();
    input.select();
  }
  function commitEditObjective(chapterId, objectiveId, text) {
    var chapter = findChapter(chapterId);
    if (!chapter) return false;
    var obj = chapter.objectives.find(function (o) { return o.id === objectiveId; });
    if (!obj) return false;
    var next=library.map(function(game){if(game.id!==selectedStoryGameId)return game;return Object.assign({},game,{story:Object.assign({},game.story,{chapters:game.story.chapters.map(function(c){if(c.id!==chapterId)return c;return Object.assign({},c,{objectives:c.objectives.map(function(o){return o.id===objectiveId?Object.assign({},o,{text:text}):o;})});})})});});
    if(!safeSet(GK.library,JSON.stringify(next)))return false;
    library=next;
    renderAll();
    return true;
  }

  function toggleWeeklyTask(gameId, taskId) {
    var entry = ensureWeekly(gameId);
    var task = entry.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;
    task.done = !task.done;
    var saved=saveWeekly();
    lastCheckedTaskId = saved && task.done ? taskId : null;
    withFocusPreserved(renderAll);
    lastCheckedTaskId = null;
  }
  function resetWeekly(gameId,confirmed) {
    var game=library.find(function(g){return g.id===gameId && g.trackerType==='weekly';});
    if(!game)return false;
    if(!confirmed){window.OneSpaceUI.confirm('Reset weekly tasks?', 'Reset the current tasks for '+game.name+'?',function(){return resetWeekly(gameId,true);},'Reset');return;}
    var next=Object.assign({},weekly);next[gameId]={weekKey:getISOWeekKey(new Date()),tasks:cloneWeeklyTemplate(gameId)};
    if(!safeSet(GK.weekly,JSON.stringify(next)))return false;
    weekly=next;
    showToast("Weekly tasks reset.");
    renderAll();
    return true;
  }

  function deleteGame(id,confirmed) {
    var game = library.find(function (g) { return g.id === id; });
    if (!game) return;
    if(!confirmed){window.OneSpaceUI.confirm('Delete game?',game.name+' and its trackers will be removed.',function(){return deleteGame(id,true);});return;}
    var next=window.OneSpaceGameResources.cleanup({library:library,weekly:weekly,sessions:sessions,journal:journal},id);
    var data={};data[GK.library]=JSON.stringify(next.library);data[GK.weekly]=JSON.stringify(next.weekly);data[GK.sessions]=JSON.stringify(next.sessions);data[GK.journal]=JSON.stringify(next.journal);
    try{window.OneSpaceStorage.transaction(window.localStorage,data);}catch(error){showToast(error.message);return false;}
    library=next.library;weekly=next.weekly;sessions=next.sessions;journal=next.journal;
    if(selectedStoryGameId===id)selectedStoryGameId=null;if(selectedWeeklyGameId===id)selectedWeeklyGameId=null;
    if(!activeSession())stopSessionTicker();
    showToast("Game deleted.");
    renderAll();
  }

  /* ---------------------------------------------------------------------
   * Add / Edit Game modal
   * ------------------------------------------------------------------- */
  function updateTrackerChoiceUI() {
    document.querySelectorAll(".gv-tracker-choice").forEach(function (btn) {
      var active = btn.getAttribute("data-tracker-type") === draftTrackerType;
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  }
  function openAddGameModal(editId) {
    draftTrackerTouched=false;
    var game = editId ? library.find(function (g) { return g.id === editId; }) : null;
    document.getElementById("addGameTitle").textContent = game ? "Edit Game" : "Add Game";
    document.getElementById("addGameId").value = game ? game.id : "";
    document.getElementById("addGameGenre").value = game ? game.genre || "Custom" : "";
    document.getElementById("addGameName").value = game ? game.name : "";
    document.getElementById("addGamePlatform").value = game ? game.platform : "PC";
    document.getElementById("addGameAccent").value = game && game.accent ? game.accent : "#7a8fff";
    draftTrackerType = game ? game.trackerType : "story";
    updateTrackerChoiceUI();
    draftLogoDataUrl = (game && game.logo && game.logo.kind === "upload") ? game.logo.src : null;
    var preview = document.getElementById("addGameLogoPreview");
    if (draftLogoDataUrl) { preview.querySelector("img").src = draftLogoDataUrl; preview.hidden = false; } else { preview.hidden = true; }
    document.getElementById("addGameLogoFile").value = "";
    document.getElementById("addGameError").textContent = "";
    openModal(document.getElementById("addGameOverlay"), document.getElementById("addGameName"));
  }

  function starterStory(game) { return window.OneSpaceGameResources.story(game || {},uid); }

  function wireAddGameModal() {
    document.getElementById("addGameBtn").addEventListener("click", function () { openAddGameModal(null); });
    document.getElementById("addGameClose").addEventListener("click", function () { closeModal(document.getElementById("addGameOverlay")); });
    document.getElementById("addGameCancel").addEventListener("click", function () { closeModal(document.getElementById("addGameOverlay")); });
    document.querySelectorAll(".gv-tracker-choice").forEach(function (btn) {
      btn.addEventListener("click", function () { draftTrackerTouched=true;draftTrackerType = btn.getAttribute("data-tracker-type"); updateTrackerChoiceUI(); });
    });
    document.getElementById('addGameGenre').addEventListener('input',function(){if(!draftTrackerTouched&&!document.getElementById('addGameId').value){draftTrackerType=window.OneSpaceGameResources.infer({genre:this.value});updateTrackerChoiceUI();}});
    document.getElementById("addGameLogoFile").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      var errorEl = document.getElementById("addGameError");
      errorEl.textContent = "";
      if (!file) return;
      if (!/^image\//.test(file.type)) { errorEl.textContent = "Please choose an image file."; e.target.value = ""; return; }
      if (file.size > 1.5 * 1024 * 1024) { errorEl.textContent = "Logo image is too large (max 1.5MB)."; e.target.value = ""; return; }
      var reader = new FileReader();
      reader.onload = function () {
        draftLogoDataUrl = reader.result;
        var preview = document.getElementById("addGameLogoPreview");
        preview.querySelector("img").src = draftLogoDataUrl;
        preview.hidden = false;
      };
      reader.readAsDataURL(file);
    });
    document.getElementById("addGameLogoRemove").addEventListener("click", function () {
      draftLogoDataUrl = null;
      document.getElementById("addGameLogoFile").value = "";
      document.getElementById("addGameLogoPreview").hidden = true;
    });
    document.getElementById("addGameForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var errorEl = document.getElementById("addGameError");
      var name = document.getElementById("addGameName").value.trim();
      if (!name) { errorEl.textContent = "Please enter a game name."; document.getElementById("addGameName").focus(); return; }
      var id = document.getElementById("addGameId").value || uid("game");
      var platform = document.getElementById("addGamePlatform").value;
      var accent = document.getElementById("addGameAccent").value || "#7a8fff";
      var beforeLibrary = JSON.parse(JSON.stringify(library));
      var beforeWeekly = JSON.parse(JSON.stringify(weekly));
      var existing = library.find(function (g) { return g.id === id; });
      var logo = draftLogoDataUrl ? { kind: "upload", src: draftLogoDataUrl } : existing && existing.logo && existing.logo.kind === "asset" ? existing.logo : { kind: "cover" };
      if (existing) {
        var previousGenre=existing.genre,previousPlatform=existing.platform;
        existing.name = name; existing.platform = platform; existing.accent = accent; existing.logo = logo;
        window.OneSpaceGameResources.reconcile(existing,weekly,draftTrackerType,uid); existing.genre=document.getElementById("addGameGenre").value.trim() || "Custom";
        existing.genres=existing.genre===previousGenre?(existing.genres||[existing.genre]):[existing.genre];
        existing.platforms=platform===previousPlatform?(existing.platforms||[platform]):[platform];
        existing.custom=true;
        if (draftTrackerType === "story" && !existing.story) existing.story = starterStory(existing);
        if (draftTrackerType === "weekly") ensureWeekly(existing.id,false);
      } else {
        var game = { id: id, name: name, platform: platform, genre: document.getElementById("addGameGenre").value.trim() || "Custom", accent: accent, logo: logo, trackerType: draftTrackerType, custom: true };
        if (draftTrackerType === "story") game.story = starterStory(game);
        library.push(game);
        if (draftTrackerType === "weekly") ensureWeekly(game.id,false);
      }
      if(!commitGameChanges()){library=beforeLibrary;weekly=beforeWeekly;renderAll();errorEl.textContent='Changes could not be saved. Please try again.';return false;}
      closeModal(document.getElementById("addGameOverlay"));
      showToast(existing ? "Game updated." : "Game added to your library.");
      renderAll();
    });
  }

  /* ---------------------------------------------------------------------
   * Theme switcher (header pills + Appearance tab swatches)
   * ------------------------------------------------------------------- */
  document.addEventListener('onespace:subtheme-changed',function(e){if(e.detail.domain==='games')applyGamesTheme(e.detail.theme);});
  function applyGamesTheme(theme,persist) {
    if(persist!==false && !safeSet(GK.theme,theme))return false;
    var gamesViewEl = document.getElementById("gamesView");
    gamesViewEl.setAttribute("data-games-theme", theme);
    if(document.body.dataset.page==="games")document.body.setAttribute("data-games-theme", theme);
    document.querySelectorAll(".gv-theme-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-games-theme-choice") === theme;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderAppearancePanel();
    return true;
  }
  function wireThemeSwitcher() {
    document.querySelectorAll(".gv-theme-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { applyGamesTheme(btn.getAttribute("data-games-theme-choice")); });
    });
    var saved = ["midnight", "neon", "crimson", "aurora"].indexOf(safeGet(GK.theme)) !== -1 ? safeGet(GK.theme) : "midnight";
    applyGamesTheme(saved,false);
  }
  function renderAppearancePanel() {
    var el = document.getElementById("gvThemeSwatches");
    if (!el) return;
    var current = safeGet(GK.theme) || "midnight";
    el.innerHTML = THEME_DEFS.map(function (t) {
      return '<button type="button" class="gv-swatch-card' + (t.key === current ? " active" : "") + '" data-action="apply-games-theme" data-theme="' + t.key + '"><div class="gv-swatch-preview" style="background:' + t.preview + '"></div><strong>' + t.label + "</strong></button>";
    }).join("");
  }

  /* ---------------------------------------------------------------------
   * Overview tab
   * ------------------------------------------------------------------- */
  function aggregateStats() {
    var completions = library.map(function (g) { return statsFor(g).percent; });
    var avg = completions.length ? Math.round(completions.reduce(function (a, b) { return a + b; }, 0) / completions.length) : 0;
    var weeklyGames=library.filter(function(g){return g.trackerType==='weekly';}),weeklyPercent=weeklyGames.length?Math.round(weeklyGames.reduce(function(sum,g){return sum+weeklyStats(g.id).percent;},0)/weeklyGames.length):null;
    return {count:library.length,avg:avg,weeklyPercent:weeklyPercent};
  }
  function findContinueGame() {
    var candidates = library
      .map(function (g) { return { game: g, stats: statsFor(g) }; })
      .filter(function (x) { return x.stats.percent > 0 && x.stats.percent < 100; });
    candidates.sort(function (a, b) { return b.stats.percent - a.stats.percent; });
    return candidates[0] || null;
  }
  function renderOverview() {
    var statsEl = document.getElementById("gvOverviewStats");
    var continueEl = document.getElementById("gvContinueCard");
    if (!statsEl || !continueEl) return;
    var agg = aggregateStats();
    statsEl.innerHTML =
      '<div class="gv-stat-tile"><strong>' + agg.count + '</strong><span>Games tracked</span></div>' +
      '<div class="gv-stat-tile"><strong>' + agg.avg + '%</strong><span>Average completion</span></div>' +
      '<div class="gv-stat-tile"><strong>' + (agg.weeklyPercent == null ? "—" : agg.weeklyPercent + "%") + "</strong><span>Weekly game progress</span></div>";
    var entry = findContinueGame();
    if (!entry) {
      continueEl.innerHTML = "<h3>Continue Playing</h3><p>Nothing in progress yet — open a game from My Games to get started.</p>";
    } else {
      continueEl.innerHTML =
        "<h3>Continue Playing</h3>" +
        "<p>" + esc(entry.game.name) + " — " + entry.stats.percent + "% complete. Next: " + esc(entry.stats.next) + "</p>" +
        '<button type="button" class="btn btn-primary" data-action="open-progress" data-id="' + esc(entry.game.id) + '">Continue</button>';
    }
  }

  /* ---------------------------------------------------------------------
   * Suggestions
   * ------------------------------------------------------------------- */
  function renderPrefGroups() {
    var html = PREF_GROUPS.map(function (group) {
      var opts = group.options.map(function (opt) {
        var checked = prefs[group.key].indexOf(opt) !== -1;
        return (
          '<label class="gv-pref-chip' + (checked ? " is-checked" : "") + '">' +
            '<input type="checkbox" data-pref-group="' + group.key + '" data-pref-value="' + esc(opt) + '" ' + (checked ? "checked" : "") + ">" +
            "<span>" + esc(opt) + "</span>" +
          "</label>"
        );
      }).join("");
      return '<fieldset class="gv-pref-group"><legend>' + esc(group.label) + "</legend><div class=\"gv-pref-options\">" + opts + "</div></fieldset>";
    }).join("");
    var el = document.getElementById("gvPrefGroups");
    if (el) {
      el.innerHTML = '<label class="catalog-source-label">More like this<select id="gvSimilarTo"><option value="">All games</option>' + gameCatalog().map(function (g) { return '<option value="' + esc(g.id) + '"' + ((prefs.similarTo || [])[0] === g.id ? " selected" : "") + '>' + esc(g.title) + "</option>"; }).join("") + "</select></label>" + html;
      document.getElementById("gvSimilarTo").addEventListener("change", function () { prefs.similarTo = this.value ? [this.value] : []; safeSet(GK.prefs, JSON.stringify(prefs)); renderSuggestions(); });
    }
  }
  function handlePrefChange(input) {
    var group = input.getAttribute("data-pref-group");
    var value = input.getAttribute("data-pref-value");
    var arr = prefs[group];
    var idx = arr.indexOf(value);
    if (input.checked && idx === -1) arr.push(value);
    if (!input.checked && idx !== -1) arr.splice(idx, 1);
    var chip = input.closest(".gv-pref-chip");
    if (chip) chip.classList.toggle("is-checked", input.checked);
    safeSet(GK.prefs, JSON.stringify(prefs));
    renderSuggestions();
  }
  function gameCatalog() { return window.OneSpaceCatalog.merge([library, window.SUGGESTION_CATALOG || [], window.DEFAULT_GAMES || []], window.OneSpaceCatalog.game); }
  function allSelectedTags() { return [].concat(prefs.platforms, prefs.genres, prefs.playstyles, prefs.moods); }
  function computeSuggestions() {
    var dismissed = safeGetJSON(GK.dismissed, []), catalog = gameCatalog(), selected = allSelectedTags();
    var source = catalog.find(function (g) { return g.id === (prefs.similarTo || [])[0]; });
    var filtered = window.OneSpaceCatalog.similar(catalog, source, ["genres", "playstyles", "moods"]);
    var groups = { platforms: prefs.platforms, genres: prefs.genres, playstyles: prefs.playstyles, moods: prefs.moods };
    var results = filtered.filter(function (g) { return dismissed.indexOf(g.id) < 0 && window.OneSpaceCatalog.matches(g, groups); }).map(function (g) {
      var matched = [].concat(g.platforms, g.genres, g.playstyles, g.moods).filter(function (t, i, a) { return selected.indexOf(t) >= 0 && a.indexOf(t) === i; });
      return { game: g, matched: matched, source: source ? source.title : "" };
    });
    return { selected: selected, results: results };
  }
  function suggestCoverStyle(accent) {
    return "background:linear-gradient(135deg," + esc(accent) + ",color-mix(in srgb," + esc(accent) + " 35%,#0b0b14))";
  }
  function renderSuggestions() {
    var el = document.getElementById("gvSuggestResults");
    if (!el) return;
    var data = computeSuggestions();
    if (!data.results.length) { el.innerHTML = '<p class="gv-empty">No games match those filters yet — try clearing a few.</p>'; return; }
    el.innerHTML = '<p class="catalog-count" role="status">' + data.results.length + ' games · full local catalog · matches every active filter group</p>' + data.results.map(function (r) {
      var g = r.game;
      return (
        '<article class="gv-suggest-card" data-reveal data-reveal-group="suggestions" data-reveal-key="' + esc(g.id) + '" style="--gv-brand:' + esc(g.accent) + '">' +
          '<div class="gv-suggest-cover gv-illustrated-cover">' + (g.artwork ? '<img class="gv-drawn-scene" src="' + esc(g.artwork) + '" alt="" loading="lazy">' : gameScene(g)) + '<span>' + esc(g.title) + "</span></div>" +
          '<div class="gv-suggest-body">' +
            '<div class="gv-suggest-top"><h3>' + esc(g.title) + "</h3><span class=\"gv-match\">" + "Local catalog</span></div>" +
            '<p class="gv-suggest-genre">' + esc(g.genres.join(", ")) + " · " + esc(g.platforms.join(", ")) + "</p>" +
            '<div class="gv-tag-row">' + r.matched.map(function (t) { return '<span class="gv-tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
            '<p class="gv-suggest-why">Matches your picks: ' + esc(r.matched.length ? r.matched.join(", ") : (r.source ? "Similar genres or play styles to " + r.source : "All local games")) + ".</p>" +
            '<div class="gv-suggest-actions">' +
              '<button type="button" class="btn btn-primary" data-action="suggest-add" data-id="' + g.id + '">Add to My Games</button>' +
              '<button type="button" class="btn" data-action="suggest-wishlist" data-id="' + g.id + '">Save to Wishlist</button>' +
              '<button type="button" class="btn btn-ghost" data-action="suggest-dismiss" data-id="' + g.id + '">Dismiss</button>' +
              '<button type="button" class="btn btn-ghost" data-action="suggest-details" data-id="' + g.id + '">View Details</button>' +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
    wireReveal(el);
  }
  function addSuggestionToLibrary(id, chosenType) {
    var g = gameCatalog().find(function (x) { return x.id === id; });
    if (!g) return;
    if (library.some(function (l) { return l.id === id || l.sourceSuggestion === id || l.name.toLowerCase() === g.title.toLowerCase(); })) { showToast("Already in My Games."); return; }
    if(!chosenType){var x=window.OneSpaceLocalDiscovery.normalize(g,'games');window.OneSpaceProviderSearch.open('games',x,{has:function(){return false;},save:function(record,f){return addSuggestionToLibrary(id,f.get('tracker'));}});return false;}
    var game = {
      id: uid("game"), name: g.title, platform: g.platforms[0], genre: g.genres[0] || "Custom",
      accent: g.accent, platforms: g.platforms, genres: g.genres, playstyles: g.playstyles, moods: g.moods, logo: g.logo || { kind: "cover" }, artwork: g.artwork, resources: g.resources, defaultTasks: g.defaultTasks, defaultTaskTemplates:g.defaultTaskTemplates, trackerType: chosenType, chapterOutline:g.chapterOutline, weeklyTemplate:g.weeklyTemplate, custom: true, sourceSuggestion: id,
      story: { chapters: [] }
    };
    if(game.trackerType==='story')game.story=starterStory(game);else delete game.story;
    library.push(game);
    if(game.trackerType === "weekly") ensureWeekly(game.id,false);
    if(!commitGameChanges()) return false;
    if (safeGetJSON(GK.wishlist, []).indexOf(id) !== -1) removeFromWishlist(id);
    showToast(g.title + " added to My Games.");
    renderAll();return true;
  }
  function addToWishlist(id) {
    var wishlist = safeGetJSON(GK.wishlist, []);
    if (wishlist.indexOf(id) === -1) {
      if (!safeSet(GK.wishlist, JSON.stringify(wishlist.concat(id)))) return false;
      showToast("Saved to wishlist.");
    }
    renderWishlist();
    return true;
  }
  function removeFromWishlist(id) {
    var wishlist = safeGetJSON(GK.wishlist, []).filter(function (x) { return x !== id; });
    if (!safeSet(GK.wishlist, JSON.stringify(wishlist))) return false;
    renderWishlist();
    return true;
  }
  function moveWishlistToLibrary(id) { addSuggestionToLibrary(id); }
  function dismissSuggestion(id) {
    var dismissed = safeGetJSON(GK.dismissed, []);
    if (dismissed.indexOf(id) === -1 && !safeSet(GK.dismissed, JSON.stringify(dismissed.concat(id)))) return false;
    renderSuggestions();
    showToast("Suggestion dismissed.");
    return true;
  }
  function renderWishlist() {
    var wishlist = safeGetJSON(GK.wishlist, []);
    var section = document.getElementById("gvWishlistSection");
    var list = document.getElementById("gvWishlistList");
    if (!section || !list) return;
    if (!wishlist.length) { section.hidden = true; list.innerHTML = ""; return; }
    section.hidden = false;
    list.innerHTML = wishlist.map(function (id) {
      var g = gameCatalog().find(function (x) { return x.id === id; });
      if (!g) return "";
      return (
        '<div class="gv-wishlist-item" style="--gv-brand:' + esc(g.accent) + '">' +
          '<span class="gv-wishlist-cover" style="' + suggestCoverStyle(g.accent) + '">' + esc(g.title) + "</span>" +
          '<span class="gv-wishlist-name">' + esc(g.title) + "</span>" +
          '<div class="gv-wishlist-actions">' +
            '<button type="button" class="btn" data-action="wishlist-add" data-id="' + g.id + '">Move to My Games</button>' +
            '<button type="button" class="btn btn-ghost" data-action="wishlist-remove" data-id="' + g.id + '">Remove</button>' +
          "</div>" +
        "</div>"
      );
    }).join("");
  }
  function openSuggestionDetails(id) {
    var providerGame=library.find(function(g){return g.id===id;});
    if(providerGame && providerGame.discoveryRecord){var extra='<h3>Your tasks</h3><p>'+statsFor(providerGame).percent+'% complete</p><ul>'+window.OneSpaceGameResources.tasks(providerGame).map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul><h3>Resources</h3>'+window.OneSpaceGameResources.resources(providerGame).map(function(r){return '<p>'+window.OneSpaceDiscovery.link(r.url,r.group+' · '+r.label)+'</p>';}).join('');window.OneSpaceDiscovery.openDetail(providerGame.discoveryRecord,null,null,extra);return;}

    var tracked=library.find(function(x){return x.id===id;});
    var g = tracked ? window.OneSpaceCatalog.game(tracked) : gameCatalog().find(function (x) { return x.id === id; });
    if (!g) return;
    document.getElementById("gameDetailsTitle").textContent = g.title;
    document.getElementById("gameDetailsBody").innerHTML =
      '<div class="gv-details-cover" style="' + suggestCoverStyle(g.accent) + '">' + esc(g.title) + "</div>" +
      "<p>" + esc(g.blurb) + "</p>" +
      "<p><strong>Genres:</strong> " + esc(g.genres.join(", ")) + "</p>" +
      "<p><strong>Platforms:</strong> " + esc(g.platforms.join(", ")) + "</p>" +
      "<p><strong>Play styles:</strong> " + esc(g.playstyles.join(", ")) + "</p>" +
      "<p><strong>Mood:</strong> " + esc(g.moods.join(", ")) + "</p>";
    var resources=window.OneSpaceGameResources.resources(g), groups=Array.from(new Set(resources.map(function(r){return r.group;})));
    document.getElementById("gameDetailsBody").innerHTML += '<h4>Game resources</h4><div class="resource-grid">'+groups.map(function(group){return '<section><h4>'+esc(group)+'</h4>'+resources.filter(function(r){return r.group===group;}).map(function(r){return '<a class="btn" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.label)+'</a>';}).join('')+'</section>';}).join('')+'</div><h4>Suggested tracker tasks</h4><ul>'+window.OneSpaceGameResources.tasks(g).map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>'+(tracked?'<button class="btn" id="editGameResources">Edit resources</button>':'');
    if(tracked) document.getElementById('editGameResources').onclick=function(){window.OneSpaceUI.open('Edit game resources',window.OneSpaceUI.field('resources','One per line: group | label | https://URL',resources.map(function(r){return r.group+' | '+r.label+' | '+r.url;}).join('\n'),'textarea'),function(f){var next=String(f.get('resources')).split('\n').filter(function(s){return s.trim();}).map(function(line){var parts=line.split('|').map(function(s){return s.trim();});if(parts.length!==3 || !parts[2] || !window.OneSpaceStorage.validUrl(parts[2]))throw new Error('Use group | label | a valid http or https URL.');return {group:parts[0],label:parts[1],url:parts[2]};});var updated=library.map(function(x){return x.id===tracked.id?Object.assign({},x,{resources:next}):x;});if(!safeSet(GK.library,JSON.stringify(updated)))return false;library=updated;showToast('Resources saved. Reopen details to view changes.');});};
    openModal(document.getElementById("gameDetailsOverlay"), document.getElementById("gameDetailsClose"));
  }
  function wireSuggestions() {
    document.getElementById("gvGetSuggestions").addEventListener("click", function () { renderSuggestions(); });
    document.getElementById("gvClearFilters").addEventListener("click", function () {
      prefs = { platforms: [], genres: [], playstyles: [], moods: [] };
      safeSet(GK.prefs, JSON.stringify(prefs));
      renderPrefGroups();
      renderSuggestions();
      showToast("Filters cleared.");
    });
    document.getElementById("gvResetPreferences").addEventListener("click", function () {
      prefs = { platforms: [], genres: [], playstyles: [], moods: [] };
      safeSet(GK.prefs, JSON.stringify(prefs));
      renderPrefGroups();
      safeSet(GK.dismissed, "[]");
      renderSuggestions();
      showToast("Preferences reset.");
    });
    document.getElementById("gameDetailsClose").addEventListener("click", function () { closeModal(document.getElementById("gameDetailsOverlay")); });
  }

  /* ---------------------------------------------------------------------
   * Quick Add game search — type-ahead against SUGGESTION_CATALOG. Mirrors
   * the existing Command Palette's combobox/listbox keyboard pattern
   * (ArrowUp/ArrowDown/Enter/Escape, aria-activedescendant) for consistency,
   * and reuses addSuggestionToLibrary()/openAddGameModal() rather than
   * duplicating add-a-game logic.
   * ------------------------------------------------------------------- */
  function filterCatalog(query) { return query.trim() ? window.OneSpaceCatalog.search(gameCatalog(), query) : []; }
  function wireGameSearch(){window.OneSpaceProviderSearch.bind({input:document.getElementById('gvGameSearch'),dropdown:document.getElementById('gvSearchDropdown'),domain:'games',local:function(q){return filterCatalog(q).map(function(x){return window.OneSpaceLocalDiscovery.normalize(x,'games');});},adapter:function(){return window.OneSpaceGameDiscovery;},custom:function(name){openAddGameModal(null);document.getElementById("addGameName").value=name;}});}


  /* ---------------------------------------------------------------------
   * Gaming Sessions
   * ------------------------------------------------------------------- */
  function activeSession() { return sessions.find(function (s) { return s.end === null; }) || null; }
  function formatMinutes(total) {
    var h = Math.floor(total / 60), m = total % 60;
    return h > 0 ? (h + "h " + m + "m") : (m + "m");
  }
  function startSession(gameId) {
    if (activeSession()) { showToast("Stop the current session first."); return; }
    sessions.unshift({ id: uid("session"), gameId: gameId, start: new Date().toISOString(), end: null, minutes: null, note: "" });
    if(!saveSessions()){renderSessionsPanel();return false;}
    startSessionTicker();
    renderSessionsPanel();
  }
  function stopSession() {
    var s = activeSession();
    if (!s) return;
    var endDate = new Date();
    s.end = endDate.toISOString();
    s.minutes = Math.max(1, Math.round((endDate - new Date(s.start)) / 60000));
    if(!saveSessions()){renderSessionsPanel();return false;}
    stopSessionTicker();
    showToast("Session logged: " + formatMinutes(s.minutes) + ".");
    renderSessionsPanel();
  }
  function localDateStamp(date) {
    var d = date || new Date();
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mm + "-" + dd;
  }
  function logSessionManual(gameId, minutes, dateStr, note) {
    var day = dateStr || localDateStamp();
    /* No "Z"/UTC suffix on purpose: a date-only string like "2026-09-14" combined
       with a bare (non-"Z") time is parsed as LOCAL midnight, so it always
       displays back as the exact calendar day the user picked, regardless of
       their timezone offset from UTC. */
    sessions.unshift({ id: uid("session"), gameId: gameId, start: day + "T00:00:00", end: day + "T00:00:00", minutes: minutes, note: note || "" });
    if(!saveSessions()){renderSessionsPanel();return false;}
    renderSessionsPanel();
    showToast("Session logged.");
  }
  function deleteSession(id) {
    var session=sessions.find(function(s){return s.id===id;});
    if(!session)return;
    window.OneSpaceUI.confirm('Delete session?', 'Remove this logged session?', function(){
      var next=sessions.filter(function(s){return s.id!==id;});
      if(!safeSet(GK.sessions,JSON.stringify(next)))return false;
      sessions=next;
      renderSessionsPanel();
      showToast('Session deleted.');
      return true;
    });
  }
  function startSessionTicker() {
    stopSessionTicker();
    sessionTickInterval = setInterval(function () {
      if (!document.hidden && document.body.dataset.page === "games" && (activeTab === "overview" || activeTab === "sessions")) withFocusPreserved(renderSessionsPanel);
    }, 1000);
  }
  function stopSessionTicker() {
    if (sessionTickInterval) { clearInterval(sessionTickInterval); sessionTickInterval = null; }
  }
  function renderSessionsPanel() {
    var activeEl = document.getElementById("gvSessionActive");
    var logEl = document.getElementById("gvSessionLog");
    var startSelect = document.getElementById("gvSessionGame");
    var logSelect = document.getElementById("gvLogSessionGame");
    if (!activeEl || !logEl) return;
    var sig = library.map(function (g) { return g.id; }).join(",");
    var options = library.map(function (g) { return '<option value="' + esc(g.id) + '">' + esc(g.name) + "</option>"; }).join("");
    if (startSelect && startSelect.dataset.sig !== sig) { startSelect.innerHTML = options; startSelect.dataset.sig = sig; }
    if (logSelect && logSelect.dataset.sig !== sig) { logSelect.innerHTML = options; logSelect.dataset.sig = sig; }
    var active = activeSession();
    if (active) {
      var game = library.find(function (g) { return g.id === active.gameId; });
      var elapsedMin = Math.max(0, Math.round((Date.now() - new Date(active.start)) / 60000));
      activeEl.innerHTML =
        '<div class="gv-session-active-card" data-reveal data-reveal-group="sessions" data-reveal-key="active-' + esc(active.gameId) + '"><span class="gv-live-badge"><span class="gv-live-dot"></span>Live · ' + esc(game ? game.name : "Unknown") + " · " + elapsedMin + 'm</span>' +
        '<button type="button" class="btn btn-primary" data-action="session-stop">Stop Session</button></div>';
      if (!sessionTickInterval) startSessionTicker();
    } else {
      activeEl.innerHTML = "";
      stopSessionTicker();
    }
    wireReveal(activeEl);
    var startForm = document.getElementById("gvSessionStartForm");
    if (startForm) startForm.querySelector("button").disabled = !!active;
    if (!sessions.length) {
      logEl.innerHTML = '<p class="gv-picker-empty">No sessions logged yet.</p>';
      return;
    }
    logEl.innerHTML = sessions.map(function (s) {
      var game = library.find(function (g) { return g.id === s.gameId; });
      var label = s.end === null ? "In progress…" : formatMinutes(s.minutes || 0);
      var dateLabel = new Date(s.start).toLocaleDateString();
      return (
        '<div class="gv-session-row" data-reveal data-reveal-group="sessions" data-reveal-key="' + esc(s.id) + '"><span>' + esc(game ? game.name : "Unknown") + " — " + label + " · " + dateLabel + (s.note ? " · " + esc(s.note) : "") + "</span>" +
        (s.end === null ? "" : '<button type="button" class="btn btn-icon btn-ghost" data-action="session-delete" data-id="' + esc(s.id) + '" aria-label="Delete session">' + ICON_DELETE + "</button>") +
        "</div>"
      );
    }).join("");
    wireReveal(logEl);
  }
  function wireSessions() {
    document.getElementById("gvSessionStartForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var gameId = document.getElementById("gvSessionGame").value;
      if (!gameId) return;
      startSession(gameId);
    });
    document.getElementById("gvSessionLogForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var gameId = document.getElementById("gvLogSessionGame").value;
      var minutes = parseInt(document.getElementById("gvLogSessionMinutes").value, 10);
      if (!gameId || !minutes || minutes <= 0) return;
      var dateVal = document.getElementById("gvLogSessionDate").value;
      var note = document.getElementById("gvLogSessionNote").value.trim();
      logSessionManual(gameId, minutes, dateVal, note);
      e.target.reset();
    });
  }

  /* ---------------------------------------------------------------------
   * Gaming Journal
   * ------------------------------------------------------------------- */
  function renderJournalPanel() {
    var gameSelect = document.getElementById("gvJournalGame");
    var listEl = document.getElementById("gvJournalList");
    if (!gameSelect || !listEl) return;
    var sig = library.map(function (g) { return g.id; }).join(",");
    if (gameSelect.dataset.sig !== sig) {
      gameSelect.innerHTML = '<option value="">General entry</option>' + library.map(function (g) { return '<option value="' + esc(g.id) + '">' + esc(g.name) + "</option>"; }).join("");
      gameSelect.dataset.sig = sig;
    }
    if (!journal.length) {
      listEl.innerHTML = '<p class="gv-picker-empty">No journal entries yet.</p>';
      return;
    }
    listEl.innerHTML = journal.map(function (entry) {
      var game = entry.gameId ? library.find(function (g) { return g.id === entry.gameId; }) : null;
      return (
        '<article class="gv-journal-entry" data-reveal data-reveal-group="journal" data-reveal-key="' + esc(entry.id) + '"><div class="gv-journal-entry-head"><h3>' + esc(entry.title) + '</h3><span class="gv-journal-meta">' + new Date(entry.date).toLocaleDateString() + (game ? " · " + esc(game.name) : "") + "</span></div>" +
        "<p>" + esc(entry.body) + "</p>" +
        '<div class="gv-journal-entry-actions">' +
          '<button type="button" class="btn btn-ghost" data-action="journal-edit" data-id="' + esc(entry.id) + '">' + ICON_EDIT + " Edit</button>" +
          '<button type="button" class="btn btn-ghost" data-action="journal-delete" data-id="' + esc(entry.id) + '">' + ICON_DELETE + " Delete</button>" +
        "</div></article>"
      );
    }).join("");
    wireReveal(listEl);
  }
  function startEditJournal(id) {
    var entry = journal.find(function (e) { return e.id === id; });
    if (!entry) return;
    editingJournalId = id;
    document.getElementById("gvJournalId").value = id;
    document.getElementById("gvJournalGame").value = entry.gameId || "";
    document.getElementById("gvJournalTitle").value = entry.title;
    document.getElementById("gvJournalBody").value = entry.body;
    document.getElementById("gvJournalSave").textContent = "Update Entry";
    document.getElementById("gvJournalCancel").hidden = false;
    document.getElementById("gvJournalError").textContent = "";
    document.getElementById("gvJournalTitle").focus();
  }
  function cancelJournalEdit() {
    editingJournalId = null;
    document.getElementById("gvJournalForm").reset();
    document.getElementById("gvJournalId").value = "";
    document.getElementById("gvJournalSave").textContent = "Save Entry";
    document.getElementById("gvJournalCancel").hidden = true;
    document.getElementById("gvJournalError").textContent = "";
  }
  function deleteJournalEntry(id,confirmed) {
    if(!confirmed){window.OneSpaceUI.confirm('Delete journal entry?','This entry will be removed.',function(){return deleteJournalEntry(id,true);});return;}
    journal = journal.filter(function (e) { return e.id !== id; });
    if(!saveJournal())return false;
    if (editingJournalId === id) cancelJournalEdit();
    renderJournalPanel();
  }
  function wireJournal() {
    document.getElementById("gvJournalForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var title = document.getElementById("gvJournalTitle").value.trim();
      var body = document.getElementById("gvJournalBody").value.trim();
      var error = document.getElementById("gvJournalError");
      error.textContent = "";
      if (!title || !body) {
        error.textContent = "Enter a title and journal entry before saving.";
        document.getElementById(!title ? "gvJournalTitle" : "gvJournalBody").focus();
        return;
      }
      var gameId = document.getElementById("gvJournalGame").value || null;
      if (editingJournalId) {
        var entry = journal.find(function (en) { return en.id === editingJournalId; });
        if (entry) { entry.title = title; entry.body = body; entry.gameId = gameId; }
      } else {
        journal.unshift({ id: uid("journal"), gameId: gameId, date: new Date().toISOString(), title: title, body: body });
      }
      if(!saveJournal()){error.textContent="Changes could not be saved. Please try again.";return false;}
      cancelJournalEdit();
      renderJournalPanel();
      showToast("Journal entry saved.");
    });
    document.getElementById("gvJournalCancel").addEventListener("click", cancelJournalEdit);
  }

  /* Cinematic spotlight. Transient motion state never replaces stored progress. */
  /* .matches reflects OneSpace's manual Settings override first (if the user
     forced reduced/full motion), falling back to the OS-level media query —
     so GameVault's own motion respects the same "Reduced Motion" control as
     the rest of the app, not just the device setting. */
  var osMotionQuery = safeMatchMedia("(prefers-reduced-motion: reduce)");
  var motionQuery = {
    get matches() {
      if (OS.prefersReducedMotion) return OS.prefersReducedMotion();
      return osMotionQuery.matches;
    },
    addEventListener: function (type, fn) { osMotionQuery.addEventListener(type, fn); }
  };
  var finePointerQuery = safeMatchMedia("(hover: hover) and (pointer: fine)");
  var spotlight = {
    id: safeGet("orbit-games-spotlight") || "game-alan-wake-2",
    paused: safeGet("orbit-games-autoplay") === "paused",
    hover: false, focus: false, visible: true, timer: null,
    frame: null, x: 0, y: 0, targetX: 0, targetY: 0
  };
  var gameIcons = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    library: '<path d="M7 7h10a4 4 0 0 1 4 3l1 7a2 2 0 0 1-3.4 1.7L16 16H8l-2.6 2.7A2 2 0 0 1 2 17l1-7a4 4 0 0 1 4-3Z"/><path d="M6 11v4m-2-2h4m8-1h.01m3 2h.01"/>',
    missions: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    weekly: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 2 2 5-4"/>',
    suggestions: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
    sessions: '<circle cx="12" cy="14" r="8"/><path d="M9 2h6m-3 0v4m0 4v5l3 2"/>',
    journal: '<path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>',
    appearance: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18Z"/>',
    previous: '<path d="m14 6-6 6 6 6"/>', next: '<path d="m10 6 6 6-6 6"/>',
    pause: '<path d="M9 5v14M15 5v14"/>', play: '<path d="m8 5 11 7-11 7Z"/>'
  };
  function gvIcon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (gameIcons[name] || gameIcons.library) + '</svg>';
  }
  function spotlightGame() {
    return library.find(function (g) { return g.id === spotlight.id; }) || library[0];
  }
  function featuredGames() {
    return library.slice();
  }
  function focusPanel(name) {
    var panel = document.querySelector('.gv-panel[data-panel="' + name + '"]');
    if (!panel) return;
    panel.tabIndex = -1;
    panel.focus({preventScroll:true});
    panel.scrollIntoView({behavior: motionQuery.matches ? "auto" : "smooth", block:"start"});
  }
  function selectSpotlight(id, reason) {
    var game = library.find(function (g) { return g.id === id; });
    if (!game) return;
    var changed = spotlight.id !== id;
    var selectedKey = game.trackerType === "weekly" ? GK.selectedWeekly : GK.selectedStory;
    var writes = { "orbit-games-spotlight": id };
    writes[selectedKey] = id;
    try { window.OneSpaceStorage.transaction(window.localStorage, writes); }
    catch (error) { showToast('Changes could not be saved. Please try again.'); return false; }
    spotlight.id = id;
    if (game.trackerType === "weekly") {
      selectedWeeklyGameId = id; renderWeeklyPanel();
    } else {
      selectedStoryGameId = id; renderMissionsPanel();
    }
    if (changed) renderSpotlight(reason);
    if (reason === "manual") document.getElementById("gvSpotlightAnnouncement").textContent = game.name + " selected. " + statsFor(game).percent + "% complete.";
    syncSpotlightPlayback();
    return true;
  }
  function advanceSpotlight(direction, reason) {
    var games = featuredGames();
    if (!games.length) return;
    var index = games.findIndex(function (g) { return g.id === spotlight.id; });
    selectSpotlight(games[(index + direction + games.length) % games.length].id, reason);
  }
  function renderSpotlight(reason) {
    var hero = document.getElementById("gvSpotlight");
    var game = spotlightGame();
    if(!hero)return;hero.hidden=activeTab!=='overview'||!game;document.getElementById('gvSpotlightRail').hidden=activeTab!=='overview'||!game;if(!game){document.getElementById('gvSpotlightRail').innerHTML='';return;}
    spotlight.id = game.id;
    var stats = statsFor(game), games = featuredGames();
    var index = games.findIndex(function (g) { return g.id === game.id; });
    hero.dataset.gameId = game.id;
    hero.dataset.world = game.world || "violet"; hero.style.setProperty('--feature-accent', game.accent || '#a99ada'); hero.style.setProperty('--art-position',game.artworkPosition || 'center');
    var content = document.getElementById("gvHeroContent");
    var focusedAction = content.contains(document.activeElement) ? document.activeElement.getAttribute("data-action") : null;
    content.innerHTML = '<div class="gv-hero-logo">' + renderLogo(game) + '</div>' +
      '<p class="gv-hero-tagline">' + esc(game.tagline || "Make time for your next adventure.") + '</p>' +
      '<h1 class="gv-hero-title">' + esc(game.name) + '</h1>' +
      '<div class="gv-hero-meta"><span>' + esc(game.genre) + '</span><select aria-label="Platform for ' + esc(game.name) + '" data-action="hero-platform">' + (window.GAMES_PLATFORMS || []).map(function (platform) { return '<option' + (platform === game.platform ? ' selected' : '') + '>' + esc(platform) + '</option>'; }).join('') + '</select><span>' + (game.trackerType === "weekly" ? "Weekly journey" : "Story journey") + '</span></div>' +
      '<div class="gv-hero-progress"><div class="gv-hero-ring" role="progressbar" aria-label="' + esc(game.name) + ' completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + stats.percent + '"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="gv-ring-track" cx="50" cy="50" r="42"/><circle class="gv-ring-fill" cx="50" cy="50" r="42" stroke-dasharray="263.9" stroke-dashoffset="' + (263.9 * (1 - stats.percent / 100)).toFixed(1) + '"/></svg><strong>' + stats.percent + '<small>%</small></strong></div>' +
      '<div class="gv-hero-next"><span>' + (game.trackerType === "weekly" ? "NEXT WEEKLY TASK" : "NEXT MISSION") + '</span><p>' + esc(stats.total ? stats.next : "Add your first objective to get started") + '</p><small>' + stats.completed + ' of ' + stats.total + ' ' + (game.trackerType === "weekly" ? "tasks" : "objectives") + ' complete</small></div></div>' +
      '<div class="gv-hero-actions"><button type="button" class="btn gv-hero-primary" data-action="open-progress" data-id="' + esc(game.id) + '">' + gvIcon("play") + 'Open Progress</button><button type="button" class="btn gv-hero-secondary" data-action="change-spotlight">Change Game ' + gvIcon("next") + '</button></div>';
    if (focusedAction) content.querySelector('[data-action="' + focusedAction + '"]')?.focus({preventScroll:true});
    var art = document.getElementById("gvSceneArt");
    if (art.dataset.gameId !== game.id) {
      art.dataset.gameId = game.id;
      art.querySelectorAll("picture").forEach(function (p) { p.classList.remove("is-active"); });
      var picture = document.createElement("picture");
      if (game.artwork) {
        picture.innerHTML = (game.artworkMobile ? '<source media="(max-width: 640px)" srcset="' + esc(game.artworkMobile) + '">' : '') + '<img src="' + esc(game.artwork) + '" alt="" width="1920" height="1080" decoding="async" fetchpriority="high">';
        picture.querySelector("img").addEventListener("error", function () { console.warn('[OneSpace asset]',game.name,game.artwork); picture.innerHTML=window.OneSpaceVisual.cover(game.name, 'game',game.accent); }, {once:true});
      } else picture.innerHTML = gameScene(game);
      art.appendChild(picture);
      requestAnimationFrame(function () { picture.classList.add("is-active"); });
      setTimeout(function () { Array.from(art.children).forEach(function (p) { if (p !== art.lastElementChild) p.remove(); }); }, 650);
    }
    document.getElementById("gvHeroIndex").textContent = index < 0 ? "YOUR COLLECTION" : "0" + (index + 1) + " / 0" + games.length;
    // Keep controls mounted: automatic and keyboard transitions must not steal focus.
    [document.getElementById("gvHeroDots"), document.getElementById("gvSpotlightRail")].forEach(function (root, type) {
      if (root.dataset.signature !== games.map(function (g) { return g.id+g.name+(g.artwork||""); }).join(",")) {
        root.dataset.signature = games.map(function (g) { return g.id+g.name+(g.artwork||""); }).join(",");
        root.innerHTML = games.map(function (g, i) {
          return '<button type="button" class="' + (type ? 'gv-spotlight-card' : 'gv-dot') + '" data-spotlight-id="' + esc(g.id) + '" aria-label="Show ' + esc(g.name) + '">' + (type ? (g.artwork ? '<img src="' + esc(g.artwork) + '" alt="" width="320" height="180" loading="lazy">' : '<span class="gv-rail-scene">'+gameScene(g)+'</span>')+'<span><small>0' + (i + 1) + ' / ' + esc(g.genre) + '</small><strong>' + esc(g.name) + '</strong><span class="gv-rail-progress"></span></span>' + gvIcon("next") : '<span></span>') + '</button>';
        }).join("");
      }
      root.querySelectorAll("[data-spotlight-id]").forEach(function (button) {
        var id = button.dataset.spotlightId;
        button.setAttribute("aria-pressed", String(id === game.id));
        var progress = button.querySelector(".gv-rail-progress");
        if (progress) progress.textContent = statsFor(library.find(function (g) { return g.id === id; })).percent + "% complete";
      });
    });
    document.querySelectorAll(".gv-card[data-game-id]").forEach(function (card) { card.classList.toggle("is-spotlight", card.dataset.gameId === game.id); });
    if (reason !== "refresh") {
      hero.classList.remove("is-hero-entering", "is-hero-switching");
      void hero.offsetWidth;
      hero.classList.add(reason === "entry" ? "is-hero-entering" : "is-hero-switching");
      clearTimeout(hero._entranceTimer);
      hero._entranceTimer = setTimeout(function () { hero.classList.remove("is-hero-entering", "is-hero-switching"); }, 1500);
      animateRingDraw(content);
    }
  }
  function syncSpotlightPlayback() {
    clearTimeout(spotlight.timer); spotlight.timer = null;
    var hero = document.getElementById("gvSpotlight");
    if (!hero) return;
    var isGames = document.body.dataset.page === "games";
    var blocked = document.getElementById('gamesView').dataset.sceneIntensity==='off' || spotlight.paused || motionQuery.matches || spotlight.hover || spotlight.focus || document.hidden || !isGames || activeTab !== "overview" || !spotlight.visible;
    hero.dataset.playing = String(!blocked);
    document.getElementById("gamesView").classList.toggle("gv-motion-paused", document.hidden || !isGames);
    hero.classList.toggle("gv-ambient-paused", document.hidden || !isGames || !spotlight.visible || spotlight.paused);
    var button = document.getElementById("gvAutoplay");
    var controlState = spotlight.paused || motionQuery.matches ? "play" : "pause";
    // Focus and pointer-enter happen before click. Replacing their hit target here
    // can cancel a pointer click; only update markup when the control changes.
    if (button.dataset.state !== controlState) {
      button.dataset.state = controlState;
      button.innerHTML = gvIcon(controlState) + '<span>' + (controlState === "play" ? "Play" : "Pause") + '</span>';
    }
    button.disabled = motionQuery.matches;
    button.setAttribute("aria-label", motionQuery.matches ? "Automatic rotation disabled for reduced motion" : spotlight.paused ? "Start automatic rotation" : "Pause automatic rotation");
    if (!blocked) spotlight.timer = setTimeout(function () { advanceSpotlight(1, "auto"); }, 6000);
    if (document.hidden || !isGames || motionQuery.matches || !finePointerQuery.matches || !spotlight.visible || spotlight.paused) {
      cancelAnimationFrame(spotlight.frame); spotlight.frame = null;
      spotlight.x = spotlight.y = spotlight.targetX = spotlight.targetY = 0;
      if(OS.scene)OS.scene.resetPointer(hero);
    }
  }
  function initSpotlight() {
    var hero = document.getElementById("gvSpotlight");
    document.getElementById("gvPrevious").innerHTML = gvIcon("previous");
    document.getElementById("gvNext").innerHTML = gvIcon("next");
    document.getElementById("gvPrevious").addEventListener("click", function () { advanceSpotlight(-1, "manual"); });
    document.getElementById("gvNext").addEventListener("click", function () { advanceSpotlight(1, "manual"); });
    document.getElementById("gvAutoplay").addEventListener("click", function () { spotlight.paused = !spotlight.paused; safeSet("orbit-games-autoplay", spotlight.paused ? "paused" : "playing"); syncSpotlightPlayback(); });
    document.getElementById("gamesView").addEventListener("click", function (e) {
      var button = e.target.closest("[data-spotlight-id]");
      if (button) selectSpotlight(button.dataset.spotlightId, "manual");
    });
    hero.addEventListener("keydown", function (e) {
      if (e.target.matches("input,select,textarea")) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault(); advanceSpotlight(e.key === "ArrowLeft" ? -1 : 1, "manual");
    });
    [hero, document.getElementById("gvSpotlightRail")].forEach(function (region) {
      region.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") { spotlight.hover = true; syncSpotlightPlayback(); } });
      region.addEventListener("pointerleave", function () { spotlight.hover = false; if(OS.scene)OS.scene.resetPointer(hero); syncSpotlightPlayback(); });
      region.addEventListener("focusin", function () { spotlight.focus = true; syncSpotlightPlayback(); });
      region.addEventListener("focusout", function () { setTimeout(function () { spotlight.focus = hero.contains(document.activeElement) || document.getElementById("gvSpotlightRail").contains(document.activeElement); syncSpotlightPlayback(); }, 0); });
    });
    if(OS.scene)OS.scene.bind(hero);

    var touch = null;
    hero.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch" && !e.target.closest("button")) touch = {x:e.clientX,y:e.clientY}; });
    hero.addEventListener("pointerup", function (e) { if (!touch) return; var dx = e.clientX-touch.x, dy = e.clientY-touch.y; touch = null; if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5) advanceSpotlight(dx>0?-1:1,"manual"); });
    hero.addEventListener("pointercancel", function () { touch = null; });
    document.addEventListener("visibilitychange", function () { syncSpotlightPlayback(); if (document.hidden) stopSessionTicker(); else if (activeSession()) startSessionTicker(); });
    document.addEventListener("onespace:motion-changed", function () { wireReveal(document.getElementById("gamesView")); syncSpotlightPlayback(); });
    motionQuery.addEventListener("change", function () { wireReveal(document.getElementById("gamesView")); syncSpotlightPlayback(); });
    finePointerQuery.addEventListener("change", syncSpotlightPlayback);
    document.addEventListener("onespace:page-changed", syncSpotlightPlayback);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (entries) { spotlight.visible = entries[0].isIntersecting; syncSpotlightPlayback(); }, {threshold:.1}).observe(hero);
    var labels = {overview:"Your play, at a glance",library:"My Games",missions:"Mission Progress",weekly:"Weekly Tasks",suggestions:"Discover your next obsession",sessions:"Gaming Sessions",journal:"Gaming Journal",appearance:"Make it your world"};
    document.querySelectorAll(".gv-tab").forEach(function (button) {
      var name = button.dataset.gvTab;
      button.innerHTML = gvIcon(name) + '<span>' + button.textContent + '</span>';
      button.id = "gvTab-" + name; button.setAttribute("aria-controls","gvPanel-" + name);
    });
    document.querySelectorAll(".gv-panel").forEach(function (panel, i) {
      var name = panel.dataset.panel;
      panel.id = "gvPanel-" + name; panel.setAttribute("aria-labelledby", "gvHeading-" + name);
      panel.setAttribute("data-reveal", ""); panel.setAttribute("data-reveal-key", "panel-" + name);
      var heading = document.createElement("div"); heading.className = "gv-section-heading";
      heading.setAttribute("data-reveal", ""); heading.setAttribute("data-reveal-key", "section-" + name);
      heading.innerHTML = '<span>0' + (i+1) + ' / YOUR GAMEVAULT</span><h2 id="gvHeading-' + name + '">' + gvIcon(name) + labels[name] + '</h2>';
      panel.prepend(heading);
    });
    document.querySelectorAll('[data-page-button="games"] svg, .gv-emblem svg').forEach(function (svg) {
      svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.75"); svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round"); svg.innerHTML = gameIcons.library;
    });
    wireReveal(document.getElementById("gamesView"));
  }

  /* ---------------------------------------------------------------------
   * Tabs + animations
   * ------------------------------------------------------------------- */
  function applyTabVisibility(tab) {
    document.querySelectorAll(".gv-tab").forEach(function (btn) {
      var active = btn.getAttribute("data-gv-tab") === tab;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll(".gv-panel").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== tab;
      panel.setAttribute("role", tab === "overview" ? "region" : "tabpanel");
    });
    document.getElementById("gvSpotlight").hidden = tab !== "overview" || !library.length;
    document.getElementById("gvSpotlightRail").hidden = tab !== "overview" || !library.length;
    syncSpotlightPlayback();
  }
  /* .is-entering/.is-entering-view are intentionally transient: leaving them on
     permanently would let a panel's one-time entrance stagger rules (e.g.
     ".gv-panel.is-entering[data-panel=weekly] .gv-weekly-task") keep outranking
     later per-row feedback like the check-pop animation by CSS specificity alone,
     silently breaking it after the first visit. Clearing the class once the
     entrance sequence has finished playing avoids that. */
  function playPanelAnimation(tab) {
    var panel = document.querySelector('.gv-panel[data-panel="' + tab + '"]');
    if (!panel) return;
    panel.classList.remove("is-entering");
    void panel.offsetWidth;
    panel.classList.add("is-entering");
    clearTimeout(panel._gvAnimCleanup);
    panel._gvAnimCleanup = setTimeout(function () { panel.classList.remove("is-entering"); }, 1400);
  }
  function switchTab(tab) {
    if (TABS.indexOf(tab) === -1) tab = "overview";
    activeTab = tab;
    safeSet(GK.activeTab, tab);
    applyTabVisibility(tab);
    playPanelAnimation(tab);
    wireReveal(document.querySelector('.gv-panel[data-panel="' + tab + '"]'));
  }
  function wireTabs() {
    document.querySelectorAll(".gv-tab").forEach(function (btn) {
      btn.addEventListener("click", function () { switchTab(btn.getAttribute("data-gv-tab")); });
      btn.addEventListener("keydown", function (e) {
        var index = TABS.indexOf(btn.getAttribute("data-gv-tab"));
        if (e.key === "ArrowRight") index = (index + 1) % TABS.length;
        else if (e.key === "ArrowLeft") index = (index + TABS.length - 1) % TABS.length;
        else if (e.key === "Home") index = 0;
        else if (e.key === "End") index = TABS.length - 1;
        else return;
        e.preventDefault(); switchTab(TABS[index]);
        document.querySelector('[data-gv-tab="' + TABS[index] + '"]').focus();
      });
    });
  }
  function playEntryAnimation() {
    var gamesView = document.getElementById("gamesView");
    if (!gamesView) return;
    var now = Date.now();
    if (now - (gamesView._gvLastEntryAnim || 0) < 80) return;
    gamesView._gvLastEntryAnim = now;
    applyTabVisibility(activeTab);
    renderSpotlight("entry");
    resetReveals();
    if(OS.scene)OS.scene.enter(document.getElementById('gamesView'));
    playPanelAnimation(activeTab);
  }

  /* ---------------------------------------------------------------------
   * Delegated event wiring for #gamesView dynamic content
   * ------------------------------------------------------------------- */
  function wireDelegatedEvents() {
    var root = document.getElementById("gamesView");
    if (!root) return;
    root.addEventListener("click", function (e) {
      var target = e.target.closest("[data-action]");
      if (!target) return;
      var action = target.getAttribute("data-action");
      var id = target.getAttribute("data-id");
      switch (action) {
        case "spotlight-game": if(selectSpotlight(id, "manual")===false)break; switchTab("overview"); document.getElementById("gvSpotlight").scrollIntoView({ behavior: motionQuery.matches ? "auto" : "smooth", block: "start" }); break;
        case "change-spotlight": advanceSpotlight(1, "manual"); break;
        case "explore-library": switchTab("library"); focusPanel("library"); break;
        case "open-progress": goToTracker(id); break;
        case "edit-game": {
          var game = library.find(function (g) { return g.id === id; });
          if (game) openAddGameModal(id);
          break;
        }
        case "delete-game": deleteGame(id); break;
        case "toggle-chapter": toggleChapter(target.getAttribute("data-chapter-id")); break;
        case "edit-objective": startEditObjective(target.getAttribute("data-chapter-id"), target.getAttribute("data-objective-id")); break;
        case "delete-objective": deleteObjective(target.getAttribute("data-chapter-id"), target.getAttribute("data-objective-id")); break;
        case "cancel-objective-edit": renderMissionsPanel(); break;
        case "reset-weekly": resetWeekly(id); break;
        case "pick-mission-game": withFocusPreserved(function(){selectSpotlight(id, "tracker");}); break;
        case "pick-weekly-game": withFocusPreserved(function(){selectSpotlight(id, "tracker");}); break;
        case "suggest-add": addSuggestionToLibrary(id); break;
        case "suggest-wishlist": addToWishlist(id); break;
        case "suggest-dismiss": dismissSuggestion(id); break;
        case "suggest-details": openSuggestionDetails(id); break;
        case "wishlist-add": moveWishlistToLibrary(id); break;
        case "wishlist-remove": removeFromWishlist(id); break;
        case "session-stop": stopSession(); break;
        case "session-delete": deleteSession(id); break;
        case "journal-edit": startEditJournal(id); break;
        case "journal-delete": deleteJournalEntry(id); break;
        case "apply-games-theme": applyGamesTheme(target.getAttribute("data-theme")); break;
      }
    });
    root.addEventListener("change", function (e) {
      var t = e.target;
      if (t.matches && t.matches('[data-action="hero-platform"]')) {
        var game = spotlightGame(); game.platform = t.value; saveLibrary(); withFocusPreserved(renderAll);
      } else if (t.matches && t.matches('[data-action="toggle-objective"]')) {
        toggleObjective(t.getAttribute("data-chapter-id"), t.getAttribute("data-objective-id"),t.getAttribute("data-game-id") || t.closest(".gv-tracker")?.getAttribute("data-game-id"));
      } else if (t.matches && t.matches('[data-action="toggle-weekly-task"]')) {
        var trackerEl = t.closest(".gv-tracker");
        if (t.dataset.gameId || trackerEl) toggleWeeklyTask(t.dataset.gameId || trackerEl.getAttribute("data-game-id"), t.getAttribute("data-task-id"));
      } else if (t.matches && t.matches("[data-pref-group]")) {
        handlePrefChange(t);
      }
    });
    root.addEventListener("submit", function (e) {
      var addForm = e.target.closest('[data-action="add-objective-form"]');
      if (addForm) {
        e.preventDefault();
        var input = addForm.querySelector("input");
        var text = input.value.trim();
        if (!text) return;
        addObjective(addForm.getAttribute("data-chapter-id"), text);
        return;
      }
      var editForm = e.target.closest(".gv-objective-edit-form");
      if (editForm) {
        e.preventDefault();
        var newText = editForm.querySelector("input").value.trim();
        if (!newText) {editForm.querySelector('[role="alert"]').textContent='Enter an objective before saving.';editForm.querySelector('input').focus();return;}
        if(commitEditObjective(editForm.getAttribute("data-chapter-id"), editForm.getAttribute("data-objective-id"), newText)===false){editForm.querySelector('[role="alert"]').textContent='Changes could not be saved. Please try again.';editForm.querySelector('input').focus();}
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Render everything (simple, always-consistent — data sets are tiny)
   * ------------------------------------------------------------------- */
  /* Re-rendering rebuilds innerHTML wholesale, which would otherwise drop
     keyboard focus off a checkbox/button the instant it's toggled. This
     recreates a selector for the currently-focused control from its own
     data attributes and refocuses the equivalent (freshly-rendered) element
     after the re-render, so keyboard users don't lose their place. */
  function withFocusPreserved(renderFn) {
    var active=document.activeElement,attrs={},owner=active?.closest?.('.gv-tracker')?.getAttribute('data-game-id');
    if(active?.getAttribute('data-action'))['data-action','data-chapter-id','data-objective-id','data-task-id','data-id','data-game-id'].forEach(function(name){attrs[name]=active.getAttribute(name);});
    renderFn();
    if(attrs['data-action']){var next=Array.from(document.querySelectorAll('[data-action]')).find(function(el){return Object.keys(attrs).every(function(name){return el.getAttribute(name)===attrs[name];})&&(!owner||el.closest('.gv-tracker')?.getAttribute('data-game-id')===owner);});next?.focus({preventScroll:true});}
  }

  function renderAll() {
    renderPrefGroups();
    renderSuggestions();
    renderLibraryGrid();
    renderMissionsPanel();
    renderWeeklyPanel();
    renderOverview();
    renderWishlist();
    renderSessionsPanel();
    renderJournalPanel();
    renderAppearancePanel();
    renderSpotlight("refresh");
  }

  /* ---------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------- */
  window.OneSpaceGameDiscovery={snapshot:function(){return {games:library,DEFAULT_GAMES:window.DEFAULT_GAMES,SUGGESTION_CATALOG:window.SUGGESTION_CATALOG};},has:function(x){return library.some(function(g){return g.id===x.id||g.sourceSuggestion===x.id||g.name.toLowerCase()===x.name.toLowerCase();});},save:function(x,f){
    if(library.some(function(g){return g.id===x.id||g.sourceSuggestion===x.id||g.name.toLowerCase()===x.name.toLowerCase();})){showToast('Already in My Games.');return true;}
    var g={id:x.id,name:x.name.slice(0,160),platform:x.platforms?.[0]||'Unspecified',platforms:x.platforms||[],genre:x.genres?.[0]||'Adventure',genres:x.genres||[],accent:'#a99ada',logo:x.image?{kind:'asset',src:x.image}:{kind:'cover'},artwork:x.image||'',cardArtwork:x.image||'',trackerType:String(f?.get('tracker')||window.OneSpaceGameResources.infer(x)),chapterOutline:x.chapterOutline,weeklyTemplate:x.weeklyTemplate,custom:true,discoveryRecord:x,resources:x.resources?.length?x.resources:window.OneSpaceGameResources.resources({name:x.name}),story:{chapters:[]}};
    if(x.website)g.resources.unshift({group:'Official',label:'Official website',url:x.website});
    if(x.defaultTaskTemplates)g.defaultTaskTemplates=x.defaultTaskTemplates;if(g.trackerType==='story')g.story=starterStory(g);else delete g.story;library.push(g);if(g.trackerType==='weekly')ensureWeekly(g.id,false);if(!commitGameChanges())return false;renderAll();showToast(x.name+' added to My Games.');return true;
  }};
  function init() {
    if (!document.getElementById("gamesView")) return;
    saveLibrary();
    activeTab = TABS.indexOf(safeGet(GK.activeTab)) !== -1 ? safeGet(GK.activeTab) : "overview";
    selectedStoryGameId = safeGet(GK.selectedStory) || null;
    selectedWeeklyGameId = safeGet(GK.selectedWeekly) || null;

    initSpotlight();
    renderPrefGroups();
    renderAll();

    wireAddGameModal();
    wireThemeSwitcher();
    wireSuggestions();
    wireGameSearch();
    wireTabs();
    wireSessions();
    wireJournal();
    wireDelegatedEvents();
    wireLogoFallback();

    applyTabVisibility(activeTab);

    window.OneSpace = window.OneSpace || {};
    window.OneSpace.playGamesEntryAnimation = playEntryAnimation;

    document.addEventListener("onespace:page-changed", function (e) {
      if (e.detail && e.detail.page === "games") playEntryAnimation();
    });

    if (document.body.getAttribute("data-page") === "games") playEntryAnimation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
