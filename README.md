# Crossword Generator

A crossword generator website in vanilla HTML, CSS and JavaScript — no
frameworks, no build step — deployed with GitHub Pages.

Currently it shows a filled 15×15 puzzle with Across and Down clues, a
tropical island theme, automatic clue numbering, keyboard entry, and
Check / Reveal / Clear buttons.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | Styles (light/dark aware) |
| `script.js` | Puzzle answers and clues, numbering, keyboard input, check/reveal |
| `.nojekyll` | Tells GitHub Pages to serve files as-is, without Jekyll |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages

1. Create an empty repository on GitHub (no README, no .gitignore).
2. Add it as a remote and push:

   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

3. In the repository, go to **Settings → Pages**, set
   **Source** to *Deploy from a branch*, **Branch** to `main` and folder to
   `/ (root)`, then save.
4. After a minute the site is live at
   `https://<user>.github.io/<repo>/`.

Every later push to `main` redeploys automatically.
