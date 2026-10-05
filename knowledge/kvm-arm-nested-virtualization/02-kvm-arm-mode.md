# 02 - The kvm-arm.mode tri-state: nvhe, protected, nested

Scope: The current kvm-arm.mode tri-state kernel parameter (nvhe default, protected, nested), their mutual exclusivity, experimental status, and what the upstream documentation says about each mode.

## One knob, three modes

The supported selection surface for ARM KVM execution modes is the `kvm-arm.mode` kernel command-line parameter. The kernel's command-line parameter documentation is the canonical index of such boot-time switches (weight 0.919, kernel.org admin-guide). The 2024-10 documentation patch run defines the three values (weights 0.725, 0.796, 0.855, LKML):

- `nvhe`: the classic split-hypervisor mode, where the host runs at EL1 and a separate hypervisor image runs at EL2.
- `protected`: protected KVM (pKVM), the mode where the hypervisor isolates guest memory from the host kernel.
- `nested`: a VHE-based mode with support for nested virtualization, requiring at least ARMv8.4 hardware with FEAT_NV2.

The doc patch's diff text is explicit that the nested value's hardware requirement was corrected upward during review: an earlier "Requires at least ARMv8.3" line became "requires at least ARMv8.4 hardware (with FEAT_NV2)" (weight 0.796 and 0.725, LKML). This is the strongest textual anchor that FEAT_NV2, not FEAT_NV, is the gate for the modern nested mode.

## pKVM: what protected mode does

The kernel's own pKVM documentation states that booting a host kernel with `kvm-arm.mode=protected` enables Protected KVM: during boot, pKVM installs a stage-2 identity map page-table for the host and uses it to isolate the hypervisor running at EL2 from the rest of the host running at EL1/EL0 (weight 0.876 and 0.927, kernel.org and docs.kernel.org). This is why the mode switch exists as a single tri-state knob: picking `nested` and picking `protected` configure the same EL2 role in incompatible ways, so they are alternative boot-time selections rather than composable flags.

## The hVHE default change and why the doc was patched

The doc patch exists because an earlier commit changed behavior without documentation. Commit 5053c3f0519c ("KVM: arm64: Use hVHE in pKVM by default on CPUs with VHE support") modified the behaviour of `kvm-arm.mode=protected` without updating the kernel parameters doc (weight 0.579, 0.855, 0.779, LKML and lkml.iu.edu). The patch series updates the doc text to match, and records the escape hatch: nVHE protected mode can still be forced on VHE systems using `kvm_arm.mode=protected arm64_sw.hvhe=0 id_aa64mmfr1.vh=0` (weight 0.725, LKML). Note the parameter spelling in that forced-nVHE line is written `kvm_arm.mode` with an underscore in the patch text; the documented spelling elsewhere is hyphenated `kvm-arm.mode`.

## Experimental status

The doc patch marks these modes with "extreme caution" wording in the parameter documentation (weight 0.796, LKML). The modes are not equal-maturity: the VHE-in-nVHE patch series reports testing both standard nVHE and protected modes on an M1 box bare metal as well as a nested guest on M2, with no measurable change in performance (weight 0.889 and 0.753, linux-arm-kernel list). That series predates the nested-mode maturity: its scope was allowing VHE inside the nVHE hypervisor, which reshaped the EL2 mode landscape the tri-state knob now selects within.

## VHE versus nVHE as the underlying split

KVM on arm64 supports two distinct execution modes: VHE, where the host hypervisor runs natively at EL2, and nVHE, where the host runs at EL1 while a separate hypervisor image executes at EL2 (weight 0.657 and 0.598, DeepWiki over the Linux tree; the kernel's own pKVM doc corroborates the EL2 isolation model at 0.927). `kvm-arm.mode` is the boot-time selector over this split plus the nested and protected extensions.

## The practical picture

The modern boot-time check on an arm64 host is the kernel command line plus the dmesg record of which mode KVM landed in. A Fedora community post describes adding `kvm-arm.mode=nested` to the kernel command line and then seeing `kvm [1]: VHE+NV2 mode initialized successfully` in dmesg, with the QEMU command line updated to include `-M virt,accel=kvm,virtualization=on` (weight 0.084, weak backing, labeled as such: a forum post, not primary documentation). The strong-backing record for mode selection is the parameter documentation itself (0.919) and the pKVM documentation (0.927).

## Sources

- https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html (0.919)
- https://www.kernel.org/doc/html/next/virt/kvm/arm/pkvm.html (0.876)
- https://docs.kernel.org/7.1/virt/kvm/arm/pkvm.html (0.927)
- https://lkml.org/lkml/2024/10/24/1791 (0.725)
- https://lkml.org/lkml/2024/10/24/1323 (0.796)
- https://lkml.org/lkml/2024/10/25/560 (0.779)
- https://lkml.iu.edu/2410.3/01124.html (0.579)
- https://lkml.iu.edu/hypermail/linux/kernel/2410.2/11356.html (0.855)
- https://lists.openwrt.org/pipermail/linux-arm-kernel/2023-May/837104.html (0.889, 0.753)
- https://deepwiki.com/torvalds/linux/7.3-kvm-on-arm64:-sysreg-emulation-nested-and-vgic (0.657)
- https://discussion.fedoraproject.org/t/nested-virtualization/179358 (0.084, weak)
