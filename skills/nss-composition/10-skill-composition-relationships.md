# 10. Skill composition relationships, self-containment, and verification

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). This subtopic is an internal-record subtopic, no dig: the composition table and verification commands are embedded in the source doc.

## Scope

The source doc documents its own composition surface, its self-containment contract, and its verification commands. This subtopic explicates them.

## The skill's composition table

The source doc declares 7 composition relationships with directions (all attributed to the source doc):

| Skill / channel | How it composes | Direction |
|---|---|---|
| negative-skill-space | Provides the 12-axis sweep framework; this skill owns axis 9 (Composition). NSS sweeps this axis on every cycle that asks for composition gap finding. | negative-skill-space -> nss-composition |
| curve-compass-skill | Provides the lens-format patch generator and the Sigma ladder; this skill emits 1 lens per file in the same JSON shape. | curve-compass-skill <-> nss-composition |
| nss-adjacent-problems | Complementary surfaces: composition is the structural surface, adjacent-problems is the alternative-solution surface. A file with a strong composition map but no alternatives is still a gap. | nss-composition <-> nss-adjacent-problems |
| nss-assumption-set | Composition surfaces the structural relationships; assumption-set surfaces the preconditions of those relationships. A composition edge without an assumption_set entry (the "this works only if X" line) is a partial cell. | nss-composition <-> nss-assumption-set |
| github-api | Defines the Git Data API commit pattern for atomic multi-file patches; nss-composition uses this to apply roughly 40 file patches in 1 commit (per PROJECT_RULES.md). | nss-composition -> github-api |
| recursive-self-improvement | The closing loop. nss-composition proposes gaps; RSI applies the per-file patch. | nss-composition -> recursive-self-improvement |
| context-isolation | When running the cycle-16 sweep, run each file's lens in a fresh-context subagent so author bias from prior cycles does not re-anchor. | context-isolation -> nss-composition |

Note the edge typing in the directions column: 1 upstream provider, 2 bidirectional peers, 2 downstream consumers, and 1 discipline constraint (context-isolation) that gates how the sweep runs. That column is itself an application of the axis's own edge-type discipline (source doc).

## Self-containment contract

The source doc states its I/O contract directly (source doc):

- Reads: nothing required. The rubric, distinctions, lens schema, file-type templates, yubiOS patterns, and standards are all embedded.
- Writes: lens-format JSON per file.
- Depends on: stdlib only.

Two further constraints follow (source doc): measurement is LOCAL ONLY with no network for the rubric, and the edge-typed vocabulary is fixed (contains / imports / calls / publishes / subscribes / reads / writes / deploys-with / depends-on), with new edges requiring a vocabulary revision.

## Verification

The source doc ships 3 concrete verification steps (source doc):

1. A Python check that the SKILL.md frontmatter matches the expected name and description shape (regex on the file content).
2. Lens output schema checks: lens, file, hypothesis, method, parameters, delta, verdict, score, and caveat all present; verdict in {YES, PARTIAL, NO}; score 0 to 50; parameters.axis == "composition".
3. A YAML frontmatter validation: the name matches `^[a-z0-9-]+$`, the description is between 1 and 1024 characters, and the description contains no angle brackets.

## Provenance and changelog

The source doc's changelog records version 1.0.0 dated 2026-08-12, built for RSI cycle 16 on PR #207. It establishes the Composition axis rubric, the 0 to 5 level scale, the 10-dimension 0 to 20 score, the lens-format patch format, the 9 file-type composition block templates, the edge-typed vocabulary, and the 7-evidence-layer measurement framework, and claims cross-context invariance across operator, developer, CI, and architect (source doc).

The maintainer section records the build inputs (source doc): Sauna wave 2, built against the negative-skill-space SKILL.md, curve-compass-skill v1.1.0, the nss-adjacent-problems and nss-assumption-set skills, a deepresearch output covering Parnas and SEI architecture documentation, arc42, C4, SootUp and Kythe call graphs, dependency-cruiser and its FAQ, the package design principles, Clean Architecture component cohesion and coupling, Microsoft modular monolith guidance, and Spryker Architecture as Code, plus the cycle-7 PR #207 baseline of 391 atomic per-file NSS patches on the branch with cycles 8 through 15 lenses already shipped on the branch feat/rsi-compass-cycle7-nss-research-2026-08-12.

## Why this matters to the corpus

The skill's own composition section is a worked example of what the axis demands of other files: named callers and callees with directions, a public versus private boundary (the lens JSON is the write surface), and a machine-checkable contract (the verification commands). A reader comparing this corpus doc against the rubric in subtopic 02 can score the source doc's own composition coverage against its own rubric.
