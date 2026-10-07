# 04 - The assumption ledger and the gap-finding procedure

Scope: the operational model the source doc proposes, one ledger row per independently testable proposition, the 10-step gap-finding procedure, and the adjacent governance frames (assumption and RAID logs, ADRs, problem frames, ISO life-cycle documentation) that the ledger replaces or absorbs.

## The ledger schema

For each artifact the source doc constructs an assumption ledger with one row per independently testable proposition. The 13 columns: A-ID (stable identifier), Artifact (skill, file, function, API, guide, diagram, manifest, or procedure affected), Assumption (atomic statement of what must be true), Channel (one of the eight), Kind (precondition, postcondition, invariant, rely, guarantee, dependency, domain, toolchain), Scope (build, test, development, staging, production, platform, feature, or version range), Owner (party responsible for establishing or preserving it), Evidence (source, manifest, test, contract, monitoring data, ADR, or external specification), Verification method (static check, proof, test, install/build, inspection, runtime monitor, or human confirmation), Status (verified, unverified, inferred, contradicted, stale, or missing), Impact if false (failure mode, incorrect result, security exposure, inability to execute, misleading documentation), Stale indicator (time, version, OS release, kernel feature bit, rotation event, or expiry), and Required action (document, test, constrain, monitor, remove, or escalate) (source doc: yubi-OS/yubiOS skills/nss-assumption-set/SKILL.md).

Atomicity is the load-bearing rule: "Linux, Python 3.11, PostgreSQL, network access, and admin rights are required" is five assumptions, not one. Each gets its own row, its own evidence, its own stale indicator (source doc).

## The 10-step gap-finding procedure

The source doc's procedure, in order (source doc):

1. Define the artifact and claim: what does it promise, and for whom?
2. Extract explicit assumptions from contracts, comments, examples, manifests, environment files, deployment scripts, diagrams, ADRs, and requirements.
3. Infer hidden assumptions: undeclared inputs, tools, versions, permissions, services, timing, state, roles, and failure handling.
4. Atomicise to one row per proposition.
5. Classify by contract role: precondition, guarantee, invariant, rely, dependency, domain, toolchain.
6. Trace each proposition to the exact code, documentation section, manifest key, test, or operational step.
7. Validate: attempt installation, compilation, proof, execution, test, deployment, or independent inspection under the stated scope.
8. Find gaps by relation failure. Typical findings: missing assumption, missing evidence, wrong owner, scope mismatch, stale version, contradiction, unhandled failure mode, undocumented transitive dependency.
9. Prioritise by consequence and uncertainty. High-impact, low-evidence assumptions deserve immediate validation.
10. Re-run after change. Assumption sets are versioned knowledge, not permanent facts.

## Assumption and RAID logs

A conventional assumption log records an identifier, statement, owner, status, evidence, impact if false, and a validation or mitigation plan. Assumptions are propositions believed true but not yet verified; if disproved, they become risks or issues (source doc). Practitioner sources describe the same governance shape: the assumption log is the A in a RAID register, written at planning so somebody can validate the conditions later (https://www.divim.io/assumption-log/, jev weight 0.12, weak backing), with a clear workflow so that when an assumption is invalidated it converts into a risk-register entry (https://projectmanagers.net/free-assumption-log-template-google-sheets/, jev weight 0.07, weak backing), and with RAID separating risks, assumptions, issues, and dependencies into distinct sections (https://gotpmp.com/en/blog/raid-log-explained, jev weight 0.16, weak backing).

The source doc's verdict on this pattern: useful governance, but it needs technical-artifact links to become a gap-finding method (source doc). That link is the Evidence column plus the trace step.

## ADRs

ADRs capture context, alternatives, decision, rationale, trade-offs, consequences, status, and confidence. They are especially useful for assumptions that explain why an implementation or documentation choice exists. An assumption catalog should link each assumption to the ADR, requirement, code symbol, manifest entry, test, deployment step, or user-facing instruction that depends on it. An ADR without its assumptions explains a decision but not the conditions under which that decision remains valid (source doc).

## Problem frames and ISO life-cycle documentation

Michael Jackson's problem frames separate the machine from the problem domain, environmental phenomena, required relationships, and the conditions that justify the solution. They are valuable for detecting assumptions that disappear when documentation focuses only on code (source doc).

ISO/IEC/IEEE 29148 defines requirements-engineering processes, information items, content, and formats; ISO/IEC/IEEE 15289 defines the purpose and content of life-cycle documentation. Both provide standards-based support for treating assumptions, constraints, interfaces, environment requirements, and rationale as documented information rather than informal background knowledge (source doc). The 29148:2018 standard itself specifies the processes that result in requirements for systems and software products (https://www.iso.org/standard/72089.html, jev weight 0.59) and adds application guidance for requirements-related activities under ISO/IEC/IEEE 12207 and 15288 (https://standards.ieee.org/ieee/29148/6937/, jev weight 0.58). The standard text is also mirrored in publicly posted PDF form (https://drkasbokar.com/wp-content/uploads/2024/09/29148-2018-ISOIECIEEE.pdf, jev weight 0.49, weak backing), and secondary explainers summarize it as the international framework for eliciting, documenting, and managing requirements (https://www.modernrequirements.com/blogs/iso-29148-explained/, jev weight 0.16, weak backing).

## Prioritization

Step 9's rule, high impact times low evidence first, is what makes the ledger a working list rather than an inventory. A row with a verified status and a stale indicator far in the future can wait; a row with status unverified, impact "silent wrong result", and no evidence link cannot (source doc).
