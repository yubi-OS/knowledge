# 04 Milestone 3: sealed composefs boot chain

Scope: the third milestone's scope and gates, its critical path, its blocker, and why the source doc calls it the actual long pole of the whole project. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## Scope and gates

The source doc defines milestone 3 as: "Promote the current unsealed integrity path to a signed-UKI plus Secure Boot proof with negative tamper evidence on amd64 and arm64." (source doc). Two gates follow: a sealed boot chain (signed UKI plus Secure Boot) and negative tamper evidence (proof that tampering is detected, not just that valid boots pass), on both amd64 and arm64.

The mechanism class is well documented upstream. A unified kernel image is a single PE binary bundling kernel, initrd, command line, and OS metadata that UEFI executes directly and Secure Boot verifies (https://bootc.dev/bootc/experimental-composefs.html, jev weight 0.65; mechanism context). Composefs supports fs-verity validation of content files, with digests stored in the image's trusted.overlay.metacopy extended attributes (https://github.com/composefs/composefs, jev weight 0.58). Red Hat's sealed-images description connects the two: "Secure boot and a signed unified kernel image already verify the boot chain: Bootloader, kernel, initramfs. Sealed images extend verification into the immutable OS image itself, with file-level precision." (https://www.redhat.com/en/blog/how-sealed-images-red-hat-enterprise-linux-extend-os-integrity-boot-runtime, jev weight 0.55). RHEL's bootc documentation records the concrete sealing flow: compute the composefs digest of the rootfs, then create the UKI with ukify (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/cryptographic-sealing-of-bootc-images-technology-preview, jev weight 0.57).

## The blocker and what "unsealed" means

The seeded blocker is B-BOOTC-SEAL: "fs-verity currently proven through a mutable BLS digest anchor, not a sealed/signed UKI; see refs/bootc-composefs-sealed-flow-2026-07-22.md." (source doc). The gap is the anchoring: the integrity is proven, but the anchor that pins it is mutable, so the chain is not yet sealed. The bootc documentation states the same distinction precisely: unsealed composefs boots via a traditional vmlinuz and initramfs with a BLS entry, and even a UKI built with --allow-missing-verity is unsealed in this sense, since packaging as a UKI is a boot convenience rather than a seal (https://bootc.dev/bootc/experimental-composefs.html, jev weight 0.65). A sealed build instead bakes a signed UKI into the image whose signature covers an embedded composefs digest over every file in the OS (https://github.com/bootc-dev/bootc-dev.github.io/blob/main/content/blog/2026-may-06-sealed-images-building.md, jev weight 0.33, weak backing; project-adjacent blog). Whole-filesystem sealing via a single cryptographic digest covering contents and metadata is the general mechanism composefs provides (https://scrivano.org/posts/2026-06-05-sealing-with-composefs/, jev weight 0.32, weak backing). The All Systems Go 2025 talk on UKI, composefs, and remote attestation for bootable containers describes the same link between a UKI and a complete read-only filesystem tree verified on load (https://media.ccc.de/v/all-systems-go-2025-362-uki-composefs-and-remote-attestation-for-bootable-containers, jev weight 0.33, weak backing).

## Linear ownership and critical path

The source doc assigns (source doc):

- OMN-43, parent, Todo, P2.
- OMN-51, split/ukify base pin, In Progress, P2.
- OMN-52, UKI through protected boundary, Todo, P1.
- OMN-53, negative-tamper proof, Todo, P1.

The critical path is explicit: OMN-51 gates OMN-43 (parent) and OMN-52 (P1); OMN-52 gates OMN-53 (P1). OMN-51 is the only in-flight work.

## Status and the long-pole claim

The source doc records status as of 2026-07-28: "6.25% — actual long pole of the whole project right now." (source doc). It adds: "With 6 weeks to project target 2026-09-13, any week lost here is unrecoverable without scope cut." (source doc). Two later drift-check notes in the source doc record that the 2026-09-13 target date has passed: the first flagged it in round 10, cycle 12, and a second note (round 11, cycle 11) records it as still flagged, with milestone state remaining Jenny's call (source doc). The corpus records this as a dated correction to the status framing above: the six-week countdown quoted from the 2026-07-28 review is historical, and the date has since passed.

## Cross-milestone dependencies

The source doc's dependency note is load-bearing: "OMN-52/53 feed back into Milestone 1 (signed UKI consumed by ARM64 boot) and into Milestone 4 (target-image runtime hardening meaningless without a sealed chain). The four milestones are not strictly sequential." (source doc). This is why the doc ranks milestone 3 above milestone 1 in criticality despite milestone 1 being the hardware-visibility pole: the sealed chain is a prerequisite for evidence in two other milestones, so its delay compounds everywhere.

## Downstream verification posture

The negative-tamper gate (OMN-53) is what distinguishes this milestone from a signing convenience. A chain that boots valid images is not enough; the milestone requires evidence that tampered images fail to boot. This matches the layered verification model in the wider ecosystem, where boot-time verification and runtime file-level verification are distinct layers that must each carry their own proof (https://www.redhat.com/en/blog/how-sealed-images-red-hat-enterprise-linux-extend-os-integrity-boot-runtime, jev weight 0.55).
