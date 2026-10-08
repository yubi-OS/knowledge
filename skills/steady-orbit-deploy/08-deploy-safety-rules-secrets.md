# 08 - Deploy-safety rules and secrets

Scope: the deploy-safety rules that bound every steady-orbit deploy: the byte-identical entry module, the CF 10182 secret-binding failure, secrets never riding the upload, and the unverified-math selftest rule.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## The five deploy-safety rules

The source doc lists five rules, each anchored to a recorded failure or a platform constraint:

1. Entry module `solar-rbs-entry.mjs` ships byte-identical unless a new page route requires editing it. Its legacy-territory exclusion list shadows new page routes, which is why the Sep 21 site-break happened when the entry was replaced.
2. Bindings referencing a not-yet-existing Secrets Store secret fail the whole deploy with CF error 10182. Add the binding only after the secret lands.
3. Rollback must respect the import graph (doc 07): reverting a new part without reverting its importers breaks the upload.
4. Never ship unverified math: run the selftest endpoint after any engine deploy before trusting results.
5. Secrets never ride the upload; they resolve from the Secrets Store bindings at runtime via `await env.BINDING.get()`.

## Rule 2 in depth: CF 10182

The failure shape is precise: the deploy succeeds in every other respect, but one binding points at a secret that does not exist yet in Secrets Store, and Cloudflare rejects the entire upload with error 10182. There is no partial deploy.

The platform's access model explains why the ordering matters. Secrets Store is an account-level encrypted store, and binding a secret to a worker is treated as an operation on the secret itself, requiring edit rights over it [0.31](https://developers.cloudflare.com/secrets-store/access-control/). A binding to a nonexistent secret therefore has nothing to bind to at deploy time. Secrets Store integration docs describe account-level secrets being securely encrypted and stored across all Cloudflare data centers, consumed by workers through bindings [0.62](https://developers.cloudflare.com/secrets-store/integrations/workers/).

The correct ordering is: create the secret in Secrets Store first, then add the binding in the settings response that step 4 (doc 03) picks up verbatim on the next deploy. Because metadata is always rebuilt from live settings, a secret that landed between deploys is picked up naturally; a binding hand-added to metadata before the secret exists is the recorded failure.

## Rule 5 in depth: secrets at runtime only

The source doc separates deploy-time content from runtime resolution:

- The upload payload carries binding names only. No secret values appear in any module part or in metadata.
- At runtime, worker code calls `await env.BINDING.get()` to read the secret through the binding.

This matches the platform's worker secrets model, where secrets are configuration managed outside the code and exposed to the worker through the environment [0.69](https://developers.cloudflare.com/workers/configuration/secrets/), and where bindings embed the permission so the underlying secret is never exposed to worker code as a value [0.7](https://developers.cloudflare.com/workers/runtime-apis/bindings/).

The practical consequence for deploys: a commit or module diff that inlines a secret value is wrong twice over. It violates the rule, and it would still fail, because the runtime binding, not the uploaded bytes, is what serves the value.

## Rule 4 in depth: unverified math

Steady-orbit hosts the corpus math engine, and an engine deploy changes what the math endpoints return. The source doc's rule: run the selftest endpoint after any engine deploy before trusting results. This is the same verification posture as doc 05 (schedules, bindings, live routes) applied to the engine: the deploy succeeding means the modules loaded, not that the engine computes correctly.

The selftest lives in the corpus family itself; the source doc notes the `jev-corpus-math.js` selfTest skips `visco_*` fixture kinds, which matters when a new fixture kind is added (as with `jev-visco-math.js` on 2026-10-02): the selftest will not exercise it, so verification must reach it another way.

## How the rules compose

The rules interlock:

- Rule 1 (entry module) plus the overlay pattern (doc 02) means the entry is never in the overlay set by default.
- Rule 2 (10182) plus live-settings metadata (doc 03) means bindings are correct by construction, since they are copied verbatim from settings.
- Rule 3 (importer coupling) plus import-graph verification (doc 04) means rollback passes the same pre-upload gate as a deploy.
- Rule 4 (selftest) plus post-deploy verification (doc 05) means nothing is trusted before it is verified.

Anything beyond the frontmatter description's scope is a different skill's job, per the source doc's closing line; these five rules define the boundary inside the scope.
