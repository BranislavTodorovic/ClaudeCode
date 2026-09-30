'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const storage = require('./storage-setup');
const { buildModel } = require('../personal/personal-redesign');

function personalRuntime(values = new Map()) {
  const nodes = new Map(), listeners = new Map(), portals = [];
  function node() {
    const handlers = new Map();
    return {
      dataset: {}, style: { setProperty() {} }, classList: { add() {} },
      appendChild(child) { this.lastChild = child; if (this === nodes.get('osrPersonalPortalGrid')) portals.push(child); },
      insertAdjacentHTML() {}, querySelector() { return node(); },
      addEventListener(type, callback) { handlers.set(type, callback); },
      setAttribute(name, value) { this[name] = value; },
      getAttribute(name) { return this[name]; },
      trigger(type, event) { handlers.get(type)(event); },
      scrollIntoView() {}, focus() {}
    };
  }
  const doc = {
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); },
    createElement() { return node(); }, querySelector() { return node(); },
    addEventListener(type, callback) { listeners.set(type, callback); },
    dispatchEvent(type, detail) { listeners.get(type)?.({ detail }); }
  };
  const store = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); }
  };
  const OS = {
    iconSvg: () => '', escapeHtml: String, uid: () => 'disposable-habit', showToast() {},
    goToPage: () => { throw new Error('Availability action must not navigate'); },
    safeGetJSON(key, fallback) {
      const raw = store.getItem(key);
      return raw && storage.valid(key, raw) ? JSON.parse(raw) : fallback;
    },
    safeSet(key, value) {
      if (!storage.valid(key, value)) return false;
      store.setItem(key, value);
      doc.dispatchEvent('onespace:data-changed', { key });
      return true;
    }
  };
  const foundation = {
    createSceneHost: () => ({ show() {} }), createShell: () => node(), setActiveWorld() {}
  };
  const window = { document: doc, OneSpace: OS, OneSpaceRedesign: foundation };
  const context = vm.createContext({ window });
  const source = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
  vm.runInContext(source('personal/personal-controller.js'), context);
  vm.runInContext(source('personal/personal-redesign.js'), context);
  return { window, doc, nodes, portals, values, OS };
}

test('Personal progress derives only from saved goals, routines and habits', () => {
  const model = buildModel({
    goals: [{ id: 'g', text: 'Read', done: true }, { id: 'bad', text: '  ', done: true }],
    routines: [{ id: 'r', text: 'Stretch', done: false }],
    habits: [{ id: 'h', text: 'Walk', done: true, frequency: 'daily', target: 4 }]
  });
  assert.deepEqual(model.groups.map(group => [group.label, group.done, group.total]), [
    ['Goals', 1, 1], ['Routines', 0, 1], ['Habits', 1, 1]
  ]);
  assert.equal(model.done, 2);
  assert.equal(model.total, 3);
  assert.equal(model.habits[0].target, 4);
  assert.deepEqual(buildModel({ goals: [], routines: [], habits: [] }).groups.map(group => group.total), [0, 0, 0]);
});

test('Personal portal images retain source artwork and stay within display budget', () => {
  const directory = path.resolve(__dirname, '../assets/scenes/personal/portals');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
  assert.deepEqual(manifest.assets.map(asset => asset.slug), [
    'mindfulness', 'fitness', 'nutrition', 'recovery', 'personal-life', 'home-wellbeing'
  ]);
  let displayBytes = 0;
  for (const asset of manifest.assets) {
    const display = fs.readFileSync(path.join(directory, asset.file));
    const original = fs.readFileSync(path.join(directory, asset.original));
    assert.deepEqual(display.subarray(0, 3), Buffer.from([0xff, 0xd8, 0xff]));
    assert.deepEqual(original.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    assert.match(asset.sourceId, /^exec-/);
    displayBytes += display.length;
  }
  assert(displayBytes < 800_000, `Personal portal transfer is ${displayBytes} bytes`);
});

test('Personal landing reads only the Personal owner keys and gives future actions availability text', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../personal/personal-redesign.js'), 'utf8');
  assert.deepEqual([...source.matchAll(/OS\.safeGetJSON\('([^']+)'/g)].map(match => match[1]), [
    'orbit-personal-goals', 'orbit-personal-routines', 'orbit-personal-habits'
  ]);
  for (const label of ['workout', 'meditate', 'meal']) assert.match(source, new RegExp(`case '${label}': notice\\(`));
  assert.match(source, /if \(!OS\.goToPage\(page\)\)/);
  assert.match(source, /if \(!control\) \{ notice\('That personal item is no longer available/);
});

test('Personal owner completion is reloaded by the landing from the same validated storage keys', () => {
  const first = personalRuntime();
  const controller = first.window.makePersonalController('orbit-personal-habits', first.OS);
  assert.equal(controller.add('R3 disposable walk'), true);
  assert.equal(first.nodes.get('osrPersonalDone').textContent, '0/1');
  const list = { innerHTML: '', querySelector: () => ({ focus() {} }) };
  controller.render(list);
  list.onchange({ target: { dataset: { toggle: 'disposable-habit' }, checked: true } });
  assert.equal(first.nodes.get('osrPersonalDone').textContent, '1/1');
  const afterReload = personalRuntime(first.values);
  assert.equal(afterReload.nodes.get('osrPersonalDone').textContent, '1/1');
  assert.match(afterReload.nodes.get('osrPersonalHabitRows').innerHTML, /R3 disposable walk/);
  assert.equal(JSON.parse(afterReload.values.get('orbit-personal-habits'))[0].done, true);
});

test('Fitness portal activates an availability notice without navigation', () => {
  const app = personalRuntime();
  const fitness = app.portals.find(portal => portal.dataset.portal === 'fitness');
  assert(fitness);
  const button = fitness.lastChild;
  assert.equal(button.getAttribute('aria-label'), 'Fitness availability');
  app.nodes.get('redesignPersonal').trigger('click', {
    target: { closest(selector) { return selector === '[data-personal-portal]' ? button : null; } }
  });
  const notice = app.nodes.get('osrPersonalNotice');
  assert.equal(notice.hidden, false);
  assert.match(notice.textContent, /^Fitness is coming in the Personal submodule rollout\./);
});

test('Personal portal caption reserves more inline room than the corner icon uses', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../personal/personal-redesign.css'), 'utf8');
  const padding = css.match(/\.osr-personal-portal \.osr-portal-copy \{ padding: (\d+)px (\d+)px (\d+)px (\d+)px; \}/);
  const icon = css.match(/\.osr-personal-portal \.osr-portal-action > \.icon \{[^}]*right: (\d+)px;[^}]*width: (\d+)px;/);
  assert(padding && icon, 'Personal caption and icon geometry must remain explicit');
  assert(Number(padding[2]) > Number(icon[1]) + Number(icon[2]));
});
