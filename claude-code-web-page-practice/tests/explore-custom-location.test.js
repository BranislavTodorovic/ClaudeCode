'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const local = require('../explore/local-discovery');
const trips = require('../explore/trip-board');

// Exercise the actual owner dialog callback, including local-image upload and persistence.
function owner(existing) {
  let submit, actions, reader, saved = existing ? trips.save([], existing, 'trip-audit') : [];
  const upload = {}, board = {querySelectorAll: () => [], setAttribute() {}};
  const context = {
    setTimeout, FileReader: class { constructor() { reader = this; } readAsDataURL() {} },
    document: {
      getElementById: () => ({append() {}}), createElement: () => board,
      querySelector: selector => selector.includes('localImage') ? upload : {}
    },
    window: {
      OneSpaceLocalDiscovery: local, OneSpaceTrips: trips,
      OneSpace: {escapeHtml: String, iconSvg: () => '', uid: prefix => prefix+'-audit', showToast() {}, safeGet: () => '[]',
        safeGetJSON: (key, fallback) => key === 'orbit-trip-board' ? saved : fallback,
        safeSet: (key, value) => { if(key === 'orbit-trip-board') saved = JSON.parse(value); return true; }},
      OneSpaceUI: {field: () => '', select: () => '', open: (title, html, callback) => { submit = callback; }},
      OneSpaceDiscovery: {label: String, photo: () => '', wirePhotos() {}, mount: (host, domain, options) => {
        actions = options; return {refresh() {}, random() {}};
      }}
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../explore/explore-global.js'), 'utf8'), context);
  actions.manual(existing);
  return {
    upload() { upload.onchange({target: {files: [{type: 'image/png', size: 24}]}}); reader.result = 'data:image/png;base64,YQ=='; reader.onload(); },
    save(removeImage) { const values = {name: 'Audit location', country: 'Local', description: 'A real user-entered description.', category: 'place', lat: '', lon: '', website: 'https://example.com/', notes: 'Keep my location notes.', removeImage: removeImage ? 'on' : null}; return submit({get: name => values[name]}); },
    destination: () => saved[0].destination
  };
}

test('custom location form does not claim an image or license when none was supplied', () => {
  const ui = owner(); assert.equal(ui.save(), true);
  const x = ui.destination();
  assert.equal(x.image, ''); assert.match(x.source.license, /no image supplied/);
  assert.equal(x.description, 'A real user-entered description.');
  assert.equal(x.notes, 'Keep my location notes.');
});
test('local upload does not invent image licensing or source', () => {
  const ui = owner(); ui.upload(); assert.equal(ui.save(), true);
  assert.equal(ui.destination().image, 'data:image/png;base64,YQ==');
  assert.match(ui.destination().source.license, /image source and license not supplied/);
});
test('editing unchanged custom imagery preserves supplied provenance', () => {
  const source = {name: 'Photographer', url: 'https://example.com/photo', license: 'CC BY 4.0'};
  const ui = owner({id:'manual-kept',kind:'destination',name:'Kept',country:'Local',description:'Kept details',image:'data:image/png;base64,YQ==',source});
  assert.equal(ui.save(), true); assert.deepEqual(ui.destination().source, source);
});
test('image removal and legacy automatic provenance reflect the new image state', () => {
  const x = {id:'manual-kept',kind:'destination',name:'Kept',country:'Local',description:'Kept details',image:'data:image/png;base64,YQ==',source:{name:'Your location',url:'',license:'User-supplied description and image.'}};
  const ui = owner(x); assert.equal(ui.save(true), true);
  assert.equal(ui.destination().image, ''); assert.match(ui.destination().source.license, /no image supplied/);
  const legacy = owner({...x,image:''}); assert.equal(legacy.save(), true);
  assert.match(legacy.destination().source.license, /no image supplied/);
});
test('existing automatic image claims are corrected on read without rewriting saved locations', () => {
  for(const image of ['', 'data:image/png;base64,YQ==']) {
    const x = {id:'manual-legacy',kind:'destination',name:'Kept',country:'Local',description:'Keep my detail',image,source:{name:'Your location',url:'',license:'User-supplied description and image.'}};
    const before = JSON.stringify(x);
    const item = local.pool('destinations', {trips:[{destination:x}]})[0];
    assert.match(item.source.license, image ? /source and license not supplied/ : /no image supplied/);
    assert.equal(item.description,x.description); assert.equal(item.image,image || null);
    assert.equal(JSON.stringify(x),before);
    assert.match(local.normalize({...x,kind:undefined},'destinations').source.license, image ? /source and license not supplied/ : /no image supplied/);
  }
});
