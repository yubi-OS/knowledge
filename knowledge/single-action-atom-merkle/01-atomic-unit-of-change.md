# 01. The Atomic Unit of Change

**Scope:** What makes a change atomic and auditable: the smallest unit of change in databases, version control, and improvement cycles, and why one atomic action per cycle is the smallest honest audit unit.

**Source quality note:** every source backing this doc scored below the 0.5 authority threshold in the dig weighting. Claims below are labeled weak backing and should be treated as working definitions rather than settled canon.

## The definition inherited from databases

The canonical definition of atomicity comes from database systems: a transaction is "an indivisible and irreducible series of database operations such that either all occur, or none occur" (https://en.wikipedia.org/wiki/Atomicity_(database_systems), weak backing, weight 0.47). Atomicity is the first of the ACID properties, alongside Consistency, Isolation, and Durability (same source, weak backing).

The atomic commit refines this for multi-step work: it "fulfils two of the key properties of ACID, atomicity and consistency," and consistency is only achieved if each change inside the commit is itself consistent (https://en.wikipedia.org/wiki/Atomic_commit, weak backing, weight 0.45). The same article carries a useful physical caveat: "due to modern hardware design of the physical disk on which the database resides true atomic commits cannot exist," meaning atomicity is always a protocol-level guarantee layered over imperfect hardware (weak backing).

A distributed-systems formulation strips it to the essence: "an atomic commit is an operation that applies a set of distinct changes as a single operation. If the changes are applied, then the atomic commit is said to have succeeded" (https://kwahome.medium.com/distributed-systems-transactions-atomic-commitment-sagas-ca79ac156f36, weak backing, weight 0.12).

## Why the unit matters for audit

An audit needs a boundary. If a change can be partially applied, the auditor has to reconstruct which fraction of the intent landed, and every downstream claim about the change inherits that ambiguity. The atomic unit is the answer because it has exactly two observable states: applied or not applied.

The data-modeling literature makes the same move at a smaller scale. "Atomic data is the smallest, indivisible unit of information in a system" (https://scienceinsights.org/what-is-atomic-data-definition-types-and-uses/, weak backing, weight 0.19). The analogy is deliberate: whatever the granularity, the unit must not decompose further without losing meaning.

## The atomic commit in version control

Version control imports the transactional idea directly. In Git, "an atomic commit refers to the practice of creating commits that are self-contained and independent units of work. It means bundling the changes related to a logical change into a single commit, making it the smallest possible unit" (https://wu101.com/blog/atomic-commits/, weak backing, weight 0.09). The same source adds the discriminating rule that makes the unit real: changes in the same file can belong to different logical changes, and should be split into different commits (weak backing).

This is the operational form of the single-action atom. One commit, one intent, one reviewable and revertible unit. Recent engineering practice pushes the same shape into agent-driven code production: enterprise teams pair atomic commits with quality gates "to make agentic code review auditable, safe, and compliant at scale" (https://qwavelabs.io/blog/atomic-commits-and-quality-gates-how-enterprise-engineering-teams-are-making-agentic-code-changes-auditable-and-safe-to-ship, weak backing, weight 0.15). The auditable unit there is not the agent session and not the individual file edit; it is the commit that passed the gate.

## The single-action atom as one commit per cycle

The framework this corpus documents takes the discipline one level up: an improvement cycle admits exactly one atomic action. The properties required of it are the transactional ones, restated for process:

1. Indivisibility. The action either fully lands or fully does not. A cycle that edits three files and re-runs two experiments has smuggled three actions into one unit.
2. Composability. Consecutive atoms must chain: the state after atom N is the state atom N+1 starts from, the way a database commit leaves a consistent state for the next transaction (https://en.wikipedia.org/wiki/Atomic_commit, weak backing).
3. Addressability. The unit must be nameable after the fact, by a hash or identifier, so an auditor can cite it. This is what the Merkle-structured artifact in doc 08 provides.

The reason to insist on exactly one action per cycle is statistical, not aesthetic. When a cycle bundles several actions, a regression cannot be attributed, and the improvement signal of the loop degrades into noise. When each cycle carries one action with a measured before and after, the delta belongs to exactly one candidate idea. That attribution property is what makes the sequence of cycles a legitimate experiment log rather than a diary.

## What the weak source base means here

The dig for this doc returned 24 results and none crossed the 0.5 authority threshold; the two Wikipedia articles on atomicity and atomic commits came closest at 0.47 and 0.45. The definitions above are therefore anchored to widely-agreed textbook material whose online restatements are individually weak, not to primary specifications. The composite claim of this doc, that the smallest honest audit unit is one atomic action per cycle, is an engineering position built on those definitions, and it should be validated against a project's own changelog and commit history rather than cited as established literature.
