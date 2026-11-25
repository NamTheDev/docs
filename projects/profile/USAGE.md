# Profile — Usage

## Reading the site

Select a page in the left navigation. Use the Contents tree to jump to sections. The search field filters page titles and descriptions; it is not a full-text search. On mobile, open the navigation drawer or use the article's Contents disclosure.

The Projects article groups creative works, software and archived projects. GitHub cards link to source code, commits, stars, forks and issues. YouTube entries link to the original videos.

## Editing content

- Edit `pages/ABOUT.md` for the introduction.
- Edit `pages/PROJECTS.md` for the Projects lead.
- Edit individual files in `pages/projects/creative-works/`, `software/` or `archived-projects/`.
- Register new article fragments in the ordered `parts` array in `manifest.json`.

Keep third-person descriptions neutral. Preserve first-person statements verbatim as italicized Markdown quotations inside double quotation marks. Do not attribute generated prose to the author.

## Catalogue updates

`data/sources.json` lists public channel and repository identifiers. The daily catalogue workflow fetches public GitHub metadata and recent YouTube uploads. It preserves captured video entries, and can optionally use an Actions secret named `YOUTUBE_API_KEY` to paginate through the public uploads history. Do not expose this secret in client code.

When data is unavailable, existing snapshots and original links remain the fallback. The website is not a real-time statistics dashboard.

## Source references

Reviewed against [profile source](https://github.com/NamTheDev/profile/tree/9ce49f787d6b7e3d98ddd30096c388ec8c429772).

- [manifest.json](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/manifest.json)
- [data/sources.json](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/data/sources.json)
- [scripts/sync_catalogue.py](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/scripts/sync_catalogue.py)
- [docs/DESIGN.md](https://github.com/NamTheDev/profile/blob/9ce49f787d6b7e3d98ddd30096c388ec8c429772/docs/DESIGN.md)
