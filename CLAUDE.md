# CLAUDE.md

Instructions for Claude Code when working in this repository.

## Project

A crossword generator website in vanilla HTML, CSS and JavaScript — no
frameworks, no build step, no dependencies. It is deployed with GitHub Pages
from the `main` branch root of
`https://github.com/dana21kimelman-oss/lab1crossword`.

Live site: https://dana21kimelman-oss.github.io/lab1crossword/

## First-time setup on a new computer

Walk the user through these steps, running the commands yourself where you can:

1. Check that git is installed: `git --version`.
2. Make sure the user has accepted the collaborator invitation from the repo
   owner (it arrives by email and at https://github.com/notifications). Without
   it, pushes fail with `403` / `Permission denied`.
3. Set the git identity if it is not already set:
   ```bash
   git config --global user.name "Their Name"
   git config --global user.email "their-github-email@example.com"
   ```
4. Set up GitHub authentication. Easiest is the GitHub CLI:
   ```bash
   gh auth login        # choose GitHub.com, HTTPS, "Login with a web browser"
   gh auth setup-git
   ```
   This is interactive — ask the user to run it themselves with `! gh auth login`.
   Without `gh`, a Personal Access Token (Settings → Developer settings →
   Personal access tokens, scope `repo`) can be used as the password on the
   first `git push`.
5. Clone and enter the repo:
   ```bash
   git clone https://github.com/dana21kimelman-oss/lab1crossword.git
   cd lab1crossword
   ```

## Day-to-day workflow

1. Always start by pulling the latest changes: `git pull --rebase origin main`.
2. Make the change. Keep it vanilla — do not add frameworks, bundlers, or
   `package.json`.
3. Test locally: `python3 -m http.server 8000`, then open
   http://localhost:8000.
4. Commit with a short, descriptive message and push:
   ```bash
   git add <files>
   git commit -m "Describe the change"
   git push origin main
   ```
5. GitHub Pages redeploys automatically; the live site updates within about a
   minute. Progress is visible under the repo's **Actions** tab.

## Rules

- Two people push to `main`. Pull before starting work and before pushing.
- If a push is rejected (`non-fast-forward`), run `git pull --rebase origin main`,
  resolve any conflicts with the user, then push again. Never `git push --force`.
- Ask the user before committing or pushing.
- Keep `.nojekyll` in the repo root — it makes Pages serve files as-is.
- All asset paths in `index.html` must stay relative (`styles.css`, not
  `/styles.css`), because the site is served from `/lab1crossword/`.
