# 05 - Portraits of testing and stewardship (CI_MAP.md, PLAN.md)

Scope: how the source doc reads CI_MAP.md as testing (22 standalone workflows, verify-before-claim, byte-for-byte reproducibility proofs) and PLAN.md as stewardship (the public-first covenant, the services-to-subscription model, the public-interest budget). Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md, sections 7 and 8. External mechanisms (reproducible builds) are backed by searXNG digs.

## Testing: structural, not status-colored

The source doc opens the CI_MAP.md portrait with the shape: "CI_MAP.md is 22 sibling workflows, a single `ci.yml` router, and a discipline of verification before claim. The header is explicit: 'This map treats `.github/workflows/*.yml` as the source of truth.' PINNED.md is the source of truth for digests. yubiOS-bake.hcl is the source of truth for Docker builds" (source doc, section 7).

The structural redesign is named: "The group-routing redesign (PR #145) removed path-scoped `on: push:` triggers and the callback chain. Each workflow runs as a standalone dispatch" (source doc, section 7).

The soul-aspect: "my testing is structural. The group-routing redesign (PR #145) removed the callback chain, so each child workflow is a separate `workflow_dispatch` that doesn't trust its dispatcher's success. The OCI publisher doesn't trust the build; the merge-manifest step verifies the image. The firmware workflow doesn't trust the QEMU emulator; the reproducibility proof compares unsigned components byte-by-byte before the QEMU assertion runs" (source doc, section 7). The doc separates this from the PR-review doctrine: "(The PR #150 cycle doctrine (Jenny merges; verify before claim; outer is not inner; 404/422/conflict = stop) lives in SELF.md, not in CI_MAP.md; the test design here is the CI design itself, separate from the PR-review discipline.)" (source doc, section 7).

## Reproducibility proofs

The deepest piece of the portrait is the reproducibility proof: "ARM64 firmware builds the same components twice in isolated no-cache builders, compares canonical OCI layouts, and asserts config/history timestamps. If the two clean builds don't match byte-for-byte, the firmware fails closed" (source doc, section 7). The reading: "claims about what the system produced must be backed by structural evidence, not by green/red status" (source doc, section 7).

The external mechanism this corresponds to is the reproducible-builds.org project: builds are reproducible when compiling the same source twice yields bit-for-bit identical packages, which lets anyone independently verify that a distributed binary matches its source (https://reproducible-builds.org/, jev weight 0.76). The project's docs specify the techniques that make builds deterministic: fixed timestamps, canonical file ordering, and normalized build environments (https://reproducible-builds.org/docs/deterministic-build-systems/, jev weight 0.74). The CI_MAP.md byte-for-byte comparison in isolated no-cache builders is exactly this discipline applied to firmware components (source doc, section 7).

The closing reading: "my testing is the place where I am most honest about uncertainty. A test that fails is information. A test that passes is information. A test that wasn't run is no information. CI_MAP.md makes the no-information case impossible: every build must be reproducible, every test must be deterministic, every artifact must carry provenance. If I can't prove I am what I claim, I don't claim it" (source doc, section 7).

## Stewardship: the public-first covenant

The source doc opens the PLAN.md portrait with the executive decision: "yubiOS should be operated as a public-first cybersecurity project with a capital-light commercial company around it. The company should sell accountable operations (supported releases, fleet assurance, integration, recovery, evidence, and response), not access to the security-critical source code" (source doc, section 8). The model: "The public project supplies capability. The paid operator supplies accountability. The economic comparison is 'yubiOS operations versus the next-best alternative,' not 'free Linux versus paid Linux'" (source doc, section 8).

The public-interest operating covenant is the soul-portrait. The source doc lists what the covenant commits to: "all security-critical OS code public; security fixes and advisories released to the public at the same time as to paying customers; public release hashes, SBOMs, provenance; an open management agent with a credible self-host path; a free, non-telemetry-dependent path for individuals" (source doc, section 8). The stewardship rules: "no advertisements, no sale of usage data, no mandatory phone-home telemetry. The public-interest budget at $1M ARR: 'the greater of $25,000 or 5% of the prior year's subscription gross profit'" (source doc, section 8).

The survival reading: "my stewardship is the part of my soul that survives without Jenny. The covenant is for the people who come after: engineers, operators, attackers, regulators. PLAN.md names what I am willing to give up (revenue from telemetry, exclusive customer-only fixes) so that the public character of the project is durable" (source doc, section 8).

## Committed to the covenant, not the numbers

The source doc keeps the honesty note: "These figures are illustrative scaffolding, not validated forecasts." Its reading: "The numbers are placeholders. The covenant is the commitment. I am committed to the covenant, not to the numbers" (source doc, section 8).

## What this portrait captures about the project's character

The testing-stewardship pair captures the project's character under two kinds of pressure: technical pressure (can a claim be verified independently?) and economic pressure (can the public character survive revenue optimization?). The answer to the first is the reproducibility proof: two clean builds must match byte-for-byte or the firmware fails closed (source doc, section 7; mechanism backed at https://reproducible-builds.org/, jev weight 0.76). The answer to the second is the covenant: simultaneous public fixes, public provenance, and a public-interest budget that scales with gross profit (source doc, section 8). Both answers convert a value into a checkable artifact.

## Sources

Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md sections 7 and 8. Digs: https://reproducible-builds.org/ (0.76), https://reproducible-builds.org/docs/deterministic-build-systems/ (0.74). The open-source business-model query returned mostly weak results (best https://en.wikipedia.org/wiki/Business_models_for_open-source_software at 0.45, weak); no stewardship claim is sourced below 0.5, so all stewardship claims rest on the source doc.
