# mkosi-image-builder Knowledge Corpus

Knowledge corpus minted from the ground source `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (10,468 B fetched 2026-10-07). Topic: building OS images with mkosi for yubiOS, covering OCI containers, UKIs, disk images with dm-verity and Secure Boot, PIV/PKCS11 UKI signing, and FinalizeScripts.

The ground source is the primary source of record; each doc below cites it for its grounding spine and adds searXNG dig results weighted by the jev decision model.

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | [01-mkosi-overview-commands.md](01-mkosi-overview-commands.md) | What mkosi is, its position in the yubiOS pipeline (build, bootc, bcvk), the six key verbs, and the validation command block |
| 02 | [02-mkosi-conf-reference.md](02-mkosi-conf-reference.md) | Section-by-section mkosi.conf anatomy: Distribution, Output, Build, Content, Validation, Host |
| 03 | [03-piv-pkcs11-uki-signing.md](03-piv-pkcs11-uki-signing.md) | PKCS11 URI Secure Boot signing, YubiKey PIV slot 9c ceremony, libykcs11 verification, SoftHSM CI fallback |
| 04 | [04-dm-verity-outputs.md](04-dm-verity-outputs.md) | Verity mode ladder (yes, signed, hash, defer), roothash flow through systemd-repart into the UKI cmdline, roothash output file |
| 05 | [05-profiles-dropins.md](05-profiles-dropins.md) | mkosi.conf.d profiles, [Match] Profile gating, per-profile kernel command line, precedence rules |
| 06 | [06-finalize-scripts.md](06-finalize-scripts.md) | FinalizeScripts phase, BUILDROOT semantics, FIDO2 LUKS enrollment via systemd-cryptenroll at build time |
| 07 | [07-oci-pipeline.md](07-oci-pipeline.md) | Format=oci output, skopeo copy to registry, digest pinning after push |
| 08 | [08-upstream-validation-attribution.md](08-upstream-validation-attribution.md) | Upstream mkosi validation (mypy, ruff, pytest via bin/mkosi box) and the Co-Authored-By attribution rule |

## Research summary

- Results collected: 96 (8 subtopics, 2 searXNG queries each, top 6 kept per query)
- Weight split: 49 results with weight >= 0.5 (authoritative), 47 results with weight < 0.5 (weak, labeled in text where used)
- jev requests: 9 (1 outline validation with 8 score questions, 8 weighting batches of 12 noul questions), usage 10,853 input / 1,884 output tokens
- Weighting endpoint: DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13); no fallback needed, zero 429s
- Redos: 0 dig redos, 0 decision-model redos
- Skipped docs: none

## Research DB

Under `research-db/` (schema v2):

- `preflight.json` - preflight record
- `outline.json` - subtopic decomposition and jev score validation
- `archive.json` - all 96 collected results with noul weights and full decision records
- `digs/01-*.json` through `digs/08-*.json` - per-subtopic dig records
- `jev-log.json` - one entry per jev HTTP request
- `db.ts` - TypeScript interfaces for every shape above

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-side probe, agent-side probe skipped for speed); DefAPI direct (typesafe/jev-1.13) 200.
