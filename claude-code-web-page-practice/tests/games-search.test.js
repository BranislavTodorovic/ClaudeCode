'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {wireSearch}=require('../games/games-redesign'),catalog=require('../shared/catalog-utils');
function element(){return {listeners:{},attrs:{},value:'',innerHTML:'',hidden:false,textContent:'',focused:false,
 addEventListener(name,fn){this.listeners[name]=fn;},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},
 replaceChildren(){this.innerHTML='';},focus(){this.focused=true;}};}
function setup(search){const form=element(),input=element(),results=element(),status=element(),clear=element();form.parentElement=element();
 const records=[{id:'alan',title:'Alan Wake 2'},{id:'resident',title:'Resident Evil 4'},{id:'hades',title:'Hades'}];
 const queries=[];wireSearch(form,input,results,status,clear,q=>{queries.push(q);return search?search(q):catalog.search(records,q);},s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'));
 return {form,input,results,status,clear,queries,submit(){form.listeners.submit({preventDefault(){}});}};}
test('empty Games search validates locally and keeps keyboard focus without calling the catalogue',()=>{
 const h=setup();h.input.value='   ';h.submit();assert.equal(h.input.focused,true);assert.equal(h.input.attrs['aria-invalid'],'true');assert.match(h.status.textContent,/Enter a game name/);assert.deepEqual(h.queries,[]);assert.equal(h.results.hidden,true);
});
test('exact and partial search present the real local match and detail identity',()=>{
 for(const q of ['Alan Wake 2','alan','resid']){const h=setup();h.input.value=q;h.submit();assert.equal(h.results.hidden,false);assert.match(h.status.textContent,/1 local match/);assert.match(h.results.innerHTML,/data-games-action="game-details"/);assert.match(h.results.innerHTML,q==='resid'?/data-game-id="resident"/:/data-game-id="alan"/);}
});
test('no match reports local-only absence and removes stale results',()=>{
 const h=setup();h.input.value='Hades';h.submit();h.input.value='not-a-real-game';h.submit();assert.equal(h.results.hidden,true);assert.equal(h.results.innerHTML,'');assert.match(h.status.textContent,/No local matches/);
});
test('repeated submit replaces results; edits and Clear remove stale validation/result state',()=>{
 const h=setup();h.input.value='Hades';for(let i=0;i<5;i++)h.submit();assert.equal((h.results.innerHTML.match(/<button/g)||[]).length,1);
 h.input.listeners.input();assert.equal(h.results.hidden,true);assert.equal(h.results.innerHTML,'');
 h.input.value='';h.submit();h.clear.listeners.click();assert.equal(h.input.value,'');assert.equal(h.input.focused,true);assert.equal(h.input.attrs['aria-invalid'],undefined);assert.match(h.status.textContent,/bundled catalogue/);
});
test('Escape dismisses local results and restores the search input without leaking to other shortcuts',()=>{
 const h=setup();h.input.value='Hades';h.submit();let prevented=false,stopped=false;
 h.form.parentElement.listeners.keydown({key:'Escape',preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});
 assert(prevented&&stopped);assert.equal(h.results.hidden,true);assert.equal(h.input.focused,true);
});
test('search exceptions keep a truthful usable local-library path and no stale results',()=>{
 const h=setup(()=>{throw Error('Unavailable');});h.input.value='Hades';h.submit();assert.equal(h.results.hidden,true);assert.match(h.status.textContent,/unavailable.*Game Library/);
});
test('untrusted imported catalogue titles and ids cannot inject markup in result buttons',()=>{
 const h=setup(()=>[{id:'"><img src=x>',title:'<script>alert(1)</script>'}]);h.input.value='query';h.submit();assert(!h.results.innerHTML.includes('<script>'));assert(!h.results.innerHTML.includes('<img'));assert.match(h.results.innerHTML,/&lt;script>/);
});
