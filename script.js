/* =========================================================
   Shansit Suman — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
  initNavbarScrollState();
  initMobileMenu();
  initScrollReveal();
  initActiveNavHighlight();
});

/* ---------------------------------------------------------
   1. Hero typewriter — cycles through roles forever
   --------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById("typewriter");
  if (!target) return;

  const phrases = [
    "Full Stack Developer",
    "AI/ML Engineer",
    "Strategic Builder",
    "Problem Solver",
  ];

  const TYPE_SPEED = 80; // ms per character typed
  const ERASE_SPEED = 45; // ms per character erased
  const HOLD_TIME = 1600; // ms to hold a full phrase

  let phraseIndex = 0;
  let charIndex = 0;
  let isErasing = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!isErasing) {
      // Typing forward
      target.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isErasing = true;
        return setTimeout(tick, HOLD_TIME);
      }
      return setTimeout(tick, TYPE_SPEED);
    }

    // Erasing
    target.textContent = current.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isErasing = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    setTimeout(tick, ERASE_SPEED);
  }

  tick();
}

/* ---------------------------------------------------------
   2. Navbar: transparent -> solid once the user scrolls
   --------------------------------------------------------- */
function initNavbarScrollState() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  onScroll(); // set correct state on load
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------
   3. Mobile hamburger menu
   --------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const icon = toggle.querySelector("i");

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (icon) icon.className = "fa-solid fa-bars";
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (icon) icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  // Close the menu after tapping any link
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* ---------------------------------------------------------
   4. Fade-in-up on scroll via IntersectionObserver
   --------------------------------------------------------- */
function initScrollReveal() {
  const sections = document.querySelectorAll("main .section");

  // Tag each section so the CSS hidden state applies
  sections.forEach((section) => section.classList.add("reveal"));

  // Fallback: if IntersectionObserver is unavailable, just show everything
  if (!("IntersectionObserver" in window)) {
    sections.forEach((s) => s.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------
   5. Highlight the nav link for the section in view
   --------------------------------------------------------- */
function initActiveNavHighlight() {
  const navLinks = document.querySelectorAll(".nav-link");
  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  // Map section id -> its nav link
  const linkById = {};
  navLinks.forEach((link) => {
    const id = link.getAttribute("href").replace("#", "");
    linkById[id] = link;
  });

  const sections = document.querySelectorAll("main section[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkById[entry.target.id];
        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    // Trigger when a section sits in the upper-middle of the viewport
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}
