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
    root.querySelectorAll(SELECTOR).forEach(function (el) {
      if (el.hasAttribute("data-no-tooltip")) return;
      if (!el.dataset.tooltipSource) {
        var label = el.getAttribute("aria-label") || el.getAttribute("title");
        if (!label) return;
        el.dataset.tooltipSource = label;
        if (el.hasAttribute("title")) el.removeAttribute("title");
      }
      if (visibleText(el)) el.removeAttribute("data-tooltip");
      else el.setAttribute("data-tooltip", el.dataset.tooltipSource);
    });
  }

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.className = "os-tooltip";
    tip.setAttribute("role", "tooltip");
    tip.id = "osTooltipBubble";
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
    clearTimeout(hideTimer);
    var bubble = ensureTip();
    bubble.textContent = text;
    bubble.classList.add("is-visible");
    place(target);
    target.setAttribute("aria-describedby", bubble.id);
    activeTarget = target;
  }

  function hide() {
    if (!tip || !activeTarget) return;
    tip.classList.remove("is-visible");
    activeTarget.removeAttribute("aria-describedby");
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
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "class"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-sidebar"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
