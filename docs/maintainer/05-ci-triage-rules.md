# CI Triage Rules

Scope: the five rules the maintainer playbook prescribes for triaging CI failures on yubiOS. Internal-record subtopic, no dig: the rules are stated in the source doc (yubi-OS/yubiOS docs/MAINTAINER.md) and unpacked here.

## Rule 1: retry only likely-transient failures

Retry only likely-transient failures and avoid retry loops (source doc). The rule splits the retry decision into a judgment and a guardrail. The judgment: was the failure transient in nature, such as a network hiccup or a flaky dependency fetch, or did it fail for a reason that will reproduce identically on every run? The guardrail: even a legitimate retry must not become a loop. An automated retry loop converts one failure into a sustained resource burn and hides the fact that something is deterministically broken.

## Rule 2: deterministic failures become fixes or blockers

Deterministic failures should become fixes or documented blockers (source doc). There are exactly two honest endings for a failure that reproduces: the code or configuration gets fixed, or the failure is written down as an active blocker in `BLOCKERS.md` (per the source-of-truth map). What is ruled out is the third ending that unmanaged CI drifts toward: the failure persists, unrecorded, while everyone routes around it.

## Rule 3: old-sha reruns do not validate main

Old-sha reruns do not validate current `main` (source doc). A green rerun of a workflow at an old commit says nothing about the current head. This rule guards against a tempting shortcut when a branch is failing: rerun an older, greener run and cite it as evidence. The playbook closes that door explicitly. Validation evidence, as required by the PR landing bar, has to be attached to the commit being proposed.

## Rule 4: trigger edits stay narrow and path-scoped

Workflow trigger edits should be narrow and path-scoped (source doc). Trigger changes alter when CI runs, and an over-broad trigger edit either floods the pipeline with unnecessary runs or, worse, quietly stops a workflow from running on the paths it was built to protect. Keeping the edit narrow means the change in CI behavior is reviewable and reversible, and scoping it by path keeps it proportional to the work that motivated it.

## Rule 5: outcomes land in the motivating issue or PR

CI outcomes should be summarized in the issue or PR that motivated the work (source doc). This is the same closure discipline the research cycle applies at its last step (open a PR, merge when appropriate, and create or update an issue with the outcome). A CI result that lives only in the Actions tab is invisible to the person waiting on the change; a summary in the motivating thread makes the outcome part of the decision record.

## The rules as one posture

Taken together the five rules describe a maintainer who treats CI as an evidence source, not an oracle: evidence is retried only when plausibly transient, recorded when deterministic, attached to the right commit, gathered with minimally invasive triggers, and reported where the decision is being made. The posture complements the release-hygiene rules, which extend the same evidence discipline to releases: a release path must cite the branch, commit, workflow run, and artifact or tag it shipped from.
