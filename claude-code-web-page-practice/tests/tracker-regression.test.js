const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const storage=require('../shared/storage-utils'),work=require('../work/work-tracker'),explore=require('../explore/explore'),shortcuts=require('../shared/shortcut-utils'),resources=require('../games/game-resources');
const root=path.resolve(__dirname,'..'),at='2026-09-17T12:00:00.000Z';
const project={id:'p',name:'Project',status:'active',progress:0};
const item={id:'i',projectId:'p',name:'Story',type:'story',status:'open',priority:'high',createdAt:at,updatedAt:at,deadline:'2026-09-19'};
const task={id:'t',itemId:'i',title:'Task',done:false,priority:'medium',createdAt:at,updatedAt:at,estimate:2};
function memory(initial={}){const values=new Map(Object.entries(initial));return {getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};}
function state(){return {items:[{...item}],tasks:[{...task}],history:[]};}
function fixture(name){return JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures',name),'utf8'));}
const context={window:{}};vm.createContext(context);['games/game-resources.js','games/games-data.js','movies/movies-data.js','explore/explore-data.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context));

test('close completes every unfinished task, logs a snapshot, and is idempotent',()=>{
 const initial=state(),closed=work.lifecycle(initial,'i','closed',at,'event');
 assert.equal(initial.tasks[0].done,false);assert.equal(closed.tasks[0].done,true);assert.equal(closed.tasks[0].completedAt,at);assert.equal(closed.items[0].completedAt,at);assert.equal(closed.history[0].snapshot.status,'closed');assert.equal(closed.history[0].tasks[0].done,true);
 assert.equal(work.lifecycle(closed,'i','closed',at,'again').history.length,1);
});
test('reopen keeps task completion history and removes the item completion timestamp',()=>{
 const reopened=work.lifecycle(work.lifecycle(state(),'i','closed',at,'e1'),'i','open',at,'e2');
 assert.equal(reopened.items[0].completedAt,null);assert.equal(reopened.tasks[0].completedAt,at);assert.equal(reopened.history[0].action,'reopened');assert.equal(reopened.history[1].action,'closed');
});
test('active/backlog and combined filters do not lose closed records',()=>{
 const closed={...item,id:'closed',status:'closed'};
 assert.deepEqual(work.filter([item,closed],{view:'active',type:'story',priority:'high',project:'p',search:'story'}).map(x=>x.id),['i']);
 assert.deepEqual(work.filter([item,closed],{view:'backlog'}).map(x=>x.id),['closed']);
 assert.equal(work.filter([item],{view:'active',type:'defect'}).length,0);
});
test('deadlines use the local end of day and distinguish due soon from overdue',()=>{
 assert.equal(work.due('2026-09-17',new Date('2026-09-17T23:00:00')),'due-soon');
 assert.equal(work.due('2026-09-16',new Date('2026-09-17T12:00:00')),'overdue');
 assert.equal(work.due('2026-10-01',new Date('2026-09-17T12:00:00')),'later');
});
test('work schema rejects invalid status, type, URLs, dates, estimates and lengths',()=>{
 for(const change of [{status:'finished'},{type:'bug'},{projectId:''},{name:' '},{name:'a'.repeat(161)},{deadline:'2026-02-30'},{reminderAt:'2026-09-17T24:00'},{links:['javascript:alert(1)']},{labels:['a'.repeat(81)]}])assert.equal(storage.valid('orbit-work-items',JSON.stringify([{...item,...change}])),false,JSON.stringify(change));
 assert.equal(storage.valid('orbit-work-tasks',JSON.stringify([{...task,estimate:-1}])),false);
 assert.equal(storage.valid('orbit-work-tasks',JSON.stringify([{...task,done:'false'}])),false);
 assert.equal(storage.valid('orbit-work-items',JSON.stringify([item,item])),false);
});
test('hierarchy rejects orphan items/tasks and incomplete tasks below closed items before writes',()=>{
 const store=memory({'orbit-work-projects':JSON.stringify([project])});
 assert.throws(()=>storage.transaction(store,{'orbit-work-items':JSON.stringify([{...item,projectId:'missing'}])}),/hierarchy/);
 assert.throws(()=>storage.transaction(store,{'orbit-work-items':JSON.stringify([{...item,status:'closed'}]),'orbit-work-tasks':JSON.stringify([task])}),/hierarchy/);
 assert.equal(store.getItem('orbit-work-items'),null);
});
test('atomic lifecycle transaction rolls back all keys after quota failure',()=>{
 const store=memory({'orbit-work-projects':JSON.stringify([project]),'orbit-work-items':JSON.stringify([item]),'orbit-work-tasks':JSON.stringify([task])});
 const before=storage.snapshot(store),set=store.setItem;let calls=0;store.setItem=(k,v)=>{if(++calls===2)throw new Error('quota');return set(k,v);};
 const closed=work.lifecycle(state(),'i','closed',at,'e');assert.throws(()=>storage.transaction(store,Object.fromEntries(Object.entries(work.keys).map(([k,v])=>[v,JSON.stringify(closed[k])]))));assert.deepEqual(storage.snapshot(store),before);
});
test('version 2 migrates missing domain keys to null, while version 3 requires completeness',()=>{
 const store=memory({'orbit-explore-saved':'[]','other-app':'keep'}),legacy=fixture('legacy-v2-backup.json');storage.restore(store,legacy);assert.equal(store.getItem('orbit-explore-saved'),null);assert.equal(store.getItem('other-app'),'keep');
 const current=storage.backup(store);assert.equal(current.version,4);delete current.data['orbit-work-items'];assert.throws(()=>storage.restore(store,current),/Incomplete/);
});
test('complete v3 backup round trips new domains; invalid import makes no writes; reset preserves unrelated values',()=>{
 const store=memory({'other-app':'keep'}),complete=fixture('complete-backup.json');storage.restore(store,complete);assert.deepEqual(storage.snapshot(store),complete.data);
 const before=storage.snapshot(store);assert.throws(()=>storage.restore(store,fixture('invalid-work-backup.json')),/Invalid backup field/);assert.deepEqual(storage.snapshot(store),before);
 storage.reset(store);assert.ok(Object.values(storage.snapshot(store)).every(v=>v===null));assert.equal(store.getItem('other-app'),'keep');
});
test('all curated destinations validate and ranking is stable, explained and intersects groups',()=>{
 const destinations=context.window.DESTINATIONS;assert.ok(destinations.every(storage.validDestination));
 const prefs={categories:['nature'],budget:['medium']},a=explore.recommend(destinations,prefs,storage.validDestination),b=explore.recommend([...destinations].reverse(),prefs,storage.validDestination);
 assert.deepEqual(Array.from(a,x=>x.destination.id),Array.from(b,x=>x.destination.id));assert.ok(a.length);assert.ok(a.every(x=>x.destination.categories.includes('nature')&&x.destination.budget==='medium'&&x.reasons.length===2));
 assert.equal(explore.recommend([{name:'broken'}],{},storage.validDestination).length,0);
 assert.equal(storage.valid('orbit-explore-preferences',JSON.stringify({budget:['unlimited']})),false);
 assert.equal(storage.valid('orbit-explore-saved',JSON.stringify([{id:'s',destinationId:'azores',createdAt:'bad'}])),false);
});
test('shortcut normalization preserves descriptions and explicit ownership; duplicate and unsafe URLs rejected',()=>{
 const categories=['Development','Travel','Daily','Gaming'];
 const data=[{id:'one',name:'Trip',url:'https://example.com',category:'Development',space:'explore',description:'A trip'},{id:'two',name:'Duplicate',url:'https://example.com/',category:'Travel'},{id:'three',name:'Bad',url:'javascript:alert(1)',category:'Daily'}];
 const clean=shortcuts.sanitize(data,[],categories);assert.equal(clean.length,1);assert.equal(clean[0].description,'A trip');assert.equal(clean[0].space,'explore');assert.equal(clean[0].category,'Travel');assert.equal(shortcuts.space(clean[0]),'explore');assert.equal(shortcuts.space({custom:true,category:'Gaming'}),'explore');assert.equal(shortcuts.space({...clean[0],space:'personal'}),'personal');
});
test('game resources and default tasks work for several genres without sharing mutable task state',()=>{
 for(const game of [...context.window.DEFAULT_GAMES,...context.window.SUGGESTION_CATALOG]){assert.ok(game.resources.length>=3);assert.ok(game.resources.every(r=>storage.validUrl(r.url)));assert.ok(game.defaultTasks.length);}
 const race={title:'Racer',genres:['Racing']},farm={title:'Farm',genres:['Farming']};assert.notDeepEqual(resources.tasks(race),resources.tasks(farm));
 let n=0;const first=resources.story(race,()=>String(++n)),second=resources.story(race,()=>String(++n));first.chapters[0].objectives[0].done=true;assert.equal(second.chapters[0].objectives[0].done,false);
 assert.ok(resources.weekly({name:'Custom',trackerType:'weekly'}).every(t=>!t.label.includes('Diablo')));
});
test('movie/series type and genre filtering, legacy compatibility and series validation',()=>{
 const catalog=require('../shared/catalog-utils'),pool=context.window.SEED_MOVIES;
 assert.equal(catalog.search(pool,'series').length,4);assert.ok(catalog.search(pool,'Dark').some(m=>m.id==='tv-dark'));
 assert.equal(pool.filter(m=>catalog.matches(m,{type:['series'],genre:['Comedy']}))[0].id,'tv-good-place');
 const series=pool.find(m=>m.type==='series');assert.equal(storage.valid('orbit-movies-library',JSON.stringify([series])),true);assert.equal(storage.valid('orbit-movies-library',JSON.stringify([{...series,seasons:1.5}])),false);assert.equal(storage.valid('orbit-movies-library',JSON.stringify([{...series,type:'podcast'}])),false);assert.equal(storage.valid('orbit-movies-library',JSON.stringify([{...series,type:'Series'}])),true);
});
test('Personal deletion waits for confirmation and storage failure preserves the item',()=>{
 let records=[{id:'x',text:'Keep me',done:false}],confirm,toast=[];
 const ctx={window:{OneSpaceUI:{confirm:(title,message,action)=>{confirm=action;}}}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'personal/personal-controller.js'),'utf8'),ctx);
 let fail=false;const controller=ctx.window.makePersonalController('orbit-personal-goals',{safeGetJSON:()=>records,safeSet:(k,v)=>{if(fail)return false;records=JSON.parse(v);return true;},uid:()=> 'new',escapeHtml:s=>s,iconSvg:()=>'',showToast:s=>toast.push(s)});
 const list={innerHTML:''};controller.render(list);list.onclick({target:{closest:()=>({dataset:{delete:'x'}})}});assert.equal(records.length,1);assert.equal(typeof confirm,'function');fail=true;assert.equal(confirm(),false);assert.equal(records.length,1);fail=false;confirm();assert.equal(records.length,0);assert.ok(toast.includes('Personal item deleted.'));
});
test('deleting a game removes its weekly tasks and sessions but preserves journal text',()=>{
 const initial={library:[{id:'g'},{id:'keep'}],weekly:{g:{tasks:[]},keep:{tasks:[]}},sessions:[{id:'s',gameId:'g'},{id:'k',gameId:'keep'}],journal:[{id:'j',gameId:'g',text:'Keep this memory'}]};
 const next=resources.cleanup(initial,'g');assert.deepEqual(next.library,[{id:'keep'}]);assert.equal(next.weekly.g,undefined);assert.equal(next.sessions.length,1);assert.equal(next.journal[0].gameId,null);assert.equal(next.journal[0].text,'Keep this memory');assert.equal(initial.journal[0].gameId,'g');
});
test('series watchlist and enriched game resources survive backup restore',()=>{
 const series={...context.window.SEED_MOVIES.find(m=>m.type==='series'),status:'watchlist'},game=context.window.DEFAULT_GAMES[2];
 const a=memory({'orbit-movies-library':JSON.stringify([series]),'orbit-movies-watchlist':JSON.stringify([series.id]),'orbit-games-library':JSON.stringify([game])}),b=memory();storage.restore(b,storage.backup(a));assert.deepEqual(storage.snapshot(a),storage.snapshot(b));
 assert.equal(storage.valid('orbit-movies-library',JSON.stringify([{...series,year:'<img src=x onerror=alert(1)>'}])),false);
});
test('malformed destination metadata and game templates are rejected, and tracker templates stay independent',()=>{
 const d=context.window.DESTINATIONS[0];for(const change of [{climate:'unknown'},{image:'javascript:alert(1)'},{categories:['invalid']}])assert.equal(storage.validDestination({...d,...change}),false);
 const g=context.window.DEFAULT_GAMES[0];assert.equal(storage.valid('orbit-games-library',JSON.stringify([{...g,defaultTaskTemplates:{weekly:[42]}}])),false);
 const story=resources.tasks({...g,trackerType:'story'}),weekly=resources.tasks({...g,trackerType:'weekly'});assert.notDeepEqual(story,weekly);assert.equal(weekly.length,3);
});

