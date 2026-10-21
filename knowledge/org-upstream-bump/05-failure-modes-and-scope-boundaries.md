# 05-failure-modes-and-scope-boundaries

**Scope.** Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md, no external web dig

## Failure modes the plan anticipates

The ground source does not list failure modes under that heading, but each rule and condition exists to prevent a specific failure. This doc names them.

## F1: losing fork history in a rebase

A rebase or force update moves a branch pointer and can leave the old tip unreachable. If a yubiOS-only commit is dropped by mistake, there is no easy recovery. Prevention: the `pre-bump-2026-10-17` backup tag on the old tip, and "never delete old history". Detection: the compare-API ahead_by check, which must equal the number of yubiOS commits kept.

## F2: dropping the wrong commits in optee_os

The optee_os row allows one kind of drop: commits already merged upstream. Every yubiOS-only commit must be preserved. The failure is a commit that looks upstream-merged but is not (for example, a partial backport), and gets dropped. Prevention: compute the expected ahead_by before the rebase from an explicit list of kept commits.

## F3: a partial pin update

A version changes in PINNED.md but some consumer still reads the old value from a hard-coded location. Builds then mix versions. Detection: the acceptance grep for every old SHA or version, which must return zero hits outside history notes.

## F4: major action bumps with changed inputs

Four action rows are major bumps flagged "check inputs and runtime" or "check inputs": download-artifact v8.0.2, setup-python v7.0.0, upload-artifact v7.0.2, setup-buildx-action v4.4.1. A renamed or removed input can break a workflow or be silently ignored. Detection: the input-shape check in acceptance criterion 2.

## F5: incompatible firmware dependencies

Two holds exist because the obvious bump might break the build: edk2-stable202608 against the StandaloneMM ArmBaseLib in the pre-removal edk2-platforms snapshot, and Mbed-TLS 4.x against TF-A v2.15. Prevention: HOLD until proven compatible.

## F6: tampered or mismatched binaries

Release assets downloaded by version can change or be substituted. Prevention: SHA-512 for buildx (linux amd64 and arm64), for each of the 4 static engine artifacts, and for cosign, which is also cross-checked against `cosign_checksums.txt`. Container images are pinned by multi-arch INDEX digest so every architecture is covered by one immutable reference.

## F7: functional regression in passless

passless jumps from v0.11.2 to v0.20.2. The plan requires hmac-secret to remain implemented and test-image CI to pass. The failure is a release that drops or changes hmac-secret, which yubiOS relies on for FIDO2-derived secrets.

## F8: verification with side effects

A lane's test build pushes an image or writes a status card, and the result is mistaken for a released artifact. Prevention: rule 3, no Docker push and no card writes; verification dispatches run with push OFF.

## F9: lanes merging independently

Two lanes each pass alone but conflict together, or one lane merges a half-finished change. Prevention: rule 2, only the advisor merges, from one integration branch, after green CI.

## F10: silent skips

An item is not bumped and nobody records why, so a later reviewer cannot tell a decision from an oversight. Prevention: rule 5, every hold or refusal recorded in PINNED.md with the reason.

## Explicit scope boundaries

| In scope | Out of scope |
|---|---|
| Moving every consumed upstream to its latest stable release | Moving to non-stable or pre-release versions |
| Rebasing carried fork commits onto the release | Changing the content of carried yubiOS commits |
| Updating PINNED.md and every consumer | Docker pushes or image publication |
| Proving or disproving two compatibility holds | Bumping held items without proof |
| Verification builds with push OFF | Card writes or status artifacts from lanes |

## Explicit non-changes

The plan records several deliberate non-changes, each with a reason: arm-trusted-firmware (pin equals release commit, zero yubiOS commits), bcvk (release is latest, 41 commits stay), mkosi (27 commits stay), ms-tpm-20-ref, u-boot, edk2-platforms (no stable tags), and three already-latest actions. jekyll-build-pages is "verify, bump only if a newer build exists", a conditional rather than a commitment.

## What the plan does not claim

- It does not claim edk2-stable202608 or Mbed-TLS 4.x is incompatible, only unproven.
- It does not claim the optee rebases are conflict-free; the compare check and firmware build are how that is established.
- It does not claim the bump is complete on 2026-10-17; only the two base-image rows are recorded as done on main.
