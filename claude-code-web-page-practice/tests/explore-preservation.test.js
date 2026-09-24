'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const storage = require('./storage-setup');
const discovery = require('../explore/local-discovery');
const trips = require('../explore/trip-board');
const shortcuts = require('../shared/shortcut-utils');

const root = path.resolve(__dirname, '..');
function destinations() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'explore/explore-data.js'), 'utf8'), context);
  return context.window.DESTINATIONS;
}

test('Explore filtering intersects groups and ranking is stable with visible reasons', () => {
  const rows = destinations();
  const params = { category: 'nature', budget: 'medium' };
  const first = discovery.search('destinations', params, { DESTINATIONS: rows, trips: [] });
  const reversed = discovery.search('destinations', params, { DESTINATIONS: [...rows].reverse(), trips: [] });
  assert.deepEqual(Array.from(first.items, item => item.id), ['azores', 'slovenia']);
  assert.deepEqual(Array.from(reversed.items, item => item.id), ['azores', 'slovenia']);
  assert(first.items.every(item => item.matchExplanation.includes('Categories: nature') && item.matchExplanation.includes('Budget: medium')));
});

test('saved destinations validate, deduplicate and retain trip-board notes', () => {
  const destination = discovery.normalize(destinations()[0], 'destinations');
  const saved = trips.save([], destination, 'trip-lisbon');
  assert.equal(saved.length, 1);
  assert.equal(trips.save(saved, destination, 'duplicate').length, 1);
  const updated = trips.update(saved, 'trip-lisbon', { notes: 'Museum morning and riverside evening.' });
  assert.equal(updated[0].notes, 'Museum morning and riverside evening.');
  assert.equal(storage.valid('orbit-trip-board', JSON.stringify(updated)), true);
});

test('shortcut ownership keeps travel links in Explore only', () => {
  const categories = ['Development', 'Travel', 'Daily', 'Gaming'];
  const links = shortcuts.sanitize([
    { id: 'trip', name: 'Trip', url: 'https://travel.example/', category: 'Travel', space: 'explore' },
    { id: 'code', name: 'Code', url: 'https://code.example/', category: 'Development', space: 'work' }
  ], [], categories);
  assert.equal(shortcuts.space(links.find(link => link.id === 'trip')), 'explore');
  assert.equal(shortcuts.space(links.find(link => link.id === 'code')), 'work');
});

test('malformed destinations and preferences are rejected', () => {
  const valid = destinations()[0];
  assert.equal(storage.validDestination({ ...valid, id: '../escape' }), false);
  assert.equal(storage.validDestination({ ...valid, image: 'explore/assets/lisbon.webp' }), false);
  assert.equal(storage.validDestination({ ...valid, photoSource: { ...valid.photoSource, sourceUrl: 'javascript:bad' } }), false);
  assert.equal(storage.valid('orbit-explore-preferences', JSON.stringify({ budget: ['unlimited'] })), false);
});

test('missing Explore detail reports not-found without changing saved trips', async () => {
  const saved = trips.save([], discovery.normalize(destinations()[0], 'destinations'), 'trip-kept');
  const before = JSON.stringify(saved);
  const api = discovery.create(() => ({ DESTINATIONS: destinations(), trips: saved }));
  await assert.rejects(api.request('destinations', 'details', { id: 'no-such-place' }), error =>
    error.code === 'not-found' && /no longer in the local collection/i.test(error.message));
  assert.equal(JSON.stringify(saved), before);
});
