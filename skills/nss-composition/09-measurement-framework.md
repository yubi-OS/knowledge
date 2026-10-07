# 09. Measurement framework: evidence layers and indicators

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). The 7 evidence layers and the indicator list are embedded in the source doc; the external measurement traditions (design structure matrices, package metrics, co-change studies) are grounded by dig results below.

## Scope

The source doc's "How to measure composition in the repository" section prescribes several evidence layers rather than one graph (source doc):

1. **Static import graph**: direct module and package edges, cycles, orphan nodes, fan-in and fan-out.
2. **Caller/callee graph**: callers, reachable impact surface, entry points, dynamic-dispatch uncertainty.
3. **Boundary graph**: public exports versus deep imports; allowed and forbidden module edges.
4. **Runtime graph**: observed calls, events, queues, database access, retries, and failure paths.
5. **Package graph**: workspace and third-party dependency relations.
6. **Configuration graph**: workflow_call, workflow_dispatch, systemd Wants=, and udev RUN+= edges that are not in the static-import graph.
7. **Ownership/state graph**: which module owns data, migrations, secrets, queues, and operational responsibility.

## The indicators

The source doc lists useful indicators (source doc): cycle count, cross-boundary import count, percentage of imports through public APIs, fan-in and fan-out concentration, transitive impact size, orphan count, undocumented external edges, contract coverage, and the intra-module versus inter-module co-change ratio. Its interpretation rule: treat these as signals, not universal thresholds. A high fan-in stable abstraction can be healthy, while a low-edge module can still have a disastrous shared database or runtime coupling (source doc).

## External grounding 1: design structure matrices

The dig results back the matrix-based representation of dependency structure:

- The design structure matrix (DSM) is a 2-dimensional matrix representation of the structural or functional interrelationships of objects, tasks, or teams; synonyms include the N2 diagram and the dependency structure matrix (https://ocw.mit.edu/courses/esd-36-system-project-management-fall-2012/6c7bc91f35c7d387147908cd2c80c9ca_MITESD_36F12_Lec04.pdf, weight 0.68).
- DSM is also referred to as the dependency structure matrix, dependency structure method, dependency source matrix, problem solving matrix, incidence matrix, N2 matrix, interaction matrix, dependency map, or design precedence matrix: a simple, compact, and visual representation of a system or project (https://en.wikipedia.org/wiki/Design_structure_matrix, weight 0.49).
- DSM techniques support the management of complexity by focusing attention on the elements of a complex system and how they relate to each other (https://dsmweb.org/, weight 0.30, weak; the intro page at https://dsmweb.org/introduction-to-dsm/ carries weight 0.40, weak).
- Widely used UML notation is not suitable for representing large amounts of dependencies, so UML diagrams often show only the most essential relationships, making them an incomplete representation; without a DSM, such analyses are unreliable because the intended and the actual software architecture differ (https://dsmsuite.github.io/dsm_overview.html, weight 0.31, weak).

This is the measurement-layer ancestor of the axis's evidence-layer pluralism: no single representation captures the whole composition surface.

## External grounding 2: package metrics and their validation

- In Martin's metric suite, afferent coupling Ca is the number of classes outside the package that depend on the package, and efferent coupling Ce is the number of classes outside the package that the package depends on (https://www.researchgate.net/publication/31598248_A_Validation_of_Martin's_Metric, weight 0.38, weak).
- The stability metric is based on Ca and Ce among the classes of the considered package and classes outside it (https://www.researchgate.net/profile/Sinisa-Vlajic/publication/303820572_ImprovingRobertMartin%27sStabilityMetricsFinal/links/5755deb708ae10c72b66eb34/ImprovingRobertMartinsStabilityMetricsFinal.pdf, weight 0.27, weak).
- The software package metrics page defines instability as I = Ce / (Ce + Ca), in the range 0 to 1 (https://en.wikipedia.org/wiki/Software_package_metrics, weight 0.24, weak).

## External grounding 3: co-change evidence

The ownership and runtime layers of the framework are complemented by change-history evidence, which the indicator list names as the intra-module versus inter-module co-change ratio (source doc):

- An empirical study investigates the relationship between class dependency and change propagation (co-change) in Java software and finds a strong correlation between dependency and co-change (https://www.researchgate.net/publication/260648608_The_Link_between_Dependency_and_Cochange_Empirical_Evidence, weight 0.23, weak).
- A study of the Apache Aries project empirically investigates the strongest change couplings to characterize and identify their impact in software development (https://www.researchgate.net/publication/320504018_An_Empirical_Study_on_the_Interplay_between_Semantic_Coupling_and_Co-Change_of_software_classes, weight 0.29, weak).
- Version-history analyses identify software artifacts that tend to be modified together, described as logical coupling, evolutionary coupling, or change patterns (https://www.iaarc.org/publications/fulltext/ISARC2026_1059.pdf, weight 0.21, weak).

## Why layers, not one graph

The framework's rationale, derived from the source doc's distinctions: a static import graph cannot see configuration-discovered edges (layer 6 exists for that reason), a call graph over-approximates around dynamic dispatch (layer 4 records observed runtime edges instead), and a boundary graph answers a question (what is public) that no other layer answers. Scoring a file against all 7 layers is what makes the composition map correct, not merely broad (source doc).
