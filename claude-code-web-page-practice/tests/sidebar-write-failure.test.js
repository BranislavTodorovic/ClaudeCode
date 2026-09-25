const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('sidebar toggle waits for storage before changing the visible expansion state',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function toggleSidebar\(\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source,'sidebar toggle handler exists');
  let accepted=false,applied=0,saved='';
  const context={sidebarCollapsed:false,STORAGE:{sidebar:'orbit-sidebar'},
    safeSet:(key,value)=>{assert.equal(key,'orbit-sidebar');saved=value;return accepted;},
    applySidebarState:()=>{applied++;}};
  vm.runInNewContext(source,context);
  assert.equal(context.toggleSidebar(),false);
  assert.equal(saved,'collapsed');assert.equal(context.sidebarCollapsed,false);assert.equal(applied,0);
  accepted=true;
  assert.equal(context.toggleSidebar(),true);
  assert.equal(context.sidebarCollapsed,true);assert.equal(applied,1);
});

test('route navigation keeps the current page when storage rejects the new page',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function goToPage\(page, persist\) \{[\s\S]*?\n  \}\n  function applyMinimalMode/)?.[0].replace(/\n  function applyMinimalMode$/,'');
  assert(source,'route navigation handler exists');
  let attempted='',changed=false;
  const context={PAGES:['home','work'],STORAGE:{page:'orbit-page'},currentPage:'home',
    safeSet:(key,value)=>{assert.equal(key,'orbit-page');attempted=value;return false;},
    document:{body:{dataset:{},setAttribute:()=>{changed=true;}}}};
  vm.runInNewContext(source,context);
  assert.equal(context.goToPage('projects'),false);
  assert.equal(attempted,'work');assert.equal(context.currentPage,'home');assert.equal(context.document.body.dataset.workView,undefined);assert.equal(changed,false);
});

test('Chill Mode keeps the prior view when its preference cannot be saved',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  document\.getElementById\("chillModeBtn"\)\.addEventListener\("click", function \(\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source,'Chill Mode handler exists');
  let click,accepted=false,active=false,toasts=0;
  const strip={hidden:true};
  const context={STORAGE:{chill:'orbit-chill-mode'},safeSet:()=>accepted,
    document:{body:{classList:{contains:()=>active,toggle:(name,value)=>{assert.equal(name,'chill-mode');active=value;}}},getElementById:id=>id==='chillModeBtn'?{addEventListener:(type,handler)=>{click=handler;}}:strip},
    closeMobileSidebar:()=>{},showToast:()=>{toasts++;}};
  vm.runInNewContext(source,context);
  click();assert.equal(active,false);assert.equal(strip.hidden,true);assert.equal(toasts,0);
  accepted=true;click();assert.equal(active,true);assert.equal(strip.hidden,false);assert.equal(toasts,1);
});

test('Shortcuts space selection retains its prior space after a rejected write',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function applySpace\(space, shouldRender, persist\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source,'space selection handler exists');
  let changed=false;
  const context={SPACE_META:{work:{},personal:{},explore:{}},currentSpace:'work',STORAGE:{space:'orbit-space'},
    safeSet:(key,value)=>{assert.equal(key,'orbit-space');assert.equal(value,'personal');return false;},
    document:{body:{setAttribute:()=>{changed=true;}}}};
  vm.runInNewContext(source,context);
  assert.equal(context.applySpace('personal',true),false);
  assert.equal(context.currentSpace,'work');assert.equal(changed,false);
});

test('mobile page buttons and Search stop after rejected navigation writes',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const pageSource=html.match(/\n  document\.querySelectorAll\("\[data-page-button\]"\)\.forEach\(function \(button\) \{[\s\S]*?\n  \}\);/)?.[0];
  const searchSource=html.split('\n').find(line=>line.includes('document.getElementById("mobileSearch").addEventListener'));
  assert(pageSource&&searchSource);
  let pageClick,searchClick,allowMinimal=false,allowRoute=false,routes=0,closed=0,scrolled=0,focused=0;
  const pageButton={getAttribute:()=> 'games',addEventListener:(type,handler)=>{pageClick=handler;}};
  const searchButton={addEventListener:(type,handler)=>{searchClick=handler;}};
  const context={document:{querySelectorAll:()=>[pageButton],getElementById:()=>searchButton},
    applyMinimalMode:()=>allowMinimal,goToPage:()=>{routes++;return allowRoute;},
    closeMobileSidebar:()=>{closed++;},searchInput:{scrollIntoView:()=>{scrolled++;},focus:()=>{focused++;}},
    setTimeout:handler=>handler()};
  vm.runInNewContext(pageSource+'\n'+searchSource,context);
  pageClick();searchClick();assert.equal(routes,0);assert.equal(closed,0);assert.equal(scrolled,0);
  allowMinimal=true;pageClick();searchClick();assert.equal(routes,2);assert.equal(closed,0);assert.equal(scrolled,0);
  allowRoute=true;pageClick();searchClick();assert.equal(closed,1);assert.equal(scrolled,1);assert.equal(focused,1);
});
