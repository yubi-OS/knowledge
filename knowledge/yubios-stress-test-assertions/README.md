# yubios-stress-test-assertions
Adversarial stress testing of security design claims: separating design claims from demonstrated properties, and building the assertion set that an external red team would test.
## Docs
- `01-design-claims-versus-evidence.md`: Taxonomy for separating a security design claim from a demonstrated property, and the 3 mechanisms that convert one into the other.
- `02-falsifiable-assertion-sets.md`: How to write red-team-grade assertion rows: falsifiable pass criteria, a fail-closed or clean-recovery pass rule, and 6 required fields per row.
- `03-boot-chain-tamper-tests.md`: Tamper-per-link stress matrix for the verified boot chain (UKI, loader entry, signing material, digest pins, root digest) plus a TOCTOU case.
- `04-key-loss-recovery-stress.md`: Stress of credential-loss paths across disk unlock, SSH, and PAM, with the rule that a single unrecoverable token is a fail.
- `05-enrollment-partial-state.md`: Partial-enrollment hazard testing: skipped steps must auto-recover or block completion, never leave a silently weaker state.
- `06-artifact-trust-verification.md`: Digest pinning, SLSA provenance, SBOM attestations, and reproducible-build reproduction as the proof for pin-by-digest claims.
- `07-platform-trust-matrix.md`: Per-platform trust-difference disclosure across ARM64 and x86-64, including the OEM-firmware and optional-TPM anchor conditions.
- `08-cicd-runtime-drift-audit.md`: Auditing the CI-to-runtime gap: detecting policy, test-only, or best-effort artifacts in production image layer history.

## Research summary
- Results collected: 108 (96 initial + 12 redo)
- Weight split: 40 authoritative (weight >= 0.5) / 68 weak (weight < 0.5)
- Jev requests: 25 (1 probe, 1 outline score, 23 weighting), usage 18805 input / 0 output tokens
- Redo counts: doc 08 dig redone once (attempt 2, different queries) after its first dig returned 0 authoritative sources
- Skipped docs: none; doc 08 was retained after its redo produced an authoritative source (Docker official docker image history reference, weight 0.98) and its weak-backed claims are labeled in text

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-design-claims-versus-evidence | 12 | 6 |
| 02-falsifiable-assertion-sets | 12 | 2 |
| 03-boot-chain-tamper-tests | 12 | 7 |
| 04-key-loss-recovery-stress | 12 | 6 |
| 05-enrollment-partial-state | 12 | 6 |
| 06-artifact-trust-verification | 12 | 6 |
| 07-platform-trust-matrix | 12 | 5 |
| 08-cicd-runtime-drift-audit | 24 | 2 |

## Redo log

- 08-cicd-runtime-drift-audit: 1 redo. Reason: first dig produced 0 sources with weight >= 0.5. New queries: 'production promotion gate container image policy enforcement supply chain' and 'inspect container image layers find test artifacts production docker history'. Outcome: 2 authoritative sources found (docker image history reference 0.98; Merriam-Webster production definition 0.90).

## Gaps / skips

- none
