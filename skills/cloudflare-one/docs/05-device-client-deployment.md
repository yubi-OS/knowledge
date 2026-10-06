# 05 - Device Client Deployment

Scope: the Cloudflare One device client as the user-device on-ramp: enrollment rules versus device profiles, headless service-token enrollment, profile precedence, split tunnel mode selection, MDM parameter overrides, and coexistence with other VPN clients.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md`.

## Two components: enrollment rules and device profiles

The source doc states the structure plainly: the [Cloudflare One device client](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/) is the on-ramp for user devices, and 2 components control it. Enrollment rules decide who can connect; device profiles decide how the client behaves after enrollment (source doc).

The decisive detail the source doc teaches: the enrollment rule is an Access application of type `warp`, not a device setting, and it accepts reusable Access policies. Enrollment debugging happens in Access, not Devices (source doc). The current docs confirm the policy shape: under Device enrollment permissions, administrators configure one or more Access policies to define who can join their device, for example allowing all users with a company email address via an Include rule with an Emails selector ([device enrollment permissions](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/deployment/device-enrollment/), weight 0.93). Release hygiene is documented too: [stable releases](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/download/) are recommended for production, with separate unstable beta and LTS release tracks available (weight 0.94).

## Headless devices

For headless or autonomous devices (services, kiosks, Linux hosts), the source doc prescribes service token enrollment. Non-human devices authenticate as `non_identity@[team-domain].cloudflareaccess.com` and have no group membership, so device profiles targeting IdP groups will not match them. Target headless devices explicitly with the non-identity email, with specific device conventions such as OS information, or accept that they fall to the default profile (source doc).

## Device profiles and precedence

Device profiles control connection mode, [split tunnel](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/configure/route-traffic/split-tunnels/) configuration, user permissions (disable, switch lock), auto-reconnect, and captive portal behavior. Profiles are matched by user group or device attributes in precedence order: first match wins, and the default profile catches the rest (source doc).

## Split tunnel mode is the highest-leverage decision

The source doc provides a decision table with 5 goals (source doc):

| Goal | Mode | Rationale |
|---|---|---|
| VPN replacement only (private apps) | Include | Route only specified private CIDRs and hostnames through the client; everything else goes direct; minimal blast radius |
| SWG only (internet security) | Exclude | All traffic through the client; exclude only what breaks (local printers, certificate-pinned apps) |
| VPN replacement + SWG | Exclude | All traffic through the client; the most common enterprise configuration |
| Coexistence with another VPN | Include | Avoids conflict with the other VPN's tunnel interface and DNS control |
| DNS filtering only | DNS-only mode | Only DNS queries go to Gateway; no traffic proxying |

The current docs frame the 2 modes consistently: split tunnels can exclude or include IPs or domains from going through the Cloudflare One Client (formerly WARP), commonly to run the client alongside a VPN in Exclude mode or to provide access to a specific private network in Include mode (weight 0.94, [split tunnels](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/configure/route-traffic/split-tunnels/)). The learning-path phrasing adds the direction: in Exclude IPs and domains mode, everything is proxied through the WARP tunnel except the explicitly listed IPs and hosts (weight 0.76, [split tunnel settings](https://developers.cloudflare.com/learning-paths/replace-vpn/configure-device-agent/split-tunnel-settings/)).

4 constraints from the source doc make this decision expensive to reverse (source doc):

1. Include vs exclude is per-profile, not per-entry. You cannot mix modes in the same profile.
2. Switching modes mid-deployment requires re-evaluating every entry.
3. Split tunnel entries must align with tunnel routes bidirectionally; a mismatch is either a black hole (include entry with no tunnel route) or traffic that never enters the tunnel (route with no profile entry).
4. The [replace-VPN learning path](https://developers.cloudflare.com/learning-paths/replace-vpn/configure-device-agent/split-tunnel-settings/) walks this same configuration surface (weight 0.76).

## MDM overrides and coexistence

MDM parameters (mdm.xml or managed preferences) override dashboard-configured profile settings for any setting specified in the file. If dashboard changes appear to have no effect on managed devices, check the MDM config first; retrieve the [MDM deployment docs](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/deployment/mdm-deployment/) for platform-specific file locations and parameters (source doc).

Coexistence is a known failure source: if another VPN client or agent controls DNS on the device, the device client's DNS interception conflicts. In coexistence scenarios, use traffic only mode to avoid routing table and DNS conflicts (source doc). Also expect captive portal detection to temporarily disconnect the client when it detects a portal such as hotel or airport WiFi, a common end-user friction source to manage deliberately (source doc).

A weak third-party deployment guide ([Nanosek](https://www.nanosek.com/resources/cloudflare-warp-deployment-guide), weight 0.09) names split-tunnel misconfiguration, forcing all traffic through the client or excluding traffic that should be inspected, as the common failure, which matches the source doc's emphasis but is not load-bearing here.
