const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),storage=require('./storage-setup');
const source=fs.readFileSync(path.join(__dirname,'../movies/movies.js'),'utf8');
function fn(name){let start=source.indexOf('  function '+name+'(');assert(start>=0,'Missing '+name);let end=source.indexOf('\n  function ',start+10);return source.slice(start,end<0?undefined:end);}
function setup(custom=false){const movie={id:'m',title:'A title',genre:['Drama'],platforms:[],type:'movie',custom,status:'watchlist'};const values=new Map([['orbit-movies-library',JSON.stringify([movie])],['orbit-movies-watchlist','["m"]'],['orbit-movies-untracked','[]']]);const store={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};const ctx={library:[movie],untracked:[],watchlist:['m'],MK:{library:'orbit-movies-library',watchlist:'orbit-movies-watchlist',untracked:'orbit-movies-untracked'},window:{confirm:()=>true,SEED_MOVIES:custom?[]:[movie],localStorage:store,OneSpaceStorage:storage,OneSpaceUI:{confirm:()=>{}}},safeGetJSON:(k,f)=>JSON.parse(values.get(k)||JSON.stringify(f)),showToast:()=>{},renderAll:()=>{},document:{getElementById:()=>null},closeModal:()=>{}};for(const name of ['findLibrary','findSeed','saveLibrary','watchlistItems','untrackMovie','deleteMovie'])vm.runInNewContext(fn(name),ctx);return {ctx,values};}
test('untrack removes any title and watchlist membership; custom titles remain re-addable',()=>{for(const custom of [false,true]){const {ctx,values}=setup(custom);ctx.untrackMovie('m',true);assert.equal(ctx.library.length,0);assert.equal(ctx.watchlistItems().length,0);assert.equal(JSON.parse(values.get('orbit-movies-library')).length,0);assert.equal(JSON.parse(values.get('orbit-movies-watchlist')).length,0);assert(ctx.findSeed('m'));if(custom)assert.equal(ctx.untracked.length,1);}});
test('watchlist uses library status after legacy migration',()=>{const {ctx}=setup();ctx.library[0].status='watched';assert.equal(ctx.watchlistItems().length,0);});
test('permanent custom deletion also removes the untracked catalog copy',()=>{const {ctx}=setup(true);ctx.untrackMovie('m',true);ctx.deleteMovie('m',true);assert.equal(ctx.untracked.length,0);assert.equal(ctx.findSeed('m'),undefined);});
test('untracked custom metadata survives backup and restore without resurrecting library membership',()=>{const {ctx,values}=setup(true);ctx.untrackMovie('m',true);const a={getItem:k=>values.get(k)??null},b=new Map(),store={getItem:k=>b.get(k)??null,setItem:(k,v)=>b.set(k,v),removeItem:k=>b.delete(k)};storage.restore(store,storage.backup(a));assert.equal(JSON.parse(b.get('orbit-movies-library')).length,0);assert.equal(JSON.parse(b.get('orbit-movies-untracked'))[0].title,'A title');});
test('shared confirmation waits for explicit approval before deleting custom titles',()=>{const {ctx}=setup(true);let approve;ctx.window.OneSpaceUI.confirm=(title,message,action)=>{approve=action;};ctx.deleteMovie('m');assert.equal(ctx.library.length,1);assert.equal(typeof approve,'function');approve();assert.equal(ctx.library.length,0);assert(!source.includes('window.confirm('));});
test('suggestion Add to Watchlist and Mark as Watched reject partial library writes',()=>{
 for(const status of ['watchlist','watched']){
 const seed={id:'seed',title:'Seed title',genre:['Drama'],platforms:[],type:'movie',custom:false};
 const values=new Map([['orbit-movies-library','[]'],['orbit-movies-watchlist','[]'],['orbit-movies-untracked','[]']]);
 let reject=true,renders=0;const toasts=[];
 const store={getItem:k=>values.get(k)??null,setItem:(k,v)=>{if(reject&&k==='orbit-movies-library')throw Error('Quota exceeded');values.set(k,v);},removeItem:k=>values.delete(k)};
 const ctx={library:[],untracked:[],watchlist:[],MK:{library:'orbit-movies-library',watchlist:'orbit-movies-watchlist',untracked:'orbit-movies-untracked'},
 window:{SEED_MOVIES:[seed],localStorage:store,OneSpaceStorage:storage},safeGetJSON:(k,f)=>JSON.parse(values.get(k)||JSON.stringify(f)),
 showToast:message=>toasts.push(message),renderAll:()=>{renders++;},statusLabel:status=>status};
 for(const name of ['findLibrary','findSeed','saveLibrary','addSeedToLibrary'])vm.runInNewContext(fn(name),ctx);
 assert.equal(ctx.addSeedToLibrary('seed',status),false);
 assert.equal(ctx.library.length,0);assert.equal(JSON.parse(values.get('orbit-movies-library')).length,0);assert.equal(renders,1);
 reject=false;ctx.addSeedToLibrary('seed',status);
 assert.equal(ctx.library.length,1);assert.equal(ctx.library[0].status,status);assert.equal(JSON.parse(values.get('orbit-movies-library')).length,1);
 assert(toasts.some(message=>/added to your library|marked as watched/.test(message)));
 }
});
test('suggestion Dismiss leaves the card visible when persistence rejects it',()=>{
 let accept=false,renders=0;const toasts=[];
 const ctx={dismissed:[],MK:{dismissed:'orbit-movies-dismissed'},safeSet:(key,value)=>{
  assert.equal(key,'orbit-movies-dismissed');assert.deepEqual(JSON.parse(value),['seed']);return accept;
 },renderSuggestions:()=>{renders++;},showToast:message=>toasts.push(message)};
 for(const name of ['saveDismissed','dismissSuggestion'])vm.runInNewContext(fn(name),ctx);
 assert.equal(ctx.dismissSuggestion('seed'),false);assert.equal(ctx.dismissed.length,0);assert.equal(renders,0);assert.equal(toasts.length,0);
 accept=true;assert.equal(ctx.dismissSuggestion('seed'),true);assert.deepEqual(Array.from(ctx.dismissed),['seed']);assert.equal(renders,1);
});
test('Watchlist Mark as Watched restores the prior status after rejected persistence',()=>{
 const {ctx,values}=setup(false);let renders=0;
 ctx.window.OneSpaceStorage={transaction:()=>{throw Error('Quota exceeded');}};
 ctx.renderAll=()=>{renders++;};
 vm.runInNewContext(fn('addSeedToLibrary'),ctx);
 assert.equal(ctx.addSeedToLibrary('m','watched'),false);
 assert.equal(ctx.library[0].status,'watchlist');
 assert.equal(JSON.parse(values.get('orbit-movies-library'))[0].status,'watchlist');
 assert.equal(renders,1);
});
test('Watchlist Remove retains membership after a rejected transaction',()=>{
 const {ctx,values}=setup(false);let renders=0;
 ctx.window.OneSpaceStorage={transaction:()=>{throw Error('Quota exceeded');}};
 ctx.renderAll=()=>{renders++;};
 vm.runInNewContext(fn('removeFromWatchlist'),ctx);
 ctx.removeFromWatchlist('m');
 assert.equal(ctx.library[0].status,'watchlist');
 assert.equal(JSON.parse(values.get('orbit-movies-library'))[0].status,'watchlist');
 assert.equal(renders,1);
});
test('custom title Delete retains the title after rejected persistence',()=>{
 const {ctx,values}=setup(true);let renders=0;
 ctx.window.OneSpaceStorage={transaction:()=>{throw Error('Quota exceeded');}};
 ctx.renderAll=()=>{renders++;};
 assert.equal(ctx.deleteMovie('m',true),false);
 assert.equal(ctx.library.length,1);
 assert.equal(JSON.parse(values.get('orbit-movies-library')).length,1);
 assert.equal(renders,1);
});
test('custom title Edit rolls back the prior metadata after rejected persistence',()=>{
 const {ctx,values}=setup(true);
 ctx.window.OneSpaceStorage={transaction:()=>{throw Error('Quota exceeded');}};
 ctx.library[0].title='Unsaved title';
 assert.equal(ctx.saveLibrary(),false);
 assert.equal(ctx.library[0].title,'A title');
 assert.equal(JSON.parse(values.get('orbit-movies-library'))[0].title,'A title');
});
test('Movies Get Suggestions keeps the current tab after a rejected route write',()=>{
 let accept=false,visible='',animations=0,reveals=0;
 const ctx={activeTab:'overview',TABS:['overview','suggestions'],MK:{activeTab:'orbit-movies-active-tab'},
 safeSet:(key,value)=>{assert.equal(key,'orbit-movies-active-tab');assert.equal(value,'suggestions');return accept;},
 applyTabVisibility:tab=>{visible=tab;},playPanelAnimation:()=>{animations++;},wireReveal:()=>{reveals++;},
 document:{querySelector:()=>({})}};
 vm.runInNewContext(fn('switchTab'),ctx);
 assert.equal(ctx.switchTab('suggestions'),false);assert.equal(ctx.activeTab,'overview');assert.equal(visible,'');assert.equal(animations,0);
 accept=true;assert.equal(ctx.switchTab('suggestions'),true);assert.equal(ctx.activeTab,'suggestions');assert.equal(visible,'suggestions');assert.equal(reveals,1);
});
