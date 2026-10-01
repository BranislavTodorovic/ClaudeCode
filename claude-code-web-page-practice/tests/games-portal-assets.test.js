'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {portals}=require('../games/games-redesign');
test('every Games portal uses a distinct local composition with retained master and traceable display copy',()=>{
 const folder=path.join(__dirname,'../assets/scenes/games/portals'),manifest=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json')));
 assert.deepEqual(manifest.assets.map(a=>a.slug),portals.map(p=>p[0]));
 assert.match(manifest.source,/six independent original prompts/);assert.match(manifest.fallback,/readable title/);
 const masters=new Set(),displays=new Set();
 for(const asset of manifest.assets){
   const master=fs.readFileSync(path.join(folder,asset.original)),display=fs.readFileSync(path.join(folder,asset.file));
   const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
   assert.equal(hash(master),asset.masterSha256);assert.equal(hash(display),asset.displaySha256);
   assert.equal(master.readUInt32BE(16),1536);assert.equal(master.readUInt32BE(20),1024);
   assert(display.length<master.length/8);assert.equal(display[0],255);assert.equal(display[1],216);
   assert.match(asset.sourceId,/^exec-/);assert.match(asset.prompt,/Primary request:/);
   masters.add(hash(master));displays.add(hash(display));
 }
 assert.equal(masters.size,6);assert.equal(displays.size,6);
});
