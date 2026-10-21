# 04-falsification-gates-and-empirical-results

**Scope.** Pre-registered gates, measured empirical numbers, and verification verdicts. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md, no external web dig

## Gates in an upgrade plan

The ground source is a plan rather than an experiment, so its gates are acceptance gates and pre-registered invariants rather than statistical tests. Each gate is fixed before any lane runs, which is the same pre-registration discipline used elsewhere in yubiOS records: the pass condition is written down first, and lanes cannot redefine it after seeing results.

## Pre-registered invariants

| Gate | Invariant | Applies to |
|---|---|---|
| Fork compare | behind_by = 0 against release commit | optee_os, optee_ftpm (and any other rebased fork) |
| Fork compare | ahead_by = number of yubiOS commits kept | optee_ftpm: 11; optee_os: count after upstream-merged drops |
| Backup tag | `pre-bump-2026-10-17` exists on old tip before rewrite | every rebased or force-updated fork |
| Pin grep | old SHA or version: 0 hits outside history notes | every changed row |
| Static CI | lean-check, ci_dispatch-reachability, input-shape, token-audit green | integration PR |
| Firmware build | ci_firmware-rk green, Docker push OFF, branch head | integration branch |
| Checksum | SHA-512 per asset; cosign cross-checked against cosign_checksums.txt | buildx (amd64, arm64), cosign, static engine (4 artifacts) |
| Image digest | multi-arch INDEX digest | buildkit, hadolint |
| Functional | hmac-secret still implemented; test-image CI passes | passless |

## The empirical record the plan carries

The record contains measured or observed facts, not just intentions. These are the numbers a reviewer can check:

| Fact | Value |
|---|---|
| Source-of-truth commit | PINNED.md on main at 3e76363d |
| optee_ftpm yubiOS commits to rebase | 11 |
| bcvk yubiOS commits kept | 41 |
| mkosi yubiOS commits kept | 27 |
| arm-trusted-firmware yubiOS commits | 0 (fork pin equals release commit) |
| docker static engine artifacts | 4 |
| Actions bumped to new SHAs | 6 |
| Actions already latest | 3 (checkout, configure-pages, upload-pages-artifact) |
| Base images refreshed on main | 2 (debian-base at 6326b0b4, fedora-bootc:45 at 3e76363d) |

## Version deltas

| Item | From | To | Delta class |
|---|---|---|---|
| optee_os, optee_ftpm | 4.10.0 | 4.11.0 | minor |
| docker/buildx | v0.35.0 | v0.38.0 | minor (3 steps) |
| Mbed-TLS | 3.6.6 | 3.6.7 | patch; 4.2.0 held |
| passless | v0.11.2 | v0.20.2 | minor, 9 steps in a 0.x line |
| cosign | v3.1.2 | v3.1.3 | patch |
| buildkit | v0.31.2 | v0.34.0 | minor (3 steps) |
| hadolint | v2.14.0 | v2.15.1 | minor |
| qemu | 3a18e8a2 | v11.1.2 commit | to a tagged release |
| actions | various | 4 major, 2 non-major | see inventory |

The passless jump deserves attention: a 0.x project with 9 minor steps between pins may carry breaking changes, which is why the plan attaches a functional condition (hmac-secret must remain implemented) rather than relying on version semantics.

## Held hypotheses

Two items are framed as hypotheses that must be proven before a bump:

1. **edk2-stable202608 is compatible** with the StandaloneMM ArmBaseLib used by the pre-removal edk2-platforms snapshot. Owner: Lane E. Until proven, edk2 stays at stable202602.
2. **Mbed-TLS 4.x is compatible with TF-A v2.15.** Until proven, Mbed-TLS moves only within the 3.x line (to 3.6.7).

Each hold is falsifiable: Lane E either builds StandaloneMM with 202608 or it does not, and TF-A v2.15 either builds and tests against Mbed-TLS 4.2.0 or it does not. The plan's rule 5 requires the outcome, held or released, to be written into PINNED.md with the reason.

## What counts as a verdict

The plan defines success at two levels. A lane succeeds when its own invariants hold (compare check for forks, checksums for binaries, digests for images). The bump succeeds only when all four acceptance criteria hold on the integrated branch, after which the advisor merges. No lane verdict is final until integration CI is green.

## Results not yet in the record

The ground source is dated 2026-10-17 and records the plan, the inventory, and two already-completed rows (the base images on main). It does not record the outcome of the rebases, the Lane E compatibility test, or the integration CI run. Those are the empirical results the gates above exist to capture.
