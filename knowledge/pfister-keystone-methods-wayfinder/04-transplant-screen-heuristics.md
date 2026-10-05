# 04. The transplant screen: 8 variations, 4 heuristics

**Scope.** How catalog method families were screened into shipped, deferred, rejected, and not-transplantable verdicts, and the evaluation discipline the screen encodes.

## Idea evaluation as a make-or-break step

Innovation research treats idea evaluation as a pivotal stage: the decision environment makes evaluation resource-intensive and prone to costly errors, such as dismissing breakthrough ideas or advancing flawed ones [1]. The transplant screen answers that risk with a fixed heuristic set rather than taste. The screen itself, its 8 variations, and its verdicts are recorded in the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (project provenance, internal primary source, unweighted).

## The 4 heuristics

Every variation was scored on:

1. **Painkiller**: does it remove a recorded, named pain, or is it a nice-to-have?
2. **Switching cost**: what does adopting it change in the existing workflow?
3. **Defensibility under AGENT.md**: does it survive the project's recorded do-not-do contract, which forbids deleting, self-scoring, computing rates or Gaussian tails, reselecting radii or grids, adding physics or ranking terms, admitting coordinates, and reporting counts without n?
4. **Testability**: can a run falsify it?

Testability as a screen criterion is the falsifiability rule: a proposal must be testable in a way that can potentially prove it false [2][3], and methodology work on falsifiable, replicable, reproducible research design gives the operational guidelines for that demand [4]. Falsifiability has recognized limits as a heuristic, but it is the standard screen for taken-for-granted ideas [2].

## The verdicts

| Variation | Mechanism | Verdict |
|---|---|---|
| V1 CutPaste positive control | seeded splice of donor text into host, measured as a frozen-frame change | ship |
| V2 Business-metric-aware outcome ledger | pre-registered prediction plus independent verdict, counts only | ship |
| V3 TabNet mask-and-predict axis redundancy | predict bit j from the other 8 bits versus null | defer: needs its own admission null |
| V4 TFT variable-selection axis importance | reweight frozen axes by importance | reject: any weight feeding ranking is a new term |
| V5 FixMatch weak/strong consistency pre-filter | 2 previews per candidate, signs must agree | defer: reads as a geometric gate |
| V6 TFT quantile horizons for rung deltas | empirical null quantiles of predicted delta | reject: K=40 cannot resolve tails below 1/41 |
| V7 UDA consistency training | needs a prediction target to regularize | not transplantable |
| V8 TimesFM, Pic2Word, Distilling, Chain-of-Agents | pretrained models, paired supervision, trainable student | not transplantable: no labels, no downstream model |

V3 defers because the recorded rule is that a new per-axis statistic needs its own admission null first; V5 defers because a consistency gate would read as a keep/revert rule on the corpus. Both were later reframed and shipped as trials rather than gates, which is doc 08's subject. V4's rejection reason, that "sectors are anonymous geometry", is a defensibility verdict, not an effectiveness verdict.

## The stress test

The 2 winners were then stressed against the recorded do-not-do set. Neither deletes, neither self-scores, neither computes a rate or Gaussian tail, neither reselects a radius or grid, neither adds a physics term or a ranking term, neither admits a coordinate. Both attach n to every count. Both refuse tuning knobs that could be fitted to the result (project provenance, internal primary source, unweighted).

This ordering, constraints first and heuristics second, mirrors the evaluation literature's warning that the costly errors happen when screening is ad hoc: the structured evaluation is what protects against dismissing a breakthrough or advancing a flawed idea [1]. The screen's output was 2 shipped instruments, 2 deferrals that later shipped as reframed trials, 2 rejections, and 2 non-transplants. That is a normal yield for a disciplined screen rather than a failure of it [1].

## Sources

1. https://www.sciencedirect.com/science/article/pii/S0166497226000982 (noul 0.9115)
2. https://methods.sagepub.com/ency/edvol/encyclopedia-of-evaluation/chpt/falsifiability (noul 0.8436)
3. https://www.ebsco.com/research-starters/religion-and-philosophy/falsifiability-rule (noul 0.5223)
4. https://arxiv.org/html/2405.18077v1 (noul 0.6667)
