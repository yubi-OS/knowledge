# Revenue line structure for an early-stage venture

**Scope:** Revenue(year) as a sum over offers of customers_won times price times volume_per_customer, and how an offer catalog maps to revenue lines.

## Bottom-up construction

Bottom-up forecasting estimates a company's future performance by starting with low-level company data and working up to revenue, beginning with detailed customer or product information and broadening from there (https://corporatefinanceinstitute.com/resources/financial-modeling/bottom-up-forecasting/, jev weight 0.81, authoritative backing). This is the natural construction for a venture with a small offer catalog and no revenue history: it does not require a market-size estimate to produce a first model, only per-customer mechanics.

The same decomposition appears in practitioner revenue-model guidance as the volume times price decomposition: revenue is built from volume drivers multiplied by price, with driver derivation made explicit rather than left inside a single growth percentage (https://www.financial-modeling.com/revenue-model-excel-bottom-up-top-down/, jev weight 0.70, authoritative backing). Wall Street Prep frames it the same way: bottom-up forecasting breaks the business apart into the underlying components that drive its revenue generation (https://www.wallstreetprep.com/knowledge/bottom-up-forecasting/, jev weight 0.66, authoritative backing).

## The per-offer revenue line

For a venture selling multiple distinct offers, the bottom-up unit is the offer, not the company. Each revenue line takes the shape:

```
Revenue(offer, year) = customers_won(offer, year) x price(offer) x volume_per_customer(offer)
Revenue(year) = sum over offers of Revenue(offer, year)
```

This is the direct application of the volume-times-price decomposition (https://www.financial-modeling.com/revenue-model-excel-bottom-up-top-down/, jev weight 0.70, authoritative backing) at offer granularity. It has three properties that matter for an unfilled model:

1. Every factor is a separate assumption cell with a separate evidence source (see the assumption taxonomy doc). A signed pilot fills the price cell; a completed pilot fills the volume cell; a closed conversion pipeline fills the customers_won cell.
2. Readiness gating attaches at the line level. An offer whose technical or contractual gate is still open contributes zero in early years, not a discounted amount. The line structure makes that gate explicit instead of smearing it into an aggregate growth rate.
3. Stop rules attach at the line level. When a specific offer's conversion assumption fails, its line can be zeroed without touching the rest of the model.

## Subscription versus transactional lines

Offer catalogs usually mix pricing shapes: recurring support contracts, per-unit hardware, one-time builds. SaaS financial models account for recurring revenue and customer-level metrics because subscription distribution produces more stable, recurring revenue than one-time purchases (https://corporatefinanceinstitute.com/resources/financial-modeling/saas-financial-model/, jev weight 0.70, authoritative backing). A blended catalog therefore needs each line to declare its own revenue recognition shape: recurring lines compound across years, transactional lines reset each year, and a per-seat hardware line behaves like a transactional sale with an attached recurring support contract.

Practitioner guidance for SaaS revenue models emphasizes bringing financial rigor to the choice of revenue model and tracking the resulting metrics scenario by scenario (https://www.cubesoftware.com/blog/saas-revenue-model, jev weight 0.44, weak backing).

## Internal consistency checks the structure enables

Because each line is explicit, a base case built this way can be checked mechanically without new data:

- Lines whose underlying offer is gated on unfinished technical work should show zero revenue in the periods before the gate can plausibly close. A line that assumes revenue while its gate is open is internally inconsistent with the venture's own stated readiness, not merely optimistic.
- Per-unit cost inputs used in the cost side should match the same offer definitions used on the revenue side, so margin per line is computable.
- Any change to a unit cost input must be traceable to a cited reason (a vendor quote, a bulk discount), not silent drift between review passes.

## What stays unfilled

The structure above is complete with every numeric cell empty. customers_won stays zero until pilot evidence exists; price stays a flagged hypothesis until a contract is signed; volume_per_customer stays a segment-dependent unknown until the first customer's real usage is observed. The skeleton carries no claim about how big any line gets.
