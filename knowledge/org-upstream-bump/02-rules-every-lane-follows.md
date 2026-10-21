# 02-rules-every-lane-follows

**Scope.** Rules every lane follows: detailed analysis grounded in yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md.

> Ground source: yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md. External dig queries: bootc mkosi systemd immutable OS upstream tracking; reproducible firmware build commit SHA pinning.

## Five rules, verbatim in substance

The ground source (yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md) sets five rules that apply to every lane of the bump.

1. **Forks: backup, never delete, verify.** Before any rebase or force update, create a backup tag on the old tip named `pre-bump-2026-10-17`. Never delete old history. Verify the new tip with the compare API: behind_by 0 against the release commit, and ahead_by equal to the number of yubiOS commits kept.
2. **Lanes do not merge to main.** Lanes never merge to yubi-OS/yubiOS main. The advisor integrates lane outputs into the single branch `org-upstream-bump-2026-10-17` and merges only after CI is green.
3. **No Docker push and no card writes in any lane.** Verification dispatches run with Docker push OFF.
4. **Every changed PINNED.md row cites provenance.** It must cite the release commit and the approved source commit. Consumers read the pin.
5. **Holds and refusals are recorded.** Anything held or refused is recorded in PINNED.md with the reason, not silently skipped.

## Rule 1 in detail: the compare-API invariant

A rebase rewrites history, so the old tip would become unreachable without a reference. The backup tag `pre-bump-2026-10-17` keeps it reachable and makes the operation reversible. The compare API check is the mechanical proof that the rebase did what was intended. behind_by 0 against the release commit means the new tip contains the release in full. ahead_by equal to the count of kept yubiOS commits means nothing extra was added and nothing kept was lost. For optee_ftpm that count is 11. For optee_os it equals the yubiOS-only commits that survive after upstream-already-merged commits drop, so the expected ahead_by must be computed before the check, not inferred after.

## Rule 2: a single integration branch

Concentrating all lane outputs on one branch, owned by the advisor, means CI runs once on the full combined bump. A firmware lane and an actions lane can each look green in isolation and still conflict when combined; a single integration branch catches that. Merge is gated on green CI, never on lane self-reports.

## Rule 3: no side effects during verification

Verification builds compile and test without publishing. Docker push OFF means no image tag in any registry changes as a by-product of a lane's test. "No card writes" keeps lanes from creating inbox or status artifacts that would look like completed work.

## Rule 4: pins with provenance

Every changed row cites two commits: the upstream release commit and the approved source commit. The reproducible-builds discipline behind this is widely documented. The memfault Interrupt post on reproducible firmware builds discusses the GNU Build ID, a SHA over an ELF's binary and debug sections, per [Reproducible Firmware Builds \| Interrupt](https://interrupt.memfault.com/blog/reproducible-firmware-builds) (clef weight: 0.3264) (weak backing, clef weight < 0.5). An embedded CI log describes pinning compiler, SDK and dependencies against the "works on my machine" failure, per [Day 02: Reproducible Builds: Pinning Compiler, SDK & Dependency ...](https://jovin555.github.io/firmware-daily-log/embedded-cicd/day-02) (clef weight: 0.2458) (weak backing, clef weight < 0.5); a DevOps article argues that if rebuilding the same commit tomorrow yields a different SHA256 digest there is no cryptographic basis for trusting the artifact, per [Achieving Bit-for-Bit Reproducible Builds in CI/CD](https://www.kbytechnologies.com/devops-automation/achieving-bit-for-bit-reproducible-builds-in-ci-cd) (clef weight: 0.1778) (weak backing, clef weight < 0.5); mujoco-wasm-forge recommends pinning a commit hash and recording toolchain versions, per [How-to: pin and reproduce builds - mujoco-wasm-forge documentation](https://mujoco-wasm-forge.readthedocs.io/en/latest/howto_reproducible_builds.html) (clef weight: 0.2043) (weak backing, clef weight < 0.5); and an OpenIPC issue asks to pin HEAD-versioned packages to commit SHAs so nightlies can be rebuilt byte for byte, per [Pin HEAD-versioned packages to commit SHAs for reproducible builds - GitHub](https://github.com/OpenIPC/firmware/issues/2270) (clef weight: 0.0993) (weak backing, clef weight < 0.5). All five are weak backing. The plan's practice is stricter: release assets get SHA-512, container images get multi-arch INDEX digests, actions get full commit SHAs, and qemu moves to the commit behind its v11.1.2 tag rather than to the tag name.

## Rule 5: holds are data

The plan has two explicit holds: edk2 at stable202602 (pending Lane E's compatibility proof) and Mbed-TLS 4.x (pending proof that TF-A v2.15 is compatible). Both must appear in PINNED.md with their reasons. An unrecorded hold looks identical to a forgotten bump; a recorded hold tells the next reviewer exactly what evidence would release it.

## Why these rules suit an image-based OS

yubiOS is built with mkosi and delivered through bootc, so the upstream set directly determines what ends up in a signed image. mkosi is described as a wrapper around dnf, apt, pacman and zypper that generates customised disk images, per [mkosi - Build Bespoke OS Images](https://mkosi.systemd.io/) (clef weight: 0.6594), and its repository notes that a distribution package should be at least mkosi v16, per [GitHub - systemd/mkosi: Build Bespoke OS Images · GitHub](https://github.com/systemd/mkosi) (clef weight: 0.5881). bootc applies the container technique to bootable hosts, using standard OCI images as the transport and delivery format for base OS updates, per [GitHub - bootc-dev/bootc: Boot and upgrade via container images](https://github.com/bootc-dev/bootc) (clef weight: 0.5386), with the project site at [bootc](https://bootc.dev/) (clef weight: 0.4304) (weak backing, clef weight < 0.5). systemd's guidance on safely building images says the same image should deploy as multiple instances that each acquire their own identity on first boot, starting with removing `/etc/machine-id`, per [Safely Building Images - systemd](https://systemd.io/BUILDING_IMAGES/) (clef weight: 0.6699). When images are the deployment unit, a drifting pin changes what every machine boots. Rules 1, 4 and 5 make every pin change traceable, and rules 2 and 3 keep verification from leaking into production.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | GitHub - systemd/mkosi: Build Bespoke OS Images · GitHub | https://github.com/systemd/mkosi | 0.5881 | authoritative (>= 0.5) |
| 2 | mkosi - Build Bespoke OS Images | https://mkosi.systemd.io/ | 0.6594 | authoritative (>= 0.5) |
| 3 | bootc | https://bootc.dev/ | 0.4304 | weak (< 0.5) |
| 4 | GitHub - bootc-dev/bootc: Boot and upgrade via container images | https://github.com/bootc-dev/bootc | 0.5386 | authoritative (>= 0.5) |
| 5 | Safely Building Images - systemd | https://systemd.io/BUILDING_IMAGES/ | 0.6699 | authoritative (>= 0.5) |
| 6 | Day 02: Reproducible Builds: Pinning Compiler, SDK & Dependency ... | https://jovin555.github.io/firmware-daily-log/embedded-cicd/day-02 | 0.2458 | weak (< 0.5) |
| 7 | Achieving Bit-for-Bit Reproducible Builds in CI/CD | https://www.kbytechnologies.com/devops-automation/achieving-bit-for-bit-reproducible-builds-in-ci-cd | 0.1778 | weak (< 0.5) |
| 8 | How-to: pin and reproduce builds - mujoco-wasm-forge documentation | https://mujoco-wasm-forge.readthedocs.io/en/latest/howto_reproducible_builds.html | 0.2043 | weak (< 0.5) |
| 9 | Reproducible Firmware Builds \| Interrupt | https://interrupt.memfault.com/blog/reproducible-firmware-builds | 0.3264 | weak (< 0.5) |
| 10 | Pin HEAD-versioned packages to commit SHAs for reproducible builds - GitHub | https://github.com/OpenIPC/firmware/issues/2270 | 0.0993 | weak (< 0.5) |
