# 01. Search-layer AI filters

Scope: The shipped search-layer prior art for filtering AI-generated content, centered on DuckDuckGo's "Hide AI-generated images" feature and its dedicated AI-free search surface, and what its engineering tradeoffs teach a provenance-gated browser.

## The shipped feature

DuckDuckGo shipped "Hide AI-generated images" in July 2025, the first browser-adjacent vendor to ship an AI-image filter at the search-results layer. The feature is a settings toggle under Image Search preferences, and DuckDuckGo documents it as a filter applied to image results rather than a detector [w=0.949] (https://duckduckgo.com/duckduckgo-help-pages/results/how-to-filter-out-ai-images-in-duckduckgo-searc). Alongside the toggle, DuckDuckGo runs `noai.duckduckgo.com`, a dedicated search surface that excludes AI-generated images by default [w=0.525] (https://noai.duckduckgo.com/).

The mechanism is blocklist matching, not detection. The filter matches result URLs against the open-source uBlock Origin / uBlacklist Huge AI Blocklist maintained by the community (see doc 05), so the filtering decision is a static list lookup per result, not a per-image classification. Third-party coverage of the launch confirms the blocklist basis and the search-results scope of the feature [w=0.494, weak] (https://www.searchenginejournal.com/duckduckgo-adds-option-to-filter-out-ai-generated-images/551661/) and [w=0.380, weak] (https://petapixel.com/2025/07/21/duckduckgo-can-now-filter-out-ai-images-from-search-results/).

## Why DuckDuckGo rejected per-image classifiers

DuckDuckGo's own engineering writeup is the most load-bearing primary source in this corpus [w=0.731] (https://insideduckduckgo.substack.com/p/duck-tales-why-duckduckgo-built-a). Its stated findings, as recorded in the yubiOS prior-art note this corpus was minted from:

1. Blocklist-only filtering is "playing whack-a-mole": the list can never cover every AI-content site, so coverage decays as new sites appear.
2. The approach will "never be 100% accurate in either direction": both false positives (human images filtered) and false negatives (AI images shown) persist by design.
3. Per-image classifier deployment at scale was rejected on cost and latency grounds: running a classifier against hundreds of millions of daily image results was not viable, and expected accuracy sat in the 80 to 90 percent range at best. The team positioned classifiers as something they may "explore later", not as the shipping mechanism.

This is the closest shipping analog to an AI-content gate anywhere in the browser ecosystem, and it validates two things at once: the blocklist approach is viable enough to ship at a major consumer search engine, and its ceiling is a known, admitted limitation that the vendor itself describes as unsatisfying.

## What it means for an engine-layer design

Three lessons transfer directly to a provenance-gated browser:

1. User demand is real and large. DuckDuckGo built the filter because more than 50 percent of its image-search complaints were requests to stop showing AI-generated images [w=0.731] (https://insideduckduckgo.substack.com/p/duck-tales-why-duckduckgo-built-a). Any gate shipped at the browser layer inherits this demand rather than having to create it.
2. URL-pattern blocklists are site-level and stale by construction. A browser gate that consumes the same lists inherits the whack-a-mole ceiling unless it layers provenance manifests and detectors above the list layer (the hybrid tiering argument in doc 08).
3. Cost and latency kill cloud round-trips. DuckDuckGo's rejection of per-image classification at search scale is the strongest evidence available that a browser gate must do its detection in-process or on-device, never as a cloud round-trip per asset.

## Sources

- https://duckduckgo.com/duckduckgo-help-pages/results/how-to-filter-out-ai-images-in-duckduckgo-searc [w=0.949]
- https://insideduckduckgo.substack.com/p/duck-tales-why-duckduckgo-built-a [w=0.731]
- https://noai.duckduckgo.com/ [w=0.525]
- https://www.searchenginejournal.com/duckduckgo-adds-option-to-filter-out-ai-generated-images/551661/ [w=0.494, weak]
- https://petapixel.com/2025/07/21/duckduckgo-can-now-filter-out-ai-images-from-search-results/ [w=0.380, weak]
