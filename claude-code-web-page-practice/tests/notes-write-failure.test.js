const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('Quick Notes commits a replacement list only after storage accepts it',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function saveNotesList\(next\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source,'Quick Notes save boundary exists');
  const prior=[{id:'note-1',title:'Keep',body:'Original',pinned:false}];
  const edited=[{...prior[0],title:'Edited'}];
  let accept=false,writes=0;
  const context={notesList:prior,STORAGE:{notesList:'orbit-notes-list'},safeSet:(key,value)=>{
    assert.equal(key,'orbit-notes-list');assert.equal(JSON.parse(value)[0].title,'Edited');writes++;return accept;
  }};
  vm.runInNewContext(source,context);
  assert.equal(context.saveNotesList(edited),false);
  assert.equal(context.notesList,prior);
  accept=true;
  assert.equal(context.saveNotesList(edited),true);
  assert.equal(context.notesList,edited);
  assert.equal(writes,2);
});

test('Quick Notes deletion waits for confirmation and retains a rejected write',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function deleteNote\(id, confirmed\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source,'Quick Notes delete boundary exists');
  const note={id:'note-1',title:'Keep',body:'Original'};
  let confirmAction,accept=false,renders=0;
  const context={notesList:[note],window:{OneSpaceUI:{confirm:(title,text,callback)=>{
    assert.equal(title,'Delete note?');assert.equal(text,'Keep');confirmAction=callback;
  }}},saveNotesList:next=>{if(!accept)return false;context.notesList=next;return true;},
  renderNotes:()=>{renders++;},showToast:()=>{}};
  vm.runInNewContext(source,context);
  context.deleteNote('note-1');assert.equal(context.notesList.length,1);
  assert.equal(confirmAction(),false);assert.equal(context.notesList.length,1);assert.equal(renders,0);
  accept=true;assert.equal(confirmAction(),true);assert.equal(context.notesList.length,0);assert.equal(renders,1);
});
