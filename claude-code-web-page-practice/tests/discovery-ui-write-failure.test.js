'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('Explore Shortlist reports a rejected write without showing a saved state', async () => {
  const form = { elements: {} };
  const status = { textContent: '', className: '' };
  const results = { innerHTML: '', querySelectorAll: () => [] };
  const more = {};
  let click;
  let saveCalls = 0;
  const host = {
    dataset: {}, classList: { add() {} },
    setAttribute() {}, removeAttribute() {},
    querySelector(selector) {
      return { form, '.provider-status': status, '.discovery-results': results, '.discovery-more': more }[selector];
    },
    addEventListener(type, listener) { if (type === 'click') click = listener; }
  };
  const context = {
    AbortController, URL, location: { href: 'http://127.0.0.1/' },
    window: {
      OneSpace: { escapeHtml: String, iconSvg: () => '' },
      OneSpaceUI: { field: () => '', select: () => '' },
      OneSpaceLocalDiscovery: {
        media: value => value,
        create: () => ({ request: async () => ({ item: { id: 'place', name: 'Place', source: { name: 'Local collection' } } }), clear() {} })
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../explore/discovery-ui.js'), 'utf8'), context);
  context.window.OneSpaceDiscovery.mount(host, 'destinations', {
    snapshot: () => ({}), has: () => false, loadPreferences: () => ({}),
    save: () => { saveCalls++; return false; }
  });
  click({ target: { closest: () => ({ dataset: { providerSave: 'place' }, hasAttribute: () => false }) } });
  await new Promise(setImmediate);
  assert.equal(saveCalls, 1);
  assert.match(status.textContent, /could not be saved/i);
  assert.match(status.className, /is-error/);
  assert.doesNotMatch(results.innerHTML, /Saved/);
});

test('Explore Surprise me stops on a rejected preference write', async () => {
  const status = { textContent: '', className: '' };
  const form = { elements: {} };
  let requests = 0;
  const host = {
    dataset: {}, classList: { add() {} },
    querySelector(selector) {
      return { form, '.provider-status': status, '.discovery-results': {}, '.discovery-more': {} }[selector];
    },
    addEventListener() {}
  };
  const context = {
    AbortController, URL, location: { href: 'http://127.0.0.1/' },
    FormData: class { constructor() { return [['q', 'Paris']]; } },
    window: {
      OneSpace: { escapeHtml: String, iconSvg: () => '' },
      OneSpaceUI: { field: () => '', select: () => '' },
      OneSpaceLocalDiscovery: {
        create: () => ({ request: async () => { requests++; return { items: [], nextPage: null }; }, clear() {} })
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../explore/discovery-ui.js'), 'utf8'), context);
  const discovery = context.window.OneSpaceDiscovery.mount(host, 'destinations', {
    snapshot: () => ({}), loadPreferences: () => ({}), savePreferences: () => false
  });
  assert.equal(await discovery.random(), null);
  assert.equal(requests, 0);
  assert.match(status.textContent, /preferences could not be saved/i);
  assert.match(status.className, /is-error/);
});

for (const event of ['submit', 'change', 'reset']) {
  test('Explore '+event+' preserves rejected preference feedback and does not search', async () => {
    const status = { textContent: '', className: '' }, form = { elements: {} };
    let requests = 0, prevented = false, writes = 0;
    const host = {
      dataset: {}, classList: { add() {} }, addEventListener() {},
      querySelector(selector) { return { form, '.provider-status': status, '.discovery-results': {}, '.discovery-more': {} }[selector]; }
    };
    const context = {
      AbortController, URL, setTimeout, location: { href: 'http://localhost/' },
      FormData: class { constructor() { return [['budget', 'low']]; } },
      window: {
        OneSpace: { escapeHtml: String, iconSvg: () => '' }, OneSpaceUI: { field: () => '', select: () => '' },
        OneSpaceLocalDiscovery: { create: () => ({ request: async () => { requests++; return { items: [], nextPage: null }; } }) }
      }
    };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../explore/discovery-ui.js'), 'utf8'), context);
    context.window.OneSpaceDiscovery.mount(host, 'destinations', {
      snapshot: () => ({}), loadPreferences: () => ({}),
      savePreferences: () => { writes++; return false; }, clearPreferences: () => { writes++; return false; }
    });
    form['on'+event]({ preventDefault() { prevented = true; }, target: { matches: () => true } });
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(writes, 1);
    assert.equal(requests, 0);
    assert.equal(prevented, event !== 'change');
    assert.match(status.textContent, /Preferences could not be (saved|cleared)/);
    assert.match(status.className, /is-error/);
  });
}
