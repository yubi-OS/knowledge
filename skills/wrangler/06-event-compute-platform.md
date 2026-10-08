# 06 Event, Compute and Platform Services via CLI

Scope: Workers AI, Queues, Containers, Workflows, Pipelines, Secrets Store, and Pages commands and bindings.

## Workers AI

The CLI surface is small: `wrangler ai models` lists available models and `wrangler ai finetune list` lists finetunes (source doc). The config binding is `"ai": { "binding": "AI" }` (source doc). Workers AI always runs remotely and incurs usage charges even in local dev (source doc), which is why the local-development doc recommends marking the AI binding `remote: true` explicitly.

Cloudflare's Workers overview positions Workers AI as machine learning models powered by serverless GPUs, listed alongside Workflows and Vectorize as the AI-side compute products (https://developers.cloudflare.com/workers/, weight 0.88).

## Queues

Queue management (source doc): `wrangler queues create my-queue`, `wrangler queues list`, `wrangler queues delete my-queue`, `wrangler queues consumer add my-queue my-worker`, and `wrangler queues consumer remove my-queue my-worker`.

Cloudflare's Queues wrangler-commands reference covers creating, managing, and interacting with Queues through the CLI (https://developers.cloudflare.com/queues/reference/wrangler-commands/, weight 0.95). The config binding has two halves (source doc): `queues.producers` with `binding` and `queue`, and `queues.consumers` with `queue`, `max_batch_size` (10 in the example), and `max_batch_timeout` (30 in the example). The Wrangler configuration reference confirms `queues` is an optional top-level object holding producers and consumers the Worker binds to (https://developers.cloudflare.com/workers/wrangler/configuration/, weight 0.93).

## Containers

Image building (source doc): `wrangler containers build -t my-app:latest .`, with `--push` to build and push in one command, and `wrangler containers push my-app:latest` to push an existing image to the Cloudflare registry.

Container and image management (source doc): `wrangler containers list`, `wrangler containers info <CONTAINER_ID>`, `wrangler containers delete`, `wrangler containers images list`, `wrangler containers images delete my-app:latest`.

External registries (source doc): `wrangler containers registries list`, `wrangler containers registries configure <DOMAIN>` with either `--aws-access-key-id "$AWS_ACCESS_KEY_ID"` for ECR or `--dockerhub-username "$DOCKERHUB_USERNAME"` for Docker Hub, and `wrangler containers registries delete <DOMAIN>`. The security note is explicit: never hardcode registry credentials in commands, use environment variables (source doc).

## Workflows

Workflow management (source doc): `wrangler workflows list`, `wrangler workflows describe my-workflow`, `wrangler workflows trigger my-workflow` with optional `--params '{"key": "value"}'`, and `wrangler workflows delete my-workflow`. Instance management (source doc): `wrangler workflows instances list my-workflow`, `wrangler workflows instances describe my-workflow <INSTANCE_ID>`, and `wrangler workflows instances terminate my-workflow <INSTANCE_ID>`.

Cloudflare's overview describes Workflows as durable, long-running operations with automatic retries (https://developers.cloudflare.com/workers/, weight 0.88). The config binding is `workflows` with `binding`, `name`, and `class_name` (source doc).

## Pipelines

Pipeline management (source doc): `wrangler pipelines create my-pipeline --r2 my-bucket`, `wrangler pipelines list`, `wrangler pipelines show my-pipeline`, `wrangler pipelines update my-pipeline --batch-max-mb 100`, and `wrangler pipelines delete my-pipeline`. The config binding is `pipelines` with `binding` and `pipeline` (source doc).

## Secrets Store

Store management (source doc): `wrangler secrets-store store create my-store`, `wrangler secrets-store store list`, `wrangler secrets-store store delete <STORE_ID>`. Secrets inside a store (source doc): `wrangler secrets-store secret put <STORE_ID> my-secret`, `wrangler secrets-store secret list <STORE_ID>`, `wrangler secrets-store secret get <STORE_ID> my-secret`, `wrangler secrets-store secret delete <STORE_ID> my-secret`. The config binding is `secrets_store_secrets` with `binding`, `store_id`, and `secret_name` (source doc). Cloudflare's secrets docs mention Cloudflare Secrets Store as a distinct product alongside Worker secrets (https://developers.cloudflare.com/workers/configuration/secrets/, weight 0.94).

## Pages

Pages deployment (source doc): `wrangler pages project create my-site`, `wrangler pages deploy ./dist`, optionally `--branch main`, and `wrangler pages deployment list --project-name my-site`.

Weak-backed corroboration for the breadth of this surface exists in a third-party macOS GUI description listing Workers, Pages, KV, D1, R2, Queues, Vectorize, Hyperdrive, Workflows, Containers, and AI models (https://github.com/moerdowo/WranglerMac, weight 0.18, weak; corroborates only). The primary sources above carry every claim in this doc.

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
