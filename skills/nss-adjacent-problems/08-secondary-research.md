# 08 - Secondary research methods behind the prior-art channel

**Scope:** The ACM secondary-research typology the source doc cites as grounding: systematic mapping, scoping review, and citation snowballing, plus the SE taxonomy-mapping study.

## What the source doc names

The source doc's changelog lists its source synthesis: "ACM secondary-research typology (systematic mapping, scoping review, snowballing), Relatedly diversity-aware related-work aggregation, SE taxonomy-mapping study." These are the methods the adjacent-problems channel assumes when it asks a file to position itself against prior art: the file's "why not" reasoning should be grounded in a literature practice, not improvised.

## Citation snowballing

Snowballing is the technique most directly aligned with the axis. The methodological reference the source doc's ecosystem uses is Wohlin's guidelines for snowballing in systematic literature studies: start from a seed set of papers, then iteratively examine citations of and by those papers until no new relevant work appears [https://www.researchgate.net/publication/266658918_Guidelines_for_snowballing_in_systematic_literatu, weak backing, weight 0.45]. A 2024 arXiv study investigates snowballing specifically for gray literature, where database-driven search misses industry reports and tool docs, and finds snowballing recovers material that keyword search does not [http://arxiv.org/abs/2407.14991, weak backing, weight 0.35].

For the adjacent-problems axis this matters because the axis scores prior-art cross-references, and snowballing is how a file's reference list should have been built: from the seed prior art outward through citation links, not from a keyword search inward. A file whose references cannot be traced to a seed set (or to a survey) tends to be a name-drop list, which dimension 4 penalizes.

## Systematic mapping and scoping review

The systematic-review genre is the broader practice the axis's rubric mirrors: a systematic review is "a scholarly synthesis of the evidence on a clearly presented topic using critical methods to identify, define and assess research on the topic" [https://en.wikipedia.org/wiki/Systematic_review, weak backing, weight 0.16]. A systematic mapping study is the software-engineering variant: classify a body of work into categories and report frequencies and gaps. An example of the form in current practice maps IoT-based software systems in a domain and reports the category structure [https://oadoi.org/10.1504/ijcat.2022.130877, weak backing, weight 0.34].

The axis's problem-family taxonomy (dimensions 3 and 8) is a mapping study in miniature: name the family, classify the members, and report the boundary. The difference is scale: a mapping study covers a research area; a file's adjacent-problems section covers one design decision and its nearest alternatives.

## Positioning literature

On the writing side, the axis's demand that a file state what it extends or contradicts matches the positioning step of literature-review practice: a review that starts from a problem statement and tests candidate literature against it (weak backing, weight 0.22) [https://www.researchgate.net/publication/342870608_Positioning_-_a_literature_review]. The related-work-section generation literature treats the section as "an essential part of every scientific article being crucial for paper reviewing and assessment" (weak backing, weight 0.22) [http://hdl.handle.net/10230/45219].

## How the axis operationalizes the typology

The source doc converts the typology into 2 operational rules:

1. **Prior-art channel composition.** The `prior-art-search` skill provides the survey convention; nss-adjacent-problems scores files against that channel. A file that did its own snowballing can cite the trail; a file that skipped it scores 0 or 1 on dimension 4 and its "why not" lines are unverifiable.
2. **No re-derivation.** The "when to use" list includes designing a new skill, ADR, or refactor that must position itself against alternatives "without re-deriving the survey from scratch." The typology is the reason: the survey exists in the literature; the file's job is to anchor itself in it, not to redo it.

## Limits

The dig backing for this subtopic is weak across the board: the strongest relevant sources score 0.45 (Wohlin guidelines, ResearchGate copy) and 0.35 (arXiv snowballing study), both below the 0.5 authoritative threshold. The claims above are therefore labeled weak-backed and should be re-verified against primary copies (Wohlin's paper is EASE 2014; the arXiv ID is 2407.14991) before being relied on for anything beyond orientation. The systematic-review and mapping-study claims come from tertiary sources (Wikipedia, an aggregator DOI page) at weights 0.16 and 0.34.
