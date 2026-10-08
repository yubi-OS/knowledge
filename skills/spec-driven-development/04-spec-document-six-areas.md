# 04 - The Spec Document: Six Core Areas

Scope: the six areas every spec covers, the full spec template, and the writing rules that make the spec executable.

## The six areas

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) requires every spec to cover:

1. Objective: what we are building and why, who the user is, what success looks like.
2. Commands: full executable commands with flags, not just tool names. The doc's example lists build, test, lint, and dev commands spelled out, such as npm test -- --coverage rather than a bare "test".
3. Project Structure: where source code lives, where tests go, where docs belong, with a directory layout and descriptions.
4. Code Style: one real code snippet showing the style beats three paragraphs describing it, plus naming conventions, formatting rules, and examples of good output.
5. Testing Strategy: what framework, where tests live, coverage expectations, and which test levels cover which concerns.
6. Boundaries: a three-tier system. Always do (run tests before commits, follow naming conventions, validate inputs), Ask first (database schema changes, adding dependencies, changing CI config), Never do (commit secrets, edit vendor directories, remove failing tests without approval).

The spec template in the source doc adds three more fields around the six: Tech Stack with framework, language, and key dependencies with versions; Success Criteria defined as specific, testable conditions; and Open Questions listing anything unresolved that needs human input (source doc).

## What makes a spec executable

GitHub's spec-kit sets the standard the six areas serve: specifications must be precise, complete, and unambiguous enough to generate working systems, eliminating the gap between intent and implementation (weight 0.61, https://github.com/github/spec-kit/blob/main/spec-driven.md). Full commands with flags and a concrete directory layout are the operational form of that precision: an executor should be able to run the spec's commands and place new code without asking.

## Definitional footing

Britannica defines software as instructions that tell a computer what to do, comprising the entire set of programs, procedures, and routines associated with the operation of a computer system (weight 0.61, https://www.britannica.com/technology/software). The spec's structure areas exist because that set of instructions, procedures, and routines needs a stated home.

## Weakly-backed context

General technical-specification templates converge on similar sections: a technical spec typically carries context, goals, non-goals, design, and testing sections (weight 0.26, weak, https://www.archbee.com/blog/technical-specification), and template guides list comparable structures (weight 0.29, weak, https://spec-coding.dev/blog/how-to-write-technical-spec-template-guide). Dedicated test-strategy-document templates covering test levels and coverage expectations are also available (weight 0.17, weak, https://www.softwaretestinghelp.com/writing-test-strategy-document-template/). These corroborate the source doc's shape but carry weak weight, so the six areas and the template above stand on the source doc alone.

## The verification tie-in

The source doc's pre-implementation checklist maps one-to-one onto the six areas: the spec covers all six core areas; the human has reviewed and approved it; success criteria are specific and testable; boundaries (Always, Ask First, Never) are defined; and the spec is saved to a file in the repository (source doc). A spec that misses any checklist item is not ready for Phase 2.
