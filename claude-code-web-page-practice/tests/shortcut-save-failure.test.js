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
