# 10. Exit Criteria: Moving Work Out Of FUTURE

Scope: the six criteria the ledger sets for moving an item out of FUTURE.md into ADR.md, SPEC.md, or implementation, and how the gate operationalizes the ledger's staging-area contract.

## The gate

The doc states the rule plainly: "Move an item into ADR.md, SPEC.md, or implementation only when the following are true" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). The six criteria are:

1. The trust boundary is clear.
2. Recovery and failure behavior are documented.
3. CI or real-hardware evidence is defined.
4. Required pins and upstream source references are recorded.
5. Notification and evidence-retention policies are defined when detection or deception is involved.
6. The change does not introduce a silent production/test artifact crossover.

## What each criterion encodes

Criterion 1 (trust boundary) is the project's first-order question. Every milestone in the ledger is organized around where trust sits: the boot chain in Milestone F (doc 02), the secure/normal world split in SecTime (doc 03), the kernel-firmware split in Frost (doc 04), the GPU memory domain in the vGPU work (doc 05), and the WireGuard trust model in Milestone Net (doc 08). An item that cannot state its trust boundary cannot be promoted because there is nothing to decide yet.

Criterion 2 (recovery and failure behavior) converts research optimism into operational honesty. Several milestones carry this inside them: SecTime requires recovery guidance for boards with only REE-backed time, Frost requires a recovery and failure sketch with its mailbox design, and Net requires documented recovery and false-positive handling before deployment is recommended (source doc).

Criterion 3 (CI or real-hardware evidence) is the gate's proof requirement. The doc distinguishes the two classes explicitly: CI evidence suffices where the artifact is testable in virtualization, and real-hardware evidence is demanded where it is not, as in Milestone F's board provisioning and the post-launch table's physical ROTPK/RPMB/OP-TEE rows (source doc).

Criterion 4 (pins and upstream references) ties promotion to the snapshot-drift discipline of doc 07: required pins live in `PINNED.md`, upstream source references follow the `CITATION.md` primary-source preference (source doc).

Criterion 5 (notification and evidence retention for detection or deception) is scoped to exactly the work that observes adversaries. It is the reason Milestone Net's section carries its own safety constraints on what is stored (no passwords or private keys by default, hash or redact when retention is needed) and its owner-notification channels with rate limits and deduplication (source doc). Detection work without a retention policy is not promotable.

Criterion 6 (no silent production/test artifact crossover) protects the boundary between what users run and what CI builds. The post-launch table's firmware row (volatile CI flags to be dropped from real hardware tags, source doc) is an example of this boundary being actively maintained.

## Why the gate has six criteria instead of one

A single criterion ("is it ready?") would let any strong-looking item skip the others. The list is conjunctive: all six must hold, so an item with excellent CI evidence but no documented failure behavior stays put. That matches the doc's overall design where each milestone section ends in an "evidence needed before promotion" list (docs 02, 03, 04, 08) that pre-assigns the gate's criteria to that milestone's specifics. The milestone lists are the gate made concrete per item; this section is the gate made uniform across items.

## The gate completes the ledger's lifecycle

Read against the rest of the corpus: work enters through the Near-Term Planning Cycle's evidence refreshes (doc 01), matures through milestones and inventories (docs 02 to 09), is held honest by the CI and Docs milestones (docs 06 and 07), and exits through this gate into ADR.md (accepted decisions), SPEC.md (active requirements), or implementation. The three destinations mirror the three states the doc's opening paragraph assigns to those documents, closing the loop with the ledger's own first paragraph (source doc).

## Sources for this doc

All claims come from the ground source: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Internal-record subtopic, no dig.
