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
| Theme | Catppuccin Mocha (dark only) |
| Accent | Lavender |
| UI font | Roboto |
| Base size | 14px |
| Icons | Material Symbols Rounded |
| Density | Compact |
| Motion | None by default |
| Controls | rounded-5 (8px) |
| Cards | rounded-6 (10px) |
| Dialogs | rounded-7 (12px) |

Theme-aware semantic tokens keep color usage consistent. Use accessible labels, visible focus, responsive layout and meaningful status colors. Active apps use a fixed dark theme without appearance switches.

## Native theme signaling

Declare one matching color-scheme meta tag, set the root CSS color-scheme and Bootstrap data-bs-theme, with dark values. Do not use darkreader-lock by default.

See the canonical [Design principles](https://github.com/NamTheDev/util/blob/main/design/DESIGN_PRINCIPLES.md) and [Theme signaling specification](https://github.com/NamTheDev/util/blob/main/formatting/THEME_SIGNAL.md).

## Source references

Reviewed against [util source](https://github.com/NamTheDev/util/tree/4a27d54fd523d768c4be3d0b352265648df53616).

- [design/DESIGN_PRINCIPLES.md](https://github.com/NamTheDev/util/blob/4a27d54fd523d768c4be3d0b352265648df53616/design/DESIGN_PRINCIPLES.md)
- [design/config.css](https://github.com/NamTheDev/util/blob/4a27d54fd523d768c4be3d0b352265648df53616/design/config.css)
- [formatting/THEME_SIGNAL.md](https://github.com/NamTheDev/util/blob/4a27d54fd523d768c4be3d0b352265648df53616/formatting/THEME_SIGNAL.md)
