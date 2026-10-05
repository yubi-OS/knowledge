# 01: Paid Pilot Design as the Willingness-to-Pay Instrument
Scope: Designing a small paid pilot (25 to 50 nodes on disposable or non-critical systems) as the willingness-to-pay instrument: node count bounds, system class, customer selection, and why unpaid pilots fail as WTP evidence.

## The pilot is a payment behavior test, not a demo

A paid pilot is the mid-ladder experiment in early-stage B2B validation. One practitioner taxonomy lists five experiments that produce payment behavior rather than opinion: the pre-sell, the concierge method, the fake door, the paid pilot, and the crowdfunding campaign (volumetree.com/2026/03/16/startup-idea-validation-will-customers-pay, w=0.25, weak backing). The paid pilot sits above opinion-gathering methods because the buyer allocates budget. A pilot without a conversion clause is described as "a free trial with paperwork"; the same source argues three signed paid pilots is a validated B2B SaaS idea by any reasonable standard (painpointmap.com/blog/b2b-saas-idea-validation, w=0.20, weak backing).

The distinction matters for evidence quality. In enterprise software sales, a free trial does not automatically move a client closer to purchase, and demanding a paid pilot from the outset can add friction; the two instruments serve different trust levels (startuphub.today/en/editorial/3407/free-trial-vs-paid-pilot-when-to-offer-each-in-b2b-sales, w=0.23, weak backing). The choice of instrument should track deal complexity: pilots, free trials, and paid proofs of concept signal different things about complexity, trust, onboarding cost, and the strength of the buying signal (tracsio.com/articles/pilot-vs-free-trial-vs-paid-poc-b2b-saas, w=0.22, weak backing).

## Node count: bound the blast radius

The yubiOS days-61-90 plan sets the pilot at 25 to 50 nodes on disposable or non-critical systems, small enough to bound support load and the blast radius of a bad rollback (session source doc days-61-90-willingness-to-pay-2026-07-25, internal). Practitioner guidance converges on the same shape: define success criteria in writing, control scope, prepare procurement early, and pre-agree the conversion path, all before the pilot starts (abovea.tech/insights-strategies/how-to-structure-paid-pilot-startup/, w=0.29, weak backing). A pilot that scales past the support capacity of a small team destroys the very metrics it was meant to produce, so node count is a measurement decision, not just a commercial one.

## System class: disposable only

Constraining the first paid engagement to disposable or non-critical systems keeps it inside a failure-tolerant boundary while real-world evidence accumulates (session source doc, internal). This is the same discipline practitioners apply when they scope a pilot away from production: the pilot must be allowed to fail without customer-visible damage, because recovery behavior under failure is itself one of the measurements.

## Customer selection: the recruited design partner only

The days-31-60 phase recruits a design partner; the pilot runs with that partner, not with a new unvetted customer (session source doc, internal). This mirrors the general validation sequence in which interviews and prototypes precede commitments and paid pilots (100tasks.com/blog/customer-validation, w=0.35, weak backing). Running the first paid engagement with a partner already familiar with the product isolates the variable under test, willingness to pay at an agreed price, from variables not yet tested, such as cold-onboarding a stranger.

## Conversion rate as the primary readout

Track the paid pilot conversion rate separately from everything else. One operator reports a healthy early-stage B2B rate above 60 percent, with 3 of 5 paid pilots converting to annual contracts cited as real evidence of willingness to pay and a repeatable sales motion, worth more than a hundred free trial sign-ups (startupcorners.com/blog/how-to-run-a-paid-pilot-to-validate-b2b-willingness-to-pay, w=0.33, weak backing). The number itself is operator-reported and weakly backed; the structural point, that pilot-to-contract conversion is the WTP readout, is the load-bearing claim.

## What the pilot must not be

The pilot must be priced. If no price exists by the pilot start date, that is a blocking gap, not a reason to run it unpaid (session source doc, internal). Pricing structure, conversion mechanics, and the commercial path are covered in docs 05 and 03 of this corpus.

## Evidence standard for this doc

All external claims in this doc carry weak backing (jev weight below 0.5): the sources are practitioner blogs, not primary research. The internal claims come from the yubiOS days-61-90 source document. No claim here is certified by a controlled study.
