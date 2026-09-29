/* Run with the Browser skill's already-connected tab on a disposable origin.
   const smoke = await import('file:///.../tests/browser-smoke.mjs');
   await smoke.routes(tab);  // default desktop viewport
   Does not require Playwright packages or read hidden application state. */
function assert(value,message){if(!value)throw new Error(message);}
export async function routes(tab){
 const pages=[['Personal','A calmer corner'],['Explore','Find your next horizon'],['Games','Worlds worth returning to.'],['Movies','Set the evening scene.'],['Shortcuts view','Your launchpad'],['Productivity view','Stay in focus'],['Quick Notes view','Your visual journal'],['Settings view','Look & atmosphere']];
 const report=[];
 const home=await tab.playwright.domSnapshot();assert(home.includes('Your day at a glance')&&home.includes('Explore your worlds'),'Redesigned Home did not load');report.push({route:'Home',pass:true});
 await tab.playwright.getByRole('navigation',{name:'Main worlds'}).getByRole('link',{name:'Work',exact:true}).click();
 assert((await tab.playwright.domSnapshot()).includes('Development tracker'),'Work content did not load');report.push({route:'Work',pass:true});
 await tab.playwright.getByRole('button',{name:'Open Projects',exact:true}).click();assert((await tab.playwright.getByRole('group',{name:'Work views'}).getByRole('button',{name:'Projects',exact:true}).getAttribute('aria-pressed'))==='true','Projects panel did not open');report.push({route:'Work / Projects',pass:true});
 for(const [button,expected] of pages){await tab.playwright.getByRole('button',{name:button,exact:true}).click();const dom=await tab.playwright.domSnapshot();assert(dom.includes(expected),'Missing route content: '+button);report.push({route:button,pass:true});}
 const errors=await tab.dev.logs({levels:['error'],limit:20});assert(!errors.length,'Browser errors: '+JSON.stringify(errors));return report;
}
export async function homeRouteBridge(tab){
 const origin=new URL(await tab.url()).origin;
 await tab.goto(origin+'/#/w/work/projects');
 assert((await tab.playwright.getByRole('group',{name:'Work views'}).getByRole('button',{name:'Projects',exact:true}).getAttribute('aria-pressed'))==='true','Direct Projects route opened the wrong view');
 await tab.playwright.getByRole('group',{name:'Work views'}).getByRole('button',{name:'Board',exact:true}).click();
 assert((await tab.url()).endsWith('#/w/work'),'Work Board URL did not update');
 await tab.back();
 assert((await tab.url()).endsWith('#/w/work/projects'),'Back did not restore Projects URL');
 assert((await tab.playwright.getByRole('group',{name:'Work views'}).getByRole('button',{name:'Projects',exact:true}).getAttribute('aria-pressed'))==='true','Back did not restore Projects view');
 await tab.forward();
 assert((await tab.url()).endsWith('#/w/work'),'Forward did not restore Work URL');
 await tab.goto(origin+'/#/w/home');
 assert((await tab.playwright.domSnapshot()).includes('Your day at a glance'),'Home direct link failed');
 await tab.goto(origin+'/#/w/not-a-world');
 assert((await tab.url()).endsWith('#/w/home'),'Unknown route was not safely normalized');
 return {projectsDirect:true,backForward:true,homeDirect:true,unknownRoute:true};
}
export async function homeInteractions(tab){
 const origin=new URL(await tab.url()).origin;
 await tab.goto(origin+'/#/w/home');
 assert(await tab.playwright.getByRole('navigation',{name:'Main worlds'}).getByRole('link',{name:'Home',exact:true}).getAttribute('aria-current')==='page','Home active state is missing');
 await tab.playwright.getByRole('button',{name:'Capture',exact:true}).click();
 assert((await tab.playwright.domSnapshot()).includes('Write a thought or task first.'),'Empty capture gave no feedback');
 assert(await tab.playwright.evaluate(()=>document.activeElement?.id)==='osrCaptureInput','Empty capture did not return focus');
 await tab.playwright.getByRole('button',{name:'Projects & Notes status'}).press('Enter');
 assert((await tab.playwright.domSnapshot()).includes('Projects & Notes is being prepared'),'Unavailable world was not explained');
 await tab.playwright.getByRole('button',{name:'Games',exact:true}).press('Enter');
 assert((await tab.url()).endsWith('#/w/games'),'Games split portal did not navigate');
 await tab.back();
 await tab.playwright.getByRole('button',{name:'Movies & Series',exact:true}).press('Enter');
 assert((await tab.url()).endsWith('#/w/movies'),'Movies split portal did not navigate');
 await tab.back();
 await tab.playwright.getByRole('button',{name:'Add task',exact:true}).press('Enter');
 assert((await tab.url()).endsWith('#/u/productivity'),'Today Add did not open Productivity');
 assert(await tab.playwright.evaluate(()=>document.activeElement?.id)==='taskInput','Today Add did not focus task entry');
 return {captureFeedback:true,portalKeyboard:true,splitMedia:true,taskFocus:true};
}
export async function homeTimerFocus(tab){
 const origin=new URL(await tab.url()).origin;
 await tab.goto(origin+'/#/w/home');
 await tab.playwright.getByRole('button',{name:'Open focus timer'}).press('Tab');
 const focused=await tab.playwright.evaluate(()=>document.activeElement?.textContent?.trim());
 assert(focused==='Open timer →','Now card timer link could not receive keyboard focus');
 await new Promise(resolve=>setTimeout(resolve,1200));
 assert(await tab.playwright.evaluate(()=>document.activeElement?.textContent?.trim())===focused,'Home clock tick discarded focus from the Now card');
 return {timerFocusAcrossTick:true};
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
 const auto=tab.playwright.getByRole('radio',{name:'Auto Follow your device'});
 await auto.click();
 const dark=tab.playwright.getByRole('radio',{name:'Deep Space Navy and violet'});
 await dark.click();
 assert(await dark.getAttribute('aria-checked')==='true','Settings appearance did not change');
 await tab.reload();
 assert(await dark.getAttribute('aria-checked')==='true','Settings appearance did not survive reload');
 await auto.click();
 assert(await auto.getAttribute('aria-checked')==='true','Selecting Auto did not restore device appearance');
 return {changed:true,persisted:true,appearance:'auto',deviceRestored:true};
}
