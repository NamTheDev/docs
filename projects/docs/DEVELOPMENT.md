# docs — Maintenance

## Organization

Each project has its own directory under `projects/`. The overview links to task-specific documentation. `manifest.json` defines the navigation groups and page paths; adding a file to the manifest makes it available on the website.

## Editing

1. Read the current source and canonical util standards.
2. Edit the relevant Markdown file and add source links.
3. Register new pages in the manifest and update overview links.
4. Run the repository verification checks.
5. Commit using the canonical commit-message format.

## Local website

```sh
git clone https://github.com/NamTheDev/docs.git
cd docs
python3 -m http.server 8000
```

Open http://localhost:8000. The website fetches only registered Markdown pages and sanitizes rendered content. Bootstrap and the shared configuration are locally vendored. Marked and DOMPurify are version-pinned dependencies loaded from a CDN.

## Publishing and verification

The GitHub Pages workflow deploys the static site. In repository Settings → Pages, select GitHub Actions as the source if Pages has not yet been enabled.

The source verification workflow checks manifest paths, internal Markdown links and JavaScript syntax. Browser checks verify navigation, theme signaling and responsive layout. Keep the design configuration identical to util and do not add unnecessary custom CSS.

## Layout

The desktop site uses the full viewport, with independent scrolling for navigation and the reading pane. At the mobile breakpoint, navigation collapses above the article and the document scrolls normally. Bootstrap utilities control spacing and layout without application-specific CSS. Theme and Markdown navigation remain independent of the layout.
