# 02 QEMU TPM integration

Scope: how QEMU attaches a software TPM to a guest, the -tpmdev emulator backend, and choosing between the tpm-tis and tpm-crb guest devices.

## The two halves of QEMU TPM support

QEMU TPM support has a backend half and a guest-side half. On the backend side, QEMU's TPM emulator device "uses an external TPM emulator called 'swtpm' for sending TPM commands to and receiving responses from. The swtpm program must have been started before trying to access it through the TPM emulator with QEMU" [1] (weight 0.723). On the guest-side, the QEMU TPM emulation "implements a TPM TIS hardware interface following the Trusted Computing Group's specification 'TCG PC Client Specific TPM Interface Specification (TIS)'" [2] (weight 0.937).

In practice this means the QEMU command line carries two related options: -tpmdev emulator selects swtpm as the TPM backend, and the accompanying device option selects the guest-visible hardware model. The tpm2-software community tutorial walks exactly this path, "leverage the swtpm as the TPM simulator" and then install and launch QEMU against it [3] (weight 0.861).

## tpm-tis vs tpm-crb

The TIS interface follows the TCG PC Client TIS specification [2] (weight 0.937). The CRB (Command Response Buffer) interface is the other standard guest-side model, and real-world platform integrations treat the pair as a version-paired choice: OpenStack's Nova documentation refuses the combination of "model tpm-crb" with TPM "version 1.2", and notes that scheduling fails "if flavor and image supply conflicting values" [4] (weight 0.932). The rule of thumb that falls out of that pairing discipline: TPM 2.0 guests use tpm-crb or tpm-tis with version 2.0; mixing a 1.2 backend version with a 2.0-era CRB device is an invalid configuration, not a graceful fallback.

For a CI harness this becomes a cheap assertion: boot the VM, and check that the guest reports the TPM model the test matrix asked for, because a mismatch would have been rejected at launch time in stricter stacks [4] (weight 0.932).

## Device ordering and startup

The swtpm program "behaves like a hardware TPM and therefore needs to be initialized by the firmware running inside the QEMU virtual machine. One necessary step for initializing the device is to send the TPM_Startup command to it" [5] (weight 0.901). This is the constraint that decides which test designs work under DirectBoot: whatever boots the guest has to either be firmware that issues TPM_Startup, or the test has to issue TPM_Startup itself from inside the guest before TPM-dependent checks run.

After a successful boot, the guest "should see a TPM device such as /dev/tpm0 which can be used in the same manner as a" hardware TPM [4] (weight 0.932). The host-side startup order is equally strict: swtpm first, QEMU second [1] (weight 0.723).

## Why the host-side attachment route

For yubiOS's bcvk ephemeral VMs the reliable route is host-side QEMU vTPM attachment: swtpm runs on the host, QEMU gets -tpmdev emulator plus an architecture-appropriate TPM device, and the guest kernel exposes the device nodes (yubiOS ref premise; see docs 03 and 05). The pattern is not yubiOS-specific: the SUSE Virtualization Guide documents the same shape, noting that QEMU "supports the software TPM emulator that is included in the swtpm package" and that, "compared to a hardware TPM device, the emulator has no limit on the number of guests that can access it" [6] (weight 0.890).

That unlimited-guests property is what makes parallel CI lanes trivially scale: each lane starts its own swtpm with its own state directory and its own socket, and no runner contention exists [6] (weight 0.890).

## Worked references

Step-by-step guides confirm the wiring end to end: a QEMU + OVMF + swtpm setup guide on Fedora with "similar" Debian packaging [7] (weight 0.776), and a Yocto-flavored ARM example that runs "swtpm TPM emulator on the host machine, and then launch[es] QEMU Arm device emulator that talks with the swtpm process" [8] (weight 0.272, weak backing).

## Sources

1. https://github.com/OpenCDP/QEMU-CDP/blob/master/docs/specs/tpm.rst (weight 0.723)
2. https://www.qemu.org/docs/master/specs/tpm.html (weight 0.937)
3. https://tpm2-software.github.io/2020/10/19/TPM2-Device-Emulation-With-QEMU.html (weight 0.861)
4. https://docs.openstack.org/nova/latest/admin/emulated-tpm.html (weight 0.932)
5. https://www.qemu.org/docs/master/specs/tpm.html (weight 0.901)
6. https://documentation.suse.com/sles/15-SP5/html/SLES-all/tpm.html (weight 0.890)
7. https://github.com/tompreston/qemu-ovmf-swtpm (weight 0.776)
8. https://ejaaskel.dev/yocto-emulation-setting-up-qemu-with-tpm/ (weight 0.272, weak)
