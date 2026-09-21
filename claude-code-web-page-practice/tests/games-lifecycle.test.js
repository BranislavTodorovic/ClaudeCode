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
 const context={library:[g],weekly:{},window:{OneSpaceGameResources:resources},getISOWeekKey:()=> '2026-W39',saveWeekly:()=>true,showToast:()=>{},renderAll:()=>{}};vm.runInNewContext(fn('cloneWeeklyTemplate')+fn('resetWeekly'),context);context.resetWeekly('g');assert.equal(context.weekly.g.tasks.length,2);
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
test('objective lookup honors the rendered game even when another tracker is selected',()=>{
 const context={selectedStoryGameId:'a',library:['a','b'].map(id=>({id,story:{chapters:[{id:'c',title:id,objectives:[]}]}}))};vm.runInNewContext(fn('findChapter'),context);assert.equal(context.findChapter('c','b').title,'b');assert.equal(context.findChapter('c').title,'a');
});
