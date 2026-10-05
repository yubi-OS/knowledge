# Contradiction-checking a decision log

Scope: how to systematically check a decision register’s rows against each other and against governing documents, how to distinguish a true contradiction from a sequencing dependency, and what a checked register should report.

## What the check is for

A decision log is a set of claims. Its value depends on the claims being mutually consistent: a register that contains two rows giving conflicting answers to the same question actively misleads, because readers assume the register was checked. Microsoft’s guidance frames the stakes: the ADR is effectively a record of how and why the system came to be its current shape, documenting all key decisions (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.94). If that record contains contradictions, the shape of the system becomes ambiguous to every future reader.

## The procedure: pairwise rows, plus governing documents

A contradiction check has two sweeps. The first compares rows against each other: two adopted decisions that gate on different sequences, two rejection reasons that cite the same governing document in opposite directions, a deferral whose unblock condition a rejected row forecloses. The second compares rows against the governing documents the rows cite: covenants, policies, mission statements, or the sources named in each row’s provenance field.

Tooling has begun to formalize this. One published prompt playbook describes an ADR consistency check that audits architecture decision records for contradictions, stale statuses, and missing supersession links (https://inferensys.com/prompts/documentation-and-api-reference-prompts/architecture-decision-record-and-system-overview-documentation/adr-consistency-check-prompt, jev weight 0.22, weak backing). The existence of a named check with three specific failure classes (contradiction, stale status, missing supersession link) is itself evidence that the three failure classes are the common ones.

A governance-oriented ADR repository automates part of the check in CI: a script validates supersession chains automatically, rejecting any multi-ADR pull request that does not form a valid supersession pair (https://github.com/ivanstambuk/adr-governance/blob/main/docs/adr-process.md, jev weight 0.74). The checkable invariant there is symmetry: if ADR-M supersedes ADR-N, then ADR-N must carry the matching superseded-by link.

## Contradiction versus sequencing dependency

The subtlest part of the check is classifying what it finds. Not every apparent conflict between two rows is a contradiction. A common pattern: document A says its section cannot complete until documents B and C land; B and C were opened after A. That is a sequencing dependency, not a contradiction, and the correct finding is not a conflict but a flag that the reconciliation step has not yet happened and should not be assumed done just because all the documents now exist.

The distinction matters because the two findings demand different actions. A contradiction demands that one of the rows change. A sequencing dependency demands that someone actually perform the deferred reconciliation once its blockers clear, and that the register stop describing it as pending afterward. A register that reports only no contradiction found has usually skipped the second half: listing the open sequencing dependencies it surfaced, with the one follow-up that closes them.

## What a completed check reports

A checked register should be able to state, for each candidate conflict found: the rows involved, the governing documents both cite, whether the conflict is real (one row must change) or a sequencing dependency (an action is owed), and the specific follow-up that would resolve it. The check itself should be re-run whenever a new decision is added that could contradict an existing row, which makes the check a standing maintenance procedure rather than a one-time audit.

## Cross-checks against the format fields

The contradiction sweep has natural hooks in the record fields covered elsewhere in this corpus: status fields (a row marked accepted that another row marks superseded is a stale-status failure), the supersession links (a missing link is a checkable defect per the CI-validated pattern above), and the rejection reasons (a rejection that cites governing section N can be mechanically re-verified against section N’s text). A register designed with these fields is contradiction-checkable by construction; a register of free prose is only checkable by reading everything again.

## Source quality note

The strong anchors here are Microsoft’s ADR guidance and the CI-validated supersession process. The consistency-check prompt playbook and tooling blogs are weak-to-moderate and used only to evidence the failure-class taxonomy, not as procedural authority.
