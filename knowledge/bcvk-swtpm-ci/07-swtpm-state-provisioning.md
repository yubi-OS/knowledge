# 07 swtpm state and provisioning

Scope: how a swtpm instance is provisioned with certificates via swtpm_localca, how its persistent state is managed across ephemeral runs, and how sealing flows are exercised against it.

## The local CA path

A factory TPM ships with an endorsement key and platform certificates. swtpm simulates this with swtpm_localca, configured through /etc/swtpm-localca.conf: "The file /etc/swtpm-localca.conf contains configuration variables for the swtpm_localca program. Entries may contain environment variables that will be resolved" [1] (weight 0.903; corroborated by the openSUSE man page at weight 0.568).

The CA layout is explicit in the man page: "The root CA's private key and certificate will be located in the same directory as the signing key and have the names swtpm-localca-rootca-privkey.pem and swtpm-localca-rootca-cert.pem respectively" [2] (weight 0.901; same wording in the Ubuntu man mirror at weight 0.874). An environment variable SWTPM_ROOTCA_PASSWORD can protect the root CA key [2] (weight 0.901).

For CI this is the provisioning story: point swtpm_setup at a local CA (docs 01), and every ephemeral VM boots with an EK and certificates chainable to a CA the test harness controls, so UEFI and guest flows that validate TPM certificates behave realistically without any pre-existing hardware identity.

## Persistent state across ephemeral runs

A swtpm instance's state is a directory of files the emulator reads and writes; the resettable-state property is what makes per-run reproducibility possible: re-run swtpm_setup against a fresh state directory and every CI run starts from the same simulated manufacturing state [3] (weight 0.902). The inverse matters for persistence-sensitive tests: keep the state directory across runs when a flow needs continuity (enroll, reboot, unlock), and blow it away when a flow needs a clean TPM.

The pairing rule that falls out for yubiOS CI (yubiOS ref premise): the bcvk VM lifecycle is ephemeral by design, so any continuity the test needs has to live in files the harness explicitly carries between VM incarnations, with the TPM state directory as the controllable knob.

## Sealing and unsealing flows

The TPM's sealing primitive is what TPM-backed secret flows build on. Microsoft's fundamentals page defines it plainly: "This process is referred to as sealing the key to the TPM. Decrypting the key is called unsealing. The TPM can also seal and unseal data that is generated outside the TPM" [4] (weight 0.945).

Concrete seal-to-PCR tooling exists off the shelf: tpmseal is "CLI and golang library to seal and unseal data to a TPM with PCR or AuthValue (password) policies. Basically, you can take data upto 128bytes, encode it directly into a TPM object such that it can only get conditionally decoded on that same TPM" [5] (weight 0.537). The safeboot project's tpm2-attest wraps the attestation primitives into "a simple script that provides the four main attestation functions: sign a quote, validate a signed quote, seal a secret for a spec"ific PCR state, and unseal [6] (weight 0.669).

For a swtpm-backed VM lane these tools run against the emulator exactly as against hardware, because they speak the standard TPM command surface through the TSS stack. That makes seal/unseal and quote-validation testable in CI, with the PCR state controlled by the VM's own boot path rather than by whatever the physical machine last booted.

An ecosystem reference for the disk-encryption variant is Canonical's secboot documentation, which explains "the process of sealing cryptographic keys to a TPM (Trusted Platform Module) device and unsealing them for use in disk encryption" [7] (weight 0.395, weak backing). An Infineon writeup notes the BitLocker use of the same primitive, "encrypting the BitLocker key with the TPM which is used for disk encryption" [8] (weight 0.489, weak backing).

## What stays off the software path

Sealing exercises the TPM's key hierarchy and PCR policy logic, which the emulator models faithfully. What it cannot model is hardware-specific behavior: the physical YubiKey flows that yubiOS's unlock paths depend on remain on the hardware leg (yubiOS ref premise; see doc 05).

## Sources

1. https://man.archlinux.org/man/extra/swtpm/swtpm-localca.conf.5.en (weight 0.903)
2. https://man.archlinux.org/man/extra/swtpm/swtpm_localca.8.en (weights 0.901)
3. https://man.archlinux.org/man/swtpm_setup.8.en (weight 0.902)
4. https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals (weight 0.945)
5. https://github.com/salrashid123/tpmseal (weight 0.537)
6. https://safeboot.dev/attestation/ (weight 0.669)
7. https://deepwiki.com/canonical/secboot/4.1-key-sealing-and-unsealing (weight 0.395, weak)
8. https://community.infineon.com/t5/Blogs/Sealing-and-unsealing-data-in-TPM/ba-p/465547 (weight 0.489, weak)
