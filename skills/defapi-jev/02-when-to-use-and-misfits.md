# 02. When to use defapi-jev, and when not to

Scope: the fits and misfits the skill draws, so callers pick the right tool before wiring anything.

Internal-record subtopic, no dig: the entire decision boundary lives in the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md, and every claim below is attributed to it.

## The five good fits

The source doc lists five good fits, and they map one to one onto the question types and the request model.

1. **Triage and routing.** Deciding which team, queue, or category a ticket, email, or log entry belongs to. This is a pick-exactly-one problem, so it maps to the choice question type.
2. **Gating and go/no-go checks.** Is this deploy safe, is this refund eligible, does this contain PII, is this spam. These are binary judgments, so they map to the noul question type, which returns the probability of true.
3. **Prioritization.** Urgency, severity, lead quality, and risk level sit on an ordered scale, so they map to the score question type with levels ordered from least to most.
4. **Batch labeling.** Running the same question set over many records to get consistent, comparable outputs. Because the questions are typed and the answers are probabilities, 100 records scored with the same question set produce comparable numbers, which a pile of free-text LLM summaries cannot.
5. **Several decisions at once.** One request can ask multiple questions about the same state. A single support ticket can be judged for is-this-a-bug, which-team-owns-it, and how-urgent in one call, and the answers arrive keyed by question name.

The first four are the classic decision-shaped workloads; the fifth is the efficiency multiplier that makes batch pipelines cheap, because one HTTPS round trip covers a record's entire decision set.

## The four misfits

The source doc is equally explicit about what not to use it for.

1. **Generating, summarizing, rewriting, or explaining text.** It returns no prose. If the deliverable is text, this is the wrong tool by construction, not by tuning.
2. **Open-ended questions without a fixed set of answers.** Every question needs a bounded answer space: two options, a fixed option set, or a fixed scale. If the answer space is undefined, the question type system has nothing to hold onto.
3. **Factual lookups or anything needing current external data.** The model judges the state you send it. It cannot browse, query a database, or check the weather. If the judgment depends on a fact you have not put in the state, you will get a confident answer about incomplete information.
4. **Final authority on high-stakes outcomes.** Legal, medical, financial, and HR decisions are named explicitly. The source doc's instruction is to use the probability as a signal and keep a human in the loop. The model constrains attention, it does not sign off.

## How to use the boundary in practice

The fits and misfits share one underlying test: is the output a bounded judgment that code will act on? If yes, defapi-jev fits. If the output is prose, an unbounded answer, or a fact from the outside world, it does not.

The boundary also implies a division of labor inside a single workflow. A support pipeline might use a chat model to draft the customer reply and defapi-jev to decide the queue, the urgency, and whether the ticket looks like a bug. The drafting and the deciding are different jobs with different failure modes, and the skill's positioning is that they should not be done by the same model.

For high-stakes outcomes, the practical reading of the source doc is a two-layer design: jev-1.13 produces the probability, and a threshold policy routes the middle band to a human. The acting-on-results doc in this corpus develops that threshold pattern, which the source doc introduces with its 0.8 auto-act and 0.3 to 0.8 escalation example.

Finally, the misfits double as a checklist for code review. Any integration that sends jev-1.13 a request expecting prose back, an open-ended answer, live data, or an autonomous final decision is using the skill against its own documentation, and should be reworked rather than worked around.
