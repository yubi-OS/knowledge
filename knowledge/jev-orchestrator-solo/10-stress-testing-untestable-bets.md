# Stress-testing the winner and the untestable bet

Scope: the adversarial critique recorded against the winning design (the audit-log-with-ambitions objection), and how the framing log handles the one bet it cannot test cheaply.

## The stress-test entry

The framing log closes its generation log with a stress-test critique of the winner, recorded in the log itself rather than in a separate review:

- Critique: "a thin controller that still trusts the caller to define its own tools is just an audit log with ambitions."
- Counter: "the gate validates the task's declared tools against the versioned policy doc before any dispatch; callers cannot invent scopes at call time."

The critique targets the actual weak point of the V1+V5 hybrid: thinness. If callers define their own tool vocabulary at call time, the controller's gate has nothing to check against and the whole design degenerates into an event recorder. The counter works because the policy doc is versioned and the gate records which version it enforced, so the set of admissible tools is closed at dispatch time. The exchange is recorded verbatim in the log, which is what makes it a stress test rather than a reassurance.

## The premortem pattern

The structure of that exchange, assume the winning design has failed and name the cause, is the premortem: a managerial strategy in which a project team imagines that a project or organization has failed and works backward to the causes (https://en.wikipedia.org/wiki/Pre-mortem, jev weight 0.44, weak backing). Practitioner descriptions make the motivation explicit: optimistic planning hides the risks that sink decisions, and the premortem flips the question by assuming the decision has already failed, then working backward to why (https://capabilityfx.com/insights/the-pre-mortem, jev weight 0.22, weak backing). Applied retrospective descriptions frame it as a forensic audit of the future, identifying causes of death before launch (https://andrewgaiagrant.substack.com/p/how-to-use-a-premortem-to-stress, jev weight 0.22, weak backing).

What distinguishes a recorded premortem from a worry list is that the critique arrives with a counter that changes the design or a mitigation that changes the rollout. The framing log has both: the gate counter closes the tool-invention hole in the design, and the mitigation below changes the rollout plan.

## The untestable bet

The log names exactly one un-testable bet: "that Jenny will actually route real automations through it rather than keeping ad-hoc flows." This is the adoption assumption, and the log classifies it honestly: it cannot be settled by the scoring rubric, the gate, or the schema. Its mitigation is a proof by construction: ship one real automation on it (the Inbound Lead Workflow v1, which the source diagram references) as the demonstration.

Assumption-management literature backs the classification. Assumption taxonomies distinguish assumption types by how they can be tested, and treating desirability or adoption assumptions as if they were mechanical ones is the common failure (https://blog.logrocket.com/product-management/4-types-of-product-assumptions-how-to-test/, jev weight 0.50, weak backing). Validation guidance emphasizes identifying, prioritizing, and testing the assumptions behind a decision before building the wrong thing (https://www.getproductpeople.com/blog/how-to-test-product-assumptions-before-building-features, jev weight 0.46, weak backing; a framework-oriented version at https://www.koji.so/docs/assumption-testing-guide, jev weight 0.20, weak backing). The framing log follows the priority logic: it validates cheap mechanical assumptions first (policy expressible as one JSON doc plus about 10 predicates; 20 sample tasks through the classifier; one real automation expressed as fetch calls only; a 100-row D1 append burst under 5 seconds), and it does not pretend the adoption question can be answered by any of them.

## Why one untestable bet is the right count

A framing log that listed five untestable bets would be admitting the scoring pass missed the real risks. The jev log's list of testable assumptions covers the mechanical surface almost completely: gate expressiveness, classifier routing quality, tool-sufficiency of outbound HTTP, and storage write pattern. The only residual uncertainty is behavioral (will the owner use it), which is the correct residual for a solo-run design exercise on the owner's own infra. The mitigation, ship one real automation, is also the cheapest possible test: it converts the bet from a prediction into a demonstration, and if the automation stays on the orchestrator, the bet is resolved without any additional instrumentation.
