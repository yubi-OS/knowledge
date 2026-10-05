# 03: Ranking and Bounded Queue Selection

Scope: how the sweep turns per-doc triage scores and ages into a ranked refresh queue, and why the queue is a small bounded set instead of the whole corpus.

## The blended rank

The 2026-09-29 sweep ranked all 234 docs with a single formula: `0.7 * jev_needs_refresh + 0.3 * age_norm`. Both terms are normalized to comparable ranges, so the blend is a real weighted sum, not a lexicographic tie-break. The 0.7/0.3 split is a judgment call with a rationale: the decision model's refresh-need score is the primary signal, but the 2026-09-29 run showed the model alone was too flat (max 0.79, no clear gate at 0.8), so age carries enough weight to move old docs up without letting a merely old-but-stable doc dominate.

The top of the queue landed exactly where the two signals agree: the oldest and highest-scoring docs. The ranked head was `systemd-v262-audit-2026-07-14.md` (jev 0.79, 77 days old), followed by `systemd-upstream-progress-2026-07-21.md` (0.79, 70 days), `bootc-dev-org-releases-2026-07-23.md` (0.78, 68 days), and the rest of the top 12, spanning systemd, bootc, RK3588 board status, Fedora base images, mkosi, post-quantum TLS, osbuild, endlessh, Panfrost, and systemd hardening.

## Why blend, and why weight recency

Blending a semantic score with a recency signal is a standard retrieval pattern. Practitioner writeups describe the final ranking score as "a weighted combination of semantic similarity, query-dependent recency decay, and content-type multiplier" (https://whollysoftware.com/blog/ai-powered-search-ranking-blending-relevance-with-recency, weight 0.3045, weak backing), and time-aware retrieval guides define recency weighting as modifying retrieval scoring so newer documents are preferred, most commonly via exponential decay (https://github.com/claude-dev-suite/knowledge_base/blob/main/knowledge/rag/time-aware-retrieval/recency-weighting.md, weight 0.2245, weak backing). The general principle, combining "how well does this match the query" with "how current is this information" into one score, is what the 0.7/0.3 blend implements (https://www.adaptiverecall.com/cognitive-scoring/combine-recency-relevance.php, weight 0.3772, weak backing).

The difference in the sweep is the semantics of the second term: it is not document freshness but queue urgency. age_norm ranks how long the doc has been unrefreshed, which is a workload-prioritization signal, not a relevance signal.

## Prioritization theory agrees

Structured scoring for backlog ordering is the mainstream approach outside this domain too: Scrum guidance describes stakeholders ranking backlog items with scoring systems (https://www.scrum.org/resources/blog/product-backlog-prioritization-techniques, weight 0.9331), and backlog-revival practice treats stale items as items to refresh or retire deliberately rather than ignore (https://skills.visual-paradigm.com/docs/common-mistakes-in-writing-user-stories/scaling-and-lifecycle-issues/stale-backlog-items-revival/, weight 0.6096). A real-world trace of the same discipline shows up in tooling repos tracking their own doc debt, such as microsoft/hve-core issue 1604, a dedicated "docs: Update stale documentation" work item (https://github.com/microsoft/hve-core/issues/1604, weight 0.673).

## Bounding the queue

The sweep does not dig into all 234 docs. It takes the top 12 by blended rank. Three reasons:

1. **Cost.** Each queued doc costs 2 searXNG queries plus up to 12 jev weightings. 12 docs cost 24 digs and 31 weighting requests; 234 docs would cost 19 times that for results nobody would read before the next sweep.
2. **Reviewability.** A PR whose research DB contains 12 dug docs is reviewable; a PR that touches 234 doc-adjacent datasets is not.
3. **Decay of signal.** The triage scores are a snapshot. By the time a mega-batch finished refreshing, the oldest docs would have moved and the ranking would be stale. A bounded queue keeps the sweep-to-landing latency short enough that the ranking stays meaningful.

The queue is also the natural unit of accountability: each of the 12 dug docs got its own dig record with its own result quality stats (average dig weight ranged from 0.23 to 0.70 across the 12), so the next sweep can compare dig quality per topic area and adjust query design where it was weak.

## What the rank does not decide

The blended rank picks what to dig, not what to believe. Dig quality is judged separately in the weighting stage (doc 05), and a high-ranked doc whose dig comes back thin gets redone with different queries or skipped with a recorded gap (docs 04 and 07). Rank is an input-allocation decision; truth-finding starts after it.
