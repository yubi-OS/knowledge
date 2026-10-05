# Input-change observability: telling a silent edit from silent geometry

Scope: how the audit separates changed input from changed binary geometry, names quantization-silent edits, and refuses to let a stationary dot prove that an edit was ignored.

## The defect

The pre-audit comparison had one axis: did the map move? A real late append during testing changed the document hash and the embedding but crossed no binary threshold, so the map registered nothing. The pipeline had no vocabulary for that outcome: it could not distinguish "input changed but binary geometry did not move" from "nothing happened". The dangerous misreading was symmetric: a stationary dot cannot establish that an edit was ignored, but nothing in the old reporting could say why the dot was stationary.

## The repair

Comparisons now carry three distinct channels:

1. Changed input: the full-content hash and the embedding differ.
2. Changed binary geometry: bit-level placement changed.
3. Quantization-silent edits: input changed, geometry did not, and the pipeline says so explicitly instead of reporting uniform stillness.

The distinction matters because binary placement is a coarse readout. Floating-point roundoff is roughly proportional to the amplitude of the represented quantity (https://home.mit.bme.hu/~kollarzs/quantization/floating-point.pdf, weight 0.685), and quantization is by definition the mapping of inputs from a large set to a smaller countable set, with rounding and truncation as the typical mechanisms (https://en.wikipedia.org/wiki/Quantization_(signal_processing), weight 0.352, weak). Applied to a placement pipeline, that means small real semantic changes can land inside one quantization cell and produce zero bit flips. A map that reports only bits cannot see them; a comparison layer that reports the hash channel can.

## The live evidence chain

The audit record backs this with a four-run series on the live deployment:

| Run | Input | Observation |
|---|---|---|
| 43 to 44 | identical rerun, real 768-D texts | 10 unchanged anchors, zero bit flips, seed 0 preserved |
| 45 | complete 159-file refs corpus | zero identity failures, 26 isolated points, 12 occupied sectors, frame 07cb0c4994f0cc8a |
| 46 | exact no-op against 45 | 159 cache hits, 159 unchanged anchors, zero bit flips, zero displacement |
| 47 | append Addendum 13 to the point-map spec | 158 cache hits, one changed full-content hash, full coverage, zero binary flips |

Run 47 is the demonstration case: one document changed, the cache served the other 158, and the geometry held still. That is a genuine quantization-silent edit, named as such. A follow-up vector-fingerprint comparison then exposed a second row (the repo-history skill reference document) whose source was unchanged but whose vector fingerprint changed, with no bit or position change. That representation drift is reported separately from the one changed content hash, its cause is not established, and it is explicitly not credited as edit movement.

## Caching makes the channel trustworthy

The cache-key design is what makes run 46 conclusive. Because model, protocol and content key the cache, an exact no-op replays from cache and cannot perturb state; the 159 cache hits are evidence that the comparison saw the same bytes, not evidence that the pipeline skipped work silently. Hash-based invalidation of expensive cached computation is the standard pattern (https://deepwiki.com/zensical/zensical/7.2-caching-and-change-detection, weight 0.378, weak), and embedding-cache correctness questions are a known failure surface for RAG systems (https://tianpan.co/blog/2026/04/20/cache-invalidation-ai-semantic-rag, weight 0.215, weak). The strong part of the design is that the cache key includes the content hash itself, so a changed document can never be served stale.

## What a stationary dot does and does not prove

The audited reporting keeps the negative claim symmetric. A stationary dot with an unchanged hash means nothing changed and nothing should have moved. A stationary dot with a changed hash is a quantization-silent edit, reported as observed movement zero with the input channel flagged. A stationary dot with a changed hash and a changed vector fingerprint is representation drift, reported separately and not credited as edit movement. The run 47 geometric task verdict remains not-tested: keeping the append is justified by the source and API consistency check, independently of geometric movement. The observability repair is about telling these cases apart, not about manufacturing movement.
