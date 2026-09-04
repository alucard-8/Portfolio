# WASSIM — portfolio

My portfolio site. It's a personal page where I show my gamedev work, my 2d art, and a few ways to reach me.

The whole thing is plain HTML, CSS and a little JS. No frameworks, no build step, no npm install. Open `index.html` and it just runs.

## What's on it

- **Intro page** — name, the little floating star, and a "find me on" note with my links.
- **Gamedev** — three project post-its (each one opens up) plus a couple of stickers.
- **2D art** — a gallery of drawings pinned up like polaroids on the wall. Click one to view it bigger.
- **Doodle tool** — on the art page there's a pencil button. It lets you scribble over the screen: six colors, a custom color wheel, three line sizes, an eraser and a clear button. Mainly there because I think it's fun.
- **Contact** — Discord, Instagram and the info popup.

Once you're on the phone the panels just scale down as one group to fit, so nothing overlaps or falls off the page.

## Running it

- Just double-click `index.html`, or serve the folder with anything, e.g. `python -m http.server`.

## Project layout

```
index.html        the whole site, markup + the interactive JS
styles.css        all the styling
cursor.js         small custom cursor behaviour
images/           artwork, panel backgrounds, stickers, icons
  covers/         gamedev cover images
  drawing/        the art gallery images
fonts/            font files
```

## Notes

- All images are local to the repo, so it works offline once downloaded.
- Hosted on GitHub Pages from the `main` branch.