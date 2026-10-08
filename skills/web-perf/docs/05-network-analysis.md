# 05 - Network Analysis: Render Blocking, Chains, Preloads, Caching, Payloads, Preconnects

Scope: Phase 3 of the web-perf audit, listing network requests by resource type and hunting the six issue classes the source doc names.

Grounding spine: yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).

## The listing call

Phase 3 starts with `list_network_requests(resourceTypes: ["Script", "Stylesheet", "Document", "Font", "Image"])`, then drills into individual requests with `get_network_request(reqid: <id>)` for headers, sizes, and timing. The type filter matters: performance problems concentrate in those 5 types, and filtering keeps the waterfall readable.

## Render-blocking resources

The source doc defines the pattern: "JS/CSS in `<head>` without `async`/`defer`/`media` attributes". The mechanism is documented on web.dev: "CSS files are render-blocking resources: they must be loaded and processed before the browser renders the page. Web pages that contain unnecessarily large styles take longer to render" (https://github.com/GoogleChrome/web.dev/blob/main/src/site/content/en/fast/defer-non-critical-css/index.md, weight 0.82). The fix pattern is to defer non-critical CSS with the goal of "optimizing the Critical Rendering Path, and improving First Contentful Paint" (https://web.dev/articles/defer-non-critical-css, weight 0.9). A secondary explainer agrees on the definition: "Render-blocking resources are CSS stylesheets and JavaScript files that block the first paint of your page. When the browser encounters a render-blocking resource, it stops downloading the rest of the resources until these critical files are [downloaded and processed]" (https://blog.logrocket.com/eliminate-render-blocking-resources-css-javascript/, weak backing, weight 0.28).

For the DevTools MCP path, the RenderBlocking insight is the quantifier; the request listing is the evidence. The two must agree before a recommendation ships.

## Network chains and missing preloads

A chain is "resources discovered late because they depend on other resources loading first (e.g., CSS imports, JS-loaded fonts)". The official network dependency tree insight frames the remedy as "avoid chaining critical requests by reducing the length of chains" (https://developer.chrome.com/docs/performance/insights/network-dependency-tree, weight 0.92, see doc 04). The preload counterpart is to move discovery earlier for critical resources: fonts, hero images, key scripts.

Resource hints are the standard tool here, and web.dev's learning module covers the trio: "preconnect, dns-prefetch, and preload are covered, as well as the speculative fetching behaviors that prefetch provides. preconnect: The preconnect hint is used to establish a connection to another origin" (https://web.dev/learn/performance/resource-hints, weight 0.89). The dedicated article is equally explicit that "you can use rel=preconnect and rel=dns-prefetch resource hints to establish network connections early and improve perceived page speed" (https://web.dev/articles/preconnect-and-dns-prefetch, weight 0.92). css-tricks gives the same mechanism from the practitioner side: "Adding rel=preconnect to a `<link>` informs the browser that your page [intends to connect to that origin]" (https://css-tricks.com/using-relpreconnect-to-establish-network-connections-early-and-increase-performance/, weight 0.51).

## Caching issues

The source doc's detector is header-level: "Missing or weak `Cache-Control`, `ETag`, or `Last-Modified` headers". `get_network_request` supplies those response headers directly. Report per-origin: static assets with no caching directives are a high-impact finding for repeat visits; HTML documents usually get no-store deliberately, so only flag documents when the intent is clearly wrong.

## Large payloads

"Uncompressed or oversized JS/CSS bundles" is the last bulk class. The size and compression encoding on each request come from `get_network_request`; cross-check against the codebase findings in doc 07, because an oversized bundle usually has a build-configuration cause, not a server cause.

## Unused preconnects: the verification rule

This is the source doc's most specific guidance, and it is a two-branch rule:

- If the preconnected origin received zero requests in the trace, the preconnect is definitively unused: recommend removal.
- If requests exist but loaded late, the preconnect may still be valuable: note it, do not recommend removal.

The claim-verification discipline behind this rule ("confirm something is unused before suggesting removal") is what makes network audits trustworthy; a removal recommendation based on a warm cache or a third-party script that did not fire this run would be wrong.

Third-party hint builders advertise the same taxonomy, "preconnect for the origins, dns-prefetch for the rest, preload with the correct [as value]" (https://a2z.tools/preload-preconnect-builder, weak backing, weight 0.17). Useful as a cross-check of hint vocabulary; not a source of authority.

## Reporting the network phase

Group findings by the 6 classes, not by URL order. Each finding names the request, its measured impact, and the class it belongs to. Zero-impact findings are listed as noted-not-recommended, per the source doc's "skip non-issues" rule.

Sources: https://web.dev/articles/defer-non-critical-css (weight 0.9), https://web.dev/articles/preconnect-and-dns-prefetch (weight 0.92), https://web.dev/learn/performance/resource-hints (weight 0.89), https://github.com/GoogleChrome/web.dev/blob/main/src/site/content/en/fast/defer-non-critical-css/index.md (weight 0.82), https://css-tricks.com/using-relpreconnect-to-establish-network-connections-early-and-increase-performance/ (weight 0.51), https://developer.chrome.com/docs/performance/insights/network-dependency-tree (weight 0.92), https://blog.logrocket.com/eliminate-render-blocking-resources-css-javascript/ (weak backing, weight 0.28), https://a2z.tools/preload-preconnect-builder (weak backing, weight 0.17), plus yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).
