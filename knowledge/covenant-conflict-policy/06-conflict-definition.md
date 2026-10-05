# 06 - What counts as a covenant conflict

Scope: a concrete test for identifying conflicts, the categories they fall into, and illustrative cases from real projects.

## The test

A workable definition is mechanical rather than vibes-based: a conflict is any proposed decision, feature, commercial offer, or roadmap change whose landing requires violating a specific, citable covenant commitment. The test has two parts: name the clause, and show the dependency. If neither can be produced, the objection is preference, not conflict, and proceeds through normal review instead of the conflict process.

## Category 1: gating public goods behind payment

The clearest conflict class is a commercial SKU that gates something the covenant commits to keeping public. The commercialization literature maps the territory: a16z's analysis of open source's move from community to commerce describes how value migrates to the commercial layer and why the boundary is contested (weight 0.49, weak backing: https://a16z.com/open-source-from-community-to-commercialization/). A practitioner analysis of open source going closed lists the user-side damage when the line moves: license breaches, surprise commercial costs, loss of community contributions (weight 0.25, weak backing: https://talkthinkdo.com/blog/when-open-source-goes-closed-commercialisation-ai-and-the-future-of-software-dependence/). The specific sub-case that matters most for trust is security: doc 05's corpus establishes that gating a security fix behind payment is outside every mainstream disclosure framework, which makes it the paradigm conflict case.

## Category 2: consent violations (telemetry)

A telemetry default that ships on is the second paradigm case, because doc 02's corpus shows the open-source norm is explicit opt-in with a working off switch. The conflict is citable against any covenant clause that commits to consent-based telemetry, and the proposal fails the test regardless of its business merits.

## Category 3: process shortcuts on protected areas

The third class is procedural: a roadmap decision touching a protected area (trust chain, disclosure, telemetry) that skips the required decision record or community process. This is a conflict against the covenant's process clauses, and it is detectable mechanically, which makes it the easiest class to enforce.

## What real covenants regulate

The closest public artifact is the Contributor Covenant, whose repository structure shows how covenant documents modularize: a preamble pledge, standards, and enforcement sections as separate modules per context (weight 0.77: https://github.com/EthicalSource/contributor_covenant). A community guide to the covenant describes its scope: behavior expectations, community scope, reporting, and enforcement responsibilities (weight 0.37, weak backing: https://www.fosshub.com/resources/community/contributor-covenant/). These regulate conduct among contributors rather than product decisions, but the architecture transfers: enumerated commitments, concrete examples, and an enforcement path.

License-level conflicts supply the hard background case: the GPL article notes the license's guarantees exist precisely so that end users keep the four freedoms even as commercialization rises around a project (weight 0.18, weak backing: https://en.wikipedia.org/wiki/GNU_General_Public_License).

## Applying the test honestly

The list of categories is illustrative, not exhaustive. The operating rule for reviewers: the test is always whether landing the change requires breaking a named clause, and the burden of showing the dependency sits with the proposer, not the objector.
