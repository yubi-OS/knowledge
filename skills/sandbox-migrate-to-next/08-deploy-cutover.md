# 08. Deploy cutover: one deploy, immediate rollout, dead IDs

Scope: the production cutover sequence, the rollout flag and grace period, and what becomes invalid after the switch.

## The sequence

The source doc's cutover rule: "Staging/branch first. Production is one deploy of matching Worker + image" (source doc), executed as:

```sh
npx wrangler deploy --containers-rollout=immediate
```

(source doc). Staging first is the rehearsal that makes the single production deploy safe: every failure the port can produce (mixed versions, missed call sites, broken terminals) should surface on a non-production deployment first. Production is not a series of canary steps but one atomic switch, because the stable and `@next` control protocols are incompatible both ways and a gradual rollout would deliberately operate a broken mixed window (doc 03).

## The flag

The `--containers-rollout` flag is a wrangler configuration surface. The Workers configuration documentation lists it as "Containers rollout mode for this deploy. Refer to Rollouts" and shows the flag family in use, including `--containers-rollout=none` for "Deploy the Worker only. Skip container image build/push and instance rollout" ([0.89](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)). The rollouts documentation defines what a rollout is and what the flag selects: rollout mode controls "how the target container configuration is applied," with gradual (the default, stepping by `rollout_step_percentage`) versus immediate ([0.88](https://developers.cloudflare.com/containers/configuration/rollouts/), [0.86](https://developers.cloudflare.com/containers/configuration/rollouts/index.md)).

The deploy guide adds the operational caveat that motivates staging-first even with immediate: "Wrangler starts a rollout when the effective container configuration changes. The command does not wait for every container instance to be replaced, so new Worker code may briefly talk to containers that st..." run the previous image ([0.91](https://developers.cloudflare.com/containers/guides/deploy/)). For a version-line migration that brief overlap is protocol-incompatible, which is why the app must tolerate it being broken (in-flight container work can stop, source doc) rather than try to make it seamless.

## The grace period

"Leave `rollout_active_grace_period` at default `0` (or set `0` if raised)" (source doc). The rollouts documentation explains what the setting does: "`rollout_active_grace_period` applies only during a rollout, when the platform chooses which container instances to replace," and it "applies in every rollout mode, including immediate" ([0.89](https://developers.cloudflare.com/containers/configuration/rollouts/)). Raising it would keep old-image instances alive longer after they became active, which during this cutover extends the broken mixed window. Setting it to 0 is therefore not a tuning preference here but a consequence of the version-line parity rule.

A weakly weighted field observation ([0.54](https://github.com/cloudflare/containers/issues/233)) recorded on July 9, 2026 that a rollout could report completion without replacing a Durable-Object-addressed container under both rollout modes with the grace period at 0. The practical read for this migration: after cutover, verify behavior, do not trust the rollout status alone (validation item 8, source doc, checks that production used the immediate flag; runtime smoke checks in doc 09 catch a stale image the status page will not).

## What dies at cutover

"After cutover, pre-deploy process/terminal IDs are invalid" (source doc). This is a direct consequence of the protocol change: identifiers minted by the stable control plane mean nothing to the `@next` one. Application code that persists process or terminal IDs across deploys must expect `getProcess()` / `getTerminal()` to return null afterward, and the terminals shape in doc 07 shows the right response pattern: `if (!t) return new Response("terminal gone", { status: 410 })` (source doc). The red-flags list makes keeping pre-cutover IDs a stop-and-fix condition (source doc).

The "plan the move" page frames the same event from the planning side: prepare code "for the deploy that cannot be undone" and plan removal of "what 0.12 leaves behind" ([0.88](https://developers.cloudflare.com/sandbox/sdk/migrate/plan-the-move/)). Undone is not an option here because the old control plane is gone the moment the matching pair ships; the rollback direction is a redeploy of the previous Worker-plus-image pair, not a protocol downgrade in place.
