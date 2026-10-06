# 01. The decision model concept: jev-1.13 is not a chat model

Scope: what a decision model is, how jev-1.13 differs from a generative chat model, and why the difference matters for the defapi-jev skill.

Grounding spine: the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md. All source-doc claims below are attributed to it.

## What the source doc says

The source doc states plainly: jev-1.13 is a decision model, not a chat model. You give it a state (the thing being judged) and one or more typed questions; it returns probabilities for each question. The output should be a label, a probability, or a rank that code acts on, not prose (source doc).

Two inputs define every call. The state is the structured or unstructured content being judged: a ticket body, a log entry, a customer email, a config diff. The questions are typed: each one names a decision the caller wants (a yes/no, a pick-one, or a position on an ordered scale) and carries the criteria the model should judge against (source doc).

## Why the chat-model contrast matters

The dig on this subtopic returned weakly backed sources (all weights below 0.5), so the corroboration is directional, not authoritative. That said, the external sources converge on the same distinction the source doc draws:

- An LLM used as a classifier has no mechanism for producing a calibrated probability; you can extract token log-probabilities, but the hard label is the problem, and one 2026 writeup reports moving Brier scores from 0.26 toward 0.13 only after dedicated calibration work (weak, weight 0.15: https://www.explainx.ai/blog/llm-classification-feature-engineering-calibration-2026).
- An LLM's self-reported confidence is not a probability, and calibration is what separates the two use cases (weak, weight 0.15: https://aiengineerinsights.com/blog/jev-vs-ml-classification/).
- Decision models are described as a category that cannot write, summarize, or explain; their role is high-volume, bounded judgments such as classification, routing, triage, guardrails, reranking, and evals (weak, weight 0.13: https://www.marktechpost.com/2026/10/02/decision-ai-models-explained-typesafe-jev-vs-fastino-glide-gliner2-5-decide-and-open-source-competitors/).
- The category is real beyond jev-1.13: Liquid AI shipped a decision model called d1 that returns calibrated probabilities across a fixed outcome set with zero generated tokens (weak, weight 0.13: https://www.marktechpost.com/2026/09/29/liquid-ai-releases-d1-a-decision-model-that-returns-calibrated-probabilities-with-zero-output-tokens/), and Upstage exposes a decisions API described as structured classification, scoring, and yes-or-no decisions (weak, weight 0.48: https://decisions-api.dev/models).

The pattern across these sources: the value of a decision model is the output contract. A generative model returns text that code must parse and trust; a decision model returns a bounded, typed answer with a probability attached, so the calling code branches on numbers instead of strings.

## What this means for users of the skill

When you reach for defapi-jev, you are deliberately giving up expressiveness for reliability. The model will never draft the reply, explain its reasoning, or summarize the ticket. It returns the label and the number. Everything expressive stays with your chat model; everything decision-shaped goes to jev-1.13.

Three practical consequences follow from the source doc's framing:

1. The state you send is the whole world the model sees. If a fact matters to the judgment, it must be in the state; the model cannot go look it up.
2. The question types constrain what you can ask. Yes/no, pick-one, and ordered-scale are the entire vocabulary. If your decision needs a free-form answer, this is the wrong tool.
3. Probabilities are first-class outputs, not decoration. Downstream code should read them and act on thresholds, which the acting-on-results doc in this corpus covers.

The corpus's own minting run confirms the interface shape in practice: a single POST to the decisions endpoint carrying a state name and a batch of typed questions returned an answers object keyed by question name, each answer carrying its typed fields plus a confidence, alongside usage tokens and a consumed cost string. One request, many decisions, zero prose in the response.

## Where decision models sit in a pipeline

Triage pipelines are the natural host. A 2026 workflow guide describes every queue as a classification problem in disguise: support tickets, security alerts, inbound emails, contracts, and feedback all need a decide-what-it-is step repeated hundreds of times a day, and that step, not the handling, is the expensive part (weak, weight 0.15: https://agentmelt.com/workflows/capabilities/classification-and-triage/). Routing systems in higher-stakes domains follow the same shape; a clinical assistant platform described in 2025 combines structured dialogue flows with LLM agents for patient-to-specialist routing and severity assessment, with the structured layer carrying the deterministic decisions (weak, weight 0.34: https://arxiv.org/html/2510.02463v1).

jev-1.13 is the structured layer for yubiOS work. The source doc positions it for ticket triage, routing, go/no-go gates, moderation flags, and priority scoring, which are exactly the high-volume bounded judgments the external sources describe. The rest of this corpus covers how to call it, how to shape questions, and how to act on what comes back.
