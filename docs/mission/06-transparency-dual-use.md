# 06: Transparency and the dual-use stance

Scope: the source doc's "Don't be evil" section: publishing threat models, mitigations, and gaps; refusing dark patterns, phone-home telemetry, and unauditable trust anchors; the rule that control wins over convenience and that features needing security exceptions get cut.

## What the source doc claims

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) states that yubiOS is security infrastructure and that security tooling is dual-use. Its response is publication: "We publish our threat models, our mitigations, and our gaps" (source doc), pointing at MITIGATE.md's honest "what we cannot fully prevent" table (source doc). It commits to not shipping dark patterns, phone-home telemetry, or trust anchors the owner cannot audit and replace (source doc). When a design choice trades user control for convenience, "control wins" (source doc). And the hard edge: "If a feature ever needs a security exception to exist, it gets cut" (source doc).

## The dig set on dual use

The academic results frame the term the source doc uses, though all weights are weak (< 0.5) and the dig skewed toward research-ethics governance rather than security tooling specifically.

- A Sage journal article characterizes the problem of dual use as covering "a wide range of activities or types of research and technology utilization" (https://journals.sagepub.com/doi/pdf/10.1177/17470161241261466, weight 0.07, weak). A second Sage article emphasizes researchers' own responsibility and awareness of dual-use risks and mitigation strategies (https://journals.sagepub.com/doi/full/10.1177/17470161241261044, weight 0.11, weak).
- A systematic review of dual-use governance highlights the role of collaborative frameworks in ethical oversight (https://rsisinternational.org/journals/ijriss/articles/ethics-regulation-and-governance-in-dual-use-research-a-systematic-review/, weight 0.15, weak).
- The NIH Office of Intramural Research maintains guidance on the identification, assessment, management, and responsible communication of dual-use research (https://oir.nih.gov/sourcebook/ethical-conduct/special-research-considerations/dual-use-research, weight 0.44, weak), the highest-weighted result in this subtopic. Its four verbs (identify, assess, manage, communicate) map cleanly onto the source doc's practice: identify the dual-use surface, assess it in MITIGATE.md, manage it with controls, communicate the gaps in the cannot-fully-prevent table.
- A research-security guideline document from VLIR covers researcher obligations when research has security concerns (https://vlir.be/wp-content/uploads/2025/10/202509-VLIR-Guidelines-Research-Security.pdf, weight 0.14, weak).
- Three off-topic results (a dictionary entry, https://www.merriam-webster.com/dictionary/dual, weight 0.19; a computing-history essay, http://www.loper-os.org/?p=861, weight 0.14; an unrelated geoscience paper, https://www.lyellcollection.org/doi/abs/10.1144/SP313.11, weight 0.08) were collected by the queries and weighted low; they are archived but not cited substantively.

## Publication as a trust mechanism

The source doc's publication stance is not generic openness; it is the structural-trust argument applied to the project itself. If a system asks its owner to trust it, the owner needs the same verification material the system applies to its own inputs: a threat model states what is defended, a mitigation map states how, and a gaps table states what is not (source doc). An unauditable trust anchor fails the doc's definition of AI resilience directly, because a component "the owner cannot audit and replace" (source doc) is one whose provenance can never be re-verified by the person who bears the risk.

The "control wins" rule and the cut rule give the stance teeth on the inside: convenience is not a tiebreaker, and a feature whose existence depends on a security exception is treated as already failed (source doc). Together with the gaps table, the project's honesty extends to its own limits, which is what separates published gaps from hidden ones in practice.

## Sources note

Results kept for this subtopic: 8, of 8 weighted. Primary-backing count (weight >= 0.5): 0; the strongest result is the NIH dual-use research sourcebook page at weight 0.44. The dig was query-skewed toward research-ethics governance, which is the adjacent problem to the security-tooling dual-use question the source doc poses; three of the eight results were off-topic and are archived at low weight without citation. A redo with security-specific queries was not triggered because the subtopic cleared the thin-dig floor on its seed queries; a future refresh should target security-tooling disclosure norms directly.
