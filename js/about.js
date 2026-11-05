// ============================================================
// Abdul Haseeb — About page script
// Animates skill meter bars filling in as they scroll into view.
// Loaded only on about.html.
// ============================================================

(function () {
  "use strict";

  var tracks = document.querySelectorAll(".skill-meter-track");
  if (!tracks.length) return;

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            window.setTimeout(function () {
              el.classList.add("is-filled");
            }, (i % 10) * 80);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -40px 0px" }
    );

    tracks.forEach(function (track) {
      observer.observe(track);
    });
  } else {
    tracks.forEach(function (track) {
      track.classList.add("is-filled");
    });
  }
})();
