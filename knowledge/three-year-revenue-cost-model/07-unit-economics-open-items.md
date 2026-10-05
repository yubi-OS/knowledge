# Unit economics and acquisition metrics that stay open until the first pilot

**Scope:** CAC, payback, LTV, and the LTV/CAC ratio: what each metric needs as data, and why all four remain open items until a first pilot cycle completes.

## The four core metrics

Practitioner guidance for startup unit economics centers on four key metrics: customer acquisition cost (CAC), lifetime value (LTV), CAC payback period, and the LTV/CAC ratio, which work together to describe the economics of a single customer relationship (https://kruzeconsulting.com/blog/unit-economics/, jev weight 0.42, weak backing). All four are defined the same way regardless of venture stage:

- **CAC** is the cost it takes to acquire a new customer (https://online.hbs.edu/blog/post/ltv-cac, jev weight 0.48, weak backing).
- **LTV** is the value a customer delivers over the time they remain a customer. A worked example in the same source computes it as average revenue multiplied by a customer-lifetime factor: $115 times 3 gives $345 of lifetime value (https://online.hbs.edu/blog/post/ltv-cac, jev weight 0.48, weak backing).
- **CAC payback period** is how long acquisition spending takes to recover (https://kruzeconsulting.com/blog/unit-economics/, jev weight 0.42, weak backing).
- **LTV/CAC ratio** compares the two (same source).

## Why every one of them is an open item pre-pilot

Each metric requires a data source that does not exist before a first completed pilot cycle:

| Metric | Minimum data required | Status before first pilot |
|---|---|---|
| CAC | Actual spend to convert at least one customer | No acquisition spend has produced a customer |
| LTV | Observed retention over time, or a defensible lifetime factor | Zero customers, so zero retention observations |
| CAC payback | Actual revenue timing from a paying customer | No paying customer |
| LTV/CAC ratio | Both of the above | Both empty |

The worked LTV example above illustrates the trap: the lifetime factor (the multiplier 3) is only defensible once real retention data exists. Substituting an industry average pre-pilot produces a number that looks rigorous and carries no evidence.

## The right structural treatment

In the model skeleton, unit economics are not a section with placeholder numbers; they are derived outputs. CAC derives from actual pilot-cycle spend divided by customers won. LTV derives from observed contract duration and price. Payback derives from the revenue timing of the first paying customers. Because they are outputs, their cells stay empty by construction until their inputs exist, which is exactly the empty-cell discipline of doc 01 applied to derived metrics.

What can be written today is the wiring:

- Each offer defines what counts as one "unit" (a customer, a device, a contract).
- Each offer lists which acquisition costs count toward its CAC.
- Each offer states the retention observation that would fill its LTV factor.

## The re-run trigger

Unit economics become computable after the first pilot cycle completes and real acquisition-cost and retention data exist. At that point the unfilled cells fill from observation, not estimation, and the LTV/CAC ratio becomes meaningful for the first time. Until then, the honest state of these metrics is: defined, wired, and unfilled.
