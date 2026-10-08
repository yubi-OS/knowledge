# 06 - Token and config locations

Scope: where the bridge's tokens, rollout scripts, and unit files live on both boxes. Internal-record subtopic, no dig: everything here comes from the source doc.

## The one filename to remember

`/etc/rock1-shell.env` holds the bridge environment including `ROCK1_SHELL_TOKEN`, and the SAME filename is used on both boxes (source doc). That symmetry is a feature: any diagnostic script that greps the env file works unchanged on ubuntu and rock1. The historical rock1-only name did not survive the fleet growing; the filename did.

## Path inventory

| Path | Box | What it is | Status notes |
|---|---|---|---|
| `/etc/rock1-shell.env` | both | bridge env, `ROCK1_SHELL_TOKEN` | canonical token source (source doc) |
| `/home/ubuntu/bear` | ubuntu | shared-token copy | was world-readable 0644 as of 2026-09-24; hardening card targets 0600 (source doc) |
| `/home/ubuntu/shell-bridge-bootstrap.sh` | ubuntu | rollout script | header: "run as root on EACH tailnet device (rock1, ubuntu)" (source doc) |
| `/home/ubuntu/actions-runner/` | ubuntu | GitHub Actions runner tree | sidecar token files like `snn` get rm'd but can leak into `.bash_history` (source doc) |
| `shell-bridge.service` | ubuntu | systemd unit | Description "Bearer-auth shell bridge (Sauna debug-with-cli)" (source doc) |
| `rock1-shell` | rock1 | systemd unit (historical name) | was the unit name on rock1 (source doc) |

## ubuntu-specific layout

The bridge runs as root, so `~` is `/root` on ubuntu; the rollout files deliberately live in `/home/ubuntu` instead (source doc). A script that assumes `~` points at the rollout directory silently operates on the wrong tree; use absolute `/home/ubuntu` paths.

The bootstrap script's header doubles as documentation of the intended deployment topology: one bridge per tailnet device, same script everywhere (source doc). Any third box joining the fleet should be brought up the same way.

## rock1 specifics

rock1 keeps `/etc/rock1-shell.env` as well (source doc). Its systemd unit was named `rock1-shell` (source doc); after the 2026-09-24 restoration the restart procedure references `shell-bridge` (source doc, zombie saga fix). When restarting rock1, check which unit name is actually installed before assuming either name.

## Operational rules that fall out of this map

1. Token rotation touches `/etc/rock1-shell.env` plus the Sauna connection row, on BOTH boxes. Partial rotation is the recipe for a 401 saga (doc 04).
2. Never print a token; extract it into a shell variable and let curl consume it (source doc, direct-token test).
3. Assume root's home is not where the files are on ubuntu; use absolute `/home/ubuntu` paths.
4. Treat sidecar token files in the runner tree as leak risks, not conveniences (doc 08).
5. When a restart command names a unit that does not exist, enumerate first (`systemctl list-units | grep -i shell`) rather than retrying the same name.

## Why the location map matters for diagnosis

Every diagnostic in doc 04 eventually lands here: a direct-token test needs a token source (the env file), a restart needs the right unit name, and a 401 that survives a row re-creation means the box-side files and the running process hold the truth. Knowing which of two near-identical boxes owns which path is the difference between a 1 command fix and an hour of grep archaeology.
