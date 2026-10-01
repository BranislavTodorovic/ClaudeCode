'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function harness(){
  const attrs={},events={},script=html.match(/<script id="onespaceBootController">([\s\S]*?)<\/script>/);
  assert(script,'A pre-paint shared boot controller must guard parser-visible legacy markup');
  const status={textContent:''},retry={hidden:true},focus={count:0,focus(){this.count++;}};
  const stages=Object.fromEntries(['Home','Work','Personal','Explore','Games'].map(id=>['redesign'+id,{querySelector(){return {};}}]));
  const doc={readyState:'loading',documentElement:{setAttribute(k,v){attrs[k]=v;},getAttribute(k){return attrs[k];}},dispatchEvent(event){events.ready=event.type;},getElementById(id){return stages[id]||({onespaceBootMessage:status,onespaceBootRetry:retry})[id]||null;},querySelector(){return focus;}};
  const win={document:doc,addEventListener(name,fn){events[name]=fn;},OneSpace:{},OneSpaceRedesign:{}};
  vm.runInNewContext(script[1],{window:win,document:doc,CustomEvent:function(type){this.type=type;}});
  return {attrs,events,win,doc,stages,status,retry,focus};
}
test('critical gate starts in the head before styles or legacy roots; completion is after every owner listener',()=>{
  assert(html.indexOf('id="onespaceBootController"')>0);
  assert(html.indexOf('id="onespaceBootController"')<html.indexOf('<link rel="stylesheet"'));
  assert.match(html,/html\[data-onespace-boot="pending"\] body > :not\(#onespaceBoot\)/);
  assert.match(html,/body > :not\(#onespaceBoot\) \* \{ visibility:hidden !important;/,'Keep layout available for native scroll restoration while preventing paint and focus');
  assert(html.indexOf('window.OneSpaceBoot.complete')>html.indexOf('src="games/games-redesign.js"'));
  assert.match(html,/addEventListener\('DOMContentLoaded', window\.OneSpaceBoot\.complete/);
});
test('parser and partially loaded pipeline never reveal the application',()=>{
  const h=harness();assert.equal(h.attrs['data-onespace-boot'],'pending');
  h.win.OneSpaceBoot.complete();assert.equal(h.attrs['data-onespace-boot'],'pending');assert.equal(h.focus.count,0);
});
test('route/owner initialization completed with all redesigned roots releases the shared gate',()=>{
  const h=harness();h.doc.readyState='interactive';h.win.OneSpaceBoot.complete();
  assert.equal(h.attrs['data-onespace-boot'],'ready');assert.equal(h.attrs['aria-busy'],'false');assert.equal(h.focus.count,1);
  assert.equal(h.events.ready,'onespace:ready');
});
test('missing redesign mount produces accessible recovery instead of showing the legacy owner',()=>{
  const h=harness();delete h.stages.redesignGames;h.doc.readyState='interactive';h.win.OneSpaceBoot.complete();
  assert.equal(h.attrs['data-onespace-boot'],'error');assert.equal(h.retry.hidden,false);assert.match(h.status.textContent,/Reload/);
});
test('script-load failure cannot be overwritten by a later completion event',()=>{
  const h=harness();h.events.error({target:{tagName:'SCRIPT'}});h.doc.readyState='interactive';h.win.OneSpaceBoot.complete();
  assert.equal(h.attrs['data-onespace-boot'],'error');assert.equal(h.retry.hidden,false);
});
test('initialization exception keeps the recovery screen and never exposes a partial world',()=>{
  const h=harness();h.events.error({message:'Initialization failed'});h.doc.readyState='interactive';h.win.OneSpaceBoot.complete();
  assert.equal(h.attrs['data-onespace-boot'],'error');assert.equal(h.focus.count,0);
});
test('missing image uses existing scene fallback rather than blocking application startup',()=>{
  const h=harness();h.events.error({target:{tagName:'IMG'}});h.doc.readyState='interactive';h.win.OneSpaceBoot.complete();
  assert.equal(h.attrs['data-onespace-boot'],'ready');
});
test('no-JS fallback is preserved and deterministic readiness has no arbitrary delay or storage writer',()=>{
  const h=harness();assert.equal(html.match(/<html[^>]*data-onespace-boot/),null);
  const source=html.match(/<script id="onespaceBootController">([\s\S]*?)<\/script>/)[1];
  assert.doesNotMatch(source,/setTimeout|setInterval|localStorage|sessionStorage/);
  assert.equal(h.attrs['aria-busy'],'true');assert(html.includes('id="onespaceBoot"'));
});
