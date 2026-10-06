# 05 - Libvirt (Persistent VMs)

**Scope:** the `bcvk libvirt` subcommand family: creating persistent named VMs with resource controls, listing them, SSH access, and stop/start lifecycle management.

## The commands

The source doc gives the family:

```bash
bcvk libvirt run --name yubiOS-dev --memory 4G --cpus 4 dhi.io/yubi-OS/yubiOS:latest
bcvk libvirt list
bcvk libvirt ssh yubiOS-dev
bcvk libvirt stop yubiOS-dev
bcvk libvirt start yubiOS-dev
```

All five are source-doc claims. The contrast with ephemeral VMs (doc 02) is persistence: a named, managed domain that survives stop/start cycles instead of disappearing.

## What libvirt run builds on

Upstream documents the composition: "The bcvk libvirt run command wraps bcvk to-disk which in turns wraps bootc install to-disk in an ephemeral VM" (https://github.com/bootc-dev/bcvk, jev weight 0.82, high). A persistent VM is therefore created by first producing a disk image through the doc 03 machinery, then registering it with libvirt. This also explains why libvirt VMs persist: they own a disk image, unlike the virtiofs-shared rootfs of the ephemeral mode.

The repository README shows the resource defaults: "Basic libvirt VM creation with default settings (2GB RAM, 2 CPUs, 20GB disk)" via `bcvk libvirt run quay.io/centos-bootc/centos-bootc:stream10`, followed by the note "requirement for --filesystem with the generic Fedora bootc base images" (https://github.com/bootc-dev/bcvk, jev weight 0.83, high). The `--filesystem` caveat is the doc 03 filesystem-default rule surfacing again: generic Fedora base images declare no default filesystem, so disk creation needs one.

The source doc's example overrides the defaults with `--memory 4G --cpus 4`, showing those knobs exist per-invocation.

## The libvirt layer underneath

libvirt is the management layer the persistent domains land in: "The virsh program is the main interface for managing virsh guest domains. The program can be used to create, pause, and shutdown domains. It can also be used to list current domains" (https://www.libvirt.org/manpages/virsh.html, jev weight 0.93, high). This matters for yubiOS operations because anything bcvk creates via libvirt is inspectable with the standard toolchain: `virsh list`, `virsh console`, `virsh dumpxml`. The bcvk libvirt family is a convenience wrapper; the domains are ordinary libvirt objects.

libvirt itself is "a toolkit to manage virtualization platforms" (https://libvirt.org/, jev weight 0.89, high), which is the layer the doc 06 USB hostdev XML plugs into.

## When to pick persistent over ephemeral

The source doc positions libvirt mode for long-lived work: a VM you return to across sessions, name, and manage. The ephemeral mode is for the fast inner loop where "the VM disappears on stop. No disk persistence" (source doc). A practical split for yubiOS: use ephemeral for boot tests and FIDO2 enrollment checks driven by CI (doc 09), use libvirt for a standing development VM where you want to run `bootc switch <new-image>` (source doc) to exercise the in-place upgrade path repeatedly on the same machine.

## Weak-signal sources, labeled

The dig returned several low-weight third-party pages for this subtopic: a man page mirror for `bcvk-libvirt-run` (https://www.mankier.com/8/bcvk-libvirt-run, jev weight 0.14, weak), DeepWiki-generated pages on persistent VMs (https://deepwiki.com/bootc-dev/bcvk/4.2-creating-and-running-persistent-vms, jev weight 0.17, weak), and general virsh tutorials (https://www.clouditiv.com/tutorials/libvirt-virsh-basics-manage-kvm-vms, jev weight 0.11, weak). None are load-bearing here; the primary sources are the bcvk repository and the libvirt documentation.
