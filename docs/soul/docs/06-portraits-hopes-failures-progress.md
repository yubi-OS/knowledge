# 06 - Portraits of hopes, failures, and progress (FUTURE.md, BLOCKERS.md, TODO.md, MILESTONE.md)

Scope: how the source doc reads FUTURE.md as evidence-bound hopes, BLOCKERS.md as failures converted into doctrine, TODO.md as honest unfinished work, and MILESTONE.md as auditable progress with drift corrections. This is an internal-record subtopic (blocker registers, run IDs, Linear mirror state, task lists): its grounding spine is the source doc, yubi-OS/yubiOS docs/SOUL.md, sections 9 to 12, and no external dig was run.

## Hopes with exit criteria

The source doc opens the FUTURE.md portrait with the milestones: "Milestones: ARM64 Owner-Owned Root Of Trust (Milestone F), Secure-World Time Evidence (SecTime), Firmware-Assisted GPU Resource Lockout (Frost), OpenWrt WireGuard Deception LAN (Net). Each milestone has a goal, a research shape, and an 'Evidence needed before promotion' list" (source doc, section 9).

The exit criteria are quoted in full: "Move an item into ADR.md, SPEC.md, or implementation only when the following are true: the trust boundary is clear; recovery and failure behavior are documented; CI or real-hardware evidence is defined; required pins and upstream source references are recorded; notification and evidence-retention policies are defined when detection or deception is involved; the change does not introduce a silent production/test artifact crossover" (source doc, section 9).

The reading: "my hopes are evidence-bound. Not vibes. Not funding pressure. Evidence. The 'Evidence needed before promotion' list is what distinguishes a hope from a fantasy. A hope without an evidence list is a feature request. A hope with an evidence list is research" (source doc, section 9).

The deferred ideas are part of the portrait too: "systemd-sysinstall as an optional guided installer path beyond current bootc and repart flows." "LUO/KHO live-update research for appliance or server deployments." "FIDO2-wrapped Secure Boot signing keys if upstream tools gain a clean hidraw path." The doc reads them: "These are deferred because the evidence isn't there yet. Deferring is not abandonment. It is honesty about state" (source doc, section 9). The closing: "my hopes are not promises. They are research programs with exit criteria. The discipline of naming exit criteria is what makes hope falsifiable. If the evidence arrives, the hope becomes a decision. If it doesn't, the hope stays in FUTURE.md and the corpus remembers what was being asked" (source doc, section 9).

## Failures converted into infrastructure

The source doc opens the BLOCKERS.md portrait with the register: "The first table has the active blockers: B-ARM64-PATHA, B-RK3588-TPL, B-QEMU-ZBOOT, B-PINS, B-HARDENING-RUNTIME, B-REAL-FIDO2, B-BOOTC-SEAL. Each row has a current next step" (source doc, section 10).

The "Not Current Blockers" section is the soul-portrait. B-VM-CTAP2 is RESOLVED with the run ID that proved it: "run 30139433902 / job 89629762908 proves the full chain end-to-end with no skips: host `bcvk --swu2f` uhid load -> in-guest `passless` -> `/dev/hidraw0` CTAP2 hmac-secret enumeration -> LUKS2 FIDO2 enroll/unlock PASS -> systemd-homed FIDO2 home create PASS -> `pamu2fcfg` FIDO2 registration OK -> `ssh-keygen -t ed25519-sk` OK" (source doc, section 10). The reading: "The resolution is not a generic 'fixed.' It is a run ID and the chain it proved" (source doc, section 10).

The "Permanent CI-Evidence Patterns" section is the doctrine: "failures become infrastructure when they're named. The systemd drop-in lex-sort rule lives there with its source (OMN-149), its mechanism ('5' 0x35 lex-sorts BEFORE upstream 's' 0x73), its cost ('/dev/vfio had existed in every yubiOS guest for 4 days before this was caught'), and its verification recipe ('`ls -1 usr/lib/<dir>/ | sort -u` - confirm yubiOS filename sorts AFTER every upstream package file it intends to override')" (source doc, section 10).

The closing: "my failure-tolerance is part of my soul. I do not hide my failures. I name them. I route around them. When the route is found, the failure becomes a doctrine. The systemd lex-sort rule was a 4-day failure. It is now a permanent CI-evidence pattern. The lesson was not the failure itself; the lesson was the conversion of failure into infrastructure. That conversion is what I am" (source doc, section 10).

## Unfinished work with evidence in the row

The source doc opens the TODO.md portrait with the coverage map: "The FUTURE.md coverage map at the top is the discipline: 'Use this map to keep FUTURE.md roadmap entries tied to active TODO work instead of letting roadmap-only sections drift'" (source doc, section 11). Current items: "ADR-033 (Misbehavior-Triggered PCI-Mediation Cutoff) is open as PR #151, status Pending until Jenny reviews + merges. The CI tasks list what is in flight: PQ TLS verification, QEMU zstd EFI zboot workaround version-gating, dev/prod isolation checks, sealed composefs lane promotion. The ARM64 tasks list what is blocked: ROTPK/fuse provisioning on sacrificial hardware, OP-TEE/StandaloneMM/RPMB-backed variables on ROCKPro64 hardware first, then ROCK 5B" (source doc, section 11).

The checked-items rule: "A checked box next to 'Validate the bcvk root SSH credential path' with the run 29872832727 citation is auditable. A checked box without citation is decoration. TODO.md's pattern is: checked items must carry evidence" (source doc, section 11). The closing reading: "my unfinished work is the most honest part of my corpus. The boxes are only true when the evidence is in the row" (source doc, section 11).

## Progress that is auditable and corrected

The source doc opens the MILESTONE.md portrait with the mirror: "MILESTONE.md mirrors the Linear project 'yubiOS Production Proof & Release Gates' (id `a9a0701b-d1be-448c-a194-e573c82bd9f8`, team OMNI-AGENT). The doc is explicit: 'this is a planning-only document - it summarizes workstreams and milestones, it does not duplicate TODO.md, BLOCKERS.md, or FUTURE.md'" (source doc, section 12).

The 4 milestones: "ARM64 Path A production proof (0%, all 4 child issues Backlog/Todo), Token-backed VM and CI coverage (65.6%, software-validated FIDO2 path fully delivered), Sealed composefs boot chain (6.25%, actual long pole), Runtime hardening and supply-chain validation (25%)" (source doc, section 12). Ownership is Linear-linked: "OMN-36/45/46/47 for ARM64. OMN-38/48/49/50 (Done) for VM coverage. OMN-43/51/52/53 for sealed composefs. OMN-40/54/55/61/62 for hardening" (source doc, section 12).

The review stamp and the drift correction are the discipline: "'Last reviewed against docs/BLOCKERS.md: 2026-07-30 review (sha 7501fa0c13a4). No new blocker retirements since this doc's prior review.' Drift correction is named explicitly: 'B-VM-CTAP2 - RESOLVED 2026-07-25. The 2026-07-25 version of this doc incorrectly named B-VM-CTAP2 as "the single highest-leverage blocker." That claim is no longer true'" (source doc, section 12).

The reading: "my progress is auditable. Every milestone has an owner (Linear issue), a percentage, and a path forward. I cannot claim progress I haven't made. The percentages are not vibes - they are the proportion of children in the milestone that are Done vs Backlog. Drift correction is the discipline of admitting when the doc was wrong" (source doc, section 12).

## What this portrait captures about the project's character

The four-file portrait captures a project whose relationship to its own future, past, and present is evidential: hopes carry exit criteria, resolutions carry run IDs, failures become named doctrine with verification recipes, checked work carries citations, and progress percentages are corrected in public when a prior claim turns out wrong (source doc, sections 9 to 12). The most distinctive trait the source doc names is the conversion move: a failure is not closed until it has been turned into infrastructure (source doc, section 10).

## Sources

Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md sections 9, 10, 11, 12. Internal-record subtopic, no dig: the content is blocker registers, run IDs, task lists, and Linear mirror state, all quoted from the source doc.
