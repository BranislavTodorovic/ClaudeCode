const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('ten distinct drawn scenes and static Games/Movies heroes cover all route domains',()=>{
 const source=read('shared/cinematic-scenes.js'),html=read('index.html');
 const names=[...source.matchAll(/\b(home|work|personal|explore|games|movies|shortcuts|productivity|notes|settings):\{number:'(\d+)',name:'([^']+)'/g)];
 assert.equal(names.length,10);assert.equal(new Set(names.map(m=>m[3])).size,10);
 for(const page of ['games','movies'])assert(new RegExp('<header class="page-hero" data-page-hero="'+page+'">').test(html));
 assert(!source.includes('nth-child'));assert(!html.includes('projects-scene'));
});
test('scene depth is bounded and applied only to decorative drawing/art layers',()=>{
 const controller=read('shared/cinematic-scenes.js');assert(controller.includes('Math.max(-1,Math.min(1,'));assert(controller.includes("e.pointerType!=='mouse'"));assert(controller.includes("intensity(el)!=='full'"));
 const html=read('index.html');assert(!html.includes('hero.style.setProperty("--px"'));assert(!read('work/projects.js').includes("pointermove"));assert(!read('explore/discovery-integration.js').includes('pointermove'));
 for(const file of ['games/games.js','movies/movies.js']){assert(read(file).includes('OS.scene.bind(hero)'));assert(!read(file).includes('function animatePointer()'));assert(!read(file).includes('revealObserver = new IntersectionObserver'));}
});
test('reduced motion and per-page Off eliminate scene drift rather than slowing it',()=>{
 const css=read('styles/cinematic-refinement.css');assert(css.includes('body.scene-still *'));assert(css.includes('animation:none!important;transition:none!important'));assert(css.includes('[data-scene-intensity="off"]'));
 const controller=read('shared/cinematic-scenes.js');assert(controller.includes('return OS.prefersReducedMotion()'));assert(controller.includes('resetPointer(hero)'));assert(controller.includes("document.body.classList.toggle('scene-still',still)"));
});
test('drawn scenes use no external requests or binary assets',()=>{
 const source=read('shared/cinematic-scenes.js');assert(!/\bfetch\(|new Image\(|https:\/\//.test(source));assert(source.includes('<svg viewBox='));assert(source.includes("hero.prepend(art)"));
});

test('pointer depth clamps, resets and ignores touch, reduced and Off input',()=>{
 const vm=require('node:vm'),handlers={},values={},view={dataset:{sceneIntensity:'full'}};
 let still=false,fine=true;
 const hero={closest:()=>view,style:{setProperty:(k,v)=>values[k]=v},addEventListener:(k,v)=>handlers[k]=v,getBoundingClientRect:()=>({left:0,top:0,width:200,height:100})};
 const OS={prefersReducedMotion:()=>still},document={hidden:false};
 const source=read('shared/cinematic-scenes.js').split(' // Drawn compositions')[0]+'})();';
 vm.runInNewContext(source,{window:{OneSpace:OS},document,matchMedia:()=>({matches:fine}),setTimeout,clearTimeout});
 OS.scene.bind(hero);OS.scene.bind(hero);
 handlers.pointermove({pointerType:'mouse',clientX:500,clientY:-100});
 assert.equal(values['--scene-x'],'10.00px');assert.equal(values['--scene-y'],'-6.00px');
 handlers.pointerleave();assert.equal(values['--scene-x'],'0px');
 for(const mode of ['touch','reduced','off','coarse','hidden']){
  still=mode==='reduced';fine=mode!=='coarse';document.hidden=mode==='hidden';view.dataset.sceneIntensity=mode==='off'?'off':'full';
  handlers.pointermove({pointerType:mode==='touch'?'touch':'mouse',clientX:200,clientY:100});assert.equal(values['--scene-x'],'0px',mode);
 }
});

test('scene lifecycle stages entry, settle and ambient; exit resets without same-page replay',()=>{
 const vm=require('node:vm'),scheduled=[],events=[];let still=false;
 function classList(){var values=new Set();return {add:x=>values.add(x),remove:x=>values.delete(x),contains:x=>values.has(x)};}
 function view(id,level){var styles={};var node={id,hidden:false,dataset:{sceneIntensity:level||'full'},classList:classList(),style:{setProperty:(k,v)=>styles[k]=v,removeProperty:k=>delete styles[k]},querySelectorAll:()=>[],closest:()=>node,offsetWidth:1200};return node;}
 const document={hidden:false,body:{classList:classList()},querySelectorAll:()=>[],dispatchEvent:e=>events.push(e.detail)};
 const OS={prefersReducedMotion:()=>still};
 const setTimer=(fn,delay)=>{var task={fn,delay,cancelled:false};scheduled.push(task);return task;};
 const clearTimer=task=>{if(task)task.cancelled=true;};
 const source=read('shared/cinematic-scenes.js').split(' // Drawn compositions')[0]+'})();';
 vm.runInNewContext(source,{window:{OneSpace:OS},document,matchMedia:()=>({matches:true}),setTimeout:setTimer,clearTimeout:clearTimer,CustomEvent:function(type,init){this.type=type;this.detail=init.detail;}});
 const home=view('homeView');OS.scene.enter(home);assert.equal(home.dataset.sceneState,'entry');
 scheduled.find(x=>x.delay===2350).fn();assert.equal(home.dataset.sceneState,'settle');
 scheduled.find(x=>x.delay===3350).fn();assert.equal(home.dataset.sceneState,'ambient');
 var eventCount=events.length;OS.scene.enter(home);assert.equal(events.length,eventCount,'same-page work must not restart entry');
 const work=view('workView');OS.scene.enter(work);assert.equal(home.dataset.sceneState,'idle');assert.equal(work.dataset.sceneState,'entry');
 OS.scene.exit(work);assert.equal(work.dataset.sceneState,'idle');
 const subtle=view('personalView','subtle');OS.scene.enter(subtle);assert.equal(subtle.dataset.sceneState,'entry');assert(scheduled.some(x=>x.delay===1050));assert(scheduled.some(x=>x.delay===1550));
 OS.scene.exit(subtle);const off=view('notesView','off');OS.scene.enter(off);assert.equal(off.dataset.sceneState,'still');
 OS.scene.exit(off);still=true;const reduced=view('settingsView');OS.scene.enter(reduced);assert.equal(reduced.dataset.sceneState,'still');
 assert(events.some(x=>x.page==='home'&&x.state==='entry'));assert(events.some(x=>x.page==='home'&&x.state==='settle'));assert(events.some(x=>x.page==='home'&&x.state==='ambient'));
});

test('each domain entry has its own camera direction and subject motion',()=>{
 const css=read('styles/cinematic-refinement.css');
 for(const page of ['home','work','personal','explore','games','movies','shortcuts','productivity','notes','settings'])assert(css.includes('#'+page+'View .living-hero{--wake-'),page);
 for(const motion of ['sceneOrbitWake','sceneGardenWake','sceneAtlasWake','scenePortalWake','sceneProjectorWake','sceneTileWake','sceneFocusWake','sceneInkWake','sceneControlWake'])assert(css.includes('@keyframes '+motion),motion);
 assert(css.includes('var(--wake-x,32px)'));assert(css.includes('var(--wake-scale,1.12)'));
});

test('top-level navigation keeps a coherent accessible outline-icon language',()=>{
 const html=read('index.html'),css=read('styles/cinematic-refinement.css'),sidebar=html.slice(html.indexOf('<aside class="sidebar"'),html.indexOf('</aside>')+8);
 for(const page of ['home','work','personal','explore','games','movies','shortcuts','productivity','notes','settings']){
  const button=sidebar.match(new RegExp('<button[^>]*data-page-button="'+page+'"[\\s\\S]*?</button>'));
  assert(button,page+' navigation button');assert(button[0].includes('<svg class="icon'),page+' icon');assert(/(?:aria-label|title)="[^"]+"/.test(button[0]),page+' accessible label');
 }
 for(const id of ['sideCommand','sideToolbox','sideAdd','customizeBtn','sideHelp']){
  const button=sidebar.match(new RegExp('<button[^>]*id="'+id+'"[\\s\\S]*?</button>'));
  assert(button,id);assert(button[0].includes('<svg class="icon'));assert(button[0].includes('aria-label='));
 }
 assert(html.includes('<script src="shared/tooltip-utils.js"></script>'));
 assert(css.includes(':is(button,a,input,select,textarea,[tabindex]):focus-visible'));
 assert(css.includes('outline:3px solid var(--page-accent)'));
});
