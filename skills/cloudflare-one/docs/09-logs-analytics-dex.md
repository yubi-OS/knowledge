# 09 - Logs, Analytics, and DEX

Scope: Gateway activity logs, Access audit logs, shadow IT discovery, Logpush export to SIEM, and Digital Experience Monitoring (DEX), plus the skill's rule to troubleshoot from logs toward config.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md`.

## Gateway activity logs

[Gateway activity logs](https://developers.cloudflare.com/cloudflare-one/insights/logs/dashboard-logs/gateway-logs/) record DNS, HTTP, and Network policy decisions, and can be filtered by rule name, user identity, destination, action, and time range (source doc; the docs page confirms the surface, weight 0.93). The source doc names them the primary troubleshooting tool for the question "why was this blocked or allowed." That framing matters operationally: the log entry is the contract between policy intent and observed behavior, and it is where every Gateway investigation starts.

## Access audit logs

[Access audit logs](https://developers.cloudflare.com/cloudflare-one/insights/logs/dashboard-logs/access-authentication-logs/) record authentication decisions per app: who authenticated, which policy matched, and session details. The source doc's uses: verifying policy behavior and investigating access failures (source doc). Together with Gateway logs, this covers both halves of the zero-trust decision: can this identity reach this app (Access), and is this traffic allowed through (Gateway).

## Shadow IT discovery

[Shadow IT discovery](https://developers.cloudflare.com/cloudflare-one/insights/analytics/shadow-it-discovery/) uses Gateway HTTP logs to surface unmanaged SaaS applications. It requires TLS inspection for HTTPS visibility (source doc). This is another entry in the TLS inspection dependency chain (doc 06): without TLS decryption there is no HTTPS visibility, so shadow IT discovery is downstream of the root CA deployment and Do Not Inspect planning, not an independent toggle.

## DEX

[DEX (Digital Experience Monitoring)](https://developers.cloudflare.com/cloudflare-one/insights/dex/) provides fleet-level and per-device connectivity diagnostics (source doc; the docs page confirms, weight 0.9). The source doc directs two specific uses: [DEX tests](https://developers.cloudflare.com/cloudflare-one/insights/dex/tests/) such as HTTP and traceroute to proactively monitor reachability to critical origins and internal apps, and fleet status, which shows device client health, connection mode, and connectivity state across the enrolled population (source doc). The monitoring surface is documented as [DEX monitoring](https://developers.cloudflare.com/cloudflare-one/insights/dex/monitoring/) (weight 0.91). Product history is on the [Cloudflare blog](https://blog.cloudflare.com/digital-experience-monitoring-beta/): DEX entered as a beta for digital experience monitoring (weight 0.74), with the general [introduction post](https://blog.cloudflare.com/introducing-digital-experience-monitoring/) describing the concept (weight 0.64). The [DEX changelog](https://developers.cloudflare.com/cloudflare-one/changelog/dex/) tracks feature evolution (weight 0.93).

DEX answers a question the policy logs cannot: is the failure at the client, the path, or the origin. Fleet status gives the enrolled-population view; per-device diagnostics and HTTP or traceroute tests give the path view.

## Logpush

[Logpush](https://developers.cloudflare.com/cloudflare-one/insights/logs/logpush/) exports Gateway, Access, Network, and DEX logs to external SIEM or storage (source doc; the docs page confirms, weight 0.94; the general [Logpush reference](https://developers.cloudflare.com/logs/logpush/) covers the export mechanism, weight 0.91). The source doc's timing rule: configure Logpush before go-live if the customer requires centralized log retention or compliance reporting. After go-live there is a retention gap that cannot be backfilled, so this is a pre-deployment checklist item, not a follow-up.

## The troubleshooting rule

The source doc's method: when troubleshooting, work from logs toward config. Identify the log entry showing the failure (Gateway block, Access deny, tunnel error, DNS resolution miss), then trace back to the responsible rule, route, or policy (source doc). The reverse order, reading config to predict behavior, produces plausible guesses; the log-first order produces evidence. The validation prompt completes it: before declaring a fix, verify rule type, action, traffic expression, precedence and evaluation phase, referenced lists, and Gateway settings (source doc).

## SIEM context

Logpush destinations include SIEM platforms; a [Rapid7 integration guide](https://docs.rapid7.com/insightidr/cloudflare/) documents consuming Cloudflare logs in InsightIDR (weight 0.32, weak-moderate; named here only as an example of the destination class), and a [Cloudflare blog post](https://blog.cloudflare.com/export-logs-from-cloudflare-gateway-with-logpush/) describes exporting Gateway logs with Logpush (weight 0.75). The load-bearing source for the capability remains the Logpush docs page and the source doc.
