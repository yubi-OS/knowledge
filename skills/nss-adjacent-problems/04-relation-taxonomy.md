# 04 - The seven-relation taxonomy

**Scope:** The fixed seven-relation taxonomy (intersection, analogy, abstraction, substitution, alternative, prior-art, extension) and the Springer typology of related-work relationships the source doc cites as its derivation.

## The vocabulary

The source doc (`yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`) fixes 7 relation types:

1. **intersection** - the two artifacts share a region of concern without either containing the other.
2. **analogy** - the two artifacts share structure while differing in domain.
3. **abstraction** - one artifact is a more general statement of the other.
4. **substitution** - one artifact can replace the other for some use.
5. **alternative** - the two artifacts solve the same focal problem differently.
6. **prior-art** - one artifact existed before and grounds the other's novelty claim.
7. **extension** - one artifact builds on and extends the other.

The taxonomy is closed: the constraints section states "The seven-relation taxonomy is fixed" and the guidelines state that new relations require a vocabulary revision, not an ad hoc addition. This closure is what makes dimension 6 of the scoring rubric (doc 03) checkable: a file either classifies its links in this controlled vocabulary or it does not.

## Why a controlled vocabulary

The scoring rubric awards full credit for dimension 6 only when "a controlled vocabulary is used" rather than free-form "see also" links. The distinction matters because a link without a type does not tell the reader what to do with it: is the referenced artifact a competitor (alternative), a foundation (prior-art, extension), or a cautionary parallel (analogy)? The type converts a hyperlink into a decision input.

Work on semantic relations in scholarly classification supports the same move. An ISKO (International Society for Knowledge Organization) encyclopedia article on phenomenon-based classification reviews the theory and structure of relationships between research across disciplines and argues that explicit relationship types benefit interdisciplinary work (weak backing, weight 0.39, version 1.0 article by Gnoli, Smiraglia, and Szostak) [https://www.isko.org/cyclo/phenomenon.htm]. A Springer chapter on a typology of semantic relations for scientific literature proposes classifying relations between papers beyond raw citation links, which is the same design decision at literature scale (weak backing, weight 0.29) [https://link.springer.com/chapter/10.1007/978-3-319-53637-8_3].

## The Springer derivation

The source doc's changelog names its source synthesis: "Springer typology of related-work relationships (intersection / interpretation / expansion / abstraction / reification / analogy / substitution)." The yubiOS taxonomy is a curated derivative of that 7-term typology. The mapping is not 1:1:

- intersection, abstraction, analogy, substitution carry over directly.
- interpretation maps onto the yubiOS relation pair prior-art + extension: interpreting earlier work is grounded in prior-art, while building further on it is extension.
- expansion maps onto extension.
- reification has no direct yubiOS equivalent and was dropped from the vocabulary.

The yubiOS additions are alternative and prior-art as first-class terms, which reflect the axis's operational focus: the skill exists to score design decisions against alternatives and their history, so those 2 relations get canonical status that a general related-work typology does not give them.

## Usage rules

The guidelines tie the vocabulary to 3 of the 10 dimensions:

- Dimension 1 (related problems named) requires a relation type on each named problem, and the type must come from this vocabulary.
- Dimension 6 (relation type classified) is scored on vocabulary use.
- Guideline 6 states the taxonomy must be used verbatim; a file that invents a relation type ("comparable", "similar-ish") falls to score 1 on dim 6.

## Anti-patterns the vocabulary prevents

The source doc's distinctions section (doc 05) is effectively a set of confusion pairs the vocabulary exists to separate: related problem vs alternative solution, prior art vs alternative solution, sibling tool vs problem family, "see also" vs relation type. Each pair collapses 2 distinct terms into 1 free-form gesture. A file that uses the controlled vocabulary cannot make these confusions silently: writing `alternative` where the true relation is `prior-art` is a checkable error, whereas writing "see also" hides the error entirely.

## Degenerate-use red flag

The red-flag table warns about the sweep-level failure mode: "40+ lenses all verdict=YES score=50" means the experiment is degenerate. The vocabulary plays a role here: if every file's relationship map classifies every link as the same relation type, the scoring pass measured nothing. Correct vocabulary use should produce heterogeneous relation distributions across a corpus.
