# 08. Engine-layer gap and allow-side enforcement

Scope: The negative space this prior-art map reveals: why no one has shipped an engine-layer provenance gate, the allow-side marking ecosystem with no enforcement path, and the two browser-platform signals (Chromium architecture and a content-disclosure attribute proposal) that frame the opening.

## Why the engine layer is empty

The shipped landscape (docs 01, 02) is all filters and extensions: DuckDuckGo at the search layer, uBlock-consumed lists at the extension layer, AI Content Shield and kin as add-ons. No vendor ships an engine-layer gate that consults provenance manifests and detection signals before rendering. The yubiOS prior-art note attributes the gap to three converging prerequisites, all recently satisfied:

1. An engine-layer gate requires a Chromium fork, so only OS-level or vendor-level projects can even attempt it.
2. Provenance coverage of the web is still early: C2PA shipped in cameras and creator tools before it reached the long tail of the web.
3. The detector APIs a hybrid gate depends on (watermark detectors, in-model provenance checks) only became available in 2026.

The gap is therefore not evidence of a bad idea. The demand signal is strong: DuckDuckGo built its filter because more than 50 percent of its image-search complaints asked to stop seeing AI-generated images (doc 01). A gate positioned where those three prerequisites cross is entering an unoccupied tier of the stack, not a crowded one.

## Platform-native signals

Two Chromium-side artifacts define what the platform layer itself is already moving toward. The RenderingNG architecture documentation describes the render pipeline stages that an engine-layer gate would intercept [w=0.673] (https://developer.chrome.com/docs/chromium/renderingng-architecture) and [w=0.671] (https://developer.chrome.com/docs/chromium/renderingng). Separately, Chrome Platform Status lists an "AI content disclosure attribute" feature proposal, a platform-native mechanism for pages to declare AI-generated content [w=0.787] (https://chromestatus.com/feature/5078123181899776), with a community explainer for the same idea in the dweekly/ai-content-disclosure repository [w=0.347, weak] (https://github.com/dweekly/ai-content-disclosure). A disclosure attribute is a self-declared, unverified signal; a provenance gate is the verifying counterpart to it.

## The allow-side gap

The Not By AI badge is the main allow-side artifact in the ecosystem: a voluntary badge that creators place on human-created content, explicitly documented as "not an AI detection tool", with no filter list that acts on it. Its site itself carries a low dig weight in this corpus [w=0.276, weak] (https://notbyai.fyi/), and independent commentary confirms its positioning as voluntary and non-enforced [w=0.609] (http://simonwillison.net/2023/Mar/16/not-by-ai/).

The structural gap: the ecosystem has a marker but no enforcement path. Nothing in the stack currently requires valid provenance for a content class; the badge is honor-system. A browser mode that requires valid provenance for some content class (the `provenance_required` design in the yubiOS gate) is the enforcement mechanism this ecosystem lacks, and it is genuinely novel against the surveyed prior art: every blocked-side tool filters AI content down, while nothing verifies human/credentialed content up.

## The composite design position

Assembling the prior-art map: blocklists are the cheap recall layer (doc 05), detection is the flagging layer whose accuracy and maintenance liabilities are documented (docs 03, 04), provenance is the hard-evidence layer whose validator pitfalls are now formally documented (doc 06), and the UI layer has measured trust effects (doc 07). No existing system stacks all of these at the engine layer. The opportunity analysis in the yubiOS note adds DuckDuckGo's own roadmap (blocklist now, flagging later, classifiers last) as independent validation of the hybrid tiering order, and its cost lesson (no per-image cloud classification) as the constraint on the detection layer's shape.

## Sources

- https://chromestatus.com/feature/5078123181899776 [w=0.787]
- http://simonwillison.net/2023/Mar/16/not-by-ai/ [w=0.609]
- https://developer.chrome.com/docs/chromium/renderingng-architecture [w=0.673]
- https://developer.chrome.com/docs/chromium/renderingng [w=0.671]
- https://github.com/dweekly/ai-content-disclosure [w=0.347, weak]
- https://notbyai.fyi/ [w=0.276, weak]
