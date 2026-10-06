# 06 - Provenance discipline

Scope: how recall keeps evidence attached to facts: inline citations with jev weights in authored docs, doc-path attribution when recalling, and cross-checking the research-db archive when a claim matters enough to verify.

## The rule in the authored docs

Every authored doc in a corpus cites its sources inline with jev weights, in the form `(source: https://..., jev 0.66)` (source doc: yubi-OS/yubiOS skills/corpus-recall/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/corpus-recall/SKILL.md). The weight is the output of the jev decision model used at mint time: the noul question asked whether each collected result was a primary or authoritative source worth citing, and the returned probability became the weight. A claim therefore carries two coordinates: where it came from and how strong that source was judged to be.

## Recalling: cite the doc path, not the fact

The recall-side half of the discipline: when recalling a fact from a corpus, cite the doc path it came from (source doc). "The knowledge repo says X" is not a citation. "knowledge/<ref>/03-thing.md says X" is. This keeps every downstream use of a recalled fact traceable to a specific authored doc, which itself carries inline source URLs and weights. The skill's guidelines reinforce the context-hygiene side of this: never paste full doc bodies into chat; cite paths and quote the specific lines (source doc).

## Verification: the archive is the ground truth

Docs are snapshots, not live pages (source doc). The authored doc tells you what the mint found and how it was weighted; the archive tells you what was actually collected. When the fact matters enough to verify, the source doc's procedure is explicit: open the corpus's `research-db/archive.json` and check the original URL's weight and collection date (source doc). The archive entry gives you the query that surfaced the result, the snippet as collected, the jev weight, and the collection timestamp. If the original page has since changed or died, the snippet and collection date are the record of what was seen at mint time.

This two-layer design matches the standard definition of data provenance as documentation of where data came from and the processes behind it (source: https://casrai.org/guides/data-provenance, jev 0.82). The research literature makes the same point about structured provenance: provenance criteria should be explicit and machine-checkable rather than narrative (source: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8663663/, jev 0.72). The research-db schema (archive.json with typed per-result records, jev-log.json with per-request usage, db.ts with the interfaces) is exactly that: explicit, typed, and auditable.

## What each layer answers

- Authored doc inline citation: "what supports this sentence, and how strong was the source judged?" Read it first; it is enough for most recall.
- Doc path attribution in your own output: "which corpus and doc did I get this from?" Required whenever you repeat a fact.
- research-db/archive.json: "was this source real, how was it weighted, and when was it collected?" Required when the fact matters enough to verify.
- digs/<doc>.json: "what was searched for this doc, and was anything redone or skipped?" Use when you doubt a doc's coverage.
- jev-log.json: "what did the decision model actually consume?" The audit trail for the weighting itself.

## The weight scale in practice

Weights are probabilities from the noul decision: 1.0 would be a certainly-primary source, 0.0 a certainly-useless one. In this corpus's own dig, the pattern matched the mint convention: official documentation and primary tool references landed high (GitHub's rate-limit docs at 0.96 and 0.95, Cloudflare's routing docs at 0.92 and 0.93, the ripgrep user guide at 0.91), while aggregators, dictionaries, and off-topic pages landed low. When you recall a fact backed by a weight below 0.5, treat it as weakly backed: usable as a lead, not as authority, and worth a verification pass through the archive.

## Snapshot hazard and drift

Because docs are snapshots, a recalled fact can be stale in two directions: the external source may have changed, or the repo itself may have moved (a doc renamed, a corpus reorganized). The discipline handles both: re-read the specific doc via a fresh raw fetch (Path 3) when currency matters, and re-verify the cited URL before building anything load-bearing on it. What you must not do is silently upgrade a snapshot fact to a live fact without the verification pass.
