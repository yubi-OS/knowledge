# 06 - Contributor provenance: DCO vs CLA and AI-assisted commits

Scope: contributor provenance policy for an LGPL project, the DCO versus CLA choice, and conventions for attributing AI-assisted commits.

## DCO and CLA: what each one does

The foundational distinction comes from an Open Source Initiative-adjacent explainer: both a CLA and a DCO show that a contributor is allowed to make a contribution and that the project has the right to distribute it; the difference is mechanism (source: https://opensource.com/article/18/3/cla-vs-dco-whats-difference, weight 0.77). FINOS's open-source-readiness body of knowledge explains both instruments and their practical implications for organizations consuming and contributing to open source (source: https://osr.finos.org/docs/bok/artifacts/clas-and-dcos, weight 0.83).

CERN's OSPO documentation is the most operationally specific strong source: it covers implementing a DCO or CLA for an organization's projects and distinguishes that from being asked to sign one as a contributor (source: https://ospo.docs.cern.ch/recommendations/CLAs-and-DCOs/, weight 0.80). A weakly backed comparison guide captures the mechanical difference as contributors experience it: some projects rely on the license alone, some ask for a one-line sign-off in each commit (a DCO), and some for a signed agreement (a CLA) (source: https://openresource.dev/guide/licensing/cla-vs-dco/, weight 0.48, weak backing).

The yubiOS register's framing maps directly onto these sources: a DCO is the common low-friction choice for a project accepting outside contributions, a CLA is heavier and usually only needed if the project wants to relicense later or accept corporate contributions under specific terms. The dig supports that framing as the standard industry understanding, and the decision itself remains flagged for the project owner.

Weakly backed governance-tooling context: foundation-stewarded projects with enterprise contributors justify heavier CLA tooling (source: https://tenthirtyam.org/dispatches/2026/04/08/dco-vs-cla-managing-contribution-agreements-in-open-source/, weight 0.25, weak backing), and a plain-language startup-oriented comparison exists (source: https://powerpatent.com/blog/contributor-license-agreements-cla-vs-dco-pick-one, weight 0.26, weak backing).

## Attributing AI-assisted commits

The yubiOS convention, documented in its bcvk-virtualization skill, is an `Assisted-by: Sauna (claude-sonnet-4-6)` trailer with no `Signed-off-by` on AI-generated commits until a human reviews and adds one. The dig found community discussion of exactly this shape, all weakly backed:

1. A research note on commit attribution wording recommends dropping Co-authored-by for AI, using Assisted-by with tool and model for open source, escalating to Generated-by when the AI wrote substantial chunks, and keeping a human Signed-off-by where the project uses the DCO (source: https://heios.github.io/research/2026-07-08/ai-commit-attribution/, weight 0.29, weak backing). This matches the yubiOS convention almost element for element, including the human sign-off gate.
2. A provenance-practice essay defines the goal as being able to answer three questions about any line: what produced it, who accepted it, and what evidence exists for both (source: https://infragap.com/code-provenance/, weight 0.29, weak backing).
3. An industry-statistics-backed article argues commit-level identity and provenance controls are the deciding factor in software supply chain security as AI-assisted code share grows, citing industry reports of 41 percent AI-generated or AI-assisted code and 82 percent weekly developer AI tool usage (source: https://nhimg.org/articles/code-provenance-is-the-missing-control-for-ai-generated-commits/, weight 0.22, weak backing).
4. Tooling and write-up ecosystems exist around the problem: a GitHub topic aggregating AI code attribution tools (source: https://github.com/topics/code-attribution, weight 0.28, weak backing) and a practitioner write-up connecting provenance back to the AI session, prompt, model, and development context (source: https://dev.to/serhii_troian_getorigin/ai-code-provenance-how-to-track-ai-generated-code-in-git-5d6b, weight 0.23, weak backing).

## Gap and next step, flagged not resolved

The register's gap stands: the Assisted-by and no-auto-Signed-off-by convention is real and working but not written down as a project-wide CONTRIBUTING.md or PROVENANCE.md, and there is no visible DCO or CLA requirement in the repo. The recommended next step from the register, formalize the convention into a short CONTRIBUTING.md and decide DCO versus CLA versus neither before the first external PR from outside the current contributor set, is consistent with the strong sources on DCO implementation practice (CERN, weight 0.80) and stays a flagged decision.

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://osr.finos.org/docs/bok/artifacts/clas-and-dcos | 0.83 | FINOS body of knowledge (primary) |
| https://ospo.docs.cern.ch/recommendations/CLAs-and-DCOs/ | 0.80 | CERN OSPO implementation guidance (primary) |
| https://opensource.com/article/18/3/cla-vs-dco-whats-difference | 0.77 | DCO vs CLA explainer |
| https://openresource.dev/guide/licensing/cla-vs-dco/ | 0.48 | Weak: contributor-facing comparison |
| https://heios.github.io/research/2026-07-08/ai-commit-attribution/ | 0.29 | Weak: Assisted-by vs Signed-off-by wording |
| https://infragap.com/code-provenance/ | 0.29 | Weak: provenance definition |
| https://github.com/topics/code-attribution | 0.28 | Weak: tooling ecosystem |
| https://powerpatent.com/blog/contributor-license-agreements-cla-vs-dco-pick-one | 0.26 | Weak: comparison |
| https://tenthirtyam.org/dispatches/2026/04/08/dco-vs-cla-managing-contribution-agreements-in-open-source/ | 0.25 | Weak: governance tooling |
| https://dev.to/serhii_troian_getorigin/ai-code-provenance-how-to-track-ai-generated-code-in-git-5d6b | 0.23 | Weak: provenance tracking |
| https://nhimg.org/articles/code-provenance-is-the-missing-control-for-ai-generated-commits/ | 0.22 | Weak: industry statistics |
| https://openai.com/ | 0.40 | Discarded: off-topic |
