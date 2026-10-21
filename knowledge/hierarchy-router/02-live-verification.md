# 02. Live Verification: Pre-Policy and Post-Promote

**Scope:** Live verification: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md`. Dig context: `dig_context_02.json` (10 clef-weighted searXNG results).

## Two verification passes

The build record verifies the router twice: once under the old policy (v6), before the routing bands existed, and once after promoting v7. The two passes test opposite things: that nothing dispatches without bands, and that the right things dispatch with them.

## Pass 1: pre-policy (v6)

- Selftest ok.
- Bands empty.
- A text probe was **measured** (scorer-v2.2 live) and then **blocked fail-closed**.
- The reverse hazard was verified graceful: the v6 gate seeing a `route.dispatch` action returns `unknown_tool` rather than crashing or allowing.

This pass proves the router degrades safely. With no bands configured, measurement still runs, but nothing is authorized. An action type the gate does not know is rejected by name.

## Pass 2: post-promote (v7)

- Health reports policy 7.
- Bands: 4.
- Selftest: 21/21.
- **gasket L=384** -> band `hierarchy-image` -> gate allowed -> task `t_894b380e6126f9bd` created.
- **multimodal probe** -> `needs_approval` (reason `band_provisional`), never auto-dispatched.
- **text probe** -> blocked (reason `no_matching_band`), no task.

Three probes, three different outcomes, each the designed one: allowed, held for approval, blocked.

## Why a gasket is the positive probe

The gasket is the falsification corpus's hierarchical exemplar, and its edge-standard D sits above the 1.45 hierarchy edge (doc 03 gives 1.5589 for L384). Box counting is the measurement behind that D. The Wikipedia overview describes box counting as analyzing a pattern by breaking it into smaller and smaller pieces: [Box counting - Wikipedia](https://en.wikipedia.org/wiki/Box_counting) (clef weight: 0.3000) (weak backing, clef weight < 0.5). A Springer chapter shows the box-counting method applied to brain-neuron morphology to obtain a fractal dimension: [The Morphology of Brain Neurons: The Box-Counting Method in ... - Springer](https://link.springer.com/chapter/10.1007/978-3-031-47606-8_8) (clef weight: 0.1628) (weak backing, clef weight < 0.5). A GIS conference paper defines box-counting dimension by counting unit boxes that intersect a planar set: [Microsoft Word - Paszto](http://gisak.vsb.cz/GIS_Ostrava/GIS_Ova_2011/sbornik/papers/Paszto.pdf) (clef weight: 0.1791) (weak backing, clef weight < 0.5). An arXiv paper on complexity-aware quantization computes hierarchical morphological descriptors on feature maps: [MCAQ-YOLO: Morphological Complexity-Aware Quantization for...](https://arxiv.org/html/2511.12976) (clef weight: 0.1900) (weak backing, clef weight < 0.5). All are weak-backed context; the router's numbers come from the build record.

## Fail-closed in the wider literature

The router's gate is fail-closed: absence of a matching band or an unknown tool means no dispatch. That posture has external analogues. Microsoft's agent-governance-toolkit ADR 0030 adopts an action-bound, fail-closed approval protocol: [ADR 0030: Use an action-bound, fail-closed approval protocol](https://microsoft.github.io/agent-governance-toolkit/adr/0030-action-bound-approval-protocol/) (clef weight: 0.3348) (weak backing, clef weight < 0.5), and the GitHub copy states that a `require_approval` result is a suspended decision, neither allow nor deny: [agent-governance-toolkit/docs/adr/0030-action-bound-approval ...](https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/adr/0030-action-bound-approval-protocol.md) (clef weight: 0.2791) (weak backing, clef weight < 0.5). That matches the router's `needs_approval` outcome for the provisional band. A glossary entry defines policy-bound execution as checking every proposed agent action against a published, versioned policy before it runs, fail-closed, with reasons: [Policy-Bound Execution: Definition (AI Agents)](https://kla.digital/glossary/policy-bound-execution) (clef weight: 0.1487) (weak backing, clef weight < 0.5). A vendor page lists a fail-closed policy engine, approval binding to workflow state, and a hash-chained append-only ledger: [Authorization-Execution Gap for Enterprise AI Agents / AI Syndicate](https://aisyndicate.io/) (clef weight: 0.2316) (weak backing, clef weight < 0.5). These carry weak weights and are analogues, not sources for the router's behavior.

## Outcome matrix

| Probe | Policy | Band | Gate | Task |
|---|---|---|---|---|
| text | v6 | none (bands empty) | blocked | none |
| route.dispatch under v6 gate | v6 | n/a | `unknown_tool` | none |
| gasket L384 | v7 | hierarchy-image | allowed | t_894b380e6126f9bd |
| multimodal | v7 | multimodal-probe (provisional) | needs_approval | held |
| text | v7 | no_matching_band | blocked | none |

## What the pass did not yet prove

The gasket task was created, but its dispatch leg ended with action state `unknown`. That is follow-up 1 (doc 04), resolved in the addendum (doc 06). Pass 2 proves gating; it does not yet prove end-to-end verified completion.

## Off-topic results

A Box.com login [Box / Login](https://account.box.com/login) (clef weight: 0.0347) (weak backing, clef weight < 0.5) and a dictionary page for "fail" [FAIL Definition & Meaning - Merriam-Webster](https://www.merriam-webster.com/dictionary/fail) (clef weight: 0.0334) (weak backing, clef weight < 0.5) back nothing.

## Takeaway

The live verification is a two-sided proof: under v6 the router measures but cannot act; under v7 it acts only where a calibrated band allows, holds where the band is provisional, and blocks where no band matches.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Box counting - Wikipedia | https://en.wikipedia.org/wiki/Box_counting | 0.3000 | weak backing, clef weight < 0.5 |
| 2 | The Morphology of Brain Neurons: The Box-Counting Method in ... - Springer | https://link.springer.com/chapter/10.1007/978-3-031-47606-8_8 | 0.1628 | weak backing, clef weight < 0.5 |
| 3 | Box / Login | https://account.box.com/login | 0.0347 | weak backing, clef weight < 0.5 |
| 4 | MCAQ-YOLO: Morphological Complexity-Aware Quantization for... | https://arxiv.org/html/2511.12976 | 0.1900 | weak backing, clef weight < 0.5 |
| 5 | Microsoft Word - Paszto | http://gisak.vsb.cz/GIS_Ostrava/GIS_Ova_2011/sbornik/papers/Paszto.pdf | 0.1791 | weak backing, clef weight < 0.5 |
| 6 | ADR 0030: Use an action-bound, fail-closed approval protocol | https://microsoft.github.io/agent-governance-toolkit/adr/0030-action-bound-approval-protocol/ | 0.3348 | weak backing, clef weight < 0.5 |
| 7 | agent-governance-toolkit/docs/adr/0030-action-bound-approval ... | https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/adr/0030-action-bound-approval-protocol.md | 0.2791 | weak backing, clef weight < 0.5 |
| 8 | Policy-Bound Execution: Definition (AI Agents) | https://kla.digital/glossary/policy-bound-execution | 0.1487 | weak backing, clef weight < 0.5 |
| 9 | FAIL Definition & Meaning - Merriam-Webster | https://www.merriam-webster.com/dictionary/fail | 0.0334 | weak backing, clef weight < 0.5 |
| 10 | Authorization-Execution Gap for Enterprise AI Agents / AI Syndicate | https://aisyndicate.io/ | 0.2316 | weak backing, clef weight < 0.5 |
