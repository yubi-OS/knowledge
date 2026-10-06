# 07. Acting on results: thresholds, confidence, and audit

Scope: how to consume the answers object: thresholds instead of rounding, confidence-based routing, and the audit fields to log.

Grounding spine: the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md. External corroboration from this subtopic's searXNG dig; weights below 0.5 are labeled weak.

## The source doc's consumption rules

The source doc's acting-on-results section gives five rules:

1. **Read decisions from answers[<question_key>]**. The answers map is keyed by the question names you sent, so consumption is a direct lookup per question.
2. **Set thresholds rather than rounding.** The worked example: auto-act when noul >= 0.8, escalate to a human between 0.3 and 0.8. A noul near 0.5 means the model is unsure, and the response to uncertainty is a routing rule, not a rounding function.
3. **For choice and score, check confidence and route low-confidence results to review.** The confidence field is the built-in uncertainty signal for the non-binary types.
4. **Log task_id and consumed for auditing and spend tracking.** task_id is the response's task identifier; consumed is the cost in USD as a string. Both arrive per request.
5. **Pass session_id to group related calls, and user for a per-end-user identifier**, each up to 256 characters. These are request-side fields that stitch a decision trail together downstream.

The threshold rule deserves emphasis because it is the difference between a demo and a system. A threshold policy has three zones: act (high probability), escalate (the middle band), and reject or ignore (low probability). The exact numbers are yours to calibrate; the 0.8 and 0.3 example shows the shape.

## What the dig adds

The dig on confidence-based routing and human-in-the-loop design returned two high-weight sources and a cluster of weak ones:

- A published IEEE work presents a human-in-the-loop assessment pipeline integrating human feedback, an LLM-based adjudication system, and observability tools to increase reliability and alignment of LLM output with business needs (weight 0.75, high: https://ieeexplore.ieee.org/abstract/document/11473113). The three components map onto the source doc's rules: human feedback is the escalation zone, adjudication is the threshold policy, observability is the task_id and consumed logging.
- A manufacturing-domain paper describes a hybrid intelligence structure where AI enhances automation while human expertise ensures contextual accuracy and quality control (weight 0.62, high: https://www.sciencedirect.com/science/article/pii/S0278612526001135). Same division: the model decides, the human supervises the band.
- Weakly backed practitioner sources converge on the same pattern family: confidence thresholds with an auto-act band above and human routing below (weight 0.26, weak: https://blog.traversaal.ai/human-in-the-loop-ai-design-patterns-approval-gates-confidence-thresholds-escalation-routing), two-axis routing that combines action severity with decision confidence rather than a single threshold (weight 0.21, weak: https://facio.bot/blog/confidence-thresholds-escalation-agent-human-review), and a routing matrix built from task impact and measured uncertainty (weight 0.21, weak: https://parkerjoseph.dev/blog/ai-confidence-thresholds-human-review-routing-matrix).
- The calibration caution: LLM self-reported confidence and logprobs are reported as badly calibrated in general-purpose models, which breaks naive human gating (weight 0.19, weak: https://usqrd.com/insights/llm-confidence-calibration-human-in-the-loop). This is the strongest argument for the source doc's design: jev-1.13 is built to return calibrated probabilities as its native output, rather than asking a chat model to self-report confidence after the fact.
- One weak source frames the threshold policy as ongoing calibration rather than a one-time decision, shifting as model performance and input distribution evolve (weight 0.26, weak: https://www.digitaldividedata.com/blog/when-to-use-human-in-the-loop-vs-full-automation-for-gen-ai).

## A concrete consumption block

Translating the rules into code shape for a support-triage pipeline (the source doc's example domain):

```python
answers = result["answers"]
bug_p = answers["is_bug"]["noul"]            # probability of true, 0 to 1
team = answers["team"]["choice"]             # option key your code switches on
urgency = answers["urgency"]["score"]        # probability-weighted level index

if bug_p >= 0.8 and urgency >= 1.5:
    route(team, urgent=True)                 # auto-act zone
elif 0.3 <= bug_p < 0.8 or answers["team"]["confidence"] < 0.6:
    escalate_to_human(result, reason="middle band or low confidence")
else:
    route(team, urgent=False)
```

The block exercises all five rules: keyed lookups, a two-threshold band on the probability, confidence gating on the choice, and the result object (with task_id and consumed) carried into the escalation path for the audit log.

## The audit trail

The logging rule has three fields and a session key:

- **task_id**: the per-request identifier. Log it with the request's inputs so any decision can be traced back to the exact state and questions that produced it.
- **consumed**: the cost string. Sum it for spend tracking; because it is a string, parse before summing.
- **session_id** (request-side, up to 256 characters): groups related calls, so a multi-step decision flow shares one session id.
- **user** (request-side, up to 256 characters): the per-end-user identifier, so per-user decision histories and per-user cost rollups are possible without joining on your own user table.

Observed in this corpus's own minting calls, the response also carries a generation id, a provider field, and per-request usage tokens, all of which are worth logging alongside task_id when the audit requirement is strict.
