# 04: Endlessh SSH tarpit

Scope: Endlessh SSH tarpit behavior, configuration options, resource usage, and deployment modes.

## What Endlessh does

Endlessh is an SSH tarpit that very slowly sends an endless, random SSH banner. It keeps SSH clients locked up for hours or even days at a time; the purpose is to waste an attacker's time and resources rather than to authenticate anyone (https://github.com/skeeto/endlessh, weight 0.91). This is the core primitive the yubiOS proof plan builds on: a decoy SSH endpoint that never completes a protocol handshake and therefore never needs credentials, session code, or shell emulation.

Because the tarpit speaks just enough SSH to emit a banner and then trickles bytes, its attack surface is minimal. No passwords are transmitted to it in a completed protocol exchange, which is why the plan's logging rules can be strict: there is nothing to capture except connection metadata.

## Configuration model

Endlessh uses a simple configuration file in a style similar to OpenSSH's config format (https://numfer.com/skeeto/endlessh, weight 0.74). Key knobs relevant to the proof plan:

1. Listen address and port: the decoy can bind to specific addresses and ports, which the plan maps to `listen_address` and `listen_port` in the UCI config.
2. Banner delay interval: the trickle rate that determines how long a trapped client stays connected.
3. Max clients: a concurrency cap, which the plan maps to `max_clients` so a flood of decoy connections cannot exhaust the router.

A third-party man-page mirror restates the same description and options; it is a convenient reference but secondary (https://www.mankier.com/1/endlessh, weight 0.27, weak backing).

## Deployment modes in practice

The common deployment pattern documented in tutorials is to run Endlessh on the standard SSH port 22 so scanners hit the tarpit first, with the real SSH service moved to a different port; the DigitalOcean tutorial walks through installing and configuring Endlessh and then reconfiguring the SSH service alongside it (https://www.digitalocean.com/community/tutorials/how-to-set-up-an-endlessh-tarpit-on-ubuntu-22-04, weight 0.72). A shorter community writeup describes the same arrangement: the tarpit runs on the standard SSH port and attackers attempting to break through that port get stuck in an endless loop (https://linuxsecurity.com/howtos/learn-tips-and-tricks/how-to-set-up-an-ssh-tarpit-in-ubuntu-server-20-04, weight 0.41, weak backing).

The yubiOS plan deliberately departs from that pattern. Instead of exposing the tarpit on WAN port 22, it binds decoys only inside the WireGuard zone and keeps the real SSH endpoint fully behind the VPN. The upstream tutorials are still useful as evidence that the tarpit coexists with a real sshd on one host without conflict; they are not the exposure model the proof adopts.

## Resource characteristics

Endlessh holds connections open with negligible per-connection cost because it sends bytes at a tiny rate. The project README describes clients being locked up for days, which implies long-lived idle sockets; the resource concern for a router-class device is therefore file descriptors and connection count, not CPU or bandwidth (https://github.com/skeeto/endlessh, weight 0.91). This is why the plan caps `max_clients` and pairs the procd service with memory and fd limits: a deliberate decoy flood should be absorbed and bounded, not allowed to starve routing.

## Forks and variants

A forked variant exists that keeps the same endless-banner tarpit behavior while adding AI-flavored extras; it restates the same core mechanism, trapping malicious SSH clients by sending an endless random banner (https://github.com/Sheep-Ninja/RetroAI-tarpittrapendlessh, weight 0.54). The proof plan should stick to upstream Endlessh behavior for the decoy semantics and treat forks as out of scope.

Third-party guides for setting up Endlessh as a honeypot exist for orientation only; they are blogs, not primary sources, and none of their claims should be cited without primary verification (https://joshuarosato.com/posts/ssh-honeypot-endlessh-setup-guide/, weight 0.22, weak backing; https://danq.me/2025/01/06/endlessh-on-debian-12/, weight 0.27, weak backing). A penetration-testing tool listing site also catalogs the tool (https://www.pentestreports.com/tool/endlessh, weight 0.20, weak backing).

## Proof requirements for the tarpit stage

The tarpit proof passes when:

1. A client connecting to a decoy port receives a banner and stays connected, with the connection alive for at least the configured observation window.
2. No authentication exchange completes; the client never reaches a shell or password prompt.
3. Connection count never exceeds `max_clients`, and excess connections are refused or queued per the configured behavior.
4. Router routing and the real SSH endpoint stay responsive while decoys are saturated.
5. Service logs record only metadata: timestamp, source address and port, decoy address and port, duration, and service action.
