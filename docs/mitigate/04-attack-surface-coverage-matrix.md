# 04. Attack Surface Coverage Matrix

Scope: internal record subtopic, no dig. The MITIGATE.md attack surface chart and the mermaid attack flow graph, both read directly from the source doc (yubi-OS/yubiOS docs/MITIGATE.md).

## The coverage classes

The source doc's chart classifies every mitigation into three coverage classes, with a legend stated once: Block and Contain for controls that stop an attack path, Detect and Reduce for controls that surface or shrink an attack, and architectural immunity for attacks that do not apply to the platform or design at all. The chart maps 21 attack surfaces, each tied to one Step 1 to 3 vector and one or more named yubiOS controls.

## Block and contain (green)

The blocked surfaces, all source doc claims:

- Stacked UEFI and evil-twin EDK2: signed UKI plus SecureBoot plus PCR 11.
- Hidden GPT partitions, the 91 GPT case: DPS UUID-only automount ignores them.
- BPF filesystem restriction: RestrictFileSystems= counters it.
- Obfuscated kernel modules: kernel lockdown plus IMA plus signed initrd.
- ARM CoreSight debug: arm64 kernel lockdown disables CoreSight trace interfaces.
- qcom,dload firmware sideload: not applicable on x86-64, blocked by dm-verity on arm64.
- Modified libselinux and libapparmor: dm-verity /usr on every IO.
- /usr bind mount poison: immutable dm-verity plus usrhash=.
- Poisoned systemd generators: dm-verity /usr on every IO.
- Faux ACPI table injection: signed UKI cmdline.
- Runtime dmesg and proc scrubbing: dm-verity plus DynamicUser= plus ProtectProc=.
- fd hijacking from parent PID: NoNewPrivileges= plus DynamicUser=.
- Magic number monitoring service: dm-verity service units.

## Detect and reduce (yellow)

- OEM power manager firmware: PCR 4 measurement, chipsec, and ConditionSecurity=measured-os detect it.
- Page cache CVE, the dirtyfrag class: Fedora 45 patch cadence plus dm-verity reduce it.
- Journal flush and pre pivot wipe: forward secure sealing plus PCR phases detect it.
- Absolute Persistence (Computrace): chipsec plus ConditionSecurity=measured-os detect it.
- Radio that will not power off: PrivateNetwork= plus BindNetworkInterface= contain it.
- NVMe and GPT-auto blocking: DPS UUID fallback discovery keeps it resilient.

## Architectural immunity (immune)

- Virtual timer CNTVOFF_EL2: not applicable on x86-64; on arm64 the kernel's arch_timer erratum workarounds mitigate.
- TEE and tz.uefisecapp MitM: no TEE dependency, the YubiKey FIDO2 trust anchor removes the surface.
- Passphrase capture via framebuffer: FIDO2 hmac-secret means no typed passphrase exists to capture.

## The attack flow graph

The source doc's mermaid flowchart ties the phases together: OEM supply chain access fans out into Step 1's three vectors, stacked UEFI feeds Step 2's module injection, page cache poisoning and hidden partitions feed the firmware sideload, the sideload feeds the poisoned generators, and the generators feed Step 3's runtime control stage, which then branches into the radio persistence and scrubbing paths. Each attack node is linked to its mitigation node with a labelled edge (detected by, blocked by, mitigated by, ignored by, contained by, immune), and the styling marks the two strongest blocks in green, the two immunities in pink, and the detections in brown. The graph's one dark node cluster, PCR 4 plus ConditionSecurity plus chipsec, signed initrd lockdown plus IMA, and dm-verity service units plus DynamicUser, corresponds to the detection-heavy surfaces in the yellow class above.

## How to use the chart

The chart is the doc's own verdict ledger: it states plainly where yubiOS blocks, where it only detects, and where the attack does not apply. The Detect class entries are not weaker controls in general, they are the honest classification for firmware and hardware surfaces the OS cannot reach, which doc 05 turns into an explicit gap table with paths forward.
