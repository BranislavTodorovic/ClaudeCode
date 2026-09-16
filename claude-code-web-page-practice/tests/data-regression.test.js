// Run: node --test tests/data-regression.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const storage = require('../storage-utils.js');
const catalog = require('../catalog-utils.js');
const root = path.resolve(__dirname, '..');
const data = { window: {} };
vm.createContext(data);
for (const file of ['games-data.js', 'movies-data.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), data);
}
const games = catalog.merge([data.window.SUGGESTION_CATALOG, data.window.DEFAULT_GAMES], catalog.game);

function memory(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

test('PC and Horror require both groups, including default games', () => {
  const results = games.filter(game => catalog.matches(game, { platforms: ['PC'], genres: ['Horror'] }));
  assert.deepEqual(results.map(game => game.title), ['Alan Wake 2']);
});

test('multiple selections within one group use OR; groups use AND', () => {
  const results = games.filter(game => catalog.matches(game, { platforms: ['PC', 'PS5'], genres: ['Horror'] }));
  assert.deepEqual(results.map(game => game.title), ['Alan Wake 2', 'Resident Evil 4']);
});

test('a saved copy does not duplicate its catalog source', () => {
  const source = data.window.SUGGESTION_CATALOG[0];
  const saved = { ...source, id: 'custom-copy', sourceSuggestion: source.id };
  assert.equal(catalog.merge([[source], [saved]], catalog.game).length, 1);
});

test('search includes metadata and does not cap results at eight', () => {
  const results = catalog.search(data.window.SEED_MOVIES, 'Movie');
  assert.equal(results.length, data.window.SEED_MOVIES.length);
  assert.ok(results.length > 8);
  assert.ok(catalog.search(games, 'Horror').some(game => game.title === 'Alan Wake 2'));
});

test('similarity excludes the selected title and requires shared metadata', () => {
  const source = games.find(game => game.title === 'Alan Wake 2');
  const results = catalog.similar(games, source, ['genres']);
  assert.ok(results.some(game => game.title === 'Resident Evil 4'));
  assert.ok(results.every(game => game.id !== source.id && game.genres.some(genre => source.genres.includes(genre))));
});

test('complete backups round-trip projects, preferences, trackers and unrelated data', () => {
  const initial = {
    'orbit-work-projects': JSON.stringify([{ id: 'old-project', name: 'Existing work', progress: 60, status: 'active' }]),
    'orbit-notes-list': JSON.stringify([{ id: 'note-1', body: 'Keep my notes', title: 'Idea' }]),
    'orbit-games-library': JSON.stringify(data.window.DEFAULT_GAMES),
    'orbit-games-preferences': JSON.stringify({ platforms: ['PC'], genres: ['Horror'], similarTo: [] }),
    'orbit-movies-library': JSON.stringify([{ ...data.window.SEED_MOVIES[0], status: 'watchlist' }]),
    'orbit-motion-override': 'reduced',
    'orbit-page': 'projects',
    'another-app': 'must survive'
  };
  const source = memory(initial);
  const backup = storage.backup(source);
  const target = memory({ 'another-app': 'keep target', 'orbit-theme': 'dark' });
  storage.restore(target, backup);
  assert.deepEqual(storage.snapshot(target), storage.snapshot(source));
  assert.equal(target.getItem('another-app'), 'keep target');
  assert.equal(target.getItem('orbit-theme'), null);
});

test('legacy project records without optional fields remain valid', () => {
  assert.equal(storage.valid('orbit-work-projects', JSON.stringify([{ id: 'legacy', name: 'Existing project', status: 'done', progress: 100 }])), true);
});

test('malformed project tags and note titles are rejected before writes', () => {
  const store = memory({ 'orbit-theme': 'light' });
  assert.throws(() => storage.transaction(store, {
    'orbit-theme': 'dark',
    'orbit-work-projects': JSON.stringify([{ id: 'bad', name: 'Broken', status: 'active', progress: 0, tags: 'not an array' }])
  }), /Invalid backup field/);
  assert.equal(store.getItem('orbit-theme'), 'light');
  assert.equal(storage.valid('orbit-notes-list', JSON.stringify([{ id: 'bad-note', body: 'Text', title: {} }])), false);
});

test('storage failure rolls back previously written values', () => {
  const store = memory({ 'orbit-theme': 'light', 'orbit-notes': 'Original' });
  const write = store.setItem;
  let attempted = 0;
  store.setItem = (key, value) => { if (++attempted === 2) throw new Error('Quota exceeded'); return write(key, value); };
  assert.throws(() => storage.transaction(store, { 'orbit-theme': 'dark', 'orbit-notes': 'Imported' }), /No data was imported/);
  assert.equal(store.getItem('orbit-theme'), 'light');
  assert.equal(store.getItem('orbit-notes'), 'Original');
});

test('restore rejects unknown keys and incomplete backups without changing state', () => {
  const store = memory({ 'orbit-notes': 'Keep' });
  assert.throws(() => storage.restore(store, { app: 'OneSpace', version: 2, data: { 'orbit-notes': 'New' } }), /Incomplete/);
  assert.throws(() => storage.transaction(store, { 'another-app': 'Overwrite' }), /Invalid backup field/);
  assert.equal(store.getItem('orbit-notes'), 'Keep');
});

test('reset removes only known OneSpace keys', () => {
  const store = memory({ 'orbit-notes': 'Owned', 'another-app': 'Keep', 'orbit-unrelated': 'Also keep' });
  storage.reset(store);
  assert.equal(store.getItem('orbit-notes'), null);
  assert.equal(store.getItem('another-app'), 'Keep');
  assert.equal(store.getItem('orbit-unrelated'), 'Also keep');
});

test('complete browser-import fixture restores all keys and preserves unrelated storage', () => {
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/complete-backup.json'), 'utf8'));
  const store = memory({ 'another-app': 'Keep' });
  storage.restore(store, fixture);
  assert.deepEqual(storage.snapshot(store), fixture.data);
  assert.equal(store.getItem('another-app'), 'Keep');
});

test('malformed browser-import fixture leaves existing notes unchanged', () => {
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/invalid-backup.json'), 'utf8'));
  const original = JSON.stringify([{ id: 'keep', body: 'Keep existing notes' }]);
  const store = memory({ 'orbit-notes-list': original });
  assert.throws(() => storage.restore(store, fixture), /Invalid backup field/);
  assert.equal(store.getItem('orbit-notes-list'), original);
});

test('every application script parses', () => {
  for (const file of fs.readdirSync(root).filter(name => name.endsWith('.js'))) {
    new vm.Script(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
  }
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
});
