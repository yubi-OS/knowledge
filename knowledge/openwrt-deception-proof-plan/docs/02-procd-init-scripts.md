# 02: procd init scripts

Scope: procd service integration on OpenWrt: USE_PROCD=1 init scripts, procd_set_param command/respawn, UCI config validation, and config triggers.

## What procd provides

procd is OpenWrt's init and daemon management system. The official technical reference describes procd as the component that handles system init and daemon management, and the wiki's procd init scripts guide documents the full set of `procd_set_param()` values and their effects, with list values passed space-separated (https://openwrt.org/docs/techref/procd, weight 0.97; https://openwrt.org/docs/guide-developer/procd-init-scripts, weight 0.96).

An init script opts into procd with `USE_PROCD=1` and then builds a service instance inside `start_service()`. The mechanism is described in generated wiki mirrors as enabling services to be managed by procd using the procd.sh shell functions, including respawning; treat that framing as secondary and verify against the wiki page and real init scripts (https://deepwiki.com/openwrt/openwrt/5.1.1-procd-init-scripts-and-service-lifecycle, weight 0.25, weak backing).

The authoritative worked example is the Dropbear init script in the openwrt tree: it sets `USE_PROCD=1`, validates UCI config, builds `procd_set_param command` to launch the binary, enables `procd_set_param respawn` for crash recovery, and registers config triggers so the service reloads when its UCI section changes (https://github.com/openwrt/openwrt/blob/main/package/network/services/dropbear/files/dropbear.init, verified live on 2026-09-29, weight 0.91). This is exactly the pattern the yubiOS plan requires for `/etc/init.d/yubios-endlessh`.

## The sample init script

The wiki's sample procd init script walks through a complete minimal service: opening a service instance, setting the command, and wiring reload behavior, using a plain shell script as the managed daemon because it is lighter and better suited to a simple testing setup on most OpenWrt devices (https://openwrt.org/docs/guide-developer/procd-init-script-example, weight 0.94). For the Endlessh package this is the template to follow before adding the plan-specific extras.

## Config validation before start

The plan requires the init script to validate UCI fields before starting: `enabled`, `listen_address`, `listen_port`, `wireguard_zone`, `decoy_pool`, `max_clients`, `log_level`, and `notify_command`. The current-era OpenWrt pattern for typed config validation inside a procd init script is `uci_load_validate`, which refuses to treat config values as unchecked strings; that pattern is described in a generated cookbook mirror and should be confirmed against the wiki's procd init scripts page before implementation (https://github.com/openwrt-docs4ai/openwrt-docs4ai.github.io/blob/main/cookbook/chunked-reference/procd-service, weight 0.30, weak backing). Dropbear's init script demonstrates the manual validation style that works on all current releases.

## Respawn and resource caps

`procd_set_param respawn` restarts the service when it exits abnormally. The plan adds a twist: cap memory and file-descriptor usage so a decoy flood cannot starve routing. procd supports resource-related parameters per the set_param table on the wiki (https://openwrt.org/docs/guide-developer/procd-init-scripts, weight 0.96); the exact bounds should be tested in the VM proof rather than guessed. The service lifecycle handling, including respawn behavior, is part of procd's core management function (https://deepwiki.com/openwrt/openwrt/5.1.1-procd-init-scripts-and-service-lifecycle, weight 0.25, weak backing).

## Triggers and reload

Config triggers let the init script restart or reload the service automatically when specific system configuration changes; the trigger and reload mechanism is described for procd services in secondary sources and belongs in the yubios-endlessh.init so UCI edits take effect without a manual restart (https://deepwiki.com/gl-inet/openwrt/6.3-service-triggers-and-reload, weight 0.39, weak backing). A forum report that `procd_add_reload_trigger` only sometimes works on older releases is a reminder to test trigger behavior in the proof VM, not to trust it untested (https://forum.openwrt.org/t/procd-add-reload-trigger-only-sometimes-works/105230, weight 0.03, weak backing).

## Proof requirements for the service stage

The service proof passes when:

1. `/etc/init.d/yubios-endlessh start` brings the decoy up under procd and `procd_set_param command` points at `/usr/sbin/yubios-endlessh`.
2. Killing the process demonstrates respawn within the configured threshold.
3. Invalid UCI values (an out-of-range `listen_port`, an empty `wireguard_zone`) block startup with a logged error instead of starting in an unsafe default state.
4. Changing the UCI config triggers a reload and the new listen address is actually bound.
5. Resource caps hold under a decoy flood: routing and SSH remain responsive while the decoy is saturated.

Build system context: OpenWrt's development environment and build system, known together as OpenWrt Buildroot, are based on a heavily modified Buildroot system; this is background for where the init script files get packaged, not a claim source for procd behavior (https://en.wikipedia.org/wiki/OpenWrt, weight 0.61). The wiki's dedicated procd techref page remains the canonical reference for daemon management details (https://openwrt.org/docs/techref/procd, weight 0.97).
