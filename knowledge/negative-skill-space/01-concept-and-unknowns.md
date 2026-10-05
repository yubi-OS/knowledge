# 01 Concept and Unknowns

Scope: The negative skill space definition: positive vs negative space of an artifact, the Rumsfeld known/unknown taxonomy applied to skills, and the discipline of moving unknown-unknowns into known-unknowns.

## Two regions of every artifact

Every skill, plan, or document has two regions. The **positive space** is what it claims to do: its trigger phrases, its defined process, its outputs, its success criteria. The **negative space** is what it does not do: the boundaries the author drew, consciously or not, and everything outside them (source doc origin: yubiOS refs/negative-skill-space-2026-07-28.md).

The vocabulary is borrowed from visual design, where negative space is the area around and between the subjects of an image rather than the subjects themselves. The Interaction Design Foundation defines negative space as the space around and between a subject that gives the subject its shape and legibility (https://ixdf.org/literature/topics/negative-space, weight 0.81). Design writing makes the same point from the practitioner side: negative space is "what you don't put on the page," and it is what lets the subject stand out (https://design4users.com/negative-space-in-design/, weight 0.35, weak backing). Transferred to skills: a skill's trigger list and process description are the subjects; everything the author left out is the whitespace around them, and that whitespace is not empty. It is the region where unhandled requests, unmapped audiences, and silent misbehavior live.

## The author's blind spot

The trap is asymmetry of visibility. The author of a skill sees the positive space, because they built it, described it, and shipped it. They usually do not see the negative space, because the negative space is precisely the region they decided not to handle. The author's blind spot is the negative space. This is the framework's core claim and it originates in the source doc; it is structurally the same observation project managers make about plans, where unidentified risks are by definition the ones nobody wrote down.

## Rumsfeld's taxonomy applied to skills

The framework maps its two regions onto the four-quadrant taxonomy popularized by Donald Rumsfeld in a 2002 press briefing, which divided information into known knowns, known unknowns, unknown knowns, and unknown unknowns (https://www.theuncertaintyproject.org/tools/rumsfeld-matrix, weight 0.51). Risk-management literature treats this classification as foundational: risk management itself is grounded in the ability to identify, value, and mitigate the correct risks, and classification is the first step (https://www.managementstudyguide.com/known-unknown-classification-of-risk.htm, weight 0.60). A practitioner guide gives every quadrant a home in a risk programme rather than treating unknown unknowns as unmanageable (https://www.360factors.com/blog/managing-risk-both-known-and-unknown/, weight 0.20, weak backing).

Applied to a skill or document, the quadrants land like this:

- **Known knowns** live inside the positive space: explicitly described triggers, steps, and outputs.
- **Known unknowns** live in the artifact's own "limitations" or "when NOT to use" sections: gaps the author saw and named.
- **Unknown unknowns** are the dangerous zone. They are the unrecorded absences: the audience that falls through the cracks, the input the process silently mishandles, the assumption that fails without an error.

The Project Management Institute's study of unknown unknowns argues the important thing: most unknown unknowns are believed to be impossible to find or imagine in advance, but the study finds they are more findable than commonly believed, and unidentified risks have traditionally fallen outside the scope of project risk management for exactly that assumed reason (https://www.pmi.org/learning/library/characterizing-unknown-unknowns-6077, weight 0.91). Negative-skill-space imports this finding as its justification: unknown unknowns in a skill are not unreachable, they are merely unmapped.

## The discipline: move unknown-unknowns into known-unknowns

The practice is a fixed set of questions pointed at the negative region rather than the positive one. Not "what does this do?" but "what does this NOT do?", "what adjacent problem does this leave unsolved even though it looks similar?", "who falls through the cracks?", "what assumption, if broken, would cause silent misbehavior?", and "what happens when this is applied to itself?" (source doc origin).

Once surfaced, an unknown-unknown becomes a known-unknown, and known-unknowns are decidable. The framework defines exactly three decisions per surfaced gap: **extend** (add the missing behavior to the artifact), **pair** (use another skill alongside to cover the gap), or **accept** (document why the gap is tolerable for now). Without this disposition step, a gap map is only a list; with it, every mapped absence has an owner and a decision.

## Always improve: the moving gap map

The posture is continuous, not one-shot. Every artifact has a **moment-zero gap map**, taken when it ships, and a **moving gap map**, retaken as the artifact is used, as the world changes, and as adjacent skills appear (source doc origin). This mirrors the risk-management consensus that the four-quadrant model needs recurring reassessment, not a single classification pass (https://www.360factors.com/blog/managing-risk-both-known-and-unknown/, weight 0.20, weak backing).

The honest limit of this discipline, named in the source doc itself: mapping gaps does not yet have evidence it closes them. Naming a gap makes it easier to address anecdotally; whether the gap-map-as-output actually drives improvement is an open hypothesis, not a settled result.
