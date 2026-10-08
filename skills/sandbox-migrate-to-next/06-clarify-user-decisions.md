# 06. Clarify: the 4 decisions that need the user

Scope: the clarify step's questions (production cutover consent, self-deployed bridge, Python image variant, uncovered call sites) and the grounding for each.

## Why clarify is a hard gate

The workflow stops after any step that needs a user decision (source doc), and the clarify step is where the user's authority is required. The source doc's red-flags list includes "Forcing production cutover without user agreement" (source doc), which makes the cutover question a consent gate, not a formality.

## Question 1: cutover consent

"OK to cut production with `--containers-rollout=immediate` (live processes/terminals/streams may stop)?" (source doc). The cost being consented to is concrete: container instances running the old image are replaced, and anything they were doing stops. Cloudflare's rollout documentation defines the mechanics: a rollout "applies a target container application configuration after you deploy a Worker that uses Containers," with mode controlling "how the target container configuration is applied" ([0.88](https://developers.cloudflare.com/containers/configuration/rollouts/), [0.86](https://developers.cloudflare.com/containers/configuration/rollouts/index.md)). The mode table contrasts the gradual default (steps via `rollout_step_percentage`) with immediate, selected by `--containers-rollout` ([0.86](https://developers.cloudflare.com/containers/configuration/rollouts/index.md)).

The honest framing for the user includes what immediate does and does not buy: "immediate minimizes but does not eliminate the period when the new Worker can reach instances on the previous image" ([0.79](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/containers/configuration/rollouts.mdx)). For this migration the mixed window is not merely degraded but protocol-broken (stable and `@next` control protocols are incompatible both ways, source doc), which is why gradual rollout is forbidden outright (doc 03) and why the question is about timing, not about choice of mode.

## Question 2: self-deployed bridge

"Self-deployed bridge? Leave on stable." (source doc). The preview overview is unambiguous: "The self-deployed Sandbox bridge is not part of the 1.0 preview. Use the stable bridge with the matching stable package and container image" ([0.77](https://developers.cloudflare.com/sandbox/1-0-preview/)). If the audit finds a bridge deployment, the answer is not a migration step but a boundary: that component stays on the stable line, which also means it keeps its stable package/image pairing and must not be swept into the same-version sweep that the rest of the app gets.

## Question 3: Python image variant

"Python interpreter, use the `-python` image variant?" (source doc). The migrate doc carries the rule: "Use the -python image variant when you run Python. Keep the Worker package and container image on the same @next line" ([0.85](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)). The Dockerfile reference explains the variant system: "The Sandbox SDK provides multiple Ubuntu-based image variants. Choose the one that fits your use case: Always match the..." package ([0.82](https://developers.cloudflare.com/sandbox/sdk/configuration/dockerfile/)), and confirms the variants persist across the line: "Image variant names (-python, -opencode, -musl) still apply on @next" ([0.82](https://developers.cloudflare.com/sandbox/configuration/dockerfile/)). Docker Hub shows the tags exist on the registry: `next-python` and a pinned `0.13.0-next.776.1-python` were both pushed to `cloudflare/sandbox` ([0.67](https://hub.docker.com/r/cloudflare/sandbox/tags)).

The question exists because shipping the base image when the app runs Python wastes image size and start time, while shipping the wrong variant breaks the interpreter at runtime. The user (or the audit's import scan) answers it.

## Question 4: uncovered call sites

"Call sites not covered by the map?" (source doc). The replacement map is finite; real codebases are not. Anything the audit found that no map row covers goes here, and the disposition is routing rather than improvisation: the source doc's boundary-case guidance says that when a request names a trigger without the artifact it acts on, "route to the owning surface instead of improvising here" (source doc). In practice this means escalating to the per-area doc pages (Processes, Environment, Lifecycle, Terminals, Interpreter, Errors) or to the sibling skills rather than inventing an API, which hard rule 8 forbids.

## Sequencing

All 4 questions come after the audit (workflow step 2, doc 05) and before any upgrade (step 4, doc 07). That order is what makes the questions concrete: the audit's hit list tells the agent whether a bridge exists, whether Python runs in the sandbox, and which call sites resist mapping. Asking them before the audit would produce guesses; asking them after produces decisions grounded in the codebase's actual inventory.
