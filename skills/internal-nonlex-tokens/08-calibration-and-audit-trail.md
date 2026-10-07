# Calibration and the Per-Operation Audit Trail

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). External backing here is the strongest structured-logging cluster in the corpus: OpenSearch's observability schema carries weight 0.50.

## Scope

Per-operation calibration: the 8-field log template, the three calibration gates, the worked example, and the doubt-driven-development pairing. Calibration moves verification from end-of-session to per-operation.

## Why per-operation

The source doc closes Gap 3 (calibration is manual, not automated) with this section. End-of-session verification is agent judgment applied after the fact; two agents applying the substrate in the same session cannot verify each other's invariant preservation without a shared record. The calibration log is that record: a written entry every time the substrate is applied, making the discipline observable to a reviewer, a future cycle, an external auditor, or a downstream paired skill.

## The log template

Every non-lexical operation produces a log entry of this shape (source doc):

```json
{
  "ts": "<ISO 8601>",
  "op": "<fingerprint|compare|recall|route|transform>",
  "constraint": "<token-cost|context-bloat|sensitivity|scale|audit|similarity>",
  "token_class": "<hash|embedding|hybrid>",
  "reconstruction_path": "<where recall() finds the original; N/A for audit>",
  "expected_savings": "<qualitative estimate, e.g. '~80% of 8KB transcript'>",
  "uncertainty": "<what could go wrong; e.g. 'embedding-model-language-bias on non-English input'>",
  "recall_needed": "<yes|no, default no>"
}
```

Eight fields, each doing one job: timestamp, operation, the binding constraint, the token class, the reconstruction path, the expected savings, the named uncertainty, and whether recall is anticipated.

Entries are typically appended to a per-session log file (`session/<id>/nonlex-log.jsonl`), but the source doc does not mandate the location; the **shape** is canonical. JSONL is the natural carrier: one JSON object per line, produced from Python, Node.js, or Go, and shippable to log pipelines like ELK or Fluentd (https://jsonl.co/guide/jsonl-logging, weight 0.18, weak). Structured logging treats log entries as structured data rather than plain text, which is what makes them searchable, filterable, and analyzable (https://logtape.org/manual/struct, weight 0.44, weak).

## The worked example

The source doc includes one filled-in entry:

```json
{
  "ts": "2026-07-31T21:55:00Z",
  "op": "fingerprint",
  "constraint": "context-bloat",
  "token_class": "hybrid",
  "reconstruction_path": "content-addressed-store keyed by sha256",
  "expected_savings": "~80% of 8KB transcript chunk",
  "uncertainty": "embedding-model-language-bias on multilingual chunk; hybrid falls back to hash for non-English content",
  "recall_needed": "no"
}
```

Note what the example demonstrates: the uncertainty field names a specific, plausible failure (language bias on multilingual input) and states the mitigation (hybrid falls back to hash for non-English content). The recall_needed field is explicit "no", not omitted.

## The three calibration gates

The calibration discipline adds three gates to the source doc's Verification checklist:

1. **Per-operation log entry exists** for every non-lexical operation in the session. The log lives at `session/<id>/nonlex-log.jsonl` by default.
2. **Constraint is real, not assumed.** Each operation's `constraint` field is verified against the actual session state (large content? sensitive? repeated?). If the constraint is not actually binding, the operation is reversed and the content is read normally.
3. **Reconstruction path is documented.** Every `fingerprint()` operation records where `recall()` would find the original content. Without this, the audit trail is incomplete and the no-lexical-decode invariant cannot be enforced downstream.

Gate 2 is the enforcement mechanism for guideline 1 (verify the constraint is real): "not binding" is an operational outcome, not a judgment call, and the response is to reverse the operation. Gate 3 is the enforcement mechanism for invariant 2: a fingerprint with no reconstruction path is data loss wearing the costume of compression.

## Why this matches observability practice

The gates produce exactly the artifact class that observability tooling standardizes: a common, unified schema so that any tool that consumes the log can interpret it without per-producer custom logic. OpenSearch's Simple Schema for Observability (ss4o) is a standardization effort built on precisely that premise (https://docs.opensearch.org/latest/observing-your-data/ss4o/, weight 0.50, authoritative). The same reasoning appears in audit-log schema guidance: structured schemas, OWASP logging recommendations, and SIEM ingestion all depend on the entries having a stable shape (https://jsonic.io/guides/json-audit-logging, weight 0.21, weak). Observability itself is defined as the measure of how well internal states of a system can be inferred from knowledge of its external outputs (https://en.wikipedia.org/wiki/Observability, weight 0.20, weak; https://www.ibm.com/think/topics/observability, weight 0.14, weak). The calibration log is the substrate's external output; the gates are what make internal states (was the constraint real? was decode avoided?) inferable from it.

Even the per-operation framing has precedent in production telemetry practice: emitting custom metrics and structured log events per operation for detailed observability (https://oneuptime.com/blog/post/2026-03-31-rook-lua-custom-metrics-logging-ceph-rgw/view, weight 0.07, weak).

## The doubt-driven-development pairing

The calibration gates operationalize `doubt-driven-development`'s discipline: per-operation hypothesis testing (is this constraint binding?), per-operation evidence (the log entry), and per-operation correction (if the constraint is not binding, revert). The calibration log is the substrate's written record of doubt-driven-development's application (source doc).

The division of labor: doubt-driven-development asks the three questions before the operation commits; calibration records the answers and makes them auditable afterward. The source doc's remaining gap note is honest: the log is written, but a Phase 2 runtime could enforce the gates; for v1 the discipline is enough.

## What a reviewer does with the log

Given a session's `nonlex-log.jsonl`, a reviewer can verify all three gates mechanically: one entry per operation (gate 1), each constraint field cross-checked against the content's actual properties (gate 2), each fingerprint entry carrying a non-N/A reconstruction path unless the op is audit-only (gate 3). The log also surfaces the source doc's red flags: recall calls that routing would have avoided, and fingerprint collisions the trail failed to surface.
