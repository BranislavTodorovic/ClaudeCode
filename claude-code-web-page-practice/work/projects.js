/* Projects owns project records. Work and Home consume read-only summaries. */
(function () {
  "use strict";
  var OS = window.OneSpace, key = "orbit-work-projects", editingId = null;
  var form = document.getElementById("projectForm"), list = document.getElementById("projectList");
  var esc = OS.escapeHtml;
  function projects() { return OS.safeGetJSON(key, []); }
  function commit(next) { if (!OS.safeSet(key, JSON.stringify(next))) return false; render(); return true; }
  function safeUrl(value) { try { var url = new URL(value); return /^https?:$/.test(url.protocol) ? url.href : ""; } catch (_) { return ""; } }
  function coverHue(seed) {
    var hash = 0;
    for (var i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return hash % 360;
  }
  function preview(p, compact) {
    var progress = Math.min(100, Math.max(0, Number(p.progress) || 0));
    var tags = Array.isArray(p.tags) ? p.tags : [];
    var url = safeUrl(p.url);
    var hue = coverHue(p.name + (tags[0] || ""));
    var coverStyle = "background:linear-gradient(125deg,hsl(" + hue + " 38% 22%),hsl(" + ((hue + 45) % 360) + " 42% 34%))";
    var blueprintStyle = "border-color:hsl(" + hue + " 60% 78% / .3)";
    return '<article class="project-card"><div class="project-preview" aria-hidden="true" style="' + coverStyle + '">' + window.OneSpaceVisual.cover(p.name + ' ' + tags.join(' '), 'project', 'hsl(' + hue + ' 60% 70%)') + '<span class="project-cover-label">' + esc(tags[0] || 'IN THE MAKING') + '</span></div><div class="project-card-body"><div class="project-card-top"><h3>' + esc(p.name) + '</h3><span class="status-chip status-' + esc(p.status) + '">' + esc(p.status.charAt(0).toUpperCase()+p.status.slice(1)) + '</span></div>' +
      (p.description ? '<p class="project-description">' + esc(p.description) + '</p>' : '<p class="project-description">An idea in progress. Give it a next step.</p>') +
      (p.deadline ? '<p>Deadline: ' + esc(p.deadline) + '</p>' : '') + '<div class="project-tags">' + tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("") + '</div><div class="project-meter" role="progressbar" aria-label="' + esc(p.name) + ' progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress + '"><span style="width:' + progress + '%"></span></div><div class="project-card-foot"><span>' + progress + '% complete</span>' +
      (compact ? '<button class="btn btn-ghost" type="button" data-page-jump="projects">Open Projects <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>' :
        '<div>' + (url ? '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open link <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>' : '') + '<button class="btn" type="button" data-project-edit="' + esc(p.id) + '">Edit</button><button class="btn btn-ghost" type="button" data-project-delete="' + esc(p.id) + '">Delete</button></div>') + '</div></div></article>';
  }
  function render() {
    var items = projects(), active = items.filter(function (p) { return p.status !== "done"; });
    document.getElementById("projectCount").textContent = items.length + (items.length === 1 ? " project" : " projects");
    list.innerHTML = items.length ? items.map(function (p) { return preview(p, false); }).join("") : '<div class="proof-empty"><span aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span><h3>Your next idea starts here.</h3><p>Create your first project above. No sample projects, just your own work.</p></div>';
    var reminders=active.filter(function(p){return p.deadline && window.OneSpaceWork && ['overdue','due-soon'].includes(window.OneSpaceWork.due(p.deadline));});
    document.getElementById('projectReminders').innerHTML='<h3>Project deadlines</h3>'+(reminders.length?reminders.map(function(p){return '<p>'+esc(p.name)+' · '+esc(p.deadline)+'</p>';}).join(''):'<p>No project deadlines in the next three days.</p>');
    document.getElementById("workProjectCount").textContent = active.length + " in progress";
    document.getElementById("workProjectsList").innerHTML = active.length ? active.slice(0, 3).map(function (p) { return preview(p, true); }).join("") : '<div class="proof-empty"><h3>A clear desk. A fresh start.</h3><p>Create a project and its progress will appear here.</p><button type="button" class="btn" data-page-jump="projects">Create your first project <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div>';
  }

  function cancel() { editingId = null; form.reset(); document.getElementById("projectSave").textContent = "Create project"; document.getElementById("projectFormHeading").textContent = "Create a project"; document.getElementById("projectCancel").hidden = true; }
  form.addEventListener("submit", function (e) {
    e.preventDefault(); var fields = form.elements, name = fields.name.value.trim(), url = fields.url.value.trim();
    if (!name) { fields.name.focus(); return; }
    if (url && !safeUrl(url)) { OS.showToast("Use an http or https project link."); fields.url.focus(); return; }
    var items = projects(), previous = items.find(function (p) { return p.id === editingId; });
    var status = fields.status.value, progress = Math.min(100, Math.max(0, Number(fields.progress.value)));
    if (status === "done") progress = 100;
    else if (progress === 100) { progress = 99; OS.showToast("Set status to Done for 100% completion."); }
    var item = Object.assign({}, previous || {}, { id: editingId || OS.uid("proj"), name: name, description: fields.description.value.trim(), tags: Array.from(new Set(fields.tags.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean))).slice(0, 12), url: safeUrl(url), status: status, progress: progress, deadline: fields.deadline.value, createdAt: previous && previous.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
    if (editingId) items = items.map(function (p) { return p.id === editingId ? item : p; }); else items.unshift(item);
    if (commit(items)) { cancel(); OS.showToast(previous ? "Project updated." : "Project created."); }
  });
  form.elements.status.addEventListener("change", function () {
    if (this.value === "done") form.elements.progress.value = 100;
    else if (Number(form.elements.progress.value) === 100) form.elements.progress.value = 0;
  });
  document.getElementById("projectCancel").addEventListener("click", cancel);
  list.addEventListener("click", function (e) {
    var edit = e.target.closest("[data-project-edit]"), del = e.target.closest("[data-project-delete]");
    if (edit) {
      var p = projects().find(function (x) { return x.id === edit.dataset.projectEdit; }); if (!p) return;
      editingId = p.id;
      ["name","description","url","status","progress","deadline"].forEach(function (field) { form.elements[field].value = p[field] == null ? "" : p[field]; });
      form.elements.tags.value = (p.tags || []).join(", ");
      document.getElementById("projectSave").textContent = "Save project";
      document.getElementById("projectFormHeading").textContent = "Edit project";
      document.getElementById("projectCancel").hidden = false;
      form.scrollIntoView({ block: "center", behavior: OS.prefersReducedMotion() ? "auto" : "smooth" }); form.elements.name.focus();
    }
    if (del) window.OneSpaceUI.confirm('Delete project?', 'Its stories, defects and tasks will be removed. Snapshots remain in Work history.', function () {
      if (window.OneSpaceWork.deleteProject(del.dataset.projectDelete)) { if (editingId === del.dataset.projectDelete) cancel(); render(); }
    });
  });
  var scheduled = false;
  document.addEventListener("onespace:data-changed", function (e) {
    if (["orbit-work-projects"].indexOf(e.detail.key) < 0 || scheduled) return;
    scheduled = true; queueMicrotask(function () { scheduled = false; render(); });
  });
  document.addEventListener("onespace:page-changed", render);
  render();
})();

