# 09: The live probe workflow

Scope: the debug pattern itself: seconds-scale probes (`bcvk --version`, `uname`, `ip a`), interface state like `virbr0`/`docker0` DOWN as debug signal, versus 15 to 45 minute CI round trips.

## The probe cadence

The workflow this corpus documents replaces the CI round trip (doc 01) with a probe loop: form a hypothesis, run one command against the live machine, read stdout and the return code, refine. Each probe is a single HTTPS POST returning a uniform JSON envelope (docs 03 and 05). The verified deployment measured the contrast directly: a `bcvk --version` probe returned `{"stdout": "bcvk 0.5.2\n", "stderr": "", "returncode": 0}` in about 20 seconds end to end, where the equivalent CI discovery step cost 15 to 45 minutes (source record, refs/debug-with-cli, 2026-08-01, unweighted).

An identity probe confirmed the machine itself: `uname -a -m` returned `Linux rock1 7.0.0-28-generic ... aarch64 GNU/Linux`, confirming an ARM64 single-board computer (source record, unweighted). This is the smallest useful probe class: establish what machine you are actually talking to before debugging it.

## Probe vocabulary

A practical probe vocabulary falls into four groups:

1. Identity: `uname -a -m`, `cat /etc/os-release`. Establishes kernel and architecture.
2. Toolchain: `bcvk --version` and similar version checks for every tool the CI path depends on. Version skew between the dev box and the runner is a common silent failure source.
3. Network state: `ip a` and interface-specific checks. In the verified deployment, `ip a` showed `end0` (a USB-attached Ethernet interface at `192.168.6.100/24`), `tailscale0` UP at `100.100.90.103/32`, and, usefully, `virbr0` DOWN and `docker0` DOWN (source record, unweighted).
4. Service state: `systemctl status`, `journalctl -u <name>` tails, file existence checks. For the bridge itself, `systemctl` or `pgrep` on the bridge process answers the 530 drill of doc 07.

None of these probes mutate state. The workflow stays read-only as long as probes are read-only, which keeps hypothesis testing safe even on a machine holding secrets.

## Machine state as debug signal

The most underused probe output is negative state. In the verified deployment, `virbr0` and `docker0` both sitting DOWN was itself a useful signal for tracking partial CI run cleanup: bridges and containers that should have been torn down after a failed VM lane run show up as DOWN interfaces, and interfaces that should exist but do not show up as missing (source record, unweighted). This is the kind of fact that CI logs almost never contain, because the teardown happens outside the logged job.

## Related live access tooling

The live access pattern is not unique to this corpus; the ecosystem around GitHub Actions has grown several tools for it. Marketplace actions enable direct SSH interaction with the host running your workflow, using upterm for real-time sessions (source: https://github.com/marketplace/actions/debug-with-ssh, jev weight 0.42, weak). Another action prepares the runner for SSH access, downloads ngrok, starts a TCP tunnel to port 22, and prints the SSH command in the workflow logs, with the workflow waiting until the session closes (source: https://github.com/luchihoratiu/debug-via-ssh, jev weight 0.30, weak). A commercial writeup describes the general pattern as tools that open interactive SSH sessions directly on the runner (source: https://info.blacksmith.sh/task/blog/debug-failing-github-actions-job-live-runner-access, jev weight 0.49, weak).

These tools solve the same latency problem from inside the CI run. The bridge pattern differs in one structural way: it exists between runs and outside the workflow graph, so the agent can probe the machine without dispatching anything, and the machine is a persistent target rather than an ephemeral runner. GitHub documents self-hosted runners as machines you host yourself with customizable environments (source: https://docs.github.com/en/actions/concepts/runners/self-hosted-runners, jev weight 0.89), with dedicated monitoring and troubleshooting docs (source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/monitor-and-troubleshoot, jev weight 0.66); a persistent SBC used as both CI runner and probe target fits that model.

For embedded targets the same instinct shows up as probe tooling: probe-rs is a debugging toolset and library with a suite of tools for flashing and debugging (source: https://github.com/probe-rs/probe-rs, jev weight 0.52), and an MCP server exposes embedded debugging through probe-rs or OpenOCD's GDB Remote Serial Protocol to AI agents (source: https://github.com/Adancurusul/embedded-debugger-mcp, jev weight 0.46). The convergence is clear across the ecosystem: agents debug best with direct, low-latency access to the machine, whatever the transport.

## When to still use CI

The bridge does not replace CI. CI owns regression verification: reproducible, logged, gating merges. The bridge owns hypothesis testing: cheap, stateful, ungated. A healthy loop uses both; a debugging session that finds itself re-dispatching CI to answer a one-line question should reach for a probe instead, and a change that passes its probes should still land through CI. The source record's arithmetic makes the case: for a 7-day hunt with about 30 round trips, seconds-scale probes recovered most of the wasted wall clock while CI continued to do the final verification (source record, unweighted).
