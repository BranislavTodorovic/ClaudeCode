const fs=require('fs'),path=require('path'),http=require('http');
const repo=path.resolve(__dirname,'../../..');
const {createServer}=require(path.join(repo,'server/_static-server.js'));
const app=createServer({root:repo,missingAsset:process.env.BOOT_MISSING_SCENE||''});
const probe=`<script id="bootPaintProbe">(function(){
var frames=[],done=false,afterReady=0,start=performance.now(),runtime=[];
['warn','error'].forEach(function(level){var original=console[level];console[level]=function(){runtime.push({level:level,message:Array.from(arguments).map(String).join(' ')});original.apply(console,arguments);};});
window.addEventListener('error',function(event){if(event.message)runtime.push({level:'exception',message:event.message});},true);
window.addEventListener('unhandledrejection',function(event){runtime.push({level:'rejection',message:String(event.reason)});});
function visible(el){return !!el&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';}
function frame(){
var body=document.body,views=Array.from(document.querySelectorAll('[data-page-when]')).filter(visible);
frames.push({ms:Math.round(performance.now()-start),boot:document.documentElement.getAttribute('data-onespace-boot'),page:body&&body.dataset.page,visibleViews:views.map(el=>el.id),stages:views.map(el=>({view:el.id,mounted:!!el.querySelector('.osr-shell'),redesignVisible:visible(el.querySelector('.osr-frame'))})),oldNavigation:visible(document.getElementById('oneSpaceSidebar')),gameVault:visible(document.querySelector('.gv-header')),scroll:scrollY,client:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth});
if(!done||afterReady++<2)requestAnimationFrame(frame);else{var out=document.createElement('pre');out.id='bootPaintEvidence';out.textContent=JSON.stringify({frames:frames,runtime:runtime,activeFocus:document.activeElement&&document.activeElement.id,hash:location.hash,finalPage:body.dataset.page,sceneStates:Array.from(document.querySelectorAll('.osr-scene-host')).map(el=>({state:el.dataset.assetState,view:el.closest('[data-page-when]')&&el.closest('[data-page-when]').id}))});out.style.cssText='position:fixed;right:0;bottom:0;width:8px;height:8px;overflow:auto;font-size:1px;white-space:pre-wrap;z-index:10000';body.appendChild(out);['Back','Forward'].forEach(function(action){var button=document.createElement('button');button.style.cssText='position:fixed;right:'+ (action==='Back'?10:150)+'px;bottom:12px;z-index:10001';button.textContent='Fixture '+action;button.onclick=function(){history[action.toLowerCase()]();};body.appendChild(button);});}
}
requestAnimationFrame(frame);document.addEventListener('DOMContentLoaded',function(){done=true;});
})();</script>`;
const server=http.createServer((req,res)=>{
const url=new URL(req.url,'http://localhost');
res.setHeader('Cache-Control','no-store');
if(url.pathname==='/'||url.pathname==='/index.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});var html=fs.readFileSync(path.join(repo,'index.html'),'utf8').replace('<head>','<head>'+probe);if(url.searchParams.get('fault')==='script')html=html.replace('src="games/games-redesign.js"','src="shared/missing-boot-fixture.js"');if(url.searchParams.get('fault')==='scene')html=html.replace('<head>','<head><base href="/scene-fault/">');res.end(html);return;}
if(url.pathname.startsWith('/scene-fault/')){req.url=req.url.replace('/scene-fault/','/');if(url.pathname.endsWith('/assets/scenes/games/hero.png')){res.writeHead(404);res.end('Fixture missing scene');return;}}
// Diagnostic latency exposes the parser's render windows; never part of the product fix.
if(/\/(?:home|work|personal|explore|games)-redesign\.js$/.test(url.pathname)||url.pathname==='/shared/redesign-foundation.js'){setTimeout(()=>app.emit('request',req,res),180);return;}
app.emit('request',req,res);
});
server.listen(Number(process.env.PORT)||18979,'127.0.0.1',()=>console.log('Instrumented startup fixture at http://localhost:'+(process.env.PORT||18979)));
