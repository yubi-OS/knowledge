# 01 Digest-pinned bootc images and build-time provenance

Scope: what digest-pinned bootable OCI images are, how build-time provenance is attached and verified, and which production pipelines (Fedora Image Mode, RHEL image mode) anchor the C1 claim of the attested cutover synthesis.

## The bootc substrate

bootc applies the container image model to bootable host systems: standard OCI/Docker containers serve as the transport and storage format for the operating system, and the same image is used both to boot and to upgrade the host (weight 0.90, https://github.com/bootc-dev/bootc). This is the substrate the attested cutover synthesis depends on: one immutable artifact whose content digest can be named, pinned, and later evaluated by a policy gate before a guest is allowed to run.

Image mode is a shipped enterprise path, not an experiment. Red Hat documents image mode as the downstream product of the upstream bootc Fedora project, included in RHEL 9.6 and RHEL 10, using the bootc tool to build, deploy, and manage the operating system like a container image (weight 0.74, https://developers.redhat.com/products/rhel/image-mode). RHEL 10 positions image mode as a deployment option alongside classic package mode (weight 0.59, https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux-10/image-mode). Red Hat's June 5, 2026 walkthrough of installing RHEL 10 from a bootc image names atomic updates and consistent, reliable deployment as the reason to choose this path (weight 0.87, https://developers.redhat.com/articles/2026/06/05/installing-red-hat-enterprise-linux-10-bootc-image-bootc).

Fedora is converging on the same pipeline upstream. The Fedora Image Mode Phase 2 (2026) initiative tracks feature requests, bug reports, and experimental results for upstream bootc and Konflux, with milestones that include a clean development pipeline and a sustainable image build path (weight 0.66, https://fedoraproject.org/wiki/Initiatives/Image_Mode,_Phase_2_(2026)). Its project planning page records the work to document existing pathways for building bootc-based Fedora artifacts with Konflux, including temporary hacks still being smoothed out (weight 0.50, https://fedoraproject.org/wiki/Initiatives/Image_Mode,_Phase_2_(2026)/project_planning, borderline weight: cite as planning-state evidence only).

## Provenance attached at build time

Docker documents that build provenance metadata traces the origin of an image and supports compliance with SLSA (weight 0.95, https://docs.docker.com/dhi/explore/security-concepts/provenance/). This is the general industry pattern the synthesis assumes: the artifact carries signed build metadata, and the consumer can check that the metadata matches what policy expects before running it.

Signing of bootc images specifically is documented by practitioners rather than by a single canonical standard. A practitioner writeup on bootc signed images describes generating a key pair and verifying signed bootable container images, confirming that bootc supports the flow (weight 0.45, https://martin.skoett.name/posts/2024/bootc-signed-images/, weak backing). A 2026 explainer on cosign, SLSA, and provenance describes the same trust chain at the container-ecosystem level (weight 0.45, https://sandeepkumarchaudhary.com/blog/cosign-slsa-and-provenance-container-trust-explained, weak backing). A community best-practices repository collects guidance for building bootc images, including migration of applications into them (weight 0.41, https://github.com/andrew-weida/bootc-container-image-best-practices, weak backing).

The end-to-end framing the synthesis needs, a chain from build to registry to node where the node consumes exactly the digest it was authorized to run, appears mainly in secondary sources aimed at GPU fleets (weight 0.18, https://ai-infrastructure.net/container-image-provenance/, weak backing). Treat the pattern as widely described but not standardized end to end.

## What this means for the C1 claim

C1 of the synthesis ("the bootc OCI image digest is the one the policy approved") rests on three facts this dig supports:

1. The artifact model exists and is mainstream: bootc plus image mode in RHEL and Fedora Phase 2 (weights 0.90, 0.74, 0.87).
2. Provenance metadata and SLSA-aligned verification are established practice in the container ecosystem (weight 0.95, Docker docs).
3. Signing of bootc images works but is documented practitioner-side, with no single canonical digest-to-policy binding standard visible in the results (weights 0.45, 0.45, weak backing).

The gap that motivates the synthesis is consistent with the dig: the ecosystem pins and verifies digests at the registry and build level, but the results show no canonical mechanism that evaluates that verification at a VM launch boundary. That absence is what the later docs (04, 05) build on.

## Known unknowns

The dig did not surface a primary specification for the SLSA provenance predicate version or cosign attestation types in the kept results; the claims above about SLSA compliance are anchored to vendor documentation (Docker, Red Hat) rather than the SLSA spec itself. Any corpus consumer wanting predicate-level detail should treat this doc as a pointer, not a source of record.
