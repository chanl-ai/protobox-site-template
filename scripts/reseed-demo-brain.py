"""Re-seeds a Protobox workspace's knowledge base with this template's demo
content, matching the two-species shape lib/brain.ts / lib/content.ts /
lib/site.ts / lib/themes.ts read:

  - ONE site-spec doc (folder "site", kind=page, tag=published): the full
    site.json manifest shape with every "home" section's content INLINED
    onto its manifest entry (no "ref" keys, no per-section knowledge items).
  - Prose pages as individual markdown items with full frontmatter: the
    "about" page (folder "site") and blog posts (folder "site/blog", 3
    published + 1 unpublished/draft — no "published" tag, so it never
    matches a tag=published read).
  - ONE brand recipe (folder "brand", kind=page, tag=published): a preset
    JSON blob in the same shape as presets/*.json.

Deletes every previously-seeded demo item first (this dev workspace holds
nothing else under kind=page — verified via GET /knowledge?kind=page before
writing this script), so re-running is idempotent.

Usage: PROTOBOX_API_URL=... PROTOBOX_API_KEY=... python3 scripts/reseed-demo-brain.py
"""
import json, os, sys, urllib.request, urllib.error

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        sys.exit(f"Set {name} before running this script.")
    return value


API = require_env("PROTOBOX_API_URL")
KEY = require_env("PROTOBOX_API_KEY")


def call(method: str, path: str, body=None, params=None):
    url = f"{API}{path}"
    if params:
        qs = "&".join(f"{k}={v}" for k, v in params.items())
        url += f"?{qs}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("X-API-Key", KEY)
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


def parse_frontmatter(raw: str) -> dict:
    """Flat `key: "value"` frontmatter only — enough for home.md/about.md,
    which never nest. Blog posts (nested author/faqs) are uploaded verbatim
    and parsed on the TS side by gray-matter instead."""
    if not raw.startswith("---"):
        return {}
    end = raw.index("---", 3)
    data = {}
    for line in raw[3:end].strip().splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        data[key.strip()] = value.strip().strip('"')
    return data


# --- 1. resolve/create the three folders ---
def ensure_folder(name: str) -> str:
    status, body = call("GET", "/api/v1/knowledge/folders", params={"name": name})
    assert status == 200, (status, body)
    existing = (body.get("data") or {}).get("folders") or body.get("folders") or []
    match = next((f for f in existing if f["name"].lower() == name.lower()), None)
    if match:
        folder_id = match.get("id") or match["_id"]
        print(f"  folder {name!r} exists -> {folder_id}")
        return folder_id
    status, body = call("POST", "/api/v1/knowledge/folders", body={"name": name})
    assert status in (200, 201), (status, body)
    folder = body["data"]["folder"]
    folder_id = folder.get("id") or folder["_id"]
    print(f"  folder {name!r} created -> {folder_id}")
    return folder_id


print("Ensuring folders...")
FOLDER_IDS = {name: ensure_folder(name) for name in ("brand", "site", "site/blog")}

# --- 2. delete every existing kind=page item (this workspace holds only demo content there) ---
status, body = call("GET", "/api/v1/knowledge", params={"kind": "page", "limit": "100"})
assert status == 200, (status, body)
items = body.get("items") or body.get("data") or []
print(f"Found {len(items)} existing kind=page items")
for it in items:
    s, b = call("DELETE", f"/api/v1/knowledge/{it['id']}")
    print(f"  delete {it['title']!r} ({it['id']}) -> {s}")


def create(title: str, content: str, folder_name: str, tags: list[str]):
    body = {
        "source": "text",
        "kind": "page",
        "title": title,
        "content": content,
        "folderId": FOLDER_IDS[folder_name],
        "tags": tags,
    }
    s, b = call("POST", "/api/v1/knowledge", body=body)
    ok = s in (200, 201)
    print(f"  create [{folder_name}] {title!r} -> {s} {'OK' if ok else b}")
    return b


# --- 3. site-spec: site.json + every home/*.json section inlined, 4 BRAINSPEC markers ---
with open(f"{REPO}/site.json") as f:
    site_manifest = json.load(f)

with open(f"{REPO}/content/pages/home.md") as f:
    home_frontmatter = parse_frontmatter(f.read())

home_page = site_manifest["pages"]["home"]
home_page["meta"] = {
    "title": home_frontmatter["title"],
    "description": home_frontmatter["description"],
}

section_dir = f"{REPO}/content/sections/home"
markers = {
    "hero.json": lambda d: d.update(headline="BRAINSPEC-HERO " + d["headline"]),
    "features.json": lambda d: d["items"].__setitem__(
        0, {**d["items"][0], "title": "BRAINSPEC-FEATURE " + d["items"][0]["title"]}
    ),
    "offer.json": lambda d: d.update(heading="BRAINSPEC-PRICING " + d["heading"]),
    "testimonial.json": lambda d: d["items"].__setitem__(
        0, {**d["items"][0], "quote": "BRAINSPEC-TESTIMONIAL " + d["items"][0]["quote"]}
    ),
}
sections_by_ref = {}
for fname in sorted(os.listdir(section_dir)):
    if not fname.endswith(".json"):
        continue
    ref = f"home/{fname[:-5]}"
    with open(f"{section_dir}/{fname}") as f:
        data = json.load(f)
    if fname in markers:
        markers[fname](data)
    sections_by_ref[ref] = data

for entry in home_page["sections"]:
    ref = entry["content"]
    entry["content"] = sections_by_ref[ref]

# Only "home" ships to the brain — demo-b always reads the file manifest
# (app/demo-b/page.tsx calls getSiteManifest(), never resolveSiteManifest()).
site_spec = {
    "theme": site_manifest["theme"],
    "mode": site_manifest["mode"],
    "header": site_manifest["header"],
    "footer": site_manifest["footer"],
    "pages": {"home": home_page},
}
print("Seeding site-spec...")
create("Site Spec", json.dumps(site_spec, indent=2), "site", ["published"])

# --- 4. about.md verbatim, in folder "site" alongside the spec ---
print("Seeding about page...")
with open(f"{REPO}/content/pages/about.md") as f:
    about_raw = f.read()
create("About", about_raw, "site", ["published"])

# --- 5. blog: 3 published + 1 unpublished, full frontmatter verbatim ---
print("Seeding blog posts...")
blog_files = {
    "pos-report-is-not-your-pl.md": ["published"],
    "prime-cost-worksheet.md": ["published"],
    "three-numbers-monday-morning.md": ["published"],
    "year-end-checklist-draft.md": [],  # draft, no "published" tag -> excluded from tag=published reads
}
for fname, tags in blog_files.items():
    with open(f"{REPO}/content/blog/{fname}") as f:
        raw = f.read()
    create(fname, raw, "site/blog", tags)

# --- 6. brand recipe: presets/foundry.json verbatim ---
print("Seeding brand recipe...")
with open(f"{REPO}/presets/foundry.json") as f:
    recipe = f.read()
create("Recipe", recipe, "brand", ["published"])

print("Reseed complete.")
