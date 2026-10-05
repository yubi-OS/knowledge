# Engineering progress versus product-market fit: separating the two evidence classes

Scope: separating evidence of engineering progress (code, CI, docs) from evidence of product-market fit (customers, pilots, committed pricing), and why the two are routinely conflated in early-stage claims.

## The two classes are different kinds of evidence

Engineering progress and product-market fit are both "progress," but they are different evidence classes with different verification methods. Engineering evidence is inspectable: repositories, CI runs, test results, published artifacts. Market-fit evidence is behavioral: someone outside the team committed time or money to the product. The yubiOS current-position snapshot (OMN-68, 2026-07-25) exists precisely to draw this line for its downstream business documents, and its finding is stark: the engineering column is full, the market-fit column is empty. As of that date the repo recorded zero customer discovery interviews, zero design partners, zero paid pilots, and zero priced, signed statements of work. Its pricing work (OMN-71/OMN-84) supplies hypotheses and templates, not committed prices with a real customer.

The conflation happens because both classes produce documents. A pilot design is a document; a paid pilot is an event. A pricing architecture is a document; a signed SOW is an event. The discipline is to ask of every artifact: does anything outside the team change state because this exists?

## What the research says about the hierarchy

An empirical study published in MDPI's Computers journal found no clear relationship between the number of validation events and startup performance; instead, stronger-performing startups tended to reach higher levels of evidence, particularly securing contingent investment commitments or paying customers before full MVP development (https://www.mdpi.com/2073-431X/15/8/535, weight 0.74, primary). Read carefully, this says more validation activity is not the point; reaching higher evidence levels is. A demo day pitch and a paying customer are both "events," but they are different levels.

Practitioner material makes the same distinction with lower rigor. One investor-oriented breakdown argues LOIs, pilots, usage, and revenue retire different investor risks, and the strongest traction artifact is the one you can defend (https://roundos.ai/blog/pricing-and-traction/lois-pilots-revenue-what-investors-actually-rank, weight 0.37, weak). A glossary entry lists revenue-generating traction measures (MRR, growth rate, net revenue retention, CAC payback) as the class investors actually track (https://www.pitchvault.ai/glossary/traction, weight 0.43, weak). A guide distinguishing pilots from other early agreements (https://startupfundraising.com/guides/traction, weight 0.32, weak) covers similar ground. All of these are weakly backed by this corpus's weighting and should be read as directional, not authoritative.

## The specific failure mode: engineering-led growth as a substitute for validation

The most common conflation in technical projects is treating engineering velocity as market evidence. A practitioner essay on engineering-led growth argues that experiment-driven engineering obsession "isn't useful, and can often be actively harmful" for the vast majority of early-stage founders, and only works for bottoms-up SaaS once the product has reached significant scale (https://www.davidlpeterson.com/the-problem-with-engineering-led-growth-for-early-stage-startups/, weight 0.13, weak). The yubiOS snapshot embodies the corrective: it explicitly states that "commercial validation (someone will pay, at this price, for this problem) does not yet exist in any form" even while its CI pipeline retires named blockers with numbered runs.

Another framing that recurs in weakly-backed practitioner sources: revenue is the most direct proof of value exchange, and grant funding or technical milestones are not proxies for market demand (https://timhaydenclark.substack.com/p/commercial-validation-interpreting, weight 0.16, weak). The same source notes investors look for credible distribution models and demonstrated customer learning, not industry credentials alone (https://launchhawk.substack.com/p/the-evidence-gap-in-early-stage-startup, weight 0.17, weak).

## Operating rule for downstream documents

The rule the yubiOS snapshot encodes, and which this corpus endorses: every business document inherits the same boundary rather than drawing its own. Concretely:

1. Engineering claims may cite named CI runs, published artifacts, and ADRs, with dates.
2. Market claims may only cite events: an interview held, a design partner signed, a pilot paid for, an SOW executed. Plans for these are not evidence of them.
3. When a document needs to state the market-fit status, it states it as a zero-count until the count changes, in the same words every time.

A practical playbook source puts the market-fit end of this in process terms: product-market fit is not a one-time milestone but a continuous cycle of learning, measuring, and adapting (https://startupwren.com/how-early-stage-startups-find-product-market-fit-a-practical-playbook/, weight 0.15, weak). An investor-priorities piece asks directly what investors weigh between technical milestones and revenue traction (https://www.joincapitalcatalyst.com/blog/revenue-traction-vs-technical-validation-investor-priorities, weight 0.12, weak). The weak weighting across most of this subtopic's sources is itself a finding: the general web has abundant opinion on this distinction and little primary evidence, which is another reason each project must generate its own market evidence rather than citing category commentary.
