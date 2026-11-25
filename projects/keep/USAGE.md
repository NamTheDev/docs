# keep — User guide

## Creating and organizing notes

Use the quick composer to create a note or checklist. Open an existing note to edit it. Pin important notes, assign labels and colors, duplicate entries or archive them when no longer needed. The sidebar provides All Notes, Reminders, Archive, Recycle Bin and custom labels.

Search appears next to the current view title. Switch between grid and list views and manage appearance in Settings. On mobile, the sidebar opens as a drawer.

## Reminders and keyboard shortcuts

Reminders are in-app; the source guide does not promise operating-system notifications.

| Shortcut | Action |
| --- | --- |
| Ctrl+K | Search |
| Ctrl+Enter | Save |
| N (outside text fields) | Create a note |

## Backups and privacy

Export a JSON backup using the sidebar. Import restores notes through the app's import operation; keep a separate copy before importing or restoring sample data. Notes and settings stay in the browser's localStorage. Clearing site data may permanently erase them. There is no account or cross-device sync.

If notes appear missing, check the current view, search filters, archive, recycle bin and browser profile before clearing storage.

## Source references

Reviewed against [keep source](https://github.com/NamTheDev/keep/tree/82446d05e21914f8d8dd2346e2efa0b33355c914).

- [docs/PROJECT_GUIDE.md](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/docs/PROJECT_GUIDE.md)
- [src/features/notes/data.ts](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/src/features/notes/data.ts)
- [src/features/notes/backup.ts](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/src/features/notes/backup.ts)
