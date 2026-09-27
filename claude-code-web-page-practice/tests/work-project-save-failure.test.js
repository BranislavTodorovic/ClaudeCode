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
