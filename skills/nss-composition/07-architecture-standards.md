# 07. Architecture standards the composition section encodes

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). The synthesis is embedded in the source doc; the standards themselves (arc42, C4) are grounded by dig results below.

## Scope

The source doc grounds its composition axis in 4 standards families: Parnas and SEI structural views, arc42, C4, and multi-graph decomposition. It adds dependency-cruiser and package-design principles as tooling and evaluative layers (covered in subtopic 08).

## Parnas and architectural views: structure is parts plus relations

The source doc attributes to SEI's Software Architecture Documentation in Practice a definition of architecture as structures consisting of parts, externally visible properties, and relationships (source doc). SEI identifies a module structure ("is part of" and information hiding) and a uses structure ("depends on the correctness of"), and distinguishes development and module organization from runtime and process and deployment structures. The source doc calls this the strongest conceptual foundation: composition is not a diagram style, it is a family of related structures, each with a different edge meaning (source doc).

## arc42: hierarchical static decomposition plus runtime interaction

The dig results ground the arc42 claims:

- The Building Block View shows the static decomposition of the system into building blocks: modules, components, subsystems, and similar units (https://docs.arc42.org/section-5/, weight 0.67).
- The Runtime View describes concrete behavior and interactions of the system's building blocks in the form of scenarios: how building blocks execute important use cases or features, how they cooperate with users and neighboring systems at critical external interfaces, and their startup, shutdown, and error behavior (https://docs.arc42.org/section-6/, weight 0.49).
- The full template has 12 sections, each documented on docs.arc42.org (https://arc42.org/overview/, weight 0.46).

The source doc adds the template mechanics: the Building Block View uses hierarchical black-box and white-box refinement, overall system first, then selected internals, and its black-box template covers purpose and responsibility, interfaces, optional quality characteristics, location, requirements, and risks (source doc). The axis reads arc42 as the precedent for separating the static composition surface (what is composed of what) from the runtime surface (how instances interact), which is exactly the static-import versus runtime-call distinction the axis scores.

## C4: composition as zoomable abstraction

The dig results ground the C4 claims:

- The C4 model is named after its core set of static structure diagrams: system context, containers, components, and code. The different levels of zoom let you tell different stories to different audiences, and you do not need to use all 4 levels: the system context and container diagrams are sufficient for many audiences (https://c4model.com/diagrams, weight 0.62).
- The model is built on a set of hierarchical abstractions (software systems, containers, components, code) and a matching set of hierarchical diagrams (https://c4model.com/, weight 0.51).
- Practitioner guides converge on choosing the right zoom level before drawing, with landscape, dynamic, and deployment views available for broader scope, runtime behavior, and infrastructure (https://www.structspace.com/guides/c4-model-diagram-guide/, weight 0.28, weak), and on common per-level mistakes teams make in practice (https://revision.app/blog/practical-c4-modeling-tips, weight 0.23, weak).

The source doc extracts 3 rules from C4 (source doc): composition must be hierarchical and zoomable; each diagram must declare its abstraction level and audience; and an edge must say what it means rather than being a bare line. It also highlights the C4 container diagram as especially relevant to modular monoliths because it shows responsibility distribution, technology choices, and communication between major applications and data stores while avoiding deployment detail.

## Composition is multiple graphs, not one

The source doc enumerates the graph levels software structure lives at (source doc): call graphs (functions and methods as nodes, caller to callee edges, runtime oriented or execution-potential view), import and module dependency graphs (files, modules, packages, or namespaces as nodes), package graphs (workspaces as nodes), plus inheritance, control-flow, and data-flow views. Collapsing them into 1 "dependency diagram" creates ambiguity about what a cycle actually means (source doc). This is the analytical basis for distinction 3 in subtopic 04.

## How the standards map to the rubric

The mapping, derived from the source doc: the SEI module and uses structures justify dimensions 1, 2, and 8 (callers, callees, coupling signals); arc42's Building Block View and Runtime View justify dimension 6 (static versus runtime surfaces) and the per-integration scenario table at level 5; C4's level discipline justifies the red flag against mixing system context with code elements without a legend; and the multi-graph decomposition justifies the 7 evidence layers in subtopic 09.
