# 05. External Prior Art Scanning

**Scope.** Step 4 of the source doc: what to scan for externally, in which four categories, with what rigor, and where the USPTO's own search methodology overlaps.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc).

## The four categories

The source doc's Step 4 lists four kinds of external prior art to scan for:

- **Direct equivalents:** what existing products or projects address the same problem?
- **Failed attempts:** what was tried and abandoned, and why?
- **Academic / formal:** any research papers or surveys?
- **Adjacent / historical:** earlier or related efforts in the same family?

The failed-attempts category is the one teams skip most often and the one that changes verdicts most often. A direct equivalent says "the idea exists"; a documented failure says "the idea exists and did not survive, here is why", which is stronger input to a NOVEL-or-not decision than a landing page.

## Rigor: quick and bounded by design

The source doc sets the rigor bar explicitly: quick informal searches of 3 to 5 queries with the top 5 hits are fine for engineering judgment. It also routes to `prior-art-search` when a structured external scan is wanted. This boundedness is a feature, not a shortcut: the verdict document needs cited coverage of each category, not exhaustive search. The one hard rule is honesty: if a search returns nothing, the verdict says "no prior art found"; inventing prior art is on the anti-pattern list and on the red-flags list.

## The search-methodology overlap

Patent searching has a mature methodology, and its primary sources are directly usable:

- MPEP 904, "How to Search" (https://www.uspto.gov/web/offices/pac/mpep/s904.html, jev weight 0.93), is the USPTO's guidance for examiners on search: what to search, where, and how to structure it. For engineering judgment the useful parts are the emphasis on searching by the problem the invention solves, not only by the solution, and the treatment of analogous prior art (the same problem solved in a different field, which is the source doc's adjacent/historical category).
- The USPTO's patent process overview (https://www.uspto.gov/patents/basics/patent-process-overview, jev weight 0.97) frames where search sits in the broader process.
- The USPTO's preliminary patent search tutorial (https://www.uspto.gov/video/cbt/prelim-patent-search/index.html, jev weight 0.94) walks the step-by-step strategy for a first pass: start with the core concept, find the classification, then expand. The "start with the core concept" move maps exactly onto the layer split in doc 03.

Weak sources in this area are abundant and should be labeled, not used. The dig returned tertiary aggregators (https://en.wikipedia.org/wiki/Prior_art, jev weight 0.21; https://inspireip.com/prior-art-search-beyond-just-patent-protection/, jev weight 0.20; https://patentbrief.org/patent-search-strategy, jev weight 0.21) and off-topic startup-idea checkers (jev weights 0.14 to 0.16). None is cited for a claim above.

## What the scan feeds

The external scan does not produce the verdict. It produces two inputs:

1. The "External prior art (cited)" section of the output template: `[Source name + URL] plus what it covers`. Every entry needs the URL; the source doc's loading constraints say every claim about prior art has a URL or file path behind it.
2. The Graham factor analysis. Scope and content of prior art (factor 1) is literally "what did the scan find". Differences from prior art (factor 2) are computed per layer against what the scan covered.

## Bounded scope

Step 4 is the only step with recursion allowed, and even it is one pass (source doc, loading constraints: "Bounded. One pass. No recursion beyond Step 4."). If the scan is thin, the verdict degrades honestly: "no prior art found" for a category is a legitimate finding, and BORDERLINE is available when coverage is inconclusive. What never happens is padding a category with uncited claims to make the report look complete.
