# 05 - Rationalizations, Red Flags, and the Verification Checklist

Scope: the source doc's rationalization table, the red flag list (including the checkable doubt-theater signal), and the post-application verification checklist. Internal-record subtopic, no dig. Grounding spine: `yubi-OS/yubiOS skills/doubt-driven-development/SKILL.md` (source doc).

## The rationalization table

The source doc pairs each rationalization with its reality:

| Rationalization | Reality |
|---|---|
| "I'm confident, skip the doubt step" | Confidence correlates poorly with correctness on novel problems. Moments of certainty are exactly when blind spots hide. |
| "Spawning a reviewer is expensive" | Debugging a wrong commit in production is more expensive. The check is bounded; the bug isn't. |
| "The reviewer will just nitpick" | Only if unscoped. Constrain the prompt to "issues that would make this fail under the contract." |
| "I'll do doubt at the end with /review" | /review is a final gate. Doubt-driven catches wrong directions early when course-correction is cheap. By PR time it's too late. |
| "If I doubt every step I'll never ship" | The skill applies to non-trivial decisions, not every keystroke. Re-read When NOT to Use. |
| "Two opinions are always better than one" | Not when the second has less context and produces noise. Reconcile, don't defer. |
| "The reviewer disagreed so I was wrong" | The reviewer lacks your context. Disagreement is information, not verdict. Re-read the artifact, classify, then decide. |
| "Cross-model is always better" | Cross-model catches blind spots a single model shares with itself, but adds cost and tool fragility. Offer it every interactive doubt cycle; the user decides. |
| "User said yes once, so I can keep invoking the CLI" | Each invocation is its own authorization. Re-confirm the exact command before every run. |

(source doc, Common Rationalizations)

## The red flag list

The source doc's red flags, grouped:

**Scoping failures:** spawning a fresh-context reviewer for a one-line rename or formatting change; prompting "is this good?" instead of "find issues"; doubting only after committing (that's /review, not doubt-driven development); skipping doubt under time pressure on a high-stakes decision.

**Process failures:** treating reviewer output as authoritative without re-reading the artifact text; looping more than 3 cycles without escalating; re-spawning fresh-context on an unchanged artifact (you get the same findings; you are stalling); stripping the contract from the reviewer's input; passing the CLAIM to the reviewer.

**Cross-model failures:** silently skipping cross-model in an interactive doubt cycle (skipping is fine; silent skipping is not); falling back silently when an external CLI errors or is missing; hardcoding an external CLI invocation without confirming the tool exists, is configured, and accepts that exact syntax.

**The checkable signal:** doubt theater is defined as checkable: across 2 or more cycles where the reviewer surfaced substantive findings, zero findings were classified as actionable. You are validating, not doubting. Stop and escalate.

## The verification checklist

After applying the skill, the source doc requires:

- Every non-trivial decision was named explicitly as a CLAIM before standing.
- At least one fresh-context review per non-trivial artifact (a failing test produced by TDD's RED step satisfies this for behavioral claims).
- The reviewer received ARTIFACT + CONTRACT, not the CLAIM, not the author's reasoning.
- The reviewer's prompt was adversarial ("find issues"), not validating ("is it good").
- Findings were classified against the artifact text using the precedence: contract misread / actionable / trade-off / noise.
- A stop condition was met (trivial findings, 3 cycles, or user override).
- In interactive mode, cross-model was explicitly offered regardless of artifact stakes, and the response was acknowledged in the output.
- In non-interactive mode, cross-model was skipped and the skip was announced.
- Any external CLI invocation was preceded by a PATH check, a working-binary test, syntax confirmation with the user, and explicit authorization to run.

(source doc, Verification)

## Why a checkable anti-pattern matters

Most red flags are judgment calls; doubt theater is designed to be auditable from the session log: count cycles, count substantive findings, count actionable classifications. Zero actionable out of 2 or more substantive-finding cycles is the signature of a review that exists to confirm rather than to test. This pairs with the TDD analogy from the source doc's Interaction section: a failing test is a disproof attempt, and a doubt cycle with no actionable finding is the review-shaped equivalent of a test suite with no failing case ever run.

## Primitive-coverage bookkeeping (brief)

The source doc carries several curve-guided-rsi cycle bookkeeping sections (cycle 4 cryptographic identity coverage, cycle 5 audit/evidence coverage with fit coordinate (u=0.534, v=0.236), cycle 5 segmentation keyword closure moving the corpus-wide count from 22 to 23 of 70, cycle 6 trust chain, cycle 7 immutability). These are corpus-audit records, not operating instructions: they declare the skill's position in the yubiOS 10-primitive coverage map so downstream audits (curve-guided-rsi's sparse-cell detector, security-and-hardening review, audit-evidence rollup) can credit it. Two 2026-09-17 coverage notes were removed as unsupported, which the changelog records (source doc). This doc records their existence and status only; the audit semantics live in the referenced skills.
