# knowledge corpus: customer-roi-model

Customer ROI modeling for infrastructure products: formula structure, validation approach, and claim boundaries for ROI promises in early-stage sales. Minted 2026-10-05 from yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md.

## Docs

- 01-roi-formula-structure.md: How cost-of-alternative ROI formulas are structured for infrastructure products: per-line-item contributions, baseline minus measured, common-unit conversion.
- 02-baseline-data-collection.md: What pre-pilot customer baseline data to collect and how: discovery interviews, per-device costs, incident history, and treating missing data as a finding.
- 03-pilot-evidence-validation.md: Evidence discipline for validating ROI claims: named evidence sources, pilot logs, measured values only.
- 04-invalidation-and-negative-results.md: Invalidation rules: recording pilot-measured values that come back worse than baseline as negative contributions rather than excluded outliers.
- 05-measured-vs-illustrative.md: Separating measured ROI from illustrative worked examples with placeholder numbers, and the labeling discipline that keeps placeholders from escaping their label.
- 06-claim-boundaries.md: Claim boundaries for external use: what a single-pilot ROI figure can and cannot be presented as.
- 07-customer-data-confidentiality.md: Confidentiality and permission requirements for customer baseline and ROI data in readouts and derived public case studies.
- 08-pilot-aggregation.md: When averaging ROI across multiple pilots is meaningful, sample-size judgment, and why premature aggregation misleads.
- 09-time-to-dollar-conversion.md: Converting time-based line items to dollars using the customer own stated labor rate rather than invented industry averages.

## Research summary

- Results collected: 144 (including 36 results from 3 redo digs)
- Weight split: 20 results weighted >= 0.5 (primary/authoritative), 124 weighted < 0.5 (weak backing, labeled as such in the docs), 0 unweighted
- Jev requests: 32, usage 24265 input / 0 output tokens (score outline validation, noul weighting on every result)
- Redo counts: doc 03, doc 05, doc 07 each redug once with different queries after thin first attempts (attempt-1 results retained in archive.json)
- Skipped docs: none. All 9 subtopics dug strong enough to author honestly after redos.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Files

- README.md (this file)
- 01-roi-formula-structure.md through 09-time-to-dollar-conversion.md
- research-db/: preflight.json, outline.json, archive.json, digs/01..09, jev-log.json, db.ts
