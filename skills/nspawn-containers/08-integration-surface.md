# 08: Integration surface with sibling yubiOS skills

Scope: how nspawn composes with mkosi-image-builder, bcvk-virtualization, bootc-images, systemd-hardening, and the ADR-031 vfio-user trust boundary.

Note on method: this subtopic is an internal-record subtopic per the skills-variant brief. Its subject is composition among yubiOS repo artifacts, so no searXNG dig was run. Every claim below is attributed to the source doc (yubi-OS/yubiOS skills/nspawn-containers/SKILL.md).

## The composition map

The source doc's References section names the integration surface directly:

- mkosi-image-builder is the image provider for nspawn RootImage=. Every nspawn invocation in this corpus starts from an mkosi-built artifact, either an extracted directory (--directory=) or a raw image (--image= / -i).
- bcvk-virtualization is the QEMU-based isolation, the go-bigger alternative when the job needs kernel independence.
- bootc-images is the image-mode source for nspawn root directories, and simultaneously the escape hatch for long-running workloads (the anti-pattern that pushes drift-prone nspawn containers to bootc install to-disk).
- systemd-hardening is the unit-testing counterpart: hardened units are validated inside the booted nspawn container rather than on the host.
- ADR-031 defines the vfio-user boundary, with nspawn as the go-smaller side of that trust boundary.

## In-repo touchpoints

The source doc's Examples section records the sections this skill owns or extends: Overview, When to Use, Anatomy of an nspawn invocation, and Boot in container. The decision tree in doc 01 is the routing table across the sibling skills: each sibling owns the branches this skill declines.

## Primitive mapping and RSI history

The source doc's changelog records the skill's position in the yubiOS 10-primitive framework: segmentation is the primary primitive (P9), with least privilege via user-namespace plus bind scoping (P3), immutability via the signed mkosi image as root (P6), and declarative policy via nspawn flags (P4). The cycle 5 entry (2026-08-04) records initial v1 creation after deep-research stream 1 found nspawn implicit across three sibling skills without a dedicated home, validated by js-yaml.

Three later RSI closures are recorded in the source doc and belong to the integration picture because they attach this skill to corpus-wide concepts: cycle 5 (2026-08-06) closed the trust-chain primitive gap, referencing PCR, UKI, and secure boot, moving the corpus-wide trust-chain count from 23 to 24 of 70 skills; cycle 6 closed the cryptographic-identity gap, referencing FIDO2, PIV, YubiKey, ssh-key, hmac-secret, and passkey; cycle 7 closed the attestation gap, referencing SLSA, in-toto, provenance, and TPM-quote patterns. A 2026-09-17 coverage note records that an unsupported capability assertion inherited from the template paragraph was removed, and that skill-specific content was unchanged.

A corpus-audit note (2026-08-06, cycle 4) records this skill's participation in the matched-parameter ablation over all 70 yubiOS skills, with the hyperspherical-harmonic variant scoring R^2 = +0.222 on the full holdout versus -1.120 for the flat Fourier baseline, and R^2 = +0.618 versus -0.359 on the 49-skill split; the note itself flags the missing error bars and the multi-seed re-run as the next step.

## Reading rule

When a task crosses two of these surfaces, the source doc's boundary case applies: the artifact named by the request routes to its owning skill, and nspawn is the execution vehicle only when the artifact is a container run, a boot, a bind, or a network mode. Everything above in this doc is a source-doc claim by construction; no external weight applies, and none is claimed.

## Why the composition is one-way

The integration surface has a direction worth stating explicitly: artifacts flow from mkosi-image-builder and bootc-images into nspawn, and test results flow from nspawn back into systemd-hardening decisions, but nothing in the source doc describes nspawn producing artifacts for its siblings to consume. The signed mkosi image is the root of trust for the container run; the nspawn run is evidence about the image, and that evidence is what the systemd-hardening skill consumes when it tunes unit hardening inside the image. bcvk-virtualization consumes the same image class at the VM rung, which is why the source doc can call the two skills alternatives for the same artifact rather than different pipelines.

## Placement in the skill landscape

The source doc's changelog records that this skill was created because nspawn was implicit across bcvk-virtualization, bootc-images, and mkosi-image-builder without a dedicated home. The integration surface above is the artifact-level view of that history: each sibling keeps its own domain, and this skill owns the run-the-image-in-a-container domain between them. The ADR-031 vfio-user boundary is the one place where the composition is explicitly two-sided in the source doc, with nspawn as the go-smaller side; anything requiring device passthrough crosses to the go-bigger side and leaves this skill's scope.

For corpus readers, the practical summary is: when the task names a yubiOS image artifact, start from mkosi-image-builder or bootc-images for its construction; when the task is to run, boot, bind, or network that artifact, this skill applies; when the task is to make the artifact a persistent service, portable services (doc 06) apply; when the task is kernel-level isolation, bcvk-virtualization applies. Each claim in this doc traces to the source doc by the internal-record rule stated at the top.
