# 08. Designing the Change-Artifact Manifest

**Scope:** Manifest design for change artifacts: linking leaf artifacts, tree structure, and a root hash so an improvement cycle produces one verifiable bundle.

## The manifest is the commitment, the tree is the mechanism

The Merkle manifest pattern is simple to state. From the F* proof-oriented tutorial: "by publishing just this root hash, and associating with each artifact a path in the tree from the root to it, a skeptical client can quickly check using a small number of hash computations (logarithmic in the size of the entire archive) whether or not a given artifact is authentic" (https://fstar-lang.org/tutorial/book/part2/part2_merkle.html, weight 0.73). The manifest therefore needs exactly two parts: a list of named leaves with their content hashes, and the computed root over those leaves. Everything else is convenience.

The leaf hashing rule is the one from the standard definition: "every leaf node is labelled with the cryptographic hash of a data block, and every node that is not a leaf" carries the hash of its children (https://en.wikipedia.org/wiki/Merkle_tree, weak backing, weight 0.70). For binary trees with an odd leaf count, implementations either duplicate the last leaf or promote it, and the manifest should state which convention it uses, because the convention changes the root value.

## Anatomy of a worked manifest

The worked example this corpus descends from manifests 6 artifacts into a SHA-256 tree:

1. `ods-untitled-1-37a4939f`, the raw spreadsheet bytes
2. `tex-learned-latent-curves-2026-08-06`, the paper source
3. `insight-single-action-atom`, the primitive statement
4. `three-regimes-eligible-deferred-refused`, the regime decomposition
5. `ratios-of-ratios-analysis`, the per-set ratio comparison
6. `whole-self-output-2026-08-07`, the session's whole-self output

The tree pairs them 3 ways at level 1 (ods+tex, insight+regimes, ratios+output), then 2 nodes at level 2, then 1 root. Each leaf name is a stable slug plus a discriminator (format, date, or id), so the manifest doubles as a human-readable index of the cycle's outputs. The published root, `3e32eef859a758db124e91aa04724f1bbc0481ef9968e600d7fcafb8f1d7ff4e`, is a 64-hex-character commitment; a single line that, if it matches, certifies all 6 artifacts together.

Design properties worth copying from that example:

1. Leaf names are semantic, not positional. An auditor can find "the insight statement" by name without knowing tree topology.
2. The pairing is recorded in the manifest, so root recomputation is deterministic for anyone.
3. The root is published in more than one place (a refs manifest, a tracker issue, a changelog), which is the external anchoring of doc 05.

## Manifest versus inventory formats

The software supply chain already ships a related artifact: the SBOM, "a machine-readable inventory of an application, identifying the packages your software relies on" (https://docs.cloud.google.com/artifact-analysis/docs/sbom-overview, weak backing, weight 0.34), and Jfrog describes it as a "comprehensive inventory of software components and dependencies" (https://docs.jfrog.com/security/docs/sbom, weak backing, weight 0.38). Guidance on supply-chain security puts inventory, signing, and verification together as the mitigation triad: "comprehensive inventory using Software Bill of Materials (SBOM), artifact signing and verification to ensure integrity and provenance, [and] continuous vulnerability scanning" (https://archman.dev/docs/security-architecture/application-security/dependency-and-supply-chain-sbom-signing, weak backing, weight 0.43).

A change-artifact manifest is the same shape of object with a different subject: it inventories the artifacts of one change rather than the dependencies of one build. Two practices transfer directly:

1. Every entry carries a content hash, so the inventory is self-verifying.
2. The manifest is signed or published alongside the thing it describes, so tampering with the inventory is as detectable as tampering with the artifacts.

Emerging traceability systems go further and bind manifests to content addresses: one platform "assigns each artifact a CID and tracks its movement, integrity, and versions across systems" and lets users "attach manifests or software bills of materials to the CID for supply chain visibility" (https://lattix.io/solutions/content-traceability, weak backing, weight 0.27). The CID linkage is the content-addressing property of doc 02 applied at the manifest level.

## Lifecycle of the root

Because a root commits to a set of leaves at one point in time, an evolving artifact set generates a sequence of roots. Each published root is a snapshot commitment; the sequence, signed and ordered, is the audit history of the artifact set (doc 02's "root as a point-in-time commitment"). Practical rules for the manifest:

1. Freeze before publishing. The leaf set is fixed at commit time; adding an artifact means a new manifest with a new root, never editing the old one.
2. Publish the root durably and externally. A root kept only beside the artifacts proves nothing if the storage is compromised.
3. Keep per-leaf inclusion paths alongside the leaves, so a verifier can check one artifact without recomputing everything.
4. State the hash algorithm and tree conventions in the manifest itself, so the recomputation procedure is unambiguous.

## What remains position rather than citation

The general mechanism is well grounded: the F* tutorial (0.73) and the standard Merkle definition (0.70) are strong sources, and the SBOM references (0.34 to 0.43) are weak but consistent across vendors. The specific manifest rules above, semantic leaf names, recorded pairings, multi-site root publication, freeze-before-publish, are the framework's own conventions, adopted because the worked example used them, and they should be treated as a proposal for standardization rather than an industry standard.
