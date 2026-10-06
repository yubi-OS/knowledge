# 06 - IMA policy: appraisal vs audit, signed policies, PCR 10

**Scope:** how IMA carries the boot-time trust chain into runtime userspace, the appraisal-versus-audit split yubiOS applies by path, why the policy itself must be signed, and how PCR 10 feeds attestation.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## What IMA does

Per the source doc, IMA (Integrity Measurement Architecture) extends the dm-verity/fs-verity/composefs chain into runtime userspace: the kernel measures every file that is opened, or executed depending on policy, and extends the measurement into a TPM PCR. Where dm-verity checks blocks once at mount time, IMA re-checks files continuously while the system runs, which is why the source doc calls it the runtime equivalent of the block-level check.

## The two modes and the yubiOS path split

The source doc pins yubiOS's policy split:

- **Appraisal mode** for `/usr/bin`, `/usr/sbin`, `/usr/lib`: any executable whose measurement does not match the signed policy is denied, and execve returns -EACCES.
- **Audit mode** for `/etc`, `/var`, `/home`: measurements are logged to the audit subsystem but not denied.

The asymmetry is deliberate. The /usr executable tree is already dm-verity-verified at mount, so appraisal there enforces the same trust chain at execve granularity. /home is user-mutable, so the source doc treats IMA appraisal on /home as an anti-pattern: it would deny every legitimate user file. Audit mode gives observability without breaking users.

## Signed policies

Per the source doc, the IMA policy is signed (ima-sig template) and stored at `/etc/ima/policy`, and the signing key is the yubiOS build-time signing key. The anti-pattern list explains why this is non-negotiable: mixing dm-verity and IMA appraisal without a signed IMA policy leaves the policy itself tamperable, and the chain is only as strong as its weakest signed link. An attacker who could rewrite the IMA policy could simply appraise the files they replaced.

Secondary sources corroborate the configuration mechanics at weaker weights. The openEuler IMA documentation describes the digest-list deployment model (weight 0.70, https://docs.openeuler.org/en/docs/25.03/server/security/trusted_computing/ima.html): the IMA digest-list mechanism supports entering appraisal mode immediately after installation, and supports software package installation and upgrades in appraisal mode without requiring a separate fix mode for file marking. That property matters for a bootc-style yubiOS, where an image upgrade must not force the system out of appraisal.

The IMA configuration documentation covers the kernel-configuration interactions (weight 0.50, https://ima-doc.readthedocs.io/en/latest/ima-configuration.html): the kernel configuration includes methods using `CONFIG_KEXEC_SIG` and `CONFIG_MODULE_SIG`, and if those are not enabled, IMA verifies (appraises) the signatures itself; for example, if `CONFIG_KEXEC_SIG` is true the kernel requires and verifies the signature over the kernel image, while if false, `CONFIG_IMA_ARCH_POLICY` adds an IMA appraise rule for kexec kernels. When auditing a yubiOS kernel config, these options decide which layer owns each signature check.

The sourceforge linux-ima wiki is the project's historical home for IMA documentation (weight 0.33, https://sourceforge.net/p/linux-ima/wiki/Home/), and strongSwan's IMA documentation describes the remote-attestation use of IMA measurements (weight 0.28, https://docs.strongswan.org/docs/latest/tnc/ima.html). Both are weak backing relative to the kernel docs and the source doc, cited for orientation only.

## PCR 10 and the attestation handoff

Per the source doc, the IMA measurement list is reflected in PCR 10. At attestation time, a TPM2 PCR quote over PCR 10 plus PCR 11 (the UKI PCR) gives a complete boot-time-to-current-state attestation. PCR 11 covers the unified kernel image, so the combined quote spans from the measured kernel all the way to every file the kernel has measured at runtime.

That attestation quote is consumed downstream: the source doc points to the `audit-evidence-packaging` skill, which packages evidence bundles and generates TPM2 attestation quotes over them. The IMA layer is therefore not only a denial mechanism, it is the runtime measurement stream that external auditors verify against.

## Debugging checklist

1. Deny on execve with -EACCES means appraisal fired; check whether the executable's measurement matches the signed policy and whether the policy itself was updated and re-signed (source doc behavior).
2. After a package or image upgrade, confirm appraisal stayed active; digest-list-based deployment is designed to survive upgrades without fix mode (weight 0.70, openEuler).
3. Verify the policy at `/etc/ima/policy` carries the ima-sig signature from the yubiOS build-time key; an unsigned policy invalidates the whole chain (source doc).
4. For an attestation bundle, quote PCR 10 and PCR 11 together (source doc).
