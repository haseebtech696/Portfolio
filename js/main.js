// ============================================================
// Abdul Haseeb — Portfolio site script
// Shared across every page: mobile nav + scroll-reveal animation
// + thumbnail hover-gallery (project cards / portfolio cards)
// ============================================================

(function () {
  "use strict";

  // --- Mobile nav toggle ---
  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("navToggle");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close mobile menu when a nav link is clicked
    header.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Scroll reveal ---
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add("is-visible");
            }, (i % 6) * 70);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: no IntersectionObserver support
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // --- Thumbnail hover gallery ---
  // Works on any .project-card / .portfolio-card that contains a
  // .project-thumb / .portfolio-thumb with extra ".thumb-img.thumb-alt"
  // images and an optional ".thumb-gallery-dots" indicator row.
  // On hover it cycles through the alt images; on mouse-leave it resets
  // to the base cover image. Pure DOM/markup driven — no project data
  // needed here (see js/portfolio.js for the lightbox + filter logic).
  function initThumbGalleries(root) {
    var scope = root || document;
    var cards = scope.querySelectorAll(".project-card, .portfolio-card");

    cards.forEach(function (card) {
      if (card.dataset.galleryBound === "true") return;
      card.dataset.galleryBound = "true";

      var thumb = card.querySelector(".project-thumb, .portfolio-thumb");
      if (!thumb) return;

      var altImgs = Array.prototype.slice.call(
        thumb.querySelectorAll(".thumb-img.thumb-alt")
      );
      var dots = Array.prototype.slice.call(
        thumb.querySelectorAll(".thumb-gallery-dots .dot")
      );
      if (!altImgs.length) return;

      var idx = 0;
      var timer = null;
      var cycleMs = 1300;

      function show(i) {
        altImgs.forEach(function (img, n) {
          img.classList.toggle("is-active", n === i);
        });
        dots.forEach(function (d, n) {
          d.classList.toggle("is-active", n === i);
        });
      }

      function reset() {
        altImgs.forEach(function (img) {
          img.classList.remove("is-active");
        });
        dots.forEach(function (d) {
          d.classList.remove("is-active");
        });
      }

      card.addEventListener("mouseenter", function () {
        idx = 0;
        show(idx);
        clearInterval(timer);
        timer = setInterval(function () {
          idx = (idx + 1) % altImgs.length;
          show(idx);
        }, cycleMs);
      });

      card.addEventListener("mouseleave", function () {
        clearInterval(timer);
        reset();
      });

      // Keyboard/touch users: focus behaves like hover
      card.addEventListener("focusin", function () {
        idx = 0;
        show(idx);
      });
      card.addEventListener("focusout", function () {
        clearInterval(timer);
        reset();
      });
    });
  }

  initThumbGalleries();

  // Exposed so portfolio.js can re-run this after it renders/filters cards
  window.initThumbGalleries = initThumbGalleries;
})();