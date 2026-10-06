# 08 - Lens format: the v1.1.0 output contract

Scope: why the flat table died, the guided-curve-ideate lens shape, the lens subcommand, the coverage verdict rule, and place as one lens per class.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. This is an internal-record subtopic: the lens format is defined by the source doc and its cycle-34 lineage, no external dig was run.

## Why v1.0.0's flat table was declined

The first real-world use (cycle 1, PR #202, 2026-08-12) shipped a calibration pack as a flat table. Jenny declined the merge: the output was too structured to produce the needed dynamics [source doc]. v1.1.0 changes the output format rather than the math: every measurement and every suggested improvement becomes a guided-curve-ideate-format new idea, per cycle-34 L141-L146 [source doc].

## The lens shape

Every lens has exactly seven fields [source doc]:

- lens: identifier (L<N>, L_cal_<amplitude>, or per-file L numbers)
- hypothesis: a testable claim
- method: how the test runs
- parameters: {amplitude, N, d, modes, reps, seed} as applicable
- delta: {dV2z, power, FPR, R^2, ...} with units
- verdict: YES | PARTIAL | NO
- score: 0 to 50 (rank against the lens pool)
- caveat: what the experiment did NOT measure

The regime's own exemplars show the same shape: PC1+PC2 on GWTC = 0.4003 PARTIAL; SCAP SSG PC2 anti-emerges PARTIAL [source doc]. Each lens is a concrete experiment with measurable dynamics, not prose about an experiment.

## The lens subcommand

The lens subcommand reads a corpus JSON (built externally) and emits a lens pool that drives the patch generator [source doc]:

python3.12 scripts/create_corpus.py lens --corpus cycle2/corpus.json --out cycle2/lenses.json

Each file gets a lens with hypothesis + method + parameters + delta (the measured coverage) + verdict + score + caveat [source doc]. The verdict rule for coverage: YES if k = d (all primitives covered), PARTIAL if d/2 <= k < d, NO if k < d/2. Score = round(50 * k/d) [source doc]. The source doc's example schema shows a 9-D internal-big-picture basis lens with k = 9, missing_primitives = [], chordal_resid 0.0, verdict YES, score 50, caveat "binarization is heuristic" [source doc].

## The lens output is the patch input

Each file patch IS the lens itself (hypothesis + method + parameters + delta + verdict + score + caveat), not a templated ## Purpose or ## Examples section [source doc]. The patch generator consumes the lens pool; curve-compass-skill's lens subcommand is the downstream consumer [source doc, Composition].

## place: one lens per class

The place subcommand performs IS-THIS-X placement in lens format: one lens per class, with hypothesis (the class identity), method (the reference family construction), parameters (N, d, density, trials, reps, seed), delta (the per-coordinate z-scores), verdict (excluded / not-excluded / not-tested), score 0 to 50, and caveat [source doc]. Placement verdicts are exclusion-style: the question is whether the real corpus is excluded from each reference class, not which class it "really belongs to".

## The full lens pool schema

The source doc gives the lens subcommand's output schema in full [source doc]:

```json
{
  "lens_pool": [
    {
      "lens": "L147",
      "file": "docs/AGENTS.md",
      "hypothesis": "AGENTS.md covers all 9 primitives in the internal-big-picture basis",
      "method": "9-D primitive binarization + chordal distance to ideal pole",
      "parameters": {"basis": "internal-big-picture", "d": 9, "seed": 20260812},
      "delta": {"k": 9, "missing_primitives": [], "chordal_resid": 0.0},
      "verdict": "YES",
      "score": 50,
      "caveat": "binarization is heuristic"
    }
  ]
}
```

Every field is present in every lens; the selftest asserts exactly this (doc 10). The delta carries the measured coverage: k primitives covered out of d, the list of missing primitives, and the chordal residual to the ideal pole [source doc].

## Why hypothesis-first output changed the merge outcome

The PR #202 rejection is the design lesson of v1.1.0: a flat table of numbers is too structured to produce the needed dynamics [source doc]. A table row invites skimming; a lens with a testable hypothesis, a method, parameters, a measured delta, a verdict, a score, and an explicit caveat invites the next experiment. The format is the interface between measurement and ideation: the lens pool is literally the input to the patch generator [source doc].

## place and the exclusion verdicts

The place subcommand's verdicts differ from the coverage lens verdicts: excluded / not-excluded / not-tested [source doc]. A real corpus is placed against reference families (constructed by the class's method at the class's parameters); the verdict records whether the corpus is excluded from that class, and not-tested records that the class was not run. The three-valued discipline from guideline 11 carries over: a verdict that was not earned by a run is not-tested, not a soft guess.
