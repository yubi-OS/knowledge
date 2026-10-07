# 03. Layer Decomposition: Mechanism, Trigger, Policy

**Scope.** The source doc's Step 2: splitting an idea into mechanism, trigger, and policy layers, why the combination is what patent law treats as the invention, and how engineering novelty often lives in exactly one layer.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc). The layer split itself is the source doc's contribution; the external grounding here is the much older mechanism versus policy separation literature.

## The three layers

The source doc's table defines the split as three questions:

| Layer | Question | Example (source doc) |
|---|---|---|
| Mechanism | What does the system DO? | bootc VM with vfio-user-pci device model plus IOMMU gate |
| Trigger | What causes the system to act? | anomaly score from model output crosses a threshold |
| Policy | What does it do in response? | revoke device access, snapshot VM, alert operator |

The point of the split is attribution. Patent law treats the combination as the invention (source doc, Step 2), so an assessment that says "this is covered" without saying which layer is covered is not useful. Most ideas in a mature codebase have a generic mechanism and the actual novelty in the trigger or the policy. The source doc's anti-pattern list names exactly this failure: treating mechanism novelty as application novelty, and skipping the trigger/policy decomposition.

## The older literature this borrows from

The mechanism versus policy distinction is a classic systems-design principle. The reference summary is "Separation of mechanism and policy" on Wikipedia (https://en.wikipedia.org/wiki/Separation_of_mechanism_and_policy, jev weight 0.41, weak backing: the principle is real and standard, but this URL is a tertiary source). The classic lineage goes back to the design of time-sharing systems, where the lesson was to provide mechanisms that support many policies rather than hard-coding one. A course-note treatment of the same distinction in the Hydra operating system is available from UW Madison CS 736 (https://pages.cs.wisc.edu/~swift/classes/cs736-sp15/blog/2015/01/policymechanism_separation_in.html, jev weight 0.39, weak). Dictionary-level definitions of the words are high-weight but generic: Merriam-Webster's "mechanism" entry (https://www.merriam-webster.com/dictionary/mechanism, jev weight 0.88) and Cambridge's "separating" entry (https://dictionary.cambridge.org/dictionary/english/separating, jev weight 0.84) anchor terminology only, not claims.

A worked example of separating the two in a real system is the Tor Browser design document (https://2019.www.torproject.org/projects/torbrowser/design/, jev weight 0.54), which separates what the browser does from what its policies decide. That is the same shape as the source doc's split: mechanism (isolation and update machinery) versus policy (which sites get which permissions).

## The engineering version

The source doc extends the classic two-part mechanism/policy split with a third layer, the trigger. The trigger is what causes the system to act, which in the classic literature is usually lumped into either the mechanism (sensing) or the policy (when to act). Keeping it separate matters for novelty assessment because the trigger is where many "novel" ideas actually live: the mechanism is a known watcher, the policy is a known response, and the new contribution is the condition that connects them.

The source doc's Step 3 decision rule uses the layers directly: if internal prior art covers the mechanism layer, the new contribution must be in the trigger or policy layer to be worth pursuing.

## How to run the split in practice

Decompose by the source doc's three questions, not by the user's wording. The source doc's red flags list includes "treating the user's framing as the layer decomposition". A proposal phrased as one feature usually contains all three layers unstated:

1. Write the one-sentence problem statement first (Step 1 of the framework; if you cannot, the idea is underspecified and `interview-me` comes first).
2. Name the mechanism: the moving parts.
3. Name the trigger: the condition and its source.
4. Name the policy: the response, and who or what owns it.
5. Then check each layer against prior art, internal first.

A claim about novelty made against the un-split idea is unfalsifiable. After the split, each layer either has covering prior art (cited) or is the new contribution.

## What this doc does not claim

The mechanism/policy literature does not say the three-layer split is a legal test. It is an analysis tool. The Graham framework (doc 01) supplies the verdict logic; the layer split supplies the unit of analysis the verdict logic runs on.
