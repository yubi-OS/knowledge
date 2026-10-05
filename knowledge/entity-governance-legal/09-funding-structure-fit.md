# 09. Funding paths and entity structure fit

Scope: how the funding path (federal grants, nonprofit grants, sponsorships, paid support) interacts with entity choice and grant eligibility for an open-source project still deciding its structure.

## Grant eligibility is entity-defined

Federal grants gate on applicant status before anything else. Every federal notice of funding opportunity (NOFO) contains a section that defines the eligibility requirements for that specific opportunity (https://www.grants.gov/learn-grants/grant-eligibility.html, jev weight 0.87), and Grants.gov's applicant guidance makes checking eligibility the step to complete before beginning an application (https://www.grants.gov/applicants/applicant-eligibility, jev weight 0.95; https://www.grants.gov/, jev weight 0.90).

Which entity types can apply is the deciding variable. Federal funders classify applicants using a standard set of organizational categories, and registration and status requirements run through those eligibility categories (https://opengrants.io/encyclopedia/readiness/grant-eligibility-explained, jev weight 0.06, weak backing). Corporate grant programs are even more explicit: Microsoft's nonprofit grant program requires a nonprofit or non-governmental organization with recognized legal status in their country, equal to 501(c)(3) status under the United States Internal Revenue Code (https://www.microsoft.com/en-us/nonprofits/eligibility, jev weight 0.74).

## Open-source funding models

The open-source ecosystem has its own funding vocabulary, independent of grants. A guide to open-source funding models covers grants, sponsorships, donations, crowdfunding, and more (https://openresource.dev/guide/financing/understanding-funding-models, jev weight 0.27, weak backing). A step-by-step 2026 guide frames the choice as picking among sponsorships, grants, bounties, support revenue, infrastructure credits, and revenue (https://www.oss.fund/guides/how-to-fund-open-source-project, jev weight 0.24, weak backing). A practitioner survey makes the sustainability point: most major open source projects require a mix of funding sources rather than one (https://mkaz.blog/misc/open-souce-funding-models, jev weight 0.14, weak backing).

## What this frames for the entity decision

The interaction the source document for this corpus identifies is that a public-interest funding path pushes the entity decision toward a structure compatible with grant eligibility. The dig makes the interaction concrete:

1. Eligibility gates are stated per-NOFO, but the applicant categories that satisfy them are entity-type based (https://www.grants.gov/learn-grants/grant-eligibility.html, jev weight 0.87).
2. Corporate and foundation grant programs commonly require 501(c)(3)-equivalent status outright (https://www.microsoft.com/en-us/nonprofits/eligibility, jev weight 0.74).
3. A project can fund itself through the open-source model mix (sponsorships, support revenue, consulting) under any entity type (https://openresource.dev/guide/financing/understanding-funding-models/, jev weight 0.70; https://www.oss.fund/guides/how-to-fund-open-source-project/, jev weight 0.70), which means the grant path is the only funding family that constrains the entity choice.

So the decision structure is: if grants are on the critical path, the entity must be a 501(c)(3) or the project must sit under a fiscal sponsor (doc 02); if the funding mix is sponsorship and paid support, an LLC or equivalent for-profit structure (doc 01) serves without the nonprofit formation overhead.
