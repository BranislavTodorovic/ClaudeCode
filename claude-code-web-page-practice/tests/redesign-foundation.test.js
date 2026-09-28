'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const foundation = require('../shared/redesign-foundation.js');

test('eight reference-led worlds have unique routes and local scenes', () => {
  assert.equal(foundation.worlds.length, 8);
  assert.equal(new Set(foundation.worlds.map(world => world.id)).size, 8);
  for (const world of foundation.worlds) {
    const hash = foundation.routePath({ world: world.id });
    assert.deepEqual(foundation.parseRoute(hash), {
      utility: null, world: world.id, module: null, recordId: null, activeParent: world.id
    });
    assert.match(world.scene, /^assets\/scenes\/[a-z-]+\/hero\.png$/);
  }
});

test('every approved world has a separate local production scene and provenance', () => {
  const root = path.resolve(__dirname, '..');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/scenes/manifest.json'), 'utf8'));
  assert.equal(manifest.scenes.length, 8);
  assert.match(manifest.provenance, /generated for this OneSpace project/);
  assert.match(manifest.fallback, /CSS gradient/);
  for (const scene of manifest.scenes) {
    const world = foundation.worlds.find(candidate => candidate.id === scene.world);
    assert(world, scene.world);
    assert.equal(scene.file, world.scene);
    assert.notEqual(scene.file, scene.reference);
    assert.equal(fs.existsSync(path.join(root, scene.file)), true, scene.file);
    const signature = fs.readFileSync(path.join(root, scene.file)).subarray(0, 8);
    assert.deepEqual(signature, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
});

test('nested details, compatibility aliases and invalid routes preserve owner identity', () => {
  const detail = foundation.routePath({ world: 'work', module: 'projects', recordId: 'a b?1' });
  assert.equal(detail, '#/w/work/projects/a%20b%3F1');
  assert.deepEqual(foundation.parseRoute(detail), {
    utility: null, world: 'work', module: 'projects', recordId: 'a b?1', activeParent: 'work'
  });
  assert.equal(foundation.routePath({ world: 'projects' }), '#/w/work/projects');
  assert.equal(foundation.parseRoute('#/w/projects').activeParent, 'work');
  assert.equal(foundation.parseRoute('#/w/media').world, 'movies');
  assert.equal(foundation.parseRoute('#/u/notes').utility, 'notes');
  for (const invalid of ['#/w/unknown', '#/w/work/no-such-module', '#/w/work/projects/a%2Fb', '#/w/work/projects/%ZZ', '#/u/nope']) {
    assert.equal(foundation.parseRoute(invalid), null, invalid);
  }
});

function fakeHost() {
  return {
    classList: { add() {} },
    dataset: {},
    children: [],
    setAttribute() {},
    replaceChildren(...children) { this.children = children; }
  };
}
class PendingImage {
  constructor() { PendingImage.instances.push(this); }
  set src(value) { this._src = value; }
  get src() { return this._src; }
}
PendingImage.instances = [];

test('scene host falls back on failed local art and ignores stale image completion', async () => {
  PendingImage.instances = [];
  const host = fakeHost();
  const scene = foundation.createSceneHost(host, PendingImage);
  const first = scene.show('home');
  assert.equal(host.dataset.assetState, 'loading');
  assert.equal(PendingImage.instances[0].src, 'assets/scenes/home/hero.png');
  const second = scene.show('work');
  PendingImage.instances[0].onload();
  PendingImage.instances[1].onerror();
  assert.equal(await first, 'stale');
  assert.equal(await second, 'fallback');
  assert.equal(host.dataset.assetState, 'fallback');
  assert.equal(host.children.length, 0);
  const third = scene.show('games');
  PendingImage.instances[2].onload();
  assert.equal(await third, 'ready');
  assert.equal(host.children[0].src, 'assets/scenes/games/hero.png');
  scene.clear();
  assert.equal(host.dataset.assetState, 'empty');
  assert.equal(host.children.length, 0);
});
