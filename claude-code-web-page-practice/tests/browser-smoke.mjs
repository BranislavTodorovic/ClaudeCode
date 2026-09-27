/* Run with the Browser skill's already-connected tab on a disposable origin.
   const smoke = await import('file:///.../tests/browser-smoke.mjs');
   await smoke.routes(tab);  // default desktop viewport
   Does not require Playwright packages or read hidden application state. */
function assert(value,message){if(!value)throw new Error(message);}
export async function routes(tab){
 const pages=[['Home view','Make room for what matters.'],['Work Build & focus','Development tracker'],['Personal Life & home','A calmer corner'],['Explore Travel & play','Find your next horizon'],['Games Play & track','Worlds worth returning to.'],['Movies & Series Watch & discover','Set the evening scene.'],['Shortcuts view','Your launchpad'],['Productivity view','Stay in focus'],['Quick Notes view','Your visual journal'],['Settings view','Look & atmosphere']];
 const report=[];
 for(const [button,expected] of pages){await tab.playwright.getByRole('button',{name:button,exact:true}).click();const dom=await tab.playwright.domSnapshot();assert(dom.includes(expected),'Missing route content: '+button);report.push({route:button,pass:true});if(button==='Work Build & focus'){await tab.playwright.getByRole('button',{name:'Open Projects',exact:true}).click();assert((await tab.playwright.domSnapshot()).includes('Create a project'),'Projects panel did not open');report.push({route:'Work / Projects',pass:true});}}
 const errors=await tab.dev.logs({levels:['error'],limit:20});assert(!errors.length,'Browser errors: '+JSON.stringify(errors));return report;
}
export async function workLifecycle(tab){
 await tab.playwright.locator('aside [data-page-button="work"]').click();
 const dom=await tab.playwright.domSnapshot();assert(dom.includes('QA story lifecycle'),'Create the documented QA project/story fixture first.');
 await tab.playwright.getByRole('button',{name:'Open details',exact:true}).click();
 assert((await tab.playwright.domSnapshot()).includes('Lifecycle'),'Work detail did not open');
 await tab.playwright.getByRole('combobox',{name:'Lifecycle',exact:true}).selectOption('closed');
 assert((await tab.playwright.getByRole('region',{name:'Work item details',exact:true}).innerText()).includes('Tasks · 1/1'),'Close did not complete tasks');
 await tab.playwright.getByRole('button',{name:'Close work details',exact:true}).click();
 await tab.playwright.getByRole('group',{name:'Work views'}).getByRole('button',{name:'Backlog',exact:true}).click();assert(await tab.playwright.getByRole('button',{name:'Open details',exact:true}).count()===1,'Closed item absent from backlog');
 await tab.playwright.getByRole('button',{name:'Open details',exact:true}).click();await tab.playwright.domSnapshot();
 await tab.playwright.getByRole('combobox',{name:'Lifecycle',exact:true}).selectOption('open');await tab.playwright.domSnapshot();
 await tab.playwright.getByRole('button',{name:'Close work details',exact:true}).click();
 await tab.playwright.getByRole('group',{name:'Work views'}).getByRole('button',{name:'Board',exact:true}).click();await tab.reload();
 const persisted=await tab.playwright.domSnapshot();assert(persisted.includes('Task progress')&&persisted.includes('1 / 1'),'Task progress did not survive reload');
 await tab.playwright.getByRole('button',{name:'Open details',exact:true}).click();assert((await tab.playwright.domSnapshot()).includes('QA task one'),'Task history did not survive reload');
 await tab.playwright.getByRole('button',{name:'Close work details',exact:true}).click();return {close:true,backlog:true,reopen:true,persistence:true};
}
export async function layout(tab){
 return tab.playwright.evaluate(()=>({width:innerWidth,bodyWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,brokenImages:Array.from(document.images).filter(i=>i.getBoundingClientRect().width>0 && i.complete && !i.naturalWidth).map(i=>i.getAttribute('src'))}));
}

export async function themeOverride(tab){
 await tab.playwright.getByRole('button',{name:'Settings view',exact:true}).click();
 await tab.playwright.getByRole('radio',{name:'Auto Follow your device'}).click();
 await tab.playwright.getByRole('button',{name:'Home view',exact:true}).click();
 const toggle=tab.playwright.getByRole('button',{name:'Change color theme',exact:true});
 const before=await toggle.getAttribute('aria-pressed');
 await toggle.click();
 const chosen=await toggle.getAttribute('aria-pressed');
 assert(chosen!==before,'Manual theme toggle did not change the page theme');
 await tab.reload();
 assert(await toggle.getAttribute('aria-pressed')===chosen,'Manual theme toggle did not survive reload from Auto');
 await tab.playwright.getByRole('button',{name:'Settings view',exact:true}).click();
 const automatic=tab.playwright.getByRole('radio',{name:'Auto Follow your device'});
 assert(await automatic.getAttribute('aria-checked')==='true','Theme toggle changed the selected palette');
 await automatic.click();
 await tab.playwright.getByRole('button',{name:'Home view',exact:true}).click();
 assert(await toggle.getAttribute('aria-pressed')===before,'Selecting Auto did not restore the device theme');
 return {changed:true,persisted:true,appearance:'auto',deviceRestored:true};
}
