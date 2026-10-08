# 08 Citation discipline and honest gaps

Scope: the rule that every claim carries a source URL, the labeling of weak backing, and the honesty protocol for empty queries: "no prior art found for this angle" instead of fabricated results.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`.

## The citation rule

The source doc states the rule in four places: the loading constraints ("Cite every claim. Every assertion in the report has a URL behind it"), the anti-patterns ("Sources not cited. Every claim in the report needs a URL. Unsourced claims are suspect"), the red flags ("Sources not cited"; "Saving the report without citing sources"), and the verification checklist ("Every claim has a source URL"). The report template enforces it structurally: every entry ends in a source URL, and the closing "## Sources" section pairs each URL with what it told us.

General citation practice supports the same norm: sharing information about the sources used in one's own research furthers the future research and writing of others, and citation practice spans formal and informal styles (https://libguides.brown.edu/organize/citation, jev noul 0.59). Institutional guidance ties citation and attribution together with the FAIR principles for managing references (https://www.openresearch.cam.ac.uk/copyright-licensing-citation/citation-attribution, jev noul 0.75). Open-license practice adds that attribution requirements are part of how shared knowledge stays reusable (https://creativecommons.org/faq/, jev noul 0.74).

## Weak backing must be labeled

The corpus-wide authoring rule this research-db follows (and that the source doc implies through its "unsourced claims are suspect" stance) is: weight >= 0.5 counts as authoritative backing; weight < 0.5 is weak backing and gets labeled as such in the text. In the docs of this corpus, that label appears as "weak backing" next to the weight. The effect is that a reader can discount a claim without leaving the page.

## Why fabrication is the failure to fear

The anti-patterns section is blunt: "Fabricated findings. If a query returns nothing useful, say so. Do not invent prior art to fill the report." Recent research shows the risk is not hypothetical for agent-produced research reports. A 2026 arXiv paper on source attribution in LLM deep-research reports finds that these systems synthesize hundreds of web sources into cited reports whose citations cannot be reliably verified (https://arxiv.org/abs/2605.06635, jev noul 0.23, weak backing). Work on reference hallucination in commercial LLMs documents that retrieval-augmented and web-search-integrated models invent references, and studies post-hoc verification approaches such as RARR that automatically check and correct generated citations (https://arxiv.org/pdf/2604.03173, jev noul 0.40, weak backing; https://arxiv.org/html/2604.03173, jev noul 0.33, weak backing). A follow-up summary reports that post-hoc verification coupled with agentic tool use "robustly eliminates reference hallucination" (https://www.emergentmind.com/papers/2604.03173, jev noul 0.18, weak backing).

The skill's countermeasures are procedural rather than infrastructural:

1. Every claim must name a URL that was actually returned by a logged search or a fetched page.
2. An empty angle is reported as empty ("no prior art found for this angle"), which the verification checklist honors rather than penalizes.
3. The "Sources" section requires saying what each source told us, which forces the author to have actually read it (step 4's fetch-in-depth requirement is what makes that sentence possible to write honestly).

## Honest gaps as findings

The philosophy section already treats absence as signal: if the search surfaces no equivalent, the "Why no one has tried this" subsection must name whether the idea is likely bad or genuinely new (doc 06). So the honesty protocol is not just "do not fabricate"; it is "empty results are data and get interpreted in the translation section". The verification checklist closes the loop with "Selection bias check: failed attempts included, results span multiple domains", which keeps an honest-but-lazy report (one query, zero findings) from passing as complete.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`
- https://libguides.brown.edu/organize/citation (weight 0.59)
- https://www.openresearch.cam.ac.uk/copyright-licensing-citation/citation-attribution (weight 0.75)
- https://creativecommons.org/faq/ (weight 0.74)
- https://arxiv.org/abs/2605.06635 (weight 0.23)
- https://arxiv.org/pdf/2604.03173 (weight 0.40)
- https://arxiv.org/html/2604.03173 (weight 0.33)
- https://www.emergentmind.com/papers/2604.03173 (weight 0.18)
