# Shansit Suman — Portfolio

Personal portfolio website. Pure HTML, CSS, and vanilla JavaScript — no
frameworks, no build step. Works directly on GitHub Pages.

**Live:** https://shansit007.github.io/shansit_portfolio

## Features

- Dark, minimal, premium theme (Notion / Linear / Vercel feel)
- Animated electric background — drifting glowing particles, "current" links,
  and jagged lightning arcs, drawn on a canvas with vanilla JS
- Hero typewriter cycling through roles
- Fade-in-up on scroll (IntersectionObserver), active nav highlight, smooth scroll
- Fixed navbar that turns solid on scroll, with a mobile hamburger menu
- Fully responsive, mobile-first
- Respects `prefers-reduced-motion` and pauses the background when the tab is hidden

## File structure

```
.
├── index.html     # Markup — all sections, semantic HTML5
├── style.css      # Dark theme, layout, responsive rules, animations
├── script.js      # Typewriter, scroll reveal, navbar, electric background
├── resume.pdf     # Linked from the Resume button in the hero
├── profile.jpg    # Profile photo shown in the About section
└── README.md
```

## Run locally

Open `index.html` in a browser, or serve it so relative paths behave like
production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy / update (GitHub Pages)

The site is served from the `Shansit007/shansit_portfolio` repo on the `main`
branch. To publish changes:

```bash
git add .
git commit -m "Describe your change"
git push
```

GitHub Pages rebuilds automatically in about a minute. Hard-refresh
(`Cmd+Shift+R`) to bypass the browser cache.

**Pages setting:** repo → Settings → Pages → Source: *Deploy from a branch* →
Branch **main** → **/(root)**.

> Want the cleaner root URL `https://shansit007.github.io` instead? Rename the
> repo to `Shansit007.github.io`, then update the remote with
> `git remote set-url origin https://github.com/Shansit007/Shansit007.github.io.git`.

## Tuning the background

Both knobs live in `script.js` → `initElectricBackground`, plus one in CSS:

- **Overall intensity:** `#bg-canvas { opacity }` in `style.css` (currently `0.85`)
- **Particle density:** the `Math.min(Math.floor(width / 11), 130)` cap
- **Lightning frequency:** `frame % 35` — a larger number means rarer bolts

## Notes

- Colors and fonts are CSS variables at the top of `style.css` (`:root`) — edit
  them in one place to re-theme.
- No server-side code, no environment variables, no dependencies to install.
