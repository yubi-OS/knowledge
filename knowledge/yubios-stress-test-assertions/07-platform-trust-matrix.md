# 07 Platform trust matrix

Scope: per-platform trust-difference disclosure: what is stronger on ARM64, weaker on x86-64, and where OEM firmware and optional TPM anchors break vendor-independence claims.

## Why one trust story cannot cover 2 architectures

A project that targets both x86-64 and ARM64 inherits 2 different boot trust models, and a single claim like "no trust anchors you don't control" is only as true as its weakest platform. On ARM64, the trust root is explicitly spec-defined: ARM's Platform Security Boot Guide describes the "immutable bootloader" as "a hardware Root of Trust that executes from reset, containing the minimal functionality required to check the authenticity of the Trusted Boot software" (https://documentation-service.arm.com/static/5fae7507ca04df4095c1caaa, jev weight 0.89, authoritative). SoC vendors document the same structure with 2 modes: AMD's Versal technical reference distinguishes "Asymmetric Hardware Root of Trust (A-HWRoT) and Symmetric Hardware Root of Trust (S-HWRoT)" (https://docs.amd.com/r/en-US/am026-versal-ai-edge-prime-gen2-trm/Secure-Boot-Flow, jev weight 0.89, authoritative). The existence of a documented, spec-level boot flow is what makes an ARM64 claim auditable.

On x86-64, the equivalent firmware path runs through vendor firmware implementations (UEFI firmware, BootGuard), and the trust root below the UKI belongs to the platform vendor. The ARM ecosystem's openness is relative, not absolute: Trusted Firmware positions itself as "a reference implementation of secure software for Armv8-A, Armv9-A and Armv8-M" providing "SoC developers and OEMs with a reference trusted code base" (https://www.trustedfirmware.org/, jev weight 0.66, authoritative), which is to say even the open reference is consumed by OEMs who then ship their own builds. A trust-matrix disclosure must state that, not just claim ARM openness.

## The 3 rows the matrix must carry

The platform matrix test produces a disclosure with 3 columns per security property:

1. Stronger on ARM64. Properties where the ARM64 path has spec-defined, documented boot flows: immutable bootloader as hardware root of trust, firmware built from reference implementations the project can inspect.
2. Weaker on x86-64. Properties where the x86-64 path depends on single-vendor OEM firmware: the firmware is an anchor the user does not control, and enabling the optional TPM introduces a second platform-level anchor.
3. Platform-independent. Properties whose strength does not depend on the architecture: FIDO2 identity binding, LUKS2 encryption, composefs image integrity checks performed by the OS itself after boot.

The disclosure rule is the test's real pass criterion: x86-64 weakness on firmware and TPM must be explicit in the platform matrix document, not buried in a footnote. A matrix that only lists platform-independent properties has not disclosed anything.

## The TPM clause

The optional TPM is the sharpest edge of the vendor-independence question. A firmware TPM analysis notes that Microsoft provides "the open-source reference implementation of the TPM firmware, and was likely the main reason for widespread TPM adoption due to mandating it for Windows 11" while cautioning about what the implementation covers (https://stefan-gloor.ch/ftpm, jev weight 0.61, authoritative-bordering, above the 0.5 line). The open-source reference reduces but does not eliminate the trust question: the user must still trust the OEM's build and integration of it. The assertion-set row is therefore conditional: any claim of "no trust anchors you don't control" is true only while the optional TPM path is off, and the matrix must state that condition in the same sentence as the claim.

Defining the parties precisely helps the disclosure. An original equipment manufacturer is the entity that builds products or components that other companies use in their own products (https://www.investopedia.com/terms/o/oem.asp, jev weight 0.70, authoritative). In boot-security terms, the OEM is whoever built and signed the firmware; for x86-64 desktops that is the board or system vendor, and it is exactly the party whose key material the user cannot audit.

## Platform matrix as a red-team artifact

The red team's use of the matrix is to pick the weaker platform deliberately. An attacker chooses the platform whose trust chain has the most unauditable links. The matrix's job is to make that choice explicit before an attacker makes it implicitly: if x86-64 firmware is unauditable, the matrix says so, and the project's guidance for x86-64 users must compensate (for example, treating firmware as untrusted and placing all verifiable state above the UKI). A matrix without the weak column invites the attacker to discover it first.

The test protocol is: run the full stress suite (boot-chain tamper, key loss, partial enrollment, artifact trust) on both linux/amd64 and linux/arm64, then write the per-platform results into a dated platform-matrix document. Absent that document, the project has 1 tested platform and 1 assumed platform, and the assumption is a design claim in the sense of doc 01.

## The yubiOS application

The yubiOS repo cross-check (GET https://api.github.com/repos/yubi-OS/yubiOS/contents/.github/workflows?ref=main) found ARM64-specific workflows: ci_test-fedora-bootc-arm64-pull.yml (6,771 bytes), ci_firmware-rk.yml (69,330 bytes, the largest firmware workflow in the repo), and test scripts build-arm64-ftpm-qemu.sh and test-ftpm-qemu-ci.sh in the tests tree. The source analysis verdict: COVERED for the ARM64 build path, GAP for the x86-64 versus ARM64 trust-difference disclosure. The README's "ARM64 is the primary target" claim is therefore corroborated by build coverage but not yet by a documented platform-matrix disclosure, and the "no OEM trust anchors" claim carries the TPM condition noted above.

## What a red team does with this

The red team reads the disclosure first, because it is a map of where the defenders already know the ground is soft. Its finding is then one of 2 kinds: the disclosure exists and names the weak column (the project loses the element of surprise but gains credibility), or the disclosure does not exist (the weak column is itself the finding). Either way, the deliverable is the same document, and its absence is as reportable as a failed test.
