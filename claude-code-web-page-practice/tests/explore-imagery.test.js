'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const storage = require('./storage-setup');
const local = require('../explore/local-discovery');
const trips = require('../explore/trip-board');

function catalog() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'explore/explore-data.js'), 'utf8'), context);
  return context.window.DESTINATIONS;
}

function webpSize(file) {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  assert.equal(bytes.toString('ascii', 12, 16), 'VP8 ');
  return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
}

test('explore-data owns a unique, fully shaped twelve-destination catalog', () => {
  const rows = catalog();
  assert.equal(rows.length, 12);
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  for (const destination of rows) {
    for (const field of ['id','name','country','budget','climate','region','summary','details','image','fallback']) {
      assert.equal(typeof destination[field], 'string', destination.id + ' ' + field);
      assert(destination[field].trim(), destination.id + ' ' + field + ' is non-empty');
    }
    for (const field of ['categories','seasons','duration','styles','tags','links']) {
      assert(Array.isArray(destination[field]) && destination[field].length, destination.id + ' ' + field);
    }
  }
});

test('all curated destinations expose licensed card, hero and deterministic fallback artwork', () => {
  const rows = catalog(), manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/manifest.json'), 'utf8'));
  assert.equal(rows.length, 12);
  assert.equal(manifest.destinations.length, 12);
  for (const destination of rows) {
    assert(storage.validDestination(destination), destination.id);
    assert.match(destination.cardImage, new RegExp('/' + destination.id + '-card\\.webp$'));
    assert.match(destination.heroImage, new RegExp('/' + destination.id + '-hero\\.webp$'));
    assert.match(destination.fallbackImage, new RegExp('/' + destination.id + '\\.svg$'));
    assert(destination.imageAlt.length > 12, destination.id + ' alt');
    assert.match(destination.photoSource.sourceUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.match(destination.photoSource.license, /^(?:CC0|CC BY(?:-SA)?)/);
    for (const field of ['cardImage','heroImage','fallbackImage']) {
      assert.match(destination[field], /^assets\/destinations\/[\w-]+(?:-(?:card|hero))?\.(?:webp|svg)$/);
      assert.equal(local.media(destination[field]), destination[field], destination.id + ' local media path');
      assert(fs.existsSync(path.join(root, destination[field])), destination[field]);
    }
    assert(trips.destination(local.normalize(destination, 'destinations')), destination.id + ' trip-board path');
    assert.deepEqual(webpSize(path.join(root, destination.cardImage)), [640, 420]);
    assert.deepEqual(webpSize(path.join(root, destination.heroImage)), [1600, 900]);
    const entry = manifest.destinations.find(item => item.id === destination.id);
    assert(entry, destination.id + ' manifest');
    assert.equal(entry.card.file, destination.cardImage);
    assert.equal(entry.hero.file, destination.heroImage);
    assert.equal(entry.fallback, destination.fallbackImage);
  }
});

test('local discovery preserves image roles, attribution and failure-only fallback metadata', () => {
  for (const destination of catalog()) {
    const item = local.normalize(destination, 'destinations');
    assert.equal(item.image, destination.cardImage);
    assert.equal(item.cardImage, destination.cardImage);
    assert.equal(item.heroImage, destination.heroImage);
    assert.equal(item.fallbackImage, destination.fallbackImage);
    assert.equal(item.imageAlt, destination.imageAlt);
    assert.equal(item.photos[0].sourceUrl, destination.photoSource.sourceUrl);
    assert.equal(item.source.license, destination.photoSource.license);
  }
  const ui = fs.readFileSync(path.join(root, 'explore/discovery-ui.js'), 'utf8');
  assert(ui.includes("role==='hero'"));
  assert(ui.includes('data-asset-role'));
  assert(ui.includes('data-fallback-src'));
  assert(ui.includes("img.removeAttribute('srcset')"));
  assert(ui.includes("photo(x,'hero')"));
});

test('every curated destination has concise card copy and substantive planning detail', () => {
  const seasonWords = /\b(?:spring|summer|autumn|winter)\b/i;
  const durationWords = /\b(?:day|days|night|nights|week|weekend)\b/i;
  const budgetWords = /\b(?:budget|cost|costs|lower-budget|mid-range|higher-budget)\b/i;
  for (const destination of catalog()) {
    const detailWords = destination.details.trim().split(/\s+/);
    assert(destination.summary.length <= 80, destination.id + ' card summary stays concise');
    assert(detailWords.length >= 90, destination.id + ' has substantive detail');
    assert.match(destination.details, seasonWords, destination.id + ' states a season and rationale');
    assert.match(destination.details, durationWords, destination.id + ' states a rough trip length');
    assert.match(destination.details, budgetWords, destination.id + ' describes budget character');
    assert.match(destination.details, /\b(?:visit|walk|hike|explore|swim|browse|take|join|tour|circle)\b/i, destination.id + ' suggests concrete activities');
  }
});

test('destination license metadata agrees across catalog, manifest and colocated source ledger', () => {
  const rows = catalog();
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/manifest.json'), 'utf8'));
  const sources = fs.readFileSync(path.join(root, 'assets/destinations/SOURCES.md'), 'utf8');
  assert.match(sources, /Wikimedia Commons/);
  assert.match(sources, /\*-card\.webp.*640 × 420/);
  assert.match(sources, /\*-hero\.webp.*1600 × 900/);
  for (const destination of rows) {
    const entry = manifest.destinations.find(item => item.id === destination.id);
    assert.equal(entry.source, destination.photoSource.sourceUrl, destination.id + ' source');
    assert.equal(entry.author, destination.photoSource.credit, destination.id + ' author');
    assert.equal(entry.license, destination.photoSource.license, destination.id + ' license');
    assert.equal(entry.licenseUrl, destination.photoSource.licenseUrl, destination.id + ' license URL');
    assert(sources.includes(destination.photoSource.sourceUrl), destination.id + ' source ledger URL');
    assert(sources.includes(destination.photoSource.credit), destination.id + ' source ledger author');
    assert(sources.includes(destination.photoSource.licenseUrl), destination.id + ' source ledger license URL');
  }
});
