/* R3 Work world. Work records stay with the existing Work owner. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? null : window, function (root) {
  'use strict';

  function dateKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function buildModel(snapshot, now, tab) {
    now = now || new Date();
    var items = Array.isArray(snapshot.items) ? snapshot.items : [];
    var tasks = (Array.isArray(snapshot.tasks) ? snapshot.tasks : []).filter(function (task) { return task && typeof task.title === 'string' && task.title.trim(); });
    var projects = (Array.isArray(snapshot.projects) ? snapshot.projects : []).filter(function (project) { return project && typeof project.name === 'string' && project.name.trim(); });
    var today = dateKey(now);
    var mondayOffset = (now.getDay() + 6) % 7;
    var weekStart = dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset));
    var weekEnd = dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6 - mondayOffset));
    var filtered = tasks.filter(function (task) {
      if (tab === 'all') return true;
      if (typeof task.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) return false;
      return tab === 'today' ? task.dueDate <= today : task.dueDate >= weekStart && task.dueDate <= weekEnd;
    });
    var activeProjects = projects.filter(function (project) { return project.status !== 'done'; });
    var activeItems = items.filter(function (item) { return item && item.status !== 'closed'; });
    return {
      tasks: filtered,
      taskDone: filtered.filter(function (task) { return task.done; }).length,
      taskTotal: filtered.length,
      allTaskTotal: tasks.length,
      allOpenTaskCount: tasks.filter(function (task) { return !task.done; }).length,
      items: items,
      activeItems: activeItems,
      projects: activeProjects,
      today: today,
      reminders: activeItems.filter(function (item) { return typeof item.reminderAt === 'string' && item.reminderAt.slice(0, 10) === today; }).sort(function (a, b) { return a.reminderAt.localeCompare(b.reminderAt); })
    };
  }

  if (!root || !root.document || !root.OneSpaceRedesign || !root.OneSpace) return { buildModel: buildModel, dateKey: dateKey };
  var doc = root.document, OS = root.OneSpace, foundation = root.OneSpaceRedesign;
  var view = doc.getElementById('workView'), stage = doc.getElementById('redesignWork');
  if (!view || !stage) return { buildModel: buildModel, dateKey: dateKey };
  view.classList.add('redesign-work');
  var esc = OS.escapeHtml, currentTab = 'today';
  var sceneHost = doc.createElement('div');
  stage.appendChild(sceneHost);
  foundation.createSceneHost(sceneHost).show('work');
  var frame = doc.createElement('div');
  frame.className = 'osr-frame';
  stage.appendChild(frame);

  function notice(message) {
    var el = doc.getElementById('osrWorkNotice');
    el.textContent = message;
    el.hidden = false;
  }
  function go(page, targetId) {
    if (!OS.goToPage(page)) { notice('Could not open that space. Your current page is unchanged.'); return false; }
    if (page === 'projects' || page === 'work' && targetId) ownerSurface.show(page === 'projects' ? 'Projects' : 'Work board & timeline');
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
  foundation.setActiveWorld(shell, 'work');
  frame.appendChild(shell);
  frame.insertAdjacentHTML('beforeend',
    '<main class="osr-work-main">' +
      '<section class="osr-work-hero" aria-labelledby="osrWorkTitle">' +
        '<p class="osr-context" id="osrWorkDate"></p>' +
        '<h1 class="osr-title" id="osrWorkTitle">Build with intention.</h1>' +
        '<p class="osr-lead">Focus today. Create tomorrow.</p>' +
        '<form class="osr-search osr-work-search" id="osrWorkSearchForm"><label class="visually-hidden" for="osrWorkSearch">Search your Work items</label>' + OS.iconSvg('search') + '<input id="osrWorkSearch" maxlength="160" placeholder="Search your work items…" autocomplete="off"><button type="submit" class="osr-button">Search work →</button></form>' +
        '<p class="osr-capture-hint">Saved on this device · <button type="button" id="osrWorkCommand">Ctrl + K for commands</button></p>' +
        '<div class="osr-quick-actions" aria-label="Work quick actions"><button class="osr-chip" type="button" data-work-redesign="new-task" aria-expanded="false" aria-controls="osrWorkTaskChooser">' + OS.iconSvg('plus') + 'New task</button><button class="osr-chip" type="button" data-work-redesign="new-project">' + OS.iconSvg('layers') + 'New project</button><button class="osr-chip" type="button" data-work-redesign="board">' + OS.iconSvg('grid') + 'Open board</button><button class="osr-chip" type="button" data-work-redesign="meeting-notes">' + OS.iconSvg('book') + 'Meeting notes</button><button class="osr-chip" type="button" data-work-redesign="focus">' + OS.iconSvg('timer') + 'Focus session</button></div>' +
        '<div class="osr-work-task-chooser" id="osrWorkTaskChooser" aria-label="Choose the Work item for a new task" hidden><p id="osrWorkTaskHelp"></p><label for="osrWorkTaskParent">Work item</label><select id="osrWorkTaskParent"></select><div class="osr-work-task-chooser-actions"><button type="button" class="osr-button osr-button-primary" data-work-redesign="task-continue">Continue to task</button><button type="button" class="osr-button" data-work-redesign="new-item">Create work item</button><button type="button" class="osr-button" data-work-redesign="task-cancel">Cancel</button></div></div>' +
        '<p class="osr-action-notice" id="osrWorkNotice" role="status" hidden></p>' +
      '</section>' +
      '<section class="osr-work-summary osr-summary-grid osr-grid" aria-label="Work at a glance">' +
        '<article class="osr-panel osr-work-tasks"><div class="osr-card-head"><h2>My Tasks</h2><div class="osr-work-tabs" role="group" aria-label="Work task date filter"><button type="button" data-work-tab="today" aria-pressed="true">Today</button><button type="button" data-work-tab="week" aria-pressed="false">This Week</button><button type="button" data-work-tab="all" aria-pressed="false">All</button></div></div><div class="osr-work-task-layout"><div class="osr-work-task-ring"><strong id="osrWorkTaskFraction">0/0</strong><span>Completed</span></div><div id="osrWorkTaskRows" class="osr-work-rows"></div></div></article>' +
        '<article class="osr-panel osr-work-schedule"><div class="osr-card-head"><h2>Today’s Schedule</h2><button class="osr-card-arrow" type="button" data-work-redesign="timeline" aria-label="Open Work timeline">↗</button></div><div id="osrWorkScheduleRows" class="osr-work-rows"></div></article>' +
        '<article class="osr-panel osr-work-projects"><div class="osr-card-head"><h2>Project Progress</h2><button class="osr-inline-link" type="button" data-work-redesign="projects">View all →</button></div><div id="osrWorkProjectRows" class="osr-work-rows"></div></article>' +
        '<article class="osr-panel osr-work-focus"><div class="osr-card-head"><h2>Focus &amp; Productivity</h2><button class="osr-card-arrow" type="button" data-work-redesign="focus" aria-label="Open focus timer">↗</button></div><div class="osr-work-focus-content"><div class="osr-timer-ring"><strong id="osrWorkFocusTime">25:00</strong><span id="osrWorkFocusState">Ready</span></div><div class="osr-work-focus-copy"><strong>Make space to focus</strong><p>Your local timer is in Productivity.</p><button class="osr-inline-link" type="button" data-work-redesign="focus">Open timer →</button></div></div><div class="osr-work-focus-metrics"><span><strong id="osrWorkOpenItems">0</strong>Active items</span><span><strong id="osrWorkOpenTasks">0</strong>Open tasks</span></div></article>' +
      '</section>' +
      '<section class="osr-work-portals" aria-label="Work spaces"><div class="osr-grid osr-portal-grid" id="osrWorkPortalGrid"></div></section>' +
    '</main>');

  var ownerSurface = foundation.createOwnerSurface(view, stage, 'work', 'Work');
  var portals = [
    { slug: 'projects', label: 'Projects', subtitle: 'Plan. Build. Ship.', available: true },
    { slug: 'kanban-board', label: 'Kanban Board', subtitle: 'Track work in progress.', available: true },
    { slug: 'team', label: 'Team', subtitle: 'Coming in the next rollout.' },
    { slug: 'documents', label: 'Documents', subtitle: 'Coming in the next rollout.' },
    { slug: 'meetings', label: 'Meetings', subtitle: 'Coming in the next rollout.' },
    { slug: 'templates', label: 'Templates', subtitle: 'Coming in the next rollout.' }
  ];
  var portalGrid = doc.getElementById('osrWorkPortalGrid');
  portals.forEach(function (portal) {
    var tile = doc.createElement('div');
    tile.className = 'osr-portal osr-work-portal';
    tile.dataset.portal = portal.slug;
    tile.innerHTML = '<img src="assets/scenes/work/portals/' + portal.slug + '.jpg" alt="" loading="lazy" decoding="async" width="960" height="640"><div class="osr-portal-copy"><strong>' + esc(portal.label) + '</strong><small>' + esc(portal.subtitle) + '</small></div>';
    var image = tile.querySelector('img');
    image.addEventListener('load', function () { tile.dataset.assetState = 'ready'; });
    image.addEventListener('error', function () { tile.dataset.assetState = 'fallback'; image.remove(); });
    var action = doc.createElement('button');
    action.type = 'button';
    action.dataset.workPortal = portal.slug;
    action.className = 'osr-portal-action';
    action.innerHTML = OS.iconSvg('external');
    action.setAttribute('aria-label', portal.available ? 'Open ' + portal.label : portal.label + ' availability');
    tile.appendChild(action);
    portalGrid.appendChild(tile);
  });

  function snapshot() {
    return {
      items: OS.safeGetJSON('orbit-work-items', []),
      tasks: OS.safeGetJSON('orbit-work-tasks', []),
      projects: OS.safeGetJSON('orbit-work-projects', [])
    };
  }
  function render() {
    var model = buildModel(snapshot(), new Date(), currentTab);
    doc.getElementById('osrWorkTaskFraction').textContent = model.taskDone + '/' + model.taskTotal;
    doc.querySelector('.osr-work-task-ring').style.setProperty('--progress', model.taskTotal ? Math.round(model.taskDone / model.taskTotal * 100) + '%' : '0%');
    doc.getElementById('osrWorkTaskRows').innerHTML = model.tasks.length ? model.tasks.slice(0, 4).map(function (task) {
      return '<button type="button" class="osr-work-row" data-work-task="' + esc(task.id || '') + '"><span class="osr-work-check ' + (task.done ? 'is-done' : '') + '" aria-hidden="true">' + (task.done ? '✓' : '') + '</span><span><strong>' + esc(task.title) + '</strong><small>' + esc(task.dueDate || 'No date') + '</small></span><i aria-hidden="true">›</i></button>';
    }).join('') + (model.tasks.length > 4 ? '<button class="osr-inline-link" type="button" data-work-redesign="board">View all ' + model.tasks.length + ' tasks →</button>' : '') : '<p class="osr-empty">' + (currentTab === 'all' ? 'No Work tasks yet. Create a project and work item first.' : 'No dated Work tasks in this period. View all tasks or add one to a work item.') + '</p>';
    doc.getElementById('osrWorkScheduleRows').innerHTML = model.reminders.length ? '<p class="osr-work-context">Local reminders set for today</p>' + model.reminders.slice(0, 4).map(function (item) {
      var date = new Date(item.reminderAt);
      var time = Number.isNaN(date.getTime()) ? 'Today' : new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
      return '<button type="button" class="osr-work-row" data-work-item="' + esc(item.id || '') + '"><time>' + esc(time) + '</time><span><strong>' + esc(item.name || 'Work reminder') + '</strong><small>Work reminder</small></span><i aria-hidden="true">›</i></button>';
    }).join('') : '<p class="osr-empty">No Work reminders set for today. Meeting schedules are coming later.</p><button class="osr-inline-link" type="button" data-work-redesign="timeline">View Work timeline →</button>';
    doc.getElementById('osrWorkProjectRows').innerHTML = model.projects.length ? model.projects.slice(0, 4).map(function (project) {
      var progress = Number.isFinite(Number(project.progress)) ? Math.max(0, Math.min(100, Number(project.progress))) : 0;
      return '<button type="button" class="osr-work-project-row" data-work-redesign="projects"><span class="osr-work-project-icon" aria-hidden="true">' + OS.iconSvg('layers') + '</span><span><strong>' + esc(project.name) + '</strong><small>Saved progress · ' + progress + '%</small><span class="osr-work-progress"><i style="width:' + progress + '%"></i></span></span><i aria-hidden="true">›</i></button>';
    }).join('') + (model.projects.length > 4 ? '<button class="osr-inline-link" type="button" data-work-redesign="projects">View all ' + model.projects.length + ' projects →</button>' : '') : '<p class="osr-empty">No active projects yet. Start with one clear outcome.</p><button class="osr-inline-link" type="button" data-work-redesign="new-project">Create a project →</button>';
    doc.getElementById('osrWorkOpenItems').textContent = model.activeItems.length;
    doc.getElementById('osrWorkOpenTasks').textContent = model.allOpenTaskCount;
    doc.getElementById('osrWorkDate').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()) + ' · Your local workspace';
    syncFocus();
  }
  function syncFocus() {
    var timer = doc.getElementById('focusTime'), start = doc.getElementById('focusStart'), status = doc.getElementById('focusStatus');
    if (timer) doc.getElementById('osrWorkFocusTime').textContent = timer.textContent;
    doc.getElementById('osrWorkFocusState').textContent = start && start.getAttribute('aria-pressed') === 'true' ? 'Running' : status && status.textContent === 'Paused' ? 'Paused' : 'Ready';
  }
  function openBoard(targetId) {
    if (!go('work', 'workTracker')) return false;
    if (!targetId) return true;
    if (!root.OneSpaceWork.openItem(targetId)) { OS.showToast('That Work item is no longer available.'); return false; }
    return true;
  }
  function openTask(taskId) {
    if (!go('work', 'workTracker')) return false;
    if (!root.OneSpaceWork.openTask(taskId)) { OS.showToast('That Work task is no longer available.'); return false; }
    return true;
  }
  function showTaskChooser() {
    var chooser = doc.getElementById('osrWorkTaskChooser');
    var items = buildModel(snapshot(), new Date(), 'all').activeItems;
    var select = doc.getElementById('osrWorkTaskParent');
    select.innerHTML = items.map(function (item) { return '<option value="' + esc(item.id) + '">' + esc(item.name) + '</option>'; }).join('');
    var hasItems = items.length > 0;
    doc.getElementById('osrWorkTaskHelp').textContent = hasItems ? 'A task belongs to a Work item. Choose its parent, then use the existing task form.' : 'Create a Work item first. Every task belongs to a project and Work item.';
    chooser.querySelector('label').hidden = !hasItems;
    select.hidden = !hasItems;
    chooser.querySelector('[data-work-redesign="task-continue"]').hidden = !hasItems;
    chooser.querySelector('[data-work-redesign="new-item"]').hidden = hasItems;
    chooser.hidden = false;
    stage.querySelector('[data-work-redesign="new-task"]').setAttribute('aria-expanded', 'true');
    (hasItems ? select : chooser.querySelector('[data-work-redesign="new-item"]')).focus();
  }
  function hideTaskChooser(restoreFocus) {
    doc.getElementById('osrWorkTaskChooser').hidden = true;
    var trigger = stage.querySelector('[data-work-redesign="new-task"]');
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus();
  }
  stage.addEventListener('click', function (event) {
    var tab = event.target.closest('[data-work-tab]');
    if (tab) {
      currentTab = tab.dataset.workTab;
      stage.querySelectorAll('[data-work-tab]').forEach(function (button) { button.setAttribute('aria-pressed', String(button === tab)); });
      render();
      return;
    }
    var task = event.target.closest('[data-work-task]');
    if (task) { openTask(task.dataset.workTask); return; }
    var item = event.target.closest('[data-work-item]');
    if (item) { openBoard(item.dataset.workItem); return; }
    var portal = event.target.closest('[data-work-portal]');
    if (portal) {
      if (portal.dataset.workPortal === 'projects') go('projects', 'projectForm');
      else if (portal.dataset.workPortal === 'kanban-board') openBoard();
      else root.OneSpaceUI.open('Work space — coming later', '<p>' + esc(portal.dataset.workPortal.replace(/-/g, ' ').replace(/^./, function (letter) { return letter.toUpperCase(); })) + ' is coming in the Work submodule rollout. Open Projects or Kanban Board for your current Work records.</p>', null);
      return;
    }
    var action = event.target.closest('[data-work-redesign]');
    if (!action) return;
    switch (action.dataset.workRedesign) {
      case 'new-task': showTaskChooser(); break;
      case 'task-cancel': hideTaskChooser(true); break;
      case 'task-continue': {
        var parentId = doc.getElementById('osrWorkTaskParent').value;
        hideTaskChooser(false);
        if (go('work', 'workTracker') && !root.OneSpaceWork.openNewTask(parentId)) OS.showToast('That Work item is no longer available. Choose an active item.');
        break;
      }
      case 'new-item': {
        hideTaskChooser(false);
        if (go('work', 'workTracker')) doc.querySelector('#workTracker [data-work-action="add"]').click();
        break;
      }
      case 'new-project': go('projects', 'projectForm'); break;
      case 'projects': go('projects', 'projectList'); break;
      case 'board': openBoard(); break;
      case 'timeline': go('work', 'workTimelineSection'); break;
      case 'meeting-notes': go('notes', 'notesNewBody'); break;
      case 'focus': go('productivity', 'focusStart'); break;
    }
  });
  doc.getElementById('osrWorkSearchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var query = doc.getElementById('osrWorkSearch').value.trim();
    if (!query) { notice('Enter a Work item name or keyword to search.'); doc.getElementById('osrWorkSearch').focus(); return; }
    if (!openBoard()) return;
    var input = doc.querySelector('#workFilters [name="search"]');
    if (input) { input.value = query; input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); }
  });
  doc.getElementById('osrWorkCommand').addEventListener('click', function () { doc.getElementById('paletteHint').click(); });
  doc.addEventListener('onespace:data-changed', function (event) { if (['orbit-work-items', 'orbit-work-tasks', 'orbit-work-projects'].includes(event.detail.key)) render(); });
  doc.addEventListener('onespace:page-changed', function (event) { if (event.detail.page !== 'work' || doc.body.dataset.workView === 'projects') hideTaskChooser(false); if (event.detail.page === 'work') render(); });
  var timer = doc.getElementById('focusTime');
  if (timer && root.MutationObserver) new root.MutationObserver(syncFocus).observe(timer, { childList: true, characterData: true, subtree: true });
  render();
  return { buildModel: buildModel, dateKey: dateKey };
});
