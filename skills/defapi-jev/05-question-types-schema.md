# 05. Question types: noul, choice, and score

Scope: the three question types, their criteria shapes, and the answer fields each returns, including the response envelope observed during this corpus's own minting calls.

Internal-record subtopic, no dig: the type system comes from the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md. The observed response envelope comes from this corpus's own authenticated calls to the DefAPI decisions endpoint during minting, recorded in research-db/jev-log.json.

## The type table

The source doc defines exactly three types, and its table is the contract:

| type | use for | criteria | answer fields |
|---|---|---|---|
| noul | yes/no | optional {"true": "...", "false": "..."} | noul: probability of true, 0 to 1 |
| choice | pick exactly one | required {option_key: description} | choice, probabilities, confidence |
| score | ordered scale | required list of 2 to 10 levels, lowest first | score (probability-weighted, 0 to levels-1), legend, probabilities, confidence |

Three structural facts fall out of the table:

1. **Criteria are optional only for noul.** A noul question works bare, but the source doc's writing-good-questions guidance says to always fill in noul criteria when "true" could be read more than one way. For choice and score, criteria are required: a choice question without option descriptions has no way to distinguish overlapping options, and a score question without levels has no scale.
2. **Choice keys are code values.** The option keys are what your code receives in the answer's choice field. Descriptions are for the model; keys are for your switch statement.
3. **Score levels are bounded and ordered.** Two to ten levels, explicitly lowest first. The order is not presentation, it is semantics: the returned score is computed from the level indexes.

## What each answer looks like

**noul.** The answer carries the probability of true as a number from 0 to 1. Observed during this corpus's weighting calls, a noul answer returned as an object with the question type and the probability, for example {"type": "noul", "noul": 0.57}. The value is the weight a caller acts on: the acting-on-results doc covers thresholding it.

**choice.** The answer carries the chosen option key, the full probabilities map across options, and a confidence. The probabilities map is the audit trail for the choice: if the top two options are within noise of each other, the confidence field is where that shows up, and the acting-on-results doc's rule is to route low-confidence choices to review.

**score.** The answer carries the score, the legend (level index to level label), the probabilities across levels, and a confidence. The score deserves its own paragraph, because it is the type most often misread.

## The score is a probability-weighted average, not a rounded label

The source doc is explicit: the returned score is a probability-weighted average of the level indexes, so it can fall between levels. Its own example is 1.84 on a 0 to 2 scale. The minting run that produced this corpus observed the same shape live: an outline-validation call on a 3-level scale returned scores like 1.51, 1.77, 0.95, and 0.76, each with a probabilities map (for example {0: 0.19, 1: 0.10, 2: 0.71}) and a confidence.

Two consumption rules follow, both from the source doc:

- Round the score only if your consumer is a human reading a number. If a single level must be chosen programmatically, use argmax(probabilities), which picks the level with the highest probability mass rather than the averaged value.
- The legend maps index back to label, so 1.84 on the demo scale (Can wait, Fix this week, Blocking revenue) is a number closer to Blocking revenue than to Fix this week, not a new level you have to define.

## The response envelope

Observed across every call this corpus made to the decisions endpoint (1 outline request plus 5 weighting batches, all recorded in research-db/jev-log.json), the envelope is stable:

- `model`: the concrete model version served (observed: typesafe/jev-1.13-20260917).
- `answers`: the map from question name to answer object, each carrying its type.
- `usage`: input_tokens and output_tokens, plus a cost figure.
- `id`: the generation id of the call.
- `provider`: observed as TypeSafe.
- `task_id`: the task identifier for auditing (the source doc instructs callers to log it).
- `consumed`: the cost in USD as a string (the source doc names this field for spend tracking).

Two envelope-level notes for integrators. First, the answers map is keyed exactly by the question names you sent, so batching questions with stable names (r01, r02, ... in this corpus's own run, or is_bug, team, urgency in the source doc's example) is what makes response handling mechanical. Second, usage and consumed are per-request, not per-question, so cost accounting in a batch pipeline divides the request cost across its questions or tracks per-request cost as the unit.

## Choosing a type

The when-to-use doc in this corpus maps workloads to types: binary gates to noul, routing to choice, prioritization to score. The type table adds the tiebreaker: if you are about to fake a scale with three boolean questions, use score; if you are about to fake a yes/no with two choice options, use noul. The types exist so the answer arrives in the shape your code branches on.
