# 03-acceptance

**Scope.** Acceptance: detailed analysis grounded in yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md, no external web dig

## Four acceptance criteria

The ground source defines acceptance for the org-wide bump in four bullets. All four must hold on the integration branch `org-upstream-bump-2026-10-17` before the advisor merges.

### Criterion 1: PINNED.md and its consumers agree

PINNED.md on the branch matches every decision in the inventory, and every consumer reads the same values. The test is concrete: a grep for each old SHA or version returns zero hits outside history notes.

This is a negative test, which is its strength. Checking that the new values appear proves only that something was updated. Checking that the old values are gone proves that no consumer was missed. Every row that changes contributes an old token to search for: for example, the old optee version 4.10.0, the old buildx v0.35.0, the old cosign v3.1.2, the old qemu commit 3a18e8a2, and the old action SHAs 59d89421 (attest), cd2ce8fc (deploy-pages), 37930b1c (download-artifact), 0b93645e (setup-python), bbbca2dd (upload-artifact), and d7f5e7f5 (setup-buildx-action). The carve-out "outside history notes" is necessary because PINNED.md and changelogs legitimately mention prior pins.

Note the interaction with rule 5: held items (edk2 stable202602, Mbed-TLS 4.x) keep their current values, so their pinned tokens are expected to remain. The grep applies to values that changed.

### Criterion 2: static checks green

Four checks must be green on the PR: lean-check, ci_dispatch-reachability, input-shape, and token-audit. The record names them without defining them. From their names, they cover a lint pass, whether dispatched workflows are reachable, the shape of workflow inputs, and token usage in workflows. The input-shape check is especially relevant to this bump, because four action rows are major-version bumps flagged "check inputs and runtime" or "check inputs" (download-artifact v8, setup-python v7, upload-artifact v7, setup-buildx-action v4). A major action bump can rename or remove inputs, and a workflow passing a removed input may fail or silently ignore it.

### Criterion 3: firmware verification build

The ci_firmware-rk verification build must be green with Docker push OFF on the branch head. The record states its purpose: this validates the optee bump in the firmware. optee_os and optee_ftpm are the only firmware forks that move (4.10.0 to 4.11.0); TF-A, u-boot, ms-tpm-20-ref and edk2 stay. A green firmware build on the branch head is therefore the end-to-end test of the two rebases. Docker push OFF follows rule 3.

### Criterion 4: fork compare checks

The fork compare checks must pass for optee_os and optee_ftpm. These are the rule-1 invariants: behind_by 0 against the 4.11.0 release commit, and ahead_by equal to the number of yubiOS commits kept. For optee_ftpm the expected ahead_by is 11. For optee_os it is the number of yubiOS-only commits after upstream-already-merged commits drop.

## What acceptance does not include

- No acceptance criterion requires a Docker push or an image publication. Publishing is outside the bump.
- No criterion covers the held items beyond their being recorded with reasons (rule 5).
- No criterion re-tests rows already done on main (dhi.io/debian-base at 6326b0b4, fedora-bootc:45 at 3e76363d).
- Release-binary checksum verification (SHA-512 for buildx, cosign, the static engine; the cosign_checksums.txt cross-check) is specified in the inventory rows rather than as a separate acceptance bullet; it is enforced through criterion 1 (the pinned digests consumers read) and through the build checks that consume them.
- The passless bump carries its own condition in the inventory: hmac-secret must remain implemented and test-image CI must pass.

## Mapping criteria to rules

| Criterion | Rule it verifies |
|---|---|
| 1. PINNED.md grep-clean | Rule 4 (consumers read the pin), rule 5 (holds recorded) |
| 2. Static checks | Rule 2 (CI green before merge) |
| 3. ci_firmware-rk, push OFF | Rule 2, rule 3 |
| 4. Fork compare checks | Rule 1 |

## Order of evaluation

Criterion 4 can run as soon as each fork lane finishes its rebase, independently of other lanes. Criteria 1 and 2 need the integrated branch. Criterion 3 needs the integrated branch head, since it builds the firmware with every pin applied. The natural order is therefore fork compare per lane, then integration, then static checks and grep, then the firmware build, then merge.
