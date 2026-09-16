/* Deterministic illustrations for project metadata and unavailable custom art. */
(function () {
  'use strict';
  function cover(seed) {
    var hash=2166136261;
    Array.from(seed || 'OneSpace').forEach(function(c){ hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0; });
    var hue=hash%360, x=300+hash%160, y=70+hash%65;
    var city=Array.from({length:13},function(_,i){var h=30+((hash >>> (i%16))*13+i*67)%150;return '<path d="M'+(i*48)+' 340v-'+h+'h38v'+h+'" fill="hsl('+hue+' 25% '+(12+i%3*4)+'%)" stroke="#fff" stroke-opacity=".08"/>';}).join('');
    var motifs=[
      '<g fill="none" stroke="#dcf5fa"><ellipse cx="'+x+'" cy="155" rx="170" ry="75" transform="rotate(-28 '+x+' 155)"/><circle cx="'+x+'" cy="155" r="96"/><circle cx="'+x+'" cy="155" r="57" fill="#fff" fill-opacity=".05"/></g>',
      '<g stroke="#e3f0ff" stroke-width="1.5"><path d="M210 210 335 65 530 153 395 300Z" fill="#ffffff15"/><path d="M210 210 395 180 530 153M335 65 395 180 395 300" fill="none"/><path d="M160 240 305 85 490 173 365 320Z" fill="none" opacity=".35"/></g>',
      '<g fill="none" stroke="#e6f7e7"><path d="M220 270V120q0-85 120-85t120 85v150M245 270V120q0-60 95-60t95 60v150M270 270V120q0-35 70-35t70 35v150"/><path d="M200 275h300m-260 20h220m-190 20h160" opacity=".4"/></g>'
    ];
    return '<svg class="os-generated-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="340" fill="hsl('+hue+' 30% 13%)"/><circle cx="'+x+'" cy="'+y+'" r="180" fill="hsl('+hue+' 45% 45%)" opacity=".18"/><circle cx="'+x+'" cy="'+y+'" r="115" fill="hsl('+hue+' 55% 65%)" opacity=".12"/>'+city+motifs[hash%3]+'<path d="M0 318H600M0 329H600" stroke="#ffffff18"/><g fill="#ecf5ff">'+Array.from({length:18},function(_,i){return '<circle cx="'+((hash+i*73)%600)+'" cy="'+((hash+i*37)%270)+'" r="'+(i%3+1)/2+'"/>';}).join('')+'</g></svg>';
  }
  window.OneSpaceVisual={cover:cover};
  document.addEventListener('error',function(event){
    var img=event.target;
    if (!(img instanceof HTMLImageElement) || img.matches('.gv-logo-img,.mv-poster-img') || img.closest('#gvSceneArt')) return;
    console.warn('[OneSpace asset]',img.getAttribute('src'));
    if(img.dataset.fallbackSrc && !img.dataset.fallbackTried){ img.dataset.fallbackTried='true'; img.src=img.dataset.fallbackSrc; return; }
    var wrapper=document.createElement('div');wrapper.className=img.className+' os-art-fallback';
    wrapper.innerHTML=cover(img.alt || img.getAttribute('src'));img.replaceWith(wrapper);
  },true);
})();
