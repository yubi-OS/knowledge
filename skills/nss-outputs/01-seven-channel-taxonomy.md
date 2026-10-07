# The seven-channel output taxonomy and the per-output record

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** what "the output of a file" means in the NSS Outputs axis: the seven channels a caller can rely on, and the per-output record that declares each one.

## Scope

The Outputs axis (3/12 in negative-skill-space) asks what a caller can rely on when a file, script, skill, container, workflow, unit, or API operation finishes, logs, streams, retries, or rebuilds its result. The source doc separates five things that are often accidentally mixed: process status, human-readable diagnostics, machine-readable records, delivery and retry behavior, and byte-level reproducibility. This doc explains the taxonomy itself; the companion docs (02 through 09) cover the per-file-type patterns, the failure contracts, and the verification checklist.

## The seven channels

The source doc fixes the channel vocabulary verbatim: exit, stdout, stderr, log, file, side-effect, response. Every output value must arrive through exactly one of these seven channels.

| Channel | What it carries |
|---|---|
| exit | process exit code, sysexits.h category, partial-output policy |
| stdout / stderr | declared stream ownership, structured vs unstructured, record framing |
| log | JSONL, RFC 5424 syslog, or slog-style records with severity, ts, run_id |
| file | output paths, modes, owners, survival across partial failure |
| side-effect | network calls, mutations, resource use, idempotency boundary |
| response | HTTP body schema, status codes, headers such as Idempotency-Key and Retry-After |
| determinism | seeded RNG, sorted ordering, SOURCE_DATE_EPOCH, canonical bytes, content hash |

(source doc)

A rule the source doc states directly: an output whose channel you cannot name is an *implicit* output, and implicit outputs are the single most common source of "I forgot to read X" failures (source doc, guideline 1). An `## Outputs` section that says "the script writes X" without saying whether X lands on stdout, stderr, an exit code, a file, or a side effect is *worse* than no section at all, because it pretends to be a declaration (source doc, anti-patterns).

## The per-output record

For each output, the source doc requires a fixed set of fields: `name` (canonical key plus aliases), `channel` (one of the seven), `type` (scalar, object, array, stream, file, or side-effect), `on_success` (declared payload shape, record count, exit code), `on_failure` (declared exit code plus partial-output policy of forbidden, valid_and_marked, or resumable), `idempotency` (inherently_idempotent, key_required, or not_supported), `determinism` (logical, byte_identical, or reproducible_build), `schema` (URL plus dialect plus version when applicable), `retry` (retryable failure class, backoff, duplicate-response behavior), and `redaction` (secrets and sensitive values removed by default) (source doc).

The retry field matters because retry behavior is part of the contract, not an implementation detail. The idempotency and determinism fields exist because both claims are hand-waving without a declared boundary and procedure; docs 06, 07, and 09 of this corpus carry the detail on each.

## Raw result, declared schema, and effective contract are three different things

The source doc makes this distinction explicit: the raw result is what the code happens to produce, the declared schema is what the author says it produces, and the effective contract is what a consumer can actually rely on. A good pipeline is `execute -> record -> emit declared payload on declared stream -> declare exit code -> declare partial-output policy` (source doc). Never fold the seven channels together; never emit partial results on a "success" exit (source doc).

External corroboration of the framing is available but weak by jev weight. A contract-first CLI repository models stdout, stderr, and generated files "contracted per exit code with format and JSON Schema", with stdin/stdout/stderr streaming framed by item schemas and flush policies (https://github.com/foo-log-inc/cli-contracts, weight 0.39, weak backing). An issue thread on the aptu-coder repository documents deduplicating an execution response so structuredContent no longer embeds stdout/stderr and schema-conformance tests reference the documented ShellOutput contract (https://github.com/clouatre-labs/aptu-coder/issues/1633, weight 0.44, weak backing). Both are examples of teams converging on the same separation the source doc mandates; neither is an official standard.

## Schema is for consumers, not authors

Guideline 5 of the source doc: a JSON Schema, OpenAPI, or AsyncAPI document that pins dialect, version, and examples turns an output from "trust me" to "validated". Pin the dialect, declare the compatibility policy, and validate in CI (source doc). The outputs contract should be written before the producer is implemented: guideline 12 requires pre-registering the output surface (description, type, framing, idempotency, determinism), then implementing the producer. Schema-first (source doc).

## Constraints that bound the taxonomy

The source doc sets hard constraints on how the taxonomy is used:

- Channel names are fixed. A value that arrives via a novel channel needs a new skill, not a new channel name invented inside a file's Outputs section (source doc).
- One section per file. Do not stack multiple `## Outputs` blocks, and do not nest Outputs inside another section heading (source doc).
- The section is read by humans first, before any parser. Clarity beats strict YAML (source doc).
- The skill is self-contained documentation-only: it does not emit log records or write files, and it composes with `negative-skill-space` as the closure skill for the outputs axis rather than depending on it at runtime (source doc).

## Why the taxonomy is load-bearing

Every downstream guarantee a consumer gets (retry safety, resume, auditability, diffability) reduces to a declaration in one of these seven channels. When the declaration is missing, the consumer reconstructs it by observation, and observation lies under failure conditions: a half-written file, a log line split across a stream boundary, a retry that double-charges. Declaring the channel, the on_success and on_failure shapes, the idempotency class, the determinism class, and the redaction policy per output is the single highest-leverage move for closing an NSS-outputs Extend gap (source doc).
