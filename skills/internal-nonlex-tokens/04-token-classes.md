# Token Classes: Hash, Embedding, Hybrid

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). The strongest external confirmation in this subtopic is the Hugging Face model card for the default embedding model (weight 0.51, the only authoritative result).

## Scope

The three token classes the substrate supports, their tradeoffs, and the selection rule that maps content type to token class.

## The three classes

The source doc defines exactly three token classes:

- **Hash tokens** (sha256, blake3, and similar): content-derived byte fingerprints. Cheap, deterministic, collision-resistant. Use for byte content, code, structured data.
- **Embedding tokens**: content-derived semantic vectors. More expensive, lossy on the input side, but support semantic `compare()`. Use for natural language, where similarity matters more than identity.
- **Hybrid tokens**: a compound of hash + embedding + small metadata. Use when both identity and semantic similarity matter.

The selection rule in one line: hash for code, embedding for text, hybrid for mixed. And the cost discipline: hybrid tokens cost more than hash OR embedding alone, so pick the cheaper class when the more expensive one is not needed (source doc anti-pattern "Hybrid tokens by default").

## Hash tokens: exactness through collision resistance

A hash token carries the digest of the exact bytes. Two byte strings have the same token if and only if they hash identically, so hash tokens detect identity, not similarity. SHA-2 is the family the source doc pins for the default `algo` field: a set of cryptographic hash functions designed by the United States National Security Agency and first published in 2001, built using the Merkle-Damgard structure (https://en.wikipedia.org/wiki/SHA-2, weight 0.41, weak). The substrate's sha256/blake3 pairing mirrors the practical comparison landscape: SHA-256 versus BLAKE3 tradeoffs are typically stated as performance, security, and use-case differences (https://mojoauth.com/compare-hashing-algorithms/sha-256-vs-blake3/, weight 0.16, weak), with BLAKE3 offering 256-bit-plus output and quantum-resistance properties in comparison tables (https://labs.unicybers.com/tools/crypto-encoding/cryptography-cheat-sheet/, weight 0.13, weak).

What the hash class buys is audit capability: the token is small (32 bytes for sha256, serialized as 64 hex characters) and identical content always produces the identical token, which is what makes content-addressed stores (doc 03) and commit-without-reveal audits (doc 06 example) work.

## Embedding tokens: similarity at the cost of lossiness

An embedding token carries a semantic vector. It supports graded compare: two texts that mean similar things get a high cosine similarity even when they share no words. The cost is on the input side: embeddings are lossy, and two different texts can produce close vectors, which is the source doc's "false positive from lossy embedding" red flag.

The substrate pins its default model to `sentence-transformers/all-MiniLM-L6-v2`. The model card confirms the shape the substrate's envelope assumes: the model maps sentences and paragraphs to a 384-dimensional dense vector space and is used for tasks like clustering or semantic search (https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2, weight 0.51, authoritative). The source doc's Knowledge Sources section adds the tradeoffs the token class inherits: the model is MIT-licensed, runs locally without an API key, is English-dominant, and is lossy above 256-word chunks.

This is why the source doc's red-flag list includes "a hash token where an embedding token was needed" and its mirror image: choosing the wrong class produces either false negatives (hash cannot see similarity) or false positives (embedding cannot guarantee identity).

## Hybrid tokens: both, and paying for both

A hybrid token is a compound: a hash part for byte identity, an embedding part for semantic similarity, plus small metadata (source path, intake timestamp). Use it when a comparison needs both answers: "is this the exact same artifact" and "is this about the same thing".

The cost discipline is the one to internalize. Hybrid is the most expensive class to produce (one hash computation plus one embedding inference), and the source doc explicitly warns against using it by default. The token-format example in the source doc even keeps the hybrid's metadata minimal and semantic-only: the `source_path` field is described as opaque to the substrate.

## Selection by content class

Mapping from the source doc's Guidelines item 3:

- Bytes, code, structured data: hash. Exactness is the property; semantics are noise for these inputs.
- Natural language: embedding. Similarity is the property; identity is rarely what the caller wants for prose.
- Mixed: hybrid, only when both identity and semantic similarity matter.

Two boundary cases the source doc calls out:

- Code that must run verbatim needs the exact bytes. Use hash plus `recall()` to reconstruct, never an embedding (anti-pattern "Using the substrate for code that must run verbatim").
- Text where similarity is expected but hash was used is a red flag; hash only detects identity.

## Cost and overhead awareness

The cheapest correct token is the discipline. Fingerprinting a one-sentence email into an embedding vector costs more than reading the sentence. The substrate's own guideline says skip the substrate for single-tool-call content (doc 07). Token class choice is the second half of the same discipline: within the substrate, hash is the cheapest, embedding is the most expensive to produce, and hybrid is the most expensive to produce and to store. Every upgrade must be justified by a comparison need the cheaper class cannot serve.
