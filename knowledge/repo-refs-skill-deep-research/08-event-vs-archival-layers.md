# 08 - Event Layer versus Archival Layer, and the Cross-Substrate Join

Scope: the two-substrate model of project knowledge, git plus the issue tracker as the event layer and a docs directory as the archival layer, and the cross-reference invariant that joins them.

## The event layer: git history

The event layer is the stream of what happened. Git is a free and open source distributed version control system designed to handle everything from small to very large projects (https://git-scm.com/, jev weight 0.93, high). Its user manual defines the historian's workflow: reading history to build and test a particular version of a project, to search for regressions, and to study how the project evolved (https://git-scm.com/docs/user-manual, jev weight 0.94, high). The distributed property is what makes the event stream complete: every developer working with a git repository has a copy of the entire repository, every commit, every branch, every file (https://github.com/git-guides, jev weight 0.62, high).

Issue-tracker events (issues, pull requests, priorities, statuses) sit alongside commits in this layer. They are the canonical record of decisions in motion: an issue opened, a PR merged, a priority changed.

## The archival layer: the docs directory

The archival layer is the synthesized knowledge: design specs, research outputs, decision records, and test documentation, stored as files in the repository. Using git for documentation is itself an established practice, covering setup, collaboration, and version control of docs alongside code (https://kindatechnical.com/software-documentation-best-practices/using-git-for-documentation.html, jev weight 0.18, weak). The perennial question of whether documents belong in the same repository as code is a live community debate rather than a settled rule (https://softwareengineering.stackexchange.com/questions/84966/should-git-be-used-for-documentation-and-project-management-should-the-code-be, jev weight 0.02, weak); both sources are weak-backed and serve as context only. What the archival layer needs beyond storage is structure: which topics exist, which are well covered, which are missing. That structure is what a docs-audit skill computes and what the event layer cannot answer, because events record actions, not knowledge.

## The join: traceability links

The two layers join through cross-references, and recovering those links has its own research lineage. The seminal 2002 work on recovering traceability links between source code and free-text documents proposed a method based on information retrieval, with the premise that programmers use meaningful names for program items such as functions, variables, types, classes, and methods (https://ieeexplore.ieee.org/abstract/document/10855629, jev weight 0.89, high). The modern follow-up extends that recovery problem as a live research area (https://ieeexplore.ieee.org/abstract/document/10855629, jev weight 0.89, high).

Regulated industries maintain the same join by convention: in pharmaceutical validation documentation, traceability, linking, and cross-referencing of validation documents is treated as critical to compliance, with validation identifiers and codes used for document mapping (https://www.pharmavalidation.in/validation-documentation/traceability-linking-cross-referencing/, jev weight 0.25, weak; https://www.pharmavalidations.com/document-architecture-traceability-and-cross-references/, jev weight 0.24, weak). Those sources are weak-backed, but they document the invariant in its strictest form: every artifact traces to every artifact it depends on.

## The invariant as an audit

The join makes an audit possible. In the two-substrate model, the archival layer's cross-references are machine-detectable markers (issue keys, pull request numbers, decision-record identifiers appearing inside doc bodies), and the event layer's identifiers are the join keys. The invariant is: every tracked event-layer item should have at least one archival-layer document cross-referencing it. A cycle can evaluate this invariant mechanically: extract identifiers from the archive, extract identifiers from the event stream, compute the unmatched set.

When the invariant is violated there are two possible readings, and they lead to different actions. A missing cross-reference may mean the knowledge does not exist yet, which is an archival gap that a deep-research fill should close. Or it may mean the knowledge exists but was never linked, which is a metadata defect the cycle should repair rather than research. The distinction matters because the fill mechanism (dispatching parallel research, per doc 07) is expensive, and spending it on a linking defect wastes a cycle.

## Why the split holds

The split is not organizational convenience; the two layers have different physics. The event layer is append-only and complete by construction (https://github.com/git-guides, jev weight 0.62, high), so it never needs curation, only querying. The archival layer is curated and incomplete by default: documents are written when someone decides to write them, so coverage drifts, and without an audit the drift is invisible. The event layer answers "what happened"; the archival layer answers "what do we know." A skills architecture that audits both, one per substrate, covers the two failure modes of project memory: lost events (solved by the distributed history, https://git-scm.com/docs/user-manual, jev weight 0.94, high) and lost knowledge (solved by the archival audit).
