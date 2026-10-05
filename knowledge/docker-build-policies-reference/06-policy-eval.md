# docker buildx policy eval and debugging

Scope: evaluating a policy against a single source without a build using `docker buildx policy eval`, its options, and the debugging workflow for builds that fail a policy.

## policy eval exists

A correction worth leading with: `docker buildx policy eval` exists and is documented. It evaluates a policy against a single source, with options `--fields` (fetch specific metadata), `-f/--file` (base Dockerfile name used to locate the policy file, default `Dockerfile`), `--platform`, and `--print` (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md; the CLI reference is at https://docs.docker.com/reference/cli/docker/buildx/policy/eval/, weight 0.95, and the buildx repository documents the same command at https://github.com/docker/buildx/blob/master/docs/reference/buildx_policy_eval.md, weight 0.79).

An earlier yubiOS research note (2026-06-25) had recorded that the subcommand does not exist; the 2026-07-23 refresh corrected that. Do not carry the old claim forward.

## What it is for

`docker buildx policy eval` tests whether your policy allows a specific source without running a full build (https://docs.docker.com/build/policies/usage/, weight 0.95). This makes it the unit-test entry point for policy development: edit the Rego, eval a representative input, iterate, and only wire the policy into CI once the decisions are right. The usage page frames this explicitly as the "policy development workflow" step that precedes enforcement (https://docs.docker.com/build/policies/usage/, weight 0.95).

Two documented invocations:

```bash
# Show the decision (and the full input with --print)
docker buildx policy eval --file Dockerfile --print

# Fetch specific metadata fields for the evaluated input
docker buildx policy eval --fields labels,checksum,hasProvenance
```

(source doc). `--file` names the base Dockerfile whose sibling policy file should load, defaulting to `Dockerfile`, and `--platform` evaluates for a specific target platform (source doc; CLI reference at https://docs.docker.com/reference/cli/docker/buildx/policy/eval/, weight 0.95).

## --print and the missing-fields caveat

`--print` shows the full input JSON without building, which is the fastest way to discover what your policy actually receives (source doc; https://docs.docker.com/build/policies/debugging/, weight 0.92). But the debugging page lists "Fields missing with policy eval --print" among its common issues: the eval path can show fewer resolved fields than a real build does (https://docs.docker.com/build/policies/debugging/, weight 0.92). Treat eval output as a development aid: confirm any field a rule depends on also appears in a real build before shipping the rule.

## Debug logging during builds

For in-build debugging, the documented commands are:

```bash
# See complete input data during builds (recommended)
docker buildx build --progress=plain --policy log-level=debug .

# See policy checks and decisions
docker buildx build --progress=plain .
```

(https://docs.docker.com/build/policies/debugging.md, weight 0.18, weak backing; the `log-level=debug` flag is part of the `--policy` key set per source doc and per the bake reference key list at https://github.com/docker/buildx/blob/master/docs/bake-reference.md, weight 0.82.) The debug mirror explains the payoff: the detailed output shows exactly what data your policy receives and which fields are not yet resolved, which avoids needing extensive print statements in the policy itself (https://zvezdochetu.github.io/docker-docs-course/build/policies/debugging/, weight 0.12, weak backing).

## Known evaluation semantics to expect while debugging

The debugging page's common-issues list includes "Policy evaluation happens multiple times" (https://docs.docker.com/build/policies/debugging/, weight 0.92). Do not assume one evaluation per build: an input can be re-evaluated, so policies must be pure (no side effects, no reliance on evaluation count) and side-effect-free by construction. Related gotchas on the same list concern full repository paths versus repository names, which bite policies that compare `input.image.repo` with or without the registry host; prefer `fullRepo` or `ref` when the distinction matters (https://docs.docker.com/build/policies/debugging/, weight 0.92).

## A debugging workflow that works

1. Write the policy with deny-by-default semantics (see the rego-semantics doc).
2. Run `docker buildx policy eval --print` against the real source to see the input JSON (https://docs.docker.com/reference/cli/docker/buildx/policy/eval/, weight 0.95).
3. Confirm each field your rules reference is present; if it is missing in eval output, check whether a real build resolves it (https://docs.docker.com/build/policies/debugging/, weight 0.92).
4. Iterate on the policy with eval until decisions are correct.
5. Run a real build with `--progress=plain --policy log-level=debug` to see per-input checks and decisions in build output (https://docs.docker.com/build/policies/debugging.md, weight 0.18, weak backing).
6. Only then enable `strict=true` in CI so an unloaded policy is a hard failure rather than a silent bypass (source doc).
