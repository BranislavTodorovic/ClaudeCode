/* Shared contracts for the reference-led eight-world UI. No domain data lives here. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OneSpaceRedesign = api;
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';

  var worlds = [
    { id: 'home', label: 'Home', scene: 'assets/scenes/home/hero-fullbleed.png', preview: 'assets/scenes/home/hero-fullbleed.jpg', modules: [] },
    { id: 'work', label: 'Work', scene: 'assets/scenes/work/hero-fullbleed.png', preview: 'assets/scenes/work/hero-fullbleed.jpg', modules: ['projects', 'kanban-board', 'team', 'documents', 'meetings', 'templates'] },
    { id: 'personal', label: 'Personal / Fitness', scene: 'assets/scenes/personal/hero-fullbleed.png', preview: 'assets/scenes/personal/hero-fullbleed.jpg', modules: ['mindfulness', 'fitness', 'nutrition', 'recovery', 'personal-life', 'home-wellbeing'] },
    { id: 'explore', label: 'Explore', scene: 'assets/scenes/explore/hero-fullbleed.png', preview: 'assets/scenes/explore/hero-fullbleed.jpg', modules: ['destinations', 'experiences', 'travel-guides', 'bucket-list', 'discover-more'] },
    { id: 'games', label: 'Games', scene: 'assets/scenes/games/hero-fullbleed.png', preview: 'assets/scenes/games/hero-fullbleed.jpg', modules: ['my-games', 'missions-quests', 'game-library', 'game-sessions', 'discover-games', 'game-settings'] },
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
    // Preserve one real footer and its original utility-page location.
    var footer = doc.querySelector && doc.querySelector('.site-footer');
    if (footer && !footer.dataset.osrIntegrated) {
      footer.dataset.osrIntegrated = 'true';
      var footerParent = footer.parentNode;
      function placeFooter() {
        var page = doc.body.dataset.page;
        var view = Array.from(doc.querySelectorAll('[data-page-when]')).find(function (el) {
          return el.getAttribute('data-page-when').split(',').indexOf(page) !== -1;
        });
        var frame = view && view.querySelector('.osr-frame');
        (frame || footerParent).appendChild(footer);
      }
      doc.addEventListener('onespace:page-changed', placeFooter);
      doc.addEventListener('onespace:ready', placeFooter);
    }
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

  /* R3 presentation only: keep existing owner nodes and APIs, without building
     the later dedicated module system or creating another domain store. */
  function createOwnerSurface(view, stage, worldId, label, existingTools) {
    var doc = view.ownerDocument, win = doc.defaultView;
    var frame = stage.querySelector('.osr-frame'), landing = frame.querySelector('main');
    var tools = existingTools || doc.createElement('section');
    if (!existingTools) Array.from(view.children).forEach(function (child) {
      if (child !== stage) tools.appendChild(child);
    });
    tools.classList.add('osr-owner-surface');
    tools.dataset.ownerWorld = worldId;
    tools.setAttribute('aria-label', label + ' tools');
    var heading = doc.createElement('div'); heading.className = 'osr-owner-heading';
    var back = doc.createElement('button'); back.type = 'button'; back.className = 'osr-button';
    back.textContent = '← Back to ' + label;
    var title = doc.createElement('h1'); title.tabIndex = -1; title.textContent = label + ' tools';
    var identity = doc.createElement('img'); identity.className = 'osr-owner-art';
    identity.alt = ''; identity.decoding = 'async'; identity.width = 112; identity.height = 64;
    identity.onerror = function () { identity.hidden = true; };
    heading.appendChild(back); heading.appendChild(title); heading.appendChild(identity); tools.prepend(heading);
    function identify(name) {
      title.textContent = name || label + ' tools';
      var slug = worldId === 'work' ? (/project/i.test(title.textContent) ? 'projects' : 'kanban-board') :
        worldId === 'personal' ? (/habit|mindful/i.test(title.textContent) ? 'mindfulness' : /routine|recovery/i.test(title.textContent) ? 'recovery' : 'personal-life') : worldId === 'home' ? 'work-review' : /destination/i.test(title.textContent) ? 'destinations' : /resource|discover/i.test(title.textContent) ? 'discover-more' : 'bucket-list';
      if (worldId === 'games') {
        slug = /weekly/i.test(title.textContent) ? 'weekly-tasks' : /mission|progress/i.test(title.textContent) ? 'missions-quests' :
          /session/i.test(title.textContent) ? 'game-sessions' : /discover|suggest/i.test(title.textContent) ? 'discover-games' :
          /setting|appearance/i.test(title.textContent) ? 'game-settings' : /journal/i.test(title.textContent) ? 'game-journal' : /overview/i.test(title.textContent) ? 'my-games' : 'game-library';
      }
      var folder = worldId === 'games' && /^(weekly-tasks|game-journal)$/.test(slug) ? 'owners' : 'portals';
      var src = 'assets/scenes/' + worldId + '/' + folder + '/' + slug + '.jpg';
      var ownerArt = { 'my-games':'overview-premium', 'game-library':'library-premium', 'missions-quests':'missions-premium', 'discover-games':'suggestions-premium', 'game-sessions':'sessions-premium', 'game-settings':'appearance-premium' };
      if (worldId === 'games' && ownerArt[slug]) src = 'assets/scenes/games/owners/' + ownerArt[slug] + '.jpg';
      if (identity.getAttribute('src') !== src) { identity.hidden = false; identity.src = src; }
      tools.dataset.ownerIdentity = slug;
    }
    var gameTabLabels = { overview:'Games overview', library:'Game Library', missions:'Missions & Quests', weekly:'Weekly Tasks', suggestions:'Discover Games', sessions:'Game Sessions', journal:'Game Journal', appearance:'Game Settings' };
    function identifyGameTab(event) {
      if (!event.target.closest('[data-gv-tab]')) return;
      var tab = tools.querySelector('[data-gv-tab][aria-selected="true"]');
      if (!tab || tab.getAttribute('aria-selected') !== 'true') return;
      identify(gameTabLabels[tab.dataset.gvTab]);
    }
    if (worldId === 'games') {
      tools.addEventListener('click', identifyGameTab);
      tools.addEventListener('keydown', function (event) {
        if (['ArrowLeft','ArrowRight','Home','End'].indexOf(event.key) !== -1) identifyGameTab(event);
      });
    }
    if (worldId === 'work') tools.addEventListener('click', function (event) {
      var control = event.target.closest('#workTracker [data-view]');
      if (!control) return;
      var names = { active:'Work board & timeline', projects:'Projects', backlog:'Work backlog', history:'Retained Work History' };
      identify(names[control.dataset.view]);
    });
    frame.appendChild(tools);
    var trigger = null, scroll = 0;
    function present(open, name, focus) {
      landing.hidden = open; tools.hidden = !open;
      stage.dataset.surface = open ? 'owner' : 'landing';
      if (win.CustomEvent) doc.dispatchEvent(new win.CustomEvent('onespace:owner-surface-changed', { detail: { world: worldId, open: open } }));
      var footer = frame.querySelector('.site-footer');
      if (footer && footer.tagName === 'FOOTER') {
        frame.appendChild(footer);
      }
      if (open) identify(name);
      if (focus) {
        win.scrollTo({ top: open ? 0 : scroll, behavior: 'instant' });
        var target = open ? title : trigger && trigger.isConnected ? trigger : landing.querySelector('h1');
        if (target) { if (!target.hasAttribute('tabindex') && target.tagName === 'H1') target.tabIndex = -1; target.focus({ preventScroll: true }); }
      }
    }
    function show(name, trackHistory) {
      if (tools.hidden) { trigger = doc.activeElement; scroll = win.scrollY; }
      present(true, name, true);
      var canonicalProjects = worldId === 'work' && doc.body.dataset.workView === 'projects';
      if (!canonicalProjects && trackHistory !== false && !(win.history.state && win.history.state.osrOwner === worldId)) {
        var state = Object.assign({}, win.history.state, { osrOwner: worldId, osrOwnerTitle: title.textContent });
        win.history.pushState(state, '', win.location.href);
      }
    }
    function reset(focus) { present(false, null, focus); }
    back.addEventListener('click', function () {
      if (worldId === 'work' && doc.body.dataset.workView === 'projects') { win.OneSpace.goToPage('work'); reset(true); }
      else if (win.history.state && win.history.state.osrOwner === worldId) win.history.back();
      else reset(true);
    });
    doc.addEventListener('onespace:page-changed', function (event) {
      if (worldId !== 'work' && event.detail.page === worldId && event.detail.previous === worldId && !tools.hidden && tools.contains(doc.activeElement)) return;
      if (event.detail.page === 'work' && worldId === 'work' && doc.body.dataset.workView === 'projects') present(true, 'Projects', false);
      else reset(false);
    });
    win.addEventListener('popstate', function () {
      if (doc.body.dataset.page !== worldId) return;
      var state = win.history.state;
      if (state && state.osrOwner === worldId) {
        var currentGameTab = worldId === 'games' && tools.querySelector('[data-gv-tab][aria-selected="true"]');
        present(true, currentGameTab ? gameTabLabels[currentGameTab.dataset.gvTab] : state.osrOwnerTitle, true);
      }
      else if (worldId === 'work' && doc.body.dataset.workView === 'projects') present(true, 'Projects', true);
      else reset(true);
    });
    reset(false);
    if (worldId === 'work' && doc.body.dataset.workView === 'projects') present(true, 'Projects', false);
    return { show: show, reset: reset, tools: tools };
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
          // Decorative light layers share the existing scene state and timers.
          // Games remains static until its separate motion acceptance step.
          if (doc && doc.createElement && ['home', 'work', 'personal', 'explore'].indexOf(worldId) !== -1) {
            var lights = { home:[2144,1540,640,'#ffad52'], work:[2508,2020,650,'#54d2ff'], personal:[2508,2220,530,'#ffe3a2'], explore:[2508,1950,470,'#8ffff1'] };
            var light = lights[worldId];
            ['practical', 'depth'].forEach(function (layer) {
              var effect = doc.createElement('span');
              effect.className = 'osr-scene-' + layer;
              effect.setAttribute('aria-hidden', 'true');
              var shape = layer === 'practical' ? '<ellipse cx="' + light[1] + '" cy="' + light[2] + '" rx="330" ry="220" fill="url(#light)"/>' : '<ellipse cx="' + (light[1]-120) + '" cy="1110" rx="660" ry="250" fill="url(#light)"/>';
              var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + light[0] + ' 1254"><defs><radialGradient id="light"><stop stop-color="' + light[3] + '"/><stop offset="1" stop-color="' + light[3] + '" stop-opacity="0"/></radialGradient></defs>' + shape + '</svg>';
              effect.style.backgroundImage = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
              host.appendChild(effect);
            });
          }
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

  return { worlds: worlds, utilities: utilities, canonicalWorld: canonicalWorld, routePath: routePath, parseRoute: parseRoute, createShell: createShell, setActiveWorld: setActiveWorld, createSceneHost: createSceneHost, createOwnerSurface: createOwnerSurface };
});
