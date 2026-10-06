# 09. Post-Launch Hardware Work and Deferred Ideas

Scope: the ledger's two trailing inventories: the post-launch hardware work table with per-item status, and the deferred ideas list of capabilities parked until their upstream dependencies improve.

## The post-launch hardware table

Six work items carry explicit statuses (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md):

| Work item | Status | Notes |
|---|---|---|
| RK3588 Path A production proof | Planned | Workflow compiles components, but the ROCK 5B bundle still needs real DDR/TPL plus fuse/RPMB/OP-TEE validation on hardware |
| RK3399 supported-secondary proof | Planned | Workflow produces combined Rockchip images; physical ROTPK/RPMB/OP-TEE evidence remains open |
| RPi 5 Path B documentation | Planned | Valuable dev target, not owner-owned Path A |
| Firmware OCI artifact hardening | Ongoing | Real hardware firmware tags should drop volatile CI flags |
| U-Boot FIDO2/U2F console gate | Idea-stage | Needs USB HID threat model and recovery design before implementation |
| Attestation service | Research | Must inherit PQ TLS requirements and fTPM evidence model |

The table is a status ledger in miniature: each row names the artifact state (what already compiles or builds) against the evidence state (what physical validation is still open). Two of the six rows are about the same hardware split as Milestone F (doc 02): the RK3588 primary and RK3399 secondary rows restate the bundle-versus-hardware gap in concrete terms, with the build side solved and the physical side open.

The two non-ARM64-target rows widen the scope. The RPi 5 row keeps Path B documented as a development target while excluding it from the owner-owned Path A claim, and the attestation-service row is a network-side research item whose constraint is inheritance: it "must inherit PQ TLS requirements and fTPM evidence model" (source doc), tying it back to the CI rule on ML-KEM hybrid defaults (doc 06) and the fTPM work in Milestone F.

## The deferred ideas

Four ideas are parked with their unblocking conditions (source doc):

- `systemd-sysinstall` as an optional guided installer path beyond current bootc and repart flows.
- LUO/KHO live-update research for appliance or server deployments where a short reboot is unacceptable.
- FIDO2-wrapped Secure Boot signing keys if upstream tools gain a clean hidraw path; PIV remains the current accepted route.
- ORAS artifact media types for non-OS OCI artifacts when registry UX is friendlier than `FROM scratch` carrier images.

The pattern in the list is dependency-driven deferral: each idea is viable in principle but waits on an upstream condition (tooling path, registry UX) or a deployment-class need (no-reboot updates) rather than on yubiOS-internal work.

## What the dig adds

The live-update mechanisms are now documented upstream. The kernel's Live Update Orchestrator documentation covers the in-kernel KHO machinery (weight 0.69, https://www.kernel.org/doc/html/latest/core-api/liveupdate.html), and the userspace-facing Live Update uAPI documentation covers the interface side (weight 0.72, https://origin.kernel.org/doc/html/latest/userspace-api/liveupdate.html). A 2026 All Systems Go talk proposal titled "Seamless Upgrades with KHO, LUO, and systemd" connects the kernel mechanisms to the systemd layer the doc names (weight 0.15, https://cfp.all-systems-go.io/all-systems-go-2026/talk/J8GNND/; weak, a conference CFP page), and a news writeup on Google's KHO and LUO work is weak (weight 0.10, https://cloudnews.tech/google-on-linux-kernel-updates-without-restarting-the-server/). Off-topic noise from the same queries (weight 0.26, https://en.wikipedia.org/wiki/List_of_songs_recorded_by_Adele; weight 0.07, https://www.youtube.com/watch?v=XgTaa2bY2iM) is recorded in the archive but uncited.

The ORAS side is better sourced. The OCI artifact concept documentation (weight 0.68, https://oras.land/docs/concepts/artifact/) and the oras artifacts specification repository (weight 0.55, https://github.com/oras-project/artifacts-spec) are the primary references for storing non-container artifacts in OCI registries. Microsoft's registry guidance for managing OCI and supply-chain artifacts with ORAS (weight 0.77, https://learn.microsoft.com/en-us/azure/container-registry/container-registry-manage-artifact) and Oracle's artifact registry overview (weight 0.56, https://docs.oracle.com/en-us/iaas/Content/artifacts/overview.htm) show the registry-side support the doc's "when registry UX is friendlier" condition refers to. The oras.land landing page is weak (weight 0.37, https://oras.land/), and a DeepWiki page on custom artifact types is weak (weight 0.22, https://deepwiki.com/oras-project/rust-oci-client/10.3-custom-artifact-types).

## How the two inventories relate

The table and the list are the ledger's two holding pens below the milestone level. Table items have assigned status and point back into milestone work; deferred items have explicit unblocking conditions and no owner. Both feed the same promotion gate (doc 10): a table row graduates when its evidence lands, a deferred idea graduates when its upstream condition is met and the gate's six criteria can be satisfied.

## Sources for this doc

Ground spine: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Dig results weighted by jev noul as cited inline; 12 results kept, 6 with weight 0.5 or higher.
