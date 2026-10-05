# 02 - Blocker Triage and Reclassification

Scope: retiring, reclassifying, or explicitly deferring blockers on a critical path, and the triage taxonomy that separates pilot-blocking from release-blocking and out of scope work.

## The taxonomy in the source plan

The days 31 to 60 plan (yubiOS refs, `days-31-60-narrow-product-2026-07-25.md`) sorts every blocker on its list into one of four actions, and the sorting is the work:

1. Must fix before the pilot claim (B-VM-CTAP2): the VM guest ran enrollment surface checks but no FIDO2 token enumerated, so every token dependent test was skipped. This sits on the critical path and is called out as the hardest blocker.
2. Reclassify by sequencing (B-REAL-FIDO2): not a software gap anymore but gated on B-VM-CTAP2 closing first; the physical hardware demo is scheduled right after the software blocker goes green.
3. Reclassify to a different gate (B-BOOTC-SEAL): moved from pilot blocker to release blocker, with the current mutable anchor fs-verity story documented as a known limit while sealed UKI work continues on its own track.
4. Explicitly exclude (B-RK3588-TPL, B-ARM64-PATHA) or leave contained (B-QEMU-ZBOOT, B-PINS): out of scope for the pilot platform or already handled by a workaround, with the workaround kept explicit and PINNED.md kept current.

The pattern to reuse: a blocker is never just closed or left open. It is either fixed, resequenced behind another blocker, moved to a different gate, or named as out of scope. The plan's exit criteria then check that each reclassification is written down, for example "B-BOOTC-SEAL explicitly reclassified as release track, not pilot blocking, with the limit documented".

## Severity and priority are different axes

The distinction that underpins this taxonomy is standard defect management practice: severity measures how badly a bug affects the system while priority defines how urgently it needs to be fixed, and the two are not the same (weight 0.730, https://www.browserstack.com/guide/bug-severity-vs-priority). In the source plan, B-VM-CTAP2 is both high severity and high priority for the pilot, while B-BOOTC-SEAL is high severity but low priority for the pilot window because the gate it belongs to is the release gate, not the pilot gate.

Practitioners warn against label inflation: if everything is marked "Blocker", developers stop trusting severity labels, and definitions must be applied consistently, so a cosmetic issue keeps its low severity even when it is user visible (weight 0.283, weak, https://www.drizz.dev/post/severity-vs-priority-bug-tracking). The same failure mode applies to blocker reclassification: if "release blocker" becomes a dumping ground for anything inconvenient, the release gate loses meaning.

Triage guidance for games teams uses a similar capacity model: P2 bugs are triaged into the sprint backlog and addressed based on available capacity, typically fixed over one to two sprints, while P3 bugs are cosmetic or affect so few conditions they may not be fixed (weight 0.408, weak, https://bugnet.io/blog/bug-severity-classification-for-game-developers). B-QEMU-ZBOOT and B-PINS in the source plan are the P3 analog: contained workarounds with no action needed, just kept current.

## Triage speed is a function of report quality

Defect triage practice holds that anything failing the first triage question gets closed or sent back for a better reproduction, which is why report quality dominates triage speed: a defect with exact steps and environment takes a minute to route, a vague one burns the room's time (weight 0.342, weak, https://bug0.com/knowledge-base/defect-triage). The source plan's exit criteria encode this by demanding logged evidence, for example "B-VM-CTAP2 closed with logged evidence of FIDO2 token enumeration in the VM lane", so the closing record itself is routable and auditable.

A severity level reference frames the same idea as classification being essential for triage accuracy, prioritization, and reliable releases (weight 0.299, weak, https://blog.qatestlab.com/software-bugs-severity-levels/). A release blocker classification prompt aimed at go/no-go decisions classifies pre-release findings, whether bugs, failing tests, performance regressions, security advisories, or configuration drift, before the gate (weight 0.136, weak, https://inferensys.com/prompts/code-review-and-bug-triage-prompts/release-readiness-and-rollback-decision-prompts/release-blocker-severity-classification-prompt).

## Deferral must be explicit

The word "defer" means to put off or delay (weight 0.574, https://www.merriam-webster.com/dictionary/defer). The source plan operationalizes the definition: deferred items get a stated reason and a destination. B-BOOTC-SEAL is deferred to the release track with a pointer to the sealed flow doc; ARM64 is excluded to a named future path rather than an unnamed someday. Scope literature makes the same point for contracts: scope is defined by explicit inclusions and exclusions, and clearly defined exclusions prevent disputes later (weight 0.272, weak, https://www.flyriver.com/g/define-scope-inclusions-and-exclusions; weight 0.091, weak, https://a3aengenharia.com/en-us/content/technical-articles/contractual-scope-engineering-inclusions-exclusions-assumptions-interfaces-changes/). One engineering forum thread describes the practice of ending an exclusions list with "all other services not explicitly identified" (weight 0.118, weak, https://www.eng-tips.com/threads/proposals-and-exclusions.521845/), which is the contractual version of "explicitly excluded, not silently dropped".

## Rules to carry into any pilot window

1. Sort blockers into fix, resequence, regate, or exclude. Never leave one unsorted.
2. Keep severity and priority separate, and keep label definitions strict so the labels stay trusted.
3. Require logged evidence as the closing artifact for any must-fix blocker.
4. Write exclusions down with the same care as inclusions, and give every deferral a destination.
