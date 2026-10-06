# 02 - Path 1: mirror and grep

Scope: the whole-repo codeload tarball mirror, grep over it with ripgrep, the scripts/recall.sh helper and its index.tsv, and why this path is the default for multi-doc and offline work.

## Why a mirror instead of API calls

Path 1 mirrors the entire yubi-OS/knowledge repo into a session directory with a single codeload tarball download (source doc: yubi-OS/yubiOS skills/corpus-recall/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/corpus-recall/SKILL.md):

```sh
curl -sL "https://codeload.github.com/yubi-OS/knowledge/tar.gz/refs/heads/main" -o k.tar.gz
tar xzf k.tar.gz && cd knowledge-main
```

The source doc records the cost profile: no GitHub API budget consumed, roughly 1 second to fetch, roughly 1.5 MB to store (source doc). That combination is the point. The GitHub REST API charges every contents call against a rate limit and serves one file at a time; the codeload endpoint serves the whole tree as one archive without touching that budget. The codeload host is GitHub's dedicated download endpoint for serving repository archives directly, a separate path from api.github.com's JSON API (source: https://stackoverflow.com/questions/60188254/how-is-codeload-github-com-different-to-api-github-com, jev 0.11, weak backing). What is authoritative here is the source doc's own measured profile; treat the community discussion as corroboration only.

## Grep is the recall primitive

Once mirrored, recall is just text search. The source doc's canonical commands (source doc):

```sh
rg -i 'pattern' knowledge/            # whole-corpus text search
rg 'pattern' knowledge/*/research-db/archive.json   # provenance records
```

Two different questions, two different scopes. The first searches authored doc content across every corpus; the second searches provenance records only, which is how you answer "where did this fact come from and what weight backed it" without reading prose. ripgrep is the tool the skill names for this job: it recursively searches directories for regex patterns while respecting ignore rules (source: https://github.com/BurntSushi/ripgrep, jev 0.85). Its user guide documents the recursive-by-default search over a directory tree and the filtering behavior that makes it suitable for repo-scale greps (source: https://ripgrep.dev/docs/guide/, jev 0.91). At the mirrored repo's scale (37+ corpora, 300+ docs, 828 files per the source doc's measurement), grep over all docs is sub-minute in the Sauna sandbox, which has slow disk I/O, and faster on a real box (source doc).

## scripts/recall.sh and the title index

The repo ships a helper: `scripts/recall.sh` performs the mirror plus builds `index.tsv` mapping corpus, doc path, and H1 title for title-level lookup (source doc). That index answers a different question than grep does: grep finds lines, the index finds documents by title when you know roughly what a corpus covers but not which doc to open. Use the index to shortlist docs, then grep or read the specific file.

## When to pick Path 1

The source doc's guidelines rank the paths: prefer Path 1 for anything grep-shaped (source doc). That is most recall work: finding every mention of a mechanism across corpora, cross-checking which corpus covers a topic, assembling a set of doc paths to cite. It is also the only path that works offline after the single fetch, and the only one that lets you run arbitrary scoped searches (`research-db/` only, one corpus only, filename globs) without another round trip.

## Session economics

Mirror per session, not per task (source doc). The repo is small enough that a fresh pull is always cheaper than staleness reasoning: 1 second and 1.5 MB buys you certainty that the mirror reflects main, versus tracking which docs changed since an old mirror. Because the mirror is a snapshot, treat it like any other cached artifact: if the session spans a long time and correctness matters, re-pull rather than reasoning about staleness (source doc: "a fresh pull is always cheaper than staleness reasoning").

## Gotchas

- The tarball extracts to `knowledge-main/`, so corpus paths inside the mirror are prefixed with that directory.
- Do not paste full doc bodies into chat; cite paths and quote the specific lines you need (source doc, Guidelines). The mirror makes bulk copying effortless, which is exactly the failure mode the guideline guards against.
- The 37+ corpora, 300+ docs, 828 files figures are a measured snapshot from the source doc, dated to when the skill was written; enumerate fresh counts from the mirror rather than citing the stale numbers.
