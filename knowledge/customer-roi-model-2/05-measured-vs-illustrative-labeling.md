# Measured vs Illustrative Labeling

Scope: the two labels the model requires (measured and illustrative), the regulatory grounding for claim substantiation, and why the model excludes a worked example with numbers.

## The two labels

Measured ROI is every number in the formula that traces to a named evidence source from a real pilot customer's real baseline and a real pilot run, and it must be labeled "measured" wherever it is shown. An illustrative example is a worked calculation using placeholder numbers to show how the formula works, with every placeholder explicitly marked as illustrative, not customer data; illustrative examples exist to explain the model to a prospect before they commit to a pilot and must never be presented as evidence of actual savings (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md).

## The substantiation backdrop

The labeling rule sits on a well-established regulatory requirement. The FTC's policy statement on advertising substantiation establishes that advertisers need a reasonable basis for their claims before dissemination (https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation, jev weight 0.91, authoritative). The Code of Federal Regulations makes the endorsement case concrete: "The advertiser must have substantiation, however, for any performance claims conveyed by the endorsement" (16 CFR 255.2, https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.2, jev weight 0.97, authoritative). The same title grounds the deception standard: "Section 5 of the FTC Act prohibits deceptive acts and practices in or affecting commerce" (16 CFR 260.2, https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-260/section-260.2, jev weight 0.91, authoritative). Practice guidance for advertisers echoes the same structure across product labels, websites, social media, and marketing (https://www.dwt.com/insights/2024/03/how-to-substantiate-advertising-claims, jev weight 0.41, weak backing) and marketing claims compliance guides summarize the FTC requirements for claims (https://www.luthor.ai/resources/marketing-claims, jev weight 0.35, weak backing).

## What this means for the model

An illustrative number presented as a measured result is exactly the case the substantiation rule prohibits: a performance claim with no reasonable basis. The model's response is mechanical rather than judgment-based. Measured numbers carry their named evidence source from the evidence validation rules doc. Illustrative numbers, if any are ever published, must be labeled illustrative at the point of use, not in a footnote somewhere else. A number with no label has no admissible use.

## Why the model excludes a worked example

The refreshed model deliberately contains no illustrative example with numbers. Its stated reason: inventing plausible-looking placeholder figures risks them being mistaken for real data if copied out of context, and if an illustrative walkthrough is wanted for pilot sales conversations it should be built as a clearly-labeled separate artifact, not embedded in the model doc (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). The copy-out-of-context risk is not hypothetical: disclaimers are a common and legally recognized mitigation pattern, with extensive libraries of disclaimer examples in circulation (https://usercentrics.com/guides/website-disclaimers/disclaimer-examples/, jev weight 0.05, weak backing; https://policyforge.co/resources/disclaimer-examples, jev weight 0.10, weak backing), but a disclaimer attached to a copied fragment travels with neither the fragment nor its context. A separate artifact, by contrast, can carry its label in its title, its header, and every number inside it.

## The test for any future artifact

If an illustrative walkthrough is later built, the refresh's rule gives a concrete test: strip every label from the artifact and ask whether any number left could be mistaken for a customer result. If yes, the artifact is not safe to circulate. The same test applies in reverse to measured readouts: remove the evidence-source citations and what remains should be an empty table, because every measured number is only as strong as the named source behind it.

## Relationship to the formula docs

The formula structure doc defines the arithmetic; this doc defines which numbers may enter it. A contribution with an assumed or illustrative value on either side is not a measured contribution, and the readout must not sum it together with measured contributions. The evidence validation rules doc enforces this per input through the named-source rule.
