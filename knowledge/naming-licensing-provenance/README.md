# naming-licensing-provenance

Knowledge corpus minted from yubi-OS/yubiOS `refs/naming-licensing-provenance-2026-07-25.md`: naming, licensing, and provenance risk management for an open-source security product, the risk register covering trademark, license selection, and provenance claims, with decisions flagged rather than resolved.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [trademark-risk-yubico](01-trademark-risk-yubico.md) | Trademark exposure of the name yubiOS: Yubico's YubiKey marks, Yubi-prefixed marks in the authentication space, and the rebrand-after-traction cost asymmetry. |
| 02 | [nominative-fair-use-disclaimers](02-nominative-fair-use-disclaimers.md) | Nominative fair use vs implied endorsement when a project README leans on a third-party brand's badges and naming, and the standard non-affiliation disclaimer practice. |
| 03 | [fork-attribution-practice](03-fork-attribution-practice.md) | Fork naming and upstream attribution practice: keeping upstream LICENSE and NOTICE files intact when renaming or forking existing open-source projects. |
| 04 | [lgpl-21-license-fit](04-lgpl-21-license-fit.md) | LGPL-2.1 fit for a commercial-layer OS project: permitted commercial use, modification and redistribution, separately replaceable components, and notice preservation. |
| 05 | [fork-license-inheritance](05-fork-license-inheritance.md) | License inheritance from forked dependencies: bootc/mkosi Apache-2.0 family, ARM Trusted Firmware and OP-TEE BSD-3-Clause, U-Boot GPL-2.0, ms-tpm-20-ref BSD, and the per-repo verification discipline before distribution. |
| 06 | [contributor-provenance-dco-cla](06-contributor-provenance-dco-cla.md) | Contributor provenance policy: DCO vs CLA for LGPL projects, AI-assisted commit conventions (Assisted-by trailers, no auto Signed-off-by), and formalizing CONTRIBUTING.md. |
| 07 | [provenance-claims-slsa](07-provenance-claims-slsa.md) | Making honest provenance claims for an open-source security product: SLSA levels, in-toto attestations, and supply-chain provenance statements about build and AI-assisted authorship. |
| 08 | [entity-path-contract-liability](08-entity-path-contract-liability.md) | Why signing paid support contracts and carrying managed-service liability wants an entity in place first: sole proprietorship vs LLC tradeoffs for a pre-launch OSS maintainer. | |

## Research summary

- Results collected: 108 (searXNG, top 6 per query, 2 queries per doc)
- Weight split: 39 authoritative (weight >= 0.5), 69 weak (weight < 0.5), 0 unweighted
- Jev requests: 23 (usage 18298 input / 0 output tokens)
- Redo counts: doc 03 re-dug once with different queries (thin primary sources on first dig); all other docs dug once
- Skipped docs: none. All 8 docs authored.
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
- Preflight note: the searXNG probe returned 106 results; 11 engines reported Suspended status in unresponsive_engines (recorded honestly in research-db/preflight.json). Every query returned results.

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-trademark-risk-yubico | 12 | 6 |
| 02-nominative-fair-use-disclaimers | 12 | 4 |
| 03-fork-attribution-practice | 24 | 8 |
| 04-lgpl-21-license-fit | 12 | 3 |
| 05-fork-license-inheritance | 12 | 7 |
| 06-contributor-provenance-dco-cla | 12 | 3 |
| 07-provenance-claims-slsa | 12 | 6 |
| 08-entity-path-contract-liability | 12 | 2 | |

## Gaps

- No primary source surfaced for ms-tpm-20-ref, bootc, mkosi, bcvk, particleos, edk2, or edk2-rk3588 per-repo LICENSE files; doc 05 records these as unverified and on the verify list, per the source doc's own discipline.
