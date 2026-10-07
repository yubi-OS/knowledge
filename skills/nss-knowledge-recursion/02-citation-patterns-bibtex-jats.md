# 02 Citation patterns, BibTeX, and JATS

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: citation conventions in technical docs, IETF RFCXML reference style, BibTeX entry quality, JATS4R structured citations, and persistent identifiers.

## What the rubric scores

The ground source scores three axes here (source doc). Citation_patterns (0-3): from no recognizable convention, through ad hoc URLs and prose mentions, to consistent in-text and reference conventions with local context. Bibtex_quality (0-3): from no records where needed, through incomplete or unstable keys, to stable unique keys with correct entry types, authors, dates, titles, venues, and identifiers. Jats_scholarly (0-3): from unstructured references, through tagged-but-unidentified, to references with unique IDs, publication types, contributor roles, dates, and formal identifiers where the file is scholarly.

## JATS4R: pick one tagging pattern per element

JATS4R (JATS for Reuse) is a NISO working group devoted to optimizing reuse of scholarly content by developing best-practice recommendations for tagging content in JATS XML, operating as a NISO working group since December 2018 [1] (weight 0.88). Its recommended practices deliberately pick one preferred JATS XML tagging pattern per element, covering funding, data citations, authors and affiliations, and CRediT roles [2] (weight 0.70).

The JATS4R general-citations recommendation requires best practices for tagging citations generally, with separate recommendations for data citations, preprint citations, and software citations [3] (weight 0.72). For data citations specifically, JATS v1.1 and forward require at least one of the title or source elements present, the title holding the dataset name, and the source holding the holding repository name [4] (weight 0.79).

The transfer to yubiOS: when a research note cites a dataset or a paper, the citation should carry the identifier-bearing pattern, not just a URL. The ground source's axis 10 (scholarly_xlinking) scores exactly this: DOI/PMID/ISBN identifiers where available, and the file distinguishing article, dataset, software, preprint, thesis, standard, correction, translation, retraction, and companion types (source doc).

## RFCXML references

RFCXML supports references through the `<reference>` and `<referencegroup>` elements, and the IETF maintains a library of pre-built references so draft editors do not hand-write bibliographic entries [5] (weight 0.70). The xml2rfc tool generates automated bibliographies, which "reduces the pain of generating references to external documents" and removes the overhead of getting boilerplate right by hand [6] (weight 0.81). xml2rfc is the IETF's own tooling for producing the RFC and draft format from XML source [7] (weight 0.60, weak).

The design lesson matches the ground source's integrity axis: machine-generated, machine-checked citation structures beat hand-maintained ones because they cannot drift from the registry. Earlier pre-xml2rfc tooling like RFCTool used `<info/>` and `<norm/>` tags to mark informative vs normative citations and auto-resolved references beginning with "RFC" or "draft" [8] (weight 0.49, weak), which shows the normative/informative distinction has been structural in IETF tooling for decades.

## BibTeX quality in a docs-as-code repo

The ground source's bibtex_quality axis rewards stable unique keys and complete metadata. For a documentation corpus that is not a paper, the practical form is: every cited source gets a named anchor (`#ref-name` per the yubiOS convention, source doc), an identifier (DOI, RFC number, ADR number, commit SHA, or URL plus access date), and a role. Plain prose mentions ("see also some blog") are not sources (source doc, guideline 2).

The doc's guideline 3 adds the standards dimension: every RFC or standard cited must carry its role (normative vs informative), the section cited, and its status (proposed, draft, standard). Bare RFC numbers are not enough.

## Sources

1. https://www.niso.org/standards-committees/jats4r (weight 0.88)
2. https://casrai.org/guides/jats4r-niso-recommended-practice (weight 0.70)
3. https://jats4r.niso.org/citations/ (weight 0.72)
4. https://jats4r.niso.org/data-citations/ (weight 0.79)
5. https://authors.ietf.org/en/references-in-rfcxml (weight 0.70)
6. https://datatracker.ietf.org/doc/slides-edu-xml2rfc/ (weight 0.81)
7. https://pypi.org/project/xml2rfc/ (weight 0.60, weak)
8. https://www.ietf.org/archive/id/draft-hallambaker-rfctool-04.html (weight 0.49, weak)
