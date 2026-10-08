# the-cult - knowledge corpus

Minted from the ground source `yubi-OS/yubiOS skills/the-cult/SKILL.md` (17171 bytes, fetched 2026-10-08): file-based multi-agent orchestration for yubiOS work. The cult leader orchestrator gathers arriving agents, reads the roster, and hands out tasks through plain files in the GET_TO_WORK folder.

## Docs

- [01-meeting-ground.md](01-meeting-ground.md) - the GET_TO_WORK folder layout, the role of each file, and how the layout maps to blackboard and stigmergy coordination patterns.
- [03-sermon-flow.md](03-sermon-flow.md) - the step-by-step leader loop from trigger to steady-state polling, mapped onto the orchestrator-workers pattern and contrasted with work stealing.
- [04-when-not-to-use.md](04-when-not-to-use.md) - the three boundary rules (stale PULPIT, no solo runs, no scheduled variant) and the failures each prevents. Internal-record subtopic, no dig.
- [08-follower-contract.md](08-follower-contract.md) - the four follower obligations (atomic slot claim, 5 minute check-ins, outbox reports, skill-load order) and the pattern families behind them.

## Research summary

- Results collected: 72 (12 queries, 6 kept per query, across 3 dug subtopics; 1 internal-record subtopic dug none).
- Weight split: 1 high (>= 0.5) / 71 low (< 0.5) of 72. Every low-weight citation is labeled weak backing in the docs.
- Jev: 7 requests (1 outline validation + 6 weighting batches), usage 9607 input / 1588 output tokens, model typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions).
- Redos: 1 round. Attempt-1 queries returned off-topic results (file managers, LMS logins, mail clients, dictionaries) for subtopics 01, 03 and 08; 6 replacement queries were run and all their results weighted.
- Outline: 8 subtopics proposed, 4 kept, 4 dropped at validation (02 lockfile-method score 0.48, 05 ending-protocol 0.49, 06 cosmic-duties 0.41, 07 primitive-history 0.25; each dominated by the padding: drop probability).
- Gaps: no doc was skipped for a thin dig, but dig quality was weak overall; only the Claude Cookbook orchestrator-workers page scored >= 0.5. Docs 01 and 08 are grounded mostly on the source doc spine with weak external context.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI direct /api/v1/decisions 200.
