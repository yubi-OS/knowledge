# 07: Blameless postmortem discipline

Scope: the tone and structure conventions the source doc imports into failure-mode records and postmortems: system conditions over incompetent people, evidence-cited claims, and the Google SRE, Etsy, and facilitation traditions behind them.

## The source doc's rule

Guideline 9: blameless but precise. Postmortems and failure-mode documents describe system conditions, information available at the time, and causal mechanisms, not incompetent people. The yubiOS convention (per PROJECT_RULES.md) is a blameless tone with every claim citing evidence [source doc].

The anti-patterns section contrasts the two registers explicitly: X failed because Y was incompetent is blame; X failed because condition A was true at decision time, given information I, signal S was absent is blameless [source doc, Anti-patterns].

## The Google SRE anchor

Google's SRE book makes blamelessness structural: blameless postmortems are a tenet of SRE culture, and for a postmortem to be truly blameless it must focus on identifying the contributing causes of the incident without indicting any individual or team for bad or inappropriate behavior (weight 0.82, https://sre.google/sre-book/postmortem-culture/) [primary].

The SRE workbook extends the argument from tone to outcomes: Google's experience shows a truly blameless postmortem culture results in more reliable systems, which is why the practice matters to creating and maintaining a successful SRE organization (weight 0.82, https://sre.google/workbook/postmortem-culture/) [primary].

A Google Cloud blog piece on fearless shared postmortems elaborates the facilitation side (weight 0.47, https://cloud.google.com/blog/products/gcp/fearless-shared-postmortems-cre-life-lessons) [weak]: usable, but below the 0.5 primary threshold in this corpus, so treat its specifics as unverified here.

## The Etsy facilitation anchor

The Etsy Debriefing Facilitation Guide is the operational complement: it exists to help develop debriefing facilitation skills and to give facilitators practical guidance for preparing for, conducting, and navigating a post-event debriefing (weight 0.54, https://www.etsy.com/codeascraft/debriefing-facilitation-guide/) [primary]. The source doc's changelog cites this guide alongside Google SRE, Atlassian blameless postmortems, and Jeli as the research lineage for its tone discipline [source doc, Changelog].

Directly hosting artifacts is thinner ground: the PDF itself (weight 0.25, https://extfiles.etsy.com/DebriefingFacilitationGuide.pdf) and the GitHub mirror (weight 0.22, https://github.com/etsy/DebriefingFacilitationGuide) are weak here; cite the Code as Craft writeup as the durable link.

## How tone enters the failure-mode record

The source doc's record schema does not have a tone field; tone shows up in two of its other rules instead:

1. The why field: cause, assumption, and environmental condition, not fault attribution. A why written as system conditions is the blameless form of the same fact [source doc, record table].
2. Blameless but precise: the discipline is not softness. Every claim cites evidence, and a failure mode with a silent signal must declare an evidence_gap rather than assume nobody was negligent [source doc, Guidelines 9; Constraints].

## Why this matters for the axis

The Failure-modes axis exists to make recovery paths recoverable from the document rather than from postmortem history [source doc]. Postmortems are where those recovery paths are learned the hard way; a blameless, evidence-cited postmortem is what feeds the failure-mode table honestly. A blameful postmortem suppresses the very signal the table needs: people who expect blame stop recording the environmental conditions that made the failure possible.

## Dig quality note

This subtopic's dig returned 2 primary-weight sources on the Google side and 1 on the Etsy side; the remaining 9 results (slides decks, mirrors, aggregator pages, and a bare google.com landing) weighted 0.11 to 0.47 and are recorded in the archive as weak or unused. No redo was needed; the kept primaries are sufficient for every claim above.

## The evidence-cite-every-claim pairing

The source doc's changelog names the shared discipline with audit-evidence-packaging: blameless tone and evidence-cite-every-claim are a pair, and the composition table records the bond in both directions [source doc, Composition with audit-evidence-packaging]. In practice this means a postmortem line that names a person fails twice: once on tone, once on evidence, because a person is not a falsifiable cause. The blameless rewrite, condition A was true at decision time given information I and signal S, is what makes the claim checkable against the recorded timeline. That is also why the failure-mode record's why field is written as cause plus assumption plus environmental condition rather than as a fault assignment [source doc, record table].
