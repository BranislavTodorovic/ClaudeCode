const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const settings=require('../settings/settings'),storage=require('./storage-setup'),palettes=require('../settings/palette-tokens.json');
function memory(initial){const map=new Map(Object.entries(initial));return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};}
function luminance(hex){return hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);}
function contrast(a,b){a=luminance(a);b=luminance(b);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
test('complete palette tokens meet AA body, muted text and control contrast in both modes',()=>{
 for(const [id,p] of Object.entries(palettes.palettes))for(const mode of ['light','dark']){
  assert.equal(p[mode].length,palettes.tokens.length);const t=Object.fromEntries(palettes.tokens.map((key,i)=>[key,p[mode][i]]));
  for(const fg of ['text','muted','faint','accent'])for(const bg of ['bg','surface','surface-2'])assert(contrast(t[fg],t[bg])>=4.5,`${id} ${mode} ${fg}/${bg}: ${contrast(t[fg],t[bg])}`);
  assert(contrast(t.line,t.surface)>=3,`${id} ${mode} control borders`);
 }
});
test('preference reset preserves records, favorites, recents, collapsed sections and search provider',()=>{
 const preserved={'orbit-favorites':'["github"]','orbit-recent':'["github"]','orbit-collapsed-sections':'["Gaming"]','orbit-search-provider':'youtube','orbit-notes-list':'[{"id":"n","body":"Keep"}]','other-app':'keep'};
 const store=memory({...preserved,'orbit-theme':'dark','orbit-scene-intensity':'{"work":"off"}'});settings.reset(store,storage);
 for(const [k,v] of Object.entries(preserved))assert.equal(store.getItem(k),v);
 assert.equal(store.getItem('orbit-theme'),null);assert.equal(store.getItem('orbit-palette'),'auto');assert.equal(store.getItem('orbit-scene-intensity'),null);
});
test('preference reset rolls back on quota failure',()=>{
 const store=memory({'orbit-theme':'dark','orbit-palette':'sandstone'}),before=storage.snapshot(store),set=store.setItem;let n=0;
 store.setItem=(k,v)=>{if(++n===2)throw Error('quota');set(k,v);};assert.throws(()=>settings.reset(store,storage));assert.deepEqual(storage.snapshot(store),before);
});
test('scene intensity validates, round trips, and legacy v4 without optional preferences remains valid',()=>{
 assert(storage.valid('orbit-scene-intensity','{"home":"subtle","work":"off"}'));assert(!storage.valid('orbit-scene-intensity','{"work":"wild"}'));assert(!storage.valid('orbit-scene-intensity','{"unknown":"off"}'));
 const a=memory({'orbit-scene-intensity':'{"work":"off"}'}),b=memory({});storage.restore(b,storage.backup(a));assert.equal(b.getItem('orbit-scene-intensity'),a.getItem('orbit-scene-intensity'));
 const legacy=storage.backup(a);delete legacy.data['orbit-scene-intensity'];storage.restore(b,legacy);assert.equal(b.getItem('orbit-scene-intensity'),null);
});
test('settings memberships are declarative and page-accent has one stylesheet owner',()=>{
 const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),scene=fs.readFileSync(path.join(root,'shared/cinematic-scenes.js'),'utf8');
 assert(!scene.includes('fields.slice('));assert(html.includes('data-settings-group="motion"'));assert(!fs.readFileSync(path.join(root,'styles/pages.css'),'utf8').includes('--page-accent:'));
 const toggle=html.slice(html.indexOf('themeToggle.addEventListener("click"'),html.indexOf('  if (window.matchMedia)',html.indexOf('themeToggle.addEventListener("click"')));assert(!toggle.includes('paletteChoice ='));
});
