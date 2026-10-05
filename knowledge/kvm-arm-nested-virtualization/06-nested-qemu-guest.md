# 06 - Running nested guests with QEMU on ARM64

Scope: Running nested guests with qemu-system-aarch64 -M virt -cpu host -enable-kvm: the L0/L1/L2 recipe, in-guest kernel cmdline, and the QEMU SYSREG_<IDREG>_<FIELD> ID-register masking surface including KVM_CAP_ARM_WRITABLE_IMP_ID_REGS.

## The layer model

The kernel's nested-guests documentation frames the use case: instead of renting multiple VMs from a cloud provider, nested KVM lets you rent a large enough level-1 guest hypervisor, which in turn creates multiple level-2 guests running different operating systems (weight 0.943, kernel.org v5.7 doc; 0.911, current docs.kernel.org). The doc warns about a common misconfiguration: people who do not have KVM enabled for their level-1 hypervisor run with pure emulation, what QEMU calls TCG, and mistakenly believe they are running nested KVM (weight 0.273, weak backing, labeled as such: a GitHub mirror of the doc; the warning text matches the kernel doc).

Note that this kernel documentation is written for x86: it describes the nested KVM module parameter for Intel and AMD, enabled by default since v4.19 (weight 0.975, 0.6). The ARM64 equivalent of the layer model works differently: the outer host must boot with `kvm-arm.mode=nested` and expose FEAT_NV2 (doc 02, doc 03), and the guest CPU model must be chosen so the guest can itself use the virtualization extensions.

## Guest CPU model and the virtualization-extensions error

The concrete failure mode on the guest side is documented in the Lima issue tracker: `qemu-system-aarch64: mach-virt: host kernel KVM does not support providing Virtualization extensions to the guest CPU` (weight 0.119, weak backing, labeled as such: a bug tracker). That message is the signature of a host kernel that booted without the nested mode, so the guest's `-cpu host` gets no virtualization extensions. A Fedora community post pairs the host-side `kvm-arm.mode=nested` cmdline with the QEMU machine option `-M virt,accel=kvm,virtualization=on` (weight 0.084, weak backing, labeled as such). Both weak, but they are the only collected sources that show the actual QEMU flags in an ARM nested context, so treat the exact flag syntax as to-be-verified against your QEMU version.

## vCPU feature selection: the ID-register surface

The modern mechanism for controlling which features a guest sees is the ID-register interface. The kernel documentation states: KVM allows userspace to opt out of certain CPU features described by the ID registers by writing values to them via the KVM_SET_ONE_REG ioctl, and the ID registers are mutable until the VM has started, that is until userspace has called KVM_RUN on at least one vCPU in the VM (weight 0.936, docs.kernel.org vCPU features page).

The patch series that made this possible is "KVM: arm64: Make CPU ID registers writable by userspace": in KVM/arm64, guest ID register values mostly mirror the host's except for features KVM does not support and opt-in features userspace did not configure, and KVM_SET_ONE_REG previously failed if userspace wrote unsupported values (weight 0.783, LWN).

## The QEMU host model and writable ID fields

QEMU's side of this is the customizable aarch64 KVM host model. An RFC series from August 2026 states: this series enhances the current host KVM model with capability to set writable ID reg fields, and since the v6.7 kernel, KVM/arm allows userspace to overwrite the values of a subset of ID regs, with the list of writable fields continuing to grow (weight 0.606, mail-archive qemu-devel). The later patch revision exposes writable ID reg field properties on the KVM host vCPU model (weight 0.296, weak backing, labeled as such: a mailing list index page). The property convention for such per-field overrides is the `SYSREG_<IDREG>_<FIELD>=value` form documented in QEMU's ARM CPU feature documentation (weight 0.296-class evidence only in this dig; the convention claim rests on the weak-backed mailing list entries plus the host-model series at 0.606).

Practical use: mask features the nested guest should not see, for example to keep a guest's exposed feature set stable when the guest image may later migrate between heterogeneous arm64 hosts. The mutability rule from the kernel doc (0.936) is the hard constraint: feature masking happens before first vCPU run, not after.

## What the L1 guest needs

For the L1 guest to host its own L2 guests, the L1 kernel must itself boot with the nested mode selected, which loops back to doc 05: the in-guest kernel command line carries the same `kvm-arm.mode=nested` parameter, applied to the guest's boot entry or `-append` string. The host hypervisor manages VNCR_EL2 exclusively (weight 0.925, NEVE paper; see doc 07), which is the architectural mechanism that makes the L2 layer cheap.

## Sources

- https://www.kernel.org/doc/html/v5.7/virt/kvm/running-nested-guests.html (0.943, 0.975)
- https://docs.kernel.org/virt/kvm/x86/running-nested-guests.html (0.6, 0.911)
- https://docs.kernel.org/virt/kvm/arm/vcpu-features.html (0.936)
- https://lwn.net/Articles/876275/ (0.783)
- https://www.mail-archive.com/qemu-devel@nongnu.org/msg1219778.html (0.606)
- https://www.cs.columbia.edu/~nieh/pubs/sosp2017_neve.pdf (0.925)
- https://lists.gnu.org/archive/html/qemu-arm/2026-09/index.html (0.296, weak)
- https://github.com/lima-vm/lima/issues/4498 (0.119, weak)
- https://discussion.fedoraproject.org/t/nested-virtualization/179358 (0.084, weak)
- https://github.com/zalexdev/linux-um-arm64/blob/um-arm64/Documentation/virt/kvm/x86/running-nested-guests.rst (0.273, weak)
