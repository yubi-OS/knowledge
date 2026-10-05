# Threshold-setting discipline and out-of-scope boundaries

**Scope:** Threshold-setting discipline and out-of-scope boundaries: recording that a metric matters versus picking target numbers, no dashboards before data exists.

## Two different claims

A metrics report makes two distinct kinds of statement: "this number matters, here is the decision it feeds" and "the right value of this number is N". The first is a measurement claim anyone with repo access can verify. The second is a judgment claim that belongs to whoever owns the risk. Collapsing the two is the most common way an early-stage metrics report oversteps: it picks thresholds nobody authorized, on the strength of an analogy to another project's scale.

## What targets do to measures

The mechanism-level warning is Goodhart's law: when a measure becomes a target, it ceases to be a good measure, because rewarding performance on a measure creates an incentive to manipulate the measure itself, sometimes reducing the effectiveness of the underlying activity (https://www.cna.org/analyses/2022/09/goodharts-law, weight 0.37, weak backing; same formulation at https://en.wikipedia.org/wiki/Goodhart%27s_law, weight 0.18, weak backing). A software-specific write-up describes the failure mode concretely: once a metric becomes a target, people adapt to the target instead of the system reality, the number improves while the delivery conversation gets thinner and less honest, and target pressure creates gaming, defensive planning, and weaker management clarity (https://www.storypointlab.com/docs/metrics-anti-patterns/why-turning-metrics-into-targets-backfires, weight 0.42, weak backing).

This does not forbid thresholds; it dates them. A threshold set before anyone has observed the metric's natural variation is a guess wearing a number. The defensible sequence is: track the metric, record it alongside the decision it feeds, and set the target after the first stretch of observations shows what "normal" looks like for this project at this scale.

## Anti-patterns in defining metrics

Practitioner catalogs of metric-definition anti-patterns consistently include threshold problems: targets copied from other organizations, metrics tracked with no consumer, and dashboards nobody reads (https://xebia.com/articles/common-anti-patterns-in-defining-metrics-and-how-to-avoid-them/, weight 0.44, weak backing). The anti-pattern literature treats these as structural failures rather than individual mistakes: an anti-pattern is a commonly used process that initially appears appropriate but has worse consequences than the alternative (https://www.itamarnovick.com/category/anti-patterns/, weight 0.21, weak backing). Engineering practice bodies document the same pattern in performance work: antipatterns are common defective processes and implementations, and awareness of them helps teams avoid predictable scalability and delivery problems (https://learn.microsoft.com/en-us/azure/architecture/antipatterns/, weight 0.56, authoritative).

One authoritative source lands on the process side rather than the number side: agile's own manifesto principle is that teams reflect at regular intervals and tune their behavior, yet teams in practice often are not reflecting at all (https://www.scrum.org/resources/blog/scrum-teams-practices-lead-anti-patterns-and-their-impact, weight 0.88, authoritative). For an early-stage project, the reflective loop is the part worth institutionalizing; the threshold numbers can wait for the loop to produce observations.

## Dashboards before data

The second out-of-scope boundary is instrumentation. A report that defines what to track should not promise dashboards, alerting, or a collection pipeline as part of the same deliverable. Dashboard research makes the reason concrete: dashboards are ubiquitous, but to achieve their goals they must be developed, implemented, and evaluated with methods that ensure they meet end-user needs and fit local context (https://www.sciencedirect.com/org/science/article/pii/S2291969424001807, weight 0.78, authoritative). That is a project in itself, with its own requirements and evaluation, and bundling it into a metrics-definition effort guarantees neither succeeds. The honest boundary: this document defines what to track and why; any collection mechanism is separate follow-up work.

## What stays in scope

Recording that a blocker count matters is in scope. Picking the number of open blockers that is "too many" is not, because that judgment belongs to the owner who will live with the consequence. The same split applies to every gate-adjacent metric:

- In scope: the metric, its artifact, its decision, its cadence, its owner.
- Out of scope: target values, alert thresholds, red-amber-green bands, and any comparison to another project's numbers.
- Explicitly deferred: all instrumentation and collection tooling.

## The one allowed early number

There is exactly one kind of threshold that can be set honestly at day 0: a structural one, where the number is not a performance target but a definition. "A claim cannot be promoted to production while its blocker is open" needs no calibration; 1 is a definition, not a target. Everything beyond structural constraints should stay unnumbered until the project has data, which at single-founder scale is also the cheaper option in hours spent.
