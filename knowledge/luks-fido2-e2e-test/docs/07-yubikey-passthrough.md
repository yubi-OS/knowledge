# 07 - Real hardware: YubiKey passthrough and hardware-in-the-loop

Scope: exercising the production unlock path with a physical token, through USB passthrough into VMs or dedicated hardware runners, and why hardware legs remain the release authority.

## QEMU U2F passthrough

QEMU supports two modes for security keys: pass-through of a host U2F key device to a VM, and software emulation of a U2F key. The u2f-passthru device connects a real hardware U2F key on the host to the guest (QEMU documentation, https://www.qemu.org/docs/master/system/devices/usb-u2f.html, weight 0.850; QEMU 10.0.3 docs, https://qemu.readthedocs.io/en/v10.0.3/system/devices/usb-u2f.html, weight 0.682). This is the mechanism a hardware-in-the-loop CI runner uses: the runner host owns the physical YubiKey, and each VM leg attaches it through u2f-passthru so the guest sees a real CTAP device rather than an emulated one.

QEMU's broader USB emulation layer also ships a canokey device, an open-source secure key implementing FIDO2, OpenPGP, PIV, and more, which provides an emulated FIDO2-capable USB device path without host hardware (QEMU USB emulation docs, https://www.qemu.org/docs/master/system/devices/usb.html, weight 0.871).

## Software stand-ins versus real devices

The closest software analog to a passed-through token is a virtual USB device implementing the FIDO2 and U2F protocols, similar to a YubiKey; one such project, Virtual FIDO, is explicitly beta and under active development (GitHub virtual-fido, https://github.com/bulwarkid/virtual-fido, weight 0.747). The beta framing is itself the argument for the hardware leg: a software stand-in has its own bugs, its own protocol completeness gaps, and none of the physical token's attestation chain. Yubico positions FIDO2 as supporting multiple authenticator types, including built-in platform authenticators, synced passkeys, and highly portable external hardware security keys (Yubico, https://www.yubico.com/authentication-standards/fido2/, weight 0.639), and the external-key category is the one that maps to disk unlock.

USB passthrough constraints are real even outside QEMU: a troubleshooting article for Hyper-V documents that a YubiKey USB device may not appear in a VM because USB passthrough is not a native Hyper-V feature, and works through the supported alternatives (Microsoft Learn, https://learn.microsoft.com/en-us/troubleshoot/windows-server/virtualization/usb-device-hyper-v-virtual-machine, weight 0.653). The lesson generalizes: a harness design must verify at the hypervisor level that the token actually lands in the guest, not assume it.

## What the hardware leg uniquely proves

The hardware leg covers what no software leg can: the real token's timing under a boot timeout, its actual hmac-secret response for the enrolled credential, its behavior when the credential ID in the LUKS2 header was created by a different device or firmware, and the physical presence interaction during early boot (QEMU documentation, https://www.qemu.org/docs/master/system/devices/usb-u2f.html, weight 0.850; Yubico CTAP2.1 spec reference in doc 03, https://developers.yubico.com/CTAP/CTAP2.1.html, weight 0.860). Community walkthroughs of upgrading a LUKS system to YubiKey FIDO2 unlocking confirm that the end state is verified by an actual unlock attempt with the physical key, not by configuration inspection alone (Miguel Hernandez blog, https://mhdez.com/posts/unlocking-encrypted-linux-with-a-yubikey/, weight 0.437, weak backing).

## Harness design for hardware legs

Combining the sources: a hardware-in-the-loop design assigns a physical token to a runner, gates the leg on udev seeing the token on the host, attaches it via u2f-passthru to the guest VM, runs the same enrollment and unlock assertions as the CI legs, and treats a passthrough failure as an environment failure distinct from an unlock failure (QEMU documentation, https://www.qemu.org/docs/master/system/devices/usb-u2f.html, weight 0.850; Microsoft Learn, https://learn.microsoft.com/en-us/troubleshoot/windows-server/virtualization/usb-device-hyper-v-virtual-machine, weight 0.653). Because hardware capacity is scarce, the hardware leg runs on release candidates rather than every commit, while software legs carry the regression load; the division of authority is software legs for breadth, hardware legs for final confidence (GitHub virtual-fido, https://github.com/bulwarkid/virtual-fido, weight 0.747).
