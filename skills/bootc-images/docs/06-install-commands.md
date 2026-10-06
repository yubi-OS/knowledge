# 06 - Install: to-disk, to-filesystem, and Secure Boot keys

Scope: the bootc install subcommands yubiOS uses, their options, and how Secure Boot key material travels inside the image.

## The two install verbs

bootc install has two target modes (source doc: yubi-OS/yubiOS skills/bootc-images/SKILL.md; corroborated by upstream install documentation mirrored at jmarrero.github.io/bootc/bootc-install.html, w=0.45, weak: third-party mirror of upstream docs):

1. `bootc install to-disk /dev/sda` installs the image to a raw disk, partitioning it in the process. This is the standard bare-metal path and the one bcvk drives for ephemeral VM tests (source doc).
2. `bootc install to-filesystem --sysroot /mnt/target` installs to an already partitioned and formatted filesystem, for provisioners that own partitioning themselves (source doc).

`bootc install print-configuration` prints the merged install config, including the target filesystem type the image requests (source doc).

## to-disk options yubiOS uses

From the source doc:

```bash
bootc install to-disk --filesystem xfs /dev/sda
bootc install to-disk --boot systemd-boot /dev/sda
```

The systemd-boot mode matters for yubiOS because the image ships systemd-boot and systemd-cryptsetup in its package set (doc 05), and because Secure Boot enrollment is automatic in this mode: bootc copies the key material from the image to the ESP.

## Secure Boot key enrollment

The mechanism (source doc): place signed EFI signature lists in `/usr/lib/bootc/install/secureboot-keys` in the container image. When installing with systemd-boot, bootc copies them to `ESP/loader/keys` for enrollment.

```dockerfile
RUN mkdir -p /usr/lib/bootc/install/secureboot-keys
COPY yubiOS-sb.esl /usr/lib/bootc/install/secureboot-keys/yubiOS-sb.esl
```

This is how the yubiOS trust chain travels: the build pipeline signs its key list, the image carries it, and install-time enrollment puts it in the firmware's key database without a manual firmware step. The keys live in /usr/lib (image-owned, immutable), not /etc, consistent with doc 04.

## Choosing between the verbs

- bcvk ephemeral VM tests and physical bare-metal installs: to-disk (source doc; bcvk-virtualization skill).
- Provisioners such as pre-partitioned images or custom partition layouts: to-filesystem with --sysroot (source doc).
- Anything needing the image's own filesystem preference: print-configuration first (source doc).

## What install does NOT do

Install is a one-time bootstrap, not an update mechanism. After install, the machine tracks its registry tag or digest via bootc upgrade / switch (doc 07). Re-running install on an installed system is not the upgrade path.

The install command also does not manage the YubiKey user-factor side of yubiOS: FIDO2 enrollment is a post-boot operation (systemd-homed and yubikey-operations skills); install only guarantees the PAM stack and tooling are present in the image.

## Verification after install

The source doc's checklist items that install affects:

- Kernel at /usr/lib/modules/$kver/vmlinuz copied to /boot by the installer (doc 02).
- composefs prepare-root.conf respected at first boot (doc 03).
- Secure Boot keys visible in ESP/loader/keys when systemd-boot mode was used (source doc).

A first-boot smoke test on bcvk with USB passthrough covers all of these before a physical rollout (bcvk-virtualization skill).

## Interaction with bcvk and CI

The bcvk-virtualization skill drives bootc install to-disk inside ephemeral QEMU VMs to produce disk images for testing, and adds YubiKey USB passthrough so FIDO2 enrollment can be exercised pre-rollout. The install verb choice there is always to-disk with the image's own defaults; explicit --filesystem flags are used only when reproducing a specific hardware layout.

In CI, install is exercised in its cheapest form: a lint run (doc 08) plus, where the runner permits, a to-disk install into a loopback or VM disk followed by a boot smoke test. Install is too heavyweight for every build; the lint gate catches the static requirements and the VM path catches the dynamic ones.

## Common failure modes

The source doc and lint checks imply the install-time failures to expect:

- A /boot conflict when the image shipped /boot content; the fix is to remove it from the image (doc 02), not to work around it at install.
- An install error on `enabled = verity` targets whose filesystem does not support fsverity (doc 03); the fix is to audit the target filesystem before rollout, not to soften the composefs setting silently.
- A missing bootloader enrollment when systemd-boot mode was not selected on a Secure Boot target; the keys were in the image but nothing enrolled them.
