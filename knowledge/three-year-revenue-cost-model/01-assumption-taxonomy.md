# Assumption taxonomy for an unfilled early-stage model

**Scope:** Which assumption categories (pricing, conversion, volume, unit cost, fixed costs, funding) must exist as explicit inputs before any number is asserted, and the discipline of keeping cells empty until evidence exists.

A startup financial model is a structured projection of revenue, expenses, and cash position over a fixed horizon, and it works by connecting a small set of assumptions about pricing, growth, and costs to downstream outputs such as burn rate, runway, and unit economics (https://revenuemap.app/blog/startup-financial-model-template, jev weight 0.46, weak backing). The structural point matters more than the template: the assumptions are the model. Everything else is arithmetic on top of them.

## The revenue-side assumption categories

Three drivers generate revenue in a bottom-up early-stage model: price, volume, and conversion (https://stratea.ai/startup-financial-model/, jev weight 0.39, weak backing). Each is a separate input cell with a separate evidence source, and conflating them is the classic failure. Price is a hypothesis until a customer signs. Volume per customer is a segment-dependent guess until a first customer's actual usage is known. Conversion rate from conversation to paid contract has literally zero data points before the first pilot cycle completes.

For a venture selling multiple offers, each offer carries its own triple of price, volume, and conversion assumptions. A model that lumps them into one blended revenue line cannot be falsified offer by offer, and cannot be stopped offer by offer either. That last property matters: per-offer assumption separation is what makes per-offer stop rules mechanically possible.

## The cost-side assumption categories

Operating costs fall into two categories that behave very differently as the venture grows: fixed costs and variable costs (https://stratea.ai/startup-financial-model/, jev weight 0.39, weak backing). Fixed costs include engineering, legal, entity formation, and compliance overhead. Variable costs scale with units delivered: hardware cost per device, support labor per contract, infrastructure cost per build.

Confusing the two categories corrupts both pricing and budgeting, because a cost misclassified as variable will not actually scale down when volume does, and one misclassified as fixed hides real per-unit exposure (https://www.businesssupervisor.com/fixed-vs-variable-startup-costs/, jev weight 0.48, weak backing).

## The funding input

Funding available is a distinct assumption category, not a revenue line. It determines runway independently of any revenue assumption, which is precisely why a runway calculation cannot be evaluated while the funding amount is unrecorded. A model that leaves the funding cell empty is not incomplete in a cosmetic way; it is missing the one input that bounds every stop rule.

## The empty-cell discipline

For a pre-revenue venture, assembling the first set of assumptions can be overwhelming, but the assumptions remain in the founder's control: even when the model itself is outsourced, the founder must stay in full control of the assumptions inside it (https://caena.io/financial-modelling-cheat-sheet-for-early-stage-startups/, jev weight 0.48, weak backing). This is an argument for explicit, named, individually editable assumption cells rather than numbers buried in formulas.

The credible-model discipline is to name every assumption, plan expenses explicitly, and pick key metrics deliberately (https://qubit.capital/blog/financial-assumptions-startups, jev weight 0.51, authoritative backing). The practical implementation of that discipline for a venture with no revenue history yet is a taxonomy with the value column unfilled:

| Category | Input needed | Evidence that fills it |
|---|---|---|
| Price per offer | Pricing shape (per-seat, flat, time and materials) | Signed pilot contract |
| Conversion rate | Percentage of conversations that close | Completed pilot pipeline |
| Volume per customer | Units or seats per customer | First customer's real usage |
| Unit cost per offer | Hardware, labor, infrastructure per unit | Vendor quotes and actuals |
| Fixed costs | Legal, engineering, compliance schedule | Invoices, not guesses |
| Funding available | Capital envelope | A landed funding document |

## Validation as the exit condition

Assumption validation is a distinct step that happens before external scrutiny: a step-by-step validation framework exists precisely so gaps are found before investors expose them (https://inflectioncfo.co/blog/startup-financial-model-validation-testing-assumptions-before-investors-do/, jev weight 0.26, weak backing). For an unfilled model, the equivalent discipline is simpler and stricter: every category stays an explicit, named input, and each one is filled only by its specific evidence source. A model is "done" not when the numbers look good but when every cell traces to a real observation.
