# Applied case studies: published gate practice and the yubiOS applications

Scope: How published engineering practices implement pre-implementation gates, mapped onto the promoted items recorded in the source document.

## The published precedent: NASA lifecycle reviews

The most authoritative analogue for promotion gates is aerospace. NASA's project lifecycle review documentation defines the preliminary design review (PDR) as a review that the preliminary design meets all systems requirements with acceptable risk and within cost and schedule constraints, and that establishes the basis for proceeding with detailed design (https://www.nasa.gov/wp-content/uploads/2024/12/project-lifecycle-reviews-2024-fnl-11272024.pdf, jev weight 0.95, authoritative).

Read as a promotion gate, PDR has exactly the structure the gates document uses: a bounded promotion (design proceeds to detailed design), earned by evidence against stated requirements, with production claims explicitly not yet in scope. A practitioner survey of engineering design review types places reviews on a spectrum from informal peer and supplier reviews to formal gates such as preliminary design review and critical design review, each serving a distinct purpose with different participants and detail levels (https://www.colabsoftware.com/post/collaborative-engineering-101-design-review-types, jev weight 0.48, weak backing). A PLM guide describes the design review process as a systematic, comprehensive, documented examination whose goal is verifying the design meets requirements before the next phase (https://visuresolutions.com/plm-guide/design-review-process/, jev weight 0.30, weak backing).

## ADRs: the lightweight version of the same gate

For software teams, the architectural decision record is the standard lightweight gate. AWS prescriptive guidance describes an ADR as a document describing a choice the team makes about a significant aspect of the software architecture, including the decision, its context, and its consequences, with states and therefore a lifecycle, and an ADR process that outputs a consistent structure (https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html, jev weight 0.79, authoritative). The community repository documents ADRs as capturing an important architectural decision with context and consequences, with templates and examples (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.67, authoritative). GitHub's engineering blog frames the value as documenting how and why a decision was reached within a codebase (https://github.blog/2020-08-13-why-write-adrs/, jev weight 0.66, authoritative).

The gates document slots directly into this world: its output for a promoted item is an ADR, SPEC, or CI change, and its gate fields are the content that ADR must carry before it is accepted.

## Mapping onto the source doc's applications

The promotion gates document records 5 applications (yubiOS refs, roadmap-promotion-gates, 2026-07-17). Read against the published practice above, each application is a partial promotion bounded by missing evidence:

- SecTime: promoted to research/design only; hardware proof is still required before production claims. This mirrors the PDR structure (NASA, 0.95): design-level work is authorized, production claims wait for the hardware run that would prove them.
- Frost: promoted to research/design only; kernel prototype and RK hardware recovery evidence are still required. Two evidence targets are named and both are unmet, so the item cannot cross the implemented threshold.
- OpenWrt deception LAN: promoted to package/proof design only; the VM or spare-router build and packet capture remain open. The design of the proof is promotable; the proof itself needs the packet capture evidence target.
- Firmware RK tags: promoted to CI workflow metadata/publish routing; real board-divergent payloads remain hardware-lane work. This is the CI/hardware boundary gate operating live: the CI testable slice was promoted, the hardware slice was explicitly fenced off.
- Post-launch hardware ideas: stay watch-listed until they name an owner, board/deployment target, evidence target, and recovery plan. The watch list is the lifecycle's pause state, with a stated exit condition.

## What the applications collectively demonstrate

Two patterns recur across all 5 applications. First, promotions are narrow: each was promoted exactly as far as its obtainable evidence reaches, which is the discipline the NASA review gates encode at project scale. Second, every non promotion is expressed as a named missing field or missing artifact (hardware proof, prototype, packet capture, owner), never as a vague "not yet". That specificity is what makes the watch list actionable and the eventual promotion mechanical: when the named evidence exists, the gate is passed, and no new argument is needed.

## Caveat

The applications are internal to the source document and are reported here as the document records them. The published sources (NASA, AWS, GitHub) establish the gate pattern; they do not independently corroborate the internal items' current status, and this corpus makes no claim about their progress beyond the source doc's 2026-07-17 snapshot.
