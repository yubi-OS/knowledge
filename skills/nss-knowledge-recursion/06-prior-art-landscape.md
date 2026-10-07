# 06 Prior art and landscape coverage

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: the prior_art axis, the difference between prior art and see-also, enumerating competing approaches with trade-offs and rejection criteria, and prior-art search as a discipline.

## What the rubric scores

Prior_art (0-3, source doc): 0 is no acknowledgment of predecessors; 1 is a few alternatives without comparison; 2 is major directly relevant approaches cited and distinguished; 3 is lineage, competing approaches, rejected alternatives, trade-offs, and novelty all explicit. Guideline 4 of the ground source: "Prior art is not 'see also.' Prior art enumerates competing approaches with trade-offs and rejection criteria. See also points to navigationally adjacent files." Verification check 5 is harder: "Every prior-art entry has at least one rejection criterion. 'We considered X' without 'we rejected X because Y' fails the prior_art axis" (source doc).

## Prior art as a search discipline

The patent world treats prior-art search as a formalized procedure: the USPTO's MPEP section 904 directs the examiner to search prior art as disclosed in patents and published applications after obtaining a thorough understanding of the invention disclosed and claimed [1] (weight 0.89). The USPTO's prior-art search initiative exists to investigate and share search strategies and improve tools and resources for identifying prior art [2] (weight 0.86). The engineering translation is in the ground source's composition table: `prior-art-search` owns the survey and prior-art cross-reference convention, and nss-knowledge-recursion scores files against the prior_art axis (source doc).

A zenodo-recorded literature-positioning gate treats prior-art collision detection and novelty classification as an expert-review step before publication [3] (weight 0.28, weak). The same gate shape appears in the ground source's own ecosystem via the `novelty-indication` skill, which distinguishes mechanism vs application vs policy layers and treats the project's own ADRs, PRs, and Linear issues as internal prior art (source doc, composition table: `prior-art-search` and the novelty discipline).

## Related work as taxonomy

The craft literature on related-work sections converges on the taxonomy pattern: categorize relevant prior work into a small number of groups, cite key works per category, summarize findings relevant to your approach, and highlight the gaps your approach addresses [4] (weight 0.21, weak) [5] (weight 0.23, weak). This is the writing-level version of axis 3's "lineage, competing approaches, rejected alternatives, trade-offs, and novelty are explicit."

## The anti-patterns the axis punishes

The ground source's red flags (source doc): name-dropping without identifiers ("See RFC XXXX" without what it says and why it matters) is decoration, not citation; prior art and see-also are not interchangeable; two prior-art lists that overlap without a chosen canonical set is cross-channel aliasing. In the yubiOS examples the prior-art entries always carry a rejection criterion in parentheses: "OpenShift buildah / Source-to-Image / ko; rejected, not image-first" (source doc, example 1); "digest-pinning in NixOS / Guix / Fedora CoreOS (rejected, not bootc)" (source doc, example 2).

## See-also is a different axis

See_also (axis 5, source doc) scores navigational continuation: 0 is none, 1 is a generic link dump, 2 is a short relevant See also section, 3 is links that are selective, descriptive, non-duplicative, and explain why to follow them. The test separating it from prior art: see-also says "read this next"; prior art says "here is what already exists, here is why we did not use it."

## Sources

1. https://www.uspto.gov/web/offices/pac/mpep/s904.html (weight 0.89)
2. https://www.uspto.gov/patents/initiatives/prior-art-search (weight 0.86)
3. https://zenodo.org/records/20777809 (weight 0.28, weak)
4. https://lennartnacke.com/how-to-structure-your-related-work-like-a-pro/ (weight 0.21, weak)
5. https://www.yegor256.com/2023/09/29/how-to-write-related-work-section.html (weight 0.24, weak)
