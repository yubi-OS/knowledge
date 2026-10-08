# 08 Symptom-Based Alerting

Scope: alert on symptoms users feel, not on causes; every alert actionable with a runbook; thresholds justified by SLO or history; two severities only, page and ticket.

## Symptom versus cause

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md) tabulates it (source doc):

```
SYMPTOM (page-worthy):           CAUSE (dashboard, not a page):
error rate > 1% for 5 min        CPU at 85%
p99 latency > 2s                 one pod restarted
queue age > 10 min               disk at 70%
```

"Cause-based alerts fire when nothing is wrong and miss failures you didn't predict. Symptom-based alerts fire exactly when users are hurt, regardless of the cause" (source doc). The red-flag list names the anti-pattern concretely: "Alerts on causes (CPU, memory) paging humans while user-facing error rate is unmonitored" (source doc).

This is the strongest-backed subtopic in the dig. Google's SRE book chapter on monitoring distributed systems (https://sre.google/sre-book/monitoring-distributed-systems/, weight 0.96) makes the same distinction in its own vocabulary: symptoms are the outward-facing conditions users care about (errors, latency), causes are the internal conditions that produce them, and the four golden signals - latency, traffic, errors, saturation - are symptom-shaped. The SRE book's practical alerting chapter (https://sre.google/resources/book-update/practical-alerting/, weight 0.91) covers the mechanics of turning those conditions into maintainable alert rules. An ex-Google SRE's writeup repeats the symptom/cause split from the practitioner side (https://prawarpoudel.github.io/pages/alerting.html, weight 0.24, weak).

## The four rules

The source doc's rules for every alert (source doc):

1. "It must be actionable. If the response is 'ignore it, it self-heals', delete the alert."
2. "It links to a runbook - even three lines: what it means, first query to run, escalation path."
3. "It has a threshold and duration justified by the SLO or by historical data, not by a guess."
4. "Use two severities only: page (user-facing, act now) and ticket (degradation, act this week). A third tier becomes noise that trains people to ignore everything."

The red flags repeat the failure modes: "Alerts that fire daily and get acknowledged without action", and the rationalization "Alert on everything important, we'll tune later" gets the answer "A noisy pager trains people to ignore it. The tuning never happens; the missed real page does" (source doc).

RunBook Academy's actionable-alerts lesson teaches the same properties (specific, actionable, linked to remediation docs) (https://runbook.academy/courses/observability/lessons/05-actionable-alerts/, weight 0.29, weak). The overlap with rule 1 and rule 2 is exact even though the source doc's severity model (two tiers) is stricter than most published guidance.

## Why two severities

The severity rule is a noise-management decision, and it is the one most organizations get wrong in practice. Every extra tier dilutes the meaning of the page tier; the source doc's claim that a third tier "becomes noise that trains people to ignore everything" is a behavioral claim consistent with the SRE book's burnout warnings (https://sre.google/sre-book/monitoring-distributed-systems/, weight 0.96). Anything not worth a page lands as a ticket, and dashboards hold the cause signals (CPU, disk, pod restarts) that no longer page.

## Connection to the rest of the skill

Symptoms are expressible because docs 02 and 06 built them: error rate and p99 latency are RED metrics with percentiles, queue age is a USE saturation signal. Alerts are queries over the metric layer, which is why metric cardinality discipline (doc 06) is a precondition for alert correctness. The thresholds themselves should trace to the SLO or to historical data (rule 3), and each alert's first test is firing it once, which is doc 09's job.

## Practical summary

Page on user-felt symptoms, dashboard the causes. Four rules: actionable, runbook-linked, threshold justified, two severities. Delete alerts whose response is "ignore it". A pager that cries daily will not be believed when it is right.
