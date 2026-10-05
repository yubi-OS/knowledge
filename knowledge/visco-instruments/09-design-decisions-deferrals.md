# 09 Design decisions and deferrals

Scope: the jev-qualified design decisions carried into v1 (persistence-first 0.83, Python source of record 0.88, deterministic Prony 0.82, builtins 0.89, scope "about right" 0.97) and the documented out-of-scope list including the rate-dependent scorer deferral.

## The decision record

Five design decisions were qualified through the worker's decision model before the build, under task `ta9ac373` [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]:

| decision | weight |
|---|---|
| persistence-first | 0.83 |
| Python source of record with parity ports | 0.88 |
| deterministic Prony (tau grid + NNLS) | 0.82 |
| builtins (`visco_hysteresis`, `visco_snapback`) | 0.89 |
| scope "about right" | 0.97 |

Each weight is a calibrated probability from the decision model, not a vote count: the scope decision at 0.97 means near-certainty that the v1 boundary was drawn correctly, while the deterministic-Prony choice at 0.82 carries more residual uncertainty, which is consistent with it being the instrument whose live fit quality (r2 0.069 on mixed history) is the least settled [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## The out-of-scope list

The v1 scope explicitly excludes: LLM grading on the worker, new D1 tables, a console tab, the WLF policy-shift surface, and rate-dependent R. The deferral is documented with its reason: deterministic scoring collapses R to 1, and the unlock is a stochastic or rate-dependent scorer owned by the caller [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

The reason is not hypothetical. The round-3 creep-recovery replay measured it: the text-revert unload returns the score matrix exactly, so the recovery fraction R = 1.0 for every edit class under a deterministic scorer, meaning the elastic-versus-plastic separation does not live in the revert leg at all [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md]. The same replay jev-qualified `persist_beats_R` at 0.92, confirming that persistence-under-regrading should carry the discriminating role until a rate-dependent scorer exists [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md].

## The deterministic-versus-graded tradeoff, from the literature

The deferral sits inside a broader tradeoff in evaluation-system design. Deterministic scoring and LLM-based judging are commonly contrasted: rule-based evaluation follows the premise that the same input should produce the same output, while LLM-as-a-judge uses a language model to score or critique outputs against prompt-stated criteria [source: https://cogniswitch.ai/guides/llm-as-a-judge-vs-deterministic-verification, jev weight 0.2001, weak backing]. A 2026 comparison argues the two are not a binary pick but a cascade, layering deterministic checks under model judgment to cut evaluation cost [source: https://futureagi.com/blog/deterministic-vs-llm-judge-evals-2026/, jev weight 0.1678, weak backing]. A technical trade-off study frames the same tension: traditional software testing is built on determinism, which large language model outputs do not natively satisfy [source: https://dev.to/anshd_12/deterministic-vs-llm-evaluators-a-2026-technical-trade-off-study-11h, jev weight 0.2782, weak backing]. These sources are weakly backed and are cited here for orientation only; the load-bearing evidence for the deferral is the internal measurement of R = 1.0.

The visco instrument set resolves the tension in a specific way: deterministic math (fixtures, NNLS, sign inversion) for everything the machine computes, and graded inputs (the caller-supplied independent re-grade rows) accepted as inputs rather than computed in-process. The deferral of rate-dependent R keeps the scorer boundary at the API edge.

## ADR practice as the frame for carrying decisions

Architecture decision records are short documents capturing a single architecturally significant decision with its context and consequences [source: https://martinfowler.com/bliki/ArchitectureDecisionRecord.html, jev weight 0.8312]. Microsoft's well-architected guidance calls the ADR one of the most important deliverables of a solution architect: the architecture is the accumulation of its decisions, so the record shows how and why the system took its shape [source: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.8863]. Google Cloud guidance explains when and how to use ADRs to document design choices [source: https://docs.cloud.google.com/architecture/architecture-decision-records, jev weight 0.7826], and the community index promotes open and transparent decision history [source: https://adr.github.io/, jev weight 0.788; reference repository: https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.5698].

The visco build record applies this: decisions carry weights and dates, deferrals carry reasons, and the out-of-scope list is explicit rather than implied by absence. The deferral of the WLF policy-shift surface and rate-dependent R is a recorded decision about a future instrument, not an undocumented gap [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## What the builtins decision bought

Registering `visco_hysteresis` and `visco_snapback` as pure, read-only builtins for the hourly evolution cycle (decision weight 0.89) means the two cheapest instruments run unattended on the existing cron rather than waiting for a caller to invoke them [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. A pure, read-only builtin cannot corrupt the ledger it reads, which is what makes unattended execution acceptable. The persistence and prony routes, which accept caller-supplied inputs, remain explicit API calls: the instruments that take external input require someone to supply it.
