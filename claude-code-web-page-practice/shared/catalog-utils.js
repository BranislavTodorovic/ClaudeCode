/* Pure catalog operations shared by Games, Movies and regression tests. */
(function (root, factory) {
  var api = factory(); if (typeof module === "object" && module.exports) module.exports = api; else root.OneSpaceCatalog = api;
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  function array(value) { return Array.isArray(value) ? value : value ? [value] : []; }
  function game(record) {
    var genres = array(record.genres || record.genre);
    if (genres.indexOf("Survival Horror") >= 0) genres = genres.concat(["Survival", "Horror"]);
    return Object.assign({}, record, { title: record.title || record.name, platforms: array(record.platforms || record.platform), genres: genres,
      playstyles: array(record.playstyles), moods: array(record.moods), blurb: record.blurb || record.tagline || "From your local game catalog.", accent: /^#[0-9a-f]{3,8}$/i.test(record.accent || "") ? record.accent : "#697fb9" });
  }
  function merge(pools, normalizer) {
    var result = [], ids = new Set(), titles = new Map();
    pools.forEach(function (pool) { pool.forEach(function (item) {
      var value = normalizer ? normalizer(item) : item;
      var title = String(value.title || value.name || "").trim().toLowerCase();
      var identity = value.sourceSuggestion || value.id;
      if (ids.has(identity) || titles.has(title)) return;
      ids.add(identity); titles.set(title, true); result.push(value);
    }); }); return result;
  }
  function matches(item, prefs, getter) {
    return Object.keys(prefs).every(function (key) {
      var selected = array(prefs[key]); if (!selected.length) return true;
      var values = array(getter ? getter(item, key) : item[key]);
      return selected.some(function (value) { return values.indexOf(value) >= 0; });
    });
  }
  function search(items, query) {
    var q = String(query || "").trim().toLowerCase();
    return items.filter(function (item) {
      return !q || [item.title, item.name, item.year].concat(array(item.genres || item.genre), array(item.platforms || item.platform), array(item.moods), array(item.tags), array(item.type)).join(" ").toLowerCase().indexOf(q) >= 0;
    });
  }
  function similar(items, selected, fields) {
    if (!selected) return items;
    return items.filter(function (item) { return item.id !== selected.id && fields.some(function (f) { return array(item[f]).some(function (v) { return array(selected[f]).indexOf(v) >= 0; }); }); });
  }
  return { game: game, merge: merge, matches: matches, search: search, similar: similar };
});
