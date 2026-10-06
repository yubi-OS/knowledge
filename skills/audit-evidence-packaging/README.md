# skills/audit-evidence-packaging

Knowledge corpus explicating the yubiOS skill `audit-evidence-packaging` (ground source: yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md). The skill teaches building cryptographically-signed evidence bundles: collect logs, metrics, events into a versioned hash-chained archive, generate a TPM2 or YubiKey attestation quote over the bundle's Merkle root, attach a transparency-log entry (Rekor v2), and expose a verifier auditors can re-run independently.

## Docs

- 01-evidence-bundle-overview.md: The 4 properties of an evidence bundle (tamper-evident, attestable, transparent, independently verifiable) and the in-toto Statement v1 derivation.
- 02-when-to-use-audit-frameworks.md: 8 use cases (HITRUST, CISA ZTMM v2.0, SOC2/ISO, attestation quotes, CI/CD, Chronicle, retention, third-party verification) and the 4 do-not-use cases.
- 03-bundle-anatomy.md: The bundle layout and what each file binds: manifest.json, merkle-root.txt, artifacts/, attestation/, verifier/.
- 04-generating-bundles.md: The evidence-bundle CLI and the 7-step generation pipeline, including PCR quoting and YubiKey PIV slot 9c signing.
- 05-verifying-bundles.md: The 7-step independent verification path an auditor runs with evidence-bundle verify, ending in a PASS/FAIL verdict.
- 06-bundling-strategy.md: Per-day bundles with rolling IMA anchoring and weekly Merkle-root summary bundles for long-term verification.
- 07-anti-patterns.md: The 6 anti-patterns and the property each one silently deletes, with external evidence for the key-separation and transparency rules.
- 08-standards-and-ecosystem.md: The referenced standards (in-toto, Rekor v2, TCG TPM 2.0, HITRUST CSF, CISA ZTMM) and the 5 sibling yubiOS skills.

## Research summary

- Results collected: 95 (16 searXNG queries, 2 per subtopic, top 6 per query kept with URL dedup)
- Weight split: 28 high (weight >= 0.5) / 67 low (weight < 0.5), all 95 weighted, none null
- Jev: 9 requests (15120 input / 2356 output tokens), metric score for outline validation, noul for weighting
- Redos: 0 (all 16 queries returned results on attempt 1)
- Skipped docs: none (all 8 subtopics scored >= 1 in outline validation; none dropped)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (typesafe/jev-1.13 via DefAPI) 200 on every request.
