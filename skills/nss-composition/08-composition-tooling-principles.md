# 08. Composition tooling and package-design principles

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). The synthesis is embedded in the source doc; the tooling and principle claims are grounded by dig results below.

## Scope

Level 5 of the coverage rubric requires machine-enforceable dependency rules and a tool-derived dependency report. This subtopic covers the tool the source doc names for that job (dependency-cruiser) and the package-design principles that give composition evaluative criteria beyond notation.

## dependency-cruiser: executable composition rules

The dig results ground the tool claims:

- The npm package documentation describes dependency-cruiser as "validate and visualize dependencies. With your rules." supporting JavaScript, TypeScript, CoffeeScript, ES6, CommonJS, and AMD (https://www.npmjs.com/package/dependency-cruiser, weight 0.58).
- The GitHub repository frames the tool around validating and visualizing dependencies, with example workflows such as generating a dot graph of the src folder and running GraphViz on the result (https://github.com/sverweij/dependency-cruiser, weight 0.53).
- A step-by-step rules tutorial walks through writing a rule for dependency-cruiser, with a rules reference for the full rule schema (https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-tutorial.md, weight 0.59).
- The project site states the mission: give insight in the dependencies within JavaScript, TypeScript, and other alt-js projects, find the weird ones, and root out the unwanted ones (https://sverweij.github.io/dependency-cruiser/, weight 0.51).

The source doc extracts the pattern from this tooling (source doc): it validates rules such as forbidden cycles, missing package declarations, and production code using development dependencies; it emits text, graph, HTML, and other reports; and its aggregation levels are a documentation pattern in themselves (detailed module graph, folder-level graph, high-level architecture graph). It also explicitly warns that a graph containing thousands of modules and edges is not informative and recommends aggregation, filtering, and focus (source doc). In the rubric, an explicit allow/deny rule set of this kind is what earns a full score on dimension 5 (module boundary declared) (source doc).

## Package design principles

The source doc lists 6 package-design principles as evaluative criteria (all attributed to the source doc):

- REP: reuse and release equivalence.
- CCP: things changing together belong together.
- CRP: things used together belong together.
- ADP: package dependencies must be acyclic.
- SDP: depend in the direction of stability.
- SAP: stable packages should be appropriately abstract.

The dig results ground the grouping, though every dig source for this subtopic scored below 0.5 and is labeled weak:

- Robert C. Martin's principle collection groups the package principles: 3 principles about package cohesion are REP, CCP, and CRP (https://principles-wiki.net/collections:robert_c._martin_s_principle_collection, weight 0.13, weak).
- The Stable Abstractions Principle combined with the Stable Dependencies Principle yields the dependency inversion principle at the package level: stable packages are abstract, unstable packages depend on stable ones, so concrete details depend on abstractions; practical application includes identifying what changes together (CCP), what is reused together (CRP), versioning what is reused (REP), and drawing the dependency graph (https://jessebellingham.com/notes/good-software-practices/design-concepts/package-principles, weight 0.23, weak).
- Clean Architecture's part 4 covers component principles, including the 3 component cohesion principles (https://trunin.com/en/2021/12/clean-architecture-part4-component-principles/, weight 0.16, weak).
- Martin presents CCP, CRP, and REP as a tension triangle: 3 principles pulling in different directions, with the architect choosing which vertex to sacrifice (https://dev.to/yannick555/solids-packaging-principles-are-jointly-unsatisfiable-27mh, weight 0.10, weak).

## Cohesion and coupling as boundary-relative

A dig result frames cohesion and coupling as boundary-relative principles: cohesion asks how strongly the elements placed inside 1 module belong together under a chosen relationship, and coupling asks what dependencies, shared assumptions, or coordination obligations cross between modules and how strong those crossings are (https://cohesivesystems.com/library/knowledge/cohesive-system-model/principles/cohesion-and-coupling/, weight 0.22, weak). This matches the source doc's framing of dimension 8: fan-in, fan-out, instability, and acyclicity are surface signals of the underlying boundary decisions, not verdicts in themselves (source doc).

## Modular monolith boundaries

The source doc's synthesis for modular monoliths (source doc): composition must document logical boundaries independently of process and deployment boundaries; modules may share 1 process and deployment while exposing only explicit APIs and events and owning clear responsibilities. The source doc attributes to the Microsoft reference architecture 3 recommendations: avoid direct cross-module calls beyond published interfaces, enforce dependency direction, and isolate state and configuration where practical (source doc).

## What this means for scoring

Combined with the source doc's guideline 7 (surface fan-in and fan-out: a high-fan-in stable abstraction is healthy, a high-fan-in unstable one is fragile) (source doc), the tooling and principles give the 0 to 20 score its teeth: a level-5 file can show a dependency-cruiser-style rule set rather than merely assert "we keep modules independent" (source doc).
