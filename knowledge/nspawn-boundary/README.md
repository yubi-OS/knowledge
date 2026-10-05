# Knowledge corpus: nspawn-boundary

Minted from the yubiOS refs record [adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS). Topic: systemd-nspawn as an isolation and dev-environment boundary (RootImage=, --ephemeral, --boot, image-rooted containers, portable services), CI testability of the nspawn layer, and the gap between a stated convention and an exercised CI leg.

## Documents

1. [01-nspawn-isolation-model.md](01-nspawn-isolation-model.md) - what systemd-nspawn is, which kernel mechanisms it layers, and where it sits between chroot, containers, and VMs.
2. [02-rootimage-image-rooted-containers.md](02-rootimage-image-rooted-containers.md) - booting nspawn from a full OS disk image (RootImage= and -i), mkosi-produced images, the .nspawn settings-file convention, and credentials.
3. [03-ephemeral-layering.md](03-ephemeral-layering.md) - --ephemeral throwaway roots, the copy-on-write versus full-copy implementation split, and the Overlay= settings equivalent.
4. [04-boot-and-machine-lifecycle.md](04-boot-and-machine-lifecycle.md) - --boot full-init mode, the service-path default difference, and machinectl as the lifecycle interface.
5. [05-portable-services-vs-nspawn.md](05-portable-services-vs-nspawn.md) - portablectl attach/detach/reattach, how portable services differ from fully isolated containers, and the shared image machinery.
6. [06-hermetic-dev-environments.md](06-hermetic-dev-environments.md) - what hermeticity requires, nspawn as the environment carrier, and production tooling built on the pattern.
7. [07-nspawn-in-ci-pipelines.md](07-nspawn-in-ci-pipelines.md) - how systemd, NixOS, and third-party projects run nspawn legs in CI, and the runner-gating mechanics.
8. [08-silent-failure-modes-and-compatibility.md](08-silent-failure-modes-and-compatibility.md) - documented upgrade breakage, the NEWS paper trail, and what an image-rooted CI leg would catch.

## Research summary

- Results collected: 96 (8 subtopics x 2 queries x top 6 per query).
- Weight split: high 56 / low 40 (jev noul >= 0.5 counted high).
- Outline validation: 8 subtopics proposed, 8 kept (noul range 0.72 to 0.96, threshold 0.4).
- Jev request count: 21 total (1 outline validation + 20 weighting batches of 5). One 429 on weighting batch 19, recovered on retry after 30s.
- Redos performed: 0. Every subtopic dig returned 6 results per query on the first pass.
- Skipped docs: none. Gaps: none.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Provenance

Source doc: yubi-OS/yubiOS refs/adjacent-problems-nspawn-boundary-2026-09-17.md (not copied into this corpus; its claims are cited in-doc as the yubiOS refs record). Branch: mint/nspawn-boundary-2026-10-04. Mint date: 2026-10-05.
