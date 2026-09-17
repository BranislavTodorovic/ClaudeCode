/* Run with the Browser skill's already-connected tab on a disposable origin.
   const smoke = await import('file:///.../tests/browser-smoke.mjs');
   await smoke.routes(tab);  // default desktop viewport
   Does not require Playwright packages or read hidden application state. */
function assert(value,message){if(!value)throw new Error(message);}
export async function routes(tab){
 const pages=[['Home view','Make room for what matters.'],['Work Build & focus','Development tracker'],['Projects Ideas into action','From idea to done.'],['Personal Life & home','A calmer corner'],['Explore Travel & play','Your next change of scenery'],['Games Play & track','GameVault'],['Movies & Series Watch & discover','Movies & Series'],['Shortcuts view','Shortcuts'],['Productivity view','Productivity'],['Quick Notes view','Notes'],['Settings view','Settings']];
 const report=[];
 for(const [button,expected] of pages){await tab.playwright.getByRole('button',{name:button,exact:true}).click();const dom=await tab.playwright.domSnapshot();assert(dom.includes(expected),'Missing route content: '+button);report.push({route:button,pass:true});}
 const errors=await tab.dev.logs({levels:['error'],limit:20});assert(!errors.length,'Browser errors: '+JSON.stringify(errors));return report;
}
export async function workLifecycle(tab){
 await tab.playwright.getByRole('button',{name:'Work Build & focus',exact:true}).click();
 const dom=await tab.playwright.domSnapshot();assert(dom.includes('QA story lifecycle'),'Create the documented QA project/story fixture first.');
 await tab.playwright.getByRole('button',{name:'Open details',exact:true}).click();
 assert((await tab.playwright.domSnapshot()).includes('Lifecycle'),'Work detail did not open');
 await tab.playwright.getByRole('combobox',{name:'Lifecycle',exact:true}).selectOption('closed');
 assert((await tab.playwright.getByRole('region',{name:'Work item details',exact:true}).innerText()).includes('Tasks · 1/1'),'Close did not complete tasks');
 await tab.playwright.getByRole('button',{name:'Backlog / closed',exact:true}).click();assert(await tab.playwright.getByRole('button',{name:'Open details',exact:true}).count()===1,'Closed item absent from backlog');
 await tab.playwright.getByRole('button',{name:'Open details',exact:true}).click();await tab.playwright.domSnapshot();
 await tab.playwright.getByRole('combobox',{name:'Lifecycle',exact:true}).selectOption('open');await tab.playwright.domSnapshot();
 await tab.playwright.getByRole('button',{name:'Active work',exact:true}).click();await tab.reload();
 const persisted=await tab.playwright.domSnapshot();assert(persisted.includes('1 / 1 tasks complete'),'Task history did not survive reload');return {close:true,backlog:true,reopen:true,persistence:true};
}
export async function layout(tab){
 return tab.playwright.evaluate(()=>({width:innerWidth,bodyWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,brokenImages:Array.from(document.images).filter(i=>i.getBoundingClientRect().width>0 && i.complete && !i.naturalWidth).map(i=>i.getAttribute('src'))}));
}
