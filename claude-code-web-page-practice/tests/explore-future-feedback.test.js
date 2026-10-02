'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise the mounted module's real delegated handler, including descendant clicks.
function mount() {
  const nodes = new Map(), calls = [], handlers = {};
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {dataset:{},classList:{add(){}},appendChild(){},insertAdjacentHTML(where,html){this.html=html;},querySelectorAll(){return [];},addEventListener(name,fn){if(id==='redesignExplore') handlers[name]=fn;},hidden:true});
    return nodes.get(id);
  };
  const document = {getElementById:node,createElement:()=>node('created-'+nodes.size),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){}};
  const window = {document,OneSpaceTrips:require('../explore/trip-board'),OneSpaceRedesign:{createOwnerSurface:()=>({show(){}}),createSceneHost:()=>({show(){}}),createShell:()=>({}),setActiveWorld(){}},OneSpace:{iconSvg:()=>'<svg aria-hidden="true"></svg>',escapeHtml:s=>s,safeGetJSON:()=>[]},OneSpaceDiscovery:{wirePhotos(){}},OneSpaceExplore:{},OneSpaceUI:{open:(...args)=>calls.push(args)},DESTINATIONS:[]};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../explore/explore-redesign.js'),'utf8'),{window});
  node('osrExploreNotice');
  return {nodes,calls,html:[...nodes.values()].map(n=>n.html||'').join(''),click:async name=>handlers.click({target:{closest:selector=>selector==='[data-explore-action]'?{dataset:{exploreAction:name}}:null}})};
}
for (const [action,label] of [['experiences','Experiences'],['travel-guides','Travel Guides']]) {
  test(label+' opens visible future feedback without changing hero notice or owner data', async()=>{
    const app=mount(),notice=app.nodes.get('osrExploreNotice');
    notice.textContent='Existing owner status';
    await app.click(action);
    assert.equal(app.calls.length,1,'future portal must open the shared dialog');
    assert.equal(app.calls[0][0],label+' — coming later');
    assert.match(app.calls[0][1],/coming in the Explore submodule rollout/);
    assert.match(app.calls[0][1],/Open Destinations or Bucket List/);
    assert.equal(app.calls[0][2],null,'information-only dialog');
    assert.equal(notice.textContent,'Existing owner status');
    assert.equal(notice.hidden,true,'do not reflow the hero to show off-screen feedback');
    const button=app.html.match(new RegExp('<button[^>]+data-portal="'+action+'"[^>]*>'))[0];
    assert.match(button,/aria-haspopup="dialog"/); assert.match(button,/aria-controls="domainOverlay"/);
  });
}
test('Experiences quick action declares the same dialog feedback',()=>{
  const app=mount(),chip=app.html.match(/<button class="osr-chip"[^>]+data-explore-action="experiences"[^>]*>/)[0];
  assert.match(chip,/aria-haspopup="dialog"/); assert.match(chip,/aria-controls="domainOverlay"/);
});
