# digest-bump-checklist

Knowledge corpus on digest bump checklists for digest-pinned base images: the verification and update procedure when a pinned image digest changes, from policy through CI.

Minted from yubi-OS/yubiOS `refs/digest-bump-checklist-2026-07-25.md` on 2026-10-05.

## Docs

- `01-pinning-taxonomy.md` - The five pinned categories in yubiOS PINNED.md (GitHub Actions, direct workflow downloads, internal fork refs, external source refs, container images) and why a digest bump means a different procedure in each. (12 results kept, 2 primary)
- `02-container-image-bumps.md` - Container image digest bump flow: fetch-dhi-manifest and fetch-fedora-bootc-manifest refresh workflows, multi-arch index vs child digests, and updating every FROM and image: reference. (12 results kept, 10 primary)
- `03-build-policy-gate.md` - Build-time digest verification through yubiOS.rego policy (reset=true strict=true) inherited from yubiOS-bake.hcl, and the fail-closed behavior when a bump is not policy-approved. (12 results kept, 4 primary)
- `04-fork-ref-rolls.md` - Internal yubi-OS fork refs: release commit vs pinned source commit, fetch-released-tag-ref.yml automatic roll semantics, and manual re-verification of yubiOS-specific extensions on new releases. (24 results kept, 8 primary)
- `05-external-source-refs.md` - External GitHub source ref pinning for non-fork dependencies: two-table updates and re-confirming pinned capabilities (passless hmac-secret, qemu ARM64 zboot) still work after a bump. (12 results kept, 3 primary)
- `06-workflow-downloads.md` - Direct workflow downloads: wcurl payloads for Docker static binaries and buildx releases with mandatory sha512sum --check --strict verification before consumption. (12 results kept, 6 primary)
- `07-action-sha-pinning.md` - GitHub Actions SHA pinning: immutable commit references versus mutable tags, and policy rejection of :latest :main and branch refs. (12 results kept, 5 primary)
- `08-audit-trail-superseded.md` - Superseded-digest audit trail practice: moving old digests into kept-for-audit blocks instead of overwriting, single source of truth hygiene, and avoiding duplicate stale digest tables. (24 results kept, 7 primary)
- `09-roll-procedure-prs.md` - The end-to-end roll procedure: obtain digest, update source of truth, update repo references, open a PR rather than pushing to main, and commit-message discipline for workflow-file edits. (12 results kept, 6 primary)

## Research summary

- Results collected: 132 (weighted by the jev noul metric via clef on /api/decide)
- Weight split: 51 high (>= 0.5) / 81 low (< 0.5)
- Jev requests: 29 (usage 22729 input / 0 output tokens)
- Dig redos: 2 (subtopic 04 and subtopic 08, one redo each, new queries logged in research-db/digs)
- Skipped docs: none
- Gaps: none

Preflight 2026-10-05: searXNG 37 results healthy; /api/decide (clef) 200.

## Research DB

`research-db/` holds the full provenance: `preflight.json`, `outline.json` (with raw jev validation answers), `archive.json` (every collected result with its weight and raw decision record), `digs/<NN>-<slug>.json` (per-subtopic query attempts, redo log, kept results), `jev-log.json` (one entry per jev HTTP request with usage tokens), and `db.ts` (TypeScript interfaces for all shapes).
