# stdout and stderr stream ownership

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** the stdout and stderr channels: who owns which stream, what the default ownership rule is, and what breaks when the streams are mixed.

## Scope

Stream ownership is the declaration of which stream carries the declared result and which carries diagnostics. The source doc states the default rule plainly: "stdout = declared result; stderr = human diagnostics/logs" (source doc, guideline 3). Two prohibitions follow: never mix payload and diagnostics on stdout when stdout is machine-consumed, and never emit log records on stdout when stderr is the conventional log sink (source doc, guideline 3).

## Why separation is not pedantry

The standard streams are the oldest stable contract in Unix, and their semantics are well documented. The Microsoft C runtime reference describes stdin, stdout, and stderr as "the standard streams for input, output, and error output" (https://learn.microsoft.com/en-us/cpp/c-runtime-library/stdin-stdout-stderr?view=msvc-170, weight 0.42, weak backing). Wikipedia's standard streams article traces the design back to Ken Thompson, who modified sort in Version 5 Unix so it would not consume input files it had already written records to (https://en.wikipedia.org/wiki/Standard_streams, weight 0.20, weak backing).

The cost of mixing shows up in redirection semantics. A consumer that runs `cmd >file 2>&1` expects the file to contain the machine-consumable result and nothing else. A script that "emits the result on stderr and the diagnostics on stdout is unusable from `cmd >file 2>&1`; every consumer has to inspect both streams and guess" (source doc, anti-patterns). The Command Line Interface Guidelines, an open-source guide to writing better command-line programs from traditional Unix principles, encode the same discipline (https://clig.dev/?trk=public_post-text, weight 0.34, weak backing).

## Declaring ownership in an Outputs section

The source doc's shell example declares stream ownership as two lines inside the Outputs header (source doc, example 1):

- `stdout: human summary only (when --quiet is not set); NEVER payload`
- `stderr: human diagnostics + log records (one per event)`

Note the shape of that declaration: it names the condition under which stdout emits at all, and it promises the payload is never there. The Python example uses the mirrored arrangement for a machine-consumed result: stdout carries "result summary ONLY when --quiet is absent", and stderr carries "structured JSONL logs (one per event)" with an explicit severity vocabulary (source doc, example 2). Both are valid; what matters is that the ownership is stated, not which stream holds which content.

The verification checklist makes stated ownership a gate: "stdout/stderr ownership is stated. 'stdout = result; stderr = logs' is the default; deviations are documented" (source doc, verification item 4).

## Structured vs unstructured framing on each stream

Ownership and framing are separate declarations. A stream can carry human text or machine records, and the Outputs section must say which. The source doc pairs its stream ownership with record framing: in the Python example, stderr carries one JSON value per line with severity in a fixed set (DEBUG, INFO, WARN, ERROR, CRITICAL) (source doc, example 2). The log-channel field table lists "structured vs unstructured; record framing" as part of the stdout/stderr row of the channel table (source doc). Framing details, JSONL and RFC 5424, are covered in doc 05 of this corpus.

## Interactive vs non-interactive

A practical corollary the source doc encodes through its `--quiet` convention: a tool's stdout contract may differ between a human at a terminal and a machine in a pipeline. The declaration handles this by naming the condition ("only when --quiet is not set") rather than leaving the behavior to observation. The Linuxize reference on the standard streams describes the default wiring, file descriptors 0, 1, and 2, connecting commands to terminals, files, and pipes (https://linuxize.com/post/what-is-stdin-stdout-and-stderr-in-linux/, weight 0.19, weak backing), which is the environment in which that conditional behavior must hold.

## Red flags on the stream channels

From the source doc (anti-patterns and red flags):

- Mixed stdout/stderr: result on stderr, diagnostics on stdout.
- Log records emitted on stdout when stderr is the conventional log sink.
- An Outputs section that does not state which stream carries the result.

## Minimum declaration

1. Which stream carries the declared result, and under what flag conditions it emits.
2. Which stream carries diagnostics and log records, and in what framing.
3. Any deviation from the "stdout = result; stderr = logs" default, with the reason.
4. Whether the result stream is machine-consumed, human-consumed, or both, with the framing for each.

With those four lines, `cmd >file` and `cmd 2>err.log` become contracts instead of experiments.
