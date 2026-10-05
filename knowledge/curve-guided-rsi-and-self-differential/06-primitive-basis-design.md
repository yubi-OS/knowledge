# 06. Primitive basis design for corpus audit

Scope: designing the binary coverage bases the differential fits on, the near-constant drop thresholds, and the item granularity rules.

## Two taxonomies, one audit

The differential runs on two primitive taxonomies, each a fixed vocabulary of binary coverage indicators scored per item:

- The yubiOS basis, 10 primitives drawn from the project's big-picture model: attestation, trust_chain, least_privilege, declarative_policy, continuous_adaptive, immutability, audit_evidence, cryptographic_identity, segmentation, self_describing.
- The self-doc basis, 9 primitives describing audit-trail discipline: has_purpose, has_source, has_evidence, has_correction, has_constraint, has_pushback, has_whole_self_note, has_test, has_cadence.

A taxonomy of this kind is a controlled vocabulary: a curated list of terms with defined scope, built so that consistent labeling is possible across authors and time. Guidelines for thesaurus and controlled-vocabulary construction (ANSI/NISO Z39.19) specify the core requirements such vocabularies must meet: explicit term definitions, controlled structure, and documented scope rules [w=0.89, https://www.niso.org/publications/ansiniso-z39.19-2005-r2010]. The progression from flat taxonomy to ontology, where terms gain typed relationships, is the standard maturity path for such vocabularies [w=0.55, https://enterprise-knowledge.com/wp-content/uploads/2024/02/Hedden-Extending_Taxonomes_to_Ontologies-3.pdf]. The yubiOS bases stop at the flat-binary stage deliberately: the curve fit only needs the presence vector, not the relations.

## Binary coverage scoring

Every item gets a 0/1 per primitive: does this skill implement or document the primitive (yubiOS side), does this memory item carry that structural element (self-doc side). Binary indicator coverage has a known failure mode: columns that are almost always 1 (or almost always 0) carry no discriminative information. Variance-threshold feature selection removes features whose variance falls below a cutoff, and scikit-learn's VarianceThreshold documents the default behavior of dropping zero-variance features, with the threshold parameter generalizing it to near-constant removal [w=0.81, https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.VarianceThreshold.html].

The pipeline operationalizes this as a coverage-fraction rule. In the parent fit, columns with coverage above 0.90 were dropped: attestation (0.987), audit_evidence (1.0), and segmentation (0.974) were all too universal across the 77 skills to discriminate, leaving a 7-D basis (trust_chain, least_privilege, declarative_policy, continuous_adaptive, immutability, cryptographic_identity, self_describing) ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

On the union basis, the threshold was relaxed to 0.92 and zero columns dropped. The structural reason is documented in the source doc: each corpus saturates its own side and zeroes the other side, so every column gets variance from exactly one side's population. A column that would be near-constant within one corpus can survive in the union because the union changes the coverage denominator, and a column saturated on its own side still varies because the other side contributes zeros ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Threshold choice is part of the measurement contract

The 0.90 versus 0.92 difference is not noise, it is a documented choice: the union spans two corpora with different priors (some primitives are common in one population and rare in the other), so the drop rule was relaxed slightly to avoid discarding side columns on union data. The source doc records the per-corpus kept-dimension counts (parent 7-D, offshoot 6-D combined, union 19-D) as part of the verification checklist. Any future re-run must record its thresholds and kept counts the same way, because a different threshold changes the basis, which changes the fit, which changes every downstream metric ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Item granularity rules

The second design axis is what counts as an item. The self-doc corpus is parsed at canonical granularity: one item per markdown section (## heading) per memory file, one entry per changelog entry in SELF-CHANGELOG, and one row per record in SELF.md. This yields 131 items from 10 files, ranging from 5 items (sauna_identity, sauna_tools, user_relationships, recent_activity) to 50 (self_md). The skill corpus uses one item per skill file, 77 items ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

Granularity is where small-corpus risk enters. Files parsed to fewer than about 10 items produce fits with negative holdout R-squared (documented and accepted for per-file reporting, gated only at the combined level), and the user_profile file (N=13) degenerated to a 1-column basis, producing vacuous perfect metrics ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Design discipline

Three rules fall out of the run. First, fix the taxonomy before fitting; adding a primitive mid-stream invalidates all recorded coordinates. Second, record the drop threshold and kept-column list alongside every fit. Third, treat a surviving basis below roughly 3 columns as degenerate for audit purposes regardless of what its gates report ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).
