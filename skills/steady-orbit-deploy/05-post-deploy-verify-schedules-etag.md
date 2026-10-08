# 05 - Post-deploy verification: schedules, bindings, etag, live routes

Scope: what must be verified in the same breath as the upload, how cron schedules are confirmed or restored, and why the etag is recorded with every deploy.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## Verify in the same breath

Guideline 4 of the source doc: schedules and bindings are verified in the same breath as the upload. Verification is part of the deploy, not a follow-up task. Two GETs follow every PUT:

1. `GET .../scripts/steady-orbit/schedules` must still show `["0 * * * *", "*/5 * * * *"]`: the hourly evolution cycle and the 5-minute automation scheduler.
2. The settings response must list all 13 bindings.

If the upload dropped the schedules, the source doc says to re-PUT them. The schedules are part of the worker's operational contract: the hourly cron drives the evolution cycle, and the 5-minute cron drives the automation scheduler. A deploy that silently dropped them would stop the engine while looking healthy to HTTP traffic.

## Why schedules can drop

Cloudflare separates worker code from its triggers: cron triggers map a cron expression to a worker's `scheduled()` handler [0.56](https://developers.cloudflare.com/workers/configuration/cron-triggers/), and the scheduled handler is the runtime entry those expressions invoke [0.61](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/). Trigger-level changes are managed through their own deployment path rather than the script-content upload [0.8](https://developers.cloudflare.com/workers/versions-and-deployments/deployment-management/). Because the multipart PUT carries code and metadata only, a deploy flow that touches settings in the wrong way can shed the schedule attachment, which is exactly why the source doc verifies rather than assumes.

The steady-orbit expectations are two fixed expressions:

- `0 * * * *`: hourly evolution cycle.
- `*/5 * * * *`: automation scheduler every 5 minutes.

## The etag as the deployed-code id

Step 6 of the source-doc sequence: on upload success (`{success:true}`), capture `result.etag` as the deployed-code id. Guideline 5: record etag plus timestamp with every deploy; the saved bundle is the rollback.

The etag is how a running worker is matched to the code that produced its behavior. When the worker misbehaves and the question is "which bundle are we on", the recorded etag answers it without another API call. The router deploy on 2026-10-06 shows the practice in use: etag `5e3447e5` for router v1 with policy-agnostic code, then `6792ff0a` for the `jev-verify` route.dispatch verify branch.

On the platform side, each code change creates a worker version and versions carry metadata such as the version id, creator, deploy source, and timestamp [0.79](https://developers.cloudflare.com/workers/versions-and-deployments/). The etag recording is the deploy log that pairs with that versioning.

## Live route verification

Guideline 6: post-deploy, live-verify every new route before reporting success. The upload succeeding means the module graph loaded; it does not mean the routes behave. For steady-orbit, new routes are exercised over HTTP immediately after the upload (for example, hitting the new router endpoint after the 2026-10-06 deploy).

The fetch handler is the runtime entry all of this rides on: requests arrive at the worker's `fetch()` handler and the module returns responses [0.73](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/). Verifying a route live is therefore the only direct evidence that the deployed module actually serves it.

## The verification loop as one unit

The source doc's sequence treats steps 6, 7 and the live-route check as one unit:

1. Upload, require `{success:true}`, capture etag.
2. GET schedules, require the two crons; re-PUT if dropped.
3. GET settings, require all 13 bindings.
4. Exercise every new route live.

A deploy that skips any of these is unverified, and the source doc's safety rules (doc 08) treat unverified deploys the way the math engine treats unverified results: not to be trusted until a selftest or live check says otherwise. That parallel is explicit in the source doc: "never ship unverified math: run the selftest endpoint after any engine deploy before trusting results."
