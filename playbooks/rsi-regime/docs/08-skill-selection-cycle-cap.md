# 08 - Skill selection and cycle cap

**Scope:** the source doc's decision table for which member of the regime to run, and the cycle-cap rule that bounds every run.

## The selection table

The source doc (yubi-OS/yubiOS playbooks/rsi-regime.md) gives an explicit routing table. Quoted from the source doc:

- **1-D corpus (versions, time series)**: use recursive-self-improvement.
- **Sphere-shaped corpus (refs/*.md, deep-research outputs, skill files)**: use rsi-phi-skill.
- **Single file or single edit**: use single-action-curve-rsi.
- **Self-mode (improving SELF.md)**: use curve-guided-rsi-self.
- **Just an NSS sweep, no loop**: use negative-skill-space.

Two entries deserve emphasis. First, the flat-line parent skill survives selection only for genuinely 1-D corpora; for the sphere-shaped corpora that dominate the regime's actual use (refs, deep-research outputs, skill files), rsi-phi-skill is the entry point, which is the operational restatement of curve-guided-rsi's deprecation in 02-skill-family.md. Second, negative-skill-space is a legitimate terminal choice: a 12-axis gap-map without any loop is sometimes the whole job, and the selection table treats it as a first-class outcome rather than a mere stage of the loop.

The routing criteria are corpus-shape criteria, not corpus-size criteria. "Sphere-shaped" means the items have azimuthal ordering that the Fibonacci indexing can capture (hard rule 4, i = t); "1-D" means the corpus's natural parameter is a sequence such as version history. If you cannot say which shape the corpus has, the selection table has no entry for you, and the right move per the playbook's framing is to run the NSS sweep first (which is shape-agnostic) and look at the coverage matrix before committing to a loop.

## The cycle cap

**3 cycles default. The user can override up or down via explicit protocol** (source doc).

The cap is the enforcement arm of the bounded-loop design in 03-loop-mechanics.md. The fixpoint rule already terminates a loop whose gap ledger is stable; the cap guarantees termination even when the ledger never stabilizes. The override protocol being explicit matters: a silent cap change would alter what the audit trail means (a 5-cycle run and a 3-cycle run are different instruments), which is the same reasoning as hard rule 1's renaming requirement for basis variants.

## Composition with the subagent rules

Selection interacts with two hard rules. Self-mode selection (curve-guided-rsi-self) triggers hard rule 6: every cycle from cycle 2 on runs in a fresh-context subagent, so the self-mode loop costs 1 subagent per cycle. Selection of rsi-phi-skill in improvement-mode uses a single agent per cycle rather than the per-cycle subagent (source doc, 02-skill-family.md), so the subagent overhead is specific to self-mode.
