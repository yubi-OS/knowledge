# Non-dilutive capital as a runway category

**Scope:** Grants and non-dilutive funding for open source projects (NLnet, Alpha-Omega, GitHub Secure Open Source Fund) as a distinct funding input, and how funding type shapes the model.

## Why funding type is a model input, not a footnote

The funding assumption determines runway independently of revenue. But the type of funding changes what the model can claim: non-dilutive capital (grants) extends runway without selling equity and without any revenue assumption attached to it, so it enters the funding cell as its own category with its own evidence source. Grant-funded money also usually carries a purpose constraint, which means it maps to specific cost lines rather than to the general burn.

## NLnet

NLnet provides grants to free and open source projects, often involving additional parties through open calls aligned with a pilot's goals (https://nlnet.nl/funding.html, jev weight 0.86, authoritative backing). As a funding source for an open source infrastructure venture, NLnet is the canonical example: the money is a grant to the project, non-dilutive, and tied to the project's public work.

A related sustainability pattern is the non-profit foundation that relies entirely on community support for its permissively licensed open source software (https://www.nlnetlabs.nl/funding/, jev weight 0.76, authoritative backing). This is the long-run steady-state version of non-dilutive funding: no grant pipeline, no equity, funding follows the software's role in its ecosystem.

## Alpha-Omega

Alpha-Omega's mission is to catalyze sustainable security improvements to critical open source projects and ecosystems, funding security staff at organizations such as the Rust Foundation and the Eclipse Foundation, security improvements to projects like Homebrew, and security audits of projects like OpenSSL (https://github.com/ossf/alpha-omega, jev weight 0.76, authoritative backing). The project is backed by Anthropic, AWS, Citi, GitHub, Google, Google DeepMind, Microsoft, and OpenAI, with an annual budget over $7M (https://alpha-omega.dev/, jev weight 0.74, authoritative backing). Its grant recipients include organizations like OSTIF, which facilitates security audits and reviews for open source apps (https://alpha-omega.dev/grants/grantrecipients/, jev weight 0.53, authoritative backing).

For a security-focused open source venture, this is a targeted funding category: the funding buys security work specifically, so in the model it should be tied to the security-related cost lines, not to general runway.

## GitHub Secure Open Source Fund

The GitHub Secure Open Source Fund ran application-based intake with rolling review (applications closed on January 7 at 11:59pm PT, with programming and funding beginning in early 2025) (https://github.blog/news-insights/company-news/announcing-github-secure-open-source-fund/, jev weight 0.84, authoritative backing). Its stated design is investing in security for fast-growing dependencies that support larger projects and providing funding directly to maintainers so they can focus on security work (https://github.com/open-source/github-secure-open-source-fund, jev weight 0.66, authoritative backing).

A contrast worth recording: GitHub also runs an investment vehicle (GitHub Fund, partnering with M12) that invests in open source companies (https://github.com/open-source/github-fund, jev weight 0.66, authoritative backing). That is dilutive capital, the opposite category. The distinction matters for the model because dilutive funding changes ownership and expectations while non-dilutive funding does not.

## How this category slots into the skeleton

In the structural model, the funding input decomposes by source and constraint:

| Source | Type | Constraint | Model treatment |
|---|---|---|---|
| Grant (NLnet style) | Non-dilutive | Purpose-bound to project work | Extends runway; maps to specific cost lines |
| Security fund (Alpha-Omega, GitHub SOSF style) | Non-dilutive | Security work only | Funds security cost lines |
| Investment (GitHub Fund style) | Dilutive | Ownership change | Changes the capital envelope and governance; modeled separately |
| Self-funded | n/a | Founder capital | The downside case in doc 05 |

## The downside case

If no grant lands, non-dilutive capital contributes zero and front-loaded fixed costs (legal, entity formation) must be self-funded. This is why the funding-path row in the scenario doc is stressed independently of revenue: the funding assumption can fail while every revenue assumption is unchanged, and the runway calculation absorbs the entire difference.
