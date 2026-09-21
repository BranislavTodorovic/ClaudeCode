const {test}=require('node:test');
const assert=require('node:assert/strict');
const work=require('../work/work-tracker');
test('Work sorting is selectable without mutating persisted order or hiding undated records',()=>{
 const items=[{id:'a',name:'Alpha',priority:'low',status:'open',createdAt:'2026-01-01',deadline:''},{id:'z',name:'Zeta',priority:'urgent',status:'open',createdAt:'2026-02-01',deadline:'2026-03-01'}];
 const ids=sort=>work.filter(items,{view:'active',sort}).map(i=>i.id);
 assert.deepEqual(ids('priority'),['z','a']);assert.deepEqual(ids('name'),['a','z']);assert.deepEqual(ids('deadline'),['z','a']);assert.deepEqual(ids('newest'),['z','a']);assert.deepEqual(ids('oldest'),['a','z']);assert.deepEqual(items.map(i=>i.id),['a','z']);
});
