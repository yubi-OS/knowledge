# docs/ser - yubiOS SER / SERA framework alignment corpus

Knowledge corpus minted from `yubi-OS/yubiOS docs/SER.md` (the yubiOS SER / SERA framework alignment record). The corpus explicates the doc: what it records about the SER principles, the YubiKey owner boundary, time-bounded artifacts, reproducibility, attestation and trust-chain coverage, and least privilege / continuous monitoring. Ground source of record: https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-ser-framework-overview.md](01-ser-framework-overview.md) | The SER framework as the doc invokes it and how yubiOS positions itself as a full-stack SER-style implementation |
| 02 | [02-owner-centric-sovereignty.md](02-owner-centric-sovereignty.md) | The YubiKey owner boundary: Secure Boot signing, disk unlock, SSH resident keys, PAM login, app 2FA |
| 03 | [03-ephemerality-time-bounded-artifacts.md](03-ephemerality-time-bounded-artifacts.md) | Time-bounded retention: pre-launch artifacts, pinned digests, TEST-only flows, durable decisions into ADRs |
| 04 | [04-reproducibility-provenance.md](04-reproducibility-provenance.md) | Pinned base images, digest tracking, deterministic OCI delivery, bootc-based updates, CI evidence |
| 05 | [05-attestation-trust-chain-coverage.md](05-attestation-trust-chain-coverage.md) | in-toto, Rekor, SLSA, Sigstore, keylime, bootupd, and the ROT/ROTPK chain as the doc records them |
| 06 | [06-least-privilege-continuous-monitoring.md](06-least-privilege-continuous-monitoring.md) | Capabilities, ProtectSystem/ProtectHome, rootless execution, and falco/tracee/tetragon/kubeArmor detection |

## Research summary

- Results collected: 71 (deduplicated by URL across 12 queries, 2 per subtopic)
- Weight split: 20 primary (jev weight >= 0.5) / 51 weak (weight < 0.5, labeled as weak in text)
- Jev requests: 7 (1 score validation + 6 noul batches of 10 to 12), usage 8061 input / 1538 output tokens, via DefAPI direct (https://api.defapi.org/api/v1/decisions)
- Redos: 0
- Skipped docs: none (all 6 subtopics kept; 03 ephemerality was validated marginal at score 0.5 and kept because its ADR dig came back strong)
- Note: the framework page itself (https://omniteck.com/?p=1104) weighted weak at 0.15; framework-level claims rest on the source doc and are labeled weak where they come from the dig.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); jev weighting via DefAPI direct (https://api.defapi.org/api/v1/decisions), model typesafe/jev-1.13.
