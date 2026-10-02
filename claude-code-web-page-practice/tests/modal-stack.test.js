'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const start = html.indexOf('  var modalStack = [];');
const end = html.indexOf('  function trapModalFocus', start);
assert(start >= 0 && end > start);
function fixture(reverse) {
  const document = { body: { children: [] }, activeElement: null, querySelector() { return null; } };
  function overlay(id, originalZ) {
    return { id, tagName:'DIV', hidden:true, inert:false, style:{zIndex:originalZ || ''}, querySelector() { return {scrollTop:0}; } };
  }
  const detail = overlay('workDetailOverlay'), form = overlay('domainOverlay','');
  const page = overlay('page'); page.hidden = false;
  document.body.children = reverse ? [page,detail,form] : [page,form,detail];
  function control(parent) { return { isConnected:true, closest() { return parent.inert || parent.hidden ? parent : null; }, hasAttribute() { return false; }, focus() { document.activeElement=this; } }; }
  const opener = control(page), addTask = control(detail), name = control(form);
  document.activeElement = opener;
  const context = vm.createContext({ document, paletteOverlay:null, paletteInput:null, Map, String });
  vm.runInContext(html.slice(start,end),context);
  return {context,document,page,detail,form,opener,addTask,name};
}
for (const reverse of [false,true]) test('nested form stays above the drawer regardless of DOM order: '+reverse, () => {
  const f=fixture(reverse);
  f.context.openModal(f.detail,f.addTask);
  f.context.openModal(f.form,f.name);
  assert(Number(f.form.style.zIndex)>Number(f.detail.style.zIndex));
  assert.equal(f.detail.inert,true); assert.equal(f.form.inert,false);
  assert.equal(f.document.activeElement,f.name);
  f.context.closeModal(f.form);
  assert.equal(f.form.hidden,true); assert.equal(f.form.style.zIndex,'');
  assert.equal(f.detail.inert,false); assert.equal(f.document.activeElement,f.addTask);
  f.context.closeModal(f.detail);
  assert.equal(f.page.inert,false); assert.equal(f.document.activeElement,f.opener);
});
test('closing an underlying drawer preserves the active form and its original stacking style', () => {
  const f=fixture(false); f.form.style.zIndex='410';
  f.context.openModal(f.detail,f.addTask); f.context.openModal(f.form,f.name);
  f.context.closeModal(f.detail);
  assert.equal(f.form.hidden,false); assert.equal(f.form.inert,false);
  assert.equal(f.document.activeElement,f.name);
  assert.equal(f.form.style.zIndex,'100');
  f.context.closeModal(f.form); assert.equal(f.form.style.zIndex,'410');
});
