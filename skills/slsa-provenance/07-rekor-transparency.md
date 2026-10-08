# 07 - Rekor Transparency Log: v1 to v2

Scope: what the Rekor transparency log does for yubiOS attestations, the v2 tile-based redesign that went GA in October 2025, and the client compatibility posture the source doc prescribes.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc).

## Role in the attestation chain

The source doc's provenance-format section requires provenance to be "logged in Rekor (Sigstore transparency log)" alongside DSSE signing by the build service's OIDC identity (source doc). Rekor provides "a restful API-based server for validation, and a transparency log for storage," with a CLI application to make and verify entries, query the log for inclusion proofs, verify log integrity, and retrieve entries by public key or artifact [https://docs.sigstore.dev/logging/overview/, jev 0.74, and 0.78 on the migration-question pass].

The `rekor-cli get --uuid <uuid> --format json | jq .` inspection command in the source doc is the operational face of that API (source doc).

## What v2 changed

Sigstore announced General Availability of Rekor v2 on October 10, 2025, describing it as "a redesigned and modernized Rekor... transitioning its backend to a tile-backed transparency log implementation to simplify maintenance and lower operational costs" [https://blog.sigstore.dev/rekor-v2-ga/, jev 0.59]. An earlier alpha post describes the same redesign: a new storage backend replacing Trillian with Trillian-Tessera, with tile-based logs [https://blog.sigstore.dev/rekor-v2-alpha/, jev 0.52].

The rekor repository states plainly that "Rekor v1 is in maintenance mode" and that the new version is "backed by a tile-based log" using "a modernized version of Trillian, Trillian-Tessera," with development tracked in the rekor-tiles repo [https://github.com/sigstore/rekor, jev 0.81, and 0.80 on the second pass]. The rekor-tiles repository itself identifies Rekor v2 as "aka rekor-tiles or Rekor on Tiles" [https://github.com/sigstore/rekor-tiles, jev 0.59].

## Client migration posture

The source doc prescribes: "Rekor v2 uses tile-based logs. Clients auto-migrate. Use `rekor-cli` >= v2 or Cosign >= v2.4 for compatibility" (source doc). The version floors are the source doc's own verified guidance; the dig did not contradict them.

The cosign CLI compatibility is being tracked in a project issue asking "will existing workflows that are based on calling cosign CLI break because the CLI changes?" as rekor v2 and related changes land [https://github.com/sigstore/cosign/issues/4684, jev 0.38, weak]. The weak weighting is appropriate: an issue tracker is evidence of an active concern, not a spec. For a third-party migration log example, one project's REKOR_V2_MIGRATION.md keeps v1 paths as default with v2 opt-in and tracks remaining v1-retirement phases [https://github.com/contrario/nous/blob/main/docs/REKOR_V2_MIGRATION.md, jev 0.12, weak]; it is a private-project precedent, not guidance for yubiOS.

A non-Sigstore "Rekor" company result [https://police.openalpr.com/, jev 0.03] and an unrelated cosign explainer [https://www.cloudopsnow.in/cosign/, jev 0.10] came back in the dig and are recorded here only to mark them as discarded.

## Why it matters for the L3 story

Transparency logging is what makes an attestation auditable after the fact: a signed statement plus a log inclusion proof means the attestation cannot be silently retracted or replaced. For yubiOS this feeds the audit posture described across the corpus: doc 04's CI gate verifies signatures and identities, and doc 05's verify-attestation path checks claims against the transparency log. Post-migration, any tooling pinned below the source doc's version floors would silently lose the ability to consult the v2 log, so the compatibility item belongs in the same audit sweep as digest pinning (doc 08).
