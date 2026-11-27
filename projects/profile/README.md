# Profile

A static personal archive for creative works and software projects. Markdown articles, project metadata and external media are presented in a three-column reading interface.

[Website](https://namthedev.github.io/profile/) · [Repository](https://github.com/NamTheDev/profile)

## Installation

Requirements: Git, Python 3 (for the example local server) and a modern browser. No npm build is required to serve the site.

```sh
git clone https://github.com/NamTheDev/profile.git
cd profile
python3 -m http.server 8000
```

Open http://localhost:8000. Use HTTP rather than opening index.html directly because the site fetches its manifest and Markdown files.

## Usage

About and Projects are the two main pages. The left rail selects pages; the right Contents rail jumps to headings. On small screens, the page rail opens as a drawer and Contents is an inline disclosure. The header marquee loops automatically and supports manual horizontal scrolling in either direction. Its title is not a navigation link.

Projects contains creative work, YouTube upload links, official Bandcamp track embeds and GitHub repository cards. Video thumbnails link to the original videos; the site does not host the videos. The two Bandcamp players are May The War End and My Time. Archived project source may remain in the repository without being included in the active article.

## Editing content

Edit `pages/ABOUT.md` for the introduction or `pages/PROJECTS.md` for the Projects lead. Individual project fragments live in `pages/projects/creative-works/` and `pages/projects/software/`. The ordered `parts` array in `manifest.json` determines how the Projects article is assembled.

For example, the Projects entry uses the following shape (abbreviated; retain the other existing parts):

```json
{
  "slug": "projects",
  "title": "Projects",
  "file": "pages/PROJECTS.md",
  "parts": [
    "pages/projects/creative-works/index.md",
    "pages/projects/software/index.md"
  ]
}
```

Add new fragments to that array in the desired order. Use Markdown heading levels consistently because headings generate the Contents tree and anchor IDs. Keep neutral third-person descriptions separate from the author's verbatim first-person quotations. Do not invent personal statements or statistics.

## Architecture and development

| Path | Responsibility |
| --- | --- |
| `index.html` | Page shell, metadata, stylesheet and script loading |
| `manifest.json` | Page slugs, source files and ordered fragments |
| `script.js` | Routing, Markdown fetching, sanitization and Contents tree |
| `js/marquee.js` | Native-scroll looping header |
| `js/projects.js` | Repository cards, video links and Bandcamp players |
| `data/sources.json` | Public repository names and YouTube channel IDs |
| `data/catalogue.json` | Captured public metadata |
| `scripts/sync_catalogue.py` | Catalogue refresh |
| `sw.js` | Versioned local asset cache |

Marked parses Markdown and DOMPurify sanitizes the rendered HTML. Query-based URLs select pages, for example `?page=projects`. The browser fetches public catalogue data when available and falls back to the deployed snapshot.

The Refresh project catalogue workflow runs daily, on source changes or manually. It queries public GitHub metadata. Without a YouTube API key it uses the public Atom feed (recent uploads only); the optional repository Actions secret `YOUTUBE_API_KEY` enables pagination of the public uploads playlist. A successful refresh replaces the corresponding list; failures retain its last successful snapshot. Never put the API key in client-side JavaScript.

To refresh locally, run:

```sh
python3 scripts/sync_catalogue.py
```

Review the resulting catalogue changes before committing.

The stylesheet order is Bootstrap, the local design configuration, then local CSS. Profile intentionally retains Source Sans 3, colored headings, blue links and its reading layout. The service worker caches local assets under a versioned key; external fonts and Markdown libraries may still require network access. Increment the cache version when changing precached assets.

## Verification

```sh
node --check script.js
node --check js/marquee.js
node --check js/projects.js
node --check sw.js
node --test tests/service-worker.test.cjs
npm install --no-save --ignore-scripts playwright@1.56.1 marked@15.0.12 dompurify@3.2.6
npx playwright install chromium
node --test tests/ui.test.cjs
```

GitHub Actions checks navigation, media markup, responsive layout, marquee behavior and cache handling. Pages publishes the static repository content.

## Source references

[manifest](https://github.com/NamTheDev/profile/blob/main/manifest.json), [design](https://github.com/NamTheDev/profile/blob/main/docs/DESIGN.md), [catalogue refresh](https://github.com/NamTheDev/profile/blob/main/scripts/sync_catalogue.py), [verification](https://github.com/NamTheDev/profile/blob/main/.github/workflows/code-verification.yml).
