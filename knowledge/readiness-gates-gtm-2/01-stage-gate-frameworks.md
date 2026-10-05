# 01: Stage Gate Frameworks

Scope: how readiness gates act as go/no-go decision points in new product introduction, with explicit entry and exit criteria, and what mature frameworks require a gate to do.

## The Stage Gate model

The Stage Gate model, formalized by Dr. Robert G. Cooper, has been the dominant framework for managing new product development for over four decades. Its official publisher describes it as both a value-creation engine and a risk-management governance model: a roadmap for moving a project from idea to launch, structured into stages of work separated by gates where go/kill/hold decisions are made. The model's stated function is to ensure the right projects are resourced and the wrong ones are killed early (source: https://www.stage-gate.com/blog/the-stage-gate-model-an-overview/, weight 0.75, strong).

The canonical decomposition is 6 stages and 5 gates: idea generation, scoping, business case, development, testing and validation, and launch, with a gate before each stage that reviews deliverables against criteria set at the previous gate. Advocates frame the gate as a middle checkpoint that keeps production moving in the targeted direction between stages; critics note the model is linear and can constrain creative iteration, which is why modern variants add adaptive and spiral iterations inside stages (source: https://www.designorate.com/stage-gate-new-product-development-process/, weight 0.47, weak backing).

Asana's practice guide describes the same structure for general project management: distinct phases separated by gates, each gate holding 3 standard tasks: review deliverables from the finished stage, evaluate against criteria, and decide whether to proceed, recycle, or kill (source: https://asana.com/resources/stage-gate-process, weight 0.25, weak backing).

## What a gate actually decides

A gate is a formal decision point, not a status meeting. The GovCon gate-review literature is explicit about this: gates are checkpoints where an opportunity must meet specific criteria to pass; if it does not, the pursuit stops or takes corrective action before proceeding. The stated benefits are resource discipline, win-rate improvement (fewer, better bids), strategic alignment, risk management, and clear ownership of decisions. The same source quantifies the asymmetry that makes early gates valuable: saying no at gate 1 costs nothing, while saying no after months of capture and a full proposal costs hundreds of thousands of dollars (source: https://govcongiants.com/guides/gate-reviews, weight 0.44, weak backing).

The DecisionGate open standard formalizes the gate as a deliberate decision pause with trigger conditions: a decision requires a gate when it affects other people, consumes significant time or money, is difficult or costly to reverse (a Reversibility Index of 3 or above on a 1 to 5 scale), scales beyond a single team, or changes customer or employee reality. The standard explicitly scopes the gate to determining whether to act and assigning responsibility for the outcome, not managing execution afterward (source: https://decisiongate.org/standard.html, weight 0.55, strong).

## Readiness gates versus completion checklists

A launch-readiness scorecard approach distinguishes task completion from readiness: the product may work in the demo while support has no escalation path, sales may promise unverified outcomes, security still has an open high-risk finding, and nobody knows how to reverse the rollout. The proposed structure evaluates 8 dimensions (customer value, product quality, security, delivery, operations, commercial readiness, customer enablement, measurement) and keeps hard blockers outside the weighted average, so a strong marketing score cannot compensate for an unacceptable safety risk. The same source notes thresholds should differ by launch type: a private design-partner release and a public launch should not share identical gates (source: https://data-panda.com/post/product-launch-readiness-scorecard, weight 0.14, weak backing).

This distinction matters for early-stage security products in particular. A commercial readiness gate is not a list of tasks done; it is evidence that each readiness dimension holds at the standard the launch type demands, with non-negotiable blockers (unresolved security findings, absent rollback paths) that cannot be averaged away.

## Gate design patterns for early-stage products

Three patterns recur across the frameworks above and apply directly to gate ladders like Gate 0 through Gate 3 for a young product:

1. Criteria written before the gate is reached. Every framework treats gate criteria as defined in advance, applied to deliverables produced during the stage, not invented at review time (source: https://www.designorate.com/stage-gate-new-product-development-process/, weight 0.47, weak backing).
2. Kill paths that are actually used. Gate discipline exists because the model kills work; a gate that only ever says go is a milestone list, not a gate (source: https://govcongiants.com/guides/gate-reviews, weight 0.44, weak backing).
3. Reversibility-aware gating. Decisions that are hard to reverse get the full gate treatment; cheap, reversible moves can use a fast track (source: https://decisiongate.org/standard.html, weight 0.55, strong).

For an early-stage security product moving through internal groundwork, offer discussions, paid pilots, and general availability claims, these patterns translate directly: write each gate's evidence requirements down before the gate, make the not-allowed activities at each gate explicit, and reserve full-gate scrutiny for the irreversible commitments (signed SOWs, public production claims).

## Limitations

The stage-gate literature is weighted toward mature organizations managing portfolios of product bets. Adapting it to a single-product startup means keeping the gate semantics (criteria, evidence, kill paths) while dropping the portfolio machinery. The model's linearity is also a documented weakness; spiral and adaptive iterations inside stages are the standard remedy (source: https://www.designorate.com/stage-gate-new-product-development-process/, weight 0.47, weak backing).
