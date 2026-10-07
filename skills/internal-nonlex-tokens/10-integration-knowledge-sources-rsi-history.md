# Integration Map, Knowledge Sources, and RSI History

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). The content-addressed-storage lineage has the corpus's best dig backing: the IPFS CID specification carries weight 0.79.

## Scope

The pairing map across ten skills, the version-pinned knowledge sources the substrate's claims rest on, and the 10-cycle RSI changelog that ended at fixpoint v1.10.

## The pairing map

The source doc pairs the substrate with ten skills in three modes:

**Sister and parent:**

- **`token-efficiency`** (sister): token-efficiency reduces token usage in prompts and outputs; this substrate represents content as non-lexical forms at intake. Different layers of the same problem.
- **`context-engineering`** (parent): the substrate is one tool in the context-engineering toolbox. Use context-engineering to decide WHEN non-lexical is the right choice; this skill defines HOW.

**Active pairs:**

- **`context-isolation`**: non-lexical state passes between isolated contexts as fingerprints. A fresh-context subagent receives a token instead of the full text, processes it, and returns another token. The isolation barrier holds because the content never crosses the boundary. (Phase 2 integration pattern, dependent on the token serialization, doc 05.)
- **`self-archaeology`**: compressed self-aspects. SELF.md can be represented as a set of tokens (one per soul-aspect) with `recall()` to the canonical text; cross-session continuity via fingerprint comparison.
- **`security-and-hardening`**: content-addressed audit trails: commit to a hash, verify without disclosure. ZK-memory primitives are a Phase 2 pairing.

**Orthogonal:**

- **`negative-skill-space`**: this skill's negative space is mapped by the 12-axis sweep.
- **`recursive-self-improvement`**: the bounded RSI loop is the maintenance discipline for this skill.
- **`ideate-solo`**: this skill was built via ideate-solo; future major revisions use the same method.
- **`doubt-driven-development`**: applied to each operation choice before committing.
- **`source-driven-development`**: verify the substrate's claims against authoritative sources.

## The content-addressed storage lineage

The source doc's Knowledge Sources section pins the lineage citations with retrieval dates (2026-07-31):

- **Git's content-addressed storage** (Linus Torvalds, 2005): SHA over object content, later SHA-256 in Git 2.42+. The dig confirms the mechanism directly: Git stores each piece of content as a file named by its hash key, and `git hash-object` returns that unique key (https://git-scm.com/book/en/v2/Git-Internals-Git-Objects, weight 0.47, weak; https://git-scm.com/, weight 0.47, weak). Git's own site frames it as handling everything from small to very large projects with speed and efficiency (https://git-scm.com/, weight 0.47, weak).
- **IPFS** (Benet et al., 2014 / spec v0.14): CIDv1 (multihash + multicodec) generalizes Git's content addressing to arbitrary content and informs the substrate's hybrid token envelope (hash + embedding + metadata). The dig's best source in the whole corpus confirms the design: CID is a format for referencing content in distributed information systems, leveraging content addressing, cryptographic hashing, and self-describing formats (https://specs.ipfs.tech/cid/, weight 0.79, authoritative). IPFS describes itself as a constellation of open-source tools for content addressing (https://ipfs.tech/, weight 0.50, authoritative), and the CIDv1 proposal (IPLD, multicodec-packed) is documented in the specs repo (https://github.com/ipfs/specs/issues/130, weight 0.43, weak).

The self-describing identifier pattern is the direct ancestor of the substrate's token envelope: a token carries its class, algorithm, and version so a consumer needs no side-channel to interpret it.

## Embedding model and version envelope citations

- **sentence-transformers/all-MiniLM-L6-v2** (Reimers and Gurevych, 2019 / model card v1.0.1): 384-dim, MIT-licensed, runs locally without an API key; English-dominant, lossy above 256-word chunks. Confirmed by the model card: the model maps sentences and paragraphs to a 384-dimensional dense vector space for clustering and semantic search (https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2, weight 0.51, authoritative).
- **Cosine similarity over float32 vectors** (standard since Mikolov et al. 2013): unit-normalized vectors make cosine equivalent to dot product; distance is interpretable as a similarity in the interval [0, 1]. Cosine similarity of proportional vectors is 1 and of orthogonal vectors is 0 (https://en.wikipedia.org/wiki/Cosine_similarity, weight 0.40, weak).
- **SemVer 2.0.0** (https://semver.org/spec/v2.0.0.html): the substrate_version field and the legacy/compat flags follow major-version compatibility rules (semver.org, weight 0.23, weak in this dig's scoring).

## Adjacent philosophy patterns (not implemented in v1)

SimHash (Charikar 2002), MinHash (Broder 1997/2000), Bloom filters (Bloom 1970), zero-knowledge proofs (Goldwasser, Micali, Rackoff 1989), and Merkle trees / hash chains (Merkle 1979) are inspirational lineage. Each informed one substrate intent (near-duplicate detection, set similarity, membership without enumeration, commit without reveal, ordered audit trails) but none is exposed as a substrate primitive in v1. Callers wanting these behaviors use dedicated libraries.

## The RSI history

The substrate was built through a 10-cycle bounded recursive-self-improvement loop, all dated 2026-07-31, each cycle hypothesis-driven with one edit:

1. **Cycle 1**: v1 written (8.5 KB): five operations, two invariants, three token classes, explicit pairings. Added Examples and Guidelines sections.
2. **Cycle 2**: fixed description-vs-body-vs-Guidelines pairing drift (three lists reduced to two).
3. **Cycle 3**: added the Token Format section (canonical serialization, versioning rule, test-vector reference), closing the serialization gap.
4. **Cycle 4**: added Lifecycle and Migration (four cases), closing the partial-lifecycle trap.
5. **Cycle 5**: inlined the test vectors, removing a broken external file reference.
6. **Cycle 6**: added Knowledge Sources and Citations with version-pinned references.
7. **Cycle 7**: added the Philosophy forward-pointer marking lineage patterns as not-implemented.
8. **Cycle 8**: added the Calibration section (log template, three gates), closing the longest-lived gap.
9. **Cycle 9**: added the "Where this lives" placement rule, closing four gaps in one edit (Examples/Anti-patterns duplication, Guidelines/Verification duplication, and two calibration integration gaps).
10. **Cycle 10**: replaced the session-scoped path in the hybrid example with a stable abstract placeholder. Fixpoint reached (conditional PASS): no new gaps at L x S >= 6, old Extend gaps closed or reduced, no new anti-patterns. The substrate ships at v1.10 with 16 substantive gaps closed.

The honest qualification from cycle 10: same-session bias at the 10-cycle max; the PASS is structural, not empirical; fresh-context re-evaluation is recommended before any v2 work. Re-evaluation triggers named in the changelog: Phase 2 runtime design, embedding-model swap, a new Sauna skill declaring the substrate as a dependency, upstream skill mirrors changing, and fresh-context disagreement with the priority order.

## The source-driven-development contract

The Knowledge Sources section exists to satisfy `source-driven-development`'s discipline: claims verifiable against authoritative sources, sources version-pinned to a retrieval date, and new RSI cycles re-validating sources when proposing substrate changes. Any future cycle that adds a new claim must add a citation in the same format (author, year, retrieval date, source URL, why chosen, trade-off).

## Coverage sections note

The source doc carries attestation, trust-chain, least-privilege, continuous/adaptive, and cryptographic-identity coverage sections with a dated note (2026-09-17) that unsupported template paragraphs were removed from three of them. The attestation and cryptographic-identity sections remain as contribution claims; the trust-chain, least-privilege, and continuous/adaptive sections were pruned to notes only.
