# 08 - The yubiOS L3 Checklist as an Integration Map

Scope: the source doc's six-item yubiOS checklist, read as the end-to-end integration of everything in this corpus, with each item resolved to the mechanism that fulfills it.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc). This is an internal-record subtopic: the checklist is yubiOS's own pipeline state, so no searXNG dig was run for it (per the mint brief, internal-record subtopics skip digs). Every claim below is attributed to the source doc.

## Item 1: OCI image provenance via generator_container_slsa3.yml

The checklist's first item is that the OCI image gets SLSA L3 provenance via `generator_container_slsa3.yml` (source doc). Doc 02 gives the full wiring: a reusable `uses:` call pinned at `@v2.1.0`, `id-token: write` plus `contents: read` plus `packages: write` permissions, the `image` and `digest` inputs where the digest comes from the build job's output, and registry credentials passed through `secrets:`. The L3 property comes from the isolated GitHub-hosted runner environment (source doc), which is the mechanism behind level L3's "hardened, isolated environment" requirement (doc 01).

## Item 2: UKI provenance via generator_generic_slsa3.yml

The second item covers the generic path for the UKI binary (source doc). Doc 02 covers it: `base64-subjects` fed from `sha256sum artifact.uki artifact.img | base64 -w0` output. A UKI is a boot artifact, not a container image, so it has no registry attestation slot; the detached `.intoto.jsonl` file is its provenance carrier (doc 04).

## Item 3: FROM base images pinned to digests

"All `FROM` base images pinned to digests (`dhi.io/debian-base@sha256:...`)" is the third item (source doc). Digest pinning is what makes `input.image.isCanonical` satisfiable in the build policy (item 4): a mutable tag cannot be canonical, so the pin is the precondition, and the policy is the enforcement.

## Item 4: Dockerfile.rego enforcing isCanonical plus hasProvenance

The fourth item is the Docker Build Policy that enforces both conditions on build inputs (source doc). Doc 06 gives the mechanism: Buildx resolves every build input before any instruction executes and denies the build unless the Rego policy passes, invoked as `--policy reset=true,strict=true,filename=$REPO.rego`. This item is the build-time complement of the post-deploy verification gate (item 6): together they bracket the artifact between input filtering and output verification.

## Item 5: SBOM (SPDX via Syft) attached as cosign attestation

The fifth item attaches the SBOM (source doc). Doc 05 gives the command (`cosign attest --type spdxjson --predicate sbom.spdx.json`) and the consumption side: policy-controller sample policies already express "images must have a signed SPDX SBOM (spdxjson)" as an admission requirement. The SBOM attestation is metadata about the artifact's contents; the SLSA provenance is metadata about its construction. Both ride the same DSSE in-toto format (doc 03).

## Item 6: slsa-verifier in post-deploy CI as gate

The final item is the post-deploy CI gate (source doc). Doc 04 gives the exact command with `--provenance-path`, `--source-uri`, and `--builder-id`, and the failure decomposition (signature, builder id, source). The gate is what turns the produced provenance from paper into enforcement: "provenance doesn't do anything unless somebody inspects it" (doc 04, citing the SLSA spec at jev 0.90).

## Cross-cutting dependencies

Three items have dependencies outside the checklist's own scope:

1. Both generator workflows require OIDC (`id-token: write`) and log to Rekor (source doc); doc 07's v2 migration posture (rekor-cli >= v2, cosign >= v2.4 per source doc) must hold for every client in the chain, including the CI gate itself.
2. The builder identity pinned in the slsa-verifier gate (`generator_generic_slsa3.yml@v2.1.0`) must match the pinned generator tag in items 1 and 2; bumping one without the other breaks the gate by design.
3. The provenance predicate consumed by the gate is v1 only (doc 03); v0.2 artifacts would fail the audit.

## Skill-level annotations worth knowing

The source doc carries corpus-maintenance annotations beyond the pipeline content: a 2026-07-24 correction fixing the v0.2-era levels table, cycle 5 to 7 RSI primitive-closure entries (segmentation, cryptographic identity, least privilege), and 2026-09-17 notes that two template paragraphs asserting unimplemented capabilities were removed as unsupported (source doc). An auditor reading the source doc should weight the pipeline sections (Overview through Rekor v2 Notes) over the RSI bookkeeping sections, which record corpus-process history rather than pipeline behavior.
