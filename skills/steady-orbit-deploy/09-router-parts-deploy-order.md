# 09 - Router parts and deploy order

Scope: the 2026-10-06 router-parts deploy (43 parts), the Lane B inline-mode pattern, the patched wiring across jev-main, routes-jev, jev-decide and jev-verify, and the deploy-order rule: code first, then the policy promote.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## The router deploy

The 2026-10-06 deploy moved the part count from 42 to 43: one new part, `jev-router.js`, plus 6 patched parts. Two etags record the sequence: `5e3447e5` (router v1 with policy-agnostic code) then `6792ff0a` (the `jev-verify` route.dispatch verify branch).

## The inline mode pattern

`jev-gate.js` and `jev-executor.js` (Lane B's routing modules) are INLINED per their INLINE MODE notes: no extra parts shipped. The executor imports `runLLM` from `jev-llm`. This is a deliberate contrast to the fixture pattern (doc 04): inline mode means the routing logic lives inside existing parts so the part count does not grow, while path-qualified external modules exist as separate parts because imports demand them.

The trade-off is visible in the part-count history: 37 parts on 2026-10-02, 42 before the router deploy, 43 after. Inline mode is how a feature ships without adding a part; the router shipped as a new part because it is a distinct module with its own dispatch surface.

## The patched parts and what each does

The source doc records the exact wiring of the 2026-10-06 deploy:

- `jev-main.js`: `deps.gateAction = patchedGateAction`, which is the ONE binding covering runPipeline, runExecute, approve re-run, and the router leg. `deps.dispatchAction` branches on `action.tool === 'route.dispatch'` to dispatchRouteAction. `validatePolicyDoc(doc) || validateRoutingDoc(doc)` so v6 policy docs pass the promote validator unchanged.
- `routes-jev.js`: import plus delegation line `if (p.startsWith("/api/jev/route")) return handleJevRouter(req, env, deps);` placed immediately after the corpus delegation and BEFORE the task regexes. Ordering inside the router matters: a task-shaped path must not be captured by the task regexes before the route prefix check.
- `jev-decide.js`: askJev forwards `opts.images` to the clef binding, adding multimodal intake.
- `jev-verify.js`: the route.dispatch verify-shape branch. Model dispatches verify by `text_len > 0`; automation dispatches verify by the run task's terminal state.

Every patched part shipped through the overlay pattern (doc 02): the new code copied over the extracted tree, everything else byte-identical.

## Deploy order: code first, then the policy promote

The source doc states it as a rule: deploy ORDER matters, code first, THEN the policy promote. The reason is the two failure shapes at the gate:

- A stock v6 gate seeing `route.dispatch` blocks with `invalid_action`. This is harmless: the deploy works, the new action is just not routable yet.
- The patched gate tolerates a v6 policy and fails closed as `unknown_tool`.

In other words, deploying the code before the policy is a state where old policies still validate and new actions block cleanly. Deploying the policy before the code would reference an action the deployed gate does not know, which is the unsafe ordering. The fail-closed behavior (`unknown_tool` rather than falling through) is what makes the ordering rule safe in both directions, and the general principle that promotion gates should check the deployed state before allowing promotion is standard deployment-gate design [0.08](https://how2.sh/posts/how-to-harden-environment-promotion-workflows-in-regulated-deployments/) (weak backing; the operative rule is the source doc's).

## Console updates for the router

The Router card lives in KV `jev-index.html` (SITE namespace), inserted inside `sec-corpus` after the taste card. Two rules apply (doc 06 for the mechanics):

1. The merged console is validated with an HTML parser (0 unmatched closes) before any console KV PUT.
2. The PUT uses `--data-binary` raw bytes, because curl `-d` stripped CRLF and silently shrank a 173,183-byte PUT to 169,638 bytes on this deploy.

## Verification sequence for a router-class deploy

Assembling the source doc's steps for this class of change:

1. Pull bundle, extract (43 parts after the router deploy), overlay the new and patched parts.
2. `node --check` every changed part; resolve the import graph including the inline-mode imports (`runLLM` from jev-llm).
3. Rebuild metadata from live settings; upload; capture etag.
4. Verify schedules (`0 * * * *`, `*/5 * * * *`) and all 13 bindings.
5. Live-verify the new route (`/api/jev/route` delegation).
6. Promote the policy only after the code etag is verified.
7. Update the console KV with a parser-validated, raw-byte PUT and delayed byte-compare re-GET.

This deploy is the source doc's most recent worked example, and every rule in docs 01 through 08 appears in it at least once.
