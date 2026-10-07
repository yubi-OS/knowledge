# 07 Integration lessons from the jev builds

Scope: the 5 integration lessons the source doc carries from the jev-orchestrator and Jev Automations builds on the steady-orbit worker: test-driver vs real-backend parity, adapter forwarding, hash/shape duality, binding-vs-REST response shapes, and sequencing at approve/commit points.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

Internal-record subtopic: these lessons are build history recorded in the source doc itself, so no searXNG dig was run for this doc. The skill's header dates the source of the lessons: the validated process used for the jev-orchestrator and Jev Automations builds, 2026-10-01.

## Lesson 1: test-driver vs real-backend parity

The source doc records: "in-memory test drivers tolerate what the real backend rejects (D1 fails closed on unknown columns; NOT NULL columns reject explicit NULL even with DEFAULT 0 when the insert lists every column). Any new column needs its insert-layer default and column-list filter in the same commit."

This is the parity gap: the lane's test suite runs against an in-memory driver, and the driver accepts calls the real D1 backend rejects. Two concrete divergences are recorded. Unknown columns: D1 fails closed, the driver does not. NOT NULL columns: the real backend rejects an explicit NULL insert even when the column has DEFAULT 0, because the insert statement lists every column. The fix rule is stated as a commit discipline: a new column ships together with its insert-layer default and its column-list filter, never as separate commits. For the lane process this means a lane can return all-green and still fail against the real backend, which is precisely why the advisor lane exists to run everything together and why the orchestrator verifies live after deploy.

## Lesson 2: adapters must forward everything

The source doc records: "a wrapper that destructures only part of its ctx silently drops fields (an approvals-array drop made every approved task re-check as needs_approval forever). Any adapter wrapping a gate or check function MUST forward the full context."

The recorded failure is concrete: an approvals adapter dropped the approvals array, and the downstream effect was persistent misclassification, every approved task re-checked as needs_approval. The general rule is stated for any adapter wrapping a gate or check function: forward the full context. The failure mode is "silent," meaning no error is thrown; the wrapper's type signature narrows the context, and each individual piece still typechecks. Only an end-to-end test across the gate would catch it, which is why the advisor's full-lifecycle e2e test is a required deliverable.

## Lesson 3: hash/shape duality

The source doc records: "two components hashing the same thing differently (body-only vs method+url+body) pass individually and fail at the seam - unify the hash/shape in ONE module and have the other import it."

The example is two components computing a hash of the same logical object with different canonicalizations, one hashing only the body, the other hashing method plus url plus body. Each component is internally consistent and its own suite passes. The mismatch surfaces only when the two meet at a seam and compare digests. The recorded remedy is an ownership rule, not a convention rule: unify the hash and shape definition in ONE module and have the other import it, so there is exactly one canonical form in the codebase rather than two agreeing-by-luck forms.

## Lesson 4: binding-vs-REST response shapes on managed AI bindings

The source doc records: "Binding-vs-REST response shapes differ on managed AI bindings; never stringify an object response - extract known shapes and attach raw_shape diagnostics on empty extraction."

Two access paths to the same managed AI binding return differently shaped responses, so code written against one shape breaks against the other. The recorded rules: never stringify an object response (which flattens the difference and hides it), extract known shapes explicitly, and when extraction comes up empty, attach a raw_shape diagnostic so the failure is diagnosable rather than opaque. This is a defensive-programming lesson specific to the Workers binding environment where the same model may be reachable as a binding and as a REST endpoint.

## Lesson 5: sequencing at approve/commit points

The source doc records: "any check that must count a just-created binding must run AFTER the binding is written (status and actor included)."

This is an ordering invariant for approval and commit flows: a check that reads state which the immediately preceding write creates must be sequenced after that write, and the write must include status and actor. The failure it prevents is a check observing pre-write state and therefore miscounting. Like lesson 1, it is invisible to in-memory drivers that do not model write visibility, and it is exactly the class of bug the full-lifecycle e2e test (advisor duty d) is specified to catch.

## How the lessons relate to the lane process

All 5 lessons share a shape: each bug passed its own lane's suite and failed only at a seam (real backend, adapter consumer, cross-component hash comparison, alternative access path, write ordering). The source doc places the section under the heading "Integration lessons (from the jev builds - check every one)," with "check every one" addressed to whoever runs a new build. That makes the lessons a review checklist for the advisor lane and the orchestrator: when integrating lanes built against a SPEC, check parity, adapter forwarding, hash unification, response-shape handling, and write sequencing, because the recorded failures came through those 5 doors.
