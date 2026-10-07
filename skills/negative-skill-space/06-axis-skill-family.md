# The axis skill family

Scope: how the 12-axis sweep materialized as a family of standalone nss-* axis skills in the yubiOS skills tree, and the external literature each major axis family draws on.

Primary source of record: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md (cited below as "source doc" for what it defines). The axis skill family itself is read from the yubi-OS/yubiOS skills/ tree, where sibling skills named nss-<axis> sit alongside the parent skill.

## The family in the skills tree

The negative-skill-space parent defines the sweep compactly: 12 axes, one line each. The axis skill family expands that compact definition into standalone skills, one per axis, each carrying its own deep-research synthesis and its own gap-finder role in the recursive-self-improvement chain. The yubi-OS/yubiOS skills tree contains the following nss-* siblings:

1. nss-audience: the Audience axis (axis 1 of 12). Classifies every file by who it is for, using role, proximity, interaction, and mode; detects files with no reader signal or the wrong reader, and scores audience gaps as Extend candidates.
2. nss-inputs: the Inputs axis (axis 2). Identifies what a file needs: environment variables, arguments, configuration, file inputs, request bodies, mounts, plus type, presence, default, precedence, and failure behavior.
3. nss-outputs: the Outputs axis (axis 3). Identifies what a file produces: stream contracts, exit codes, structured logs, files written, side effects, idempotency and determinism contracts.
4. nss-mode: the Mode axis (axis 11 in sweep order, discovered as cycle 11). Scores breadth and correctness of execution modes: interactive vs non-interactive, dry-run, daemonization, one-shot, idempotency, exit semantics, TTY handling.
5. nss-assumption-set: the Assumption set axis (axis 5). Names what a file silently assumes: caller obligations (preconditions), runtime invariants, platform dependencies, toolchain assumptions, concurrency assumptions.
6. nss-adjacent-problems: the Adjacent problems axis (axis 6). Scores coverage of related problems, alternative solutions, problem-family taxonomy, and prior-art cross-references.
7. nss-failure-modes: the Failure modes axis (axis 7). Identifies what can go wrong: error cases, edge cases, partial-failure scenarios, races, error-swallowing, unsafe defaults, untested error paths.
8. nss-lifecycle: the Lifecycle axis (axis 8). Identifies how the file evolves: versioning, changelog, deprecation state, migration guides, feature-flag lifecycle, ADR-driven decisions.
9. nss-composition: the Composition axis (axis 9). Scores how the file composes with others: dependencies, callers and callees, integration points, module boundaries, fan-in and fan-out.
10. nss-knowledge-recursion: the Knowledge sources axis (axis 10) and the Recursion axis (axis 12), combined as one skill: citation patterns, cross-references, prior-art surveys, provenance, plus self-archaeology trajectory notes and learning loops.

The parent sweep and the family are complementary: the parent names the axes in one line each and applies them in a single pass; the family members deep-dive one axis with research-backed synthesis when a corpus audit needs that axis treated as a first-class investigation.

## External grounding of the audience axis

The Audience axis has a direct relative in the Diataxis documentation framework. Diataxis prescribes approaches to content, architecture and form that emerge from a systematic approach to understanding the needs of documentation users, and it identifies 4 distinct needs and 4 corresponding forms of documentation: tutorials, how-to guides, reference, and explanation (diataxis.fr, weight 0.52). The core idea is that there are fundamentally 4 identifiable kinds of documentation responding to 4 different needs, each written differently (diataxis.fr/start-here, weight 0.64). Ubuntu's engineering blog describes the same 4 modes and ties each to a different need a user has at different times in their cycle of interaction with a product (ubuntu.com/blog/diataxis-a-new-foundation-for-canonical-documentation, weight 0.74). The framework is Daniele Procida's and organizes documentation around user goals rather than author preference (documentation.ai/blog/diataxis-framework, weight 0.52; github.com/evildmp/diataxis-documentation-framework, weight 0.69). Practitioners compare it with DITA, Information Mapping, and the Good Docs Project (idratherbewriting.com/blog/what-is-diataxis-documentation-framework, weight 0.39, weak backing).

The mapping to nss-audience is structural, not textual: Diataxis classifies documents by the user's need; the Audience axis classifies a file by the reader's role and whether the file serves that reader. Both reject author-centric organization as the unit of quality.

## External grounding of the assumption axis

The Assumption set axis has a direct relative in Design by Contract. Design by contract prescribes that software designers define formal, precise and verifiable interface specifications for software components, extending abstract data types with preconditions, postconditions and invariants (en.wikipedia.org/wiki/Design_by_contract, weight 0.63). Preconditions are conditions that must be true before a function or method executes (softwarepatternslexicon.com, weight 0.24, weak backing). The mapping: nss-assumption-set asks, for each file, which caller obligations and runtime invariants the file silently relies on, which is the informal-documentation analogue of a precondition audit.

## Why a family and not one skill

The parent sweep produces 5 to 10 Extend gaps per file in a single qualitative pass; that is enough to propose, but some gaps need depth before they can become a credible constraint for the atom. Splitting the axes into skills lets a corpus audit escalate: run the parent sweep everywhere, then dispatch the 1 or 2 axis skills whose cells are sparsest on the target file. The parent skill's changelog shows the same escalation logic applied to itself: cycle 9 closed 17 residual cells on the 73-skill corpus by pulling in three sibling skills (keylime, k8s-pss-restricted, falco) via PR #179 (source doc). Depth lives in the family; breadth lives in the parent.

## Source

- Ground spine: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md (4662 B, fetched 2026-10-07 with User-Agent omni-agent/1.0).
- Family membership: yubi-OS/yubiOS skills/nss-<axis>/ siblings (nss-audience, nss-inputs, nss-outputs, nss-mode, nss-assumption-set, nss-adjacent-problems, nss-failure-modes, nss-lifecycle, nss-composition, nss-knowledge-recursion).
- Dug sources as cited inline, each with its noul weight; weights below 0.5 are labeled weak.
