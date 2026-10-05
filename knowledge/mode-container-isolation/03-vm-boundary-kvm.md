# 03 The VM boundary: KVM, QEMU, and the libvirt default network

Scope: what a hardware-virtualized VM boundary (QEMU/KVM, as used by bcvk-style test tooling) isolates that container boundaries cannot, and how the default libvirt NAT network shapes the VM's network exposure.

Weight legend: 0.5 and above means authoritative backing; below 0.5 is labeled weak.

## Why the VM boundary is a different class

Containers are not virtual machines. Containers share the host kernel, and every kernel vulnerability is a potential escape vector that crosses the container wall directly [0.59, https://www.fosslinux.com/162244/why-containers-are-not-virtual-machines-shared-kernel-isolation-escapes.htm]. A VM moves the isolation line one layer down: the workload runs on its own guest kernel, and the host kernel only sees the hypervisor's device model. That structural difference is why the VM row is the answer to threats that a container boundary cannot answer, chiefly running code whose kernel-level behavior you do not trust.

The Kata Containers threat model, written for exactly this comparison, makes the shared-kernel fact explicit for KVM/QEMU setups: all VMs on a host share the same host kernel through KVM, which leads to specific scenarios where a compromise of the shared kernel affects every VM on that host [0.84, https://github.com/kata-containers/kata-containers/blob/main/docs/threat-model/threat-model.md]. In other words, the VM boundary is strong per-VM but not absolute: the hypervisor and host kernel remain a shared trust base across VMs.

## KVM and QEMU: who does what

QEMU is the open-source machine emulator and virtualizer that runs KVM and Xen virtual machines with near-native performance [0.84, https://www.qemu.org/]. KVM is the in-kernel accelerator; QEMU provides device emulation and process management. KVM and QEMU underpin production microVM isolation in runtimes like Firecracker and Kata Containers [0.52, https://northflank.com/blog/kvm-vs-qemu]. For the mode axis, the practical reading is that the VM boundary is mediated by two components (the kernel module and the VMM process), and both are part of the trust base you are extending when you trust a VM test run.

## The default libvirt network: virbr0 and NAT

When a VM is managed through libvirt, its default network attachment is a NAT-based virtual network on the host bridge virbr0. A virtual network switch operates in NAT mode by default, using IP masquerading [0.84, https://wiki.libvirt.org/VirtualNetworking.html]. The consequence, documented directly by libvirt: guests connected via a NAT virtual network can make any outgoing network connection they like, while incoming connections need explicit port forwarding [0.87, https://wiki.libvirt.org/Networking.html].

That asymmetry is the security-relevant fact of the VM network boundary in this mode. A bcvk-style ephemeral test VM on the default network can reach the internet and the host's other networks through masquerading, but nothing from outside can reach into it without a forwarding rule. The default network is created automatically when libvirt is set up, named "default", and uses NAT and packet forwarding to connect the emulated systems [0.74, https://linuxconfig.org/how-to-use-bridged-networking-with-libvirt-and-kvm]. Bridged networking is the alternative, which puts the VM directly on the LAN and removes the NAT barrier in both directions [0.74, https://linuxconfig.org/how-to-use-bridged-networking-with-libvirt-and-kvm].

A long-standing libvirt bug report records that the default virbr0 setup does not take the host's existing network configuration into account, which is one reason the bridge's state can differ from what tooling expects [0.11, weak, http://bugzilla.redhat.com/show_bug.cgi?id=235961].

## Cleanup signals and the mode's exit semantics

The mode axis cares about the VM row because an ephemeral VM's cleanup contract is usually "discard the disk image" plus "restore the host network state". The NAT facts above ground the second half: virbr0 is the well-known artifact of the default libvirt network [0.74, https://linuxconfig.org/how-to-use-bridged-networking-with-libvirt-and-kvm], so its state on the host is an observable trace of VM network setup and teardown. A downstream inference used in the yubiOS mode table is that virbr0 returning to its DOWN state after a test VM exits signals that cleanup ran; that is an inference from the libvirt default-network facts documented above, not a documented libvirt contract, and it should be validated per host before being used as a gate.

For the destructive one-shot VM row (flashing an image to a physical disk), the mode's protection is not isolation at all but a confirmation gate on the write path; that is covered in doc 06, grounded in the bootc install documentation.

## What the VM row answers, in one list

1. Guest kernel compromise does not directly become host kernel compromise; the hypervisor mediates [0.59, https://www.fosslinux.com/162244/why-containers-are-not-virtual-machines-shared-kernel-isolation-escapes.htm].
2. Untrusted code can be run under a guest kernel you control and replace per run [0.52, https://northflank.com/blog/kvm-vs-qemu].
3. Network exposure is controllable and asymmetric by default: outbound open, inbound blocked without forwarding rules [0.87, https://wiki.libvirt.org/Networking.html].
4. Residual trust base is explicit: the host kernel and VMM remain shared across VMs [0.84, https://github.com/kata-containers/kata-containers/blob/main/docs/threat-model/threat-model.md].

## Open gaps

No dig result covers bcvk itself (the bootc virtualization kit's own documentation), so bcvk-specific claims about rc=77 skip semantics and disk-image discard are carried in the yubiOS mode table but are not web-grounded here. The dig also produced one off-topic result (a hotel listings page) that was discarded by weighting, which is why this doc leans on the kata, libvirt, and qemu.org primary sources it did surface.
