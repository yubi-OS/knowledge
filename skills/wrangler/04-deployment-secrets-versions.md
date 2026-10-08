# 04 Deployment, Secrets, Versions and Rollback

Scope: `wrangler deploy` and its flags, secret management, and the versions and rollback commands.

## Deploying

`wrangler deploy` pushes the Worker to Cloudflare (source doc). The flag set the skill documents (source doc):

- `wrangler deploy` for a production deploy using the top-level config.
- `wrangler deploy --env staging` to deploy a specific environment.
- `wrangler deploy --dry-run` to validate the build and config without deploying.
- `wrangler deploy --keep-vars` to keep dashboard-set variables that a deploy would otherwise remove.
- `wrangler deploy --minify` to minify code at deploy.

Cloudflare's commands reference lists `wrangler dev`, `wrangler deploy`, and `wrangler versions` among the commands that manage Workers (https://developers.cloudflare.com/workers/wrangler/commands/, weight 0.94), and the Workers commands page documents the global flags including `--config` (alias `--c`) to point at a specific config path and `--cwd` to run as if started in another directory (https://developers.cloudflare.com/workers/wrangler/commands/workers/, weight 0.89).

The `--dry-run` flag is a best practice before major deploys: validate changes without deployment (source doc). `--keep-vars` exists because a deploy otherwise syncs config-declared vars and can drop vars that only exist in the dashboard (source doc).

## Secrets

Secret management is the highest-discipline area in the skill. The security rule is stated twice: never pass secret values as command arguments or pipe them via `echo`; use the interactive prompt, pipe from a file, or use `secret bulk`; never output, log, or hardcode secret values in commands (source doc).

The command set (source doc):

- `wrangler secret put API_KEY` with the interactive prompt, the preferred path.
- `wrangler secret put PRIVATE_KEY < path/to/private-key.pem` for file-based input, useful for PEM keys and CI.
- `wrangler secret list` to enumerate secrets.
- `wrangler secret delete API_KEY` to remove one.
- `wrangler secret bulk secrets.json` to set many at once from a JSON file that must never be committed.

Cloudflare's secrets docs cover the same command surface for creating, deleting, and listing secrets, and add the config-side `secrets` property for declaring required secret names, used for validation during local development and deploy and as the source of truth for type generation (https://developers.cloudflare.com/workers/configuration/secrets/, weight 0.94). Declaring secret names in config also feeds `wrangler types`, so a missing secret fails early rather than at runtime.

The best-practices list repeats the rule as its 9th item: never embed secrets in commands; use interactive prompts, `wrangler secret bulk`, or secure CI environment variables (source doc).

## Versions and rollback

Every deploy creates a version. The skill's commands (source doc):

- `wrangler versions list` to list recent versions.
- `wrangler versions view <VERSION_ID>` to inspect one.
- `wrangler rollback` to roll back to the previous version.
- `wrangler rollback <VERSION_ID>` to roll back to a specific version.

Cloudflare's rollbacks docs confirm the command-line path and note that rolling back to a specific version can be done by specifying the version ID directly, pointing at the `wrangler rollback` documentation for details (https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/, weight 0.94). Rollback is the recovery tool after a bad deploy; `--dry-run` is the prevention tool before it.

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
