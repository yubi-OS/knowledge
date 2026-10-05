# 05 - External source refs: two-table updates and capability re-confirmation

Scope: bumping pinned commits for non-fork external dependencies: the reviewed-branch plus pinned-commit columns, cross-table updates, and re-confirming that the capability the pin exists for still works.

## What an external source ref pin promises

For each non-fork external dependency, the pinned record carries a reviewed branch or tag and a pinned commit. The pin's promise is not just "this version" but "this version, reviewed, with the specific behavior we depend on intact." Google Cloud's supply chain documentation makes the general case: external dependencies are the part of the supply chain you do not control, which is what makes them the more attack-prone half, and the mitigations are storing copies of dependencies in your own repository and controlling when upgrades happen (https://docs.cloud.google.com/software-supply-chain-security/docs/dependencies, jev weight 0.81). A pinned-commit table is that control in its most explicit form.

The yubiOS tree pins four such dependencies at the time the checklist was written: `docker/buildx`, `Mbed-TLS/mbedtls`, `pando85/passless`, and `qemu/qemu` (yubiOS refs: digest-bump-checklist-2026-07-25.md). Each bump updates the "Reviewed branch/tag" and "Pinned commit" columns for the specific dependency, and then the real work begins: the re-confirmation checks below, which are per-dependency because the capability each pin exists for is different.

## The re-confirmation principle

The principle behind every item in this checklist: a pinned commit was chosen because it provides a capability. A newer commit may provide that capability differently, partially, or not at all. Microsoft's zero-trust assessment guidance frames pinning to immutable references as the baseline control for third-party pipeline components, pairing commit-SHA immutability at the git level with immutable releases for packaged artifacts (https://microsoft.github.io/zerotrustassessment/hi/docs/workshop-guidance/devsecops/DS_032, jev weight 0.81). Immutability alone does not answer "does the new commit still do what we pinned the old one for"; only re-confirmation does.

Kusari's dependency-pinning guidance sorts pinning approaches into tiers and treats verification of what you pinned as part of the practice, not an afterthought (https://www.kusari.dev/blog/pinning-dependencies, jev weight 0.49, weak backing). The yubiOS checklist makes the same move concretely, with one named capability per dependency.

## Case: docker/buildx, the two-table dependency

Buildx is pinned both in the External GitHub Source Refs table (branch and commit) and, additionally, by SHA-512 in the Direct Workflow Downloads table, because its release binary payload is also fetched directly and hash-pinned (yubiOS refs: digest-bump-checklist-2026-07-25.md). A buildx bump is therefore a two-table update in one PR: the commit columns and the release asset's SHA-512 must move together, or the build fails the checksum gate on the old hash while the source ref claims a new version. The failure is fail-closed and correct, but it is a reviewable error, not a desired one.

## Case: pando85/passless, the capability pin

The passless pin exists for one named capability: it "enables soft-fido2's implemented `hmac-secret` extension at build time" (yubiOS refs: digest-bump-checklist-2026-07-25.md). A passless upgrade that drops or changes that extension would silently break the TEST-image in-guest CTAP2 authenticator path. The re-confirmation check is therefore specific: confirm the `hmac-secret` extension still exists and still works in the new pinned commit before updating the column. This is the clearest example in the checklist of why a generic bump automation cannot replace the review: the check requires knowing what the pin was for.

## Case: qemu/qemu, the cross-referenced pin

The QEMU pin must provide "ARM64 zstd-capable DirectBoot QEMU," and the checklist explicitly cross-references the open blocker tracking that capability: a QEMU bump interacts with the open blocker and should be cross-checked against it, not bumped in isolation (yubiOS refs: digest-bump-checklist-2026-07-25.md). The operational rule: when a pin's capability is also tracked as an open blocker or issue, the bump PR should reference that tracker item so the reviewer can see both the bump and the state of the capability discussion in one place. Bumping in isolation risks landing a commit that regresses the very capability the blocker is about.

## Case: Mbed-TLS/mbedtls, the plain pin

The remaining dependency has no named cross-table or capability entry in the checklist beyond the standard two-column update. That is itself informative: the checklist does not invent checks. Where a dependency has no special constraint recorded, the bump is the mechanical column update plus the ordinary review; where one does, the check is named. The pattern to carry away is "name the capability or say there is none," which keeps future maintainers from guessing which pins are load-bearing.

## What reviewers should look for

On an external-source-ref bump PR, the review sequence is: both columns updated for the named dependency; any cross-table hash updated in the same PR; the named capability re-confirmed against the new commit, with evidence (a build log, a test run, or a diff of the capability's code) rather than assertion; and any cross-referenced blocker or issue linked. Google's guidance to vendor or store copies of dependencies pairs with this: the pinned commit plus the stored copy is what makes the re-confirmation reproducible months later (https://docs.cloud.google.com/software-supply-chain-security/docs/dependencies, jev weight 0.81).
