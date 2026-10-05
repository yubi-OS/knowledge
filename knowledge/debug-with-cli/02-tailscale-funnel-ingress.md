# 02: Tailscale Funnel as ingress for a private machine

Scope: using Tailscale Funnel to give a private machine a public TLS-terminated HTTPS URL without opening ports.

## What Funnel is

Tailscale Funnel routes traffic from the broader internet to a local service running on a device in your Tailscale network, and it is available on all plans (source: https://tailscale.com/docs/features/tailscale-funnel, jev weight 0.67). The CLI verb is direct: `tailscale funnel` lets you share a local service over the internet (source: https://tailscale.com/docs/reference/tailscale-cli/funnel, jev weight 0.96). Tailscale's design post describes the goal as making exposing services to the internet safe and simple, noting that since the whole world does not use Tailscale, you need a public path for outsiders (source: https://tailscale.com/blog/introducing-tailscale-funnel, jev weight 0.72).

The practical properties that matter for a debug bridge are the ones homelab guides emphasize: no port forwarding, no domain name purchase, no exposed home IP, and automatic HTTPS (source: https://homelabstarter.com/homelab-tailscale-funnel/, jev weight 0.63). Setup guides describe the same shape: expose a local service to the internet without port forwarding, firewall changes, or public IPs, with HTTPS and automatic TLS handled for you (source: https://mylinux.work/guides/tailscale-funnel-setup/, jev weight 0.24, weak; source: https://oneuptime.com/blog/post/2026-01-28-tailscale-funnel-service-publishing/view, jev weight 0.18, weak).

## Serve vs Funnel

The one-word distinction is load-bearing. Tailscale Serve shares a local service inside your tailnet; Tailscale Funnel puts it on the open internet, reachable by anyone, with the same syntax one word apart (source: https://www.vpnsmith.com/en/blog/tailscale-funnel-vs-serve-2026, jev weight 0.10, weak). Tailscale's own reintroduction post explains the history: Serve was long seen as a magic incantation you had to utter on the way to using Funnel, rather than a feature in its own right (source: https://tailscale.com/blog/reintroducing-serve-funnel, jev weight 0.90). A community-maintained architecture summary describes the pair as commands that expose local services either within the tailnet or to the public internet (source: https://deepwiki.com/tailscale/tailscale/7.4-serve-and-funnel, jev weight 0.27, weak).

For a debug bridge the distinction decides the auth model. If the caller (an agent running in a cloud sandbox) is not itself a tailnet member, Serve is invisible to it. Funnel is the only variant that hands a public HTTPS URL to a caller with no Tailscale identity, which is exactly why the bridge pattern pairs Funnel ingress with its own bearer-token auth layer rather than relying on network identity (see docs 03 and 05).

## TLS and port topology

Funnel terminates TLS at the Tailscale edge and forwards plain HTTP to the local listener on the target machine. In the verified deployment, the topology is: agent issues an HTTPS POST to the Funnel URL, Tailscale's Funnel coordinator terminates TLS and forwards to `localhost` on the target box, where a Python bridge process listens on `127.0.0.1:8080` only (source record, refs/debug-with-cli, 2026-08-01, unweighted). Binding the bridge to localhost is safe precisely because Funnel is the ingress; nothing on the local network needs to reach it directly.

The public hostname in the verified deployment is a standard Tailscale Funnel DNS name of the form `<node>.<tailnet>.ts.net` (source record, unweighted). Tailscale provisions HTTPS certificates for these names automatically, which is part of why the setup cost stays near zero (source: https://tailscale.com/docs/reference/tailscale-cli/funnel, jev weight 0.96).

## Failure signatures

A useful operational property: the failure mode when the origin is down is distinguishable from an auth failure. In the verified deployment, a Cloudflare 530 error in the response means the Funnel has no listening origin behind it (the bridge process is not running or the node is offline), while a 401 means the bearer token was missing or wrong (source record, unweighted). Tailscale's own material stresses that Funnel only forwards to services on the node it is configured on, so an origin that stops listening surfaces as an upstream-unavailable error rather than a silent timeout (source: https://tailscale.com/docs/features/tailscale-funnel, jev weight 0.67).

## Why Funnel for this job

Compared with the alternatives surveyed in doc 06, Funnel is the ingress that requires no new SaaS account, no per-call OIDC dance, no certificate management, and no ports opened on the target network, while still giving a cloud-resident caller a stable public HTTPS endpoint. The trade is that the endpoint is public: anyone who learns the URL can reach the listener, so the listener must authenticate every request itself. That obligation is what doc 03's bearer check exists to discharge.
