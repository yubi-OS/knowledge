# 03. Git's Object Model as a Merkle History

**Scope:** Git's object model (blob, tree, commit) as a Merkle DAG: how version control natively makes every change unit tamper-evident, deduplicated, and addressable by hash.

## Three object types, one hash discipline

Git's internals documentation is the primary source for the object model. "A single tree object contains one or more entries, each of which is the SHA-1 hash of a blob or subtree with its associated mode, type, and filename" (https://git-scm.com/book/en/v2/Git-Internals-Git-Objects, weight 0.76). Every object in the store is identified by the hash of its own content, and every structural reference between objects is that hash rather than a pointer. The result is a directed acyclic graph in which content addresses content.

The three types compose upward. "A blob is used to store file data. A tree is basically like a directory: it references a bunch of other trees and/or blobs. A commit points to a single tree, marking it as what the project looked like at a certain point in time" (https://shafiul.github.io/gitbook/1_the_git_object_model.html, weak backing, weight 0.22). In practice "every commit, every tree, and every file is saved in the objects folder as a hash value. There is a unique hash value for every object" (https://www.geeksforgeeks.org/git/git-object-model/, weak backing, weight 0.18).

The Wikipedia article adds the deduplication consequence: "Git stores each revision of a file as a unique blob. The relationships between the blobs can be found through examining the tree and commit objects" (https://en.wikipedia.org/wiki/Git, weak backing, weight 0.13). Because the blob hash depends only on content, unchanged files share blobs across commits, and unchanged subtrees share whole tree objects. History storage is therefore incremental by construction, with no diff computation required for storage.

## The commit hash as tamper evidence

A commit object hashes not just its tree but also its metadata and, critically, the hash of its parent commit. That parent reference is what turns the object graph into an audit chain: "every Git commit contains a reference to its parent commit. This simple mechanism creates an unbreakable chain of history. If anyone modifies a past commit, all subsequent hashes change, making tampering immediately detectable" (https://www.logvault.app/blog/hash-chaining-explained, weak backing, weight 0.32). The same article notes this is exactly why the Git model is reused for audit logs: a log that commits its own entries into a hash chain inherits Git's tamper evidence without building new machinery.

Content sensitivity is total. "The commit hash changes if any single byte of content, metadata, or history changes," and Git is migrating from SHA-1 to SHA-256 for stronger collision resistance (https://wildandfreetools.com/blog/sha256-git-commit-hash-explained/, weak backing, weight 0.18). This is the property that makes a commit hash usable as an auditable identifier for a unit of change: the hash is simultaneously the address, the checksum, and the history position.

## Why this matters for the single-action atom

The single-action atom framework records one improvement per cycle and needs each improvement to be a separately verifiable object. Git supplies that without extra design:

1. Each cycle's change lands as one commit whose hash binds the full state, the message, the timestamp, and the parent.
2. The parent chain makes the sequence of atoms orderable and tamper-evident; no atom can be silently removed, reordered, or rewritten.
3. Attribution survives: reverting one atom is a well-defined operation because the atom is a single commit.

This is not an abstract analogy. Tamper-evident logging projects deliberately copy the pattern. One append-only audit service describes itself as "a multi-tenant, append-only audit logging service that provides cryptographic proof that audit history has not been silently rewritten. Each tenant maintains an isolated audit log with its own hash chain and external anchoring history" (https://github.com/Ashish-Barmaiya/attest, weak backing, weight 0.40). Another writes that "tamper-evident audit logs using SHA-256 hash chaining" follow "the same fundamental approach used in certificate transparency logs, git commits, and blockchain ledgers" (https://dev.to/robertatkinson3570/the-architecture-behind-tamper-proof-audit-logs-56ek, weak backing, weight 0.13).

## The gap Git alone does not close

Git proves history integrity for the repository's own contents. Two audit needs remain outside it, and they motivate the rest of this corpus:

1. Third-party verification. Anyone with repository access can verify the chain, but an external auditor has no public, independently verifiable commitment that the repository state existed at a given time. Transparency logs (doc 04) close that gap.
2. Cross-artifact binding. An improvement cycle typically produces artifacts that live outside the repo: measurements, logs, decision records, signed evidence. Binding those into the same verifiable structure requires an explicit Merkle manifest over the cycle's artifact set (docs 05 and 08), rather than relying on the commit tree alone.

Git's model is best understood as the proof that Merkle-structured history works at planetary scale and at zero marginal design cost: the pattern the framework applies to improvement-cycle artifacts is the one Git applies to every commit ever made.
