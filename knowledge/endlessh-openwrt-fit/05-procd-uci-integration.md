# 05 - procd and UCI integration patterns

Scope: OpenWrt service integration patterns for a third-party daemon: procd init scripts, UCI config packaging, respawn and reload behavior, conffiles.

## The procd init script contract

On OpenWrt, services are managed by procd, and a package ships an init script in /etc/init.d that integrates with it. The documented contract gives an init script 2 main tasks: define the current configuration (state) for the service instances, and specify when the service should be (re)started (source: https://openwrt.org/docs/guide-developer/procd-init-scripts, jev weight 0.9399 and 0.9213).

An init script declares itself a procd script by setting USE_PROCD=1 near the top, alongside the standard START order value. A typical modern package uses USE_PROCD=1 with START=99 so the service starts last, after networking and firewall are up. This is the pattern used by real feed packages; for example the v2raya init script in openwrt/packages uses exactly this shape, loads its UCI config, opens a procd instance, sets the command, respawn parameters, and stdout/stderr forwarding, and registers a reload trigger on its UCI file (pattern reference recorded in the source note: https://github.com/openwrt/packages/blob/master/net/v2raya/files/v2raya.init, upstream file, not jev-scored).

## Instance definition and procd_set_param

The instance is defined with procd_open_instance and configured with procd_set_param. The wiki documents the full table of possible procd_set_param values and their effects, including command, env, respawn, stdout, stderr, and reload trigger settings, with list values passed space separated (source: https://openwrt.org/docs/guide-developer/procd-init-scripts, jev weight 0.9399).

The respawn policy is the supervisor contract: procd restarts a service instance if it exits unexpectedly, with configurable thresholds and delays (weak backing, https://deepwiki.com/openwrt/openwrt/5.1.1-procd-init-scripts-and-service-lifecycle, jev weight 0.3974). Forum documentation of the respawn parameters adds that once the retry threshold is exceeded, no further restart attempts are made unless an explicit restart is performed, and setting retry to 0 causes indefinite restart attempts (weak backing, https://forum.openwrt.org/t/procd-respawn-parameters/63574, jev weight 0.0314). For a tarpit daemon the sensible posture is a modest retry limit: if endlessh crash loops, silent indefinite respawning would hide a real configuration error.

## Reading UCI from the init script

OpenWrt provides standard shell procedures to interface with UCI so init scripts can read their configuration files efficiently (source: https://openwrt.org/docs/guide-developer/config-scripting, jev weight 0.8788). The standard pattern is: config_load the package's UCI file in start_service, then config_get each setting into shell variables before building the procd instance. This is what makes a wrapper package configurable without editing the init script.

The procd wiki's example walk-through covers creating a basic procd init script end to end, including enabling the service and the lifecycle functions the script can implement (source: https://openwrt.org/docs/guide-developer/procd-init-script-example, jev weight 0.9087).

## Triggers and reloads

Procd services can register triggers so that a change to a watched file, typically the package's UCI config, causes a service reload rather than a full restart (weak backing, https://deepwiki.com/openwrt/openwrt/5.1.1-procd-init-scripts-and-service-lifecycle, jev weight 0.3974). In the init script this is done with procd_add_reload_trigger or the reload_service function. For endlessh this composes with its native SIGHUP config reload: the init script's reload path can regenerate the endlessh config from UCI and then send SIGHUP, giving live reconfiguration without dropping tarpitted clients.

## Package file layout

A feed package's Makefile carries the metadata, source hash, dependency list, conffiles declaration, and install rules for /etc/config and /etc/init.d assets (pattern reference recorded in the source note: https://github.com/openwrt/packages/blob/master/net/v2raya/Makefile, upstream file, not jev-scored). A firewall-facing package shows the dependency pattern for nftables/firewall4 integration and conffile handling (pattern reference recorded in the source note: https://github.com/openwrt/packages/blob/master/net/pbr/Makefile, upstream file, not jev-scored).

For an endlessh wrapper, the resulting layout would be:

- /etc/config/<package>: UCI options for the tarpit (port, delay, max clients, log level) plus the wrapper's own options (zone, decoy set, notification target).
- /etc/init.d/<package>: procd script as above, disabled by default.
- /usr/share/<package>/: templates and fixtures, including any nftables include fragments.
- Conffiles declared in the Makefile so operator edits survive upgrades.

## What procd gives the tarpit for free

Using the standard contract means the wrapper package inherits: ordered startup after the network is ready, supervised restart with bounded retries, UCI-driven configuration surfaced in the router UI ecosystem, and reload-on-change. That is the entire lifecycle story a router deception service needs, and none of it exists upstream in endlessh itself.
