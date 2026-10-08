# 07 Step 4: Cite Your Sources

Scope: the citation contract that makes every framework decision user-verifiable: full URLs, deep-link anchors, quoted passages, and honest UNVERIFIED flags.

## The contract

The ground skill's step 4 states the purpose: "Every framework-specific pattern gets a citation. The user must be able to verify every decision" (source doc: yubi-OS/yubiOS skills/source-driven-development/SKILL.md). Citations appear in 2 places (source doc):

- In code comments, next to the pattern they justify:

```typescript
// React 19 form handling with useActionState
// Source: https://react.dev/reference/react/useActionState#usage
const [state, formAction, isPending] = useActionState(submitOrder, initialState);
```

- In conversation, with a quoted passage when the decision is non-obvious:

```
I'm using useActionState instead of manual useState for the
form submission state. React 19 replaced the manual
isPending/setIsPending pattern with this hook.

Source: https://react.dev/blog/2024/12/05/react-19#actions
"useTransition now supports async functions [...] to handle
pending states automatically"
```

## Citation rules

The skill's 4 citation rules (source doc):

1. Full URLs, not shortened.
2. Prefer deep links with anchors where possible (for example /useActionState#usage over /useActionState), because "anchors survive doc restructuring better than top-level pages".
3. Quote the relevant passage when it supports a non-obvious decision.
4. Include browser or runtime support data when recommending platform features.

Rule 2 aligns with long-standing URL-permanence practice. The IETF Internet-Draft authoring guidance discusses "Anchor Permanence in WHATWG Living Standards" and asks authors to prefer "Permanent URLs - i.e., permalinks, Digital Object Identifiers (DOIs)" (https://authors.ietf.org/en/reference-style-guidance, jev weight 0.46, weak backing). Tooling built for docs sites makes the same argument: AnchorJS documentation warns that anchor links "could break when the content leaves that page" and recommends pointing anchors at permalinked URLs (https://www.bryanbraun.com/anchorjs/, jev weight 0.33, weak backing). The skill's rule is the code-review-facing version of the same principle: the citation should survive the next docs restructure.

Rule 3 has a writing-craft analog: the MIT Broad Institute communication lab describes the purpose of code comments as making the logic effectively readable for the next person who debugs or modifies it (https://mitcommlab.mit.edu/broad/commkit/coding-and-comment-style/, jev weight 0.52, primary backing). A quoted docs passage does that job for a decision whose "why" is not visible in the code.

## The UNVERIFIED flag

When no documentation exists for a pattern, the skill prescribes saying so explicitly (source doc):

```
UNVERIFIED: I could not find official documentation for this
pattern. This is based on training data and may be outdated.
Verify before using in production.
```

The rationale, stated in the skill itself: "Honesty about what you could not verify is more valuable than false confidence" (source doc). The flag converts a hidden assumption into a visible, greppable marker. Anything flagged can be searched across the codebase later and re-verified when the docs catch up.

## What citations are not

Citations are not decoration and not hedges. The skill's rationalization table rejects "I'll just mention it might be outdated" as a middle path: "A disclaimer doesn't help. Either verify and cite, or clearly flag it as unverified. Hedging is the worst option" (source doc). The 2 states a framework-specific pattern can be in are cited-verified and flagged-unverified; anything else is a failed citation.

A citation also must resolve to something the user can actually open. That is why the skill requires full URLs over shortened ones (source doc): a shortened link adds a redirect dependency between the user and the evidence, and a dead redirect silently downgrades a "verified" claim into an unverifiable one.
