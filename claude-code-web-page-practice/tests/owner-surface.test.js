'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {createOwnerSurface}=require('../shared/redesign-foundation');
function fixture(world='games',workView='active'){
 const events={},windowEvents={},stack=[null];let index=0,doc;
 class Element{
  constructor(tag='SECTION'){this.tagName=tag;this.children=[];this.dataset={};this.attrs={};this.listeners={};this.hidden=false;this.isConnected=true;this.classList={add(){}};}
  appendChild(child){if(child.parent)child.parent.children.splice(child.parent.children.indexOf(child),1);child.parent=this;this.children.push(child);return child;}
  prepend(child){this.appendChild(child);this.children.splice(this.children.indexOf(child),1);this.children.unshift(child);}
  contains(child){return this===child||this.children.some(el=>el.contains(child));}
  querySelector(selector){return selector==='.osr-frame'?frame:selector==='main'?landing:selector==='h1'?landingTitle:null;}
  setAttribute(k,v){this.attrs[k]=v;}hasAttribute(k){return k in this.attrs;}
  addEventListener(name,fn){this.listeners[name]=fn;}focus(){doc.activeElement=this;}
 }
 const view=new Element(),stage=new Element(),frame=new Element(),landing=new Element('MAIN'),landingTitle=new Element('H1'),owner=new Element(),trigger=new Element('BUTTON');
 view.appendChild(stage);view.appendChild(owner);stage.appendChild(frame);frame.appendChild(landing);landing.appendChild(landingTitle);landing.appendChild(trigger);
 const win={scrollY:350,location:{href:'http://localhost/#/w/'+world},scrollTo({top}){this.scrollY=top;},addEventListener(name,fn){windowEvents[name]=fn;},OneSpace:{goToPage(){doc.body.dataset.workView='active';events['onespace:page-changed']({detail:{page:'work',previous:'work'}});}}};
 win.history={get state(){return stack[index];},pushState(state){stack.splice(++index);stack[index]=state;},back(){if(index>0)index--;windowEvents.popstate();},forward(){if(index<stack.length-1)index++;windowEvents.popstate();}};
 doc={defaultView:win,body:{dataset:{page:world,workView}},activeElement:trigger,createElement:tag=>new Element(tag.toUpperCase()),addEventListener(name,fn){events[name]=fn;}};
 view.ownerDocument=doc;
 const surface=createOwnerSurface(view,stage,world,world==='work'?'Work':'Games');
 return {surface,view,stage,frame,landing,owner,trigger,doc,win,events,stack};
}
test('owner handoff preserves canonical nodes, separates landing and supports Back/Forward focus return',()=>{
 const f=fixture();const original=f.owner;original.savedRecord={id:'canonical'};
 assert(f.surface.tools.hidden);assert(!f.landing.hidden);
 f.surface.show('Game Library');assert(f.landing.hidden);assert(!f.surface.tools.hidden);
 assert(f.surface.tools.contains(original));assert.equal(original.savedRecord.id,'canonical');
 assert.equal(f.stack.length,2);assert.equal(f.win.history.state.osrOwner,'games');
 f.surface.show('Game Sessions');assert.equal(f.stack.length,2,'switching owner tools must not stack duplicate history entries');
 f.surface.tools.children[0].children[0].listeners.click();assert(!f.landing.hidden);assert(f.surface.tools.hidden);
 assert.equal(f.doc.activeElement,f.trigger);assert.equal(f.win.scrollY,350);
 f.win.history.forward();assert(f.landing.hidden);assert(!f.surface.tools.hidden);
 assert.equal(f.stage.dataset.surface,'owner');assert.equal(f.frame.children.filter(el=>el===f.surface.tools).length,1);
});
test('ordinary owner navigation stays usable; global world entry returns to landing',()=>{
 const f=fixture();f.surface.show('Game Library');f.doc.activeElement=f.owner;
 f.events['onespace:page-changed']({detail:{page:'games',previous:'games'}});assert(!f.surface.tools.hidden);
 f.doc.activeElement=f.trigger;f.events['onespace:page-changed']({detail:{page:'games',previous:'games'}});
 assert(f.surface.tools.hidden);assert(!f.landing.hidden);
 f.surface.show('Game Sessions');f.doc.body.dataset.page='work';f.events['onespace:page-changed']({detail:{page:'work',previous:'games'}});
 assert(f.surface.tools.hidden);
});
test('existing Work Projects deep link exposes its owner and explicit return resolves parent',()=>{
 const f=fixture('work','projects');assert(f.landing.hidden);assert(!f.surface.tools.hidden);
 assert.equal(f.stack.length,1,'compatibility deep link does not manufacture a nested module history entry');
 f.surface.tools.children[0].children[0].listeners.click();assert(!f.landing.hidden);assert(f.surface.tools.hidden);
 assert.equal(f.doc.body.dataset.workView,'active');
});
