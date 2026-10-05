# The gate statistic: level_dbc UP, not the audit dbc field

Scope: the gate-statistic correction that refs6 shipped, why the audit's dbc field is not the gate, the claim-8 law behind level_dbc, and what a skip-list is for.

## The correction

Refs6 was the gate-statistic correction of the validated rounds. Before it, the audit's dbc field was being read as the gate. The correction established two facts. First, the audit's dbc field is an L2 share-spectrum distance, and it is negative when the corpus is close to its ideal shape; it is uncorrelated with z. Second, the actual gate is level_dbc = 20*log10(|z|), expressed UP. The audit's dbc field was documented as a different statistic and retired from gating (source doc, refs6 and design decision 3).

## Why a log-decibel form for a gate

The gate statistic is a decibel ratio, and decibels are the standard logarithmic unit for expressing the ratio of two powers: the decibel is a relative unit equal to one tenth of a bel, expressing the ratio of two quantities on a logarithmic scale (https://en.wikipedia.org/wiki/Decibel, w0.843). For amplitude-like quantities the ratio form is 20 times base-10 log of the ratio (https://www.rapidtables.com/electric/decibel.html, w0.412, weak backing). The sibling unit dBc expresses a component's power relative to a carrier, and the same family of log ratios appears wherever a small signal must be judged against a reference level rather than in absolute terms (https://en.wikipedia.org/wiki/DBc, w0.141, weak backing). A gate built on 20*log10(|z|) inherits those properties: it is scale-relative, sign-insensitive through the absolute value, and monotone in |z|.

The L2 connection matters for diagnosis, not gating. In signal processing, L-norms quantify the difference between two signals; the L1-norm is the Manhattan distance and the L2-norm the Euclidean distance (https://en.wikipedia.org/wiki/Similarity_(signal_processing), w0.670). The audit's dbc field lives in that family: an L2 distance over the share spectrum. Its trap is direction: being close to the target makes the distance small or negative, so reading it as a "level" gate inverts the verdict. Distance-to-target and level-above-threshold are different statistics, and a gate must pick one.

## The claim-8 law and uncorrelatedness

The gate form comes from the verify_claims.py claim-8 law, which the source doc cites as the authority for level_dbc UP (internal, not web-weighted). The empirical claim behind the correction is that the audit dbc field and z are uncorrelated, so no monotone transform of the dbc field can substitute for a gate on z. This is the standard structure of statistical signal detection: detecting a difference between populations against a null requires a statistic whose null behavior is characterized, not a proxy that happens to sit in the same output object (https://www.songxichen.com/Uploads/Files/Publication/Statistical_Inference_for_High_Dimensional_Means__A_Surve, w0.809).

## Consequences that shipped with the fix

Refs6 did not just change the formula. It shipped three supporting changes:

1. A lens skip-list, so entries the lens cannot measure do not pollute the gate input (source doc, refs6).
2. Re-authoring of the frozen task check in-repo, so the gate and its enforcement live together (source doc, refs6).
3. The first corrected-gate round followed immediately in refs7, where the pre-registered revert of refs6's merged keep was itself the round's keep (source doc, refs7). A gate correction that survives its own pre-registered revert test is the strongest validation a statistic change can get.

## The general lesson

Audit pipelines accumulate fields, and fields acquire meanings by usage rather than by definition. Before any field becomes a gate, document what it measures, how its sign behaves near the target, and which law derives it. A statistic that is negative when things are good and uncorrelated with the variable you care about is a diagnostic, not a gate. The unit-round flow treats this distinction as load-bearing because the keep decision (doc 07) is only as good as the statistic it reads.
