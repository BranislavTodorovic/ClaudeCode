const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

test('password generation reports unavailable crypto without replacing the output',()=>{
  const source=html.match(/  document\.getElementById\("generatePassword"\)\.addEventListener\("click", function \(\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(source);
  let click;const toasts=[],output={value:'previous'};
  const context={Uint32Array,Array,window:{crypto:{getRandomValues:()=>{throw Error('unavailable');}}},
    document:{getElementById:id=>id==='generatePassword'?{addEventListener:(type,handler)=>{click=handler;}}:output},
    showToast:message=>toasts.push(message)};
  vm.runInNewContext(source,context);
  click();assert.equal(output.value,'previous');assert.match(toasts[0],/generator unavailable/i);
  context.window.crypto.getRandomValues=values=>values.fill(1);
  click();assert.equal(output.value.length,18);assert.match(output.value,/^[A-Za-z0-9!@#$%&*?]+$/);
});

test('password copy reports empty and failed clipboard states accurately',async()=>{
  const fallbackSource=html.match(/  function fallbackCopy\(value, copiedMessage, failedMessage\) \{[\s\S]*?\n  \}/)?.[0];
  const copySource=html.match(/  document\.getElementById\("copyPassword"\)\.addEventListener\("click", function \(\) \{[\s\S]*?\n  \}\);/)?.[0];
  assert(fallbackSource&&copySource);
  let click,copyAccepted=false;const toasts=[],output={value:''};
  const area={value:'',style:{},setAttribute:()=>{},select:()=>{},remove:()=>{}};
  const context={document:{getElementById:id=>id==='copyPassword'?{addEventListener:(type,handler)=>{click=handler;}}:output,
      createElement:()=>area,body:{appendChild:()=>{}},execCommand:()=>copyAccepted},
    navigator:{clipboard:{writeText:()=>Promise.reject(Error('denied'))}},showToast:message=>toasts.push(message)};
  vm.runInNewContext(fallbackSource+'\n'+copySource,context);
  click();assert.match(toasts.pop(),/Generate a password first/);
  output.value='test-local-password';click();await new Promise(resolve=>setImmediate(resolve));
  assert.match(toasts.pop(),/Copy failed. Select the password manually/);
  copyAccepted=true;click();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(toasts.pop(),'Password copied.');
});

test('URL tools round trip Unicode and leave invalid input available for correction',()=>{
  const encodeSource=html.split('\n').find(line=>line.includes('document.getElementById("encodeUrl").addEventListener'));
  const decodeSource=html.split('\n').find(line=>line.includes('document.getElementById("decodeUrl").addEventListener'));
  assert(encodeSource&&decodeSource);
  let encode,decode;const toasts=[],field={value:'A & Č'};
  const context={document:{getElementById:id=>id==='encodeUrl'?{addEventListener:(type,handler)=>{encode=handler;}}:id==='decodeUrl'?{addEventListener:(type,handler)=>{decode=handler;}}:field},
    showToast:message=>toasts.push(message),encodeURIComponent,decodeURIComponent};
  vm.runInNewContext(encodeSource+'\n'+decodeSource,context);
  encode();assert.equal(field.value,'A%20%26%20%C4%8C');
  decode();assert.equal(field.value,'A & Č');
  field.value='\uD800';encode();assert.equal(field.value,'\uD800');assert.match(toasts.pop(),/cannot be encoded/i);
  field.value='%broken';decode();assert.equal(field.value,'%broken');assert.match(toasts.pop(),/not valid encoded URL data/i);
});
