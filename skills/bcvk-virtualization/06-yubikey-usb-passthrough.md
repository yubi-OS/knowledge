# 06 - YubiKey USB Passthrough (FIDO2 in VMs)

**Scope:** getting a physical YubiKey into a VM: QEMU's `u2f-passthru` device with a hidraw path, device discovery on the host, the libvirt USB hostdev route, and a known failure mode in the guest.

## The QEMU device

The source doc states: "QEMU supports FIDO2/U2F passthrough via the `u2f-passthru` device. bcvk doesn't wire this automatically - pass extra QEMU args." The QEMU documentation confirms the device exists for exactly this purpose: "The u2f-passthru device allows you to connect a real hardware U2F key on your host to a guest VM" (https://www.qemu.org/docs/master/system/devices/usb-u2f.html, jev weight 0.94, high). The same page explains the device class: "In case of a USB U2F security key, it is a USB HID device that implements the U2F protocol. QEMU supports both pass-through of a host U2F key device to a VM, and software emulation of a U2F key" (https://www.qemu.org/docs/master/system/devices/usb-u2f.html, jev weight 0.94, high). A YubiKey in U2F/FIDO2 mode is such a HID device.

## Host-side device discovery

The source doc's discovery steps:

```bash
ls /dev/hidraw*                              # find YubiKey hidraw device
udevadm info /dev/hidraw0 | grep -i yubico   # confirm which hidraw is the YubiKey
```

Both are source-doc claims. The hidraw node is the character device the `u2f-passthru` device consumes; `udevadm info` is how you disambiguate when several `/dev/hidraw*` nodes exist.

## Passing the device to a bcvk VM

The source doc's invocation:

```bash
bcvk ephemeral run \
  --extra-qemu-args="-device u2f-passthru,hidraw=/dev/hidraw0" \
  dhi.io/yubi-OS/yubiOS:latest
```

This is a source-doc claim. Since bcvk does not wire USB passthrough automatically, `--extra-qemu-args` is the supported injection point for the device argument.

## The libvirt route

For persistent VMs the source doc prescribes a USB hostdev in the domain XML:

```xml
<hostdev mode='subsystem' type='usb' managed='yes'>
  <source>
    <vendor id='0x1050'/>   <!-- Yubico -->
    <product id='0x0407'/>  <!-- YubiKey 5 -->
  </source>
</hostdev>
```

Source-doc claim for the XML, with the vendor and product ids 0x1050 (Yubico) and 0x0407 (YubiKey 5) noted in the source doc's own comments. The libvirt side that manages such host devices is documented by the project: "Libvirt provides management of both physical and virtual host devices (historically also referred to as node devices) like USB, PCI, SCSI, and network devices" (https://libvirt.org/drvnodedev.html, jev weight 0.93, high). libvirt overall is "a toolkit to manage virtualization platforms" (https://libvirt.org/, jev weight 0.89, high), and doc 05 places `bcvk libvirt run` domains in exactly this layer.

## A known failure mode

The dig surfaced an open issue that matches this doc's setup directly: with a YubiKey attached as `-usb -device u2f-passthru,hidraw=/dev/hidraw2`, the reporter found "To use FIDO2 user verification we need to run pamu2fcfg command which will stuck forever in Guest OS of Qemu" (https://gitlab.com/qemu-project/qemu/-/issues/2293, jev weight 0.82, high). The reporter also notes that building QEMU with the U2F support flag did not help (https://gitlab.com/qemu-project/qemu/-/work_items/2293, jev weight 0.80, high). The source doc does not mention this issue; it is recorded here as a dated dig finding (open issue, unresolved at collection time 2026-10-06) so that a pam-u2f enrollment hanging inside a passthrough VM is recognized as a known upstream failure mode rather than a yubiOS bug.

## Where FIDO2 fits in yubiOS

The source doc's framing is that this passthrough path exists to test FIDO2 enrollment inside a VM against a real key. The companion paths are the software emulators for hardware-less CI (doc 07, skipped as a doc but summarized in the README) and the LUKS + TPM gotcha (doc 08) for encrypted-disk enrollment. The QEMU project itself also offers software emulation of a U2F key (https://www.qemu.org/docs/master/system/devices/usb-u2f.html, jev weight 0.94, high), which is the other half of the same device model.
