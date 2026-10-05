# 03 systemd-sysupdated: D-Bus API removal and the Varlink transition

Scope: the removal of the experimental systemd-sysupdated D-Bus API, its replacement by direct Varlink IPC against systemd-sysupdate, what updatectl's role becomes, and what this means for tooling that speaks to the update daemon.

## What the source doc recorded

The source doc recorded that the systemd-sysupdated D-Bus API removal is confirmed in the v262-rc2 incompatible-changes section, superseded by Varlink IPC, with updatectl continuing to work over the new transport, and that yubiOS has no dependency (per the 2026-07-14 audit).

## What the release notes actually say, per the dig

The dig captured the release-notes text on the systemd GitHub releases page: "The experimental 'systemd-sysupdated' D-Bus API is going to be removed in the next release (v263). The plan is that in its place clients should directly talk to systemd-sysupdate (i.e. the backend of 'systemd-sysupdated') via Varlink IPC. The 'updatectl' tool will be reworked along these lines." (source: https://github.com/systemd/systemd/releases, jev weight 0.94).

One precision matters here: the text the dig captured names v263 as the removal target, not v262. The source doc read the v262-rc2 incompatible-changes section as the removal proceeding; the current upstream NEWS text (as crawled 2026-10-05) positions the removal for the next release after v262. Both readings agree on direction and replacement (Varlink IPC, updatectl reworked to use it); they differ on which version lands the removal. A consumer planning migration should treat v263 as the removal version per the primary text captured in this dig.

## The two sides of the IPC change

The systemd-sysupdated manual page describes the service being reworked: systemd-sysupdated is a system service that allows unprivileged clients to update the system, working by scanning the system for updateable "targets" (portable services, sysexts, sysupdate components, and similar) and exposing them, with per-target methods that trigger update operations (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-sysupdated.html, jev weight 0.89; same content on the man7 mirror at https://www.man7.org/linux/man-pages/man8/systemd-sysupdated.service.8.html, jev weight 0.82).

The client tool side is documented separately: updatectl may be used to check for and install system updates managed by systemd-sysupdated.service, with commands to show information about targets and their versions, listing all available targets when no target is specified (source: https://www.freedesktop.org/software/systemd/man/latest/updatectl.html, jev weight 0.86).

Evidence that the Varlink surface is actively in flux: a GitHub issue filed 2026-09-01 discusses systemd-sysupdate@.service (varlink API), noting it is more similar to systemd-sysupdated.service than to systemd-sysupdate-update.service in that it can also update images and not only the host (source: https://github.com/systemd/systemd/issues/43604, jev weight 0.88). This shows the per-unit Varlink API topology was still being sorted out in the run-up to v262.

## The Varlink direction, for context

The broader IPC shift is real but the dig's coverage of it is weak-backed: a Phoronix article describes systemd developers looking at Varlink for the future since no D-Bus is coming to the Linux kernel, with Varlink as interface description format and protocol (source: https://www.phoronix.com/news/Systemd-Varlink-D-Bus-Future, jev weight 0.35, weak backing). A DeepWiki summary of D-Bus and Varlink IPC in systemd covers the two-protocol coexistence (source: https://deepwiki.com/systemd/systemd/2.5-d-bus-and-varlink-ipc, jev weight 0.29, weak backing). Treat these as context only; the authoritative statements are the release-notes text and the manual pages above.

## Impact for an image-based OS consumer

For an image-based OS the exposure is narrow and concrete. If any build-time or host tooling speaks the experimental D-Bus API of systemd-sysupdated directly, that tooling must move to Varlink against systemd-sysupdate before the v263 removal. Clients using updatectl are unaffected by design: the tool is reworked to follow the new transport. yubiOS has no dependency on either surface (source doc audit), so this lands as a watch item rather than work: re-check at the v263 cycle that nothing in the image build pipeline or update flow picked up a D-Bus dependency on sysupdated.
