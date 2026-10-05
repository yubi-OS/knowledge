# 07. Provenance in academia and in the browser

Scope: The academic record on provenance authentication and provenance-UI trust effects, and the closest shipping provenance validation in a browser: the Digimarc C2PA Content Credentials extension.

## Academic provenance work

Three academic threads ground the provenance approach.

First, the user-trust layer: a peer-reviewed ICWSM study found that presenting C2PA provenance labels measurably increases perceived credibility of news across Western countries [w=0.901] (https://ojs.aaai.org/index.php/ICWSM/article/view/42749), with the open-access PDF [w=0.712] (https://christophtrattner.com/pubs/ICWSM2026.pdf) and the paper's PDF page [w=0.647] (https://ojs.aaai.org/index.php/ICWSM/article/view/42749/50309). This is the validation that user-facing provenance signaling (an omnibox chip, an interstitial) is worth building at all: the UI layer has measured effects, not just theoretical ones.

Second, provenance authentication as a cryptographic problem: AMP (authentication of media via provenance) framed media authentication through captured provenance at ACM CCS (https://dl.acm.org/doi/10.1145/3458305.3459599), establishing the earlier academic framing that C2PA later industrialized.

Third, delivery integration: client-side C2PA verification inside DASH video streaming players was demonstrated at ACM MMSys (https://dl.acm.org/doi/10.1145/3625468.3652198), the pattern for validating provenance at playback time inside a media pipeline rather than as a separate tool.

Both ACM entries are recorded in the yubiOS prior-art note that this corpus was minted from. They were not surfaced by this mint's searXNG dig, so they carry no independently weighted backing here and should be treated as pointers pending re-verification, not as dig-verified claims.

## The closest shipping provenance-in-browser prior art

The Digimarc C2PA Content Credentials browser extension is the closest thing to provenance validation living in a browser today. Digimarc launched it as an industry-first C2PA Content Credentials browser extension in November 2023 [w=0.802] (https://www.digimarc.com/press-releases/2023/11/30/digimarc-launches-industry-first-c2pa-content-credentials-browser-extension), documents how it validates Content Credentials from the browser [w=0.840] (https://www.digimarc.com/blog/validate-content-credentials-your-browser-digimarc-c2pa-content-credentials-extension), publishes the source as the digimarc-corp/c2pa-content-credentials-extension repository [w=0.933] (https://github.com/digimarc-corp/c2pa-content-credentials-extension), and distributes it on the Chrome Web Store [w=0.703] (https://chromewebstore.google.com/detail/c2pa-content-credentials/mjkaocdlpjmphfkjndocehcdhbigaafp). Digimarc's C2PA 2.1 blog also documents the watermark-plus-manifest pairing now part of the spec [w=0.781] (https://www.digimarc.com/blog/c2pa-21-strengthening-content-credentials-digital-watermarks).

Its architecture is c2pa-js-based in-browser validation, sandboxed, and independent of the host site. That is the same verdict layer as an engine gate, but reached from outside the media pipeline.

## What the engine-layer difference buys

The extension is prior art for the verdict, not for the enforcement point. An extension validates what it can observe from the sandbox: embedded image data, DOM-visible manifests. An in-process validator (the yubiOS approach: patch 0007 inside the data decoder) can additionally observe the bytes as they flow through decode, handle manifests the page does not expose in DOM-reachable form, and couple the verdict to render-time policy without messaging latency or sandbox round-trips. The distinction matters most exactly where the extension is weakest: manifests attached to media in non-DOM pipelines, and enforcement (block or interstitial) that must happen before first paint.

## Sources

- https://github.com/digimarc-corp/c2pa-content-credentials-extension [w=0.933]
- https://ojs.aaai.org/index.php/ICWSM/article/view/42749 [w=0.901]
- https://www.digimarc.com/blog/validate-content-credentials-your-browser-digimarc-c2pa-content-credentials-extension [w=0.840]
- https://www.digimarc.com/blog/c2pa-21-strengthening-content-credentials-digital-watermarks [w=0.781]
- https://christophtrattner.com/pubs/ICWSM2026.pdf [w=0.712]
- https://chromewebstore.google.com/detail/c2pa-content-credentials/mjkaocdlpjmphfkjndocehcdhbigaafp [w=0.703]
- https://ojs.aaai.org/index.php/ICWSM/article/view/42749/50309 [w=0.647]
- https://www.digimarc.com/press-releases/2023/11/30/digimarc-launches-industry-first-c2pa-content-credentials-browser-extension [w=0.802]
- https://dl.acm.org/doi/10.1145/3458305.3459599 [w=0.504, weak]
- https://dl.acm.org/doi/10.1145/3625468.3652198 [w=0.504, weak]
