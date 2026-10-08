# 05 - README Audit: The 4 First-Reader Questions

**Scope:** The README audit the pr-launch skill requires in Phase 0: the 4 questions every first-time reader has, how the audit runs, and what external guidance says about README quality and trust signals.

Ground spine: the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md, section "Launch Phases, Phase 0, item 1" and the "Verification Checklist". Claims from digs carry their URL and jev noul weight.

## The 4 questions

The source doc requires the README to answer 4 questions before launch day (source doc):

1. **What does this do?** A capability statement a stranger can parse without context.
2. **Why does this exist (and why not TPM)?** The motivation plus the named rejection of the default. For the yubios project this is the TPM question: OEM-controlled, opaque, often absent on ARM (source doc, Message Frameworks).
3. **How do I try it in 5 minutes?** A quickstart with a real time bound. The general-audience message framework reinforces this with "Step-by-step onboarding - you don't need to know what FIDO2 is to start" (source doc).
4. **How do I trust this?** The provenance answer: "Every decision has a source citation or ADR - no hand-waving" (source doc). For a security product this question is the load-bearing one, because the reader is being asked to hand a hardware token the root-of-trust role.

The audit is a Phase 0 gate: it runs 2-3 days before launch, not during launch week (source doc). The verification checklist extends it into mechanical checks: the GitHub repo is public, the README renders cleanly, and there are no broken links in the README or onboarding doc (source doc).

## Why the README is the launch surface

The dug corpus supports the premise that the README is the first reader contact. The pushpen guide calls the README "the single most important file in your repository" and "the first thing a potential user, contributor, or..." maintainer sees, and notes most teams treat it as an afterthought (https://pushpen.dev/blog/how-to-write-a-good-github-readme, weight 0.18, weak backing). The kunalganglani guide calls it "the front door to your project" (https://www.kunalganglani.com/blog/write-good-readme-guide, weight 0.23, weak backing). ReadmeBot's documentation guide widens the surface: a project needs README, CONTRIBUTING.md, code comments, API docs, and community guidelines, and "good documentation is the difference between an..." adopted project and an abandoned one (https://readmebot.dev/blog/open-source-documentation-guide, weight 0.21, weak backing). The dev.to collection of README examples is a pattern library for the same job (https://dev.to/documatic/awesome-readme-examples-for-writing-better-readmes-3eh3, weight 0.12, weak backing).

The 4-question structure maps onto this guidance but is stricter than it: generic README advice covers what and how-to-try; the why-not-the-default and how-do-I-trust-this questions are security-project-specific additions that the source doc makes first-class.

## Trust signals

The 4th question is the audit's distinctive requirement, and the trust-signal literature describes what readers actually look for. HackerNoon distinguishes direct trust signals (highly visual cues built into an interface, quick to consume) from indirect ones (https://hackernoon.com/the-signs-of-a-great-open-source-project, weight 0.17, weak backing). The flicstar essay generalizes: open source projects expose "visible cues (or signals) that let people make rich inferences about the health of the project and the tone of its community" (https://flicstar.com/trust-signals, weight 0.12, weak backing). For yubios the ADR-per-decision practice named in the source doc is exactly such a signal: a reader can check that each non-obvious security choice has a written decision record, which is verifiable in a way that marketing claims are not.

Trust-signal tooling exists in the wild but is niche: a small CLI that scans landing pages and READMEs for buyer trust signals (https://github.com/bricktheceo/trust-signal-scanner, weight 0.13, weak backing). Not load-bearing for this corpus.

## The audit as an asset test

The audit doubles as a consistency check against the launch assets: every claim the Show HN post or press pitch makes must already be true on the README, because the first wave of visitors lands there from those posts (source doc sequencing, doc 03). A README that answers the 4 questions but contradicts the assets fails the launch, and a README that passes the 4 questions but renders with broken links fails the mechanical checklist. Both failure modes are covered by the source doc's checklist items (source doc).

## What the audit does not require

The source doc does not require badges, screenshots, a CONTRIBUTING file, or a governance statement in the README itself; those belong to the broader documentation surface (ReadmeBot guidance above). The audit's bar is the 4 questions plus the 3 mechanical checks. Anything beyond that is optional and should not delay the launch window, because the phase clock is 2-3 days (source doc).
