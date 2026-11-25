# docs — Maintenance

## Editing

Edit Markdown under `projects/` or `pages/`. Register new pages in `manifest.json` and maintain relative Markdown links. The source repositories remain authoritative.

## Local development

```sh
git clone https://github.com/NamTheDev/docs.git
cd docs
python3 -m http.server 8000
```

Open http://localhost:8000. Marked and DOMPurify are version-pinned; keep HTML sanitization intact.

## Design

Follow [util's design principles](https://github.com/NamTheDev/util/blob/main/design/DESIGN_PRINCIPLES.md) and [native dark theme specification](https://github.com/NamTheDev/util/blob/main/formatting/THEME_SIGNAL.md). Load local Bootstrap, identical util configuration, then minimal app CSS. Profile's Source Sans 3, blue links and colored headings are intentional reading-identity exceptions.

**Fullscreen at every viewport:** fixed header, independently scrolling panes, no document scroll or maximum-width article. Contents collapses below 1181px; pages becomes a drawer at 760px and below.

## Verification and publishing

Run `python3 tests/verify.py` and `node --check assets/site.js`. Browser CI checks routing, dark mode and fullscreen behavior. Keep `assets/config.css` identical to util. Follow [repository formatting](https://github.com/NamTheDev/util/tree/main/formatting). Pages uses GitHub Actions and requires successful validation.
