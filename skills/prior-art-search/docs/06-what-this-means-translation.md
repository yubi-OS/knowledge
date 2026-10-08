# 06 The "What this means" translation

Scope: the closing analysis section that turns a list of findings into judgment about the current idea: competitive landscape, why previous attempts failed, why no one has tried this, and the open opportunity.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`.

## The section and its four subsections

Step 6 of the source doc's process translates findings to the current idea under a "What this means" heading with four fixed subsections:

1. **Competitive landscape.** Who is solving this already? What features do they have?
2. **Why previous attempts failed.** What should we avoid or learn from?
3. **Why no one has tried this.** If the search surfaces no equivalent, that is itself a finding: either no one has tried because it is a bad idea, or because it is genuinely new. The report must name which.
4. **Open opportunity.** What gap in the prior art could the current idea fill?

The anti-patterns section draws the line hard: "A list of competitors without a translation to the current idea is research, not prior-art-search. Always include the 'What this means' section." The red-flag list repeats it twice ("'What this means' section missing or generic"; "The report lists competitors but doesn't translate findings to the current idea"), making translation the single most policed quality of the output.

## Why "why it failed" is the load-bearing subsection

The postmortem genre exists precisely to convert past failures into future decisions. A postmortem is, literally, an examination after the fact: the term means "after death", an examination, investigation, or process after an event (https://www.merriam-webster.com/dictionary/postmortem, jev noul 0.70). Business writing on postmortem analysis makes the purpose explicit: the insights gained are meant to guide future actions and resource allocation (https://fourweekmba.com/post-mortem-analysis/, jev noul 0.13, weak backing). Product-management retrospectives on failed products extract the same lessons for the next attempt (https://blog.logrocket.com/product-management/lessons-from-failed-products/, jev noul 0.11, weak backing).

The evidence base is large enough to mine. CB Insights compiled 483 startup failure post-mortems written by founders and investors (https://www.cbinsights.com/research/startup-failure-post-mortem/, jev noul 0.21, weak backing), and one analysis over 1092+ post-mortems distills recurrent failure verdicts and risk indicators (https://ideaproof.io/why-startups-fail-ai-analysis, jev noul 0.11, weak backing). This is why the skill's failed-attempts category and the "Why previous attempts failed" subsection are the same data feeding two audiences: the category is the evidence, the subsection is the conclusion.

## "Why no one has tried this" is an inference rule

The third subsection encodes a rule about empty results: absence of prior art is not a verdict by itself. The report must choose between two explanations (bad idea, genuinely new) and say which the evidence supports. This is the honest-gaps discipline (doc 08) applied analytically: "no prior art found for this angle" is a data point, and the translation section is where it gets interpreted rather than hidden.

## Open opportunity and white space

The fourth subsection names the gap the idea could fill. Strategy literature calls this white-space analysis: identifying untapped market opportunities and growth areas by mapping what is not yet served (https://www.imarcgroup.com/services/white-space-analysis, jev noul 0.08, weak backing). Competitive gap analysis frameworks similarly map performance gaps against industry standards to find where an entrant can differentiate (https://dimensionmarketresearch.com/competitive-gap-analysis, jev noul 0.08, weak backing). The skill's contribution is grounding that gap claim in the fetched-and-cited prior art rather than in assertion.

## Consumed downstream

The source doc's interaction section notes that `idea-kill` consumes this section directly: the prior-art report's "Why previous attempts failed" is input to idea-kill's steelman-the-opposition step. A generic or missing "What this means" therefore breaks a downstream skill, which is why the checklist gates on it explicitly.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`
- https://www.merriam-webster.com/dictionary/postmortem (weight 0.70)
- https://fourweekmba.com/post-mortem-analysis/ (weight 0.13)
- https://blog.logrocket.com/product-management/lessons-from-failed-products/ (weight 0.11)
- https://www.cbinsights.com/research/startup-failure-post-mortem/ (weight 0.21)
- https://ideaproof.io/why-startups-fail-ai-analysis (weight 0.11)
- https://www.imarcgroup.com/services/white-space-analysis (weight 0.08)
- https://dimensionmarketresearch.com/competitive-gap-analysis (weight 0.08)
- https://fastercapital.com/content/Post-Mortem-Analysis-and-Learning--Lessons-from-the-Trenches--Post-Mortem-Analysis (weight 0.08)
