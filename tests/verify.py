"""Validate manifest, Markdown cross-links and repository standards."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
groups = json.loads((root / "manifest.json").read_text())
pages = [page for group in groups for page in group["pages"]]
assert len({p["slug"] for p in pages}) == len(pages)
assert len({p["file"] for p in pages}) == len(pages)
assert pages[0]["slug"] == "home"
registered = {(root / p["file"]).resolve() for p in pages}
for path in registered:
    assert path.is_relative_to(root) and path.is_file(), path
    content = path.read_text()
    assert content.startswith("# "), path
    for target in re.findall(r"\]\(([^)\s]+\.md)(?:#[^)]*)?\)", content):
        if "://" not in target and not target.startswith("//"):
            resolved = (path.parent / target).resolve()
            assert resolved in registered, (path, target)
readme = (root / "README.md").read_text()
assert re.findall(r"^## (.+)$", readme, re.M) == ["AI Disclaimer", "Introduction", "Resources", "License"]
assert "NamTheDev" in (root / "LICENSE").read_text().splitlines()[2]
assert sorted(p.name for p in (root / "assets").glob("*.css")) == ["bootstrap.min.css", "config.css", "docs.css"]
print(f"Verified {len(pages)} Markdown pages and repository structure.")
