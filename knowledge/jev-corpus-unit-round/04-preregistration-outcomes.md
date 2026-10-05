# Pre-registration and the outcomes contract

Scope: why every unit round pre-registers its sign and outcomes before scoring, how the outcomes supersedes contract replaced the shares baseline_id+target link, and why the realized row must exist before remap.

## The two pre-registrations

Refs2, the first round of the validated series, adopted two instruments at once: the sign gate and outcomes pre-registration. The sign gate fixed which direction of the gate statistic counts as improvement, so a round cannot reinterpret its own delta after seeing it. Outcomes pre-registration gave round 3's missing measurement a home: the outcomes that a round intends to read are written down before the change is scored (source doc, refs2).

This mirrors the open-science practice the unit-round flow borrows deliberately. Preregistration is the practice of registering hypotheses, methods, and analyses before a study is conducted (https://handwiki.org/wiki/Preregistration_(science), w0.340, weak backing). Its core requirement is that the published record make clear which analyses were part of the confirmatory design, distinguished from exploratory work (https://www.cos.io/initiatives/prereg, w0.866). Preregistration of exploratory research is defensible too, with only slight modifications needed to harness its potential and make exploratory work more trustworthy (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7098547/, w0.859). The unit-round analog: every round is confirmatory about its one pre-registered change, and everything else the round observes is exploratory and not gate-relevant.

## Why pre-specified outcomes

Clinical trial methodology is the strongest version of the argument. Trials pre-specify one or more primary endpoints and use a variety of manipulations to control the false-positive rate across analyses (https://www.nature.com/articles/s41409-021-01542-0, w0.890). A registered protocol should specify a primary outcome measure used in the principal analysis, protecting against outcomes being chosen after results are seen (https://bookdown.org/dorothy_bishop/Evaluating_What_Works/prereg.html, w0.724). Registry infrastructure institutionalizes this: the AEA RCT Registry records main outcome measures alongside trial designs so readers can check what was promised against what was reported (https://www.socialscienceregistry.org/, w0.776). Outcome-measure entry discipline is enforced even at the form level in trial registries, because the most common rejection reason is a problem with how outcome measures were entered (https://research.cuanschutz.edu/docs/librariesprovider148/crsc_documents/tip-sheet_entering-outcome-measures-i, w0.625). The unit-round flow imports all of it in miniature: the outcomes row is the protocol, the realized row is the report.

## The supersedes contract

Refs5 hardened the mechanics. The outcomes supersedes contract replaced the older design where an outcomes row linked to a shares row by baseline_id plus target. Supersedes is a versioned replacement: when a round re-scores, the new outcomes row supersedes the old one rather than mutating it or duplicating it under a new linkage (source doc, refs5). The difference is auditability. A baseline_id+target link can silently have several live rows for the same target, and nothing in the schema says which is current. A supersedes chain has exactly one live head, and the full history is preserved for audit.

## Realized row before remap

The second refs5 contract is ordering: the realized row (the row recording what was actually measured) must be written before the remap runs. Writing the realized measurement after re-mapping the corpus would let the map's new state contaminate the record of the old state's outcome (source doc, refs5, harness contract). It is a small ordering rule with a large evidentiary role: the realized row is what later rounds and the round record (doc 09) treat as ground truth for what the change did.

## Pre-registration is not bureaucracy

The failure mode pre-registration prevents in this flow is identical to the replication-crisis mechanism it prevents in science: analyses chosen after results are seen convert noise into findings (https://en.wikipedia.org/wiki/Replication_crisis, w0.068, weak backing; the mechanism is better grounded in the preregistration sources above). In a corpus RSI chain the stakes compound: each round's keep decision changes the corpus that all later rounds measure. An unfixed outcome vocabulary would let drift accumulate invisibly. The outcomes contract keeps the chain's measurements commensurable round over round, which is what makes the frozen baseline (doc 02) and the gate statistic (doc 03) meaningful at all.
