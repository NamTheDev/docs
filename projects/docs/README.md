# docs

Central documentation for active NamTheDev projects. Each repository has one continuous Markdown guide with a Contents rail. Source code remains in its original repository.

[Website](https://namthedev.github.io/docs/) · [Repository](https://github.com/NamTheDev/docs)

## Installation

No build step is needed to run the static site locally. Install Git, Python 3 and a modern browser.

```sh
git clone https://github.com/NamTheDev/docs.git
cd docs
python3 -m http.server 8000
```

Open http://localhost:8000. Markdown and the manifest are fetched over HTTP. Marked and DOMPurify are version-pinned CDN dependencies; the Bootstrap distribution and design configuration are locally vendored.

## Usage

Select a repository in the left navigation to read its overview, installation, usage, architecture and verification instructions on one page. Contents links jump to headings in the current guide. On mobile, open the Pages drawer and the inline Contents disclosure.

The header title is plain text. The marquee uses the same native scrolling implementation as Profile, with automatic movement, hover pause, manual bidirectional looping and reduced-motion support.

## Editing

Each project guide is stored in `projects/<repository>/README.md`. The home page is `pages/HOME.md`. The manifest is a flat array; add a single entry for each documented repository.

Example manifest entry:

```json
{
  "slug": "keep-readme",
  "title": "keep",
  "file": "projects/keep/README.md",
  "aliases": {
    "keep-usage": "usage",
    "keep-development": "architecture-and-development"
  }
}
```

Keep old slugs as aliases when consolidating documents. A legacy query such as `?page=keep-usage` opens the Usage section of the keep guide. Use relative links between registered Markdown files; external source links should point to the relevant repository or source file on the main branch.

Verify commands, configuration names and examples against source files. State limitations rather than inventing behavior. Keep explanatory prose concise and preserve project-specific terminology.

## Architecture and development

| Path | Responsibility |
| --- | --- |
| `index.html` | Fullscreen shell and navigation regions |
| `manifest.json` | Flat page index and legacy aliases |
| `assets/site.js` | Routing, navigation, Markdown rendering and Contents |
| `assets/marquee.js` | Native-scroll ticker |
| `assets/config.css` | Local design configuration |
| `assets/docs.css` | Reading identity and fullscreen geometry |
| `projects/`, `pages/` | Markdown documentation |
| `tests/` | Manifest/link and browser verification |

The renderer parses Markdown with Marked and sanitizes HTML with DOMPurify. Relative Markdown links are translated to query-based page URLs. Heading IDs are generated from heading text. The article and navigation panes scroll independently inside a full-viewport shell; the document body does not scroll. Below 1181px the Contents rail becomes inline, and at 760px and below the page rail becomes a drawer.

Use Bootstrap utilities and maintain the local design configuration. Keep Source Sans 3, colored headings and blue links as intentional reading-identity exceptions. Do not reintroduce a maximum-width article or a light-mode switch.

## Verification and publishing

```sh
python3 tests/verify.py
node --check assets/site.js
node --check assets/marquee.js
npm install --no-save --ignore-scripts playwright@1.56.1 marked@15.0.12 dompurify@3.2.6
npx playwright install chromium
node --test tests/browser.test.cjs
```

The verification workflow checks manifest paths, relative Markdown links, canonical configuration equality and browser behavior. The GitHub Pages deployment workflow requires commit format, AI disclosure and documentation verification to pass before uploading the static artifact.

## Source references

[Renderer](https://github.com/NamTheDev/docs/blob/main/assets/site.js) · [Manifest](https://github.com/NamTheDev/docs/blob/main/manifest.json) · [Verification](https://github.com/NamTheDev/docs/blob/main/.github/workflows/verify.yml) · [Deployment](https://github.com/NamTheDev/docs/blob/main/.github/workflows/deploy-pages.yml)
