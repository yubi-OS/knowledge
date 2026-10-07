# 06 - The output document and resurrection triggers

Scope: the kill verdict document format, why it is structured like a decision record, and how resurrection triggers turn a terminal verdict into a reusable one.

## The output format (source doc)

The source doc fixes the output as a markdown document with a fixed field set: a title line "Kill Verdict: [idea name]", the date, the source (raw idea, one-pager path, or spec path), the verdict line (exactly one of KILL, PAUSE, REVISE, SHIP), then sections in order: The bet (one sentence, what must be true for the idea to work), Reasons (3 to 5, each concrete), Strongest critique (the steelman, 2 to 3 paragraphs), Second-order effects (positive cascades and negative cascades), The un-testable bet (what must be true but cannot be verified cheaply; if empty, note that the bet is testable), Resurrection triggers, and Verdict justification (one paragraph tying the verdict to the reasons; if REVISE, the specific revision) (source doc).

The structure mirrors the process step for step: bet from Step 2, critique from Step 3, cascades from Step 4, testability from Step 5, reasons from Step 7, triggers from Step 8. This one-to-one mapping is what makes a verdict auditable: a reader can check each field against the evidence rather than trusting a summary.

## Decision records: the adjacent format

The closest external analogue to the fixed output is the architecture decision record tradition. The canonical ADR repository describes ADRs as short text documents that capture an important architecture decision along with its context and consequences (https://github.com/architecture-decision-record/architecture-decision-record, weight 0.64). Template writeups of the format converge on the same sections: status, context, decision, consequences (https://archman.dev/docs/checklists-and-templates/adr-template, weight 0.34, weak backing; https://www.cavaro.io/templates/architecture-decision-record-adr, weight 0.20, weak backing).

The kill verdict doc is an ADR for the decision "stop (or continue) this idea": verdict is the decision field, reasons and steelman are the context, resurrection triggers are the consequences. The practical consequence of the format match is that a kill verdict doc can live in the same repo, be referenced by later decisions, and be revisited the same way an ADR is when circumstances change.

## Resurrection triggers: the kill criteria inverse

The resurrection trigger section is the least standard part of the format and the most valuable. The source doc requires triggers even for KILL verdicts and gives three shapes: an external condition (a competitor shuts down their free tier, making this a viable alternative), an environmental change (a regulatory change flips a second-order effect), and a capability change (we acquire capability Y, making the un-testable bet testable). Without triggers, the source doc says, the verdict is throwaway; triggers make the kill verdict reusable, not terminal (source doc).

External practice expresses the same idea from the opposite direction. Kill criteria are pre-committed stop conditions; product management writing argues that the discomfort of kill criteria is precisely their value, because they move the stop decision to a moment when it can be made calmly (https://www.mindtheproduct.com/the-case-for-kill-criteria-in-product-management/, weight 0.39, weak backing). Idea-pipeline frameworks go further and use four-state vocabularies (go, revise, park, kill) with explicit criteria for moving between states (https://startupmachine.ai/resources/go-revise-park-kill-decision-criteria-for-startup-ideas, weight 0.23, weak backing).

A resurrection trigger is a kill criterion run in reverse: instead of "stop when X happens", it is "resume when X happens". Both share the same design goal, to separate the judgment about the idea from the judgment about the moment, so that a dead idea does not need a new full review to be reconsidered, only a check of its trigger list.

## Why the format forbids vagueness

Every field of the output has a falsifiable content requirement: the bet is one sentence, reasons are 3 to 5 concrete observations, the steelman is paragraphs not adjectives, the revision (for REVISE) is a named change. This is deliberate. The source doc's anti-patterns and red flags sections enumerate the ways a verdict document decays: reasons that cite vibes, a verdict that contradicts its reasons, a REVISE without a named revision, a KILL without triggers (source doc). The fixed format is the enforcement mechanism: a document with all fields filled correctly cannot exhibit most of the anti-patterns.
