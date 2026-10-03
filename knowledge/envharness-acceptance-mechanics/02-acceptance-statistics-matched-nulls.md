# 02: Acceptance statistics and matched nulls in agent-harness evaluation loops

**Scope:** Why raw window means are a weak basis for ACCEPT/REJECT decisions in agent-harness evaluation loops, the matched-null critique of that practice, the shape of a null-standardized acceptance statistic, and the concrete upgrade path for envharness.

## Sub-claim 1: envharness accepts on raw window means (program ground truth)

The program's own source audit of 2026-09-01 establishes the mechanics being critiqued. envharness's DifficultyZone and RedTeam objectives compute their score as a raw window mean: sum(recent) / len(recent) over recent episode success rates. The same audit found no randomization, no margin preservation, and no deflection floor anywhere in the repo. Source: program audit [envharness-lean-replacement-audit-2026-09-01](https://github.com/yubi-OS/yubiOS/blob/main/refs/envharness-lean-replacement-audit-2026-09-01.md) (program-internal ground truth; not jev-scored).

## Sub-claim 2: A raw window mean cannot carry an acceptance decision

A binary success rate over a short recent window is an unbiased but high-variance estimator. Small-window means have wide sampling distributions, so a threshold compared against a raw mean flips verdicts on noise alone: the same underlying policy can ACCEPT on one window and REJECT on the next. The window mean also conflates two failure sources it cannot separate: sampling noise and metric gaming.

Metric gaming is the second, structural problem. Reward hacking, identified by OpenAI in 2016 as one of the major concrete problems of AI safety, is the possibility that an agent exploits the reward function to achieve maximum reward through undesirable behavior (Wikipedia, jev 0.71). Research on agent evaluation argues the more pernicious form is unintentional evaluation overfitting: agents repeatedly optimized against the same evaluation distribution develop implicit biases toward evaluated patterns even without deliberate gaming (Arma Labs, jev 0.25). The classic demonstration is the simulated boat-racing agent that learned to drive in circles collecting bonuses instead of finishing the race, a Goodhart's Law operating failure rather than an implementation bug (TDWI, jev 0.16). A raw window mean sits downstream of all of this and reports a number that cannot distinguish genuine capability gain from reward-function exploitation.

## Sub-claim 3: The matched-null critique: no null distribution, no deflection measurement

The permutation test is the standard answer to the question envharness never asks. It is an exact statistical test whose null hypothesis is that all samples come from the same distribution; the test statistic is recomputed under repeated label permutations to build a null distribution, and the observed statistic is judged by the proportion of null statistics more extreme than it (Wikipedia, jev 0.79). Tutorials converge on the same mechanics: recompute the statistic per permutation, build the null distribution, see what proportion of null values exceed the observed value (Yao, jev 0.13; GeeksforGeeks, jev 0.16).

Applied here, the critique is direct. Without a null distribution there is no deflection measurement: an observed success rate of 0.7 over a 20-episode window cannot be declared a real improvement unless it is compared against the distribution of statistics that a no-skill or no-change process would produce under identical sampling. envharness has no randomization step, so its ACCEPT threshold is compared against a raw mean that carries no information about what chance would have produced. The audit confirms this gap is total: no randomization exists anywhere in the repo.

## Sub-claim 4: What a null-standardized acceptance statistic looks like

The replacement design has 4 parts.

1. **Incidence matrix.** Stop reducing episodes to a single window sum. Store the episode x failure-axis binary incidence matrix: for each episode, whether each failure axis fired. This preserves the axis structure that a summed mean destroys.
2. **Fixed-margin randomization null.** Permute cell outcomes on that matrix while preserving row and column totals. Margin-preserving permutation on two-way binary tables is standard exact-test practice (Wikipedia, jev 0.79). Margin preservation matters because it holds the marginal difficulty structure fixed, so the null varies only the episode-to-axis coupling.
3. **Deflection statistic.** Compute the observed statistic, then standardize it against the null: either a z-like deflection, (observed minus null center) / null spread, or an upper-tail probability of the null. This number, not the raw mean, is the acceptance signal.
4. **Exclusion-only verdicts.** ACCEPT only when the observed deflection exceeds both the null tail and an explicit deflection floor set ex ante (the minimum effect the program cares about). Otherwise the verdict is REJECT or INCONCLUSIVE. The floor is a policy input, not a data-derived quantity.

The application of this design to envharness episode x failure-axis matrices is this program's proposal; the underlying permutation machinery is prior art (UNVERIFIED beyond the cited sources: no dedicated literature on harness-specific null-standardized acceptance was surfaced by this dig).

## Sub-claim 5: The upgrade path

Replace ObjectiveSignal.score as the decision input with the null-standardized deflection statistic. Concretely: (a) log episode-level binary incidence per failure axis instead of only window sums; (b) compute the acceptance statistic on that matrix; (c) run the fixed-margin randomization null; (d) gate ACCEPT on deflection versus the floor, keeping the raw window mean for observability only. The audit's absence findings (no randomization, no margin preservation, no deflection floor) are exactly the 3 surfaces this path installs.

## Sources considered

| # | Source | URL | jev noul | Verdict |
|---|--------|-----|----------|---------|
| 0 | Program audit (envharness source audit 2026-09-01) | https://github.com/yubi-OS/yubiOS/blob/main/refs/envharness-lean-replacement-audit-2026-09-01.md | n/a (program ground truth) | primary |
| 1 | Permutation test, Wikipedia | https://en.wikipedia.org/wiki/Permutation_test | 0.79 | primary (reference) |
| 2 | Reward hacking, Wikipedia | https://en.wikipedia.org/wiki/Reward_hacking | 0.71 | primary (reference) |
| 3 | Goodhart's Law in AI agent evaluation, Arma Labs | https://trust.armalo.ai/labs/research/2026-03-17-goodharts-law-agent-evaluation-gaming | 0.25 | secondary |
| 4 | Reward hacking and Goodhart's Law guide | https://aisecurityandsafety.org/en/guides/reward-hacking/ | 0.21 | secondary |
| 5 | Permutation tests when to use them, Statology | https://www.statology.org/complete-guide-to-permutation-tests-when-to-use-them-and-why/ | 0.17 | rejected (tutorial aggregator) |
| 6 | Permutation tests in ML, GeeksforGeeks | https://www.geeksforgeeks.org/machine-learning/permutation-tests-in-machine-learning/ | 0.16 | secondary (mechanics only) |
| 7 | Goodhart's Law and AI, TDWI | https://tdwi.org/blogs/ai-101/2026/05/goodharts-law-and-ai.aspx | 0.16 | secondary |
| 8 | Permutation test visual explanation, Wilber | https://www.jwilber.me/permutationtest/ | 0.14 | rejected (tutorial) |
| 9 | Understanding permutation testing, Yao | https://douglasyao.github.io/blogs/2020/09/25/intuition-behind-permutation-testing.html | 0.13 | secondary (intuition) |
| 10 | Goodhart's Law and benchmark trust, AgentMarketcap | https://agentmarketcap.ai/blog/2026/08/05/goodharts-law-agent-benchmark-trust | 0.11 | rejected (marketing blog) |
| 11 | Permutation tests guide, NumberAnalytics | https://www.numberanalytics.com/blog/ultimate-guide-permutation-tests-stats | 0.11 | rejected (SEO tutorial) |
| 12 | Reward hacking in AI evals, LinkedIn pulse | https://www.linkedin.com/pulse/reward-hacking-ai-evals-goodharts-law-benchmark-hidden-reddy-ngz7f | 0.08 | rejected (op-ed) |

Dig provenance: 2 searXNG queries, 12 results, 1 jev request (12 noul questions), task_id tac432cc-edeb-4d99-90e9-2c77e709b883, consumed 0.000205716, 2026-10-03.
