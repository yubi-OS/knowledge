# skills/curve-guided-rsi - knowledge corpus

Explication of the yubiOS skill `curve-guided-rsi` (ground source: yubi-OS/yubiOS skills/curve-guided-rsi/SKILL.md, fetched 2026-10-06, 16441 B): recursive self-improvement driven by negative-skill-space gap-mapping and hypersphere curve-fitting on the SKILL.md corpus, the bounded RSI loop, the fixpoint rule, and the hypothesis-per-cycle discipline.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [the-bounded-rsi-loop](01-the-bounded-rsi-loop.md) | hypothesis per cycle, the fixpoint rule, the 3-cycle default cap, fresh-context subagents, the changelog audit trail |
| 02 | [the-five-stage-pipeline](02-the-five-stage-pipeline.md) | Stage 1 curve fit, Stage 2 sparse-cell detection, Stage 3 NSS-proposes/atom-disposes, Stage 4 capped RSI cycles, Stage 5 re-fit plus verify |
| 03 | [architectural-choices](03-architectural-choices.md) | r = 0.05 threshold, top-N and RSI caps, re-fit cadence, t as audit primary key, 9-D binary-coverage target space, pre-fit validation |
| 04 | [verification-checklist](04-verification-checklist.md) | the 10-check closed-loop contract: N gate, PC variance gate, holdout R2 gate, sparse-cell delta, per-gap scope and cycle caps |
| 05 | [anti-patterns-and-red-flags](05-anti-patterns-and-red-flags.md) | the 8 anti-patterns and 6 red flags, what each protects, and the prescribed fallbacks |

## Research summary

- Results collected: 60 (10 searXNG queries, 5 web-shaped subtopics, 2 queries each, top 6 per query)
- Weight split: 12 high (>= 0.5) / 48 low (< 0.5) / 0 null
- jev requests: 5 (1 outline score request of 10 questions + 4 noul batches of 15), usage 6710 input / 1370 output tokens
- Redos: 0 (no dig was thin enough to require one; decide endpoint served every request on the first attempt via DefAPI direct)
- Skipped docs: 0 of the 5 kept; the outline started at 10 candidate subtopics and jev score validation dropped 5 (t03 curve coordinates 0.35, t04 sparse-cell threshold 0.13, t06 pre-fit validation 0.14, t09 composition 0.28, t10 empirical history 0.11, each dominated by the padding label). t04-named-as-verification-checklist scored 0.67 (marginal) and was kept because its dig returned strong authoritative PCA and holdout sources.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator probe); decide endpoint 200 (jev-1.13 served via DefAPI direct, https://api.defapi.org/api/v1/decisions; the steady-orbit /api/decide relay was the fallback and was never needed).

## Source-doc policy

The SKILL.md at yubi-OS/yubiOS skills/curve-guided-rsi/SKILL.md is the primary source of record; every doc cites it as the grounding spine. External mechanisms named by the skill (PCA explained variance, holdout evaluation, threshold tuning, sign-flip handling, anti-pattern catalogues) are grounded with searXNG-dug sources carrying jev noul weights. Claims from the source doc are marked "source doc"; weak dig sources (< 0.5) are labeled weak in text. The internal-record sections of the skill (Changelog cycles, primitive-coverage notes) are cited from the source doc without digs.
