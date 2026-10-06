# 06 Artifact trust verification

Scope: artifact-trust verification: digest pinning, SLSA provenance, SBOM attestations, and reproducible-build reproduction as the proof for pin-by-digest claims.

## What digest pinning alone proves, and what it does not

Pinning an image by digest is a pointer to bytes, not a statement about how those bytes were produced. The SLSA framework exists precisely to supply the missing half: "SLSA is a security framework. It is a check-list of standards and controls to prevent tampering, improve integrity, and secure" software supply chains (https://slsa.dev/, jev weight 0.97, authoritative). A pin proves the artifact has not changed since the pin was written. Provenance proves where the artifact came from. The stress test asserts both, and they are different rows.

The mechanism for carrying both is the attestation. Chainguard's documentation defines the pattern: "Attestations are commonly used for associating useful metadata such as SBOMs or SLSA provenance with a specific artifact such as an OCI container image" (https://edu.chainguard.dev/open-source/sigstore/cosign/how-to-sign-an-sbom-with-cosign/, jev weight 0.83, authoritative). Policy-engine material shows the enforcement end: an admission rule that accepts an image only when it "has a valid SLSA provenance attestation and a CycloneDX SBOM attestation, both signed by the approved CI workflow identity" (https://www.systemshardening.com/articles/cicd/container-image-attestations/, jev weight 0.65, authoritative). Practitioner walk-throughs cover the same flow end to end: attest SLSA provenance and SBOM with cosign, then verify the signature and attestations before deploy (https://devopscube.com/container-image-signing-kubernetes/, jev weight 0.53, authoritative-bordering, still at or above the 0.5 line), and keyless signing in CI with Kyverno enforcement (https://imzye.com/Container/Cosign-Image-Signing-SLSA-Provenance/, jev weight 0.18, weak backing).

## The 4-check artifact-trust test

For each published release image, the assertion set has 4 rows:

1. Digest match. The published image digest equals the digest recorded in the project's pin file. In yubiOS that file is PINNED.md (12,017 bytes, per GET https://api.github.com/repos/yubi-OS/yubiOS/contents/refs?ref=main), described as "the source of truth for approved image digests". Pass: byte-equal digests for every published image.
2. Provenance verification. The SLSA provenance attestation exists, is signed, and names the expected CI workflow identity as its builder. Pass: cosign verification succeeds and the builder identity matches policy.
3. SBOM attestation. A signed SBOM attestation is attached and the inventory is consistent with the image. Pass: verification succeeds.
4. Reproduction. A rebuild from source produces the same digest. This is the strongest row, and the one most projects skip.

## Reproducibility: the difference between claim and proof

The Iron Bank documentation defines the bar: "building the same Dockerfile with the same inputs always yields an identical container image digest (SHA)" and links reproducible builds to "stronger supply chain security" (https://docs-ironbank.dso.mil/hardening/reproducible-builds/, jev weight 0.83, authoritative). The reason this row outranks the others is stated well in weaker-source material that still describes the real mechanism: "Without reproducible builds, you must trust the build system. If the CI runner is compromised, it can inject code during the build process, and the resulting image will have a different digest that nobody questions" (https://www.systemshardening.com/articles/cicd/reproducible-builds/, jev weight 0.24, weak backing; the sentence is the standard argument and is consistent with the Iron Bank definition). Hands-on lab material confirms the practice pattern: digest pinning, build-argument control, diffoscope comparison, and CI verification (https://secure-pipelines.com/ci-cd-security/lab-reproducible-container-builds-pinning-verifying-diffing/, jev weight 0.29, weak backing).

The verdict scale for row 4 is binary in a useful way. Reproducibility demonstrated more than once is proof that the digest is a function of the source. Reproducibility demonstrated zero times means the pin-by-digest claim has not been earned beyond a single CI build: the digest is a label, not a guarantee. This is the distinction between a design claim and a demonstrated property, applied to one file.

## Signature verification at the boot boundary

For an OS project, the image-level checks have a boot-level twin. The yubiOS repo carries tests/verify-uki-signature.sh (1,915 bytes) and tests/verify-oci-attestations.sh (4,768 bytes), wired into CI (per GET https://api.github.com/repos/yubi-OS/yubiOS/contents/tests?ref=main). The corresponding open-source tooling context is documented in general-audience material: signing and verifying container images with Sigstore tooling is the standard practice the attestations ride on (https://opensource.com/article/21/12/sigstore-container-images, jev weight 0.64, authoritative). The assertion set should link the 2 layers: a UKI that boots must be traceable to a signed image whose provenance and SBOM verify, otherwise the boot chain trusts an artifact whose supply chain was never checked.

## The yubiOS application

The repo cross-check (GET https://api.github.com/repos/yubi-OS/yubiOS/contents/scripts?ref=main) found the verification harness present at script level: scripts/verify-reproducible-images.sh (5,230 bytes), verify-reproducible-installer.py, verify-reproducible-firmware.py, plus the 2 verification shell scripts and a package-floor check (verify-package-floor.sh, 6,168 bytes). The recorded gap: no evidence that reproducibility has been run end-to-end on a real published release. In this doc's terms, rows 1 through 3 have tooling; row 4 has tooling but no demonstrated run, so the pin-by-digest claim sits at design-claim status pending one executed reproduction.

## What a red team does with this

The red team treats every published artifact as a claim. Its procedure is cheap and mechanical: fetch the artifact, run the 4 checks, record which rows pass. A project that passes rows 1 to 3 and has never demonstrated row 4 gets the accurate verdict: integrity controls exist, but the strongest form of the claim is unproven. The red team's report then writes itself: provenance verified, reproduction never demonstrated, pin file trusted only as far as the CI system that produced it.
