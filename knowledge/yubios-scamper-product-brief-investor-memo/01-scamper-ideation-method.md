# 01. SCAMPER as a structured ideation lens

Scope: SCAMPER as a structured ideation lens: its origin with Bob Eberle and Alex Osborn, the 7 levers, and how the levers translate into design questions for a governance-first operating system.

## What SCAMPER is

SCAMPER is an ideation checklist whose name is an acronym for 7 actions: Substitute, Combine, Adapt, Modify (magnify or minify), Put to another use, Eliminate, and Reverse (or rearrange). It is described as a lateral-thinking method for redefining existing products by rethinking how they are perceived, used, or designed (https://www.consuunt.com/scamper-model/, jev weight 0.29, weak backing). Unlike unstructured brainstorming sessions that often produce scattered results, SCAMPER offers a structured framework that works through a fixed set of prompts (https://www.imd.org/blog/innovation/scamper-method-design-thinking/, jev weight 0.47, weak backing).

That structure is the point. Ideation sits at the heart of design thinking, and there are hundreds of ideation techniques including brainstorming, sketching, SCAMPER, and prototyping (https://ixdf.org/literature/article/learn-how-to-use-the-best-ideation-methods-scamper, jev weight 0.41, weak backing). A checklist format earns its keep when the team needs coverage guarantees rather than inspiration: every prompt forces at least one candidate change, which makes it hard for a whole lever of the design space to go unexamined.

## Origin: Osborn's checklist, Eberle's mnemonic

The lineage is well documented even though most retrievable sources are secondary. The SCAMPER technique was developed by Bob Eberle, who was looking for a way to foster creativity in children, and was inspired by the idea-spurring checklist described by Alex Faickney Osborn in his book Applied Imagination (https://en.wikipedia.org/wiki/SCAMPER, jev weight 0.37, weak backing). A ResearchGate paper on the technique states the same lineage: the method was proposed by Alex Osborn as a checklist and later denominated the SCAMPER technique, citing Eberle 1996 and Serrat 2017 (https://www.researchgate.net/publication/318018918_The_SCAMPER_Technique, jev weight 0.45, weak backing).

Dates and audience vary across sources, which is worth noting for anyone citing SCAMPER's history. One source places Eberle's development in the early 1970s as a tool for teaching students to think creatively (https://www.bitesizelearning.co.uk/resources/scamper-model-creativity, jev weight 0.17, weak backing), while an Asian Development Bank facilitation guide says the principles were first formally suggested by Osborn and later arranged by Eberle as a mnemonic in 1991 to increase interest in the perceptive, imaginative, and creative abilities of children (https://www.adb.org/sites/default/files/publication/27643/scamper-technique.pdf, jev weight 0.45, weak backing). The 1970s and 1991 claims conflict; both are secondary paraphrases of Eberle's books, so a careful citation should say "Eberle, mid 20th century" and cite the primary book rather than either paraphrase.

Toolshero's practitioner writeup covers the acronym, the underlying brainstorming technique, how to apply the method, and sample questions to get started (https://www.toolshero.com/creativity/scamper-technique-bob-eberle/, jev weight 0.24, weak backing).

## Why SCAMPER fits a broad threat surface

The practical argument for choosing SCAMPER over freeform brainstorming on an infrastructure product is coverage. A governance-first operating system faces a threat surface that is wide rather than deep: opaque permissions, persistent logs, hidden admin powers, weak appeal mechanisms. Each of those is a different lever, and the 7 SCAMPER actions cover most of the levers a governance-first OS can pull:

- Substitute: replace opaque decision-making with user-visible rules; replace centralized identity with user-owned credentials.
- Combine: merge access control with a civic transparency dashboard; merge privacy controls with audit-trail export.
- Adapt: import "nutrition label" patterns for system behavior; import due-process standards from public-sector practice into product UX.
- Modify: magnify visibility of who can see, change, or delete data; minify default permissions; add expiration, quorum, or dual approval to admin powers.
- Put to another use: use the OS as a rights-checking layer for apps; use device attestation to prove policy compliance without exposing identity.
- Eliminate: remove dark patterns in consent and settings; remove unnecessary data retention; remove single-point control over access and recovery.
- Reverse: turn "default trust" into "default scrutiny"; rearrange setup so users choose power before convenience.

Real-world application examples of the technique across companies exist to calibrate expectations (https://www.designorate.com/scamper-technique-examples-and-applications/, jev weight 0.26, weak backing), and practitioner guides describe step-by-step application with checklists and common mistakes (https://www.si-labs.com/en/articles/scamper/, jev weight 0.32, weak backing; https://www.capicua.com/blog/the-scamper-method, jev weight 0.21, weak backing).

## Caveats for corpus readers

Two honesty notes. First, nearly every retrievable source on SCAMPER's history is secondary or tertiary (blog posts, facilitation guides, encyclopedias); none of the sources surfaced in this corpus's dig carried an authoritative weight above 0.5, so the historical specifics above should be treated as weakly backed until checked against Eberle's own books. Second, a swap-round exercise (apply SCAMPER to one specific feature in 10 minutes) is a better test of whether a team has internalized the levers than producing a large mind map, because the swap-round forces substitution on a concrete target rather than abstraction.
