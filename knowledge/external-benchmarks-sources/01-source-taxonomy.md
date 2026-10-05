# 01 - Source taxonomy for external benchmarks

Scope: classify third-party sources into source classes (primary/official, commercial market-research vendor, aggregator, press, forum) and what each class can honestly support.

## The four source classes

External benchmarks used in business documents are not one kind of evidence. A working taxonomy has four classes, and the class determines what a citation can carry.

1. Primary/official sources: the report issuer or standard-setter itself publishes the number. IBM's own Cost of a Data Breach report pages are primary for IBM's own figures (https://www.ibm.com/reports/data-breach, weight 0.84). NIST publishes SP 800-63B at pages.nist.gov (https://pages.nist.gov/800-63-4/sp800-63b.html, weight 0.93). A vendor's own store pricing page is primary for that vendor's retail prices (https://www.yubico.com/store/yubikey-5-series/, weight 0.84). Primary sources can support specific dollar figures and definitional claims, because the issuer stands behind them.

2. Commercial market-research vendors: syndicated reports such as MarketIntelo's FIDO2 Security Key market report, which valued the market at $1.2 billion in 2025 with a projection of $6.8 billion by 2034 at a 20.5% CAGR (https://marketintelo.com/report/fido2-security-key-market, weight 0.05). These are marketing artifacts for the research firm. They can support an order-of-magnitude growth argument; they cannot support a precise figure, because the underlying methodology is not disclosed in any checkable form.

3. Aggregators and content sites: ranked lists of research firms, blog explainers, and statistics pages that restate other people's numbers. The clearest tell is restatement without provenance: a page that reports the IBM phishing figure at $4.88 million and 16% share (https://www.reeflms.com/blog/ibm-cost-of-breach-2025-what-the-numbers-mean, weight 0.10) is only as good as its underlying primary source, and citing it directly invites drift.

4. Irrelevance noise: search results that match keywords but carry no usable signal at all. An electronics retailer page (https://www.acehardware.com/store-details/03878, weight 0.76 for the wrong reason) or a movie-theater listing (https://www.regmovies.com/theatres/regal-meridian-4dx-1931, weight 0.81) will score high on generic trust heuristics while being completely off-topic. This is why any weighting scheme must score relevance, not just source authority.

## How credibility frameworks map onto the classes

Standard source-evaluation guidance treats primary sources as the most credible class because they give direct evidence of what is being researched (https://www.scribbr.com/working-with-sources/credible-sources/, weight 0.80). The CRAAP test (Currency, Relevance, Authority, Accuracy, Purpose) is the classical checklist, and its guidance now extends to lateral reading and AI-citation verification because the checklist alone misses content that is stylistically authoritative but structurally hollow (https://casrai.org/guides/craap-test-evaluating-source-credibility, weight 0.58). The currency axis is exactly the refresh-cadence problem documented separately in this corpus.

For technology market research specifically, professional guidance is to select a partner by methodology: reports that name their data sources, sample sizes, and interview protocols are auditable in a way that reports without such disclosure are not (https://www.abiresearch.com/blog/technology-market-research, weight 0.54; https://worldmetrics.org/service/technology-market-research/, weight 0.07). The low weight on the rankings-list sources is itself the lesson: lists of research firms are class-3 aggregator content, not evidence.

## The operational rule

For every external number in a business document, record three things at collection time: the source class, the URL, and a quality weight. In the corpus maintained here, weights of 0.5 or higher mark authoritative backing and weights below 0.5 mark weak backing that must be labeled as such in text. A claim backed only by class-3 or class-2 sources is never stated as fact; it is stated as a range or a directional signal with the caveat attached. This discipline is what keeps the $4.8M IBM figure (citable as a directional industry-wide cost) separate from any specific customer's savings, which requires that customer's own baseline data.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| What Makes a Research Report Trustworthy in 2026 | https://timesintelligence.com/insights-solutions/what-makes-a-research-report-trustworthy/ | 0.35 (weak) |
| CRAAP Test: Evaluating Source Credibility (CASRAI) | https://casrai.org/guides/craap-test-evaluating-source-credibility | 0.58 |
| How to Know If a Market Research Report Is Actually Reliable | https://whoshouldigowith.com/how-to-know-if-a-market-research-report-is-actually-reliable/ | 0.10 (weak) |
| What Are Credible Sources (Scribbr) | https://www.scribbr.com/working-with-sources/credible-sources/ | 0.80 |
| Best Technology Market Research Services (worldmetrics) | https://worldmetrics.org/service/technology-market-research/ | 0.07 (weak) |
| Technology Market Research (ABI Research) | https://www.abiresearch.com/blog/technology-market-research | 0.54 |
| Best Technology Market Research Services (zipdo) | https://zipdo.co/service/technology-market-research/ | 0.09 (weak) |
| Market Sizing Guide (DataCalculus) | https://datacalculus.com/en/blog/market-research/market-research-advisor/market-sizing-a-comprehensive-guide-for-market-research-advisors | 0.39 (weak) |
| Technology (Wikipedia) | https://en.wikipedia.org/wiki/Technology | 0.47 (weak) |
| How to Size a Market (Lubor) | https://www.luborp.com/2019/08/how-to-size-market.html | 0.11 (weak) |
| Veracity of statements (Wikipedia) | https://en.wikipedia.org/wiki/Veracity_of_statements_by_Donald_Trump | 0.06 (weak, off-topic) |
| Primary Clothing | https://www.primary.com/ | 0.03 (weak, off-topic) |
