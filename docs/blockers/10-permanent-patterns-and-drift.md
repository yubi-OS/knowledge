# 10 - Permanent Patterns and Drift

Scope: the Permanent CI-Evidence Patterns (systemd drop-in lex-sort rule, self-hosted runner host-deps gap), the Inconsistency Log, the dated review diffs, and the 2026-09-18 drift checks, read together as the register's institutional memory.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md). This is an internal-record subtopic, no dig.

## What a permanent pattern is

The register's "Permanent CI-Evidence Patterns" section collects failure modes that have happened in CI and are expected to recur; the doctrine under each entry is what the repo does about them (source doc). Entries are added as new patterns emerge and removed only when the underlying mechanism is removed (source doc). Two patterns are currently recorded, each with an estimate date, a source Linear item, a convention, a verification recipe, and a documented origin incident.

## Pattern 1: the systemd drop-in lex-sort rule (est. 2026-07-30, source OMN-149)

The rule as recorded (source doc): `modprobe.d`, `dracut.conf.d`, `tmpfiles.d`, `systemd/*.service.d/`, and `udev/rules.d` all sort files lexicographically by full filename, per systemd-tmpfiles(5): "All configuration files are sorted by their filename in lexicographic order". Numeric-prefixed naming (`50-...`, `53-...`) is a sysv-init `rcN.d/` convention that does NOT transfer to systemd drop-in directories.

The yubiOS convention: a systemd drop-in override whose intent is "fire after upstream" uses `vfio-yubiOS-...`, `yubiOS-...`, or any other prefix that lex-sorts after every upstream package file the drop-in overrides. Drop-ins whose intent is "fire before upstream" can keep a low numeric prefix or `yubiOS-` only (source doc).

The verification recipe for any new yubiOS drop-in override: run `ls -1 usr/lib/<dir>/ | sort -u` and confirm the yubiOS filename sorts after every upstream package file it intends to override; if a future upstream package adds a same-prefix file, re-verify the ordering (source doc).

The origin lesson, in full detail (source doc): in OMN-149, `/dev/vfio` was found in a yubiOS guest despite `usr/lib/tmpfiles.d/53-yubiOS-no-static-vfio.conf` being shipped in commit 59f4332 (2026-07-26). The root cause was the `"53"` prefix lex-sorting before upstream `static-nodes-permissions.conf`'s `"s"` prefix (`"5"` is 0x35, `"s"` is 0x73 in ASCII), so the yubiOS `r /dev/vfio/vfio` fired first and the upstream `z /dev/vfio/vfio 0666 - - -` then re-created the cdev last on every boot. The fix renamed the file to `vfio-yubiOS-no-static-vfio.conf` (leading `"v"` is 0x76, which sorts after `"s"` at 0x73) in commit f92c6010. `/dev/vfio` had existed in every yubiOS guest for 4 days before this was caught. Cross-references: PROJECT_RULES.md entry "systemd drop-in lex-sort lesson (2026-07-30)", commit f92c6010, Linear OMN-149 (source doc).

## Pattern 2: the self-hosted runner host-deps gap (est. 2026-08-01, source B-VGPU-VM-UNZIP)

The doctrine as recorded (source doc): self-hosted runners persist between runs, but the apt install list inside `.github/workflows/*.yml` is the only place a missing dependency can be added. Workflow steps that shell out to binaries not in that list fail with exit 127 (command not found) even if every other layer (image, code, harness) is correct. The register explicitly classes this with OMN-149 (lex-sort) and OMN-139 (registry stream truncation): the lesson class is "hidden deps on the runner image", not "the code is wrong".

The verification recipe for any new workflow step that invokes a CLI tool (source doc):

1. List the binary in the workflow's apt install block, even if it seems obviously present on a stock Ubuntu 24.04 image.
2. For tools that are not apt-packaged on Ubuntu 24.04 (`unzip`, `bsdtar`, `zstd`), either pin an apt package or use `python3 -m zipfile`, `python3 -m tarfile`, or `python3 -m zstandard` as a zero-dependency fallback.
3. For every workflow step that calls an external CLI, add `command -v <tool> || { echo "::error::<tool> not on PATH"; exit 1; }` near the top of the step, to surface the missing dependency loudly instead of silently with exit 127.

The origin incident: run 30697269619 (2026-08-01, commit b7f9d467 on main) reached step 24 of `ci_test-vgpu-vm.yml`, downloaded `sealed-uki-artifacts-arm64` from sealed-UKI source run 30652859000 (branch sealed-uki-vm-lane-v2, SHA 1d0666d7, V83) cleanly, then failed at `unzip -o /tmp/uki.zip` with command not found. Every prior CI step was green. The single missing apt package blocked steps 25 through 32 (the entire sealed-UKI BLSConfig verification leg) and the negative-tamper-boot proof. Cross-references: BLOCKERS.md row B-VGPU-VM-UNZIP, Linear OMN-150 comment d2e627de, run 30697269619 step 24, and a TODO.md task in "Current CI Tasks" (source doc).

## The Inconsistency Log

The 2026-07-11 planning cycle found and corrected 5 inconsistencies across docs (source doc):

1. `RestrictFileSystems=` was described as a new v261 feature; it is the existing BPF-LSM filesystem-type limiter, and `RestrictFileSystemAccess=` is the v261 addition.
2. Older docs treated ARM64 as secondary even after ADR-023 made ARM64 primary.
3. Old TODO and run notes included stale base-image digest examples; PINNED.md is now called out as the only live digest source.
4. Some refs described TEST-only swu2f and v261 work as pending after later PRs made them live or reviewed.
5. `AGENTS.md` and tool docs repeated an obsolete warning about workflow-token scope.

## Drift checks as recorded institutional memory

Two 2026-09-18 drift-check addenda close the doc's current form (source doc). Round 10 (cycle 11) records that the register's 2 stale rows (B-VGPU-VM-UNZIP's retirement condition met 2026-09-09; B-ROCK1-OFFLINE naming the retired GPU runner) were flagged by that round's refs-side drift check, and records the flag inside the register as a review-request note, not a row edit, because register edits belong to the next review. Round 11 (cycle 22) records that the 2 stale rows remain flagged in-register and that the register review remains the prescribed next step (source doc).

## What the patterns teach about dependency management

Read together, the 2 permanent patterns and the inconsistency log describe how a hardware-coupled OS project converts incidents into standing doctrine:

1. Each pattern names a mechanism, not an incident: "drop-ins sort lexicographically" and "runner images carry hidden deps" survive the specific bugs that revealed them.
2. Each pattern carries a verification recipe, so the next contributor checks for the failure mode before it happens instead of rediscovering it after 4 days of exposure, as the OMN-149 incident did.
3. The inconsistency log handles the opposite failure: docs that drift from reality (the RestrictFileSystems/RestrictFileSystemAccess swap, stale digests, obsolete token-scope warnings). Corrections are recorded with their date so the drift itself is auditable.
4. Drift checks that find problems without authority to fix them record a review-request note and leave the mutation to the named owner (the next review), keeping the audit trail clean.
