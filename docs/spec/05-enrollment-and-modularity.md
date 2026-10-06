# Enrollment and modularity ladder

**Scope line:** sections 4.4 and 4.5: the first-boot enrollment service with its security gate and 4 skippable steps, the recovery-key rule, and the 4-rung modularity ladder for extending the system without touching the signed base.

Grounding spine: `yubi-OS/yubiOS docs/SPEC.md` (source doc). External mechanisms carry their own URL and jev weight below.

## First-boot enrollment

Section 4.4 specifies `yubiOS-enroll.service`, which fires on tty1 at first boot and is gated by `ConditionSecurity=measured-os` (ADR-016), "so enrollment refuses to run on a non-measured chain" (source doc). The gate is the fail-closed property: a machine that booted outside the measured boot chain cannot run the wizard that grants trust to it.

The condition name is a systemd mechanism. Independent writeups describe `ConditionSecurity=measured-os` as a systemd 261 unit condition that checks whether the system booted with measured-boot semantics (https://blog.servarat.net/systemd-261-a-local-metadata-proxy-that-doubles-as-a-security-control/, jev weight 0.06, weak; https://vmorecloud.com/systemd-261-lands-with-cloud-imds-tpm-and-network-updates/, jev weight 0.09, weak). Both sources are low-weight third-party blogs and are labeled as such, but they corroborate the version linkage the source doc asserts in section 4.6: the condition requires the systemd at least 261 floor.

## The 4 steps

The wizard runs 4 steps, "each skippable and independently re-runnable" (source doc):

1. Secure Boot signing.
2. Disk encryption.
3. SSH key.
4. sudo/login.

Each step corresponds to one row of the YubiKey interface map from section 3.2: the signing step provisions the PIV 9c signing path, disk encryption enrolls FIDO2 hmac-secret into the LUKS2 volumes, the SSH step generates resident ed25519-sk keys, and the sudo/login step sets up pam_u2f. The "independently re-runnable" property means a skipped step leaves no half-state: a later run can complete it alone.

## The recovery rule

The spec carries 2 backup requirements (source doc):

1. A recovery key MUST be enrolled alongside FIDO2, via `systemd-cryptenroll --recovery-key`, and stored offline.
2. A backup YubiKey SHOULD be enrolled.

The MUST/SHOULD split is deliberate under the RFC 2119 contract: the printed recovery key is not optional because a lost token with no recovery path is a data-loss event, while the second token is a recommended redundancy. See ONBOARDING.md for the full flow (source doc).

## The modularity ladder

Section 4.5 defines how to extend the system "without touching the signed base", ordered strongest trust first (source doc):

1. **systemd-sysext**: a verity plus PKCS#7 overlay on /usr.
2. **Portable services**: a `RootImage=` verity GPT image.
3. **systemd-nspawn**: a full secondary OS.
4. **flatpak/OCI**: the weakest rung, with no verity attestation.

The placement rule is normative: "New system components MUST enter at the highest rung that fits" (source doc). The ladder is a trust gradient measured by how much of the extension the verified chain can still attest. At rung 1 the overlay is itself verity-checked and PKCS#7-signed, so the immutability property of /usr extends over it. At rung 4, container payloads escape the verity attestation entirely and rely on their own distribution channels.

Upstream mechanics behind the rungs: portable services are systemd's mechanism for running service trees from immutable GPT images, positioned by systemd's own docs as a middle ground between container formats (https://systemd.io/PORTABLE_SERVICES/, jev weight 0.12, weak). sysext images are merged into /usr at boot by systemd-sysext.service (https://www.man7.org/linux/man-pages/man8/systemd-sysext.8.html, jev weight 0.14, weak). A yubi-OS knowledge-corpus note on Poettering's modularity essays describes the same ordering as a ladder rather than a menu, with portable services sitting between sysext overlays and nspawn containers (https://github.com/yubi-OS/knowledge/blob/main/knowledge/0pointer/07-portable-services-sysext.md, jev weight 0.26, weak).

## Why the ladder exists

The ladder exists because of the immutability principle: the signed base cannot be modified, so every legitimate need to add software has to be answered by a mechanism that does not modify it. Each rung is the answer to a different question. Sysext answers "add system files". Portable services answer "add a service bundle". Nspawn answers "need a whole different distro". Flatpak answers "desktop app". The MUST rule forces the question to be asked in the direction of trust rather than convenience.

## How enrollment and the ladder interact

The two mechanisms bracket the machine's trust lifecycle. Enrollment installs the owner's trust anchors into the 4 boundary mechanisms at first boot, gated on a measured chain; the ladder then governs every later change to the system surface. Neither ever writes into /usr of the signed base: enrollment writes keys into hardware and LUKS2 headers, and the ladder's strongest rung adds rather than amends.
