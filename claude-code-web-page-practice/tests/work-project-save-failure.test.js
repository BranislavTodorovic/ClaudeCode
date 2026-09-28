const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function extract(file,start,end){
 const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
 const from=source.indexOf(start),to=source.indexOf(end,from+start.length);
 assert(from>=0&&to>from,'Could not extract '+start);
 return source.slice(from,to);
}

test('Project Edit and Create do not rerender after rejected save',()=>{
 let accept=false,renders=0;
 const ctx={OS:{safeSet:()=>accept},key:'orbit-work-projects',render:()=>{renders++;}};
 vm.runInNewContext(extract('work/projects.js','  function commit(next)','  function safeUrl'),ctx);
 assert.equal(ctx.commit([{id:'project'}]),false);
 assert.equal(renders,0);
 accept=true;
 assert.equal(ctx.commit([{id:'project'}]),true);
 assert.equal(renders,1);
});

test('Work and project deletion leave records and UI unchanged on rejected transaction',()=>{
 let accept=false,renders=0,events=0;
 const values=new Map([['orbit-work-projects','[{"id":"project"}]']]);
 const store={setItem:(key,value)=>values.set(key,value),getItem:key=>values.get(key)??null};
 const ctx={keys:{items:'orbit-work-items',tasks:'orbit-work-tasks',history:'orbit-work-history'},
  root:{localStorage:store,OneSpaceStorage:{valid:()=>true,transaction:(target,data)=>{if(!accept)throw Error('Quota exceeded');Object.entries(data).forEach(([key,value])=>target.setItem(key,value));}}},
  OS:{safeGet:key=>values.get(key)??null,showToast:()=>{}},
  document:{dispatchEvent:()=>{events++;}},CustomEvent:function(){},render:()=>{renders++;}};
 vm.runInNewContext(extract('work/work-tracker.js','    function commit(state, message, extra)','    function log'),ctx);
 const state={items:[],tasks:[],history:[]};
 const extra={'orbit-work-projects':'[]'};
 assert.equal(ctx.commit(state,'Deleted.',extra),false);
 assert.equal(values.get('orbit-work-projects'),'[{"id":"project"}]');
 assert.equal(renders,0);assert.equal(events,0);
 accept=true;
 assert.equal(ctx.commit(state,'Deleted.',{'orbit-work-projects':'[]'}),true);
 assert.equal(values.get('orbit-work-projects'),'[]');
 assert.equal(renders,1);assert.equal(events,4);
});

test('Project Delete keeps confirmation and edit state on failed transaction',()=>{
 let accept=false,renders=0,cancels=0,confirmAction;
 const ctx={list:{addEventListener:(type,action)=>{ctx.click=action;}},window:{OneSpaceUI:{confirm:(title,message,action)=>{confirmAction=action;}},OneSpaceWork:{deleteProject:()=>accept}},editingId:'project',cancel:()=>{cancels++;},render:()=>{renders++;}};
 vm.runInNewContext(extract('work/projects.js','  list.addEventListener("click", function (e) {','  var scheduled = false;'),ctx);
 ctx.click({target:{closest:selector=>selector==='[data-project-delete]'?{dataset:{projectDelete:'project'}}:null}});
 assert.equal(confirmAction(),false);
 assert.equal(cancels,0);
 assert.equal(renders,0);
 accept=true;
 assert.equal(confirmAction(),true);
 assert.equal(cancels,1);
 assert.equal(renders,1);
});

test('Work project deletion restores selected detail on rejected commit',()=>{
 let accept=false,selectedDuringCommit;
 const ctx={root:{OneSpaceWork:{}},read:()=>({items:[{id:'item',projectId:'project'}],tasks:[{id:'task',itemId:'item'}],history:[]}),log:()=>{},projects:()=>[{id:'project'}],selected:'item',commit:()=>{selectedDuringCommit=ctx.selected;return accept;}};
 vm.runInNewContext(extract('work/work-tracker.js','    root.OneSpaceWork.deleteProject=function(id)','    document.addEventListener(\'onespace:end-workday\''),ctx);
 assert.equal(ctx.root.OneSpaceWork.deleteProject('project'),false);
 assert.equal(ctx.selected,'item');
 assert.equal(selectedDuringCommit,null);
 accept=true;
 assert.equal(ctx.root.OneSpaceWork.deleteProject('project'),true);
 assert.equal(ctx.selected,null);
});

test('Work overview tiles do not change view when route persistence fails',()=>{
 let accept=false,renders=0;
 const overview={},ctx={document:{getElementById:()=>overview},OS:{goToPage:()=>accept},filters:{view:'projects'},render:()=>{renders++;}};
 vm.runInNewContext(extract('work/work-tracker.js',"    document.getElementById('workOverview').onclick=function(e)",'    host.onclick=function(e)'),ctx);
 const event={target:{closest:()=>({dataset:{workOverview:'blocked'}})},stopPropagation:()=>{}};
 overview.onclick(event);
 assert.equal(ctx.filters.view,'projects');
 assert.equal(renders,0);
 accept=true;
 overview.onclick(event);
 assert.equal(ctx.filters.view,'active');
 assert.equal(ctx.filters.status,'blocked');
 assert.equal(renders,1);
});

test('Work item Delete keeps selected detail and confirmation on rejected commit',()=>{
 let accept=false,confirmAction,committed;
 const ctx={host:{},UI:{confirm:(title,message,action)=>{confirmAction=action;}},
  read:()=>({items:[{id:'item',projectId:'project'}],tasks:[{id:'task',itemId:'item'}],history:[]}),
  log:()=>{},selected:'item',commit:state=>{committed=state;return accept;}};
 vm.runInNewContext(extract('work/work-tracker.js','    host.onclick=function(e){','    host.onchange=function(e)'),ctx);
 ctx.host.onclick({target:{closest:selector=>selector==='button[data-work-action]'?{dataset:{workAction:'delete',id:'item'}}:null}});
 assert.equal(confirmAction(),false);
 assert.equal(ctx.selected,'item');
 assert.equal(committed.items.length,0);
 accept=true;
 assert.equal(confirmAction(),true);
 assert.equal(ctx.selected,null);
});
