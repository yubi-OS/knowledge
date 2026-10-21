# 06-integration-and-operational-governance

**Scope.** Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md, no external web dig

## PINNED.md as the integration contract

The ground source makes one file the hub of the whole operation: PINNED.md on main, at 3e76363d when the plan was written. The goal statement has three parts, and all three route through that file: every upstream sits at its latest stable release, carried fork commits are rebased onto that release, and every consumer reads the pin from PINNED.md. Consumers do not embed their own version strings; they read the pin. That is what makes an org-wide bump possible as one coordinated change.

## Lanes and the advisor

The plan's operating model is parallel lanes with a single integrator.

- Lanes do the work per item or group: fork rebases, binary checksum updates, image digest updates, action SHA updates, and Lane E's edk2 compatibility test.
- Lanes never merge to yubi-OS/yubiOS main.
- The advisor integrates every lane's output into one branch, `org-upstream-bump-2026-10-17`, and merges only after CI is green.

This separation means each lane's blast radius is limited to its own items, while the advisor owns the combined result. It also means a lane's self-report is never the merge signal; green CI on the integrated branch is.

## Provenance per pin

Rule 4 requires each changed PINNED.md row to cite the release commit and the approved source commit. Combined with the pin types the inventory specifies, every row ends up with an immutable reference:

| Artifact class | Immutable reference |
|---|---|
| Forks | Release commit plus rebased tip, verified by compare API |
| Release binaries | SHA-512 per asset (cosign also cross-checked against cosign_checksums.txt) |
| Container images | Multi-arch INDEX digest |
| GitHub Actions | Full commit SHA (e.g. attest 1e69f48a, setup-buildx-action f87e5991) |
| qemu | The commit behind v11.1.2, not the tag name |
| Base images | Refreshed by fetch-dhi-manifest and fetch-fedora-bootc-manifest |

These references are the inputs to the supply-chain controls elsewhere in yubiOS: cosign verification tooling pins move with the cosign bump, and actions/attest moves to v4.2.2.

## Audit trail

The audit trail of the bump has five layers:

1. **Backup tags.** `pre-bump-2026-10-17` on every old fork tip before rewrite. Old history is never deleted.
2. **Compare-API results.** behind_by and ahead_by for each rebased fork.
3. **PINNED.md diffs.** Each changed row with its two cited commits; each hold or refusal with its reason.
4. **CI runs.** lean-check, ci_dispatch-reachability, input-shape, token-audit, and ci_firmware-rk with push OFF on the branch head.
5. **The merge commit** made by the advisor on main.

A reviewer months later can reconstruct, for any pin, what it was, what it became, which commit it came from, why it was held if it was, and which CI run approved it.

## Automation already in place

Two rows were completed on main before the plan: dhi.io/debian-base refreshed by `fetch-dhi-manifest` (6326b0b4) and `quay.io/fedora/fedora-bootc:45` refreshed by `fetch-fedora-bootc-manifest` (3e76363d, the same commit as the PINNED.md source of truth). These show the steady-state pattern the plan aims for: a dedicated fetch workflow refreshes a pin and lands it on main through the normal process.

## Interaction with the firmware chain

The firmware forks form a chain: TF-A (v2.15.0), OP-TEE OS and the fTPM TA (both moving to 4.11.0), the Microsoft TPM reference (v1.83r1), edk2 and its StandaloneMM component (held at stable202602), and u-boot (v2026.10). Only the OP-TEE pair moves, and the plan validates that move end to end with ci_firmware-rk. Mbed-TLS is tied to TF-A: its 4.x line is held pending proof of compatibility with TF-A v2.15.

## Governance properties

- **Single source of truth:** one file, one commit reference.
- **Single integrator:** the advisor, gated on green CI.
- **No side effects during verification:** no push, no card writes.
- **Reversibility:** backup tags plus never deleting history.
- **Explicit holds:** recorded with reasons, so each one names the evidence that would release it.

## Open items at the time of the record

1. Lane E: prove or disprove edk2-stable202608 compatibility.
2. Mbed-TLS 4.x: prove or disprove TF-A v2.15 compatibility.
3. jekyll-build-pages: check whether a newer build exists.
4. Execute the bumps, run the compare checks, integrate, run acceptance, merge.
