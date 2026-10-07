# 08 Upstream Validation Workflow and AI Attribution

Scope: the mkosi upstream validation commands this skill inherits from mkosi's AGENTS.md, how to run them, and the Co-Authored-By attribution rule for AI-modified code.

## The validation block

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) carries a "Validation (from mkosi AGENTS.md)" block:

```bash
mypy mkosi tests kernel-install/*.install
ruff format mkosi tests kernel-install/*.install
ruff check --fix mkosi tests kernel-install/*.install
python3 -m pytest
```

This covers the three quality axes the upstream project gates on: static typing (mypy), formatting and linting (ruff format, ruff check), and unit tests (pytest). The scope set `mkosi tests kernel-install/*.install` tells you where the checks apply: the mkosi package itself, its tests, and the kernel-install plugin scripts.

## Running tests the upstream way

The upstream AGENTS.md documents the runner in its own words: see the "Hacking on mkosi" section in README.md for complete instructions; `bin/mkosi box -- pytest` runs all unit tests including linters and type checkers, and usual pytest options like `-k test_mypy` can be appended (weight 0.81, https://github.com/systemd/mkosi/blob/main/AGENTS.md). The same repo's README advertises the mkosi-kernel and systemd integration-testing workflows that these test targets belong to (weight 0.93, https://github.com/systemd/mkosi).

Practical reading of the two invocation forms:

1. The four-line block is the check list; `bin/mkosi box -- pytest` is the harness that runs the whole set inside mkosi's controlled box environment.
2. `-k test_mypy` style selection narrows a full run to one axis while iterating, then run the full harness before submitting.

This workflow is relevant to yubiOS whenever the pipeline or its configs touch mkosi itself, since the skill's Key Commands and Validation sections are both lifted from the upstream project's own developer contract (source doc).

## The AI attribution rule

The source doc states the rule per mkosi AGENTS.md:

```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

"Add to all commit messages on AI-generated/modified code. Human reviews before submission" (source doc).

General background on the mechanism: git supports multiple `Co-Authored-By:` trailers in a commit message, and using a co-author's GitHub email makes the commit count as a contribution by that author in GitHub's attribution interface (weight 0.15, https://mathspp.com/blog/til/coauthored-commits; weak backing, below the 0.5 threshold, mechanical corroboration only). A 2026 write-up describes the broader ecosystem practice of coding agents auto-adding `Co-Authored-By: Claude` trailers and how teams disable or embrace it (weight 0.05, https://www.explainx.ai/blog/claude-code-commit-co-author-attribution-disable-guide-2026; weak backing, labeled as weak).

The yubiOS posture from the source doc is the embrace-with-review variant: attribute every AI-touched commit, and keep a human in the loop before submission. This mirrors the doubt-driven-development discipline of subjecting agent-written changes to review before they land.

## When this workflow applies

- Any change to mkosi configs, profiles, or finalize scripts that mirrors upstream conventions (docs 01, 02, 05, 06).
- Any contribution or backport that touches the mkosi tree or `kernel-install/*.install` scripts.
- Any AI-assisted commit in the yubiOS pipeline, per the attribution rule (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (validation block, attribution rule)
- https://github.com/systemd/mkosi/blob/main/AGENTS.md (weight 0.81)
- https://github.com/systemd/mkosi (weight 0.93)
- https://mathspp.com/blog/til/coauthored-commits (weight 0.15, weak backing)
- https://www.explainx.ai/blog/claude-code-commit-co-author-attribution-disable-guide-2026 (weight 0.05, weak backing)