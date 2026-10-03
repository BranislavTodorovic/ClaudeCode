/* Presentation of existing owners only. Records and preference writes stay canonical. */
(function () {
  'use strict';
  var doc = document, OS = window.OneSpace;
  var settings = doc.getElementById('settingsView');
  var card = settings.querySelector('.settings-card');
  var groups = [
    ['settings-appearance', 'Look & atmosphere', 'sliders', 'Choose your palette. Light and dark mode remain independent.'],
    ['settings-everyday', 'Your everyday', 'grid', 'A few useful defaults for the way you use this space.'],
    ['settings-motion', 'Movement & attention', 'compass', 'Keep the atmosphere as quiet or expressive as you prefer.'],
    ['removedShortcutsSettings', 'Removed shortcuts', 'repeat', 'Bring a hidden built-in link back to its original space.'],
    ['settingsSources', 'Search providers', 'compass', 'Local collections work without accounts. Optional provider status is shown below.'],
    ['settingsData', 'Your data', 'shield', 'Back up, restore and manage the information on this device.']
  ];
  card.querySelector('.settings-provider-status').id = 'settingsSources';
  card.querySelector('.settings-data').id = 'settingsData';
  var layout = doc.createElement('div'); layout.className = 'settings-layout';
  var index = doc.createElement('nav'); index.className = 'settings-index'; index.setAttribute('aria-label', 'Preference sections');
  index.innerHTML = '<p class="settings-kicker">MAKE IT YOURS</p>';
  var content = doc.createElement('div'); content.className = 'settings-content';
  groups.forEach(function (group, i) {
    var section = doc.getElementById(group[0]);
    if (section.tagName === 'H2') section = section.closest('section');
    var heading = section.querySelector('h2,h4');
    var header = doc.createElement('header'); header.className = 'settings-section-title';
    var icon = doc.createElement('span'); icon.className = 'settings-section-icon'; icon.innerHTML = OS.iconSvg(group[2]); icon.setAttribute('aria-hidden', 'true');
    var copy = doc.createElement('div'); copy.appendChild(heading);
    var help = doc.createElement('p'); help.textContent = group[3]; copy.appendChild(help); header.append(icon, copy); section.prepend(header);
    section.classList.add('settings-section');
    var link = doc.createElement('button'); link.type = 'button'; link.innerHTML = OS.iconSvg(group[2]) + '<span>' + group[1] + '</span>';
    link.addEventListener('click', function () { section.scrollIntoView({block:'start', behavior:'auto'}); heading.tabIndex = -1; heading.focus({preventScroll:true}); });
    index.appendChild(link); content.appendChild(section);
  });
  var appearance = content.querySelector('#settings-appearance').closest('section');
  var paletteField = appearance.querySelector('.form-field:has(.theme-choices)');
  paletteField.querySelector('label').textContent = 'Color palette';
  paletteField.querySelector('.theme-choices').setAttribute('aria-label', 'Color palette');
  paletteField.querySelector('[data-theme-choice="classic"] strong').textContent = 'Classic';
  paletteField.querySelector('[data-theme-choice="classic"] small').textContent = 'Cool neutrals';
  var mode = doc.createElement('div'); mode.className = 'form-field settings-mode';
  var label = doc.createElement('span'); label.className = 'settings-field-label'; label.textContent = 'Light / dark mode';
  var toggle = doc.getElementById('themeToggle'); toggle.classList.remove('btn-icon'); toggle.classList.add('settings-mode-toggle');
  toggle.removeAttribute('aria-label');
  mode.append(label, toggle); paletteField.after(mode);
  var preview = doc.createElement('div'); preview.className = 'settings-live-preview'; preview.setAttribute('aria-label', 'Current palette preview');
  preview.innerHTML = '<span class="settings-preview-mark" aria-hidden="true">'+OS.iconSvg('grid')+'</span><div><strong>Your OneSpace</strong><p id="settingsPaletteStatus" role="status" aria-live="polite"></p></div><span class="settings-preview-swatches" aria-hidden="true"><i></i><i></i><i></i></span>';
  paletteField.after(preview);
  var actions = card.querySelector('.form-actions'); actions.classList.add('settings-final-actions');
  content.appendChild(actions); layout.append(index, content); card.appendChild(layout);
  function syncPreview() {
    var selected = settings.querySelector('[data-theme-choice][aria-checked="true"] strong');
    doc.getElementById('settingsPaletteStatus').textContent = (selected ? selected.textContent : 'Auto') + ' · ' + doc.documentElement.dataset.theme + ' mode';
  }
  new MutationObserver(syncPreview).observe(doc.documentElement, {attributes:true, attributeFilter:['data-theme','data-palette','data-accent']});
  syncPreview();

  var shortcuts = doc.getElementById('shortcutsView');
  var spaces = shortcuts.querySelector('.space-picker');
  var spaceNames = {work:['briefcase','Build & focus'],personal:['heart','Life & wellbeing'],explore:['compass','Travel & discovery']};
  var spaceLabel = doc.createElement('p'); spaceLabel.className = 'launcher-space-label'; spaceLabel.textContent = 'Your collections'; spaces.before(spaceLabel);
  spaces.querySelectorAll('button').forEach(function (button) {
    var name = button.textContent, item = spaceNames[button.dataset.spacePick];
    button.innerHTML = OS.iconSvg(item[0]) + '<span><strong>'+name+'</strong><small>'+item[1]+'</small></span>';
  });
  var search = shortcuts.querySelector('.shortcut-search');
  if (search) search.placeholder = 'Find a link and launch…';

  // Keep the existing directory menu inside the viewport, including edge tiles.
  shortcuts.addEventListener('click', function (event) {
    var button = event.target.closest('[data-action="menu"]');
    if (!button) return;
    var menu = shortcuts.querySelector('[data-menu-id="' + CSS.escape(button.dataset.id) + '"]');
    if (!menu) return;
    var parent = menu.parentElement.getBoundingClientRect();
    var anchor = button.getBoundingClientRect();
    var width = parseFloat(getComputedStyle(menu).width);
    menu.style.left = Math.max(16, Math.min(anchor.right - width, innerWidth - width - 16)) - parent.left + 'px';
  }, true);

  // A control glyph uses the same local SVG family as every other action.
  function arrowSvg(left) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (left ? 'M20 12H4m6-6-6 6 6 6' : 'M7 17 17 7M7 7h10v10') + '"/></svg>';
  }
  function normalize(scope) {
    scope.querySelectorAll('.osr-world button,.osr-card-arrow,.osr-games-arrow,.osr-portal-arrow').forEach(function (el) {
      Array.from(el.childNodes).forEach(function (node) {
        if (node.nodeType !== 3) return;
        var text = node.textContent;
        if (!/[←↗→]/.test(text)) return;
        var wrap = doc.createElement('span'); wrap.className = 'osr-action-copy';
        wrap.innerHTML = (text.includes('←') ? arrowSvg(true) : '') + OS.escapeHtml(text.replace(/[←↗→]/g, '').trim()) + (/[↗→]/.test(text) ? arrowSvg(false) : '');
        node.replaceWith(wrap);
      });
    });
  }
  normalize(doc);
  doc.addEventListener('onespace:games-changed', function () { queueMicrotask(function () { normalize(doc.getElementById('gamesView')); }); });
})();
