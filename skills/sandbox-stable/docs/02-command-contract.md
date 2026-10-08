# 02. The command contract

Scope: the stable command contract. `sandbox.exec(command)` takes a command string and resolves when the command finishes with buffered `stdout`, `stderr`, and `exitCode`. Long-running and streaming work uses the stable `startProcess` and `execStream` APIs, never the `@next` single-handle model.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## exec on stable: string in, buffered result out

The source doc states the contract directly: `await sandbox.exec(command)` takes a command string and resolves when the command finishes, with buffered `stdout`, `stderr`, `exitCode`, and related fields. The stable Commands API page matches that shape and dates it: "This page documents today's stable @cloudflare/sandbox package (exec with string commands and buffered results, plus startProcess / execStream)" (https://developers.cloudflare.com/sandbox/api/commands/, jev weight 0.81). The same page carries the drift warning the source doc enforces: "Sandbox SDK 1.0 (preview on @cloudflare/sandbox@next) makes exec() argv-only and returns a process handle" (https://developers.cloudflare.com/sandbox/api/commands/, jev weight 0.81). That is the exact mechanical difference the source doc forbids porting into stable code: on stable, pass a string and read fields off the resolved result; do not invent `@next` `output()` handles.

## Choosing between exec, execStream, and startProcess

The stable guide splits the three by use case: "exec() - Run a command and wait for complete result. Best for one-time commands like builds, installations, and scripts. execStream() - Stream output in real-time. Best for long-running commands where you need immediate feedback. startProcess() - Start a background process" (https://developers.cloudflare.com/sandbox/guides/execute-commands/, jev weight 0.82). So the stable decision rule is: one-shot work waits on `exec`; live feedback uses `execStream`; anything that must outlive the HTTP request uses `startProcess`.

`execStream` on stable returns a Server-Sent Events stream for real-time processing: `const stream = await sandbox.execStream(command: string, options?: ExecOptions)` (https://developers.cloudflare.com/sandbox/sdk/api/commands/, jev weight 0.81). The streaming guide shows the consumption pattern and the event taxonomy: `switch (event.type) { case "stdout": ... case "stderr": ... }` (https://developers.cloudflare.com/sandbox/guides/streaming-output/, jev weight 0.78). The same guide tells you when to stream and when not to: "Use streaming when you need: [immediate feedback]. Use non-streaming (exec()) for: [commands where the full buffered result is what you want]" (https://developers.cloudflare.com/sandbox/guides/streaming-output/, jev weight 0.78).

## Background processes on stable

Background work on stable is named-process based. The process-workspace example deploys a Worker that starts "named background processes in a Container", then lets you "check their status, read or follow their output, wait for a log line or an exit, and stop them" (https://github.com/cloudflare/sandbox-sdk/tree/main/examples/process-workspace, jev weight 0.79). That is the stable lifecycle shape: the process has an identity the Worker can come back to, rather than a 1.0-style handle returned inline by `exec`.

## The drift line, stated once

The 1.0 preview changes both halves of this contract. Streaming in the preview works "with process handle methods such as logs() after exec(argv)", per the current streaming guide (https://developers.cloudflare.com/sandbox/guides/streaming-output/, jev weight 0.78). The source doc's non-negotiable forbids applying those `@next` argv and `process.output()` APIs while the dependency is still stable. A useful corroborating artifact is the historical docs source itself, which pins the 0.x command API text in the production branch of cloudflare-docs (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/sdk/api/commands.mdx, jev weight 0.69).

## Weak-source caution

Three results in this dig scored below 0.5 and are labeled weak backing: a DeepWiki mirror of executing commands (0.14), a DeepWiki page on managing processes (0.14), and a community announcement thread (0.14) (https://deepwiki.com/cloudflare/sandbox-sdk/3.1-executing-commands, https://deepwiki.com/cloudflare/sandbox-sdk/3.2-managing-processes, https://community.cloudflare.com/t/agents-workers-cloudflare-sandbox-sdk-adds-streaming-code-interpreter-and-filesystem-mounts/...). None of their content is used above. Every load-bearing claim in this doc carries a weight of 0.69 or higher from Cloudflare docs or the official examples repo.
