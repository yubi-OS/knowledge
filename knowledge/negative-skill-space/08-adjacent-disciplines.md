# 08 Adjacent Disciplines: What Gap-Mapping Borrows and Where It Differs

Scope: Prior-art disciplines adjacent to negative-skill-space: FMEA, pre-mortems, red teaming, adversarial review, and design-by-contract, and how they differ.

## Why the prior art matters

Negative-skill-space did not invent "enumerate what can go wrong before it does." It recombines instruments that reliability engineering, decision psychology, and security practice have refined for decades. Knowing which discipline each axis borrows from matters for calibration: it tells the mapper when to reach for a heavier formal method and when the lightweight sweep is enough.

## FMEA: the formal ancestor of the failure-modes axis

Failure mode and effects analysis is the closest formal relative of axes 7 through 9. ASQ describes FMEA as a systematic, step-by-step approach to identifying and prioritizing possible failures in a design, manufacturing, or assembly process, developed by the U.S. military in the 1940s (https://asq.org/quality-resources/fmea, weight 0.43, weak backing). IBM's current overview defines it as a structured failure mitigation framework that identifies all possible failures for the components of a design and their effects (https://www.ibm.com/think/topics/fmea, weight 0.87). Reliability engineering treats it as core practice, using inductive forward logic to analyze single points of failure (https://en.wikipedia.org/wiki/Failure_mode_and_effects_analysis, weight 0.20, weak backing). The method is standardized: IEC 60812:2018 governs its scope, planning, performance, documentation, and maintenance (https://www.learnleansigma.com/guides/fmea/, weight 0.52). Practitioner guides describe its shape: a structured, proactive walk over every conceivable failure in a product, process, design, or service, scored for severity, occurrence, and detectability (https://reliability.com/root-cause-analysis/fmea-guide/, weight 0.63; https://quality-one.com/fmea/, weight 0.34, weak backing).

Software FMEA is the direct bridge: NASA's software safety handbook describes SFMEA as identifying key software fault modes for data and software actions and analyzing the effects of abnormalities on other components and the system (https://swehb.nasa.gov/spaces/SWEHBVD/pages/102695706/8.05+-+SW+Failure+Modes+and+Effects+Analysis, weight 0.83).

**The difference.** FMEA enumerates failures of components in a design; negative-skill-space maps absences of concern in an artifact. FMEA asks "if this part fails, what happens?"; axis 7 asks "what failure does this artifact not even contemplate?" FMEA is component-driven and exhaustive by intent; the 12-axis sweep is question-driven and explicitly not exhaustive. FMEA's severity-occurrence-detection scoring is finer-grained than the framework's likelihood-times-severity, and the framework would adopt the detection dimension only when artifacts are instrumented enough to measure it.

## Pre-mortem: the generator the sweep cannot replace

Gary Klein's pre-mortem, published in 2007, asks a team to assume the project has already failed and generate the reasons (https://www.gary-klein.com/premortem, weight 0.59; https://www.theuncertaintyproject.org/tools/pre-mortem, weight 0.52). It runs in 20 to 30 minutes and its appeal is that it works as a risk assessment method (https://www.psychologytoday.com/us/blog/seeing-what-others-dont/202101/the-pre-mortem-method, weight 0.78). A practitioner discussion explicitly contrasts pre-mortem with red teaming as different instruments for different moments (https://www.youtube.com/watch?v=MxF5R4B_t64, weight 0.21, weak backing).

**The difference.** The pre-mortem is divergent and narrative: it generates failure hypotheses from an imagined end state. The 12-axis sweep is convergent and structural: it interrogates a fixed question list. The framework uses both, sweep first for coverage, pre-mortem for what the axes miss (doc 04).

## Red teaming and adversarial review: the external mirror

Red teaming applies an adversarial mindset to a plan or system before an adversary does. Applied to AI-assisted work, the framing is pointed: most assistants are trained to validate your ideas, and a red-team pass flips that by stress-testing the plan for failure (https://github.com/thegarrisoncollective/red-team, weight 0.60). Security red teaming pressure-tests how an organization holds up against realistic adversaries (https://www.resillion.com/solutions/cyber-security-services/cyber-security-consulting-and-testing-services/red, weight 0.14, weak backing), and for AI systems, adversarial red-teaming uses simulated malicious actors and diverse methodologies, including automated prompt attacks and multi-agent frameworks, to reveal safety failures (https://www.emergentmind.com/topics/adversarial-red-teaming, weight 0.31, weak backing). Research on AI-generated research quality asks which adversarial review methods are most effective at detecting shallow reasoning (https://davidamitchell.github.io/Research/research/2026-05-02-adversarial-review-methods-ai-research-quality.h, weight 0.48, weak backing).

**The difference.** Red teaming attacks the artifact from outside, modeling an adversary; negative-skill-space maps the artifact from inside, modeling absence. They are complementary and the framework's same-blind-spot mitigation (doc 06) is effectively a recommendation to add a red-team pass for high-stakes artifacts: a differently-situated reviewer hunting for what the author could not see.

## Design by contract: the assumption axis formalized

Design by contract prescribes that software components interact on formally specified preconditions, postconditions, and invariants (https://en.wikipedia.org/wiki/Design_by_contract, weight 0.23, weak backing). The teaching literature makes the operational point that preconditions are the caller's responsibility and must be documented so they do not slip through the cracks (https://cseweb.ucsd.edu/classes/sp06/cse111/lectures/Lecture%2013%20Programming%20by%20Contract.pdf, weight 0.70), and the practitioner literature separates caller-side input validation from callee-side contract checks (https://enterprisecraftsmanship.com/posts/code-contracts-vs-input-validation/, weight 0.41, weak backing).

**The difference.** DbC is executable: contracts are checked at runtime by the system. Axis 5's assumption sweep is documentary: it makes preconditions visible so a human or agent can check them, with no enforcement mechanism. The framework's gap here is acknowledged implicitly in its calibration axis; there is no machine check that an artifact's stated preconditions hold at invocation time.

## Risk matrices: the scoring grammar

The likelihood-times-severity product that gap triage uses is borrowed directly from risk assessment, where a risk matrix defines risk level by combining likelihood categories with consequence severity (https://en.wikipedia.org/wiki/Risk_matrix, weight 0.52), commonly on 3x3 to 5x5 grids (https://asana.com/resources/risk-matrix-template, weight 0.16, weak backing).

**The difference.** Risk matrices score hazards against a scale of harm to something measurable. Gap triage scores absences, where severity is judged counterfactually (how bad is the failure that never happened yet). The counterfactual judgment is the weakest link in the borrowed grammar, and the framework compensates with its evidence-per-gap validation requirement (doc 06).

## Where the framework is genuinely new

The synthesis the prior art does not contain: a fixed, portable 12-axis sweep applied to skills and documents rather than designs or projects; the extend/pair/accept disposition applied to absences rather than risks; and mandatory bounded recursion, where the method maps itself once and stops. FMEA, pre-mortems, red teaming, and DbC each cover a slice; none of them treats "what the artifact does not do" as the primary object of study, and none of them applies its own instrument to itself as a required step.
