# MeditorD — Usage

## Documents and media

The Home page provides navigation to the Editor, Archive and Database views. Use the Editor to compose Markdown documents and save changes. The Archive presents saved posts and media in a gallery with a folder explorer. The Database view provides an organized view of stored items.

Create folders to group related documents, and use the available rename and delete operations to maintain the archive. Review changes before deleting material.

## Data and backups

Documents, folders and media are stored in the project's SQLite database under `database/`. The database includes document metadata and media bytes; the browser's cached media is not a substitute for the database.

Maintain a separate backup of the database using a consistent SQLite backup procedure. Restore backups only after preserving the current database. Do not assume that clearing browser caches restores or deletes stored server documents.

## Troubleshooting

If a saved item is missing, inspect the selected folder and the Database view before changing storage files. If the Markdown renderer is unavailable, review the installed dependencies and application logs. A browser refresh can resolve stale interface assets, but it does not repair a database.

For visual references and attribution, see [MeditorD resources](https://github.com/NamTheDev/MeditorD/blob/main/RESOURCES.md).

## Source references

Reviewed against [MeditorD source](https://github.com/NamTheDev/MeditorD/tree/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec).

- [public/home.html](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/public/home.html)
- [public/edit.html](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/public/edit.html)
- [public/archive.html](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/public/archive.html)
- [public/database.html](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/public/database.html)
- [functions/database/documents.ts](https://github.com/NamTheDev/MeditorD/blob/233bd7cc1eaec1f7895dbc4456e2789d8efed9ec/functions/database/documents.ts)
