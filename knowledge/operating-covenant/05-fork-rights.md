# 05. Fork rights

Scope: license-guaranteed forking, trademark policy as the lever a project actually controls, and the rule that fork users must not be disadvantaged in security fixes.

## Forking itself needs no covenant; it is already the license

A free-software license grants recipients extensive rights to modify and redistribute software [1] (weight 0.07, weak backing). Copyleft licenses make that guarantee structural: modified and extended versions must remain free [2] (weight 0.96). A covenant therefore adds nothing to fork rights themselves; what it adds is a negative commitment about how the project will and will not use levers *outside* the license.

## Trademark is the real lever, and foundations publish their rules

The Apache Software Foundation's trademark policy outlines allowable uses of its marks by other parties, including forks that want to signal lineage without implying endorsement [3] (weight 0.80). The policy distinguishes the word mark, the logo, and project-specific marks, and the ASF maintains it as part of a central index of policies covering governance, legal compliance, and community standards [4] (weight 0.72). A historical version of the same policy shows the granularity involved: specific rules for the "Apache" word mark, the feather graphic, and all "Apache ProjectName" marks [5] (weight 0.75).

The covenant-relevant commitment is about *abuse* of trademark power: not using naming, branding, or default distribution channels (app store listings, default download pages) to disadvantage a fork's users. A fork that keeps trust-relevant components open and auditable is the outcome the license itself protects; the covenant commits to not fighting that outcome with non-license levers.

## Security fixes must flow to forks on the same terms

The CVE program catalogs publicly disclosed cybersecurity vulnerabilities, with over 382,000 CVE records accessible to the public [6] (weight 0.96). The program is structured so upstream communities assign the CVE ID for their code, and the identifier is then shared and referenced by downstream entities; many open source projects and organizations act as CVE numbering authorities [7] (weight 0.66). That upstream-publishes-first structure is exactly what a covenant commits to: fixes and their identifiers go out to everyone at once, upstream and forks alike.

The downstream reality makes this more than ceremony. One Chromium CVE propagates simultaneously into Chrome, Edge, Brave, Opera, and Electron-based applications, and tracking patch status across that fork tree is a known hard problem [8] (weight 0.44, weak backing). Explainers of Microsoft's Security Update Guide describe the same upstream/downstream model for Chromium CVEs: the vulnerability originates in the upstream OSS project and lands downstream in derived products [9] (weight 0.10, weak backing). A vendor that delayed upstream publication to favor its own downstream channel would invert the CVE program's design; the covenant rule (no held-back CVE fix from upstream) prevents that.

## What a covenant should say, concretely

1. Fork rights come from the license and this covenant adds no restriction beyond it.
2. Trademark, branding, and channel placement will not be used to punish or disadvantage compliant forks.
3. Security fixes, mitigations, and disclosures ship to the public upstream at disclosure time, regardless of which downstream (including commercial competitors) consume them.

## Caveats

The strongest sources here are the ASF trademark policy documents and the CVE program pages. The fork-tree tracking literature is weakly backed and labeled as such.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://en.wikipedia.org/wiki/Free-software_license | 0.07 |
| 2 | https://www.gnu.org/licenses/copyleft.html | 0.96 |
| 3 | https://www.apache.org/foundation/marks/ | 0.80 |
| 4 | https://www.apache.org/foundation/policies/ | 0.72 |
| 5 | https://www-previous.staged.apache.org/foundation/marks/index.html | 0.75 |
| 6 | https://www.cve.org/ | 0.96 |
| 7 | https://www.cve.org/Media/News/item/blog/2023/02/07/Open-Source-and-the-CVE-Program | 0.66 |
| 8 | https://www.anthonybahn.com/learn/the-chromium-downstream-problem-tracking-patches-in-forks-and-embedded-browsers/ | 0.44 |
| 9 | https://windowsforum.com/news/cve-2025-12727-edge-exposure-and-upstream-chromium-patch-status.388971/ | 0.10 |
| 10 | https://windowsforum.com/news/cve-2026-0901-explained-edge-chromium-upstream-downstream-fix.397431/ | 0.10 |
| 11 | http://stackshare.io/maven-bsf-bsf | 0.06 |
| 12 | https://handwiki.org/wiki/Software:Linux_kernel | 0.07 |
