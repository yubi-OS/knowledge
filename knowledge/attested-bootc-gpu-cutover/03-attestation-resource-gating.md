# 03 Attestation-based resource gating: IMA, measured boot, and Trustee/KBS

Scope: the three attestation stacks the synthesis draws on, in-kernel integrity (IMA, dm-verity, TPM PCRs), remote attestation and policy (Confidential Containers Trustee and KBS), and where resource release is decided today.

## In-kernel integrity: IMA and dm-verity

The IMA measurement flow is documented as a sequence: match a file's attributes against a policy measurement rule, calculate a hash over the contents if the rule applies, append the measurement to the IMA event log, and extend the hash into a TPM PCR; an attestation can then verify the integrity of the system state from that chain (weight 0.83, https://ima-doc.readthedocs.io/en/latest/ima-concepts.html).

Microsoft's confidential-computing documentation pairs dm-verity and IMA explicitly: dm-verity enforces integrity locally, while IMA provides the evidence for remote verification. The same page records a subtle fact the synthesis's PCR-replay claim depends on: PCR 10 does not contain the dm-verity root digest directly, it accumulates measurements from an ordered log that includes the device-mapper configuration (weight 0.91, https://learn.microsoft.com/en-us/azure/confidential-computing/how-to-attest-linux-workload).

At the firmware level, the TPM is described as a tamper-proof, cryptographically secure auditing component whose boot configuration log carries hash-chained measurements recorded into Platform Configuration Registers during measured boot (weight 0.89, https://learn.microsoft.com/en-us/azure/security/fundamentals/measured-boot-host-attestation). A secondary summary of the systemd boot chain describes progressive extension of measurements from firmware through userspace into TPM PCRs, including dm-verity tree measurements extended into NV PCRs (weight 0.21, https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot, weak backing). Hardware roots for these flows are commodity: dedicated TPM/HSM modules provide key management, signing, and secure storage (weight 0.53, https://www.linutronix.de/industrial_linux/security_tpm_hsm_modul.php).

## Remote attestation and policy: Trustee and KBS

Confidential Containers uses Trustee to verify attestations and conditionally release secrets; attestation provides guarantees about the TCB, isolation properties, and root of trust of the enclave (weight 0.95, https://confidentialcontainers.org/docs/attestation/, and weight 0.91 for the same page in a second query). The Trustee repository describes the components as tools for attesting confidential guests and providing secrets to them, operating on behalf of the guest owner (weight 0.90, https://github.com/confidential-containers/trustee).

The policy output shape is standardized inside CoCo: the attestation policy produces an AR4SI trust vector, a generic representation of TCB status, and that result is one of the main components of the attestation token (weight 0.96, https://confidentialcontainers.org/docs/attestation/architecture/).

Resource release is where the synthesis's C3 hook lives. KBS resource policies control whether a resource is released to a guest; the input to such a policy is the URI of the requested resource plus the attestation token (weight 0.72, https://confidentialcontainers.org/docs/attestation/policies/). The KBS attestation protocol documentation adds the selection mechanics: KBS maps each policy-selector to one or more attestation policies, accepted values are deployment-specific, an unmapped policy-selector is rejected, and omitting the field selects a default policy (weight 0.90, https://github.com/confidential-containers/trustee/blob/main/kbs/docs/kbs_attestation_protocol.md).

## What the gating stacks do and do not gate

Across the three stacks the dig shows a consistent pattern: attestation verdicts gate secrets and resources inside a TEE-managed flow, and firmware or kernel measurement chains prove what booted. What no kept result shows is any of these stacks evaluating an image digest or measurement at a libvirt VM launch boundary, or gating a PCI device attachment on that evaluation. The CoCo/KBS machinery is the closest building block (a policy engine whose input is an attestation token and whose output is a release decision), which is why doc 04 models the Boot Admission Policy on it.

## Source-quality note

The strongest sources here are project documentation (Confidential Containers, IMA readthedocs) and vendor engineering documentation (Microsoft Learn), all at weight 0.83 or higher. The systemd deepwiki summary is weak backing (0.21) and is cited only for orientation. Two off-topic results (a dictionary entry for "confidential" and the Institute of Management Accountants homepage) were weighted 0.03 and 0.10 respectively and are excluded from any claim.
