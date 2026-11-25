# keep — Architecture and development

## Source layout

- `src/main.ts`: application state, event handling, rendering and commands.
- `src/features/notes/`: note model, storage, selectors, note cards and backups.
- `src/ui/`: shell, icons and quick composer.
- `src/utils/format.ts`: formatting and escaping.
- `src/config.css`: canonical util configuration copy.
- `src/style.css`: application-specific layout.
- `scripts/build.ts`: Bun build producing `dist/`.

## Development

Bun 1.1 or later is required.

```sh
git clone https://github.com/NamTheDev/keep.git
cd keep
bun install
bun run dev
bun run typecheck
bun run build
```

The production output is published by GitHub Pages Actions; the Bun server is for development/testing, not note synchronization.

## Maintenance

Keep the existing storage keys and migration path stable. Do not make pure note helpers depend on the UI coordinator. Test editing, checklist updates, labels, archive/trash, search, backups, keyboard shortcuts, fixed dark theme and responsive navigation. The UI uses the shared Bootstrap 6/Catppuccin design; consult [util](../util/README.md) before changing tokens or styles.

## Source references

Reviewed against [keep source](https://github.com/NamTheDev/keep/tree/82446d05e21914f8d8dd2346e2efa0b33355c914).

- [docs/ARCHITECTURE.md](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/docs/ARCHITECTURE.md)
- [package.json](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/package.json)
- [scripts/build.ts](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/scripts/build.ts)
- [.github/workflows/deploy-pages.yml](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/.github/workflows/deploy-pages.yml)
- [.github/workflows/ui-verification.yml](https://github.com/NamTheDev/keep/blob/82446d05e21914f8d8dd2346e2efa0b33355c914/.github/workflows/ui-verification.yml)
