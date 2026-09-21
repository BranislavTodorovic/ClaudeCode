const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const storage=require('./storage-setup'),shortcuts=require('../shared/shortcut-utils');
test('hidden built-ins round trip while old v4 backups retain compatibility',()=>{
 const values=new Map([['another-app','preserved']]),store={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const fixture=require('./fixtures/hidden-shortcuts-backup.json');storage.restore(store,fixture);assert.equal(store.getItem('orbit-hidden-links'),'["hm","zara","github"]');const backup=storage.backup(store);storage.reset(store);storage.restore(store,backup);assert.equal(store.getItem('orbit-hidden-links'),fixture.data['orbit-hidden-links']);assert.equal(store.getItem('another-app'),'preserved');
 storage.restore(store,require('./fixtures/complete-backup.json'));assert.equal(store.getItem('orbit-hidden-links'),null);assert.deepEqual(shortcuts.initialHidden(),['hm','zara','maxmara']);
 for(const bad of ['{}','["github","github"]','["<script>"]','[12]'])assert.equal(storage.valid('orbit-hidden-links',bad),false);
});
test('shortcut order is immutable, scoped and survives backup restore',()=>{
 const links=[{id:'one',category:'Development'},{id:'two',category:'Development'},{id:'trip',category:'Travel'}];
 const ids=shortcuts.reorder(links,'one','two');assert.deepEqual(ids,['two','one','trip']);assert.deepEqual(links.map(x=>x.id),['one','two','trip']);assert.deepEqual(shortcuts.ordered(links,ids).map(x=>x.id),ids);assert.deepEqual(shortcuts.reorder(links,'one','trip'),links.map(x=>x.id));
 const values=new Map([['orbit-shortcut-order',JSON.stringify(ids)]]),store={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};const backup=storage.backup(store);storage.reset(store);storage.restore(store,backup);assert.equal(store.getItem('orbit-shortcut-order'),JSON.stringify(ids));
});
test('shortcut controls honor ownership, preserve search and have no duplicate stub',()=>{
 const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8'),surface=fs.readFileSync(require('node:path').join(__dirname,'../shared/shortcut-surface.js'),'utf8');
 assert(html.includes('data-add-space="work"'));assert(html.includes('openShortcutModal(null,b.dataset.addSpace)'));assert(!html.includes('renderExplorePage();'));assert(!html.includes('duplicateShortcut'));assert(!html.includes('data-action="duplicate"'));assert(!html.includes('HIDDEN_DEFAULT_IDS'));assert(surface.includes("button('remove','Remove','trash')"));assert(surface.includes("button('up','Move earlier'"));assert(surface.includes("button('down','Move later'"));
});
