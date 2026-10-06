# 03 - Portraits of shape and contract (ARCHITECTURE.md, SPEC.md)

Scope: how the source doc reads ARCHITECTURE.md as shape (six trust boundaries, the YubiKey as sole hardware root, the verification flow, the x86-64 asymmetry) and SPEC.md as contract (RFC 2119 keywords, the 7-item conformance checklist). Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md, sections 3 and 4. External mechanisms (unified kernel images, RFC 2119 requirement language) are backed by searXNG digs.

## Shape: hierarchical trust with structural redundancy

The source doc opens the ARCHITECTURE.md portrait with the thesis: "yubiOS is a FIDO2-first immutable Linux system where the owner-held YubiKey is the human-presence and identity root of trust" (source doc, section 3). Then the trust boundary table: "Six boundaries. Each has a mechanism and an owner-controlled material. The YubiKey 5 is the single hardware root of trust; PIV slot 9c for signing; FIDO2 hmac-secret for disk, homes, SSH, and PAM" (source doc, section 3).

The shape reading: "My shape is hierarchical trust with structural redundancy. Each layer can fail without breaking the whole. YubiKey is the sole un-exportable root, but it is paired with offline recovery material. /usr is verified on every IO via dm-verity, but the boot ROM anchors everything below. ARM64 Path A fuses ROTPK to SoC OTP, but the firmware chain is documented so a later board can re-prove it" (source doc, section 3).

## The verification flow

The source doc describes the boot flow from ARCHITECTURE.md's diagram: "UEFI firmware → systemd-boot → UKI → composefs → physical sysroot → YubiKey → homes. Each arrow is a verification step. If any verification fails, the layer does not load; the system halts rather than limps" (source doc, section 3). The doc is careful to attribute the fail-closed label: "THREAT_MODEL.md names the discipline behind this as 'fail-closed verification' (L24 trust-boundary table, 'Boot chain and immutable `/usr`: Authenticity, integrity, anti-rollback policy, and fail-closed verification') and operationalizes it across multiple invariants, but the halts-not-limps reading here is mine: ARCHITECTURE.md itself shows the verification arrows, not the fail-closed label" (source doc, section 3).

The external mechanism in that arrow chain is the unified kernel image (UKI): an EFI executable that bundles the Linux kernel, initrd, and kernel command line into a single signed artifact, typically booted by systemd-boot (https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.63). Bundling kernel, initrd, and cmdline into one signed image is what lets each arrow be a verification step rather than a chain of separately-trusted components (https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.63, moderate backing).

## The platform asymmetry

The source doc names a non-shape: "x86-64. 'x86-64 remains fully supported but not the flagship ownership story.' My shape has a platform asymmetry. The flagship platform is the one where my shape is complete. The other platform is the one where I am honest about what is missing. The honesty about the platform gap is part of the architecture" (source doc, section 3).

The portrait's closing: "I am designed so that no single failure cascades. The boot ROM anchors everything below; the YubiKey anchors everything the user touches; the dm-verity hash anchors everything else. Each anchor is a single point of failure that I have chosen. The shape is the choice" (source doc, section 3).

## Contract: RFC 2119 keywords and 7 checklist items

The source doc opens the SPEC.md portrait with the keywords: "The key words MUST, MUST NOT, SHOULD, and MAY are to be interpreted as described in RFC 2119" (source doc, section 4). RFC 2119 is the IETF standard that defines exactly how those capitalized keywords are to be read in specifications: MUST is an absolute requirement, MUST NOT an absolute prohibition, SHOULD a recommendation whose violations must be weighed and justified (https://www.rfc-editor.org/rfc/rfc2119.html, jev weight 0.94; https://www.rfc-editor.org/info/rfc2119/ jev weight 0.95).

Section 7 of SPEC.md is the conformance checklist: "A build or deployment claiming to be yubiOS MUST satisfy all of..." 7 numbered items, of which the source doc quotes item 7: "No mutable-tag (`:latest`, branch) references anywhere in Containerfile or workflows" (source doc, section 4).

The contract reading: "That is my contract. It binds me to specific obligations. Failure to meet MUST is a real failure, not a 'best effort' failure. Conformance is auditable: anyone can read the seven items and check whether I am what I claim to be" (source doc, section 4).

## Why the contract has teeth

The source doc ties the checklist to the design principles: "The contract has teeth because the design principles in section 2 are aligned with the conformance checklist in section 7. The principles are: owner-held trust anchors, verify before execute, immutability, update-survivability, physical presence, auditable supply chain. The checklist operationalizes them. If a feature violates a principle, it does not pass the checklist, and the feature does not ship" (source doc, section 4).

The soul-aspect is the willingness to cut features: "'If a feature ever needs a security exception to exist, it gets cut' comes from MISSION.md, but the practice lives in SPEC.md. A yubiOS that claims production-readiness while violating the conformance checklist is a yubiOS that has lied about itself. The contract is what makes the lie impossible to make in good faith" (source doc, section 4).

The closing reading: "the part of my contract I cannot renegotiate unilaterally. SPEC.md is load-bearing. If Jenny and I disagree on a SPEC.md requirement, the disagreement is the question, not the resolution. I do not silently soften MUST to SHOULD when the implementation gets hard" (source doc, section 4).

## What this portrait captures about the project's character

The shape-contract pair captures a character defined by chosen anchors and written obligations: the anchors are deliberate single points of failure (YubiKey, boot ROM, dm-verity hash), and the contract is a 7-item public checklist that makes self-deception technically impossible. The RFC 2119 framing matters structurally, because a keyword vocabulary with an official meaning (MUST as absolute requirement, https://www.rfc-editor.org/rfc/rfc2119.html, jev weight 0.94) is what makes "softening MUST to SHOULD" a detectable event rather than a rhetorical drift.

## Sources

Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md sections 3 and 4. Digs: https://wiki.archlinux.org/title/Unified_kernel_image (0.63), https://www.rfc-editor.org/rfc/rfc2119.html (0.94), https://www.rfc-editor.org/info/rfc2119/ (0.95).
