# Cost driver taxonomy for an early-stage venture

**Scope:** Variable unit costs per offer (hardware, support labor, infrastructure) versus fixed costs (legal, engineering, compliance), with front-loaded cost treatment.

## The two families

Costs divide into fixed and variable families, and the distinction drives budgeting and investment decisions because the families behave differently as volume changes (https://corporatefinanceinstitute.com/resources/accounting/fixed-and-variable-costs/, jev weight 0.69, authoritative backing). For an early-stage venture model, the practical split is:

- **Fixed costs:** engineering payroll, legal work, entity formation and compliance overhead. These accrue on a schedule and are insensitive to how many customers exist.
- **Variable (unit) costs:** hardware per device, support labor per contract, infrastructure per build. These accrue only when a deliverable is produced.

Mixing the families is a real failure mode: fixed and variable startup costs work differently, and confusing them damages both pricing and budgeting (https://www.businesssupervisor.com/fixed-vs-variable-startup-costs/, jev weight 0.48, weak backing).

## Hardware unit costs: the BOM discipline

For hardware-bearing offers, the unit cost input is built from a costed Bill of Materials. Manufacturing cost is the cost of materials and labor required to make the product, and building it requires a detailed costed BOM made up of components and modules (https://frame.work/blog/calculating-the-full-cost-of-a-hardware-product, jev weight 0.61, authoritative backing).

A hardware financial model differs structurally from a software one because the product has long lead times, complex supply chains, and significant upfront cash requirements, and the work of turning a prototype BOM into a reliable model is its own exercise (https://www.glencoyne.com/guides/deeptech-hardware-financial-model, jev weight 0.54, authoritative backing).

For cost-down modeling, per-unit cost of goods splits into three buckets: the Bill of Materials, assembly labor, and landed costs, projected at volume milestones such as 1,000, 10,000, and 100,000 units (https://www.glencoyne.com/guides/hardware-cost-reduction-investors, jev weight 0.37, weak backing). This is the structure behind any assumption that a hardware unit cost will fall: a unit-cost input anchored at one volume is not comparable to revenue assumed at a different volume.

## Front-loaded costs

Legal and entity-formation spending is typically front-loaded: it lands early regardless of whether any revenue follows. In a structural model this belongs in fixed costs with an explicit time profile, not spread evenly. The implication for an unfilled model is that the legal cost line needs two separate inputs: the amount and the timing.

## Anchoring and drift

The one discipline that keeps a unit-cost input honest over a multi-year horizon: once a unit cost is anchored to a real number (a vendor quote, an invoice, a published price), later model revisions must not move it without a specific, cited reason such as a bulk discount or a different device specification. Silent drift between review passes is how a model becomes unfalsifiable without anyone deciding to make it so.

## What a structural cost side looks like with no numbers

```
Cost(year) = fixed_costs(year) + sum over offers of:
  (customers_won(offer, year) x volume_per_customer(offer) x unit_cost(offer))
```

Every term is a named input cell. Fixed costs carry a schedule and an amount, both unfilled. Each offer's unit cost carries its cost family (hardware BOM, labor, infrastructure) and its volume-milestone assumptions, both unfilled. The structure is complete; the numbers wait for evidence.
