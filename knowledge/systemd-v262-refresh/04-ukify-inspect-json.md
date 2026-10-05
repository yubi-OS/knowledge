# 04 ukify inspect --json= machine-readable output changes

Scope: the change to ukify's `inspect --json=` machine-readable output in the v262 cycle, the documented output shape, the weak-backed description of what changed, and why yubiOS tooling is unaffected.

## What the source doc recorded

The source doc recorded that `ukify inspect --json=` machine-readable output changed in the v262 cycle, that this touches any tooling parsing UKI inspect output, and that yubiOS UKI verification uses sbverify and cosign paths rather than `ukify inspect` JSON, with no consumer in the repo (verified by grep at that cycle).

## The documented output shape

The ukify manual page documents the inspect verb's JSON mode: when generating JSON output with the inspect verb, the output is an object whose keys are the names of the sections shared between all profiles (that is, those preceding the first ".profile" section), each mapping to an object describing the section by its "size" and "sha256", plus a "text" field for textual sections (source: https://www.freedesktop.org/software/systemd/man/ukify.html, jev weight 0.85). This is the shape consumers of the stable line can expect; the multi-profile structuring is part of the documented contract.

The Debian manual page for ukify (systemd-ukify package) lists the three verbs, `build`, `genkey`, and `inspect FILE...`, and points at the `-j / --json=` and `--section=` options plus companion inspection tools such as `llvm-objdump -p` and pe-inspect (source: https://manpages.debian.org/man/ukify, jev weight 0.77). ukify's primary purpose is to combine components (usually a kernel, an initrd, and the systemd-stub UEFI stub) into a UAPI.5 Unified Kernel Image, a single PE binary that boots the system (source: https://www.freedesktop.org/software/systemd/man/ukify.html, jev weight 0.80).

## What changed, weakly backed

The dig captured only one source describing the specific v262 change, and it is weak-backed. A LinoVox article states that `ukify inspect --json=` now represents repeated PE sections as arrays and describes multi-profile sections under `_profiles`, with the general guidance that scripts consuming machine-readable data should not assume that older shapes remain valid (source: https://www.linovox.com/system-administration/systemd/systemd-v262-changes-service-behavior-sysupdate-udev-and-credentials/, jev weight 0.36, weak backing). The same article appeared again in the redo dig at weight 0.21 (weak backing). Per the weighting rule this claim cannot be treated as authoritative: it is directionally consistent with the documented profile-aware output shape above, but the exact v262 shape change should be confirmed against the NEWS entry before any tooling depends on it.

The canonical changelog location is the systemd NEWS file (source: https://github.com/systemd/systemd/blob/main/NEWS, jev weight 0.89). The dig captured the NEWS page but its snippet did not expose the ukify inspect entry text, so this mint records the change as source-doc-asserted plus weak-backed, not primary-confirmed.

## Impact for yubiOS

The source doc's audit found no consumer of `ukify inspect --json=` in the yubiOS repos: UKI verification uses sbverify and cosign paths, not ukify inspect JSON. The general hazard for image-based OS pipelines is real and worth restating: any build or test script that parses ukify inspect JSON output must be revalidated against the v262+ output shape, since repeated PE sections are reportedly represented as arrays and multi-profile data moved under a `_profiles` key (weak backing per above). For yubiOS this is a zero-action item; the check to keep in the audit checklist is a grep for `ukify` plus `inspect` across build and verification scripts at each systemd refresh.
