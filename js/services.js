// ============================================================
// Abdul Haseeb — Services page script
// Staggered blur-to-clear reveal for service tiles, and the
// "Learn more" expand/collapse detail on each card.
// Loaded only on services.html.
// ============================================================

(function () {
  "use strict";

  // --- Staggered tile reveal ---
  var tiles = document.querySelectorAll(".service-tile");

  if (tiles.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var i = Array.prototype.indexOf.call(tiles, el);
              window.setTimeout(function () {
                el.classList.add("is-shown");
              }, (i % 8) * 90);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );

      tiles.forEach(function (tile) {
        observer.observe(tile);
      });
    } else {
      tiles.forEach(function (tile) {
        tile.classList.add("is-shown");
      });
    }
  }

  // --- Learn more expand/collapse ---
  var toggles = document.querySelectorAll(".tile-more");

  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-target");
      var detail = document.getElementById(targetId);
      if (!detail) return;

      var isOpen = detail.getAttribute("data-open") === "true";
      detail.setAttribute("data-open", isOpen ? "false" : "true");
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      btn.firstChild.textContent = isOpen ? "Learn more " : "Show less ";
    });
  });
})();
