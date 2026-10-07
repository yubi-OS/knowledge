# 01. Axis scope and use

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). This subtopic is an internal-record subtopic, no dig: everything below is grounded in the source doc itself.

## Scope

The Composition axis is the ninth of the twelve axes of the negative-skill-space sweep (source doc). It scores a file's coverage of how it composes with others: the structural relationships, callers and callees, integration points, module boundaries, and runtime edges that determine what changes when the file is modified (source doc). The axis measures breadth AND correctness of the composition map documented or evidenced in the file, not the raw count of links (source doc).

## The four reader questions

The axis asks whether a file lets a reader answer 4 questions, and what evidence backs each answer (source doc):

1. What changes if I modify this?
2. Who calls it?
3. Which boundary will I cross?
4. Which integration or runtime scenario explains this edge?

A file that names a dependency without naming its callers answers half the question. A file that names callers without entry points is a name-drop (source doc, guidelines).

## Composition is a family of structures

The source doc is explicit that composition is not a diagram style. It is a family of related structures, each with a different edge meaning (source doc). The three edge mechanisms the axis distinguishes are static import (compile time), runtime call (executed at runtime), and configuration-discovered edge (found in configuration such as a systemd Wants= line or a workflow uses: line) (source doc). Collapsing the three into one diagram is the edge-type collapse anti-pattern (source doc).

## Cycle-16 sweep context

The cycle-16 NSS-composition sweep applies this rubric to roughly 40 files in the yubiOS corpus, and each file receives one composition-aware section per lens-format patch, titled `## Composition -- cycle 16` (source doc). The patch is the lens: no section ships without hypothesis, method, parameters, delta, verdict, score, and caveat (source doc). Subtopic 05 covers the lens format in detail.

## When to use

The source doc lists 8 trigger situations (all attributed to the source doc):

- A file declares a service, endpoint, workflow, or module without enumerating its callers or consumers.
- A skill, ADR, or research note proposes a new composition without enumerating the integration points it crosses.
- Files are being scored or compared along the Composition axis for an NSS sweep.
- A new skill, ADR, or refactor must position itself in the existing dependency graph without re-deriving it from scratch.
- A CI workflow or build script says "this runs in CI" but never names the dispatching workflow, the executing runners, or the secrets it consumes.
- A systemd unit, Containerfile, or mkosi.conf says "this is enabled at boot" but never names the units that Wants=, Requires=, or After= it.
- A shell script's set -e is the only failure surface and its callees (jq, curl, mount, bootc) are never enumerated.
- A research note (refs/*.md) recommends an approach without listing the yubiOS files that would need to change.

## When NOT to use

The source doc routes 6 adjacent needs elsewhere (source doc):

- Primitive coverage (9-primitive binarization): use negative-skill-space directly.
- Lens-format RSI patches specifically: use curve-compass-skill.
- Binary corpus generation: use curved-corpus-create.
- Enumerating related problems and alternative solutions: use nss-adjacent-problems.
- Enumerating explicit prerequisites and assumptions: use nss-assumption-set.
- Enumerating failure modes and anti-patterns: use negative-skill-space directly.

## Position in the axis order

Composition sits ninth, after audience, inputs, outputs, mode, assumption set, adjacent problems, failure modes, and lifecycle, and before knowledge sources and recursion (source doc frontmatter). Its sister axes in the sweep are nss-adjacent-problems (cycle 13) and nss-assumption-set (cycle 12), and the source doc describes composition as the structural surface that those axes complement: adjacent-problems covers alternative solutions, assumption-set covers the preconditions of the relationships composition surfaces (source doc, Composition section).

## Self-containment

The source doc embeds the full rubric, the distinctions, the lens schema, the file-type templates, and the yubiOS patterns. It requires no external doc fetch to operate, reads nothing, and depends on stdlib only (source doc, Self-containment section). Measurement is local only: the rubric forbids network access during scoring (source doc, Constraints).

## Source weight note

This document carries no searXNG-sourced claims. Every claim above is attributable to the ground source, which is the primary source of record for the corpus: yubi-OS/yubiOS skills/nss-composition/SKILL.md.
