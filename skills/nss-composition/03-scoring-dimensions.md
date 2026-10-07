# 03. Scoring dimensions: the 10 dimension, 0 to 2 rubric

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). The dimension rubric is embedded in the source doc; the external metric concepts (coupling, instability, fan-in and fan-out) are grounded by the dig results below.

## The 10 dimensions

Each dimension scores 0, 1, or 2, for a maximum of 20 (source doc):

1. **Callers / consumers named.** The file names the agents, scripts, workflows, services, or humans that invoke it. Score 2 if 3 or more callers are named with entry point and contract.
2. **Callees / dependencies named.** The file enumerates the modules, services, tools, libraries, or systems it invokes. Score 2 if 3 or more callees are named with edge type and rationale.
3. **Integration points enumerated.** External system boundaries (HTTP endpoints, IPC, FIFO, socket, event bus, file mount, DB, queue, signal) are listed with protocol, payload, timeout, retry. Score 2 if every external integration has all 6.
4. **Sibling files identified.** The file names its parallel artifacts, the other files in the same group or role that share its responsibility. Score 2 if siblings are named with the shared-responsibility rationale.
5. **Module boundary declared.** The file states what is public API versus private internals, and what is allowed or forbidden to depend on it. Score 2 if the boundary has explicit allow/deny rules, for example a dependency-cruiser .dependency-cruiser.json, a Rego policy, or an mkosi drop-in lex-sort rule.
6. **Static-vs-runtime-vs-config edge distinction.** The file distinguishes a static import from a runtime call from a configuration-discovered edge. Score 2 if at least 1 edge is explicitly labeled with its discovery mechanism.
7. **Ownership and state boundary.** The file names which module or team owns the data, the configuration, the secrets, and the lifecycle it touches. Score 2 if ownership is explicit for both code and runtime state.
8. **Cohesion / coupling signals.** The file surfaces its fan-in (who depends on it), fan-out (what it depends on), instability, and acyclic-property evidence. Score 2 if at least 2 of these are quantified or sourced.
9. **Cross-context invariance.** The composition map holds across the relevant contexts: operator, developer, CI, architect. Score 2 if all 4 contexts see the same map.
10. **Source-link / evidence integrity.** Every composition claim is backed by a source path, build artifact, ADR, or test reference. Score 2 if a machine check is feasible.

Convert the total to a label: 0 to 3 Narrow, 4 to 7 Emerging, 8 to 12 Useful, 13 to 16 Strong, 17 to 20 Comprehensive (source doc).

## Scoring behavior, not keywords

Guideline 1 of the source doc: a token like "depends on" earns at most partial credit; full credit requires a caller name, an entry point, an edge type, and a source link (source doc). Guideline 2: name callers AND callees; a file that lists only dependencies answers half the question (source doc).

## The external metrics behind dimension 8

Dimension 8 asks for fan-in, fan-out, instability, and acyclicity evidence. The dig results ground these terms, though every dig source for this subtopic scored below 0.5 and is labeled weak:

- Afferent coupling is defined as the number of modules that depend on a specific module; a module with a high fan-in value is likely to induce changes on the components that depend on it (https://www.entrofi.net/coupling-metrics-afferent-and-efferent-coupling/, weight 0.20, weak).
- In the balanced coupling model, efferent coupling is the number of upstream components a downstream component has, and afferent coupling is the number of consumers an upstream component has; the two are primarily used to compute the software package metrics (https://coupling.dev/posts/related-topics/afferent-and-efferent-coupling/, weight 0.25, weak).
- Instability is defined as I = Ce / (Ce + Ca), the ratio of efferent to total coupling, in the range 0 to 1, described as an indicator of a package's resilience to change (https://en.wikipedia.org/wiki/Software_package_metrics, weight 0.24, weak).
- In Martin's formulation, afferent coupling Ca counts the classes outside a package that depend on the package, and efferent coupling Ce counts the classes outside the package that the package depends on (https://www.researchgate.net/publication/31598248_A_Validation_of_Martin's_Metric, weight 0.38, weak).
- Module coupling, with its efferent and afferent kinds, is described as one of the most important metrics in software design and is used to guide refactoring (https://codinghelmet.com/articles/how-to-use-module-coupling-and-instability-metrics-to-guide-refactoring, weight 0.23, weak).
- A software measurement model normalizes internal quality attributes, coupling and cohesion, to measure component quality based on internal strength and the coupling exhibited with other components (https://www.sciencedirect.com/org/science/article/pii/S1546221823007154, weight 0.23, weak).

The source doc's own reading of these signals is conservative: treat them as signals, not universal thresholds. A high fan-in stable abstraction can be healthy, while a low-edge module can still have a disastrous shared database or runtime coupling (source doc).

## No fractional scores

The rubric is binary per dimension with no fractional scores, and measurement is local only, with no network access during scoring (source doc, Constraints).
