# 02 Compute product routing

Scope: the "I need to run code" decision tree from the source doc, the criteria each row encodes, and what the dig confirms or adds about the compute lineup.

## The tree as the source doc states it

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) routes the request by the artifact you need, not by a product ranking:

- Serverless functions at the edge: workers/
- Full-stack web app with Git deploys: pages/
- Stateful coordination or real-time: durable-objects/
- Long-running multi-step jobs: workflows/
- Run containers: containers/
- Multi-tenant, customers deploy code: workers-for-platforms/
- Scheduled tasks (cron): cron-triggers/
- Lightweight edge logic that modifies HTTP: snippets/
- Process Worker execution events for logs and observability: tail-workers/
- Optimize latency to backend infrastructure: smart-placement/

Each row encodes one distinguishing criterion: delivery model (Git deploys versus direct deploy), state (stateless functions versus strongly consistent per-entity state), duration (multi-step jobs), trust boundary (your own code versus customer code), trigger (HTTP versus schedule), and what is being observed (the Worker itself, via a tail worker).

## What the docs confirm

The Cron Triggers docs (weight 0.97, https://developers.cloudflare.com/workers/configuration/cron-triggers/, updated 2026-09-04) confirm the scheduled branch: Cron Triggers map a cron expression to a Worker using a scheduled() handler, and are ideal for running periodic jobs such as maintenance or calling third-party APIs to collect up-to-date data. The configuration is per environment: the cron example docs (weight 0.96, https://developers.cloudflare.com/workers/examples/cron-trigger/, updated 2026-09-04) show a different Cron Trigger can be set for each environment by putting the [triggers] table under the chosen environment in the Wrangler configuration file.

## What the dig adds, with honest weighting

The strongest dig results for this subtopic are the two cron docs above. The Pages-versus-Workers discussion lives almost entirely in third-party posts that all scored weak (0.08 to 0.11). Cited as weak backing only:

- Weakly weighted posts (weight 0.08, https://www.morphllm.com/comparisons/cloudflare-pages-vs-workers; weight 0.09, https://dev.to/rickcogley/cloudflare-pages-vs-workers-in-2026-migration-guide-ka7; weight 0.11, https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/) report that in 2026 the platform investment has shifted toward Workers, that several products (Secrets Store, Workflows, Containers, Durable Objects) remain Workers-only, and that Pages is described by one of them as in maintenance mode. These are weak sources and the claims are not confirmed by any weight 0.5 or higher source in this dig. The source doc still routes full-stack web apps with Git deploys to Pages, and nothing in the high-weight dig contradicts that routing, so the corpus keeps the source doc's row and records the weak third-party drift signal without adopting it.
- Weakly weighted (weight 0.09, https://www.cipher.co.th/en/blogs/cloudflare-compute-services-explained/) describes the use-case split the tree encodes: Durable Objects for a single authoritative point of consistency per key such as a chat room, a stock counter, or an exact rate limiter, and Containers when a needed binary or library cannot run inside a Worker. Weak weight, so use it as orientation only.

## How to use the tree

The skill's boundary rule applies: when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising. In practice that means the caller picks the row whose criterion matches the requirement (state, duration, tenancy, trigger, or latency target), then loads the matching reference directory named in the Product Index of the source doc. The tree deliberately has no ranking and no defaults; the choice is made by matching a criterion, and anything outside the tree is a different skill's job, per the source doc's Guidelines.
