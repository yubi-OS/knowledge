# 07 Fetches and fork component CI

**Scope:** the `fetches` group that keeps `PINNED.md` honest, and the `forks` group that validates the 8 pinned upstream forks. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The fetches group: 3 pin refreshers

The source doc (source doc) describes the group's job as keeping `PINNED.md` honest:

- `fetch-dhi-manifest.yml` refreshes DHI Debian base digests. 2 jobs (fetch, ci-callback), 1 external input.
- `fetch-fedora-bootc-manifest.yml` refreshes the fedora-bootc index digest. 2 jobs, 1 external input.
- `fetch-released-tag-ref.yml` refreshes nine fork/upstream release mappings, with peeled commits verified from each fork. 2 jobs, 1 external input.

All three commit updated pins themselves when drift exists; none are scheduled (manual dispatch, historically via the `fetches` group) (source doc).

The digests being pinned are the supply-chain floor for every Docker build: the builders consume exactly the digests `PINNED.md` pins (source doc, doc 03). Docker's own documentation describes Docker Hardened Images as secure, minimal, production-ready base images whose security model rests on signed metadata, provenance, and a minimal attack surface, with digest pinning as the way to fix a build to an immutable artifact (docs.docker.com, "Docker Hardened Images", https://docs.docker.com/dhi/, jev weight 0.4, weak; "Image digests", https://docs.docker.com/dhi/explore/security-concepts/digests/, jev weight 0.33, weak). On the Fedora side, the bootc base images are maintained upstream with `bootc-base-imagectl` as the tooling around them (docs.fedoraproject.org, "From scratch Fedora/CentOS bootc base container images", https://docs.fedoraproject.org/en-US/bootc/building-from-scratch/, jev weight 0.43, weak; gitlab.com/fedora/bootc/base-images, https://gitlab.com/fedora/bootc/base-images, jev weight 0.44, weak).

## The forks group: 8 component validators

Eight `ci_fork_*.yml` workflows build, lint, and test the yubi-OS forks at immutable release or approved release-descendant commits pinned by `fetch-released-tag-ref.yml` (source doc):

| Workflow | What it does | Jobs |
|---|---|---|
| `ci_fork_mkosi.yml` | validate-profile / shellcheck / ruff | 4 |
| `ci_fork_bcvk.yml` | unit-tests / clippy | 3 |
| `ci_fork_arm-trusted-firmware.yml` | build-tfa | 2 |
| `ci_fork_optee-os.yml` | build-optee | 2 |
| `ci_fork_ms-tpm-20-ref.yml` | build-ms-tpm-20-ref | 2 |
| `ci_fork_optee-ftpm.yml` | build-ftpm-ta | 2 |
| `ci_fork_u-boot.yml` | build-uboot | 2 |
| `ci_fork_edk2.yml` | build-standalonemm (StandaloneMM) | 2 |

Two design facts from the source doc (source doc):

1. **None stitch a full firmware image.** Stitching is `ci_firmware-rk.yml`'s job; the fork workflows validate pinned forks only (source doc, doc 04).
2. **Fork runs are manual-only since PR #145.** The 4 former path-scoped upstream-sync auto-runs were removed; the documented recovery is to dispatch the `forks` group to re-pin and validate (source doc).

Each fork workflow except mkosi's uses a matrix runner for the build job and carries the legacy `ci-callback` no-op from the pre-#145 contract (source doc).

## Why pins and forks are one subtopic

The two groups are halves of one loop. The fetches group detects upstream drift and re-pins; the forks group proves the newly pinned commits build and pass their checks; the firmware lane then consumes the pinned refs during assembly (source doc). The source doc's carried fork-chain diagram shows this sequencing conceptually (ci.yml after fork release-ref refresh, then mkosi, bcvk, TF-A, OP-TEE OS, ms-tpm-20-ref, optee_ftpm, U-Boot, edk2, then the optional pre-image tests and firmware) while being explicit that the dispatch model is independent, not chained (source doc).

The 8 pinned components are the firmware stack's bill of materials: mkosi (image building), bcvk (VM testing), TF-A and OP-TEE OS (secure world), ms-tpm-20-ref and optee_ftpm (fTPM), U-Boot and edk2/StandaloneMM (bootloader and RPMB management). Keeping their upstream positions visible through release mappings rather than raw SHAs is what makes re-pinning auditable (source doc).

## Composes with

The fetches group composes with the image builders (digest consumers, source doc, doc 03) and the forks group (release-mapping producer, source doc). The forks group composes with the firmware lane, which stitches their component outputs conceptually while the fork workflows themselves stop at validation (source doc, doc 04). Since 2026-10-06 the audits group's `ci_fork-drift-detect.yml` watches fork/upstream drift daily beyond a commit threshold (source doc, doc 08), which closes the loop: detect drift (audit), re-pin (fetch), validate (fork), assemble (firmware).
