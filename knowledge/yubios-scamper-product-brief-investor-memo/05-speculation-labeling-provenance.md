# 05. Keeping speculation clearly labeled

Scope: Provenance capture for LLM-generated artifacts: labeling ideation output as non-canonical, preserving source threads verbatim, and the operational pattern that keeps speculation from hardening into fact.

## The risk being managed

Language models generate factually incorrect or misleading information, and in high-risk domains such as tax and audit services these risks carry serious consequences, which is why deployment guidance treats hallucination as a first-class risk to be managed rather than a bug to be patched (https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/technical/documents/ey-gl-managing-hallucination-risk-in-llm-deployments-01-26.pdf, jev weight 0.80, authoritative). A common mitigation assumption is oversimplified: enterprises often assume that connecting internal documents to retrieval (RAG) is sufficient to mitigate hallucination risk and ensure evidence-based responses, but that assumption overlooks the remaining failure modes (https://www.sciencedirect.com/org/science/article/pii/S1526149226001906, jev weight 0.79, authoritative).

For ideation workflows specifically, the failure mode is not usually fabrication of facts but hardening of speculation: an LLM's confident-sounding market estimate or product framing gets copied into a later document, loses its "this was generated in a 20-minute ideation thread" label, and starts being cited as if it were researched. The defense is provenance discipline applied at capture time, not review time.

## The non-canonical artifact pattern

The operational pattern that works has four rules:

1. Label the class, not just the date. The artifact's header should state what kind of document it is (an external ideation capture, not a positioning document) and which documents are canonical for overlapping claims. This is a stronger statement than a disclaimer footnote because it tells a future reader where to check.
2. Preserve the generative thread. Record which tool and model produced the output, when, and in which prompts, so the artifact's provenance chain is inspectable later. The same evaluation discipline used for AI-generated content in research applies: output may include inaccurate information ranging from missing information to fabricated citations and sources (https://libguides.northwestern.edu/ai-tools-research/evaluatingaigeneratedcontent, jev weight 0.57, authoritative).
3. Defer to canonical docs at every overlap. Where the ideation artifact overlaps existing canonical documentation, the canonical doc wins, and the artifact keeps only what it adds or reframes. This rule is what makes it safe to keep ideation output at all.
4. Gate external use on re-verification. Before any language from the artifact is lifted into external materials, named claims must be re-anchored to primary sources. Practitioner workflows for verifying AI-generated answers converge on the same steps: isolate the factual claims, check the citations, trace important claims to original sources, compare independent evidence, verify dates and statistics, and document the results (https://aofirs.org/articles/fact-checking-ai/, jev weight 0.07, weak backing; https://discoverai.tools/articles/how-to-verify-ai-research-and-citations, jev weight 0.14, weak backing).

## Why citations themselves need the same treatment

Fabricated references are their own sub-risk: researchers describe "phantom references", synthetic bibliography entries that look plausible but do not exist, and propose a multi-point audit to verify citations before use (https://www.thesishuman.com/blog/verify-ai-generated-citations-research-paper, jev weight 0.07, weak backing). The general lesson generalizes to business artifacts: a market number attributed to "Gartner" without a report name, date, or figure is structurally identical to a phantom reference. Testing regimes for LLM output treat hallucination detection as a measurable property of the system, not an occasional accident (https://www.bugraptors.com/blog/llm-output-evaluation-hallucination-detection, jev weight 0.37, weak backing), and enterprise risk frameworks treat grounding, measurability, and auditability as the design goals for AI-assisted workflows (https://dextralabs.com/blog/llm-hallucinations-enterprise-ai-risks-control/, jev weight 0.19, weak backing).

## Applied to this corpus's source material

The source artifact for this corpus demonstrates the pattern end to end: it is an external LLM ideation thread (5 prompts, one session, timestamps recorded), explicitly marked as not the canonical positioning document, with every overlapping claim deferred to the named canonical docs, and with its market-sizing numbers flagged as paraphrases that must be re-anchored to specific analyst reports before any external use (see doc 06). The one structural weakness worth noting: the artifact's value-add items (the mind map, the ranked shortlist, the swap-round exercise) are the parts it keeps verbatim, which is the correct split between preservation and deference.

## Caveats for corpus readers

The two authoritative sources in this subtopic's dig are about hallucination risk in enterprise LLM deployments and about evaluating AI-generated content for research; the specific four-rule pattern above is a synthesis of those risks into workflow, and the supporting workflow sources are weakly backed practitioner blogs. Treat the pattern as craft with grounded motivation, not as a validated protocol.
