# 02. Grounding (what exists)

**Scope:** Grounding (what exists): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md.

## Inventory of existing machinery

The ground source (yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md) lists three things that already exist and that the routing regime must compose rather than replace.

**The jev-orchestrator on the steady-orbit worker.** Its parts, as enumerated in the source: a fail-closed deterministic gate; approval bindings; six terminal states; an append-only audit log; automations with a 3-tier Llama runtime (classify 8b, draft 70b, llama-guard); an evolution loop; corpus and taste engines; and clef as the decision model, at policy v6 at the time of writing. Nothing in the MVP adds a new model; the lanes are these existing tiers and automations.

**The doctrine.** "Measurements are data, never authorization: instruments propose, the gate disposes." This is not a style preference. It is the rule that keeps a new instrument from becoming a privilege-escalation path.

**The detector's validated claim set (Addendum 7).** D reads hierarchy (Sierpinski gasket 1.585 to 1.60 versus everything else at or below 1.37) and area-filling; it does NOT read order. The falsification-corpus methodology, which is CI-guarded, is the calibration discipline any new routing claim must pass.

## How the wider field handles approval gates

The closest external analogue to "the gate disposes" is the human-in-the-loop approval pattern. Microsoft's Agent Framework documentation is the strongest-weighted source in this dig: it separates responsibilities so that "MAF tool approval remains responsible for deciding whether a tool requires approval" while AG-UI only transports the request and the client's decision [Human-in-the-Loop with AG-UI | Microsoft Learn](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/ui/ag-ui/human-in-the-loop) (weak backing, clef weight < 0.5; clef weight: 0.4420). That separation, decider versus transporter, matches the jev split between the instrument (which proposes) and the gate (which decides allowed, needs_approval, or blocked).

AxonFlow's governance docs describe approval entries that "stay approvable, rejectable and listable, and still expire on schedule" [Human-in-the-Loop AI Approval Workflows | AxonFlow Documentation](https://docs.getaxonflow.com/docs/governance/human-in-the-loop/) (weak backing, clef weight < 0.5; clef weight: 0.2240), which parallels jev approval bindings that expire and invalidate on policy change. The agentic-patterns catalogue frames the same idea as systematically inserting human approval gates for designated high-risk functions [Human-in-the-Loop Approval Framework - Agentic Patterns](https://www.agentic-patterns.com/patterns/human-in-loop-approval-framework/) (weak backing, clef weight < 0.5; clef weight: 0.2191), and Microsoft's Work IQ preview (targeted November 2026) adds agent pauses for human approval [Work IQ Human-in-the-Loop Agents: Microsoft Plans Approval Pauses for ...](https://windowsforum.com/news/work-iq-human-in-the-loop-agents-microsoft-plans-approval-pauses-for-january-2027.449170/) (weak backing, clef weight < 0.5; clef weight: 0.1217). The Wikipedia entry on humans [Human - Wikipedia](https://en.m.wikipedia.org/wiki/Human) (weak backing, clef weight < 0.5; clef weight: 0.0298) is an off-topic hit and contributes nothing.

## Calibration: what the dig found and why it does not transfer

The second seed query reached for calibration and fractal literature. FRACAL (CVPR 2025) is a post-calibration method for long-tailed object detection that uses a fractal-dimension-informed logit adjustment [GitHub - kostas1515/FRACAL: [CVPR2025] Fractal calibration for long ...](https://github.com/kostas1515/FRACAL) (weak backing, clef weight < 0.5; clef weight: 0.0705) [[2410.11774] Fractal Calibration for long-tailed object detection](https://arxiv.org/abs/2410.11774) (weak backing, clef weight < 0.5; clef weight: 0.0722). scikit-learn's CalibratedClassifierCV documents sigmoid versus isotonic calibration for imbalanced data [CalibratedClassifierCV: scikit-learn 1.9.0 documentation](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibratedClassifierCV.html) (weak backing, clef weight < 0.5; clef weight: 0.1079). These are calibrations of classifier probabilities. The yubiOS calibration is a different object: it is a pre-registered check that a fixed band edge separates synthetic gold artifacts whose true class is known by construction.

General fractal background (the Wikipedia fractal article [Fractal - Wikipedia](https://en.wikipedia.org/wiki/Fractal) (weak backing, clef weight < 0.5; clef weight: 0.1055) and a spatial-percolation threshold paper [[0908.0104] Fractal dimension and threshold properties in a spat…](http://arxiv.org/abs/0908.0104) (weak backing, clef weight < 0.5; clef weight: 0.1032)) confirms the vocabulary but not the instrument. The detector's numbers (gasket 1.585 to 1.60, non-hierarchical at or below 1.37) are internal records and stand on the ground source alone.

## What "grounded" means for the design

Because every component exists, the regime is mostly wiring:

- The **instrument** for images is edge-standard-v1; for text documents it is the scorer. Both are described as proven.
- The **band table** goes into policy (the source proposes v7 `routing.bands`) through the audited promote flow, never hardcoded.
- The **gate** is unchanged. A routing proposal is just another gated action.
- The **audit** is unchanged. Route decisions become run rows.
- The **calibration** reuses the falsification corpus generators as the gold corpus.

The single genuinely new surface is `POST /api/jev/route`, plus a router card in the /jev/ console. Everything else is composition.

## Evidence quality note

One result in this dig approaches the 0.5 threshold (Microsoft Learn at 0.4420); all 10 are below it and labelled weak backing. They illustrate the approval-gate pattern in industry. The inventory itself, including every number, is drawn from the ground source.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | GitHub - kostas1515/FRACAL: [CVPR2025] Fractal calibration for long ... | https://github.com/kostas1515/FRACAL | 0.0705 | weak (< 0.5) |
| 2 | [2410.11774] Fractal Calibration for long-tailed object detection | https://arxiv.org/abs/2410.11774 | 0.0722 | weak (< 0.5) |
| 3 | Fractal - Wikipedia | https://en.wikipedia.org/wiki/Fractal | 0.1055 | weak (< 0.5) |
| 4 | [0908.0104] Fractal dimension and threshold properties in a spat… | http://arxiv.org/abs/0908.0104 | 0.1032 | weak (< 0.5) |
| 5 | CalibratedClassifierCV: scikit-learn 1.9.0 documentation | https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibratedClassifierCV.html | 0.1079 | weak (< 0.5) |
| 6 | Human-in-the-Loop AI Approval Workflows / AxonFlow Documentation | https://docs.getaxonflow.com/docs/governance/human-in-the-loop/ | 0.2240 | weak (< 0.5) |
| 7 | Human-in-the-Loop with AG-UI / Microsoft Learn | https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/ui/ag-ui/human-in-the-loop | 0.4420 | weak (< 0.5) |
| 8 | Human-in-the-Loop Approval Framework - Agentic Patterns | https://www.agentic-patterns.com/patterns/human-in-loop-approval-framework/ | 0.2191 | weak (< 0.5) |
| 9 | Human - Wikipedia | https://en.m.wikipedia.org/wiki/Human | 0.0298 | weak (< 0.5) |
| 10 | Work IQ Human-in-the-Loop Agents: Microsoft Plans Approval Pauses for ... | https://windowsforum.com/news/work-iq-human-in-the-loop-agents-microsoft-plans-approval-pauses-for-january-2027.449170/ | 0.1217 | weak (< 0.5) |
