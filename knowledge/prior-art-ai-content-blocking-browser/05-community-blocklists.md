# 05. Community blocklists

Scope: The open-source blocklist substrate that search-layer and extension-layer filters build on: the uBlock Origin / uBlacklist anti-AI lists, their curation models, and their structural limits as a truth layer.

## The lists

The laylavish uBlockOrigin-HUGE-AI-Blocklist is the canonical list, describing itself as a huge blocklist of AI-generated content sites, with curated site entries and "nuclear" list variants for sites with mixed authentic and AI content (DeviantArt and ArtStation are the named cases) [w=0.711] (https://github.com/laylavish/uBlockOrigin-HUGE-AI-Blocklist). Its machine-readable uBlacklist-format export is published as a file in the same repository [w=0.562] (https://github.com/laylavish/uBlockOrigin-HUGE-AI-Blocklist/blob/main/list_uBlacklist.txt), and a Codeberg mirror with its own maintenance exists [w=0.433, weak] (https://codeberg.org/Mangochicken/uBlockOrigin-HUGE-AI-Blocklist).

The Wakelock uSloplist is the second major ruleset, an anti-AI ruleset for uBlacklist and uBlock with an explicit false-positive-avoidance policy [w=0.846] (https://github.com/Wakelock/uSloplist); its README documents the curation policy [w=0.422, weak] (https://github.com/Wakelock/uSloplist/blob/main/README.md). The wider anti-slop ruleset pattern (selectors and design gates against AI slop output) appears in adjacent projects as well [w=0.255, weak] (https://deepwiki.com/alchaincyf/huashu-design/2.4-anti-ai-slop-rules-and-design-quality-gates).

Context on why these lists exist: the Columbia SIPA IGP report on AI slop and the information ecosystem documents the scale of AI-generated content pollution that the lists respond to [w=0.709] (https://igp.sipa.columbia.edu/sites/igp/files/2026-06/AI%20Slop%20and%20the%20Information%20Ecosystem%20Report).

## Curation model and structural limits

All of these lists share the same properties, which are also their limits:

1. Manual curation. Entries are added by maintainers reviewing sites and reports. Coverage grows at human speed while AI content farms grow at generation speed.
2. Site-level granularity. The unit of blocking is a domain or path pattern, not an asset. A site with 90 percent authentic and 10 percent AI media can only be blocked wholesale (the "nuclear" list problem the HUGE-AI-Blocklist itself names) or not at all.
3. No integrity guarantee. A list is a plain-text artifact fetched over the network; there is no signature, provenance, or attestation on the entries themselves.

## Role in a provenance-gated architecture

These lists are the de facto community truth layer that current filters actually consume: DuckDuckGo's search-layer filter matches against the HUGE-AI-Blocklist (doc 01), and extension-layer tools consume the same or similar feeds. In a provenance-gated browser they map to a specific role: a pre-filter feed for fast, cheap blocking of known AI-content farms, positioned below provenance validation and detection rather than as the decision layer.

That mapping inherits their limits honestly: as a pre-filter they contribute recall against known farms without claiming precision, and their site-level granularity does not damage asset-level decisions made by provenance and detection above them. What they cannot do is serve as an allow-side (their absence never certifies anything), which is why the allow-side enforcement gap (doc 08) is a separate mechanism.

## Sources

- https://github.com/Wakelock/uSloplist [w=0.846]
- https://github.com/laylavish/uBlockOrigin-HUGE-AI-Blocklist [w=0.711]
- https://igp.sipa.columbia.edu/sites/igp/files/2026-06/AI%20Slop%20and%20the%20Information%20Ecosystem%20Report [w=0.709]
- https://github.com/laylavish/uBlockOrigin-HUGE-AI-Blocklist/blob/main/list_uBlacklist.txt [w=0.562]
- https://codeberg.org/Mangochicken/uBlockOrigin-HUGE-AI-Blocklist [w=0.433, weak]
- https://github.com/Wakelock/uSloplist/blob/main/README.md [w=0.422, weak]
- https://deepwiki.com/alchaincyf/huashu-design/2.4-anti-ai-slop-rules-and-design-quality-gates [w=0.255, weak]
