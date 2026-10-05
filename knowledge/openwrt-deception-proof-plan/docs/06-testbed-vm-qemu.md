# 06: VM and spare-router testbeds

Scope: Building OpenWrt VM testbeds: QEMU x86_64 images, spare-router hardware, and snapshot/rollback workflow for repeatable proof runs.

## QEMU as the primary testbed

The official OpenWrt guide documents running OpenWrt in QEMU, covering image selection and invocation (https://openwrt.org/docs/guide-user/virtualization/qemu, weight 0.87). A developer-oriented writeup on open-mesh.org describes the simple emulation architecture concretely: it can be implemented easily using QEMU with an x86_64 image from OpenWrt, with preparation steps on the image before boot (https://www.open-mesh.org/doc/devtools/OpenWrt_in_QEMU.html, weight 0.74). An x86_64 QEMU guest is the right testbed for the yubiOS proof because the decoy package, firewall4, and WireGuard behave identically to a physical router at the UCI and nftables level, and VM snapshots make the evidence run repeatable.

Running OpenWrt as a QEMU host (rather than guest) is a separate topic documented on its own page and is not needed for the proof (https://openwrt.org/docs/guide-user/virtualization/qemu_host, weight 0.63).

## VirtualBox as an alternative

The wiki's VirtualBox howto covers converting an `openwrt.img` to a VirtualBox disk image and running it (https://openwrt.org/docs/guide-user/virtualization/virtualbox-vm, weight 0.48). A community guide notes that default OpenWrt images have limited storage and recommends pre-expanded images for development and testing, referencing an openwrt-24.10.4 x86 image in its example (https://dev.to/ahaoboy/complete-guide-to-openwrt-in-virtualbox-setup-and-disk-expansion-1fe2, weight 0.38, weak backing). Storage matters for the proof: tcpdump captures and log files need room, so the testbed image should be expanded or built with extra space.

An ARM-under-QEMU gist shows the path for emulating ARM OpenWrt including network setup steps for outgoing and incoming connections (https://gist.github.com/extremecoders-re/f2c4433d66c1d0864a157242b6d83f67, weight 0.21, weak backing). Use x86_64 unless the proof specifically needs the target board's architecture. A blog covers installing OpenWrt 23.05 on ARMv8 under QEMU with LuCI on macOS (https://markuta.com/openwrt-qemu-m1/, weight 0.25, weak backing), and forum threads confirm x86/64 emulation as the standard answer for testing OpenWrt (https://forum.openwrt.org/t/how-to-run-openwrt-bin-in-virtualbox-for-qemu/158524, weight 0.24, weak backing).

## Spare-router hardware path

A spare physical router is the second testbed option. It exercises the real package build for the target board and the real nftables offload path, which a VM approximates but does not prove. The recommended sequencing:

1. Build and iterate in QEMU first: fast snapshot, rollback, and repeat.
2. Promote to a spare router for the final evidence run, recording the board and OpenWrt release.

The proof's router-config evidence item requires recording the OpenWrt release and target board or VM, so the runbook should capture `ubus call system board` output (or the VM image name) at the start of every evidence run.

## Network topology for the proof

The testbed needs at minimum: an OpenWrt instance with a WireGuard interface and zone, a peer client inside that zone (a second VM or a physical laptop), and a WAN-side network the router can reach but that must remain free of decoy exposure. The wiki's WireGuard server and client guides cover the interface, peer, and zone wiring (weights 0.92 and 0.86, see doc 05). A video walkthrough demonstrates building a virtual home network in VirtualBox with two OpenWrt routers, Linux and Windows VMs, and separate LAN and WAN segments, which is one concrete topology pattern for multi-VM setups (https://www.youtube.com/watch?v=JwPD1GWw5go, weight 0.12, weak backing).

## Snapshot and rollback workflow

The proof run must be repeatable, so the runbook should:

1. Snapshot the clean OpenWrt state before package install.
2. Install the package, apply the lab-safe defaults, and capture the router-config and firewall evidence.
3. Run the scan and packet-capture evidence.
4. Roll back to the snapshot, reinstall, and repeat any failed evidence step to confirm determinism.
5. Finish with the uninstall-reinstall cycle to prove the recovery path.

OpenWrt as a project provides the general background for these testbeds: it is a Linux distribution targeting embedded devices with extensive network configuration capability (https://openwrt.org/, weight 0.92), and its buildroot-based development environment is well documented (https://en.wikipedia.org/wiki/OpenWrt, weight 0.61, weak backing, background only).

## Proof requirements for the testbed stage

The testbed proof passes when:

1. The QEMU (or spare-router) instance boots the chosen release and runs firewall4 with WireGuard configured.
2. Snapshots restore to a known-clean state deterministically.
3. The evidence run's recorded release, board or VM identifier, WireGuard zone, decoy pool, and real SSH address are all captured in the run report.
4. The same evidence procedure runs unchanged on both the VM and the spare router if both are used.
