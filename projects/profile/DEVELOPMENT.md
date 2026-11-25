# Profile — Development and architecture

## Source layout

| File | Responsibility |
| --- | --- |
| `index.html` | Shared page shell |
| `script.js` | Manifest loading, Markdown rendering, navigation and Contents tree |
| `js/projects.js` | Project metadata cards and uploads lists |
| `data/catalogue.json` | Public metadata snapshot |
| `scripts/sync_catalogue.py` | Catalogue refresh |
| `sw.js` | Versioned offline asset cache |
| `bootstrap.min.css`, `config.css`, `style.css` | Framework, canonical tokens and app-specific styling |

Markdown is parsed with Marked and sanitized with DOMPurify. The project uses a local Bootstrap 6 distribution and the shared util configuration, plus documented exceptions for reading-column geometry, typography and marquee animation.

## Local development

Clone the repository and serve the root using a static HTTP server (rather than opening the HTML as a file). For example:

```sh
git clone https://github.com/NamTheDev/profile.git
cd profile
python3 -m http.server 8000
```

Open http://localhost:8000 in a supported browser.

## Verification

```sh
node --check script.js
node --check js/projects.js
node --check sw.js
node --test tests/service-worker.test.cjs
npm install --no-save --ignore-scripts playwright@1.56.1 marked@15.0.12 dompurify@3.2.6
npx playwright install chromium
node --test tests/ui.test.cjs
```

GitHub Actions run the source and UI checks. Update cache versions when changing cached content and test navigation, responsive layout, catalogue rendering and offline fallback. The optional Python catalogue refresh reads environment credentials, not browser code.

## Source references

Reviewed against [profile source](https://github.com/NamTheDev/profile/tree/9ce49f787d6b7e3d98ddd30096c388ec8c429772).

- [.github/workflows/code-verification.yml](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/.github/workflows/code-verification.yml)
- [sw.js](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/sw.js)
- [script.js](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/script.js)
- [js/projects.js](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/js/projects.js)
