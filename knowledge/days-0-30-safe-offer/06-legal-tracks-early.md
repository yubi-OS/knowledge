# Legal Groundwork Before the Offer

Scope: Legal groundwork before the offer: trademark and naming, licensing posture, contributor provenance, entity formation, and public-interest covenants for an open-source security project.

## Why legal tracks open in weeks 1 to 2, not at launch

An offer cannot be finalized while the project's name, license posture, and ownership structure are unsettled, because each of those changes what the offer legally is. The days 0 to 30 pattern is to open the legal tracks early and in parallel with positioning, so that offer and pricing work (weeks 3 to 4) lands on settled ground. Three tracks matter for an open-source security project: trademark and naming, licensing and contributor provenance, and the covenant or policy commitments that define how the project will behave toward its community.

## Trademark is separate from copyright license

Casebook analysis of trademarks in open source emphasizes the distinction: an open-source license grants rights in the code, while the project name and logo are trademarks, and a licensor's control over licensed trademarks is a separate legal question from the software license ([google.github.io, weight 0.69, authoritative backing](https://google.github.io/opencasebook/trademarks/)). This distinction has direct commercial consequences for a project that will later sell support or services: a company can fork the code but cannot ship the fork under the project's name without trademark permission, which is the legal foundation for a branded commercial offer. Registering or at least reserving the name before the offer is discussed prevents a third party from registering it first.

Trademark-management guidance for open source projects frames the practice as protecting the project's name, logo, and identity while still allowing users to exercise the rights granted by the software license ([fosshub.com, weight 0.28, weak backing](https://www.fosshub.com/resources/maintainers/trademarks/)). The practical early step is deciding the trademark policy: who may use the name, for what, and how forks must rename.

## Licensing posture and contributor provenance

Open-source license compliance is treated by the Linux Foundation as the foundation on which open-source adoption rests, with the rapidly evolving licensing landscape making ongoing compliance tracking necessary ([linuxfoundation.org, weight 0.76, authoritative backing](https://www.linuxfoundation.org/research/open-source-license-compliance)). For a project that will commercialize, the licensing posture decision (which license for the core, which for proprietary components) must be settled before pilot contracts reference the product, because a pilot customer will ask for representations about the code's licensing.

Contributor provenance is the supply chain of ownership: a record of who contributed what and under what terms. Contributor license agreement analysis notes that most CLAs grant irrevocable licenses to the project, with asymmetries in termination rights between project and contributor worth understanding before adoption ([safeguard.sh, weight 0.35, weak backing](https://safeguard.sh/resources/blog/oss-contributor-license-agreements-review)). Historical practice is instructive: Sun's Sun Contributor Agreement, used for OpenOffice and related projects, is cited as one of the most thorough contributor agreements of its era, covering copyright assignment and related obligations ([apple-tree.life archive, weight 0.49, weak backing](https://apple-tree.life/~michael/blog/2009/)). Guidance on non-employee contributions stresses clear licensing and provenance documentation from the start of collaboration ([aaronhall.com, weight 0.32, weak backing](https://aaronhall.com/handling-ip-developed-by-non-employee-contributors/)).

Provenance tooling is also emerging as a compliance product category: launches now exist that map open-source contributor risk across software supply chains, feeding software bills of materials into policy engines for internal policy and regulatory enforcement ([industrialcyber.co, weight 0.45, weak backing](https://industrialcyber.co/news/netrise-provenance-launched-to-expose-open-source-contributor-risk-map-impact-across-software-supply-chains/)). For a security project, contributor provenance is doubly relevant: it is a legal prerequisite for the commercial offer and itself a supply-chain security claim the product will be expected to demonstrate.

## Covenants and entity decisions

A public-interest covenant (what the project commits to keeping public and open) and a conflict-of-interest policy (how the stewards handle competing commitments) are publishable documents that set expectations before money enters the picture. They should be drafted in week 2 and published or ready to publish before offer finalization, because offer terms that contradict an unstated covenant create a trust liability. Entity formation and trademark consultation proceed in parallel: both determine what the offer can legally be (who signs pilot contracts, who owns the mark), and both have lead times longer than the weeks 3 to 4 offer window, which is why they are opened in week 1.

## Sequencing summary

1. Week 1: open naming, licensing, provenance, and entity review tracks; capture the open questions.
2. Week 2: draft covenant and conflict policy; decide the trademark posture.
3. Week 3 to 4: reconcile pricing and offer against legal constraints; finalize only what the legal tracks have answered.
