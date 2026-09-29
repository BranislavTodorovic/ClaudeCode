'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildModel } = require('../personal/personal-redesign');

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
