# 06 - systemd Hardening Runtime Evidence (B-HARDENING-RUNTIME)

Scope: why the static hardening audit is complete but the blocker stays open until runtime evidence exists in the target image/base, and the RestrictFileSystems versus RestrictFileSystemAccess correction.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), row B-HARDENING-RUNTIME.

## The blocker as stated

The register states that the static hardening audit is complete in `refs/systemd-hardening-audit-2026-07-17.md`, but runtime evidence still needs the target image/base to run the Bats unit checks and `systemd-analyze verify` (source doc). The next step is to run the hardening tests in a target image/base before adding `RestrictFileSystemAccess=` or claiming runtime enforcement beyond the existing `RestrictFileSystems=~@network` enrollment control (source doc). The root-cause class is a static-versus-runtime gap: analysis of unit files on paper is done, but the project has not yet executed the verification machinery inside the image those unit files actually ship in.

## The two settings and the v261 correction

The inconsistency log records a correction the 2026-07-11 planning cycle made across docs: `RestrictFileSystems=` was described as a new v261 feature, but it is the existing BPF-LSM filesystem-type limiter; `RestrictFileSystemAccess=` is the v261 addition (source doc). The two are easy to confuse because they differ by one character and both came out of the same security area of systemd.

The upstream evidence confirms the correction: the systemd releases page records the addition as "a new RestrictFileSystemAccess= setting ... that uses a BPF LSM program to restrict execution to only binaries that are stored on a signed and verified dm-verity-protected filesystem" (source: https://github.com/systemd/systemd/releases, jev weight 0.83). The BPF LSM mechanism itself is documented by the kernel: LSM BPF programs allow runtime instrumentation of LSM hooks by privileged users to implement system-wide mandatory access control and audit policies using eBPF (source: https://docs.kernel.org/bpf/prog_lsm.html, jev weight 0.89). That pairing matters for yubiOS specifically: the new setting's guarantee (binaries only from a signed, dm-verity-protected filesystem) is exactly the integrity model yubiOS's composefs and dm-verity work builds toward, which is why the project wants the setting but will not claim it before runtime proof.

## What the runtime evidence consists of

The blocker names 2 concrete runtime instruments (source doc):

1. Bats unit checks: the bash automated testing framework checks the project's unit files and scripts execute correctly in the target environment.
2. `systemd-analyze verify`: the systemd tool that determines boot-up performance statistics and verifies the correctness of unit files (source: https://www.man7.org/linux/man-pages/man1/systemd-analyze.1.html, jev weight 0.87).

`systemd-analyze security` additionally analyzes the security and sandboxing settings of service units, which is the direct measurement of how well a unit's hardening directives actually apply (source: https://manpages.ubuntu.com/manpages/focal/man1/systemd-analyze.1.html, jev weight 0.84). The same man page family documents that systemd-analyze retrieves system and service manager state and tracing information, making it the natural tool for confirming sandbox behavior at runtime rather than by inspection (source: https://www.man7.org/linux/man-pages/man1/systemd-analyze.1.html, jev weight 0.78).

## Why the target image/base matters

The blocker insists the checks run in the target image/base, not in an arbitrary dev environment (source doc). The dependency logic is that hardening directives are interpreted by the systemd version inside the image: a directive the host's systemd supports may be unknown, or worse, silently misparsed, by the image's systemd. The existing `RestrictFileSystems=~@network` enrollment control is the ceiling of what the project claims today, and everything beyond it is unclaimed until the Bats checks and `systemd-analyze verify` pass inside the real image (source doc).

## The unblock path

The register's next step is a single ordered gate (source doc): run the hardening tests in a target image/base first; only then add `RestrictFileSystemAccess=` or make any runtime-enforcement claim beyond `RestrictFileSystems=~@network`. The related "Not Current Blockers" entries clarify the boundaries: the hardening documentation audit is no longer pending as a static docs task, and the remaining hardening blocker is exactly the runtime validation inside the target image/base (source doc).

## The dependency-management lesson

B-HARDENING-RUNTIME teaches that a dependency on a new upstream capability (here, a v261 systemd setting) is not satisfied by the capability existing; it is satisfied by proof that the project's own runtime can exercise it. The ledger keeps 3 separations explicit:

1. Static analysis (done) versus runtime evidence (open).
2. The existing control (`RestrictFileSystems=~@network`) versus the wanted control (`RestrictFileSystemAccess=`).
3. The tool's name confusion, corrected in the inconsistency log so future docs do not silently swap the 2 settings (source doc).

In a hardware-coupled OS project, the image/base is part of the dependency surface: claims about enforcement must be produced by the environment that will enforce them, and the register holds the row open until they are.
