'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const landing = require('../explore/explore-redesign');
const trips = require('../explore/trip-board');
const discovery = require('../explore/local-discovery');
const layoutAuditPromise = import('./explore-layout-audit.mjs');
const portalAuditPromise = import('./explore-portal-audit.mjs');
const creditsAuditPromise = import('./explore-credits-audit.mjs');
const root = path.resolve(__dirname,'..');
const data = {window:{}}; vm.createContext(data);
vm.runInContext(fs.readFileSync(path.join(root,'explore/explore-data.js'),'utf8'),data);
function row(id,date='',status='idea',order=0) {
  return {...trips.save([],{id,name:id,description:'Local place'},'trip-'+id)[0],startDate:date,status,order};
}

function portalTarget() {
  return {slug:'experiences',tag:'BUTTON',type:'button',action:'experiences',label:'Experiences — coming later',box:{width:230,height:230},descendants:0,transform:'none',iconHidden:'true',inside:[{name:'below icon inside card',inViewport:true,action:'experiences'}],outside:[{name:'below card',inViewport:true,action:null}]};
}

function creditsTarget() {
  return {tag:'BUTTON',type:'button',label:'Scene & photo credits',popup:'dialog',controls:'domainOverlay',rowWidth:1949,width:244,height:44,transform:'none',rowAction:false,disclosures:0,inside:[{name:'label',inViewport:true,action:'credits'}],outside:[{name:'empty row',inViewport:true,action:null}]};
}

test('credits audit accepts an explicit bounded dialog launcher and inert empty row',async()=>{
  const audit=await creditsAuditPromise;
  assert.deepEqual(audit.violations(creditsTarget()),[]);
});

test('credits audit rejects the stretched disclosure and empty-space activation',async()=>{
  const audit=await creditsAuditPromise,control=creditsTarget();
  control.width=control.rowWidth; control.disclosures=1; control.outside[0].action='credits';
  assert.deepEqual(audit.violations(control),['credits control stretches across empty row','interactive credits container','action in empty space: empty row']);
});

test('credits audit rejects invisible, moving and untested targets',async()=>{
  const audit=await creditsAuditPromise,control=creditsTarget();
  control.label=''; control.transform='matrix(1,0,0,1,0,-2)'; control.outside[0].inViewport=false;
  assert.deepEqual(audit.violations(control),['credits launcher semantics','moving credits target','untested credits point: empty row']);
});

test('scene audit catches backdrop recropping, container shift and zoom on credits activation',async()=>{
  const audit=await creditsAuditPromise;
  const before={viewport:2033,documentWidth:2033,scrollY:0,regions:[{selector:'scene',left:0,top:0,width:2033,height:1440,transform:'none',zoom:'1'}]};
  assert.deepEqual(audit.sceneChanges(before,JSON.parse(JSON.stringify(before))),[]);
  assert.deepEqual(audit.sceneChanges(before,{...before,regions:[{...before.regions[0],height:1652}]}),['scene']);
  assert.deepEqual(audit.sceneChanges(before,{...before,viewport:2048,scrollY:4,regions:[{...before.regions[0],zoom:'1.1'}]}),['document width changed','page scrolled','scene']);
});

test('portal audit accepts one semantic whole-card target and inactive adjacent space',async()=>{
  const audit=await portalAuditPromise;
  assert.deepEqual(audit.violations([portalTarget()]),[]);
});

test('portal audit rejects action leakage outside the visible card',async()=>{
  const audit=await portalAuditPromise, card=portalTarget();
  card.outside[0].action='experiences';
  assert.deepEqual(audit.violations([card]),['experiences: action outside card at below card']);
});

test('portal audit rejects invisible nested controls and moving hit boundaries',async()=>{
  const audit=await portalAuditPromise, card={...portalTarget(),tag:'DIV',descendants:1,transform:'matrix(1, 0, 0, 1, 0, -4)'};
  assert.deepEqual(audit.violations([card]),['experiences: card must be the labelled button','experiences: overlapping interactive descendants','experiences: moving target boundary']);
});

test('portal audit rejects an inactive part of the whole-card target and small controls',async()=>{
  const audit=await portalAuditPromise, card=portalTarget();
  card.inside[0].action=null; card.box={width:30,height:30};
  assert.deepEqual(audit.violations([card]),['experiences: target below 44px','experiences: inactive below icon inside card']);
});

test('portal audit cannot pass untested off-screen boundaries',async()=>{
  const audit=await portalAuditPromise, card=portalTarget();
  card.outside[0].inViewport=false;
  assert.deepEqual(audit.violations([card]),['experiences: boundary points not fully in viewport']);
});
test('layout audit catches clipped controls even when legacy document width hides overflow',async()=>{
  const layoutAudit = await layoutAuditPromise;
  const failed={viewport:305,documentWidth:305,regions:[],controls:[{name:'Command',left:245,right:318.65625}]};
  assert.deepEqual(layoutAudit.violations(failed),['content: Command']);
});
test('layout audit checks all retained regions as well as document width',async()=>{
  const layoutAudit = await layoutAuditPromise;
  const failed={viewport:842,documentWidth:880,regions:[{selector:'trip-board',left:0,right:842,width:842,scrollWidth:880}],controls:[]};
  assert.deepEqual(layoutAudit.violations(failed),['document exceeds viewport','region: trip-board']);
});
test('layout audit accepts bounded reflow with scrollbar width and subpixel rounding',async()=>{
  const layoutAudit = await layoutAuditPromise;
  assert.deepEqual(layoutAudit.violations({viewport:305,documentWidth:305,regions:[{selector:'tools',left:16,right:289,width:273,scrollWidth:273}],controls:[{name:'Command',left:205,right:288.8}]}),[]);
});
test('layout audit rejects mismatched centered frames even when nothing exceeds document width',async()=>{
  const audit=await layoutAuditPromise;
  const wide={viewport:3425,documentWidth:3425,regions:[],controls:[],frame:{left:688.5,right:2736.5},ownerFrame:{left:812.5,right:2612.5},expectedContent:{left:730.5,right:2694.5},alignment:[{selector:'tools',left:854.5,right:2570.5}]};
  assert.deepEqual(audit.violations(wide),['landing and owner frames differ','alignment: tools']);
});
test('layout audit checks centering and common edges after frame reflow',async()=>{
  const audit=await layoutAuditPromise;
  const frame={viewport:2033,documentWidth:2033,regions:[],controls:[],frame:{left:0,right:2033},ownerFrame:{left:0,right:2033},expectedContent:{left:42,right:1991},alignment:[{selector:'tools',left:42,right:1991}]};
  assert.deepEqual(audit.violations(frame),[]);
  assert.deepEqual(audit.violations({...frame,frame:{left:20,right:2033},ownerFrame:{left:20,right:2033}}),['frame is not centered']);
});
test('upcoming uses planned valid nonpast local dates, including today, in chronological order',()=>{
  const rows=[row('late','2026-10-02','planned',0),row('past','2026-09-29','planned',1),row('today','2026-09-30','planned',2),row('idea','2026-10-01','idea',3),row('undated','','planned',4),row('visited','2026-10-01','visited',5),row('bad','2026-02-30','planned',6)];
  const model=landing.buildModel({trips:rows},'2026-09-30');
  assert.deepEqual(model.upcoming.map(r=>r.destination.id),['today','late']);
  assert.equal(model.saved.length,6);
});
test('saved summary follows canonical ordering and leaves owner records untouched',()=>{
  const rows=[row('b','','researching',2),row('a','','idea',1)];
  const before=JSON.stringify(rows);
  assert.deepEqual(landing.buildModel({trips:rows},'2026-09-30').saved.map(r=>r.destination.id),['a','b']);
  assert.equal(JSON.stringify(rows),before);
});
test('malformed and empty storage cannot become fake trips',()=>{
  for(const value of [null,{},'bad',[],[{},null,{id:'bad'}]]) {
    const model=landing.buildModel({trips:value},'2026-09-30');
    assert.deepEqual(model.saved,[]); assert.deepEqual(model.upcoming,[]);
  }
});
test('legacy capture handler leaves Explore-owned fallbacks intact while retaining other art fallbacks',()=>{
  let handler,replaced=0;
  class Img {constructor(owned){this.dataset=owned?{fallbackOwner:'explore-portal'}:{};this.className='';this.alt='';}matches(){return false;}closest(){return null;}getAttribute(){return 'missing.png';}replaceWith(){replaced++;}}
  const context={window:{},HTMLImageElement:Img,console:{warn(){}},document:{addEventListener(type,fn){if(type==='error')handler=fn;},createElement(){return {};}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'shared/visual-utils.js'),'utf8'),context);
  handler({target:new Img(true)}); assert.equal(replaced,0);
  handler({target:new Img(false)}); assert.equal(replaced,1);
});
test('featured entries are actual catalog records and retain licensed media through normalization',()=>{
  const catalog=Array.from(data.window.DESTINATIONS);
  const featured=landing.buildModel({destinations:catalog},'2026-09-30').featured;
  assert.deepEqual(featured.map(x=>x.id),['lisbon','kyoto','azores']);
  for(const raw of featured) {
    const item=discovery.normalize(raw,'destinations');
    assert(trips.destination(item)); assert(item.photos[0].licenseUrl); assert(fs.existsSync(path.join(root,item.image)));
  }
});
test('five canonical portals keep future modules truthful and use existing clean local assets',()=>{
  assert.deepEqual(landing.portals.map(p=>p.slug),['destinations','experiences','travel-guides','bucket-list','discover-more']);
  assert.deepEqual(landing.portals.filter(p=>p.future).map(p=>p.slug),['experiences','travel-guides']);
  for(const portal of landing.portals) {assert(fs.existsSync(path.join(root,portal.image)));assert(!portal.image.includes('ui-reference'));}
});
test('changing owner dates/status changes summaries without a parallel model or store',()=>{
  const original=[row('place','','idea')];
  const planned=trips.update(original,'trip-place',{status:'planned',startDate:'2026-10-01',endDate:'2026-10-04'});
  assert.equal(landing.buildModel({trips:original},'2026-09-30').upcoming.length,0);
  assert.equal(landing.buildModel({trips:planned},'2026-09-30').upcoming.length,1);
  assert.equal(landing.buildModel({trips:trips.update(planned,'trip-place',{status:'visited'})},'2026-09-30').upcoming.length,0);
});
