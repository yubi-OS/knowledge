# Five Operations and Two Invariants

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). Web evidence for the underlying mechanisms is mixed-strength and labeled.

## Scope

The substrate's complete API surface: five operations with inputs, outputs, and use cases, plus the two invariants that make the discipline enforceable.

## The operations table

The source doc defines five operations. Together they are the entire vocabulary; there is no sixth operation in v1.

| Operation | Input | Output | When to use |
|---|---|---|---|
| `fingerprint(content)` | bytes or text | token (sha256, embedding, or hybrid) | Intake: every content enters the substrate as a token |
| `compare(token_a, token_b)` | two tokens | similarity score or equivalence verdict | Find similar past work; deduplicate; cluster |
| `recall(token)` | token | content or summary | Need the source; explicitly opt in to reading |
| `route(token)` | token | handler or next-step selection | Dispatch without parsing content |
| `transform(token_a, op)` | token + op | new token | Embeddings arithmetic; byte ops; hash chains |

Reading the table as a pipeline: fingerprint is the intake gate, compare and route are the work, transform derives new tokens from old ones, and recall is the single exit back to text. Everything else stays byte-shaped.

The source doc is explicit that the substrate is not a runtime yet: "it's a discipline and an operational vocabulary. Phase 2 may add a runtime implementation; Phase 1 is the vocabulary that future code can implement."

## Invariant 1: no lexical decode by default

A token is opaque to the reasoning layer unless `recall()` is called. Reading is opt-in. The corollary is the anti-pattern "re-introducing lexical decode via leaky APIs": if `route()` secretly reads the content to make a routing decision, the invariant is violated. The source doc directs auditing of the substrate's APIs for lexical leaks.

## Invariant 2: content-addressed storage

`recall()` returns the original content if the caller needs it; if not, the caller operates on the token alone. The substrate never requires reading to do work. This is Git's "content defines identity" stance, generalized: identity is computed from content, so identical content produces identical tokens regardless of where it lives.

The web evidence for this mechanism is the strongest dig result in this subtopic: Git's object database stores each piece of content as a single file named by the SHA-1 (later SHA-256) hash of that content, and `git hash-object` returns the unique key that would be used to store the content in the Git database (https://git-scm.com/book/en/v2/Git-Internals-Git-Objects, weight 0.49, weak by 0.01; https://git-scm.com/book/id/v2/Git-Internals-Git-Objects.html, weight 0.49, weak by 0.01). Git itself is described as a content-addressable filesystem at its core (https://git-scm.com/, weight 0.47, weak).

## What each operation means concretely

- **fingerprint** is where the token class matters (doc 04). The same call signature produces a sha256 token for bytes, an embedding token for text, or a hybrid compound.
- **compare** is the only operation that can return a graded score rather than a verdict. On embedding tokens it is cosine similarity; on hash tokens it is exact equality. The source doc's guideline 8 forbids conflating the two: cosine distance on embeddings is the tool for "are these passages similar", lexical diff is the tool for "do these strings match exactly".
- **recall** is the documented exception. Every `recall()` call that could have been avoided by routing on the token is a red flag in the source doc's list.
- **route** is the dispatch operation: pick a handler or next step from the token alone. It must not read the content to do so.
- **transform** covers embeddings arithmetic, byte operations, and hash chains. The Merkle-chain intent (ordered audit trails) is inspirational lineage only, not implemented in v1 (source doc, Knowledge Sources).

## The mechanism behind compare

Embedding tokens support semantic compare because machine-learning embeddings map complex, high-dimensional data into a lower-dimensional vector space of numerical vectors, placing semantically similar items close together (https://en.wikipedia.org/wiki/Embedding_(machine_learning), weight 0.42, weak; https://www.ibm.com/think/topics/embedding, weight 0.39, weak; https://www.geeksforgeeks.org/machine-learning/what-are-embeddings-in-machine-learning-2/, weight 0.21, weak). Practical comparison tooling follows the same shape: generate vectors for text inputs, then measure semantic similarity between samples (https://www.anaconda.com/docs/anaconda-desktop/tutorials/embedding-tutorial, weight 0.26, weak).

## Why five operations and not three

A tempting simplification is fingerprint + compare + recall, treating route and transform as application logic. The source doc keeps all five because routing without parsing and token-level derivation are precisely the operations that let a subagent work on content it never reads (the context-isolation pattern, doc 10). Removing them collapses the substrate back into "a similarity library", which the source doc names as its own anti-pattern: if only compare is needed, a vector store is the right tool.
