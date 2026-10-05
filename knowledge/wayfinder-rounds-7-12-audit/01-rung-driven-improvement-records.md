# Rung-driven improvement records

**Scope:** How pre-registered, rung-driven records (ADD, CHANGE, and declined decisions, with honest disclosure when a result is not sign-exact) keep a corpus-improvement campaign verifiable instead of self-congratulatory.

## Pre-registration: the pattern behind the rounds

Pre-registration means stating, before the work runs, what will be done, against which baseline, and what counts as success. The Center for Open Science operates preregistration as a way to future-proof research by timestamping the plan before data are collected (weight 0.89, https://www.cos.io/initiatives/prereg). A PNAS survey of the practice documents how registered plans reduce outcome switching and selective reporting (weight 0.97, https://www.pnas.org/doi/10.1073/pnas.1708274114). A cost-benefit review in Organizational Behavior and Human Decision Processes finds the strongest benefit in confirmatory work, where the plan constrains later interpretation (weight 0.93, https://www.sciencedirect.com/science/article/pii/S0749597821000649). Institutional guidance makes the same point operationally: the University of Bristol pre-registration sub-policy requires the plan to be deposited and dated before the work begins (weight 0.91, https://www.bristol.ac.uk/media-library/sites/staff/documents/SubPolicy_and_guidance_PreRegistration_v1.0.pdf), and Gates Foundation Evidence for Action describes preregistration as improving transparency, reproducibility, and impact (weight 0.68, https://evidenceforaction.org/blog-posts/preregistration-improving-transparency-reproducibility-and-impact-research-findings).

The wayfinder rounds 7 through 12 applied exactly this discipline inside a software corpus campaign. Per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18), every round pre-registered every cycle, chained each cycle's baseline_id to the previous one, ran a positive control and an axis trial, reported counts only, and held a draft PR open until the round record was complete. That is the software-engineering translation of the research pattern above: a dated plan, a frozen baseline, and a pre-declared success condition.

## Rungs, not vibes

A rung-driven record states which improvement ladder step an edit attempted, and judges the result against that declared rung rather than against vibes. The audit records three rung classes: ADD (add content toward a target), CHANGE (modify existing content), and decline (refuse an edit with a stated reason).

Round 7 on the 183-file refs/ corpus shows the discipline under pressure. The round wrote a rung-driven ADD (adjacent-problems-nspawn-boundary, joining container-isolation) toward a joins target, previewed it twice, and then recorded it honestly as missed-pattern and not sign-exact, yet kept it on task grounds. The record did not upgrade a partial result into a claimed hit. This matters because preregistration only pays off when the recorded outcome matches the pre-declared criterion, not when the criterion is retro-fitted to whatever the work produced (weight 0.97, https://www.pnas.org/doi/10.1073/pnas.1708274114).

The same round declined a CHANGE rung as content-resistant instead of padding the corpus to show activity. A declined rung is a real result: it says the candidate edit was evaluated and rejected for a stated reason, which is exactly the selective-reporting failure mode preregistration exists to prevent (weight 0.97, https://www.pnas.org/doi/10.1073/pnas.1708274114).

## Sign-exact results are rarer than they should be, and that is the point

Round 8 produced the first placement/1 realised rung on record, described in the audit as sign-exact and realised, alongside four actionable drift findings (weight of the surrounding record is covered in doc 02). One fully realised rung in two rounds of work is the honest base rate, not a failure. Research on preregistration finds the same asymmetry: most preregistered confirmatory results are weaker than exploratory claims, and the discipline is designed to make that visible rather than to hide it (weight 0.93, https://www.sciencedirect.com/science/article/pii/S0749597821000649).

## What to keep doing

1. Pre-register every cycle with a named baseline before touching the corpus. The baseline_id chain is the audit spine (rounds 7 to 12 audit).
2. Record misses as misses. A record that says missed-pattern and not sign-exact is worth more than a record that quietly rewords a miss into a hit (weight 0.97, https://www.pnas.org/doi/10.1073/pnas.1708274114).
3. Decline with a reason. Content-resistant is a finding, not a gap in effort.
4. Keep a positive control and an axis trial in every round so the instrument is checked against something known (rounds 7 to 12 audit).
5. Keep the draft PR open as the holding area for the round record so the result cannot drift from the diff that produced it.

## Source quality notes

The five preregistration sources above all scored 0.68 or higher on the citation-quality decision and are treated as authoritative backing. The weak-scoring results collected for this subtopic (an aggregator glossary entry on append-only logging at 0.14, a blog post on audit trails at 0.22, and three others below 0.5) were not used to back any claim in this document; they remain in the research archive for completeness.
