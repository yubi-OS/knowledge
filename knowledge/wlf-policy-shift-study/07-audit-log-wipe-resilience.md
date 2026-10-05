# 07 Audit-log wipe resilience

Scope: the 2026-10-01 14:44Z data wipe as a case study: the audit event history was removed so policy-change timestamps are not reconstructable from D1, and the general problem of designing wipe-resistant durable ledgers for audit histories.

## The case study

The 2026-10-01 14:44Z data wipe removed the audit event history from D1. The immediate consequence for the WLF study is that policy-change timestamps are not reconstructable: the windows that the shift-factor method needs as boundaries no longer exist in the data. This is the archetypal post-incident evidence gap. Post-incident practice requires documenting the sequence of events that caused an incident (weight 0.90, https://learn.microsoft.com/en-us/compliance/assurance/assurance-sim-post-incident-activity), and a timeline is the spine of every postmortem, reconstructed from logs and other traces (weak backing, weight 0.43, https://devopsaitoolkit.com/blog/timeline-reconstruction-for-postmortems-a-practical-method/). When the log itself is the casualty, reconstruction is impossible, and the study's response was honest: method-complete, data-blocked, no numbers claimed.

The general lesson: an audit history that lives only in the operational database is an audit history with one failure mode away from being gone. Wipe protocols, retention jobs, and migrations all touch operational tables; anything the study needs later must be designed to be outside that blast radius.

## What wipe-resistant storage looks like

The strongest-backed pattern in the dig is WORM storage. Immutable storage for Azure Blob Storage lets you store business-critical data in a WORM (Write Once, Read Many) state where data cannot be modified or deleted for a user-specified interval, and immutability policies protect data from overwrites and deletes (weight 0.92, https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview). The design point transfers directly: the policy-changelog and the policy_version stamps that the study depends on should be treated as business-critical records with an immutability policy, not as ordinary application rows.

Tamper-resistance is the operational version of the same requirement. Audit logs are how you prove who did what, when it happened, and what the outcome was, so their accuracy and reliability are critical (weight 0.56, https://mattermost.com/blog/compliance-by-design-18-tips-to-implement-tamper-proof-audit-logs/). The sharp formulation from a weak-backed source is worth keeping as a design slogan: audit logs that an attacker can erase are not audit logs (weak backing, weight 0.43, https://www.systemshardening.com/articles/cross-cutting/audit-logging-architecture/). In the corpus's case the "attacker" was an ordinary wipe protocol, and the result is identical: no evidence, no reconstruction, no study.

## Why the verification perspective matters

Auditing is defined as verification activity, inspection or examination of a process or quality system (weight 0.54, https://asq.org/quality-resources/auditing). A policy-changelog exists to serve exactly that: after a wipe or an incident, an examiner should be able to verify which policy was active at any timestamp without access to the wiped operational tables. That requirement is what justifies the table being append-only, compact, and outside the wipe protocol, and it is what makes the WLF study's future data trustworthy rather than reconstructable-by-argument.

## Design requirements distilled

1. Append-only, by schema or by policy: rows cannot be updated or deleted (weight 0.92, https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview).
2. Outside the wipe protocol's blast radius, so operational resets cannot remove the changelog (weak backing, weight 0.43, https://www.systemshardening.com/articles/cross-cutting/audit-logging-architecture/).
3. Tamper-evident enough to serve as evidence: prove who did what, when, and with what outcome (weight 0.56, https://mattermost.com/blog/compliance-by-design-18-tips-to-implement-tamper-proof-audit-logs/).
4. Sufficient to reconstruct a timeline after the fact: document the sequence of events (weight 0.90, https://learn.microsoft.com/en-us/compliance/assurance/assurance-sim-post-incident-activity).

The 2026-10-01 wipe failed requirement 2 for the audit event history. The policy-changelog proposal exists to fail none of the four for the data the WLF method actually needs.
