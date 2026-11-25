# util

The canonical shared design configuration and repository formatting standards for active NamTheDev projects. It is a resource repository, not a deployed application.

[Repository](https://github.com/NamTheDev/util)

## Installation

No runtime installation is required. Clone the repository to inspect or update shared resources:

```sh
git clone https://github.com/NamTheDev/util.git
cd util
python3 tests/verify_resources.py
```

## Usage

Use the canonical design and formatting files rather than copying their specifications into separate documentation. Changes to shared tokens originate in util and are synchronized to consumers. MeditorD is exempt from the Bootstrap-first design system; archived projects are not modified retroactively.

## Design system

Follow [design principles](https://github.com/NamTheDev/util/blob/main/design/DESIGN_PRINCIPLES.md) and [consumer integration](https://github.com/NamTheDev/util/blob/main/design/README.md). The active shared theme is Catppuccin Mocha dark with Lavender accent. Default UI font is Roboto; Profile and Docs retain intentional reading-identity exceptions.

Load the local Bootstrap 6 distribution first, then an identical copy of the canonical configuration, then only necessary application CSS.

```html
<meta name="color-scheme" content="dark">
<link rel="stylesheet" href="bootstrap.min.css">
<link rel="stylesheet" href="config.css">
<link rel="stylesheet" href="style.css">
```

Use `data-bs-theme="dark"` on the HTML root. Do not modify the Bootstrap distribution or introduce light mode. Use native utilities for generic spacing, borders, controls and alignment. Example: `class="btn btn-outline theme-secondary rounded-5"` for an outlined secondary button. See the [theme signaling specification](https://github.com/NamTheDev/util/blob/main/formatting/THEME_SIGNAL.md).

For a local checkout of Profile alongside util, synchronize configuration from the parent directory:

```sh
cp util/design/config.css profile/config.css
cmp util/design/config.css profile/config.css
```

Other consumers use `keep/src/config.css`, `clipboard/public/config.css` and `docs/assets/config.css`. Keep the copyright notices embedded in the configuration.

## Formatting and verification

Canonical resources:

- [README format](https://github.com/NamTheDev/util/blob/main/formatting/README_FORMAT.md)
- [AI disclosure](https://github.com/NamTheDev/util/blob/main/formatting/AI_DISCLOSURE.md)
- [Commit format](https://github.com/NamTheDev/util/blob/main/formatting/COMMIT_FORMAT.md)
- [Commit format note](https://github.com/NamTheDev/util/blob/main/commit_message_format.txt)

Root README headings: project title, AI Disclaimer, Introduction, Resources and License. The disclosure must describe actual AI use and link from README. Use the canonical validators.

Example commit message:

```text
Fix: Correct navigation focus

25-11-2026

- Restore keyboard focus when closing the drawer.
- Add a browser regression check.
```

Use the actual date of the commit. Passing a validation workflow does not configure branch protection; requiring status checks is a separate repository setting.

## Architecture and development

| Path | Responsibility |
| --- | --- |
| `design/config.css` | Canonical tokens and Bootstrap variable mapping |
| `design/DESIGN_PRINCIPLES.md` | Design and implementation policy |
| `formatting/` | Documentation, theme, disclosure and commit standards |
| `commit_message_format.txt` | Canonical commit-format note |
| `.github/workflows/` | Automated checks |
| `tests/verify_resources.py` | Shared resource validation |

The repository no longer contains the deployment dashboard. No Pages publishing workflow is needed for the shared files.

## Source references

Reviewed against [e296b84](https://github.com/NamTheDev/util/tree/e296b84e0e55a560af9be7d47bdc361a53e53192). Consult the live canonical links above for current standards.
