# 06 - Feature Flags and Safe Defaults

Scope: Rules 3 and 4 from the source doc, feature flags that hide incomplete work so increments can merge, and safe conservative defaults for new code paths.

## Rule 3: feature flags for incomplete features

The source doc (`yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`) states Rule 3 with a code example: a constant read from the environment, `const ENABLE_TASK_SHARING = process.env.FEATURE_TASK_SHARING === 'true'`, gating the new sharing UI. The stated purpose: "This lets you merge small increments to the main branch without exposing incomplete work."

The rationalization the rule preempts is "I'll add the feature flag later." The doc's table answers it: if the feature is not complete, it should not be user-visible, so add the flag now.

## The trunk-based connection

Feature flags are the standard companion of trunk-based development. The canonical reference describes feature flags as "a time-honored way to control the capabilities of an application or service in a large decisive way" (https://trunkbaseddevelopment.com/feature-flags/, jev weight 0.43, weak backing). The pattern is required, not optional, in that workflow: trunk-based development requires merging to the main branch daily, even for incomplete features, and feature flags wrap unfinished code paths so the code can deploy without shipping (https://www.getunleash.io/blog/using-feature-flags-to-enable-trunk-based-development, jev weight 0.29, weak backing).

The mechanism the source doc relies on is spelled out in the Unleash documentation: feature flags hide unfinished work and decouple deployment from release, which is what allows incremental merges to land while the user-facing behavior stays stable (https://docs.getunleash.io/guides/trunk-based-development, jev weight 0.86). A practitioner summary puts it bluntly: the only way to ensure the trunk is always releasable is to hide incomplete features behind feature flags (https://milanjovanovic.tech/blog/feature-flags-in-dotnet-and-how-i-use-them-for-ab-testing, jev weight 0.18, weak backing).

## Rule 4: safe defaults

Rule 4 requires new code to default to safe, conservative behavior. The doc's example is an optional parameter that defaults off: `createTask(data, options?: { notify?: boolean })` with `options?.notify ?? false`. The conservative default means an increment that merges with the flag off changes no behavior until someone deliberately turns it on.

The security-engineering literature frames this as a design paradigm: a system's out-of-the-box configuration should be the safe one, and making it less safe should require a deliberate action, not an accident (https://safeguard.sh/resources/blog/secure-defaults-explained, jev weight 0.31, weak backing). A 2024 systematization of the design pattern confirms the principle is established in the field: "prefer safe and secure defaults" is a well-known design paradigm in software security engineering (https://arxiv.org/pdf/2412.17329v1, jev weight 0.42, weak backing). For incremental delivery the stakes are concrete: a default-on behavior inside an unflagged increment is a behavior change that shipped without a decision, which is exactly the failure mode Rule 4 closes.

## Rules 3 and 4 compose

The 2 rules cover the 2 directions of hidden risk in an increment. Rule 3 covers intentional incompleteness: the feature is half-built, the flag keeps it invisible, and each merged increment still passes tests and builds. Rule 4 covers completeness: the feature is finished, and its default state is the least surprising behavior (off, false, do-nothing) until a caller or configuration opts in.

Together they let the increment cycle run at full speed on a shared mainline. Every increment merges small and green, and the only visible behavior changes are the ones someone chose deliberately, which keeps review, rollback, and debugging scoped to decisions rather than accidents.
