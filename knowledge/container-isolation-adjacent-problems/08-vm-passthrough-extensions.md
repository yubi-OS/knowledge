# Device passthrough at the VM boundary

Scope: extending the ephemeral VM boundary with real devices: YubiKey USB passthrough for FIDO2 testing, GPU passthrough, and nested virtualisation on ARM.

## Why passthrough belongs to the VM boundary only

Passthrough is the mechanism that lets a test inside the strongest isolation boundary still touch real hardware. Containers and nspawn share the host kernel and device tree, so their "devices" are the host's own; a VM has emulated hardware, and only explicit passthrough bridges the two. On yubiOS this matters most for identity: the FIDO2 unlock leg of a whole-OS test needs a real security key attached to the guest.

## USB passthrough for FIDO2 keys

QEMU has first-class support for this case. The u2f-passthru device allows you to connect a real hardware U2F key on your host to a guest VM; all requests made from the guest are passed through to the physical key [https://qemu.readthedocs.io/en/v10.0.3/system/devices/usb-u2f.html, weight: high]. A U2F security key is a USB HID device implementing the U2F protocol, and QEMU supports both pass-through of a host U2F key device to a VM and software emulation of a U2F key [https://www.qemu.org/docs/master/system/devices/usb-u2f.html, weight: low]. The generic USB layer underneath supports this composition: QEMU automatically creates and connects virtual USB hubs as necessary to connect multiple USB devices, and the QEMU EHCI adapter supports USB 2.0 devices, usable standalone or with companion controllers for USB 1.1 devices [https://www.qemu.org/docs/master/system/devices/usb.html, weight: high].

The passthrough is the isolation boundary that lets the FIDO2 leg run at all: without it, the guest sees no key, and the unlock path goes untested. A software alternative exists: Virtual FIDO is a virtual USB device that implements the FIDO2/U2F protocol like a YubiKey to support 2FA and WebAuthN [https://github.com/bulwarkid/virtual-fido, weight: high], useful where no physical key can be attached, though it tests the protocol path rather than the physical key. Community experience with real YubiKeys over KVM confirms the pattern works, with USB passthrough to the VM being the standard route [https://discussion.fedoraproject.org/t/fido-and-fedora-yubikey-c-bio/82462, weight: low].

## GPU passthrough

The GPU is the other device class pulled through the VM wall. Ubuntu's server documentation covers configuring GPU virtualization with QEMU/KVM, including graphics frontends, backends, 3D acceleration, and advanced passthrough options [https://ubuntu.com/server/docs/how-to/graphics/gpu-virtualization-with-qemu-kvm/, weight: high]. Full passthrough of a physical GPU requires binding the device away from the host and handing it to the guest; practitioner guides describe the workflow of smoothly binding and unbinding GPU devices from the host system to a VM [https://github.com/slackdaystudio/qemu-gpu-passthrough, weight: low], with tooling to detect AMD or Intel CPUs, provide the correct IOMMU kernel arguments, and use ls-iommu to find PCI devices to passthrough [https://github.com/HikariKnight/QuickPassthrough, weight: low]. The security property to note: a passed-through device is a direct hardware path into the guest, so it widens the boundary in exchange for capability. On yubiOS GPU passthrough is an extension of the VM boundary, used only when the test needs the device, never as the default.

## Nested virtualisation on ARM

ARM adds a second-order question: can the VM boundary itself be nested, so a CI host (itself a VM) can run yubiOS VM tests? The answer on arm64 is yes with recent kernels: KVM/arm64 nested virtualisation support landed as a bi-annual drop of NV support code, with fixes for wrong MMU context selection that led to failing TLB invalidations and handling of nested faults [https://lwn.net/Articles/877175/, weight: high]. The practical consequence for the boundary family: ephemeral VM tests can run inside VM-based CI runners on ARM, so the strongest boundary remains available even when the build host is not bare metal. It also means the test layer does not collapse when hardware access is unavailable: nested virt preserves the kernel boundary that nspawn cannot provide.

## Boundary accounting

Passthrough trades isolation for fidelity, always. USB passthrough of a YubiKey gives the guest a real cryptographic device, which is the point of the test, but it also gives the guest direct access to a hardware root of trust; the same channel that lets the guest unlock a disk lets a compromised guest touch the key. That is why the pattern is scoped: passthrough attaches for the specific test that needs the device and is absent from every other VM in the family. The general rule the extensions illustrate: the VM boundary is the only layer where hardware fidelity and kernel isolation can be combined, and each passthrough is a deliberate widening of that boundary for one named test.
