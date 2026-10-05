# 05 - libvirt domain XML for a passthrough host

Scope: the domain XML that hands a GPU to a VM: the hostdev subsystem=PCI shape, the managed attribute, the watchdog element and its actions, and qemu:commandline overrides.

## hostdev: the canonical shape

The canonical shape for handing a GPU to a QEMU/KVM VM is a hostdev element in subsystem=PCI mode. The libvirt domain XML format reference is the canonical source for the hostdev, watchdog, and feature syntax (source: https://libvirt.org/formatdomain.html, jev weight 0.93). For interfaces of type='hostdev' the name attribute can optionally be set to vfio, selecting VFIO device assignment rather than traditional KVM device assignment (source: https://avdv.github.io/libvirt/formatdomain.html, jev weight 0.47, weak backing, labeled as such).

The yubiOS passthrough template uses the shape:

```xml
<hostdev mode='subsystem' type='pci' managed='yes'>
  <source>
    <address domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
  </source>
  <boot order='1'/>
</hostdev>
```

(source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance; element semantics per https://libvirt.org/formatdomain.html, jev weight 0.93). Note that mode='vfio' is the older libvirt syntax, not the subsystem=PCI form (source: yubiOS internal record, internal provenance).

The managed attribute does the binding work: when set to yes, libvirt handles the host setup for the device for you (source: https://www.ibm.com/docs/en/linux-on-systems?topic=vfio-pass-through-pci, jev weight 0.89). Since libvirt 10.0.0 an optional driver subelement on the hostdev specifies which host driver to bind (source: https://libvirt.org/formatdomain.html, jev weight 0.96).

The node-device side of the same story lives in the nodedev XML format: several libvirt functions, all with the virNodeDevice prefix, deal with management of host devices that can be handed to guests via passthrough (source: https://libvirt.org/formatnode.html, jev weight 0.85).

## The watchdog element

The watchdog element attaches an emulated watchdog device to the guest and lets the host fire an action when the guest stops petting it. The model attribute specifies which real watchdog device is emulated, and valid values are specific to the underlying hypervisor (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/6/html/virtualization_administration_guide/section-libvirt-dom-xml-watchdog, jev weight 0.77). The i6300esb is the emulated device used in documented examples, configured with the poweroff action, and the watchdog device is exposed to the guest as /dev/watchdog (source: https://docs.okd.io/4.12/virt/virtual_machines/advanced_vm_management/virt-configuring-a-watchdog.html, jev weight 0.55; mirrored at https://docs.openshift.com/container-platform/4.9//virt/virtual_machines/advanced_vm_management/virt-configuring-a-watchdog.html, jev weight 0.63).

Two watchdog facts matter for a misbehavior-cutoff design:

1. Just enabling the watchdog in the libvirt configuration does not do anything useful on its own; since libvirt 0.8.0 a notification is available when the watchdog fires, using the event ID VIR_DOMAIN_EVENT_ID_WATCHDOG (source: https://libvirt.org/formatdomain.html, jev weight 0.91).
2. The documented action set includes poweroff (the domain will be forcefully powered off), reset, and shutdown in distribution guides (source: https://libvirt.org/formatdomain.html, jev weight 0.91; https://docs.okd.io/4.12/virt/virtual_machines/advanced_vm_management/virt-configuring-a-watchdog.html, jev weight 0.55). The yubiOS cutoff design additionally uses pause and dumpcore semantics from its internal severity ladder (source: yubiOS internal record, internal provenance).

The yubiOS template picks action='poweroff' on the i6300esb as the SEVER-tier hard cutoff: no half-state recovery, device fully reclaimed on the next VM start; for graceful shutdown with a bounded wait it pairs action='reset' with the on_poweroff lifecycle hook (source: yubiOS internal record, internal provenance).

## Lifecycle and machine elements around the device

The yubiOS full domain template adds the pieces that make a passthrough VM well-behaved on a bootc host: machine='q35' on x86_64, an iommu feature element (model intel or amd to match the host), virtio disk and network, and a qemu:commandline block passing kernel_irqchip=on (source: yubiOS internal record, internal provenance). The feature and device element vocabulary is defined by the domain XML format reference (source: https://libvirt.org/formatdomain.html, jev weight 0.93).

## Operator checklist for this layer

1. Use hostdev with mode='subsystem' type='pci' and managed='yes'; reserve manual binding for exceptional cases (sources: https://libvirt.org/formatdomain.html, jev weight 0.93; https://www.ibm.com/docs/en/linux-on-systems?topic=vfio-pass-through-pci, jev weight 0.89).
2. Add the watchdog element only if something consumes its action or the VIR_DOMAIN_EVENT_ID_WATCHDOG event; the element alone does nothing (source: https://libvirt.org/formatdomain.html, jev weight 0.91).
3. Match the iommu feature model to the host CPU vendor, and keep lifecycle actions (on_poweroff, on_crash) set to destroy so a crashed VM releases the GPU deterministically (source: yubiOS internal record, internal provenance; element semantics https://libvirt.org/formatdomain.html, jev weight 0.93).
