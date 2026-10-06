# 04 CI dispatch and verification

Scope: how the recipe is exercised in CI: dispatching the VM test workflow, its inputs, and the rule that a conclusion must be read for SKIPs before it counts.

Grounding spine: source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Mechanism section (dispatch snippet).

## Dispatching the run

The recipe gives a concrete dispatch command against the GitHub API:

```bash
IMG=docker.io/0mniteck/yubios:dev-<short-sha>   # or an immutable @sha256 digest
curl -sS -X POST \
  "https://api.github.com/repos/yubi-OS/yubiOS/actions/workflows/ci_test-vm.yml/dispatches" \
  -H 'Accept: application/vnd.github+json' \
  -d "{\"ref\":\"main\",\"inputs\":{\"image\":\"${IMG}\",\"hw_device\":\"\",\"allow_real_u2f\":\"false\"}}"
```

(source doc)

Three things are pinned by this call:

1. The workflow is `ci_test-vm.yml`, triggered via the workflow-dispatches endpoint.
2. The `image` input selects the built image under test, by moving tag `dev-<short-sha>` or better by an immutable `@sha256` digest (source doc).
3. The `hw_device` input is passed empty and `allow_real_u2f` is `false` (source doc). Together these select the software lane: no physical device, and the real-key guard stays closed. This is the CI-side expression of the scope boundary in doc 01 and the guard rules in doc 06.

Manual workflow dispatch is a standard GitHub capability: the "Manually running a workflow" documentation covers triggering a workflow via workflow_dispatch with inputs (weak backing, 0.17: https://docs.github.com/en/enterprise-server@3.1/actions/managing-workflow-runs/manually-running-a-workflow).

## The verification rule: read the inner run and its skips

After dispatching, the recipe's verification instruction is: verify the INNER run and read for SKIPs, not just `conclusion=success` (source doc). Two layers make this necessary:

- The dispatch response only says the workflow was queued. The evidence lives in the specific run and job it creates.
- A workflow can report success while assertions were skipped. The playbook's own words: "lane green but assertions skipped" is a real symptom row, and "success with skips is not coverage" (source doc). The guard mechanism that produces those skips (a physical key attached to the host) is documented in doc 06.

This is why the evidence record in doc 07 is stated the way it is: run 30139433902, job 89629762908, "with no skips". The "no skips" qualifier is the actual proof; the conclusion field alone would have proved nothing beyond "nothing crashed".

## Inputs as the contract

The three inputs (`image`, `hw_device`, `allow_real_u2f`) form the contract between the recipe and the workflow: the image identifies what was tested, and the two device inputs record which lane ran (source doc). A software-lane run always has `hw_device` empty and `allow_real_u2f` false; a hardware-in-the-loop run would differ, and that difference is part of the evidence, not an implementation detail. When comparing historical runs (doc 09 lists several), the input values are what tell you which lane the run actually exercised.

## Dispatch semantics and failure modes

The workflow-dispatches endpoint queues a run and returns without a run id, so the caller must locate the run it created before it can verify anything. The GitHub documentation treats manual dispatch as a first-class trigger, with the same input model as any other event (weak backing, 0.17: https://docs.github.com/en/enterprise-server@3.1/actions/managing-workflow-runs/manually-running-a-workflow).

The skip problem the recipe guards against has a general form: a job whose condition evaluates to false is reported as skipped, and a downstream consumer that only looks at the final conclusion can misread a workflow full of skipped jobs as a pass (weak backing, 0.08: https://buglyst.com/learn/symptoms/clarity-github-actions-job-skipped). The playbook's countermeasure is procedural rather than technical: open the inner run, scan for skip lines, and require zero of them before the run counts as evidence (source doc). In this lane, the skips are not random; they are the deterministic output of the real-key guard, which is exactly why they are meaningful and why "success with skips is not coverage" (source doc).

## Practical sequence

The operational recipe is therefore: build or select the image, note its digest or short sha, dispatch `ci_test-vm.yml` against `main` with the software-lane inputs, wait for the run, then open the run's jobs and scan the logs for skip lines before accepting any conclusion (source doc). Only then does the run count as evidence for the chain in doc 03.
