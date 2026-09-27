const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
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
test('Settings theme and background choices keep the visible preference after rejected writes',()=>{
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
 const paletteSource=html.match(/  function choosePalette\(next\) \{[\s\S]*?\n  \}/)?.[0];
 const backgroundSource=html.split('\n').find(line=>line.includes('document.querySelectorAll("[data-background-choice]").forEach')&&line.includes('addEventListener'));
 assert(paletteSource&&backgroundSource);
 let accept=false,applied=0,backgroundClick;const toasts=[];
 const button={getAttribute:()=> 'clean',addEventListener:(type,handler)=>{backgroundClick=handler;}};
 const context={paletteChoice:'auto',backgroundChoice:'orbit',paletteSetting:{value:'auto'},
   STORAGE:{palette:'palette',theme:'theme',background:'background'},
   safeSet:()=>accept,applyDashboardPreferences:()=>{applied++;},showToast:message=>toasts.push(message),
   document:{querySelectorAll:()=>[button]},window:{localStorage:{},OneSpaceStorage:{transaction:()=>{if(!accept)throw Error('quota');}}}};
 vm.runInNewContext(paletteSource+'\n'+backgroundSource,context);
 context.choosePalette('classic');assert.equal(context.paletteChoice,'auto');assert.equal(applied,0);
 context.choosePalette('auto');assert.equal(context.paletteChoice,'auto');assert.equal(applied,0);assert.match(toasts[0],/could not be saved/i);
 backgroundClick();assert.equal(context.backgroundChoice,'orbit');assert.equal(applied,0);
 accept=true;context.choosePalette('classic');backgroundClick();
 assert.equal(context.paletteChoice,'classic');assert.equal(context.backgroundChoice,'clean');assert.equal(applied,2);
});
test('Reset all data cancel and storage failure do not reload or claim success',()=>{
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
 const source=html.match(/  document\.getElementById\("resetAllDataBtn"\)\.addEventListener\("click", function \(\) \{[\s\S]*?\n  \}\);/)?.[0];
 assert(source,'Reset all data handler exists');
 let click,confirmed=false,resets=0,reloads=0;const toasts=[];
 const context={document:{getElementById:()=>({addEventListener:(type,handler)=>{click=handler;}})},
   window:{confirm:()=>confirmed,OneSpaceStorage:{reset:()=>{resets++;throw Error('quota');}},localStorage:{},
     setTimeout:()=>{reloads++;},location:{reload:()=>{reloads++;}}},showToast:message=>toasts.push(message)};
 vm.runInNewContext(source,context);
 click();assert.equal(resets,0);assert.equal(reloads,0);assert.equal(toasts.length,0);
 confirmed=true;click();assert.equal(resets,1);assert.equal(reloads,0);assert.deepEqual(toasts,['quota']);
});
test('leaving Minimal Mode commits both preferences before changing the view',()=>{
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
 const apply=html.match(/  function applyMinimalMode\(enabled, skipSave\) \{[\s\S]*?\n  \}/)?.[0];
 const set=html.match(/  function setStartupMode\(next\) \{[\s\S]*?\n  \}/)?.[0];
 assert(apply&&set);
 let reject=true,renders=0,visible='minimal';const toasts=[];
 const context={startupChoice:'minimal',startupSetting:{value:'minimal'},STORAGE:{startup:'startup',minimal:'minimal'},
   document:{body:{classList:{toggle:(name,enabled)=>{assert.equal(name,'minimal-mode');visible=enabled?'minimal':'full';}}}},
   window:{localStorage:{},OneSpaceStorage:{transaction:(store,writes)=>{assert.equal(writes.startup,'full');assert.equal(writes.minimal,'false');if(reject)throw Error('quota');}}},
   renderPersonalSections:()=>{renders++;},showToast:message=>toasts.push(message)};
 vm.runInNewContext(apply+'\n'+set,context);
 assert.equal(context.setStartupMode('full'),false);
 assert.equal(context.startupChoice,'minimal');assert.equal(visible,'minimal');assert.equal(renders,0);assert.match(toasts[0],/could not be saved/i);
 reject=false;assert.equal(context.setStartupMode('full'),true);
 assert.equal(context.startupChoice,'full');assert.equal(visible,'full');assert.equal(renders,1);
});
