# 07 - Rollback discipline

Scope: rollback by re-PUT of the saved pre-deploy bundle, and the importer coupling that decides whether a rollback is a one-file or a multi-part operation.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## The saved bundle is the rollback

The source doc's rollback rule is mechanical: re-PUT the saved pre-deploy bundle exactly as extracted, all original parts plus original metadata. Steps 4 through 7 are then re-verified: metadata from live settings, import graph intact, schedules and bindings confirmed. Finally, confirm the old etag behavior on a health endpoint, per the rollback example in the source doc's examples section.

This is why the bundle pull (doc 02) is mandatory before every change: without an unmodified saved bundle there is nothing to roll back to. The platform keeps deployment history and supports rollbacks at the version level (Cloudflare's rollback creates a new deployment from a previously deployed version [0.68](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)), but the steady-orbit flow does not depend on the platform's history: it carries its own rollback artifact, which makes rollback possible even for the byte-level corruption shapes (doc 06) that a version pointer would faithfully reproduce.

## The importer coupling rule

The hard part of rollback is not restoring the old parts; it is respecting the import graph. The source doc's rule: if a new part was ADDED, a rollback must also revert parts that import it. Its recorded example: reverting the jev-corpus parts alone breaks `jev-main.js`'s import. The two options are:

1. Re-ship the edited importer's previous version (the version from before it started importing the new part).
2. Keep the new part present but unused.

Option 2 is often the cheaper and safer one: a module that is uploaded but not imported is inert, and the rollback becomes a pure code revert of the importers without touching the part set.

This coupling is a property of the multipart worker model itself: the uploaded parts form the module graph the runtime resolves at load, and any import pointing at an absent module fails the whole upload (doc 04, the 10021 "No such module" family). A rollback that halves the graph fails the same way the bad deploy did.

## Rollback is a re-deploy, not an undo

Because rollback re-PUTs a bundle, it goes through the same checks as a normal deploy:

1. Metadata rebuilt from live settings (doc 03). The rollback uses the original metadata captured with the bundle; if settings changed since, live settings is still the source of truth for the re-PUT.
2. Import graph resolved across the full part set being shipped.
3. Schedules verified (`0 * * * *` and `*/5 * * * *`), all 13 bindings confirmed (doc 05).
4. New etag captured and logged; live behavior confirmed on a health endpoint.

Cloudflare's deployment model treats a rollback as creating a new deployment from a specified version, which immediately becomes the active deployment across routes and domains [0.58](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/versions-and-deployments/rollback) and can be driven from the CLI with `wrangler rollback` [0.51](https://blog.cloudflare.com/introducing-rollbacks-for-workers-deployments/). The steady-orbit flow's manual re-PUT is the REST equivalent, with the importer-coupling rule added on top because the module graph here is large (43 parts as of 2026-10-06) and hand-managed.

## When to roll back versus forward-fix

The source doc does not prescribe a decision procedure, but its recorded behavior implies one. Rollback is the tool for "the deploy is wrong and the fix is not immediately in hand". Forward fixes are preferred when the change is small and verified (the router deploy shipped two etags in sequence, `5e3447e5` then `6792ff0a`, rather than rolling back). The non-negotiable in both directions is the same: never leave the worker in a state where schedules, bindings, or the import graph are unverified.

## Rollback checklist

1. Locate the saved pre-deploy bundle and its original metadata.
2. Decide the part set: all original parts, plus the importer decision (revert importers or keep new part unused).
3. Re-PUT exactly as extracted.
4. Re-verify schedules and bindings.
5. Capture the new etag and timestamp.
6. Live-verify a health endpoint before declaring recovery.
