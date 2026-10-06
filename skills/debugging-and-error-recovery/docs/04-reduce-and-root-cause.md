# 04 - Reduce and Root Cause

Scope: Steps 3 and 4 of the triage checklist, building the minimal failing case, and fixing the underlying cause rather than the symptom, with the ask-why discipline that connects them.

## Step 3: Reduce

The source doc's Step 3 defines the minimal failing case as three simultaneous reductions:

- Remove unrelated code or config until only the bug remains
- Simplify the input to the smallest example that triggers the failure
- Strip the test to the bare minimum that reproduces the issue

The payoff the doc claims: a minimal reproduction makes the root cause obvious and prevents fixing symptoms instead of causes (source doc). Reduction is an instrument, not a deliverable; its job is to remove every confound between you and the defect.

The Stack Overflow help center formalizes the same artifact as the "minimal, reproducible example" (MRE), also called a minimal complete and verifiable example (MCVE), a minimal workable example (MWE), or a reprex, and states that people can help you better when you provide code they can easily understand and use to reproduce the problem (https://stackoverflow.com/help/minimal-reproducible-example, w 0.72). The community naming variation confirms the artifact is load-bearing enough to have accumulated four names.

The source doc's own boundary on this step: a bug you can reproduce but not reduce is still diagnosable, but every extra moving part you carry into Step 4 is a chance to fix a symptom.

## Step 4: Fix the root cause

The source doc's example pairs a symptom fix against a root-cause fix for duplicate user-list entries:

- Symptom fix (bad): deduplicate in the UI component with a Set spread over the user array
- Root cause fix (good): the API endpoint has a JOIN that produces duplicates; fix the query, add a DISTINCT, or fix the data model

The rule the example encodes: fix the underlying issue, not the symptom, and ask "why does this happen?" until you reach the actual cause, not just where it manifests (source doc). The manifestation point and the cause point are usually different layers of the same stack, which is why Step 2's layer localization feeds this step.

The ask-why loop is the five whys method from root-cause analysis practice, attributed to Sakichi Toyoda's industrial problem-solving tradition (https://larion.com/sakichi-toyoda-five-whys-root-cause-analysis/, weak backing, w 0.23). The method is a depth heuristic, not a depth guarantee: the source doc's version is bounded by evidence, since each why must be answerable from the preserved evidence of Steps 1 and 2, not from a plausible story.

## How the two steps interact

Reduction and root-cause search iterate. A reduction that stalls is often evidence that the suspected layer is wrong: if you cannot remove some code without the failure changing character, that code is probably in the causal path, and the "unrelated" label was the mistake. The source doc's ordering holds because reduction is cheap and reversible while root-cause fixes are the expensive, hard-to-reverse step that GUARD (Step 5) then locks in.

The common failure the doc's example guards against is the UI deduplication: it makes the visible artifact correct while the duplicate-producing query keeps running, so the bug survives at every other consumer of that endpoint. Root-cause fixes move the fix to the layer where the wrongness originates.
