# Determinism and reproducible output

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** the determinism channel: the three determinism classes, SOURCE_DATE_EPOCH, and the canonicalization procedure that turns a determinism claim from hand-waving into a testable contract.

## Scope

Guideline 7 of the source doc: "Determinism is a spectrum. `logical` (same inputs -> same logical result), `byte_identical` (same inputs -> same bytes), `reproducible_build` (same toolchain + pinned deps + same bytes across hosts). State which; document the canonicalization procedure for any non-`logical` claim" (source doc).

The distinction matters because consumers build different promises on each class. A `logical` determinism claim supports diffing and caching at the semantic level. A `byte_identical` claim supports content-addressed storage and binary comparison. A `reproducible_build` claim supports third-party verification of released artifacts. Declaring the wrong class, or declaring no class, hands consumers a promise they cannot test.

## The canonicalization requirement

The source doc's anti-patterns section is blunt: "Same inputs -> same output without a canonicalization procedure (key sort, locale, line endings, hash over canonical bytes) is hand-waving. State the procedure; verify with two clean builds and compare" (source doc). Guideline 9 adds the pairing requirement: "Reproducibility needs SOURCE_DATE_EPOCH + a canonical procedure. Without both, the byte_identical claim is hand-waving. With both, verify with two clean builds and compare the content hash" (source doc).

The red-flag table gives the observable symptom of a missing declaration: "Two runs of the same command produce different bytes" means the determinism claim is hand-waving (source doc).

## SOURCE_DATE_EPOCH

SOURCE_DATE_EPOCH is "a standardised environment variable that distributions can set centrally and have build tools consume this in order to produce reproducible output", replacing absolute build timestamps with the timestamp of the last source change (https://reproducible-builds.org/docs/source-date-epoch/, weight 0.20, weak backing). The specification at reproducible-builds.org defines the contract for consumers of the variable: build tools interpret it as the earliest permissible build timestamp, so "one can reasonably assume that all source timestamps are before SOURCE_DATE_EPOCH and all builds take place after it", which lets tools preserve source-based timestamps while clamping current-time values (https://reproducible-builds.org/specs/source-date-epoch/, weight 0.19, weak backing).

Reproducible builds generally, "also known as deterministic compilation, is a process of building software which ensures the resulting binary code can be reproduced", typically by removing nondeterministic inputs such as build timestamps, file paths, and randomness (https://en.wikipedia.org/wiki/Reproducible_builds, weight 0.15, weak backing).

## How the yubiOS surfaces apply it

The source doc's Containerfile surface: reproducible-build labels declare determinism to downstream consumers. `SOURCE_DATE_EPOCH=<unix-ts>` "tells downstream consumers that the build is deterministic; without the label, treat the image as non-reproducible" (source doc, Containerfile surface). The example 5 declares the full label set: `io.yubios.commit=<full-sha>`, `io.yubios.build-ts=<rfc3339>`, `io.yubios.source-date-epoch=<unix-ts>`, `io.yubios.reproducible=true`, and pins the determinism class conditionally: "reproducible_build when SOURCE_DATE_EPOCH is pinned; else byte-identical only across same-timestamp rebuilds" (source doc, example 5).

The mkosi surface applies the same rule to OS images: "Reproducibility: pin SOURCE_DATE_EPOCH=<ts> in the build environment to make the image byte-identical across rebuilds" (source doc, mkosi surface), and example 6 declares `determinism: reproducible_build when SOURCE_DATE_EPOCH is pinned` (source doc).

The GitHub Actions surface shows the honest degraded case: "Determinism: logical, digest is stable per base image, but the build artifact varies by timestamp unless SOURCE_DATE_EPOCH is set" (source doc, example 4). The declaration names the class and the boundary condition in one line.

On container build tooling, a CI/CD writeup notes that "the rewrite-timestamp=true flag on buildx's OCI exporter is what actually normalises layer mtimes to the injected epoch; without it, digest pinning and -trimpath alone are insufficient" for bit-for-bit reproducible builds (https://www.kbytechnologies.com/devops-automation/achieving-bit-for-bit-reproducible-builds-in-ci-cd, weight 0.12, weak backing). The lesson generalizes: pinning the epoch variable is necessary but not sufficient; the producer must actually clamp derived timestamps.

## Verification

Two clean builds compared by content hash is the test the source doc prescribes (guideline 9). For a Outputs section, the declaration must name (source doc):

1. The determinism class: logical, byte_identical, or reproducible_build.
2. The canonicalization procedure for any non-logical claim: key sort, locale pinning, line endings, hash over canonical bytes.
3. The timestamp mechanism: SOURCE_DATE_EPOCH pinned in the build environment, or an explicit statement that timestamps vary.
4. The verification evidence: two clean builds and a compared content hash.

A determinism declaration that omits the canonicalization procedure is a red flag by the source doc's own table, and the cycle-10 verification treats a section with unproven claims accordingly (source doc, verification items 7 and 9).
