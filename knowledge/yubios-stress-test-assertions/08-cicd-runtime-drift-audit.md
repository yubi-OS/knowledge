# 08 CI to runtime drift audit

Scope: auditing the CI-to-runtime gap: detecting policy, test-only, or best-effort artifacts that leak into production image layers.

## The gap the audit closes

Continuous-integration systems accumulate artifacts that are never meant to ship: policy drafts, test fixtures, tools annotated "best effort", debug utilities. The drift hazard is that these artifacts travel with the code into production image layers, where nobody re-reviews them. General container-audit material describes the mechanism: secure code "can still reach production inside an unsafe or untrusted image", which is why "image and software supply chain security focuses on the complete deployable artifact" rather than on source code alone (https://medium.com/@cypanrisk/image-and-software-supply-chain-security-validating-scanning-and-signing-trusted-container-images-8838aa222fda, jev weight 0.24, weak backing). The complete deployable artifact includes its layer history, and layer history is where drift hides.

The audit question is precise: can anything tagged policy, best effort, or test-only reach a production image tag? The answer must be derived from the artifact itself, not from the pipeline's intent. Promotion-gate material frames the stakes: "automatic promotion to production bypasses human verification and lets supply chain compromises reach live systems unopposed" (https://www.systemshardening.com/articles/cicd/cd-promotion-gates-approvals/, jev weight 0.20, weak backing). Drift audits are the compensating control for exactly that bypass.

## The instrument: layer history inspection

The audit's core instrument is documented in official tooling. The docker image history reference shows that `docker history` (and equivalently `podman history`) exposes, per layer, the command that created it: "To see how the docker:latest image was built: IMAGE CREATED CREATED BY SIZE COMMENT" (https://docs.docker.com/reference/cli/docker/image/history/, jev weight 0.98, authoritative). The `--format` option pretty-prints the history output using a Go template (same source). Because each layer records its creating command, an allowlist over those commands is a mechanically checkable policy: a prod image fails the audit if any layer's command copies from paths that should never reach production, or if any layer contains content matching the policy or test-only markers.

Layer-level inspection tools extend the reach beyond commands to contents. The container-inspector project "provides utilities to: identify Docker images in a file system, its layers and the related metadata" and handles the formats produced by `docker save` (https://github.com/aboutcode-org/container-inspector, jev weight 0.23, weak backing). Audit-guide material lists the checks a full audit walks in order, including "secrets detection across all image layers" and SBOM generation, before Dockerfile best-practice review (https://www.decryptiondigest.com/blog/container-image-security-audit-guide, jev weight 0.23, weak backing). A marker-based policy audit (search layer contents for policy/, test-only, best-effort strings) is the same technique aimed at a different finding class: not secrets, but scope violations.

## The audit as an assertion row

In the assertion-set format of doc 02, the CI-to-runtime drift row is:

1. Claim under test: nothing tagged policy, best effort, or test-only ships in a prod image.
2. Action: pull the published prod-tagged image; run `docker history --format` over all layers (https://docs.docker.com/reference/cli/docker/image/history/, jev weight 0.98, authoritative); extract layer contents with `docker save` plus container-inspector or tar listing (https://github.com/aboutcode-org/container-inspector, jev weight 0.23, weak backing).
3. Expected terminal state: zero layers whose command or contents match the denylist; any match is an automatic fail, not a warning.
4. Evidence artifact: the full history output and the denylist scan log, stored with the run date.
5. Preconditions: the denylist is versioned next to the audit script, so a widened denylist re-runs against old images.
6. Verdict and date.

The failure mode the row encodes is the worst one for this test class: a best-effort warning shipped as a runtime dependency. The way that happens is mundane: a policy file gets imported by a helper that the image build copies, or a test utility lands in a runtime path, and the pipeline that would catch it audits source directories instead of published layers.

## Why the audit must run against published images, not the build tree

A drift audit that inspects the build directory proves the build tree is clean; it does not prove the published image is. The two diverge through cache reuse, multi-stage copying mistakes, and base-image layers the build never touched. Audit guides organize the review around the built artifact for this reason: a "disciplined container image security audit, wired into your build pipeline, is how you stop that propagation" of unsafe images between environments (https://safeguard.sh/resources/blog/container-image-audit, jev weight 0.47, weak backing, borderline). The assertion must therefore name the published digest as its input, which also makes it composable with the digest-pinning row of doc 06: audit the same digest that the pin file authorizes.

## The yubiOS application

The yubiOS repo cross-check (GET https://api.github.com/repos/yubi-OS/yubiOS/contents/scripts?ref=main) found adjacent tooling but not this audit: scripts/audit-workflow-tokens.py (10,225 bytes) plus ci_token-audit.yml (1,524 bytes) audit workflow tokens, a narrower check than a policy-artifact audit; ci_input-shape.yml (1,356 bytes) and validate-input-shape.py validate input shapes. The source analysis records the gap as exact: no scripts/audit-policy-tags.sh or equivalent exists in the scripts/ listing, so nothing currently fails CI when policy, best-effort, or test-only strings appear in a prod image's layer history. In this corpus's terms, the CI-to-runtime drift row is an open assertion: the instrument (docker history plus a denylist) is documented upstream at authoritative weight, the repo's existing audits cover neighboring classes, and the specific row remains undemonstrated.

## What a red team does with this

The red team runs the audit against the project's own published prod images and reads layer history the way an auditor reads a ledger. Its finding is binary per image: clean or contaminated. Because the check is mechanical and the tool is official (https://docs.docker.com/reference/cli/docker/image/history/, jev weight 0.98, authoritative), the finding is not negotiable, and the fix is a pipeline change, not a documentation change. A project that passes this row has closed the last of the 8 stress surfaces this corpus covers.
