/* R3 Explore landing. Discovery and the trip board remain the domain owners. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? null : window, function (root) {
  'use strict';
  var trips = root ? root.OneSpaceTrips : require('./trip-board.js');
  function buildModel(snapshot, today) {
    var rows = (Array.isArray(snapshot.trips) ? snapshot.trips : []).filter(trips.valid).slice().sort(function (a,b) { return a.order - b.order; });
    return {
      featured: (Array.isArray(snapshot.destinations) ? snapshot.destinations : []).slice(0,3),
      saved: rows,
      upcoming: rows.filter(function (row) { return row.status === 'planned' && row.startDate && row.startDate >= today; }).sort(function (a,b) { return a.startDate.localeCompare(b.startDate) || a.order - b.order; })
    };
  }
  var portals = [
    { slug: 'destinations', label: 'Destinations', subtitle: 'Search your local atlas.', image: 'assets/destinations/crete-card.webp' },
    { slug: 'experiences', label: 'Experiences', subtitle: 'Activity discovery coming later.', image: 'assets/destinations/costa-rica-card.webp', future: true },
    { slug: 'travel-guides', label: 'Travel Guides', subtitle: 'Dedicated guides coming later.', image: 'assets/scenes/explore/hero.png', future: true },
    { slug: 'bucket-list', label: 'Bucket List', subtitle: 'Your saved places and trip plans.', image: 'assets/scenes/explore/hero.png' },
    { slug: 'discover-more', label: 'Discover More', subtitle: 'Explore your travel resources.', image: 'assets/destinations/azores-card.webp' }
  ];
  if (!root || !root.document || !root.OneSpaceRedesign || !root.OneSpace) return { portals: portals, buildModel: buildModel };
  var doc = root.document, OS = root.OneSpace, foundation = root.OneSpaceRedesign;
  var view = doc.getElementById('exploreView'), stage = doc.getElementById('redesignExplore');
  if (!view || !stage) return {};
  view.classList.add('redesign-explore');
  var sceneHost = doc.createElement('div');
  stage.appendChild(sceneHost);
  foundation.createSceneHost(sceneHost).show('explore');
  var frame = doc.createElement('div'); frame.className = 'osr-frame'; stage.appendChild(frame);
  function notice(message) { var el = doc.getElementById('osrExploreNotice'); el.textContent = message; el.hidden = false; }
  function focusOwner(target) {
    if (!target) { notice('That travel tool is unavailable. Your saved places are unchanged.'); return false; }
    target.scrollIntoView({block:'center'});
    if (!target.matches('button,input,select,a,textarea,summary')) { target.setAttribute('tabindex','-1'); }
    target.focus({preventScroll:true}); return true;
  }
  var shell = foundation.createShell(doc, {
    onNavigate: function (event,world) { event.preventDefault(); if (world === 'projects-notes') { notice('Projects & Notes is coming later. Projects remain in Work and notes in Quick Notes.'); } else OS.goToPage(world); },
    onUtility: function (utility) { if (utility === 'command') doc.getElementById('paletteHint').click(); else if (utility === 'today') OS.goToPage('productivity'); else OS.goToPage(utility); }
  });
  foundation.setActiveWorld(shell, 'explore'); frame.appendChild(shell);
  frame.insertAdjacentHTML('beforeend',
    '<main class="osr-explore-main">' +
      '<section class="osr-explore-hero" aria-labelledby="osrExploreTitle">' +
        '<p class="osr-context">Your local travel collection</p>' +
        '<h1 class="osr-title" id="osrExploreTitle">Explore a brighter world.</h1>' +
        '<p class="osr-lead">Find your next place. Keep the ideas that move you.</p>' +
        '<form class="osr-search" id="osrExploreSearchForm"><label class="visually-hidden" for="osrExploreSearch">Search destinations</label>' + OS.iconSvg('search') + '<input id="osrExploreSearch" maxlength="200" placeholder="Find a city, island, or adventure…" autocomplete="off"><button class="osr-button" type="submit">Search places →</button></form>' +
        '<div class="osr-quick-actions" aria-label="Explore quick actions">' +
        [['destinations','Destinations'],['experiences','Experiences'],['dates','Travel Dates'],['interests','Interests'],['budget','Budget'],['style','Travel Style']].map(function (item) { return '<button class="osr-chip" type="button" data-explore-action="' + item[0] + '">' + item[1] + '</button>'; }).join('') + '</div>' +
        '<p class="osr-action-notice" id="osrExploreNotice" role="status" hidden></p>' +
      '</section>' +
      '<section class="osr-explore-summary osr-grid" aria-label="Explore at a glance">' +
        '<article class="osr-panel"><div class="osr-card-head"><h2>Featured Destinations</h2><button class="osr-button" type="button" data-explore-action="surprise">Surprise me</button></div><p class="osr-explore-context">From your maintained local collection</p><div id="osrExploreFeatured" class="osr-explore-featured"></div></article>' +
        '<article class="osr-panel"><div class="osr-card-head"><h2>Saved Places</h2><button class="osr-card-arrow" type="button" data-explore-action="bucket-list" aria-label="Open saved trip board">↗</button></div><p class="osr-explore-context" id="osrExploreSavedCount">Your saved trip board</p><div id="osrExploreSaved"><p class="osr-empty">No saved places yet. Search or add a location below.</p></div></article>' +
        '<article class="osr-panel"><div class="osr-card-head"><h2>Upcoming Trips</h2><button class="osr-card-arrow" type="button" data-explore-action="dates" aria-label="Plan trip dates">↗</button></div><p class="osr-explore-context">Planned trips with upcoming start dates</p><div id="osrExploreUpcoming"><p class="osr-empty">No upcoming dated trips. Set a planned trip’s dates on your board.</p></div></article>' +
      '</section>' +
      '<section class="osr-explore-portals osr-grid" aria-label="Explore spaces">' + portals.map(function (portal) { return '<button class="osr-portal osr-explore-portal osr-explore-portal-action" type="button" data-portal="' + portal.slug + '" data-explore-action="' + portal.slug + '" aria-label="' + (portal.future ? portal.label + ' — coming later' : 'Open ' + portal.label) + '"><img src="' + portal.image + '" alt="" loading="eager" decoding="async"><span class="osr-portal-copy"><strong>' + portal.label + '</strong><small>' + portal.subtitle + '</small></span>' + OS.iconSvg('arrowUpRight') + '</button>'; }).join('') + '</section>' +
      '<div class="osr-explore-credits"><button class="osr-explore-credits-toggle" type="button" data-explore-action="credits" aria-haspopup="dialog" aria-controls="domainOverlay">' + OS.iconSvg('book') + 'Scene &amp; photo credits</button><template id="osrExploreCredits"></template></div>' +
      '<section class="osr-explore-followon"><h2>Your travel tools</h2><p>Search, save places and manage your trips below.</p></section>' +
    '</main>');
  stage.querySelectorAll('.osr-explore-portal img').forEach(function (img) {
    img.dataset.fallbackOwner = 'explore-portal';
    function fallback() { img.hidden = true; img.parentElement.dataset.assetState = 'fallback'; }
    img.addEventListener('error',fallback);
    if (img.complete && !img.naturalWidth) fallback();
  });
  var D = root.OneSpaceDiscovery, owner = root.OneSpaceExplore, esc = OS.escapeHtml;
  function todayKey() { var now = new Date(); return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0'); }
  function snapshot() { return { destinations: root.DESTINATIONS || [], trips: OS.safeGetJSON('orbit-trip-board',[]) }; }
  function tripRow(row, dated) {
    return '<button class="osr-explore-row" type="button" data-explore-trip="' + esc(row.id) + '">' + OS.iconSvg(dated ? 'calendaricon' : 'globe') + '<span><strong>' + esc(row.destination.name) + '</strong><small>' + esc(dated ? row.startDate + (row.endDate ? ' → ' + row.endDate : '') : [row.destination.country,D.label(row.status)].filter(Boolean).join(' · ')) + '</small></span></button>';
  }
  function render() {
    var model = buildModel(snapshot(),todayKey());
    doc.getElementById('osrExploreFeatured').innerHTML = model.featured.map(function (raw) { var item = root.OneSpaceLocalDiscovery.normalize(raw,'destinations'); return '<article class="osr-explore-destination">' + D.photo(item) + '<h3>' + esc(item.name) + '</h3><p>' + esc(item.country) + '</p><button class="osr-button" type="button" data-explore-destination="' + esc(item.id) + '" aria-label="Explore ' + esc(item.name) + '">Explore →</button></article>'; }).join('') || '<p class="osr-empty">The local catalog is unavailable. Your saved places remain below.</p>';
    D.wirePhotos(doc.getElementById('osrExploreFeatured'));
    doc.getElementById('osrExploreSavedCount').textContent = model.saved.length + ' saved on this device';
    doc.getElementById('osrExploreSaved').innerHTML = model.saved.slice(0,3).map(function (row) { return tripRow(row,false); }).join('') || '<p class="osr-empty">No saved places yet. Search or add a location below.</p>';
    doc.getElementById('osrExploreUpcoming').innerHTML = model.upcoming.slice(0,3).map(function (row) { return tripRow(row,true); }).join('') || '<p class="osr-empty">No upcoming dated trips. Set a planned trip’s dates on your board.</p>';
  }
  var photoIds = ['lisbon','kyoto','azores','crete','costa-rica'];
  doc.getElementById('osrExploreCredits').innerHTML = '<div class="osr-explore-provenance"><p>The travel room is generated local artwork. Destination photographs retain their original licenses. These credits describe the imagery; open destination details for travel descriptions.</p>' + photoIds.map(function (id) { var raw = (root.DESTINATIONS || []).find(function (item) { return item.id === id; }); if (!raw || !raw.photoSource) return ''; var p = raw.photoSource; return '<p>' + esc(raw.name) + ' — ' + D.link(p.sourceUrl,p.credit) + ' · ' + D.link(p.licenseUrl,p.license) + '</p>'; }).join('') + '</div>';
  doc.getElementById('osrExploreSearchForm').addEventListener('submit',function (event) {
    event.preventDefault(); var input = doc.querySelector('#exploreDestinations .discovery-form [name="q"]');
    if (!input) { notice('Destination search is unavailable. Please try again.'); return; }
    input.value = doc.getElementById('osrExploreSearch').value.trim();
    input.form.requestSubmit(); focusOwner(input);
  });
  stage.addEventListener('click',async function (event) {
    var destination = event.target.closest('[data-explore-destination]');
    if (destination) {
      destination.disabled = true; notice('Opening local destination details…');
      try { var data = await D.api('destinations','details',{id:destination.dataset.exploreDestination}); D.openDetail(data.item,owner.save,'Save to shortlist'); notice('Details loaded from your local collection.'); }
      catch (error) { notice('Destination details are unavailable. ' + error.message); }
      finally { destination.disabled = false; } return;
    }
    var trip = event.target.closest('[data-explore-trip]');
    if (trip) { var control = Array.from(doc.querySelectorAll('#exploreDestinations [data-trip-id]')).find(function (card) { return card.dataset.tripId === trip.dataset.exploreTrip; }); focusOwner(control && control.querySelector('[data-trip="edit"]')); return; }
    var action = event.target.closest('[data-explore-action]'); if (!action) return;
    var name = action.dataset.exploreAction;
    if (name === 'credits') { root.OneSpaceUI.open('Scene & photo credits',doc.getElementById('osrExploreCredits').innerHTML,null); return; }
    if (name === 'experiences' || name === 'travel-guides') { notice((name === 'experiences' ? 'Experiences' : 'Travel Guides') + ' is coming in the Explore submodule rollout. Destination discovery and your trip board are available below.'); return; }
    if (name === 'surprise') { owner.random(); return; }
    if (name === 'destinations') { focusOwner(doc.querySelector('#exploreDestinations [name="q"]')); return; }
    if (name === 'dates' || name === 'bucket-list') { focusOwner(doc.querySelector('#exploreDestinations .trip-board')); return; }
    if (name === 'discover-more') { focusOwner(doc.querySelector('#exploreView [data-action="explore-random"]')); return; }
    var filters = doc.querySelector('#exploreDestinations .discovery-filters');
    if (filters) { filters.open = true; focusOwner(filters.querySelector('[name="' + name + '"]')); }
  });
  doc.addEventListener('onespace:data-changed',function (event) { if (event.detail.key === 'orbit-trip-board') render(); });
  doc.addEventListener('onespace:page-changed',function (event) { if (event.detail.page === 'explore') render(); });
  render();
  return { portals: portals, buildModel: buildModel };
});
