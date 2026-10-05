# 08 - Reconciling conflicting numbers without inventing a winner

Scope: reconciling conflicting numbers between internal worksheets and external benchmarks (the stale hardware-cost floor problem) without silently overwriting either.

## The live case study

The corpus's own reference doc contains the textbook case. An earlier pilot-collateral worksheet recorded a YubiKey hardware cost of "$25 to $70 per device." A later benchmark pass against Yubico's official retail store found a $58 floor for the 5 Series and could not reconcile a $25 price point at official retail. The doc's response is the pattern to copy:

1. It does not overwrite the other worksheet. The reconciliation is flagged as an item for that worksheet's owner, "not silently corrected in this doc."
2. It records what the new evidence does and does not show. The retail range found is $58 to $85 US; the doc explicitly notes it cannot tell whether the $25 floor came from a bulk or enterprise quote not visible to that agent or was simply an approximation. The open question is recorded, not guessed at.
3. It leaves the older document's figure standing until its owner revisits it, while making clear the new retail benchmark cannot confirm the lower bound.

The failure mode this avoids is silent divergence: two documents citing different hardware costs with no record of which is current. Reconciliation-practice literature frames persistent cross-report reconciliation effort itself as a symptom of systems producing separate versions of the same truth (https://www.steeleconsult.com/how-to-reconcile-reports/, weight 0.15, weak backing), and data-reconciliation practice describes the process as comparing and matching data across sources to identify and rectify discrepancies (https://www.acceldata.io/blog/data-reconciliation, weight 0.44, weak backing). For a small corpus of business documents, the lightweight version is enough: one canonical benchmark list, every other document citing it or flagging its divergence.

## What the statistics literature says about combining estimates

When multiple estimates of the same quantity exist with different uncertainties, the formal answer is a weighted combination rather than a pick. A peer-reviewed treatment of reconciling multiple conflicting estimates derives that the reconciliation of best guesses is a weighted arithmetic average with weights inversely related to uncertainty (Rodrigues and Lahr, Entropy 2018, https://www.mdpi.com/1099-4300/20/11/815, weight 0.94; also indexed at https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7512377/, weight 0.69, and https://www.semanticscholar.org/paper/The-Reconciliation-of-Multiple-Conflicting-and-Rodrigues-Lahr/27d349b49cab1e04f4856846bdc91bb8e4b86aa0, weight 0.56).

This corpus applies the principle qualitatively, not arithmetically: jev weights are the uncertainty proxies, and the summary of a contested figure is a range whose ends come from the weighted sources, not a point estimate. Where the weights are all below 0.5 (as with the market-research vendors in doc 03), the honest output is a labeled range, never a blended single number pretending to precision. The formal averaging machinery exists for cases with genuine per-estimate uncertainty quantification; market-research snippets do not qualify.

## The reconciliation workflow

1. Detect: any document citing a number not in the canonical benchmark list, or citing a number that contradicts the list, is a reconciliation trigger.
2. Attribute: find where each conflicting figure came from (edition year, scope, source class). Most conflicts dissolve here: a $25 floor and a $58 floor are different sources classes (possibly bulk quote vs retail), not different facts about the same thing.
3. Resolve or flag: if the conflict resolves by attribution, record the attribution. If it does not, write a staleness/reconciliation flag naming the owning document and the specific figure, and leave both documents intact.
4. Never invent: the reference doc's open question about the $25 floor ends by saying it needs the original author or a bulk-pricing inquiry to resolve, "not guessed at here." That sentence is the guardrail. An unresolved conflict is recorded as unresolved; it is never bridged with a plausible number.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| The Reconciliation of Multiple Conflicting Estimates (MDPI Entropy) | https://www.mdpi.com/1099-4300/20/11/815 | 0.94 |
| The Reconciliation of Multiple Conflicting Estimates (PMC) | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7512377/ | 0.69 |
| The Reconciliation of Multiple Conflicting Estimates (Semantic Scholar) | https://www.semanticscholar.org/paper/The-Reconciliation-of-Multiple-Conflicting-and-Rodrigues-Lahr/27d349b49cab1e04f4856846bdc91bb8e4b86aa0 | 0.56 |
| Data Reconciliation Guide (Acceldata) | https://www.acceldata.io/blog/data-reconciliation | 0.44 (weak) |
| RECONCILE definition (Merriam-Webster) | https://www.merriam-webster.com/dictionary/reconcile | 0.48 (definitional only) |
| How to Reconcile Reports (Steele Consulting) | https://www.steeleconsult.com/how-to-reconcile-reports/ | 0.15 (weak) |
| Data reconciliation best practices (Quinnox) | https://www.quinnox.com/blogs/data-reconciliation/ | 0.24 (weak) |
| Data reconciliation across systems (Joineru) | https://www.joineru.com/resources/data-reconciliation-guide.html | 0.20 (weak) |
| The Reconciliation of Multiple Conflicting Estimates (ResearchGate) | https://www.researchgate.net/publication/328484984_The_Reconciliation_of_Multiple_Conflicting_Estimates_Entropy-Based_and_Axiomatic_Approaches | 0.10 (weak) |
| Organizational culture (Wikipedia) | https://en.wikipedia.org/wiki/Organizational_culture | 0.14 (weak) |
| New Age (Wikipedia, off-topic) | https://en.wikipedia.org/wiki/New_Age | 0.08 (weak) |
| Regal Meridian showtimes (off-topic) | https://www.regmovies.com/theatres/regal-meridian-4dx-1931 | 0.81 (off-topic) |
