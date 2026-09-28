const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

for(const owner of ['personal','explore'])test(`${owner} Add shortcut retains prior links and the dialog draft after a rejected write`,()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  shortcutForm\.addEventListener\("submit", function \(e\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source,'shortcut submit handler exists');
  let submit,error='',rendered=false,closed=false,toasted=false;
  const prior=[{id:'old',name:'Existing',url:'https://example.org/',category:'Development',space:'work'}];
  const context={shortcutForm:{addEventListener:(kind,callback)=>{if(kind==='submit')submit=callback;}},
    shortcutNameField:{value:'New link'},shortcutUrlField:{value:'https://example.com/new'},shortcutCategoryField:{value:owner==='explore'?'Travel':'Daily'},
    shortcutSpaceField:{value:owner},shortcutDescriptionField:{value:'A new link'},shortcutIdField:{value:''},shortcutOrigin:owner,
    CATEGORIES:['Development','Daily','Travel'],customLinks:JSON.parse(JSON.stringify(prior)),allLinks:()=>prior,
    isValidHttpUrl:value=>/^https?:\/\//.test(value),saveCustomLinks:()=>false,
    showShortcutError:message=>{error=message;},renderLinks:()=>{rendered=true;},renderPersonalPage:()=>{rendered=true;},
    renderExplorePage:()=>{rendered=true;},renderWorkPage:()=>{rendered=true;},showToast:()=>{toasted=true;},closeModal:()=>{closed=true;},URL};
  vm.runInNewContext(source,context);
  submit({preventDefault(){}});
  assert.equal(JSON.stringify(context.customLinks),JSON.stringify(prior));
  assert.match(error,/could not be saved/i);
  assert.equal(context.shortcutNameField.value,'New link');
  assert.equal(context.shortcutSpaceField.value,owner);
  assert.equal(rendered,false);assert.equal(toasted,false);assert.equal(closed,false);
});

test('favorite toggle does not advance Quick Access after a rejected write',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function toggleFavorite\(id\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source);
  let accept=false,renders=0;const context={favoriteIds:[],STORAGE:{favorites:'favorites'},
    safeSet:()=>accept,renderLinks:()=>{renders++;},showToast:()=>{}};
  vm.runInNewContext(source,context);
  assert.equal(context.toggleFavorite('github'),false);
  assert.deepEqual(Array.from(context.favoriteIds),[]);assert.equal(renders,0);
  accept=true;assert.equal(context.toggleFavorite('github'),true);
  assert.deepEqual(Array.from(context.favoriteIds),['github']);assert.equal(renders,1);
});

test('Edit shortcut restores its previous record after a rejected write',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  shortcutForm\.addEventListener\("submit", function \(e\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source);
  let submit,error='',rendered=false,closed=false;
  const prior={id:'custom-a',name:'Original',url:'https://example.com/',category:'Development',space:'work',custom:true};
  const context={shortcutForm:{addEventListener:(kind,handler)=>{submit=handler;}},
    shortcutNameField:{value:'Changed'},shortcutUrlField:{value:'https://example.com/'},
    shortcutCategoryField:{value:'Development'},shortcutSpaceField:{value:'work'},
    shortcutDescriptionField:{value:'Changed description'},shortcutIdField:{value:'custom-a'},shortcutOrigin:'work',
    CATEGORIES:['Development'],customLinks:[structuredClone(prior)],allLinks:()=>[prior],
    isValidHttpUrl:()=>true,saveCustomLinks:()=>false,showShortcutError:message=>{error=message;},
    renderLinks:()=>{rendered=true;},renderPersonalPage:()=>{rendered=true;},
    renderExplorePage:()=>{rendered=true;},renderWorkPage:()=>{rendered=true;},
    document:{getElementById:()=>({value:''})},showToast:()=>{},closeModal:()=>{closed=true;},URL};
  vm.runInNewContext(source,context);
  submit({preventDefault(){}});
  assert.equal(JSON.stringify(context.customLinks[0]),JSON.stringify(prior));
  assert.match(error,/could not be saved/i);assert.equal(rendered,false);assert.equal(closed,false);
});

test('Delete shortcut retains the record on rejected persistence',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function deleteShortcut\(id, confirmed\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source);
  const prior={id:'custom-a',name:'Keep me',category:'Development'};
  let rendered=false;const toasts=[];
  const context={customLinks:[prior],saveCustomLinks:()=>false,renderLinks:()=>{rendered=true;},
    renderPersonalPage:()=>{rendered=true;},renderExplorePage:()=>{rendered=true;},
    renderWorkPage:()=>{rendered=true;},showToast:message=>toasts.push(message)};
  vm.runInNewContext(source,context);
  assert.equal(context.deleteShortcut('custom-a',true),false);
  assert.equal(context.customLinks[0],prior);assert.equal(rendered,false);
  assert.match(toasts[0],/could not be deleted/i);
});

test('space shortcut Favorite leaves the card and focus alone after rejected persistence',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../shared/shortcut-surface.js'),'utf8')
    .match(/  document\.addEventListener\('click',function\(e\)\{var b=e\.target\.closest\('\[data-space-action\]'\);[^\n]+/)?.[0];
  assert(source,'space shortcut click handler exists');
  let click,accept=false,renders=0,focuses=0;
  const button={dataset:{spaceAction:'favorite',id:'github'}};
  const context={document:{addEventListener:(kind,action)=>{click=action;},querySelectorAll:()=>[{dataset:{id:'github'},offsetParent:{},focus:()=>{focuses++;}}]},
    OS:{toggleFavorite:()=>accept,renderSpaceShortcuts:()=>{renders++;}}};
  vm.runInNewContext(source,context);
  click({target:{closest:()=>button}});
  assert.equal(renders,0);assert.equal(focuses,0);
  accept=true;click({target:{closest:()=>button}});
  assert.equal(renders,1);assert.equal(focuses,1);
});

test('shared shortcut order and hidden setters leave the view unchanged on rejected writes',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/    setShortcutOrder:function\(ids\)\{[^\n]+\},\r?\n    setHiddenShortcuts:function\(ids\)\{[^\n]+\},/)?.[0];
  assert(source,'shared shortcut setters exist');
  let accept=false,renders=0;
  const context={shortcutOrder:['one','two'],hiddenShortcutIds:['old'],
    safeSet:()=>accept,renderLinks:()=>{renders++;},renderWorkPage:()=>{renders++;},
    renderPersonalPage:()=>{renders++;},renderExplorePage:()=>{renders++;},
    document:{getElementById:()=>({value:''})},window:{OneSpace:{renderSpaceShortcuts:()=>{renders++;}}}};
  const methods=vm.runInNewContext('({' + source + '})',context);
  assert.equal(methods.setShortcutOrder(['two','one']),false);
  assert.equal(methods.setHiddenShortcuts(['old','new']),false);
  assert.deepEqual(Array.from(context.shortcutOrder),['one','two']);
  assert.deepEqual(Array.from(context.hiddenShortcutIds),['old']);
  assert.equal(renders,0);
  accept=true;
  assert.equal(methods.setShortcutOrder(['two','one']),true);
  assert.equal(methods.setHiddenShortcuts(['old','new']),true);
  assert.deepEqual(Array.from(context.shortcutOrder),['two','one']);
  assert.deepEqual(Array.from(context.hiddenShortcutIds),['old','new']);
  assert.ok(renders>0);
});
