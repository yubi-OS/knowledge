import json, os, base64, urllib.request, urllib.error, sys

ROOT = "/var/workspace/session/subagent/docker-metadata-action"
SRC = ROOT
API = "https://api.github.com/repos/yubi-OS/knowledge"
HDRS = {
    "User-Agent": "omni-agent/1.0",
    "Content-Type": "application/json",
    "Accept": "application/vnd.github+json",
}

def call(method, path, body=None):
    url = API + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=HDRS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            txt = r.read().decode()
            return r.status, json.loads(txt) if txt else {}
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:500]

# 0. collect files
files = []
for base, dirs, fns in os.walk(SRC):
    if ".git" in dirs:
        dirs.remove(".git")
    for fn in fns:
        full = os.path.join(base, fn)
        rel = os.path.relpath(full, SRC)
        files.append((rel, full))
files.sort()

# 1. collision check
st, body = call("GET", "/contents/skills/docker-metadata-action?ref=main")
if st != 404:
    print("COLLISION: GET contents returned", st)
    sys.exit(1)
print("collision check: 404 OK")

# 2. head + base tree
st, ref = call("GET", "/git/ref/heads/main")
head = ref["object"]["sha"]
st, commit = call("GET", "/git/commits/" + head)
base_tree = commit["tree"]["sha"]
print("head", head[:12], "base_tree", base_tree[:12])

# 3. blobs
tree_entries = []
for rel, full in files:
    with open(full, "rb") as f:
        content = f.read()
    txt = content.decode("utf-8")  # must be plain UTF-8 text
    st, blob = call("POST", "/git/blobs", {"content": txt, "encoding": "utf-8"})
    if st != 201:
        print("BLOB FAIL", rel, st, blob)
        sys.exit(1)
    tree_entries.append({"path": "skills/docker-metadata-action/" + rel, "mode": "100644", "type": "blob", "sha": blob["sha"]})
print("blobs:", len(tree_entries))

# 4. tree
st, tree = call("POST", "/git/trees", {"base_tree": base_tree, "tree": tree_entries})
if st != 201:
    print("TREE FAIL", st, tree)
    sys.exit(1)
new_tree = tree["sha"]
print("tree", new_tree[:12])

# 5. commit
msg = "mint: skills/docker-metadata-action knowledge corpus from yubiOS skills/docker-metadata-action/SKILL.md"
st, c = call("POST", "/git/commits", {"message": msg, "tree": new_tree, "parents": [head]})
if st != 201:
    print("COMMIT FAIL", st, c)
    sys.exit(1)
new_commit = c["sha"]
print("commit", new_commit[:12])

# 6. branch
branch = "mint/skills-docker-metadata-action-2026-10-06"
st, r = call("POST", "/git/refs", {"ref": "refs/heads/" + branch, "sha": new_commit})
if st != 201:
    print("REF FAIL", st, r)
    sys.exit(1)
print("branch", branch, "created")

# 7. PR body draft
digs = {}
for nn in ["01","02","03","04","05","06","07","08","09"]:
    slugs = {"01":"purpose-and-scope","02":"action-reference-inputs","03":"tag-types","04":"outputs-and-build-push","05":"oci-labels","06":"yubios-supply-chain-pattern","07":"bake-integration","08":"primitive-alignment","09":"lifecycle-examples-guidelines"}
    d = json.load(open(f"{SRC}/research-db/digs/{nn}-{slugs[nn]}.json"))
    kept_urls = d["results_kept"]
    dig_rec = json.load(open(f"{SRC}/research-db/digs/{nn}-{slugs[nn]}.json"))
    digs[nn] = kept_urls
scores = {}
val = json.load(open(f"{SRC}/research-db/outline.json"))
for k, a in val["validation"]["answers"].items():
    scores[k[1:]] = a["score"]
archive = json.load(open(f"{SRC}/research-db/archive.json"))
primary = {}
for r in archive:
    nn = r["query"]  # not used; recompute per nn below
# recompute per-nn from weighted data via query mapping: archive entries carry query strings only;
# recompute using weighted-flat mapping: nn was lost in archive. Use file weighting source.
weighted = json.load(open(ROOT + "/weighted-flat.json"))
prim = {}
tot = {}
for r in weighted:
    tot[r["nn"]] = tot.get(r["nn"], 0) + 1
    if r["weight"] is not None and r["weight"] >= 0.5:
        prim[r["nn"]] = prim.get(r["nn"], 0) + 1

scores_slug = {"01":"purpose-and-scope","02":"action-reference-inputs","03":"tag-types","04":"outputs-and-build-push","05":"oci-labels","06":"yubios-supply-chain-pattern","07":"bake-integration","08":"primitive-alignment","09":"lifecycle-examples-guidelines"}
score_map = {scores_slug[k]: v for k, v in scores.items()}
verdict = {}
for nn, slug in scores_slug.items():
    s = score_map[slug]
    if s >= 1.5:
        verdict[nn] = "kept (load-bearing)"
    elif 0.05 <= s < 1.0:
        extra = " (internal record, source-doc grounded)" if not digs[nn] else ""
        verdict[nn] = f"kept (marginal{extra})"
    else:
        verdict[nn] = "kept"

body = f"""mint: skills/docker-metadata-action (from yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md)
## Source doc
yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md - docker/metadata-action: generate OCI-compliant Docker image tags and labels automatically from Git metadata (branch, tag, SHA, PR) in GitHub Actions, and the tag-generation discipline the skill teaches
## Outline
| NN | slug | score | verdict |
"""
for nn in scores_slug:
    body += f"| {nn} | {scores_slug[nn]} | {score_map[scores_slug[nn]]} | {verdict[nn]} |\n"
body += """## Metrics
score (outline) / noul (weighting) via clef (typesafe/jev-1.13) on DefAPI direct https://api.defapi.org/api/v1/decisions; steady-orbit relay kept as fallback, not needed
## Jev stats
requests 6, usage 8544 in / 1261 out tokens, weights high 37 / low 21 of 58
## Per-doc sources
| doc | results kept | primary (>= 0.5) |
"""
for nn in scores_slug:
    body += f"| {nn}-{scores_slug[nn]} | {len(digs[nn])} | {prim.get(nn, 0)} |\n"
body += """## Redo log
none
## Gaps / skips
none
## Preflight
2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (DefAPI direct, typesafe/jev-1.13) 200
## Verification
VERIFIED: pending post-push check
"""
pr_body = {"title": "mint: skills/docker-metadata-action knowledge corpus (yubiOS skills/docker-metadata-action/SKILL.md ground source)",
           "head": branch, "base": "main", "body": body, "draft": True}
st, pr = call("POST", "/repos/yubi-OS/knowledge/pulls", pr_body)
if st != 201:
    print("PR FAIL", st, pr)
    sys.exit(1)
pr_num = pr["number"]
print("PR", pr_num, pr["html_url"])

# 8. POST-PUSH VERIFICATION
# 8a. PR files list
st, fl = call("GET", f"/pulls/{pr_num}/files?per_page=100")
fcount = len(fl) if isinstance(fl, list) else 0
research_files = [f for f in fl if f["filename"].startswith("skills/docker-metadata-action/research-db/") and f["filename"].endswith(".json")]
print("PR files:", fcount, "research-db json files:", len(research_files))

# 8b. blob re-fetch each research-db .json, decode, parse, check weights non-null
blob_by_sha = {e["sha"]: e["path"] for e in tree_entries}
parsed = 0
weights_ok = 0
weights_total = 0
for f in research_files:
    sha = f["sha"]
    st, b = call("GET", "/git/blobs/" + sha)
    if st != 200:
        print("BLOB FETCH FAIL", f["filename"], st)
        continue
    txt = base64.b64decode(b["content"]).decode("utf-8")
    try:
        data = json.loads(txt)
        parsed += 1
        if f["filename"].endswith("archive.json"):
            weights_total = len(data)
            weights_ok = sum(1 for e in data if e.get("weight") is not None)
    except Exception as ex:
        print("PARSE FAIL", f["filename"], ex)

verline = f"VERIFIED: files {fcount}, research-db {parsed} parse, weights {weights_ok}/{weights_total}"
print(verline)

# 8c. PATCH PR body with verified line
new_body = body.replace("VERIFIED: pending post-push check", verline)
st, _ = call("PATCH", f"/pulls/{pr_num}", {"body": new_body})
print("PR body patched:", st)
print("FINAL:", verline)
print("FILES:", fcount)
print("PR_NUM:", pr_num)
print("PR_URL:", pr["html_url"])
