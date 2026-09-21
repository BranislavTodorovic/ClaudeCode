'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createServer } = require('../server/_static-server');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const expectedScripts = [
  'explore/trip-board.js', 'shared/storage-utils.js', 'shared/catalog-utils.js',
  'shared/tooltip-utils.js', 'shared/shortcut-utils.js', 'personal/personal-controller.js',
  'shared/visual-utils.js', 'shared/domain-ui.js', 'shared/shortcut-surface.js',
  'work/projects.js', 'work/work-tracker.js', 'explore/explore-data.js',
  'explore/local-discovery.js', 'explore/discovery-ui.js', 'explore/explore-global.js',
  'games/game-resources.js', 'games/games-data.js', 'games/games.js',
  'movies/movies-data.js', 'movies/movies.js', 'shared/cinematic-scenes.js',
  'explore/discovery-integration.js'
];
function walk(dir, tests = false) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || ['node_modules','config','assets','docs','outputs','implementation-support'].includes(entry.name) || (!tests && entry.name === 'tests')) return [];
    const file = path.join(dir,entry.name);
    return entry.isDirectory() ? walk(file,tests) : /\.(js|mjs|css)$/.test(entry.name) ? [file] : [];
  });
}
function exists(relative, base = root) { assert(fs.existsSync(path.resolve(base,relative)), `Missing reference: ${relative} from ${base}`); }
test('all document script and stylesheet references resolve', () => {
  const refs = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
  for (const ref of refs) if (!ref.startsWith('data:')) exists(ref);
});
test('classic scripts preserve the exact baseline dependency order and inline boundary', () => {
  assert.deepEqual([...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]),expectedScripts);
  assert.equal([...html.matchAll(/<script\b[^>]*\b(?:defer|type="module")/g)].length,0);
  const controller=html.indexOf('var STORAGE =');
  assert(controller > html.indexOf('src="personal/personal-controller.js"'));
  assert(controller < html.indexOf('src="shared/visual-utils.js"'));
});
test('all literal relative requires in source and test files resolve', () => {
  for (const file of walk(root,true).filter(f=>/\.(js|mjs)$/.test(f))) {
    const source=fs.readFileSync(file,'utf8');
    for (const m of source.matchAll(/require\(['"](\.[^'"]+)['"]\)/g)) {
      assert.doesNotThrow(()=>require.resolve(path.resolve(path.dirname(file),m[1])),`${path.relative(root,file)}: ${m[1]}`);
    }
  }
});
test('literal artwork and stylesheet URLs resolve without moving assets', () => {
  for (const file of walk(root)) {
    const source=fs.readFileSync(file,'utf8');
    if(file.endsWith('.css')) {
      for(const m of source.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) if(!/^(?:data:|https?:|#)/.test(m[1]))exists(m[1],path.dirname(file));
    } else {
      for(const m of source.matchAll(/['"](assets\/[\w/.-]+\.(?:svg|webp|png|jpe?g|ico))['"]/g)) exists(m[1]);
    }
  }
  assert(fs.existsSync(path.join(root,'assets/destinations')));
});
test('recursive parse inventory covers every application JS file', () => {
  const source=walk(root).filter(f=>f.endsWith('.js'));
  assert.equal(source.length,24);
  for(const folder of ['shared','work','personal','games','movies','explore','server'])assert(source.some(f=>path.relative(root,f).startsWith(folder+path.sep)),folder);
  const parseTest=fs.readFileSync(path.join(root,'tests/data-regression.test.js'),'utf8');
  assert(parseTest.includes('walk(root)'));
});
test('browser entry and modules never load configuration or credential files', () => {
  for(const source of [html,...expectedScripts.map(f=>fs.readFileSync(path.join(root,f),'utf8'))]) {
    assert(!/(?:src|href)\s*=\s*['"][^'"]*(?:config|secrets)\//.test(source));
    assert(!/(?:fetch|require)\(\s*['"][^'"]*(?:config|secrets)\//.test(source));
    assert(!/TMDB_API_KEY|IGDB_CLIENT_SECRET|RAWG_API_KEY/.test(source));
  }
});
test('saved destination paths still satisfy all three existing validators', () => {
  const storage=require('../shared/storage-utils');
  const discovery=fs.readFileSync(path.join(root,'explore/local-discovery.js'),'utf8');
  const trips=fs.readFileSync(path.join(root,'explore/trip-board.js'),'utf8');
  for(const source of [fs.readFileSync(path.join(root,'shared/storage-utils.js'),'utf8'),discovery,trips])assert(source.includes('^assets\\/'));
  const fixture=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/complete-backup.json'),'utf8'));
  assert.doesNotThrow(()=>storage.validate(fixture.data));
});
test('static server serves Work but blocks existing credential-like JS and JSON', async () => {
  const server=createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const base=`http://127.0.0.1:${server.address().port}`;
    for(const url of ['/','/work/projects.js','/work/work-tracker.js','/work/tracker.css'])assert.equal((await fetch(base+url)).status,200,url);
    for(const url of ['/config/secrets/probe.js','/config/secrets/api-keys.json','/config/secrets.example.json','/server/_static-server.js','/tests/browser-server.js','/.git/config'])assert.equal((await fetch(base+url)).status,404,url);
  } finally { server.closeAllConnections();await new Promise(resolve=>server.close(resolve)); }
});
