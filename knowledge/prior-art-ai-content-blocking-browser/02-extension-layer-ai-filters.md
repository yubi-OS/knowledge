# 02. Extension-layer AI filters

Scope: The shipped extension-layer prior art for hiding or blocking AI content in the browser: AI Content Shield, the AI Blocker family, Is Generated, and the adjacent category of tools that gate browser-side AI features rather than page content.

## What the extension layer ships today

The extension ecosystem splits into two categories: tools that hide AI-generated page content, and tools that hide AI features (overviews, chat widgets, AI-mode surfaces). Both live entirely above the browser engine, in the extension sandbox.

AI Content Shield is the highest-signal shipping example. It is listed on both the Chrome Web Store and Firefox Add-ons [w=0.674] (https://chromewebstore.google.com/detail/ai-content-shield-hide-ai/eoghcliblbhjimkgnfemelcpfdnmiceo) and [w=0.744] (https://addons.mozilla.org/en-US/firefox/addon/ai-content-shield/), where it is described as blocking Google AI Mode, AI Overviews, and AI videos and posts on YouTube and social feeds, working on-device "just like your favorite ad blockers". Its own product site claims on-device processing and an ad-blocker architecture [w=0.368, weak] (https://www.aicontentshield.app/). Its targets are AI features injected by the platforms themselves, not third-party AI-generated media embedded in ordinary pages.

The AI Blocker family covers the second category. The AI Blocker extension (Dr-Brook/ai-blocker, GitHub) blocks AI endpoints at the network request layer and hides AI UI with DOM-level CSS rules, and its commercialized site describes blocking AI-generated images and content with on-device processing [w=0.519] (https://www.aiblocker.com/) and [w=0.531] (https://www.aiblocker.com/how-to-block-ai). Is Generated is a community report-and-block extension targeting whole sites that contain AI noise; its Chrome Web Store listing documents the report-driven model [w=0.423, weak] (https://chromewebstore.google.com/detail/is-generated-block-ai-con/chccpjfkgkgogeaaekpgoocmcekajgjk).

Two adjacent entries from the yubiOS prior-art note, not surfaced independently by this corpus's dig and therefore weakly grounded here: BrowserBlock AI (node.ms/browserblockai), which blurs AI images and additionally gates `window.ai` calls so sites cannot run in-browser LLMs without consent, and Valerie (valerieaidetector.com), which detects AI chatbots by behavioral signatures (network activity, WebSocket patterns, text streaming) and blocks them per site. Valerie's threat model is distinct: it blocks AI agents running inside the user's browser, not AI content arriving in pages.

## The common architectural ceiling

Every one of these tools shares the same constraints:

1. Extension sandbox limits. An extension cannot inspect or gate inside the rendering pipeline of the engine; it sees the DOM after parse and the network through declarative hooks. Manifest-level provenance validation of embedded media is at best shallow from this vantage point.
2. Feature-blocklist focus. The most actively maintained extensions (AI Content Shield, AI Blocker) target AI features, whose surfaces are stable and enumerable (AI Overviews markup, known widget selectors, AI endpoint domains). Blocking AI-generated media inside arbitrary pages is a harder, less-served problem.
3. No provenance signal. None of the surveyed extensions consult C2PA manifests or any cryptographic provenance source. All decisions are heuristic: URL patterns, DOM selectors, community reports.

## What it means for an engine-layer design

The extension layer is where AI-content blocking actually ships today, which means a provenance-gated browser is competing against user habits formed by ad-blocker-style tools. Its differentiators are exactly the things the sandbox cannot do: consult signed provenance manifests during media decode, gate at the data-decoder layer before render, and enforce policy modes (provenance_required) that no extension can express because it lacks a trust root for manifest validation. The Digimarc C2PA extension (doc 07) is the one extension that touches provenance, and even it validates from outside the media pipeline.

## Sources

- https://addons.mozilla.org/en-US/firefox/addon/ai-content-shield/ [w=0.744]
- https://chromewebstore.google.com/detail/ai-content-shield-hide-ai/eoghcliblbhjimkgnfemelcpfdnmiceo [w=0.674]
- https://www.aiblocker.com/how-to-block-ai [w=0.531]
- https://www.aiblocker.com/ [w=0.519]
- https://chromewebstore.google.com/detail/is-generated-block-ai-con/chccpjfkgkgogeaaekpgoocmcekajgjk [w=0.423, weak]
- https://www.aicontentshield.app/ [w=0.368, weak]
