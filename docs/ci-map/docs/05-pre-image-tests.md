# 05 Pre-image test chain: the tests group

**Scope:** the 8 workflows in the `tests` group that validate the system before or beside image publication. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The 8 workflows

The source doc (source doc) lists the group as eight workflows because the diagnostics matrix rides in the same group:

1. `ci_test_rootless-docker.yml` validates the rootless daemon plus hardened Buildx builder across step boundaries, on amd64 and arm64 in the pinned DHI container. 2 jobs (`rootless-docker`, `ci-callback`), no external inputs.
2. `ci_test_bootc-filesystem.yml` runs bootc install-to-filesystem on a disposable GPT disk: strict fs-verity composefs proof, EROFS metadata validation, unsealed BLS classification, and omitted `root=`. 2 jobs (`install-to-filesystem`, `ci-callback`).
3. `ci_test_pq_tls_verify.yml` is the PQ hybrid TLS drift check (ADR-025), non-blocking, on the cacheonly Bake target. 2 jobs, no external inputs.
4. `ci_test-bootc-lifecycle.yml` covers bootc upgrade/rollback plus homed migration (OMN-156), with VM legs optional on the self-hosted arm64 rock1 runner. 2 jobs (`test-upgrade`, `test-homed-migrate`).
5. `ci_test-sysext-portable.yml` covers sysext attach/detach plus portable-service activation (OMN-156), with the same optional VM-legs shape. 2 jobs (`test-sysext`, `test-portable`), 5 external inputs.
6. `ci_test-fedora-bootc-arm64-pull.yml` checks arm64 pull integrity of the pinned fedora-bootc index digest (OMN-139). 1 job.
7. `ci_test-ftpm-tpm0.yml` verifies fTPM `/dev/tpm0` in a guest against the published QEMU ARM64 firmware (OMN-96); Stage B, the in-guest Linux payload, is opt-in. 1 job, 3 external inputs.
8. `diag_sign-matrix.yml` runs the UKI signing matrix across 10 variants, dispatch-only with an inputless `workflow_dispatch: {}`, grouped with the tests as a diagnostics run. 1 job.

## Key invariants

The source doc (source doc) states four:

1. All 8 are `workflow_dispatch`-only by default. The two lifecycle/sysext workflows also run on Monday cron and on path-scoped PRs touching their files.
2. VM legs gate on the `run_vm_legs` input plus the `["self-hosted","Linux","ARM64","KVM"]` runner selector (rock1). Hosted amd64 legs loud-skip with ADR-023 rationale.
3. Evidence-only: none of the 8 publish artifacts to a registry.

## The subsystems under test

The chain exercises the exact filesystem machinery yubiOS builds on. Fedora's bootc documentation confirms that Fedora/CentOS bootc enables composefs for the root filesystem by default, which is the behavior `ci_test_bootc-filesystem.yml` proves rather than assumes (docs.fedoraproject.org, "Understanding the Fedora/CentOS bootc filesystem layout", https://docs.fedoraproject.org/en-US/bootc/filesystem/, jev weight 0.56). The sysext and portable-service legs exercise systemd's extension images, which `systemd-sysext` merges during the main OS boot process (man7.org, systemd-sysext(8), https://www.man7.org/linux/man-pages/man8/systemd-sysext.8.html, jev weight 0.38, weak), and portable services, whose design goals include stricter default sandboxing managed through `portablectl` and `systemd-portabled` (systemd.io, "Portable Services Introduction", https://systemd.io/PORTABLE_SERVICES/, jev weight 0.42, weak). The homed-migration leg covers systemd-homed, the portable home-directory service (ArchWiki, https://wiki.archlinux.org/title/Systemd-homed, jev weight 0.27, weak).

The fTPM leg is downstream of the firmware lane: it consumes the published `firmware-qemu-arm64` image and asserts the TPM device appears and works in the guest (source doc). The rootless-docker leg validates the same hardened-builder posture the image builders themselves use for publication (source doc, doc 03).

## Why this group sits before (and beside) publication

The group's name is slightly generous: its members run before or beside image publication, not strictly before it. The source doc (source doc) is explicit that they validate "before or beside," which matters because several of them (bootc-filesystem, lifecycle, sysext) test OS behaviors that do not depend on the image of the day being published first, while others (ftpm-tpm0) depend on firmware that is already published. The `tests` group dispatch bundles them so an operator can run the whole evidence battery without touching a registry.

Evidence-only is the invariant that keeps the group cheap to trust: because nothing is published, a green tests-group run can never be mistaken for a release event, and a red one cannot block a release that a human decides to make anyway (source doc).

## The ADR-023 and ADR-025 hooks

Two design records are load-bearing here. ADR-023 is the rationale for why hosted amd64 legs loud-skip instead of failing silently: the VM legs need KVM on ARM64, which only rock1 provides, so hosted legs skip with an explicit recorded reason rather than a silent green (source doc). ADR-025 defines the PQ hybrid TLS posture whose drift `ci_test_pq_tls_verify.yml` watches, non-blocking by design (source doc).

## Composes with

The tests group composes with the VM e2e lane (the heavier VM-based sibling, doc 06), the firmware lane (whose published QEMU firmware the ftpm-tpm0 workflow consumes, doc 04), and the audits group whose Monday crons run alongside the two Monday-cron members here (source doc, doc 08).
