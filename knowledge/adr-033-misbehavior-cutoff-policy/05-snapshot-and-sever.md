# 05. Snapshot-and-sever: state preservation at SEVER

Scope: the SEVER tier's mechanics, snapshot the VM, revoke the vfio-user socket, freeze rather than kill, and what mainstream virtualization tooling supports for each step, including assumptions A2 and A3.

## Why freeze instead of kill

The design decision underneath the SEVER tier is that the cutoff must preserve forensic state. Killing the VM (Variation 1 in the record) was dropped for exactly this reason: it "destroys state, contradicts the user's framing of cutoff point (which implies preservation)" (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28). The digital forensics framing backs the value of preserved state: incident response work proceeds through examination of captured state, and responders work against time (weak backing, ScienceDirect forensics comparison [1], jev weight 0.335). Evidence-handling practice treats disk and memory capture as the raw material of investigation (weak backing, cybersecurity101 [2], weight 0.244).

## What QEMU and libvirt actually support

The tooling for each SEVER step exists in mainline virtualization:

- Full-VM snapshots. QEMU documentation: "VM snapshots are snapshots of the complete virtual machine including CPU state, RAM, device state and the content of all the writable disks" [3] (jev weight 0.556). This is the capability A2's qcow2 snapshot test leans on.
- Copy-on-write image layers. QEMU's snapshot implementation uses "Redirect-on-Write to avoid changing the original image" [4] (jev weight 0.859), and the qcow2 format itself supports backing-file chains with internal snapshots [5] (jev weight 0.914).
- Live memory capture. libvirt supports taking "snapshot of the VM memory if requested," and for live snapshots "the VM runs until the memory snapshot phase completes" [6] (jev weight 0.867). libvirt's snapshot documentation distinguishes disk snapshots from full "domain state capture" including memory [7] (jev weight 0.866), and the wiki notes libvirt can save domain memory via virsh save (implemented as an outgoing migration to qemu) or save disk state via snapshot [8] (jev weight 0.738).

For the bootc-delta half of the SEVER snapshot, the record's design composes the VM snapshot with the container image layer story rather than inventing new capture machinery (source one-pager, MVP item 3: "A SEVER action that snapshots the guest (qcow2 + bootc delta)").

## The device side: revoking the socket

Snapshotting a VM with a vfio-user device attached has a device-state problem, which is why SEVER's action list is snapshot then revoke then freeze. The vfio-user protocol runs over a single UNIX socket that carries the device's command and shared-memory surface (QEMU protocol spec [9], weight 0.953). Revoking the socket cuts the guest off from the GPU at the mediation boundary; the guest stays alive and its snapshot remains restorable into a fresh environment where an operator can attach a new vfio-user socket (source one-pager). This is the recoverable-by-design property: "Operator can attach a fresh vfio-user socket to resume in a clean environment" (source one-pager).

## Assumption A2: snapshot without losing GPU pending work

A2 states: "VM state can be snapshotted at SEVER without losing the GPU's pending work. Test: qcow2 snapshot + vfio-user socket teardown + cold-restore; measure model recovery time" (source one-pager). The literature above establishes that CPU, RAM, device state, and disks are capturable [3] (weight 0.556) and that memory capture can be live [6] (weight 0.867). What no dig source establishes is the GPU-device-state half for a vfio-user device: whether pending in-flight device work is preserved or abandoned at socket teardown, and what recovery time looks like. That is precisely why A2 is listed as an assumption to validate rather than a claim. The forensic tooling for post-hoc examination of qcow2 images exists (weak backing, qcow2-forensic tool [10], weight 0.496; VM snapshot forensics guides [11], weights 0.268 and 0.280), which supports the analysis side of the test but not the device-state side.

## Assumption A3: operator response inside the preservation window

A3 states: "Operators will respond to a SEVER alert within the model-state-preservation window (e.g., minutes, not hours). Test: simulation with synthetic operator response times" (source one-pager). This is an operational assumption, and the record's stress test flags the failure mode: alert numbness at WARN-tier frequency (source one-pager). Escalation-management practice addresses it structurally, by mapping severity to response workflows and routing only significant events to people (Atlassian [12], jev weight 0.614). The mitigation encoded in the record is rate-limiting and summarization in the operator console (source one-pager).

## Sources

1. ScienceDirect, comparison study of digital forensics analysis techniques (weak backing): https://www.sciencedirect.com/science/article/pii/S1877050918317769 (weight 0.335)
2. Cybersecurity101, forensics and evidence handling (weak backing): https://cybersecurity101.net/learn/incident-response/forensics-evidence-handling/ (weight 0.244)
3. QEMU documentation, disk images and VM snapshots: https://www.qemu.org/docs/master/system/images.html (weight 0.556)
4. QEMU wiki, CreateSnapshot: https://wiki.qemu.org/Documentation/CreateSnapshot (weight 0.859)
5. QEMU documentation, qcow2 image file format: https://www.qemu.org/docs/master/interop/qcow2.html (weight 0.914)
6. libvirt kbase, snapshots: https://libvirt.org/kbase/snapshots.html (weight 0.867)
7. libvirt, snapshot XML format: https://libvirt.org/formatsnapshot.html (weight 0.866)
8. libvirt wiki, snapshots: https://wiki.libvirt.org/Snapshots.html (weight 0.738)
9. QEMU vfio-user protocol specification: https://www.qemu.org/docs/master/interop/vfio-user.html (weight 0.953)
10. qcow2-forensic tool (weak backing): https://securityronin.github.io/qcow2-forensic/ (weight 0.496)
11. VM forensics snapshot extraction guides (weak backing): https://kandibrian.com/articles/virtual-machine-forensics-snapshot-extraction.html (weights 0.268, 0.280)
12. Atlassian, escalation policies: https://www.atlassian.com/incident-management/on-call/escalation-policies (weight 0.614)
