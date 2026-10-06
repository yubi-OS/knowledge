# 08 - Variation generation and scoring: the ideate-solo method

Scope: how the framing log generated and selected its design variations: 7 variations from named lenses, the P/S/D/T score, the drop threshold, folding of near-winners, and the stress-test critique.

## The method as applied

The ideate-solo log generated 7 variations of the n8n retarget problem, each tagged with a lens: V1 prompt console only (Simplification), V2 full port of all phases (Constraint removal), V3 automations as repo code (Inversion), V4 n8n stays builder (Audience shift), V5 registry plus Llama runtime plus prompt intake plus cron (Combination), V6 LLM-scored policy gate (Inversion), V7 external LLM APIs (Audience shift). Each was scored on 4 dimensions, P, S, D, and T, summed to a total; V5 won with 17, V1 scored 16, V2 scored 15, and V6 scored lowest at 9 (framing log, 2026-09-30).

## Lens-based generation

Lens-based ideation is the standard structured method. SCAMPER is described as a structured set of ideation prompts used to explore alternative ways to change an existing product, service, process, or idea, giving people several lenses for asking what else could we do without pretending the answers are already good solutions (https://www.learnleansigma.com/guides/scamper-creative-thinking/, jev weight 0.4307, weak backing). Each technique works as a distinct thinking lens that helps creators view problems from different angles (https://www.imd.org/blog/innovation/scamper-method-design-thinking/, jev weight 0.5067). The method applies seven thinking operators to an existing product, service, or process to systematically generate improvement ideas and variations (https://www.si-labs.com/en/articles/scamper/, jev weight 0.3121, weak backing). The framing log's lenses (simplification, constraint removal, inversion, audience shift, combination) are the same move: force each variation through a different transformation of the problem rather than free-associating.

Two documented anti-patterns are directly relevant to why the solo method separates generation from scoring: starting with a preferred solution produces cosmetic variants, and scoring during generation suppresses range and participation (https://methodfield.com/en/tools/scamper, jev weight 0.3924, weak backing). The framing log follows the separation: all 7 variations were generated and scored before the finalist was selected, and the two losers below threshold were dropped rather than patched mid-selection.

## Weighted scoring and selection

The scoring rationale has direct prior art. The weighted scoring matrix addresses the central challenge of multi-criteria decision-making: different stakeholders value different dimensions, and without explicit weighting the loudest voice or most recent argument dominates (https://www.innovationprofessional.com/resources/methods/weighted-scoring-matrix.html, jev weight 0.7086). Weighted scoring models are standard product-management practice for calculating and comparing option scores (https://productschool.com/blog/product-fundamentals/weighted-scoring-model, jev weight 0.4378, weak backing). An idea-matrix framework recommends weighted scoring for balanced and fair assessment, integrated into the innovation workflow so high-value ideas receive proper attention (https://qmarkets.net/resources/article/idea-matrix/, jev weight 0.3587, weak backing). Objective selection criteria are positioned as a check on executive bias, ranking ideas on potential ROI versus implementation complexity (https://ideawake.com/idea-selection-criteria-for-innovation-the-2026-framework-for-data-driven-scoring/, jev weight 0.2592, weak backing). Numeric multi-dimension scoring has an older psychometric precedent: assessment instruments map constructs onto numeric scales through structured questionnaires (https://en.wikipedia.org/wiki/Personality_test, jev weight 0.7011).

The framing log's P/S/D/T scale follows that structure: 4 explicit dimensions, 1 to 5 each, sum compared against a threshold. The drop rule (below-threshold variations die, near-winners fold into the finalist) kept V1 as the console's prompt intake and V2 as the lead suite inside V5, rather than averaging them.

## Stress-testing the winner

The log records a stress-test critique of the finalist (an automation registry that stores prompts in a dashboard is config drift with extra steps), a counter grounded in versioning and audit discipline, and a named un-testable bet (neuron pricing at volume) (framing log, 2026-09-30). Recording the counter and the residual bet alongside the win is what separates the selection from a rubber stamp: the strongest source in this corpus argues that without explicit weighting and criteria, judgment defaults to the loudest argument, and the log's written critique is that discipline applied to itself.

## Verdict

The method is a faithful application of established practice: lens-forced generation, generate-then-score separation, explicit multi-criteria weighted scoring, a drop threshold, folding of runners-up, and a recorded stress test. The main caveat is that the P/S/D/T scores are one judge's numbers, not inter-rater data; the corpus evidence (weights 0.43 to 0.71 for the scoring-method sources) supports the structure of the method, not the specific 17 versus 16 margin.
