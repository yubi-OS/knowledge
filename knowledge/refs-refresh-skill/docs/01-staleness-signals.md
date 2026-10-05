# Corpus staleness signals: age and topic movement in one rank

Scope: how to enumerate a documentation corpus and combine document age with topic-movement signals into a single refresh priority rank, and why neither signal alone is enough.

## The problem: two signals, neither sufficient

A documentation corpus decays in two independent ways. The first is age: a document written 8 months ago describes a world that has moved under it. The second is topic movement: a document written last week about a fast-moving dependency can already be stale, while a 2 year old process document is still accurate.

The literature on software aging treats this as a general phenomenon, not a documentation-specific one. Software rot is defined on Wikipedia as "the degradation, deterioration, or loss of the use or performance of software over time" (https://en.wikipedia.org/wiki/Software_rot, weight 0.70). Documentation itself is defined as "any communicable material that is used to describe, explain, or instruct regarding some attributes of an object" (https://en.wikipedia.org/wiki/Documentation, weight 0.64). Put together: documentation is communicable material about a moving object, so its decay rate is bounded below by the movement rate of the object it describes.

## Why age alone misleads

The practical weakness of age-only signals is documented in production-adjacent writing. Data freshness rot, described from RAG systems, is called "the silent failure mode" precisely because the artifact still exists and still answers, it just answers with stale grounding (https://glenrhodes.com/data-freshness-rot-as-the-silent-failure-mode-in-production-rag-systems-and-treating-document-shelf-life-as-a-first-class-reliability-concern/, weight 0.68). The same essay argues for treating document shelf life as a first-class reliability concern, which is the strongest public articulation of the position that freshness needs to be measured, not assumed.

Documentation-drift writing makes the complementary point. Documentation drift is described as "a truth gap": the page exists, people still send it to new hires, and it describes last quarter's system (https://moxiedocs.com/learn/what-is-documentation-drift, weight 0.50). Note the weight: this source sits at the 0.5 boundary, so it should be treated as adequate but not authoritative backing.

Age is measurable cheaply: file mtime, git commit date, or an explicit date-stamp in the frontmatter. Topic movement is not measurable from the document alone. It requires either an external changelog feed or a judgment call about whether the subject matter has moved.

## Why topic judgment alone misleads

Topic-only triage has the inverse failure. If a judge model reads a document and asks "does this need refreshing because upstream reality moved", it tends to answer conservatively for process and history content, because that content genuinely does not move. The observed calibration of one such triage pass over 234 documents returned a median score of 0.40 with zero documents above 0.8, meaning the model read most of the corpus as durable and therefore unrefreshable (source: the skill's own validating run, internal evidence, 2026-09-29). That calibration is itself a finding: when the decision model says "most of this corpus is durable", it is usually right, and age has to carry the ranking that the topic judgment refuses to provide.

## The blend

The design that resolves the tension is a linear blend: 0.7 times the decision-model topic score plus 0.3 times a normalized age score, computed per document, then ranked. The weights encode an honest asymmetry: topic movement is the more meaningful signal when it fires, but it fires rarely, so age carries the bulk of the ranking pressure across a mostly-stable corpus.

The blend has a property worth naming: it is monotone in each component. A document cannot rank high on age alone unless its topic score is at least non-committal, and a document cannot rank high on topic movement alone unless it is at least somewhat recent. This prevents the two classic ranking failures: refreshing the oldest irrelevant doc, and refreshing the newest doc about the thing that just shipped.

Weak-backing caveat: direct published evidence for a specific 0.7/0.3 weighting in documentation-refresh pipelines is thin. The freshness-measurement guidance that does exist frames freshness as a delay between event time and processing time (https://www.hyperdocs.io/blogs/how-to-measure-documentation-freshness-and-maintenance-health, weight 0.34, weak backing), and a stale-documentation audit playbook proposes git age plus link checks as detection signals before triaging into delete, date-stamp, fix, or automate buckets (https://datadef.io/guides/en/stale-documentation, weight 0.41, weak backing). Both are directionally consistent with the blend but neither validates the specific weights.

## Enumeration at scale

The validated run enumerated 234 documents in a single GitHub Contents API call and fetched bodies through raw.githubusercontent with 8-way parallelism, computing a median age of 54 days with 136 documents at 45 days or older (internal evidence, 2026-09-29). The lesson is that enumeration must be a bulk operation, not a per-document one, or the sweep itself becomes the bottleneck.

## Summary

1. Age is cheap, monotone, and always fires; topic judgment is expensive, sparse, and mostly reports "durable".
2. Neither signal ranks a corpus alone.
3. A 0.7 topic plus 0.3 age blend ranks age-first while letting strong topic movement jump the queue.
4. Honest calibration of the topic judge (median 0.40) is a finding to keep, not a bug to fix.
