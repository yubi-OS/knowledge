# 03: Severity and probability scales

Scope: how the source doc scales failures locally: a 1-10 severity band, probability labels with an explicit denominator, and the AIAG-VDA 2019 preference for Action Priority over RPN arithmetic.

## The local-severity rule

The source doc opens this topic with a discipline: state the scale locally; do not import a generic rubric without citing the source [source doc]. A scale imported from a generic rubric is unfalsifiable, so the scale is defined in the same file that uses it [source doc, Guidelines 2].

The source doc's own severity scale is 1-10 in five bands:

| Score | Label | Consequence |
|---|---|---|
| 1-2 | Negligible | Cosmetic; no operational impact |
| 3-4 | Degraded | UX or operator workflow impaired |
| 5-6 | Operational | Customer-impacting; needs response |
| 7-8 | Major | Outage, data loss, security exposure |
| 9-10 | Critical | Catastrophic, regulatory, safety, key compromise |

[source doc, severity table]

## Probability with a denominator

Probability labels are defined per relevant operation per year: Rare under 1%, Uncommon 1-10%, Possible 10-25%, Likely 25-50%, Frequent above 50%. If the denominator is unknown, the source doc requires saying uncalibrated rather than fabricating a percentage [source doc, probability table].

Severity without probability is listed as an anti-pattern: a HIGH severity label with no probability estimate is unfalsifiable [source doc, Anti-patterns]. The verification checklist enforces the pairing: a row with severity but no probability, or the reverse, counts as a PARTIAL verdict at best [source doc, Verification point 3].

## Where the method comes from: FMEA and Action Priority

Failure Mode and Effects Analysis is the broader method this axis borrows from. ASQ describes FMEA as a systematic, step-by-step approach for identifying all possible failures in a design, manufacturing or assembly process, developed by the U.S. military in the 1940s (weight 0.84, https://asq.org/quality-resources/fmea) [primary].

AIAG (the Automotive Industry Action Group) is the standards body behind the 2019 AIAG-VDA FMEA handbook the source doc cites; its own site positions the manuals, training, and events as industry essentials (weight 0.61, https://www.aiag.org/) [primary].

The specific AIAG-VDA 2019 claim, that Action Priority (High / Medium / Low) replaces RPN arithmetic, is corroborated in this dig only by aggregator-grade pages: a migration guide at qhubio.com (weight 0.13), an FMEA tables page at fmearatings.com (weight 0.16), and an iSixSigma quick guide (weight 0.28). These are weak backing; cite them as such, not as standards. The substantive AP-over-RPN discipline is carried by the source doc itself [source doc].

## Detectability as a third axis

The source doc separates detectability from severity: a high-severity failure with poor detectability is the worst-case combination, a silent catastrophic. Guideline 10 says add detectability to the table when useful, but never let it hide high severity [source doc]. This mirrors the classic FMEA triangle of severity, occurrence, and detection rating scales, where the detection rating is a distinct input rather than a property of severity alone; the specific 1-10 SOD tables circulating on aggregator sites (fmearatings.com, weight 0.14; qhubio.com, weight 0.13) are weak backing for the exact banding, so the project defines its own bands locally instead [weak].

## Why local beats generic

The failure-mode table pairs severity and probability on every row, and the scales stay local with the file that uses them. That keeps two properties the generic rubrics cannot give: every severity call can be falsified against the project's own incident policy, and every probability call names its denominator so a reader can challenge the evidence rather than the arithmetic [source doc].
