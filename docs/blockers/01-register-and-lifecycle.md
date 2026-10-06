# 01 - Register and Lifecycle

Scope: what the yubiOS blockers register is, its active-only retention policy, the reporting rule, and the review cadence that moves resolved blockers out of the table.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md). This is an internal-record subtopic, no dig.

## What the register is

The blockers register is a single file, `docs/BLOCKERS.md` in the yubi-OS/yubiOS repository, whose status line reads "active blocker register" and whose last-reviewed date is 2026-08-24 (source doc). It is deliberately narrow: it lists current blockers only. Historical blockers that were resolved by merged work move into ADRs, refs, or PR history rather than staying in the active list (source doc). This is the retention policy that keeps the register a working document instead of a graveyard: if a row's blocker is closed by a merge, the row leaves the table and the evidence lives in the artifact that closed it.

## The table's shape

The active table has 4 columns: ID, Area, Blocker, and Current next step (source doc). Every row carries a stable ID of the form `B-<AREA-SUFFIX>`, for example `B-ARM64-PATHA`, `B-RK3588-TPL`, `B-QEMU-ZBOOT`, `B-PINS`, `B-HARDENING-RUNTIME`, `B-REAL-FIDO2`, `B-BOOTC-SEAL`, `B-VGPU-VM-UNZIP`, and `B-ROCK1-OFFLINE` (source doc). Two structural conventions stand out:

1. Each row is required to name a "current next step", so no blocker can sit in the table without a documented unblock path (source doc).
2. Rows reference their evidence inline: run IDs (such as 29869527608 and 29525332901), linked refs documents, and ADRs (source doc).

As of the 2026-08-24 review the register carries 9 active rows (source doc).

## The reporting rule

The register's own reporting rule states that when a blocker changes state, the file and the relevant issue or PR report are updated, and resolved blockers must not be left in the active table just because they are historically important (source doc). The rule has two effects. First, blocker state changes are always written to 2 places at once: the register and the tracking artifact. Second, "historically important" is explicitly rejected as a retention criterion, which prevents sentiment from freezing the register.

## Not-current-blockers as a ledger section

The doc keeps a "Not Current Blockers" section separate from the table (source doc). Entries there record what stopped being a blocker and why, with the run, PR, and issue references that prove it. Examples recorded in the doc: the workflow-token-scope warning is obsolete in the current connected-app workflow; PQ TLS is not waiting for OpenSSL support because OpenSSL 3.5+ and Go 1.24+ provide default X25519MLKEM768 behavior; systemd v261 is reviewed, not future-only; swu2f Layer 2 is live for TEST-only VM validation; and B-VM-CTAP2 was resolved on 2026-07-25 after 2 root-caused bugs were fixed (source doc). This section is the register's transition buffer: an item leaves the active table only after its closure evidence is written down here.

## Review cadence and drift checks

The register is updated through dated review diffs: "Today's BLOCKERS.md diff (2026-08-01 review)" and "(2026-08-24 review)" each enumerate exactly what the review added or retired (source doc). The 2026-08-01 review added the B-VGPU-VM-UNZIP row and the "Self-hosted runner host-deps gap" permanent pattern, and no previously active blockers were retired (source doc). The 2026-08-24 review was a CI-infra recovery day: it added the B-ROCK1-OFFLINE row, confirmed the unzip fix in code, and recorded that all 7 failing infra workflows on main were green again (source doc).

Drift checks from 2026-09-18 (wayfinder round 10, cycle 11, and round 11, cycle 22) flag 2 stale rows in-register as review-request notes rather than row edits: B-VGPU-VM-UNZIP's retirement condition was met on 2026-09-09, and B-ROCK1-OFFLINE names a retired GPU runner (source doc). Register edits belong to the next review, so the drift check records the flag and leaves the mutation to the review process (source doc).

## What the lifecycle teaches

The register enforces dependency management as bookkeeping discipline: a blocker exists in the table only while it has an active next step, its state changes are recorded in 2 places, and closure is an archival move, not a deletion. In a hardware-coupled OS project where evidence is CI runs, board rehearsals, and signed artifacts, this means the dependency graph is always auditable from the register alone: every open dependency names its evidence and its unblock path.
