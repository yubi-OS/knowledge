# 08: Limitations and workarounds

Scope: no PTY, no per-call env vars, no pipes or `&&` or glob expansion at the bridge, one bearer per machine; `bash -c` workarounds and ttyd for interactive shells.

## No PTY

The bridge executes `subprocess.run`, which spawns a process with pipes for stdin, stdout, and stderr. It is not a pseudo-terminal, so there are no interactive sessions, no prompts, and no TUI programs (source record, refs/debug-with-cli, 2026-08-01, unweighted). Python's subprocess module exists to spawn processes, connect their input and output pipes, and obtain return codes; it is not a terminal emulator (source: https://docs.python.org/3/library/subprocess.html, jev weight 0.71).

When piping is genuinely not enough, the standard escape is a PTY library: pexpect's ptyprocess launches a subprocess in a pseudo terminal and interacts with both the process and its pty, which is needed for cases like password prompts (source: https://github.com/pexpect/ptyprocess, jev weight 0.88). Python's asyncio layer also distinguishes `create_subprocess_exec` from `create_subprocess_shell` while offering the same non-TTY pipe model (source: https://docs.python.org/3.12/library/asyncio-subprocess.html, jev weight 0.86).

For true interactive needs the recommended companion is a separate tool: ttyd shares a terminal over the web, built on libwebsockets with libuv (source: https://tsl0922.github.io/ttyd/, jev weight 0.85; source: https://github.com/tsl0922/ttyd, jev weight 0.97). Practical writeups describe it as a lightweight tool that lets you access a Linux command line from a browser over WebSockets (source: https://www.tecmint.com/ttyd-share-linux-terminal-over-web/, jev weight 0.27, weak; source: https://computingforgeeks.com/share-linux-terminal-over-web-using-ttyd/, jev weight 0.13, weak). The pattern is: keep the bridge for one-shot probes, run ttyd separately when a human needs to type into the machine, and do not merge the two into one service.

## No per-call environment variables

The bridge's request schema carries `command` and `timeout` and nothing else. There is no env field (source record, unweighted). The workaround is to make the environment assignment part of an explicit shell invocation: `["bash", "-c", "FOO=bar my-cmd"]`. This keeps the bridge surface minimal at the cost of forcing shell semantics onto calls that need env, with the responsibility trade described in doc 04.

## No pipes, chains, or globs

Because the argv array is executed with `shell=False`, no shell runs, so there is no `|`, no `&&`, no `||`, and no glob expansion at the bridge layer (source record, unweighted). This is the direct consequence of the injection guarantee, and the workaround is the same explicit shell form: `["bash", "-c", "dmesg | head -20"]`. The discipline is to reach for the shell form only when the pipeline is the point, and to prefer plain argv for everything else.

A related cost is process fan-out: with no shell, you cannot rely on `xargs`-style batching in one call. Multiple commands are multiple HTTP calls, each with its own JSON envelope. In practice the per-call overhead is small (a curl round trip is fast compared with the 15 to 45 minute CI iteration it replaces, doc 01), so this rarely matters.

## One bearer per machine

The bridge has a single shared secret per target machine. Rotating it requires updating both the target's env file and the agent's connection row (source record, unweighted). Per-user or per-agent tokens would require the bridge to hold a token map, which breaks the 50-line budget and creates a secrets store on the target. The acceptable middle ground is to treat the token as a machine credential, rotate it on the triggers in doc 07, and rely on the fact that each machine's blast radius is one box.

## What the limits buy

Every limitation above traces back to a deliberate shrink of the bridge's responsibility surface. No PTY means no terminal emulation code. No env field means no template expansion. No shell means no metacharacter interpretation. One bearer means no user database. The workarounds (bash -c, ttyd, per-machine tokens) live outside the bridge, where they can be audited independently. When a new requirement appears, the default answer is to solve it in the caller or a companion tool, not to grow the bridge.
