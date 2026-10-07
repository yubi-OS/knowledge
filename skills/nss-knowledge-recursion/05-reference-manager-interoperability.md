# 05 Reference-manager interoperability

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: the ref_manager axis, BibTeX/RIS/CSL interchange, Zotero export fidelity, and Citavi/KBibTeX mappings.

## What the rubric scores

Ref_manager (0-3, source doc): 0 is references that cannot be imported; 1 is export that loses types, fields, or identifiers; 2 is BibTeX/RIS/CSL or another standard interchange working; 3 is Zotero, Citavi, KBibTeX, and the project's build pipeline all preserving identity, type, authors, dates, DOI/URL, notes, and citation keys. The scholarly gate pulls this axis to 2 or higher when the file is a scholarly survey, research report, or publication source (source doc).

## The interchange formats

BibTeX, RIS, and CSL-JSON cover different toolchains: BibTeX is the LaTeX/Overleaf format, RIS is the EndNote and Mendeley import format, and CSL-JSON is the citeproc and machine-readable metadata format [1] (weight 0.42, weak). The practical selection rule from that comparison: BibTeX for LaTeX writing, RIS for EndNote/Mendeley import, CSL-JSON for programmatic pipelines, and Zotero can export all three [1] (weight 0.42, weak).

## Zotero as the reference hub

Zotero documents its supported data formats (BibTeX import and export, BibLaTeX export, CSL JSON import and export, RIS, MODS, Refer/BibIX) in its developer documentation [2] (weight 0.89). Its field-mapping knowledge-base entry lists mappings between Zotero types/fields and CSL types/fields, plus RIS, MODS, and Refer/BibIX mappings, and notes where the old mapping description is outdated [3] (weight 0.89). Those two pages are the canonical destination for checking what an export round-trip preserves.

## Citavi's BibTeX reality

Citavi's manuals document the friction the axis scores. Import: a BibTeX file can be imported by double-clicking or dragging into the navigation pane in the Reference Editor [4] (weight 0.84). Type mapping: "The standard reference types in BibTeX format only comprise a portion of the reference types available in Citavi", and Citavi reference types can be mapped to custom BibTeX types that citation styles create [5] (weight 0.84). Field mapping: Citavi 5 documents its BibTeX-to-Citavi field mapping table separately [6] (weight 0.78). BibTeX and BibLaTeX use different field names and entry types, which is why Citavi ships separate export filters for each [7] (weight 0.09, weak).

## What this means for a docs corpus

A knowledge corpus whose research-db stores structured JSON (as this mint does, per the ground source's ecosystem) sits one mapping away from the ref-manager world: every archived result already carries title, URL, and collected_at, which is the CSL-JSON minimum plus provenance. The axis-3 form is to also carry stable keys and entry types so a bibliography generated from the corpus keeps identity across Zotero import, BibTeX export, and build-pipeline consumption. The ground source's own position is that for build artifacts BibTeX is not applicable but named anchors plus access dates are the stability substitute (source doc, example 1 and 2).

## Sources

1. https://grobid.org/formats/bibtex-vs-ris (weight 0.42, weak)
2. https://www.zotero.org/support/dev/data_formats (weight 0.89)
3. https://www.zotero.org/support/kb/field_mappings (weight 0.89)
4. https://www1.citavi.com/sub/manual6/en/index.html?importing_a_bibtex_file.html (weight 0.84)
5. https://www1.citavi.com/sub/manual-citaviweb/en/?reference_type_mapping_citavi_bibtex.html (weight 0.84)
6. https://www1.citavi.com/sub/manual5/en/index.html?field_mapping_bibtex_citavi.html (weight 0.78)
7. https://tesify.app/best-reference-managers-latex-bibtex-2026/ (weight 0.09, weak)
