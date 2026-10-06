# 05: Release series boundaries and cadence

Scope: what a minor-version boundary marks, how release series (.x series) are used in OS-style projects, and how cadence is set.

## What a series boundary is

Within a MAJOR version, the MINOR number partitions releases into series: 0.7.x and 0.8.x are different series, and moving between them is a boundary event. The spec backs the bookkeeping rule at the boundary: when the major version is incremented, minor and patch MUST be reset to 0 [1]. Within a series, the patch number moves fastest and carries no feature semantics; crossing a minor boundary is the moment feature-level semantics change.

## Precedence makes series ordering total

SemVer precedence guarantees a total order across series: when major, minor, and patch are equal, a pre-release version has lower precedence than the normal version [2] (authoritative, weight 0.98). This is what lets tooling unambiguously answer "is this build newer than the last series" from tags alone. The npm semver parser, used across the registry, exists to make these comparisons uniformly [3] (authoritative, weight 0.52).

## Series in the wild

OS-adjacent projects formalize the series idea. Fedora's packaging versioning guidelines distinguish the Version and Release tags and state the goal is sequences of packages that are treated as ordered [4] (authoritative, weight 0.77). Vendor lifecycle policies formalize series as support units: NVIDIA's license-system lifecycle policy supports its Long Term Support branch releases for 3 years from the release date, on a stated major release cadence [5] (authoritative, weight 0.80), and its AI Enterprise lifecycle defines four release branch types including a Production Branch and a Long-Term Support Branch [6] (weak backing, weight 0.30). Linux distribution versioning surveys describe the same structure at the distro level: numbered releases with multiple distributions and versions in play simultaneously [7] (weak backing, weight 0.23), with the Linux kernel version history itself a long record of numbered series [8] (weak backing, weight 0.27).

## Cadence is a separate decision from the scheme

The scheme says what a bump means; cadence says when bumps happen. Release cadence is defined as the frequency with which new versions of software are released, a distinct process decision [9] (weak backing, weight 0.10). For a pre-1.0 OS project the sensible coupling is: cadence is set by milestone targets and gate completions, not by the calendar, so a series boundary lands when its feature set actually clears the engineering gates.

## Application to the yubiOS decision

The yubiOS decision treats the v0.7.x to v0.8.x transition as a series boundary that should signal the 0.8.0 feature set: sysext overlay infrastructure (a MINOR-level addition), the input-shape CI gate (a workflow-pattern change observable to workflow authors), and the promotion of the validate-input-shape gate from warn-only to required. The decision explicitly does NOT prescribe cadence: pre-1.0 release timing is set by milestone targets and engineering gate completions. The 0.7.x series shipped across 2026-07-25 to 2026-08-04 (v0.7.0 through v0.7.3), and post-adoption verification through 2026-09-18 recorded the 0.8.x series as MINOR bumps with no breaking changes claimed, consistent with the scheme.

## Sources

1. https://semantic-versioning.org/ (jev weight 0.92, authoritative)
2. https://semver.org/ (jev weight 0.98, authoritative)
3. https://www.npmjs.com/package/semver (jev weight 0.52, authoritative)
4. https://docs.fedoraproject.org/en-US/packaging-guidelines/Versioning/ (jev weight 0.77, authoritative)
5. https://docs.nvidia.com/license-system/latest/nvidia-dls-software-lifecycle-policy/index.html (jev weight 0.80, authoritative)
6. https://docs.nvidia.com/ai-enterprise/lifecycle/latest/choosing-a-branch.html (jev weight 0.30, weak)
7. https://linuxvox.com/blog/how-to-linux-version/ (jev weight 0.23, weak)
8. https://en.wikipedia.org/wiki/Linux_kernel_version_history (jev weight 0.27, weak)
9. https://released.so/glossary/release-cadence/ (jev weight 0.10, weak)
