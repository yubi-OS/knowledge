# 08 Deferred and rejected intersections

Scope: the platforms the source doc considered and declined to shortlist, with the recorded reason for each. This is an internal-record subtopic, no dig: the table is a decision record and the citations it relies on are already in the source doc.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, section "Deferred and rejected intersections".

## The 7 deferred or rejected platforms

The source doc's rejection table (all claims below are source doc):

| Platform | Reason not shortlisted now |
| --- | --- |
| RK3566/RK3568 boards | U-Boot and TF-A support are broad, but the reviewed OP-TEE Rockchip configuration has no RK356x flavor. |
| Raspberry Pi 5 | Existing project decision: vendor-controlled early boot keeps it Path B. |
| TI K3 boards | Current TF-A K3 documentation describes an R5 U-Boot boot master and supplies BL31 only. The early system-firmware/owner-root boundary does not match the current strict Path A proof plan. |
| Allwinner A64 boards | OP-TEE's maintainer file marks the A64 platform orphaned, and the reviewed upstream sources do not provide a convincing owner-fuse production closure flow. |
| NXP i.MX8MQ EVK | OP-TEE and U-Boot support it, but current TF-A i.MX8M documentation notes that i.MX8MQ was dropped from TF-A CI because of OCRAM constraints. i.MX8MM is the stronger target. |
| Newer i.MX9 variants | OP-TEE's i.MX configuration is adding i.MX91/95/943 flavors, but current upstream TF-A documentation is materially thinner than i.MX93 and the EdgeLock vendor-firmware boundary is the same. Revisit after the upstream boot chain and board configs mature. |
| Nuvoton Arbel EVB | U-Boot's `arbel_evb_defconfig` enables OP-TEE, RPMB, and fTPM but explicitly disables the EFI loader; it is a BMC reference platform, not a fit for the current ARM64 product path. |

## The 3 rejection patterns worth carrying forward

Reading the table as a whole, the reasons sort into 3 reusable categories, all grounded in the source doc:

1. Missing platform flavor in one of the 3 trees. RK3566/RK3568 fails because OP-TEE has no RK356x flavor despite broad U-Boot and TF-A support. The gate model (see 01-path-a-candidate-gates.md) requires presence in all 3 upstream trees, so a single missing flavor is disqualifying regardless of the other two.
2. Owner authority not reachable or not clean. Raspberry Pi 5 is rejected on a standing project decision (vendor-controlled early boot keeps it Path B). TI K3 fails because the early system-firmware boundary does not match the strict owner-root plan. The newer i.MX9 variants fail for the same family of reason as i.MX93: the EdgeLock vendor-firmware boundary (see 04-imx93-evk.md), plus thinner TF-A documentation.
3. Maintenance and packaging health. Allwinner A64 is orphaned in OP-TEE's maintainer file; i.MX8MQ was dropped from TF-A CI over OCRAM constraints; Nuvoton Arbel is a BMC reference platform that explicitly disables the EFI loader, which the yubiOS UEFI-variable design requires.

## Why the record matters

The deferred table is the negative space of the comparison matrix (see the source doc's matrix, explicated in the per-lane docs 02 through 07). Three properties make it useful later:

- It prevents re-surveying the same platforms on every refresh cycle without a trigger. Each row carries a concrete re-open condition: i.MX91/95/943 should be revisited when the upstream boot chain and board configs mature (source doc).
- It records that rejection is often about a single missing integration, not a broad capability gap. Nuvoton Arbel is the sharpest example: it is one of only two board families in the whole survey whose defconfig enables the fTPM-over-TEE driver, and it is still rejected because the EFI loader is disabled.
- It keeps Path B (vendor-controlled early boot) explicitly on the books as the documented alternative for boards like Raspberry Pi 5, rather than pretending every board is a Path A candidate in waiting.

No dig was run for this subtopic: every claim above is the source doc's own recorded decision and citation set.
