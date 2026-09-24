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
