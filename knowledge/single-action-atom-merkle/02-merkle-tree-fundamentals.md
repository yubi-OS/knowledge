# 02. Merkle Tree Fundamentals

**Scope:** Merkle tree structure, hash chaining, inclusion proofs, and content addressing: the substrate that makes an artifact tamper-evident and independently verifiable.

## The structure

A Merkle tree, also called a hash tree, is "a tree in which every leaf node is labelled with the cryptographic hash of a data block, and every node that is not a leaf" is labelled with the hash of its children (https://en.wikipedia.org/wiki/Merkle_tree, weak backing, weight 0.70). Hashes propagate upward: each level is the hash of the concatenation of the hashes below it, until a single root summarizes the entire dataset. Changing one leaf changes its hash, then every hash on the path to the root, then the root itself. The root is therefore a fixed-size commitment to all the content beneath it.

The property that matters for auditable artifacts is verification cost. The F* proof-oriented tutorial states it precisely: "by publishing just this root hash, and associating with each artifact a path in the tree from the root to it, a skeptical client can quickly check using a small number of hash computations (logarithmic in the size of the entire archive) whether or not a given artifact is authentic" (https://fstar-lang.org/tutorial/book/part2/part2_merkle.html, weight 0.73).

## Inclusion proofs

The per-artifact path is the inclusion proof, sometimes called an audit proof: "a short list of hashes that proves one leaf is a member of a Merkle tree with a given root, without revealing or requiring any of the other leaves" (https://www.truestamp.com/knowledge/merkle/inclusion-proofs, weight 0.63). A verifier needs only the leaf hash, the sibling hashes along the path, and the published root. This is what lets an auditor confirm one entry of an artifact bundle is genuine without holding the whole bundle.

Contrast this with a plain hash chain, where proving an entry exists requires walking "the entire chain from that point to the end. For a log with a million entries, that's a million hash computations. A Merkle tree fixes this. Log entries are grouped and arranged into a binary tree of hashes" (https://dipankar-das.com/blog/merkle-hash-chain-audit-logs/, weak backing, weight 0.35). The chain proves ordering cheaply; the tree proves membership cheaply. An auditable change artifact usually wants both.

## The root as a point-in-time commitment

A root hash is only meaningful if you record when it was computed. An append-only audit-log design captures this directly: "the merkle root changes with every append. Capturing the root at a point in time creates a cryptographic commitment to the entire log up to that point. If any record is later modified, the root would be different" (https://tailoredshapes.github.io/merkql/examples/audit-trail.html, weight 0.51). A sequence of signed roots is therefore a tamper-evident history of the artifact set itself: each root commits to a snapshot, and a modified historical leaf fails every root published after the edit.

Audit-logging systems apply exactly this shape. One implementation "uses the SHA3-256 hashing function to build and maintain an efficient Merkle tree over the audit log entries. It allows creating verifiable inclusion proofs for any leaf (audit log entry), greatly enhancing batch integrity verification and tamper detection" (https://deepwiki.com/yethikrishna/QuantumCrypt-AI/7.1-audit-logging-and-merkle-tree-integrity, weight 0.53). The unit of proof is the individual log entry; the unit of commitment is the batch.

## Content addressing

The same structure underlies content-addressed storage. IPFS's data lifecycle describes the first stage as "address it by CID. This is a local operation that takes arbitrary data and encodes it so it can be addressed by a CID. This is also known as merkleizing the data, because the input data is transformed into a Merkle DAG" (https://docs.ipfs.tech/concepts/lifecycle/, weight 0.81). In a Merkle DAG the identifier of a node is derived from its content and the identifiers of its children, so an artifact's address is a statement about its contents. Two artifacts with identical content share an address; an artifact whose content was altered no longer resolves to the original address, so substitution is structurally impossible to hide.

Source-control systems use the same primitive: "git and others use them to efficiently store the repository history in a way that enables de-duplicating the objects and detecting conflicts between branches" (https://docs.ipfs.eth.link/concepts/merkle-dag/, weak backing, weight 0.45). Doc 03 develops the Git case in full.

## Why this is the artifact substrate

For an auditable unit of change, the Merkle tree delivers three properties no flat manifest can:

1. A single root hash that commits to every component artifact, publishable in one line.
2. A logarithmic-cost inclusion proof per artifact, so third parties can verify one component without holding the rest.
3. Structural tamper detection, since any modification changes the root and invalidates prior published commitments.

The worked example this corpus descends from applies all three: six artifacts (a spreadsheet, a paper source file, an insight statement, a regime decomposition, a ratio analysis, a whole-self output) hashed as leaves, paired into 3 nodes, then 2, then a single root, recorded as the cycle's auditable commitment. The design question of doc 08 is how to structure that manifest so the root stays verifiable as artifacts accumulate across cycles.
