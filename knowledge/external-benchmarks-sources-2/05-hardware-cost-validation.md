# Hardware cost validation

Scope: live retail price validation for YubiKey 5 Series (US and EU store pricing), the checkable number discipline, and the unreconciled 25 dollar worksheet floor flagged to its owner rather than silently corrected.

## Why this benchmark is different

Most benchmarks in the register are forecasts or study results that cannot be rechecked at will. Retail price is the opposite: it is live, checkable in minutes, and changes without notice. The register's cadence for this benchmark reflects that: check before every pricing conversation with a design partner, not on an annual schedule.

## The primary sources

The authoritative source is Yubico's own store. This pass weighted the store pages as primary sources:

- US YubiKey 5 Series store page (https://www.yubico.com/store/yubikey-5-series/, weight 0.6641, primary).
- Yubico store root, US (https://www.yubico.com/, weight 0.7802, primary) and general store listing (https://www.yubico.com/store/, weakly backed, weight 0.3834).
- Yubico EU store root and 5 Series page (https://www.yubico.com/de/store/, weight 0.8115, primary; https://www.yubico.com/de/store/yubikey-5-series/, weight 0.7468, primary).

The register's recorded figures from its 2026-07-26 retrieval against these same pages: YubiKey 5 Series US pricing from 58 USD (YubiKey 5 NFC, 5C NFC) to 85 USD (YubiKey 5Ci); EU pricing with VAT included from EUR 70.18 to EUR 102.85. The store page snippets in this pass confirm the 5 Series line as the store's hardware offering but the snippets do not display per model prices, so the dollar figures remain register-carried from the dated retrieval, not re-verified in this mint. Anyone using them should treat the store page as the citation of record and recheck at time of use.

Third party retail exists but is weaker backing: a Czech retailer listing Yubico products (https://www.alza.cz/pocitace-a-notebooky/yubico/18890188-v10060.htm, weakly backed, weight 0.3856) and a specific 5Ci listing (https://www.alza.cz/yubikey-5ci-d7077644.htm, weight 0.5061), an Austrian official partner shop (https://www.yubikey-shop.at/en/products/yubikey-5c-nfc, weakly backed, weight 0.4373), and marketplace storefronts (https://www.walmart.com/brand/yubico/10071827, weakly backed, weight 0.1028; https://www.amazon.com/stores/Yubico/page/4D0F1EA8-F95F-47F3-8EE3-11763218C249, weakly backed, weight 0.1501). These are useful only as cross checks; marketplace pricing includes third party markups and should never be the citation of record.

## The 25 dollar floor flag

The register carries an unresolved reconciliation item: a worksheet in the pilot collateral plan used a 25 dollar YubiKey hardware cost floor. Two consecutive register passes (2026-07-25 and 2026-07-26) found the same official retail floor of 58 USD and could not find any 25 dollar point in official retail. The register's discipline here is explicit: flag, do not silently correct. The worksheet owner must either produce a source for the 25 dollar figure (a bulk or enterprise quote not visible to the register) or correct the worksheet. Two passes agreeing on 58 USD means the flag is now borderline stale and an owner reply is overdue; the next pass should escalate rather than carry it forward a third time.

## The discipline

This benchmark demonstrates three rules that generalize across the register:

1. Prefer the primary, live source when one exists. The store page beats every aggregator, and its weight (0.66 to 0.81) reflects that.
2. Date every retrieval. A price without a retrieval date is unusable because the check cannot be repeated against the same state.
3. Flag unreconciled numbers to a named owner instead of editing them away. Silent correction hides the disagreement; a flag preserves the audit trail and forces resolution.

## Boundary

The retail price supports the per device hardware cost line in an ROI worksheet. It does not include the product's own software or support costs, and it does not confirm bulk or enterprise pricing, which the register has never verified.
