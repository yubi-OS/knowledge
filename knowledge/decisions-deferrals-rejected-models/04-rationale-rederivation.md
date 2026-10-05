# Making decisions re-derivable: rationale as the recoverable artifact

Scope: what it takes for a future engineer to reconstruct why a choice was made, years later, without asking anyone: recording context, forces, criteria, and assumptions at decision time, and the research showing rationale is the part that decays first.

## The problem: outcome survives, reasoning decays

Software engineering research on design rationale defines it as the reasoning underlying the creation and use of artifacts, and treats managing it as a first-class activity: eliciting it, recording it, indexing it for retrieval, editing it, and retrieving it for those who need it, with recorded rationale playing a valuable role in every stage of the software lifecycle (https://link.springer.com/chapter/10.1007/978-3-540-77583-6_1, jev weight 0.80). The research motivation is exactly the re-derivation problem: decisions get made, the artifacts persist, the reasoning does not unless something captures it at the time.

The same chapter exists as an openly retrievable PDF (https://link.springer.com/content/pdf/10.1007/978-3-540-77583-6_1.pdf, jev weight 0.67).

## What must be recorded for re-derivation

Nygard’s original five-part format is a re-derivation instrument: a short noun-phrase title, the context describing the forces at play, the decision stated in active voice, a status, and the consequences (https://insightful-data-lab.com/2026/02/04/architecture-decisions-rationale/, jev weight 0.32, weak backing, but consistent with the primary template at https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md, jev weight 0.90). The context section is the load-bearing one for re-derivation: it is where the constraints, pressures, and assumptions that made the choice reasonable live.

A hardware-engineering decision record guide adds the key discipline: the record should let a future engineer reconstruct the decision without pretending that today’s knowledge existed at the time, citing NASA’s description of decision analysis as evaluating alternatives against the decision-maker’s priorities and state of knowledge, and stressing the documentation of assumptions and limitations (https://www.archelps.com/blog/engineering-decision-record-template.html, jev weight 0.29, weak backing). Recording the state of knowledge is what separates a re-derivable record from a hindsight-contaminated one: the reader evaluates the choice against what was knowable then, not what is known now.

Microsoft’s guidance contributes the confidence field: sometimes an architecturally significant decision is made with relatively low confidence, and documenting that status prevents a later reader from mistaking a hedge for a certainty (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.94).

## Institutional memory and redundant debate

Teams that document context, tradeoffs, and consequences within version-controlled repositories preserve institutional memory and streamline future architecture discussions, preventing knowledge decay and reducing redundant engineering debates (https://blog.progressiverobot.com/how-to-write-an-architecture-decision-record-engineers-actually-read, jev weight 0.57). The practical claim is that a re-derivable record changes behavior twice: at write time it forces the reasoning to be explicit, and at read time it prevents the same debate from being re-run from scratch.

Practitioner discussion of this problem converges on the same mechanics: maintaining decision logs alongside code reviews, and using lightweight documentation tools to capture the why behind technical choices rather than just the what (https://ubos.tech/news/why-capturing-engineering-decision-rationale-matters-insights-from-hacker-news/, jev weight 0.12, weak backing).

## BIM’s structured answer: connect question to consequence

The richest worked example of re-derivability comes from construction IT: a BIM design decision log that records more than who changed an object, connecting the question, assumptions, alternatives, rationale, approval, model action, affected outputs, and resulting version so another reviewer can reconstruct why the design changed (https://www.snaptrude.com/blog/bim-design-decision-log, jev weight 0.22, weak backing). The pattern transfers: a re-derivable record is a chain from question to assumption to alternative to rationale to action to affected outputs, not a single verdict line.

## The one-page test

A practitioner pattern distills the discipline: a one-page decision record preserves rationale, tradeoffs, risks, and context before product decisions get rewritten or forgotten, built to preserve the judgment behind a decision, not just its outcome (https://substack.mark-carroll.com/p/the-decision-survived-the-judgment-the-decision-survived-the-judgment-one-page-decision-record-rationale-context-tradeoffs, jev weight 0.45). The size constraint is itself part of the method: records long enough to be abandoned do not get re-derived either.

## Source quality note

Primary anchors are the Springer design-rationale research chapter and the canonical ADR template. The remaining sources are practitioner material with moderate to low jev weights, used for worked patterns rather than research claims, and labeled weak where under 0.5.
