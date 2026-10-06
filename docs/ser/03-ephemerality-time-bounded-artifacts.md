# 03 - Ephemerality: time-bounded artifacts and durable decisions

**Scope:** What the ground doc records about the ephemerality principle: pre-launch artifacts, pinned digests, disposable TEST-only validation flows, and the routing of durable decisions into dated notes, ADRs, and pinned references.

**Ground spine:** `yubi-OS/yubiOS docs/SER.md` (https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md, jev weight 0.61)

## What the source doc records

The ephemerality section states that yubiOS is intentionally built around pre-launch artifacts, pinned digests, disposable test flows, and a clean separation between production and TEST-only paths (source doc). Its documentation emphasizes that images are experimental unless explicitly promoted (source doc). Onboarding and CI guidance repeatedly route durable decisions into dated notes, ADRs, and pinned references rather than leaving them embedded in transient execution state, which the doc says matches SER's time-bounded retention model (source doc). The mapping table row reads: time-bounded retention = experimental artifacts, disposable validation flows, dated refs, and clear separation of current vs historical notes (source doc).

This was the marginal subtopic in outline validation (score 0.5, keep only if the dig came back strong). The dig returned a strong ADR axis (3 primary results), so it is kept.

## The ADR mechanism for durable decisions

The dig grounds the ADR pattern the doc points at. Martin Fowler's bliki defines an architecture decision record as a short document that captures and explains a single decision relevant to a product or ecosystem (https://martinfowler.com/bliki/ArchitectureDecisionRecord.html, weight 0.74). Microsoft's well-architected guidance calls the ADR one of the most important deliverables of a solution architect and treats it as the record of an architectural decision (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, weight 0.90). The community-maintained ADR GitHub repository gives the shared definition and format conventions (https://github.com/architecture-decision-record/architecture-decision-record, weight 0.50).

## Pinned digests and artifact lifecycle

On the pinned-digest half of the principle, the dig is thinner and carries weak weights. A tracking issue argues for retaining immutable content-addressed deployment artifacts so that a pinned version can be reproduced later, noting the artifact digest should be covered by the run's audit chain (https://github.com/Terfyn/terfyn/issues/207, weight 0.43, weak). A Kubernetes hardening guide treats digest-pinned, read-only, non-root images as the standard shape of immutable container practice (https://www.golinuxcloud.com/kubernetes-immutable-containers/, weight 0.17, weak). Both are weakly backed; they corroborate the mechanism, not the yubiOS-specific policy.

## How the pieces fit

Read together, the source doc draws a two-lane lifecycle: execution state (test flows, pre-launch images, TEST-only paths) is disposable and time-bounded, while decisions and evidence (ADRs, dated notes, pinned references, digest pins) outlive it. The ADR sources above (weights 0.90, 0.74, 0.50) are the dig-grounded backing for the durable lane; the disposable lane is the source doc's own record about how yubiOS treats pre-launch and test artifacts (source doc).
