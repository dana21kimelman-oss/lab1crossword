# Lab 1

A vanilla HTML, CSS and JavaScript webpage — no frameworks, no build step —
deployed with GitHub Pages.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | Styles (light/dark aware) |
| `script.js` | Page behaviour |
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
