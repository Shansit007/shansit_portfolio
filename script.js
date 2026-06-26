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
  initElectricBackground();
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

/* ---------------------------------------------------------
   6. Animated electric background
   Drifting glowing particles linked by current lines that
   brighten as particles approach each other.
   --------------------------------------------------------- */
function initElectricBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  // Skip the whole thing for users who prefer reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const ACCENT = "77, 141, 255"; // electric blue, as RGB for rgba()
  const LINK_DISTANCE = 140; // px within which particles connect
  let width, height, particles, animationId, arcs = [], frame = 0;

  // Build particles, scaling the count to screen size (and capping it)
  function createParticles() {
    const count = Math.min(Math.floor(width / 11), 130);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35, // slow horizontal drift
      vy: (Math.random() - 0.5) * 0.35, // slow vertical drift
      r: Math.random() * 2 + 1,
      // each particle flickers on its own rhythm for an electric feel
      flicker: Math.random() * Math.PI * 2,
    }));
  }

  // Match the canvas buffer to the viewport, accounting for retina screens
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  // Pick a node and a nearby node, and queue a short-lived lightning arc
  function spawnArc() {
    if (particles.length < 2) return;
    const a = particles[(Math.random() * particles.length) | 0];
    const near = particles.filter(
      (p) => p !== a && Math.hypot(p.x - a.x, p.y - a.y) < 280
    );
    if (!near.length) return;
    const b = near[(Math.random() * near.length) | 0];
    arcs.push({ a, b, life: 1 });
  }

  // Build a jagged poly-line between two points so the arc looks like lightning
  function boltPath(x1, y1, x2, y2) {
    const segments = 7;
    const nx = -(y2 - y1);
    const ny = x2 - x1;
    const len = Math.hypot(nx, ny) || 1;
    const pts = [[x1, y1]];
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const offset = 16 * (Math.random() - 0.5); // perpendicular jitter
      pts.push([
        x1 + (x2 - x1) * t + (nx / len) * offset,
        y1 + (y2 - y1) * t + (ny / len) * offset,
      ]);
    }
    pts.push([x2, y2]);
    return pts;
  }

  // Draw and age every active arc; jitter re-runs each frame so it flickers
  function drawArcs() {
    for (let i = arcs.length - 1; i >= 0; i--) {
      const arc = arcs[i];
      arc.life -= 0.08;
      if (arc.life <= 0) {
        arcs.splice(i, 1);
        continue;
      }
      const pts = boltPath(arc.a.x, arc.a.y, arc.b.x, arc.b.y);
      ctx.strokeStyle = `rgba(${ACCENT}, ${arc.life})`;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = `rgba(${ACCENT}, 0.9)`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw the connecting "current" lines first, behind the nodes
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK_DISTANCE) {
          // Closer particles = brighter line
          const alpha = (1 - dist / LINK_DISTANCE) * 0.75;
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw the glowing particles on top
    ctx.shadowColor = `rgba(${ACCENT}, 0.9)`;
    for (const p of particles) {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around the edges so the field never empties out
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Flicker the brightness slightly
      p.flicker += 0.05;
      const glow = 0.6 + Math.sin(p.flicker) * 0.4;

      ctx.shadowBlur = 14;
      ctx.fillStyle = `rgba(${ACCENT}, ${glow})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0; // reset so lines next frame aren't blurred

    // Fire a fresh lightning bolt roughly twice a second, then render arcs
    if (++frame % 35 === 0) spawnArc();
    drawArcs();

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    if (!animationId) draw();
  }
  function stop() {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // Pause when the tab isn't visible to save the user's battery
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  // Debounce resizes so we don't rebuild particles on every pixel
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  start();
}
