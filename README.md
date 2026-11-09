# WASSIM — portfolio

My portfolio site. It's a personal page where I show my gamedev work, my 2d art, and a few ways to reach me.

The whole thing is plain HTML, CSS and a little JS. No frameworks, no build step, no npm install. Open `index.html` and it just runs.

## What's on it

A retro "WASSIM.OS" look: cream + electric blue, pixel fonts, window chrome, loading bars and warning dialogs.

- **Boot screen** — quick loading bar (once per visit, skippable).
- **Hero** — big pixel name, fanned cards of featured work.
- **Games** — Unseen, Rogue Protocol, Pokado (itch.io).
- **Design** — Behance case studies + a gallery with "load more".
- **Game UI** and **2D art** — galleries with a lightbox (keyboard + swipe).
- **About + contact** — Discord (tap to copy), Instagram, Behance.

Fully responsive (grid/flow layout, no fixed positioning), and respects reduced-motion.

## Running it

Double-click `index.html`, or serve the folder, e.g. `python -m http.server`.

## Project layout

```
index.html   markup
styles.css   all styling (responsive breakpoints at the bottom)
app.js       galleries, lightbox, boot screen, menu
images/      artwork (gallery lists live at the top of app.js)
legacy/      the previous version of the site
```

Fonts come from Google Fonts (Pixelify Sans, Silkscreen, VT323, Space Mono); icons from pixelarticons via jsDelivr.
