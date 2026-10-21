# 02. Inventory (what exists vs where it lives)

**Scope:** Inventory (what exists vs where it lives): detailed analysis grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md.

## Three states of every artifact

The source's inventory (yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md) sorts the program's outputs into three states: in the repo, session-only, and not built. The sorting is the plan: everything in the second column must move to the first, and the third column is deferred.

## In the repo (yubi-OS/yubiOS)

- **The refs doc with 6 addenda plus the solo log**, pushed and byte-verified.
- **The taste-engine SKILL.md**, last touched 2026-10-05. The source flags that it contains **zero** mention of the falsification corpus, the empty-mask hazard, or the L-convergence protocol. The skill that governs the instrument is stale relative to what the instrument is now known to do.
- **`tools/edge-standard/`**: the v1 pipeline and its selftest.

## Session-only (at risk, per the external-copies rule)

- **`gen_supersolid.py`, `gen_v2.py`, `gen_parity256.py`**: the generators. Without them the corpus cannot be regenerated.
- **`falsification-results-v2.json`**: the measured numbers.
- **`amendments-log-2026-10-06.md`**: the dated, a-priori amendments, which are the evidence that no gate moved post-hoc.
- **`norcia-panels.json` and panel crops**: real-data inputs for the Norcia pass.
- **`trypogeorgos-profiles.json`**: 1D profiles extracted from the Zenodo dataset.
- **The KV-staging live-row pattern**: the operational technique used to move renders to the live route.

## Not built

- **The v3 matched-extent shuffle control.**
- **A falsification-corpus harness in CI.**
- **Any knowledge-corpus mint of the supersolid material.**

## Why the amendments log matters as much as the code

A falsification program is only as credible as its record that gates were set before measurement. Pre-registration is the methodological core that reproducibility critics point to: the QNFO essay names pre-registration among its remedies [The Falsifiability Crisis in Contemporary Physics...: QNFO Papers](https://papers.qnfo.org/papers/falsifiability-crisis) (weak backing, clef weight < 0.5; clef weight: 0.2616), and the medRxiv sepsis study frames its own design as a pre-registered falsification study [Falsification Testing of Sepsis Prediction Models: Evaluating ...](https://www.medrxiv.org/content/10.64898/2026.03.17.26348414v2) (weak backing, clef weight < 0.5; clef weight: 0.1680). The Stanford entry places the "replication crisis" vocabulary in the last decade's literature [Reproducibility of Scientific Results](https://plato.stanford.edu/entries/scientific-reproducibility) (weak backing, clef weight < 0.5; clef weight: 0.2137). The amendments log is the program's pre-registration record; losing it would leave measured numbers with no proof of when the gates were fixed.

Falsification testing in engineering, such as the usage- and risk-aware method for cyber-physical systems [Usage-and Risk-Aware Falsification Testing for Cyber-Physical ...](https://link.springer.com/chapter/10.1007/978-3-031-42626-1_9) (weak backing, clef weight < 0.5; clef weight: 0.3171), likewise depends on preserved test specifications. The dig also returned material on observation-window and counting-window bias [Case-Counting Window Bias Exposed - Science, Public Health Policy and ...](https://publichealthpolicyjournal.com/case-counting-window-bias-exposed/) (weak backing, clef weight < 0.5; clef weight: 0.0706) [Case-Counting Window Bias Exposed - thefocalpoints.com](https://www.thefocalpoints.com/p/case-counting-window-bias-exposed) (weak backing, clef weight < 0.5; clef weight: 0.0710) [Semiparametric regression analysis of window-observation recurrent ...](https://link.springer.com/article/10.1007/s40300-023-00257-0) (weak backing, clef weight < 0.5; clef weight: 0.0427); the parallel in this program is the box-counting window, which the source treats as pinned. An MDPI paper on automated sliding-window scaling-region selection for box-counting [Automated Box-Counting Fractal Dimension Analysis: Sliding Window ...](https://www.mdpi.com/2504-3110/9/10/633) (weak backing, clef weight < 0.5; clef weight: 0.0255) is the opposite philosophy (choosing the window from data), which the program explicitly forbids. CNN pre-market data [Pre-market Stock Trading | CNN](https://www.cnn.com/markets/premarkets) (weak backing, clef weight < 0.5; clef weight: 0.0501) and a dictionary entry for "scale" [SCALE Definition & Meaning - Merriam-Webster](https://www.merriam-webster.com/dictionary/scale) (weak backing, clef weight < 0.5; clef weight: 0.0172) are off-topic.

## Mapping inventory to lanes

The Recommended Direction assigns every at-risk item a destination:

| At-risk item | Destination lane |
|---|---|
| Generators (`gen_v2.py` and siblings) | Lane B: `tools/edge-standard/falsification/`, cleaned, with `--selftest` |
| `falsification-results-v2.json` | Lane B: results JSON in the harness |
| `amendments-log-2026-10-06.md` | Lane B: amendments log in the harness |
| Methodology (implicit in the run) | Lane A: new `falsification-corpus` skill |
| Real-data findings, hazards | Lane C: taste-engine SKILL.md amendment |

The Norcia and Trypogeorgos real-data files are not individually assigned a lane in the source; their findings move through Lane C as documented lessons.

## What the inventory reveals

Two gaps stand out. First, the instrument's governing skill does not know about the instrument's most important recent findings: the empty-mask hazard, the need to check gate windows against the pinned scale lattice, and L-convergence. Second, the corpus that validates the instrument has no CI guard. Either gap alone would let a future session silently regress.

## Evidence quality note

All 10 dig results scored below 0.5 (highest 0.3171) and are labelled weak backing. The inventory itself comes entirely from the ground source.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Pre-market Stock Trading / CNN | https://www.cnn.com/markets/premarkets | 0.0501 | weak (< 0.5) |
| 2 | Reproducibility of Scientific Results | https://plato.stanford.edu/entries/scientific-reproducibility | 0.2137 | weak (< 0.5) |
| 3 | Usage-and Risk-Aware Falsification Testing for Cyber-Physical ... | https://link.springer.com/chapter/10.1007/978-3-031-42626-1_9 | 0.3171 | weak (< 0.5) |
| 4 | The Falsifiability Crisis in Contemporary Physics...: QNFO Papers | https://papers.qnfo.org/papers/falsifiability-crisis | 0.2616 | weak (< 0.5) |
| 5 | Falsification Testing of Sepsis Prediction Models: Evaluating ... | https://www.medrxiv.org/content/10.64898/2026.03.17.26348414v2 | 0.1680 | weak (< 0.5) |
| 6 | Case-Counting Window Bias Exposed - Science, Public Health Policy and ... | https://publichealthpolicyjournal.com/case-counting-window-bias-exposed/ | 0.0706 | weak (< 0.5) |
| 7 | Automated Box-Counting Fractal Dimension Analysis: Sliding Window ... | https://www.mdpi.com/2504-3110/9/10/633 | 0.0255 | weak (< 0.5) |
| 8 | Case-Counting Window Bias Exposed - thefocalpoints.com | https://www.thefocalpoints.com/p/case-counting-window-bias-exposed | 0.0710 | weak (< 0.5) |
| 9 | Semiparametric regression analysis of window-observation recurrent ... | https://link.springer.com/article/10.1007/s40300-023-00257-0 | 0.0427 | weak (< 0.5) |
| 10 | SCALE Definition & Meaning - Merriam-Webster | https://www.merriam-webster.com/dictionary/scale | 0.0172 | weak (< 0.5) |
