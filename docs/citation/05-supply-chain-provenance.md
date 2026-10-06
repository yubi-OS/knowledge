# 05 - Software supply chain and provenance

Scope: the software supply chain and provenance standards the citation doc names: OpenSSF SLSA v1.0 and the Sigstore cosign plus Rekor transparency-log ecosystem. Grounded in yubi-OS/yubiOS [docs/CITATION.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md) (source doc); dig claims carry URL and jev weight.

## What the source doc cites

The source doc's "Software supply chain & provenance" section lists 2 primary sources [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. OpenSSF, *SLSA: Supply-chain Levels for Software Artifacts (v1.0)*, https://slsa.dev/spec/v1.0/
2. Sigstore project, *cosign / Rekor transparency log*, https://docs.sigstore.dev/

## SLSA v1.0, verified by dig

The specification page the source doc cites, https://slsa.dev/spec/v1.0/ (jev weight 0.92), describes SLSA as a specification for describing and incrementally improving supply chain security, established by industry consensus. The project's front page, https://slsa.dev/ (jev weight 0.84), describes it as a security framework, a checklist of standards, pronounced "salsa". The OpenSSF project page (https://openssf.org/projects/slsa/, jev weight 0.86) frames SLSA as a project for software producers, including open source projects, software vendors, and teams writing first-party code. The source repo is https://github.com/slsa-framework/slsa (jev weight 0.84).

Two OpenSSF announcements date the v1.0 milestone, corroborating the "(v1.0)" in the source doc's citation: the OpenSSF blog post opening the draft version 1.0 for comments (https://openssf.org/blog/2023/03/09/draft-version-1-0-of-slsa-open-for-comments/, jev weight 0.83) and the OpenSSF press release announcing the version 1.0 release (https://openssf.org/press-release/2023/04/19/openssf-announces-slsa-version-1-0-release/, jev weight 0.89). That press release is dated April 19, 2023, which pins SLSA v1.0's release window.

## Sigstore cosign and Rekor, verified by dig

The source doc cites "cosign / Rekor transparency log" under the Sigstore project, pointing at https://docs.sigstore.dev/ [source doc]. The dig confirms both halves of that pairing:

- Rekor is documented at https://docs.sigstore.dev/logging/overview/ (jev weight 0.81) as providing a RESTful API-based server for validation and a transparency log for storage, plus a CLI application. The parent documentation section lives at https://docs.sigstore.dev/logging/ (jev weight 0.81).
- The Sigstore front page (https://www.sigstore.dev/, jev weight 0.66) states that Rekor provides an immutable, tamper-resistant, transparent ledger of signatures and software metadata.
- cosign is the signing client: its repository (https://github.com/sigstore/cosign, jev weight 0.88) describes code signing and transparency for containers and other artifacts, aiming to make signatures invisible infrastructure. The Rekor repository (https://github.com/sigstore/rekor, jev weight 0.81) documents the CLI for making and verifying entries and querying the transparency log for inclusion proofs and integrity verification.

Weak-backing results (labeled as such, jev weight under 0.5): a third-party tutorial on signing and verifying container images with Sigstore and cosign (https://secure-pipelines.com/ci-cd-security/signing-verifying-container-images-sigstore-cosign/, jev weight 0.24) is recorded for provenance only.

## How SLSA and Sigstore divide the provenance problem

The 2 citations are complementary, and the source doc's grouping makes the split visible [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. SLSA is the level framework: it defines what it means for a build to be increasingly tamper-resistant and provides auditable provenance levels a project can be assessed against.
2. Sigstore is the signing and verification substrate: cosign signs artifacts (OCI containers among them) and Rekor persists those signatures in a tamper-evident transparency log with verifiable inclusion proofs.

For yubiOS, which builds bootc OCI images and publishes them, this pairing is the provenance backbone: SLSA describes what provenance the build pipeline should assert, and cosign plus Rekor is how those attestations are signed and made publicly verifiable. The source doc does not pin a SLSA build level for yubiOS itself, and this corpus does not add one.

## Boundary

Both citations are standards-and-tooling citations, not yubiOS-specific claims: SLSA v1.0 and the cosign/Rekor docs are external mechanisms referenced by the source doc. All version and date claims above come from the dig (OpenSSF announcements) or the specification pages themselves, not from the source doc, which names only "(v1.0)" and the doc URLs.
