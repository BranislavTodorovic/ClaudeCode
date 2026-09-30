/* Read-only rendered-DOM audit, also used through the in-app Browser. */
function readLayout() {
  const viewport = document.documentElement.clientWidth;
  const selectors = ['#redesignExplore .osr-shell','.osr-explore-hero','.osr-explore-summary','.osr-explore-portals','.osr-explore-credits','.osr-explore-followon','#exploreView > .page-body','#exploreDestinations .discovery-workspace','#exploreDestinations .trip-board','#exploreShortcutsGrid','#exploreView .explore-category-grid'];
  const regions = selectors.map(selector => {
    const el = document.querySelector(selector), r = el.getBoundingClientRect();
    return {selector,left:r.left,right:r.right,width:el.clientWidth,scrollWidth:el.scrollWidth};
  });
  const controls = Array.from(document.querySelectorAll('#exploreView button,#exploreView input,#exploreView select,#exploreView textarea,#exploreView a,#exploreView h2,#exploreView h3,#exploreView summary')).flatMap(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return [];
    // The canonical tablet nav deliberately scrolls inside its own bounded container.
    if (el.closest('.osr-nav') && getComputedStyle(el.closest('.osr-nav')).overflowX === 'auto') return [];
    return [{name:el.getAttribute('aria-label') || el.textContent.trim().slice(0,60) || el.tagName,left:r.left,right:r.right}];
  });
  const box = selector => {const r=document.querySelector(selector).getBoundingClientRect();return {left:r.left,right:r.right};};
  const frame = document.querySelector('#redesignExplore .osr-frame');
  const frameBox = frame.getBoundingClientRect(), frameStyle = getComputedStyle(frame);
  const expectedContent = {left:frameBox.left+(+frameStyle.paddingLeft.replace('px','')),right:frameBox.right-(+frameStyle.paddingRight.replace('px',''))};
  const alignedSelectors = ['.osr-explore-summary','.osr-explore-portals','.osr-explore-credits','#exploreDestinations','#exploreShortcutsGrid','#exploreView .explore-category-grid'];
  const alignment = alignedSelectors.map(selector => ({selector,...box(selector)}));
  const outerFrames = ['.wrap','#exploreView','#redesignExplore'].map(selector=>({selector,...box(selector)}));
  return {viewport,documentWidth:document.documentElement.scrollWidth,regions,controls,outerFrames,frame:box('#redesignExplore .osr-frame'),ownerFrame:box('#exploreView > .page-body'),expectedContent,alignment};
}
function violations(layout) {
  const failures = [];
  if (layout.documentWidth > layout.viewport + 1) failures.push('document exceeds viewport');
  for (const region of layout.regions) {
    if (region.left < -1 || region.right > layout.viewport + 1 || region.scrollWidth > region.width + 1) failures.push('region: ' + region.selector);
  }
  for (const control of layout.controls) {
    if (control.left < -1 || control.right > layout.viewport + 1) failures.push('content: ' + control.name);
  }
  if (layout.frame && layout.ownerFrame) {
    if (Math.abs(layout.frame.left-layout.ownerFrame.left)>1 || Math.abs(layout.frame.right-layout.ownerFrame.right)>1) failures.push('landing and owner frames differ');
    if (Math.abs(layout.frame.left-(layout.viewport-layout.frame.right))>1) failures.push('frame is not centered');
  }
  for (const row of layout.alignment || []) {
    if (Math.abs(row.left-layout.expectedContent.left)>1 || Math.abs(row.right-layout.expectedContent.right)>1) failures.push('alignment: '+row.selector);
  }
  for (const outer of layout.outerFrames || []) {
    if (Math.abs(outer.left)>1 || Math.abs(outer.right-layout.viewport)>1) failures.push('outer frame: '+outer.selector);
  }
  return failures;
}
export {readLayout,violations};
