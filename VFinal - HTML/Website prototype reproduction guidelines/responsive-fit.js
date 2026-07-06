/* responsive-fit.js — universal "fit fixed canvas to any screen".
   Any element with [data-fit-width="1440"] is scaled DOWN with CSS zoom so the
   whole design fits the viewport width on tablets/phones (no horizontal scroll),
   and is never scaled up past 1 on large screens (it just centers via margin:auto).
   Uses `zoom` (not `transform`) on purpose: it reflows layout so page height stays
   correct AND keeps position:fixed overlays (e.g. the mobile menu) pinned to the
   real viewport. Drop-in: <script src="responsive-fit.js"></script> + the attribute. */
(function () {
  function fit(el) {
    var dw = parseFloat(el.getAttribute('data-fit-width')) || 1440;
    var avail = document.documentElement.clientWidth || window.innerWidth;
    var z = Math.min(1, avail / dw);
    el.style.zoom = z;
  }
  function fitAll() {
    var els = document.querySelectorAll('[data-fit-width]');
    for (var i = 0; i < els.length; i++) fit(els[i]);
  }
  window.addEventListener('resize', fitAll, { passive: true });
  window.addEventListener('orientationchange', fitAll);
  window.addEventListener('load', fitAll);
  if (document.readyState !== 'loading') fitAll();
  else document.addEventListener('DOMContentLoaded', fitAll);
  // DC content mounts asynchronously — re-fit for a short window until it appears.
  var tries = 0;
  var iv = setInterval(function () { fitAll(); if (++tries > 24) clearInterval(iv); }, 150);
})();
