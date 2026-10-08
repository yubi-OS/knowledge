# 05 Secrets and PII in Telemetry

Scope: never log secrets, tokens, passwords, or full PII; allowlist the fields you log rather than blocklisting what you remember to exclude; treat telemetry pipelines as a data-leak path.

## The hard rule

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md) states it as a hard rule imported from the security-and-hardening skill: "Never log secrets, tokens, passwords, or full PII. This is a hard rule from the security-and-hardening skill - telemetry pipelines are a classic data-leak path. Allowlist fields; don't log whole request bodies" (source doc). Two design choices are packed in there: allowlist over blocklist, and never capture whole request bodies (which guarantees leakage the first time a payload contains a credential).

The red-flag list puts "Secrets, tokens, or full request bodies appearing in logs" at the same severity level as cardinality bombs and orphan log lines (source doc), and the verification checklist requires a spot-check of actual output: "No secrets, tokens, or unredacted PII in any log line (spot-check actual output)" (source doc). Note the operative verb: spot-check the real output, not the source code. Telemetry output is a runtime artifact.

## What the OWASP cheat sheets say

The OWASP Logging Cheat Sheet is the primary external reference (https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html, weight 0.64; mirrored at https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Logging_Cheat_Sheet.md, weight 0.64). Its event-collection guidance distinguishes what to log (authentication events, access control failures, input validation failures) from what never to log: passwords, session identifiers, security tokens, sensitive personal data. The OWASP Developer Guide's security logging chapter makes the same split at design level: implement security logging and monitoring so that log events cannot themselves become the vulnerability (https://devguide.owasp.org/en/04-design/02-web-app-checklist/09-logging-monitoring/, weight 0.67).

This matches the source doc's allowlist posture: the safe set is enumerable in advance (event name, IDs, status codes, durations), while the unsafe set grows with every new field the product handles.

## PII scrubbing as an enforced mechanism

PostHog's documentation treats PII scrubbing as a configurable pipeline stage, not a coding convention: log ingestion applies scrubbing rules so PII is removed or hashed before storage (https://posthog.com/docs/logs/pii-scrubbing, weight 0.91). The high weight here reflects what it demonstrates: mature platforms make redaction a property of the pipeline, so a developer mistake in one log call is caught by a system boundary rather than by code review.

One practitioner guide on GDPR-compliant log redaction argues the same for regulated workloads: redaction belongs at emission or ingestion, with an inventory of which fields are PII per schema (https://www.fmtdev.dev/answers/gdpr-compliant-log-redaction-guide, weight 0.25, weak). At weight 0.25 treat the specifics as weak backing; the direction (redact by mechanism, not by diligence) is consistent with both OWASP and the source doc.

## Why this is an observability concern, not just a security one

The source doc places this rule inside the structured-logging step deliberately: a telemetry pipeline is an aggregation system. Every correlation ID and entry-point field you add (doc 04) makes log lines easier to join across services, which multiplies the blast radius of one leaked token from "one log line" to "a reconstructed user session". The allowlist discipline from doc 03 (fields for what a query needs) is also the PII discipline: a query needs paymentId and errorCode, not the card number.

## Practical summary

Allowlist fields, never whole bodies. Secrets, tokens, passwords, and full PII never enter a log line. Spot-check actual production-shaped output before ship. Where your platform supports pipeline-level scrubbing, configure it as a backstop. The source doc treats this as non-negotiable and so should the review.

## The spot-check procedure

Because the checklist requires spot-checking actual output, the procedure matters (source doc). Trigger a production-shaped request in staging: one that includes auth headers, a request body, and an error path. Then read the emitted log lines directly (local sink, staging log stream, or the collector) and look for: token-shaped strings (long base64 or JWT segments), email-shaped strings, full request bodies, and anything rendered as an object dump that might hide credentials. The check is cheap precisely because the rest of the skill made the output small: an allowlisted, structured line has a handful of fields, each of which can be eyeballed in seconds (source doc; https://uptrace.dev/glossary/structured-logging as cross-reference to doc 03's field discipline). If the spot-check finds a secret, the fix is at the emission site, and the leaked value should be treated as exposed and rotated, since log pipelines replicate and retain.
