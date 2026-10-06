# The Deprecation Decision: Five Questions Before You Remove Anything

Scope: the skill's 5-question decision framework that gates every deprecation, plus the external evidence on what maintaining a legacy system actually costs when you choose not to deprecate (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "The Deprecation Decision").

## The five questions

The source doc requires five answers before any deprecation proceeds:

1. Does this system still provide unique value? If yes, maintain it. If no, proceed.
2. How many users or consumers depend on it? This quantifies the migration scope.
3. Does a replacement exist? If no, build the replacement first. The skill is explicit: don't deprecate without an alternative.
4. What is the migration cost for each consumer? If trivially automated, do it. If manual and high-effort, weigh it against the maintenance cost of keeping the old system.
5. What is the ongoing maintenance cost of NOT deprecating? The source doc names 3 components here: security risk, engineer time, and the opportunity cost of complexity.

The ordering matters. Question 1 is a gate: a system that still provides unique value should be maintained, not deprecated, no matter how ugly it is. Question 2 sizes the effort. Questions 3 and 4 determine whether the migration is a tooling problem or a program. Question 5 is the comparison baseline that makes the whole exercise honest.

## What not deprecating actually costs

The source doc asserts that maintenance cost grows silently. Industry writing on legacy systems corroborates the categories, though with varying authority. Retaining legacy systems entails multiple risks including non-compliance, high maintenance costs, and security vulnerabilities (https://dxc.com/insights/knowledge-base/blogs/decommissioning-legacy-systems, jev weight 0.28, weak backing). A seven-phase decommissioning framework built around assessment, archiving, validation, shutdown, and governance exists precisely because these risks accumulate (https://www.archondatastore.com/blog/decommissioning-legacy-systems/, jev weight 0.18, weak backing). A CTO-level playbook for decommissioning covers risk analysis, data migration, compliance, and post-mortem ROI tracking, which maps onto questions 2 and 5 of the source doc's framework (https://softwaremodernizationservices.com/insights/legacy-system-decommissioning-plan/, jev weight 0.13, weak backing).

Quantified claims exist but all carry weak backing in this corpus's dig record: one TCO guide claims legacy systems cost $150K or more annually to maintain (https://tkxel.com/blog/legacy-system-modernization-cost-tco-guide/, jev weight 0.12, weak backing); a cost-comparison page claims businesses spend 60-80% of IT budgets on legacy systems (https://ctox.com/legacy-modernization-vs-replacement-cost-comparison/, jev weight 0.12, weak backing); and another recommends comparing maintain-versus-replace over a 3 to 5 year horizon, factoring ongoing support on one side and upfront modernization investment plus future operating costs on the other (https://ncube.com/cost-of-maintaining-legacy-systems, jev weight 0.12, weak backing). None of these figures should be quoted as fact; they illustrate the shape of the comparison the skill's question 5 demands.

## Migration cost versus maintenance cost

Question 4 and question 5 are two sides of one comparison, and the source doc's rationalizations table states the rule of thumb: compare migration cost to ongoing maintenance cost over 2 to 3 years; migration is usually cheaper long-term. The skill deliberately frames this as a per-consumer calculation, not a global one. A deprecation with 5 automated migrations is different in kind from one with 200 manual migrations, even if the deprecated system is identical.

The practical reading:

- If migration is trivially automatable (a codemod, a config rename), the decision collapses: do it.
- If migration is manual and high-effort, the old system's annual maintenance cost must exceed the amortized migration cost before deprecation wins. The weak-backed industry figures above are consistent with this reading but do not establish it.
- If there is no replacement, questions 3 and 4 merge: the "migration cost" includes building the replacement, proving it in production, and documenting it. The source doc's migration process (step 1: build the replacement) covers this.

## Where the framework connects

This framework feeds directly into the advisory-versus-compulsory classification (see 03-advisory-vs-compulsory.md): the size and cost of the consumer base you measured in question 2 is what determines whether you can afford advisory deprecation or must force a deadline. It also feeds the zombie-code discipline (see 07-zombie-code.md): a system with no owner and active consumers has already failed question 1, because an unmaintained system cannot be argued to provide unique value safely.

Gaps recorded for this subtopic: the dig record for this document is thin. The primary dig surfaced mostly dictionary definitions and vendor marketing; a targeted redo recovered the decommissioning-framework sources cited above, but no strong primary source (standards body, peer-reviewed study, or major-engineering-blog dataset) was found for the maintain-versus-migrate cost comparison. Claims grounded in the source doc are authoritative within the corpus; the cost figures above are weak-backed illustrations only.
