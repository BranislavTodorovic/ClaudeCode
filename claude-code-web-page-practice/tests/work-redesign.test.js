'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { buildModel } = require('../work/work-redesign');

test('Work summaries use Work-owned tasks and exact local calendar periods', () => {
  const now = new Date(2026, 8, 29, 12);
  const snapshot = {
    items: [{ id: 'item-1', status: 'open' }, { id: 'item-2', status: 'closed' }],
    tasks: [
      { title: 'Overdue', dueDate: '2026-09-28', done: false },
      { title: 'Today', dueDate: '2026-09-29', done: true },
      { title: 'Friday', dueDate: '2026-10-02', done: false },
      { title: 'Next Monday', dueDate: '2026-10-05', done: false },
      { title: 'Undated', done: false }
    ],
    projects: [{ name: 'Current', status: 'active' }, { name: 'Finished', status: 'done' }]
  };
  const today = buildModel(snapshot, now, 'today');
  const week = buildModel(snapshot, now, 'week');
  const all = buildModel(snapshot, now, 'all');
  assert.deepEqual(today.tasks.map(task => task.title), ['Overdue', 'Today']);
  assert.deepEqual(week.tasks.map(task => task.title), ['Overdue', 'Today', 'Friday']);
  assert.equal(today.taskDone, 1);
  assert.equal(today.taskTotal, 2);
  assert.equal(today.allOpenTaskCount, 4);
  assert.equal(all.taskTotal, 5);
  assert.equal(all.activeItems.length, 1);
  assert.deepEqual(all.projects.map(project => project.name), ['Current']);
});

test('Work reminders and empty data do not invent meeting or project records', () => {
  const now = new Date(2026, 8, 29, 12);
  const model = buildModel({
    items: [
      { id: 'future', status: 'open', reminderAt: '2026-09-30T09:00:00' },
      { id: 'today', status: 'open', reminderAt: '2026-09-29T15:00:00' },
      { id: 'closed', status: 'closed', reminderAt: '2026-09-29T08:00:00' }
    ],
    tasks: [], projects: []
  }, now, 'today');
  assert.deepEqual(model.reminders.map(item => item.id), ['today']);
  assert.equal(model.taskTotal, 0);
  assert.equal(model.allOpenTaskCount, 0);
  assert.deepEqual(model.projects, []);
});

test('Work portal display assets preserve originals and stay within the page budget', () => {
  const directory = path.resolve(__dirname, '../assets/scenes/work/portals');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
  assert.deepEqual(manifest.assets.map(asset => asset.slug), [
    'projects', 'kanban-board', 'team', 'documents', 'meetings', 'templates'
  ]);
  let displayBytes = 0;
  for (const asset of manifest.assets) {
    const display = fs.readFileSync(path.join(directory, asset.file));
    const original = fs.readFileSync(path.join(directory, asset.original));
    assert.deepEqual(display.subarray(0, 3), Buffer.from([0xff, 0xd8, 0xff]));
    assert.deepEqual(original.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    displayBytes += display.length;
  }
  assert(displayBytes < 800_000, `Work portal transfer is ${displayBytes} bytes`);
});

test('Work landing handoffs open the existing item and task owners', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../work/work-tracker.js'), 'utf8');
  const from = source.indexOf('    root.OneSpaceWork.openNewTask=function(itemId)');
  const to = source.indexOf("    document.querySelector('[data-work-new]')", from);
  assert(from >= 0 && to > from);
  const opened = [];
  const taskFocus = { focus: () => opened.push('task focused') };
  const taskRow = { dataset: { taskKey: 'task-1' }, scrollIntoView: () => opened.push('task scrolled'), querySelector: () => taskFocus };
  const ctx = {
    root: { OneSpaceWork: {} },
    read: () => ({ items: [{ id: 'active', status: 'open' }, { id: 'closed', status: 'closed' }], tasks: [{ id: 'task-1', itemId: 'active' }] }),
    editTask: (taskId, itemId) => opened.push([taskId, itemId]),
    UI: { panel: () => ({ body: { querySelectorAll: () => [taskRow] }, show: () => opened.push('detail shown') }) },
    host: { onclick() {}, onchange() {} },
    render: () => opened.push('rendered'),
    detailPanel: null,
    selected: null
  };
  vm.runInNewContext(source.slice(from, to), ctx);
  assert.equal(ctx.root.OneSpaceWork.openNewTask('closed'), false);
  assert.equal(ctx.root.OneSpaceWork.openNewTask('missing'), false);
  assert.equal(ctx.root.OneSpaceWork.openNewTask('active'), true);
  assert.deepEqual(opened[0], [null, 'active']);
  assert.equal(ctx.root.OneSpaceWork.openItem('missing'), false);
  assert.equal(ctx.root.OneSpaceWork.openItem('active'), true);
  assert.equal(ctx.selected, 'active');
  assert.deepEqual(opened.slice(1), ['detail shown', 'rendered']);
  assert.equal(ctx.root.OneSpaceWork.openTask('missing'), false);
  assert.equal(ctx.root.OneSpaceWork.openTask('task-1'), true);
  assert.deepEqual(opened.slice(-4), ['detail shown', 'rendered', 'task scrolled', 'task focused']);
});

test('Work board handoff stops on rejected navigation or deleted item', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../work/work-redesign.js'), 'utf8');
  const from = source.indexOf('  function openBoard(targetId)');
  const to = source.indexOf('  function showTaskChooser()', from);
  assert(from >= 0 && to > from);
  let routeAllowed = false;
  let itemPresent = false;
  let ownerCalls = 0;
  const notices = [];
  const ctx = {
    go: () => routeAllowed,
    root: { OneSpaceWork: {
      openItem: () => { ownerCalls++; return itemPresent; },
      openTask: () => { ownerCalls++; return itemPresent; }
    } },
    OS: { showToast: message => notices.push(message) }
  };
  vm.runInNewContext(source.slice(from, to), ctx);
  assert.equal(ctx.openBoard('item'), false);
  assert.equal(ownerCalls, 0);
  routeAllowed = true;
  assert.equal(ctx.openBoard('item'), false);
  assert.equal(ownerCalls, 1);
  assert.match(notices[0], /no longer available/);
  itemPresent = true;
  assert.equal(ctx.openBoard('item'), true);
  assert.equal(ctx.openBoard(), true);
  routeAllowed = false;
  assert.equal(ctx.openTask('task'), false);
  routeAllowed = true;
  assert.equal(ctx.openTask('task'), true);
});
