const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const resources=require('../games/game-resources'),storage=require('./storage-setup');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
function fn(name){const s=read('games/games.js'),start=s.indexOf('  function '+name+'('),end=s.indexOf('\n  function ',start+10);if(start<0)throw Error('Missing '+name);return s.slice(start,end<0?undefined:end);}
test('live-service inference and catalog chapter outlines select the appropriate tracker',()=>{
 assert.equal(resources.infer({tags:['MMO']}),'weekly');assert.equal(resources.infer({genres:['Story-rich']}),'story');assert.equal(resources.infer({tags:['Battle royale']}),'weekly');
 const context={window:{OneSpaceGameResources:resources}};vm.runInNewContext(read('games/games-data.js'),context);
 for(const g of context.window.SUGGESTION_CATALOG){assert(['weekly','story'].includes(g.trackerType));if(g.trackerType==='story')assert(resources.story(g,(()=>{let i=0;return p=>p+(++i);})()).chapters.length>=2,g.title);}
});
test('weekly templates take precedence over story defaults and reset preserves the game template',()=>{
 const g={id:'g',trackerType:'weekly',defaultTasks:['Story task'],weeklyTemplate:[{id:'raid',label:'Raid with the guild'},{id:'reward',label:'Claim weekly rewards'}]};
 assert.deepEqual(resources.weekly(g).map(x=>x.label),['Raid with the guild','Claim weekly rewards']);
 const context={library:[g],weekly:{},GK:{weekly:'orbit-games-weekly'},window:{OneSpaceGameResources:resources},getISOWeekKey:()=> '2026-W39',safeSet:()=>true,showToast:()=>{},renderAll:()=>{}};vm.runInNewContext(fn('cloneWeeklyTemplate')+fn('resetWeekly'),context);context.resetWeekly('g',true);assert.equal(context.weekly.g.tasks.length,2);
});
test('objective and weekly toggles are involutions and rejected writes never advance the rendered state',()=>{
 const game={id:'g',name:'Test',trackerType:'story',story:{chapters:[{id:'c',title:'Chapter',objectives:[{id:'o',text:'Objective',done:false}]}]}},initialWeekly={g:{weekKey:'2026-W39',tasks:[{id:'t',label:'Task',done:false}]}};
 for(const reject of [false,true]){
  const values=new Map([['orbit-games-library',JSON.stringify([game])],['orbit-games-weekly',JSON.stringify(initialWeekly)]]);let writes=0;
  const store={getItem:k=>values.get(k)??null,setItem:(k,v)=>{if(reject&&++writes===1)throw Error('Quota exceeded');values.set(k,v);},removeItem:k=>values.delete(k)};
  const context={library:JSON.parse(values.get('orbit-games-library')),weekly:JSON.parse(values.get('orbit-games-weekly')),selectedStoryGameId:'g',GK:{library:'orbit-games-library',weekly:'orbit-games-weekly'},window:{localStorage:store,OneSpaceStorage:storage,OneSpaceGameResources:resources},safeGetJSON:(k,f)=>JSON.parse(values.get(k)||JSON.stringify(f)),safeSet:(k,v)=>{try{store.setItem(k,v);return true;}catch(_){return false;}},showToast:()=>{},withFocusPreserved:f=>f(),ensureWeekly:()=>context.weekly.g,renderAll:()=>{},lastCheckedObjectiveId:null,lastCheckedTaskId:null};
  for(const name of ['saveLibrary','commitGameChanges','saveWeekly','findChapter','toggleObjective','toggleWeeklyTask'])vm.runInNewContext(fn(name),context);
  context.toggleObjective('c','o','g');assert.equal(context.library[0].story.chapters[0].objectives[0].done,!reject);
  assert.equal(JSON.stringify(context.library),values.get('orbit-games-library'));
  if(!reject){for(let i=1;i<10;i++)context.toggleObjective('c','o','g');assert.equal(context.library[0].story.chapters[0].objectives[0].done,false);for(let i=0;i<10;i++)context.toggleWeeklyTask('g','t');assert.equal(context.weekly.g.tasks[0].done,false);}
 }
});
test('type changes preserve each tracker history and keep only the active tracker live',()=>{
 let i=0;const uid=p=>p+(++i),game={id:'g',name:'Hades',trackerType:'story',story:resources.story({name:'Hades'},uid)},weekly={};game.story.chapters[0].objectives[0].done=true;
 resources.reconcile(game,weekly,'weekly',uid);assert.equal(game.story,undefined);weekly.g={weekKey:'2026-W39',tasks:resources.weekly(game)};weekly.g.tasks[0].done=true;
 resources.reconcile(game,weekly,'story',uid);assert.equal(weekly.g,undefined);assert.equal(game.story.chapters[0].objectives[0].done,true);
 resources.reconcile(game,weekly,'weekly',uid);assert.equal(weekly.g.tasks[0].done,true);
 assert(storage.valid('orbit-games-library',JSON.stringify([game])));
});
test('weekly rollover occurs once and keeps subsequent toggles within the new week',()=>{
 let saves=0;const context={weekly:{g:{weekKey:'old',tasks:[{id:'t',done:true}]}},getISOWeekKey:()=> 'new',cloneWeeklyTemplate:()=>[{id:'t',label:'Task',done:false}],saveWeekly:()=>{saves++;return true;}};vm.runInNewContext(fn('ensureWeekly'),context);const entry=context.ensureWeekly('g');assert.equal(entry.tasks[0].done,false);entry.tasks[0].done=true;assert.equal(context.ensureWeekly('g').tasks[0].done,true);assert.equal(saves,1);
});
test('spotlight includes custom games without artwork',()=>{const context={library:[{id:'art',artwork:'local.jpg'},{id:'custom'}]};vm.runInNewContext(fn('featuredGames'),context);assert.equal(context.featuredGames().length,2);});
test('focus restoration treats quoted ids as values, not selector syntax',()=>{
 const attrs={'data-action':'toggle-objective','data-id':'quote"id'},active={getAttribute:k=>attrs[k]??null,closest:()=>null};let focused=false;
 const context={document:{activeElement:active,querySelector:()=>{throw Error('Unsafe selector');},querySelectorAll:()=>[{getAttribute:k=>attrs[k]??null,closest:()=>null,focus:()=>{focused=true;}}]}};
 vm.runInNewContext(fn('withFocusPreserved'),context);context.withFocusPreserved(()=>{});assert(focused);
});
test('weekly write failure rolls back both transaction keys and rendered completion',()=>{
 const values=new Map([['orbit-games-library',JSON.stringify([{id:'g',name:'Weekly',trackerType:'weekly'}])],['orbit-games-weekly',JSON.stringify({g:{weekKey:'new',tasks:[{id:'t',label:'Task',done:false}]}})]]);let writes=0,rendered;
 const store={getItem:k=>values.get(k)??null,setItem:(k,v)=>{if(++writes===2)throw Error('Quota exceeded');values.set(k,v);},removeItem:k=>values.delete(k)};
 const context={library:JSON.parse(values.get('orbit-games-library')),weekly:JSON.parse(values.get('orbit-games-weekly')),GK:{library:'orbit-games-library',weekly:'orbit-games-weekly'},window:{localStorage:store,OneSpaceStorage:storage},safeGetJSON:(k,f)=>JSON.parse(values.get(k)||JSON.stringify(f)),showToast:()=>{},withFocusPreserved:f=>f(),ensureWeekly:()=>context.weekly.g,renderAll:()=>{rendered=context.weekly.g.tasks[0].done;},lastCheckedTaskId:null};
 for(const name of ['commitGameChanges','saveWeekly','toggleWeeklyTask'])vm.runInNewContext(fn(name),context);
 context.library[0].name='Changed in the same transaction';context.toggleWeeklyTask('g','t');assert.equal(rendered,false);assert.equal(JSON.stringify(context.weekly),values.get('orbit-games-weekly'));assert.equal(JSON.stringify(context.library),values.get('orbit-games-library'));
});
test('Delete game waits for confirmation and retains game and trackers on failed transaction',()=>{
 const game={id:'g',name:'Keep game',trackerType:'weekly'},weekly={g:{weekKey:'2026-W39',tasks:[{id:'t',label:'Keep task',done:true}]}},sessions=[{id:'s',gameId:'g'}],journal=[];
 let confirm,renderCount=0;const toasts=[];
 const context={library:[game],weekly,sessions,journal,GK:{library:'orbit-games-library',weekly:'orbit-games-weekly',sessions:'orbit-games-sessions',journal:'orbit-games-journal'},
  window:{OneSpaceGameResources:resources,OneSpaceUI:{confirm:(title,message,action)=>{confirm=action;}},OneSpaceStorage:{transaction:()=>{throw Error('Quota exceeded');}},localStorage:{}},
  showToast:message=>toasts.push(message),renderAll:()=>{renderCount++;},selectedStoryGameId:null,selectedWeeklyGameId:'g',activeSession:()=>true,stopSessionTicker:()=>{}};
 vm.runInNewContext(fn('deleteGame'),context);
 context.deleteGame('g');assert.equal(typeof confirm,'function');assert.equal(context.library.length,1);
 assert.equal(confirm(),false);assert.equal(context.library.length,1);assert.equal(context.weekly.g.tasks[0].done,true);assert.equal(context.sessions.length,1);assert.equal(renderCount,0);
 assert.deepEqual(toasts,['Quota exceeded']);
});
test('Spotlight selection commits both keys before changing the visible game',()=>{
 const game={id:'g2',name:'Second game',trackerType:'story'};
 let reject=true,renderCount=0,announcement='';const toasts=[];
 const context={library:[game],spotlight:{id:'g1'},selectedStoryGameId:'g1',GK:{selectedStory:'orbit-games-selected-story',selectedWeekly:'orbit-games-selected-weekly'},
  window:{localStorage:{},OneSpaceStorage:{transaction:(store,writes)=>{if(reject)throw Error('Quota exceeded');assert.equal(writes['orbit-games-spotlight'],'g2');assert.equal(writes['orbit-games-selected-story'],'g2');}}},
  document:{getElementById:()=>({set textContent(value){announcement=value;}})},showToast:message=>toasts.push(message),renderMissionsPanel:()=>{},renderWeeklyPanel:()=>{},renderSpotlight:()=>{renderCount++;},statsFor:()=>({percent:0}),syncSpotlightPlayback:()=>{}};
 vm.runInNewContext(fn('selectSpotlight'),context);
 assert.equal(context.selectSpotlight('g2','manual'),false);
 assert.equal(context.spotlight.id,'g1');assert.equal(context.selectedStoryGameId,'g1');assert.equal(renderCount,0);assert.equal(announcement,'');
 assert.deepEqual(toasts,['Changes could not be saved. Please try again.']);
 reject=false;assert.equal(context.selectSpotlight('g2','manual'),true);
 assert.equal(context.spotlight.id,'g2');assert.equal(context.selectedStoryGameId,'g2');assert.equal(renderCount,1);assert.match(announcement,/Second game selected/);
});
test('Open Progress does not navigate when Spotlight selection cannot be persisted',()=>{
 const game={id:'g',trackerType:'story'};let fail=true,focusCount=0;
 const context={library:[game],activeTab:'library',selectSpotlight:()=>fail?false:true,
  switchTab:tab=>{context.activeTab=tab;},focusPanel:()=>{focusCount++;}};
 vm.runInNewContext(fn('goToTracker'),context);
 assert.equal(context.goToTracker('g'),false);assert.equal(context.activeTab,'library');assert.equal(focusCount,0);
 fail=false;assert.equal(context.goToTracker('g'),true);assert.equal(context.activeTab,'missions');assert.equal(focusCount,1);
});
test('Edit Game retains the prior library and tracker when its write fails',()=>{
 const game={id:'g',name:'Original game',genre:'Adventure',genres:['Adventure','Story-rich'],platform:'PC',platforms:['PC'],logo:{kind:'asset',src:'local.svg'},trackerType:'story',story:{chapters:[]},custom:false};
 const before=JSON.stringify([game]),weeklyBefore=JSON.stringify({g:{weekKey:'old',tasks:[]}});
 const elements={};for(const id of ['addGameBtn','addGameClose','addGameCancel','addGameGenre','addGameLogoFile','addGameLogoRemove','addGameForm','addGameError','addGameName','addGameId','addGamePlatform','addGameAccent','addGameOverlay'])elements[id]={value:'',textContent:'',addEventListener(type,callback){this[type]=callback;}};
 Object.assign(elements.addGameName,{value:'Edited game'});Object.assign(elements.addGameId,{value:'g'});Object.assign(elements.addGameGenre,{value:'Adventure'});Object.assign(elements.addGamePlatform,{value:'PC'});Object.assign(elements.addGameAccent,{value:'#7a8fff'});
 let closed=false,renderCount=0;const context={library:[game],weekly:{g:{weekKey:'old',tasks:[]}},draftLogoDataUrl:null,draftTrackerType:'story',uid:()=> 'new',
  document:{getElementById:id=>elements[id],querySelectorAll:()=>[],addEventListener:()=>{}},
  window:{OneSpaceGameResources:{reconcile:()=>{}}},
  commitGameChanges:()=>{context.library=[];context.weekly={};return false;},
  closeModal:()=>{closed=true;},renderAll:()=>{renderCount++;},showToast:()=>{},ensureWeekly:()=>{},starterStory:()=>({chapters:[]})};
 vm.runInNewContext(fn('wireAddGameModal'),context);
 context.wireAddGameModal();
 elements.addGameForm.submit({preventDefault(){}});
 assert.equal(JSON.stringify(context.library),before);assert.equal(JSON.stringify(context.weekly),weeklyBefore);
 assert.equal(closed,false);assert.equal(renderCount,1);assert.match(elements.addGameError.textContent,/could not be saved/i);
});
test('Edit objective leaves the active story untouched after a rejected write',()=>{
 const game={id:'g',story:{chapters:[{id:'c',objectives:[{id:'o',text:'Original objective',done:false}]}]}};
 let reject=true,renderCount=0;
 const context={library:[game],selectedStoryGameId:'g',GK:{library:'orbit-games-library'},
  findChapter:()=>context.library[0].story.chapters[0],safeSet:()=>!reject,renderAll:()=>{renderCount++;}};
 vm.runInNewContext(fn('commitEditObjective'),context);
 assert.equal(context.commitEditObjective('c','o','Changed objective'),false);
 assert.equal(context.library[0].story.chapters[0].objectives[0].text,'Original objective');assert.equal(renderCount,0);
 reject=false;assert.equal(context.commitEditObjective('c','o','Changed objective'),true);
 assert.equal(context.library[0].story.chapters[0].objectives[0].text,'Changed objective');assert.equal(renderCount,1);
});
test('Delete objective waits for confirmation and preserves it after a rejected write',()=>{
 const game={id:'g',story:{chapters:[{id:'c',objectives:[{id:'o',text:'Keep objective',done:false}]}]}};
 let confirm,reject=true,renderCount=0,focused=false;const toasts=[];
 const context={library:[game],selectedStoryGameId:'g',GK:{library:'orbit-games-library'},
  window:{OneSpaceUI:{confirm:(title,message,action)=>{confirm=action;}}},
  findChapter:()=>context.library[0].story.chapters[0],safeSet:()=>!reject,renderAll:()=>{renderCount++;},showToast:message=>toasts.push(message),
  setTimeout:callback=>callback(),document:{querySelectorAll:()=>[{getAttribute:()=> 'c',focus:()=>{focused=true;}}]}};
 vm.runInNewContext(fn('deleteObjective'),context);
 context.deleteObjective('c','o');assert.equal(typeof confirm,'function');assert.equal(context.library[0].story.chapters[0].objectives.length,1);
 assert.equal(confirm(),false);assert.equal(context.library[0].story.chapters[0].objectives.length,1);assert.equal(renderCount,0);
 reject=false;assert.equal(confirm(),true);assert.equal(context.library[0].story.chapters[0].objectives.length,0);
 assert.equal(renderCount,1);assert.equal(focused,true);assert.deepEqual(toasts,['Objective deleted.']);
});
test('Chapter collapse is reversible and does not advance after a rejected write',()=>{
 const game={id:'g',story:{chapters:[{id:'c',expanded:true,objectives:[]}]}};
 let reject=true,renderCount=0;
 const context={library:[game],selectedStoryGameId:'g',GK:{library:'orbit-games-library'},
  findChapter:()=>context.library[0].story.chapters[0],safeSet:()=>!reject,withFocusPreserved:callback=>callback(),renderAll:()=>{renderCount++;}};
 vm.runInNewContext(fn('toggleChapter'),context);
 assert.equal(context.toggleChapter('c'),false);assert.equal(context.library[0].story.chapters[0].expanded,true);assert.equal(renderCount,0);
 reject=false;assert.equal(context.toggleChapter('c'),true);assert.equal(context.library[0].story.chapters[0].expanded,false);
 assert.equal(context.toggleChapter('c'),true);assert.equal(context.library[0].story.chapters[0].expanded,true);assert.equal(renderCount,2);
});
test('Reset Weekly Tasks waits for confirmation and keeps completed tasks on failed write',()=>{
 const game={id:'g',name:'Weekly game',trackerType:'weekly'},weekly={g:{weekKey:'2026-W39',tasks:[{id:'t',label:'Weekly task',done:true}]}};
 let confirm,reject=true,renderCount=0;const toasts=[];
 const context={library:[game],weekly,GK:{weekly:'orbit-games-weekly'},
  window:{OneSpaceUI:{confirm:(title,message,action)=>{confirm=action;}}},
  getISOWeekKey:()=> '2026-W39',cloneWeeklyTemplate:()=>[{id:'t',label:'Weekly task',done:false}],safeSet:()=>!reject,
  showToast:message=>toasts.push(message),renderAll:()=>{renderCount++;}};
 vm.runInNewContext(fn('resetWeekly'),context);
 context.resetWeekly('g');assert.equal(typeof confirm,'function');assert.equal(context.weekly.g.tasks[0].done,true);
 assert.equal(confirm(),false);assert.equal(context.weekly.g.tasks[0].done,true);assert.equal(renderCount,0);
 reject=false;assert.equal(confirm(),true);assert.equal(context.weekly.g.tasks[0].done,false);assert.equal(renderCount,1);
 assert.deepEqual(toasts,['Weekly tasks reset.']);
});
test('Games theme does not show an unpersisted choice after a rejected write',()=>{
 let reject=true,themeAttribute='',bodyTheme='',renderCount=0;
 const buttons=['midnight','neon'].map(value=>({getAttribute:()=>value,classList:{toggle(){}},setAttribute(){}}));
 const context={GK:{theme:'orbit-games-theme'},safeSet:()=>!reject,renderAppearancePanel:()=>{renderCount++;},
  document:{getElementById:()=>({setAttribute:(key,value)=>{themeAttribute=value;}}),body:{dataset:{page:'games'},setAttribute:(key,value)=>{bodyTheme=value;}},querySelectorAll:()=>buttons}};
 vm.runInNewContext(fn('applyGamesTheme'),context);
 assert.equal(context.applyGamesTheme('neon'),false);assert.equal(themeAttribute,'');assert.equal(bodyTheme,'');assert.equal(renderCount,0);
 reject=false;assert.equal(context.applyGamesTheme('neon'),true);assert.equal(themeAttribute,'neon');assert.equal(bodyTheme,'neon');assert.equal(renderCount,1);
});
test('wishlist and dismissed suggestions retain visible records after rejected writes',()=>{
 const saved={'wishlist':'["hades"]','dismissed':'[]'};let reject=true,wishlistRenders=0,suggestionRenders=0;const toasts=[];
 const context={GK:{wishlist:'wishlist',dismissed:'dismissed'},safeGetJSON:(key,fallback)=>JSON.parse(saved[key]||JSON.stringify(fallback)),
  safeSet:(key,value)=>{if(reject)return false;saved[key]=value;return true;},renderWishlist:()=>{wishlistRenders++;},renderSuggestions:()=>{suggestionRenders++;},showToast:message=>toasts.push(message)};
 for(const name of ['addToWishlist','removeFromWishlist','dismissSuggestion'])vm.runInNewContext(fn(name),context);
 assert.equal(context.addToWishlist('hollow-knight'),false);assert.equal(context.removeFromWishlist('hades'),false);assert.equal(context.dismissSuggestion('outer-wilds'),false);
 assert.equal(saved.wishlist,'["hades"]');assert.equal(saved.dismissed,'[]');assert.equal(wishlistRenders,0);assert.equal(suggestionRenders,0);assert.deepEqual(toasts,[]);
 reject=false;assert.equal(context.addToWishlist('hollow-knight'),true);assert.equal(context.removeFromWishlist('hades'),true);assert.equal(context.dismissSuggestion('outer-wilds'),true);
 assert.deepEqual(JSON.parse(saved.wishlist),['hollow-knight']);assert.deepEqual(JSON.parse(saved.dismissed),['outer-wilds']);
});
test('Stop Session keeps the timer active and stored record unchanged after a rejected write',()=>{
 const original=[{id:'s',gameId:'g',start:'2026-09-24T10:00:00.000Z',end:null,minutes:null,note:''}];
 let tickerStopped=false,renderCount=0;const toasts=[];
 const context={sessions:JSON.parse(JSON.stringify(original)),GK:{sessions:'orbit-games-sessions'},activeSession:()=>context.sessions.find(s=>s.end===null),
  safeSet:()=>false,safeGetJSON:()=>JSON.parse(JSON.stringify(original)),stopSessionTicker:()=>{tickerStopped=true;},renderSessionsPanel:()=>{renderCount++;},showToast:message=>toasts.push(message)};
 for(const name of ['saveSessions','stopSession'])vm.runInNewContext(fn(name),context);
 assert.equal(context.stopSession(),false);assert.equal(JSON.stringify(context.sessions),JSON.stringify(original));assert.equal(tickerStopped,false);assert.equal(renderCount,1);assert.deepEqual(toasts,[]);
});
test('Delete session requires confirmation and keeps the log on rejected writes',()=>{
 const original=[{id:'s',gameId:'g',end:'2026-09-24T11:00:00.000Z',minutes:20}];let confirm,reject=true,renderCount=0;const toasts=[];
 const context={sessions:original,GK:{sessions:'orbit-games-sessions'},window:{OneSpaceUI:{confirm:(title,message,action)=>{confirm=action;}}},
  safeSet:()=>!reject,renderSessionsPanel:()=>{renderCount++;},showToast:message=>toasts.push(message)};
 vm.runInNewContext(fn('deleteSession'),context);
 context.deleteSession('s');assert.equal(typeof confirm,'function');assert.equal(context.sessions.length,1);
 assert.equal(confirm(),false);assert.equal(context.sessions.length,1);assert.equal(renderCount,0);
 reject=false;assert.equal(confirm(),true);assert.equal(context.sessions.length,0);assert.equal(renderCount,1);assert.deepEqual(toasts,['Session deleted.']);
});
test('Journal edit retains the stored entry and form draft after a rejected write',()=>{
 const original={id:'j',title:'Original',body:'Original body',gameId:null,date:'2026-09-24T10:00:00.000Z'};
 const elements={};for(const id of ['gvJournalForm','gvJournalCancel','gvJournalTitle','gvJournalBody','gvJournalGame','gvJournalError'])elements[id]={value:'',textContent:'',addEventListener(type,callback){this[type]=callback;}};
 elements.gvJournalTitle.value='Changed';elements.gvJournalBody.value='Changed body';
 let rendered=false;const context={journal:[Object.assign({},original)],editingJournalId:'j',document:{getElementById:id=>elements[id]},
  safeSet:()=>false,safeGetJSON:()=>[Object.assign({},original)],GK:{journal:'orbit-games-journal'},renderJournalPanel:()=>{rendered=true;},cancelJournalEdit:()=>{},showToast:()=>{}};
 vm.runInNewContext(fn('saveJournal'),context);
 vm.runInNewContext(fn('wireJournal').split('  /* Cinematic spotlight')[0],context);
 context.wireJournal();elements.gvJournalForm.submit({preventDefault(){}});
 assert.equal(context.journal[0].title,'Original');assert.equal(context.journal[0].body,'Original body');assert.equal(context.editingJournalId,'j');
 assert.equal(elements.gvJournalTitle.value,'Changed');assert.match(elements.gvJournalError.textContent,/could not be saved/i);assert.equal(rendered,false);
});
test('Journal deletion keeps the entry when the confirmed write is rejected',()=>{
 const original={id:'j',title:'Keep'};let confirm,rendered=false;
 const context={journal:[original],editingJournalId:null,window:{OneSpaceUI:{confirm:(title,message,action)=>{confirm=action;}}},
  safeSet:()=>false,safeGetJSON:()=>[original],GK:{journal:'orbit-games-journal'},renderJournalPanel:()=>{rendered=true;},cancelJournalEdit:()=>{}};
 for(const name of ['saveJournal','deleteJournalEntry'])vm.runInNewContext(fn(name),context);
 context.deleteJournalEntry('j');assert.equal(context.journal.length,1);assert.equal(confirm(),false);assert.equal(context.journal.length,1);assert.equal(rendered,false);
});
test('objective lookup honors the rendered game even when another tracker is selected',()=>{
 const context={selectedStoryGameId:'a',library:['a','b'].map(id=>({id,story:{chapters:[{id:'c',title:id,objectives:[]}]}}))};vm.runInNewContext(fn('findChapter'),context);assert.equal(context.findChapter('c','b').title,'b');assert.equal(context.findChapter('c').title,'a');
});
