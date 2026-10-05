# 07 Worker deploy via the modules API

Scope: deploying the 37-part steady-orbit worker via the Cloudflare modules API: overlaying a NEW `jev-visco-math.js` part, rebuilding metadata from live settings, preserving 13 bindings and two cron schedules, and the etag-recorded 2026-10-03 deploy.

## What was deployed

The visco instruments shipped as an overlay deploy on the existing steady-orbit worker: 37 parts total, of which 36 were already live and 1 was new (`jev-visco-math.js`), with 7 parts changed in total. The entry module `solar-rbs-entry.mjs` remained byte-identical. The upload went through the Cloudflare Workers modules API, with metadata rebuilt from the live settings rather than from a local config, so all 13 bindings were preserved. Cron schedules were preserved at `0 * * * *` and `*/5 * * * *`. The deploy was recorded with etag `4da009ce42999ad623b24d1fea2dd1f73213b57b0f8cd4090271e58006196b9c` at approximately 04:53 UTC on 2026-10-03 [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## The modules API surface

Cloudflare's script update endpoint accepts a multipart upload in which each module part carries its name, content type, and body, plus a metadata part. The API documents behavior that the deploy relied on: when the metadata validation setting is "strict", the upload fails if any inheritable bindings cannot be resolved against the previous version of the worker, and without strictness unresolvable inherit bindings are silently dropped [source: https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/update/, jev weight 0.6181]. Third-party SDK documentation for the same endpoint describes uploading a worker module with the multipart metadata format [source: https://cloudflare.hexdocs.pm/worker_script.html, jev weight 0.5787].

The "rebuild metadata from live settings" discipline in the deploy exists because of exactly this API behavior: a metadata blob built from a stale local copy can silently drop or mis-resolve bindings. Pulling the live settings (13 bindings, cron schedules) as the base and overlaying only the changed and new parts keeps the deployed worker's environment identical except for the intended changes [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## Why the entry module stayed byte-identical

The new math part does not change the worker's entry module; the routes import it. Keeping `solar-rbs-entry.mjs` byte-identical means the deploy cannot have altered routing, middleware, or error handling: any post-deploy behavior change is attributable to the new and changed parts alone. This is the same narrow-diff discipline used in overlay deploys generally, and it made the post-deploy verification interpretable (the selftest and route checks exercise only what changed) [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## Cron schedules survive because they are re-declared from live settings

Cloudflare cron triggers map a cron expression to a worker using a `scheduled()` handler that executes the worker on a schedule, and are configured per worker deployment [source: https://developers.cloudflare.com/workers/configuration/cron-triggers/, jev weight 0.9551]. The documentation's own example sets an hourly cron trigger in wrangler configuration [source: https://developers.cloudflare.com/workers/examples/cron-trigger/, jev weight 0.9591]. The steady-orbit worker runs two crons, the hourly evolution cycle (`0 * * * *`) and a 5-minute poller (`*/5 * * * *`), and both were preserved through the overlay because the metadata rebuild copied the live cron configuration [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## The etag as a rollback anchor

Recording the deploy etag alongside the timestamp gives the deployment an exact identity: any subsequent deploy can be diffed against or rolled back to this state by content address, not by description. The build record stores etag `4da009ce...6196b9c` for the 2026-10-03 deploy [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. Combined with the preserved-bindings guarantee and the byte-identical entry module, the deploy is narrow in every dimension that could break the running worker: parts added (1), parts changed (7), bindings changed (0), crons changed (0), entry module changed (0 bytes).

## Verification follows the deploy

Deployment is not the finish line in this build: the immediate post-deploy step was running the corpus selftest endpoint, which returned 200 with all checks passing and now includes the visco fixture-parity checks, followed by live end-to-end verification of each route [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. The deploy record and the verification record together form the evidence pair that a later audit can re-check.
