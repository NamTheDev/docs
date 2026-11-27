# keep

A local-first browser notes application with text notes, checklists, labels, reminders, archive, recycle bin and JSON backups. No account, hosted database or synchronization service is required.

[Website](https://namthedev.github.io/keep/) · [Repository](https://github.com/NamTheDev/keep)

## Installation

The public website requires no installation. For development, install Bun 1.1 or later and Git.

```sh
git clone https://github.com/NamTheDev/keep.git
cd keep
bun install
bun run dev
```

Open http://localhost:3000. The development server listens on 0.0.0.0 and defaults to port 3000; use `PORT=3001 bun run dev` to change the port.

Build the static production files:

```sh
bun run typecheck
bun run build
NODE_ENV=production bun run start
```

The production server serves dist/. GitHub Pages publishes the build output. Neither server provides note synchronization.

## Usage

Create a note or checklist from the quick composer. Open an existing note to edit it. Use pinning, colors and labels to organize items; switch between grid and list views. The sidebar contains All Notes, Reminders, Archive, Recycle Bin and custom labels. Search narrows the current view. On mobile, use the sidebar drawer.

Example: create a checklist titled "Recording session", add "Set input gain", "Record take" and "Export WAV", assign a Work label and pin it. Mark completed items individually. Archive the note when finished; use Recycle Bin to restore a trashed note before permanently deleting it.

| Shortcut | Action |
| --- | --- |
| Ctrl+K | Search |
| Ctrl+Enter | Save |
| N outside text fields | Create note |

Reminders store a selected date and time and appear in the Reminders view. They are in-app dates, not operating-system notifications. The theme is fixed dark; note colors are independent of the app theme.

## Data and backups

The app persists data in browser localStorage under `notekeep98-v1`. It can read the legacy `keep-recreation-v1` key. Data belongs to the current browser profile and origin. A local development instance and the public website do not share storage.

Export a JSON backup from the sidebar. Exports use version 2 with app, exportedAt, notes and labels fields, and a filename of the form `keep-YYYY-MM-DD.json`.

Illustrative empty backup:

```json
{
  "version": 2,
  "app": "keep",
  "exportedAt": "2026-11-25T00:00:00.000Z",
  "notes": [],
  "labels": ["Work"]
}
```

Use actual exported files for restoration. Import merges incoming notes into existing notes and merges labels; the import code handles ID collisions. Export a backup before importing or restoring sample data. Clearing site data can erase notes permanently.

If an item appears missing, inspect the current view, search, labels, Archive, Recycle Bin and browser profile before changing storage.

## Architecture and development

| Path | Responsibility |
| --- | --- |
| `src/main.ts` | State, rendering, commands, dialogs and persistence |
| `src/features/notes/data.ts` | Note types, storage keys, normalization and sample data |
| `src/features/notes/` | Selectors, cards and JSON backup helper |
| `src/ui/` | Shell, icons and composer |
| `src/utils/format.ts` | Formatting and escaping |
| `src/config.css` | Local design configuration |
| `scripts/build.ts` | Browser bundle and static assets |
| `server.ts` | Bun development/production file server |

A note has an ID, title, body, checklist flag, items, color, pinned/archived/trashed flags, labels, optional reminder, and timestamps. Checklist items have ID, text and checked fields. Normalization limits incoming checklist items to 200, body text to 100000 characters and note labels to 30 entries. Loading caps stored notes at 5000 and global labels at 200. These are source normalization limits, not guaranteed browser storage capacity.

The build bundles src/main.ts into dist/app.js with Bun, copies styles and the theme signal, generates a Lucide SVG favicon, and fingerprints CSS and JavaScript references. The UI uses Material Symbols Rounded and Bootstrap 6; maintain the local design tokens when changing the interface.

## Verification

Run typecheck and build using the commands above. The UI workflow exercises editing, checklists, labels, backups, responsive navigation and dark-theme behavior. Preserve the storage keys and normalization compatibility when modifying the model.

## Source references

[guide](https://github.com/NamTheDev/keep/blob/main/docs/PROJECT_GUIDE.md), [data model](https://github.com/NamTheDev/keep/blob/main/src/features/notes/data.ts), [backup](https://github.com/NamTheDev/keep/blob/main/src/features/notes/backup.ts), [build](https://github.com/NamTheDev/keep/blob/main/scripts/build.ts), [server](https://github.com/NamTheDev/keep/blob/main/server.ts).
