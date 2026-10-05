# Envelope discipline: not asserting dollar figures before funding exists

Scope: the discipline of not asserting a budget envelope before funding exists, why invented numbers are fabrication, and the weights-not-amounts framing that lets a framework survive until a real figure lands.

## The problem the discipline solves

A Year 1 budget envelope is a number. If no funding amount, runway figure, or revenue record exists anywhere in the venture's recorded memory, any envelope a planning session writes down is invented. The yubiOS source framework is explicit about this: OMN-74 asks for a Year 1 budget envelope, an allocation split, a hiring order, and hiring triggers tied to evidence, and the framework deliberately answers everything except the envelope itself until a real number arrives from funding actually raised or committed (personal capital, revenue, or a grant). Sections of the framework that do not need the number ship now; the envelope stays an open item.

This is not conservatism for its own sake. The general startup-budgeting literature converges on the same prerequisite ordering: a budget is built from realistic startup costs, revenue projections, and financial statements, and projected financial statements are described as crucial for forecasting outcomes, securing funding, and guiding strategy (https://www.score.org/startup-budget-projections/, weight 0.864). SCORE, the SBA-affiliated mentoring network, frames the sequence as "build the numbers first, fundraise with them," which is the opposite order from asserting an envelope and calling it a plan.

## Why a fabricated figure is worse than an open item

Three failure modes follow from asserting a number nobody has grounded:

1. **Downstream commitments inherit the fiction.** A hiring order triggered against a nonexistent envelope produces commitments (headcount, contracts) with no funding behind them. The evidence-trigger pattern in the source framework exists precisely so no role is hired "on calendar time" before its evidence condition fires.
2. **Investors and lenders check the math.** Funding readiness depends on detailed financial plans; investors and lenders expect them (https://ramp.com/blog/how-to-build-a-startup-budget, weight 0.648). A fabricated envelope collapses the moment anyone asks where its inputs came from.
3. **The plan cannot adapt.** A framework written in absolute dollar amounts needs rewriting every time the funding number changes. The source framework's answer is to write allocation logic in relative weights and priorities, applied "against" the envelope once it exists, so a changed number changes nothing structural.

## Weights, not amounts: the surviving structure

The core discipline is to separate **what spending is for** (structure, order, triggers) from **how much exists** (the envelope, which is a fact about the world, not about the plan). Structure is decidable now:

- Ordered categories with relative priority (highest to lowest), each justified by what blocks revenue or pilots.
- Event-driven cost classes: spend that activates when a named gate closes or a first contract signs, not when the calendar says so.
- Front-loaded vs steady-state classification: one-time specialized costs resolved early, not spread evenly.

Amount is deferred until a real figure lands, at which point the weights apply to it without rewriting the framework.

## What the budgeting literature does differently (and why the discipline still holds)

Established small-business guidance assumes funding context varies and builds accordingly. SCORE's startup budget and projections material centers on calculating the exact revenue required to cover costs and modeling how long it takes to get there (https://www.score.org/startup-budget-projections/, weight 0.864), which is a ratio-based approach, not a figure-asserting one. Ramp's guidance recommends setting aside 5% to 10% of the total budget as a contingency fund, explicitly "not money you plan to spend" but a safety net for unpredictable surprises (https://ramp.com/blog/how-to-build-a-startup-budget, weight 0.648). Note the shape: even the contingency advice is expressed as a percentage of whatever the total turns out to be, which is exactly the weights-not-amounts pattern.

Forbes' list of the biggest financial mistakes for early-stage startups includes running finances through a basic spreadsheet or "worse, in their heads," which becomes unmanageable as the business grows, and recommends a financial dashboard or tool (https://www.forbes.com/sites/abdoriani/2025/04/29/10-biggest-financial-mistakes-for-early-stage-startups/, weight 0.581). The same logic applies at zero funding: track what you would spend and what gates unlock spend, in a tool, even while the envelope itself is unknown.

## What unblocks the number

The envelope becomes writable when one of these lands, each of which is a fact about the world rather than an act of planning:

- A funding commitment or raise (recorded with its actual amount).
- A revenue figure from a signed offer or paid pilot.
- A grant award (see the funding-sources doc in this corpus for the landscape).

Until one of those exists, the honest budget document says so. The yubiOS framework marks its Financial sections as unfilled placeholders precisely so no session invents a number to complete them. The alternative, quietly typing a plausible figure, is the fabrication failure the framework's own doctrine rules out: never invent a fact.

## Weak-backing context

Some aggregator material echoes the same discipline but with weak source weight: bullet-pitch guidance on when not to raise capital (https://www.bulletpitch.com/resources/when-to-raise-money/when-not-to-raise-capital/, weight 0.211) and first-time-founder mistake lists (https://kedrus.io/financial-mistakes-first-time-founders/, weight 0.098) both argue premature money plans mislead, but neither is a primary source and nothing in this doc's load-bearing claims rests on them.

## Takeaway

The envelope is the last thing to write, not the first. Write the ordering, the triggers, and the cost classes now in weights; write the number only when the world provides one. Everything that survives a funding change is structure; everything else waits.
