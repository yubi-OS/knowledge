# The evidence standard: why 10/10 is not established

Scope: what the audit counts as evidence for a real-edit success rate, why the Addendum 12 rungs are not independent graded trials, the EnvHarness discipline the comparison needs, the frozen held-out benchmark design, and the limitations that keep the release unlabeled.

## The verdict, stated plainly

The engineering defects in the Cloudflare wayfinder were repaired and exercised on the entire pinned refs corpus. A 10/10 real-edit success rate is not established. The original Addendum 12 reported 2 kept rungs, 5 reverted rungs, and 1 declined destructive suggestion over 10 map runs. Those are run outcomes, not 10 independent graded edit trials: the runs were not pre-registered tasks with acceptance predicates and independent grading. The audit's rule is that passing software tests must not be substituted for predictive usefulness.

## What the test suites do establish

The verification that exists is real but bounded:

1. Local numerical suite: 57 passed, including the real 301x24 embedding fixture, identity-failure mutation tests, malformed frames, and no-op correspondence.
2. API suite: 36 passed, with provider and database boundaries behind explicit test doubles. One entry is an explanatory capacity marker, not an independent scientific assertion, and is counted as such.
3. Archive suite: 10 passed.
4. No skipped assertions in any of these runs.
5. Browser: the synthetic cloud rendered with zero page errors; comparison-unavailable handling and path-injection escaping were exercised.
6. Live: assets and health endpoints returned 200 after deployment propagation; rejection checks returned the designed 422 and 409 codes.

These establish that the instrument behaves as specified. They do not establish that an edit the map recommends will be useful to a real task, which is a different and unproven claim.

## The EnvHarness discipline

EnvHarness contributes an experimental discipline, not a benchmark number. The audit specifies the comparison conditions: use the same task, model, budget, and frozen verifier across untreated, original-wayfinder, and corrected-wayfinder conditions. Key caches on every measurement-changing input. Separate candidate-generation and curriculum scores from final task success. Record provider errors and 429 truncation separately from incorrect solutions. The final clause matters: EnvHarness benchmark success rates do not transfer to this corpus. Only the discipline transfers.

## The remaining path to a credible high usefulness score

The audit defines the experiment that has not been run:

1. Freeze a held-out edit benchmark before seeing outcomes: literal target files, factual acceptance predicates, preservation constraints, model and budget, and a blinded grader.
2. Compare v0.1, v0.2, and an ordinary source-inspection baseline on identical tasks.
3. Report useful-edit rate, factual regressions, abstentions, and cost separately, with uncertainty.
4. Learn or validate the semantic proposal layer from those outcomes. Geometry alone does not supply it.

Pre-registration discipline is the external anchor here: a benchmark run published as two content moments, the pre-registration and the results, with cumulative counts only and no interim conclusions until the pre-registered endpoint (https://github.com/TKCollective/agentoracle-benchmark-a-b/blob/main/docs/pre-registration.md, weight 0.779). Weaker-backing sources point the same direction: blinded evaluation fails quietly when "the blind leaks" and nobody measures whether it held (https://github.com/cogpros/cold-read, weight 0.308, weak), and governed grading pins judges to bytes with hash-sealed receipts (https://www.yylo.dev/guides/blinded-grading-for-coding-agent-output, weight 0.357, weak). On the test-versus-evidence boundary, long-horizon agent work reports test pass rate as a benchmark artifact rather than as proof of usefulness (https://arxiv.org/html/2609.01481, weight 0.380, weak), and evaluation architecture sources separate benchmark metrics per training phase rather than reading any one number as a task verdict (https://jianyuh.github.io/llm/evaluation/systems/2026/06/12/LLM-Evaluation-Architecture.html, weight 0.517).

## The explicit limitation list

The release is not labeled 10/10 for enumerated reasons:

1. Task-quality calibration is unmeasured.
2. Finite-chain mixing at K=40 is not established for every corpus (doc 07).
3. Named-set comparison currently covers CHANGE; ADD and REMOVE set changes are not-tested.
4. Binary placement can hide small real semantic changes (doc 03).
5. Public saved maps share storage.
6. Chunk pooling is lossy (doc 02).
7. Embedding model alias revisions require deliberate rebaselining.

Each limitation is a reason a successful test run could still fail a usefulness trial. The list is the difference between an instrument that is honest about its repairs and an instrument that claims victory.

## Standing status

A later drift check (2026-09-18, wayfinder round 8, cycle 47) re-verified this record as the standing operating-evidence doc for pointmap/0.2, adding placements and ledger rows on top of it without changing its boundary claims. The live API document and map UI remain published (https://steady-orbit.systems-a.workers.dev/AGENT.md, https://steady-orbit.systems-a.workers.dev/map/). The release lives in tools/point-map/ and targets Cloudflare, with the legacy FIT API and the Sauna-hosted mirror kept separate.
