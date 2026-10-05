# Hardware Cost Sourcing Tiers

Scope: the three procurement tiers for hardware cost in the ROI formula, the reference figures attached to each, and the rule that the tier must be declared by the customer and arrangement rather than assumed.

## The three tiers

The refreshed model defines three cases for the root-of-trust hardware line item (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md):

1. yubiOS supplies keys: use the per-unit cost from the enterprise or bulk quote behind the arrangement, and record the quote date and volume tier.
2. Customer supplies keys through their own Yubico or reseller relationship: use the customer's own per-device cost, which may be enterprise-tier if they procure at volume or retail-tier if they buy ad hoc.
3. No cost data exists, the default for an early-stage pilot: use the retail floor as a conservative default.

## The two reference figures

The model carries two reference figures, both inherited from earlier yubiOS worksheets. The $25 per-device floor reflects a Yubico enterprise or volume quote, as used in the OMN-84 pilot collateral worksheet (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). The $58 to $85 US retail range comes from the OMN-80 benchmark set. The model's rule is explicit: the $25 figure is a real number from a different transaction type and must not be used as a generic assumption without a quote behind it; when no cost data exists, the retail floor is the conservative default.

## Both channels exist and are verifiable

The external record supports the existence and separation of the two channels. On the enterprise side, Yubico documents purchasing models for business customers, including license and entitlement structures sold under subscription (https://docs.yubico.com/cloud-services/yubienterprise/delivery/Modes_of_Purchase.html, jev weight 0.14, weak backing despite being official vendor documentation), and markets streamlined YubiKey distribution and deployment for enterprise organizations (https://www.yubico.com/products/, jev weight 0.70, authoritative) plus a YubiKey as a Service offering positioned as enterprise-grade for global workforces (https://www.yubico.com/products/yubikey-as-a-service/, jev weight 0.70, authoritative). On the retail side, Yubico sells the YubiKey 5 NFC directly from its official product page (https://www.yubico.com/product/yubikey-5-nfc/, jev weight 0.76, authoritative), operates a public storefront (https://www.yubico.com/store/, jev weight 0.34, weak backing), and the same product is listed on Amazon's retail marketplace (https://www.amazon.com/Yubico-YubiKey-USB-Authentication-Security/dp/B07HBD71HL, jev weight 0.59, authoritative).

## What the external pages do not confirm

None of the collected external pages confirms the specific dollar figures. The official product and store pages list the products but the collected snippets do not state prices, so the $25 and $58 to $85 figures remain model-internal reference points sourced from yubiOS worksheets, and both carry the sourcing caveat above. Before any pilot uses them, the working number should be re-anchored: either to a live quote with a date and volume tier (tier 1 or 2) or to the current retail price on the official product page (tier 3). This re-anchoring discipline is the point of the tier system: the formula's output is interpretable only if every reader knows which transaction type each input came from.

## Why the model refuses a single blended price

Per-unit hardware cost varies substantially with transaction type, which is why the refreshed model requires the customer and arrangement to declare the tier rather than letting the model pick one number (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). A blended price would be arithmetically valid and analytically meaningless: an enterprise quote at volume and an ad hoc retail purchase are different cost worlds, and a pilot readout that mixed them would overstate or understate the hardware line item by a factor rather than a rounding error.

## Recording rule

The data-collection spec records, per pilot: which tier applied, the per-unit figure used, and for tier 1 the quote date and volume tier. A figure without a recorded tier is treated as missing data and triggers the conservative retail default, not an invented average.
