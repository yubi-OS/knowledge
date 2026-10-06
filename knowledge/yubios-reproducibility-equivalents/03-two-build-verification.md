# Two-build reproducibility verification

Scope: building the same artifact twice and diffing the results, the verification surfaces an OS image project needs (image, installer, firmware), and what belongs inside and outside the comparison.

## The prior-art design: diffimage

Edgeless's reproducible-mkosi ships tools/diffimage.sh: build the image twice into separate directories, then diff them with sha256 digests, veritysetup dump, and systemd-dissect --mtree. [1] (weight 0.61) This is the essential move of reproducibility engineering: do not trust that a build is reproducible, measure it. The reproducible-builds.org tools index catalogs exactly this class of tooling, "tools to compare build artifacts and/or detect nondeterminism". [2] (weight 0.88)

The general contract is well stated in practitioner literature: two independent clean builds from the same declared inputs must produce byte-identical or hash-equivalent outputs, and the verification step is itself an engineered artifact. [3] (weight 0.34, weak) CI-focused guides recommend gating merges on the comparison, so a rebuilt commit yields an identical SHA256 digest rather than a close match. [4] (weight 0.20, weak)

## Why images need multiple verification surfaces

A single image diff is not enough for an OS project, because the deliverables are not one artifact. reproducible-builds.org's system-images documentation describes the field's shared problems for VM images, cloud images, live systems, and OS installer ISO images: archives, filesystems, and boot artifacts each introduce their own nondeterminism. [5] (weight 0.81)

yubiOS therefore runs three verification surfaces, one per artifact class (per the yubiOS refs note, 2026-07-30):

1. scripts/verify-reproducible-images.sh builds twice into separate ephemeral docker buildx builders, named yubios-repro-a-$$ and yubios-repro-b-$$ where $$ is the shell PID, and compares the resulting OCI images. Distinct builders matter: a shared build cache would let run B inherit state from run A and mask nondeterminism.

2. scripts/verify-reproducible-installer.py compares the canonical unsigned content of the installer: root filesystem, initrd, and package manifest. It explicitly excludes the signed envelope (yubiOS.efi, systemd-bootaa64.efi.signed, *.raw, ci-secure-boot-cert.pem).

3. scripts/verify-reproducible-firmware.py verifies firmware reproducibility separately.

The boundary rule in item 2 is the important design decision. Reproducible-builds semantics cover what the build process produces deterministically; a signature applied over content with a live key or timestamp is deliberately outside that scope. Comparing unsigned canonical content instead of the signed envelope is the correct cut, and it is the same reasoning the reproducible-builds.org documentation applies when it separates "what the build produces" from surrounding transport metadata. [5] (weight 0.81)

## Comparison tooling

diffoscope-style structural comparison is the standard instrument for the diff step, [2] (weight 0.88) [4] (weight 0.20, weak) with hands-on labs covering digest pinning, build argument control, BuildKit reproducibility, and CI verification workflows as the surrounding discipline. [6] (weight 0.29, weak) For images specifically, systemd-dissect --mtree gives a filesystem-tree diff of an image, and veritysetup dump exposes dm-verity metadata differences, which is why the Edgeless script picks those two instruments alongside plain sha256. [1] (weight 0.61)

yubiOS also exposes operator-facing build modes, scripts/build-local-images.sh with repro-production and repro-dev profiles, so the same verification environment can be run locally rather than only in CI. (per the yubiOS refs note)

## Design lessons

1. Separate builders for build A and build B, or the cache lies to you. [1] (weight 0.61)
2. Verify per artifact class, not once for the whole release: image, installer, and firmware fail for different reasons. [5] (weight 0.81)
3. Define the signed-envelope exclusion explicitly and document it, so a future signature change does not look like a reproducibility regression. (per the yubiOS refs note)
4. Gate the merge on the result, not on a nightly report. [4] (weight 0.20, weak)

## Sources

1. https://github.com/edgelesssys/reproducible-mkosi (weight 0.61)
2. https://reproducible-builds.org/tools/ (weight 0.88)
3. https://buglyst.com/learn/verification/clarity-verify-reproducible-build (weight 0.34, weak)
4. https://www.kbytechnologies.com/devops-automation/achieving-bit-for-bit-reproducible-builds-in-ci-cd (weight 0.20, weak)
5. https://reproducible-builds.org/docs/system-images/ (weight 0.81)
6. https://secure-pipelines.com/ci-cd-security/lab-reproducible-container-builds-pinning-verifying-diffing/ (weight 0.29, weak)
