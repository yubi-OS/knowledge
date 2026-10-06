# 08 The security model

Scope: the 7 properties that make the bridge acceptable on hardware-attached machines, and the dig evidence behind each. Grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md) plus the crypto and Python documentation digs.

## Token entropy

The token is 32 bytes from `openssl rand -hex 32`, which the source doc calls 256 bits of entropy, uncrackable by brute force (source doc). The OpenSSL documentation backs the generator: `openssl rand` produces random bytes from the RAND_bytes CSPRNG, described as providing a security level of 256 bits (https://docs.openssl.org/master/man1/openssl-rand/, weak, weight 0.18). The anti-pattern list sets the floor explicitly: anything shorter than 128 bits is brute-forceable in practice; the source doc's token is 64 hex characters (source doc).

## Transport

HTTPS via Tailscale Funnel. Cloudflare terminates TLS at the Funnel edge; Tailscale's coordinator forwards to the target's localhost; no TLS termination at the bridge (source doc). The Funnel mechanism itself, routing internet traffic to a local tailnet service, is documented by Tailscale (https://tailscale.com/docs/features/tailscale-funnel, weight 0.65).

## Listen address

The bridge binds `127.0.0.1:8080`, never `0.0.0.0`. The Funnel edge is the only ingress (source doc). The failure mode this prevents is an anti-pattern of its own: a bridge listening on all interfaces is probe-able by anything on the target's LAN without going through Funnel's TLS (source doc).

## Token storage

The token lives in `/etc/rock1-shell.env` on the target, mode 600. Not in the Sauna chat, not in a session file, not committed to git (source doc). The loading constraints add the rotation cadence: rotate when the Sauna connection is dropped, when the target's Tailscale node is removed or re-added, or when any team member with access to the box changes; rotation is a new `openssl rand -hex 32`, an env-file update, a bridge restart, and a Sauna connection form update (source doc).

## Argv-only execution

`subprocess.run(command, shell=False)` is enforced by the bridge code. Even `command=["bash"]` is argv to bash, not `bash -c "$string"` (source doc). This is the injection boundary; doc 06 covers its costs.

## Constant-time token comparison

The Bearer check uses `hmac.compare_digest` (source doc). The Python hmac documentation documents `compare_digest` as the constant-time comparison intended for this purpose (https://docs.python.org/3/library/hmac.html, weak, weight 0.16). A community security writeup explains why: comparison timing must not depend on the compared bytes' content or length, the constant-time property that defeats timing side channels on secret comparisons (https://sqreen.github.io/DevelopersSecurityBestPractices/timing-attack/python, weak, weight 0.11). A second reference covers the same pitfall for digest and API-key comparisons (https://runebook.dev/en/docs/python/library/hmac/hmac.compare_digest, weak, weight 0.16). All comparison references weighted below 0.5; the "constant-time, no timing leak" characterization is the source doc's.

## Audit posture

Enable journald to capture the bridge process's stderr; the bridge does no request logging by default, and the source doc says to add it only if the threat model demands it (source doc). Command stdout and stderr are already captured and returned in the response body, which is the primary audit artifact (source doc).

## Why the bar is this high

The alternatives section (doc 09) shows what this model is protecting: hardware-attached CI runners with a real YubiKey and destructive `/dev/sda` tests. The source doc rejects any approach without inbound request authentication on exactly that ground (source doc).
