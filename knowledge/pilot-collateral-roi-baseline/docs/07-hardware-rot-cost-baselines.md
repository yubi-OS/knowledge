# 07. Hardware root-of-trust cost baselines

**Scope:** hardware root-of-trust cost baselines usable as ROI worksheet inputs: discrete security key pricing, TPM versus separate hardware keys, and credential compromise response cost.

## What the worksheet may and may not assert

The ROI worksheet's hardware-cost line item has one vendor-assertable number: the list price of the security key hardware. Everything else (what the customer currently spends, what an incident costs them) is customer-provided. The sources below give the hardware-side figures and their caveats; the customer-side blanks stay blank.

## Security key hardware pricing

Yubico's enterprise documentation describes purchasing models for YubiKeys at scale: subscription purchase of product tiers or non-subscription perpetual outright purchase, procured and distributed as part of a managed program (weight 0.30, weak backing: docs.yubico.com, https://docs.yubico.com/cloud-services/yubienterprise/delivery/Modes_of_Purchase.html). Consumer comparison sources place specific models in the tens of dollars: one review prices the YubiKey 5C NFC at $58 (weight 0.06, weak backing: criticnest.com, https://criticnest.com/best-yubikey/), and an FIPS-focused comparison reports Yubico's YubiKey 5 FIPS Series as FIPS 140-3 validated under certificate #5291, running firmware 5.7.4, with enterprise keys spanning a price gap it puts at $102 between vendors (weight 0.07, weak backing: tech-insider.org, https://tech-insider.org/yubikey-5-fips-vs-titan-vs-feitian-security-keys-2026/).

Template rule: the worksheet's hardware line may cite the catalog's price range as a hypothesis range (weight all below 0.5 for these specific figures, weak backing throughout), with the actual per-device cost confirmed at purchase time from the vendor's own store. Per-device cost is the only number in the entire worksheet that is public and stable enough to pre-fill, and even it is marked "confirm at order".

## TPM and embedded roots of trust as the comparison baseline

The worksheet's baseline column asks what the customer currently spends on their root-of-trust approach: a discrete TPM on the platform, an OEM secure enclave, or nothing. The web dig for this topic returned no primary-source cost model for embedded TPM deployment (maintenance, provisioning, and incident handling differ fundamentally from discrete-key models), so the worksheet treats the baseline as customer-provided by construction. This is the honest state: no cited source in this corpus supports asserting an industry-average TPM cost, so none is asserted.

## Credential compromise cost as context, not as a worksheet value

Incident-cost research provides context for why incident response time is a worksheet line item at all. A 2026 aggregation citing the Ponemon Cost of Insider Risks report puts the average cost of a credential-theft incident at $779,000 per event, up 15 percent year over year, the most expensive insider-risk category ahead of malicious insider events at $715,000 and negligent insider events at $677,000 (weight 0.30, weak backing: incidentcost.com, https://incidentcost.com/causes/credential-theft-incident-cost). A benchmarks page lists the underlying published sources it aggregates: IBM's Cost of a Data Breach Report, Ponemon Institute Cost of Insider Risks, Verizon DBIR, Atlassian incident management research, and PagerDuty incident surveys (weight 0.20, weak backing: incidentcost.com, https://incidentcost.com/2026-benchmarks). A breach-cost analysis frames password-related controls as high-ROI security investment combining breach risk reduction, insurance premium savings, and incident response cost avoidance (weight 0.43, weak backing: hhfri.org, https://hhfri.org/research/password-related-breach-cost-analysis-2026/). Stolen-credential statistics position stolen credentials as the top breach entry point, with cost, dwell-time, and attack-economics data (weight 0.24, weak backing: deepstrike.io, https://deepstrike.io/blog/compromised-credential-statistics-2025).

These figures are context for the conversation, never worksheet values. The worksheet's incident-response line records the customer's own baseline and the pilot's own measured response times; the published industry figures appear only as "for context, published aggregates put credential-incident costs in the hundreds of thousands of dollars" with their weak-backing label intact.

## How the line items assemble

1. Hardware cost: hypothesis range from the key vendor's public pricing, confirmed at order.
2. Current root-of-trust cost: customer-provided in discovery.
3. Incident response time for a compromised credential: customer-provided baseline, pilot-measured during the pilot.
4. Device enrollment time: customer-provided baseline, pilot-measured from enrollment logs.
5. Audit evidence production time: customer-provided baseline, pilot-measured by timing evidence retrieval.

The worksheet's integrity rule holds across all five: every number carries its source, and no number in the baseline column is vendor-invented.
