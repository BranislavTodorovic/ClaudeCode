const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('Productivity task changes stay in memory only after storage accepts them',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function saveTasks\(next\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source,'task save boundary exists');
  const prior=[{id:'task-1',text:'Keep',priority:'normal',done:false}];
  const next=[{id:'task-1',text:'Keep',priority:'normal',done:true}];
  let accepted=false,renders=0;
  const context={tasks:prior,STORAGE:{tasks:'orbit-tasks'},safeSet:(key,value)=>{assert.equal(key,'orbit-tasks');assert.equal(JSON.parse(value)[0].done,true);return accepted;},renderTasks:()=>{renders++;}};
  vm.runInNewContext(source,context);
  assert.equal(context.saveTasks(next),false);assert.equal(context.tasks,prior);assert.equal(renders,0);
  accepted=true;
  assert.equal(context.saveTasks(next),true);assert.equal(context.tasks,next);assert.equal(renders,1);
});
