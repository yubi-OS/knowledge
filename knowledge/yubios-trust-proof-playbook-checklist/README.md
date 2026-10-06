# yubios-trust-proof-playbook-checklist

Knowledge corpus minted from the yubiOS refs note `yubios-trust-proof-playbook-checklist-2026-08-07.md` (source: Duck.ai conversation block 4 of 7, 2026-08-02). Topic: trust-proof playbooks and printable checklists for security products, the artifact structure for proving trust claims, and integration with CI so the checklist stays true.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [trust-claims-verification-axes.md](01-trust-claims-verification-axes.md) | Decomposing a product's trust claims into numbered, checkable verification axes (the 10-axis pattern: provenance, pinning, boot, storage, keys, enrollment, recovery, rollback, platform, failure). |
| 02 | [operator-playbook-structure.md](02-operator-playbook-structure.md) | The 14-section operator playbook shape: purpose, scope, success criteria, then per-axis Goal/Checks/Pass-if/Fail-if blocks. |
| 03 | [printable-checklist-design.md](03-printable-checklist-design.md) | One-page printable checklist artifact design: name/date/host/arch header, one checkbox per line grouped in sections, final decision block with PASS/FAIL and signoff. |
| 04 | [falsifiable-mechanical-rules.md](04-falsifiable-mechanical-rules.md) | Mapping each checkbox to a falsifiable rule (exit code, byte/string match, log count) so the trust decision is mechanically decidable, not subjective. |
| 05 | [ci-parity-integration.md](05-ci-parity-integration.md) | Keeping the checklist true via CI: the CI gates as the automated counterpart, checkbox-to-test-to-signal cross-ref tables, and preventing drift between manual worksheet and CI. |
| 06 | [phased-test-plan.md](06-phased-test-plan.md) | Structured adversarial test plans: baseline verification, intentional failures, recovery, upgrade and rollback phases with a final pass condition. |
| 07 | [evidence-packaging-signoff.md](07-evidence-packaging-signoff.md) | The signed, dated, signed-off worksheet as audit evidence: packaging for HITRUST/CISA reviewers, filing copies with evidence bundles, PDF generation for printouts. |
| 08 | [fail-closed-verification.md](08-fail-closed-verification.md) | Verifying fail-closed behavior by breaking one thing at a time: wrong image, missing key, modified UKI, corrupted boot artifact, invalid enrollment state. |

## Research summary

- Results collected: 96 (top 6 per query, 16 queries across 8 subtopics)
- Weight split: 11 authoritative (noul >= 0.5) / 85 weak (noul < 0.5) of 96; 0 unweighted (all weights resolved, 0 null)
- Jev requests: 21 (1 outline score request with 8 questions, 20 noul weighting requests with 5 questions each), usage 16342 input / 0 output tokens
- Dig redos: 0 (all 16 first-attempt queries returned healthy result counts; 2 jev request-level 429 retries recovered with the 30s backoff rule)
- Skipped docs: none (all 8 subtopics scored >= 1.24 on the outline score metric and were authored)
- Outline validation scores (clef score metric, 0 drop / 1 marginal / 2 load-bearing): t01 1.87, t02 1.78, t03 1.83, t04 1.69, t05 1.24, t06 1.41, t07 1.65, t08 1.71. No subtopic scored 0, so none were dropped.

Per-doc source counts:

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-trust-claims-verification-axes | 12 | 1 |
| 02-operator-playbook-structure | 12 | 2 |
| 03-printable-checklist-design | 12 | 1 |
| 04-falsifiable-mechanical-rules | 12 | 2 |
| 05-ci-parity-integration | 12 | 1 |
| 06-phased-test-plan | 12 | 1 |
| 07-evidence-packaging-signoff | 12 | 1 |
| 08-fail-closed-verification | 12 | 2 |

## Gaps

- The web dig returned thin primary-source coverage on the operator-playbook and printable-checklist axes (the strongest public material on this topic lives in the yubiOS refs corpus itself). Docs 02 and 03 lean on the source doc's own recorded artifact structure, with external corroboration labeled weak where it is weak.
- The 24-hour test plan and falsifiable rule tables are reproduced from the source doc's recorded structure; no independent public source describes the yubiOS artifact, so all yubiOS-specific claims carry the source doc's transcript citation (weak source) and are labeled as such in text.

## Preflight

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
