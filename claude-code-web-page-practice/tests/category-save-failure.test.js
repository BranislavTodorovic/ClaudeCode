const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('Add category keeps its draft and prior categories when storage rejects the transaction',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function addCategory\(\) \{[\s\S]*?\n  \}\);\n\n  function renameCategory/)?.[0].replace(/\n\n  function renameCategory$/,'');
  assert(source,'category form handler exists');
  const handlers={};
  const field={value:'Audit Tools',focus(){this.focused=true;},setAttribute(){},removeAttribute(){}};
  const error={textContent:''};
  const elements={categoryForm:{reset(){},addEventListener:(type,handler)=>handlers.form=handler},categoryClose:{addEventListener:()=>{}},categoryCancel:{addEventListener:()=>{}},categoryName:field,categoryError:error,categoryOverlay:{}};
  let reject=true,rebuilds=0,closes=0;
  const context={document:{getElementById:id=>elements[id]},CATEGORIES:['Development'],customCategories:[],
    STORAGE:{customCategories:'custom',categoryOrder:'order'},
    window:{localStorage:{},OneSpaceStorage:{transaction:(store,writes)=>{
      assert.deepEqual(JSON.parse(writes.custom),['Audit Tools']);
      assert.deepEqual(JSON.parse(writes.order),['Development','Audit Tools']);
      if(reject)throw Error('Quota exceeded');
    }}},openModal:()=>{},closeModal:()=>{closes++;},rebuildCategories:()=>{rebuilds++;},showToast:()=>{}};
  vm.runInNewContext(source,context);
  handlers.form({preventDefault(){}});
  assert.deepEqual(context.customCategories,[]);
  assert.deepEqual(context.CATEGORIES,['Development']);
  assert.equal(rebuilds,0);assert.equal(closes,0);
  assert.equal(field.value,'Audit Tools');assert.match(error.textContent,/could not be saved/i);
  reject=false;handlers.form({preventDefault(){}});
  assert.deepEqual(context.customCategories,['Audit Tools']);
  assert.equal(rebuilds,1);assert.equal(closes,1);
});

test('category movement changes visible order and rejects unsaved movement',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const visibleSource=html.match(/  function visibleCategories\(\) \{[\s\S]*?\n  \}/)?.[0];
  const moveSource=html.match(/  function moveCategory\(name, direction\) \{[\s\S]*?\n  \}/)?.[0];
  assert(visibleSource&&moveSource);
  let accept=false,renders=0;const toasts=[];
  const context={currentSpace:'personal',customCategories:[],CATEGORIES:['Development','Shopping & Home','Gaming','Daily','Smart Home','Travel'],
    STORAGE:{categoryOrder:'order'},safeSet:(key,value)=>{assert.equal(key,'order');assert.deepEqual(JSON.parse(value),['Development','Daily','Gaming','Shopping & Home','Smart Home','Travel']);return accept;},
    buildSectionShells:()=>{renders++;},renderLinks:()=>{},showToast:message=>toasts.push(message)};
  vm.runInNewContext(visibleSource+'\n'+moveSource,context);
  assert.deepEqual(Array.from(context.visibleCategories()),['Shopping & Home','Daily','Smart Home']);
  assert.equal(context.moveCategory('Daily','up'),false);
  assert.deepEqual(Array.from(context.visibleCategories()),['Shopping & Home','Daily','Smart Home']);assert.equal(renders,0);
  accept=true;assert.equal(context.moveCategory('Daily','up'),true);
  assert.deepEqual(Array.from(context.visibleCategories()),['Daily','Shopping & Home','Smart Home']);assert.equal(renders,1);
  assert.equal(context.moveCategory('Daily','up'),false);assert.match(toasts.pop(),/already at the edge/i);
});

test('category collapse keeps the prior visible state when persistence fails',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const source=html.match(/  function toggleCategory\(category\) \{[\s\S]*?\n  \}/)?.[0];
  assert(source);
  let accept=false,renders=0;
  const context={collapsedCategories:[],STORAGE:{collapsed:'collapsed'},safeSet:()=>accept,
    buildSectionShells:()=>{renders++;},renderLinks:()=>{}};
  vm.runInNewContext(source,context);
  assert.equal(context.toggleCategory('Daily'),false);assert.deepEqual(Array.from(context.collapsedCategories),[]);assert.equal(renders,0);
  accept=true;assert.equal(context.toggleCategory('Daily'),true);assert.deepEqual(Array.from(context.collapsedCategories),['Daily']);assert.equal(renders,1);
});

test('category rename and delete commit related records atomically',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const renameSource=html.match(/  function renameCategory\(oldName\) \{[\s\S]*?\n  \}/)?.[0];
  const deleteSource=html.match(/  function deleteCategory\(name\) \{[\s\S]*?\n  \}/)?.[0];
  assert(renameSource&&deleteSource);
  let renameAction,deleteAction,reject=true,rebuilds=0;const toasts=[];
  const context={customCategories:['Audit'],CATEGORIES:['Development','Audit'],
    customLinks:[{id:'a',category:'Audit'}],collapsedCategories:['Audit'],
    STORAGE:{customCategories:'categories',categoryOrder:'order',customLinks:'links',collapsed:'collapsed'},
    window:{localStorage:{},OneSpaceUI:{field:()=>'<input>',open:(title,body,submit)=>{renameAction=submit;},confirm:(title,message,submit)=>{deleteAction=submit;}},
      OneSpaceStorage:{transaction:(store,writes)=>{assert.equal(Object.keys(writes).length,4);if(reject)throw Error('quota');}}},
    rebuildCategories:()=>{rebuilds++;},showToast:message=>toasts.push(message)};
  vm.runInNewContext(renameSource+'\n'+deleteSource,context);
  context.renameCategory('Audit');assert(renameAction);
  assert.throws(()=>renameAction({get:()=> 'Development'}),/unique category/i);
  assert.throws(()=>renameAction({get:()=> 'Renamed'}),/could not be saved/i);
  assert.equal(context.customCategories[0],'Audit');assert.equal(context.customLinks[0].category,'Audit');assert.equal(rebuilds,0);
  reject=false;assert.equal(renameAction({get:()=> 'Renamed'}),true);
  assert.equal(context.customCategories[0],'Renamed');assert.equal(context.CATEGORIES[1],'Renamed');
  assert.equal(context.customLinks[0].category,'Renamed');assert.equal(context.collapsedCategories[0],'Renamed');assert.equal(rebuilds,1);
  context.deleteCategory('Renamed');assert(deleteAction);
  assert.equal(context.customCategories[0],'Renamed','opening confirmation does not delete');
  reject=true;assert.throws(()=>deleteAction(),/could not be deleted/i);
  assert.equal(context.customLinks[0].category,'Renamed');assert.equal(rebuilds,1);
  reject=false;assert.equal(deleteAction(),true);
  assert.equal(context.customCategories.length,0);assert.equal(context.CATEGORIES.length,1);
  assert.equal(context.customLinks[0].category,'Development');assert.equal(context.collapsedCategories.length,0);assert.equal(rebuilds,2);
});
