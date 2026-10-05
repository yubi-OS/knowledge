# 06. Corpus Hygiene That Changed the Fit

**Scope:** The data hygiene steps that moved the fit from v2 to v3: filtering .gitkeep placeholder artifacts and hand-classifying 14 borderline artifacts with per-override rationale.

## Filtering placeholders: 213 to 211

The v2 corpus counted 213 artifacts: 62 skills, 92 refs docs, 26 workflows, and 33 ADRs. Two of them were .gitkeep files, which carry no content and scored zero on every primitive column. They were placeholders, not artifacts, and the fit was reading them as genuine zero-coverage artifacts. Filtering them brought N to 211, the corpus size every later number in the flow depends on ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted).

This is a standard curation failure mode: automated collection sweeps in structural placeholder files that look like data points but carry no signal. Dataset curation guidance stresses that cleaning and filtering the collected set before modeling is what makes downstream metrics meaningful (https://www.lightly.ai/blog/data-curation, jev weight 0.313, weak backing; https://atlan.com/data-curation-in-machine-learning/, jev weight 0.355, weak backing), and the Kaggle dataset platform exists largely because curation quality is the first-order variable in any dataset (https://www.kaggle.com/datasets, jev weight 0.653).

## Hand-classifying the 14 borderline artifacts

The keyword dictionaries under-counted 14 skills, including docker-login-action, frontend-ui-engineering, systemd-v262-audit, and ADR-024. The v3 fit hand-classified these 14 artifacts and saved the result as manual coverage overrides in session/cache/v2-corpus/manual_coverage_overrides.json, with a per-override rationale so the correction is auditable rather than a silent edit ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

The pattern is the standard one of human review over automated labeling: heuristics label fast at scale, and humans correct the cases the heuristic gets wrong. Material on heuristic labeling functions for annotation at scale describes this exact division of labor (https://www.labelvisor.com/creating-heuristic-labeling-functions-to-automate-annotation-at-scale/, jev weight 0.409, weak backing), and comparisons of manual versus automated labeling discuss when human review earns its cost (https://www.ayadata.ai/manual-vs-automated-data-labeling/, jev weight 0.349, weak backing).

## Why both steps mattered to the metrics

The v2 fit's holdout R-squared of +0.183 was already a pass, but its inputs contained 2 fake artifacts and 14 under-counted artifacts. v3 cleaned both and the holdout R-squared more than doubled to +0.4655. The flow doc does not claim the cleaning alone caused the jump, since the 2-D surface changed at the same time, but the hygiene steps are prerequisites for trusting anything the fit says about specific artifacts: an artifact list that includes git keep files cannot produce an honest coverage map ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

## Weak-source notes

The external grounding in this subtopic's dig is mostly generic curation and labeling material, several pieces below the 0.5 authority threshold, and none of it is load-bearing. The load-bearing facts are internal to the flow doc. One result was a completely unrelated consumer-manuals page (jev weight 0.062), recorded in the archive only as evidence of query drift.
