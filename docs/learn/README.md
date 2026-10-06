# learn: knowledge corpus explicating yubi-OS/yubiOS docs/LEARN.md

Ground source: [yubi-OS/yubiOS docs/LEARN.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/LEARN.md), "LLC (Learned Latent Curves) and The Vacuum", 1372 bytes, fetched 2026-10-06. The corpus explicates the doc: the recorded lessons, their evidence anchors, and the learning discipline the doc establishes. The doc's own sections dictated the outline: its title, its Y_3^3 render, its Charts section, its mermaid learner pipeline, and its drift check log.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-llc-and-the-vacuum.md](01-llc-and-the-vacuum.md) | The 2 halves of the title: LLC as the doc uses it, and the undefined term "The Vacuum" |
| 02 | [02-y33-hypersphere-384d.md](02-y33-hypersphere-384d.md) | The Y_3^3 hyper-sphere render at 384-D, the harmonic notation it invokes, and what the digs do not corroborate |
| 03 | [03-charts-as-artifacts.md](03-charts-as-artifacts.md) | The 4 image assets the doc embeds, their hosting in yubi-OS/assets, and what that arrangement records |
| 04 | [04-learner-fourier-mlp.md](04-learner-fourier-mlp.md) | The learner pipeline: 1D input t, Fourier features, small MLP, and the external recipe it matches |
| 05 | [05-dual-curves-project-self.md](05-dual-curves-project-self.md) | z_project(t) feeding task evaluation and z_self(t) feeding model-state evaluation |
| 06 | [06-optimization-signal-loop.md](06-optimization-signal-loop.md) | The fused optimization signal, the parameter update, and the closed loop over the whole learner |
| 07 | [07-rsi-loop-capability-change.md](07-rsi-loop-capability-change.md) | Breadth/depth deltas, the recursive self-improvement loop, and real-world capability change |
| 08 | [08-drift-check-discipline.md](08-drift-check-discipline.md) | The 2026-09-18 drift check entries and the per-round inventory completeness discipline |

## Research summary

- Results collected: 72. The 6 web-shaped subtopics got 2 searXNG queries each (44 to 69 raw results per query, top 6 kept). Subtopics 03 and 08 are internal-record subtopics and were not dug, per the DOCS mint brief.
- Weights: high (weight >= 0.5) 0, low (weight < 0.5) 72 of 72. Every externally backed claim in the docs is labeled weak with its jev noul weight shown. Each doc's spine is the source doc itself, which is the primary source of record.
- Jev: 7 requests (1 outline validation with 8 score questions, 6 noul weighting batches of 12), all through DefAPI direct at api.defapi.org/api/v1/decisions. Zero 429s, zero relay fallbacks. Usage: 11925 input tokens, 1516 output tokens, cost 0.0010017.
- Redos: 0. No dig was thin enough to require a redo.
- Skipped docs: 0. All 8 outline subtopics were authored.

## Gaps

- "The Vacuum" in the doc title is undefined in the source doc and unaddressed by the digs.
- The 384-D figure has no external corroboration tying that dimension count to Y_3^3.
- Chart contents are not machine readable from the source doc text; the Charts section has no prose or captions.
- The optimization signal fusion rule, the semantics of z_self(t) beyond "Self-state / model-state evaluation", and the operationalization of "Real-world capability change" are all unstated in the source doc.

## Preflight

2026-10-06: searXNG healthy (campaign preflight run orchestrator-side, agent probe skipped per brief); DefAPI direct (typesafe/jev-1.13) used for all 7 decisions, zero 429s, no fallback needed.
