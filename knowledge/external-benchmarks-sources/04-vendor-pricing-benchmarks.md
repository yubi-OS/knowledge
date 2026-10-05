# 04 - Vendor pricing as a live, checkable benchmark

Scope: live, checkable vendor retail pricing (YubiKey 5 Series) as the strongest class of hardware-cost benchmark and its refresh discipline.

## Why retail pricing is a different class of benchmark

Market-size forecasts are uncheckable between vendor refreshes; a vendor's own store price is checkable in seconds at any moment. That makes per-unit hardware pricing the strongest benchmark class in the external-benchmarks set: primary source, point-in-time verifiable, and directly usable in an ROI worksheet's hardware cost line.

The primary sources are Yubico's own pages: the YubiKey 5 Series store page (https://www.yubico.com/store/yubikey-5-series/, weight 0.84) and per-product pages such as the YubiKey 5Ci product page (https://www.yubico.com/product/yubikey-5-series/yubikey-5ci/, weight 0.81). The corporate home page (https://www.yubico.com/, weight 0.81) confirms the vendor stands behind the catalog. The internal reference doc records, as of its 2026-07-25 retrieval: official Yubico US store pricing for YubiKey 5 Series ranging from $58 (YubiKey 5 NFC / 5C NFC) to $85 (YubiKey 5Ci), and EU pricing including VAT from EUR 70.18 to EUR 102.85. Those numbers came from the store pages above; this corpus's dig did not re-fetch the live prices, so any document using the dollar figures should treat them as the 2026-07-25 snapshot and re-check the store page before each pricing conversation, exactly as the reference doc's refresh rule directs.

## What the benchmark supports and what it cannot

The retail range supports the per-device hardware cost line in an ROI worksheet. It does not include the product's own software, support, or integration costs, which are separate line items. It also does not confirm bulk or enterprise pricing: the reference doc explicitly flags that its lower-bound reconciliation problem (a $25 per-device floor recorded in an earlier pilot-collateral worksheet) could not be reconciled against official retail, since the $58 floor at official retail left the $25 figure unsupported by anything found in that pass. The standing rule: retail benchmarks support retail-range claims only; bulk pricing requires a vendor quote, not a search result.

## Secondary price-comparison sources and their weights

Independent reviews and comparisons are useful for context on where a vendor's pricing sits in the category, but they are secondary and age quickly:

- PCMag's tested picks note the YubiKey 5C NFC as durable and versatile across authentication standards and enterprise services (https://www.pcmag.com/picks/best-hardware-security-keys, weight 0.71).
- A comparison guide covers YubiKey vs Titan vs Nitrokey on price, protocols, and phishing resistance (https://itsourcecode.com/cybersecurity/best-2fa-hardware-key-2026-yubikey-titan-nitrokey/, weight 0.40, weak).
- A privacy-focused comparison covers YubiKey, Google Titan, Nitrokey, OnlyKey, and Token2 on protocol coverage and form factor (https://privacystronghold.com/best-hardware-security-key/, weight 0.64).
- A YubiKey vs Nitrokey comparison contrasts proprietary vs open source approaches and compares prices (https://www.holdtag.com/en/blogs/guides-and-tutorials/yubikey-vs-nitrokey-which-to-choose-2026, weight 0.20, weak).
- A security-and-privacy comparison covers YubiKey, Nitrokey, and OnlyKey (https://stateofsurveillance.org/guides/advanced/hardware-security-keys-comparison/, weight 0.56).

Retailer listings (Office Depot at https://www.officedepot.com/a/products/9808238/Yubico-YubiKey-5Ci-Security-Token-RSA/, weight 0.09 weak; Amazon at https://www.amazon.com/Yubico-Two-Factor-authentication-connectors-Certified/dp/B07WGJ1DNJ, weight 0.05 weak) show street prices that may differ from official retail through discounts or third-party sellers. For an ROI worksheet, official retail is the defensible number; street prices are anecdote.

## Refresh discipline

Pricing is the one benchmark in this set with an event-driven rather than calendar-driven refresh: the reference doc directs a check before every pricing conversation with a design partner, because retail prices can change without notice. Mechanically: open the store page, record the date and the price range observed, and update the citation block with the new snapshot date. A stale price in a pricing conversation is worse than no price, because it anchors the discussion to a number nobody can defend.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| YubiKey 5 Series store page (Yubico) | https://www.yubico.com/store/yubikey-5-series/ | 0.84 |
| YubiKey 5Ci product page (Yubico) | https://www.yubico.com/product/yubikey-5-series/yubikey-5ci/ | 0.81 |
| Yubico corporate home | https://www.yubico.com/ | 0.81 |
| Best hardware security keys (PCMag) | https://www.pcmag.com/picks/best-hardware-security-keys | 0.71 |
| Best hardware security keys (Privacy Stronghold) | https://privacystronghold.com/best-hardware-security-key/ | 0.64 |
| YubiKey vs Nitrokey vs OnlyKey (State of Surveillance) | https://stateofsurveillance.org/guides/advanced/hardware-security-keys-comparison/ | 0.56 |
| Best 2FA hardware key 2026 (itsourcecode) | https://itsourcecode.com/cybersecurity/best-2fa-hardware-key-2026-yubikey-titan-nitrokey/ | 0.40 (weak) |
| YubiKey vs Nitrokey 2026 (holdtag) | https://www.holdtag.com/en/blogs/guides-and-tutorials/yubikey-vs-nitrokey-which-to-choose-2026 | 0.20 (weak) |
| Office Depot 5Ci listing | https://www.officedepot.com/a/products/9808238/Yubico-YubiKey-5Ci-Security-Token-RSA/ | 0.09 (weak) |
| Amazon 5Ci listing | https://www.amazon.com/Yubico-Two-Factor-authentication-connectors-Certified/dp/B07WGJ1DNJ | 0.05 (weak) |
| Amazon.ca 5C NFC listing | https://www.amazon.ca/Yubico-Authentication-Security-Supported-Accounts/dp/B08DHL1YDL | 0.13 (weak) |
| Westlake Ace Hardware (off-topic) | https://www.acehardware.com/store-details/03878 | 0.03 (weak) |
