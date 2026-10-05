# replay, checkpoint laws, and open follow-ups

Scope: the audit's partial rows (Setup replay, checkpoint round-trip), the follow-up program, and what each remaining step needs.

## The partial rows

Two rows in the audit's component table are PARTIAL rather than YES or NO:

1. **`harnesses/setup.py` S0 replay.** The replay algebra (prefix composition of an action list) is provable, but determinism of the real environments (webarena, swebench) is an empirical property, measurement-side. The audit marks it "not modeled; candidate section 15 extension".
2. **`persistence/checkpoint.py` round-trip.** The per-layer law `from_state(save_state(state)) = state` is statable as an algebra law, but the Rules layer's round-trip includes recompiling model-emitted source, which drags the code_loader supply-chain surface back in. Marked "not modeled".

The checkpoint literature supports the audit's reading of what is easy and what is not. A CAIN 2022 paper on checkpointing and deterministic training distinguishes traditional software checkpointing, where a checkpoint saves a comprehensive image of all active program state, from ML training checkpointing where optimizer and dataloader state complicate exact resumption [1] (weight 0.767). Communications of the ACM describes deterministic record-and-replay as recording a program execution and replaying the exact same execution later, and identifies the practical preconditions (systematic non-determinism capture) that make "the same execution" achievable [2] (weight 0.865). Both point the same way: the save/restore algebra is clean, the determinism of the surrounding execution is the empirical part.

The round-trip law itself is a standard property-based-testing pattern: serialize and deserialize and require identity, as one of the canonical round-trip properties for serializers and parsers [3] (weight 0.455, weak backing, labeled). What the audit adds over the testing pattern is the theorem form (quantified over states, not sampled) and the per-layer composition law for a stack.

## Follow-up 1: model the replay and round-trip laws

The audit's first follow-up is pure algebra and cheap: extend section 15 with the Setup replay prefix-composition law and the per-layer checkpoint round-trip law. The blocker is not mathematics but scope discipline: the Rules layer's round-trip crosses into recompilation, so the theorem has to be stated per layer with the Rules layer's law conditioned on a fixed compiled artifact. The expectation, per the audit, is that both theorems are short once stated, and that they close the last two PARTIAL rows.

## Follow-up 2: prototype the Tier 2 swap

The second follow-up is an envharness `MutationObjective` whose score is a curveball dV2z on the episode against failure-axis incidence matrix, gated at the +15.6 dBc floor. The audit sizes this at about 50 lines: a corpus-auditor adapter. The pieces exist (Tier 2's statistics are proved in sections 8 through 12 and executed by verify_claims.py CLAIMs 1 through 8); the follow-up is glue, not research. Its value is that it turns the highest-value finding (raw window means with no matched null) into a running alternative a maintainer can diff against the current objectives.

## Follow-up 3: propose the weights fix upstream

The third follow-up proposes the largest-remainder allocation fix to envharness upstream, with the section 15 kernel-checked instance as the reproduction case: failure-axis counts (0, 0, 0, 0, 1) emitting per-mille floors that sum to 999. See the weights doc for the mechanism and the repair design.

## What the corpus leaves open

The audit closes its Tier 1 and Tier 2 questions and leaves three things genuinely open: the two partial rows' theorems (follow-up 1), the running prototype (follow-up 2), and the upstream conversation (follow-up 3). Nothing in the audit suggests any of the three is blocked; they are sequenced only by cost, cheapest first.

## Sources

1. https://tao.aisec.world/assets/pdf/CAIN22.pdf (weight 0.767)
2. https://cacm.acm.org/practice/deterministic-record-and-replay/ (weight 0.865)
3. https://www.python-testing-debugging.com/property-based-fuzz-testing-strategies/advanced-property-based-testing-round-trip-properties-for-serializers-and-parsers/ (weight 0.455, weak backing, labeled)

The partial-row verdicts, the follow-up list, the 50-line adapter sizing, and the +15.6 dBc floor derive from the source audit of google-research/envharness at HEAD (2026-08-21); repository identity confirmed at https://github.com/google-research/envharness (weight 0.848, collected in the 01 dig). An agentic-AI foundations paper marginally touching determinism (0.548), a durable-execution blog (0.410), a Go property-testing post (0.313), a dictionary page (0.290), and a query-miss real-estate page (0.442) from the dig were not used.
