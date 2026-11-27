# clipboard

A temporary shared text vault. The static frontend is hosted on GitHub Pages; cross-device sharing requires a separate Node.js/SQLite API. A room code permits reading and copying, while the owner's token permits modifications.

[Website](https://namthedev.github.io/clipboard/) · [Repository](https://github.com/NamTheDev/clipboard)

## Installation

Install Node.js 22.13 or later and Git. For a local frontend and backend:

```sh
git clone https://github.com/NamTheDev/clipboard.git
cd clipboard
npm install
npm run icons
npm start
```

Open http://127.0.0.1:3000. Verify the API with:

```sh
curl http://127.0.0.1:3000/api/health
```

The API health response includes an ok field.

## Usage

Create a vault, choose its expiration, and copy its six-character ID or link. On a second device, join using that ID. The owner can add snippets with New item or Paste text, edit and delete items, and delete the vault. Guests can read and copy.

For example, create a vault titled "Transfer", add an item titled "Command" containing `git status`, and join from another browser. Select the item and use Copy text. Do not expect the guest browser to have owner permissions.

Vaults expire after 24 hours or seven days. Settings control default expiry and refresh intervals (off, 5, 15 or 30 seconds). Defaults are 24 hours and 5 seconds. The theme is fixed dark.

A vault ID is an access code, not a password. Anyone with the ID can read its contents. Vault contents are not end-to-end encrypted. Do not store secrets or sensitive records. The owner token stays in the creator browser and is excluded from shared links.

## Configuration

| Setting | Default or purpose |
| --- | --- |
| `HOST` | 127.0.0.1 |
| `PORT` | 3000 |
| `DATA_DIR` | data/ relative to server root |
| `ALLOWED_ORIGIN` | Allowed cross-origin frontend; empty by default |
| `CLIPBOARD_API_BASE` | GitHub repository variable for Pages API origin |

The Pages workflow generates public/config.js from the repository variable, falling back to the configured Railway origin in the workflow. Set an HTTPS origin without a trailing /api path because client requests already include /api. The local server uses its own origin when no API base is configured. Keep the backend's SQLite data volume persistent. The configuration in source is not proof of current external service availability.

## Architecture and development

| Path | Responsibility |
| --- | --- |
| `public/index.html`, `public/app.js` | Static UI and application state |
| `public/js/core/` | API, room codes, preferences and clipboard operations |
| `public/js/ui/` | DOM, dialogs and sidebar |
| `server.mjs` | HTTP routes, validation, SQLite and asset serving |
| `server/security.mjs` | Room codes, owner authorization and rate limiting |
| `scripts/prepare-icons.mjs` | Favicon preparation |
| `tests/server.test.mjs` | Local integration tests |

The backend stores rooms and items in SQLite. Room codes omit ambiguous characters and are normalized to uppercase; hyphens are removed. The server compares SHA-256 owner-token digests with timing-safe equality and uses per-peer request throttling. The API limits a vault to 100 items, item content to 16000 characters and request bodies to 100000 bytes.

### HTTP API

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | /api/health | Public |
| POST | /api/rooms | Public creation |
| GET | /api/rooms/{code} | Valid room code |
| POST | /api/rooms/{code}/items | Owner |
| PATCH, DELETE | /api/rooms/{code}/items/{id} | Owner |
| DELETE | /api/rooms/{code} | Owner |

Create a disposable room on a local test server:

```sh
curl -X POST http://127.0.0.1:3000/api/rooms \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test vault","duration":"24h"}'
```

The 201 response contains room and ownerToken. Copy the returned room.code and ownerToken into shell variables for the following examples; do not publish the token.

```sh
CODE='<returned code>'
TOKEN='<returned ownerToken>'

curl "http://127.0.0.1:3000/api/rooms/$CODE"
curl -X POST "http://127.0.0.1:3000/api/rooms/$CODE/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Example","content":"Hello world"}'
```

Read requests do not return the owner token or hash. Unauthorized item modifications return 403; invalid input can return 400. A deleted room returns 404. The integration tests demonstrate create, read, patch and delete operations, including preservation of text whitespace.

## Verification

```sh
npm run check
npm test
```

CI also runs Chromium UI verification and Pages smoke tests. Verify API availability, the configured origin and browser clipboard permission when troubleshooting. Preserve preferences and ownership semantics when changing the client. Maintain the local design configuration.

## Source references

[server](https://github.com/NamTheDev/clipboard/blob/main/server.mjs), [security](https://github.com/NamTheDev/clipboard/blob/main/server/security.mjs), [API tests](https://github.com/NamTheDev/clipboard/blob/main/tests/server.test.mjs), [Pages workflow](https://github.com/NamTheDev/clipboard/blob/main/.github/workflows/deploy-pages.yml).
