# 01 - Quality Gate Pipeline and Shift-Left Principles

## Scope

The ordered sequence of automated checks every change passes before merge, the two principles that motivate it (shift left, faster is safer), and the rule that no gate may be skipped.

## The pipeline as defined in the source doc

The source doc (`yubi-OS/yubiOS skills/ci-cd-and-automation/SKILL.md`) defines the quality gate pipeline as an ordered sequence a pull request passes through before it is ready for review. The gate order is: lint check (eslint, prettier), type check (tsc --noEmit), unit tests (jest/vitest), build (npm run build), integration tests (API/DB tests), optional E2E tests (Playwright/Cypress), security audit (npm audit), and a bundle size check (bundlesize). Each gate must pass before the next runs. Static analysis sits before tests, which sit before staging, which sits before production.

The rationale the source doc gives is explicit: CI/CD is "the enforcement mechanism for every other skill" and it "catches what humans and agents miss, and it does so consistently on every single change" (source doc). This framing matters for a multi-agent codebase where the authors of changes include automated agents; the pipeline is what converts intent into verified fact.

## No gate can be skipped

The source doc is categorical: "No gate can be skipped. If lint fails, fix lint, don't disable the rule. If a test fails, fix the code, don't skip the test" (source doc). This is the operational core of the skill. The skill's own verification checklist later repeats the same requirement: all quality gates present (lint, types, tests, build, audit), the pipeline runs on every PR and push to main, and failures block merge via branch protection (source doc).

The 2026 anti-pattern literature agrees that weakening this rule is the most common CI failure mode. A practitioner survey summarized in an online CI/CD book found that teams consider "ignoring the outcome of a task when determining the build status" a direct violation of CI's purpose, for example when static analysis tools emit high-severity warnings without failing the build (https://alexyorke.github.io/beginning-ci-cd-book/chapters/General_CICD_Anti-patterns.html, weight 0.36, weak). A second weak-backed source catalogs the same family of failures under "monolithic builds" and "ignored outcomes" (https://najx.dev/cicd-anti-patterns/, weight 0.22, weak). The source doc's prohibition and these external observations are consistent: gate suppression is the root cause of most downstream CI decay.

## Shift left

Shift left means catching problems as early in the pipeline as possible. The source doc's own numbers: "A bug caught in linting costs minutes; the same bug caught in production costs hours" (source doc). The mechanism is to move checks upstream: static analysis before tests, tests before staging, staging before production. The gate ordering above is the concrete implementation of this principle. The lint-first ordering is not arbitrary; it is the cheapest gate that still catches a real defect class.

External material on shift-left testing is abundant but mostly commercial blog content; this corpus's dig returned no high-authority source on the principle itself. A 2026 practitioner guide on build verification and quality gates covers the same ground (failing the build on quality-gate violations before merge) but at weight 0.19 (https://khimananda.com/blog/build-verification-and-quality-gates-in-ci, weak), and a dedicated quality-gates pipeline guide lands at 0.16 (https://scrolltest.com/ci-cd-testing-pipeline-quality-gates-guide/, weak). Both are consistent with the source doc and add no contradicting evidence, so the source doc stands as the primary record here.

## Faster is safer

The second principle: smaller batches and more frequent releases reduce risk. The source doc: "A deployment with 3 changes is easier to debug than one with 30. Frequent releases build confidence in the release process itself" (source doc). This couples directly to the pipeline: if the pipeline is slow, the temptation to batch changes grows, which raises per-deployment risk. That coupling is why the skill treats CI optimization (doc 07) as part of the same discipline rather than a separate concern.

## What the pipeline protects

Every gate exists to fail fast on a specific defect class:

1. Lint: style and obvious errors, cheapest to fix (source doc).
2. Type check: type-level defects that unit tests may not exercise (source doc).
3. Unit tests: behavior regressions (source doc).
4. Build: artifacts that do not compile or bundle (source doc).
5. Integration: API and database behavior against real services (source doc).
6. E2E (optional): user-visible flows (source doc).
7. Security audit: known vulnerabilities in dependencies (source doc).
8. Bundle size: performance regressions at the artifact level (source doc).

## Relation to the rest of the skill

The pipeline is the hub the other subtopics configure: doc 02 shows the GitHub Actions YAML that runs these gates, doc 03's discipline (feeding failures back) assumes gates produce actionable output, doc 07 keeps the pipeline fast enough that nobody wants to skip it, and doc 08 catalogs the rationalizations used to weaken it. The source doc's red-flag list includes "CI failures ignored or silenced" and "tests disabled in CI to make the pipeline pass" (source doc), which are precisely the failure modes of the no-skip rule.
