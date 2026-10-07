# Structured log records: JSONL framing, RFC 5424, severity, redaction

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** the log channel: records rather than prose, the two record formats the skill references (JSON Lines and RFC 5424 syslog), severity and run_id fields, and redaction.

## Scope

The log channel carries machine-consumable event records. The source doc's rule is "Logs are records, not prose" (source doc, guideline 4): JSONL framing, one JSON value per line, stable field names, RFC 3339 UTC timestamps, and an explicit severity mapping. Never pretty-print logs across multiple lines and never interpolate secrets into a message (source doc, guideline 4).

## JSONL framing

JSON Lines is newline-delimited JSON: "a convenient format for storing structured data that may be processed one record at a time" (https://jsonlines.org/, weight 0.10, weak backing). Two properties matter for the log channel. First, each line is a complete, independently parseable JSON value, which is what lets `jq`, `grep`, and streaming consumers process a log without a parser state machine. Second, the source doc's anti-patterns section calls out what breaks: "Pretty-printed logs are invalid JSONL; one JSON value per line, with \n escaped inside strings, is the only framing that survives jq, grep, and streaming consumers" (source doc). The last line of a JSONL stream may or may not carry a trailing newline; both variants are accepted by the format's conventions (https://jsonic.io/guides/jsonl-format, weight 0.09, weak backing).

The underlying data format is JSON itself, "a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate" (https://www.json.org/json-en.html, weight 0.08, weak backing). The JSONL choice is a framing decision on top of it, optimized for append-only logs and streaming rather than one-document files.

## RFC 5424 syslog

The second record format the source doc names is RFC 5424, the Syslog Protocol: "This document describes the syslog protocol, which is used to convey event notification messages. This protocol utilizes a layered architecture, which allows the use of any number of transport mechanisms for transmission of network security, event, log, or audit messages" (https://www.rfc-editor.org/info/rfc5424/, weight 0.23, weak backing; the IETF Datatracker carries the same document at https://datatracker.ietf.org/doc/html/rfc5424, weight 0.18, weak backing).

RFC 5424 matters to the Outputs axis because it defines a stable severity vocabulary. The severity levels from RFC 5424 (0 Emergency through 7 Debug) are even formalized as an ontology by the NPG Severity Levels Ontology, which models "the syslog message severity values from RFC 5424" (http://bartoc.org/en/node/18598, weight 0.03, weak backing). The source doc requires the producer to map severities explicitly; the Python example pins its own vocabulary to {"DEBUG","INFO","WARN","ERROR","CRITICAL"} on stderr (source doc, example 2). Either vocabulary works; what guideline 4 requires is that the mapping is declared, not observed.

## Field names, timestamps, and run_id

Guideline 4 fixes three properties of a log record: stable field names, RFC 3339 UTC timestamps, and an explicit severity field (source doc). The channel table adds `run_id` to the log row: "severity, ts, run_id" (source doc). A run_id is the correlation key that groups all records of one invocation, which is what makes retry and partial-failure forensics possible across consumers. The source doc's observability composition entry confirms the direction: "The log record schema (JSONL + severity + run_id) is the output-layer primitive the observability skill consumes" (source doc, Composition table).

## Redaction

The redaction field in the per-output record is "secrets and sensitive values removed by default" (source doc, field table). The anti-patterns section escalates it to an audit concern: "A log message like `auth failed with token=eyJ...` is a secret-leak audit finding. Use a `redaction: secrets_and_sensitive_values_removed` declaration and a redaction library at the producer" (source doc). The red flag table reinforces it: "A log message contains a secret value" means the redaction policy is missing or violated (source doc).

Two design points follow. First, redaction happens at the producer, before framing, so every downstream consumer of the stream inherits the redaction. Second, the declaration is per-output: a file channel may legitimately carry values that the log channel must not, and each output's `redaction` field states its own policy.

## Where logs live in the yubiOS surfaces

The systemd surface shows the log channel interacting with stream ownership: `StandardOutput=journal` means "log records via journald, NOT to disk" (source doc, example 3), and the scripts surface states the yubiOS convention for units that do write files: mode 0640, systemd-tmpfiles rotation, never world-readable logs (source doc, systemd surface). The shell example routes log records to stderr, "one per event", while stdout stays payload-free (source doc, example 1). Both arrangements are legal; both are declarations, which is the point.

## Minimum declaration for the log channel

1. Framing: JSONL (one value per line) or RFC 5424, named explicitly.
2. Field names: stable, including severity, ts (RFC 3339 UTC), and run_id.
3. Severity vocabulary and its mapping.
4. Sink: stderr, journald via StandardOutput=journal, or a declared file with mode and rotation.
5. Redaction policy: `secrets_and_sensitive_values_removed` by default, with the producer-side mechanism named.

A log channel that cannot answer those five questions is prose masquerading as records, and the next consumer will pay for it.
