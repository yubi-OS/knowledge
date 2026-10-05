# 07: Authoring Cited Updates with Weight-Gated Claims

Scope: how the sweep turns weighted search results into doc updates where every factual claim carries its source URL and the decision model's weight, and where unverifiable claims are deleted rather than softened.

## The three rules of authoring

The authoring stage is where the sweep's discipline becomes visible prose. The spec states it as three rules:

1. **Every factual claim carries its source URL and the jev weight that backed it.** Not per-doc sourcing, per-claim sourcing. A reader can check any sentence against the exact result that supports it.
2. **A claim with no source is deleted, not softened.** "Probably" and "generally" are not downgrades of an unverifiable claim; they are padding. If the dig did not surface evidence, the sentence does not exist.
3. **The weight is shown, and the 0.5 line is drawn in text.** Weight 0.5 or higher is authoritative backing. Below 0.5 is weak backing, and the doc says so inline instead of hiding behind a bare URL.

## Why claim-level grounding

The pattern has a research-tool lineage. Hermes' grounded-citations skill spec requires every claim taken from an outside source to carry an inline numbered citation plus a Sources list, with a ledger script owning the URL list (https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/research/research-grounded-citations, weight 0.6371). The citation-grounded-LLM concept is defined the same way: "an AI system where every factual claim in an output is tied to a verifiable source" (https://edtek.ai/kb/citation-grounded-llm/, weight 0.256, weak backing). Verification tooling goes further and checks claim-by-claim: Grounded Claims "breaks a document into individual claims and checks each one against the source passage it cites," separating supported from overstated statements (https://groundedclaims.com/, weight 0.2676, weak backing); a grounding-and-verification service design splits generation (candidate claims with source annotations) from independent verification (https://veriprajna.com/services/grounding-citation-verification, weight 0.4521, weak backing).

What the sweep adds to this lineage is the weight on every citation. A bare URL still forces the reader to guess how much the source can be trusted; a URL plus a calibrated weight (0.9601 versus 0.256) makes the trust judgment part of the prose. Longstanding digital-preservation work identified the same need decades ago: identification and verification of digital resources is a requirements-level problem in the research process, not a style problem (https://www.dlib.org/dlib/june98/06bearman.html, weight 0.7833).

## The weight gates in practice

Two gates make the rule operational:

1. **The 0.5 gate.** Authoritative backing requires weight 0.5 or higher. A claim whose only backing is a 0.3 result must be labeled as weakly backed in the text, which usually means the claim is either cut or reframed as an open question. In practice this kills most aggregator-derived sentences, which is the intended effect.
2. **The no-source gate.** A claim the dig never surfaced is deleted. The sweep never fetches primary sources directly to fill a thin dig (the redo rule in doc 04), so there is no rescue path: if the weighted collection did not produce it, it does not go in.

These gates do not make docs thinner in practice; they make them sharper. In the reference run, the strongest docs came from the digs with the most primary-quality results (osbuild: average 0.70 with 7 of 12 results at 0.8-plus; post-quantum TLS: average 0.55 with 6 of 12), and the weak digs (endlessh: average 0.23 with 0 of 12 primary; Panfrost: average 0.45 with 0 of 12) produced skips or heavily caveated updates rather than confident prose.

## How style rules serve the audit

The writing rules are not aesthetic preferences; they are audit affordances. No em dashes, numbers as digits, and headings for wayfinding keep the diff small and the claims greppable. "Numbers as digits" means a reviewer can find every quantitative claim by searching for a digit followed by a weight parenthesis. The claim-plus-weight pattern `(https://..., weight 0.9331)` is deliberately uniform so a checker script can extract every citation and verify it against the research DB's archive entries.

## What the citation standards say about AI-generated content

Formal citation guidance is catching up to machine-authored text: APA Style maintains explicit guidance on citing generative AI references (https://apastyle.apa.org/blog/cite-generative-ai-references, weight 0.9601), university guides extend it for AI-generated content specifically (https://columbiacollege-ca.libguides.com/apa/aigeneratedcontent, weight 0.7987; https://guides.lib.purdue.edu/c.php?g=1371380&p=10135074, weight 0.9178). The sweep's per-claim URL-plus-weight pattern is a stricter variant of the same principle: if a machine wrote the sentence, the machine's evidence for it is attached.

## Skip over pad

The stage's terminal state, when evidence is thin after redos, is a skip with a recorded gap in the README: which subtopic was skipped, why, and with what dig stats. That record matters more than the doc that was not written, because it tells the next sweep exactly where the evidence collection failed (bad queries, exhausted topic, or an upstream that simply has not moved).
