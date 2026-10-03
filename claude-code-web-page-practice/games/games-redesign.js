/* R3 Games landing. GameVault retains all domain records and write workflows. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? null : window, function (root) {
  'use strict';
  var portals = [
    ['my-games','My Games','Your collection, in one place.','library'],
    ['missions-quests','Missions & Quests','Your story and weekly trackers.','missions'],
    ['game-library','Game Library','Browse and add games.','library'],
    ['game-sessions','Game Sessions','Record your time playing.','sessions'],
    ['discover-games','Discover Games','Find your next local favorite.','suggestions'],
    ['game-settings','Game Settings','Make this room your own.','appearance']
  ];
  function dayKey(date) { return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0'); }
  function closePalette(container) {
    container.querySelectorAll('.gv-palette-menu[open]').forEach(function (menu) { menu.removeAttribute('open'); });
  }
  function buildModel(snapshot, now) {
    now = now || new Date();
    var games = (snapshot.games || []).filter(function(g) { return g && typeof g.id === 'string' && typeof g.name === 'string' && Number.isFinite(g.total) && Number.isFinite(g.completed) && g.total >= 0 && g.completed >= 0 && g.completed <= g.total; });
    var ids = new Set(games.map(function(g) { return g.id; }));
    var sessions = (snapshot.sessions || []).filter(function(s) { return s && ids.has(s.gameId) && Number.isFinite(Date.parse(s.start)) && Date.parse(s.start) <= now.getTime(); });
    var finished = sessions.filter(function(s) { return s.end !== null && Number.isFinite(Date.parse(s.end)) && Date.parse(s.end) >= Date.parse(s.start) && Date.parse(s.end) <= now.getTime() && Number.isFinite(s.minutes) && s.minutes >= 0; });
    var recent = sessions.slice().sort(function(a,b) { return Date.parse(b.start)-Date.parse(a.start); });
    var today = finished.filter(function(s) { return dayKey(new Date(s.start)) === dayKey(now); });
    var firstDay = new Date(now); firstDay.setDate(firstDay.getDate()-6); firstDay.setHours(0,0,0,0);
    var week = finished.filter(function(s) { return Date.parse(s.start) >= firstDay.getTime(); });
    var continuing = recent.length ? games.find(function(g) { return g.id === recent[0].gameId; }) : games.find(function(g) { return g.completed > 0 && g.completed < g.total; });
    return { games: games, continuing: continuing || null, lastSession: continuing && recent.length ? recent[0].start : null, active: sessions.find(function(s) { return s.end === null; }) || null, todayCount: today.length, todayMinutes: today.reduce(function(n,s) { return n+s.minutes; },0), weekCount: week.length, weekMinutes: week.reduce(function(n,s) { return n+s.minutes; },0) };
  }
  function wireSearch(form, input, results, status, clear, search, esc) {
    function reset() {
      results.hidden = true;
      results.replaceChildren();
      input.removeAttribute('aria-invalid');
      status.textContent = 'Search the bundled catalogue on this device.';
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      reset();
      var query = input.value.trim();
      if (!query) {
        status.textContent = 'Enter a game name to search your local catalog.';
        input.setAttribute('aria-invalid', 'true');
        input.focus({ preventScroll: true });
        return;
      }
      try {
        var found = search(query);
        results.innerHTML = found.map(function (game) {
          return '<button type="button" class="osr-chip" data-games-action="game-details" data-game-id="' + esc(game.id) + '">' + esc(game.title) + ' — Details</button>';
        }).join('');
        results.hidden = !found.length;
        status.textContent = found.length ? found.length + ' local match' + (found.length === 1 ? '' : 'es') + '. Choose a result for details.' : 'No local matches. Try another game name.';
      } catch (_) {
        status.textContent = 'Local search is unavailable. Open Game Library to browse your collection.';
      }
    });
    input.addEventListener('input', reset);
    clear.addEventListener('click', function () { input.value = ''; reset(); input.focus({ preventScroll: true }); });
    form.parentElement.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !results.hidden) {
        event.preventDefault(); event.stopPropagation();
        results.hidden = true;
        input.focus({ preventScroll: true });
      }
    });
    reset();
  }
  if (!root || !root.document) return { portals: portals, buildModel: buildModel, wireSearch: wireSearch, closePalette: closePalette };
  var doc=root.document, OS=root.OneSpace, foundation=root.OneSpaceRedesign, owner=root.OneSpaceGames;
  var view=doc.getElementById('gamesView'),stage=doc.getElementById('redesignGames');
  if (!view || !stage || !owner || !foundation) return {};
  view.classList.add('redesign-games');
  var tools=doc.createElement('div'); tools.className='osr-games-tools';
  Array.from(view.children).forEach(function(child) { if(child!==stage)tools.appendChild(child); }); view.appendChild(tools);
  var scene=doc.createElement('div'); stage.appendChild(scene); foundation.createSceneHost(scene).show('games');
  var frame=doc.createElement('div'); frame.className='osr-frame'; stage.appendChild(frame);
  var shell=foundation.createShell(doc,{
    onNavigate:function(event,world){event.preventDefault();if(world==='projects-notes')info('Projects & Notes — coming later','Projects remain available in Work; notes in Quick Notes.');else OS.goToPage(world);},
    onUtility:function(utility){if(utility==='command')doc.getElementById('paletteHint').click();else OS.goToPage(utility==='today'?'productivity':utility);}
  }); foundation.setActiveWorld(shell,'games');frame.appendChild(shell);
  var esc=OS.escapeHtml;
  function button(label,action,extra) { var icon={details:'layers',library:'grid',progress:'check',suggestions:'compass',sessions:'timer',credits:'book'}[action]; return '<button type="button" class="osr-chip" data-games-action="'+action+'"'+(extra||'')+'>'+(icon && label!=='↗'?OS.iconSvg(icon):'')+label+'</button>'; }
  function panel(title,id,action) { return '<article class="osr-panel"><div class="osr-games-card-head"><h2>'+title+'</h2>'+button('↗',action,' aria-label="Open '+title+' tools"')+'</div><div id="'+id+'"></div></article>'; }
  frame.insertAdjacentHTML('beforeend','<main><section class="osr-games-hero" aria-labelledby="osrGamesTitle"><p class="osr-eyebrow">Your personal gaming room</p><h1 class="osr-title" id="osrGamesTitle">Game on.</h1><p class="osr-lead">Good games. A brighter you.</p><div class="osr-games-search"><form class="osr-search" id="osrGamesSearchForm"><label class="visually-hidden" for="osrGamesSearch">Search local games</label>'+OS.iconSvg('search')+'<input id="osrGamesSearch" aria-describedby="osrGamesSearchStatus" aria-controls="osrGamesResults" maxlength="160" placeholder="Search your games and local catalog…" autocomplete="off"><button class="osr-button" type="submit">Search games →</button><button class="osr-chip" type="button" id="osrGamesSearchClear" aria-label="Clear game search">Clear</button></form><p id="osrGamesSearchStatus" role="status" aria-live="polite"></p><div class="osr-games-results" id="osrGamesResults" role="region" aria-label="Local game search results" hidden></div></div><div class="osr-games-quick" aria-label="Games quick actions">'+button('Open game details','details')+button('View library','library')+button('Track progress','progress')+button('Discover games','suggestions')+button('Game sessions','sessions')+'</div></section><section class="osr-grid osr-games-summary" aria-label="Games at a glance">'+panel('Continue Playing','osrGamesContinue','library')+panel("Today’s Gaming",'osrGamesToday','sessions')+panel('Game Progress','osrGamesProgress','progress')+panel('OneSpace Gaming Pulse','osrGamesPulse','sessions')+'</section><section class="osr-grid osr-games-portals" aria-label="Games spaces">'+portals.map(function(p){return '<button class="osr-portal osr-games-portal" type="button" data-games-action="'+p[3]+'" data-portal="'+p[0]+'" aria-label="Open '+p[1]+'"><img src="assets/scenes/games/portals/'+p[0]+'.jpg" alt="" loading="lazy" decoding="async" width="960" height="640" data-fallback-owner="games-portal"><span class="osr-portal-copy"><strong>'+p[1]+'</strong><small>'+p[2]+'</small></span>'+'<span class="osr-games-arrow" aria-hidden="true">↗</span>'+'</button>';}).join('')+'</section><div class="osr-games-footer">'+button('Scene credits','credits',' aria-haspopup="dialog" aria-controls="domainOverlay"')+'<p>Play your way. Your collection and progress stay on this device.</p></div></main>');
  var ownerSurface=foundation.createOwnerSurface(view,stage,'games','Games',tools);
  doc.addEventListener('onespace:owner-surface-changed',function(event){if(event.detail.world==='games')closePalette(view);});
  view.addEventListener('click',function(event){if(event.target.closest('[data-gv-tab],.gv-theme-btn'))closePalette(view);});
  view.addEventListener('keydown',function(event){
    var menu=view.querySelector('.gv-palette-menu[open]');
    if(event.key==='Escape'&&menu){event.preventDefault();event.stopPropagation();closePalette(view);menu.querySelector('summary').focus();}
    else if(['ArrowLeft','ArrowRight','Home','End'].indexOf(event.key)!==-1&&event.target.closest('[data-gv-tab]'))closePalette(view);
  });
  function info(title,message) { root.OneSpaceUI.open(title,'<p>'+esc(message)+'</p>',null); }
  function openTab(tab) { ownerSurface.show({library:'Game Library',missions:'Missions & Quests',weekly:'Weekly Tasks',sessions:'Game Sessions',suggestions:'Discover Games',appearance:'Game Settings',journal:'Game Journal'}[tab]||'Games tools'); if(owner.open(tab)===false)info('Game tool unavailable','That view could not be saved. Please try again. Your game records are unchanged.'); }
  function row(g,action) { var pct=g.total?Math.round(g.completed/g.total*100):0;return '<button class="osr-games-row" type="button" data-games-action="'+action+'" data-game-id="'+esc(g.id)+'"><span><strong>'+esc(g.name)+'</strong><small>'+(g.trackerType==='weekly'?'Weekly tasks':'Story objectives')+' · '+g.completed+'/'+g.total+'</small></span><span>'+pct+'%</span></button>'; }
  var model;
  function refresh() {
    model=buildModel(owner.snapshot());
    doc.getElementById('osrGamesContinue').innerHTML=model.continuing?'<div class="osr-games-continue-art" aria-hidden="true"></div><h3>'+esc(model.continuing.name)+'</h3><p class="osr-games-context">'+(model.lastSession?'Last recorded '+esc(new Date(model.lastSession).toLocaleDateString()):'Your tracked progress is in motion.')+'</p>'+button('Open tracker →','tracker',' data-game-id="'+esc(model.continuing.id)+'"'):'<div class="osr-games-continue-art" aria-hidden="true"></div><p class="osr-empty">No recorded play or unfinished progress yet.</p>'+button('Choose a game →','library');
    doc.getElementById('osrGamesToday').innerHTML='<p class="osr-games-big">'+model.todayMinutes+'<small> minutes recorded today</small></p><p class="osr-games-context">'+model.todayCount+' completed session'+(model.todayCount===1?'':'s')+'</p><p>'+ (model.active?'A session is running.':'No active session.')+'</p><div class="osr-games-today-actions">'+button('Record a session','sessions')+button('Weekly tasks','weekly')+'</div>';
    doc.getElementById('osrGamesProgress').innerHTML='<p class="osr-games-context">Checked tasks in your current trackers</p>'+(model.games.length?model.games.slice(0,3).map(function(g){return row(g,'tracker');}).join(''):'<p class="osr-empty">No tracked games yet. Add one in your library.</p>');
    doc.getElementById('osrGamesPulse').innerHTML='<p class="osr-games-context">Your last seven calendar days</p><p class="osr-games-big">'+model.weekMinutes+'<small> minutes recorded</small></p><div class="osr-games-metrics"><p><strong>'+model.weekCount+'</strong><span>Completed sessions</span></p><p><strong>'+model.games.length+'</strong><span>Games in your collection</span></p></div>'+button('View session history','sessions');
  }
  wireSearch(doc.getElementById('osrGamesSearchForm'),doc.getElementById('osrGamesSearch'),doc.getElementById('osrGamesResults'),doc.getElementById('osrGamesSearchStatus'),doc.getElementById('osrGamesSearchClear'),owner.search,esc);
  stage.addEventListener('click',function(event){var control=event.target.closest('[data-games-action]');if(!control)return;var action=control.dataset.gamesAction,id=control.dataset.gameId;if(action==='credits'){info('Games scene credits','Decorative gaming room artwork created for OneSpace with OpenAI image generation. The room, six separate portal scenes, weekly quest board and gaming journal desk are original project artwork. Collection shelves, quest map, catalogue archive, session desk, discovery landscape and configuration workbench each represent their own action. Local display copies and retained masters are documented in assets/scenes/manifest.json and assets/scenes/games/portals/manifest.json and assets/scenes/games/owners/manifest.json.');return;}if(action==='game-details'){owner.details(id);return;}if(action==='tracker'){ownerSurface.show('Game progress');if(owner.tracker(id)===false)info('Tracker unavailable','Please try again. Your progress is unchanged.');return;}if(action==='details'){var game=model.continuing||model.games[0];if(game)owner.details(game.id);else info('No games yet','Add a game in your library to open its details.');return;}if(action==='progress'){if(model.continuing){ownerSurface.show('Game progress');owner.tracker(model.continuing.id);}else openTab('missions');return;}openTab(action);});
  stage.querySelectorAll('.osr-games-portal img').forEach(function(img){function fallback(){img.hidden=true;img.parentElement.dataset.assetState='fallback';}img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback();});
  function queuedRefresh(){Promise.resolve().then(refresh);}
  doc.addEventListener('onespace:games-changed',queuedRefresh);
  doc.addEventListener('onespace:data-changed',function(event){if(event.detail&&/^orbit-games-/.test(event.detail.key))queuedRefresh();});
  doc.addEventListener('onespace:page-changed',function(event){
    closePalette(view);
    if(event.detail&&event.detail.page==='games')refresh();
    else { var overlay=doc.getElementById('domainOverlay'), title=doc.getElementById('domainTitle'); if(overlay&&!overlay.hidden&&title&&title.textContent==='Games scene credits')OS.closeModal(overlay); }
  });
  // The old carousel is hidden on this landing; stop its playback via its owner.
  owner.pauseHiddenSpotlight();refresh();
  return {portals:portals,buildModel:buildModel};
});
