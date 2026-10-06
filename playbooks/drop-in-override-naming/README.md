# playbooks/drop-in-override-naming

Knowledge corpus explicating the yubiOS playbook `playbooks/drop-in-override-naming.md` (the systemd drop-in override naming playbook): the lexicographic-sort discipline, the yubiOS prefix naming convention, the author-time verification recipe, the base-image bump drift corollary, and the doctrine cross-references. Ground source of record: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/drop-in-override-naming.md

## Docs

- [01-lex-sort-discipline.md](01-lex-sort-discipline.md) - which drop-in directories sort by full filename lexicographically and how conflicting entries resolve.
- [02-rcn-prefix-mismatch.md](02-rcn-prefix-mismatch.md) - why sysv-init rcN.d numeric prefixes do not transfer, and the byte arithmetic that inverted OMN-149.
- [03-naming-convention.md](03-naming-convention.md) - the vfio-yubiOS- / kvm-yubiOS- / yubiOS- prefix convention and when a low numeric prefix is acceptable.
- [04-verification-recipe.md](04-verification-recipe.md) - the 4-step author-time recipe: effective sort listing, pairwise assertion, base-image listing, runtime effect assertion.
- [07-base-image-bump-drift.md](07-base-image-bump-drift.md) - why the ordering guarantee is per-filename-pair and expires on every bootc base-image bump.
- [08-doctrine-and-ci-gap.md](08-doctrine-and-ci-gap.md) - BLOCKERS.md doctrine placement, commits and Linear items, the tests that caught OMN-149, and the unbuilt CI gate (Gap 8). Internal-record subtopic, no dig.

## Research summary

- Results collected: 60 (10 searXNG queries, top 6 kept per query).
- Weight split: 26 results at weight >= 0.5, 34 at weight < 0.5, of 60.
- jev: 5 requests (1 outline score validation with 8 questions, 4 noul weighting batches of 15), 6837 input / 1220 output tokens, model typesafe/jev-1.13 via DefAPI direct.
- Redo counts: 0 digs redone, 0 rescoring redos.
- Skipped docs: 05-omn-149-incident (outline score 0.47, drop probability 0.65) and 06-tmpfiles-r-vs-z (outline score 0.22, drop probability 0.82) dropped by outline validation; their source-doc content is carried inside docs 02, 03, and 08.
- Marginal subtopics kept on dig strength: 02 (3 high-weight results), 04 (1 high-weight result plus the source-doc recipe as spine), 07 (6 high-weight results), 08 (internal-record, no dig by design).

Preflight 2026-10-06: campaign preflight healthy (orchestrator); searXNG 10 queries all returned 6 results; agent-side decide probe skipped for speed per mint brief.
