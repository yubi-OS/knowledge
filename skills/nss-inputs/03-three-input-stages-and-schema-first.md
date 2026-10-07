# 03: Raw input, validated input, effective configuration, and schema-first design

Scope: the three input stages, the 7-step collection pipeline, and schema-first configuration as practiced by Pydantic Settings, JSON Schema, OpenAPI, and the Twelve-Factor App doctrine.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` plus dig results from the searXNG dig (digs/03-three-input-stages-and-schema-first.json).

## Three different things

The source doc's core rule: raw input, validated input, and effective configuration are three different things. Never fold them together; never silently coerce surprising values. Raw input is what arrived on the wire. Validated input is what survived type and syntax checks. Effective configuration is what the file will actually use after defaults and cross-field rules are applied.

## The pipeline

The source doc prescribes the order:

```
collect -> parse -> validate syntax/types -> apply defaults -> validate cross-field rules -> check prerequisites -> execute
```

Each stage has a distinct failure class. Parse failures are malformed input. Type failures are well-formed but wrong-shaped values. Cross-field failures are individually valid values that contradict each other (the `constraints` field's cross-field rules in doc 02). Prerequisite failures are inputs the operator supplies by provisioning rather than passing, per guideline 8 ("This script requires Python 3.12" is an input). Validation at the boundary, failure at the boundary: the file validates inputs first and reports what it accepted and rejected last.

## Schema-first: declare, then implement

Guideline 9: pre-register the input surface. Before adding a new input, write the schema entry first (description, type, default, validation), then implement the consumer. This is the same discipline as spec-first implementation, which is why the source doc's composition table routes it through `spec-driven-development`.

## Pydantic Settings as the schema-first reference

The dig confirms Pydantic Settings as the canonical implementation of this discipline. The official Pydantic documentation on Settings Management (weight 0.91) documents configuration managed through environment variables and `.env` files with model-level validation, and the Pydantic Validation docs (weight 0.95) document the validation pipeline the settings models ride on. A deepwiki mirror of pydantic-settings internals (weight 0.40, weak backing) and a third-party gist on Pydantic config management (weight 0.11, weak backing) were collected but add nothing the official docs do not; they are recorded in the archive as low-weight. The pydantic.com.cn mirror (weight 0.59) is a third-party mirror, not the primary source.

## Twelve-Factor config

The Twelve-Factor App methodology, factor 3 "Config" (weight 0.85), states the doctrine the source doc encodes: configuration that varies between deploys (resource handles to the backing database, credentials, per-deploy values such as domain names) belongs in the environment, strictly separated from code. The Twelve-Factor definition is the grounding for the source doc's "env as a channel" and for the scripts doctrine in doc 08 (CLI flags first, env secondary, config third, secrets last).

## JSON Schema and OpenAPI

The JSON Schema blog post "Validating OpenAPI and JSON Schema" (weight 0.54, moderate backing) covers the relationship between the two schema vocabularies and validation. OpenAPI is itself a JSON Schema dialect, which makes a documented request surface (the request channel in doc 01) and a documented config-file channel the same kind of artifact: a schema that pre-registers type, presence, and constraints before the consumer exists. The dig also collected a GitHub JSON Schema env-validator project (weight 0.29, weak backing) and a Newtonsoft validator page (weight 0.15, weak backing); both are implementation examples, not doctrine, and are recorded low-weight.

## What the stages buy the auditor

Separating the three stages is what makes doc 09's audit checks decidable. "The type does not match the validation rule" (schema drift), "two channels claim the same key with no precedence rule" (cross-channel collision), and "the section is identical across 100+ files" (templated, not inspected) are all detectable only when raw, validated, and effective are distinct artifacts. The source doc's anti-pattern "'Compatible with X' instead of a verdict" fails for the same reason: an Inputs section that says "validates inputs" without naming which inputs, in what shape, with what precedence, is filler.
