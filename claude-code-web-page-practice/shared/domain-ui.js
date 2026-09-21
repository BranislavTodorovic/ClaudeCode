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
      try { if (submit && submit(new FormData(e.target)) !== false) OS.closeModal(overlay); }
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
  window.OneSpaceUI = { open: open, field: field, select: select, confirm: function (title, message, action) { open(title, '<p>' + esc(message) + '</p>', action, 'Delete'); } };
})();
