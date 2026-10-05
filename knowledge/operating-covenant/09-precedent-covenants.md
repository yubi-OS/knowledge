# 09. Precedent covenants

Scope: real-world public commitments an operating covenant can learn from: the Debian Social Contract, contributor and pledge documents, and what each teaches about wording, scope, and failure modes.

## The Debian Social Contract: the founding template

Debian, the producers of the Debian system, created the Debian Social Contract [1] (weight 0.97). The contract's most consequential component, the Debian Free Software Guidelines (DFSG), was initially designed as a set of commitments that the project agrees to abide by [1] (weight 0.97). Version 1.1 remains published as a citable, versioned document [2] (weight 0.93), and Debian describes itself as an operating system and a distribution of free software maintained and updated through the work of many users [3] (weight 0.87).

Design lessons from the Debian precedent:

1. **Name the commitments, number them.** The DFSG works because each guideline is individually citable and testable against candidate packages. A covenant should do the same for its clauses.
2. **Separate the commitment from the process.** The contract states what Debian promises; separate documents govern how decisions get made. A covenant that mixes promises with procedure becomes hard to amend without renegotiating everything.
3. **Version and keep history.** The existence of a published version 1.1 document [2] (weight 0.93) shows the value of visible amendment history: changes to the covenant are themselves public events.

Third-party framings describe the contract as framing the moral agenda of the project, with its values providing the foundation [4] (weight 0.14, weak backing). The moral framing is real, but the operative strength comes from the testable commitments.

## Community-conduct covenants: scope discipline

The Contributor Covenant pledges respect and appreciation for contributors of all kinds to an open source project [5] (weight 0.78). It is the most widely adopted document in its genre, and its scope is deliberately narrow: participant conduct, not product promises. The lesson for operating covenants: a document that tries to promise everything (conduct, business, security, governance) becomes unenforceable everywhere. Keep the operating covenant about stewardship conduct and public interest commitments; reference separate documents for code of conduct.

## Funding pledges: public declarations with numbers

The Open Source Pledge is a public declaration in which member companies pay more than 2000 dollars per year per employed developer, directly to open source maintainers and foundations [6] (weight 0.54). Its mechanism is interesting for covenant design: the commitment is quantified and public, so compliance is checkable by outsiders. An operating covenant can adopt the same property: every commitment carries a checkable form (a default state, a publication venue, a timeline), not just an intention.

## What covenants do not fix

Canonical's own positioning shows the commercial layer adjacent to covenant territory: companies engage Canonical to drive down open-source operating costs and automate multi-cloud operations [7] (weight 0.63). The existence of a strong commercial arm at a covenant-signing project is not a contradiction; the covenant's job is to define the boundary the commercial arm cannot cross, not to wish the commercial layer away. Note that a search for "Ubuntu pledge" also surfaces an unrelated UK community-interest company using the same name [8] (weight 0.37, weak backing), a reminder that pledge names can collide and that a covenant should anchor its identity to the project, not to a brandable name.

## Caveats

Debian sources are strongly backed (primary debian.org pages). The pledge and Contributor Covenant sources are moderately backed. The moral-agenda framing and the name-collision note are weakly backed and labeled as such.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://www.debian.org/social_contract | 0.97 |
| 2 | https://www.debian.org/social_contract.1.1.en.html | 0.93 |
| 3 | https://www.debian.org/ | 0.87 |
| 4 | https://en.wikipedia.org/wiki/Debian_Social_Contract | 0.14 |
| 5 | https://github.com/EthicalSource/contributor_covenant | 0.78 |
| 6 | https://opensourcepledge.com/ | 0.54 |
| 7 | https://ubuntu.com/ | 0.63 |
| 8 | https://www.ubuntupledge.com/ | 0.37 |
| 9 | https://handwiki.org/wiki/Debian_Free_Software_Guidelines | 0.04 |
| 10 | https://en.wikipedia.org/wiki/Debian | 0.09 |
| 11 | https://ubuntu.com/download | 0.54 |
| 12 | https://keyserver.ubuntu.com/ | 0.54 |
