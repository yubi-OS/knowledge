# 02. Tier 2: high-value candidates with a concrete falsification design

**Scope:** Tier 2 - high-value candidates with a concrete falsification design: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md`. Dig queries: `API contract testing fail-closed HTTP status codes`; `statistical power false positive rate Monte Carlo null`.

## Ordering principle

Tier 2 lists 12 endpoints that measure something but have no known-answer corpus yet, ordered by expected value per unit of build effort. Each entry in the ground source names what to falsify, the harness shape, the cost, and the grounding. The common thread: parity of a port is not validity of an instrument. Several of these endpoints are byte-exact ports of a Python source of record, yet no planted-answer set says whether the measurement itself is right.

## The 12 candidates in brief

1. **`POST /api/jev/corpus/audit` (+ `/lens`)**: planted-effect standard candles. Falsify that z and level_dbc recover a KNOWN planted effect and that the null returns zero at zero amplitude. Shape: a ladder of curved-corpus-create corpora at 4 to 5 amplitudes plus zero-amplitude controls; gate = measured level within a pinned tolerance and FPR at or below a floor at zero. Grounded in the sonometer lineage (CLAIM_8, the +15.6 dBc floor).
2. **`POST /api/jev/route`**: end-to-end routing. Band selection was calibrated (6/6 live-route hits) but per-class gate outcomes (dispatch, needs_approval, blocked, reroute_not_converged) have no pre-registered corpus. Includes a deliberate mis-correction negative that must land `reroute_not_converged`, as observed on run `cr_b11bbeee22ed5425`.
3. **`POST /api/jev/corpus/scorer/score` (+ `/matrix`)**: extractor gold set with planted per-axis evidence at known counts; gates on precision and recall floors, paraphrase stability, and distractor specificity. About $0.0002 per score; whole corpus under $0.05.
4. **`GET /api/jev/corpus/visco/prony`**: synthetic relaxation recovery across SNR tiers and point counts, including the under-5-point 422 boundary. Live real-data fits are honest but weak (r2 0.069 on the first 35-point series).
5. **`POST /api/jev/corpus/visco/snapback`**: verdict-class corpus; 100% on the noiseless tier, pinned FPR on noisy tiers.
6. **`GET /api/jev/corpus/visco/hysteresis`**: analytic rollup fixtures for `consolidateLedgerChains`.
7. **`POST /api/jev/corpus/taste/score`**: 8-axis synthetic gold (mirror renders, fractal ladders at known D, scale-coherence ladders).
8. **`POST /api/jev/corpus/visco/persistence`**: planted-noise multi-pass, since a deterministic scorer collapses recovery fraction R to 1.0.
9. **`POST /api/jev/corpus/classify`**: adversarial tautology corpus.
10. **`POST /api/map`**: planted-placement corpus; highest research upside.
11. **`POST /api/embed` + `/api/vector/search`**: retrieval gold pairs.
12. **`POST /api/decide`**: fixed-answer decision battery, rerun after every model or threshold change.

## Gate design: false-positive rate and power

Most Tier 2 gates are two-sided: recover the planted effect (power) and stay silent on the null (false-positive rate). Monte Carlo simulation is the standard way to pin both before trusting a real-data verdict. One paper argues for "the unreasonable effectiveness of Monte Carlo simulations" in understanding false positives and power in A/B tests and randomized trials [The Unreasonable Effectiveness of Monte Carlo Simulations in A/B Testing](https://arxiv.org/html/2411.06701v1) (clef weight: 0.4430) (weak backing, clef weight < 0.5), also indexed in abstract form [(2411.06701) The Unreasonable Effectiveness of Monte Carlo Simulations ...](https://arxiv.org/abs/2411.06701) (clef weight: 0.3680) (weak backing, clef weight < 0.5). A Nature study simulated 16,000 behavioral datasets with Monte Carlo methods to estimate power and false-positive rates for interdependent choices [Statistical power and false positive rates for interdependent ... - Nature](https://www.nature.com/articles/s41386-023-01592-6) (clef weight: 0.4268) (weak backing, clef weight < 0.5). ROC analysis frames the same tradeoff as discrimination across a varying threshold [Receiver operating characteristic](https://handwiki.org/wiki/Receiver_operating_characteristic) (clef weight: 0.1233) (weak backing, clef weight < 0.5). All four are weak backing; they support the general method, not any specific Tier 2 number. The concrete gates (FPR at or below a floor at zero amplitude for item 1, pinned FPR per noisy tier for item 5) come from the ground source.

Item 12 is where calibration risk is most concrete in the source: the clef migration moved 21.6% of raw probabilities, and the 0.55 decision threshold was chosen from a 50-doc sample. A fixed battery run after every change turns that into a measured drift, and the results feed the WLF policy-shift study through the existing `jev_policy_changelog`.

## Where contract testing meets falsification

Some Tier 2 items have a contract component layered under the measurement. The route item, for example, asserts both the band and the gate outcome, and the scorer and decide items depend on fail-closed HTTP behavior. General API-testing guidance holds that good tests check "not only the happy-path" status codes [API Status Codes Explained for Testing - API Comparator](https://apicomparator.com/guides/api-status-codes-for-testing) (clef weight: 0.1365) (weak backing, clef weight < 0.5), that consumer-driven contracts fail before deployment when either side breaks them [The Complete API Testing Masterclass: Status Codes, Strategies, and ...](https://scrolltest.com/complete-api-testing-masterclass-status-codes-strategies/) (clef weight: 0.0769) (weak backing, clef weight < 0.5), and that status codes fall into five categories [HTTP Status Codes - REST API Tutorial](https://restfulapi.net/http-status-codes/) (clef weight: 0.1362) (weak backing, clef weight < 0.5), with error responses best expressed through Problem Details and explicit retry semantics [REST API Error Handling: Status Codes and Problem Details](https://restfulapi.net/rest-api-error-handling/) (clef weight: 0.1607) (weak backing, clef weight < 0.5). A 2026 cheat sheet covers 1xx to 5xx [API HTTP Status Codes: The Complete Developer Cheat Sheet (2026)](https://apistatuscheck.com/blog/api-status-codes-reference) (clef weight: 0.0855) (weak backing, clef weight < 0.5). These are weak backing and apply to the transport layer only; the source is explicit that transport (bands table, runs listing) is Tier 3 work, while gate behavior is the Tier 2 falsification target. A dictionary entry for "statistical" [STATISTICAL Definition & Meaning - Merriam-Webster](https://www.merriam-webster.com/dictionary/statistical) (clef weight: 0.0316) (weak backing, clef weight < 0.5) was dig noise.

## Cost profile

Most Tier 2 builds are pure compute or near-zero API cost: route dispatch is deterministic, the visco items need no external calls, and the decide battery costs about $0.0002 per run. Only item 10 needs a text-generation pass. That cost profile is why the build order (doc 04) front-loads the visco fixtures.

## Sources Considered

All 10 Clef-weighted searXNG results from `dig_context_02.json`. Weight >= 0.5 is authoritative backing; < 0.5 is weak backing.

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | API Status Codes Explained for Testing - API Comparator | https://apicomparator.com/guides/api-status-codes-for-testing | 0.1365 | weak backing (< 0.5) |
| 2 | The Complete API Testing Masterclass: Status Codes, Strategies, and ... | https://scrolltest.com/complete-api-testing-masterclass-status-codes-strategies/ | 0.0769 | weak backing (< 0.5) |
| 3 | HTTP Status Codes - REST API Tutorial | https://restfulapi.net/http-status-codes/ | 0.1362 | weak backing (< 0.5) |
| 4 | API HTTP Status Codes: The Complete Developer Cheat Sheet (2026) | https://apistatuscheck.com/blog/api-status-codes-reference | 0.0855 | weak backing (< 0.5) |
| 5 | REST API Error Handling: Status Codes and Problem Details | https://restfulapi.net/rest-api-error-handling/ | 0.1607 | weak backing (< 0.5) |
| 6 | The Unreasonable Effectiveness of Monte Carlo Simulations in A/B Testing | https://arxiv.org/html/2411.06701v1 | 0.4430 | weak backing (< 0.5) |
| 7 | Statistical power and false positive rates for interdependent ... - Nature | https://www.nature.com/articles/s41386-023-01592-6 | 0.4268 | weak backing (< 0.5) |
| 8 | (2411.06701) The Unreasonable Effectiveness of Monte Carlo Simulations ... | https://arxiv.org/abs/2411.06701 | 0.3680 | weak backing (< 0.5) |
| 9 | STATISTICAL Definition & Meaning - Merriam-Webster | https://www.merriam-webster.com/dictionary/statistical | 0.0316 | weak backing (< 0.5) |
| 10 | Receiver operating characteristic | https://handwiki.org/wiki/Receiver_operating_characteristic | 0.1233 | weak backing (< 0.5) |
