# 08 - Tailnet state and node-key expiry

Scope: the standing inventory facts for this tailnet, the node-key expiry failure mode, and how Tailscale Funnel ties the tailnet to the shell-bridge infrastructure.

## Standing inventory (internal record)

The following are internal-record subtopic facts from the source doc (yubi-OS/yubiOS skills/tailscale-connection/SKILL.md, verified 2026-09-24); no searXNG dig was run for these specifics because they are records of this tailnet, not external mechanisms:

- Tailnet: `tail3a04f5.ts.net`, single owner `foil-copy-overrate@github`, displayName `OMNI-AGENT`, role `owner`.
- 2 devices: `rock1.tail3a04f5.ts.net` (100.100.90.103), the ARM64 CI runner and Sauna shell-bridge host, and `ubuntu.tail3a04f5.ts.net` (100.123.151.62), joined 2026-09-24.
- MagicDNS on, no custom nameservers (doc 03).
- rock1 node key expires 2027-01-27.
- rock1's Funnel exposes `https://rock1.tail3a04f5.ts.net/run`, the endpoint the debug-with-cli skill drives.

## The node-key expiry failure mode

Tailscale documents that by default, node keys automatically expire every 180 days, and that the default can be changed from the Key Expiry section of the Device management page of the admin console (source: https://tailscale.com/docs/features/access-control/auth-keys, jev weight 0.92). If reauthentication does not occur, keys expire and connections to and from the affected endpoint stop working (source: https://tailscale.com/docs/features/access-control/key-expiry, jev weight 0.92). When an expiry is approaching, the documented remediation is to instruct the owner of the machine to log in and reauthenticate within an extended timeframe, or to disable key expiry for the device within that window; once reauthenticated, the key renews for the standard expiry period (source: https://tailscale.com/docs/features/access-control/key-expiry, jev weight 0.92).

The operational rule on this tailnet (source doc): if the rock1 shell bridge becomes unreachable with a non-502 error around 2027-01-27, check node-key expiry first. The rationale is diagnostic ordering: a node-key expiry produces a targeted, date-predictable failure on exactly one device, while a bridge or network fault produces broader symptoms. The device list read (doc 02) shows `expires` and `connectedToControl` per device, so the check is one API call.

rock1's key was renewed at join time on 2026-09-24; 2027-01-27 is approximately 180 days after that date, consistent with the documented default.

## Tailscale Funnel and the shell bridge

Tailscale Funnel routes traffic from the broader internet to a local service running on a device in the tailnet, and is available for all plans (source: https://tailscale.com/docs/features/tailscale-funnel, jev weight 0.89). The `tailscale funnel` CLI reference describes the HTTPS server modes: a reverse proxy, a file server, and a static text server, with HTTPS secured by an automatically provisioned TLS certificate (source: https://tailscale.com/docs/reference/tailscale-cli/funnel, jev weight 0.92).

On this tailnet, Funnel is what makes rock1's shell bridge reachable from outside the tailnet at `https://rock1.tail3a04f5.ts.net/run` (source doc). The connection chain that matters during debug is: Sauna connection `rock1 shell bridge` posts to the Funnel URL, which terminates on rock1, which runs the local bridge server. A Funnel-side failure and a node-key expiry failure look similar from the outside (the bridge is unreachable), which is why the date-based diagnosis rule above and the device list's `connectedToControl` read are the first two checks.

## Connection to other skills

The shell-bridge-connection skill owns the two shell-bridge connections and the debug-with-cli skill consumes the rock1 Funnel endpoint. This skill is the inventory and expiry-clock layer underneath both: it knows which devices exist, what their addresses are, and when their keys die.

## Source quality notes

Strong sources: the key expiry doc (0.92, twice collected), the auth keys doc (0.92), the Funnel feature doc (0.89), and the funnel CLI reference (0.92). Weak results, recorded but not used: flaviocopes course notes at jev weight 0.16, a Reddit reauthorization thread at 0.06, an agent wiki device-management page at 0.15, a Funnel blog post at 0.20, a custom-domain blog post at 0.30, and a Tailscale plus NextDNS note at 0.19. The tailscale.com landing page weighted 0.66 to 0.70 is generic.
