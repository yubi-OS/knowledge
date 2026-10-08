# Skill boundaries and routing

Scope: how sandbox-next relates to its sibling skills, the boundary cases it routes away, and the in-repo touchpoints it owns. Internal-record subtopic, no dig: this doc cites the source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) only, because routing rules live in the skill itself and were not part of the web dig set.

## The three-skill split

The source doc's frontmatter description names the split: sandbox-next is for building or changing Cloudflare Sandbox apps on `@cloudflare/sandbox@next`, the Sandbox SDK 1.0 preview. Apps on the default package use `sandbox-stable`. Porting from stable to `@next` uses `sandbox-migrate-to-next` (source doc). The body repeats the recommendation that new projects go on this line (source doc).

This means the first job of any agent holding this skill is negative: recognize when the task is not this skill's job and route. The gate section's action table encodes three routes:

1. Default `@cloudflare/sandbox` package with no `@next`: stop, load `sandbox-stable`, do not apply this skill's APIs (source doc).
2. User wants to port stable to `@next`: stop, load `sandbox-migrate-to-next` (source doc).
3. Self-deployed bridge only: bridge is not on the 1.0 preview line yet; keep bridge on the stable package and image (source doc, with the stable bridge docs as its retrieval target).

## Why the boundary is hard

The boundary is by package line, not by feature. Every API this skill documents has a counterpart that looks identical on the stable line, and the stable docs still rank first in search. The gate exists because applying preview-line APIs to a stable app (or the reverse) produces code that typechecks in fragments and fails at runtime, with the two halves speaking different control protocols. The migrate guide confirms the protocol difference between stable Sandbox and `@next` (source doc, citing the migrate page).

## Every use stays inside scope

The source doc's Guidelines section closes with a scope rule: every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job (source doc). The description enumerates the in-scope surface: code execution, AI runners, interpreters, CI-like jobs, terminals, files, mounts, tunnels, preview URLs, lifecycle, and errors. Requests that name a trigger without the artifact it acts on are the named boundary case: route to the owning surface instead of improvising (source doc).

## What the skill is and is not

The source doc describes itself as a gate, a contract, and a retrieval map, not a full manual (source doc). Three roles, three behaviors:

1. Gate: confirm the package line before writing code (section 1).
2. Contract: the non-negotiables list, which is the set of mistakes the preview line punishes (section 2).
3. Retrieval map: the table that sends each task to its official doc page, with the instruction to fetch the page before implementing and to let installed `@next` types win over guesses (section 3).

It also points at two in-repo references: a non-exhaustive cheatsheet covering process, terminal, and interpreter APIs only (`references/api-quick-ref.md`), and an examples index on the `next` branch (`references/examples.md`) (source doc).

## In-repo touchpoints

The source doc records the sections it owns or extends: 1. Gate, confirm the package line; 2. Contract, non-negotiables; 3. Retrieve, open the doc for the task; 4. Before you ship (source doc). The other two docs in this corpus that are internal-record adjacent, the exec contract doc and the ship checklist doc, expand sections 2 and 4 respectively; the remaining corpus docs expand the surfaces the retrieval map points at.

## Skills install path

Skills install through Cloudflare's agent setup flow, per the source doc's links to the agent-setup page and the cloudflare/skills repository (source doc). That is an environment question, not an API question: if a skill is missing from an agent's workspace, the fix is the install path, not reimplementing the skill's content.
