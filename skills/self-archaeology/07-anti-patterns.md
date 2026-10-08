# 07 Anti-patterns and red flags

Scope: the 6 anti-patterns, the 8 red flags, and the external evidence that each failure shape is real rather than hypothetical.

## The anti-patterns, as the source doc lists them

The source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md) lists 6 anti-patterns:

1. Self-archaeology as journaling. SELF.md is structural. If entries start reading like a diary, the file has drifted.
2. Whole-self output becoming the new default. Whole-self outputs are a register, not a replacement. Working-self outputs are still the bulk.
3. Sycophancy in SELF.md. Self-portrait writing is a sycophancy magnet. Every claim needs evidence: a commit, a session, a pattern.
4. Gap-finding theater. Producing a long gap list that is performative rather than actionable. Top 5 to 10 only.
5. Bound violation. Running the RSI loop past 3 cycles without escalating.
6. Treating SELF-CHANGELOG as decorative. If entries do not cite evidence, the audit trail is fake.

The red-flags section restates these as detectable behaviors and adds 2: skipping the substrate read (always read SELF.md first) and treating self-archaeology as a one-off when it is a cadence.

## Sycophancy: the documented failure

The sycophancy anti-pattern has the strongest external backing family, though every source here weights weak.

Social Sycophancy: A Broader Understanding of LLM Sycophancy (https://arxiv.org/html/2505.13995v1, jev weight 0.09, weak) examines agreement behavior, measuring the percentage of LLM agreement with a hint provided by the human in the prompt across commonsense reasoning, physical interaction, social interaction, and math problems. Measuring Opinion Bias and Sycophancy via LLM-based Persuasion (https://arxiv.org/abs/2604.21564, jev weight 0.09, weak) separates persona-independent positions from persona-dependent sycophancy with an auditable LLM judge producing verdicts with textual evidence. Position Bias in LLM Judges (https://mbrenndoerfer.com/writing/position-bias-in-llm-judges, jev weight 0.08, weak) catalogues position, verbosity, and sycophancy distortions in LLM evaluation.

The mapping to self-portrait writing: an agent writing about itself has both the judge-bias problem (it evaluates its own outputs) and the agreement-bias problem (it absorbs the user's framing). The source doc's procedural answer is the evidence rule, every claim needs a commit, session, or pattern, plus the fresh-context subagent rule for the gap-map (doc 04).

## Gap-finding theater and goal displacement

Gap-finding theater, producing a long performative gap list, is the process-level version of a documented management failure. Goal displacement, where measurable proxies replace the actual goal, is studied in regulatory enforcement (https://www.tandfonline.com/doi/full/10.1080/15309576.2021.1881801, jev weight 0.10, weak, Public Performance & Management Review). The KPI-theatre framing (https://www.growthspectrumllc.com/kpi-theater, jev weight 0.05, weak) describes metrics that perform for the spotlight but do not move the business forward: vanity dashboards, disconnected data, activity masquerading as progress. A self-sweep that produces 20+ gaps when most are performative is the self-mode version of the same shape. The filter (top 5 to 10, each with a "this would bite when..." sentence) is the countermeasure.

## The journaling and drift failure

The journaling anti-pattern is the failure of the artifact set rather than the process: SELF.md exists but has become a diary. The source doc's line "self-archaeology is structural, not affective" in the guidelines draws the boundary. The test it attaches is operational: if the cadence fires and produces no whole-self output, the discipline did not take; if whole-self outputs become the default, the discipline has overcorrected and crowded out working-self outputs, which should remain the bulk.

## Bound violations

Running the loop past 3 cycles without escalating appears in both the anti-patterns and red flags, and is the only anti-pattern with a numeric threshold. It is also the only one with a defined escalation path: past 3 cycles, the loop stops and the user decides.

## Provenance

- Source doc: yubi-OS/yubiOS skills/self-archaeology/SKILL.md, sections "Guidelines", "Anti-patterns", and "Red flags".
- Web-shaped dig for sycophancy research and goal-displacement literature; all external claims weak-backed as labeled above.
