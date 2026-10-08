# 07. Borrow-Intent Verification

Scope: step 6 of the workflow, the critical lesson: inspect the actual repo state before acting on research that recommends a code change.

## The rule

The source doc marks step 6 as a critical lesson (source doc): if the research surfaces "borrow" intent, for example "X does Y, yubiOS should adopt it", inspect the actual repo state before proposing code changes. The reason is stated inline: workspace skills may be stale relative to `yubi-OS/yubiOS` main. Documentation and code drift apart, and a research stream reading only docs inherits the drift.

## The worked example

The source doc gives a concrete case (source doc, step 6): the `mkosi-image-builder` skill claimed yubiOS does not have `SOURCE_DATE_EPOCH` pinned. But `scripts/lib/reproducible-build.sh` derives it from the commit timestamp, which is better than the "borrow" recommendation. The recommended fix already existed, in better form, in the repo.

The external sources confirm the substance of both sides of that example. The kernel's own reproducible-builds documentation states that if you are building from a git commit, you could use its commit date, and notes the kernel avoids `__DATE__` and `__TIME__` macros (https://docs.kernel.org/kbuild/reproducible-builds.html, weight 0.95; same content mirrored at https://docs.kernel.org/6.8/kbuild/reproducible-builds.html, weight 0.95). The `SOURCE_DATE_EPOCH` specification defines it as a standardized environment variable that distributions set centrally and build tools consume to produce reproducible output, specifying the last modification of something, usually the source (https://reproducible-builds.org/docs/source-date-epoch/, weight 0.82). The related timestamps guidance explains the deeper principle: with reproducible builds, recording the build time becomes meaningless; the source needs more accurate tracking than a timestamp (https://reproducible-builds.org/docs/timestamps/, weight 0.80). Deriving `SOURCE_DATE_EPOCH` from the commit timestamp is exactly the source-tracked approach those sources recommend, which is why the source doc calls the existing implementation "better".

## The redirect rule

When "borrow" turns out to be "already implemented better", the workflow redirects (source doc, step 6): document the discovery as a refs/ note rather than adding redundant code. This is a first-class outcome of the research, not a failure of it. The refs/ note lands at 500 to 1500 words (source doc, Length budgets), records what the docs claimed, what the code actually does, and why the existing implementation wins. The next agent that reads the stale skill plus the refs/ note has the correction in hand.

## Why this step exists

Documentation drift is a recognized failure mode with its own vocabulary. A guidance page defines documentation drift as the growing gap between what documentation says and what the system actually does, accumulating one unrecorded change at a time, with the property that a drifted page looks identical to a current one, so nobody notices until the docs send someone the wrong way (https://datadef.io/guides/en/documentation-drift, weight 0.28, weak). Tooling projects implement drift detection over branches and PRs for the same reason (https://github.com/Akshaysanthosh/docs-drift-check, weight 0.21, weak; https://github.com/driftszone/Docs-Drift, weight 0.28, weak). These are weakly backed, but they corroborate the source doc's premise: doc-vs-repo divergence is common, silent, and expensive to discover late.

The verification step is the workflow's built-in drift detector: it is cheap (one repo inspection per borrow recommendation) and it fires exactly when the cost of the drift would be highest, at the moment someone is about to write code from a stale claim.

## Verification mechanics

Concretely, for each borrow-intent finding (source doc, step 6 and the stream 3 method):

1. Identify the file or mechanism the recommendation would touch.
2. Read the current state on `yubi-OS/yubiOS` main, not the workspace skill copy.
3. Compare: if the capability exists, judge whether the existing implementation is equivalent, worse, or better than the recommendation.
4. Redirect: better or equivalent means document the discovery as a refs/ note; worse or absent means the borrow proceeds as a code-change proposal, now grounded in verified repo state.

The verification output feeds the synthesis "what this means" section (doc 05), so the final report never carries an unverified borrow recommendation.

Sources: source doc (yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md, workflow step 6 and Length budgets); https://docs.kernel.org/kbuild/reproducible-builds.html (0.95); https://docs.kernel.org/6.8/kbuild/reproducible-builds.html (0.95); https://reproducible-builds.org/docs/source-date-epoch/ (0.82); https://reproducible-builds.org/docs/timestamps/ (0.80); https://datadef.io/guides/en/documentation-drift (0.28, weak); https://github.com/driftszone/Docs-Drift (0.28, weak); https://github.com/Akshaysanthosh/docs-drift-check (0.21, weak).
