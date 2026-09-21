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
