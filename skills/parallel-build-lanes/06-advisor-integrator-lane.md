# 06 The advisor / integrator lane

Scope: the advisor/integrator smart lane: reconciles cross-lane interface mismatches, writes any module no lane covered, runs all suites together, adds a full-lifecycle e2e test, and produces an integration report plus deploy checklist.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

## One lane, 5 duties

Phase 5 of the source doc's sequence dispatches a 6th lane with a distinct job: "Advisor/integrator: one smart lane that (a) reconciles cross-lane interface mismatches, (b) WRITES any module no lane covered, (c) runs all suites together, (d) adds a full-lifecycle e2e test, (e) produces an integration report + deploy checklist."

The 5 duties are complementary coverage. (a) is correction: lanes were written against the SPEC but the seams may still mismatch. (b) is gap-filling: the capability map named every module, but a lane may have returned without one, or a small module may never have been assigned; the advisor writes it rather than dispatching a 7th lane late. (c) is composition: individual green suites do not prove the system composes, so the advisor runs them together. (d) is the only test that crosses every module: a full-lifecycle end-to-end test exercising the built system start to finish. (e) is the artifact: the integration report and deploy checklist that phase 6 (deploy and live verification) consumes.

## Why the advisor runs the smart preset

The doc's phase 4 sets model policy for implementation lanes ("smart for correctness-critical lanes and fast for thinner ones"); the advisor is specified as "one smart lane," so it always gets the smart preset. The reasoning is in the duties: reconciliation requires holding 4 or 5 lanes' interface summaries in mind at once, judging which side of a mismatch is wrong against the SPEC, and writing an uncovered module from the SPEC's contract alone. That is cross-lane judgment, not single-module implementation, and the doc assigns it the higher-capability model unconditionally.

## Reconciliation against the SPEC, not against lanes

The advisor's reconciliation anchor is the formal SPEC, which "every lane implements against." When two lanes' interface summaries disagree, the advisor compares each against the SPEC's endpoint and schema contracts and module file contract (exact export names) and fixes the side that drifted. This is why the SPEC's contract sections must be falsifiable: an export name is a string comparison, an endpoint path is a route table check. The source doc's integration lessons document the class of bug this catches: an adapter that "destructures only part of its ctx silently drops fields," which let "every approved task re-check as needs_approval forever." A per-lane suite passes such a bug; only cross-lane reconciliation against the full context contract sees it.

## The e2e test as the pipeline's proof

Duty (d) is the advisor's own deliverable, not just a rerun: "adds a full-lifecycle e2e test." The integration lessons define what lifecycle means in the jev builds: approval flows where "any check that must count a just-created binding must run AFTER the binding is written (status and actor included)." A full-lifecycle test drives the system through its real sequence (create, gate, approve, commit) rather than exercising modules individually, which is the only way to catch sequencing bugs that unit suites pass. The deploy-safety section's fail-closed invariant ("a gate or config failure ends in blocked, never dispatch") is also an e2e-level property: it holds at the seams, not inside any single module.

## The integration report and deploy checklist

Duty (e) hands phase 6 its inputs. The deploy checklist enumerates what the orchestrator must satisfy at deploy time, which per the source doc includes the Cloudflare Workers deploy-safety items: multipart PUT shape, byte-safe handling of legacy entry modules, and binding-after-secret ordering. The integration report records what the advisor found and fixed, which is what the orchestrator's single completion report ("shipped, live proof points, tests, what is open") summarizes at the end.

## External context, labeled weak

The dig results are on-topic but all below the 0.5 threshold, so they are labeled weak and treated as context. A University of British Columbia course page on architectural mismatch describes the classic integration failure where independently developed components assume incompatible structures (weak, 0.12; people.ece.ubc.ca/matei/EECE417/BASS/ch18lev1sec2.html), which is the general form of the advisor's duty (a). A QA-phase checklist essay organizes release verification from strategy through release (weak, 0.08; virtuosoqa.com/post/qa-checklist), the general form of duty (e). An integration-engineer interview-signals page catalogs the skills the role is expected to have, interface reconciliation among them (weak, 0.11; compoundlearn.ai/topics/integration-engineer-interview-signals). No external source describes an advisor lane that both reconciles and writes uncovered modules; that dual mandate is the source doc's.
