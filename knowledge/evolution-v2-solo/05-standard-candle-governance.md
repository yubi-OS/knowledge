# 05. Standard-candle governance (V6)

Scope: V6, the standard-candle governance variation: periodically planted known-outcome candle directives the loop must detect and score, detection power measured and reported beside every separation number, and a loop that fails its own candle test if it approves nothing or everything.

## The metaphor and its source discipline

In astronomy, a standard candle is an object of known intrinsic brightness, so its observed flux measures its distance. The method requires identifying astronomical objects whose luminosity is known independently (https://link.springer.com/chapter/10.1007/978-94-007-1658-2_2, weight 0.92, authoritative). Detectors measure apparent flux, and the flux relates to intrinsic brightness and distance through the inverse square law (https://phys.libretexts.org/Bookshelves/Astronomy__Cosmology/Big_Ideas_in_Cosmology_(Coble_et_al.), weight 0.80, authoritative). Measurement institutes use the same reference-object logic: NIST describes standard candles as brightness references that anchor astronomical and cosmological measurements, from distances to other galaxies to the age of the universe (https://www.nist.gov/blogs/taking-measure/waxlight-moonlight-21st-century-standard-candles-nist, weight 0.95, authoritative). Glossary treatments agree: a standard candle has a known intrinsic brightness, which is what makes it a ruler (https://sentinelmission.org/astronomical-units-measurements-glossary/standard-candle/, weight 0.64, authoritative). Course material walks the calibration chain in practice by measuring distances to standard candles and confirming their luminosity relations first (https://users.physics.unc.edu/~reichart/ASTR101L-5.pdf, weight 0.60, authoritative).

V6 imports the pattern into governance: the loop ships with its own calibration harness. The cron periodically plants a candle, a directive with a known, predetermined outcome. The loop must detect it and score it, and its detection power is measured and reported in dBc beside every separation number (source: the framing log).

## Why a loop needs its own candles

A separation number, how well the loop distinguishes good directives from bad ones, is meaningless without a reference. The standard-candle logic says: calibrate against known-outcome cases, otherwise every quality claim is relative to nothing. The framing log makes the failure modes explicit: a loop that approves nothing or everything fails its own candle test (source: the framing log). That is a specificity and sensitivity requirement in one sentence, and the candle plant is the instrument that measures both.

## Gaming resistance

The stress test of the finalist identified the obvious attack: the loop could detect its own plant marker and trivially pass. The recorded mitigation is that the candle payload is sealed by the integrator and the marker is hashed, not plaintext (source: the framing log, see doc 07). This is the canary-token pattern from security research: CanaryRAG embeds carefully designed canary tokens into retrieved chunks and frames the defense as a dual-path runtime integrity game, with leakage detected in real time rather than audited after the fact (https://arxiv.org/abs/2604.10717v1, weight 0.58, authoritative). Canary-style deception infrastructure commercializes the same idea: plant canaries so that touching them is itself the detection signal (https://canary.tools/, weight 0.48, weak). The shared lesson is that a detection instrument only works if the thing being evaluated cannot recognize the instrument, which is exactly why the candle's marker is hashed and its payload sealed.

## Planted tests as a governed activity

Planting test directives inside a production loop is itself a security-testing-like activity that needs authorization and documentation discipline. Enterprise testing policies formalize this: security testing activities such as penetration testing and vulnerability scanning are performed under an explicit policy defining what may be tested and how (https://www.oracle.com/corporate/security-practices/testing/, weight 0.69, authoritative), with periodic third-party penetration testing and dedicated internal ethical hacking teams documented in the security policy set (https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/cgsad/3_info_security.html, weight 0.91, authoritative). The framing log respects this by making the integrator, not the loop, the sealing party: the evaluated system cannot mint its own answer key.

## Candle cadence

The log's open question is candle cadence, daily versus weekly, and it records the default: start weekly, keeping hourly cycles cheap (source: the framing log). The cadence choice trades calibration freshness against per-cycle cost, and the log explicitly chose to resolve it empirically rather than by fiat.
