# The CI Task Lane

Scope: the "Current CI Tasks" section of yubi-OS/yubiOS docs/TODO.md: the open verification debts (PQ TLS visibility, QEMU zstd EFI zboot gating, the unzip host-deps gap, dev-image isolation), the completed evidence runs, and the sealed composefs promotion condition.

## The open items

5 tasks in the lane are open (source doc):

- Keep PQ TLS verification visible in CI for OpenSSL 3.5+ and Go 1.24+ defaults. Run 29876466349 negotiated TLS 1.3 with the X25519MLKEM768 hybrid key exchange. When the repo toolchain reaches Go 1.26, the accepted hybrid-group checks should include SecP256r1MLKEM768 and SecP384r1MLKEM1024.
- Keep the QEMU zstd EFI zboot workaround version-gated until runner QEMU contains upstream zstd EFI zboot loader support.
- Add unzip (or python3 -m zipfile / bsdtar) to the rock1 apt install in .github/workflows/ci_test-vgpu-vm.yml. The gap is registered as B-VGPU-VM-UNZIP: it blocks the sealed-UKI BLSConfig verification path (OMN-150 Phase 2 / B-BOOTC-SEAL) and the negative-tamper-boot proof. Run 30697269619 hit it at step 24 with "unzip: command not found" (exit 127). The same workflow already installs binutils, fdisk, jq, docker.io, containerd, and runc; the fix is to extend that line.
- Keep dev and dev-<sha> swu2f images isolated from production build and publish paths.
- Treat old-sha workflow reruns as historical unless the workflow is rerun against current main (source doc).

## What the dig backs

The ML-KEM hybrid key exchange is the one mechanism in this lane that the dig could ground authoritatively. The IETF draft "Use of X25519MLKEM768 with HPKE" family and, more directly for TLS, the draft-kwiatkowski-tls-ecdhe-mlkem documents defining the ECDHE+ML-KEM hybrid key exchanges for TLS 1.3 carried noul weights of 0.70 (draft-02) and 0.70 (draft-03), and RFC 10024 at https://www.rfc-editor.org/info/rfc10024/ carried 0.59 (all authoritative, 0.5 or above). These support the claim that X25519MLKEM768 is a standardized hybrid post-quantum TLS 1.3 key exchange, which is the fact the CI lane's PQ TLS item depends on. A later dated correction note: the dig shows the hybrid kex definition has progressed from IETF draft (0.70) to published RFC 10024 (0.59); the source doc's language ("X25519MLKEM768" as a negotiated group) is consistent with the RFC-era naming. All other dig results for the zboot question (a Phoronix report at noul 0.26, the torvalds/linux zboot-decompress-zstd.c source at 0.39, kernelconfig.io at 0.15) came back below the 0.5 line and are recorded as weak backing; the version-gating claim itself rests on the source doc.

## The completed evidence items

The lane's completed items, each tied to a run id (source doc):

- Run 29872832727 validated the bcvk virtiofs-root bootloader-update.service guard: the run reached the guest assertions without the old DirectBoot/virtiofs failure.
- Run 29872832727 validated the bcvk root SSH credential path: it authenticated and ran the ARM64 guest-side assertions.
- Run 29872832727 confirmed tests/vm/test-fido2-enrollment.sh still runs when token-dependent operations skip: it executed the enrollment-surface script after the passless layer found no CTAP2 device.
- The swu2f CTAP2 enumeration task: make a swu2f CTAP2 token enumerate inside the ARM64 bcvk guest, then require the LUKS2 FIDO2, homed, and OpenSSH ed25519-sk operations to execute instead of skip. Run 30697269619 passes both test-luks-fido2-ci.sh and test-fido2-enrollment.sh against the in-guest passless CTAP2 authenticator on the production arm64 guest, not just the dev image. This closes OMN-48 / yubiOS#25 and is tracked in Linear OMN-89 (Done), comment c74cec44.
- Run 29876111887 proved only the amd64 path for the mkosi installer; the fix added a native arm64 build/publish leg and multi-architecture manifest merge to .github/workflows/ci_mkosi-installer.yml, so the workflow now stages both architectures before merging public tags.
- The group-routing redesign landed in PR #145: all workflows are workflow_dispatch-only with no on: push triggers. To run a workflow or chain, dispatch ci.yml with the appropriate group: choice.
- Docker Build Policy wiring is centralized in yubiOS-bake.hcl: every build target inherits the explicit yubiOS.rego filename with reset=true and strict=true, without relying on automatic Dockerfile.rego loading (refs/docker-bake-consolidation-2026-07-17.md).
- Board variant fields were added to real-hardware firmware workflows before hardware lanes land: rock5b-rk3588 as the Path A variant and rockpro64-rk3399 as another Path A variant, in .github/workflows/ci_firmware-rk.yml (refs/firmware-rk-workflow-2026-07-17.md).
- Run 29884493346 validated the documented bootc install to-filesystem path on fresh amd64 and arm64 legs, including external partition preparation, mounted /mnt, --skip-finalize, and omitted root= via --root-mount-spec="".
- The external-image to-filesystem smoke was strengthened to require an ext4 verity feature, the composefs repository instead of an ostree fallback, measurable EROFS metadata images, a rejected protected-object write, and a strict digest-bound BLS entry classified as unsealed.
- PR #143 (commit a1940330, merged 2026-07-29) shipped the kernel-side artifact split per ADR-032: 0mniteck/yubios:uki-<sha>-<arch> published as a separate OCI artifact, Containerfile.uki, usr/lib/yubiOS/uki/install-uki.sh documented, and usr/lib/bootc/install/50-yubiOS.toml kargs pinned. Phase 2, install-time BLSConfig wiring, is the remaining work (refs/kernel-rootfs-split-2026-07-29.md). This closes OMN-51 (source doc).

## The promotion condition

One CI item is stated as a future-gated task rather than a plain open item: promote a sealed composefs lane only after the pinned base exposes the released v1.16.4 split/ukify capabilities; then build and sign the exact rootfs UKI, boot it with Secure Boot on both architectures, assert UKI composefs status, and retain a negative tamper-boot proof (source doc). The condition chain is explicit: no promotion until the pinned base image itself carries the needed upstream capabilities, and the proof required is negative as well as positive.

## What the lane teaches

The lane pairs every open risk with the run that demonstrated it and every completed fix with the run that proved it. Exit code 127 from a missing unzip binary became a permanent CI-evidence pattern (see doc 08), the CTAP2 skip path became a closure event with Linear ids, and the sealed composefs lane waits on a pinned-base capability rather than on effort. That pairing, open item to failure run, closed item to proof run, is the lane's core discipline.

Source doc: yubi-OS/yubiOS docs/TODO.md, fetched 2026-10-06 from https://github.com/yubi-OS/yubiOS/blob/main/docs/TODO.md (29130 bytes). Dig-backed claims carry their URLs and noul weights inline; results below 0.5 are labeled weak.
