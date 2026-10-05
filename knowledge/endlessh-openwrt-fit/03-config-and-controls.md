# 03 - Configuration knobs and runtime controls

Scope: endlessh configuration options, CLI flags, runtime signals (SIGHUP, SIGUSR1, SIGTERM), and logging modes.

## Configuration surface

Endlessh takes its settings from 2 places: a config file and command line flags. The documented flag set includes -4 and -6 to force IPv4 or IPv6 only, -d to set the per-line message delay in milliseconds (default 10000), and -f to point at a config file, since the default path is /etc/endlessh/config on non-FreeBSD systems (source: https://www.mankier.com/1/endlessh, jev weight 0.5523; corroborated by https://manpages.ubuntu.com/manpages/focal/man1/endlessh.1.html, jev weight 0.6551).

The config file exposes the same knobs as plain key value lines. A stock config shows the canonical set: Port 2222, Delay 10000, MaxLineLength 32, MaxClients 4096, LogLevel 0, BindFamily 0 (weak backing, from an Ask Ubuntu post quoting a default config at https://askubuntu.com/questions/1471717/tarpit-endlessh-monitors-port-2222-instead-of-port-22, jev weight 0.0438). The primary repository documents these options and their defaults (source: https://github.com/skeeto/endlessh, jev weight 0.8597 and 0.9167).

Key semantics worth noting for packaging:

- Port: the listen port, default 2222, chosen so the real SSH daemon can stay on another port.
- Delay: milliseconds between banner lines; larger values stretch the tarpit and reduce bandwidth.
- MaxLineLength: bound on each generated banner line, bounded range, default 32.
- MaxClients: concurrent client ceiling, default 4096.
- LogLevel: 0 is quiet; higher values add accept/close detail and debug output; syslog output is enabled separately with a flag.
- BindFamily: address family selection, which is the config-file equivalent of the -4/-6 flags.

A third-party reference covering both CLI and config-file options consistently is the DeepWiki configuration page (weak backing, jev weight 0.5250 at https://deepwiki.com/skeeto/endlessh/2.1-configuration-options).

## Runtime controls via signals

Endlessh uses signals as its management interface, which matters for any service supervisor:

- SIGTERM: graceful shutdown, allowing a complete consistent log flush (source: https://github.com/jkeuper/endlessh-docker, jev weight 0.5292).
- SIGHUP: reload the configuration file passed with -f (source: https://github.com/jkeuper/endlessh-docker, jev weight 0.5292).
- SIGUSR1: print connection statistics to the log (source: https://github.com/jkeuper/endlessh-docker, jev weight 0.5292; corroborated by https://deepwiki.com/skeeto/endlessh/3.3-signal-handling, weak backing, jev weight 0.2202).

The primary repository documents the same 3 signals (source: https://github.com/skeeto/endlessh, jev weight 0.9167). These are exactly the hooks a procd-style supervisor needs: TERM for stop, HUP for reload on config change, USR1 for on-demand diagnostics without restarting.

## Logging model

Logging is quiet by default. A verbosity flag turns on useful output, repeated verbosity enables debug logs, and a syslog flag routes output to syslog instead of stdout (source: https://github.com/skeeto/endlessh, jev weight 0.9167). On a system running syslogd, the practical mode for a router is verbose plus syslog, so accept and close events land in the standard log stream and become visible through the router's log reading tooling.

One operational confusion appears repeatedly in support threads: users set Port 22 in the config but observe endlessh listening on 2222, because the default config's Port line ordering or a second instance on the default port wins (weak backing, https://askubuntu.com/questions/1471717/tarpit-endlessh-monitors-port-2222-instead-of-port-22, jev weight 0.0438, and https://www.reddit.com/r/linux4noobs/comments/144qxdk/, jev weight 0.0173). For a packaged service this argues for the init script passing every setting explicitly rather than relying on the config file's defaults.

## Log destination in practice

An upstream issue discusses where logs end up, with the reporter noting endlessh outputs to syslog and mentioning journalctl redirection as a workaround (weak backing, https://github.com/skeeto/endlessh/issues/68, jev weight 0.3358). The takeaway for an OpenWrt package is to be explicit: choose syslog mode, let the router's logd capture it, and document that logread is the expected surface.

## Mapping to a wrapper package

Every knob maps cleanly onto a UCI option set: port, delay, max line length, max clients, log level, and family. The signal set maps onto procd's standard service lifecycle. The main packaging decision is whether the init script generates an endlessh config file from UCI at start, or passes flags directly. Generating the file keeps SIGHUP reload meaningful; passing flags makes behavior deterministic per start. Either way, the upstream surface is small enough that no option is left unmapped.
