# 01 Retrieval-First Discipline

Scope: the skill's own operating protocol: prefer current documentation over pre-trained knowledge, the three retrieval sources, the version check and install path, and project initialization.

The wrangler skill opens with a warning that generalizes: knowledge of Wrangler CLI flags, config fields, and subcommands may be outdated, so any Wrangler task should start with retrieval, not recall (source doc). This is a deliberate epistemic stance. Wrangler ships new commands and deprecates old ones on a fast cadence, and a model or engineer writing commands from memory risks flags that no longer exist or config fields that have moved.

## The three retrieval sources

The skill names exactly three sources and what each is for (source doc):

1. Wrangler docs at https://developers.cloudflare.com/workers/wrangler/ for CLI commands, flags, and the config reference. Cloudflare describes Wrangler as the CLI for the Cloudflare Developer Platform, used to build, test, and deploy Workers projects, and notes that Wrangler commands run with the permissions of the authenticated member or API token (https://developers.cloudflare.com/workers/wrangler/, weight 0.95).
2. The config schema shipped in the package at node_modules/wrangler/config-schema.json for config fields, binding shapes, and allowed values (source doc). Reading the schema that matches the installed version is the only way to be sure a binding shape is valid for that version.
3. Cloudflare docs at https://developers.cloudflare.com/workers/ for API reference and compatibility dates and flags (source doc). The full commands index lives at https://developers.cloudflare.com/workers/wrangler/commands/ (weight 0.93).

The changelog is a fourth practical source the skill implies through its freshness requirement: Cloudflare publishes a Workers changelog covering meaningful changes across the dashboard, Wrangler, the API, and the workerd runtime, and states those changes are not configurable (https://developers.cloudflare.com/workers/platform/changelog/, weight 0.91). When a command behaves differently than expected, checking the changelog is often faster than guessing.

## Check the version first, then install

The skill mandates a version check before anything else: run `wrangler --version` and require 4.x or newer (source doc). If Wrangler is missing, install it as a dev dependency with `npm install -D wrangler@latest` (source doc). Installing as a project dev dependency rather than globally keeps the CLI version pinned next to the config it must parse, which matters because newer config fields are often version-gated.

Wherever possible, use Wrangler instead of hand-constructing API requests (source doc). Cloudflare's own commands reference is organized around the same principle: the core commands for creating, developing, and deploying Workers are grouped on the Workers commands page, including `wrangler dev` and `wrangler deploy` (https://developers.cloudflare.com/workers/wrangler/commands/, weight 0.93).

## Initialize a project

Two entry points exist (source doc):

- `npx wrangler init my-worker` for a bare Worker project.
- `npx create-cloudflare@latest my-app` for a framework scaffold.

The workers-sdk repository, which is the home of Wrangler itself, documents the framework path as `npm create cloudflare@latest` with pnpm and yarn equivalents (https://github.com/cloudflare/workers-sdk, weight 0.83). The scaffolder generates the config file, a hello-world handler, and a dev setup, which is why the skill treats it as the default path for anything beyond a single file.

## Why this discipline exists

Wrangler is versioned and released continuously against the Workers runtime. The changelog explicitly covers Wrangler among the surfaces it tracks (https://developers.cloudflare.com/workers/platform/changelog/, weight 0.91), and the compatibility-date system means behavior can change between two `compatibility_date` values even with identical code (https://developers.cloudflare.com/workers/configuration/compatibility-dates/, weight 0.94). A retrieval-first loop, version check, docs fetch, schema check, then write the command, turns "may be outdated" from a risk into a non-issue.

Weak-backed corroboration exists in the ecosystem: an agent-skill mirror of this same guidance exists at https://www.aibuilder.sh/skills/cloudflare/wrangler (weight 0.13, weak, aggregator) and https://agenticskills.io/skills/cloudflare-wrangler (weight 0.11, weak, aggregator). Their agreement is not evidence; the primary docs above are.

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
