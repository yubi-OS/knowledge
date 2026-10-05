# 03. AI text detector failures

Scope: The documented failure record of AI-text detectors as products and as marketing claims: the OpenAI classifier shutdown, the Writer detector sunset, and the FTC enforcement action against Workado's Content At Scale accuracy claims.

## The OpenAI classifier shutdown

OpenAI released its AI Classifier for indicating AI-written text in early 2023, publishing it as a research artifact rather than a product [w=0.551] (https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/). In July 2023 OpenAI discontinued it, citing a "low rate of accuracy". Ars Technica covered the shutdown as the model maker itself declining to ship its own detector [w=0.582] (https://arstechnica.com/information-technology/2023/07/openai-discontinues-its-ai-writing-detector-due-to-low-rate-of-accuracy/); Search Engine Land recorded the same retirement with the stated reason [w=0.438, weak] (https://searchengineland.com/openai-ai-classifier-no-longer-available-429912).

The structural lesson: even the company that produced the underlying models could not ship a text detector accurate enough to keep up. A blocking gate whose decision depends on text detection inherits that fragility for free.

## The FTC v. Workado finding

The strongest documented case that accuracy claims in this space are regulator bait is the FTC's case against Workado, LLC, d/b/a Content At Scale. The FTC's complaint is a primary source: it alleges the advertised 98.3 percent accuracy was not supported, with internal testing showing near-coin-flip performance on non-academic content [w=0.889] (https://www.ftc.gov/system/files/ftc_gov/pdf/ContentatScaleAI-Complaint.pdf). The FTC's case docket for the matter is on the official legal-library page [w=0.860] (https://www.ftc.gov/legal-library/browse/cases-proceedings/2323092-content-scale-ai), and the FTC approved a final order against Workado in August 2025, which the agency announced directly [w=0.811] (https://www.ftc.gov/news-events/news/press-releases/2025/08/ftc-approves-final-order-against-workado). Independent coverage of the settlement is corroborating but secondary [w=0.638] (https://truthinadvertising.org/articles/workado-settles-ftc-complaint-challenging-ai-detection-claims).

The regulatory consequence is direct: claims about AI-detection accuracy are now an FTC exposure, not just an engineering problem. Any browser gate that labels content as AI-generated on classifier evidence alone must treat its accuracy claims as consumer-facing representations.

## The Writer sunset

Writer.com, an enterprise AI-writing platform, sunset its own AI content detector in December 2025. This record comes from a secondary aggregator page [w=0.186, weak] (https://metegpt.com/writer-com-ai-detector) and is carried here only as a weakly-backed corroboration of the pattern that detector products in this space keep being retired; the OpenAI and Workado records above carry the load.

## What it means for a provenance-gated browser

Three design rules fall out of this failure record:

1. Never make a text detector load-bearing. If text watermark or style detection contributes to a block decision at all, it must be one signal among several, overridable, and below a confidence floor.
2. Confidence floors and user overrides are not optional UI polish; they are the compliance posture the FTC case implies.
3. Provenance is the escape hatch. A signed manifest is not a classifier output; it does not rot with the next model generation and its accuracy is not a marketing claim. The failure record here is the argument for why the gate's hard evidence should be provenance, with detection reserved for flagging.

## Sources

- https://www.ftc.gov/system/files/ftc_gov/pdf/ContentatScaleAI-Complaint.pdf [w=0.889]
- https://www.ftc.gov/legal-library/browse/cases-proceedings/2323092-content-scale-ai [w=0.860]
- https://www.ftc.gov/news-events/news/press-releases/2025/08/ftc-approves-final-order-against-workado [w=0.811]
- https://truthinadvertising.org/articles/workado-settles-ftc-complaint-challenging-ai-detection-claims [w=0.638]
- https://arstechnica.com/information-technology/2023/07/openai-discontinues-its-ai-writing-detector-due-to-low-rate-of-accuracy/ [w=0.582]
- https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/ [w=0.551]
- https://searchengineland.com/openai-ai-classifier-no-longer-available-429912 [w=0.438, weak]
- https://metegpt.com/writer-com-ai-detector [w=0.186, weak]
