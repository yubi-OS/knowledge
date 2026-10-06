# 07. Milestone Docs: Prevent Snapshot Drift

Scope: the ledger's rules for keeping documentation honest across time: dated planning notes, where run-specific digests may and may not appear, the distinction between two similarly named systemd hardening directives, and the citation hierarchy.

This is an internal-record subtopic, no dig: the section sets documentation process rules grounded in the source doc, with no external mechanisms to research.

## The four rules

The section states four rules (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md):

1. Add dated planning notes under `refs/` for each substantial research cycle.
2. Avoid hardcoding run-specific image digests outside `PINNED.md` unless the text clearly marks them as historical evidence.
3. Keep `RestrictFileSystems=` and `RestrictFileSystemAccess=` distinct in all hardening docs.
4. Prefer primary upstream sources in `CITATION.md`, then link repo-specific evidence from ADRs and refs.

## What each rule prevents

Rule 1 targets the disappearance of decision context. Research cycles produce conclusions that outlive the conversation that produced them; a dated note under `refs/` is the durable form, and the Near-Term Planning Cycle (doc 01) shows the ledger already consuming such artifacts: `refs/ci-evidence-2026-07-21.md`, `refs/systemd-upstream-progress-2026-07-21.md`, and `refs/planning-cycle-2026-07-11.md` are exactly the dated planning notes this rule requires.

Rule 2 targets one specific and very common form of doc rot: an image digest copied into prose. A digest is a point-in-time fact; once a newer image ships, prose that embeds the old digest either misleads or needs constant editing. The rule gives digests one home, `PINNED.md`, where they are expected to change, and allows prose copies only when explicitly marked as historical evidence. This keeps a clean separation between living pins and frozen evidence.

Rule 3 targets a naming collision with real consequences. `RestrictFileSystems=` and `RestrictFileSystemAccess=` are distinct systemd hardening directives, and hardening documents that blur them produce wrong configurations. The rule is written for "all hardening docs" across the repo, which makes it a repo-wide editorial invariant rather than a single-file fix. It is also a rare example in the ledger of a rule that exists purely because two names look alike.

Rule 4 targets provenance quality. The citation hierarchy is two-tier: primary upstream sources first in `CITATION.md`, then repo-specific evidence linked from ADRs and refs. This is the same principle the jev weighting in this corpus applies (primary and official sources score high, aggregators score low), applied as a standing documentation rule.

## The pattern across the rules

All four rules are about the same failure mode: documentation that silently stops matching reality. Dated notes (rule 1) make the timeline explicit. Digest pinning (rule 2) stops point-in-time facts from pretending to be current. The directive distinction (rule 3) stops semantic drift between similar names. The citation hierarchy (rule 4) keeps the authoritative record above convenience copies.

The rules also explain why this corpus's own ground source, FUTURE.md, carries a "Last reviewed" date at the top (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md) and a dated drift-check entry at the bottom (the 2026-09-18 wayfinder check, source doc): those are the file-level manifestations of the same snapshot-drift discipline this milestone codifies for the whole documentation set.

## Sources for this doc

All claims come from the ground source: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Internal-record subtopic, no dig.
