# attested-bootc-gpu-cutover: attested bootc to libvirt to GPU passthrough cutover

Knowledge corpus minted from `yubi-OS/yubiOS refs/attested-bootc-gpu-cutover-2026-07-30.md`. Topic: prior art and novelty verdict for combining digest-pinned bootc OS images, libvirt VM boundaries, and GPU device passthrough with runtime attestation and policy enforcement.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-bootc-digest-provenance.md](01-bootc-digest-provenance.md) | Digest-pinned bootable OCI images and build-time provenance (SLSA, cosign, Fedora Image Mode Phase 2, RHEL image mode) |
| 02 | [02-libvirt-gpu-mediation.md](02-libvirt-gpu-mediation.md) | QEMU/libvirt GPU mediation: VFIO mdev lineage, vfio-user, vendor landscape |
| 03 | [03-attestation-resource-gating.md](03-attestation-resource-gating.md) | IMA + dm-verity + TPM PCRs, AR4SI trust vectors, CoCo Trustee/KBS resource policies |
| 04 | [04-boot-admission-policy.md](04-boot-admission-policy.md) | The Boot Admission Policy object: digest, measurement replay, GPU binding claims; RVPS; libvirt hook enforcement |
| 05 | [05-prior-art-chains.md](05-prior-art-chains.md) | Closest prior-art chains (NVIDIA CoCo, Keylime, TEE-bound systems) and the coverage matrix |
| 06 | [06-novelty-verdict.md](06-novelty-verdict.md) | Graham/KSR methodology behind the BORDERLINE verdict and its secondary-considerations kill criteria |
| 07 | [07-yubios-integration-path.md](07-yubios-integration-path.md) | Extend the ADR versus file a new one; staged C1/C2/C3 rollout; attestation SDK and CI grounding |
| 08 | [08-open-problems.md](08-open-problems.md) | Workload identity, GPU chain of trust, vfio-user binding, replay protection, auditability |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 kept per query; 725 raw results)
- Weight split: 51 primary (weight >= 0.5) / 45 weak (weight < 0.5) of 96
- Jev requests: 22 (1 preflight probe, 1 outline validation with 8 score questions, 21 noul weighting batches of 5); usage: 16868 input tokens, 0 output tokens (probe usage not returned in captured form)
- Redo counts: 0 dig redos; 1 /api/decide 429 retry on weighting batch 20 (retry after 30s succeeded, no results shipped unweighted)
- Skipped docs: none
- Gaps: NVIDIA vendor-specific VFIO migration claim (Ada/Hopper off mdev) not confirmed by any kept result; virtio-gpu bypass policy and tamper-evident auditability have only adjacent or weak grounding (see doc 08)

Per-doc outline validation scores (clef, score metric): {"t01": 1.65, "t02": 1.89, "t03": 1.83, "t04": 1.75, "t05": 1.93, "t06": 1.63, "t07": 1.07, "t08": 1.6}.

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | bootc-digest-provenance | 12 | 7 |
| 02 | libvirt-gpu-mediation | 12 | 5 |
| 03 | attestation-resource-gating | 12 | 9 |
| 04 | boot-admission-policy | 12 | 5 |
| 05 | prior-art-chains | 12 | 7 |
| 06 | novelty-verdict | 12 | 4 |
| 07 | yubios-integration-path | 12 | 7 |
| 08 | open-problems | 12 | 7 |

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
