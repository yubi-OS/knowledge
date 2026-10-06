# 01 - Stop the Line Rule

Scope: the STOP / PRESERVE / DIAGNOSE / FIX / GUARD / RESUME discipline the debugging-and-error-recovery skill prescribes when anything unexpected happens, and why errors compound when you push past a broken state.

## The rule itself

The source doc (yubi-OS/yubiOS skills/debugging-and-error-recovery/SKILL.md) defines a 6-step reaction to any unexpected event:

1. STOP adding features or making changes
2. PRESERVE evidence (error output, logs, repro steps)
3. DIAGNOSE using the triage checklist
4. FIX the root cause
5. GUARD against recurrence
6. RESUME only after verification passes

The skill is explicit that you must not push past a failing test or broken build to work on the next feature, because errors compound: a bug in Step 3 that goes unfixed makes Steps 4 to 6 wrong (source doc). The order is the point. PRESERVE comes before DIAGNOSE because evidence degrades once you start changing things, and RESUME comes last because resumption is gated on verified recovery, not on the fix compiling.

## Why the line metaphor fits

The rule mirrors the andon system from Toyota production, where any worker can stop the line when a defect appears. The Lean Enterprise Institute describes andon as a visual management tool that signals a problem and prompts response (https://www.lean.org/lexicon-terms/andon/, weak backing, w 0.45). Toyota's own production-system guide describes andon as the mechanism that lets the line stop to prevent a defect from moving downstream (https://mag.toyota.co.uk/andon-toyota-production-system/, weak backing, w 0.32). The analogy transfers because both systems trade a short-term throughput hit for defect containment: stopping now is cheaper than letting the defect multiply downstream.

That containment economics argument has a research-shaped counterpart. Work revisiting cost-to-fix curves describes the widely held "delayed issue effect": the longer an issue lingers in the system, the more effort it takes to resolve (https://www.researchgate.net/figure/Historical-cost-to-fix-curve-Adapted-from-Boehm-1981-p-40_fig11_308264787, w 0.52). The framing of that literature traces back to Boehm's Software Engineering Economics, published by Prentice-Hall in 1981 (https://archive.org/details/softwareengineer0000boeh, w 0.53). Note the same research line is careful that the effect is a belief used to justify investment decisions, not a universal constant, so treat "errors compound" as a strong prior, not a measured law.

## What the rule forbids

The source doc's rationalizations table lists the pushes that violate the rule: "I know what the bug is, I'll just fix it" (skip reproduction), "The failing test is probably wrong" (skip verification of that assumption), "It works on my machine" (skip environment comparison), "I'll fix it in the next commit" (defer the fix), "This is a flaky test, ignore it" (ignore the signal). Each is a variant of the same move: resuming before verification passes.

## When the rule applies

Per the source doc's When to Use section, the trigger set is: tests fail after a code change, the build breaks, runtime behavior does not match expectations, a bug report arrives, an error appears in logs or console, or something worked before and stopped working. The rule is event-triggered, not severity-triggered: any unexpected event stops the line, even one that looks minor.
