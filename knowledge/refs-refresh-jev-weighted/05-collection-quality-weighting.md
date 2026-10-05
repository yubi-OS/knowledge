# 05: Collection-Quality Weighting with jev

Scope: how the sweep weights every collected search result with the decision model before any of it can back a claim, and what the weight distribution says about where the model earns its keep.

## The gate nobody skips

After a dig returns its results, every one of them faces the same question: is this a high-quality authoritative source worth citing? In the sweep spec that question is a jev `noul` call: true means a primary or official source worth citing; false means an aggregator, forum, marketing page, dead link, or off-topic hit. The weight is the probability itself, so a 0.9 result is near-certain primary quality and a 0.2 result is near-certain noise. Batched 5 results per request, 144 results in the reference run cost 31 jev requests.

The rule that makes this stage non-negotiable: a decision-model failure is treated exactly like a thin dig. Results that cannot be scored after redo attempts (sleep 30s, resend, up to 3 attempts, smaller batches on retry) mean the affected docs are skipped and recorded as gaps. Nothing is ever shipped unweighted.

## Why weight the collection and not just the docs

Source-quality judgment before citation is not new. University library guides formalize it: evaluate the source before you rely on it, deciding whether it is appropriate to use (https://usingsources.fas.harvard.edu/evaluating-sources-0, weight 0.5792), with authority judged on relevance, accuracy, authority, purpose, and timeliness (https://guides.stlcc.edu/evaluate_sources/authority, weight 0.7561). The sweep mechanizes exactly this checklist: instead of a human applying CRAAP-style criteria per result, the decision model applies a single calibrated criterion (primary/official versus aggregator/marketing/forum/dead) at 96 results in 20 requests.

What the automation buys is coverage. In the reference run's own dig logs, the same query family returned GitHub release pages (high weight) next to an academic paper on cigar use (off-topic, effectively zero) and an Excel forum thread asking for a "blended ranking formula" (noise). A human skim would catch the obvious ones; the model also catches the plausible-but-aggregator ones, which is where manual collection silently degrades.

## The distribution, and what it teaches

Across the 2026-09-29 run's 144 weighted results, noul ranged from 0.11 to 0.79 with a mean of 0.417. The spec's honest finding: the same model, pointed at collection quality instead of doc refresh need, produces verdicts that visibly differ between upstream primary sources and aggregators, which is why collection-quality weighting is described as jev's highest-value seat. The doc-triage seat (doc 02) produced a flat distribution; the weighting seat produces working separations. Same model, different question quality.

This corpus's own weighting run shows the same behavior on 96 results: official docs and primary repos land high (SearXNG search API docs 0.8563, searxng/searxng 0.9413, TypeScript handbook on interfaces 0.9481, APA guidance on citing generative AI 0.9601, Databricks retrieval-quality eval 0.9466), while dictionaries, SEO blogs, game trackers, and link farms land at 0.03 to 0.15. Vendor and standards-adjacent pages land mid-range (HAProxy API gateway solutions 0.5556, Wikipedia 0.14 to 0.56 depending on the page), which is exactly the zone where a human reviewer would hesitate and where a calibrated number helps most.

## How the weight is used downstream

The weight travels with the result into the research DB and into the authored docs. The rule in authoring: a claim backed by a result with weight 0.5 or higher carries authoritative backing; a claim whose best backing is below 0.5 is stated with a weak-backing label in the text. That threshold turns a continuous probability into a reviewer-visible quality signal, and it makes the research summary countable: the reference run could report its 144 results split by weight band, and this corpus can report its 96 as high or low.

## Cost shape

Weighting is the cheap stage. 5 results per request keeps the per-request token count in the hundreds (the 2026-10-05 weighting pass averaged about 770 input tokens per request for 5 questions), and the 20-request cost is a fraction of a cent. The expensive resource it protects is trust: no claim in the corpus can cite a source the decision model never saw.
