(function (root) {
  'use strict';
  root.makePersonalController = function (storageKey, OS) {
    function items() { return OS.safeGetJSON(storageKey, []); }
    function commit(next) { return OS.safeSet(storageKey, JSON.stringify(next)); }
    var controller = {
      count: function () { return items().length; },
      add: function (text) { var now = new Date().toISOString(); return commit([{ id: OS.uid('item'), text: text.trim().slice(0, 80), done: false, createdAt: now, updatedAt: now }].concat(items())); },
      render: function (list) {
        var data = items(), esc = OS.escapeHtml;
        list.innerHTML = '<li class="check-summary" role="status">' + data.filter(function (x) { return x.done; }).length + ' / ' + data.length + ' complete</li>' + (data.length ? data.map(function (x) {
          return '<li class="' + (x.done ? 'is-done' : '') + '"><input type="checkbox" data-toggle="' + esc(x.id) + '" aria-label="Complete ' + esc(x.text) + '"' + (x.done ? ' checked' : '') + '><span>' + esc(x.text) + (x.frequency ? '<small> · ' + esc(x.frequency) + '</small>' : '') + (x.target ? '<small> · target ' + esc(x.target) + '</small>' : '') + '</span><button class="btn" data-edit="' + esc(x.id) + '" title="Edit" aria-label="Edit ' + esc(x.text) + '">' + OS.iconSvg('edit') + '</button><button class="btn" data-delete="' + esc(x.id) + '" title="Delete" aria-label="Delete ' + esc(x.text) + '">' + OS.iconSvg('trash') + '</button></li>';
        }).join('') : '<li class="check-empty">Nothing here yet — add one above.</li>');
        list.onchange = function (e) {
          var id = e.target.dataset.toggle; if (!id) return;
          var next = items().map(function (x) { return x.id === id ? Object.assign({}, x, { done: e.target.checked, updatedAt: new Date().toISOString() }) : x; });
          if (commit(next)) { controller.render(list); list.querySelector('[data-toggle="' + id + '"]').focus(); OS.showToast('Completion updated.'); }
          else e.target.checked = !e.target.checked;
        };
        list.onclick = function (e) {
          var btn = e.target.closest('[data-edit], [data-delete]'); if (!btn) return;
          var id = btn.dataset.edit || btn.dataset.delete, item = items().find(function (x) { return x.id === id; }), ui = root.OneSpaceUI;
          if (!item) return;
          if (btn.dataset.delete) ui.confirm('Delete personal item?', item.text, function () {
            if (!commit(items().filter(function (x) { return x.id !== id; }))) return false;
            controller.render(list); if(OS.onChange)OS.onChange(); OS.showToast('Personal item deleted.');
          });
          else ui.open('Edit personal item', ui.field('text', 'Text', item.text, 'text', 'required maxlength="80"') + (storageKey === 'orbit-personal-habits' ? ui.select('frequency', 'Frequency', ['', 'daily', 'weekly', 'monthly'], item.frequency || '') + ui.field('target', 'Target per period (optional)', item.target || '', 'number', 'min="1" max="365" step="1"') : ''), function (form) {
            var text = String(form.get('text')).trim(); if (!text) throw new Error('Enter a name.');
            var next = Object.assign({}, item, { text: text, updatedAt: new Date().toISOString() });
            if (form.has('frequency')) next.frequency = form.get('frequency');
            if (form.has('target')) {
              var rawTarget = String(form.get('target')).trim();
              if (rawTarget && (!/^\d+$/.test(rawTarget) || Number(rawTarget) < 1 || Number(rawTarget) > 365)) throw new Error('Enter a target from 1 to 365.');
              if (rawTarget) next.target = Number(rawTarget); else delete next.target;
            }
            if (!commit(items().map(function (x) { return x.id === id ? next : x; }))) return false;
            controller.render(list); OS.showToast('Personal item updated.');
          });
        };
      }
    }; return controller;
  };
})(window);
