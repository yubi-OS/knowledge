# 02: The failure-mode record schema and the classification pipeline

Scope: the 11-field record every documented failure mode must carry, and the fail-to-classify-to-contract pipeline that turns a native signal into a caller-usable contract.

Grounding: internal-record subtopic, no dig. The schema and pipeline are defined in the source doc (yubi-OS/yubiOS skills/nss-failure-modes/SKILL.md).

## The record

For each failure mode, the source doc prescribes 11 fields:

| Field | What it records |
|---|---|
| id | Local FM-NNN identifier, stable across edits |
| what | What the user or system observes |
| why | Why it can happen: cause, assumption, environmental condition |
| effect | Technical, operational, security, data, and user impact |
| detection | Exact signal: log line, exit code, errno, exception, invariant, metric, test |
| recovery | Safe immediate action, rollback or repair path, escalation owner |
| severity | Local severity scale value |
| probability | Local probability scale value with denominator and evidence |
| prevent | How to make it impossible, less likely, or less harmful |
| test | The fault-injection or negative test that demonstrates the mode is handled |
| evidence_gap | What is NOT yet tested, observed, or proved |

[source doc, record table]

The source doc fixes this table verbatim as guideline 11: pick one schema and stick to it; new fields need a new skill, not a new column [source doc, Guidelines].

## Three fields do the real work

Reading the schema, three fields separate a real failure-mode record from filler:

1. detection. Guideline 1 says every failure has a detection signal. If you cannot say how the operator learns the failure occurred, the failure is implicit, and implicit failures are the single most common source of incidents that were never noticed until the customer noticed [source doc, Guidelines].
2. recovery. Guideline 3 says recovery must be executable: commands, preconditions, expected output, verification, and a stop or escalate condition. Contact support is escalation, not recovery [source doc, Guidelines].
3. test. Guideline 4 says test the error path, not the happy path. A happy-path test does not prove that timeout, interruption, malformed input, partial completion, dependency failure, permission failure, disk-full, or cancellation is handled. Fault-inject each documented mode [source doc, Guidelines].

## The classification pipeline

The source doc states a useful rule: raw failure, classified failure, and effective contract are three different things. The prescribed pipeline:

fail, record native signal (errno / exit / exception), classify into project taxonomy, emit declared payload on declared stream, declare partial-output policy, expose recovery.

Two prohibitions come with it: never fold detection and classification together, and never silently coerce surprising signals into exit 1 [source doc].

## Partial-output policy is a first-class choice

Guideline 7 makes partial writes a recovery failure mode with three legal values: forbidden (atomic via tmp plus rename), valid_and_marked (commit with partial: true), or resumable (commit and continue on the next run). The implementer picks one and documents the implementation evidence [source doc, Guidelines].

## Idempotency is a property of the operation

Guideline 6: idempotency belongs to the operation, not the file. A POST that times out after commit is a duplicate hazard; a PUT with an Idempotency-Key is safe to retry. If neither applies, the record must declare not_supported and explain why a duplicate would be unsafe [source doc, Guidelines].

## What is not allowed to exist

The schema has a floor: a failure mode whose signal is silent (no log, no metric, no exit code change) must declare an evidence_gap and document the missing signal explicitly [source doc, Constraints]. And every High or Critical row must carry a test entry; a High or Critical failure mode with no test is a hypothesis, not a control, and must be marked evidence_gap: untested [source doc, Verification point 6].
