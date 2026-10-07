# 05 - The six key distinctions

**Scope:** The six important distinctions the skill draws: related problem vs alternative solution, prior art vs alternative solution, sibling tool vs problem family, see-also vs relation type, RFC number without context, family boundary vs adjacency. Internal-record subtopic.

## Why distinctions are load-bearing

The source doc (`yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`) states the axis scores the breadth AND correctness of a file's relationship map. Correctness fails silently when the file conflates relationship types: every conflation makes a thin map look complete. The distinctions section is therefore not commentary; it is the error catalogue the scorer applies when awarding dimensions 1, 2, 4, 6, and 8 (doc 03).

## Distinction 1: related problem is not alternative solution

A related problem shares the focal problem's *structure*; an alternative solution solves the focal problem *differently*. A Containerfile author choosing a base image solves "which immutable base"; a related problem is "which package set survives composefs" (same structure, different layer); an alternative solution is `FROM scratch` (same problem, different answer). Confusing the two collapses 2 distinct relationship types into 1 and double-counts coverage on dimensions 1 and 2.

## Distinction 2: prior art is not alternative solution

Prior art is what existed before; an alternative solution may include both prior art AND novel designs. Prior art without an alternative-solution relationship is just a bibliography. This is why dimension 4 (prior-art citations) requires each alternative to carry at least 1 citation with context, while dimension 2 (alternatives enumerated) counts alternatives regardless of age. A file with 9 references and 0 enumerated alternatives scores 2 on dim 4 and 0 on dim 2: the bibliography is not a design-space map.

## Distinction 3: sibling tool is not problem family

A sibling tool may solve a different problem in the same family. The family is the abstract shape; the sibling is 1 implementation. Naming `rclone` when the family is "state synchronization" names a sibling; naming the family and its boundary ("sync vs backup vs package management") is what dimension 3 and 8 require. The sibling-vs-family confusion produces files that look well-connected while never saying which problem the family is.

## Distinction 4: "see also" is not relation type

"See also" is a link; the relation type (analogy, alternative, prerequisite, extension) is what makes the link useful. The source doc's red-flag table lists "See also without a relation type" as meaning "the link is decorative, not informative." This is the scoring-behavior rule in miniature: the token `see also` earns at most partial credit; full credit needs a relation type, a trade-off, and a flip condition.

## Distinction 5: RFC number without context is not cross-reference

"See RFC 8174" without saying what RFC 8174 says and why it matters here is a name-drop. RFC 8174 exists to reduce ambiguity by clarifying that only UPPERCASE usage of the RFC 2119 key words carries normative force [https://www.rfc-editor.org/info/rfc8174/], a fact that only supports a claim when the file explains which of its own requirements are normative and why the convention was adopted. The distinction feeds dimension 4: every alternative has at least 1 citation *with context*.

(Note: the RFC 2119/8174 cross-reference conventions subtopic was scored 0.42 and dropped from this corpus by the outline validation; this doc retains the distinction as the source doc states it. See the README gaps section.)

## Distinction 6: problem-family boundary is not adjacency

Two problems in the same family may have no adjacency; 2 problems in different families may be near-adjacent (functional analog). This distinction protects dimension 8 from mechanical scoring: the boundary a file must name is the boundary between ITS family and the neighboring family that would change the decision, not merely the nearest similarly-named problem. The source doc's example: a secure-boot ADR that does not say "we did not pick measured-boot, here's why" under-sells the choice, even though measured boot sits in a neighboring family.

## How the distinctions interact with the rubric

| Distinction | Dimensions it protects | Failure it prevents |
|---|---|---|
| related problem vs alternative | 1, 2 | double-counting a cousin problem as an alternative |
| prior art vs alternative | 2, 4 | bibliography masquerading as design space |
| sibling tool vs family | 3, 8 | name-dropping tools without naming the family |
| see-also vs relation type | 6 | decorative links earning structural credit |
| RFC number vs cross-reference | 4 | citation without context |
| family boundary vs adjacency | 8 | scoring the nearest name instead of the decision-relevant boundary |

## The one-sentence test

For each link in a file's relationship map, the distinctions reduce to 1 question: could a reader who has never seen this file reconstruct from the link alone (a) what problem the referenced artifact solves, (b) how it relates to the focal choice, and (c) under what condition the choice would change? If any answer is missing, the link is a name-drop and the corresponding dimension scores 1, not 2.
