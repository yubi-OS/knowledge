# Control by Record

*Append-only evidence as the controller-free alarm: ledgers, attestation, transparency anchors, falsifiability without a gatekeeper, and its limits versus prevention.*

## Sub-claim 1: Record is the third mechanism, and the only one that reaches the past

PWC names three mechanisms in the order an adversary meets them: control by construction, control by verification at use, and control by record. Construction removes the unsafe state so there is nothing to intervene on. Verification at use merges the check and the use into one act, so there is no TOCTOU gap. Record is different in kind: nothing intervenes, and nothing needs to, because the state leaves evidence that cannot be silently rewritten. It is the weakest of the three, and it is the only one that reaches what already happened. Construction and verification protect the future; record speaks about the past.

The source doc's decision table gives record exactly one job: the state is legitimate but must not pass silently. Falsifiability without a gatekeeper. That phrase is the whole contract of the mechanism. There is no one standing at a door. There is a ledger, and the ledger makes any lie detectable by someone who reads it later, independently, human or machine.

## Sub-claim 2: Append-only plus structure is the design

The mechanism has two halves that must ship together. The first is append-only: the event lands in a ledger where entries cannot be deleted or modified after the fact. The second is structure: enough structure that an independent auditor can reconstruct what happened and detect the lie. An append-only file with no internal structure is still editable in place; structure is what makes the edit visible.

Industry writing converges on the same two halves, all with weak backing at the weights listed in Sources: audit-log design guidance treats append-only plus tamper-evidence as the defining property, holding that even administrators must not be able to delete or modify a past entry without detection (techinterview.org, weight 0.23). Retention guidance says to store logs in append-only or immutable destinations where deletion is restricted and audited (mattermost.com, weight 0.33). Hash chaining is the common structural trick: each record carries a digest of the previous record, so any edit or reordering breaks the chain and is detectable (github.com/nrpilla/integrity-log, weight 0.28; techinterview.org, weight 0.22). And the honest goal is tamper-evidence rather than tamper-proofness: with enough physical and administrative access anything can be altered, so the design target is that any alteration is detectable, not impossible (pyramidledger.com, weight 0.30). This last point matches the doctrine's own honesty about PAC layers below the OS: record does not claim the disk cannot be rewritten; it claims the rewriting cannot pass silently.

## Sub-claim 3: The record is the alarm that replaces the watcher

A controller-free program has one structural weakness: when a load-bearing assumption breaks, no one is watching, because there is no one. The append-only record is the mandatory second half. It is not a nicety; it is the alarm that stands in for the watcher that no longer exists. The signals it must be able to emit are named in the source doc: a verification failure, a logged measurement, a build attestation that stopped matching, an audit trail an outsider can replay.

The record also carries the assumptions. Every structural control rests on assumptions, a kernel feature floor, a signer that behaves, a format that stays stable, and those assumptions are pins like any other input: named, dated, and re-checkable. A floor that silently shifts is a control that silently stopped. Historical evidence is not a current pin. A ledger that recorded last year's assumption is not the same as one that proves this year's still holds.

## Sub-claim 4: The limits of record versus prevention

Record is weaker than construction and verification, and the reason is plain. Construction makes the unsafe state unreachable. Verification at use rejects the poisoned byte at the moment it is read. Record lets the event happen and makes the lie detectable afterward. Prevention fails closed at the boundary; record fails open and pays for it with detectability. That is why the doctrine orders the three mechanisms and never lets record stand in for the others: where a structure could have prevented, a ledger that merely recorded is a regression, not a substitute.

Two boundaries keep the claim honest. First, append-only evidence preserves the integrity of the record; it does not by itself prove anything more, and identity-governance guidance draws the same boundary explicitly (nhimg.org, weight 0.20, weak backing). Second, the record needs an auditor. A ledger no one replays is a filing cabinet, not a control.

## Sub-claim 5: PWC without evidence is ungoverned

The non-negotiables close the loop. No controller-free mechanism ships without naming the structural mechanism that replaces the watcher. Evidence is not optional in PWC; it is the second half of the claim. A doc that adopts a controller-free mechanism says which mechanism replaced the watcher, and what evidence proves the replacement still holds. PWC without a named mechanism is just ungoverned. And the owner is never the component PWC dissolves: where the act is irreversible, physical, or requires intent, the controller is the owner, on purpose, and record is not asked to replace that judgment.

Notably, the source doc's own inventory of where yubiOS already runs PWC lists construction (dm-verity on `/usr`, the signed catalog, atomic A/B) and verification (the rego admission boundary) as the shipped mechanisms. Record appears not as a mechanism already in place but as the standing obligation every one of those mechanisms must satisfy.

## Sources

| source | url | jev weight |
| --- | --- | --- |
| System Design: Audit Log | https://www.techinterview.org/post/3233465643/system-design-audit-log/ | 0.23 |
| Compliance by Design: Tamper-Proof Audit Logs | https://mattermost.com/blog/compliance-by-design-18-tips-to-implement-tamper-proof-audit-logs/ | 0.33 |
| integrity-log (append-only audit log service) | https://github.com/nrpilla/integrity-log | 0.28 |
| Audit Logging System Low-Level Design | https://www.techinterview.org/post/3233468938/lld-audit-logging/ | 0.22 |
| Tamper-Evident Audit Logging for Defensible Evidence Retention | https://www.pyramidledger.com/engineering/tamper-evident-audit-logging-for-defensible-evidence-retention | 0.30 |
| What Is Append-Only Evidence? | https://nhimg.org/glossary/append-only-evidence/ | 0.20 |
