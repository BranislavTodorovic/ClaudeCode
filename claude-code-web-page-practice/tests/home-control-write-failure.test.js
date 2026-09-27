const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

test('Home theme toggle does not display an unsaved theme',()=>{
  const source=html.match(/  themeToggle\.addEventListener\("click", function \(\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source,'Home theme handler exists');
  let click,accepted=false,applied='';
  const context={themeToggle:{addEventListener:(type,handler)=>{click=handler;}},root:{getAttribute:()=> 'dark'},
    STORAGE:{theme:'orbit-theme'},safeSet:(key,value)=>{assert.equal(key,'orbit-theme');assert.equal(value,'light');return accepted;},applyTheme:value=>{applied=value;}};
  vm.runInNewContext(source,context);
  click();assert.equal(applied,'');
  accepted=true;click();assert.equal(applied,'light');
});

test('Home search provider keeps its pressed state when storage rejects selection',()=>{
  const source=html.match(/  function renderProviders\(\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source,'Home provider renderer exists');
  let accepted=false,focuses=0,saved='';
  const buttons=['google','youtube'].map(id=>({getAttribute:()=>id,addEventListener(type,handler){this.click=handler;}}));
  const providersEl={innerHTML:'',querySelectorAll:()=>buttons};
  const context={providersEl,SEARCH_PROVIDERS:[{id:'google',icon:'a',label:'Google'},{id:'youtube',icon:'b',label:'YouTube'}],
    currentProvider:'google',STORAGE:{searchProvider:'orbit-search-provider'},iconSvg:()=>'',escapeHtml:value=>value,
    searchInput:{focus:()=>{focuses++;}},safeSet:(key,value)=>{assert.equal(key,'orbit-search-provider');saved=value;return accepted;}};
  vm.runInNewContext(source,context);
  context.renderProviders();
  buttons[1].click();
  assert.equal(saved,'youtube');assert.equal(context.currentProvider,'google');assert.match(providersEl.innerHTML,/aria-pressed="true">Google/);
  accepted=true;buttons[1].click();
  assert.equal(context.currentProvider,'youtube');assert.match(providersEl.innerHTML,/aria-pressed="true">YouTube/);assert.equal(focuses,1);
});

test('Quick Access selection commits both preference keys before changing the view',()=>{
  const source=html.match(/  function selectQuickAccessTab\(nextTab\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source,'Quick Access selection handler exists');
  let reject=true,renders=0;const toasts=[];
  const previous={work:'favorites'};
  const context={quickAccessTab:'favorites',spaceQuickTabs:previous,currentSpace:'work',
    STORAGE:{spaceQuickTabs:'orbit-space-quick-tabs',quickTab:'orbit-quick-access-tab'},
    window:{localStorage:{},OneSpaceStorage:{transaction:(store,writes)=>{
      assert.equal(writes['orbit-quick-access-tab'],'recent');
      assert.equal(JSON.parse(writes['orbit-space-quick-tabs']).work,'recent');
      if(reject)throw Error('Quota exceeded');
    }}},showToast:message=>toasts.push(message),renderPersonalSections:()=>{renders++;}};
  vm.runInNewContext(source,context);
  assert.equal(context.selectQuickAccessTab('recent'),false);
  assert.equal(context.quickAccessTab,'favorites');assert.equal(context.spaceQuickTabs,previous);assert.equal(renders,0);assert.match(toasts[0],/could not be saved/i);
  reject=false;assert.equal(context.selectQuickAccessTab('recent'),true);
  assert.equal(context.quickAccessTab,'recent');assert.equal(context.spaceQuickTabs.work,'recent');assert.equal(renders,1);
});

test('shortcut history and usage do not advance in memory after rejected storage writes',()=>{
  const recentSource=html.match(/  function rememberRecent\(id\) \{[\s\S]*?\n  \}/)?.[0];
  const usageSource=html.match(/  function recordUsage\(id\) \{[\s\S]*?\n  \}/)?.[0];
  assert(recentSource && usageSource);
  let accept=false,renders=0;
  const context={recentIds:['old'],usageCounts:{old:2},quickAccessTab:'used',
    STORAGE:{recent:'recent',usage:'usage'},safeSet:()=>accept,
    renderPersonalSections:()=>{renders++;}};
  vm.runInNewContext(recentSource+'\n'+usageSource,context);
  assert.equal(context.rememberRecent('new'),false);
  assert.deepEqual(Array.from(context.recentIds),['old']);
  assert.equal(context.recordUsage('old'),false);
  assert.equal(context.usageCounts.old,2);
  assert.equal(renders,0);
  accept=true;
  assert.equal(context.rememberRecent('new'),true);
  assert.deepEqual(Array.from(context.recentIds),['new','old']);
  assert.equal(context.recordUsage('old'),true);
  assert.equal(context.usageCounts.old,3);
  assert.equal(renders,2);
});

test('Random Pick reports an empty travel collection without opening a destination',()=>{
  const source=html.match(/  document\.getElementById\("randomPick"\)\.addEventListener\("click", function \(\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source,'Random Pick handler exists');
  let click,opens=0,recents=0,uses=0;const toasts=[];
  const context={document:{getElementById:()=>({addEventListener:(type,handler)=>{click=handler;}})},
    linksForSpace:()=>[{id:'work',category:'Work'}],
    rememberRecent:()=>{recents++;},recordUsage:()=>{uses++;},
    window:{open:()=>{opens++;}},showToast:message=>toasts.push(message)};
  vm.runInNewContext(source,context);
  click();
  assert.equal(opens,0);assert.equal(recents,0);assert.equal(uses,0);
  assert.match(toasts[0],/No travel shortcuts available/i);
});

test('Start exploring keeps Welcome open until onboarding can be saved',()=>{
  const source=html.match(/  document\.getElementById\("welcomeDone"\)\.addEventListener\("click", function \(\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source);
  let click,accept=false,closes=0;
  const overlay={},context={STORAGE:{onboarding:'orbit-onboarding'},
    document:{getElementById:id=>id==='welcomeDone'?{addEventListener:(type,handler)=>{click=handler;}}:overlay},
    safeSet:(key,value)=>{assert.equal(key,'orbit-onboarding');assert.equal(value,'true');return accept;},
    closeModal:target=>{assert.equal(target,overlay);closes++;}};
  vm.runInNewContext(source,context);
  click();assert.equal(closes,0);
  accept=true;click();assert.equal(closes,1);
});
