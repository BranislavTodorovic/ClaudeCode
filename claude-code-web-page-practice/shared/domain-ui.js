/* Shared domain dialogs use the shell's focus trap, Escape and focus return. */
(function () {
  'use strict';
  var OS = window.OneSpace, esc = OS.escapeHtml;
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay'; overlay.id = 'domainOverlay'; overlay.hidden = true;
  document.body.appendChild(overlay);
  function open(title, body, submit, label) {
    overlay.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="domainTitle"><div class="modal-header"><h3 id="domainTitle">' + esc(title) + '</h3><button class="btn" type="button" data-cancel aria-label="Close dialog">' + OS.iconSvg('close') + '</button></div><form class="modal-body domain-form">' + body + '<p class="form-error" role="alert" id="domainError"></p><div class="domain-actions"><button class="btn" type="button" data-cancel>Cancel</button>' + (submit ? '<button class="btn btn-primary" type="submit">' + esc(label || 'Save') + '</button>' : '') + '</div></form></div>';
    overlay.querySelectorAll('[data-cancel]').forEach(function (b) { b.onclick = function () { OS.closeModal(overlay); }; });
    overlay.querySelector('form').onsubmit = function (e) {
      e.preventDefault();
      try {
        if (!submit) return;
        if (submit(new FormData(e.target)) === false) {
          document.getElementById('domainError').textContent = 'Changes could not be saved. Please try again.';
          return;
        }
        OS.closeModal(overlay);
      }
      catch (error) { document.getElementById('domainError').textContent = error.message; }
    };
    OS.openModal(overlay, overlay.querySelector('input, textarea, select') || overlay.querySelector('[data-cancel]'));
  }
  overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) OS.closeModal(overlay); });
  function field(name, label, value, type, options) {
    var attrs = options || '', v = esc(value == null ? '' : value);
    return '<label>' + esc(label) + (type === 'textarea' ? '<textarea name="' + name + '" ' + (attrs.includes('maxlength=') ? '' : 'maxlength="10000"') + ' rows="3" ' + attrs + '>' + v + '</textarea>' : '<input name="' + name + '" type="' + (type || 'text') + '" value="' + v + '" ' + attrs + '>') + '</label>';
  }
  function select(name, label, values, current) {
    return '<label>' + esc(label) + '<select name="' + name + '">' + values.map(function (v) { var pair = Array.isArray(v) ? v : [v, v]; return '<option value="' + esc(pair[0]) + '"' + (pair[0] === current ? ' selected' : '') + '>' + esc(String(pair[1]).charAt(0).toUpperCase()+String(pair[1]).slice(1)) + '</option>'; }).join('') + '</select></label>';
  }
  // A persistent detail surface shares the shell's modal stack, focus trap and Escape handling.
  // Edit/confirm dialogs can open above it without destroying the underlying detail DOM.
  function panel(title) {
    var layer = document.createElement('div');
    layer.id = 'workDetailOverlay'; layer.className = 'modal-overlay work-detail-overlay'; layer.hidden = true;
    layer.innerHTML = '<div class="modal work-detail-modal" role="dialog" aria-modal="true" aria-labelledby="workPanelTitle"><header class="modal-header"><h2 id="workPanelTitle"></h2><button class="btn" type="button" data-panel-close aria-label="Close work details">' + OS.iconSvg('close') + '</button></header><div class="work-detail-body"></div></div>';
    document.body.appendChild(layer);
    layer.addEventListener('click', function (e) { if (e.target === layer || e.target.closest('[data-panel-close]')) OS.closeModal(layer); });
    var api = { overlay:layer, body:layer.querySelector('.work-detail-body'), setTitle:function(value){layer.querySelector('h2').textContent=value;}, show:function(){OS.openModal(layer,layer.querySelector('[data-panel-close]'));}, close:function(){OS.closeModal(layer);} };
    api.setTitle(title); return api;
  }
  window.OneSpaceUI = { open: open, panel: panel, field: field, select: select, confirm: function (title, message, action, label) { open(title, '<p>' + esc(message) + '</p>', action, label || 'Delete'); } };
})();
