# 01 - Tarpit mechanism

Scope: how endlessh works: the endless pre-authentication SSH banner, the single-threaded poll loop, what it logs, and what it never touches.

## The core mechanism

Endlessh is an SSH tarpit that very slowly sends an endless, random SSH banner. It keeps SSH clients locked up for hours or even days at a time. The stated purpose is to put the real SSH server on another port and then let script-driven scanners get stuck in the tarpit instead of reaching a real server (source: https://github.com/skeeto/endlessh, jev weight 0.9608). The same description appears verbatim in the Debian source package copy of the README (source: https://sources.debian.org/src/endlessh/1.1-5/README.md/, jev weight 0.8279) and in the Ubuntu man page (source: https://manpages.ubuntu.com/manpages/resolute/man1/endlessh.1.html, jev weight 0.8121), so the behavior statement is corroborated by 3 independent mirrors of the primary material.

The deception works because every SSH connection begins with a protocol version exchange: the server sends a banner line before any cryptography happens. Endlessh sits exactly at that point. It sends one line, waits, sends another line, and repeats without ever terminating the protocol version exchange (source: https://github.com/skeeto/endlessh, jev weight 0.9608). Because it never proceeds past the banner exchange, it never authenticates a client, never records passwords, and never executes anything. The tarpit is deliberately not a shell: it is a holding pen for the earliest and most boring step of the SSH protocol (source: https://github.com/skeeto/endlessh, jev weight 0.9356, plus https://manpages.ubuntu.com/manpages/focal/man1/endlessh.1.html, jev weight 0.6551).

## Why the protocol point matters

The choice of the pre-authentication point is the whole design. A tarpit that waited until after key exchange would need a full SSH implementation: crypto libraries, key negotiation, and attack surface. Endlessh needs none of that, which is what makes it small enough for constrained devices and safe enough to run with minimal privileges. Third-party packaging confirms this framing: the linuxserver Docker image and similar wrappers treat endlessh as a single static binary with no runtime dependencies (weak backing, jev weight 0.2584 for the guide at https://joshuarosato.com/posts/ssh-honeypot-endlessh-setup-guide/).

An SSH-aware scanner can detect the tarpit, since a real server sends a complete, well-formed banner quickly. But the scanner still has to spend time and connection state to do so, and generic brute-force tooling does not (source: https://github.com/skeeto/endlessh, jev weight 0.9608). The value is attrition of dumb tooling, not deception of a skilled operator.

## Implementation shape

Endlessh is a single standalone C program. The implementation is single threaded and event driven: it waits in a poll loop and services each connected client with a tiny write whenever its per-client delay timer expires (source: https://github.com/skeeto/endlessh, jev weight 0.9608; weak backing for the poll-specific detail from https://deepwiki.com/skeeto/endlessh/6-performance-considerations, jev weight 0.3403). There is no daemonization complexity to manage: the binary reads its config, binds its socket, and loops.

## What it logs and what it never does

When logging is enabled, endlessh records connection lifecycle events: accepts, closes, connection duration, and bytes sent, along with the client source. Quiet is the default, verbose logging is opt in, and syslog is opt in with a flag (source: https://github.com/skeeto/endlessh, jev weight 0.9608; corroborated by https://jkeuper/endlessh-docker documentation at https://github.com/jkeuper/endlessh-docker, jev weight 0.5292).

What it never does is equally important for an edge deployment: it does not authenticate clients, does not capture credentials, does not emulate a shell or any services, and does not generate alerts beyond its own log lines (source: https://github.com/skeeto/endlessh, jev weight 0.9356). Anything built on top, from attribution to notification, has to come from surrounding infrastructure. That division of labor is the defining constraint for integrating it into a router-based deception design.

## What this means for an OpenWrt deployment

The mechanism maps directly onto router constraints. The tarpit holds state per connection but sends almost nothing, so bandwidth cost is bounded by the configured delay and line length. It is a passive listener on one port, so the firewall, not endlessh, decides who can reach it. And because it emits only log lines, every higher-order behavior (who was scanning which decoy, when to notify) must be derived from logging and firewall infrastructure around it, not from endlessh itself.
