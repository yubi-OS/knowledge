# 02 Axes 1 to 6: The Outward-Facing Sweep

Scope: Axes 1 to 6 of the sweep: audience, inputs, outputs, mode, assumption set, and adjacent problems, with the question each asks of an artifact.

## What the sweep is

Negative-skill-space maps an artifact's negative space across 12 axes. The first 6 axes face outward, toward the artifact's users and its boundaries with the world: who it serves, what it takes in, what it puts out, how it runs, what it presumes, and what it leaves to its neighbors (source doc origin: yubiOS refs/negative-skill-space-2026-07-28.md). The axes are explicitly not exhaustive; new axes get added when a gap fits none of them.

## Axis 1: Audience

The question: who does this serve, who is excluded, who falls through the cracks? The positive answer documents the intended reader or user. The negative answer names the people the artifact silently fails: scheduled runs and autonomous agents where no human can answer questions, multi-stakeholder contexts the design assumed away, ideas refined on behalf of someone not present.

Technical-writing practice supports treating audience as a primary axis rather than an afterthought. Purdue's Online Writing Lab frames audience analysis as the necessary groundwork for user-centered communication: gathering information about what readers need, know, and expect before composing (https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/audience_analysis/index.htm, weight 0.89). Google's technical-writing course likewise defines the audience by roles and by what the reader already knows, and adjusts the document to that knowledge (https://developers.google.com/tech-writing/one/audience, weight 0.32, weak backing). Practitioner literature has pushed further toward documented audience personas as a standard artifact (https://programmaticperspectives.cptsc.org/index.php/jpp/article/view/81, weight 0.10, weak backing). The negative-space move inverts the usual question: instead of "who is the audience?", it asks "which audience, exactly, is assumed away?" and records that exclusion as a gap with a likelihood and a severity.

## Axis 2: Inputs

The question: what inputs does it accept, and which does it reject or mishandle? The gap map records non-textual inputs a text-shaped process cannot load (diagrams, sketches, prototypes, voice notes), implicit ideas the artifact assumes are stated, and formats that arrive out of order.

Software engineering has a mature vocabulary for the assumption side of this axis: design by contract prescribes that software components interact on the basis of formally specified preconditions, postconditions, and invariants (https://en.wikipedia.org/wiki/Design_by_contract, weight 0.23, weak backing). A UCSD course lecture on programming by contract makes the operationally useful point: a precondition is the client's responsibility, input validation is then not required by the callee, and the precondition must be documented so it "does not slip through the cracks" (https://cseweb.ucsd.edu/classes/sp06/cse111/lectures/Lecture%2013%20Programming%20by%20Contract.pdf, weight 0.70). That phrase is the negative-space failure mode in miniature: undocumented preconditions do not fail loudly, they slip through. Enterprise Craftsmanship adds the distinction the axis needs: user-facing input validation and internal contract preconditions are different mechanisms for different boundaries (https://enterprisecraftsmanship.com/posts/code-contracts-vs-input-validation/, weight 0.41, weak backing). Mapping a skill's inputs means writing down the precondition contract the skill silently imposes on its caller.

## Axis 3: Outputs

The question: what outputs does it produce, and which does it fail to produce when needed? Beyond the declared deliverable, the negative answer captures missing output types: no kill verdict when the artifact should conclude that the work should not exist, no prior-art record, no version lineage, no persisted critique, no second-order-effects analysis. A skill biased toward producing its artifact will produce it even when the artifact shouldn't exist; the missing "kill output" is a gap on this axis, not a failure of execution (source doc origin).

## Axis 4: Mode

The question: how does it run? Interactive, solo, batch, continuous, reactive, scheduled. An artifact designed for one mode inherits gaps in every other mode: a dialogue-driven skill cannot run in a scheduled context; a one-shot skill has no continuity between invocations; a skill with no watch mode cannot notice that its subject matter changed. Mode gaps are among the highest-severity findings because they block entire classes of use rather than degrading quality within a use.

## Axis 5: Assumption set

The question: what must be true for the artifact to behave correctly, and what breaks silently when an assumption fails? The framework's finding on its own test case: evaluation axes imported from one domain (product thinking: user value, feasibility, differentiation) get imposed on artifacts from other domains (research: novelty, rigor, falsifiability; policy: fairness, enforceability) without notice (source doc origin). Silent breakage is the signature of assumption gaps: nothing errors, the output is just wrong-shaped.

This is exactly the design-by-contract hazard restated at the process level. The contract literature's core claim, that clearly defined preconditions and postconditions improve reliability and documentation quality (https://softwarepatternslexicon.com/mastering-design-patterns/best-practices-and-principles/design-by-contract, weight 0.45, weak backing), translates to gap-mapping as: an artifact whose preconditions are explicit can be checked against reality; one whose preconditions are implicit cannot.

## Axis 6: Adjacent problems

The question: what problems does it solve, and which adjacent problems does it NOT solve even though they look similar? Adjacent-problem gaps are the most commonly misdiagnosed, because the artifact appears to address them. Examples from the source doc's own case study: prior-art discovery looks like refinement but requires search rather than conversation; killing an idea looks like refining it but requires an explicit kill path; critiquing an existing idea looks like generating one but requires a persisted critique. Each was flagged as a gap on this axis and routed to a different skill (prior-art-search, idea-kill, doubt-driven-development) rather than an extension of the original.

## From sweep to record

For each of the 6 axes the mapper writes two answers: the positive claim the artifact makes, and the negative claim of what it excludes. Each negative is then scored for likelihood and severity and either becomes a real gap or is filtered out as performative or intentional scope (source doc origin; scoring covered in doc 04).
