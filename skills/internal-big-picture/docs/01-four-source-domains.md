# 01 - The four source domains

Scope: the four big-picture domains yubiOS draws from (Chronicle security telemetry, HITRUST CSF compliance assurance, CISA Zero Trust doctrine, and Poettering image-based OS architecture), what each contributes, and why a cross-domain lens exists at all.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc).

## Why the lens exists

yubiOS design choices (image-based OS, owner-held YubiKey as root of trust, FIDO2-gated disk unlock, dm-verity-verified /usr, signed UKI, declarative systemd services, attestable build pipeline) each sit inside one of four bodies of prior work. Any question that touches two or more of those bodies needs a shared vocabulary, or every session re-derives the same cross-domain map and drifts. The source doc positions this skill as the cache: a 10-primitive model plus a mapping table plus a synthesis template, loaded once and reused. The primitives are explicitly an observed co-occurrence lens, not a normative taxonomy (source doc).

## Domain 1: security telemetry (Google Chronicle / Security Operations)

Chronicle contributes the detection-as-code vocabulary. Its detection language YARA-L is documented by Google as the rule language for Security Operations; the official getting-started page covers rule structure and evaluation as the primary way analysts express detections (https://docs.cloud.google.com/chronicle/docs/yara-l/getting-started, weight 0.93). Chronicle's UDM (Unified Data Model) is the normalized event schema all ingested events conform to; Google documents UDM-based search and its relationship to rule results as two distinct investigation surfaces (https://docs.cloud.google.com/chronicle/docs/investigation/udm-search-vs-rules-results, weight 0.89), plus statistics and aggregations over UDM search results as an analysis layer (https://docs.cloud.google.com/chronicle/docs/investigation/statistics-aggregations-in-udm-search, weight 0.91). The source doc pins the Chronicle vocabulary to UDM plus YARA-L 2.0 plus Data RBAC, and notes Chronicle does not publish a numbered UDM version, so claims should cite the specific docs page URL per claim (source doc).

## Domain 2: compliance assurance (HITRUST CSF)

HITRUST contributes the control-assurance vocabulary: control categories, control objectives, control specifications, maturity levels, and third-party assessment. The source doc pins CSF v11.7.0 (latest minor at its fetch date of 2026-07-29) with the structure 14 control categories x 49 control objectives x 156 control specifications, organized in 5 PRISMA maturity levels x 5 HITRUST compliance levels (source doc). The dig independently surfaced HITRUST's own advisory announcing the CSF Version 11.7.0 release (https://hitrustalliance.net/advisories/haa-2025-005, weight 0.87), which confirms the v11.7.0 pin is a real published version rather than an internal guess. Third-party attestation is the load-bearing difference from the other three domains: HITRUST attests controls through assessors, not systems through cryptography.

## Domain 3: federal security doctrine (CISA Zero Trust Maturity Model)

CISA contributes the maturity-model vocabulary: pillars, cross-cutting capabilities, and staged maturity. The source doc pins ZTMM v2.0 (April 2023) with 5 pillars (Identity, Devices, Networks, Applications, Data), 3 cross-cutting capabilities (Governance; Visibility and Analytics; Automation and Orchestration), and 4 maturity stages (Traditional, Initial, Advanced, Optimal), with NIST SP 800-207 as the underlying architecture reference (source doc). The dig located CISA's Zero Trust Maturity Model pages (https://www.cisa.gov/zero-trust-maturity-model, weight 0.95; https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model, weight 0.96) and the ZTMM v2.0 publication itself on cisa.gov dated 2023-04 (https://www.cisa.gov/sites/default/files/2023-04/zero_trust_maturity_model_v2_508.pdf, weight 0.93), which corroborates both the version pin and the April 2023 date.

## Domain 4: image-based OS architecture (Lennart Poettering / 0pointer)

Poettering's design-goal corpus contributes the OS-architecture vocabulary: the 17 design goals from "Fitting Everything Together", the UKI/PCR/TPM trust chain, the Discoverable Partitions Specification, hermetic /usr, and the modularity ladder (sysext, portable services, nspawn). The source doc pins systemd v261 (released 2026-06-19, current stable as of its fetch date) and the yubiOS delta: YubiKey PIV/FIDO2 replaces TPM2 for user-identity operations while OP-TEE fTPM retains the platform-measurement layer (source doc).

## What each domain contributes to the lens, in one line each

1. Chronicle: continuous, machine-generated detection and a normalized event model.
2. HITRUST: human-assessed control maturity with third-party attestation.
3. CISA: architecture-level maturity doctrine with staged progression.
4. Poettering: cryptographic, hardware-rooted OS integrity as an engineering practice.

The lens exists because no single domain answers a yubiOS question that spans them. A boot-chain decision is Poettering vocabulary; an auditor conversation about it is HITRUST vocabulary; a SOC integration of its telemetry is Chronicle vocabulary; a government assessment of it is CISA vocabulary. The corpus docs that follow deepen each joint of this map.
