'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function resourceAction(links) {
  const source = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const start = source.indexOf('document.querySelectorAll(\'[data-action="explore-random"]\').forEach');
  const end = source.indexOf('\n  document.addEventListener("onespace:page-changed"', start);
  assert(start >= 0 && end > start);
  let click; const result = {messages: [], opened: [], recent: [], usage: []};
  vm.runInNewContext(source.slice(start,end), {
    document: {querySelectorAll: () => [{addEventListener: (type, handler) => { click = handler; }}]},
    linksForSpace: space => { assert.equal(space,'explore'); return links; },
    rememberRecent: id => result.recent.push(id), recordUsage: id => result.usage.push(id),
    showToast: message => result.messages.push(message), window: {open: (...args) => result.opened.push(args)}
  });
  click(); return result;
}
test('More To Explore explains an empty resource collection instead of doing nothing', () => {
  const result = resourceAction([]);
  assert.match(result.messages[0],/No travel shortcuts available.*Add an Explore shortcut/);
  assert.deepEqual(result.opened,[]); assert.deepEqual(result.recent,[]); assert.deepEqual(result.usage,[]);
});
test('More To Explore opens an existing travel resource and preserves its usage owner', () => {
  const result = resourceAction([{id:'kept',name:'Kept resource',category:'Travel',url:'https://example.com/'}]);
  assert.deepEqual(result.opened,[['https://example.com/','_blank','noopener,noreferrer']]);
  assert.deepEqual(result.recent,['kept']); assert.deepEqual(result.usage,['kept']);
  assert.equal(result.messages[0],'How about Kept resource?');
});
