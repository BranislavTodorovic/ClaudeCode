'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function resourceAction(links) {
  const source = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const start = source.indexOf('document.querySelectorAll(\'[data-action="explore-random"]\').forEach', source.indexOf('  document.getElementById("exploreSearchForm")'));
  const end = source.indexOf('\n  document.addEventListener("onespace:page-changed"', start);
  assert(start >= 0 && end > start);
  let click; const result = {messages: [], opened: [], recent: [], usage: [], forms: []};
  vm.runInNewContext(source.slice(start,end), {
    document: {querySelectorAll: () => [{addEventListener: (type, handler) => { click = handler; }}]},
    linksForSpace: space => { assert.equal(space,'explore'); return links; },
    rememberRecent: id => result.recent.push(id), recordUsage: id => result.usage.push(id),
    showToast: message => result.messages.push(message), openShortcutModal: (...args) => result.forms.push(args), window: {open: (...args) => result.opened.push(args)}
  });
  click(); return result;
}
test('More To Explore explains an empty resource collection instead of doing nothing', () => {
  const result = resourceAction([]);
  assert.match(result.messages[0],/No travel shortcuts available.*Add an Explore shortcut/);
  assert.deepEqual(result.opened,[]); assert.deepEqual(result.recent,[]); assert.deepEqual(result.usage,[]);
  assert.deepEqual(result.forms,[[null,'explore']]);
});
test('More To Explore opens an existing travel resource and preserves its usage owner', () => {
  const result = resourceAction([{id:'kept',name:'Kept resource',category:'Travel',url:'https://example.com/'}]);
  assert.deepEqual(result.opened,[['https://example.com/','_blank','noopener,noreferrer']]);
  assert.deepEqual(result.recent,['kept']); assert.deepEqual(result.usage,['kept']);
  assert.equal(result.messages[0],'How about Kept resource?');
  assert.deepEqual(result.forms,[]);
});

test('resource card shows its real collection state independently of shortcut search and updates after removal', () => {
  const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const start=source.indexOf('  function renderExplorePage(query) {'),end=source.indexOf('\n  document.getElementById("exploreSearchForm")',start);
  const copy={},button={dataset:{},setAttribute:(key,value)=>button[key]=value,querySelector:()=>copy};
  const grid={}; let links=[{category:'Travel',name:'A real resource'}];
  const context={document:{getElementById:()=>grid,querySelectorAll:()=>[button]},linksForSpace:()=>links,spaceCardHtml:()=>'<article>resource</article>',observeReveals:()=>{}};
  vm.createContext(context); vm.runInContext(source.slice(start,end),context);
  context.renderExplorePage('no matching shortcut');
  assert.match(grid.innerHTML,/No matching shortcuts/);
  assert.equal(button.dataset.resourceState,'available');
  assert.equal(copy.textContent,'Discover a travel resource');
  assert.match(button['aria-label'],/discover a travel resource/);
  links=[{category:'Development',name:'Not travel'}]; context.renderExplorePage('');
  assert.equal(button.dataset.resourceState,'empty');
  assert.equal(copy.textContent,'No travel resources yet. Add a travel shortcut.');
  assert.match(button['aria-label'],/add a travel shortcut/);
});

test('travel artwork has local provenance, valid WebP bytes and one decorative image inside its semantic action', () => {
  const root=path.resolve(__dirname,'..'),asset=fs.readFileSync(path.join(root,'assets/scenes/explore/travel-inspiration.webp'));
  assert.equal(asset.toString('ascii',0,4),'RIFF'); assert.equal(asset.toString('ascii',8,12),'WEBP');
  assert.equal(asset.readUInt32LE(4)+8,asset.length); assert(asset.length<150000);
  const ledger=fs.readFileSync(path.join(root,'assets/scenes/explore/SOURCES.md'),'utf8');
  const hash=require('node:crypto').createHash('sha256').update(asset).digest('hex').toUpperCase();
  assert(ledger.includes(hash)); assert.match(ledger,/exec-ad828842-dc36-4a8a-bc8a-dcbdb0479241/);
  const originalHash=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'assets/scenes/explore/hero.png'))).digest('hex').toUpperCase();
  assert(ledger.includes(originalHash),'original asset preserved and recorded');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const card=html.match(/<button class="explore-category explore-inspiration"[\s\S]*?<\/button>/)[0];
  assert.equal((card.match(/<button/g)||[]).length,1);
  assert.match(card,/<img[^>]+src="assets\/scenes\/explore\/travel-inspiration.webp"[^>]+alt=""[^>]+data-fallback-owner="explore-resource"/);
  assert.match(card,/type="button" data-action="explore-random"/);
});

test('actual inspiration image owner handles early failures, loaded images and recovery without replacing the control', () => {
  const {wireInspirationImage}=require('../explore/explore-redesign');
  for(const naturalWidth of [0,960]) {
    const handlers={},parent={dataset:{}},img={complete:true,naturalWidth,parentElement:parent,addEventListener:(name,handler)=>handlers[name]=handler};
    wireInspirationImage(img);
    assert.equal(img.hidden,naturalWidth===0);
    assert.equal(parent.dataset.assetState,naturalWidth?'ready':'fallback');
    handlers.error(); assert.equal(img.hidden,true); assert.equal(parent.dataset.assetState,'fallback');
    handlers.load(); assert.equal(img.hidden,false); assert.equal(parent.dataset.assetState,'ready');
    assert.equal(img.parentElement,parent);
  }
});

test('global legacy error handler leaves the inspiration image to its own fallback owner', () => {
  class Image {constructor(){this.dataset={fallbackOwner:'explore-resource'};} matches(){throw Error('must not apply unrelated legacy art');}}
  let errorHandler;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../shared/visual-utils.js'),'utf8'),{window:{},HTMLImageElement:Image,document:{addEventListener:(type,handler)=>errorHandler=handler},console:{warn:()=>{throw Error('owned failure must stay local');}}});
  assert.doesNotThrow(()=>errorHandler({target:new Image()}));
});
