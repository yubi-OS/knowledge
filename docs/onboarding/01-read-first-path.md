# 01. Read-First Path

Scope: the ordered reading path the onboarding doc mandates (README, SPEC, PINNED, ADR, and the dated planning-cycle note), what each document contributes to orientation, and why the order matters for a contributor who should not have to read every ADR first.

All claims in this doc are grounded in the source doc, yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11. This is an internal-record subtopic, no dig.

## The stated purpose

The onboarding doc opens by declaring its job: it gets a contributor or early tester oriented without requiring them to read every ADR first (source doc). That framing matters. The yubiOS documentation corpus is large, and the doc positions itself as the entry gate rather than a summary of everything. A new reader is meant to walk a short, ordered path and arrive with enough context to work, not with the full decision history.

## The 5-step reading order

The doc prescribes an exact sequence (source doc):

1. README.md, for the project overview and install shape.
2. SPEC.md, for normative requirements.
3. PINNED.md, for the live base-image and tool pins.
4. ADR.md, when you need the why behind a decision.
5. refs/planning-cycle-2026-07-11.md, for the latest research-cycle corrections.

Each step answers a different question. README.md answers "what is yubiOS and how is it installed". SPEC.md answers "what must be true" because it carries normative requirements, the requirements a contribution is measured against. PINNED.md answers "what exact versions and digests are live right now". ADR.md answers "why was it built this way", and the doc deliberately marks it as a need-based read, not a mandatory one. The planning-cycle note under refs/ answers "what did the latest research cycle change", and it is the only entry in the list that carries a date in its filename.

## Why the order is load-bearing

The sequence is not alphabetical or hierarchical; it moves from stable overview to volatile state. README.md and SPEC.md describe the project's shape and rules, which change slowly. PINNED.md describes live pins, which change whenever an upstream image digest moves. The planning-cycle reference is the most time-sensitive item and sits last, so a reader finishes with the freshest corrections in mind. A contributor who reads in this order gets the invariants before the volatility, which is the correct order for forming expectations.

The ADR step is also phrased conditionally: "when you need the why behind a decision" (source doc). This tells the reader that architecture rationale is available but optional at onboarding time, an explicit admission that the corpus is bigger than a first-day read.

## The dated planning-cycle pointer

Step 5 points at refs/planning-cycle-2026-07-11.md, described as holding "the latest research-cycle corrections" (source doc). The filename itself encodes the cycle date, 2026-07-11, which is the same date the doc records as its last review. This is a paired-reference convention: when the onboarding doc is reviewed, it is re-pointed at the newest planning-cycle note. A reader can therefore trust that the pointer is current as of the doc's own last-reviewed date and should check for a newer refs/ planning-cycle file if they arrive later than 2026-07-11.

## Drift-check confirmation

The doc carries two drift-check annotations dated 2026-09-18, from wayfinder rounds 10 and 11 (cycles 15 and 25) (source doc). Both state that the onboarding record itself is unchanged, and that the docs corpus a new reader encounters has been fully mojibake-repaired, with round 11 additionally confirming the corpus is single-version after SPEC resolution. For a new contributor this is a useful signal: the reading path listed above leads to documents that have been actively audited for encoding corruption and version fragmentation, so the text you read at each step is the intended text, not an artifact of a past encoding problem.

## What this means for a first task

Because the reading path is explicitly designed to make ADR reading optional, a first contribution should be verifiable against SPEC.md (normative) and PINNED.md (pins) without needing ADR context. If a task does touch a decision area, the ADR step is where the reader goes next, and the planning-cycle note is where they check whether the decision was recently corrected.
