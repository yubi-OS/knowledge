# 04 - Claim ledger: approved wording, evidence links, forbidden claims

Scope: the per-topic claim ledger that fixes approved wording, required evidence links, and the do-not-say boundary for each public claim, plus the ledger's administrative rule (owner, evidence link, review date, maturity label).

Grounding spine: yubi-OS/yubiOS docs/PR.md, section "Claim ledger". Internal-record subtopic, no dig; all claims are source-doc claims.

## The ledger rule

Every public claim must have an owner, an evidence link, a review date, and a maturity label. The table below is the starter ledger the document ships with (source doc: yubi-OS/yubiOS docs/PR.md). Each row has 3 fields: approved wording now, evidence, and do-not-say-yet.

## The ledger rows

| Topic | Approved wording now | Evidence | Do not say yet |
|---|---|---|---|
| Status | "Pre-launch," "experimental," "groundwork," "technical preview" | README.md, TODO.md (unfilled), BLOCKERS.md | "Production-ready," "GA," "safe for daily use" |
| YubiKey role | "Owner-facing human-presence and identity root" | SPEC.md, ARCHITECTURE.md, THREAT_MODEL.md | "The only root of trust at every layer" |
| TPM stance | "No mandatory TPM for owner-facing disk unlock or identity workflows" | ADR-003, SPEC.md | Unqualified "No TPM" or "replaces every TPM function" |
| Secure Boot | "Designed to sign UKIs through YubiKey PIV slot 9c using PKCS#11" | ADR-002, the sbsign validation note (refs/sbsign-pkcs11-validate-2026-07-23.md) | "FIDO2 signs Secure Boot artifacts" or "production signing fully proven" |
| FIDO2 unlock | "Designed around FIDO2 hmac-secret, PIN, touch, and an offline recovery key" | ADR-003, the LUKS/FIDO2 test note (refs/luks-fido2-e2e-test-2026-07-23.md) | "Production hardware flow fully validated" until physical evidence exists |
| Immutable OS | "/usr is intended to be read-only and verified through composefs/erofs and dm-verity" | SPEC.md, ARCHITECTURE.md | "The whole system is immutable" or "runtime compromise is impossible" |
| ARM64 | "Primary target and planned owner-owned platform-root path" | ADR-023, the board status note (refs/arm64-path-a-b-board-status-2026-07-23.md) | "Production Path A is proven" |
| x86-64 | "Supported above the UKI; OEM firmware remains below the owner-controlled boundary" | SPEC.md, THREAT_MODEL.md | "No OEM trust on x86-64" |
| VM evidence | "The recorded ARM64 lane reached a Fedora guest; enrollment proof remained gated by a guest failure in that run" | refs/vm-e2e-run-29525332901.md | "ARM64 end-to-end CI is green" without a newer verified run |
| Software authenticators | "TEST-only regression tools isolated to dev tags" | ADR-026, CI_MAP.md | "Equivalent to a physical YubiKey" |
| Supply chain | "Builds are designed to use digest-pinned inputs, policy gates, provenance, and SBOM attestations" | PINNED.md, CI_MAP.md, MISSION.md | A SLSA level unless independently verified against the current specification |
| PQ TLS | "Current dependency floors are intended to preserve hybrid ML-KEM defaults, with CI drift checks" | ADR-025, TODO.md (unfilled) | "Post-quantum secure" as a whole-product guarantee |
| Firmware inspection | "One-shot, warning-oriented first-boot inspection" | ADR-024, MITIGATE.md | "CHIPSEC proves firmware is clean" |
| AI resilience | "Designed so deployed authority depends on verification rather than trust in an author" | MISSION.md, THREAT_MODEL.md | "AI cannot compromise yubiOS" or "verification proves the code is benign" |

## How to read the ledger

The pattern across all 14 rows is the same: the approved wording is either designed-to or measured-observed, never proven-everywhere. The do-not-say column blocks 3 failure shapes: absolute claims (whole-system immutability, AI immunity), scope inflation (sole root of trust at every layer, unqualified No TPM), and maturity smuggling (calling a TEST-only tool equivalent to hardware, or claiming green CI from a run that ended in a guest failure).

Two rows carry dated evidence notes rather than living documents (the sbsign and LUKS/FIDO2 test notes and the VM evidence run), which means their claims are pinned to a specific 2026-07-23 era of evidence and must be re-validated, not re-quoted, when the project moves (source doc).

The ledger is the pre-publish check for every artifact in the campaign: docs 07 and 08 (channels, outreach) inherit their wording from it, and the launch runbook in doc 09 makes go/no-go depend on claims matching it.
