# 02 Trigger Scope: When to Use and When Not To

Scope: the trigger and exclusion criteria that decide when source-driven development applies, so verification effort lands where correctness actually depends on a framework version.

## When to use

The ground skill lists 6 triggers (source doc: yubi-OS/yubiOS skills/source-driven-development/SKILL.md):

1. The user wants code that follows current best practices for a given framework.
2. Building boilerplate, starter code, or patterns that will be copied across a project.
3. The user explicitly asks for documented, verified, or "correct" implementation.
4. Implementing features where the framework's recommended approach matters: forms, routing, data fetching, state management, auth.
5. Reviewing or improving code that uses framework-specific patterns.
6. Any time you are about to write framework-specific code from memory.

Trigger 2 is the highest leverage: copied code becomes a template. The skill's red-flag list repeats the point, warning that "simple tasks with wrong patterns become templates" that get copied into 10 components before anyone discovers the modern approach (source doc).

## When not to use

The exclusions are about scope, not laziness (source doc):

- Correctness does not depend on a specific version: renaming variables, fixing typos, moving files.
- Pure logic that works the same across all versions: loops, conditionals, data structures.
- The user explicitly wants speed over verification ("just do it quickly").

The boundary is version-dependence. A loop body is version-free; a form submission handler, a routing table, or an auth flow is version-bound, because framework authors change the recommended shapes between major versions.

## Why documentation is the product's first stop

Formal standards bodies treat documentation as part of the delivered software, not an afterthought. A NIST Federal Information Processing Standard on software documentation states that "software documentation covers the entire development life cycle and is a necessary part of a user-oriented software product" (https://nvlpubs.nist.gov/nistpubs/Legacy/FIPS/fipspub105.pdf, jev weight 0.81, primary backing). If documentation is part of the product, consulting it before implementation is part of implementation.

The vendor side agrees. Every major platform operator runs a developer documentation portal as the canonical entry point for its stack: Android (https://developer.android.com/, jev weight 0.91, primary backing), Apple (https://developer.apple.com/, jev weight 0.85, primary backing), Microsoft (https://developer.microsoft.com/en-us/, jev weight 0.60, primary backing), and Discord (https://discord.com/developers/home, jev weight 0.82, primary backing). These portals exist precisely so that implementers consult the operator's current guidance instead of third-party summaries. That is the same structural bet this skill makes: the source of record is the vendor's own docs.

Practitioner guides on documentation practice reach a compatible conclusion, describing well-organized documentation as reducing errors and simplifying onboarding (https://www.atlassian.com/blog/loom/software-documentation-best-practices, jev weight 0.19, weak backing). Treat that as corroborating commentary, not authority; the authority in this domain is the framework vendor's own docs (source doc hierarchy, see doc 04).

## Routing rule

The skill's guidelines reduce to 2 questions asked at the boundary (source doc):

1. Is the next piece of code framework-specific? If no, skip the fetch, write the logic.
2. Will the pattern be copied or maintained? If yes, verify even if it looks simple.

Anything beyond the frontmatter description's scope (grounding implementation decisions in official documentation) is a different skill's job, not an excuse to fetch indiscriminately (source doc).
