# verification-chain: the boot-to-runtime verification chain on an immutable Linux OS

Minted 2026-10-05 from yubi-OS/yubiOS refs/adjacent-problems-verification-chain-2026-09-01.md (NSS 6/12 Adjacent problems axis).

The chain this corpus documents: an owner-controlled YubiKey PIV key signs the UKI, UEFI Secure Boot verifies the UKI, the UKI's embedded cmdline pins the dm-verity root hash, the kernel refuses a mismatched /usr Merkle tree, composefs carries signed digests into the runtime image, and an OPA build policy has already refused any container base image that was not digest-pinned. Three rejected trust-anchor alternatives are documented with their flip conditions: TPM-rooted chain, shim+MOK, vendor-key chain, and the unsigned-UKI abstraction.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Docs

1. [01-owner-signed-uki-piv.md](01-owner-signed-uki-piv.md) - How a unified kernel image is structured and signed with sbsign through PKCS#11 against a YubiKey PIV key in slot 9c, and what systemd-stub verifies at boot.
2. [02-uefi-secure-boot-owner-enrollment.md](02-uefi-secure-boot-owner-enrollment.md) - The UEFI PK/KEK/db/dbx key hierarchy and the mechanics of enrolling an owner-controlled signing key in firmware.
3. [03-dm-verity-root-hash-pinning.md](03-dm-verity-root-hash-pinning.md) - How the dm-verity root hash travels in the UKI's signed kernel command line and what the kernel does on a mismatched /usr Merkle tree.
4. [04-composefs-signed-digests.md](04-composefs-signed-digests.md) - How composefs carries a signed digest list into the runtime image, its OverlayFS and EROFS backing, and its verity enforcement.
5. [05-digest-pinned-base-images-opa-policy.md](05-digest-pinned-base-images-opa-policy.md) - Digest-pinned container base images under the docker buildx OPA/Rego Build Policy gate; the build-time mirror of the boot chain.
6. [06-rejected-tpm-rooted-chain.md](06-rejected-tpm-rooted-chain.md) - The TPM-rooted chain (PCR measurement, systemd-pcrlock) and why an EK that never leaves the chip fails owner rotation and export.
7. [07-rejected-shim-mok-vendor-keys.md](07-rejected-shim-mok-vendor-keys.md) - The shim+MOK chain rooted at the Microsoft UEFI CA and the vendor-key chain; why a subordinate grant or a vendor root fails ownership.
8. [08-rejected-unsigned-uki-dm-verity.md](08-rejected-unsigned-uki-dm-verity.md) - Why dm-verity without a signed root hash is integrity without authorization; anyone can produce a matching Merkle tree.

## Research summary

- Results collected: 96 (16 queries, 2 per subtopic, top 6 per query kept).
- Weight split: 48 high / 48 low (jev noul >= 0.5 counts high).
- Jev request count: 22 total (1 outline validation over 8 subtopics, 21 weighting batches of 5 results).
- Redos performed: 0. Every subtopic's dig supported authoring on the first pass.
- Skipped docs: none.
- Outline validation: all 8 subtopics kept (noul range 0.5546 to 0.9090; none below the 0.4 floor).
- One transient 429 from /api/decide during weighting; retried after a 30s backoff per the brief and succeeded.

## Provenance

Every factual claim in every doc carries its source URL and the jev weight that backed it, inline. The research DB under research-db/ holds the full collected archive (archive.json), the per-subtopic dig records (digs-all.json), and the typed index (db.ts).
