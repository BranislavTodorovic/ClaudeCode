const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('domain modules may read only their own persisted records; Home is the sole cross-domain aggregator',()=>{
 const ownership={work:/^orbit-work-/,personal:/^orbit-personal-/,games:/^orbit-games-/,movies:/^orbit-movies-/,explore:/^orbit-(explore-|trip-board$)/};
 for(const [folder,allowed] of Object.entries(ownership))for(const name of fs.readdirSync(path.join(root,folder)).filter(n=>n.endsWith('.js'))){
  for(const m of read(folder+'/'+name).matchAll(/['"](orbit-[\w-]+)['"]/g))assert(allowed.test(m[1]),folder+'/'+name+' reads '+m[1]);
 }
 const home=read('home/home-overview.js');for(const key of ['orbit-work-projects','orbit-tasks','orbit-notes-list'])assert(home.includes(key));
 assert(!read('work/projects.js').includes('homeOverview'));
});
test('page subtree declarations and shell renderers respect domain boundaries',()=>{
 const html=read('index.html');
 const work=html.slice(html.indexOf('<section id="workView"'),html.indexOf('<section id="personalView"'));
 const explore=html.slice(html.indexOf('<section id="exploreView"'),html.indexOf('<section id="moviesView"'));
 for(const jump of work.matchAll(/data-page-jump="([^"]+)"/g))assert(['work','projects'].includes(jump[1]));
 for(const jump of explore.matchAll(/data-page-jump="([^"]+)"/g))assert.equal(jump[1],'explore');
 assert(!/id="(?:focusRail|mobileTodayToggle|railTasks|railNote)"/.test(html));
 assert(html.includes('link.category === "Travel" &&'));
 const render=html.slice(html.indexOf('function renderWorkPage()'),html.indexOf('/* =====================================================================\n   * Personal —'));
 assert(!/\btasks\b|STORAGE\.notes|STORAGE\.countdowns/.test(render));
 const close=html.slice(html.indexOf('document.getElementById("endWorkdayBtn").addEventListener'),html.indexOf('document.getElementById("welcomeDone")'));
 assert(!/applySpace|goToPage|\btasks\b/.test(close));
});
test('storage rejects unregistered trip records and uses the injected validator without requiring Explore',()=>{
 const source=read('shared/storage-utils.js');assert(!/require\(|window\.OneSpaceTrips/.test(source));
 const context={module:{exports:{}},URL};vm.runInNewContext(source,context);const storage=context.module.exports;
 const trip={id:'trip'};assert.equal(storage.valid('orbit-trip-board',JSON.stringify([trip])),false);
 storage.registerValidator('orbit-trip-board',x=>x.id==='trip');assert.equal(storage.valid('orbit-trip-board',JSON.stringify([trip])),true);
 assert.equal(storage.valid('orbit-trip-board','[{"id":"other"}]'),false);
});
test('local discovery requests only the selected domain snapshot',async()=>{
 const discovery=require('../explore/local-discovery'),seen=[];
 const adapter=discovery.create(domain=>{seen.push(domain);return {};});
 await adapter.request('destinations','search',{});assert.deepEqual(seen,['destinations']);
 assert(!/orbit-games|orbit-movies|orbit-trip-board/.test(read('explore/discovery-ui.js')));
});
