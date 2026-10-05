# Scenario and sensitivity architecture before numbers exist

**Scope:** Downside, base, and upside scenario shapes per driver (gate timing, segment fit, funding path, hardware cost) and how sensitivity ranges are structured before any numbers exist.

## Scenario analysis as a method

Scenario analysis examines possible future events or scenarios and predicts feasible outcomes; in financial modeling it estimates changes in the value of a business or its cash flow under both favorable and unfavorable developments (https://corporatefinanceinstitute.com/resources/financial-modeling/scenario-analysis/, jev weight 0.79, authoritative backing). Its purpose is to replace a single point estimate with a range of possible outcomes (https://www.tikr.com/blog/how-to-run-a-sensitivity-analysis-in-a-valuation-model, jev weight 0.46, weak backing).

A common structural implementation swaps an entire set of operating and financing assumptions in and out of the model with a single switch, producing three coherent views of the future (base, upside, downside) rather than one speculative path (https://iwpfinance.com/concepts/financial-modeling/scenario-analysis-modeling, jev weight 0.35, weak backing). Startup-focused guidance makes the same three-case structure the standard frame: base case, upside, and downside with key variable stress tests (https://www.raisereadybook.com/pillars/financial-modelling/scenario-analysis/, jev weight 0.33, weak backing).

## Sensitizing the right variables

Not every input deserves a scenario. Model outputs are highly sensitive to a small set of key variables, and the output should be sensitized for those variables to produce a range rather than a number (https://www.fe.training/free-resources/valuation/dcf-sensitizing-for-key-variables/, jev weight 0.48, weak backing). In valuation practice, revenue growth and margins are typically the top two drivers, responsible for a large share of value sensitivity (https://pomegra.io/learn/library/track-b-stock-market-core/stock-valuation/chapter-03-dcf-full-treatment/key-value-drivers-analysis, jev weight 0.45, weak backing).

For an early-stage venture model, the analogous high-sensitivity drivers map directly onto the structural skeleton:

| Driver | Downside shape | Upside shape |
|---|---|---|
| Readiness-gate timing | Gates stay open longer than hoped, pushing the offer's revenue line out; each quarter of delay compounds because event-triggered costs also do not fire | Gates close early, pulling the revenue line forward |
| Segment fit | Pilots run in the selected segments but none convert | One segment converts unexpectedly well, changing which offer deserves resourcing |
| Funding path | No grant or funding lands; front-loaded fixed costs must be self-funded | Non-dilutive capital arrives and extends runway without touching revenue-dependent assumptions |
| Hardware unit cost | Unit cost or supply moves adversely, outside the venture's control | Bulk or partner pricing lowers the unit cost and improves margin |

The funding-path row is structurally distinct: non-dilutive capital changes the runway calculation without changing any revenue assumption, which is why it is stressed separately rather than blended into a revenue multiple.

## Burn-side scenario shape

On the cost side, the three-scenario frame applies to cash timing rather than growth: in a base case, model when cash consumption equals revenue and how much cash is burned between now and then (https://inflectioncfo.co/blog/burn-rate-vs-cash-consumption-the-profitability-timing-trap/, jev weight 0.36, weak backing). The downside version of that question is the runway-exhaustion stop rule in doc 06.

## What remains deliberately unstated

This architecture defines what to stress-test, not the resulting numbers. Running an actual sensitivity analysis requires a filled base case first. The scenario table above is therefore the deliverable: it names the drivers, their downside and upside shapes, and the structural interactions (delay compounding, self-funded fixed costs) that a filled model will have to respect.
