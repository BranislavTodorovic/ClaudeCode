const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('Add shortcut retains prior links and the dialog draft after a rejected write',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  shortcutForm\.addEventListener\("submit", function \(e\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source,'shortcut submit handler exists');
  let submit,error='',rendered=false,closed=false,toasted=false;
  const prior=[{id:'old',name:'Existing',url:'https://example.org/',category:'Development',space:'work'}];
  const context={shortcutForm:{addEventListener:(kind,callback)=>{if(kind==='submit')submit=callback;}},
    shortcutNameField:{value:'New link'},shortcutUrlField:{value:'https://example.com/new'},shortcutCategoryField:{value:'Development'},
    shortcutSpaceField:{value:'work'},shortcutDescriptionField:{value:'A new link'},shortcutIdField:{value:''},shortcutOrigin:'work',
    CATEGORIES:['Development'],customLinks:JSON.parse(JSON.stringify(prior)),allLinks:()=>prior,
    isValidHttpUrl:value=>/^https?:\/\//.test(value),saveCustomLinks:()=>false,
    showShortcutError:message=>{error=message;},renderLinks:()=>{rendered=true;},renderPersonalPage:()=>{rendered=true;},
    renderExplorePage:()=>{rendered=true;},renderWorkPage:()=>{rendered=true;},showToast:()=>{toasted=true;},closeModal:()=>{closed=true;},URL};
  vm.runInNewContext(source,context);
  submit({preventDefault(){}});
  assert.equal(JSON.stringify(context.customLinks),JSON.stringify(prior));
  assert.match(error,/could not be saved/i);
  assert.equal(context.shortcutNameField.value,'New link');
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
