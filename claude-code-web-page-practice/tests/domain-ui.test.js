'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('domain dialog keeps a failed write open and reports it, then closes after retry', () => {
  const error = { textContent: '' };
  const form = {};
  const overlay = {
    hidden: true,
    addEventListener() {},
    querySelectorAll() { return []; },
    querySelector(selector) {
      if (selector === 'form') return form;
      if (selector === 'input, textarea, select') return {};
      return null;
    }
  };
  let closeCount = 0;
  const context = {
    FormData: class {},
    document: {
      createElement() { return overlay; },
      body: { appendChild() {} },
      getElementById(id) { return id === 'domainError' ? error : null; }
    },
    window: {
      OneSpace: {
        escapeHtml: value => String(value),
        iconSvg: () => '',
        openModal() {},
        closeModal() { closeCount++; }
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../shared/domain-ui.js'), 'utf8'), context);
  let writeSucceeds = false;
  context.window.OneSpaceUI.open('Add Location', '', () => writeSucceeds, 'Add to trip board');
  const event = { preventDefault() {} };
  form.onsubmit(event);
  assert.match(error.textContent, /could not be saved/i);
  assert.equal(closeCount, 0);
  writeSucceeds = true;
  form.onsubmit(event);
  assert.equal(closeCount, 1);
});

test('Explore Add Location does not change the trip board when storage rejects the write', () => {
  let actions;
  let submit;
  const saved = [];
  const toasts = [];
  const board = { setAttribute() {}, innerHTML: '', querySelector() { return null; } };
  const context = {
    document: {
      createElement(tag) { return tag === 'section' ? board : {}; },
      getElementById() { return { append() {} }; },
      querySelector(selector) {
        return selector.includes('localImage') ? {} : { textContent: '', onclick: null };
      }
    },
    window: {
      DESTINATIONS: [],
      OneSpace: {
        escapeHtml: value => String(value),
        iconSvg: () => '',
        safeGetJSON: () => saved,
        safeGet: () => '[]',
        safeSet: () => false,
        uid: () => 'manual-test',
        showToast(message) { toasts.push(message); }
      },
      OneSpaceUI: {
        open(title, body, callback) { submit = callback; },
        field: () => '',
        select: () => ''
      },
      OneSpaceDiscovery: {
        mount(host, domain, suppliedActions) {
          actions = suppliedActions;
          return { refresh() {}, search() {}, random() {} };
        },
        label: () => '',
        wirePhotos() {}
      },
      OneSpaceTrips: {
        statuses: ['Ideas'],
        destination: () => true,
        save(rows, destination) { return [...rows, { destination }]; }
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../explore/explore-global.js'), 'utf8'), context);
  actions.manual();
  const fields = new Map([
    ['name', 'Failed write place'], ['country', 'Test'], ['description', 'A location used to test rollback.'],
    ['category', 'place'], ['lat', ''], ['lon', ''], ['website', ''], ['removeImage', ''], ['notes', '']
  ]);
  assert.equal(submit({ get: name => fields.get(name) }), false);
  assert.equal(saved.length, 0);
  assert.match(board.innerHTML, /0 saved places/);
  assert.deepEqual(toasts, ['Changes could not be saved. Please try again.']);
});

test('Explore trip edit, plan, moves and removal reject failed writes', () => {
  let submit;
  let confirmRemoval;
  const toasts = [];
  const saved = [{
    id: 'trip-test', destination: { id: 'manual-test', name: 'Saved place' },
    status: 'idea', priority: 3, notes: 'Keep this note', startDate: '', endDate: '',
    planTitle: '', itinerary: [], order: 0
  }, {
    id: 'trip-second', destination: { id: 'manual-second', name: 'Second place' },
    status: 'idea', priority: 3, notes: '', startDate: '', endDate: '',
    planTitle: '', itinerary: [], order: 1
  }];
  const before = JSON.stringify(saved);
  const board = { setAttribute() {}, innerHTML: '', querySelector() { return null; } };
  const context = {
    document: {
      createElement(tag) { return tag === 'section' ? board : {}; },
      getElementById() { return { append() {} }; },
      querySelector() { return { textContent: '', onclick: null }; }
    },
    window: {
      DESTINATIONS: [],
      OneSpace: {
        escapeHtml: String, iconSvg: () => '', safeGetJSON: () => saved,
        safeGet: () => '[]', safeSet: () => false,
        showToast(message) { toasts.push(message); }
      },
      OneSpaceUI: {
        open(title, body, callback) { submit = callback; },
        confirm(title, body, callback) { confirmRemoval = callback; },
        field: () => '', select: () => ''
      },
      OneSpaceDiscovery: {
        mount: () => ({ refresh() {}, search() {}, random() {} }),
        label: String, photo: () => '', wirePhotos() {}
      },
      OneSpaceTrips: {
        statuses: ['idea'],
        update(rows, id, change) { return rows.map(row => row.id === id ? { ...row, ...change } : row); },
        move(rows) { return rows.slice().reverse(); }
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../explore/explore-global.js'), 'utf8'), context);
  for (const action of ['edit', 'plan']) {
    board.onclick({ target: { closest: () => ({ dataset: { trip: action }, hasAttribute: () => false, closest: () => ({ dataset: { tripId: 'trip-test' } }) }) } });
    const values = new Map([
      ['status', 'idea'], ['notes', 'Changed note'], ['startDate', ''], ['endDate', ''],
      ['priority', '2'], ['planTitle', 'Test plan'], ['itinerary', 'invalid itinerary']
    ]);
    assert.throws(() => submit({ get: name => values.get(name) }), /day \| notes/);
    values.set('itinerary', '1 | Walk through town');
    assert.equal(submit({ get: name => values.get(name) }), false);
    assert.equal(JSON.stringify(saved), before);
  }
  for (const action of ['up', 'down']) {
    board.onclick({ target: { closest: () => ({ dataset: { trip: action }, hasAttribute: () => false, closest: () => ({ dataset: { tripId: 'trip-second' } }) }) } });
  }
  board.onclick({ target: { closest: () => ({ dataset: { trip: 'delete' }, hasAttribute: () => false, closest: () => ({ dataset: { tripId: 'trip-second' } }) }) } });
  assert.equal(JSON.stringify(saved), before);
  assert.equal(confirmRemoval(), false);
  assert.equal(JSON.stringify(saved), before);
  assert.deepEqual(toasts, [
    'Changes could not be saved. Please try again.',
    'Changes could not be saved. Please try again.',
    'Changes could not be saved. Please try again.',
    'Changes could not be saved. Please try again.',
    'Changes could not be saved. Please try again.'
  ]);
});
