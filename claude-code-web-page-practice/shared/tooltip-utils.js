/* OneSpace tooltip layer. Auto-derives tooltips from title/aria-label on icon-only
   controls so hover, keyboard focus, and screen readers all get the same explanation.
   No dependency, no network. */
(function () {
  "use strict";
  var SELECTOR = "button, a, [role='button'], [role='tab'], [role='radio']";
  var tip = null, activeTarget = null, hideTimer = null, scanTimer = null;

  function isRendered(el) {
    if (el.offsetWidth === 0 && el.offsetHeight === 0 && !el.getClientRects().length) return false;
    var style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  // Text counts only if it (and every ancestor up to el) is actually rendered —
  // labels hidden by CSS (e.g. a collapsed sidebar) don't count as "visible".
  function visibleText(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var text = "", node;
    while ((node = walker.nextNode())) {
      var value = node.textContent.trim();
      if (!value) continue;
      var parent = node.parentElement;
      if (!parent || parent.closest("svg, .visually-hidden")) continue;
      var ok = true, walkUp = parent;
      while (walkUp && walkUp !== el.parentElement) { if (!isRendered(walkUp)) { ok = false; break; } walkUp = walkUp.parentElement; }
      if (ok) text += value;
    }
    return text.trim();
  }

  function scan(root) {
    if (activeTarget && (!activeTarget.isConnected || activeTarget.closest('[hidden], [inert]'))) hide();
    root.querySelectorAll(SELECTOR).forEach(function (el) {
      if (el.hasAttribute("data-no-tooltip")) return;
      var label = el.getAttribute("aria-label") || el.getAttribute("title") || el.dataset.tooltipSource;
      if (!label) return;
      el.dataset.tooltipSource = label;
      if (el.hasAttribute("title")) el.removeAttribute("title");
      if (/[\p{L}\p{N}]/u.test(visibleText(el))) el.removeAttribute("data-tooltip");
      else {
        el.setAttribute("data-tooltip", el.dataset.tooltipSource);
        if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", label);
      }
    });
  }

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.className = "os-tooltip";
    tip.setAttribute("role", "tooltip");
    tip.id = "osTooltipBubble";
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }

  function place(target) {
    var bubble = ensureTip();
    var rect = target.getBoundingClientRect();
    var bubbleRect = bubble.getBoundingClientRect();
    var top = rect.top - bubbleRect.height - 8;
    if (top < 8) top = rect.bottom + 8;
    var left = rect.left + rect.width / 2 - bubbleRect.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - bubbleRect.width - 8));
    bubble.style.top = Math.round(top + window.scrollY) + "px";
    bubble.style.left = Math.round(left + window.scrollX) + "px";
  }

  function show(target) {
    var text = target.getAttribute("data-tooltip");
    if (!text) return;
    if (activeTarget && activeTarget !== target) hide();
    clearTimeout(hideTimer);
    var bubble = ensureTip();
    bubble.textContent = text;
    bubble.hidden = false;
    bubble.classList.add("is-visible");
    place(target);
    var descriptions = (target.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    if (descriptions.indexOf(bubble.id) < 0) descriptions.push(bubble.id);
    target.setAttribute("aria-describedby", descriptions.join(" "));
    activeTarget = target;
  }

  function hide() {
    if (!tip || !activeTarget) return;
    tip.classList.remove("is-visible");
    tip.hidden = true;
    var descriptions = (activeTarget.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (id) { return id && id !== tip.id; });
    if (descriptions.length) activeTarget.setAttribute("aria-describedby", descriptions.join(" "));
    else activeTarget.removeAttribute("aria-describedby");
    activeTarget = null;
  }

  document.addEventListener("pointerover", function (e) {
    var target = e.target.closest("[data-tooltip]");
    if (target) show(target);
  });
  document.addEventListener("pointerout", function (e) {
    var target = e.target.closest("[data-tooltip]");
    if (target) hideTimer = setTimeout(hide, 60);
  });
  document.addEventListener("focusin", function (e) {
    var target = e.target.closest("[data-tooltip]");
    if (target) show(target);
  });
  document.addEventListener("focusout", function (e) {
    var target = e.target.closest("[data-tooltip]");
    if (target) hide();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
  window.addEventListener("scroll", hide, true);
  window.addEventListener("resize", hide);
  document.addEventListener("onespace:page-changed", hide);

  var observer = new MutationObserver(function () {
    if (scanTimer) return;
    scanTimer = requestAnimationFrame(function () { scanTimer = null; scan(document.body); });
  });

  function start() {
    scan(document.body);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "class", "aria-label", "title"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-sidebar"] });
    document.querySelectorAll('input[placeholder]:not([aria-label]), textarea[placeholder]:not([aria-label])').forEach(function (field) {
      if (!field.labels || !field.labels.length) field.setAttribute('aria-label', field.placeholder.replace(/…/g, ''));
    });
    document.addEventListener('keydown', function (event) {
      var tab = event.target.closest('[role="tab"]');
      // Game/movie tablists already own their keyboard handlers.
      if (tab && !tab.matches('.gv-tab,.mv-tab') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
        var tabs = Array.from(tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
        var next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (tabs.indexOf(tab) + (event.key === 'ArrowLeft' ? -1 : 1) + tabs.length) % tabs.length;
        event.preventDefault(); tabs[next].click(); tabs[next].focus(); return;
      }
      var radio = event.target.closest('[role="radio"]');
      if (!radio || ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].indexOf(event.key) < 0) return;
      var group = radio.closest('[role="radiogroup"]');
      if (!group) return;
      var radios = Array.from(group.querySelectorAll('[role="radio"]'));
      var direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
      var index = event.key === 'Home' ? 0 : event.key === 'End' ? radios.length - 1 : (radios.indexOf(radio) + direction + radios.length) % radios.length;
      event.preventDefault(); radios[index].click(); radios[index].focus();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
