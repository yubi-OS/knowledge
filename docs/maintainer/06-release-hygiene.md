# Release Hygiene

Scope: the three rules the maintainer playbook applies to anything yubiOS publishes. Internal-record subtopic, no dig: the rules come from the source doc (yubi-OS/yubiOS docs/MAINTAINER.md).

## Rule 1: a release cites its full provenance

A release or publish path must cite the branch, commit, workflow run, and artifact/tag (source doc). Four coordinates, all required. The branch says which line of development the release came from; the commit pins the exact tree; the workflow run points at the machine-executed build that produced it, with its logs; the artifact or tag is the published object itself. A release that cannot cite all four is not auditable: there is no way to answer later what was shipped, how it was built, or whether the published object matches the reviewed code.

This rule is the release-time extension of the CI triage rule that old-sha reruns do not validate current `main`. Both rules insist that evidence attach to the specific object being claimed.

## Rule 2: digest bumps update PINNED.md and carry floor evidence

Digest bumps should update `PINNED.md` and include evidence that required package floors still hold (source doc). Two requirements in one rule. First, the digest change lands in the file the source-of-truth map designates as the only live digest source; this closes the consistency flag that historical digests in ADRs and old workflow logs are not current pins. Second, the bump carries evidence that the required package floors are still satisfied by the new digest. A bump that raises a base image may pull in newer package versions (which is fine) or drop below a required floor (which is not), so the evidence obligation is what makes the bump safe to merge rather than a silent dependency regression.

## Rule 3: classification before publication

New artifacts need explicit production/test classification before publication (source doc). The classification is explicit and it happens before publication, not after. This is the general form of the consistency flag that TEST-only swu2f/dev images must remain isolated from production tags: the swu2f/dev family is the known standing case, and the rule covers every future artifact the project starts publishing. An unclassified artifact is by definition not ready to publish.

## The rules as a chain

The three rules sequence naturally across a release:

1. Build and publish with full provenance citations (branch, commit, workflow run, artifact or tag).
2. If the release changed any pinned digest, land the bump in `PINNED.md` with floor evidence in the same change.
3. Classify every new artifact as production or test before it goes out.

Each step produces a record the next step can consume, and each maps back to a standing structure in the repo: the PR landing bar supplies the review surface, `PINNED.md` supplies the digest authority, and the test/production classification supplies the namespace discipline that keeps experimental images out of production tags.

## Relationship to the rest of the playbook

Release hygiene is where the maintainer playbook's general evidence discipline becomes highest-stakes: a release is the point where project state leaves the repository and becomes an artifact others consume. The rules therefore demand the same citation rigor the research cycle demands of claims, applied to the objects that leave the building.
