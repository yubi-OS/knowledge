# 01 Evidence graph and gating rules

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: the knowledge_sources unit of evaluation, the 12-axis 0-3 rubric shape, and the gating rules that stop a high average hiding a critical failure.

## The evidence graph

The ground source defines the unit of evaluation for the knowledge_sources axis as the file's evidence graph: `claim or design decision -> citation/cross-reference -> identifiable source -> stable destination -> usable surrounding context`. A file can carry many links and still score poorly if claims are uncited, references lack identifiers, prior art is absent, or the source relationship is not explicit. The chain is the scored object, not the count of links.

This framing mirrors how evidence-grading methodology treats quality: the GRADE framework used by Cochrane requires at least two review authors to assess evidence quality independently and resolve disagreements by consensus before a rating stands [1] (weight 0.80). The transfer to docs review is direct: a citation's quality is a judgment made against explicit criteria, not a count.

## Why rubrics and not vibes

The 12 knowledge_source axes (citation_patterns, claim_to_source, bibtex_quality, docs_as_code_xrefs, see_also, prior_art, rfc_standards, ref_manager, jats_scholarly, scholarly_xlinking, provenance_authority, integrity_freshness) are scored 0 to 3 each, max 36 (source doc). The rubric is fixed: "Use the 12-axis knowledge_sources and 12-axis recursion rubrics verbatim. Custom rubrics require a new skill" (source doc, guideline 9).

Evidence-evaluation practice outside software converges on the same shape. The Duke Nicholas Institute evidence rubric scores confidence across result chains with applicability as a separate dimension from quality [2] (weight 0.59, weak backing). The Quality of Evidence Rubrics project frames rubrics as qualitative scales with explicit bands rather than open judgment [3] (weight 0.51, weak backing). The lesson for NSS scoring is that each axis needs named 0/1/2/3 band descriptions, which is exactly what the ground source supplies.

## The four gating rules

The ground source adds four gates so a high average cannot hide a critical failure (source doc):

1. Claim-support gate: axis 2 (claim_to_source) must be at least 2 for a file making substantial factual or normative claims.
2. Integrity gate: axis 12 (integrity_freshness) must be at least 2 for production documentation or a normative specification.
3. Standards gate: axis 7 (rfc_standards) must be at least 2 when the file implements, profiles, or claims compatibility with an RFC or standard.
4. Scholarly gate: axes 3, 8, 9, and 10 must each be at least 2 when the file is a scholarly survey, research report, or publication source.
5. No compensating for missing provenance: many informal links cannot compensate for absent authoritative or persistent sources on axis 11.

Gate 5 is the interesting one. It encodes the principle that volume of links is not quality of grounding. The same principle appears in the docs-as-code world as traceability gates: the S-CORE Docs-as-Code toolchain publishes traceability dashboards and enforces CI thresholds with a traceability_gate check so coverage numbers cannot silently regress [4] (weight 0.82).

## From evidence to CI

The S-CORE docs-as-code stack treats documentation, requirements, and traceability as one toolchain and exports machine-readable metrics from the repository [4] (weight 0.82). That is the operational endpoint of the evidence graph: once claims are linked to sources structurally, a machine can check the graph, not just a human. The yubiOS equivalent is the integrity gate wired to xrefcheck or equivalent in CI, which doc 03 covers in depth.

## Red flags specific to the gates

The ground source's red-flag table names the failure modes the gates exist to catch (source doc): a claim asserted without source and without an "original assertion" marker fails the claim-support gate; an RFC cited without a role (normative or informative) fails the standards gate; a Knowledge sources section that lists zero concrete citations is a placeholder and counts as a NO verdict.

## Sources

1. https://cgf.cochrane.org/sites/cgf.cochrane.org/files/uploads/uploads/how_to_grade.pdf (weight 0.80)
2. https://nicholasinstitute.duke.edu/sites/default/files/bridge-collaborative/Evidence-Rubric-Interactive-D6.pdf (weight 0.59, weak)
3. https://evaluation.org.uk/wp-content/uploads/2024/09/Quality-of-Evidence-Rubrics-2.0-Final.pdf (weight 0.51, weak)
4. https://eclipse-score.github.io/docs-as-code/v7.2.0/how-to/dashboards_and_quality_gates.html (weight 0.82)
