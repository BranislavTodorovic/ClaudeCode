/* Projects owns project records. Work and Home consume read-only summaries. */
(function () {
  "use strict";
  var OS = window.OneSpace, key = "orbit-work-projects", editingId = null;
  var form = document.getElementById("projectForm"), list = document.getElementById("projectList");
  var esc = OS.escapeHtml;
  function projects() { return OS.safeGetJSON(key, []); }
  function commit(next) { if (!OS.safeSet(key, JSON.stringify(next))) return false; render(); return true; }
  function safeUrl(value) { try { var url = new URL(value); return /^https?:$/.test(url.protocol) ? url.href : ""; } catch (_) { return ""; } }
  function preview(p, compact) {
    var progress = Math.min(100, Math.max(0, Number(p.progress) || 0));
    var tags = Array.isArray(p.tags) ? p.tags : [];
    var url = safeUrl(p.url);
    return '<article class="project-card"><div class="project-preview" aria-hidden="true"><span>' + esc(p.name.slice(0, 2).toUpperCase()) + '</span><div class="project-blueprint"></div></div><div class="project-card-body"><div class="project-card-top"><h3>' + esc(p.name) + '</h3><span class="status-chip status-' + esc(p.status) + '">' + esc(p.status) + '</span></div>' +
      (p.description ? '<p class="project-description">' + esc(p.description) + '</p>' : '<p class="project-description">An idea in progress. Give it a next step.</p>') +
      '<div class="project-tags">' + tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("") + '</div><div class="project-meter" role="progressbar" aria-label="' + esc(p.name) + ' progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress + '"><span style="width:' + progress + '%"></span></div><div class="project-card-foot"><span>' + progress + '% complete</span>' +
      (compact ? '<button class="btn btn-ghost" type="button" data-page-jump="projects">Open Projects ↗</button>' :
        '<div>' + (url ? '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open link ↗</a>' : '') + '<button class="btn" type="button" data-project-edit="' + esc(p.id) + '">Edit</button><button class="btn btn-ghost" type="button" data-project-delete="' + esc(p.id) + '">Delete</button></div>') + '</div></div></article>';
  }
  function tile(label, value, note, page, symbol) {
    return '<button class="overview-tile" type="button" data-page-jump="' + page + '"><span class="overview-tile-top"><span>' + label + '</span><span aria-hidden="true">' + symbol + '</span></span><strong>' + value + '</strong><span class="overview-tile-bottom">' + esc(note) + '<span aria-hidden="true">↗</span></span></button>';
  }
  function render() {
    var items = projects(), active = items.filter(function (p) { return p.status !== "done"; });
    document.getElementById("projectCount").textContent = items.length + (items.length === 1 ? " project" : " projects");
    list.innerHTML = items.length ? items.map(function (p) { return preview(p, false); }).join("") : '<div class="proof-empty"><span aria-hidden="true">↗</span><h3>Your next idea starts here.</h3><p>Create your first project above. No sample projects, just your own work.</p></div>';
    document.getElementById("workProjectCount").textContent = active.length + " in progress";
    document.getElementById("workProjectsList").innerHTML = active.length ? active.slice(0, 3).map(function (p) { return preview(p, true); }).join("") : '<div class="proof-empty"><h3>A clear desk. A fresh start.</h3><p>Create a project and its progress will appear here.</p><button type="button" class="btn" data-page-jump="projects">Create your first project ↗</button></div>';
    var tasks = OS.safeGetJSON("orbit-tasks", []), open = tasks.filter(function (t) { return !t.done; });
    var high = open.filter(function (t) { return t.priority === "high"; }).length;
    var notes = OS.safeGetJSON("orbit-notes-list", []);
    document.getElementById("homeOverview").innerHTML =
      tile("Work in motion", active.length, active.length ? active[0].name : "Give your next idea a home", "projects", "▧") +
      tile("On your mind", open.length, open.length ? open[0].text : "A little room to breathe", "productivity", "✓") +
      tile("Thoughts captured", notes.length, notes.length ? (notes[0].title || "Your latest note") : "Save an idea before it goes", "notes", "✎");
    document.getElementById("workOverview").innerHTML =
      tile("In progress", active.length, "Projects moving toward done", "projects", "▧") +
      tile("Next up", open.length, high ? high + " high-priority tasks" : "Your priorities, in one place", "productivity", "✓") +
      tile("Finished", items.filter(function (p) { return p.status === "done"; }).length, "Make space for what comes next", "projects", "↗");
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
    var item = Object.assign({}, previous || {}, { id: editingId || OS.uid("proj"), name: name, description: fields.description.value.trim(), tags: Array.from(new Set(fields.tags.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean))).slice(0, 12), url: safeUrl(url), status: status, progress: progress });
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
      ["name","description","url","status","progress"].forEach(function (field) { form.elements[field].value = p[field] == null ? "" : p[field]; });
      form.elements.tags.value = (p.tags || []).join(", ");
      document.getElementById("projectSave").textContent = "Save project";
      document.getElementById("projectFormHeading").textContent = "Edit project";
      document.getElementById("projectCancel").hidden = false;
      form.scrollIntoView({ block: "center", behavior: OS.prefersReducedMotion() ? "auto" : "smooth" }); form.elements.name.focus();
    }
    if (del && window.confirm("Delete this project? Export a backup first if you want to keep it.")) {
      if (commit(projects().filter(function (p) { return p.id !== del.dataset.projectDelete; }))) { if (editingId === del.dataset.projectDelete) cancel(); OS.showToast("Project deleted."); }
    }
  });
  var scheduled = false;
  document.addEventListener("onespace:data-changed", function (e) {
    if (["orbit-work-projects", "orbit-tasks", "orbit-notes-list"].indexOf(e.detail.key) < 0 || scheduled) return;
    scheduled = true; queueMicrotask(function () { scheduled = false; render(); });
  });
  document.addEventListener("onespace:page-changed", render);
  document.querySelectorAll(".scene-hero").forEach(function (hero) {
    var frame = 0;
    hero.addEventListener("pointermove", function (e) {
      if (OS.prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches || frame) return;
      frame = requestAnimationFrame(function () {
        frame = 0; var bounds = hero.getBoundingClientRect();
        hero.style.setProperty("--scene-x", ((e.clientX - bounds.left) / bounds.width - .5) * 8 + "px");
        hero.style.setProperty("--scene-y", ((e.clientY - bounds.top) / bounds.height - .5) * 5 + "px");
      });
    });
    function reset() { hero.style.setProperty("--scene-x", "0px"); hero.style.setProperty("--scene-y", "0px"); }
    hero.addEventListener("pointerleave", reset); document.addEventListener("onespace:motion-changed", reset);
  });
  render();
})();
