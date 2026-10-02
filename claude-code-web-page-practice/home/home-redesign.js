/* Reference-led Home. Work, Notes, Productivity and Shortcuts remain canonical owners. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? null : window, function (root) {
  'use strict';

  function dayKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function buildModel(snapshot, now) {
    now = now || new Date();
    var tasks = Array.isArray(snapshot.tasks) ? snapshot.tasks.filter(function (task) { return task && typeof task.text === 'string' && task.text.trim(); }) : [];
    var projects = Array.isArray(snapshot.projects) ? snapshot.projects.filter(function (project) { return project && project.status !== 'done'; }) : [];
    var notes = Array.isArray(snapshot.notes) ? snapshot.notes : [];
    var countdowns = Array.isArray(snapshot.countdowns) ? snapshot.countdowns : [];
    var today = dayKey(now);
    var open = tasks.filter(function (task) { return !task.done; });
    var priority = { high: 0, normal: 1, low: 2 };
    open.sort(function (a, b) { return (priority[a.priority] ?? 1) - (priority[b.priority] ?? 1); });
    var upcoming = [];
    open.forEach(function (task) {
      var due = task.due || task.date;
      if (typeof due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(due) && due > today) upcoming.push({ title: task.text, date: due, kind: 'task' });
    });
    countdowns.forEach(function (entry) {
      if (entry && typeof entry.name === 'string' && typeof entry.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && entry.date >= today) upcoming.push({ title: entry.name, date: entry.date, kind: 'date' });
    });
    upcoming.sort(function (a, b) { return a.date.localeCompare(b.date) || a.title.localeCompare(b.title); });
    var todayTasks = open.filter(function (task) { var due = task.due || task.date; return !due || due <= today; });
    return { today: today, tasks: open, todayTasks: todayTasks.slice(0, 3), todayCount: todayTasks.length, upcoming: upcoming.slice(0, 2), upcomingCount: upcoming.length, projects: projects, notes: notes, completedTasks: tasks.length - open.length, totalTasks: tasks.length };
  }

  if (!root || !root.document || !root.OneSpaceRedesign || !root.OneSpace) return { buildModel: buildModel, dayKey: dayKey };
  var doc = root.document, OS = root.OneSpace, foundation = root.OneSpaceRedesign;
  var homeView = doc.getElementById('homeView'), stage = doc.getElementById('redesignHome');
  if (!homeView || !stage) return { buildModel: buildModel, dayKey: dayKey };
  var esc = OS.escapeHtml;
  var sceneHost = doc.createElement('div');
  stage.appendChild(sceneHost);
  var scene = foundation.createSceneHost(sceneHost);
  scene.show('home');
  var frame = doc.createElement('div');
  frame.className = 'osr-frame';
  stage.appendChild(frame);

  function oldPage(world) {
    return OS.goToPage(world);
  }
  function go(world, focusId) {
    if (!oldPage(world)) { OS.showToast('Could not open that space. Your current page is unchanged.'); return false; }
    if (focusId) { var target = doc.getElementById(focusId); if (target) target.focus({ preventScroll: true }); }
    return true;
  }
  var shell = foundation.createShell(doc, {
    onNavigate: function (event, world) {
      event.preventDefault();
      if (world === 'projects-notes') { showNotice('Projects & Notes is being prepared. Your projects remain in Work and your notes remain in Quick Notes.'); return; }
      go(world);
    },
    onUtility: function (utility) {
      if (utility === 'today') go('productivity', 'taskInput');
      if (utility === 'shortcuts') go('shortcuts');
      if (utility === 'notes') go('notes');
      if (utility === 'command') doc.getElementById('paletteHint').click();
    }
  });
  foundation.setActiveWorld(shell, 'home');
  frame.appendChild(shell);
  frame.insertAdjacentHTML('beforeend',
    '<main class="osr-home-main">' +
      '<section class="osr-home-hero" aria-labelledby="osrHomeTitle">' +
        '<p class="osr-context" id="osrHomeDate"></p>' +
        '<h1 class="osr-title" id="osrHomeTitle">A more intentional day starts here.</h1>' +
        '<p class="osr-lead">A calmer day. A brighter you.</p>' +
        '<form class="osr-search osr-capture" id="osrCaptureForm">' +
          '<label class="visually-hidden" for="osrCaptureInput">Quick Capture text</label>' +
          '<input id="osrCaptureInput" maxlength="500" placeholder="Capture a thought or task…" autocomplete="off">' +
          '<label class="visually-hidden" for="osrCaptureKind">Capture as</label>' +
          '<select id="osrCaptureKind" aria-label="Capture as"><option value="note">Note</option><option value="task">Task</option></select>' +
          '<button type="submit" class="osr-button osr-button-primary">Capture</button>' +
        '</form>' +
        '<p class="osr-capture-hint">Private on this device · <button type="button" id="osrCommandHint">Ctrl + K for commands</button></p>' +
        '<div class="osr-quick-actions" aria-label="Home quick actions">' +
          '<button class="osr-chip" type="button" data-osr-action="plan">Plan my day</button>' +
          '<button class="osr-chip" type="button" data-osr-action="brainstorm">Brainstorm ideas</button>' +
          '<button class="osr-chip" type="button" data-osr-action="progress">Track my progress</button>' +
          '<button class="osr-chip" type="button" data-osr-action="explore">Find a place to visit</button>' +
        '</div>' +
        '<p class="osr-action-notice" id="osrHomeNotice" role="status" hidden></p>' +
      '</section>' +
      '<section class="osr-home-summary osr-summary-grid osr-grid" aria-label="Your day at a glance">' +
        '<article class="osr-panel osr-now"><div class="osr-card-head"><h2>Now</h2><button type="button" class="osr-card-arrow" data-osr-action="focus" aria-label="Open focus timer">↗</button></div><div id="osrNowBody"></div></article>' +
        '<article class="osr-panel osr-today"><div class="osr-card-head"><h2>Today <span id="osrTodayCount"></span></h2><button type="button" class="osr-card-arrow" data-osr-action="add-task" aria-label="Add task">+</button></div><div id="osrTodayBody"></div></article>' +
        '<article class="osr-panel osr-next"><div class="osr-card-head"><h2>Next <span id="osrNextCount"></span></h2><button type="button" class="osr-card-arrow" data-osr-action="next" aria-label="Open upcoming dates">↗</button></div><div id="osrNextBody"></div></article>' +
        '<article class="osr-panel osr-pulse"><div class="osr-card-head"><h2>OneSpace Pulse</h2><button type="button" class="osr-card-arrow" data-osr-action="pulse" aria-label="Open your local activity summary">↗</button></div><div id="osrPulseBody"></div></article>' +
      '</section>' +
      '<section class="osr-home-portals" aria-labelledby="osrPortalsTitle"><h2 class="visually-hidden" id="osrPortalsTitle">Explore your worlds</h2><div class="osr-grid osr-portal-grid" id="osrPortalGrid"></div></section>' +
      '<section class="osr-home-followon" id="osrHomeFollowon" aria-label="Your local OneSpace tools"></section>' +
    '</main>');

  var support = doc.getElementById('osrHomeFollowon');
  [['homeOverview', 'Your records'], ['favoritesSection', 'Quick Access'], ['home-search', 'Search']].forEach(function (entry) {
    var element = entry[0] === 'home-search' ? homeView.querySelector('.home-search') : doc.getElementById(entry[0]);
    if (element) support.appendChild(element);
  });
  support.remove();
  var ownerSurface = foundation.createOwnerSurface(homeView, stage, 'home', 'Home', support);
  homeView.classList.add('redesign-home');
  stage.hidden = false;

  var portals = [
    { label: 'Work', subtitle: 'Focus. Create. Ship.', world: 'work' },
    { label: 'Personal / Fitness', subtitle: 'A healthier, stronger you.', world: 'personal' },
    { label: 'Discover', subtitle: 'Explore. Learn. Be inspired.', world: 'explore' },
    { label: 'Media & Games', subtitle: 'Two worlds for your downtime.', world: 'media-games' },
    { label: 'Projects & Notes', subtitle: 'World in preparation · your records remain safe.', world: 'projects-notes' },
    { label: 'Settings', subtitle: 'Make it yours.', world: 'settings' }
  ];
  var portalGrid = doc.getElementById('osrPortalGrid');
  portals.forEach(function (portal) {
    var world = portal.world === 'media-games' ? 'movies' : portal.world;
    var sceneAsset = foundation.worlds.find(function (entry) { return entry.id === world; });
    var image = sceneAsset.preview || sceneAsset.scene;
    var tile = doc.createElement('div');
    tile.className = 'osr-portal osr-home-portal';
    tile.innerHTML = '<img src="' + image + '" alt="" loading="lazy" decoding="async"><div class="osr-portal-copy"><strong>' + esc(portal.label) + '</strong><small>' + esc(portal.subtitle) + '</small></div>';
    var art = tile.querySelector('img');
    art.addEventListener('load', function () { tile.dataset.assetState = 'ready'; });
    art.addEventListener('error', function () { tile.dataset.assetState = 'fallback'; art.remove(); });
    if (portal.world === 'media-games') {
      tile.classList.add('osr-media-portal');
      var actions = doc.createElement('div');
      actions.className = 'osr-media-actions';
      actions.innerHTML = '<button type="button" data-osr-world="games">Games</button><button type="button" data-osr-world="movies">Movies &amp; Series</button>';
      tile.appendChild(actions);
    } else {
      var action = doc.createElement('button');
      action.type = 'button';
      action.className = 'osr-portal-action';
      action.dataset.osrWorld = portal.world;
      action.setAttribute('aria-label', (portal.world === 'projects-notes' ? 'Projects & Notes status' : 'Open ' + portal.label));
      tile.appendChild(action);
    }
    portalGrid.appendChild(tile);
  });

  function showNotice(message) {
    root.OneSpaceUI.open('OneSpace', '<p>' + esc(message) + '</p>', null);
  }
  function snapshot() {
    return {
      tasks: OS.safeGetJSON('orbit-tasks', []),
      projects: OS.safeGetJSON('orbit-work-projects', []),
      notes: OS.safeGetJSON('orbit-notes-list', []),
      countdowns: OS.safeGetJSON('orbit-countdowns', [])
    };
  }
  function render() {
    var model = buildModel(snapshot(), new Date());
    doc.getElementById('osrTodayCount').textContent = model.todayCount + (model.todayCount === 1 ? ' priority' : ' priorities');
    doc.getElementById('osrTodayBody').innerHTML = model.todayTasks.length ? model.todayTasks.map(function (task) {
      var due = task.due || task.date;
      return '<button type="button" class="osr-summary-row" data-osr-action="tasks"><span class="osr-status-dot" aria-hidden="true"></span><span><strong>' + esc(task.text) + '</strong><small>' + (due ? 'Due ' + esc(due) : 'No time set') + '</small></span></button>';
    }).join('') : '<p class="osr-empty">No tasks due or queued today. Add one small next step.</p>';
    doc.getElementById('osrNextCount').textContent = model.upcomingCount + (model.upcomingCount === 1 ? ' upcoming' : ' upcoming');
    doc.getElementById('osrNextBody').innerHTML = model.upcoming.length ? model.upcoming.map(function (item) {
      return '<button type="button" class="osr-summary-row" data-osr-action="next"><span class="osr-row-icon" aria-hidden="true">' + (item.kind === 'date' ? '◇' : '✓') + '</span><span><strong>' + esc(item.title) + '</strong><small>' + esc(item.date) + '</small></span></button>';
    }).join('') : '<p class="osr-empty">Nothing dated next. Add an important date in Productivity.</p>';
    doc.getElementById('osrPulseBody').innerHTML = '<p class="osr-pulse-caption">A transparent view of your saved local activity</p><div class="osr-pulse-bars" aria-hidden="true"><i style="--bar:' + Math.min(100, model.tasks.length * 10) + '%"></i><i style="--bar:' + Math.min(100, model.projects.length * 16) + '%"></i><i style="--bar:' + Math.min(100, model.notes.length * 12) + '%"></i></div><div class="osr-pulse-metrics"><span><strong>' + model.tasks.length + '</strong>Open tasks</span><span><strong>' + model.projects.length + '</strong>Active projects</span><span><strong>' + model.notes.length + '</strong>Saved notes</span></div>';
    tick();
  }
  function tick() {
    var now = new Date();
    doc.getElementById('osrHomeDate').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(now) + ' · Your local space';
    var hour = now.getHours();
    var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    doc.getElementById('osrHomeTitle').textContent = greeting + '.';
    var focus = doc.getElementById('focusTime');
    var status = doc.getElementById('focusStatus');
    var running = doc.getElementById('focusStart').getAttribute('aria-pressed') === 'true';
    var time = focus ? focus.textContent : '25:00';
    var nowBody = doc.getElementById('osrNowBody');
    if (!nowBody.firstElementChild) nowBody.innerHTML = '<div class="osr-timer-ring"><strong data-osr-time></strong><span data-osr-timer-status></span></div><div class="osr-now-copy"><strong data-osr-focus-title></strong><p data-osr-focus-description></p><button type="button" class="osr-inline-link" data-osr-action="focus">Open timer →</button></div>';
    nowBody.querySelector('[data-osr-time]').textContent = time;
    nowBody.querySelector('[data-osr-timer-status]').textContent = running ? 'Focus running' : status && status.textContent === 'Paused' ? 'Paused' : 'Ready to focus';
    nowBody.querySelector('[data-osr-focus-title]').textContent = running ? 'Your focus session is active' : 'A moment for focused work';
    nowBody.querySelector('[data-osr-focus-description]').textContent = running ? 'Continue in Productivity to pause or reset.' : 'Start or adjust your local timer in Productivity.';
  }
  function capture(event) {
    event.preventDefault();
    var input = doc.getElementById('osrCaptureInput');
    var value = input.value.trim();
    if (!value) { showNotice('Write a thought or task first.'); input.focus(); return; }
    var kind = doc.getElementById('osrCaptureKind').value;
    var key = kind === 'task' ? 'orbit-tasks' : 'orbit-notes-list';
    var before = OS.safeGetJSON(key, []).length;
    var target = doc.getElementById(kind === 'task' ? 'taskInput' : 'notesNewBody');
    var form = doc.getElementById(kind === 'task' ? 'taskForm' : 'notesNewForm');
    target.value = value;
    form.requestSubmit();
    if (OS.safeGetJSON(key, []).length > before) {
      input.value = '';
      showNotice(kind === 'task' ? 'Task captured in Productivity.' : 'Thought captured in Quick Notes.');
      render();
    } else showNotice('Could not save. Your draft is still here; please try again.');
  }
  doc.getElementById('osrCaptureForm').addEventListener('submit', capture);
  doc.getElementById('osrCommandHint').addEventListener('click', function () { doc.getElementById('paletteHint').click(); });
  stage.addEventListener('click', function (event) {
    var worldButton = event.target.closest('[data-osr-world]');
    if (worldButton) {
      var world = worldButton.dataset.osrWorld;
      if (world === 'projects-notes') showNotice('Projects & Notes is being prepared. Your projects remain in Work and your notes remain in Quick Notes.');
      else go(world);
      return;
    }
    var action = event.target.closest('[data-osr-action]');
    if (!action) return;
    switch (action.dataset.osrAction) {
      case 'plan': case 'add-task': case 'tasks': go('productivity', 'taskInput'); break;
      case 'focus': go('productivity', 'focusStart'); break;
      case 'brainstorm': go('notes', 'notesNewBody'); break;
      case 'progress': go('work'); break;
      case 'explore': go('explore'); break;
      case 'next': go('productivity', 'countdownName'); break;
      case 'pulse': ownerSurface.show('Your local activity & Quick Access'); break;
    }
  });
  doc.addEventListener('onespace:data-changed', render);
  doc.addEventListener('onespace:page-changed', function (event) {
    if (event.detail.page === 'home') { foundation.setActiveWorld(shell, 'home'); render(); }
  });
  var applyingHistory = false;
  function hashForPage(page) {
    if (['shortcuts', 'productivity', 'notes'].indexOf(page) !== -1) return foundation.routePath({ utility: page });
    if (page === 'work' && doc.body.dataset.workView === 'projects') return foundation.routePath({ world: 'work', module: 'projects' });
    return foundation.routePath({ world: page }) || foundation.routePath({ world: 'home' });
  }
  function applyHashRoute() {
    var route = foundation.parseRoute(root.location.hash);
    applyingHistory = true;
    function openRoutePage(page) {
      if (oldPage(page)) return true;
      OS.showToast('Could not save that page change. Your current page is unchanged.');
      root.history.replaceState(null, '', hashForPage(doc.body.dataset.page));
      return false;
    }
    try {
      if (!route) {
        if (doc.body.dataset.page !== 'home' && !openRoutePage('home')) return;
        showNotice('That OneSpace address is unavailable. You are safely back at Home.');
        root.history.replaceState(null, '', hashForPage('home'));
        return;
      }
      if (route.utility === 'command') { doc.getElementById('paletteHint').click(); return; }
      if (route.utility === 'today') { if (doc.body.dataset.page !== 'productivity') openRoutePage('productivity'); return; }
      if (route.utility) { if (doc.body.dataset.page !== route.utility) openRoutePage(route.utility); return; }
      if (route.world === 'projects-notes') {
        if (doc.body.dataset.page !== 'home' && !openRoutePage('home')) return;
        showNotice('Projects & Notes is being prepared. Work Projects and Quick Notes remain available.');
        return;
      }
      if (route.module && (route.world !== 'work' || route.module !== 'projects' || route.recordId != null)) {
        var parent = route.world === 'work' && route.module === 'projects' ? 'projects' : route.world;
        if (!openRoutePage(parent)) return;
        OS.showToast('That subspace is being prepared. Showing its available parent space.');
        root.history.replaceState(null, '', hashForPage(doc.body.dataset.page));
        return;
      }
      var target = route.world === 'work' && route.module === 'projects' ? 'projects' : route.world;
      if (doc.body.dataset.page !== route.world || (route.world === 'work' && (doc.body.dataset.workView === 'projects') !== (route.module === 'projects'))) openRoutePage(target);
    } finally { applyingHistory = false; }
  }
  doc.addEventListener('onespace:page-changed', function (event) {
    if (applyingHistory) return;
    var hash = hashForPage(event.detail.page);
    if (root.location.hash !== hash) root.history.pushState(null, '', hash);
  });
  doc.addEventListener('click', function (event) {
    if (applyingHistory || doc.body.dataset.page !== 'work' || !event.target.closest('#workTracker [data-view]')) return;
    var hash = hashForPage('work');
    if (root.location.hash !== hash) root.history.pushState(null, '', hash);
  });
  root.addEventListener('popstate', applyHashRoute);
  root.addEventListener('hashchange', applyHashRoute);
  if (root.location.hash) applyHashRoute();
  else root.history.replaceState(null, '', hashForPage(doc.body.dataset.page));
  render();
  var clock = root.setInterval(function () { if (doc.body.dataset.page === 'home' && !doc.hidden) tick(); }, 1000);
  root.addEventListener('pagehide', function () { root.clearInterval(clock); scene.clear(); }, { once: true });
  return { buildModel: buildModel, dayKey: dayKey };
});
