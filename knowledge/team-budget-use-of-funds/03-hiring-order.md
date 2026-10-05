# Hiring order: evidence-triggered sequencing, not a generic template

Scope: ordering hires against named evidence triggers (a confirmed blocker, a first signed pilot, a first SLA contract) instead of calendar time or generic "engineer first, then sales" templates.

## The sequencing principle

The yubiOS source framework sequences hiring against the same readiness-gate logic as its pricing architecture, explicitly rejecting a generic "engineer first, then sales" template. Its order:

1. **Legal counsel (contractor, not hire), first.** The trademark question and entity decision are one-time, specialized, and block revenue-bearing offers, so they go first despite producing no product.
2. **Engineering contractor or hire for the specific open readiness gate.** Whichever named blocker (real-hardware FIDO2, VM CTAP2, ARM64 board rehearsal) is the confirmed long pole once the active CI mission reports. The rule is: do not hire generically for "engineering"; hire against the named blocker.
3. **First customer-facing hire, triggered by the first signed paid pilot.** As of the draft, no pilot existed, so the trigger had not fired and the role was not staffed.
4. **Support hire, triggered by the first SLA contract actually selling.**

## Evidence from the wider startup literature

The trigger-first pattern is well supported by practitioner sources:

- Y Combinator's essential startup advice collection is its most-authoritative statement of early-stage operating priorities (https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice, weight 0.853), and YC's library frames first hiring as a distinct stage problem rather than a growth template (https://www.ycombinator.com/library/4H-how-to-hire-your-first-engineer, weight 0.781): "at this stage traditional recruiting methods, e.g. hiring a recruiter, won't work as well for you as they do for larger companies." The first hire is a founder-effort problem, not a process problem.
- YC's equity guidance encodes the same "order matters" intuition on the compensation side: the first employee should get more equity than the 20th, who gets more than the 100th, and startups traditionally set aside 10% to 20% of equity for employee incentives (https://www.ycombinator.com/library/9j-how-much-equity-should-i-give-my-first-employees, weight 0.743). A hiring order that ignores equity sequencing produces comp misalignment that is expensive to fix later.
- Stripe's founder guide to first hires treats the decision as "what founders need to know about making hiring decisions" rather than a checklist of roles (https://stripe.com/resources/more/how-to-hire-the-first-employees-for-your-startup-a-guide-for-founders, weight 0.622).
- SaaStr describes the transition from founder-led sales to a commissioned sales team as "a pivotal moment in scaling your business," with alignment maintained by regular check-ins with the sales leader on progress, challenges, and opportunities (https://www.saastr.com/what-are-the-best-ways-to-transition-from-the-founder-led-sales-stage/, weight 0.602). This matches the yubiOS trigger: the customer-facing hire comes when sales motion exists to transition, not before.

## Weak-backing support for trigger-based hiring

Several practitioner sources articulate the trigger logic directly with sub-0.5 weights:

- "The first startup hires should remove a proven constraint, not make the company chart look complete. Before opening a role, define the result the business cannot reliably produce, why hiring is the right intervention, and what evidence..." (https://www.100tasks.com/blog/hiring-strategy-for-startups, weight 0.141). This is a near-verbatim restatement of the "hire against the named blocker" rule.
- Hire when "customers are willing to pay for what the new hire will deliver," which can make the hire close to revenue-neutral from day 1; and if capital was raised with a budget that explicitly includes first hires, "the clock is ticking" on investor expectations (https://valueaddvc.com/blog/when-to-hire-first-employee, weight 0.325). The second half is a caveat for funded ventures: an envelope that names hires creates its own triggers.
- 2026 seed-stage sequencing guidance argues founders are "hiring leaner and later than the 2021 playbook," with the founding engineer as hire 1 in sales-led and regulated domains (https://hub.causo.ai/guides/founding-team-first-hires-2026, weight 0.265), and a first-10-hires ordering with a "why now" trigger per role (https://hub.causo.ai/guides/first-10-hires-seed, weight 0.322).

## Why calendar-based ordering fails

A calendar ordering (hire support in month 4, sales in month 6) allocates spend against conditions that have not occurred. The trigger table in the source framework replaces dates with conditions:

- Legal contractor: immediate (front-loaded item, no evidence gate needed).
- Engineering hire or contractor: the specific blocker entry is the confirmed long pole after the active mission reports.
- First customer-facing hire: first signed paid pilot.
- Support hire: first SLA contract signed.
- Additional engineering beyond gate-closing: second and subsequent paid pilots requiring integration scope beyond what a contractor covers.

Each condition is observable and falsifiable. A hire made before its condition fires is, under this framework, an allocation error, not a conservative choice.

## Takeaway

Sequence hires the same way the budget is allocated: by what unblocks revenue next. Name the blocker or the signing event, hire against it, and leave every role without a fired trigger unstaffed, regardless of what month it is.
