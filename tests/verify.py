"""Validate manifest, Markdown cross-links and repository standards."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
pages = json.loads((root / "manifest.json").read_text())
assert len(pages) == 8
slugs = {p["slug"] for p in pages}
aliases = [alias for p in pages for alias in p.get("aliases", {})]
assert len(set(aliases)) == len(aliases) and not slugs.intersection(aliases)
assert len({p["slug"] for p in pages}) == len(pages)
assert len({p["file"] for p in pages}) == len(pages)
assert pages[0]["slug"] == "home"
registered = {(root / p["file"]).resolve() for p in pages}
for path in registered:
    assert path.is_relative_to(root) and path.is_file(), path
    content = path.read_text()
    assert content.startswith("# "), path
    assert len(re.findall(r"^# .+$", re.sub(r"```[\s\S]*?```", "", content), re.M)) == 1, path
    for target in re.findall(r"\]\(([^)\s]+\.md)(?:#[^)]*)?\)", content):
        if "://" not in target and not target.startswith("//"):
            resolved = (path.parent / target).resolve()
            assert resolved in registered, (path, target)
for page in pages:
    content = (root / page["file"]).read_text()
    headings = re.findall(r"^## (.+)$", re.sub(r"```[\s\S]*?```", "", content), re.M)
    anchors = {re.sub(r"\s+", "-", re.sub(r"[^\w\s-]", "", h.lower().strip())) for h in headings}
    assert set(page.get("aliases", {}).values()) <= anchors, page["slug"]
readme = (root / "README.md").read_text()
assert re.findall(r"^## (.+)$", readme, re.M) == ["AI Disclaimer", "Introduction", "Resources", "License"]
assert "NamTheDev" in (root / "LICENSE").read_text().splitlines()[2]
assert sorted(p.name for p in (root / "assets").glob("*.css")) == ["bootstrap.min.css", "config.css", "docs.css", "shell.css"]
print(f"Verified {len(pages)} Markdown pages and repository structure.")
