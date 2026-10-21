# 03. Clef and Heuristic Convergence Scoring

**Scope:** Four-heuristic scoring (Painkiller, Switching, Defensibility, Testability) paired with live Clef `/api/decide` scoring (V6 2.8804/3.0, choice p=0.9598; V2 rejected at 0.4433).

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md`, section "Variations Generated & Scored (Heuristic 4-20 + Live Clef `/api/decide` 0-3)".

**Outline score:** 1.9308 (clef `score`, P(load-bearing) = 0.9516, confidence 0.86; the highest-scoring subtopic in the outline).

## 1. Two scoring systems, one convergence step

The convergent phase of the ideate-solo run scored each of the 6 variations (doc 02) twice:

1. **Heuristic score (4-20).** 4 criteria, each rated 1 to 5: Painkiller (how much real pain it removes), Switching (how cheap it is to adopt), Defensibility (how well it holds up under critique and constraint), Testability (how directly it can be falsified).
2. **Clef score (0-3).** A live call to the `/api/decide` endpoint (`@cf/cloudflare/clef`) returning a probability-weighted score per variation, plus a `choice` question over the finalists.

The heuristic is the author's judgment; Clef is an independent, calibrated second opinion. Agreement between them is the convergence signal.

## 2. What Clef is, per the dig

Cloudflare's announcement introduces "Clef and Clef-flash, open-source decision models hosted on Workers AI for high-speed classification and agentic workflows," alongside an RL platform for fine-tuning decision models on developer data (https://blog.cloudflare.com/clef-decision-models/, clef weight: 0.7523). The developers changelog adds that Clef and Clef-flash "are decision models that return typed answers with probabilities," that they "lead 7 of 10 decision benchmarks, run up to 13x faster than Jev, and are open source under Apache 2.0" (https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/, clef weight: 0.7342).

The calibration story (why Clef probabilities are usable as scores) appears in the dig only through secondary sources:

- A trade report says training "freezes the backbone and jointly optimizes a routing head with rank-256 low-rank adapters, calibrating with a Brier loss and a 'Reinforcement Learning for Calibrated Decisions' objective," attributing this to Cloudflare's Introducing Clef post (https://the-agent-report.com/2026/10/cloudflare-clef-open-source-decision-models-2026/, clef weight: 0.1221, weak backing, clef weight < 0.5).
- A model-summary page describes "label-smoothed cross-entropy plus a Brier loss for calibration on internal synthetic data" and an RL stage called RLCD, and labels Clef a 27B decision model on a Qwen backbone (https://ai-tldr.dev/models/clef/, clef weight: 0.2009, weak backing, clef weight < 0.5).
- A blog post asserts that Brier-loss optimization makes Clef's outputs "calibrated" (https://mantbyte.github.io/tech/2026/10/02/cloudflare-clef-high-performance-decision-models.html, clef weight: 0.1493, weak backing, clef weight < 0.5).

Treat Brier-loss, LoRA rank, 27B size, and Qwen backbone as unverified secondary claims: no high-weight dig source states them. They do not change the cascade design; the ground source relies only on Clef returning typed probabilities.

## 3. The scores

From the ground source:

| ID | Painkiller | Switching | Defensibility | Testability | Heuristic | Clef (0-3) |
|---|---|---|---|---|---|---|
| V1 | 3 | 4 | 3 | 4 | 14/20 | 1.4265 |
| V2 | 2 | 2 | 2 | 3 | 9/20 | 0.4433 |
| V3 | 4 | 3 | 3 | 3 | 13/20 | 0.9133 |
| V4 | 5 | 4 | 5 | 4 | 18/20 | 2.3980 |
| V5 | 4 | 5 | 4 | 5 | 18/20 | 2.5539 |
| V6 | 5 | 5 | 5 | 5 | 20/20 | 2.8804 (`choice p = 0.9598`) |

### 3.1 Convergence

The 2 systems produce the same ordering at both ends: V6 first, V2 last. In the middle, V1 (14/20, 1.4265) and V3 (13/20, 0.9133) keep the same relative order. The only heuristic tie (V4 = V5 = 18/20) is broken by Clef in V5's favor (2.5539 vs 2.3980). The rank orderings are fully consistent; Clef adds resolution where the heuristic's 1-to-5 granularity runs out.

### 3.2 The finalist call

V6's Clef score of 2.8804 out of 3.0 plus a `choice` probability of 0.9598 makes it a near-unanimous pick. The heuristic justification for its straight 5s: it closes the ETS G2 band-coverage gap with split-conformal calibration (80/100), enforces the Apache-2.0 2.5 -> 3.0 fallback boundary, drops into `yubi-OS/yubiOS/tools/` with zero external dependencies for CI (8/8 PASS), and consumes live `@cf/cloudflare/clairic` and `@cf/cloudflare/clef` payloads without code changes.

### 3.3 The rejection

V2 was dropped on a Clef score of 0.4433/3.0, with 58.5% of probability mass on Level 0. The heuristic outliers (2s on Painkiller, Switching, Defensibility) are justified by compute waste on univariate series and tripping the non-commercial 3.0 weight license on every call. V3 was dropped at 0.9133 as too narrow.

## 4. Relation to classical multi-criteria decision analysis

The 4-heuristic scheme is a simple additive multi-criteria scoring. The dig for MCDA literature returned only weakly backed results, none of which the ground source cites:

- An MCDM methodology for choosing electricity-demand forecasting models found multiple regression and exponential smoothing best and used sensitivity analysis to test ranking robustness (https://www.mdpi.com/2071-1050/16/21/9219, clef weight: 0.1383, weak backing, clef weight < 0.5; mirror at https://www.researchgate.net/publication/385213359_Multicriteria_Decision_Making_for_Selecting_Forecasting_Electricity_Demand_Models, clef weight: 0.0623, weak backing, clef weight < 0.5).
- Work on integrating MCDA with forecasting for investment decisions (https://www.sciencedirect.com/science/article/pii/S0377221724007343, clef weight: 0.1520, weak backing, clef weight < 0.5).
- A practical guide to participatory multi-criteria analysis (https://www.researchgate.net/publication/358131153_A_Practical_Guide_to_Multi-Criteria_Analysis, clef weight: 0.1095, weak backing, clef weight < 0.5).
- MCDM portfolio selection combined with predictive models (https://www.mdpi.com/2227-7390/14/13/2287, clef weight: 0.1471, weak backing, clef weight < 0.5).

The one transferable idea (weakly backed) is the sensitivity analysis: the ideate-solo run did not perturb heuristic weights, so its robustness argument rests on the independent Clef ranking agreeing, not on a weight sweep.

## Sources Considered

| # | URL | Clef weight | Backing |
|---|---|---|---|
| 1 | https://blog.cloudflare.com/clef-decision-models/ | 0.7523 | authoritative |
| 2 | https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/ | 0.7342 | authoritative |
| 3 | https://the-agent-report.com/2026/10/cloudflare-clef-open-source-decision-models-2026/ | 0.1221 | weak backing, clef weight < 0.5 |
| 4 | https://ai-tldr.dev/models/clef/ | 0.2009 | weak backing, clef weight < 0.5 |
| 5 | https://mantbyte.github.io/tech/2026/10/02/cloudflare-clef-high-performance-decision-models.html | 0.1493 | weak backing, clef weight < 0.5 |
| 6 | https://www.mdpi.com/2071-1050/16/21/9219 | 0.1383 | weak backing, clef weight < 0.5 |
| 7 | https://www.researchgate.net/publication/385213359_Multicriteria_Decision_Making_for_Selecting_Forecasting_Electricity_Demand_Models | 0.0623 | weak backing, clef weight < 0.5 |
| 8 | https://www.researchgate.net/publication/358131153_A_Practical_Guide_to_Multi-Criteria_Analysis | 0.1095 | weak backing, clef weight < 0.5 |
| 9 | https://www.sciencedirect.com/science/article/pii/S0377221724007343 | 0.1520 | weak backing, clef weight < 0.5 |
| 10 | https://www.mdpi.com/2227-7390/14/13/2287 | 0.1471 | weak backing, clef weight < 0.5 |

Dig queries: `Cloudflare Clef decision models Brier loss calibration`, `multi-criteria decision analysis model selection forecasting`. 10 results: 2 high (>= 0.5), 8 low (< 0.5).
