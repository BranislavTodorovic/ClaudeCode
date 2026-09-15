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
  function valid(key, value) {
    if (KEYS.indexOf(key) < 0) return false;
    if (value === null) return true;
    if (typeof value !== "string") return false;
    try {
      if (arrayKeys.indexOf(key) >= 0) {
        var a = JSON.parse(value); if (!Array.isArray(a)) return false;
        if (/favorites|recent|collapsed-sections|custom-categories|category-order|wishlist|watchlist|dismissed/.test(key)) return a.every(function (x) { return typeof x === "string"; });
        return a.every(function (x) {
          if (!object(x) || typeof x.id !== "string" || !x.id || /[<>"']/.test(x.id)) return false;
          if (key === "orbit-notes-list") return typeof x.body === "string";
          if (key === "orbit-work-projects") return typeof x.name === "string" && ["active","blocked","done"].indexOf(x.status) >= 0 && Number.isFinite(x.progress) && x.progress >= 0 && x.progress <= 100;
          if (/personal-|orbit-tasks/.test(key)) return typeof x.text === "string";
          if (key === "orbit-custom-links") return typeof x.name === "string" && typeof x.url === "string" && /^https?:\/\//i.test(x.url);
          if (key === "orbit-games-library") return typeof x.name === "string" && (!x.story || (object(x.story) && Array.isArray(x.story.chapters) && x.story.chapters.every(function (c) { return object(c) && typeof c.id === "string" && typeof c.title === "string" && Array.isArray(c.objectives) && c.objectives.every(function (o) { return object(o) && typeof o.id === "string" && typeof o.text === "string"; }); })));
          if (key === "orbit-movies-library") return typeof x.title === "string" && Array.isArray(x.genre) && Array.isArray(x.platforms);
          return true;
        });
      }
      if (objectKeys.indexOf(key) >= 0) {
        var data = JSON.parse(value); if (!object(data)) return false;
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
  function backup(storage) { return { app: "OneSpace", version: 2, exportedAt: new Date().toISOString(), data: snapshot(storage) }; }
  function restore(storage, backup) {
    if (!backup || backup.app !== "OneSpace" || backup.version !== 2) throw new Error("Unsupported backup");
    validate(backup.data);
    if (!KEYS.every(function (k) { return Object.prototype.hasOwnProperty.call(backup.data, k); })) throw new Error("Incomplete backup");
    transaction(storage, backup.data);
  }
  function reset(storage) { var data = {}; KEYS.forEach(function (k) { data[k] = null; }); transaction(storage, data); }
  return { keys: KEYS, valid: valid, validate: validate, snapshot: snapshot, transaction: transaction, backup: backup, restore: restore, reset: reset };
});
