# 03 Milestone 2: token-backed VM and CI coverage

Scope: the second milestone's scope and gates, its delivered software-validated path, its blocker state, and the remaining hardware gate. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## Scope and gates

The source doc defines milestone 2 as: "Make token-dependent guest operations execute deterministically in CI, keep PQ TLS verification visible, and preserve explicit isolation between production and dev/test paths." (source doc). Three gates: deterministic token-dependent guest operations in CI, visible post-quantum TLS verification, and an explicit production versus dev/test isolation boundary.

The determinism gate is the hard one. Token-dependent operations (FIDO2 enumeration, LUKS2 unlock) normally require a physical hardware token; making them run deterministically in CI is the core engineering problem. QEMU's own CI documentation describes the pattern such tests follow: continuous integration requires builds of the entire application and execution of a comprehensive set of automated tests on every commit (https://www.qemu.org/docs/master/devel/testing/ci.html, jev weight 0.64), and QEMU's integrated CI pages describe testing code via public CI systems prior to submission (https://wiki.qemu.org/Testing/CI/Integrated, jev weight 0.56). A related upstream tracking issue records the same boundary in another project: adding real QEMU/OVMF boot-verification tests for the full boot chain "once such tooling becomes available in the dev/CI environment" (https://github.com/cataggar/zvmi/issues/59, jev weight 0.55), showing that gating real guest-verification tests on CI tooling availability is a recognized pattern, not a yubiOS-only problem.

## Linear ownership

The source doc assigns these issues (source doc):

- OMN-38, parent, Done.
- OMN-48, path trace, Done.
- OMN-49, fail-closed, Done.
- OMN-50, proof logs, Done.
- OMN-39, QEMU zboot workaround tracking, Backlog, P3.
- OMN-59, runner/QEMU boundary, In Progress, P3.
- OMN-60, zboot version-gating, Backlog, P3.

The parent plus its three child issues are all Done, which is why this milestone carries the corpus's highest completion percentage.

## Seeded blockers

The blocker picture is the most eventful of the four milestones (source doc):

- **B-VM-CTAP2, RESOLVED 2026-07-25** (run 30139433902, OMN-48 Done). The source doc explicitly corrects its own 2026-07-25 predecessor, which had incorrectly named B-VM-CTAP2 "the single highest-leverage blocker." The closure evidence is recorded in BLOCKERS.md's Not-Current-Blockers entry: "LUKS2 unlock → homed → pamu2fcfg → ed25519-sk, end-to-end, no skips." (source doc).
- **B-QEMU-ZBOOT**: a contained workaround per the same BLOCKERS.md review, not an open failure. The source doc instructs: "Keep version-gated until upstream QEMU carries the fix." (source doc). This is what OMN-60 (zboot version-gating, Backlog P3) tracks.
- **B-REAL-FIDO2, NOW READY TO EXECUTE.** It was gated on B-VM-CTAP2 closing; that gate is now open. It awaits a human owner with physical hardware, per OMN-63's 12 scenarios, with OMN-63 itself Done (source doc).

The FIDO2 unlock mechanism this milestone validates is the standard systemd path: systemd-cryptenroll enrolls hardware security tokens into a LUKS2 encrypted volume for boot-time unlock (https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, jev weight 0.39, weak backing, cited as mechanism reference only). The underlying primitive is the FIDO2 hmac-secret extension, where the token calculates an HMAC using a secret that never leaves the device (https://github.com/bertogg/fido2luks, jev weight 0.20, weak backing, community tool, cited as mechanism reference only).

## Status

The source doc records status as of 2026-07-28: "65.6% — software-validated FIDO2 path fully delivered. The post-B-VM-CTAP2 long pole has moved to Milestone 3 (Sealed composefs), not back to M2." (source doc). The last sentence is a deliberate planning judgment: with the software path done, the milestone's remaining work (real FIDO2 with a human owner) is not the project's bottleneck, and the doc redirects attention to milestone 3.

## The isolation gate

The third gate, explicit isolation between production and dev-test paths, has no dedicated child issue listed; it is a property the milestone holds the whole coverage work to. The distinction matters because a token-dependent operation that passes in CI using emulated or substituted tokens must not be confused with production evidence produced against real hardware; B-REAL-FIDO2 is exactly the bridge between the two evidence classes.
