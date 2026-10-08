# 04 - Confidential containers attestation (TDX, SEV-SNP, H100 CC)

Scope: confidential computing attestation for Intel TDX, AMD SEV-SNP, and NVIDIA H100 CC, and the CoCo attestation-agent evidence path. Ground source: the yubiOS skill names "confidential-container TDX/SEV-SNP/H100 CC attestation" as the third attestation framework it anchors.

## The CVM hardware layer

Two empirical studies dominate the comparative literature the dig surfaced. The paper "Confidential VMs Explained" presents a detailed empirical analysis of AMD Secure Encrypted Virtualization-Secure Nested Paging (SEV-SNP) and Intel Trust Domain Extensions (TDX): it reviews their microarchitectural components and evaluates performance across memory management, computational and I/O performance, and attestation (sources: https://dl.acm.org/doi/10.1145/3700418, jev weight 0.69; companion publication https://dl.acm.org/doi/10.1145/3744970.3727280, jev weight 0.66). The relevant point for yubiOS is that TDX and SEV-SNP both produce hardware rootable attestation evidence, but the evidence formats, quote flows, and performance characteristics differ enough that treating them as one undifferentiated "confidential VM" feature would be a design error.

The dig also surfaced vendor marketing pages on TDX versus SEV-SNP comparisons that carried weak weights (https://voltagegpu.com/blog/tdx-vs-sev-snp-confidential-ai-2026, jev 0.11; https://stealthcloud.ai/cloud-paradigms/confidential-computing-deep-dive/, jev 0.15) and an Intel homepage hit (jev 0.14). These were excluded from claim support.

## Attestation as the keystone

Red Hat's explainer on the confidential containers attestation flow frames why this leg exists at all: attestation is a confidential computing keystone. With attestation, workload owners can fully assert the trustworthiness of the hardware and software environment their workload is running in, regardless of the security posture of the underlying infrastructure provider (source: https://www.redhat.com/en/blog/understanding-confidential-containers-attestation-flow, jev weight 0.56, moderate backing). That framing is exactly the threat model the yubiOS confidential-VM leg addresses: the host is untrusted, the evidence must come from the TEE hardware itself.

## The CoCo evidence path

The Confidential Containers project documents the evidence path directly. Its "Get Attestation" feature documentation describes runtime data being included in the attestation report: "Typically this is used to bind a nonce or the hash of a key to the evidence." It also carries two security caveats verbatim relevant to yubiOS design (source: https://confidentialcontainers.org/docs/features/get-attestation/, jev weight 0.78):

- Enabling runtime-data binding can make a workload vulnerable to so-called "evidence factory" attacks, where the same evidence is replayed for different workloads.
- By default, different CoCo workloads can have the same TCB (Trusted Computing Base), even if they use different container images. So a TCB-match alone does not prove the right workload is running; the evidence must be bound to something workload-specific.

CoCo's setup documentation describes wiring the workload to an attestation service: when using Trustee with Confidential Containers, you point the CoCo workload to your Trustee instance, either with an annotation on the workload or via init-data (source: https://confidentialcontainers.org/docs/attestation/coco-setup/, jev weight 0.73). The dig also surfaced a community attestation service at https://github.com/confidential-filesystems/coco-attestation-service with weak weight (0.29), excluded from claim support.

## Mapping to the evidence shape

For the confidential-VM leg:

- Quote: the TEE hardware attestation report (TDX TD report or SEV-SNP attestation report; NVIDIA H100 CC attestation plays the same role for GPU workloads).
- Measurement: the launch measurement plus the runtime data bound into the report (nonce or key hash per the CoCo docs).
- Evidence bundle: the report plus the TEE-specific verification collateral, packaged for the relying party.
- Rekor v2 anchor: the transparency-log entry applied at packaging time, same as the other legs (doc 05).

## The evidence-factory caveat deserves weight in yubiOS design

The CoCo warning that different workloads can share a TCB is the sharpest design constraint in this doc. If yubiOS runs two different confidential workloads on identical TCB configurations, a stolen evidence blob from one is syntactically valid for the other unless the evidence carries a workload-bound nonce. That maps directly to the 4-component shape's insistence on binding measurement to evidence: the binding step is not decoration, it is the countermeasure against evidence factory attacks.

Weak-backing note: a cloud-vendor attestation-evidence explainer at https://docs.privatemode.ai/security/attestation/attestation-evidence/ (jev 0.45) fell below the 0.5 threshold and is labeled weak if cited anywhere; it was not used as claim support here.
