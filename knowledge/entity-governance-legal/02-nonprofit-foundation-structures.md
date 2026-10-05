# 02. Nonprofit and foundation structures for open-source projects

Scope: the nonprofit paths an open-source security project can take, including 501(c)(3) vs 501(c)(6) status, fiscal sponsorship, and foundation umbrella programs, and what each implies for a project still deciding its entity.

## 501(c)(3) vs 501(c)(6): the basic split

The tax code distinguishes charitable nonprofits from business-league nonprofits. The distinct difference between 501(c)(3) and 501(c)(6) organizations is in their underlying purposes: the goal of most 501(c)(3) organizations is charitable, while 501(c)(6) organizations are mainly business or membership nonprofits (https://donorbox.org/nonprofit-blog/501c3-vs-501c6, jev weight 0.54).

To qualify as tax-exempt under section 501(c)(3) of the Internal Revenue Code, an organization must be organized and operated for exempt purposes, with the IRS setting the formal requirements on its exemption requirements page (https://www.irs.gov/charities-non-profits/charitable-organizations/exemption-requirements-501c3-organizations, jev weight 0.98).

Real open-source organizations illustrate both sides. The InnerSource Commons Foundation is incorporated as a 501(c)(3) nonprofit, while the Linux Foundation, which sits in the same ecosystem, is a 501(c)(6) organization (https://github.com/InnerSourceCommons/foundation-governance/discussions/6, jev weight 0.12, weak backing). The Linux Foundation positions itself as a neutral, trusted hub for developers and organizations to build and scale open technology projects (https://www.linuxfoundation.org, jev weight 0.45, weak backing). A practitioner write-up connects the distinction to how hardware manufacturers and companies are able to support Linux commercially under the foundation model (https://www.unsungnovelty.org/posts/05/2023/open-source-projects-and-non-profit-501c3-vs-non-profit-501c6, jev weight 0.25, weak backing).

## Fiscal sponsorship: the lighter-weight path

Fiscal sponsorship lets a project operate under an existing nonprofit's umbrella instead of forming its own entity. The Software Freedom Conservancy is a leading FOSS fiscal sponsor: it is the home of about 30 free and open source projects, including Samba and Git (https://lwn.net/Articles/548475, jev weight 0.44, weak backing), and Conservancy has long been coordinated with Software in the Public Interest, a FOSS fiscal sponsor that predates it (https://faif.us/cast, jev weight 0.18, weak backing).

On the platform side, Open Collective offers transparency and fiscal hosting, and many successful projects use its fiscal-hosting model (https://ry-ops.dev/posts/2025-12-15-github-sponsors-open-collective-guide, jev weight 0.21, weak backing). Comparative coverage of GitHub Sponsors, Tidelift, and Open Collective treats fiscal hosting platforms as one distinct funding-model category alongside direct sponsorship and licensing (https://safeguard.sh/resources/blog/how-sponsorship-models-github-sponsors-tidelift-open-collective-compare, jev weight 0.15, weak backing). A sustainability directory exists specifically to help maintainers compare funding, revenue, infrastructure, and support options (https://www.oss.fund, jev weight 0.36, weak backing).

## What this frames for a project deciding an entity

For a project whose founder has not yet chosen an entity, the dig supports three framings:

1. A 501(c)(3) path is credible but heavy: it requires meeting the IRS exemption requirements directly (https://www.irs.gov/charities-non-profits/charitable-organizations/exemption-requirements-501c3-organizations, jev weight 0.98) or joining an established sponsor.
2. Fiscal sponsorship under an existing 501(c)(3) such as Software Freedom Conservancy gives grant-compatible status without forming a new entity (https://lwn.net/Articles/548475, jev weight 0.44, weak backing), which matters when public-interest funding is on the table.
3. A 501(c)(6) umbrella (the Linux Foundation model) is the fit when the project needs to accept corporate membership and commercial participation, which a charitable 501(c)(3) is restricted from doing (https://donorbox.org/nonprofit-blog/501c3-vs-501c6, jev weight 0.54).

The connection from entity structure to grant eligibility is developed in doc 09.
