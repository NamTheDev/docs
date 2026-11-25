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

The website is a fullscreen application at every viewport size: the header stays visible, the body never scrolls, and the article and navigation panes scroll independently. Use Profile's minimal reading identity (Source Sans 3, flat surfaces, blue links, colored Markdown headings, and narrow page/contents rails), with the canonical util configuration unchanged. The article fills the available width; never reintroduce a centered maximum-width reading column. The contents rail collapses into an inline section list below 1181px, and the pages rail becomes a drawer at 760px and below. Keep the fixed dark theme. Application-specific CSS is limited to reading identity and pane geometry.
