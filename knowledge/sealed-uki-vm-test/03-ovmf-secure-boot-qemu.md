# Booting a signed UKI in QEMU with OVMF Secure Boot

Scope: OVMF as the UEFI firmware for x86 QEMU VMs, pflash storage of UEFI variables, enrolling the platform root of trust (ROTPK) into the db allowed-signatures store, and asserting SecureBoot=yes from systemd-stub.

## OVMF and UEFI variable storage

UEFI for x86 QEMU/KVM VMs is called OVMF, the Open Virtual Machine Firmware (weight 0.853, https://docs.fedoraproject.org/en-US/quick-docs/uefi-with-qemu/). With Secure Boot enabled, the Fedora quick doc reports the string `Secure boot enabled` appearing in dmesg, and Secure Boot remains enabled for every subsequent boot (weight 0.853, https://docs.fedoraproject.org/en-US/quick-docs/uefi-with-qemu/). That dmesg check is one precedent for the yubiOS lane's runtime assertion, which instead reads the Secure Boot state from systemd-stub (`systemctl show systemd-stub` shows `SecureBoot=yes`) inside the booted guest (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md).

QEMU's developer documentation states the storage model the lane depends on: the traditional approach for UEFI variable storage in QEMU guests is to work as close as possible to physical hardware, providing pflash as storage and leaving management of variables and flash to the guest. Secure Boot support comes with the requirement that UEFI variable storage must be protected against direct access by the OS (weight 0.908, https://www.qemu.org/docs/master/devel/uefi-vars.html). This is why the lane passes two pflash drives: a read-only `OVMF_CODE.fd` for firmware code and a writable `OVMF_VARS.fd` for the variable store, which is where the enrolled keys live (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md).

## Enrolling the root of trust in db

Getting a custom root of trust into OVMF without manual intervention is a known workflow. Red Hat's solution note addresses exactly this scenario: enrolling a third-party or own certificate into the UEFI firmware and enabling Secure Boot without manual intervention, for cases such as self-signed kernel modules (weight 0.904, https://access.redhat.com/solutions/6967078). The qemu-ovmf-secureboot tooling takes a different approach to generating a VARS file: it requires an X.509 certificate from a vendor, supplied as an SMBIOS OEM string to QEMU via ovmf-vars-generator, so the certificate can be enrolled as the Secure Boot Platform Key in OVMF virtual machines (weight 0.629, https://github.com/rhuefi/qemu-ovmf-secureboot).

Community testbeds document the same enrollment problem from the practitioner side. The uefi-secureboot-testbed repo states that getting Secure Boot working in QEMU requires some poorly-documented QEMU magic, and OVMF firmware images from the EDK II project, with libvirt used to manage VMs where resilience matters (weight 0.685, https://github.com/nosoxon/uefi-secureboot-testbed). A Debian-focused scratchpad repo logs the steps taken locally to set up and test Secure Boot in a QEMU virtual machine (weight 0.532, https://github.com/salrashid123/secure_boot). A vendor appliance guide walks through generating Secure Boot keys with OpenSSL and configuring them for QEMU with OVMF (weight 0.645, https://docs.openedgeplatform.intel.com/dev/image-composer-tool/configuration/configure-secure-boot.html). A lower-weighted gist documents certificate enrollment in UEFI OVMF Secure Boot directly (weight 0.496, weak backing, https://gist.github.com/rgl/fd1104c9d63843def5a111863df99898).

libvirt's knowledge base documents Secure Boot enablement and the cases where it is relaxed to run unsigned code, which is useful context for what the VM must NOT do (weight 0.889, https://libvirt.org/kbase/secureboot.html).

## The lane's boot configuration

The sealed lane boots QEMU with `q35` machine type with SMM on and KVM acceleration, a host CPU, 4 GB of RAM, the two OVMF pflash drives, the built disk image, virtio-blk and virtio-net devices, and a TPM device backed by swtpm over a socket character device (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). The Secure Boot enforcement itself comes from OVMF: with the yubiOS ROTPK enrolled in the db (Secure Boot allowed signatures) store in `OVMF_VARS.fd`, OVMF refuses to execute a UKI whose signature chain does not terminate at that key (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md).

## Negative path: missing ROTPK

The lane's third negative test boots the VM without enrolling the yubiOS ROTPK and asserts that OVMF refuses the unsigned UKI (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). This is the firmware-side enforcement test, complementing the tampered-UKI test (signature present but content modified) covered in the tamper doc. The distinction matters: a missing key fails the trust chain at the db lookup, while a tampered image fails at signature verification.

## Evidence precedents

Two public repos demonstrate that full Secure Boot VM testing pipelines are buildable: the uefi-secureboot-testbed (weight 0.685) and the Debian Secure Boot scratchpad (weight 0.532), both cited above. QEMU's own documentation for its UEFI variables design is the strongest primary source in this doc's dig (weight 0.908, https://www.qemu.org/docs/master/devel/uefi-vars.html).

## Gaps

The dig did not surface a primary source for the exact OVMF variable names of the db allowed-signatures store or for tooling that performs db-only (not PK/KEK) enrollment non-interactively. The lane's enrollment step should be validated against the OVMF/edk2 documentation directly during implementation.
