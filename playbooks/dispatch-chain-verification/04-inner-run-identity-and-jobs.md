# Inner run identity and jobs verification

Scope: the third mechanism step of the source playbook: for each inner run, confirm its identity and read its jobs, then report with the playbook's template so unverified items are named as unverified.

## Confirm identity first

The source doc's per-run step makes 2 calls for every inner run. The first hits `GET /actions/runs/{RUN}` and extracts the identity fields: id, name, path, event, head_sha, status, conclusion. The identity check matters because run listings mislead: a run surfaced under `?workflow=ci.yml` may be an inner-chain run, so the playbook requires reporting `name` and `path` together (06-log-expiry-and-listing-traps.md covers the listing trap in full). Reading `path` is what distinguishes the router run from the workflow it dispatched.

The external mechanism is GitHub's single-run endpoint, which returns 1 run object with exactly these fields (https://docs.github.com/en/rest/actions/workflow-runs, jev weight 0.95), inside the broader Actions REST API surface (https://docs.github.com/en/rest/actions, jev weight 0.94). GitHub organizes workflows and their runs as separate REST resources (https://docs.github.com/en/rest/actions/workflows, jev weight 0.93), which is why identity has to be confirmed from the run object itself rather than inferred from how it was found.

## Then read the jobs

The second call hits `GET /actions/runs/{RUN}/jobs` and extracts `total_count` plus each job's name and conclusion. This is the step that turns "the run finished" into "the run's jobs each reached a stated conclusion." The jobs endpoint is its own REST resource: a workflow job is a set of steps that execute on the same runner, and the REST API exists to view logs and workflow jobs (https://docs.github.com/en/rest/actions/workflow-jobs, jev weight 0.91). Job structure as a first-class concept within a run is documented in the workflow authoring docs as well (https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs, jev weight 0.95).

`total_count: 0` is not a benign value on a completed run. The source doc records that it is the structural symptom of a YAML parse failure: the run failed instantly at the parse stage, 0 steps executed, and the presentation is indistinguishable from a runtime failure. That indistinguishability is the danger: a listing row shows a failed run, the agent reaches for step logs, and the true cause, the workflow file never parsed, is invisible in logs because there are no steps. The playbook therefore changes the order of operations: check parse state before reading step logs, with a local check of the same commit's workflow file:

```bash
python3 -c "import yaml,sys;print('jobs:',list(yaml.safe_load(open(sys.argv[1]))['jobs']))" \
  .github/workflows/<file>.yml
```

If the file fails to parse locally, the run could never have executed a job, and the diagnosis is a file fix, not a log read. The recorded proof case is runs #48 and #49 of ci_test_sealed-uki-vm.yml, both of which "failed" instantly at the parse stage because of an unquoted colon in a step name, with 0 jobs; the real bugs were diagnosed from the file diff (08-recorded-failure-evidence.md). The dig for this trap returned 1 primary result, GitHub's troubleshooting documentation for diagnosing workflow failures (https://docs.github.com/en/actions/how-tos/troubleshoot-workflows, jev weight 0.93), plus 3 weak secondary results (weights 0.11, 0.13, 0.14, labeled weak) that agree in direction but cannot carry a claim on their own.

## The reporting template

The source doc fixes the report format so that verified and unverified cannot blur:

`<workflow-file>` run `<id>` (`name=`, `head_sha=`) -> `conclusion=`, jobs: `<job>=<conclusion>`; inner runs verified: `<id>(<path>)=<conclusion>`; **unverified:** `<listed explicitly>`.

3 properties of the template follow from the earlier rules. The file, id, name, and head_sha bind the claim to a specific run object, satisfying rule 1 of the Decision section (fresh evidence in the same turn, 02-verify-before-claiming-rules.md). The jobs list reports per-job conclusions, satisfying rule 2 (outer is not inner). The explicit unverified list operationalizes rule 4 (never fabricate): anything not verified by the 2 calls above must appear under unverified rather than being omitted or, worse, invented.

## Worked example from the record

The source doc's Verified working section cites smoke test run 30484718456 on commit 8b5b20b as a verified run: its success is the evidence that the `actions/checkout` v6 to v7.0.1 SHA bump was the real chain fix in PR #147. That run is cited with its id and its role in the chain fix, which is the template's shape applied to history: the id is real, the path is known, and the conclusion was read from the API, not assumed.

## Scope note

The 2 calls per run are the minimum verification unit of this playbook. Anything less, for example reporting a run's conclusion from a listing row without the identity check, or reporting "chain green" from the router run alone, is a recorded violation class (01-dispatch-router-semantics.md, 08-recorded-failure-evidence.md).
