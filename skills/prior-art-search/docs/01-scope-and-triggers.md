# 01 Scope and triggers: engineering prior art, not patent prior art

Scope: the disambiguation the skill draws between engineering prior art and patent prior art, the trigger phrases that invoke it, and the apply/do-not-use boundaries from the source doc's When to Use section.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md` (all scope claims below are attributed to the source doc unless a dig URL and weight is given).

## The two senses of "prior art"

The source doc opens its When to Use section with a scope clarification: this skill searches for engineering prior art, meaning software projects, attempts, and adoption history relevant to a technical idea. It explicitly does NOT search for patent prior art, the legal sense of the term covering prior inventions in patent law. The two domains share the term but answer different questions and require different searches; the source doc routes patent-grade novelty assessment (the Graham v. John Deere framework) to the `novelty-indication` skill.

The patent side of this split is a well-documented, distinct discipline. The USPTO's Manual of Patent Examining Procedure defines prior art for examination purposes in terms of U.S. patent series and their issuing dates, a legal-evidence framing entirely absent from the engineering sense (USPTO MPEP section 901, https://www.uspto.gov/web/offices/pac/mpep/s901.html, jev noul 0.92). A USPTO training presentation likewise treats "patents and published applications effective as prior art" as a determination made under specific statutory subsections (https://www.uspto.gov/sites/default/files/documents/May%20Info%20Chat%20slides%20%28003%29.pdf, jev noul 0.74). Google Patents, the canonical patent-side search surface, searches full patent text plus an index of non-patent literature (https://patents.google.com/, jev noul 0.39, weak backing). Even inside patent law the term is contested: commentary on Lynk Labs notes a fundamental ambiguity in what "prior art" itself means, distinguishing a prior art document from a prior art process (https://patentlyo.com/patent/2025/07/document-fundamental-ambiguity.html, jev noul 0.14, weak backing).

A general encyclopedia definition is broader and closer to the engineering sense: prior art may comprise information disclosed to the public in written, oral, or by-use form (https://en.wikipedia.org/wiki/Prior_art, jev noul 0.25, weak backing). The engineering skill inherits this broad reading: any public trace of a prior attempt counts, not only patents.

Commercial tooling confirms the two senses live in different product categories. Patent-landscape and IP-intelligence platforms (IP.com, Patlytics, The Lens) market prior-art search toward R&D and IP teams with freedom-to-operate analysis (https://ip.com/intelligence-center-prior-art-search/, jev noul 0.33, weak backing; https://www.patlytics.ai/blog/patent-landscape-software-and-ip-databases, jev noul 0.11, weak backing). None of that tooling is what this skill drives; it uses general web search instead.

## Trigger phrases

The source doc lists the explicit user invocations: "prior art", "what has been tried", "alternatives", "competitors", "has anyone done this", "failed attempts". A teammate question like "has anyone done this?" is itself a trigger that demands an actual search, not an opinion.

## Apply when

Per the source doc, apply when:

1. Ideating and wanting to know what already exists before generating variations.
2. Reviewing a plan or spec that might duplicate existing work.
3. Adopting something unfamiliar (a tool, a library, a pattern) and wanting its history of attempts.
4. Answering a teammate's "has anyone done this?" with evidence.
5. The user explicitly invokes one of the trigger phrases.

## Do NOT use when

The source doc draws three exclusions:

1. The topic is so niche that web search will not surface useful prior art; academic literature search or expert interview fits better.
2. The user wants the answer to a specific factual question rather than a landscape; use websearch directly with a precise query.
3. A real-time or live-data need; the skill returns a synthesized document, not a live feed.

## Why the boundary matters

The boundary is load-bearing because the two senses fail differently. Patent prior-art search fails when a legal-relevant disclosure is missed; engineering prior-art search fails when the report hides what was learned from failures. The source doc's own changelog records that this disambiguation was added deliberately: cycle 2 of its recursive-self-improvement loop flagged the naming collision between the two senses (L4 x S4 = 16 in that audit's scoring) and cycle 4 tightened the frontmatter description to lead with the "engineering" qualifier plus an explicit cross-reference to `novelty-indication`. That history is itself evidence the confusion is real and recurring, which is why the corpus opens with it.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`
- https://www.uspto.gov/web/offices/pac/mpep/s901.html (weight 0.92)
- https://www.uspto.gov/sites/default/files/documents/May%20Info%20Chat%20slides%20%28003%29.pdf (weight 0.74)
- https://patents.google.com/ (weight 0.39)
- https://en.wikipedia.org/wiki/Prior_art (weight 0.25)
- https://ip.com/intelligence-center-prior-art-search/ (weight 0.33)
- https://www.patlytics.ai/blog/patent-landscape-software-and-ip-databases (weight 0.11)
- https://patentlyo.com/patent/2025/07/document-fundamental-ambiguity.html (weight 0.14)
