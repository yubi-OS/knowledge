# prior-art-ai-content-blocking-browser

Prior art for AI-content-blocking browsers: search-layer and extension-layer AI image/content filters, their failure modes, and the landscape a provenance-gated browser enters. Minted 2026-10-05 from yubi-OS/yubiOS `refs/prior-art-ai-content-blocking-browser-2026-09-30.md`.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-search-layer-ai-filters.md](01-search-layer-ai-filters.md) | DuckDuckGo's shipped hide-AI-images filter, the noai search surface, blocklist mechanics, and its rejection of per-image classifiers on cost and latency. |
| 02 | [02-extension-layer-ai-filters.md](02-extension-layer-ai-filters.md) | The extension-layer field: AI Content Shield, AI Blocker, Is Generated, and the adjacent feature-blocker and agent-detector categories. |
| 03 | [03-ai-text-detector-failures.md](03-ai-text-detector-failures.md) | The text-detector failure record: OpenAI classifier shutdown, Writer sunset, and the FTC v Workado accuracy findings. |
| 04 | [04-detection-extension-maintenance.md](04-detection-extension-maintenance.md) | The Mozilla Deep Fake Detector retirement as the maintenance-death case for detection add-ons. |
| 05 | [05-community-blocklists.md](05-community-blocklists.md) | The uBlock/uBlacklist anti-AI list substrate, its curation models, and its site-level structural limits. |
| 06 | [06-c2pa-security-analysis.md](06-c2pa-security-analysis.md) | The formal-methods security analysis of C2PA: timestamp disagreement, cert revocation, exclusion ranges, conformance gaps. |
| 07 | [07-provenance-academic-and-browser.md](07-provenance-academic-and-browser.md) | Academic provenance work (ICWSM trust study) and the Digimarc C2PA extension as closest provenance-in-browser prior art. |
| 08 | [08-engine-layer-gap-and-allow-side.md](08-engine-layer-gap-and-allow-side.md) | Why no engine-layer gate shipped, the Chromium disclosure-attribute signals, and the allow-side enforcement gap. |

## Research summary

- Results collected: 96 (16 queries, 2 per subtopic, top 6 kept per query)
- Weight split: 45 authoritative (>= 0.5) / 51 weak (< 0.5)
- Jev requests: 22 (1 preflight probe, 1 outline validation, 20 weighting batches), usage 17136 input / 0 output tokens
- Redo counts: 0 dig redos; 1 transient HTTP 500 on a weighting batch, retried once per the redo rule and succeeded
- Skipped docs: none. All 8 subtopics dug strong enough to author honestly.
- Weakly-backed records carried with explicit labels: the Mozilla shutdown (primary post-mortem host dead, carried by secondary press), BrowserBlock AI and Valerie (from the source prior-art note, not re-surfaced by the dig), Writer sunset (aggregator), Not By AI badge (own site weighted low), and the two ACM provenance papers (source-note pointers, not dig-verified).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
