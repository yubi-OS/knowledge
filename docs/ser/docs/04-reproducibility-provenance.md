# 04 - Reproducibility and provenance

**Scope:** What the ground doc records about reproducibility as a first-class property: pinned base images, digest tracking, evidence files, deterministic OCI delivery, and bootc-based updates.

**Ground spine:** `yubi-OS/yubiOS docs/SER.md` (https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md, jev weight 0.61)

## What the source doc records

The reproducibility section states the property is first-class in yubiOS: the repo uses pinned base images, digest tracking, reproducibility-focused build lanes, and explicit evidence files for CI, firmware, installer, and VM validation (source doc). The install path is designed around deterministic OCI delivery, bootc-based updates, and repeatable build/install commands, which the doc says aligns with SER's immutable provenance and deterministic execution requirements (source doc). Two mapping rows carry this: immutable provenance = pinned digests, CI evidence, ADRs, and research notes tied to concrete build/install outcomes; deterministic execution = bootc-based delivery, pinned build inputs, reproducibility checks, and controlled install paths (source doc).

## The bootc mechanism

The dig grounds bootc, the delivery mechanism the doc names. The Fedora bootc documentation summarizes bootable containers as transactional, in-place operating system updates using OCI and Docker container images (https://docs.fedoraproject.org/en-US/bootc/getting-started/, weight 0.88). The Fedora and CentOS bootc project generates reference base images of bootable containers (https://docs.fedoraproject.org/en-US/bootc/, weight 0.84), and documents how to build derived bootc images on top of them (https://docs.fedoraproject.org/en-US/bootc/building-containers/, weight 0.87). The bootc project repository states the same goal: applying the container model that made Docker layers successful to bootable host systems (https://github.com/bootc-dev/bootc, weight 0.67). These four results are the primary backing for the deterministic-execution row: a bootc-based update path is exactly an OCI-digest-addressed transactional delivery mechanism.

## Reproducible builds as a defined property

The dig's reproducible-builds results are weakly backed but consistent. Two guides define the property the same way: a build process given the same source state, configuration, and environment produces byte-for-byte identical artifacts (https://noopsschool.com/blog/reproducible-builds/, weight 0.16, weak; https://devsecopsschool.com/blog/reproducible-builds/, weight 0.15, weak). A container-specific guide frames the problem as two builds from the same source code producing the same output (https://www.systemshardening.com/articles/cicd/reproducible-builds/, weight 0.21, weak). These corroborate the definition of the property the doc claims as first-class; the yubiOS-specific implementation of it is the source doc's record, not the dig's.

## Provenance plumbing

On provenance metadata, the dig found that the OCI image spec defines 14 standard org.opencontainers.image.* annotations usable for provenance and SBOM linkage (https://safeguard.sh/resources/blog/docker-oci-image-labels-annotations-best-practices, weight 0.21, weak), and that the SLSA Build Provenance specification defines the structure and requirements for provenance attestations attached to built artifacts (https://www.cleanstart.com/blogs/understanding-image-provenance, weight 0.17, weak). Both are weakly backed; they name the standards that a pinned-digest evidence chain would emit, without attesting to how yubiOS uses them.

## What is grounded and what is not

Strong grounding (weights 0.67 to 0.88) covers the bootc delivery mechanism. The reproducible-builds property and OCI/SLSA metadata surfaces are grounded only weakly (0.15 to 0.21). The evidence-file structure for CI, firmware, installer, and VM validation is a source-doc record with no external equivalent dug, and is presented as the doc's own claim (source doc).
