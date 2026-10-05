# 07. Security disclosure

Scope: coordinated vulnerability disclosure as the covenant baseline, the ban on customer-only embargoes, and published known-gap documents as a second disclosure surface.

## The CVD baseline

Coordinated vulnerability disclosure is the norm a covenant should adopt by reference. ENISA describes a national CVD policy as a framework under which security researchers are allowed and encouraged to research ICT products and services, following a set of rules, and report vulnerabilities they find to a designated authority [1] (weight 0.85). The CERT Guide to Coordinated Vulnerability Disclosure is written for exactly the three roles involved: security researchers, vendors, and coordinators [2] (weight 0.92). CISA's CVD program coordinates the reporting, analysis, and public disclosure of cybersecurity vulnerabilities across critical infrastructure and essential technologies [3] (weight 0.96).

The practice layer is standardized enough to copy directly. The CERT guide's policy-selection chapter references the NTIA "Early Stage" CVD template and the security.txt proposed standard, which lets a website define its disclosure policy in a machine-readable place [4] (weight 0.87). A covenant can therefore point at existing infrastructure rather than inventing process: a security.txt file, a private reporting channel, a published disclosure timeline.

## Timelines and the fallback rule

The CERT-EU policy shows the operational detail covenants can borrow: limited disclosure to constituents happens if the vulnerability is not fixed, and patches mitigating or resolving it released, within 30 days [5] (weight 0.69). The pattern: private report, fix window, then publication. Publication is the default, not a favor.

## No customer-only embargo

The covenant's distinctive clause is that no embargo tier exists for commercial customers. A fix ships to everyone at the same time it is disclosed. The anti-pattern is documented: commentary on Broadcom's handling of Spring Framework fixes describes companies that quietly fix security flaws without ever publishing an advisory, just a vague changelog note, while attackers can still diff the changes [6] (weight 0.14, weak backing). Silent patches protect no one except the party deciding what to say; disclosure with credit is the counter-practice.

The CVE program supplies the public ledger this depends on: over 382,000 CVE records are publicly accessible via download or keyword search [7] (weight 0.96), and the program's structure has upstream communities assign the CVE ID for their code, then share it with downstream entities [8] (weight 0.66). Publishing through the CVE program at disclosure time is what makes "ships to everyone at once" verifiable.

## The second surface: known unresolved gaps

CVD covers vulnerabilities reported from outside. Covenants add a second, self-initiated surface: public documents that track known, unresolved gaps and what the project cannot fully prevent, kept current rather than accurate only as of their last-reviewed date. This is the honest-disclosure complement to the fix pipeline. It also serves fork users and auditors who need the risk picture, not just the patch list. (The dig returned no strongly-weighted source dedicated to known-gap registers; this section is covenant-design reasoning, with the CVD sources [1][2][3] (weights 0.85, 0.92, 0.96) supplying the disclosure norms it extends.)

## Caveats

The CVD program sources are strongly backed (ENISA, CERT/CC, CISA, CERT-EU). The silent-patch critique is weakly backed and labeled as such.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://www.enisa.europa.eu/sites/default/files/publications/Coordinated%20Vulnerability%20Disclosure%20policies%20in%20the%20EU.pdf | 0.85 |
| 2 | https://certcc.github.io/CERT-Guide-to-CVD/ | 0.92 |
| 3 | https://www.cisa.gov/resources-tools/programs/coordinated-vulnerability-disclosure-cvd-program | 0.96 |
| 4 | https://certcc.github.io/CERT-Guide-to-CVD/howto/preparation/choosing_policy/ | 0.87 |
| 5 | https://cert.europa.eu/responsible-disclosure-policy | 0.69 |
| 6 | https://www.linkedin.com/posts/cyber-news-live_silent-patches-dont-stop-attackers-they-activity-7498074843079204864-MR6l | 0.14 |
| 7 | https://www.cve.org/ | 0.96 |
| 8 | https://www.cve.org/Media/News/item/blog/2023/02/07/Open-Source-and-the-CVE-Program | 0.66 |
| 9 | https://handwiki.org/wiki/Computer_security | 0.11 |
| 10 | https://thehackernews.com/2026/09/google-play-early-access-abused-to-push.html | 0.53 |
| 11 | https://cybernews.com/security/deceptive-apps-abuse-google-play-early-access/ | 0.76 |
| 12 | https://www.tomsguide.com/news/zoom-security-privacy-woes | 0.44 |
