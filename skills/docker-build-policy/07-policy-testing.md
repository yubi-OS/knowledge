# 07. Testing a policy without a full build

Scope: exercising yubiOS.rego against synthetic input with opa eval and conftest, the required positive and negative cases, and the native buildx policy eval alternative.

## The source doc method

The source doc prescribes opa eval (or conftest) against synthetic input JSON:

```sh
echo '{"local":false,"image":{"ref":"quay.io/fedora/fedora-bootc:45","isCanonical":false}}' \
  | opa eval -d yubiOS.rego -I 'data.docker.decision'   # expect allow:false + mutable-tag reason
echo '{"local":false,"image":{"ref":"docker.io/library/ubuntu","isCanonical":true}}' \
  | opa eval -d yubiOS.rego -I 'data.docker.decision'   # expect allow:false + not-approved reason
```

(source doc: yubi-OS/yubiOS skills/docker-build-policy/SKILL.md)

Both cases are negative by design: a mutable tag on an approved registry, and a canonical ref from a non-approved registry. Each exercises exactly one allow condition of the pattern in doc 04.

## The required test matrix

Add both a positive (approved plus canonical, giving allow) and negative (mutable tag, bad registry) case so a policy edit cannot silently start allowing everything (source doc). Concretely, the matrix is:

1. Positive: ref quay.io/fedora/fedora-bootc@sha256:... with isCanonical true. Expect allow true and reason "Build allowed." (derived from the source doc pattern; the source doc states the positive case requirement).
2. Negative, registry: a canonical ref outside the 4 approved prefixes. Expect allow false and the not-approved reason (source doc example).
3. Negative, pinning: an approved registry ref with a mutable tag, isCanonical false. Expect allow false and the mutable-tag reason (source doc example).
4. Local: local true with no image fields. Expect allow true via the input.local rule (derived from the source doc pattern).

A policy edit that breaks any row of this matrix fails review before it can deny a real build or, worse, allow one.

## Codifying the cases with opa test

OPA documents that the opa test subcommand runs all tests, i.e. rules prefixed with test_, found in the Rego files passed on the command line, loading directories recursively (source: https://www.openpolicyagent.org/docs/policy-testing, weight 0.84). The 4 synthetic cases above can therefore be written as test_ rules inside a yubiOS.rego test file and run with one opa test command in CI, instead of ad hoc echo-and-eval shells.

## conftest

conftest is the second tool the source doc names: it writes tests against structured configuration data using the Rego language from Open Policy Agent (source: https://github.com/open-policy-agent/conftest, weight 0.65). It suits the same synthetic-input workflow where policies are already organized as conftest policy directories; opa eval is the lighter option when the policy is a single file.

## Dated correction: native buildx policy eval

Upstream Docker docs now document a native docker buildx policy eval command that tests whether the policy allows a specific source without running a full build; it evaluates the source given as the argument and does not parse the Dockerfile, for that use build with --progress=plain (source: https://docs.docker.com/build/policies/usage/, weight 0.51). The source doc does not mention this command; recorded here as a dated correction on 2026-10-06. It is the closest match to the source doc's testing intent and avoids needing opa installed, but it requires the same recent buildx as the --policy flag itself (doc 02).
