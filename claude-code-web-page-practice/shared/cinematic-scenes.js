/* OneSpace scene composition. Rendering stays separate from persistent app state. */
(function () {
  'use strict';
  var OS=window.OneSpace;
  var scenes={projects:['03','THE ATELIER','A thought, taking shape.'],personal:['04','THE RITUAL GARDEN','Small rituals. A richer everyday.'],explore:['05','THE PORTAL','Let curiosity lead.'],shortcuts:['06','THE LAUNCH CONSOLE','A shorter path to your everyday.'],productivity:['07','THE FOCUS COCKPIT','Give one thing your full attention.'],notes:['08','THE JOURNAL','Leave a little of your mind on the page.'],settings:['09','THE CONTROL ROOM','Make this space feel like you.']};
  Object.keys(scenes).forEach(function(page){
    var hero=document.querySelector('#'+page+'View .page-hero');if(!hero)return;
    hero.dataset.pageHero=page;
    var caption=document.createElement('div');caption.className='scene-caption';caption.setAttribute('aria-hidden','true');
    caption.innerHTML='<span>'+scenes[page][0]+' / '+scenes[page][1]+'</span><span>'+scenes[page][2]+'</span>';hero.appendChild(caption);
  });
  function iconBefore(selector,name){document.querySelectorAll(selector).forEach(function(el){if(!el.querySelector('svg'))el.insertAdjacentHTML('afterbegin',OS.iconSvg(name));});}
  iconBefore('#personalView .page-section:nth-child(1) h2','target');
  iconBefore('#personalView .page-section:nth-child(2) h2','repeat');
  iconBefore('#personalView .page-section:nth-child(3) h2','heart');
  iconBefore('#workView .page-section:nth-child(1) h2,#projectFormHeading','layers');
  iconBefore('#workView .page-section:nth-child(2) h2','calendaricon');
  iconBefore('#personalView .mini-form button,#notesNewForm button,#projectSave,#taskForm button,#countdownForm button','plus');
  iconBefore('#focusReset','repeat');iconBefore('#focusMode','timer');
  iconBefore('#settingsExport','shield');iconBefore('#settingsImport','repeat');
  iconBefore('#exploreSearchForm button','search');
  document.querySelectorAll('.explore-category-icon').forEach(function(el,i){el.innerHTML=OS.iconSvg(['gamepad','film','timer'][i]);});
  var projectNav=document.querySelector('.space-btn[data-page-button="projects"]');
  if(projectNav){projectNav.querySelector('svg').outerHTML=OS.iconSvg('layers');projectNav.querySelector('small').textContent='Ideas into action';}
  var settings=document.querySelector('.settings-card');
  if(settings){
    var fields=Array.from(settings.querySelectorAll(':scope > .form-field'));
    [['Look & atmosphere','sun',fields.slice(0,2)],['Your everyday','grid',fields.slice(2,7)],['Movement & attention','compass',fields.slice(7)]].forEach(function(group,index){
      var section=document.createElement('section');section.className='settings-group';section.setAttribute('aria-labelledby','settingsGroup'+index);
      section.innerHTML='<h2 id="settingsGroup'+index+'">'+OS.iconSvg(group[1])+group[0]+'</h2>';
      group[2].forEach(function(field){section.appendChild(field);});settings.insertBefore(section,settings.querySelector('.settings-data'));
    });
    settings.querySelector('.settings-data h4').innerHTML=OS.iconSvg('shield')+'Your data, on your terms';
  }
  function navigation(){document.querySelectorAll('[data-page-button]').forEach(function(button){
    var active=button.dataset.pageButton===document.body.dataset.page;
    button.classList.toggle('active',active);
    if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
  });}
  navigation();document.addEventListener('onespace:page-changed',navigation);
  var heroes=document.querySelectorAll('.page-hero,.scene-hero');
  if('IntersectionObserver' in window){var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){entry.target.classList.toggle('scene-offscreen',!entry.isIntersecting);});});heroes.forEach(function(hero){observer.observe(hero);});}
  document.addEventListener('visibilitychange',function(){document.body.classList.toggle('scene-document-hidden',document.hidden);});
})();
