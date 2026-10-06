# 04. How to call it: CLI and Python

Scope: the two calling interfaces the skill ships, with the request shapes both share.

Internal-record subtopic, no dig: the interfaces come from the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md, and every claim below is attributed to it.

## The shared request shape

Both interfaces take the same document: an object with a `state` and a `questions` map. The state is the thing being judged, as a string or a structured object. The questions map keys each decision by a name you choose, and each question object carries a `type`, an `instructions` string, and (when the type requires or benefits from it) a `criteria` payload. The question types themselves are covered by the question-types doc in this corpus.

Because the question names are caller-chosen keys, the answers come back keyed the same way: you read `answers[<question_key>]`, so a batch of questions returns a batch of named answers you can address by name rather than position.

## The CLI

The CLI accepts a JSON file path, or a dash for stdin:

```bash
python scripts/defapi_jev.py request.json
echo '{"state": "...", "questions": {...}}' | python scripts/defapi_jev.py -
```

The stdin form is the one-liner path: build the JSON with jq, a heredoc, or an inline echo, pipe it in, and the script posts it. The file form suits checked-in request fixtures and CI, where the request document is a reviewable artifact rather than an ad-hoc string.

The CLI inherits everything from the client contract: it reads DEFAPI_API_KEY from the environment, validates questions before sending, posts to api.defapi.org, and raises on HTTP errors. Setup for that contract is covered by the setup-and-client doc in this corpus.

## The Python interface

For in-process callers, the script exports a `decide` function. The source doc shows the import idiom and a full example:

```python
import sys; sys.path.insert(0, "scripts")
from defapi_jev import decide
```

The example is worth reproducing in compressed form because it demonstrates all three question types against one state. The state is a structured ticket record:

```python
state={"ticket": "Card declined at checkout but bank says charge is fine.", "tier": "enterprise"}
```

Against that state, three questions run:

- `is_bug`, a noul question: "Is this likely a product bug rather than user error?" with criteria for true (behavior contradicts expected system function) and false (caused by user input or an external party).
- `team`, a choice question: "Which team should own this?" with three options, account (login, permissions, profile), frontend (rendering or layout), and payments (checkout, billing, payment processing).
- `urgency`, a score question: "How urgent is this?" with three levels ordered from least to most: Can wait, Fix this week, Blocking revenue.

Three lessons sit in that example:

1. **One request, one record, several decisions.** The example asks three independent questions about the same ticket in one call. That is the several-decisions-at-once pattern the source doc lists as a good fit, and it works because the answers object is keyed by question name.
2. **The state carries the discriminating facts.** The tier field (enterprise) sits in the state next to the ticket text, and the source doc's writing-good-questions section confirms that structured fields like tier, history, and amounts usually work better than one long string. The triage question "is this bug or user error" and the ownership question "which team" can both weigh the ticket text, while urgency can weigh the tier.
3. **Criteria do double duty.** The noul criteria disambiguate what "a product bug" means, the choice criteria describe each option so the model can distinguish overlapping queues, and the score criteria name each rung on the scale. The keys you choose (account, frontend, payments) are exactly the values your code will receive.

## Choosing between the interfaces

Both interfaces hit the same endpoint with the same document, so the choice is about ergonomics, not capability. Rules of thumb that follow from the source doc's examples:

- Shell, CI, and one-off checks: the CLI with a file or stdin. It keeps the request as data and needs no import path setup.
- Services, batch loops, and anything that already runs Python: the `decide()` function, called directly with the state and questions as native dicts. The import idiom above is the whole setup.
- Anything producing many records: whichever interface your loop is written in; the questions object stays identical per record, which is what makes batch outputs comparable (the batch-labeling fit from the when-to-use doc in this corpus).

## What both interfaces guarantee

Reading the two code samples together, the guarantees are: the request is a plain JSON document (so any language can produce it), the response answers are keyed by caller-chosen question names, the criteria and instructions travel with the question so the decision is auditable from the request alone, and no local state accumulates between calls. The response fields you actually act on, thresholds, confidence, task_id, and consumed cost, are covered by the acting-on-results doc in this corpus.
