/* Read-only browser audit of the actual visible portal controls and pointer boundaries. */
export function readPortalTargets() {
  return Array.from(document.querySelectorAll('.osr-explore-portal')).map(card => {
    const r = card.getBoundingClientRect(), icon = card.querySelector('.icon'), i = icon.getBoundingClientRect();
    const box = {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};
    const point = (name,x,y) => {
      const inViewport = x >= 0 && x < innerWidth && y >= 0 && y < innerHeight;
      const el = inViewport ? document.elementFromPoint(x,y) : null;
      return {name,x,y,inViewport,action:el?.closest('[data-explore-action]')?.dataset.exploreAction || null};
    };
    return {
      slug:card.dataset.portal,tag:card.tagName,type:card.getAttribute('type'),action:card.dataset.exploreAction,
      label:card.getAttribute('aria-label'),box,transform:getComputedStyle(card).transform,
      descendants:card.querySelectorAll('button,a,input,select,textarea,[tabindex]').length,
      iconHidden:icon.getAttribute('aria-hidden'),
      inside:[point('photo',r.left+r.width/2,r.top+20),point('caption',r.left+24,r.bottom-24),point('icon',(i.left+i.right)/2,(i.top+i.bottom)/2),point('below icon inside card',(i.left+i.right)/2,i.bottom+7)],
      outside:[point('below card',(i.left+i.right)/2,r.bottom+6),point('above card',r.left+r.width/2,r.top-6),point('left of card',r.left-6,r.top+r.height/2),point('right of card',r.right+6,r.top+r.height/2)]
    };
  });
}

export function violations(cards) {
  const failures=[];
  for (const card of cards) {
    if(card.tag!=='BUTTON' || card.type!=='button' || card.action!==card.slug || !card.label) failures.push(card.slug+': card must be the labelled button');
    if(card.descendants) failures.push(card.slug+': overlapping interactive descendants');
    if(card.box.width<44 || card.box.height<44) failures.push(card.slug+': target below 44px');
    if(card.transform!=='none') failures.push(card.slug+': moving target boundary');
    if(card.iconHidden!=='true') failures.push(card.slug+': decorative icon exposed');
    if([...card.inside,...card.outside].some(hit=>!hit.inViewport)) failures.push(card.slug+': boundary points not fully in viewport');
    for(const hit of card.inside) if(hit.inViewport && hit.action!==card.slug) failures.push(card.slug+': inactive '+hit.name);
    for(const hit of card.outside) if(hit.inViewport && hit.action) failures.push(card.slug+': action outside card at '+hit.name);
  }
  return failures;
}
