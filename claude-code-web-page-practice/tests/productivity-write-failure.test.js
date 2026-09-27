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

test('task deletion waits for confirmation and keeps a failed write visible',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function deleteTask\(id, confirmed\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source);
  const task={id:'task-1',text:'Keep'};let action,accept=false;
  const context={tasks:[task],window:{OneSpaceUI:{confirm:(title,text,callback)=>{assert.equal(text,'Keep');action=callback;}}},
    saveTasks:next=>{if(!accept)return false;context.tasks=next;return true;}};
  vm.runInNewContext(source,context);
  context.deleteTask('task-1');assert.equal(context.tasks.length,1);
  assert.equal(action(),false);assert.equal(context.tasks.length,1);
  accept=true;assert.equal(action(),true);assert.equal(context.tasks.length,0);
});

test('countdown creation and deletion retain state on rejected storage writes',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const save=html.match(/  function saveCountdowns\(next\) \{[\s\S]*?\n  \}/)?.[0];
  const remove=html.match(/  function deleteCountdown\(id, confirmed\) \{[\s\S]*?\n  \}/)?.[0];
  const add=html.match(/  document\.getElementById\("countdownForm"\)\.addEventListener\("submit", function \(event\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(save&&remove&&add);
  const prior={id:'old',name:'Keep date',date:'2026-10-01'};
  const nameInput={value:'New date'},dateInput={value:'2026-11-01'};
  let submit,confirmAction,accept=false,renders=0;const toasts=[];
  const context={countdowns:[prior],STORAGE:{countdowns:'orbit-countdowns'},
    safeSet:()=>accept,renderCountdowns:()=>{renders++;},showToast:message=>toasts.push(message),
    window:{OneSpaceUI:{confirm:(title,name,action)=>{confirmAction=action;}}},
    document:{getElementById:id=>id==='countdownForm'?{addEventListener:(type,handler)=>{submit=handler;}}:id==='countdownName'?nameInput:dateInput}};
  vm.runInNewContext(save+'\n'+remove+'\n'+add,context);
  submit({preventDefault(){}});assert.equal(context.countdowns.length,1);assert.equal(nameInput.value,'New date');assert.equal(renders,0);
  accept=true;submit({preventDefault(){}});assert.equal(context.countdowns.length,2);assert.equal(nameInput.value,'');assert.equal(renders,1);
  context.deleteCountdown('old');assert.equal(context.countdowns.length,2);
  accept=false;assert.equal(confirmAction(),false);assert.equal(context.countdowns.length,2);
  accept=true;assert.equal(confirmAction(),true);assert.equal(context.countdowns.length,1);
});
