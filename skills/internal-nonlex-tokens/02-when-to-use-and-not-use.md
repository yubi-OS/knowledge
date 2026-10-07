# When to Use the Substrate, and When Not To

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). Supporting web evidence is mostly weak-backed and labeled as such.

## Scope

The seven apply conditions and five do-not-use conditions from the source doc, plus the web-backed context for the two most web-shaped ones (semantic search, near-duplicate detection).

## The seven apply conditions

The source doc lists seven conditions under which to apply the substrate. Each maps to a token-class or operation-class consequence:

1. **Content is already known.** Re-reading wastes tokens. Audit trails, repeat transcripts, and content-addressed caches are the canonical cases. Fingerprint once, compare thereafter.
2. **Content is sensitive.** Reading exposes it to interpretation or surface area: private keys, credentials, secrets, PII, internal deliberations. Hash-only tokens commit without revealing.
3. **Content is large.** Sauna only needs a portion: long transcripts, code repos, log streams, email archives. Compare on tokens, recall selectively.
4. **The operation is comparison or routing, not comprehension.** Find similar past work, route a token to the right handler, deduplicate.
5. **Semantic search.** Sauna wants similar content, not exact content: find similar problems, near-duplicate detection, semantic clustering.
6. **Content-addressed output.** The artifact IS the hash: commit-style audit, integrity proofs, content fingerprints in metadata.
7. **A trigger phrase is invoked.** "non-lexical", "token compression", "embedding lookup", "content fingerprint", "semantic hash", "process without reading", "audit by hash", "recall by fingerprint", "route by token", "byte-addressed".

Web context for conditions 4 and 5 (weak-backed): deduplication pipelines distinguish exact copies (handled by SHA-256 hashing) from near-duplicates (handled by Jaccard similarity over character shingles) (https://mbrenndoerfer.com/writing/deduplication-exact-near-duplicate-jaccard-similarity-suffix-arrays, weight 0.44, weak). Vector databases back semantic search use cases such as retrieval-augmented generation and agent memory (https://redis.io/blog/vector-database-use-cases/, weight 0.30, weak; https://zilliz.com/vector-database-use-cases/semantic-search, weight 0.29, weak). Embeddings match meaning even with zero shared words, while keyword search matches exact terms (https://vibeengines.com/handbook/embeddings-vs-keyword-search, weight 0.20, weak).

## The five do-not-use conditions

The source doc is equally specific about the reverse:

1. **Comprehension.** "Explain this", "summarize this", "what does this mean". Non-lexical processing is the wrong tool for understanding; reading IS the right tool. Example 4 in the source doc is exactly this case: the user asks "explain what this code does" and the answer is to read the code lexically.
2. **Small content.** When reading is cheaper than the substrate overhead (a one-sentence email, a single function call), tokenization cost exceeds the savings.
3. **Precise textual fidelity.** Verbatim quotes, code that must run, legal language. Compression is lossy; do not compress what must be exact.
4. **Auditing the substrate itself.** Debugging a fingerprint collision or tracing a recall miss means reading the substrate code, not the content.
5. **An existing vector store or fingerprint index.** If one already exists in the workflow and the user wants to query it, that is a query operation, not a substrate operation. Defer to the existing store's API.

## The boundary in one sentence

The substrate is for cost, sensitivity, and scale. Reading is for understanding. The anti-pattern list (doc 09) names the two symmetrical failures: "reading when fingerprinting suffices" and "fingerprinting when reading is required". Both are the same mistake in different directions: choosing the tool without checking the constraint.

## Constraint-first selection

The process doc (doc 07) formalizes this: step 1 is always "identify the binding constraint". The when-to-use conditions are downstream of the constraint check. "Save tokens" is not automatically a constraint; the content must actually be large, sensitive, repeated, or comparison-shaped. If the answer is no, read the content. The substrate is not a default (source doc, Guidelines item 1).

A practical test from the source doc: if the content fits in a single tool call, the overhead exceeds the savings. Skip the substrate and read it (Guidelines item 7).

## Interaction with trigger phrases

Condition 7 exists because skill matching is trigger-driven. The ten trigger phrases in the source doc's description frontmatter are the surface that drives invocation. A session that hears "audit by hash" or "recall by fingerprint" should check conditions 1 through 6 before applying the substrate; the trigger phrase opens the door, the constraint check decides whether to walk through it.
