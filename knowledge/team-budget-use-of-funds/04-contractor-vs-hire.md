# Contractor-first vs hire: episodic work contracts, ownership-critical work hires

Scope: the decision rule separating contractor-first roles (episodic, specialized, gate-bound) from permanent hires (continuous ownership of revenue-critical systems), and why trust-chain work resists rotation.

## The decision rule

The yubiOS source framework divides roles into two classes:

- **Contractor-first**: roles that do not need a full-time hire before revenue exists to support one. Legal work (trademark, entity formation, contract review) is inherently episodic; a counsel relationship fits better than a hire at this stage. Specific engineering gates (for example an ARM64 board bring-up specialist for the fTPM and OP-TEE stack) are scoped, evidence-target-bound work suited to an engagement tied to closing one named blocker rather than an open-ended hire. Training delivery can be contracted per cohort rather than staffed permanently until cohort volume justifies it.
- **Hire-first**: anything touching the trust chain's ongoing maintenance (Secure Boot signing infrastructure, LUKS2 and FIDO2 code). The project's ownership model states that power belongs to the owner, not the OEM, not the SoC vendor, and not an outsourced party, which argues for keeping trust-chain code ownership continuous and accountable. That continuity fits a hire, not rotating contractors, once past the initial gate-closing work.

The general rule: **contract when the work has an end condition; hire when the work is a permanent accountability.**

## What a contractor is, precisely

Institutional practice defines the boundary carefully. The United Nations Development Programme distinguishes two categories: Consultants "provide advice to the organization as a recognized authority or specialist in their field of expertise, for example by helping to complete a report," while Individual Contractors "provide skills or expertise to assist the organization in fulfilling a short-term task or project" (https://www.undp.org/careers/types-of-opportunities/consultants-individual-contractors, weight 0.559). Both categories are bounded engagements; neither is a standing role. This is the definition the contractor-first pattern relies on: an engagement with a deliverable and an end, not a shadow employee.

## Weak-backing practitioner context

Practitioner material on the tradeoffs carries weaker source weight but matches the framework's logic:

- A startup-focused employee-vs-contractor guide frames the decision as "the real tradeoffs founders face and what makes sense at each stage" (https://mercury.com/blog/employee-vs-independent-contractor-startups, weight 0.370), with stage-dependence as the core variable, which is the same as the framework's revenue-exists-or-not split.
- Hiring-before-product-market-fit advice argues for hiring against demonstrated constraints rather than anticipated org charts (https://artanis.substack.com/p/hiring-before-product-market-fit, weight 0.364).
- Specialist marketplace material supports contracting for scoped, expert work (https://www.toptal.com/management-consultants/startup-consultants, weight 0.234).
- Cost-comparison material on contractors versus employees (https://employeevscontractor.com/employee-vs-contractor-guide, weight 0.220; https://www.employeecostcalculator.com/blog/employee-vs-contractor-cost-comparison, weight 0.114) and classification guidance (https://www.hireinsouth.com/post/independent-contractor-vs-employee, weight 0.104; https://lathire.com/independent-contractor-vs-employee/, weight 0.261) consistently note that misclassification carries legal risk, which is one more reason the episodic/legal class of work should go to an actual counsel engagement rather than an informal arrangement.

None of these carry load-bearing weight in this corpus; they are labeled as weak backing.

## Why ownership-critical code resists contractors

Three properties distinguish trust-chain maintenance from gate-closing work:

1. **Continuity of accountability.** A signing key, a measured-boot chain, or disk-unlock code accrues context and liability continuously. An engagement with an end date transfers accountability nowhere; the code outlives the contract.
2. **Incentive alignment.** A contractor paid to close one gate optimizes for closing the gate. The ongoing question ("is this still secure next quarter?") has no owner in a rotation.
3. **Knowledge concentration.** Trust-chain bugs surface far from their causes. A continuous owner accumulates the debugging history that makes that distance tractable.

The framework's answer is a sequencing rule, not an absolute ban: contractors are correct for closing the initial named gates (board bring-up, CI emulator work, FIDO2 test infrastructure), and the maintenance responsibility converts to a hire once the initial gate-closing work is past.

## Takeaway

Classify each role by whether its work has an end condition. Episodic and gate-bound work (legal, specific board bring-up, per-cohort training) contracts. Continuous, accountability-bearing work (trust-chain maintenance) hires. The trigger for converting is the completion of the gate-closing engagement, not the calendar.
