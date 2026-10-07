# Philosophy and the Three Failure Modes

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). Web evidence for the lineage patterns is weak-backed (all dig results scored below 0.5) and labeled as such.

## Scope

Why Sauna's non-lexical token substrate exists: the three recurring failure modes of the read-by-default path, the flipped default it proposes, and the lineage patterns that inspired it (explicitly marked not-implemented in v1).

## The three failure modes

The source doc names three failure modes that recur when every piece of content takes the default path of read, parse, decide:

1. **Context bloat.** Long transcripts force early compaction, which loses fidelity. The content eats the working window that other reasoning needs.
2. **Token cost.** Every operation re-reads content that was already processed. The cost is paid again on each pass even when nothing changed.
3. **Surface area.** Reading content exposes it to model-side interpretation. This is fine most of the time, but bad when the content is sensitive, redundant, or already known.

The substrate answers all three with one flip: content becomes a token (fingerprint, embedding, hash, or byte compound) at intake, and operations act on tokens. Text reconstruction is opt-in, not the default. The substrate does not replace reading; it provides an alternative path when reading is too expensive, too risky, or too redundant (source doc).

## The discipline

The substrate's core discipline is **no lexical decode by default**. A token is opaque to the agent's reasoning layer unless `recall()` is called explicitly. The default path is fingerprint, then compare, then route, then maybe recall. Reading is opt-in, deliberate, and documented (source doc).

## The lineage patterns

The source doc observes that the pattern shows up everywhere once you look for it, and names five inspirations:

- **Content-addressed storage** (Git, IPFS, CAS systems): identity is derived from content, not from location or name.
- **Vector databases**: semantic search without reading the source text.
- **Zero-knowledge proofs**: commit without reveal.
- **SimHash / MinHash**: similarity without content.
- **Bloom filters**: set membership without enumeration.

The dig results back the mechanics of these patterns, though the noul weighting scored every result below the 0.5 authoritative threshold, so treat each as weak-backed context rather than primary confirmation:

- Bloom filters are space-efficient probabilistic structures that test set membership with k hash functions over an m-bit array, with constant-time add and check independent of set size (https://en.wikipedia.org/wiki/Bloom_filter, weight 0.48, weak; https://generalistprogrammer.com/tutorials/bloom-filter-complete-guide, weight 0.22, weak).
- MinHash and SimHash both estimate similarity between data sets by representing a set as a hash value and comparing those values (https://spotintelligence.com/2023/01/02/minhash/, weight 0.25, weak).
- Zero-knowledge proofs are cryptographic methods that prove something true without revealing the underlying knowledge (https://z.cash/learn/, weight 0.10, weak; https://handwiki.org/wiki/Secure_multi-party_computation, weight 0.12, weak).
- SimHash-style near-duplicate detection links low Hamming distance to high Jaccard similarity (https://en.wikipedia.org/wiki/SimHash, weight 0.47, weak).

## Inspirational lineage, not implementation

The source doc is explicit: the patterns named above are **inspirational lineage, not substrate operations in v1**. The per-pattern "Not implemented in v1" status lives in the source doc's Knowledge Sources section. Callers who want SimHash or MinHash behavior should use a dedicated library; the substrate does not expose these as primitives.

This matters for interpretation: the substrate's five operations (fingerprint, compare, recall, route, transform) are its own homegrown vocabulary. The lineage patterns explain *why* the vocabulary looks the way it does, not what the runtime does. A reader who treats the substrate as "a SimHash library" or "a Bloom filter implementation" has misread the claim.

## What the flip buys

The source doc frames the flip as an alternative path, not a replacement. Lexical reading remains the right choice for comprehension, small content, and anything requiring precise textual fidelity. The substrate is the right choice when one of the three failure modes is the binding constraint:

- Already-known content: re-reading wastes tokens; the token alone suffices.
- Sensitive content: reading exposes it; the hash commits without revealing.
- Large content: only a portion is needed; compare on tokens, recall selectively.
- Comparison or routing operations: similarity and dispatch do not require comprehension.
- Content-addressed outputs: the artifact IS the hash, so the token is the deliverable.

The rest of this corpus builds out that vocabulary: the five operations and two invariants (doc 03), the three token classes (doc 04), the serialization contract (doc 05), the lifecycle story (doc 06), the operating process (doc 07), the per-operation calibration discipline (doc 08), the failure catalog (doc 09), and the integration map (doc 10).
