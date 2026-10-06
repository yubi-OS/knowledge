# 03 The one-time target box setup

Scope: installing Tailscale, opening a Funnel, deploying the bridge script, minting and storing the Bearer token, starting the server, and smoke testing it locally. Grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md), with the Funnel mechanism grounded in Tailscale's own documentation.

## What Funnel is

Tailscale Funnel routes traffic from the broader internet to a local service running on a device in the user's tailnet (Tailscale Funnel docs, https://tailscale.com/docs/features/tailscale-funnel, weight 0.65). That is the exact property the skill needs: the target box has no public IP, but the Funnel edge does, and the sandbox can reach public HTTPS. Tailscale's open-source implementation (the `tailscaled` daemon) is what runs on the target (github.com/tailscale/tailscale, weight 0.70).

## The 6 steps, in order (source doc)

1. Install Tailscale: `curl -fsSL https://tailscale.com/install.sh | sh`. Authenticate headlessly with a non-ephemeral reusable auth key from https://login.tailscale.com/admin/settings/keys. The source doc's reason: non-ephemeral keeps the node identity stable across reboots, and the Funnel URL is tied to the node name. Ephemeral nodes would rotate the URL every session. Tailscale's own docs back the related point that reusable auth keys are the right tool when node keys should not be baked into images (https://tailscale.com/docs/features/ephemeral-nodes, weak, weight 0.23).
2. Pick a port (8080 is canonical per the source doc) and expose it: `tailscale funnel --bg 8080`. Confirm with `tailscale funnel status`. The public URL is `https://<node-name>.<tailnet-name>.ts.net` (source doc).
3. Copy the bridge script to `/usr/local/bin/rock1-shell-server.py` on the target and `chmod +x`. Stdlib only, no pip install (source doc; script analyzed in doc 05).
4. Mint the token: `openssl rand -hex 32`, which is 256 bits of entropy (source doc). Store it in `/etc/rock1-shell.env` as `ROCK1_SHELL_TOKEN=<hex>` so the nohup wrapper picks it up across restarts. Mode 600, never committed to git (source doc).
5. Run it: `set -a; . /etc/rock1-shell.env; set +a; nohup python3 /usr/local/bin/rock1-shell-server.py >> /var/log/rock1-shell.log 2>&1 &` (source doc).
6. Smoke test locally: `curl -sS http://127.0.0.1:8080/run -X POST -H "Authorization: Bearer $ROCK1_SHELL_TOKEN" -H "Content-Type: application/json" -d '{"command":["echo","local test"]}'` must print `{"returncode":0,"stdout":"local test\n",...}`, and the same call without the Bearer header must return HTTP 401 (source doc).

## Why the local smoke test comes before Funnel

The source doc's anti-pattern list makes the ordering rule explicit: a Funnel'd bridge that fails `curl http://127.0.0.1:8080/run` locally will fail through Funnel too, so debug the local case first. The ~2 minute estimate in the source doc covers the whole sequence (source doc).

## Compatibility preconditions

The frontmatter states the target needs Python 3.8+ stdlib and Tailscale installed with `tailscale funnel` enabled on that node; the Sauna side needs an HTTP-out connection row (source doc). Because the bridge binds 127.0.0.1 only (doc 08), the Funnel forward is the only ingress; the source doc also warns not to Funnel-forward to a non-localhost port that already hosts other services (source doc).
