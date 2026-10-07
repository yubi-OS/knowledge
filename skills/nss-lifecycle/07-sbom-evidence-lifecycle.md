# 07 - SBOMs as versioned evidence, not compliance attachments

Scope: the SBOM-evidence channel of the Lifecycle block: what the 2026 CISA minimum elements require, per-release coverage fields, and the retention and supersession policy that makes an SBOM a lifecycle artifact.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 6, guideline 9, the Anti-patterns list, and Example 7.

## The core reframe

Treat an SBOM as a versioned evidence artifact tied to a specific source, build, package, or deployment, not as a one-time compliance attachment (source doc). The red-flags table gives the observable test: an SBOM with no `retention_policy` field is being treated as a compliance attachment rather than an evidence artifact (source doc). Guideline 9 restates the discipline: per-build generation plus a declared retention policy, per the 2026 CISA minimum elements (source doc).

The "why" the source doc gives: an old SBOM may remain essential for investigating a historical compromise even after the software is no longer deployed, and CISA/NTIA guidance recommends correlating SBOM retention with software lifecycle and generally favors archival retention when decommissioning cannot be positively verified (source doc).

## The 2026 CISA minimum elements (dig-confirmed)

The digs confirm the document the source doc references:

- CISA, the National Security Agency, the FBI, and international partners released joint guidance, 2026 Minimum Elements for a Software Bill of Materials (SBOM), which updates and replaces the minimum elements for an SBOM published by the National Telecommunications and Information Administration (NTIA) in 2021 (https://www.cisa.gov/resources-tools/resources/2026-minimum-elements-software-bill-materials-sbom, jev 0.77, two entries at 0.77 and 0.87; the 0.87 result is the primary CISA resource page).
- The underlying PDF is authored by CISA and partner organizations and updates and replaces the Minimum Elements published by NTIA (https://media.defense.gov/2026/Jul/29/2003971159/-1/-1/1/CSI_2026_cisa_sbom_minimum_elements_508c.PDF, jev 0.75).
- The lineage: the NTIA minimum elements were produced under Executive Order 14028 on Improving the Nation's Cybersecurity (https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom, jev 0.87).
- CISA frames the SBOM as an "ingredients list" for software and a key building block of software security and supply chain risk management, usable to understand the makeup of software components and supply chains (https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom, jev 0.80).

The specific metadata list (author/signature, format name and version, generation context, timestamp, tool and version, SBOM version, component identifiers, dependency relationships, hashes, licenses, component versions) and the requirements that each software version or update should have an associated SBOM and that revised component information requires a revised SBOM are source-doc claims about the 2026 document (source doc), grounded by the confirmed existence and authority of the 2026 publication above.

## Per-release coverage fields

Per release or file, the coverage captures: source revision and artifact digest; SBOM format and schema version; generation phase (before build, build, or after build); tool and generator version; direct and transitive dependency coverage; signature and provenance; VEX and advisory relationships with remediation status; superseded SBOMs; and retention or decommissioning policy (source doc).

The source doc's Example 7 shows the YAML shape:

```yaml
# Lifecycle -- cycle 15
#   artifact: yubios-oci-image
#   artifact_digest: sha256:c965a816b9173cf6f227e6b5b09e321e841ab5f8a49075c112657a0a40b5e761
#   sbom_format: SPDX-2.3
#   sbom_generated_at: 2026-08-12T17:21:36Z
#   generation_phase: build
#   tool: syft 1.6.0
#   vex_status: no_known_vulnerabilities
#   retention_policy: archive_after_removal
#   superseded_sboms:
#     - sha256:6a60ff82...:2026-08-05:replaced-by-current
#   review_cadence: per build (CI re-emits SBOM on every main build)
```

(source doc). Note the review cadence is "per build" with no manual next_review: CI re-emits the SBOM on every main build, which is the review-cadence channel applied to evidence artifacts (source doc).

## Retention and supersession as lifecycle fields

Two fields make the SBOM a lifecycle artifact rather than a static report. First, retention_policy: the yubiOS convention in the Containerfile section is a retention policy expressed over `builds/`, `releases/`, and `archive/` directories, with the Example 7 value archive_after_removal (source doc). Second, superseded_sboms: each superseded SBOM is recorded with its digest, date, and replacement relation (sha256:6a60ff82...:2026-08-05:replaced-by-current in the example), which is the per-file encoding of the "revised component information requires a revised SBOM" principle (source doc). The removed stage's removal eligibility is "archived for reproducibility," and archived means historical only, not maintained (source doc); the SBOM archive is part of that reproducibility surface.

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 6, guideline 9, Anti-patterns (SBOM as a compliance attachment), Red flags (SBOM with no retention_policy), Example 7, "Lifecycle and the yubiOS surface" (Containerfile section).
- https://www.cisa.gov/resources-tools/resources/2026-minimum-elements-software-bill-materials-sbom (jev 0.87)
- https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom (jev 0.87)
- https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom (jev 0.80)
- https://media.defense.gov/2026/Jul/29/2003971159/-1/-1/1/CSI_2026_cisa_sbom_minimum_elements_508c.PDF (jev 0.75)
