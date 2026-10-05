# 08 - Recording and enforcing conflict resolutions: ADRs, blockers, and audit trails

Scope: how conflict resolutions get recorded and enforced: ADRs with rationale, blocker logs, transparent decision records, and audit trails contributors can check.

## Why recording is the enforcement mechanism

A conflict process is only as real as its record. The ADR canon supplies the format: an ADR "captures an important architectural decision... along with its context and consequences," which is precisely what a conflict resolution needs, since a conflict is a decision whose context includes a covenant clause (weight 0.21, weak backing: https://github.com/architecture-decision-record/architecture-decision-record). AWS's best-practices guide, drawing on experience with hundreds of ADRs, treats the record as the durable artifact that outlives the people who made the decision (weight 0.21, weak backing: https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/). The ADR hub explicitly brands the practice "open and transparent decision history," making transparency the point rather than a byproduct (weight 0.38, weak backing: https://adr.github.io/).

## Making the record enforceable

Two mechanisms turn records into enforcement. First, meta-ADRs: a governed-ADR repository pattern shows the process itself adopted via ADR-0000, with authors, decision owner, reviewers, and approvals named in a structured file (weight 0.38, weak backing: https://github.com/ivanstambuk/adr-governance). Second, automated gates: the same ecosystem's ADR Guard fails a pull request when watched code paths change without a covering decision record, and a tooling page catalogs generators and sync tools that keep the log current (weight 0.37, weak backing: https://adr.github.io/adr-tooling/). Dedicated platforms extend this to collaborative capture: Decision Records describes itself as "a collaborative platform for documenting technical decisions with their context, rationale" on the ADR format (unweighted entry, see archive: https://github.com/DecisionRecordsORG/DecisionRecords).

## Enterprise practice as precedent

An enterprise-focused guide on ADRs for transparent tech choices connects the record to governance: structure, review process, and lifecycle management are what make ADRs an accountability instrument rather than documentation (weight 0.19, weak backing: https://www.go-togaf.com/architecture-decision-records-best-practices-transparent-tech-choices/). An architecture-governance guide situates decision records inside a wider system of principles and review processes (weight 0.12, weak backing: https://architectdecisionhub.com/architecture-governance/).

## The blocker-log pattern

For conflicts that block specific work in flight, the working pattern is a blocker log: a file contributors already read at session start, where a confirmed conflict is logged like any other blocker, with the covenant clause cited and the resolution appended when reached. This composes with ADR treatment: transient conflicts live in the blocker log, standing tensions become ADRs, and every resolution names its clause and rationale.

## What a recording clause should say

Synthesis for covenant authors: every confirmed conflict is (1) cited against a specific clause at filing time, (2) recorded in a place contributors already check, (3) resolved by ADR with rationale and sources recorded at decision time, and (4) for accepted exceptions, written as a narrow, documented exception with its own rationale rather than a silent precedent.
