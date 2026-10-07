# 08 Deploy safety on the Cloudflare Workers modules API

Scope: deploy safety for the orchestrator's deploy step: the multipart PUT shape of the Workers modules API, byte-safe preservation of legacy entry modules, the binding-after-secret ordering hazard with Secrets Store, and the fail-closed invariant.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

## The multipart PUT shape

The source doc specifies: "Multipart PUT: a metadata part (main_module, compatibility_date, bindings) plus one part per module, filename equal to the part name, type application/javascript+module."

The modules API upload is a multipart form with exactly one metadata part and one part per module. The metadata part carries the main_module (the entrypoint), the compatibility_date, and the bindings array. Each module is its own form part, and two properties must match exactly: the part's filename equals the part's name, and the content type is application/javascript+module. Getting either wrong yields a deploy that either fails or silently mis-binds, which is why the skill pins the shape rather than trusting the deploy tooling.

External corroboration exists and is official, though every dig weight landed below 0.5 and is labeled weak. The Cloudflare Workers docs carry a dedicated "Multipart upload metadata" page describing the metadata part of a modules-API upload (weak, 0.07; developers.cloudflare.com/workers/configuration/multipart-upload-metadata/), the Workers-for-Platforms reference includes API examples that upload modules via the multipart form (weak, 0.32; developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/platform-examples/), and the Workers docs overview plus secrets configuration pages cover the deployment and secrets surfaces (weak, 0.17; developers.cloudflare.com/workers/, weak, 0.12; developers.cloudflare.com/workers/configuration/secrets/). The dig also returned the Workers infrastructure-as-code page (weak, 0.18; developers.cloudflare.com/workers/platform/infrastructure-as-code/).

## Byte-safe legacy entry modules

The source doc records: "Preserve legacy entry modules byte-safe unless a surgical edit is REQUIRED (the entry's 404/legacy-territory exclusion list shadows new page routes - add the prefix there too)."

When updating an existing deployment (the steady-orbit worker case), the legacy entry module is preserved byte-for-byte unless a surgical edit is genuinely required. The recorded hazard is shadowing: the entry module carries its own 404 and legacy-territory exclusion list, and that list shadows newly added page routes, so a new route that is not also added to the exclusion prefix list will be eaten by the entry's legacy handling and never reach its own module. The rule has 2 halves: default to no edit, and when an edit is required, remember to extend the exclusion list in the same edit.

## Binding-after-secret ordering

The source doc records: "Bindings referencing a not-yet-existing Secrets Store secret FAIL the whole deploy - add the binding only after the secret lands."

This is a strict ordering constraint, not a warning: a deploy whose bindings array references a Secrets Store secret that does not exist yet fails as a whole. The correct sequence is create the secret first, then deploy with the binding that references it. For the parallel-build process this lands at a specific moment: the capability map and SPEC name the bindings the system needs, and the orchestrator's deploy checklist must order secret creation before any deploy that binds them. The doc's deploy checklist artifact (advisor duty e) is where this ordering is recorded for phase 6.

The dig's Cloudflare secrets configuration page (weak, 0.12; developers.cloudflare.com/workers/configuration/secrets/) is the official reference for the secrets surface the hazard concerns.

## The fail-closed invariant

The source doc's last deploy-safety line is categorical: "Never weaken the fail-closed invariants: a gate or config failure ends in blocked, never dispatch."

This is the one invariant the deploy step may never trade away. In the jev-orchestrator builds the system is a gated automation engine: a failure in a gate check or in configuration must terminate in the blocked state, never fall through to dispatch. The instruction is addressed to whoever touches the code during deploy-time surgical edits: a deploy fix that simplifies a gate into a pass-through violates the invariant even if it makes the deploy succeed. Combined with the sequencing lesson from the integration lessons (checks must run after the writes they count), the fail-closed rule defines what "correct" means for the deployed system independent of whether it boots.

## Where this fits the pipeline

Phase 6 of the sequence is "Deploy + live verify: orchestrator deploys, then verifies every route/leg live before reporting." The deploy-safety rules are the constraints on the first half of phase 6; the live verification doc (09) covers the second half. The advisor's deploy checklist (phase 5, duty e) is the handoff artifact that carries the multipart shape, the legacy-module policy, and the binding-after-secret ordering into the orchestrator's deploy run.
