# 02: The per-input record

Scope: the 11 fields every documented input carries, the required-with-default contradiction, and the no-silent-defaults rule.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md`. Dig material: none used; this is an internal-record subtopic, no dig (the record schema is the source doc's own table).

## The record

For each input, the source doc requires this record:

| Field | What to record |
|---|---|
| `name` | Canonical key, plus aliases |
| `channel` | One of the seven channels (doc 01) |
| `type` | scalar / object / array; encoding; units; enum values; bounds; patterns |
| `required` | yes / no / conditional (with the rule) |
| `default` | Value, or "none"; state whether the implementation materializes it |
| `constraints` | min/max, regex, enum, format, size, cross-field rules |
| `precedence` | Which source wins if the value is supplied more than once |
| `prerequisites` | Files, executables, services, network, credentials, compatible versions |
| `validation` | When checks run, what is rejected, error format, exit code, fail-fast or aggregate |
| `failure behavior` | What the operator sees (canonical name, source/channel, expected type, received *class*, never the secret itself), and how to recover |
| `side effects` | Files written, network calls, mutations, resource use on input acceptance |

## Three rules that keep the record honest

**Required and default are not the same.** The source doc states: a `required: true` field with a `default: foo` is internally contradictory; pick one. The red-flags table lists `required: true` AND `default: ...` on the same field as a "contradictory declaration", and the anti-patterns section names it again: "Required with a default" makes the default make it not required while the flag misrepresents it.

**No silent defaults.** If a default exists, it is documented in the Inputs section; if no default exists, the field says `default: none` explicitly. An unsafe default (the source doc's example: `password=changeme`) is worse than no default; a safe default is one the operator can understand without reading code. Defaults are documentation, not policy.

**Failure behavior reports the class, never the value.** When validation rejects an input, the operator sees the canonical name, the source/channel, the expected type, and the received *class*, never the secret itself. The yubiOS script convention in the source doc implements this: "exit code 2 on validation error; the offending name is logged but the value is never echoed."

## Prerequisites are inputs

Guideline 8 of the source doc: "This script requires Python 3.12" is an input the operator supplies by installing Python. Record it in the Inputs section under `prerequisites:`, not in a footer. The red-flags table marks a prerequisite in a README footer as "prerequisite lost", because it will be missed. Prerequisites cover files, executables, services, network reach, credentials, and compatible versions.

## Validation at the boundary

Guideline 7: the first thing the file does is collect inputs and validate them; the last thing it does before exit is report what it accepted and what it rejected. The `validation` field therefore records when checks run (at parse time, at config load, at daemon-reload, at build start), what is rejected, the error format, the exit code, and whether failures fail fast or aggregate. The `constraints` field carries min/max, regex, enum, format, size, and cross-field rules, which is what makes the cross-field validation stage (doc 03) executable rather than aspirational.

## Side effects on acceptance

The record closes with `side effects`: what happens once the input is accepted, files written, network calls made, mutations applied, resource use. This is the field that prevents an Inputs declaration from describing only the happy path. Combined with `failure behavior`, it gives a reader the full before-and-after picture of handing the file a value.

## How this record is consumed

The source doc's constraints note that the Inputs section a cycle-9 patch adds is read by humans first (and by the next RSI cycle's NSS sweep) before it is consumed by any parser; clarity beats strict YAML. But the record is also machine-checkable in aggregate: doc 09's verification checks (concrete names present, secrets absent from ENV/ARG/log lines, prerequisites in `prerequisites:`, precedence stated, no re-flag on the next sweep) all read fields of this record. A placeholder patch, per the source doc, is one whose `## Inputs` section "lists zero concrete names"; the record is what makes the difference between a placeholder and a real declaration.
