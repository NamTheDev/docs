# MeditorD

A self-hosted Markdown editor and folder-based media archive. The Bun/TypeScript server persists documents, folders and media in SQLite. The interface retains its own design system and is exempt from util's Bootstrap-first visual requirements.

[Repository](https://github.com/NamTheDev/MeditorD) · [Design resources](https://github.com/NamTheDev/MeditorD/blob/main/RESOURCES.md)

## Installation

Install Bun and Git. The project has a Bun lockfile; use frozen installation for reproducibility.

```sh
git clone https://github.com/NamTheDev/MeditorD.git
cd MeditorD
bun install --frozen-lockfile
bun run index.ts
```

Open http://127.0.0.1:3000.

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `HOST` | 127.0.0.1 | HTTP bind address |
| `PORT` | 3000 | HTTP port |
| `ROOT` | ./public | Public asset directory |

Example: `PORT=3001 bun run index.ts` uses port 3001 on a POSIX shell.

The repository also supplies a Dockerfile based on `oven/bun:1`. It starts index.ts, exposes port 3000 and declares `/app/database` as a persistent volume. The image binds to 0.0.0.0. Preserve the database volume when replacing a container. This describes the existing image, not a hosted deployment.

## Usage

Home links to Editor, Archive and Database. Use Editor to write Markdown and save a document; use Archive to browse saved posts and media in folders. Database provides an organized view of stored items. Folders can be created, renamed and deleted.

Example document:

```md
# Session notes

## Tasks

- Record a draft
- Review the export

[Reference](https://example.org/)
```

Save it as a document, reopen it from Archive, then edit and save again. Use the folder explorer to group related items. Media and external URLs are supported by the document API; media bytes are stored on the server, not solely in the browser cache.

## Data and backups

The SQLite database is `database/meditord.sqlite`. It uses WAL mode and stores document records, media and metadata. The documents module provides document listing, lookup, folder creation, renaming, update and deletion. Media metadata and thumbnails have separate retrieval functions.

Use a consistent SQLite backup, or stop the server before copying its database directory. Do not copy only the main file while WAL writes are active. Preserve the current database before restoring a backup. Clearing browser data does not restore server documents.

## Architecture and development

| Path | Responsibility |
| --- | --- |
| `index.ts` | Bun HTTP server and route dispatch |
| `config.ts` | Host, port and public root |
| `functions/api/index.ts` | Document, share, thumbnail and media operations |
| `functions/database/documents.ts` | SQLite schema, records, media and revision state |
| `functions/render.ts` | Rendered pages and asset fingerprints |
| `public/js/document-api.js` | Client document requests |
| `public/js/`, `public/css/` | Editor, archive, database and shared UI |
| `public/sw.js` | Browser asset caching |

Markdown-it handles Markdown rendering. The server implements persistent document operations; the client uses fetch requests and FormData for media uploads.

### HTTP API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | /api/documents | List documents |
| POST | /api/documents | Create document or folder |
| GET, PUT, DELETE | /api/documents/{title} | Read, update/rename or delete |
| GET | /api/shared/{shareId} | Read shared document |
| GET | /api/media/{title} | Retrieve media |
| GET, HEAD, PUT | /api/media-thumbnail/{title} | Read or write thumbnail |

URL-encode document titles when using them in paths. The create endpoint accepts JSON for text-only documents and multipart FormData for media.

Example against a local test instance:

```sh
curl http://127.0.0.1:3000/api/documents
curl -X POST http://127.0.0.1:3000/api/documents \
  -H 'Content-Type: application/json' \
  -d '{"title":"Example","username":"","content":"# Example","url":""}'
curl http://127.0.0.1:3000/api/documents/Example
```

Use a disposable document title. The create request changes the database. Consult the API handler for update payloads, accepted media types and error behavior. The media endpoint implements range responses for partial content.

## Verification

```sh
bun test
```

The repository also includes UI verification. Check rendering, archive navigation, media retrieval and stored records when modifying related modules. Inspect the selected folder and Database view if an item appears missing; do not delete database files as a troubleshooting step.

## Source references

[package](https://github.com/NamTheDev/MeditorD/blob/main/package.json), [configuration](https://github.com/NamTheDev/MeditorD/blob/main/config.ts), [API](https://github.com/NamTheDev/MeditorD/blob/main/functions/api/index.ts), [database](https://github.com/NamTheDev/MeditorD/blob/main/functions/database/documents.ts), [Dockerfile](https://github.com/NamTheDev/MeditorD/blob/main/Dockerfile).
