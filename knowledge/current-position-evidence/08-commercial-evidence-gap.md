# The commercial evidence gap: what closes a zero-count validation position

Scope: the commercial validation gap (zero customer discovery interviews, design partners, paid pilots, signed statements of work) and what evidence standards close it.

## Naming the zero-count

The honest way to state an empty commercial position is to count it. The yubiOS evidence-boundary snapshot (OMN-68, 2026-07-25) counts four zeroes: zero customer discovery interviews recorded in the repo (its own 10 to 15 interview target from OMN-65 is a plan, not a completed activity), zero design partners recruited (flagged as open in both the OMN-65 and OMN-66 drafts), zero paid pilots run (OMN-67's pilot design exists only as a plan, PR #111), and zero priced, signed statements of work (OMN-71/OMN-84 supply pricing hypotheses and templates, not committed prices with a real customer). Counting, rather than adjectivizing ("early", "pre-revenue"), is what makes the statement checkable and makes progress measurable later.

## What customer discovery evidence actually is

Customer discovery is the initial and iterative process of understanding customers' situations, needs, and pain points, involving defining and prioritizing personas, applicable to both early-stage companies and established organizations entering new markets (https://entrepreneurship.hbs.edu/Documents/Session%20Summary/HBSRock-Customer-Discovery-Final.pdf, weight 0.80, primary). The evidence standard is the interview record: who was spoken to, when, what problem was stated, and what the subject does about that problem today. A guide to problem interviews, solution testing, and finding product-market fit describes the sequence (https://startupproject.org/guides/customer-discovery/, weight 0.40, weak). A practitioner guide citing CB Insights analysis reports that 42% of startups fail due to no market need and that 20 to 30 interviews surface 90 to 95% of customer needs (https://www.koji.so/docs/customer-discovery-interviews, weight 0.19, weak, secondary statistic, verify against the original CB Insights postmortem analysis before citing externally).

For the yubiOS case, the standard that would close the interview count is specific: recorded interviews with target personas (the "who pays and why" question deferred to OMN-69), logged in the repo with dates and takeaways, reaching the 10 to 15 target the project set itself.

## Design partners and paid pilots: different evidence weights

Not all commercial artifacts are equal evidence. A practitioner comparison draws the distinction this corpus endorses: a paid pilot provides the strongest evidence of commercial demand because a real buyer commits budget and tests the product in a real workflow; a proof of concept proves technical feasibility; a design partner proves that a representative customer has the problem and will help shape the solution (https://wavect.io/blog/paid-pilot-vs-poc-vs-design-partner/, weight 0.30, weak). The hierarchy follows the money: budget commitment is the part of a pilot that cannot be faked with goodwill.

An investor-oriented breakdown ranks the same artifacts by which risk they retire: LOIs, pilots, usage, and revenue retire different investor risks, and the strongest traction artifact is the one you can defend (https://roundos.ai/blog/pricing-and-traction/lois-pilots-revenue-what-investors-actually-rank, weight 0.37, weak). A traction glossary adds the revenue-stage measures investors track (MRR, customer growth rate, net revenue retention, CAC payback) (https://www.pitchvault.ai/glossary/traction, weight 0.43, weak). Both are weakly backed by this corpus's weighting and directional only.

## The evidence standard per artifact

Mapping the yubiOS gap list to closure standards:

1. Customer interviews: N recorded interviews with named personas, each with date, participant role, problem statement, and current workaround. A plan to interview is not an interview; the yubiOS snapshot makes this exact error explicit for OMN-65's target.
2. Design partners: a signed working agreement describing what the partner gets, what they commit (time, environment, feedback cadence), and an end date. The distinguishing evidence is the partner's representative fit: they must have the problem, not merely interest in the category.
3. Paid pilots: money exchanged, workflow exercised, measurements collected. A pilot design document (OMN-67, PR #111) is rung 0; the rung 1 event is the first invoice and the first measured run.
4. Signed SOWs with committed pricing: an executed statement of work referencing real prices. Pricing hypotheses and templates (OMN-71/OMN-84) are inputs to this, never substitutes for it.

## Sequencing, and the trap of skipping

The natural sequence is discovery interviews, then design partners, then unpaid feasibility proofs only where they serve the design-partner work, then paid pilots, then signed SOWs. The trap for an engineering-led project is jumping to pilots with a friendly contact before discovery validates the problem, which produces pilot data nobody can interpret (no baseline of what the customer actually needed). The MDPI study cited in the progress-versus-market-fit doc found that the number of validation events mattered less than the evidence level reached, with paying customers and contingent commitments being the levels that differentiated stronger performers (https://www.mdpi.com/2073-431X/15/8/535, weight 0.74, primary).

Until the counts move, the operational rule is the one the yubiOS snapshot enforces for every downstream document: state the zero-count, cite the plan as a plan, and let the blocker list record the moment a count stops being zero. Commercial validation is not a narrative to be drafted; it is a set of events to be logged.
