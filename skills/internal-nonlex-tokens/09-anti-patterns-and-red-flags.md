# Anti-Patterns and Red Flags

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). This subtopic has the corpus's strongest dig backing: two authoritative sources (arXiv at 0.72, simhash-py at 0.61).

## Scope

The nine anti-patterns (what the agent did wrong and what to do instead) and the ten red-flag signals (observable evidence that something has gone wrong).

## The nine anti-patterns

1. **Reading when fingerprinting suffices.** "Let me just read this once to be safe" defeats the substrate. If the constraint is cost or sensitivity, fingerprint and route; do not read.
2. **Fingerprinting when reading is required.** "I should use the substrate everywhere" is cargo-cult. Reading IS the right tool for comprehension. The substrate is for cost, sensitivity, and scale, not for everything.
3. **Compression without reconstruction plan.** Compressing without documenting how to reconstruct equals data loss. Always pair `fingerprint()` with a `recall()` path: store location, encoding, version.
4. **Hybrid tokens by default.** Hybrid tokens cost more than hash or embedding alone. Pick the cheaper class when the more expensive one is not needed.
5. **Re-introducing lexical decode via leaky APIs.** If `route()` secretly reads the content to make a routing decision, the no-lexical-decode invariant is violated. Audit the substrate's APIs for lexical leaks.
6. **Treating the substrate as a vector store.** The substrate has more operations than `compare()`. If only `compare()` is needed, a vector store is the right tool; the substrate is overkill.
7. **Skipping the audit trail.** Every non-lexical operation should log the constraint, the operation class, the token type, and the reconstruction path. No audit trail means no substrate discipline.
8. **Using the substrate for code that must run verbatim.** Embeddings are lossy; hash tokens are exact but do not capture semantics. Code that must execute needs the exact bytes; use hash plus `recall()` to reconstruct, do not compress.
9. **Confusing "non-lexical" with "anti-lexical".** Non-lexical is an alternative path, not a replacement. Lexical reading remains the right choice for many operations.

## The ten red flags

Red flags are single observable signals; they trigger a review of the Guidelines or Anti-patterns sections rather than stating rules themselves (per the source doc's placement rule):

1. A non-lexical operation without a documented constraint.
2. A `recall()` call that could have been avoided by routing on the token.
3. A hash token where an embedding token was needed (semantic similarity expected; hash only detects identity).
4. An embedding token where a hash token was needed (exact match expected; embedding is lossy).
5. A hybrid token where a single token class would suffice (over-engineering).
6. The substrate used for content that fits in a single tool call.
7. A fingerprint collision that the audit trail does not surface (the substrate hid a bug).
8. A `compare()` that returned high similarity for genuinely different content (false positive from lossy embedding).
9. A `recall()` that returned different content than was originally fingerprinted (version drift in the content-addressed store).
10. "I used the substrate everywhere", over-application of a specific tool.

## The external evidence for failure modes 3 and 8

Red flags 3 and 8 are the substrate's names for the two classical failure directions of similarity tooling, and both have external support:

- **Hash where embedding was needed (false negatives).** SimHash exists precisely because exact hashing cannot see similarity: near-duplicate detection via simhash identifies documents that are similar but not byte-identical (https://github.com/seomoz/simhash-py, weight 0.61, authoritative). The property that makes SimHash usable is that low Hamming distance implies high Jaccard similarity (https://en.wikipedia.org/wiki/SimHash, weight 0.47, weak), and SimHash is routinely used for document deduplication, spam detection, and near-duplicate detection (https://spotintelligence.com/2023/01/02/simhash/, weight 0.26, weak). A sha256 token gives none of this: identical bytes or nothing.
- **Embedding where exactness was needed (false positives).** Embedding cosine scores can read high for content that misses the actual intent; high cosine similarity is not the same as relevance (https://www.bitsfolio.com/embedding-similarity-cosine-scores-miss-intent/, weight 0.23, weak). The underlying geometry is real: image-text embedding training shapes the cosine-distance distribution of positive and negative pairs (https://arxiv.org/pdf/1711.05535, weight 0.72, authoritative), and machine-learning embeddings map data into a lower-dimensional vector space where similarity is approximate by design (https://en.wikipedia.org/wiki/Embedding_(machine_learning), weight 0.43, weak; https://www.ibm.com/think/topics/embedding, weight 0.39, weak).

The two failure directions are symmetrical and cheap to state: hash answers "is this the same artifact" and is blind to meaning; embedding answers "is this about the same thing" and is blind to identity. Choosing the wrong one is the single most common concrete failure, which is why the token-class selection rule (doc 04) and the red flags encode the same decision twice.

## Red flag 9 and the lifecycle link

Red flag 9 (recall returns different content than was originally fingerprinted) is the observable symptom of version drift in the content-addressed store. The fix is structural, not behavioral: the lifecycle rules from doc 06 make drift detectable at the token level via version stamps and legacy flags. A reviewer who sees red flag 9 in a session should look for a missing migration, not operator error.

## Red flag 7 and collision surfacing

Red flag 7 (a fingerprint collision the audit trail does not surface) is about honesty of the substrate itself. Hash collisions are astronomically unlikely for sha256 but not impossible; the substrate's discipline is that the audit trail must be able to surface one when it happens. A substrate that hides collisions has converted a detectable bug into silent corruption. This is also why the source doc's do-not-use list says debugging the substrate means reading the substrate code, not the content.

## The meta-anti-pattern

Anti-pattern 2 and red flag 10 are the same failure seen from the two sides: over-application. The substrate earns its cost per operation, not per project. The guideline 7 skip rule (single-tool-call content) and guideline 1 constraint check are the two structural brakes. Everything else in this doc is what happens when one of those brakes fails.
