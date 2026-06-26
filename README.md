# Shansit Suman — Portfolio

Personal portfolio website. Pure HTML, CSS, and vanilla JavaScript — no
frameworks, no build step. Works directly on GitHub Pages.

## File structure

```
.
├── index.html     # Markup — all sections, semantic HTML5
├── style.css      # Dark theme, layout, responsive rules, animations
├── script.js      # Typewriter, scroll reveal, navbar, mobile menu
├── resume.pdf     # (add your own — the Resume button links here)
└── README.md
```

## Run locally

Just open `index.html` in a browser. Or serve it (so relative paths behave
exactly like production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

This is a **user site**, served from the root of `shansit007.github.io`.

1. **Create the repo** — on the `Shansit007` account, make a new public repo
   named exactly:

   ```
   Shansit007.github.io
   ```

2. **Push these files** to the `main` branch (files must sit at the repo root,
   not inside a subfolder):

   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/Shansit007/Shansit007.github.io.git
   git push -u origin main
   ```

3. **Enable Pages** — go to **Settings → Pages**, set **Source** to
   *Deploy from a branch*, branch **main**, folder **/ (root)**, then **Save**.

4. Wait ~1 minute. The site goes live at:

   ```
   https://shansit007.github.io
   ```

## Notes

- Add your resume as `resume.pdf` in the root, or change the link in the hero
  section of `index.html` (the `[Resume]` button).
- Colors and fonts are CSS variables at the top of `style.css` (`:root`) — edit
  them in one place to re-theme.
- No server-side code, no environment variables, no dependencies to install.
