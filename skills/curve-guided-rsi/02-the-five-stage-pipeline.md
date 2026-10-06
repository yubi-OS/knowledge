# 02 - The five-stage pipeline

Scope: the pipeline the skill runs end to end: Stage 1 curve fit and gap map, Stage 2 sparse-cell detection, Stage 3 NSS-proposes/atom-disposes dispatch, Stage 4 capped RSI cycles, Stage 5 re-fit and verify, plus the verifiable success metric that ties the stages together.

curve-guided-rsi is a pipeline, not a single model. The source doc is explicit about this in its Losses section: there is no loss function because the artifact is a closed-loop process, and the closest analog to a loss is the Stage 5 verification metric, which acts as the audit signal (source doc). The five stages below follow the doc's own structure.

## Stage 1: curve fit and gap map

Stage 1 fits the curve over the corpus and produces the coordinates the rest of the pipeline consumes. It re-uses the v3-validated pipeline from `learned-latent-curve`: the 9-D binary coverage matrix, a seeded QR lift, PC1+PC2, and a 2-D learned surface (source doc, Interaction with Other Skills). Stage 1 is also where the pre-RSI sparse-cell count is recorded; the verification checklist requires it (source doc, Verification). The fit quality gate lives here too: PC1+PC2 must explain at least 0.40 of variance, or the corpus does not have the low-rank structure the curve needs (source doc, Red Flags).

## Stage 2: sparse-cell detection

The fitted (u, v) surface is partitioned into equal-area cells, and cells below the sparsity threshold r are marked as gaps. The doc's own terminology is the equal-area partition: Stage 3 iterates "for each sparse_cell in equal_area_partition" and maps each sparse cell to the file whose S2 point lies inside it (source doc, Stage 3 redesign). The threshold r is configurable, tuned at 0.05, with valid bounds between 0.01 and 0.20 (source doc, Anti-patterns). The sparse-cell idea has an established analog in coverage analysis: sensor-scheduling research formalizes guaranteed sparse coverage over regions of interest (https://arxiv.org/pdf/0911.4332, jev weight 0.58), and institutional gap-analysis methodology, for example FAO's crop-wild-relative gap analysis, likewise works by locating under-covered regions against a target structure (https://www.fao.org/fileadmin/templates/agphome/documents/PGR/PubPGR/ResourceBook/A.8.pdf, jev weight 0.79). Coverage-gap mapping as a named technique also appears in network planning, where coverage gap maps drive prioritization (https://www.sciencedirect.com/science/article/pii/S1574119224001238, jev weight 0.51).

## Stage 3: NSS proposes, the atom disposes

Stage 3 is a two-stage dispatch, redesigned on 2026-08-06. For each sparse cell: Stage 3a runs the negative-skill-space 12-axis qualitative sweep on the file in that cell and keeps only Extend gaps, the 5 to 10 real gap candidates; Stage 3b runs the single-action atom on the file with those candidates as its constraint set, returning d_pre, d_post, and the chosen action, and accumulating the corpus delta (source doc, Stage 3 redesign).

The division of labor is strict: NSS stays the upstream gap-proposer and adds no new actions to the atom; it only filters the candidate set. The atom remains the only-positive-delta executor, and its argmin-delta selection is computed within whatever set NSS passes (source doc). If NSS is unavailable, the atom-only fallback uses "all missing primitives" as the constraint set, which preserves the same invariants (source doc). Dispatch runs through fresh-context subagents per `context-isolation` discipline, and reads only the gap candidate's SKILL.md, its primitive coverage, and its t coordinate, not the full corpus, per `token-efficiency` (source doc, Interaction with Other Skills).

Closed-loop engineering pipelines with an explicit verification stage are standard practice in adjacent engineering domains; Siemens frames closed-loop validation as the loop between design intent and measured outcome (https://www.plm.automation.siemens.com/media/global/en/Intelligent%20Performance%20Engineering%20Closed-loop%20Validation%20Whitepaper_tcm27-105835.pdf, jev weight 0.56), which is the same shape as propose, act, verify here.

## Stage 4: capped RSI cycles

Stage 4 applies the `recursive-self-improvement` edit protocol to each gap candidate, capped at 3 cycles per skill per run, with the cycle-by-cycle changelog as the per-gap audit trail (source doc, Interaction with Other Skills). Each cycle is one hypothesis and one edit; the fixpoint rule and cap discipline are covered in doc 01.

## Stage 5: re-fit and verify

After all RSI cycles complete, Stage 5 re-runs Stage 1 on the updated corpus and compares pre/post metrics: sparse_cell_count_post against sparse_cell_count_pre, the PC1+PC2 explained variance ratio (which must stay at 0.40 or above), and holdout R2 (which must stay above 0, ideally improving). If the sparse-cell count dropped, the log records "curve moved, gaps closed", which is the success metric. If it did not move, either the RSI edits did not address real gaps or the curve fit is too noisy to detect small movements, and the doc directs the operator to investigate by reading the gap candidate's changelog entries (source doc, Stage 5).

Because the atom's per-file deltas are non-negative by construction (Lemma 1 and Theorem 1 in `single-action-curve-rsi`'s Composition Rule), the corpus-level Stage 5 metric is the sum of per-file deltas, and every run produces a non-negative cumulative corpus delta (source doc, Composition Rule reference).
