# 04 - vfio-pci binding lifecycle on the host

Scope: who binds the device to vfio-pci and when: libvirt-managed bind/unbind versus manual sysfs operation, virsh nodedev-detach and nodedev-reattach, and the real-world failure modes of the rebind path.

## The two binding modes

libvirt supports two operating postures for a PCI hostdev. With managed='yes', libvirt handles the host setup for the device: it unbinds it from the host driver and binds it to vfio-pci at VM start, then reverses the operation at VM stop (source: https://www.ibm.com/docs/en/linux-on-systems?topic=vfio-pass-through-pci, jev weight 0.89; mode description from yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance). With managed='no', the operator binds and unbinds manually via sysfs (/sys/bus/pci/drivers/vfio-pci/bind) (source: yubiOS internal record, internal provenance).

Since libvirt 10.0.0, PCI hostdev devices can also carry an optional driver subelement that specifies which host driver to bind to the device when preparing it for assignment to a guest (source: https://libvirt.org/formatdomain.html, jev weight 0.96). That makes the driver choice per-device and declarative instead of host-global.

## The node device layer underneath

libvirt's nodedev API manages host devices that can be handed to guests via passthrough as elements in the domain XML (source: https://libvirt.org/formatnode.html, jev weight 0.85). The driver-facing procedure is the same regardless of who triggers it: unbind the device from its respective device driver, then bind the device to the respective VFIO driver (source: https://libvirt.org/drvnodedev.html, jev weight 0.96).

The virsh commands that do this by hand are nodedev-detach and nodedev-reattach. Red Hat's documentation describes the pair: nodedev-detach detaches the node device from the host so it can be safely used by guests via hostdev passthrough, and the action is reversible with nodedev-reattach, though it is done automatically for managed services (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/6/html/virtualization_administration_guide/sub-sect-numa_node_management-detaching_a_node_device, jev weight 0.30, weak backing, labeled as such; the command semantics are confirmed by working guides at https://github.com/joeknock90/Single-GPU-Passthrough/blob/master/README.md, jev weight 0.53).

## Manual rebind after a VM stops

In the manual posture the operator reattaches after the VM stops: virsh nodedev-reattach pci_0000_02_00_0 causes the NVIDIA driver to re-bind, and a live watch with watch -n 0.1 lspci -s 0000:02:00.* -nk shows which driver owns the card in real time (source: https://github.com/bryansteiner/gpu-passthrough-tutorial/issues/22, jev weight 0.29, weak backing, labeled as such).

## Known failure modes of the rebind path

Two real-world failure classes recur in the community record and matter for a host that detaches and reattaches GPUs on a cutoff policy:

1. Reattach crashes. A vfio_pci_core NULL pointer dereference that fires every time libvirt reattaches the GPU after a VM shutdown with a managed hostdev, and on any manual unbind from vfio-pci, reproduced byte-identical on separate boots (source: https://github.com/CachyOS/linux-cachyos/issues/1023, jev weight 0.30, weak backing, labeled as such).
2. Detach hangs. virsh nodedev-detach hanging indefinitely on a single-GPU AMD passthrough setup, forcing a host reboot (source: https://www.reddit.com/r/VFIO/comments/qi6pv1/amd_gpusingle_gpu_passthrough_virsh_nodedevdetach/, jev weight 0.07, weak backing, labeled as such).

For yubiOS the lesson is structural: a misbehavior-cutoff policy that severs the PCI binding must treat nodedev-detach as a potentially blocking or crashing operation, wrap it with timeouts, and prefer the managed='yes' path so libvirt owns the bind state machine (source: yubiOS internal record, internal provenance).

## Why managed='yes' is the yubiOS default

yubiOS sets managed='yes' as the right default: libvirt unbinds the device from the host driver and binds it to vfio-pci at VM start, then rebinds on VM stop, while managed='no' pushes the sysfs dance onto the operator (source: yubiOS internal record, internal provenance). This concentrates the binding lifecycle in one state machine libvirt already owns, which is also the state machine the cutoff hooks (doc 06) interact with.

## Operator checklist for this layer

1. Use managed='yes' unless there is a specific reason to sequence binds by hand (source: https://www.ibm.com/docs/en/linux-on-systems?topic=vfio-pass-through-pci, jev weight 0.89).
2. Prefer the declarative driver subelement (libvirt 10.0.0+) over global modprobe binding when different devices need different host drivers (source: https://libvirt.org/formatdomain.html, jev weight 0.96).
3. When scripting nodedev-detach or nodedev-reattach, expect hangs and kernel crashes on the rebind path and guard with timeouts and health checks (sources: https://github.com/CachyOS/linux-cachyos/issues/1023, jev weight 0.30; https://www.reddit.com/r/VFIO/comments/qi6pv1/amd_gpusingle_gpu_passthrough_virsh_nodedevdetach/, jev weight 0.07; both weak backing, labeled as such).
