# The Documentation Task Lane

Scope: the "Current Documentation Tasks" section of yubi-OS/yubiOS docs/TODO.md, the snapshot-drift prevention work it records, and the refs/ discipline it establishes.

## What the lane is for

The documentation lane is where the project prevents its own snapshots from lying. Most entries are already marked done, which is itself the signal: this is a maintenance lane that runs in short passes, and the open item at the bottom is the only one still live (source doc).

## Completed work items

The completed items, in the order the source doc lists them:

- A dated planning-cycle note for the 2026-07-11 research pass was added at refs/planning-cycle-2026-07-11.md.
- A scheduled upstream research refresh note was added at refs/research-refresh-2026-07-11.md.
- Refs that described v261, swu2f, swtpm, PKCS#11 signing, and zstd EFI zboot as future or stale were refreshed.
- Obsolete workflow-token warning language was removed from repo guidance.
- PINNED.md was made the explicit live source for image digests.
- Before systemd v262 adoption, docs and code were audited for /run/boot-loader-entries/, systemd-sysupdated D-Bus, and updatectl assumptions; the result is refs/systemd-v262-audit-2026-07-14.md.
- The 2026-07-16 VM e2e milestone from run 29525332901 was recorded at refs/vm-e2e-run-29525332901.md.
- The active install docs were switched from bootc install to-disk to bootc install to-filesystem --root-mount-spec="" so DPS auto-discovery remains explicit.
- Future planning cycles were kept dated and scoped under refs/: the 2026-07-17 SecTime, Frost, OpenWrt, roadmap-gate, hardening, ARM64 board, and firmware workflow refs.
- The complete requested-run review was recorded separately from green/red workflow status at refs/ci-evidence-2026-07-21.md.
- A dated systemd-family upstream snapshot and area-scaled contributor map were added at refs/systemd-upstream-progress-2026-07-21.md and assets/upstream-contributor-bubbles.svg.
- The attached EROFS/bootc proposal was audited against released bootc and composefs behavior, the practical split/ukify flow was corrected, and native bootc composefs was separated from the mkosi dm-verity path at refs/bootc-composefs-sealed-flow-2026-07-22.md (source doc).

Two of these items are structural decisions worth naming. Making PINNED.md the explicit live source for image digests means digest pins live in exactly 1 file, so the retired-items section of the same ledger can later forbid "repeating old digest examples from workflow logs as current pins" (source doc). Recording the requested-run review separately from green/red workflow status (the ci-evidence ref) separates "did the workflow pass" from "what did the run actually show", a distinction that matters when a green run hides a skip path.

## The one open item

The lane's single open task: "Reconcile the remaining composefs/dm-verity conflation in normative ADR, SPEC, threat-model, and mitigation text after the two build paths and migration policy are approved." (source doc). The condition attached to it is important: the reconciliation is scheduled after the two build paths and the migration policy are approved, not before. The project chose to let the 2026-07-22 audit ref carry the practical correction now and to defer rewriting the normative text until the decision itself is settled.

## The refs/ discipline

Across the completed items, a consistent discipline emerges for how documentation work is packaged:

- Every research pass, audit, and evidence review becomes a dated file under refs/, so the ledger can point at it with a stable name that encodes its date.
- Documentation tasks are scoped to one pass at a time ("Keep future planning cycles dated and scoped under refs/").
- The lane deliberately separates "planning-cycle notes" (what we intend to research) from "research refresh notes" (what we actually found) from "audit refs" (what we checked against reality).

## Teaching value

The lane shows what a small, high-leverage documentation backlog looks like in a hardware-coupled OS project: pre-adoption interface audits (the v262 audit runs before adopting systemd v262, not after), digest-source-of-truth consolidation, and conflation cleanup that is sequenced behind design approval. Every completed checkbox names the artifact it produced, which is what makes the ledger auditable after the fact.

Source doc: yubi-OS/yubiOS docs/TODO.md, fetched 2026-10-06 from https://github.com/yubi-OS/yubiOS/blob/main/docs/TODO.md (29130 bytes). This is an internal-record subtopic: all claims above are attributed to the source doc; no searXNG dig was run.
