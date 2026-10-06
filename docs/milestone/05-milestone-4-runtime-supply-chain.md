# 05 Milestone 4: runtime hardening and supply-chain validation

Scope: the fourth milestone's scope and gates, its two parent issues, its done and open children, and the blockers that seed it. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## Scope and gates

The source doc defines milestone 4 as: "Back hardening and rebuildability claims with target-image runtime validation, pinned inputs, package-floor checks, immutable source resolution, and provenance expectations." (source doc). The recurring phrase is "claims": hardening and rebuildability are already asserted somewhere (static audits), and the milestone's job is to convert them into evidence gathered against a built target image.

Five evidence mechanisms are named (source doc):

1. Target-image runtime validation.
2. Pinned inputs.
3. Package-floor checks.
4. Immutable source resolution.
5. Provenance expectations.

The provenance mechanism has a recognized industry frame: SLSA is "a security framework. It is a check-list of standards and controls to prevent tampering, improve integrity, and secure" build and supply-chain artifacts (https://slsa.dev/, jev weight 0.52). Docker's own provenance documentation ties build provenance metadata to traceability and SLSA compliance (https://docs.docker.com/dhi/explore/security-concepts/provenance/, jev weight 0.49, weak backing, vendor documentation adjacent to but not the yubiOS build system).

## Linear ownership

The source doc assigns two parent issues with children under each (source doc):

- OMN-40, parent, Backlog, P3.
  - OMN-54, Bats hardening in target image, Backlog, P2.
  - OMN-55, systemd-analyze verify, Backlog, P2.
- OMN-41, parent, Backlog, P3.
  - OMN-61, digest-bump checklist, Done, P3.
  - OMN-62, package-floor checklist, Backlog, P3.

OMN-61 is the only Done item, and it is the supply-chain half (digest-bump discipline). The runtime half (OMN-54, OMN-55) is entirely unstarted.

## The runtime hardening tools named by the gate

OMN-55 names systemd-analyze verify. The tool's manual page documents systemd-analyze security (which produces a security exposure level for service units) and systemd-analyze verify (which verifies unit file correctness by loading them into a sandbox) as distinct subcommands (https://www.man7.org/linux/man-pages/man1/systemd-analyze.1.html, jev weight 0.25, weak backing, cited as mechanism reference). General hardening guidance describes systemd-analyze security as an automated security rating that serves as a starting point for hardening (https://www.ctrl.blog/entry/systemd-service-hardening/, jev weight 0.17, weak backing). The source doc itself records what the runtime evidence must be: static audit complete, runtime Bats/systemd-analyze verify still needed against a target image (source doc, blocker B-HARDENING-RUNTIME below). Bats is the bash automated testing system, used here to execute hardening checks inside the actual built image rather than against the source tree.

## Seeded blockers

Two blockers seed this milestone per BLOCKERS.md as of its 2026-07-25 review (source doc):

- **B-HARDENING-RUNTIME**: static audit complete, runtime Bats/systemd-analyze verify still needed against a target image.
- **B-PINS**: base-image digest changes require explicit PINNED.md updates.

B-PINS is the process counterpart of OMN-61 (Done) and OMN-62 (package-floor checklist, Backlog P3). The distinction between the two is worth holding: a digest-bump checklist governs how pin updates happen, while package-floor checks govern whether the packages reachable through those pins still meet minimum-version floors. The composefs-kernel-floor class of requirement is the concrete example of why floors matter: composefs enforcement options depend on kernel versions as high as 6.6 for verity=require, so a floor check is not paperwork, it is what keeps a pinned base from silently breaking a security property.

## Status

The source doc records status as of 2026-07-28: "25% — OMN-61 done; OMN-54/55/62 Backlog, no recent activity." (source doc). The source doc also states the dependency that gates this milestone from the other side: "target-image runtime hardening meaningless without a sealed chain" (source doc, dependency note under milestone 3). Runtime evidence collected against an unsealed image would not prove the sealed-chain properties, so this milestone's runtime validation inherits milestone 3's criticality.

## What the gate does not require

The milestone does not require new hardening rules; it requires evidence that existing hardening survives into the built image. That is why the source doc phrases the workstream as "turning static hardening audits into target-image runtime evidence" (source doc): the audits exist, the transfer of evidence class is the milestone. This makes it the most process-shaped of the four milestones, and the one where the checklist artifacts (OMN-61 Done, OMN-62 pending) are themselves the deliverables.
