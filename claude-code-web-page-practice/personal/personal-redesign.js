/* R3 Personal / Fitness main world. Existing Personal records remain authoritative. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? null : window, function (root) {
  'use strict';
  function buildModel(snapshot) {
    function records(value) { return (Array.isArray(value) ? value : []).filter(function (item) { return item && typeof item.text === 'string' && item.text.trim(); }); }
    var goals = records(snapshot.goals), routines = records(snapshot.routines), habits = records(snapshot.habits);
    var groups = [
      { label: 'Goals', records: goals },
      { label: 'Routines', records: routines },
      { label: 'Habits', records: habits }
    ].map(function (group) {
      return { label: group.label, done: group.records.filter(function (item) { return item.done; }).length, total: group.records.length };
    });
    return {
      goals: goals, routines: routines, habits: habits, groups: groups,
      total: groups.reduce(function (sum, group) { return sum + group.total; }, 0),
      done: groups.reduce(function (sum, group) { return sum + group.done; }, 0)
    };
  }
  if (!root || !root.document || !root.OneSpaceRedesign || !root.OneSpace) return { buildModel: buildModel };
  var doc = root.document, OS = root.OneSpace, foundation = root.OneSpaceRedesign;
  var view = doc.getElementById('personalView'), stage = doc.getElementById('redesignPersonal');
  if (!view || !stage) return {};
  view.classList.add('redesign-personal');
  var sceneHost = doc.createElement('div');
  stage.appendChild(sceneHost);
  foundation.createSceneHost(sceneHost).show('personal');
  var frame = doc.createElement('div');
  frame.className = 'osr-frame';
  stage.appendChild(frame);

  function notice(message) {
    var el = doc.getElementById('osrPersonalNotice');
    el.textContent = message;
    el.hidden = false;
  }
  function go(page, targetId) {
    if (!OS.goToPage(page)) { notice('Could not open that space. Your current page is unchanged.'); return false; }
    if (targetId) {
      var target = doc.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        var focusTarget = target.matches('input, textarea, select, button, a') ? target : target.querySelector('input, textarea, select, button, a') || target;
        if (focusTarget === target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
      }
    }
    return true;
  }
  var shell = foundation.createShell(doc, {
    onNavigate: function (event, world) {
      event.preventDefault();
      if (world === 'projects-notes') { notice('Projects & Notes is being prepared. Projects remain in Work and notes remain in Quick Notes.'); return; }
      go(world);
    },
    onUtility: function (utility) {
      if (utility === 'today') go('productivity', 'taskInput');
      else if (utility === 'command') doc.getElementById('paletteHint').click();
      else go(utility);
    }
  });
  foundation.setActiveWorld(shell, 'personal');
  frame.appendChild(shell);
  frame.insertAdjacentHTML('beforeend',
    '<main class="osr-personal-main">' +
      '<section class="osr-personal-hero" aria-labelledby="osrPersonalTitle">' +
        '<p class="osr-context" id="osrPersonalDate">Your personal space</p>' +
        '<h1 class="osr-title" id="osrPersonalTitle">A calmer, stronger you.</h1>' +
        '<p class="osr-lead">Move well. Eat well. Feel balanced. Right here, in your space.</p>' +
        '<form class="osr-search osr-personal-search" id="osrPersonalSearchForm"><label class="visually-hidden" for="osrPersonalSearch">Search your goals, routines and habits</label>' + OS.iconSvg('search') + '<input id="osrPersonalSearch" maxlength="80" placeholder="Find a goal, routine, or habit…" autocomplete="off"><button type="submit" class="osr-button">Search personal →</button></form>' +
        '<p class="osr-capture-hint">Saved on this device · <button type="button" id="osrPersonalCommand">Ctrl + K for commands</button></p>' +
        '<div class="osr-quick-actions" aria-label="Personal quick actions"><button class="osr-chip" type="button" data-personal-action="workout">' + OS.iconSvg('target') + 'Start a workout</button><button class="osr-chip" type="button" data-personal-action="meditate">' + OS.iconSvg('heart') + 'Meditate now</button><button class="osr-chip" type="button" data-personal-action="meal">' + OS.iconSvg('plus') + 'Log a meal</button><button class="osr-chip" type="button" data-personal-action="plan">' + OS.iconSvg('calendaricon') + 'Plan my day</button><button class="osr-chip" type="button" data-personal-action="habit">' + OS.iconSvg('repeat') + 'Track a habit</button></div>' +
        '<p class="osr-action-notice" id="osrPersonalNotice" role="status" hidden></p>' +
      '</section>' +
      '<section class="osr-personal-summary osr-summary-grid osr-grid" aria-label="Personal at a glance">' +
        '<article class="osr-panel osr-personal-wellness"><div class="osr-card-head"><h2>Today’s Wellness</h2><button class="osr-card-arrow" type="button" data-personal-action="personal-life" aria-label="Open personal tools">↗</button></div><div class="osr-personal-wellness-content"><div class="osr-personal-wellness-ring"><strong id="osrPersonalDone">0/0</strong><span>Personal items done</span></div><div class="osr-personal-components" id="osrPersonalComponents"></div></div></article>' +
        '<article class="osr-panel osr-personal-plan"><div class="osr-card-head"><h2>Today’s Plan</h2><button class="osr-card-arrow" type="button" data-personal-action="plan" aria-label="Open daily planner">↗</button></div><p class="osr-personal-context">Untimed personal routines</p><div class="osr-personal-rows" id="osrPersonalPlanRows"><p class="osr-empty">No routines yet. Add one in your Personal tools.</p></div></article>' +
        '<article class="osr-panel osr-personal-habits"><div class="osr-card-head"><h2>Habits &amp; Goals</h2><button class="osr-card-arrow" type="button" data-personal-action="habit" aria-label="Open habits">↗</button></div><div class="osr-personal-rows" id="osrPersonalHabitRows"><p class="osr-empty">Your saved habits and goals will appear here.</p></div></article>' +
        '<article class="osr-panel osr-personal-recovery"><div class="osr-card-head"><h2>Health &amp; Recovery</h2></div><div class="osr-personal-recovery-state">' + OS.iconSvg('heart') + '<strong>Your recovery, when you’re ready</strong><p>No health or recovery metrics are connected. Manual recovery logging is coming in the Personal rollout.</p></div></article>' +
      '</section>' +
      '<section class="osr-personal-portals" aria-label="Personal spaces"><div class="osr-grid osr-portal-grid" id="osrPersonalPortalGrid"></div></section>' +
      '<section class="osr-personal-followon" id="osrPersonalFollowon" aria-labelledby="osrPersonalToolsTitle"><h2 id="osrPersonalToolsTitle">Your Personal tools</h2><p>Manage your goals, routines and habits below.</p></section>' +
    '</main>');

  var portals = [
    { slug: 'mindfulness', label: 'Mindfulness', subtitle: 'Sessions coming in the next rollout.' },
    { slug: 'fitness', label: 'Fitness', subtitle: 'Workouts coming in the next rollout.' },
    { slug: 'nutrition', label: 'Nutrition', subtitle: 'Meal logging coming in the next rollout.' },
    { slug: 'recovery', label: 'Recovery', subtitle: 'Recovery logging coming in the next rollout.' },
    { slug: 'personal-life', label: 'Personal Life', subtitle: 'Goals, routines, habits.', available: true },
    { slug: 'home-wellbeing', label: 'Home Wellbeing', subtitle: 'Coming in the next rollout.' }
  ];
  var portalGrid = doc.getElementById('osrPersonalPortalGrid');
  portals.forEach(function (portal) {
    var tile = doc.createElement('div');
    tile.className = 'osr-portal osr-personal-portal';
    tile.dataset.portal = portal.slug;
    tile.innerHTML = '<img src="assets/scenes/personal/portals/' + portal.slug + '.jpg" alt="" loading="eager" decoding="sync"><div class="osr-portal-copy"><strong>' + portal.label + '</strong><small>' + portal.subtitle + '</small></div>';
    var image = tile.querySelector('img');
    image.addEventListener('load', function () { tile.dataset.assetState = 'ready'; });
    image.addEventListener('error', function () { tile.dataset.assetState = 'fallback'; image.remove(); });
    var action = doc.createElement('button');
    action.type = 'button';
    action.dataset.personalPortal = portal.slug;
    action.className = 'osr-portal-action';
    action.innerHTML = OS.iconSvg('external');
    action.setAttribute('aria-label', portal.available ? 'Open ' + portal.label : portal.label + ' availability');
    tile.appendChild(action);
    portalGrid.appendChild(tile);
  });

  function snapshot() {
    return {
      goals: OS.safeGetJSON('orbit-personal-goals', []),
      routines: OS.safeGetJSON('orbit-personal-routines', []),
      habits: OS.safeGetJSON('orbit-personal-habits', [])
    };
  }
  function row(item, kind, detail) {
    return '<button type="button" class="osr-personal-row" data-personal-kind="' + kind + '" data-personal-id="' + OS.escapeHtml(item.id || '') + '"><span class="osr-personal-check ' + (item.done ? 'is-done' : '') + '" aria-hidden="true">' + (item.done ? '✓' : '') + '</span><span><strong>' + OS.escapeHtml(item.text) + '</strong><small>' + OS.escapeHtml(detail) + '</small></span></button>';
  }
  function render() {
    var model = buildModel(snapshot());
    doc.getElementById('osrPersonalDone').textContent = model.done + '/' + model.total;
    doc.querySelector('.osr-personal-wellness-ring').style.setProperty('--progress', model.total ? Math.round(model.done / model.total * 100) + '%' : '0%');
    doc.getElementById('osrPersonalComponents').innerHTML = model.groups.map(function (group) {
      var progress = group.total ? Math.round(group.done / group.total * 100) : 0;
      return '<div class="osr-personal-component"><span>' + group.label + '</span><strong>' + group.done + '/' + group.total + '</strong><i style="--progress:' + progress + '%"></i></div>';
    }).join('');
    doc.getElementById('osrPersonalPlanRows').innerHTML = model.routines.length ? model.routines.slice(0, 4).map(function (item) { return row(item, 'routine', item.done ? 'Completed routine' : 'Untimed routine'); }).join('') + (model.routines.length > 4 ? '<button type="button" class="osr-inline-link" data-personal-action="routine">View all routines →</button>' : '') : '<p class="osr-empty">No routines yet. Add one in your Personal tools.</p><button type="button" class="osr-inline-link" data-personal-action="routine">Add a routine →</button>';
    var habitsAndGoals = model.habits.map(function (item) { return { item: item, kind: 'habit' }; }).concat(model.goals.map(function (item) { return { item: item, kind: 'goal' }; }));
    doc.getElementById('osrPersonalHabitRows').innerHTML = habitsAndGoals.length ? habitsAndGoals.slice(0, 4).map(function (entry) {
      var item = entry.item, detail = entry.kind === 'habit' ? (item.frequency ? item.frequency + ' habit' : 'Habit') + (item.target ? ' · target ' + item.target : '') : 'Goal';
      return row(item, entry.kind, detail);
    }).join('') + (habitsAndGoals.length > 4 ? '<button type="button" class="osr-inline-link" data-personal-action="habit">View all habits and goals →</button>' : '') : '<p class="osr-empty">Your saved habits and goals will appear here.</p><button type="button" class="osr-inline-link" data-personal-action="habit">Track a habit →</button>';
    doc.getElementById('osrPersonalDate').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()) + ' · Your personal space';
  }
  function focusPersonal(kind, id) {
    if (!go('personal')) return false;
    var listId = kind === 'goal' ? 'personalGoalsList' : kind === 'routine' ? 'personalRoutinesList' : 'personalHabitsList';
    var control = Array.from(doc.querySelectorAll('#' + listId + ' [data-toggle]')).find(function (node) { return node.dataset.toggle === id; });
    if (!control) { notice('That personal item is no longer available.'); return false; }
    control.scrollIntoView({ block: 'center' });
    control.focus({ preventScroll: true });
    return true;
  }
  stage.addEventListener('click', function (event) {
    var record = event.target.closest('[data-personal-id]');
    if (record) { focusPersonal(record.dataset.personalKind, record.dataset.personalId); return; }
    var portal = event.target.closest('[data-personal-portal]');
    if (portal) {
      if (portal.dataset.personalPortal === 'personal-life') go('personal', 'personalGoalInput');
      else notice(portal.dataset.personalPortal.replace(/-/g, ' ').replace(/^./, function (letter) { return letter.toUpperCase(); }) + ' is coming in the Personal submodule rollout. Your saved goals, routines and habits remain available below.');
      return;
    }
    var action = event.target.closest('[data-personal-action]');
    if (!action) return;
    switch (action.dataset.personalAction) {
      case 'plan': go('productivity', 'taskInput'); break;
      case 'habit': go('personal', 'personalHabitInput'); break;
      case 'routine': go('personal', 'personalRoutineInput'); break;
      case 'personal-life': go('personal', 'personalGoalInput'); break;
      case 'workout': notice('Workout sessions are coming in the Fitness submodule. Your saved Personal items remain available below.'); break;
      case 'meditate': notice('Guided meditation sessions are coming in the Mindfulness submodule.'); break;
      case 'meal': notice('Meal logging is coming in the Nutrition submodule.'); break;
    }
  });
  doc.getElementById('osrPersonalSearchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var input = doc.getElementById('osrPersonalSearch'), query = input.value.trim().toLowerCase();
    if (!query) { notice('Enter a goal, routine or habit to search.'); input.focus(); return; }
    var model = buildModel(snapshot());
    var groups = [{ kind: 'goal', records: model.goals }, { kind: 'routine', records: model.routines }, { kind: 'habit', records: model.habits }];
    var match = null;
    groups.some(function (group) { var item = group.records.find(function (entry) { return entry.text.toLowerCase().includes(query); }); if (item) { match = { kind: group.kind, id: item.id }; return true; } return false; });
    if (!match) { notice('No saved Personal item matches that search.'); input.focus(); return; }
    focusPersonal(match.kind, match.id);
  });
  doc.getElementById('osrPersonalCommand').addEventListener('click', function () { doc.getElementById('paletteHint').click(); });
  doc.addEventListener('onespace:data-changed', function (event) { if (['orbit-personal-goals', 'orbit-personal-routines', 'orbit-personal-habits'].includes(event.detail.key)) render(); });
  doc.addEventListener('onespace:page-changed', function (event) { if (event.detail.page === 'personal') render(); });
  render();
  return { buildModel: buildModel, portals: portals.map(function (portal) { return portal.slug; }) };
});
