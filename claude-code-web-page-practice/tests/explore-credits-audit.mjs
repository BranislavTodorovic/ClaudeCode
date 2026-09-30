/* Read rendered control boundaries and scene geometry; no application-state mutation. */
export function readCreditsControl() {
  const row=document.querySelector('.osr-explore-credits'), button=row.querySelector('button'), r=row.getBoundingClientRect(), b=button.getBoundingClientRect();
  const point=(name,x,y)=>{
    const inViewport=x>=0 && x<innerWidth && y>=0 && y<innerHeight;
    const el=inViewport?document.elementFromPoint(x,y):null;
    return {name,x,y,inViewport,action:el?.closest('[data-explore-action]')?.dataset.exploreAction||null};
  };
  return {
    tag:button.tagName,type:button.type,label:button.textContent.trim(),popup:button.getAttribute('aria-haspopup'),controls:button.getAttribute('aria-controls'),
    rowWidth:r.width,width:b.width,height:b.height,transform:getComputedStyle(button).transform,
    rowAction:row.hasAttribute('data-explore-action'),disclosures:row.querySelectorAll('details,summary').length,
    inside:[point('label',b.left+b.width/2,b.top+b.height/2)],
    outside:[point('empty row',r.right-6,b.top+b.height/2),point('above button',b.left+b.width/2,b.top-6),point('below button',b.left+b.width/2,b.bottom+6)]
  };
}

export function readSceneGeometry() {
  const selectors=['#redesignExplore','#redesignExplore .osr-frame','.osr-explore-hero','.osr-explore-summary','.osr-explore-portals','#redesignExplore .osr-scene-host','#redesignExplore .osr-scene-image','#exploreView > .page-body'];
  return {scrollY,viewport:document.documentElement.clientWidth,documentWidth:document.documentElement.scrollWidth,regions:selectors.map(selector=>{
    const el=document.querySelector(selector),r=el.getBoundingClientRect(),s=getComputedStyle(el);
    return {selector,left:r.left,top:r.top+scrollY,width:r.width,height:r.height,transform:s.transform,zoom:s.zoom};
  })};
}

export function violations(control) {
  const failures=[];
  if(control.tag!=='BUTTON'||control.type!=='button'||control.label!=='Scene & photo credits'||control.popup!=='dialog'||control.controls!=='domainOverlay') failures.push('credits launcher semantics');
  if(control.height<44) failures.push('credits target below 44px');
  if(control.width>=control.rowWidth-8) failures.push('credits control stretches across empty row');
  if(control.rowAction||control.disclosures) failures.push('interactive credits container');
  if(control.transform!=='none') failures.push('moving credits target');
  for(const hit of [...control.inside,...control.outside]) if(!hit.inViewport) failures.push('untested credits point: '+hit.name);
  for(const hit of control.inside) if(hit.inViewport&&hit.action!=='credits') failures.push('inactive credits control');
  for(const hit of control.outside) if(hit.inViewport&&hit.action) failures.push('action in empty space: '+hit.name);
  return failures;
}

export function sceneChanges(before,after) {
  const changes=[];
  if(before.viewport!==after.viewport||before.documentWidth!==after.documentWidth) changes.push('document width changed');
  if(Math.abs(before.scrollY-after.scrollY)>1) changes.push('page scrolled');
  for(const region of before.regions) {
    const next=after.regions.find(r=>r.selector===region.selector);
    if(!next||['left','top','width','height'].some(key=>Math.abs(region[key]-next[key])>1)||region.transform!==next.transform||region.zoom!==next.zoom) changes.push(region.selector);
  }
  return changes;
}
