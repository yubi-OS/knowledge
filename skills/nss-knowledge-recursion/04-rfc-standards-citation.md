# 04 RFC and standards citation

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: citing RFC/BCP/STD correctly, normative vs informative roles, section-level citations, and status tracking.

## What the rubric scores

Rfc_standards (0-3, source doc): 0 is applicable standards absent; 1 is RFC numbers without precise references; 2 is applicable normative and informative standards cited; 3 is RFC/BCP/STD relationships, sections, status, version/date, and the normative vs informative role all explicit. The standards gate requires axis 7 at 2 or higher when the file implements, profiles, or claims compatibility with an RFC or standard (source doc). Guideline 3 of the ground source: "Every RFC/standard has a role. Normative vs informative; section cited; status (proposed / draft / standard). Bare RFC numbers are not enough."

## The IETF's own definitions

The IESG statement on normative and informative references is the primary source for the role distinction: "Normative references specify documents that must be read to understand or implement the technology in the new RFC, or whose technology must be present for the technology in the new RFC to work" [1] (weight 0.89, IETF official statement, 2006-04-19). An informative reference is one that is not required for implementation but supplies context [2] (weight 0.85, mirrored IETF page).

## BCP and STD are subseries, not synonyms

BCP documents form their own RFC subseries: the RFC Editor's info page for BCP 9 lists its member RFCs, and the BCP subseries is "designed to be a way to standardize practices and the results of community deliberations" [3] (weight 0.91) [4] (weight 0.50, weak). The IETF datatracker's BCP index shows the current pairing: BCP 9 carries RFC 2026 (The Internet Standards Process, Revision 3), RFC 5657 (guidance on interoperation and implementation reports), and RFC 6410 (reducing the standards track to two maturity levels) [5] (weight 0.90). Each BCP number is paired with the currently valid RFC document [6] (weight 0.17, weak).

For yubiOS docs this means: when the ground source cites "RFC 8594 (Sunset header), RFC 9745 (Deprecation header)" (source doc, example 2), a 3-score treatment adds the role (informative for an HTTP API lifecycle note, normative if the file implements the header), the section, and the status.

## Maturity gates on normative references

RFC 4897 records the IETF and RFC Editor rule that "a document at a given maturity level cannot be published until all of the documents that it references as normative" have reached an appropriate maturity level [7] (weight 0.89). The bcp97bis draft carries the successor procedure for standards-track documents referring normatively to documents outside the standards track [8] (weight 0.52, weak). The operational takeaway for a docs corpus: a normative citation to a not-yet-RFC draft is itself a state that needs recording, because the dependency can lapse.

## Section-level and historical citations

RFC 8700 (Fifty Years of RFCs) demonstrates the citation style in practice: it cites early RFCs with DOI form (`DOI 10.17487/RFC0003`) and a canonical URL, with author, title, and date attached [9] (weight 0.77). This is the shape the ground source's provenance axis wants: identifier plus role plus access context, not a bare number. The rfc-editor.org/info/<rfc-number> pages are the stable destinations to cite for any RFC.

## Sources

1. https://www.ietf.org/about/groups/iesg/statements/normative-informative-references/ (weight 0.89)
2. http://www.ietf.org/iesg/statement/normative-informative.html (weight 0.85)
3. https://www.rfc-editor.org/info/bcp9/ (weight 0.91)
4. https://docstore.mik.ua/rfc/bcp0009.html (weight 0.50, weak)
5. https://datatracker.ietf.org/doc/bcp (weight 0.90)
6. https://en.wikipedia.org/wiki/Best_current_practice (weight 0.17, weak)
7. https://datatracker.ietf.org/doc/html/rfc4897 (weight 0.89)
8. https://www.ietf.org/archive/id/draft-kucherawy-bcp97bis-05.html (weight 0.52, weak)
9. https://www.rfc-editor.org/rfc/rfc8700.html (weight 0.77)
