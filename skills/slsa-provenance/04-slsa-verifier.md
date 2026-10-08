# 04 - Verification with slsa-verifier

Scope: how yubiOS verifies SLSA provenance on binaries and container images with slsa-verifier, the flags that matter, and its role as a post-deploy CI gate.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc).

## What the verifier checks

slsa-verifier "verifies the provenance by verifying the cryptographic signatures on provenance to make sure it was created by the expected builder," then checks that values such as the builder id, source code repository, and ref (branch or tag) match expected values [https://github.com/slsa-framework/slsa-verifier, jev 0.89, and 0.89 on the second query pass]. The project lists available installation paths including compilation from source, a Go install, an installer Action for GitHub Actions, a binary download, and Homebrew [https://github.com/slsa-framework/slsa-verifier, jev 0.89].

This maps directly onto the SLSA verification concept: "SLSA uses provenance to indicate whether an artifact is authentic or not, but provenance doesn't do anything unless somebody inspects it. SLSA calls that inspection verification" [https://slsa.dev/spec/v1.0/verifying-artifacts, jev 0.90; the v1.2 page carries the same text at jev 0.80]. The intended audience for that spec page is platform implementers, security engineers, and software consumers.

## The two commands yubiOS uses

The source doc prescribes verification for a binary artifact:

```bash
slsa-verifier verify-artifact artifact.uki \
  --provenance-path artifact.uki.intoto.jsonl \
  --source-uri github.com/yubi-OS/yubiOS \
  --builder-id https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v2.1.0
```

(source doc). The flags worth reading closely: `--provenance-path` points at the detached attestation file shipped alongside the artifact, `--source-uri` pins the expected repository, and `--builder-id` pins the expected builder identity, which must match the `runDetails.builder.id` written by the generator (doc 03).

For container images the source doc's verification path goes through cosign instead (`cosign verify-attestation --type slsaprovenance`, doc 05). A third-party command reference confirms slsa-verifier also covers containers with a `verify-image` command alongside artifact verification [https://github.com/slsa-framework/slsa-verifier, jev 0.89]. A community verifier, slsa-framework/verifier, describes itself as "a command-line verifier for SLSA attestations: build provenance (build), source provenance (source) and Verification Summary Attestations (vsa)," with a registry currently shipping the slsa-github-generator builders and GitHub Actions checks [https://github.com/slsa-framework/verifier, jev 0.86]; this is a separate tool from slsa-verifier proper and is not in yubiOS's gate path (source doc names only slsa-verifier).

A separate project page describes `verify-artifact` as verifying "SLSA provenance for binary artifacts (file blobs)... cryptographically validating that an artifact was built by an expected builder from expected source code, using provenance attestations stored in separate files" [https://deepwiki.com/slsa-framework/slsa-verifier/3.1-verify-artifact, jev 0.11, weak].

## The CI gate role

The source doc's checklist includes "slsa-verifier runs in post-deploy CI as gate" (source doc). Operationally that means the command above is wired into a workflow that fails the pipeline when any check mismatches: wrong builder id, wrong source, or a broken signature. A hands-on walkthrough demonstrates the same flow against the slsa-verifier project's own releases, which ship a `.intoto.jsonl` alongside each binary because the project builds itself with slsa-github-generator [https://dev.to/kanywst/slsa-provenance-hands-on-generate-with-github-actions-verify-with-slsa-verifier-56ka, jev 0.12, weak]. That self-hosting property is a useful audit sanity check: the tool chain consumes its own output format.

A tutorial site's attested-CI walkthrough exists [https://cilock.dev/tutorials/github-actions-pipeline/, jev 0.15, weak] but describes a third-party attestation action, not the slsa-github-generator path; it is listed here only to mark it as not load-bearing for yubiOS.

## Failure modes to watch

Because slsa-verifier compares expected values against signed claims, gate failures decompose into: signature failure (wrong or missing DSSE signature, broken transparency-log anchoring, doc 07), builder-id mismatch (workflow pinned at the wrong tag, compare `runDetails.builder.id` in doc 03), and source mismatch (provenance says the artifact was built from a different repository or ref than the release claims). The source doc's gate design treats all three as hard failures (source doc checklist).
