# 02 Search anchor and topic framing

Scope: restating a raw idea, one-pager, or question as a one-sentence search anchor, and why that framing step determines whether the searches answer anything concrete.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`.

## The anchor step

The source doc's process starts at step 1: load the topic. It accepts three input shapes: a raw idea (one or more sentences), a one-pager from `idea-refine` or `ideate-solo`, or a specific question such as "what's the history of X?" or "has anyone built Y?". Whatever arrives, the skill restates it as a one-sentence search anchor: the most concrete form of the question. The report template later makes the anchor explicit again under a "Search anchor" heading, so the reader can check every finding against the question the report actually answered.

The anchor is not cosmetic. Information-retrieval practice treats query formulation as the intellectual core of search: retrieval "embraces the intellectual aspects of the description of information and its specification for search" (Wikimedia query formulation overview, https://upload.wikimedia.org/wikipedia/commons/2/25/Query_formulation_process.pdf, jev noul 0.28, weak backing). Library research guides put the same idea first in their own flow: define the information need before constructing any query (https://guides.library.iit.edu/searchstrategy, jev noul 0.62).

## Specificity: precision over recall

The anchor's job is to make the question concrete enough that a search can discriminate. The retrieval literature gives this a name: precision, the proportion of relevant results among all retrieved results, as opposed to recall, the proportion of all relevant material that gets retrieved (https://en.wikipedia.org/wiki/Precision_and_recall, jev noul 0.47). Academic search-strategy guidance warns that precision and recall pull against each other and that a query should be built deliberately to favor the one the task needs (https://blogs.uef.fi/ueflibrarypostgrad/2-module-discipline-specific-information-retrieval/search-strategy-formulation/, jev noul 0.41).

For a bounded prior-art pass, precision wins. The skill runs only 3 to 5 queries; a query that returns noise wastes one of the budget's slots. Library guides used for systematic searching make the same trade explicit: narrowing vocabulary, phrasing, and qualifiers raises precision at the cost of recall (https://blogs.uef.fi/ueflibrarypostgrad/2-module-discipline-specific-information-retrieval/search-strategy-formulation/, jev noul 0.41; https://lis.academy/information-processing-retrieval/how-to-formulate-effective-search-strategies/, jev noul 0.26, weak backing).

The competitive-research framing literature agrees from the business side: effective competitor research starts from a sharp question about who is already solving the problem and where the market gaps are, not from a broad category scan (https://www.uschamber.com/co/start/strategy/how-to-conduct-competitive-research, jev noul 0.22, weak backing). Tooling guides make the same point: a comparison matrix is only as good as the question it was built to answer (https://www.browserlondon.com/blog/2025/02/25/competitive-research/, jev noul 0.08, weak backing).

## Anchor quality checklist

From the source doc plus the retrieval grounding above, a usable search anchor:

1. Is one sentence.
2. Names the artifact, technique, or product class concretely (not "ideation tools" but "AI ideation tool for solo product managers").
3. Implies at least one of the four query angles (competitors, failures, academic, historical) that step 2 will expand into queries.
4. Is the same sentence printed under the report's "Search anchor" heading.

## Query patterns research

Academic work on query patterns supports the practice of generating several concrete phrasings rather than one abstract one: identifying patterns behind query formulations is treated as a fundamental retrieval problem, and multi-query generation is a standard mitigation for the vocabulary-mismatch problem, where the searcher's words and the corpus's words differ (http://dl.acm.org/authorize?N08004, jev noul 0.54). The source doc's four angles are a domain-specific instantiation: each angle is a different vocabulary the prior art will have been written in ("alternative", "shutdown", "survey", "history").

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`
- https://en.wikipedia.org/wiki/Precision_and_recall (weight 0.47)
- http://dl.acm.org/authorize?N08004 (weight 0.54)
- https://guides.library.iit.edu/searchstrategy (weight 0.62)
- https://blogs.uef.fi/ueflibrarypostgrad/2-module-discipline-specific-information-retrieval/search-strategy-formulation/ (weight 0.41)
- https://upload.wikimedia.org/wikipedia/commons/2/25/Query_formulation_process.pdf (weight 0.28)
- https://teachbritannica.com/academic-toolkits/effective-search-queries/ (weight 0.30)
- https://lis.academy/information-processing-retrieval/how-to-formulate-effective-search-strategies/ (weight 0.26)
- https://www.uschamber.com/co/start/strategy/how-to-conduct-competitive-research (weight 0.22)
- https://www.browserlondon.com/blog/2025/02/25/competitive-research/ (weight 0.08)
