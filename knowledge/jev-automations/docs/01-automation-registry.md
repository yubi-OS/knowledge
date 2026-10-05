# Automation registry: versioned templates with single-active-per-name activation

Scope: the automation registry in D1 (`jev_automations`) holds versioned automation templates (stages, per-stage prompt and model route, tool_refs, trigger, gate profile); deploy creates a draft version, activation is single-active-per-name with auto-pause of older active versions, activation revalidates the stored definition, and every run task stamps its source automation plus an audit event.

## Why a registry under an automation engine

An automation is not code deployed with the Worker; it is data the engine interprets. That distinction is what lets an operator deploy a new automation from a dashboard without shipping a new Worker bundle. The steady-orbit worker stores automations in Cloudflare D1, the serverless SQL database that Workers query directly (https://developers.cloudflare.com/d1/, weight 0.93; https://developers.cloudflare.com/d1/get-started/, weight 0.98, which describes defining a schema and querying it from a Worker). Treating the automation as a rowset rather than a file means the registry inherits D1's transactional semantics: a draft version is a row, activation is a constrained update, and audit events are inserts in the same database.

## The versioned template shape

Each automation row carries: stage definitions (an ordered pipeline), per-stage prompt text and model route, tool_refs naming the policy tools a stage may call, the trigger type (manual or interval), and a gate profile. This mirrors the classic separation Fowler describes between decision points (the automation definition) and decision logic (what the engine executes) (https://martinfowler.com/articles/feature-toggles.html, weight 0.89). Declarative schemas for D1 defined in code are an established pattern (https://www.npmjs.com/package/d1-schema, weight 0.74), and the registry follows the same spirit: the definition is data, validated as data.

## Deploy is a draft, activate is a swap

The lifecycle has two distinct verbs. Deploy = a new draft version is written; nothing runs on it. Activate = that version becomes the single active version for its name; any older active version is auto-paused. Single-active-per-name is the registry's invariant: an operator can never have two versions of `release-check` firing at once. The pattern is the same family as release toggles, where toggling controls which behavior is live without redeploying (https://martinfowler.com/articles/feature-toggles.html, weight 0.89). Auto-pausing the predecessor is what makes the swap safe: the operator activates v3 knowing v2 stops firing in the same operation.

## Activation revalidates the stored definition

A corrupted definition must never reach production, so activation re-runs definition validation before the version flips active. This is a fail-closed check: validation failure means the activation is refused, not degraded. The reasoning matches the fail-closed design principle for LLM output handling, where untrusted or malformed content is blocked before it can reach tools or storage (https://sincllm.com/blog/llm-output-validation-repair, weight 0.54, weak backing for the general principle; the revalidation behavior itself is a stated property of the system).

## Run stamping and audit

Every run task created by an automation stamps `{automation_id, name, version}` so any task row can be traced back to the exact template version that produced it, and the system records an `automation_deployed` audit event at deploy time. This is the registry's answer to the identity question least-privilege work emphasizes for agents: a stable, lifecycle-managed identity for each actor (https://learn.microsoft.com/en-us/security/zero-trust/sfi/least-privilege-for-ai-agents, weight 0.95, used here as the general principle that agents and automation instances carry managed identity). With the stamp, a bad version is diagnosable and revertible: pause the active version, activate an older one, and every affected task carries the version number it ran under.

## What this replaces from n8n

The n8n world kept automations as workflow JSON inside the n8n instance; the retarget moved the registry, versioning, and activation into the Worker's own database. n8n kept exactly one job (the searXNG proxy webhook). The practical consequence: the deploy/activate lifecycle is now queryable SQL, the single-active invariant is enforced in the registry rather than in a workflow editor, and the audit trail lives beside the run tasks it describes.
