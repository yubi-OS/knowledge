# 05 - Phase 3: Ranking and Dig Strategy

Scope: the blended rank that decides which docs get dug, the bounded dig shape, and how SearXNG engine suspension behaves plus what to do about it.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc), plus SearXNG engine-suspension documentation via dig.

## The blended rank formula

Phase 3 ranks every triaged doc as `0.7 * jev_noul + 0.3 * min(age_days/80, 1)` and digs only the top-N, where 12 to 14 is the stated sane bound (source doc). The blend exists because of a measured property of the decision model: in the validation run jev's noul scored a maximum of 0.79 with a median of 0.40, meaning it reads most docs as durable history. Age is therefore the binding signal and jev ranks within it. The source doc requires that this agreement analysis be recorded honestly in the run's plan doc, and lists "trusting jev noul as the sole gate" as an anti-pattern.

Dig grounding for the recency side: agent-memory tooling documents a similar convention, recommending a freshness weight in the 0.2 to 0.4 range so recently edited documents are promoted past ties without letting a stale-but-relevant page vanish, while higher values make edit time dominate (https://docs.aetherdb.ai/docs/guides/recency-ranking, weight 0.58). The skill's 0.3 age term sits inside that band. Lower-weight hits on knowledge-base freshness scoring exist (0.10 to 0.16) but are weak backing.

## The dig shape

Per the source doc: 2 queries per doc derived from its topic, plus one discretionary query the digger may add; keep the top 6 results per query. The scope is bounded (top-N by blended rank), never all docs (source doc guideline 4).

Engine suspension is a first-class failure mode of the dig layer, not an edge case: the source doc records that when searXNG engines are suspended under shared parallel fan-out, the fallback is DIRECT primary-source verification (GitHub releases API, kernel.org, upstream NEWS files), and that a zero-result dig must never become an invented summary.

## Dig grounding: how SearXNG suspension actually works

The SearXNG exceptions documentation is the authoritative source on suspension mechanics (https://docs.searxng.org/src/searx.exceptions.html, weight 0.87; module source at https://docs.searxng.org/_modules/searx/exceptions.html, weight 0.85). By default, SearXNG stops sending requests to an engine for 1 hour after a `SearxEngineTooManyRequests` error, with `SUSPEND_TIME_SETTING` defaulting to 3660 seconds. Access-denied errors suspend for 86400 seconds, 1 full day. This explains why suspension appears "common under parallel fan-out" (source doc): a burst of shared queries against the same engines trips the too-many-requests path, and every subsequent query from every agent hits the suspension window for the next hour.

The practical recovery guidance from the mcp-searxng project's troubleshooting doc is to remove constraints one at a time when SearXNG returns no result, and to note that an explicit engine combined with a time_range requires verified support from every configured instance (https://github.com/ihor-sokoliuk/mcp-searxng/blob/main/docs/troubleshooting.md, weight 0.59). A community discussion on engines timing out despite configuration changes exists but carries weak weight (0.25).

The metasearch layer itself is grounded: SearXNG is a free internet metasearch engine aggregating results from various search services and databases, without tracking or profiling users (https://github.com/searxng/searxng, weight 0.78; result-handling code at https://github.com/searxng/searxng/blob/master/searx/webutils.py, weight 0.77).

## REDO discipline

In this corpus's mint the REDO rule (parent mint brief) was applied: a dig that comes back too thin to author honestly must be redone with DIFFERENT queries, up to 2 redos, each logged; a still-thin doc is SKIPPED and recorded as a gap, never padded, and primary sources are never fetched directly to fill a thin dig during the mint phase. This mint required 0 redos: all 14 queries returned 31 to 54 raw results. Note the distinction between mint-phase digs (REDO rule, skip) and refresh-phase digs inside Phase 6 (primary-source fallback allowed when engines are suspended). The source doc sanctions the primary-source fallback only for the refresh subagents, not as a mint-phase filler.

## Ranking observations from this mint

The outline-validation step of this corpus's mint is a worked instance of ranking-with-a-decision-model: 9 candidate subtopics were scored on a 3-level scale in one batched request, 5 scored load-bearing, 4 scored marginal and were kept only because their digs came back strong. The same "decision model proposes, evidence confirms" structure the skill uses at doc level.
