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
