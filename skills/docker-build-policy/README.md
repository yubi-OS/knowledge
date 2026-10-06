# skills/docker-build-policy

Knowledge corpus explicating the yubiOS skill **docker-build-policy** (ground source: yubi-OS/yubiOS skills/docker-build-policy/SKILL.md): writing, wiring, and debugging Docker Build Policies (OPA/Rego) for the yubi-OS org.

## Docs

- [01-build-policy-overview.md](01-build-policy-overview.md): what a Build Policy is, BuildKit pre-build evaluation, allow/deny semantics, the yubiOS supply-chain gate framing.
- [02-invocation-flags.md](02-invocation-flags.md): the --policy flag surface (reset, strict, filename) and the buildx version requirement.
- [03-input-object.md](03-input-object.md): the input object schema the policy sees: input.local, input.image.ref, isCanonical, hasProvenance.
- [04-yubios-rego-pattern.md](04-yubios-rego-pattern.md): the yubiOS.rego pattern: default deny, approved_registry, decision object, actionable reasons.
- [05-common-changes.md](05-common-changes.md): adding an approved registry, requiring provenance, and the policy-does-not-replace-pinning invariant.
- [06-ci-wiring.md](06-ci-wiring.md): enabling the policy on the yubiOS-ci.yml build job and reading a denial from the CI log.
- [07-policy-testing.md](07-policy-testing.md): testing the policy without a full build: opa eval, conftest, native buildx policy eval.
- [08-guardrails-discipline.md](08-guardrails-discipline.md): never weaken the gate, prefix-to-PINNED.md correspondence, actionable deny reasons.

## Research summary

- Results collected: 84 (14 searXNG queries, 7 web-shaped subtopics, 2 queries each; deduped by URL).
- Weight split: 17 high (>= 0.5) / 67 low (< 0.5) of 84.
- jev requests: 8 (1 outline score validation + 7 noul weighting batches), usage 11114 input / 1847 output tokens. Weighting ran through the DefAPI direct endpoint per speed optimization 1.
- Redos: 0. No dig required a redo; every web-shaped subtopic returned enough results to author honestly.
- Skipped docs: 1 candidate subtopic (09 primitive-coverage) was dropped at outline validation with score 0.36 (0.77 probability padding); its substance is covered in the closing section of 08-guardrails-discipline.md. Doc 06 is an internal-record subtopic authored from the source doc without a dig, as declared in its text.
- Weakly backed claims (< 0.5) are labeled "weak backing" in the docs that use them (docs 01, 02, 03, 05, 08).

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); decide healthy via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13).
