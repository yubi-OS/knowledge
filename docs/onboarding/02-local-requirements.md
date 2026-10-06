# 02. Local Requirements

Scope: the toolchain a contributor is expected to have locally (Docker Buildx, a recent systemd toolchain, a YubiKey 5 series device), the TEST-only carve-out for SoftHSM and swu2f in CI, and how the requirement splits between real hardware paths and simulated CI paths.

Grounding spine: yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11.

## The three stated requirements

The source doc lists what repository work expects: Docker Buildx, a recent systemd toolchain "where relevant", and a YubiKey 5 series device "for real enrollment paths" (source doc). The phrasing of the second and third requirements is deliberate. The systemd toolchain is only needed when the work touches systemd units, drop-ins, or homed, so the doc scopes it with "where relevant" instead of demanding it universally. The YubiKey is scoped to "real enrollment paths", which pairs with the next sentence: CI does not need a real key.

## The TEST-only CI carve-out

The doc states that CI "may use SoftHSM or swu2f only where the workflow explicitly marks the artifact as TEST-only" (source doc). This is a two-sided rule. It permits software stand-ins for the hardware token in CI, but only under an explicit TEST-only marker, which prevents a simulated-token artifact from being mistaken for a production enrollment artifact. The rule lives in the Local Requirements section because it defines the boundary between what a developer runs locally (a real YubiKey 5) and what automation may run (a software emulation marked TEST-only).

## What SoftHSM is

SoftHSM is an open-source implementation of a cryptographic store accessible through a PKCS #11 interface, developed as part of the OpenDNSSEC project (https://www.opendnssec.org/en/latest/softhsm/, weight 0.34, weak backing). The SoftHSMv2 source repository confirms it emulates the PKCS #11 API in software so that applications written against hardware tokens can run without the hardware (https://github.com/softhsm/SoftHSMv2, weight 0.19, weak backing). For yubiOS this matters wherever PIV or PKCS#11 signing flows are exercised in CI: SoftHSM lets the pipeline sign and verify through the same interface a YubiKey would present, without holding real key material.

## What the software FIDO2 stand-in covers

The doc's "swu2f" reference covers the FIDO2 side of the same split. General guidance on FIDO2 authenticator testing distinguishes hardware security keys from software test authenticators, noting that software implementations are used to exercise WebAuthn/FIDO2 flows without physical tokens (https://helpmetest.com/blog/fido2-authenticator-testing/, weight 0.12, weak backing). One such software FIDO2/U2F authenticator implementation exists at https://github.com/ellerh/softfido (weight 0.14, weak backing). The exact tool yubiOS CI uses is fixed by the workflow that marks its artifacts TEST-only, not by this corpus; the doc's rule is about the marking discipline, not a tool name.

## Docker Buildx

Docker Buildx is the Docker CLI plugin for extended build capabilities (https://github.com/docker/buildx, weight 0.32, weak backing), and Docker documents it as a CLI and its subcommands in the buildx reference (https://docs.docker.com/reference/cli/docker/buildx/, weight 0.48, weak backing). The yubiOS pipeline uses Buildx because the build policy and multi-platform build flows depend on it (source doc names Buildx as the expected local tool; the deeper pipeline rationale lives in the build-policy documentation, not the onboarding doc). The BuildKit layer underneath Buildx also documents a rootless mode for running builds without daemon root privileges (https://github.com/moby/buildkit/blob/master/docs/rootless.md, weight 0.30, weak backing), which matters for a project whose supply-chain posture prefers rootless builds.

## Why the hardware requirement cannot be dropped

Every item in the list that touches trust is hardware-bound. Enrollment of a YubiKey for LUKS2 and homed produces state that a software token cannot faithfully produce, which is why the doc scopes the YubiKey 5 requirement to "real enrollment paths" (source doc) and pushes everything that can be simulated into CI under a TEST-only banner. The practical reading: a contributor doing image builds or doc work needs only Buildx and a current systemd; a contributor touching enrollment, unlock, or signing flows needs the physical key on the desk, and CI artifacts from simulated tokens must never be treated as enrollment evidence.
