# 05 - Migration guides: codemods, upgrade helpers, manual steps, validation

Scope: what a complete migration guide contains (replacement symbol, codemod or upgrade-helper pointer, manual steps, validation procedure), grounded in real codemod practice.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standards 2 and 6, guideline 7, the Examples section, and the Anti-patterns list.

## What the Lifecycle block's migration field must carry

The migration field records: guide, codemod, upgrade_helper, manual_steps, and validation (source doc). Guideline 7 states the placement rule: the migration guide lives next to the changelog entry, with a codemod or upgrade-helper pointer plus manual steps plus a validation procedure (source doc). When stage is deprecated, the verification checklist requires the migration guide to be named: replacement symbol plus codemod or upgrade_helper plus manual_steps plus validation; "Update your code" is not a migration guide (source doc).

The source doc's worked example (a deprecated shell script) shows the shape in practice:

- replacement: yubios-validate-v2, introduced_in 1.5.0, stable
- codemod: `npx @yubios/codemod legacy-validate-to-v2`
- upgrade_helper: none
- manual_steps: replace `yubios-validate --foo=X` with `yubios-validate-v2 --foo=X`; replace `yubios-validate --bar` with `yubios-validate-v2 --bar=1`
- validation: `./scripts/ci_test-vm.sh group=smoke`

All of that is the source doc's example. Codemod or upgrade-helper pointers belong in the migration field whenever a signature or flag set changes between minors (source doc).

## Why codemods are the migration vehicle of choice

The digs surface the canonical public example. Next.js defines codemods as transformations that run on your codebase programmatically; this allows a large number of changes to be applied programmatically without having to manually go through every file, and Next.js provides codemod transformations to help upgrade a codebase when an API is updated or deprecated (https://nextjs.org/docs/app/guides/upgrading/codemods, jev 0.81 and 0.79). The same page documents an automation trend directly relevant to lifecycle maintenance: `npx next@canary upgrade --agent=latest` runs the codemods with a coding agent, which completes the remaining migration work and verifies the app (https://nextjs.org/docs/app/guides/upgrading/codemods, jev 0.81).

That maps 1:1 onto the yubiOS codemod pattern in the source doc example: a single `npx @yubios/codemod ...` invocation stands in for the manual step list, and the validation command stands in for the verification run.

## What a missing migration guide looks like

The source doc's trigger list includes "when migration prose has no codemod/upgrade-helper" as a reason the Lifecycle axis fires at all (source doc). The red-flags table and anti-patterns add the observable failure shapes: a `Deprecated` entry with no `removal_in_version` means the removal plan is missing; a `Removed` entry with no earlier `Deprecated` entry means removal was unannounced; a `Removed` entry without a `superseded_by` link means the archive path is unknown (source doc). Each of these is a migration-guide gap, because a consumer cannot plan a move without a target version, a replacement symbol, and a path to the old artifact.

## The deprecation-to-removal cadence the guide serves

The state machine's stable-to-deprecated transition requires one MAJOR of `Deprecated` first, and removal requires ADR plus Migration plus Codemod (source doc). Deprecated stage semantics: still operational, new uses discouraged, notice per notice_period (default 180 days), removal eligible after the notice has elapsed and the replacement reached stable (source doc). The migration guide is therefore the operational artifact that spans the deprecated stage: it tells consumers where to go (replacement), how to get there automatically (codemod), what to fix by hand (manual steps), and how to prove the move worked (validation).

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, Examples 3, Guidelines 7 and 14, Anti-patterns (deprecated without replacement, deprecation without removal-in-version), Red flags table, Verification item 6.
- https://nextjs.org/docs/app/guides/upgrading/codemods (jev 0.81)
- https://nextjs.org/docs/app/guides/upgrading/codemods (jev 0.79)
