# Pin source of truth and drift control

Scope: Single source of truth for approved digests (a PINNED.md-style pin file), keeping the consuming Containerfile in lockstep, and using commit messages as the audit trail.

## The drift problem

Digest pins fail not at rotation time but in the weeks after: a digest value copied into a Dockerfile, a compose file, a CI config, and a wiki page becomes four independent facts, and any one of them can be updated alone. The Container Image Supply Chain guidance frames the whole path, from base image choice to production, as the surface where these copies accumulate [S1].

## One file owns the digest

The yubiOS pattern makes the pin file the only place an approved digest lives. PINNED.md is the source of truth, a workflow can refresh it, and nothing else copies digest values; consuming Dockerfiles reference the pin file rather than restating the digest. The rotation rule that follows is mechanical: a rotation that lands in only one of the pin file and the consuming Containerfile is a drift bug, not a rotation.

Tooling exists for the complementary direction, making sure nothing is left unpinned. dockerfile-pin is a CLI that adds `@sha256:<digest>` to FROM and `COPY --from=` lines in Dockerfiles, image fields in docker-compose.yml, and Docker image references in GitHub Actions and GitLab CI files, explicitly to prevent supply chain attacks [S2]. Its documented behavior supports a drift-control workflow: it runs dry-run by default and only writes with `--write` [S2], it can re-resolve existing digests with `--update` [S2], and it can skip images built within the last 7 days with `--min-age 7` [S2]. The `--update` flag is the interesting one for rotation: it re-resolves pins in place, which is how a bot-assisted rotation can find every consumer in one pass. The pkg.go.dev listing confirms the same scope: Dockerfiles, docker-compose.yml image fields, and GitHub Actions references [S3], and the README is mirrored at 0.55 weight [S4].

## Detecting drift on a schedule

Drift control also has a detection half. The Microsoft physical-ai-toolchain team proposes a scheduled check that, for each digest-pinned image reference in the repository, re-resolves the tag to its current registry digest and reports drift, optionally flagging staleness against a newer tag, surfaced non-gating (weight 0.82, authoritative) [S5]. The design detail worth copying is "surfaced non-gating": drift detection reports, the human rotation decides. That keeps the gate (doc 03) authoritative for what builds, while the detector keeps the pin file honest about upstream movement.

The same issue frames the goal as giving container images "the same freshness and tamper-evidence coverage the binary and GitHub Actions pins already have" [S5], which is a useful completeness test for any pin file: every class of pinned reference should be covered by the same drift check.

## The audit trail lives in git

Recording rotation history in commit messages rather than in a side ledger keeps the history auditable from git alone. Concretely: the commit that updates the pin file names the old and new digests, and `git log -S <digest>` finds every rotation a digest was ever involved in. No separate rotation ledger is needed, and the ledger cannot itself drift from the pins because it is the pins' own history.

Weak-backing notes: a runtime source-of-truth ADR from a security-labs repo discusses drift semantics [S6] (weight 0.43, WEAK backing), and a bluefin deepwiki page describes image version pinning and dependency management [S7] (weight 0.33, WEAK backing). Both are consistent with the patterns above but not authoritative.

## Sources

- [S1] https://safeguard.sh/resources/blog/container-image-supply-chain-dockerfile-to-production (weight 0.56, authoritative)
- [S2] https://github.com/azu/dockerfile-pin (weight 0.87, authoritative)
- [S3] https://pkg.go.dev/github.com/azu/dockerfile-pin (weight 0.78, authoritative)
- [S4] https://github.com/azu/dockerfile-pin/blob/main/README.md (weight 0.55, authoritative)
- [S5] https://github.com/microsoft/physical-ai-toolchain/issues/1093 (weight 0.82, authoritative)
- [S6] https://github.com/pestoura/hermes-security-labs/blob/main/docs/architecture/adr/ADR-0009-runtime-source-of-truth-and-drift-semantics.md (weight 0.43, WEAK backing)
- [S7] https://deepwiki.com/ublue-os/bluefin/2.2-image-version-pinning-and-dependency-management (weight 0.33, WEAK backing)
