# clipboard — Architecture and development

## Architecture

The frontend consists of native browser modules in `public/`. `public/app.js` coordinates room state and commands. Core modules handle HTTP, clipboard access, preferences and room codes. UI modules handle DOM, dialogs and navigation. The API lives in `server.mjs`, backed by SQLite; `server/security.mjs` handles access codes, owner authorization, throttling and cleanup.

## Development

Requires Node.js 22.13 or later.

```sh
git clone https://github.com/NamTheDev/clipboard.git
cd clipboard
npm install
npm run icons
npm run check
npm test
npm start
```

The server defaults to `127.0.0.1:3000` and serves the API and allowed frontend files. The API health route is `/api/health`.

## Deployment configuration

| Setting | Purpose |
| --- | --- |
| CLIPBOARD_API_BASE | Repository variable configuring Pages frontend API URL |
| ALLOWED_ORIGIN | API origin allowed for cross-origin requests |
| HOST, PORT | Server binding |
| DATA_DIR | Persistent SQLite data directory |

The project guide documents a Railway-hosted backend and GitHub Pages frontend. Preserve the persistent data volume and avoid placing credentials in public JavaScript. Verify the actual live deployment before relying on its availability.

Run backend tests, UI checks and the Pages smoke test when modifying routes, storage or deployment settings. Keep preference keys, API routes and owner-token behavior compatible. Follow [util design standards](../util/README.md).

## Source references

Reviewed against [clipboard source](https://github.com/NamTheDev/clipboard/tree/4cd2a320344e84f09b2ce4d6e20e23806ac2a9b0).

- [docs/ARCHITECTURE.md](https://github.com/NamTheDev/clipboard/blob/4cd2a320344e84f09b2ce4d6e20e23806ac2a9b0/docs/ARCHITECTURE.md)
- [docs/PROJECT_GUIDE.md](https://github.com/NamTheDev/clipboard/blob/4cd2a320344e84f09b2ce4d6e20e23806ac2a9b0/docs/PROJECT_GUIDE.md)
- [package.json](https://github.com/NamTheDev/clipboard/blob/4cd2a320344e84f09b2ce4d6e20e23806ac2a9b0/package.json)
- [server.mjs](https://github.com/NamTheDev/clipboard/blob/4cd2a320344e84f09b2ce4d6e20e23806ac2a9b0/server.mjs)
- [.github/workflows/deploy-pages.yml](https://github.com/NamTheDev/clipboard/blob/4cd2a320344e84f09b2ce4d6e20e23806ac2a9b0/.github/workflows/deploy-pages.yml)
