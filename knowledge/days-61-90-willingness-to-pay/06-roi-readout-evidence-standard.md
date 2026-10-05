# 06: The ROI Readout and Its Evidence Standard
Scope: Building the confidential customer ROI readout: baseline worksheet comparison, honest reporting of misses, and the evidence standard distinguishing measured results from projections.

## The readout is a comparison, not a story

The days-61-90 plan specifies a confidential customer ROI readout structured as the measured pilot metrics versus the ROI baseline worksheet from the days 0-30 collateral, stated honestly including any metric that came in worse than projected (session source doc, internal). The comparison structure is the evidence standard: every number in the readout is either measured with a named instrument (doc 04) or explicitly labeled as projected. A readout that mixes the two silently is dishonest even when every individual number is true.

Baseline discipline is the prerequisite: you cannot measure improvement without a baseline, and most pilots skip or defer it; capture baseline data before day one, even with a simple self-reporting log (resources.rework.com/guides/ai-team-readiness/running-ai-pilot-programs, w=0.43, weak backing). For a first pilot the baseline worksheet is the pre-registered projection, which makes honest variance reporting possible: the readout can say deployment took 40 percent longer than projected without ambiguity.

## Metric architecture for the readout

A workable structure from the AI-pilot literature: one primary metric the pilot aimed to move, two supporting metrics that explain it, and one guardrail metric that must not get worse (howtoai.com/ai-pilot-baseline-metrics/, w=0.25, weak backing). Mapping the six measured metrics into that shape: deployment hours and update or rollback success are primary; operator training and recovery time are supporting; support load is the guardrail. Secondary metrics get specific targets set in advance (abmatic.ai/blog/abm-pilot-program-playbook-2026, w=0.24, weak backing), so the readout reports against thresholds fixed before the pilot, not against post-hoc expectations.

## Honest reporting of misses

The plan's instruction to include metrics that came in worse than projected is the operational content of the honesty standard (session source doc, internal). The failure mode this guards against is the pilot that proves a model rather than a production-ready business process; most AI pilots fail because they prove the technology, not the process, and ROI discipline is what separates the two (justthink.ai/blog/ai-pilot-to-production-governance-roi, w=0.29, weak backing). A readout that hides misses survives until the customer's own operators compare notes with reality; a readout that reports misses buys credibility for the misses that matter.

ROI methodology for pilots converges on the same discipline: define the measurement framework before the pilot, align ROI with strategic business objectives, and measure against it after (unframe.ai/blog/how-to-measure-ai-pilot-roi, w=0.21, weak backing). Conservative ROI modeling for pilot decisions is its own skill; an example model for project-based B2B service teams walks through owner, delivery, and finance views (marginlayer.app/blog/pilot-roi-metrics-example.html, w=0.21, weak backing).

## Confidentiality boundary

The ROI readout is for the pilot customer only (session source doc, internal). The public artifact is a separate, bounded case study, covered in the decision and case-study discipline of docs 03 and 07. Report templates exist in volume for B2B reporting (portermetrics.com/en/report-templates/b2b/, w=0.35, weak backing), but a template is formatting; the readout's substance is the measured-versus-projected table with named instruments.

## The day-90 use of the readout

The readout is the input to the four-path decision (doc 07). It is also the input to revisiting OMN-79, the decisions and deferrals record, after the pilot lands new evidence (session source doc, internal). Both uses require the readout to be a factual record: numbers with provenance, misses stated, projections labeled. The evidence-preparation metric in doc 04 exists precisely because assembling this readout honestly takes real time, and that cost recurs for every future customer.

## Evidence standard for this doc

The confidential readout structure and honesty standard are internal to the yubiOS source doc. External corroboration on baseline capture, metric architecture, and pilot-to-production ROI discipline carries weak backing (jev weight below 0.5). The single high-weighted result in this doc's dig (opengovpartnership.org, w=0.65) is a challenge tracker unrelated to ROI readouts and is not cited for any claim here.
