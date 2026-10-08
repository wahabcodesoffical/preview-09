/* US AIR AND HEATING LLC — demo concept interactions
   - Mobile nav toggle
   - Sticky header state
   - GSAP scroll reveals (graceful if CDN fails)
   - Demo quote form (non-functional by design)
*/
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Demo quote form (does NOT send data anywhere) ---------- */
  var form = document.getElementById("quote-form");
  var notice = document.getElementById("form-notice");
  if (form && notice) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo only — no backend, no data collection
      notice.hidden = false;
      notice.setAttribute("tabindex", "-1");
      notice.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      notice.focus({ preventScroll: true });
    });
  }

  /* ---------- GSAP animations ---------- */
  var hasGsap = typeof window.gsap !== "undefined";
  var root = document.documentElement;

  if (!hasGsap || prefersReduced) {
    // Content stays fully visible without animation.
    root.classList.add("no-anim");
    return;
  }

  root.classList.add("js-anim");

  var hasTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Hero intro — staggered rise */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-hero]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, startAt: { y: 36 } });

  /* Gentle float on the rating badge */
  var badge = document.querySelector(".hero__badge");
  if (badge) {
    gsap.to(badge, {
      y: -8,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  }

  /* Scroll reveals */
  if (hasTrigger) {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
      );
    });

    /* Subtle parallax on hero visual */
    var heroVisual = document.querySelector(".hero__visual");
    if (heroVisual && window.innerWidth >= 900) {
      gsap.to(heroVisual, {
        y: 40,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
      });
    }
  } else {
    // GSAP core loaded but not ScrollTrigger — reveal everything.
    gsap.to("[data-reveal]", { opacity: 1, duration: 0.6 });
  }
})();
