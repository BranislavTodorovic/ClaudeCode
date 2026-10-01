/* Shared contracts for the reference-led eight-world UI. No domain data lives here. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OneSpaceRedesign = api;
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';

  var worlds = [
    { id: 'home', label: 'Home', scene: 'assets/scenes/home/hero.png', preview: 'assets/scenes/home/hero-fast.jpg', modules: [] },
    { id: 'work', label: 'Work', scene: 'assets/scenes/work/hero-r3.png', preview: 'assets/scenes/work/hero-fast.jpg', modules: ['projects', 'kanban-board', 'team', 'documents', 'meetings', 'templates'] },
    { id: 'personal', label: 'Personal / Fitness', scene: 'assets/scenes/personal/hero.png', preview: 'assets/scenes/personal/hero-fast.jpg', modules: ['mindfulness', 'fitness', 'nutrition', 'recovery', 'personal-life', 'home-wellbeing'] },
    { id: 'explore', label: 'Explore', scene: 'assets/scenes/explore/hero.png', preview: 'assets/scenes/explore/hero-fast.jpg', modules: ['destinations', 'experiences', 'travel-guides', 'bucket-list', 'discover-more'] },
    { id: 'games', label: 'Games', scene: 'assets/scenes/games/hero.png', preview: 'assets/scenes/games/hero-fast.jpg', modules: ['my-games', 'missions-quests', 'game-library', 'game-sessions', 'discover-games', 'game-settings'] },
    { id: 'movies', label: 'Movies & Series', scene: 'assets/scenes/movies/hero.png', preview: 'assets/scenes/movies/hero-fast.jpg', modules: ['continue-watching', 'watchlist-library', 'discovery', 'new-releases', 'recommendations', 'genres', 'title-detail'] },
    { id: 'projects-notes', label: 'Projects & Notes', scene: 'assets/scenes/projects-notes/hero.png', preview: 'assets/scenes/projects-notes/hero-fast.jpg', modules: ['all-projects', 'notes-knowledge', 'documents', 'idea-inbox', 'templates', 'archive'] },
    { id: 'settings', label: 'Settings', scene: 'assets/scenes/settings/hero.png', preview: 'assets/scenes/settings/hero-fast.jpg', modules: ['appearance-theme', 'connected-devices', 'notifications', 'privacy-security', 'quick-settings', 'routines-automation', 'system-health', 'account-profile'] }
  ];
  var utilities = ['today', 'command', 'shortcuts', 'productivity', 'notes'];
  var worldById = Object.create(null);
  worlds.forEach(function (world) { worldById[world.id] = world; });

  function canonicalWorld(id) {
    if (id === 'media') return 'movies';
    return worldById[id] ? id : null;
  }
  function routePath(route) {
    if (route.utility && utilities.indexOf(route.utility) !== -1) return '#/u/' + route.utility;
    if (route.world === 'projects' && !route.module && route.recordId == null) return '#/w/work/projects';
    var world = canonicalWorld(route.world);
    if (!world) return null;
    var path = '#/w/' + world;
    if (route.module) {
      if (worldById[world].modules.indexOf(route.module) === -1) return null;
      path += '/' + route.module;
      if (route.recordId != null) path += '/' + encodeURIComponent(String(route.recordId));
    } else if (route.recordId != null) return null;
    return path;
  }
  function parseRoute(hash) {
    if (typeof hash !== 'string') return null;
    var parts = hash.replace(/^#\/?/, '').split('/');
    if (parts[0] === 'u' && parts.length === 2 && utilities.indexOf(parts[1]) !== -1) {
      return { utility: parts[1], world: null, module: null, recordId: null, activeParent: parts[1] };
    }
    if (parts[0] !== 'w' || parts.length < 2 || parts.length > 4) return null;
    if (parts[1] === 'projects' && parts.length === 2) {
      return { utility: null, world: 'work', module: 'projects', recordId: null, activeParent: 'work' };
    }
    var world = canonicalWorld(parts[1]);
    if (!world) return null;
    var moduleId = parts[2] || null;
    if (moduleId && worldById[world].modules.indexOf(moduleId) === -1) return null;
    if (parts.length === 4 && (!moduleId || !parts[3])) return null;
    var recordId = null;
    if (parts.length === 4) {
      try { recordId = decodeURIComponent(parts[3]); } catch (error) { return null; }
      if (!recordId || recordId.indexOf('/') !== -1 || recordId.indexOf('\\') !== -1) return null;
    }
    return { utility: null, world: world, module: moduleId, recordId: recordId, activeParent: world };
  }

  function createShell(doc, handlers) {
    handlers = handlers || {};
    var shell = doc.createElement('header');
    shell.className = 'osr-shell';
    var brand = doc.createElement('a');
    brand.className = 'osr-brand';
    brand.href = routePath({ world: 'home' });
    brand.textContent = 'OneSpace';
    shell.appendChild(brand);
    var nav = doc.createElement('nav');
    nav.className = 'osr-nav';
    nav.setAttribute('aria-label', 'Main worlds');
    worlds.forEach(function (world) {
      var link = doc.createElement('a');
      link.className = 'osr-nav-link';
      link.href = routePath({ world: world.id });
      link.dataset.world = world.id;
      link.textContent = world.label;
      if (typeof handlers.onNavigate === 'function') link.addEventListener('click', function (event) { handlers.onNavigate(event, world.id); });
      nav.appendChild(link);
    });
    shell.appendChild(nav);
    var utilitiesEl = doc.createElement('div');
    utilitiesEl.className = 'osr-utilities';
    [['today', 'Today'], ['shortcuts', 'Shortcuts'], ['notes', 'Notes'], ['command', 'Command']].forEach(function (entry) {
      var button = doc.createElement('button');
      button.type = 'button';
      button.className = 'osr-icon-button';
      button.textContent = entry[1];
      button.disabled = typeof handlers.onUtility !== 'function';
      if (!button.disabled) button.addEventListener('click', function () { handlers.onUtility(entry[0]); });
      utilitiesEl.appendChild(button);
    });
    shell.appendChild(utilitiesEl);
    return shell;
  }
  function setActiveWorld(shell, worldId) {
    shell.querySelectorAll('[data-world]').forEach(function (link) {
      if (link.dataset.world === worldId) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  /* Decorative-only image loading; the existing OneSpace scene controller owns motion. */
  function createSceneHost(host, ImageConstructor) {
    var ImageType = ImageConstructor || (typeof Image !== 'undefined' ? Image : null);
    if (!host || !ImageType) throw new Error('Scene host requires a host and Image constructor');
    var generation = 0;
    var requested = null, currentWorld = null, pending = null;
    var doc = host.ownerDocument, view = host.closest && host.closest('[data-page-when]');
    function active(worldId) {
      if (!view) return true;
      if (view.hidden) return false;
      // Home mounts before hash routing; do not fetch its art on a direct non-Home route.
      if (doc.documentElement.getAttribute('data-onespace-boot') === 'pending') {
        var route = parseRoute(doc.defaultView.location.hash);
        if (route && route.world && route.world !== 'projects-notes') return route.world === worldId;
        if (route && route.utility) return false;
      }
      return true;
    }
    function activate() { if (requested && active(requested)) show(requested); }
    if (view) {
      doc.addEventListener('onespace:page-changed', activate);
      doc.addEventListener('onespace:ready', activate);
    }
    host.classList.add('osr-scene-host');
    host.setAttribute('aria-hidden', 'true');
    function show(worldId) {
      var world = worldById[worldId];
      if (!world) return Promise.reject(new Error('Unknown scene world'));
      requested = worldId;
      if (!active(worldId)) {
        if (!currentWorld) { host.dataset.world = worldId; host.dataset.assetState = 'deferred'; }
        return Promise.resolve('deferred');
      }
      if (currentWorld === worldId && pending) return pending;
      currentWorld = worldId;
      var current = ++generation;
      host.dataset.world = worldId;
      host.dataset.assetState = 'loading';
      host.replaceChildren();
      pending = new Promise(function (resolve) {
        var image = new ImageType();
        image.alt = '';
        image.className = 'osr-scene-image';
        image.decoding = 'async';
        image.fetchPriority = 'high';
        image.onload = function () {
          if (generation !== current) return resolve('stale');
          host.replaceChildren(image);
          host.dataset.assetState = 'ready';
          resolve('ready');
        };
        image.onerror = function () {
          if (generation !== current) return resolve('stale');
          host.dataset.assetState = 'fallback';
          resolve('fallback');
        };
        image.src = world.preview || world.scene;
      });
      return pending;
    }
    function clear() {
      generation++;
      currentWorld = requested = pending = null;
      if (view) {
        doc.removeEventListener('onespace:page-changed', activate);
        doc.removeEventListener('onespace:ready', activate);
      }
      host.replaceChildren();
      host.dataset.assetState = 'empty';
      delete host.dataset.world;
    }
    return { show: show, clear: clear };
  }

  return { worlds: worlds, utilities: utilities, canonicalWorld: canonicalWorld, routePath: routePath, parseRoute: parseRoute, createShell: createShell, setActiveWorld: setActiveWorld, createSceneHost: createSceneHost };
});
