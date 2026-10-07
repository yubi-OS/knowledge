# 01: The seven-channel input taxonomy

Scope: the seven fixed input channels every file's Inputs declaration must use, why the names are verbatim, and why implicit inputs are the leading cause of "I forgot to set X" failures.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` (the NSS Inputs axis skill, version 1.0.0, 2026-08-12). Dig material: none used; this is an internal-record subtopic, no dig.

## The seven channels

The source doc fixes exactly seven channels a value can arrive through:

| Channel | Examples from the source doc |
|---|---|
| CLI | positional args, named flags (`--foo`, `--bar=VAL`), subcommands |
| Environment | OS env vars (`FOO`, `FOO__BAR` for nested), exported function returns |
| Config file | YAML/JSON/TOML/INI keys, schema-versioned, hot- or cold-reload |
| Files / mounts | paths the file reads, paths it requires to exist, paths injected via tmpfs/bind-mounts/secrets |
| Stdin / pipes | newline-delimited records, JSON lines, env-var stdin protocols |
| Request surface | HTTP path/query/header/cookie/body; gRPC metadata; GraphQL variables; DB row/column |
| Platform / runtime | kernel features, capabilities, namespaces, cgroups, CPU arch, GPU presence, TPM availability |

The list is exhaustive by design. The source doc's constraint is explicit: "Channel names are fixed. CLI / env / config / file / stdin / request / platform. A value that arrives via a novel channel needs a new skill, not a new channel name." An author must not invent an eighth channel name in a file's Inputs section.

## Why verbatim naming matters

Guideline 1 of the source doc states the failure mode directly: if you cannot say whether a value arrives via CLI, env, config file, mount, stdin, request surface, or platform, the input is implicit. Implicit inputs are, per the source doc, "the single most common source of 'I forgot to set X' failures." The verbatim taxonomy exists so that every input has a channel, and so that two different authors auditing the same file classify the same value the same way. A red flag in the source doc reinforces this: an Inputs section that says "the script reads X" without naming the channel is *worse* than no Inputs section, because it pretends to be a declaration while leaving the invocation unrecoverable.

## What the taxonomy is for

The source doc frames the Inputs axis (2/12 of negative-skill-space) as asking "what does this file or skill need to run?" A file without an Inputs declaration is one whose invocation is recoverable only by reading its implementation; a file with one is discoverable. The channel table is the backbone of that declaration: the per-input record fields (doc 02) hang off it, the precedence rules (doc 03) arbitrate between its channels, and the per-toolkit mappings (docs 04 through 08) show how Docker, mkosi, systemd, GitHub Actions, and Python argparse each populate it.

## Composition with NSS

The source doc's composition table makes the direction explicit: `negative-skill-space` runs the 12-axis sweep and flags `inputs` as a candidate Extend gap; nss-inputs is the closure skill for that one axis. The two are paired in every cycle. The skill is self-contained: it does not depend on negative-skill-space being loaded, and NSS proposes the gap while nss-inputs closes it.

## How the seven channels interact with precedence

Because the same key can arrive through more than one channel, the taxonomy alone is not enough; the source doc requires precedence to be stated whenever two channels can supply the same input. The yubiOS canonical order is CLI > env > config file > built-in default, with documented deviations for mkosi (CLI > config > mkosi default) and GitHub Actions (workflow_dispatch input > workflow_call default > workflow default). Doc 03 covers the arbitration pipeline; doc 09 covers what happens in audit when the precedence rule is missing (the "cross-channel collision" red flag).

## Boundary: what is not an input

The source doc draws one boundary that auditors repeat frequently: runtime-surface configuration is not an input. For systemd units, `WorkingDirectory=`, `User=`, `ExecStart=`, `CapabilityBoundingSet=`, `ReadOnlyPaths=`, and `ProtectSystem=` are not inputs in the NSS-Inputs sense; they configure the runtime surface and are recorded next to Inputs, separately (doc 06). For a Containerfile, `LABEL` is image metadata, not an application input contract. Keeping that boundary is what lets the seven-channel table stay short enough to be readable at a glance.
