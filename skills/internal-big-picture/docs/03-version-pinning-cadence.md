# 03 - Source version pinning and re-pin cadence

Scope: the exact versions the spine is pinned to, the per-source re-pin triggers, and why a blanket calendar interval is the wrong re-pinning discipline.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc, fetch date 2026-07-29).

## The pinned versions

The source doc pins four versions, verified by a deep-research pass on 2026-07-29 (source doc):

1. Google Chronicle / Security Operations: no numbered docs-site version. UDM evolves via rolling additions to cloud.google.com/chronicle/docs; cite the specific section page URL per claim. YARA-L 2.0 and Data RBAC are the other vocabulary pins.
2. HITRUST CSF v11.7.0: 14 control categories x 49 control objectives x 156 control specifications, 5 PRISMA maturity levels x 5 HITRUST compliance levels. The doc's own discipline is to pin the specific minor, never write "v11.x" as a citation. The dig confirms v11.7.0 as a real published release via HITRUST's own advisory HAA 2025-005, "HITRUST CSF Version 11.7.0 Release" (https://hitrustalliance.net/advisories/haa-2025-005, weight 0.87).
3. CISA Zero Trust Maturity Model v2.0 (April 2023): 5 pillars, 3 cross-cutting capabilities, 4 maturity stages. The dig corroborates the version and date: CISA's Zero Trust Maturity Model landing page (https://www.cisa.gov/zero-trust-maturity-model, weight 0.95) and its resources listing (https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model, weight 0.96), plus the v2.0 document itself hosted at cisa.gov under a 2023-04 path (https://www.cisa.gov/sites/default/files/2023-04/zero_trust_maturity_model_v2_508.pdf, weight 0.93).
4. systemd v261 (released 2026-06-19, current stable at the source doc's fetch date): UKI with PE sections, DPS, dm-verity on /usr, PCR 11 boot-phase measurements, homectl FIDO2 signing keys (v258+), portable services RootImage=, RootMStack= overlay (v260+), RestrictFileSystemAccess= (v261) (source doc). The dig confirms the canonical re-pin surfaces: the systemd releases page (https://github.com/systemd/systemd/releases, weight 0.93), the project site (https://systemd.io/, weight 0.79), and the repository (https://github.com/systemd/systemd, weight 0.94). This dig confirms where to re-pin; it does not re-verify the v261 pin itself, which is attributed to the source doc's 2026-07-29 fetch date.

## The per-source cadence table

The four sources ship at four different rates, which is exactly why the source doc replaced a blanket interval with per-source triggers (source doc):

| Source | Cadence | Re-pin trigger |
|---|---|---|
| Chronicle | Rolling; UDM/YARA-L versioned per release, no numbered docs-site version | Re-verify any specific UDM/YARA-L claim against cloud.google.com/chronicle/docs before citing |
| HITRUST CSF | Annual minor (v11.x to v11.(x+1)); control numbering can shift | Re-verify the "14x49x156 v11.x structure" claim against hitrustalliance.net/hitrust-framework |
| CISA ZTMM | Biennial (v1.0 Sept 2021; v2.0 April 2023; v3.0 expected in the 2025-2027 window) | Re-pin maturity stages and cross-cutting capabilities when CISA publishes a new ZTMM version |
| systemd | Roughly 6-week minor cycle (v256 through v261) | Re-pin feature primitives (UKI sections, DPS types, BPF-LSM directives, portable services flags) whenever systemd ships a new stable |

## Why blanket re-pinning is wrong

"Re-pin every N months" is wrong because a single interval cannot be right for four shipping rates. A 3-month blanket SLA would be far too slow for a 6-week systemd cycle and unnecessary for a biennial CISA model. The source doc's rule: re-pin per source, triggered by the source's own release event, never by a calendar (source doc). When the version is wrong, the citation is wrong; when the citation is wrong, the primitive mapping is wrong. The version pin is load-bearing for everything downstream in the lens.

## Drift note from the dig

This corpus was minted on 2026-10-06, roughly 3 months after the source doc's 2026-07-29 fetch date. Per the source doc's own cadence table, the systemd pin (6-week cycle) is the one most likely to have moved by now, and should be re-verified against https://github.com/systemd/systemd/releases before being cited in new work. The HITRUST v11.7.0 and CISA ZTMM v2.0 pins are the least likely to have moved (annual and biennial cadences).
