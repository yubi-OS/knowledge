# 07 Selection bias and the anti-pattern catalog

Scope: selection bias as the defining failure mode of prior-art search, plus the seven named anti-patterns and the red-flag checklist that polices them.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`.

## Selection bias: the primary failure mode

The source doc's philosophy section states it directly: "Selection bias is the failure mode. Surfacing only successful prior art is worse than no report. Always include failed attempts and abandoned projects." The reason is informational: a landscape of only survivors hides the most valuable signal, which is why attempts failed and what the current idea should avoid.

The empirical literature backs the stakes. Survivorship bias is the error of excluding failed entities from a study because they no longer exist, which skews results toward apparent success; the canonical finance example is performance studies that drop failed companies (https://en.wikipedia.org/wiki/Survivorship_bias, jev noul 0.44, weak backing for the finance example). Research on startups makes the startup-specific version explicit: with most new enterprises failing, studying only survivors overstates the reliability of their shared tactics (https://www.researchgate.net/publication/380849915_Vining_in_the_Blind_The_Perils_of_Survivorship_Bias, jev noul 0.26, weak backing; https://www.marketkloud.com/blog/survivorship-bias-in-startup-success-stories, jev noul 0.09, weak backing). A prior-art report that lists only live competitors reproduces exactly this bias.

## The seven anti-patterns

The source doc names seven:

1. **Selection bias, only successful prior art.** Reporting only products that succeeded hides why attempts failed. Always include failed attempts.
2. **Single-domain results.** If all top hits come from one company or one blog, the search is biased. Re-query with different angles.
3. **Fabricated findings.** If a query returns nothing useful, say so. Do not invent prior art to fill the report.
4. **Sources not cited.** Every claim needs a URL; unsourced claims are suspect.
5. **Skipping the fetch step.** Search snippets are shallow; without 2 to 3 fetches in depth the report is a list of titles, not a synthesis.
6. **Synthesis without "What this means".** A list of competitors without translation to the current idea is research, not prior-art-search.
7. **Recursion without bound.** 10+ searches or 10+ fetches burn tokens without improving the report; 3 to 5 searches and 2 to 3 fetches is the budget.

## The research backing for anti-patterns 1 and 2

Anti-pattern 2 (single-domain results) is grounded in measured web-search behavior. Microsoft Research documented "domain bias": a user's propensity to believe a page is more relevant just because it comes from a particular domain, independent of actual relevance or result position (https://www.microsoft.com/en-us/research/publication/domain-bias-in-web-search/, jev noul 0.86; preprint PDF at https://www.microsoft.com/en-us/research/wp-content/uploads/2012/02/domainbias.pdf, jev noul 0.77; ACM paper record https://dl.acm.org/doi/10.1145/2124295.2124345, jev noul 0.83). Secondary summaries report that about 25% of users exhibit domain bias, preferring reputable domains (https://www.academia.edu/2784559/Domain_Bias_in_Web_Search, jev noul 0.22, weak backing for the percentage). Search-result diversity research similarly studies balancing result diversity against SERP relevance in sessions (https://dl.acm.org/doi/10.1145/3477495.3531880, jev noul 0.72). The skill's two counters, re-querying with different angles and preferring diverse domains in step 3, are direct applications of this literature.

## The red-flag checklist

The red flags are the anti-patterns restated as observable signals in a finished report:

1. 10+ search queries (over-budget).
2. 5+ fetches (over-budget).
3. A report with no failed attempts section.
4. Sources not cited.
5. "What this means" missing or generic.
6. The report lists competitors but does not translate findings to the idea.
7. Queries that are abstract ("alternatives") instead of specific ("X alternatives 2026").
8. All results from a single domain (selection bias signal).
9. Saving the report without citing sources.

The flags are deliberately checkable: count the queries, count the fetches, look for the failed-attempts heading, look for a URL on every claim, look for the translation section, look at the domain spread. That is what makes the verification checklist at the end of the source doc executable in one pass.

## Why the catalog is ordered this way

The first two anti-patterns attack the evidence set (what was found), the middle ones attack the evidence quality (fabrication, citation, depth), and the last two attack the synthesis (translation, budget). A report can fail at any layer, and the checklist covers all three layers rather than only the most visible one.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`
- https://en.wikipedia.org/wiki/Survivorship_bias (weight 0.44)
- https://www.researchgate.net/publication/380849915_Vining_in_the_Blind_The_Perils_of_Survivorship_Bias (weight 0.26)
- https://www.marketkloud.com/blog/survivorship-bias-in-startup-success-stories (weight 0.09)
- https://www.microsoft.com/en-us/research/publication/domain-bias-in-web-search/ (weight 0.86)
- https://www.microsoft.com/en-us/research/wp-content/uploads/2012/02/domainbias.pdf (weight 0.77)
- https://dl.acm.org/doi/10.1145/2124295.2124345 (weight 0.83)
- https://dl.acm.org/doi/10.1145/3477495.3531880 (weight 0.72)
- https://www.academia.edu/2784559/Domain_Bias_in_Web_Search (weight 0.22)
