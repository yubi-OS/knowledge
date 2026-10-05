# container-isolation-adjacent-problems

A knowledge corpus on container and process isolation on an immutable Linux host: the four isolation boundaries (rootless podman builds, systemd-nspawn on a signed image, ephemeral VMs, systemd unit sandboxing with seccomp), which boundary answers which threat, and why the others are not used there.

Minted from yubi-OS/yubiOS `refs/adjacent-problems-container-isolation-2026-09-01.md` (NSS axis 6/12, Adjacent problems).

## Docs

1. [01-rootless-builds.md](01-rootless-builds.md) — Rootless podman/buildx image builds: user-namespace isolation during build, why not a rootful daemon or a VM per stage.
2. [02-nspawn-dev-environment.md](02-nspawn-dev-environment.md) — systemd-nspawn with RootImage= off the signed image as the hermetic dev environment; why not Docker dev containers or toolbox.
3. [03-ephemeral-vm-testing.md](03-ephemeral-vm-testing.md) — Ephemeral VMs (bcvk) for whole-OS tests: what only a kernel boundary can exercise (UEFI boot, LUKS2, FIDO2 unlock); why not nspawn --boot or bare metal in the loop.
4. [04-unit-sandboxing-seccomp.md](04-unit-sandboxing-seccomp.md) — systemd unit sandboxing (PrivateDevices=, RestrictNamespaces=, SystemCallFilter= allowlists) and systemd-analyze security; why not run every service in a container.
5. [05-boundary-matrix.md](05-boundary-matrix.md) — Which boundary answers which threat: container escape vs VM escape vs syscall surface; relation types (substitution, abstraction, alternative).
6. [06-integrity-vs-isolation.md](06-integrity-vs-isolation.md) — Isolation vs integrity vs privilege minimisation: dm-verity/composefs protect the image from the process; isolation protects processes from each other.
7. [07-verification-prerequisite.md](07-verification-prerequisite.md) — The verification chain: a container is only as trustworthy as the digest the build policy admitted; digest pinning and policy-gated builds.
8. [08-vm-passthrough-extensions.md](08-vm-passthrough-extensions.md) — Device passthrough at the VM boundary: YubiKey USB passthrough for FIDO2 in VM tests, GPU passthrough, nested virtualisation on ARM.

## Research summary

- Results collected: 96 (16 queries, 2 per subtopic, top 6 kept per query)
- Weight split: 40 high / 56 low / 0 unweighted
- Outline validation: 8/8 subtopics kept (noul 0.7041 to 0.9494, drop threshold 0.4)
- jev request count: 21 (1 outline validation + 20 weighting batches of 5) plus 1 retry after a single 429
- Redos performed: 0
- Skipped docs: none
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Research DB

- `archive.json` — every collected result with query, title, url, snippet, weight, collected_at, and jev answer where present
- `digs/<subtopic>.json` — per-doc dig records (subtopic, queries, redo_count, results_kept)
- `db.ts` — typed interfaces (DugResult, DigRecord, ArchiveEntry) matching the JSON shapes

## Gaps

None. All 8 outlined subtopics had sufficient dig depth to author honestly; every doc cites only claims backed by a collected, weighted source.
