# 07 - Usage patterns: examples and guidelines

Scope: the source doc's worked examples, the path-selection and context-hygiene guidelines, and the read-only relationship between corpus-recall and knowledge-corpus-mint.

## The three worked examples

The source doc gives 3 canonical examples that map job shapes to paths (source doc: yubi-OS/yubiOS skills/corpus-recall/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/corpus-recall/SKILL.md):

1. Recall what a corpus says about dm-verity: mirror the repo (Path 1), run `rg -i 'dm-verity' knowledge/`, and cite doc paths. Note the last step: the recall is not complete until the paths are cited, which ties the example to the provenance discipline in 06-provenance-discipline.
2. Ground a claim with its original source: find the doc, then cross-check `research-db/archive.json` for the cited URL's jev weight. This is the verification escalation, used when a fact matters enough to check its evidence rather than just its prose.
3. Build a topic index across all corpora: Path 2, grep item labels for topic keywords, keep only paths and titles in context. This is the map-first pattern: the full-text call does the discovery, but only the lightweight label layer enters context.

Read together, the examples encode a rule: pick the path by the shape of the job (grep-shaped, full-text mapping, known-path), and always end with paths and quotes, not with pasted content.

## The guidelines

The source doc's guidelines, each with its reason (source doc):

- Mirror per session, not per task. The repo is small enough that a fresh pull is always cheaper than staleness reasoning. The cost asymmetry is decisive: a pull is about 1 second and about 1.5 MB (source doc measurements), while reasoning about which docs changed since an old mirror costs attention every time it is attempted.
- Never paste full doc bodies into chat; cite paths and quote the specific lines. Doc bodies are large and mostly irrelevant to the question at hand; a path plus a targeted quote is both cheaper and more precise. The same rule scales up to the 7.3 MB repo-items response (03-repo-items).
- Path selection: "Prefer Path 1 for anything grep-shaped, Path 2 when you need full text in one shot (mapping, embedding, triage), Path 3 for known-path reads" (source doc). When torn, the tiebreaker is round trips: Path 1 amortizes over unlimited local searches, Path 2 amortizes over a one-shot bulk need, Path 3 is optimal for exactly one file.
- The /api/repo-items call must run from the worker executor; the sandbox is blocked by CF error 1010 on the workers.dev origin (source doc). This is a hard constraint, not a preference.
- knowledge-corpus-mint creates these corpora; corpus-recall only reads them (source doc). The reader/writer split is deliberate: recall never mutates the corpus, so a recall session cannot corrupt provenance. Corrections and additions go through a mint, not through ad-hoc edits during recall.

## Anti-patterns the guidelines imply

- Hardcoding the corpus list. The list changes; enumerate with `ls repo/knowledge/` after mirroring (source doc).
- Greeting every question with a fresh mirror pull. Pull once per session; reuse the mirror across tasks in that session.
- Quoting from memory instead of from the mirror. If you cannot produce the path, you do not have the citation; go find it.
- Dumping the archive or a doc body into context to "look around". Grep it in-script and surface only the matches.
- Editing a corpus file to fix something you noticed while reading. That is mint territory; record the defect and route it back to the mint pipeline.

## How this corpus's other docs fit

- 01-repo-layout: what you are looking at inside a corpus directory.
- 02-mirror-grep: the workhorse path the first example uses.
- 03-repo-items: the one-call path the third example uses, plus its executor constraint.
- 05-raw-reads: the known-path path, optimal for a single doc.
- 06-provenance-discipline: the citation and verification rules the examples end with.

## A minimal recall session

Assembling the guidelines into an order of operations: mirror once at session start; enumerate the corpus list from the mirror; grep or use the index to find candidate docs; read the specific docs (mirror files or raw fetches); when a fact matters, cross-check its archive entry in the corpus's research-db; cite doc paths with quoted lines in everything you produce. Nothing in that loop consumes GitHub API budget, and only the final citations enter context.
