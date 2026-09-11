"""Re-seeds a Protobox workspace's knowledge base with this template's demo
content, matching the category/tag shape lib/brain.ts and lib/content.ts
read (site-config, site-section, site-page, blog — tag "published" gates
what each collection query returns). Deletes every existing kind=page item
except "Brand Visuals" first, so re-running is idempotent.

Usage: PROTOBOX_API_URL=... PROTOBOX_API_KEY=... python3 scripts/reseed-demo-brain.py
"""
import json, os, sys, urllib.request, urllib.error

API = os.environ.get("PROTOBOX_API_URL")
KEY = os.environ.get("PROTOBOX_API_KEY")
if not API or not KEY:
    sys.exit("Set PROTOBOX_API_URL and PROTOBOX_API_KEY before running this script.")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def call(method, path, body=None, params=None):
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

# --- 1. list existing kind=page items, delete everything except "Brand Visuals" ---
status, body = call("GET", "/api/v1/knowledge", params={"kind": "page", "limit": "100"})
assert status == 200, (status, body)
items = body.get("items") or body.get("data") or []
print(f"Found {len(items)} existing kind=page items")
for it in items:
    if it["title"] == "Brand Visuals":
        print(f"  keep: {it['title']} ({it['id']})")
        continue
    s, b = call("DELETE", f"/api/v1/knowledge/{it['id']}")
    print(f"  delete {it['title']} ({it['id']}) -> {s}")

def create(title, content, category, tags):
    body = {"source": "text", "kind": "page", "title": title, "content": content, "category": category, "tags": tags}
    s, b = call("POST", "/api/v1/knowledge", body=body)
    ok = s in (200, 201)
    print(f"  create [{category}] {title!r} -> {s} {'OK' if ok else b}")
    return b

# --- 2. site-config: full site.json manifest ---
with open(f"{REPO}/site.json") as f:
    site_manifest = json.load(f)
create("Site Config", json.dumps(site_manifest, indent=2), "site-config", ["published"])

# --- 3. site-section: all 10 home/*.json blobs, 4 with BRAINSPEC markers ---
section_dir = f"{REPO}/content/sections/home"
markers = {
    "hero.json": lambda d: d.update(headline="BRAINSPEC-HERO " + d["headline"]),
    "features.json": lambda d: d["items"].__setitem__(0, {**d["items"][0], "title": "BRAINSPEC-FEATURE " + d["items"][0]["title"]}),
    "offer.json": lambda d: d.update(heading="BRAINSPEC-PRICING " + d["heading"]),
    "testimonial.json": lambda d: d["items"].__setitem__(0, {**d["items"][0], "quote": "BRAINSPEC-TESTIMONIAL " + d["items"][0]["quote"]}),
}
for fname in sorted(os.listdir(section_dir)):
    if not fname.endswith(".json"):
        continue
    ref = f"home/{fname[:-5]}"
    with open(f"{section_dir}/{fname}") as f:
        data = json.load(f)
    if fname in markers:
        markers[fname](data)
    data["ref"] = ref
    create(f"Section: {ref}", json.dumps(data, indent=2), "site-section", ["published"])

# --- 4. site-page: about.md verbatim ---
with open(f"{REPO}/content/pages/about.md") as f:
    about_raw = f.read()
create("About", about_raw, "site-page", ["published"])

# --- 5. blog: 3 published + 1 unpublished, full frontmatter verbatim ---
blog_files = {
    "pos-report-is-not-your-pl.md": ["published"],
    "prime-cost-worksheet.md": ["published"],
    "three-numbers-monday-morning.md": ["published"],
    "year-end-checklist-draft.md": [],  # draft, no "published" tag -> excluded from tag=published query
}
for fname, tags in blog_files.items():
    with open(f"{REPO}/content/blog/{fname}") as f:
        raw = f.read()
    create(fname, raw, "blog", tags)

print("Reseed complete.")
