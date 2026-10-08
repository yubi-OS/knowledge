# 09 - Measured boot and IMA integration

Scope: how the runtime leg composes with measured boot and IMA in an image-based OS: PCR state, the IMA measurement log, appraisal, and the quote-to-log binding. Ground source: the yubiOS skill covers the runtime leg of the evidence shape; this doc supplies the boot-to-runtime composition detail it presumes.

## The two measurement sources

A yubiOS node produces two kinds of measurement evidence, and they answer different questions:

- Measured boot writes hash chains into TPM PCRs as firmware, bootloader, and kernel components load. The measurement is cumulative and hardware-rooted.
- IMA measures files at exec and mmap time, extending their hashes into PCR 10 and appending them to the IMA measurement list.

The IMA documentation describes the measurement feature precisely: it requires both a TPM and an independent verifier. Measurement is similar to the pre-OS trusted boot concept. The first measurement is the boot aggregate, which is a hash of TPM PCR 0-9. IMA keeps a table of the measured hash values, and if a hash is seen again, the contents are not re-measured (source: https://ima-doc.readthedocs.io/en/latest/ima-concepts.html, jev weight 0.76).

## Why the binding matters

The Keylime project's own explainer states the composition thesis: the benefit of anchoring the aggregate integrity value in the TPM is that the measurement list cannot be compromised by any software attack without being detectable. With the CRTM-based boot process measured and IMA measured files (including runtime access of said files), you have a full attested boot state and runtime integrity environment (source: https://keylime.dev/blog/2019/04/02/running-IMA-on-keylime.html, jev weight 0.54, moderate backing).

In evidence-shape terms: the quote (TPM2 quote over PCRs including PCR 10) covers the measurement (the IMA measurement list), and the cryptographic extension chain is what makes the coverage real. A quote over PCR 10 without the measurement log is unverifiable; a measurement log without the quote is untrusted.

## How Keylime consumes both

Keylime's runtime integrity monitoring loads a runtime policy of golden hashes into the verifier, polls TPM quotes to PCR 10, and validates the agent's file state against the policy (source: https://keylime.readthedocs.io/en/latest/user_guide/runtime_ima.html, jev weight 0.88). Beyond hash allowlists, Keylime supports verification of IMA file signatures, which helps detect modifications on immutable files and can complement or even replace the allowlist of hashes in the runtime policy when all relevant executables and libraries are signed (same source, jev 0.88). For an image-based OS where all runtime binaries come from a verified immutable image, signature verification is the more natural policy: the image build already knows the signing identity.

For the boot side, Keylime supports measured boot verification: a "measured boot reference state," or mb_refstate, specified by the operator (the tenant), is used in a fashion similar to the IMA policy by the keylime_verifier to compare the contents of the boot measurements (source: https://github.com/keylime/keylime-docs/blob/master/docs/user_guide/use_measured_boot.rst, jev weight 0.85; also described in the v6.5.2 documentation PDF, jev 0.86). So the verifier holds two declarative expectations, mb_refstate for PCRs and the runtime policy for PCR 10, and both are declarative-policy artifacts in the P3 sense the source doc describes.

## The image-based OS composition

Microsoft's guidance for confidential VMs describes the same composition from the TEE side: measure a read-only workload image with dm-verity and Linux IMA, then use confidential VM attestation to verify the measurements (source: https://learn.microsoft.com/en-us/azure/confidential-computing/how-to-attest-linux-workload, jev weight 0.82). This is the exact pattern yubiOS's image model implies: an immutable, dm-verity-verified /usr (per the `dm-verity-and-integrity` and `composefs-kernel-floors` skills) gives a stable measured input, IMA carries runtime file-level evidence into PCR 10, and the confidential-VM attestation report (doc 04) or Keylime quote (doc 01) packages it.

Weak-backing note: supplementary pages on PCR semantics and TPM mechanics at https://www.systutorials.com/understanding-tpm-2-0-and-platform-configuration-re (jev 0.20), https://medium.com/@dineshmurugesan69/how-tpm-measured-boot-works-from-silicon-t (jev 0.13), and a Jetson IMA attestation repo (jev 0.11) were excluded from claim support, as was a deepwiki page (jev 0.14).

## Design implications for yubiOS

- Derive the IMA runtime policy from the image content at build time, so the golden hashes are per-image-generation, not generic.
- Prefer IMA signature verification over hash allowlists where the image build signs executables, since it composes with the existing signing identity chain.
- Keep mb_refstate and the runtime policy in the same declarative artifact family so verifier policy and image builds evolve together.
- The boot aggregate (PCR 0-9) plus PCR 10 gives one quote surface for the whole "what am I running" claim, which is what the evidence bundle in doc 02 packages.
