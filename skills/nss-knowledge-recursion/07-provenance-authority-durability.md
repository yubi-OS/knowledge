# 07 Provenance, authority, and durability

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: the provenance_authority axis, primary vs secondary sources, version and access dates, DOIs and permalinks, and link-rot prevention.

## What the rubric scores

Provenance_authority (0-3, source doc): 0 is sources anonymous, untrusted, or unrecoverable; 1 is sources named but unstable, undated, or indirect; 2 is authoritative sources with access and version dates present; 3 is citing the most direct authoritative source, recording version and date, using DOI/permalink/archive, and distinguishing primary from secondary sources. The gating rule is explicit: many informal links cannot compensate for absent authoritative or persistent sources on this axis (source doc).

## Primary and secondary sources

The APA style guidance defines the citation mechanics: in the reference list, provide the entry for the secondary source actually used; in the text, identify the primary source and write "as cited in" the secondary source [1] (weight 0.87). Library-science guidance adds the tertiary tier: databases, bibliographies, and directories are collections that summarize primary and secondary sources [2] (weight 0.60, weak). For a knowledge corpus, the ground source's example pattern is the same idea: a research note cites the ADR that decided, not a blog that repeated it (source doc).

## Link rot is the default outcome

Link rot is the phenomenon of hyperlinks tending over time to cease pointing at their originally targeted resource [3] (weight 0.47, weak). Field data on the scale: link rot and reference rot break scholarly citations over time, with about 1 in 5 articles affected, and durable citation practice is a decision flow between DOI and archived URL [4] (weight 0.71). A 2026 scholarly-publishing process paper recommends using web archive links wherever possible and including both the original link and a long-term archive link for critical information, with archives that are long-term, public access, and not for profit being the most reliable [5] (weight 0.64).

Tooling exists to mechanize this: prevent-link-rot converts links in a document to archived links, pointing only at archiving sites like the Internet Archive or perma.cc [6] (weight 0.33, weak). The ground source's integrity axis ties this to CI: stale citations and broken links are what CI gates exist to catch (source doc).

## The identifier hierarchy

The ground source's guideline 2 fixes the identifier ladder: "DOI / RFC number / ADR number / commit SHA / URL + access date. Plain prose mentions are not sources" (source doc). DOI is the strongest general-purpose scholarly identifier; the RFC Editor issues DOIs in the `10.17487/RFCnnnn` form (see doc 04, RFC 8700 citation practice); commit SHAs pin immutability for docs-as-code repos. Version and access date cover everything else: an upstream doc's own version string plus the date you read it.

## Provenance in the yubiOS surface

The ground source maps the axis onto file types (source doc): Containerfiles record the base digest sha256 and the rotation history of prior digests; refs/*.md frontmatter carries `commit:`, ADR number, `supersedes:`/`superseded_by:`, and next-review date; GitHub Actions workflows record the last-changed commit SHA. The recursion axis's provenance_version rubric extends this into time: claims linked to evidence, and superseded beliefs marked rather than silently rewritten (source doc, recursion axis 2).

## Sources

1. https://apastyle.apa.org/style-grammar-guidelines/citations/secondary-sources (weight 0.87)
2. https://tuskegee.libguides.com/c.php?g=546082&p=5367441 (weight 0.60, weak)
3. https://en.wikipedia.org/wiki/Link_rot (weight 0.47, weak)
4. https://casrai.org/guides/link-rot-in-citations-and-how-to-prevent-it (weight 0.71)
5. https://spectrum.library.concordia.ca/id/eprint/997776/1/Concordia%20University%20Press%20-%20Avoiding%20Link%20Rot%20paper%202026.pdf (weight 0.64)
6. https://github.com/schollz/prevent-link-rot (weight 0.33, weak)
