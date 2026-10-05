# Readiness-gated growth assumptions

**Scope:** Revenue availability tied to readiness gates and pilot completion rather than calendar quarters, with resource commitments triggered by gate events.

## The gate concept

The Stage-Gate model structures new product development as stages separated by gates, where each gate applies defined criteria and produces an explicit decision: go, kill, hold, or recycle, with resources committed only to projects that pass (https://www.stage-gate.com/about/stage-gate-innovation-performance-framework/discovery-to-launch-process/, jev weight 0.48, weak backing). The canonical gate criteria set is six items: strategic fit, product and competitive advantage, market attractiveness, technical feasibility, synergies and core competencies, and financial reward versus risk (same source).

The model's authoring organization emphasizes that merely having an idea-to-launch process in place does not guarantee success; benchmark data shows successful companies share specific process traits (https://www.stage-gate.com/blog/the-stage-gate-model-an-overview/, jev weight 0.54, authoritative backing). For a revenue model, the relevant trait is that gate decisions are real decisions: a gate that stays open is a revenue line that stays at zero.

## Translating gates into revenue timing

In a three-year model, the natural error is to schedule revenue on a calendar (offer X yields revenue in quarter 5) and let readiness be implicit. The gate discipline inverts this: each offer's revenue line is active only after its gate closes, where a gate closing is a defined, checkable event such as a technical capability demonstrated, a contract vehicle available, or a pilot completed.

This has a mechanical consequence for the base case: an offer whose gate is open contributes zero revenue in every period before the gate closes, regardless of how attractive its price and volume assumptions are. The line is not discounted or de-risked; it is inactive. When the gate closes earlier or later than hoped, the revenue moves with it, which is exactly the sensitivity the scenario doc (05) stress-tests.

## Event-triggered resource commitments

The same logic governs spending. Hiring and other resource commitments should trigger on gate events rather than on calendar dates. Milestone-based planning in adjacent domains does exactly this: converting milestone tranches into a phased hiring schedule so that spending on headcount is tied to creating fundable value rather than to elapsed time (https://www.glencoyne.com/guides/hiring-plan-biotech-startups, jev weight 0.31, weak backing).

The structural rule for the model: fixed costs that represent response capacity (support staff, engineering for a specific offer) enter `fixed_costs(year)` only in periods where their triggering event has actually fired. A cost that appears on a schedule independent of its trigger is a hidden upside assumption, because it assumes the trigger will fire.

## What this buys in an unfilled model

With all numbers empty, the gating structure is still fully writable:

- Each offer lists its gate conditions and evidence source.
- Each revenue line lists the gate that activates it.
- Each triggered cost lists the event that releases it.

The model can then be evaluated for internal consistency before any number exists: a revenue line active before its gate could close is inconsistent, and a cost scheduled before its trigger is speculative. This turns "when do we believe the numbers" into "are the gates wired correctly", a question answerable today.
