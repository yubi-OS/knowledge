# 09 Outreach cadence: sequencing, stop conditions, and quality metrics

Scope: sequencing the first weeks of friend-making with stop conditions at each step, quality-over-volume measurement, and a refresh rule that re-checks community rules and evidence before every touch.

## Measurement first, because cadence without metrics drifts

The strongest source in this dig is the open source maintainers' metrics guide, which argues that data, used wisely, helps maintainers make better decisions: understand how users respond to a new feature, figure out where new users come from, and identify what keeps people engaged (https://opensource.guide/metrics/, jev weight 0.6879). That guide is the right anchor for a campaign that tracks quality rather than volume.

The developer-relations literature agrees on the shape of the metrics, though the specific sources here carry weak weights. One framework recommends anchoring developer relations metrics to business outcomes first, then tracking onboarding effectiveness and engagement depth (https://blog.stateshift.com/metrics-for-devrel/, jev weight 0.4594, weak backing). A second from the same outlet covers retention, contribution quality, and advocacy tracking (https://blog.stateshift.com/how-to-measure-developer-community-success-the-signals-most-teams-miss/, jev weight 0.2825, weak backing). A third notes the difficulty of tying community engagement activity to business impact, which is itself an argument for choosing technical-quality metrics over activity counts (https://devrelcore.com/quantifying-value-metrics-that-demonstrate-the-developer-relations-impact/, jev weight 0.2844, weak backing). On the contributor side, one guide stresses that user retention is as crucial as acquisition because current contributors eventually leave, so a steady inflow of new contributors must be tracked (https://contributing.md/open-source-metrics/, jev weight 0.2727, weak backing).

## Build-in-public cadence guidance, weakly backed

The build-in-public genre gives cadence advice the campaign can borrow with care. A playbook describes build in public as a serialized story with a clear character, a clear conflict, and regular episodes people want to follow, and provides weekly cadence and post templates (https://www.welaunch.sh/blog/the-build-in-public-playbook-what-to-share-each-week-before-during-and-after-lau, jev weight 0.2057, weak backing). A 2026 guide defines the practice as making the work of building a product visible as it happens, including exposing the messy middle (https://www.buildinpublic.so/blog/build-in-public, jev weight 0.2696, weak backing). Another 2026 guide argues structured dossiers beat performance posting (https://www.truve.online/guide/build-in-public, jev weight 0.2182, weak backing), which matches an evidence-first campaign: publish artifacts, not performance. A community-maintained guide offers a phased structure: foundation first, then audience growth, then progress sharing (https://github.com/buildinginpublic/buildinpublic, jev weight 0.3443, weak backing).

Launch checklists exist in the same register: one frames a good launch as one where the project is clear, accessible, and structured enough to earn trust, explicitly saying it does not need to be perfect (https://softwareforprogress.org/learn/the-open-source-launch-checklist/, jev weight 0.2465, weak backing), and commercial checklists cover licensing, funding, and community setup (https://launchtry.com/resources/launch-checklist/open-source, jev weight 0.2134, weak backing).

## The 14-day shape with stop conditions

Synthesizing the sources above with the friend-map structure, the first 14 days take this form, where each step carries a stop condition that halts the sequence when unmet:

1. Day 0: fix public claim hygiene and the security intake. Stop condition: stop if the wording conflicts with the campaign's own claim discipline.
2. Day 1: publish the friend map itself as a dated reference, so the plan is auditable. Stop condition: stop if it implies endorsement or contact that has not happened.
3. Day 2: open a tracking issue for campaign outcomes. Stop condition: update an existing issue instead of duplicating.
4. Days 3 to 5: open one canonical discussion thread for reviewer asks. Stop condition: stop if the security policy and README changes are not merged yet, because traffic before hygiene is noise.
5. Days 5 to 8: prepare two upstream-useful notes. Stop condition: stop if either note reads like promotion; the structured-dossier-over-performance principle applies (https://www.truve.online/guide/build-in-public, weak backing 0.2182).
6. Days 8 to 14: make two respectful upstream touches, one discussion or comment per community, each with a specific question. Stop condition: stop after two and review signal quality before continuing.

## The quality metrics

Following the opensource.guide principle that metrics should answer decisions rather than decorate reports (https://opensource.guide/metrics/, weight 0.6879), the campaign tracks five pairs of good and bad signals:

1. Review quality: specific corrections, missing failure modes, and reproductions are good; stars without technical follow-up are bad.
2. Relationship health: upstreams redirecting constructively or engaging is good; communities calling a post promotional is bad.
3. Evidence progress: new logs, commands, hardware offers, or documentation fixes are good; repeated questions caused by unclear claims are bad.
4. Safety: security reports staying off public threads is good; vulnerability details appearing in public issues is bad.
5. Conversion: reviewers becoming issue authors, testers, or contributors is good; drive-by traffic with no useful action is bad. The retention framing supports watching contributor inflow and outflow, not just totals (https://contributing.md/open-source-metrics/, weak backing 0.2727).

## The refresh rule

Before sending any external outreach, re-check four things: the target community's current rules, the project's blocker register, the exact evidence URL to be linked, and the wording of any public claim. This rule exists because cadence amplifies whatever it repeats, and a stale claim repeated on schedule becomes a credibility liability rather than a story. The review point after the first two upstream touches decides whether to continue, change the ask, or pause.
