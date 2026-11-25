# MeditorD — Architecture and development

## Architecture

- `index.ts`: Bun HTTP server, routing, asset delivery, rendering and API dispatch.
- `functions/api/index.ts`: document, shared item and media endpoints.
- `functions/database/documents.ts`: SQLite schema, document operations and media storage.
- `functions/render.ts`: page rendering and asset fingerprints.
- `public/js/`: editor, archive, database, dialog and other browser behavior.
- `public/css/`: separate global, feature and page styles.
- `public/sw.js`: browser caching.

The document database is `database/meditord.sqlite`, using SQLite WAL. The media layer includes hashes, sizes and thumbnails. The frontend uses Markdown-it, while the server handles persistent data and media responses.

## API overview

| Method | Endpoint |
| --- | --- |
| GET | `/api/documents` |
| POST | `/api/documents` |
| GET, PUT, DELETE | `/api/documents/<identifier>` |
| GET | `/api/shared/<identifier>` |
| GET | `/api/media/<identifier>` |

This is a route overview, not a complete request/response contract; inspect the API handler and `public/js/document-api.js` before adding integrations.

## Development

Install the dependencies using the project's Bun lockfile and run the test suite:

```sh
bun install --frozen-lockfile
bun test
```

The repository's UI verification workflow includes browser checks. When changing functionality, verify Markdown rendering, media playback, archive navigation, keyboard focus and preservation of stored documents. Keep the established MeditorD design and upstream font/asset notices.

See [source resources](https://github.com/NamTheDev/MeditorD/blob/main/RESOURCES.md) and [third-party notices](https://github.com/NamTheDev/MeditorD/blob/main/THIRD_PARTY_NOTICES.md).

## Source references

Reviewed against [MeditorD source](https://github.com/NamTheDev/MeditorD/tree/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec).

- [index.ts](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/index.ts)
- [functions/api/index.ts](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/functions/api/index.ts)
- [functions/database/documents.ts](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/functions/database/documents.ts)
- [package.json](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/package.json)
- [public/css/README.md](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/public/css/README.md)
- [.github/workflows/ui-verification.yml](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/.github/workflows/ui-verification.yml)
