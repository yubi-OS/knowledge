# 02 - Breach-cost benchmarks and the cost-of-status-quo argument

Scope: breach-cost benchmarks such as the IBM Cost of a Data Breach report and how a directional cost-of-status-quo number differs from a customer-specific savings claim.

## The primary benchmark

The IBM Cost of a Data Breach Report is the anchor external benchmark for breach-cost claims. Its report hub is at https://www.ibm.com/reports/data-breach (weight 0.84) with a dedicated IBM-authored overview at https://www.ibm.com/think/x-force/2025-cost-of-a-data-breach-navigating-ai (weight 0.93). The 2025 edition studied 600 organizations that experienced real data breaches between March 2024 and February 2025, across 16 countries and regions, using the Ponemon Institute's activity-based costing methodology (methodology summarized at https://databreachcost.com/statistics, weight 0.09, weak backing since it is a secondary restatement).

For the phishing vector specifically, the 2025 report put phishing-driven breaches at an average of $4.88 million and phishing as the most common initial attack vector at 16% of breaches (https://www.reeflms.com/blog/ibm-cost-of-breach-2025-what-the-numbers-mean, weight 0.10, weak backing; directionally consistent with the primary-report pages). A secondary source dedicated to the phishing vector reports the same figure as $4.8 million with 254 days to identify and contain (https://databreachcost.com/attack-vector/phishing, weight 0.78). The internal reference doc for this corpus records the claim as USD 4.8 million with phishing overtaking stolen credentials as the most common initial attack vector; the 16% share and $4.88M figure in these secondary sources are consistent with that reading.

## The 2026 edition exists and resets the citation

A 21st annual edition (Cost of a Data Breach Report 2026, "The AI tipping point") is now published, with IBM's own report landing page (https://www.ibm.com/reports/data-breach, weight 0.83) and the primary PDF (https://www-api.ibm.com/adobe/assets/urn:aaid:aem:21111142-1251-4369-86fb-57b82f5bb108/original/as/Cost%20of%20a%20Data%20Breach%20Report%202026.pdf, weight 0.78) both live as of the dig for this corpus. The 2026 edition's framing centers on frontier AI models, including an April 2026 announcement of a model that found thousands of high-severity vulnerabilities across major operating systems. Any document still citing the 2025 edition's $4.8M phishing figure should either refresh to the 2026 numbers or state the edition year explicitly. The specific $4.8M/16% claims cited above are 2025-edition claims; per-edition attribution is mandatory when both editions are in circulation.

## The boundary: directional vs customer-specific

The benchmark supports exactly one kind of argument: credential-phishing incidents are expensive industry-wide. It does not support a claim that any specific customer would avoid this specific dollar figure. A customer's actual exposure requires the customer's own baseline data, breach frequency, and cost structure. Stated as a rule for business documents: cite the industry average to frame the cost of doing nothing; never subtract it from a product price to imply a savings guarantee.

Secondary coverage of the same report family shows how numbers drift in restatement: one aggregator reports a $10.22M headline for US breaches (https://www.reeflms.com/blog/ibm-cost-of-breach-2025-what-the-numbers-mean, weight 0.10, weak) while another tracks credential-attack statistics from a different survey base entirely, reporting stolen credentials appearing in 39% of confirmed breaches and a 13% first-step rate (https://axis-intelligence.com/credential-attack-statistics/, weight 0.13, weak). These are different surveys with different denominators. Mixing them in one sentence is the classic benchmark misuse this corpus exists to prevent. Every breach-cost sentence should name one edition of one report and one vector.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| Cost of a Data Breach Report 2026 hub (IBM) | https://www.ibm.com/reports/data-breach | 0.84 |
| Cost of a Data Breach Report 2026 PDF (IBM) | https://www-api.ibm.com/adobe/assets/urn:aaid:aem:21111142-1251-4369-86fb-57b82f5bb108/original/as/Cost%20of%20a%20Data%20Breach%20Report%202026.pdf | 0.78 |
| Cost of a Data Breach Report 2026 hub (IBM, second capture) | https://www.ibm.com/reports/data-breach | 0.83 |
| 2025 CoDB overview (IBM Think/ X-Force) | https://www.ibm.com/think/x-force/2025-cost-of-a-data-breach-navigating-ai | 0.93 |
| Phishing attack vector page (databreachcost.com) | https://databreachcost.com/attack-vector/phishing | 0.78 |
| 2025 statistics page (databreachcost.com) | https://databreachcost.com/statistics | 0.09 (weak) |
| 2025 numbers analysis (reeflms.com) | https://www.reeflms.com/blog/ibm-cost-of-breach-2025-what-the-numbers-mean | 0.10 (weak) |
| 2025 report PDF mirror (bakerdonelson.com) | https://www.bakerdonelson.com/webfiles/Publications/20250822_Cost-of-a-Data-Breach-Report-2025.pdf | 0.41 (weak) |
| Credential attack statistics 2026 (axis-intelligence.com) | https://axis-intelligence.com/credential-attack-statistics/ | 0.13 (weak) |
| Email attack vector analysis (adaptivesecurity.com) | https://www.adaptivesecurity.com/blog/why-email-is-the-biggest-attack-vector-in-cybersecurity | 0.34 (weak) |
| IBM corporate home | https://www.ibm.com/ | 0.19 (weak) |
| Average calculator (off-topic) | https://www.calculator.net/average-calculator.html | 0.03 (weak) |
