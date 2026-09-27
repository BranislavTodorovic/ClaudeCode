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
test('movie details stays open when Watchlist or Watched save fails',()=>{
 let overlayClick,closes=0,accepted=false;
 const overlay={addEventListener:(type,listener)=>{if(type==='click')overlayClick=listener;}};
 const root={addEventListener:()=>{}};
 const ctx={document:{getElementById:id=>id==='moviesMount'?root:overlay},
  addToWatchlist:()=>accepted,addSeedToLibrary:()=>accepted,closeModal:()=>{closes++;}};
 vm.runInNewContext(fn('wireDelegatedEvents'),ctx);
 ctx.wireDelegatedEvents();
 for(const action of ['details-watchlist','details-watched']){
  overlayClick({target:{closest:()=>({dataset:{action,id:'seed'}})}});
  assert.equal(closes,0,action+' must leave details open after rejected persistence');
 }
 accepted=true;
 overlayClick({target:{closest:()=>({dataset:{action:'details-watched',id:'seed'}})}});
 assert.equal(closes,1,'successful save closes details');
});
test('Movies theme changes only after its preference saves',()=>{
 let accept=false,writes=0,rerenders=0;
 const root={attributes:{'data-movies-theme':'marquee'},setAttribute(key,value){this.attributes[key]=value;}};
 const body={dataset:{page:'movies'},attributes:{'data-movies-theme':'marquee'},setAttribute(key,value){this.attributes[key]=value;}};
 const buttons=['marquee','noir'].map(key=>({key,attributes:{'aria-pressed':key==='marquee'?'true':'false'},
  getAttribute:()=>key,setAttribute(name,value){this.attributes[name]=value;},classList:{toggle(){}}}));
 const ctx={document:{getElementById:()=>root,body,querySelectorAll:()=>buttons},
  THEME_DEFS:[{key:'marquee'},{key:'noir'}],MK:{theme:'orbit-movies-theme'},
  safeSet:(key,value)=>{writes++;assert.equal(key,'orbit-movies-theme');assert.equal(value,'noir');return accept;},
  renderAppearancePanel:()=>{rerenders++;}};
 vm.runInNewContext(fn('applyMoviesTheme'),ctx);
 assert.equal(ctx.applyMoviesTheme('noir'),false);
 assert.equal(root.attributes['data-movies-theme'],'marquee');
 assert.equal(body.attributes['data-movies-theme'],'marquee');
 assert.equal(buttons[0].attributes['aria-pressed'],'true');
 assert.equal(rerenders,0);
 accept=true;
 assert.equal(ctx.applyMoviesTheme('noir'),true);
 assert.equal(root.attributes['data-movies-theme'],'noir');
 assert.equal(body.attributes['data-movies-theme'],'noir');
 assert.equal(buttons[1].attributes['aria-pressed'],'true');
 assert.equal(rerenders,1);
 assert.equal(writes,2);
});
test('spotlight selection waits for persistence before changing the featured title',()=>{
 let accept=false,renders=0,playback=0;
 const announcement={textContent:''};
 const movies=[{id:'first',title:'First'},{id:'second',title:'Second'}];
 const ctx={featuredMovies:()=>movies,
  spotlight:{id:'first'},MK:{spotlight:'orbit-movies-spotlight'},
  safeSet:(key,value)=>{assert.equal(key,'orbit-movies-spotlight');assert.equal(value,'second');return accept;},
  renderSpotlight:()=>{renders++;},syncSpotlightPlayback:()=>{playback++;},
  document:{getElementById:()=>announcement}};
 vm.runInNewContext(fn('selectSpotlight'),ctx);
 assert.equal(ctx.selectSpotlight('second','manual'),false);
 assert.equal(ctx.spotlight.id,'first');assert.equal(renders,0);assert.equal(playback,0);
 assert.equal(announcement.textContent,'');
 accept=true;
 assert.equal(ctx.selectSpotlight('second','manual'),true);
 assert.equal(ctx.spotlight.id,'second');assert.equal(renders,1);assert.equal(playback,1);
 assert.equal(announcement.textContent,'Second selected.');
});
test('automatic rotation pause waits for persistence',()=>{
 let accept=false,syncs=0;
 const ctx={spotlight:{paused:false},MK:{autoplay:'orbit-movies-autoplay'},
  safeSet:(key,value)=>{assert.equal(key,'orbit-movies-autoplay');assert.equal(value,'paused');return accept;},
  syncSpotlightPlayback:()=>{syncs++;}};
 vm.runInNewContext(fn('toggleSpotlightPlayback'),ctx);
 assert.equal(ctx.toggleSpotlightPlayback(),false);
 assert.equal(ctx.spotlight.paused,false);assert.equal(syncs,0);
 accept=true;
 assert.equal(ctx.toggleSpotlightPlayback(),true);
 assert.equal(ctx.spotlight.paused,true);assert.equal(syncs,1);
});
test('Clear Filters retains existing preferences after rejected storage',()=>{
 let accept=false,renders=0;
 const previous={genres:['Drama']};
 const ctx={prefs:previous,MK:{prefs:'orbit-movies-preferences'},
  safeSet:()=>accept,defaultPrefs:()=>({genres:[]}),renderPrefGroups:()=>{renders++;},
  renderSuggestions:()=>{renders++;},showToast:()=>{renders++;}};
 const buttons={mvGetSuggestions:{addEventListener:()=>{}},mvClearFilters:{addEventListener:(type,listener)=>{buttons.clear=listener;}},
  mvResetPreferences:{addEventListener:()=>{}}};
 ctx.document={getElementById:id=>buttons[id]};
 for(const name of ['savePrefs','wireSuggestionsButtons'])vm.runInNewContext(fn(name),ctx);
 ctx.wireSuggestionsButtons();buttons.clear();
 assert.equal(ctx.prefs,previous);assert.equal(renders,0);
 accept=true;buttons.clear();
 assert.deepEqual(Array.from(ctx.prefs.genres),[]);assert.equal(renders,3);
});
test('Reset Preferences saves filters and dismissed titles atomically',()=>{
 let accept=false,renders=0;
 const previous={genres:['Drama']};
 const ctx={prefs:previous,dismissed:['seed'],MK:{prefs:'orbit-movies-preferences',dismissed:'orbit-movies-dismissed'},saveLibrary:()=>{},
  defaultPrefs:()=>({genres:[]}),window:{localStorage:{},OneSpaceStorage:{transaction:(store,data)=>{
    assert.deepEqual(JSON.parse(data['orbit-movies-preferences']),{genres:[]});
    assert.equal(data['orbit-movies-dismissed'],'[]');
    if(!accept)throw Error('Quota exceeded');
  }}},showToast:()=>{},renderPrefGroups:()=>{renders++;},renderSuggestions:()=>{renders++;}};
 const buttons={mvGetSuggestions:{addEventListener:()=>{}},mvClearFilters:{addEventListener:()=>{}},mvResetPreferences:{addEventListener:(type,listener)=>{buttons.reset=listener;}}};
 ctx.document={getElementById:id=>buttons[id]};
 for(const name of ['resetSuggestionPrefs','wireSuggestionsButtons'])vm.runInNewContext(fn(name),ctx);
 ctx.wireSuggestionsButtons();buttons.reset();
 assert.equal(ctx.prefs,previous);assert.deepEqual(ctx.dismissed,['seed']);assert.equal(renders,0);
 accept=true;buttons.reset();
 assert.deepEqual(Array.from(ctx.prefs.genres),[]);assert.deepEqual(Array.from(ctx.dismissed),[]);assert.equal(renders,2);
});
