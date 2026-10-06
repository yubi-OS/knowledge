# 01 - Repo layout: the anatomy of a knowledge corpus

Scope: what a corpus directory in yubi-OS/knowledge looks like on disk, what each file in the research-db provenance tree is for, and why the layout is the contract that makes recall possible. (Internal-record subtopic, no dig: the layout is defined by the source doc and the repo itself.)

## The corpus directory contract

Every corpus lives in its own directory under `knowledge/<ref>/` in the yubi-OS/knowledge repo (source doc: yubi-OS/yubiOS skills/corpus-recall/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/corpus-recall/SKILL.md). One corpus per directory, and the reference name is the path key every recall path uses: a mirror lands as `knowledge-main/knowledge/<ref>/`, the repo-items endpoint returns paths rooted at `knowledge/`, and a raw read hits `knowledge/<ref>/<doc>.md` directly.

Inside a corpus directory you find 3 kinds of artifacts (source doc):

1. Authored docs, numbered `01-topic.md` through `NN.md`. These are the corpus's substance: cited, append-auditable prose documents. The numbering is outline order, so doc NN reflects the position the outline decomposition assigned it, not an arbitrary sort.
2. `README.md`, the corpus charter. It states the corpus's scope and is the natural first read when you land in an unfamiliar corpus.
3. `research-db/`, the typed provenance directory produced by the research-db-mint output stage (source doc).

## The research-db provenance tree

The `research-db/` directory is not optional decoration; it is the evidence layer that makes an authored doc trustworthy. It contains 6 file kinds (source doc):

- `archive.json`: every result collected during research, each with its jev weight. This is the file you open when a claim matters enough to verify (see 06-provenance-discipline).
- `digs/<doc>.json`: one per authored doc, recording the queries attempted, the redo log, what was kept, and whether the doc was authored or skipped.
- `preflight.json`: the health checks run before the mint began (searXNG probe, decide endpoint probe).
- `outline.json`: the outline decomposition, the jev score validation of each subtopic, and which subtopics were dropped or kept.
- `jev-log.json`: one entry per jev HTTP request made during the mint, with usage tokens. This is the audit trail for the decision model spend.
- `db.ts`: TypeScript interfaces matching the shapes of all the JSON files above, so the provenance tree is typed, not just convention.

## What this layout buys you at recall time

The layout is designed so each recall path maps onto it cleanly (source doc):

- Grep over `knowledge/*/research-db/archive.json` answers provenance questions ("what weight did this URL carry, when was it collected") without opening any authored doc.
- Grep over `knowledge/` answers content questions across every corpus at once, because docs are plain markdown at stable paths.
- The per-corpus `README.md` gives you title-level orientation before you commit to reading a numbered doc.

## Do not hardcode the corpus list

The set of corpora changes as new mints land. The source doc is explicit: never hardcode the corpus list; enumerate it after mirroring with `ls repo/knowledge/` (source doc). The skill's measured snapshot was 37+ corpora, 300+ docs, 828 files (source doc), and that number only grows. A hardcoded list is stale the day after the next mint merges.

## Where the layout comes from

Corpora are created by the knowledge-corpus-mint pipeline, which mints one corpus per input request with the same layout every time. corpus-recall is a reader of that contract, not its author: the source doc states plainly that knowledge-corpus-mint creates these corpora and corpus-recall only reads them (source doc). When a corpus you are recalling looks malformed (missing `research-db/`, unnumbered docs), treat it as a mint defect, not a recall problem, and check the corpus's `preflight.json` and `outline.json` before distrusting its content.

## Verification posture

Because the layout is a contract, you can verify a corpus in seconds: the numbered docs exist, the README exists, and the 6 research-db file kinds are present. A corpus missing its provenance tree is still readable, but its claims cannot be cross-checked against weights and collection dates, which downgrades it under the provenance discipline described in 06-provenance-discipline.
