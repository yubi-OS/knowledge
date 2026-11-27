# Risqué: Risk Analysis & Risk Science Knowledge Corpus (`skills/risque/`)

- **Ref**: `risque` (Risqué)
- **Minted**: `2026-11-27`
- **Decision Model**: `@cf/cloudflare/clef` via `https://steady-orbit.systems-a.workers.dev/api/decide`
- **Discovery Engine**: Self-hosted searXNG via `https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng`
- **Total Weighted Sources**: `166` unique results across `43` Clef decide calls (`70/166` high-weight `>= 0.50`, `96/166` supplemental `< 0.50`; `44,327` input tokens)
- **Preflight**: `2026-11-27`: searXNG `125` probe results healthy; `/api/decide` (`clef`) HTTP `200` (`noul: 0.9197`)

## Why This Corpus Exists

Informal risk assessments frequently collapse multi-dimensional uncertainty into ordinal `5x5` heatmaps, treat zero observed failures in small test runs as zero failure probability, confuse component reliability with system safety, or optimize expected values in fat-tailed and non-ergodic regimes where a single tail draw causes absorbing ruin. This corpus establishes a rigorous **8-layer Risk Science & Quantitative Risk Engineering discipline** (`risque`, display name **Risqué**) grounded in the Society for Risk Analysis (SRA) ontology, classical and systems-theoretic hazard modeling, Bayesian preposterior decision theory, Extreme Value Theory (EVT), Open FAIR quantitative cyber risk, and ALARP/IRGC risk governance.

## Corpus Document Index

| NN | Document | Clef Outline Score | Results Kept | High Weight (`>= 0.50`) | Redos | One-Line Scope |
|---|---|---|---|---|---|---|
| `01` | [`01-foundations-of-risk-science-and-sra-ontology.md`](./01-foundations-of-risk-science-and-sra-ontology.md) | `1.8858` (keep) | `16` | `9` | `1` | SRA risk ontology, Kaplan and Garrick's scenario triplet `R = {<s_i, p_i, x_i>}`, Terje Aven's `(C, U \| K)` formulation, Law of Total Variance epistemic/aleatory split, and black-swan taxonomy. |
| `02` | [`02-probabilistic-risk-assessment-fault-and-event-trees.md`](./02-probabilistic-risk-assessment-fault-and-event-trees.md) | `1.9158` (keep) | `20` | `7` | `1` | Deductive Fault Tree Analysis (FTA), Minimal Cut Sets (MCS), inductive Event Tree Analysis (ETA), Bow-Tie barrier synthesis, Common-Cause Failures (CCF), and Birnbaum, Fussell-Vesely, RAW, and RRW importance measures. |
| `03` | [`03-systems-theoretic-and-human-reliability-risk-models.md`](./03-systems-theoretic-and-human-reliability-risk-models.md) | `1.8883` (keep) | `20` | `9` | `1` | Nancy Leveson's STAMP and STPA 4-step control-loop hazard analysis, Unsafe Control Actions (UCAs), FMECA RPN mathematical flaws vs. AIAG/VDA Action Priority, HAZOP guidewords, and NUREG/CR-6883 SPAR-H Human Reliability Analysis. |
| `04` | [`04-bayesian-inference-monte-carlo-and-uncertainty-propagation.md`](./04-bayesian-inference-monte-carlo-and-uncertainty-propagation.md) | `1.8541` (keep) | `20` | `8` | `1` | Conjugate Beta-Binomial and Gamma-Poisson updating for sparse/zero-failure data, Preposterior Value of Information (`EVPI`, `EVSI`, `ENGS`), Latin Hypercube Sampling (LHS), 2D Monte Carlo, and Sobol global sensitivity indices. |
| `05` | [`05-extreme-value-theory-tail-risk-and-coherent-measures.md`](./05-extreme-value-theory-tail-risk-and-coherent-measures.md) | `1.7229` (keep) | `30` | `11` | `2` | Fisher-Tippett-Gnedenko Generalized Extreme Value (GEV), Pickands-Balkema-de Haan Generalized Pareto Distribution (GPD) Peaks-Over-Threshold, Artzner coherent risk axioms, Rockafellar-Uryasev CVaR vs. VaR, and non-ergodic Kelly ruin bounds. |
| `06` | [`06-cyber-and-operational-risk-quantification-fair-nist-iso.md`](./06-cyber-and-operational-risk-quantification-fair-nist-iso.md) | `1.5853` (keep) | `20` | `7` | `1` | Open FAIR v3.0 quantitative risk decomposition (`LEF = TEF x Vuln`, Primary + Secondary Loss Magnitude), Louis Anthony Cox's theorem on `5x5` risk matrix rank reversal, ISO 31000:2018, IEC 31010, and NIST SP 800-30 Rev. 1. |
| `07` | [`07-decision-analysis-risk-appetite-and-alarp-governance.md`](./07-decision-analysis-risk-appetite-and-alarp-governance.md) | `1.8211` (keep) | `20` | `8` | `1` | UK HSE Tolerability of Risk (ToR) and ALARP cost-benefit disproportion factor (`ICAF <= DF x VPF`), societal F-N exceedance curves, Expected Utility vs. Tversky-Kahneman Cumulative Prospect Theory, and IRGC 4-class risk governance. |
| `08` | [`08-systemic-cascading-and-ai-autonomy-risk-engineering.md`](./08-systemic-cascading-and-ai-autonomy-risk-engineering.md) | `1.6678` (keep) | `20` | `11` | `1` | Charles Perrow's Normal Accident Theory (`Interactive Complexity x Tight Coupling`), Motter-Lai cascading overload capacity, Weick-Sutcliffe High-Reliability Organizations (HRO), NIST AI RMF 1.0, and fail-closed autonomous safety envelopes. |

## Companion Skill & Research Database

- **Derived Skill**: [`SKILL.md`](./SKILL.md) (OpenAI 2.2 Specification format, mirrored to `yubi-OS/yubiOS/skills/risque/SKILL.md`).
- **Typed Research Database (`research-db/`)**:
  - [`research-db/preflight.json`](./research-db/preflight.json): Endpoint health check for searXNG (`125` results) and `/api/decide` (`clef`).
  - [`research-db/outline.json`](./research-db/outline.json): 8-subtopic decomposition and Clef `score` validation (`8/8` kept, `0` dropped).
  - [`research-db/archive.json`](./research-db/archive.json): All `166` weighted search results with full Clef `noul` decision records and token usage.
  - [`research-db/digs/`](./research-db/digs/): Per-document query logs, redo logs (`9` targeted redos total across the 8 subtopics), and kept result arrays.
  - [`research-db/jev-log.json`](./research-db/jev-log.json): Complete ledger of all `43` `/api/decide` requests (`44,327` input tokens).
  - [`research-db/db.ts`](./research-db/db.ts): TypeScript schema v2 definitions matching all JSON artifacts.
