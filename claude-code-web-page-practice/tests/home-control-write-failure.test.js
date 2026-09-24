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
