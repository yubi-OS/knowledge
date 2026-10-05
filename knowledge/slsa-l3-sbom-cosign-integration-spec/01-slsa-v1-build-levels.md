# SLSA v1.0 Build track levels: L1, L2, L3, and the no-Build-L4 fact

Scope: what each SLSA v1.0 Build level requires, why Build L4 does not exist in v1.0, how the Source track split changes the framing, and what the L3 isolation bar actually says.

## The level ladder

The SLSA v1.0 Build track is defined in four steps: Build L0 (no guarantees), Build L1 (provenance exists), Build L2 (hosted build platform), Build L3 (hardened builds). Source: https://slsa.dev/spec/v1.0/levels (weight 0.97, primary).

The build track is organized as a series of levels that provide increasing supply chain security guarantees, giving consumers confidence that software has not been tampered with and can be securely traced back to its source. Source: https://slsa.dev/spec/v1.2/build-track-basics (weight 0.96, primary).

At the framework level, SLSA is a security framework: a checklist of standards and controls to prevent tampering, improve integrity, and secure packages and infrastructure across a supply chain. Source: https://slsa.dev/ (weight 0.96, primary).

## What provenance describes at each level

Provenance describes what entity built the artifact, what process they used, and what the inputs were; the build track describes increasing trustworthiness and completeness in that provenance. Source: https://marklodato.github.io/slsa/spec/v1.0-rc2/levels (weight 0.21, weak backing, community mirror of the spec). Treat the operational reading of each level against the primary levels page above.

## Tracks, not a single ladder

A key structural fact: SLSA is composed of multiple tracks, each composed of multiple levels. Each track addresses different threats and has its own set of requirements and patterns of use. The Build track describes increasing levels of trustworthiness and completeness in a package artifact's provenance. Source: https://slsa.dev/spec/v1.2/tracks (weight 0.93, primary).

The v1.0 specification focused primarily on the Build track, with additional tracks such as a Source track planned for later versions. Source: https://deepwiki.com/slsa-framework/slsa/2-slsa-specification (weight 0.21, weak backing).

## The no-Build-L4 fact and where the L4 confusion comes from

The strongest collected evidence for the ladder is the primary levels page: it stops at Build L3 (weight 0.97). There is no Build L4 in the v1.0 Build track.

The likely source of the persistent "Build L4" confusion: SLSA v1.0 splits supply chain assurance into separate tracks (Build, Source, and others). The Build track defines three numeric levels, L1 through L3. The Source Track v1.2 defines L1 through L4, with L4 introducing two-party review of source changes. Source: https://crashoverride.com/resources/knowledge-base/provenance/slsa-source-track (weight 0.25, weak backing, vendor knowledge base).

So an L4 exists in the SLSA system, but it is a Source-track level about source change review, not a Build-track level about build isolation. A team targeting "Build L4" should restate the target as Build L3 plus the Source-track controls they actually want (versioned history, retention, two-person review). The primary evidence for the Build ladder cap is 0.97; the track-split explanation is weakly backed at 0.25 and should be verified against the spec's tracks page (0.93) before repeating it as settled fact.

## What L3 adds in practice

Build L3 adds isolation guarantees on top of L2: the build environment is hardened so that even a compromised build script or malicious dependency cannot tamper with the provenance or other tenants on the build system. The stated requirement is a hardened build platform providing strong isolation between build jobs. Source: https://secure-pipelines.com/ci-cd-security/slsa-levels-explained-practical-compliance-checklist/ (weight 0.19, weak backing, secondary explainer).

The level structure itself is primary-sourced (0.97, 0.96, 0.93); the operational phrasing of what L3 isolation requires in concrete terms comes from a weak secondary source. Before writing enforcement code against that phrasing, check the detailed requirements page. Source: https://slsa.dev/spec/v1.2/build-requirements (weight 0.96, primary, collected in the isolation dig of this corpus).

## Verification takeaway

For any CI attestation program: target Build L3, not Build L4. Emit provenance (L1), authenticate it with a hosted build platform's signing (L2), and put the build on a hardened, isolated builder (L3). Keep Source-track requirements (two-person review, retention) out of the Build-level claim and track them separately.
