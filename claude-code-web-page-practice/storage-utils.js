/* OneSpace storage boundary. No network and no dependency. */
(function (root, factory) {
  var api = factory(); if (typeof module === "object" && module.exports) module.exports = api;
  else root.OneSpaceStorage = api;
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  var KEYS = ["orbit-theme","orbit-custom-links","orbit-notes","orbit-search-provider","orbit-favorites","orbit-recent","orbit-collapsed-sections","orbit-accent","orbit-palette","orbit-density","orbit-clock-format","orbit-custom-categories","orbit-tasks","orbit-sidebar","orbit-widgets","orbit-view","orbit-countdowns","orbit-onboarding-seen","orbit-usage-counts","orbit-quick-access-tab","orbit-background","orbit-startup-mode","orbit-minimal-mode","orbit-category-order","orbit-space","orbit-space-quick-tabs","orbit-chill-mode","orbit-page","orbit-motion-override","orbit-notes-list","orbit-personal-goals","orbit-personal-routines","orbit-personal-habits","orbit-work-projects","orbit-last-backup","orbit-games-library","orbit-games-weekly","orbit-games-theme","orbit-games-wishlist","orbit-games-dismissed","orbit-games-preferences","orbit-games-active-tab","orbit-games-selected-story","orbit-games-selected-weekly","orbit-games-sessions","orbit-games-journal","orbit-games-spotlight","orbit-games-autoplay","orbit-movies-library","orbit-movies-watchlist","orbit-movies-dismissed","orbit-movies-preferences","orbit-movies-theme","orbit-movies-active-tab","orbit-movies-spotlight","orbit-movies-autoplay"];
  var arrayKeys = ["custom-links","favorites","recent","collapsed-sections","custom-categories","tasks","countdowns","category-order","notes-list","personal-goals","personal-routines","personal-habits","work-projects","games-library","games-wishlist","games-dismissed","games-sessions","games-journal","movies-library","movies-watchlist","movies-dismissed"].map(function (k) { return "orbit-" + k; });
  var objectKeys = ["usage-counts","space-quick-tabs","games-weekly","games-preferences","movies-preferences"].map(function (k) { return "orbit-" + k; });
  function object(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function strings(v) { return Array.isArray(v) && v.every(function (x) { return typeof x === "string"; }); }
  function optionalString(value) { return value == null || typeof value === "string"; }
  var LEGACY_KEYS = KEYS.slice();
  var NEW_KEYS = ['orbit-work-items', 'orbit-work-tasks', 'orbit-work-history', 'orbit-explore-preferences', 'orbit-explore-saved'];
  KEYS = KEYS.concat(NEW_KEYS);
  var V3_KEYS=KEYS.slice(); KEYS.push('orbit-trip-board'); arrayKeys.push('orbit-trip-board');
  arrayKeys = arrayKeys.concat(NEW_KEYS.filter(function (k) { return k !== 'orbit-explore-preferences'; }));
  objectKeys.push('orbit-explore-preferences');
  function text(v, max, required) { return typeof v === 'string' && v.length <= max && (!required || !!v.trim()); }
  function id(v) { return text(v, 120, true) && /^[\w-]+$/.test(v); }
  function date(v, time) {
    if (v == null || v === '') return true;
    if (typeof v !== 'string' || !(time ? /^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{3})?Z?)?$/ : /^\d{4}-\d\d-\d\d$/).test(v)) return false;
    var day = v.slice(0, 10), parsed = new Date(day + 'T00:00:00Z');
    return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === day && (!time || (Number.isFinite(+new Date(v)) && Number(v.slice(11,13)) < 24 && Number(v.slice(14,16)) < 60));
  }
  function url(v) { if (v == null || v === '') return true; try { return text(v, 2048) && /^https?:$/.test(new URL(v).protocol); } catch (_) { return false; } }
  function optionalText(v, max) { return v == null || text(v, max); }
  function tags(v) { return v == null || (strings(v) && v.length <= 30 && v.every(function (s) { return text(s, 80, true); })); }
  function timestamps(x, required) { return (!required || (x.createdAt && x.updatedAt)) && date(x.createdAt, true) && date(x.updatedAt, true) && date(x.completedAt, true); }
  function workItem(x) { return id(x.projectId) && text(x.name, 160, true) && ['story','defect'].includes(x.type) && ['open','in-progress','blocked','closed'].includes(x.status) && ['low','medium','high','urgent'].includes(x.priority) && ['analysis','plan','execution'].every(function (k) { return optionalText(x[k], 10000); }) && tags(x.labels) && date(x.deadline) && date(x.reminderAt, true) && timestamps(x, true) && (x.links == null || (Array.isArray(x.links) && x.links.length <= 12 && x.links.every(url))); }
  function workTask(x) { return id(x.itemId) && text(x.title, 160, true) && optionalText(x.details, 5000) && ['low','medium','high','urgent'].includes(x.priority) && typeof x.done === 'boolean' && date(x.dueDate) && timestamps(x, true) && (x.estimate == null || (Number.isFinite(x.estimate) && x.estimate >= 0 && x.estimate <= 10000)); }
  function resources(v) { return v == null || (Array.isArray(v) && v.length <= 30 && v.every(function (r) { return object(r) && text(r.label, 120, true) && text(r.group, 60, true) && !!r.url && url(r.url); })); }
  function choices(values, allowed) { return Array.isArray(values) && values.length > 0 && values.length <= allowed.length && values.every(function(v){return allowed.includes(v);}); }
  function templates(v) { return v == null || (object(v) && Object.keys(v).every(function(k){return ['story','weekly'].includes(k) && strings(v[k]) && v[k].length <= 30 && v[k].every(function(t){return text(t,200,true);});})); }
  function destination(x) { return object(x) && id(x.id) && text(x.name, 100, true) && text(x.country, 100, true) && choices(x.categories,['city break','nature','beach','culture/history','food','wellness','adventure']) && ['low','medium','high'].includes(x.budget) && choices(x.seasons,['spring','summer','autumn','winter']) && choices(x.duration,['weekend','week','extended']) && choices(x.styles,['relaxed','balanced','active']) && ['warm','temperate','cool'].includes(x.climate) && ['Europe','North America','Asia-Pacific'].includes(x.region) && tags(x.tags) && text(x.summary, 1000, true) && text(x.details, 5000, true) && (x.image == null || (text(x.image,500) && /^assets\/[\w/-]+\.(svg|webp|png|jpg)$/.test(x.image))) && text(x.fallback, 100, true) && resources(x.links); }
  function valid(key, value) {
    if (KEYS.indexOf(key) < 0) return false;
    if (value === null) return true;
    if (typeof value !== "string") return false;
    try {
      if (arrayKeys.indexOf(key) >= 0) {
        var a = JSON.parse(value); if (!Array.isArray(a)) return false;
        if (/favorites|recent|collapsed-sections|custom-categories|category-order|wishlist|watchlist|dismissed/.test(key)) return a.every(function (x) { return typeof x === "string"; });
        if (a.length > 20000 || new Set(a.map(function (x) { return x && x.id; })).size !== a.length) return false;
        return a.every(function (x) {
          if (!object(x) || typeof x.id !== "string" || !x.id || /[<>"']/.test(x.id)) return false;
          if (key === "orbit-notes-list") return typeof x.body === "string" && optionalString(x.title);
          if (key === 'orbit-trip-board') return (typeof module === 'object' && module.exports ? require('./trip-board') : window.OneSpaceTrips).valid(x);
          if (key === 'orbit-work-items') return workItem(x);
          if (key === 'orbit-work-tasks') return workTask(x);
          if (key === 'orbit-work-history') return id(x.itemId) && id(x.projectId) && text(x.name,160,true) && ['created','updated','closed','reopened','deleted','task-created','task-updated','task-deleted','task-completed'].includes(x.action) && !!x.at && date(x.at,true) && (x.snapshot == null || (object(x.snapshot) && workItem(x.snapshot))) && (x.tasks == null || (Array.isArray(x.tasks) && x.tasks.every(workTask)));
          if (key === 'orbit-explore-saved') return id(x.destinationId) && !!x.createdAt && date(x.createdAt,true) && optionalText(x.notes,2000);
          if (key === "orbit-work-projects") return text(x.name,100,true) && ["active","blocked","done"].indexOf(x.status) >= 0 && Number.isFinite(x.progress) && x.progress >= 0 && x.progress <= 100 && optionalText(x.description,2000) && url(x.url) && tags(x.tags) && date(x.deadline) && timestamps(x,false);
          if (/personal-/.test(key)) return text(x.text,80,true) && (x.done == null || typeof x.done === 'boolean') && (x.frequency == null || ['','daily','weekly','monthly'].includes(x.frequency)) && timestamps(x,false);
          if (key === 'orbit-tasks') return typeof x.text === 'string';
          if (key === "orbit-custom-links") return text(x.name,50,true) && !!x.url && url(x.url) && optionalText(x.description,240) && (x.space == null || ['work','personal','explore'].includes(x.space));
          if (key === "orbit-games-library") return text(x.name,160,true) && resources(x.resources) && templates(x.defaultTaskTemplates) && (x.defaultTasks == null || (strings(x.defaultTasks) && x.defaultTasks.length <= 30 && x.defaultTasks.every(function(t){return text(t,200,true);}))) && (!x.story || (object(x.story) && Array.isArray(x.story.chapters) && x.story.chapters.every(function (c) { return object(c) && typeof c.id === "string" && typeof c.title === "string" && Array.isArray(c.objectives) && c.objectives.every(function (o) { return object(o) && typeof o.id === "string" && typeof o.text === "string"; }); })));
          if (key === "orbit-movies-library") return text(x.title,160,true) && strings(x.genre) && strings(x.platforms) && (x.year == null || (Number.isInteger(x.year) && x.year >= 1800 && x.year <= 3000)) && (x.durationMinutes == null || (Number.isFinite(x.durationMinutes) && x.durationMinutes >= 0 && x.durationMinutes <= 10000)) && (x.rating == null || (Number.isFinite(x.rating) && x.rating >= 0 && x.rating <= 10)) && optionalText(x.blurb,5000) && (x.status == null || ['unwatched','watched','watchlist'].includes(x.status)) && (x.type == null || ['movie','series','Movie','Series','Documentary'].includes(x.type)) && (x.seasons == null || (Number.isInteger(x.seasons) && x.seasons >= 1 && x.seasons <= 100)) && (x.moods == null || strings(x.moods)) && (x.tags == null || strings(x.tags));
          return true;
        });
      }
      if (objectKeys.indexOf(key) >= 0) {
        var data = JSON.parse(value); if (!object(data)) return false;
        if (key === 'orbit-explore-preferences') {
          var choices = { categories:['city break','nature','beach','culture/history','food','wellness','adventure'], seasons:['spring','summer','autumn','winter'], duration:['weekend','week','extended'], budget:['low','medium','high'], pace:['relaxed','balanced','active'], climate:['warm','temperate','cool'], interests:['architecture','walking','museums','water','hiking','cuisine','spa','wildlife'], departure:['any','Europe','North America','Asia-Pacific'] };
          return Object.keys(data).every(function(k){return choices[k] && Array.isArray(data[k]) && data[k].length <= choices[k].length && data[k].every(function(v){return choices[k].includes(v);});});
        }
        if (/preferences$/.test(key)) return Object.keys(data).every(function (k) { return Array.isArray(data[k]) && data[k].every(function (x) { return typeof x === "string"; }); });
      }
      return true;
    } catch (_) { return false; }
  }
  function snapshot(storage) {
    var data = {}; KEYS.forEach(function (key) { data[key] = storage.getItem(key); }); return data;
  }
  function validate(data) {
    if (!object(data)) throw new Error("Invalid backup data");
    Object.keys(data).forEach(function (key) { if (!valid(key, data[key])) throw new Error("Invalid backup field: " + key); });
    return data;
  }
  function transaction(storage, data) {
    validate(data);
    if (Object.keys(data).some(function (k) { return ['orbit-work-projects','orbit-work-items','orbit-work-tasks'].includes(k); })) {
      function next(k) { var raw = Object.prototype.hasOwnProperty.call(data,k) ? data[k] : storage.getItem(k); if (!valid(k,raw)) throw new Error('Stored data needs recovery: ' + k); return JSON.parse(raw || '[]'); }
      var projects = next('orbit-work-projects'), items = next('orbit-work-items'), tasks = next('orbit-work-tasks');
      if (items.some(function(i){return !projects.some(function(p){return p.id === i.projectId;});}) || tasks.some(function(t){return !items.some(function(i){return i.id === t.itemId && (i.status !== 'closed' || t.done);});})) throw new Error('Invalid work hierarchy');
    }
    var before = {}, changed = [];
    Object.keys(data).forEach(function (key) { before[key] = storage.getItem(key); });
    try {
      Object.keys(data).forEach(function (key) {
        if (before[key] === data[key]) return;
        if (data[key] === null) storage.removeItem(key); else storage.setItem(key, data[key]);
        changed.push(key);
      });
    } catch (error) {
      var rollbackFailed = false;
      changed.reverse().forEach(function (key) {
        try { if (before[key] === null) storage.removeItem(key); else storage.setItem(key, before[key]); }
        catch (_) { rollbackFailed = true; }
      });
      var failure = new Error(rollbackFailed ? "Storage failed and could not fully recover. Keep this page open and download a backup." : "Storage unavailable or full. No data was imported.");
      failure.recovery = before; failure.rollbackFailed = rollbackFailed; throw failure;
    }
  }
  function backup(storage) { return { app: "OneSpace", version: 4, exportedAt: new Date().toISOString(), data: snapshot(storage) }; }
  function restore(storage, backup) {
    if (!backup || backup.app !== "OneSpace" || ![2,3,4].includes(backup.version)) throw new Error("Unsupported backup");
    validate(backup.data);
    if (!(backup.version === 2 ? LEGACY_KEYS : backup.version === 3 ? V3_KEYS : KEYS).every(function (k) { return Object.prototype.hasOwnProperty.call(backup.data, k); })) throw new Error("Incomplete backup");
    var next = Object.assign({}, backup.data);
    NEW_KEYS.concat(['orbit-trip-board']).forEach(function (k) { if (!(k in next)) next[k] = null; });
    transaction(storage, next);
  }
  function reset(storage) { var data = {}; KEYS.forEach(function (k) { data[k] = null; }); transaction(storage, data); }
  return { keys: KEYS, legacyKeys: LEGACY_KEYS, valid: valid, validDate: date, validUrl: url, validDestination: destination, validate: validate, snapshot: snapshot, transaction: transaction, backup: backup, restore: restore, reset: reset };
});
