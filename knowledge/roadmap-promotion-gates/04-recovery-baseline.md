# Recovery baseline: no default enable without a recovery path

Scope: Documenting recovery from false positive, failed update, lockout, or broken boot before any feature that can lock an owner out is enabled by default.

## The rule

The promotion gates document states the baseline plainly (yubiOS refs, roadmap-promotion-gates, 2026-07-17): "Any feature that can lock an owner out must document a recovery path before it is enabled by default." For CI and documentation work, the corresponding status discipline is that a TODO item may be marked "planned" or "designed" only; it does not move to "implemented" without the recovery evidence.

This makes recovery a promotion gate, not a follow up ticket. The recovery path is part of the claim.

## Lockout recovery is a documented operational field

The strongest sources for this subtopic come from vendors who operate lockout capable security features at scale, and their documentation treats recovery as a first class requirement.

Dell documents TPM lockout behavior: as a security feature the TPM locks itself to help prevent attacks or unauthorized access, and the support article covers failure attempt options, lockout recovery times, and lockout recovery procedures, with the specifications regulated by the Trusted Computing Group (https://www.dell.com/support/kbdoc/en-us/000142311/tpm-failure-tries-recovery-time-and-lockout-recovery, jev weight 0.94, authoritative). The important structural fact: the vendor ships the lockout and the recovery documentation together, because one without the other is either unsafe or unusable.

Microsoft documents TPM lockout management for IT professionals, including how the lockout feature behaves and how it is administered in Windows (https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/manage-tpm-lockout, jev weight 0.89, authoritative).

Microsoft's Intune guidance for BitLocker encryption states the ordering the yubiOS baseline demands, as a precondition rather than a suggestion: "Before enabling BitLocker, understand and plan for recovery options that meet your organization's needs" (https://learn.microsoft.com/en-us/intune/device-configuration/endpoint-security/encrypt-bitlocker-windows, jev weight 0.84, authoritative). Plan recovery first; enable the lockout capable feature second.

The numbered threshold also has a documented example: BitLocker allows a maximum of 32 attempts at the correct PIN or password before requiring the recovery key, after which the system locks out further attempts and prompts for the recovery key (https://techcommunity.microsoft.com/discussions/windows11/bitlocker-setup-the-max-attemps-before-need-the-recovery-code/4203067, jev weight 0.25, weak backing).

## Administrative lockout has the same shape

Lockout is not only disk and hardware. Microsoft's Entra ID guidance on emergency access admin accounts frames the risk in exactly the terms the gate uses: it is important to prevent being accidentally locked out of the organization because you cannot sign in, and the mitigation is creating 2 or more emergency access accounts (https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access, jev weight 0.45, weak backing). The recovery path here is a standing artifact created before it is needed.

## Rollback and break glass as recovery genres

For update style failures rather than credential lockout, the published pattern is a rehearsed rollback. One infrastructure guide treats rollback as a new reviewed convergence plan and makes break glass access temporary and reconciled, concluding that the strongest recovery process is the one practiced before the outage, with clear verification and a cleanup path (https://learn.programmingline.com/learn/terraform/terraform-disaster-recovery-rollback-and-break-glass-operations, jev weight 0.34, weak backing). Windows oriented guides cover rolling back a problematic feature update safely with a clear plan and recovery path (https://windowsforum.com/news/windows-11-rollback-guide-safe-go-back-and-winre-recovery.389395/, jev weight 0.32, weak backing) and engineering a patch rollback strategy whose priority at the moment a bad update is reported is containment (https://www.hexnode.com/blogs/the-patch-rollback-playbook-recovering-from-bad-updates/, jev weight 0.21, weak backing).

## What "recovery evidence" means for CI and docs

The source doc constrains status vocabulary for CI and docs items: "planned" and "designed" are reachable without recovery evidence; "implemented" is not (yubiOS refs, roadmap-promotion-gates, 2026-07-17). A recovery path is documented evidence when it answers, in writing: what the owner does after a false positive, a failed update, a lockout, or a broken boot; which artifacts or credentials the recovery needs; and where those artifacts live. A recovery path that requires the broken system to be healthy is not a recovery path.

## Authoring guidance

For any promoted item that ships an enforcement behavior (a gate, a lockout, a verification that can fail closed), write the recovery section first. If the recovery section cannot be written, the item is not ready to be enabled by default, whatever else is done.
