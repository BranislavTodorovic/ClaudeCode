'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {buildModel,portals}=require('../games/games-redesign');
const now=new Date(2026,9,1,12),start=new Date(2026,9,1,9).toISOString(),end=new Date(2026,9,1,10).toISOString();
const game={id:'g1',name:'My game',trackerType:'story',total:4,completed:0};
test('starter library does not imply play history or progress',()=>{
  const model=buildModel({games:[game],sessions:[]},now);
  assert.equal(model.continuing,null);assert.equal(model.todayMinutes,0);assert.equal(model.weekCount,0);assert.equal(model.active,null);
});
test('session summaries use local calendar days and reject future, orphan and invalid records',()=>{
  const session={gameId:'g1',start,end,minutes:60};
  const snapshot={games:[game],sessions:[session,{...session,gameId:'missing'},{...session,minutes:-4},{...session,start:new Date(2026,9,2).toISOString()},{...session,end:'bad'}, {...session,start:'bad'}]};
  const before=JSON.stringify(snapshot),model=buildModel(snapshot,now);
  assert.equal(model.todayCount,1);assert.equal(model.todayMinutes,60);assert.equal(model.weekCount,1);assert.equal(model.weekMinutes,60);assert.equal(model.continuing.id,'g1');assert.equal(JSON.stringify(snapshot),before);
});
test('rolling seven calendar days include boundary day and exclude older sessions',()=>{
  const sessions=[new Date(2026,8,25,0),new Date(2026,8,24,23)].map(d=>({gameId:'g1',start:d.toISOString(),end:d.toISOString(),minutes:20}));
  assert.equal(buildModel({games:[game],sessions},now).weekCount,1);
});
test('active session is disclosed separately from finished duration totals',()=>{
  const model=buildModel({games:[game],sessions:[{gameId:'g1',start,end:null,minutes:null}]},now);
  assert.equal(model.active.gameId,'g1');assert.equal(model.todayMinutes,0);assert.equal(model.continuing.id,'g1');
});
test('unfinished checked objectives can provide continuation without fabricated last-played date',()=>{
  const model=buildModel({games:[{...game,completed:1}],sessions:[]},now);
  assert.equal(model.continuing.id,'g1');assert.equal(model.lastSession,null);
});
test('all six reference portals map to original owner workflows including module-local settings',()=>{
  assert.deepEqual(portals.map(p=>p[0]),['my-games','missions-quests','game-library','game-sessions','discover-games','game-settings']);
  assert.equal(portals[5][3],'appearance');assert.equal(portals[3][3],'sessions');
});
