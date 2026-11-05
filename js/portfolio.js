// ============================================================
// Abdul Haseeb — Portfolio page script
// Project data + filter tabs + lightbox (full detail & gallery)
// Depends on js/main.js being loaded first (initThumbGalleries).
// ============================================================

(function () {
  "use strict";

  // ----------------------------------------------------------
  // Project data — single source of truth for the lightbox.
  // Card markup (image + teaser) lives directly in the HTML;
  // this feeds the "click for full detail" lightbox only.
  // Swap the `gallery` paths for real screenshots any time —
  // nothing else needs to change.
  // ----------------------------------------------------------
  var PROJECTS = {
    "youtube-automation-agent": {
      category: "ai",
      tone: "tone-mixed",
      catLabel: "AI Engineering",
      title: "AI YouTube Automation Agent",
      gallery: [
        "images/projects/youtube-automation-agent/cover.png",
        "images/projects/youtube-automation-agent/gallery-1.png",
        "images/projects/youtube-automation-agent/gallery-2.png",
        "images/projects/youtube-automation-agent/gallery-3.png"
      ],
      paragraphs: [
        "An AI-powered YouTube automation system designed to streamline the content creation process from idea generation to publishing. The system uses specialized AI agents to handle different stages of the workflow, reducing manual effort and creating a more consistent content production pipeline."
      ],
      bullets: [
        "AI-powered topic and content research",
        "Automated script generation and refinement",
        "AI voice-over generation",
        "Visual and video asset generation",
        "Automated video production and assembly",
        "Thumbnail and title generation",
        "YouTube SEO optimization",
        "Automated publishing workflow",
        "Content quality checks and review",
        "Modular multi-agent architecture for scalable automation"
      ],
      resultNote: "Result: a centralized AI workflow that turns a content idea into a structured, production-ready YouTube video while minimizing repetitive manual tasks.",
      tags: ["Python", "AI / LLMs", "APIs", "FFmpeg", "YouTube API"],
      links: [{ label: "GitHub", url: "https://github.com/haseebtech696", icon: "github" }]
    },

    "lead-qualification-system": {
      category: "automation",
      tone: "tone-blue",
      catLabel: "Workflow Automation",
      title: "AI-Powered Lead Qualification & Routing System",
      gallery: [
        "images/projects/lead-qualification-system/cover.jpeg",
        "images/projects/lead-qualification-system/gallery-1.jpeg",
        "images/projects/lead-qualification-system/gallery-2.jpeg",
        "images/projects/lead-qualification-system/gallery-3.jpeg"
      ],
      paragraphs: [
        "A fully automated lead qualification system built in n8n. The moment someone fills out a contact form, this automation takes over the entire process end to end — no human has to manually read, research, or sort a single lead."
      ],
      bullets: [
        "Verifies the email is real — catches typos and fake addresses instantly",
        "Automatically researches the lead's company: industry, size, location",
        "Checks the CRM to see if they're new, existing, or a VIP customer",
        "Scores the lead based on all of that data",
        "Routes them automatically: high-value leads get instant outreach and a booked meeting, medium-value leads go to a manager for quick approval, and everything else is logged and nurtured for later"
      ],
      resultNote: "Result: leads are verified, researched, scored and routed to the right next step automatically, with zero manual triage.",
      tags: ["n8n", "CRM Integration", "Lead Scoring", "Automation"],
      links: []
    },

    "behance-scraper": {
      category: "scraping",
      tone: "tone-violet",
      catLabel: "Web Scraping",
      title: "Behance Profile Scraper & Lead Generation",
      gallery: [
        "images/projects/behance-scraper/cover.png",
        "images/projects/behance-scraper/gallery-1.png"
      ],
      paragraphs: [
        "A Python-based web scraping project built to collect and organize professional designer and creative-industry data from Behance. The collected data is structured into a clean dataset usable for lead generation, market research, prospect discovery, competitor research, and creative-industry outreach."
      ],
      bullets: [
        "Profile name and Behance URL",
        "Professional headline, company and location",
        "Personal or company website",
        "LinkedIn, Instagram, Twitter, Facebook & Dribbble links",
        "Professional description",
        "Email and contact info when publicly available",
        "Project views, appreciations, followers and following"
      ],
      resultNote: "Use cases: lead generation, market research, prospecting, data collection, creative-industry research.",
      tags: ["Python", "Web Scraping", "Data Collection"],
      links: [{ label: "GitHub", url: "https://github.com/haseebtech696", icon: "github" }]
    }
  };

  var ICONS = {
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>'
  };

  document.addEventListener("DOMContentLoaded", function () {
    initFilters();
    initLightbox();

    // Deep link support: projects.html#slug opens that project directly
    if (window.location.hash) {
      var slug = window.location.hash.replace("#", "");
      if (PROJECTS[slug]) openLightbox(slug);
    }
  });

  // ----------------------------------------------------------
  // Filter tabs
  // ----------------------------------------------------------
  function initFilters() {
    var tabs = document.querySelectorAll(".filter-tab");
    var cards = document.querySelectorAll(".portfolio-card");
    var empty = document.querySelector(".portfolio-empty");
    if (!tabs.length || !cards.length) return;

    // Reveal cards already in view on load (mirrors .reveal behavior
    // used elsewhere on the site, but cards start filtered-in as "all").
    requestAnimationFrame(function () {
      cards.forEach(function (card, i) {
        setTimeout(function () {
          card.classList.add("is-shown");
        }, i * 60);
      });
    });

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");

        var filter = tab.dataset.filter;
        var visibleCount = 0;

        cards.forEach(function (card) {
          var match = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-shown", match);
          card.style.display = match ? "" : "none";
          if (match) visibleCount += 1;
        });

        if (empty) {
          empty.style.display = visibleCount === 0 ? "block" : "none";
        }
      });
    });
  }

  // ----------------------------------------------------------
  // Lightbox: full description + image filmstrip + prev/next
  // ----------------------------------------------------------
  var lightboxState = { slug: null, imgIndex: 0 };

  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    var backdrop = lightbox.querySelector(".lightbox-backdrop");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-arrow.prev");
    var nextBtn = lightbox.querySelector(".lightbox-arrow.next");

    document.querySelectorAll(".portfolio-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var slug = card.dataset.project;
        if (PROJECTS[slug]) openLightbox(slug);
      });
      // Cards act like buttons — support keyboard activation too
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    if (backdrop) backdrop.addEventListener("click", closeLightbox);
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", function () { stepImage(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stepImage(1); });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepImage(-1);
      if (e.key === "ArrowRight") stepImage(1);
    });
  }

  function openLightbox(slug) {
    var data = PROJECTS[slug];
    var lightbox = document.getElementById("lightbox");
    if (!data || !lightbox) return;

    lightboxState.slug = slug;
    lightboxState.imgIndex = 0;

    var media = lightbox.querySelector(".lightbox-media");
    media.className = "lightbox-media " + data.tone;

    var info = lightbox.querySelector(".lightbox-info");
    var descHtml = data.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    if (data.bullets && data.bullets.length) {
      descHtml +=
        '<ul style="margin:0.9rem 0 0;padding-left:1.1rem;color:var(--text-muted);font-size:0.92rem;">' +
        data.bullets.map(function (b) { return "<li style=\"margin-bottom:0.35rem;\">" + b + "</li>"; }).join("") +
        "</ul>";
    }
    if (data.resultNote) {
      descHtml += '<p style="margin-top:0.9rem;color:var(--text-faint);font-size:0.88rem;">' + data.resultNote + "</p>";
    }

    var tagsHtml = data.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    var linksHtml = data.links
      .map(function (l) {
        return (
          '<a href="' + l.url + '" target="_blank" rel="noopener">' +
          (ICONS[l.icon] || "") +
          l.label +
          "</a>"
        );
      })
      .join("");

    info.innerHTML =
      '<span class="cat-label">' + data.catLabel + "</span>" +
      "<h3>" + data.title + "</h3>" +
      descHtml +
      (data.tags.length ? '<div class="tech-tags">' + tagsHtml + "</div>" : "") +
      (linksHtml ? '<div class="project-links">' + linksHtml + "</div>" : "");

    renderLightboxImage();
    renderLightboxThumbs();

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    history.replaceState(null, "", "#" + slug);
  }

  function closeLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    history.replaceState(null, "", window.location.pathname);
  }

  function stepImage(delta) {
    var data = PROJECTS[lightboxState.slug];
    if (!data) return;
    var count = data.gallery.length;
    lightboxState.imgIndex = (lightboxState.imgIndex + delta + count) % count;
    renderLightboxImage();
    renderLightboxThumbs();
  }

  function renderLightboxImage() {
    var data = PROJECTS[lightboxState.slug];
    var media = document.querySelector("#lightbox .lightbox-media");
    if (!data || !media) return;

    var img = media.querySelector("img.lightbox-main-img");
    if (!img) {
      img = document.createElement("img");
      img.className = "lightbox-main-img";
      media.appendChild(img);
    }
    img.src = data.gallery[lightboxState.imgIndex];
    img.alt = data.title + " — image " + (lightboxState.imgIndex + 1);
  }

  function renderLightboxThumbs() {
    var data = PROJECTS[lightboxState.slug];
    var strip = document.querySelector("#lightbox .lightbox-thumbs");
    if (!data || !strip) return;

    strip.innerHTML = data.gallery
      .map(function (src, i) {
        var active = i === lightboxState.imgIndex ? " is-active" : "";
        return (
          '<button type="button" class="lightbox-thumb' + active + '" data-index="' + i + '" aria-label="View image ' + (i + 1) + '">' +
          '<img src="' + src + '" alt="">' +
          "</button>"
        );
      })
      .join("");

    strip.querySelectorAll(".lightbox-thumb").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lightboxState.imgIndex = parseInt(btn.dataset.index, 10);
        renderLightboxImage();
        renderLightboxThumbs();
      });
    });
  }
})();