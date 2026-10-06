# 06. Writing good questions

Scope: how to shape the state, the instructions, and the criteria so the model judges what you meant to ask.

Grounding spine: the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md. External corroboration comes from this subtopic's searXNG dig; weights below 0.5 are labeled weak.

## The source doc's five rules

The source doc's writing-good-questions section gives five rules, and they cover the whole request:

1. **Put everything the model should judge in the state.** Structured JSON usually works better than one long string: fields like tier, history, and amounts give the model clean facts to weigh, rather than prose it has to reconstruct facts from. This is the single highest-leverage rule, because the state is the model's entire world (see the decision-model doc in this corpus).
2. **Keep instructions to one clear question.** A question object asking two things gets a compromise answer to both. One instructions string, one decision.
3. **Make choice options mutually exclusive and describe each one.** The key is what your code receives, so the key should be a stable code value, and the description should be the only place the distinction between overlapping options lives.
4. **Order score levels from least to most.** The returned score is a probability-weighted average of the level indexes (the source doc's example is 1.84 on a 0 to 2 scale), so reversed levels produce reversed scores. Round it, or use argmax(probabilities) when you need a single level.
5. **Always fill in noul criteria when "true" could be read more than one way.** A bare yes/no invites the model to pick its own definition of true; the criteria {"true": ..., "false": ...} pin the definition.

## What the dig adds

The dig corroborates the rules and adds context, mostly weakly backed (weights are given per claim):

- Prompt engineering is treated in the literature as an empirical, ad hoc practice lacking a standardized framework, with models highly sensitive to input formulation and context management; this is the published survey context behind the source doc's insistence on pinning definitions explicitly (weight 0.57, high: https://www.sciencedirect.com/science/article/pii/S1574013726000870).
- A 2026 arXiv study on classification prompts found that increasing prompt context sometimes decreases accuracy, with substantial heterogeneity across models and tasks, underlining the need to validate each task individually rather than rely on general rules (weight 0.43, weak: https://arxiv.org/abs/2603.25422). Read against rule 1, this cuts both ways: more state is not automatically better, so include the discriminating fields and validate.
- Classification prompt guides converge on mutually exclusive labels with one-line definitions and explicit tie-break rules (weight 0.21, weak: https://feluda.ai/prompt-engineering/prompt-engineering-for-classification; weight 0.11, weak: https://anthropiccertifications.in/blog/prompt-engineering-structured-output-ccar-domain-4).
- Common template advice for classification prompts lists the blocks a reliable prompt needs: defined labels, classification rules, edge-case rules, an ambiguity policy, and a confidence contract (weight 0.14, weak: https://newprompt.net/resources/text-classification-prompt). Mapped onto jev-1.13, the labels and rules become the choice criteria, the ambiguity policy becomes the escalation threshold, and the confidence contract is the confidence field the API returns natively.
- One practical template suggests a closed label list plus an explicit "other" label for inputs that do not fit (weight 0.10, weak: https://aipromptshub.co/blog/how-to-write-prompts-for-classification). In jev-1.13 terms: if no choice option is a good answer, add an option whose key is "other" rather than hoping the model picks the least-bad fit.

The dig's overall verdict on this subtopic: the source doc's rules are the standard practice, stated compactly, and the external literature mostly adds the caution that prompt formulation effects are task-specific and need empirical validation.

## Worked application of the rules

Applying the rules to a concrete question set (drawn from the source doc's own example, expanded):

- State: {"ticket": "Card declined at checkout but bank says charge is fine.", "tier": "enterprise", "attempts": 3}. Structured, one record, the discriminating facts included.
- is_bug (noul): instructions "Is this likely a product bug rather than user error?" with criteria true "Behavior contradicts expected system function" and false "Caused by user input or an external party". The criteria matter here because "bug" could be read as "anything broken", and the false criterion explicitly absorbs external-party failures.
- team (choice): options account (login, permissions, profile), frontend (rendering or layout), payments (checkout, billing, payment processing). Mutually exclusive by subsystem, descriptions name the boundaries.
- urgency (score): "How urgent is this?" with ["Can wait", "Fix this week", "Blocking revenue"], lowest first. Note the top level names the stake, not the emotion: "Blocking revenue" is checkable, "very urgent" is not.

A question that would fail the rules: instructions "What should we do about this ticket, and who should do it, and how quickly?" Three questions in one instructions string, no type that could carry the answer, and no criteria. The fix is to split it into the three typed questions above.

## Cost of getting it wrong

The failure modes of bad questions are quiet, not loud: the API still returns a well-typed answer, but the answer judges a different question than the one you meant. A bare noul returns a probability for an unspecified reading of true. Overlapping choice options return a coin-flip confidence you will discover only when you look at the confidence field. Reversed score levels return a score that is confidently wrong in the opposite direction. All of these pass schema validation, which is why the writing-good-questions rules are review criteria for the request document, not runtime errors to catch later.
