# Claim Boundaries for External Use

Scope: the four boundaries any external ROI citation must respect, with the regulatory and consent grounding behind each.

## The four boundaries

The refreshed model sets four boundaries for external use (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md):

1. Never present a single-pilot ROI figure as a general claim about what customers save with yubiOS; it is that one customer's measured result under their specific baseline and pilot scope.
2. Never publish a customer's baseline cost or internal rate data externally without their explicit permission, per the confidential-readout structure in the OMN-67 days 61-90 plan.
3. Any bounded public case study derived from the model must state pilot scale (fleet size), duration, and that the baseline is one customer's self-reported figures, not an independently audited number.
4. Do not aggregate ROI across multiple pilots into an average until there are enough pilots for the average to be meaningful; the model deliberately does not set a minimum n.

## Boundary 1: no generalization from one pilot

The FTC's Endorsement Guides state the governing principle directly: "The Guides, at their core, reflect the basic truth-in-advertising principle that endorsements must be honest and not misleading" (https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking, jev weight 0.90, authoritative). The full guides are administrative interpretations of laws enforced by the FTC (https://www.ftc.gov/sites/default/files/attachments/press-releases/ftc-publishes-final-guides-governing-endorsements-testimonials-16cfr255.pdf, jev weight 0.95, authoritative). Turning one customer's result into a general savings claim fails that principle twice: it overstates what the evidence shows and it hides the conditions the result depended on.

## Boundary 2: customer data stays confidential without permission

Consent doctrine for case studies supports the permission requirement. Legal guidance on publishing client case studies treats consent as the gate: publishing client case studies and testimonials can be helpful for demonstrating expertise, but the client's agreement is what makes it permissible (https://www.lexisnexis.co.uk/legal/guidance/do-i-need-consent-to-publish-client-case-studies-on-my-website, jev weight 0.61, authoritative). Case-study release forms operationalize the same requirement in standard practice: before writing and publishing a case study, secure the client's consent (https://thecasestudycopywriter.com/wp-content/uploads/docs/case-study-release-form.pdf, jev weight 0.16, weak backing). Adjacent professional fields use the same mechanism; clinical case reporting requires an explicit consent form before publication of a patient's case (https://www.clinicalcasereporting.com/wp-content/uploads/2020/11/case-report-constent-form-en.pdf, jev weight 0.25, weak backing). Baseline cost figures and internal hourly rates are commercially sensitive data, so the bar is explicit permission, not silence.

## Boundary 3: the case-study disclosure set

A bounded public case study must carry three facts: fleet size, duration, and the self-reported status of the baseline. This is the substantiation rule applied to a narrative. The endorsement rule requires substantiation for any performance claims conveyed by the endorsement (16 CFR 255.2, https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255/section-255.2, jev weight 0.97, authoritative), and a savings story is a performance claim. Stating the pilot scale and duration tells the reader what the claim does and does not cover; stating that the baseline is self-reported tells the reader how much weight the subtraction arithmetic can bear.

## Boundary 4: no premature aggregation

The fourth boundary defers to statistics: an average across pilots needs enough pilots to be meaningful, and the model leaves the minimum n to whoever runs the second and third pilot (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). The pilot aggregation statistics doc covers the evidence behind that caution.

## The boundary discipline in one sentence

Every external ROI statement names its customer, its pilot scope, and its evidence status, or it does not ship. The measured-versus-illustrative doc supplies the label vocabulary; the evidence validation rules doc supplies the named-source chain; this doc draws the line at which statements leave the building at all.
