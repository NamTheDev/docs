# util — Design system

## Bootstrap-first policy

All active web applications except MeditorD use Bootstrap 6 components and utilities before custom CSS. Archived projects are not retroactively modified. Do not combine Bootstrap 5 and 6 conventions or modify the framework distribution.

Consumer stylesheet order:

1. Local Bootstrap distribution.
2. Identical local copy of `util/design/config.css`.
3. Optional, narrowly scoped app CSS for documented exceptions.

Use native HTML and existing utilities before creating selectors or inline styles. Keep configuration synchronized from util.

## Visual standards

| Role | Standard |
| --- | --- |
| Default theme | Catppuccin Mocha |
| Light theme | Catppuccin Latte |
| Accent | Lavender |
| UI font | Roboto |
| Base size | 14px |
| Icons | Material Symbols Rounded |
| Density | Compact |
| Motion | None by default |
| Controls | rounded-5 (8px) |
| Cards | rounded-6 (10px) |
| Dialogs | rounded-7 (12px) |

Theme-aware semantic tokens keep color usage consistent. Use accessible labels, visible focus, responsive layout and meaningful status colors. Fixed-theme sites do not require a switch merely to signal their theme.

## Native theme signaling

Declare one matching color-scheme meta tag, set the root CSS color-scheme and Bootstrap data-bs-theme, and update them together when switching themes. Do not use darkreader-lock by default.

See the canonical [Design principles](https://github.com/NamTheDev/util/blob/main/design/DESIGN_PRINCIPLES.md) and [Theme signaling specification](https://github.com/NamTheDev/util/blob/main/formatting/THEME_SIGNAL.md).

## Source references

Reviewed against [util source](https://github.com/NamTheDev/util/tree/7b79f69ab7158afd7f8f74be02164ff27d188e29).

- [design/DESIGN_PRINCIPLES.md](https://github.com/NamTheDev/util/blob/7b79f69ab7158afd7f8f74be02164ff27d188e29/design/DESIGN_PRINCIPLES.md)
- [design/config.css](https://github.com/NamTheDev/util/blob/7b79f69ab7158afd7f8f74be02164ff27d188e29/design/config.css)
- [formatting/THEME_SIGNAL.md](https://github.com/NamTheDev/util/blob/7b79f69ab7158afd7f8f74be02164ff27d188e29/formatting/THEME_SIGNAL.md)
