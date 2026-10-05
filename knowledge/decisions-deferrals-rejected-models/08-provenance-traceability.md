# Decision provenance: linking every decision to its authoritative source

Scope: how to give each decision row a provenance pointer (issue, pull request, document section) that makes it independently checkable, and what the research and platform guidance say about traceability chains.

## Why the Source column is the load-bearing field

A decision row is only as good as its provenance. The row pattern Decision | Source exists so that a skeptical reader can verify the decision against the document that made it, rather than trusting the register’s compiler. Research on decision provenance defines the concept precisely: the preserved record of the decision context, human judgement and decision outcome associated with a specific decision, captured at the point in time the decision occurs, recording what information was available, what constraints applied and how discretion was exercised (https://decisionprovenance.org/, jev weight 0.44, weak backing). The definition’s key clause is captured at the point in time: provenance reconstructed after the fact is testimony, not evidence.

## Platform-level traceability: the PR as the audit anchor

The strongest platform guidance treats the pull request as the natural center of the traceability chain: committed code is discussed, reviewed, tested, analyzed for security issues, approved, and deployed within the context of a pull request, making them the logical place to center audit and traceability efforts (https://github.blog/enterprise-software/governance-and-compliance/demonstrating-end-to-end-traceability-with-pull-requests/, jev weight 0.89). For decision registers, the consequence is that a decision’s Source column should, where possible, point at the PR or issue where the decision was actually made and contested, not at a later summary.

Azure DevOps documents the same principle across the full object graph: end-to-end traceability by linking work items, branches, commits, pull requests, builds, and releases, with built-in reports to monitor traceability (https://learn.microsoft.com/en-us/azure/devops/cross-service/end-to-end-traceability?view=azure-devops, jev weight 0.91). The generalizable pattern is a linked object chain rather than a single pointer: decision, its deciding artifact, the implementation artifacts it produced.

## Linking mechanics

At the mechanical level, platforms support the links natively: GitHub links pull requests to issues using closing keywords like Closes and Fixes, cross-repo references, and manual development links (https://learn.programmingline.com/learn/git/github-linking-issues-prs, jev weight 0.12, weak backing). Cross-linking issues to commits and pull requests provides verification evidence for traceability, and protected branches with required reviews enforce controlled approvals before integration (https://wifitalents.com/best/issue-tracking-system-software/, jev weight 0.14, weak backing). These are weak-weight practitioner sources but they describe stable, verifiable platform behavior.

A practical guide for linking technical decisions to pull requests frames the problem as ensuring decisions are properly documented and traceable to their implementation (https://www.techedubyte.com/linking-technical-decisions-github-pull-requests-guide/, jev weight 0.27, weak backing).

## High-stakes provenance: the AI decision case

The most demanding provenance requirements come from regulated AI decision-making. A workflow for full traceability of AI decisions argues that traceability is a prerequisite to any attempt of reconstructing a responsibility chain, and links it to documentation that will stand up in court when determining the cause of some AI-based decision (https://arxiv.org/html/2511.11275v1, jev weight 0.74). A traceability framework for high-risk AI centers on an immutable log capturing every step in the AI decision lifecycle, including input data provenance (the exact data point, its source, and any transformations applied) and model version and configuration (https://inferensys.com/guides/explainability-and-traceability-for-high-risk-ai/setting-up-a-traceability-framework-for-ai-decision-making, jev weight 0.38, weak backing).

The engineering-decision takeaway from the AI case is the immutability and completeness standard: provenance worth having is append-only and covers the inputs to the decision, not just the verdict. A decision register’s Source column is a lightweight version of the same discipline.

## What checkability buys

The point of the Source column is that the register becomes self-auditing. A contradiction check (covered elsewhere in this corpus) can mechanically re-verify each row’s rejection reason against the governing document it cites. A lifecycle transition can verify that the superseding record exists. A compiler of the register can be proven faithful by sampling rows against sources. None of this is possible when rows cite nothing.

## Source quality note

Strong anchors: the GitHub blog traceability guidance and Azure DevOps end-to-end traceability documentation, plus the arXiv AI-traceability paper. Practitioner and SEO-sourced pages are weak and used only for mechanical linking details.
