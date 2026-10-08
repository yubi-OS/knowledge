# 04 - Phase 2: jev Triage and Batching

Scope: how Phase 2 turns the Phase 1 signal table into per-doc refresh scores with a batched binary decision model, and the rate-limit and persistence disciplines that keep it cheap and restart-safe.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc), plus decision-model and LLM-as-a-judge references via dig.

## The state object

Phase 2's state per doc is: file, topic (the filename's first dash-segment), age_days, size, title, and the section flags from Phase 1 (source doc). The single-question batch shape recorded in the source doc's Examples section shows the exact form: a `state` object carrying `run_date` and a `docs` array, with one `noul` question per doc named `needs_refresh_0..4`.

The question is phrased as "does doc #k need a deep-research refresh because upstream reality has materially changed since it was written", with criteria true = "Topic tracks fast-moving upstream or facts likely stale" and false = "Process/policy/history content that stays valid" (source doc).

## Why batching is non-negotiable

The source doc sets the batch size at 5 docs per request. For a 234-doc corpus that is 47 requests, roughly 4 minutes paced at 4.3s spacing, at about $0.005 total. The cost arithmetic matters because the endpoint is capped at 15 requests per minute per IP (source doc, Prerequisites); one request per doc would burn the cap and 10 times the money, which is why "unbatched jev calls" is a listed anti-pattern.

Scores are persisted to `jev-scores.json` after EVERY batch, with task_id, cost, and timestamp per doc, and the run logs BEFORE/AFTER per batch for kill-resilience (source doc). This is the same incremental-persistence discipline as Phase 1 (doc 03); the source doc records an actual container restart that killed an unflushed dig batch, and non-incremental persistence is a named anti-pattern.

## Dig grounding: the decision-model family

TypeSafe's documentation grounds what the question layer is: Jev is TypeSafe's flagship model, described as the first System One model, taking state and typed questions and returning structured answers code can consume directly (https://docs.typesafe.ai/, weight 0.57).

The LLM-as-a-judge literature grounds both the value and the caution. Langfuse's evaluation documentation describes LLM-as-a-judge as using large language models to automatically score and evaluate outputs at scale with rubric-guided assessments (https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge, weight 0.87). The rubric point maps directly onto the skill's practice: the `needs_refresh` question carries explicit true/false criteria rather than an open prompt. The academic survey literature is more reserved: a ScienceDirect survey on LLM-as-a-judge notes that ensuring the reliability of such systems "remains a significant challenge requiring careful design and standardization" (https://www.sciencedirect.com/science/article/pii/S2666675825004564, weight 0.50, at the weak threshold). Two arXiv papers on LLM-judge reliability surfaced in the dig but carry weak weight (0.36 and 0.40) and are cited here only as weak backing. The skill's own answer to the reliability question is the age blend in doc 05: jev is never the sole gate.

## Cost and budget shape

The source doc's worked example gives the reference numbers: 47 batched requests for 234 docs at roughly $0.003, scores persisted per batch. The 15/min/IP cap shared across parallel agents means a fan-out run must pace requests (the subagent template carries a 30s backoff on 429 with a max of 3 retries). The red-flag list adds: if 429s persist after 3 backoffs, slow the whole fan-out and raise the inter-request sleep rather than hammering (source doc).

## What triage is NOT

Phase 2 does not decide what to dig or how to refresh. It produces a binary-plus-probability signal per doc. The dig decision belongs to Phase 3's blended rank (doc 05), and the refresh content belongs to Phase 6's subagents (doc 08). Keeping triage binary and cheap is what lets it run over the whole corpus instead of a sample.

## Observations from this corpus's own mint

During this corpus's mint on 2026-10-06, the same noul question shape was used to weight 84 collected dig results in 7 batched requests, with weights ranging 0.01 to 0.97 and a clean separation between official documentation (0.87 to 0.91) and forum or marketing pages (0.07 to 0.15), matching the separation the source doc reports for its validating run.
