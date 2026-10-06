# 05 - Offer and pricing architecture

Scope: the seven priced and unpriced offers the planning document proposes, their launch prices and launch gates, the revenue priority ordering, and the rule that the open-source operating system itself carries no per-device royalty.

## The seven offers

The source doc (yubi-OS/yubiOS docs/PLAN.md) frames the table as launch hypotheses for customer discovery, to be tested through paid pilots and changed based on measured support cost and willingness to pay (source doc):

| Offer | Public starting price | Launch gate |
|---|---|---|
| Community | $0 | Available throughout pre-launch with current warnings |
| Design-partner pilot | $35,000 to $75,000 fixed fee | Technical Preview |
| Assured Fleet subscription | $600/node/year; $25,000 annual minimum | Supported Pilot |
| Regulated / air-gapped assurance | $1,200/node/year; $75,000 annual minimum | General Availability and support coverage |
| Managed fleet operations | +$240/node/year; $15,000 annual minimum | After a secure, self-hostable management protocol exists |
| Board or appliance enablement | $100,000 to $250,000 NRE; $25,000 to $75,000/model/year maintenance | Board-specific proof and contract review |
| Private training | $20,000/cohort or $2,500/seat | Technical Preview |

What the buyer receives differs by offer: the design-partner pilot buys a 6 to 10 week scoped evaluation with deployment design, recovery exercise, evidence report, and a measured operator-time baseline; Assured Fleet buys a supported stable channel, lifecycle policy, business-hours cases, advisories, compatibility matrix, release evidence, and update/rollback and recovery runbooks; regulated assurance adds offline bundles, enhanced evidence, a designated technical owner, 24x7 P1 response when staffing exists, and a quarterly recovery exercise; managed fleet operations add hosted rollout rings, fleet inventory, policy/evidence export, and health and update orchestration; board enablement covers bring-up, firmware-chain validation, test automation, update lifecycle, and evidence; training covers operator enrollment, recovery, release verification, and incident and update drills (source doc).

## No royalty on the OS itself

There should be no per-device royalty for the right to use the open-source operating system. Hardware and OEM revenue should pay for engineering, validation, certification maintenance, and support (source doc). This keeps the pricing architecture consistent with the covenant (doc 04): the paid layer sells operation and accountability, never access.

## Revenue priority

The source doc ranks revenue streams (source doc):

1. Annual assurance subscriptions.
2. Fixed-scope implementation and board enablement that can become reusable product capability.
3. Managed fleet operations.
4. Training and recovery exercises.
5. Grants and sponsorships for explicitly public work.

Grants are useful but should not be treated as recurring customer revenue. Sponsorship must never buy undisclosed roadmap control, favorable vulnerability handling, or an endorsement (source doc).

## Directional pricing anchors

The source doc's external-benchmarks section supplies anchors it explicitly labels directional, not evidence of comparable scale (source doc): SUSE Linux Enterprise Server public pricing lists $799/year for standard and $1,299/year for priority support, and Grafana's public pricing starts its enterprise offering at a $25,000 annual commitment. Both are cited from the source doc's section 13.

The dig for this subtopic added current primary anchors with weights:

- Red Hat publishes a subscription guide describing how RHEL subscriptions work (https://www.redhat.com/en/resources/red-hat-enterprise-linux-subscription-guide, noul 0.90) and sells subscriptions through its public store (https://www.redhat.com/en/store/linux-platforms, noul 0.55). These confirm the per-node subscription model the source doc's $600/node/year price competes against (source doc for the yubiOS price).
- Third-party pricing benchmark material exists (https://opensourcelicenserisk.com/commercial-licensing/commercial-open-source-pricing-benchmarks, noul 0.15, weak backing) but is aggregator-grade; the per-node anchors above and the source doc's own benchmark section carry the load.

## How pricing ties to the gates

Every offer except Community carries a launch gate drawn from the readiness-gate ladder in doc 06: pilots need Technical Preview, Assured Fleet needs Supported Pilot, regulated assurance needs General Availability plus support coverage, and managed fleet operations need the self-hostable management protocol. The pricing table is therefore not a price list alone; it is the commercial expression of the evidence gates (source doc).

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), sections "4. Offer and pricing architecture" and "13. External benchmarks and sources".
- https://www.redhat.com/en/resources/red-hat-enterprise-linux-subscription-guide (noul 0.90)
- https://www.redhat.com/en/store/linux-platforms (noul 0.55)
- https://opensourcelicenserisk.com/commercial-licensing/commercial-open-source-pricing-benchmarks (noul 0.15, weak)
