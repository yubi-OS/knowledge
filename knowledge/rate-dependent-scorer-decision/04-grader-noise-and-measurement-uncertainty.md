# 04: Grader noise and measurement uncertainty

Scope: scorer variance as instrument noise, the dBc bookkeeping that carries it, and why a 0.64 dBc effect inside a 5.77 dBc pass band decided the protocol question.

## LLM graders are noisy instruments

The empirical record on LLM-as-judge reliability is unambiguous about variance. The largest systematic evaluation to date covered 21 judges from 9 providers across MT-Bench, JudgeBench, and RewardBench, evaluated under 3 protocols over 118 runs (source: https://arxiv.org/pdf/2606.19544, jev weight 0.591; abstract landing page https://arxiv.org/abs/2606.19544, jev weight 0.302, weak backing). Its recurring failure-mode list includes inconsistency across prompts and runs, systematic scoring biases, weak domain-specific calibration, and the absence of meta-evaluation standards for comparing judges (source: https://arxiv.org/pdf/2606.19544, jev weight 0.591). Survey literature concurs: ensuring the reliability of LLM-as-a-judge systems remains a significant challenge requiring careful design and standardization (source: https://pmc.ncbi.nlm.nih.gov/articles/PMC13237853/, jev weight 0.830; mirrored at https://www.sciencedirect.com/science/article/pii/S2666675825004564, jev weight 0.843, and https://www.cell.com/the-innovation/pdf/S2666-6758(25)00456-4.pdf, jev weight 0.920). Design choices measurably impact judge behavior (source: https://aclanthology.org/2026.gem-main.19/, jev weight 0.870).

So a grader pass is a reading with noise, and a single pass is a single reading. The instrument question is how to carry and report that noise.

## The dBc bookkeeping

The audit carries grader noise in decibel-of-corpus units. The persistence endpoint reports scorer_variance.inter_pass_offset_dbc, a pass-to-pass offset, and per_pass_fractions, the persistence fraction each pass produced (source: yubiOS refs decision doc, 2026-10-02, internal). The round-3 lesson quantified the band: effects at the 0.64 dBc scale already sit inside a 5.77 dBc grader-pass band (source: yubiOS refs decision doc, 2026-10-02, internal).

That ratio is the whole argument against adding noise. A signal of 0.64 dBc is roughly a ninth of the observed pass-to-pass band of 5.77 dBc, so a protocol that added stochastic noise to the instrument would swamp the gate before it added signal. This is the standard instrumentation trade-off: signal-to-noise ratio compares the level of a desired signal to the level of background noise, often expressed in decibels (source: https://en.wikipedia.org/wiki/Signal-to-noise_ratio, jev weight 0.824).

## The SNR frame from analytical chemistry

Analytical-instrument practice gives the vocabulary for what the protocol does instead. Signals and noise treatment in instrumental analysis catalogs the ways detectability is improved, including signal averaging and noise reduction at the source (source: https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Instrumental_Analysis_(LibreTexts)/05%3A_Signals_and_Noise_(TBD)/5.01%3A_The_Signal-to-Noise_Ratio, jev weight 0.722; a second treatment at https://chem.libretexts.org/Courses/Sewanee%3A_The_University_of_the_South/Instrumental_Analysis_(CHEM_311)/06%3A_Spectroscopic_Methods/6.06%3A_Signals_and_Noise, jev weight 0.617). SNR and uncertainty can be estimated by comparing a noise region against a signal region of the same measurement record (source: https://nmr.chem.ucsb.edu/protocols/SNR.html, jev weight 0.575).

Mapped onto the audit: the per-pass fractions are the repeated readings, the inter-pass offset is the measured noise region, and the round's effect size is the signal region. Multi-pass re-grading is signal averaging applied to a grader: it improves the estimate of the persistence fraction without adding generation-side randomness, because each pass is the same pinned instrument run independently.

## Why noise accounting decided the option choice

The three options in the decision differ exactly on their noise position (source: yubiOS refs decision doc, 2026-10-02, internal):

1. Option A (deterministic single pass): zero new noise, but also zero new information; the instrument cannot express the rate dimension at all.
2. Option B (multi-pass): adds a bounded, observable noise dimension. The 2-4 extra lanes are cheap, and every unit of added noise is reported through scorer_variance and per_pass_fractions rather than hidden in a point estimate.
3. Option C (temperature-sampled): adds unbounded, generation-side noise at exactly the scale where the observed band already swallows the effect (docs 05).

The measurement-uncertainty literature reinforces the asymmetry: methods for assessing the quality of measurement systems and results are a studied field with defined concepts (source: https://www.mdpi.com/2076-3417/15/17/9393, jev weight 0.780), and estimating the accuracy of a single measurement is a recognized hard problem in metrology (source: https://link.springer.com/article/10.1007/s00769-007-0270-9, jev weight 0.869). An instrument that reports its own noise band, as B does through the persistence endpoint, is strictly easier to reason about than one whose uncertainty is unknown.
