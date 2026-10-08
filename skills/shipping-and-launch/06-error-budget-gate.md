# 06 Error Budget Release Gate

Scope: the SLO error budget as an objective release gate: the budget bands, the burn rate as a hold signal, and the reset rule.

## The budget as a gate

The source doc defines the error budget as the fraction of requests or time your SLO allows to fail, and instructs teams to use it as an objective gate, "not a negotiation" (source doc, Error Budget Release Gate). The bands (source doc):

| Budget remaining | Policy |
|---|---|
| More than 20% | Ship normally; monitor closely |
| 0 to 20% | Slow rollouts only; no high-risk changes |
| Exhausted | Freeze feature work; focus entirely on reliability |
| Resets | Resume normal pace; bake in the fix that recovered it |

The fourth row is the one that prevents the gate from becoming punitive: when the budget resets, normal pace resumes, and the requirement is that the fix which recovered the budget gets baked in so the failure mode does not recur.

Google's SRE Workbook documents error budget policy with a worked example service (the Example Game Service, with daily backend releases) whose policy ties release velocity to budget state (https://sre.google/workbook/error-budget-policy/, jev 0.90). The source doc's bands are the same contract in table form: budget state is an input to release decisions, stated in advance so no one relitigates it during an incident. AWS's SRE overview describes the discipline this serves: using software tooling to automate infrastructure tasks so applications remain reliable amid frequent updates (https://aws.amazon.com/what-is/sre/, jev 0.74), and Google's SRE landing page states the founding idea, treating operations as a software problem (https://sre.google/, jev 0.80).

## Burn rate as a hold signal

The source doc adds a subtlety: a high burn rate during a canary, meaning the budget is being consumed faster than the baseline pace, is a hold signal, to be treated the same as an elevated error rate (source doc). The rationalizations table repeats it with the exact failure mode: "The error rate looks fine, let's keep shipping" is wrong because you check the burn rate, not just the current error rate; consuming budget faster than baseline is a hold signal even when individual thresholds are green (source doc).

This is a drift-resilient formulation. A canary at 5% can hold a fine instantaneous error rate while still consuming budget at an unsustainable rate relative to its traffic share; the instantaneous rate hides the rate of change. Weak-backing context: the burn-rate alerting pattern is discussed by Catchpoint (https://www.catchpoint.com/webinar/how-to-alert-on-slos-using-error-budget-burn-rate, jev 0.18, weak backing) and in an SLO-setting guide from OpenObserve (https://openobserve.ai/blog/set-meaningful-slos/, jev 0.41, weak backing). The source doc does not specify a burn-rate formula; it specifies the decision rule.

## How the gate connects to the rollout

The error budget gate sits upstream of the staged rollout: the bands decide whether a rollout may start and at what pace. A service with budget exhausted does not run canaries; it freezes feature work. The rollout thresholds doc in this corpus then governs the in-flight decisions. Together the two gates close the loop the red flags list demands: "Error budget exhausted but feature work continues unchanged" is listed as a red flag (source doc), and the exhausted band is what makes that state actionable rather than merely visible.

## What the source doc leaves open

The source doc does not define the SLO itself, the measurement window over which the budget is computed, or the burn-rate formula. Those are service-specific. What the skill pins is the policy structure: 4 bands, burn rate as a hold signal, and the reset rule that ties resumed velocity to a durable fix.
