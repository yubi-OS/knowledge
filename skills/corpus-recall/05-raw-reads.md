# 05 - Path 3: single-doc raw reads

Scope: fetching one known doc straight from raw.githubusercontent.com, when this path is the right one, and what GitHub's rate-limit model implies for it.

## The pattern

Path 3 is the simplest of the three recall paths: a plain GET against the raw content host (source doc: yubi-OS/yubiOS skills/corpus-recall/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/corpus-recall/SKILL.md):

```
https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/<ref>/<doc>.md
```

The source doc's verdict: no auth, no budget, use when the doc path is already known (source doc). Raw file URLs serve the file content of a repository at a ref, which is what community references describe raw.githubusercontent.com doing for any public repo (source: https://stackoverflow.com/questions/39065921/what-do-raw-githubusercontent-com-urls-represent, jev 0.11, weak backing). The authoritative statement here is the source doc's own contract for this repo: it is the read path for a doc whose path you already hold.

## When to pick it

The selection rule is stated once and is worth quoting exactly: "Prefer Path 1 for anything grep-shaped, Path 2 when you need full text in one shot (mapping, embedding, triage), Path 3 for known-path reads" (source doc). Path 3 is not a discovery tool. It assumes you already learned the path from a mirror grep, an index.tsv lookup, or a repo-items response, and now need that one file's body. Using it for exploration would mean one request per guess; use the mirror or the repo-items call instead.

## The budget argument

The reason the path has "no budget" is GitHub's rate-limit model. The GitHub REST API applies explicit rate limits to authenticated and unauthenticated API traffic, documented in GitHub's own rate-limits reference (source: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api, jev 0.96; the enterprise-cloud mirror carries the same policy at https://docs.github.com/enterprise-cloud@latest/rest/overview/rate-limits-for-the-rest-api, jev 0.95). Raw file serving sits outside the REST API request budget, which is why a corpus recall habit built on raw reads does not burn API quota. The trade is that each raw read is a single file: no listing, no search, no directory traversal, those belong to the other two paths.

## Freshness semantics

A raw read is a live read of the branch you name. Unlike the Path 1 mirror, which is a snapshot you pulled at session start, a raw read reflects the state of `main` at the moment of the request. That makes it the right tool for verifying that a doc you just learned about exists and what it currently says, and for re-reading a single file after a mint PR merged, without re-mirroring the whole repo.

## Operational notes

- The URL shape requires the full path from repo root: `knowledge/<ref>/<doc>.md`. Get the `<ref>` from the corpus enumeration, not from memory; the corpus list changes and must never be hardcoded (source doc).
- Raw reads return the file bytes as served, so markdown formatting is preserved exactly; this is the path to use when you need to quote a doc verbatim with line-level fidelity.
- If a known-path raw read 404s, the doc may have been renamed or the corpus reorganized; re-enumerate with Path 1 or Path 2 rather than guessing adjacent paths.
- This path pairs naturally with the provenance discipline (06-provenance-discipline): read the authored doc via raw fetch, then check the corpus's `research-db/archive.json` via the mirror for the claim's original URL and weight.
