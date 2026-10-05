# 03. Client-side adoption: browsers and the client traffic share

Scope: which browsers negotiate X25519MLKEM768 by default, how the client-side traffic share grew, and what the numbers measure.

## Browser support

The major engines support the hybrid by default: Chrome 131+, Edge 131+, Firefox 132+ on desktop, and Safari 26+ on Apple's version-26 operating systems offer X25519MLKEM768 automatically (source: https://www.postquantumsecurity.org/publications/browsers_pqc.html, weight 0.55, marginal backing). Chrome and Firefox rolled hybrid support out in staged releases, so a growing fraction of users negotiate the group without toggling any setting, and the visible lock icon does not change (source: https://beyondtmrw.org/article/post-quantum-tls-migration-browser-deadlines-and-enterprise-playbooks, weight 0.62, marginal backing). Chrome's default-on behavior dates to 2024, when it enabled the hybrid exchange that became X25519MLKEM768 (source: https://dev.to/havenmessenger/hybrid-post-quantum-tls-how-your-browser-is-already-defending-against-a-computer-that-doesnt-3knm, weight 0.53, marginal backing).

Support is not uniform across the long tail: Cloudflare's support matrix groups browsers by rendering engine and TLS stack, and warns that derivative browsers can lag the upstream engine or disable post-quantum features by policy, so operators should verify the specific browser version they care about rather than assuming derivative support (source: https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-support/, weight 0.85).

## The measured client share

Cloudflare Radar has tracked aggregate client support since April 2024 and chronicled global growth from under 3% at the start of 2024 to over 60% in February 2026; in October 2025 Cloudflare also added a browser self-check so users can verify whether their own browser supports X25519MLKEM768 (source: https://blog.cloudflare.com/radar-origin-pq-key-transparency-aspa/, weight 0.93).

By late September 2026, about 70% of browser-generated traffic hitting Cloudflare's network on the visitor-to-Cloudflare connection was protected with post-quantum encryption using hybrid ML-KEM (FIPS 203) (source: https://blog.cloudflare.com/post-quantum-visibility/, weight 0.95). A Radar social post from the same period put human HTTPS traffic at about 67% and, separately, noted origin-server support still around 9% at that moment (source: https://x.com/CloudflareRadar/status/2044364347183337528, weight 0.57, weak backing; treat as secondary reporting).

## What the number does and does not mean

The Radar methodology checks whether the negotiated key exchange is a post-quantum method such as X25519MLKEM768, a hybrid combining classical X25519 with ML-KEM (source: https://radar.cloudflare.com/post-quantum, weight 0.79). Two caveats follow. First, the share is measured over traffic that reaches Cloudflare, so it reflects the client population of that network, not the whole internet. Second, the client share alone says nothing about end-to-end protection: a Cloudflare-side checkmark only delivers full post-quantum protection when the origin leg also supports it, which is why the origin-side gap is tracked separately in this corpus.
## Reading the growth curve

The curve's shape matters as much as its endpoint. Cloudflare's tracking runs from April 2024, and the growth from under 3% to over 60% of browser-generated traffic in about two years happened without any user-visible product change, because browsers enabled the group silently in staged releases and servers, led by Cloudflare, already supported it (source: https://blog.cloudflare.com/radar-origin-pq-key-transparency-aspa/, weight 0.93; https://beyondtmrw.org/article/post-quantum-tls-migration-browser-deadlines-and-enterprise-playbooks, weight 0.62, marginal backing). The lesson for other protocols: client-side PQ adoption can saturate quickly once the default flips, because the cost of enabling is borne by the browser and the CDN, not by each site operator.

The October 2025 addition of a browser self-check turned the passive statistic into an actionable one: users can verify whether their own browser supports X25519MLKEM768 (source: https://blog.cloudflare.com/radar-origin-pq-key-transparency-aspa/, weight 0.93).

## Version floor and derivative risk

The version floor is recent enough that enterprise fleets lag. The commonly cited floor is Chrome 131+, Edge 131+, Firefox 132+ on desktop, and Safari 26+ on Apple's version-26 operating systems (source: https://www.postquantumsecurity.org/publications/browsers_pqc.html, weight 0.55, marginal backing). Fleet managers should assume the floor rather than the maximum: Cloudflare's own matrix groups browsers by rendering engine and TLS stack and explicitly warns that derivative browsers can lag the upstream engine or disable post-quantum features by policy, so behavior must be verified per browser version (source: https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-support/, weight 0.85).

Chrome's default-on timeline is the anchor event: the hybrid combining X25519 and Kyber768, now standardized as X25519MLKEM768, was enabled by default in 2024, so a large share of Chrome HTTPS connections to supporting servers negotiate PQ protection without any user action (source: https://dev.to/havenmessenger/hybrid-post-quantum-tls-how-your-browser-is-already-defending-against-a-computer-that-doesnt-3knm, weight 0.53, marginal backing).

## What the client share buys and does not buy

A high client share is a necessary but not sufficient condition for end-to-end protection. The client number measures the visitor-to-Cloudflare leg only; the Cloudflare-to-origin leg is tracked separately and lags badly (about 9% to 15% in the 2026 readings, against roughly 70% client-side) (source: https://blog.cloudflare.com/post-quantum-visibility/, weight 0.95; https://x.com/CloudflareRadar/status/2044364347183337528, weight 0.57, weak backing). For an operator this reframes the browser numbers from a migration target into a finished fact: the client side of the internet has largely moved, and the work left is on server and origin infrastructure.
