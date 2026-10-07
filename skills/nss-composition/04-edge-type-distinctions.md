# 04. Edge-type distinctions: static import, runtime call, configuration-discovered

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). The distinction list is embedded in the source doc; the external tooling evidence (Kythe, static-versus-runtime call-graph analysis) comes from the dig results below.

## The three edge mechanisms

The axis scores a file's ability to distinguish 3 kinds of edges (source doc):

- **Static import**: a compile-time edge, an `import` or `require` reference.
- **Runtime call**: an edge executed at runtime, a `curl`, `exec`, `os.system`, or message-bus publish.
- **Configuration-discovered**: an edge found in configuration, such as a systemd `Wants=foo.service` reference or a workflow `uses: ./.github/workflows/foo.yml` reference. Static-import-only analysis misses these entirely (source doc).

A file scoring 2 on dimension 6 explicitly labels at least 1 edge with its discovery mechanism (source doc).

## The 9 important distinctions

All 9 are stated in the source doc (attributed to the source doc):

1. **Static import is not runtime call.** Drawing them identically collapses 2 different composition surfaces into 1.
2. **Documented dependency is not executed dependency.** A `package.json` `dependencies` entry that the code does not import is a static-only edge.
3. **Call graph is not dependency graph.** Caller/callee graphs, module/import graphs, and package graphs have different node sets and edge meanings; collapsing them creates ambiguity about what a "cycle" means.
4. **Build-time integration is not runtime integration.** A Containerfile `RUN` line invokes a command at build time; the same command in a systemd unit invokes it at runtime. The composition surface and failure modes differ.
5. **Sibling file is not integration point.** A sibling is a parallel artifact sharing a responsibility (the nss-mode, nss-lifecycle, and nss-composition skills are siblings); an integration point is a runtime or build-time boundary crossing a process or trust domain.
6. **C4 level is not edge.** C4 is the abstraction hierarchy; an edge is the relationship. A diagram mixing levels without a legend is unusable; an edge without a level is ambiguous.
7. **Composition is not dependency direction alone.** Two-way integration, one-way composition, and cycles are 3 different shapes the map must say which.
8. **Boundary is not absence of edges.** No edges means unreachable; 1 edge in and 0 out is a leaf; many in and 1 out is a hub. The shape conveys the role.
9. **Configuration-discovered edge is not invisible edge.** A systemd `Wants=` reference and a workflow `uses:` reference are discoverable in configuration; the static-import graph just does not see them.

## External evidence: call graphs over-approximate

The source doc cites Kythe's position that resolving a complete call graph can over-approximate possible calls, because of dynamic dispatch, reflection, dependency injection, callbacks, and generated code. The dig results back the mechanism, though all dig sources for this subtopic scored below 0.5 and are labeled weak:

- The Kythe graph contains information about callable objects like functions and ref/call edges that target them, which satisfies queries about the locations at which different functions are called (https://kythe.io/docs/schema/callgraph.html, weight 0.39, weak).
- Kythe's graph schema models a set of programs, where different programs link against different implementations for the same declaration, rather than a single program (https://www.kythe.io/docs/schema/callgraph.html, weight 0.34, weak).
- Kythe is a pluggable, mostly language-agnostic tooling ecosystem; the project README documents its packaged toolset (https://github.com/kythe/kythe, weight 0.34, weak).
- Static analysis and runtime tracing differ in how they handle dynamic dispatch, reflection, and dependency injection when building call graphs (https://inferensys.com/differences/ai-coding-agent-memory-and-repository-context-tools/code-knowledge-graph-platforms/static-analysis-vs-runtime-tracing-for-call-graphs, weight 0.24, weak).
- The trade-off framing: static call-graph analysis favors exhaustive dependency mapping for large-scale refactoring and audits, while dynamic trace indexing favors grounding in actual runtime behavior (https://inferensys.com/differences/ai-software-factory-platforms/repository-context-and-indexing-tools/static-call-graph-analysis-vs-dynamic-trace-indexing, weight 0.20, weak).
- Hybrid static and runtime call-graph construction uncovers hidden invocation paths in languages with dynamic dispatch (https://www.in-com.com/blog/advanced-call-graph-construction-in-languages-with-dynamic-dispatch/, weight 0.20, weak).

## Why the axis makes this a scoring dimension

The practical consequence, from the source doc: an edge without a type cannot answer "which integration or runtime scenario explains this edge?". The edge-typed vocabulary is fixed at contains / imports / calls / publishes / subscribes / reads / writes / deploys-with / depends-on, and new edges require a vocabulary revision (source doc). Guideline 3 states it directly: distinguish static-import from runtime-call from configuration-discovered; they are 3 different edges and one diagram collapses them (source doc).
