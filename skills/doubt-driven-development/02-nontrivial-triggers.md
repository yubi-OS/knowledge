# 02 - Non-Trivial Triggers and Exclusions

Scope: the source doc's definition of a non-trivial decision, the apply-when list, the when-NOT-to-use list, and the failure evidence that justifies the trigger threshold. Grounding spine: `yubi-OS/yubiOS skills/doubt-driven-development/SKILL.md` (source doc).

## The five non-triviality criteria

The source doc defines a decision as non-trivial when at least one of these is true:

1. It introduces or modifies branching logic.
2. It crosses a module or service boundary.
3. It asserts a property the type system or compiler cannot verify (thread safety, idempotence, ordering, invariants).
4. Its correctness depends on context the future reader cannot see.
5. Its blast radius is irreversible (production deploy, data migration, public API change).

(source doc, When to Use)

## When to apply

The source doc lists four apply-when situations: about to make an architectural decision under uncertainty; about to commit non-trivial code; about to claim a non-obvious fact ("this is safe", "this scales", "this matches the spec"); working in code you do not fully understand (source doc).

## When NOT to use

The source doc excludes: mechanical operations (renaming, formatting, file moves); following a clear, unambiguous user instruction; reading or summarizing existing code; one-line changes with obvious correctness; pure tooling operations; and cases where the user explicitly asked for speed over verification. Its closing rule: "If you doubt every keystroke, you ship nothing" (source doc).

## Why the trigger list exists: self-assessment fails exactly here

The dig evidence converges on the claim that confident self-review without fresh context is unreliable, which is what the criteria guard against:

- The TACL survey of LLM self-correction finds that self-correction without external feedback barely improves reasoning performance, and can degrade it (weight 0.68, https://aclanthology.org/2024.tacl-1.78/).
- DeepMind's earlier position paper reaches the same verdict: large language models cannot self-correct reasoning yet (weight 0.47, weak backing, https://deepmind.google/research/publications/48252/).
- In adversarial settings the overconfidence is structural: when two LLMs debate, both expect to win (weight 0.52, https://arxiv.org/pdf/2505.19184). This is why criterion 4 ("context the future reader cannot see") and criterion 3 (unverifiable properties) are the highest-risk triggers: they are precisely the cases where the author's confidence carries no evidentiary weight.

Human code-review research supports the boundary-crossing triggers. A 2024 study of modern code review effectiveness maps review value to human error taxonomies, showing review catches what authors systematically miss (weight 0.53, https://www.sciencedirect.com/science/article/pii/S0164121224001055). An empirical study of code review effectiveness found reviewer factors dominate defect-detection outcomes (weight 0.39, weak backing, https://www.researchgate.net/publication/349459553_Code_review_effectiveness_an_empirical_study_on_selected_factors), and a survey of code-review effectiveness studies reports quality gains concentrated in findings the author could not see (weight 0.33, weak backing, https://www.ijrte.org/wp-content/uploads/papers/v12i2/B76660712223.pdf).

The general background: a large language model is a next-token predictor whose outputs are not self-verifying (weight 0.65, https://hai.stanford.edu/ai-definitions/what-is-a-llm), so an unverified confident claim is a hypothesis, not a fact.

## Reading the two lists together

The exclusions are not an escape hatch from the criteria; they define the complement. If a change fails all 5 non-triviality criteria, it falls in the when-NOT-to-use zone and doubt overhead is waste. If it satisfies even one criterion, the skill applies regardless of how small the diff looks, because the criteria describe blast radius and verifiability, not line count.

## The trigger the source doc adds on top

One apply-when case deserves emphasis because it is the most agent-specific: "about to claim a non-obvious fact." The examples the source doc gives are exactly the claims a coding agent emits casually mid-session: "this is safe", "this scales", "this matches the spec". Criterion 3 makes the link explicit: these are properties the type system or compiler cannot verify, so nothing in the normal toolchain will falsify them if they are wrong. The trigger list therefore converts such claims into CLAIM blocks (doc 03, Step 1) before they stand, rather than letting them pass as prose.

## The speed override

The last exclusion is procedural, not technical: "the user has explicitly asked for speed over verification" (source doc). The user, not the agent, owns this tradeoff. The rationalization table pairs with it: "If I doubt every step I'll never ship" is answered by re-reading When NOT to Use, not by skipping silently on high-stakes work, which is itself a red flag ("Skipping doubt under time pressure on a high-stakes decision", source doc, Red Flags).
