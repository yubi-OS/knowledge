# 01 - SLSA v1.0 Build Track Levels and the v0.2 to v1.0 Migration

Scope: what the SLSA Build track levels L1 to L3 actually require, how SLSA v1.0 (April 2023) restructured the older v0.2 model, and why yubiOS targets Build L3 specifically.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc). All level requirements below are anchored to the official spec pages plus the source doc.

## The three Build track levels

SLSA describes provenance as the record of "what entity built the artifact, what process they used, and what the inputs were"; the lowest level only requires provenance to exist while higher levels add increasing protection against tampering of the build, the provenance, or the artifact [https://slsa.dev/spec/v1.0/levels, jev 0.94].

The Build track ladder, as the source doc tabulates it, maps cleanly onto the spec's intent:

- L1: provenance exists, showing how the artifact was built (source doc).
- L2: provenance is authenticated, signed by a service (source doc).
- L3: provenance is non-falsifiable because the build runs in a hardened, isolated environment the tenant project cannot tamper with (source doc).

The descriptive overview of the build track confirms it is "organized into a series of levels that provide increasing supply chain security guarantees," giving confidence that software has not been tampered with and can be traced back to its source [https://slsa.dev/spec/v1.2/build-track-basics, jev 0.65].

## What v1.0 changed from v0.2

SLSA v1.0 was released in April 2023; OpenSSF announced it as providing "auditable data, in machine-readable form, that validates the chain of custody from code authors to the binaries deployed in production systems" [https://openssf.org/press-release/2023/04/19/openssf-announces-slsa-version-1-0-release/, jev 0.92]. The "What's new in SLSA v1.0" page states that v1.0 simplifies the build model and the recommended provenance format to make them easier to apply to arbitrary build platforms, and that a major source of confusion in earlier SLSA was how to model a build and represent it in provenance [https://slsa.dev/spec/v1.0/whats-new, jev 0.92].

The source doc carries a dated correction (2026-07-24) recording the practical consequences: the combined Source plus Build levels model was removed, source requirements were split out of the Build track entirely, and the Build track now runs L1 to L3 only. There is no Build L4; "L4" language is v0.2-era and should not be used going forward (source doc, verified by it against slsa.dev/spec/v1.0/levels and slsa.dev/spec/v1.0/provenance).

One third-party writeup agrees with the track split but adds specifics worth noting as weak backing: it states the Build Track defines three numeric levels (L1 to L3), the Source Track v1.2 defines L1 to L4 where L4 introduces two-party review of source changes, and that the previous v0.1 model including a Build L4 was restructured for v1.0 [https://crashoverride.com/resources/knowledge-base/provenance/slsa-source-track, jev 0.10, weak]. Treat the Source Track L4 detail as unverified here; the load-bearing point, that source review requirements are a separate track and not a Build level, is corroborated by the source doc's own correction.

## Why yubiOS targets Build L3

The source doc fixes the practical target at Build L3: "Level 3 is the practical target for yubiOS." It also explicitly de-emphasizes the aspirational bundle of hermetic builds, reproducible builds, and two-party review, calling that "source-track-adjacent hygiene beyond L3, not a numbered Build level" (source doc). This matters for planning: chasing that bundle as if it were "L4" misreads the v1.0 model, because no Build L4 exists to chase.

## Threat mapping behind the ladder

A third-party decomposition of the SLSA spec maps threats to the levels that mitigate them: build from modified source is mitigated by comparing provenance against expectations from L1 onward, compromise of the build process is mitigated by isolation between builds at L3, and upload of a modified package is mitigated by verifying provenance authenticity from L2 onward; source-integrity threats are planned for other tracks [https://deepwiki.com/slsa-framework/slsa/2-slsa-specification, jev 0.11, weak]. The pattern is consistent with the official descriptions above even though the source itself is low-weighted.

## Practical reading for the corpus

Two consequences flow into the rest of this corpus:

1. Provenance format work (doc 03) should target the v1.0 predicate only; v0.2 shapes are legacy.
2. Generator and verification work (docs 02, 04, 05) is how L3 is actually achieved and checked, since L3's requirement is an isolated build environment, which the slsa-github-generator reusable workflows provide on GitHub-hosted runners (source doc).

Weak sources consulted but not load-bearing: a compliance checklist page describing v1.0 as Build Levels 0 through 3 [https://secure-pipelines.com/ci-cd-security/slsa-levels-explained-practical-compliance-checklist/, jev 0.11] and a vendor explainer [https://docs.devguard.org/explanations/supply-chain-security/slsa-framework/, jev 0.13]. Neither contradicts the spec pages; both are secondary.
