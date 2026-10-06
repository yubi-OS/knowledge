# 06 Security products

Scope: the "I need security" decision tree from the source doc: WAF and managed rulesets (including credential leak detection), DDoS protection, bot management, API Shield, and Turnstile.

## The tree as the source doc states it

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) routes security by threat class:

- Web Application Firewall: waf/
- DDoS protection: ddos/
- Bot detection and management: bot-management/
- API protection: api-shield/
- CAPTCHA alternative: turnstile/
- Credential leak detection: waf/ (managed ruleset)

The highest-scoring subtopic in outline validation (2 of 2 load-bearing, 0.99 probability), and the dig supports it with the densest cluster of primary sources in the corpus.

## WAF phase ordering: the load-bearing fact

The WAF Managed Rules docs (weight 0.96, https://developers.cloudflare.com/waf/managed-rules/, updated 2026-09-08) give the one fact that determines how the whole security stack composes: WAF Managed Rules run in the http_request_firewall_managed phase, which executes after the HTTP DDoS Attack Protection phase (ddos_l7), the Custom Rules phase (http_request_firewall_custom), and the Rate Limiting Rules phase (http_ratelimit). The consequence the docs state directly: a rule with a terminal action (such as Block or Managed Challenge) in any of those earlier phases prevents Managed Rules from evaluating that request. Any design that assumes all security products see every request is wrong; terminal actions upstream short-circuit the WAF managed phase.

The Cloudflare Managed Ruleset reference (weight 0.97, https://developers.cloudflare.com/waf/managed-rules/reference/cloudflare-managed-ruleset/, updated 2026-08-25) is the canonical enumeration of rules and categories in that managed ruleset, which is also where the source doc's credential leak detection row lives (the credential leak checking is delivered through the managed ruleset rather than a separate product).

The learning course (weight 0.91, https://learn.cloudflare.com/courses/explore-waf-ddos-protection) surveys the full mitigation surface: WAF managed rules, custom rules, rate limiting, DDoS Attack Protection at L3, L4, and L7, HTTP DDoS managed rulesets, and Network-layer DDoS protection. That course page is the best single map of which ddos/ and waf/ rows cover which layers.

## Bot management and Turnstile

The Bot Management product page (weight 0.54, https://www.cloudflare.com/products/bot-management/) states the mechanism: machine learning and behavioral analysis across the global network to automatically detect and stop malicious bot traffic before it hits the application.

Turnstile has two high-weight sources. The integration tutorial (weight 0.96, https://developers.cloudflare.com/turnstile/tutorials/integrating-turnstile-waf-and-bot-management/, updated 2026-05-05) covers combining Turnstile with the WAF and Bot Management as a defense against automated attacks and malicious login attempts. The API resource page (weight 0.95, https://developers.cloudflare.com/api/resources/turnstile/) documents the Turnstile surface in the Cloudflare API, including the setting that determines the clearance level granted when a Turnstile widget is embedded on a Cloudflare site.

Weakly weighted, labeled: the bot mitigation marketing page (weight 0.46, https://www.cloudflare.com/products/bot-mitigation/) describes Turnstile as a free, privacy-preserving alternative to CAPTCHA with mitigation at the edge; the third-party integration guide (weight 0.20, https://docs.nhost.io/products/auth/bot-protection) notes Turnstile provides CAPTCHA-like protection without puzzle-solving friction; the community post (weight 0.18, https://community.cloudflare.com/t/outsmarting-modern-ai-driven-bots-a-guide-for-apps-and-api/876445) discusses AI-driven bots against web, mobile, and API surfaces. All below 0.5, so orientation only.

## Weak third-party architecture summaries

Two weak sources attempt full-stack security architecture write-ups: the bournemd mirror-style reference (weight 0.11, https://cloudflare.bournemd.com/architecture/application-security) and the runxbuild managed-ruleset explainer (weight 0.11, https://www.runxbuild.com/blog/cloudflare-managed-ruleset/), which describes a managed ruleset as a set of WAF rules Cloudflare writes, maintains, and updates, deployed to a zone with one switch. The dodatech tutorial (weight 0.12, https://tutorials.dodatech.com/cloudflare/waf-introduction/) claims the Cloudflare Managed Ruleset covers the OWASP Top 10 and common CVEs out of the box. These are below the authority line; the phase-ordering fact above (0.96) and the ruleset reference (0.97) are the load-bearing sources for how WAF actually evaluates.

## Skill-level note

The source doc's security tree routes by threat, but the dig shows the products are layered in a fixed request pipeline. The correct reading of the tree is: pick the product by threat class, then check the phase order to know what each layer sees.
