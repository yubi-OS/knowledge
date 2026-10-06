# 07. README structure

Scope: the skill's required README sections (one-paragraph description, Quick Start, Commands table, Architecture overview linking to ADRs, Contributing) and the reasoning behind the architecture section pointing at decision records.

## The required structure (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) requires every project to have a README covering 5 sections:

1. Project name plus a one-paragraph description of what the project does.
2. Quick Start: a numbered setup path (clone the repo, `npm install`, `cp .env.example .env`, `npm run dev`). Each step is a command a newcomer can run in order.
3. Commands: a table mapping each command (`npm run dev`, `npm test`, `npm run build`, `npm run lint`) to a one-line description.
4. Architecture: a brief overview of the project structure and key design decisions, with links to ADRs for details.
5. Contributing: how to contribute, coding standards, PR process.

The red flag list enforces the minimum: "README that doesn't explain how to run the project" is a documented failure state, and the verification checklist requires the README to cover quick start, commands, and architecture overview.

## Why the architecture section links to ADRs

The source doc's architecture section is deliberately thin: "Brief overview of the project structure and key design decisions. Link to ADRs for details." The README states the shape; the ADRs (per docs 02 to 04) carry the why. This keeps the README current with less churn: structure descriptions change with refactors, but the decision records do not, and they have their own lifecycle. A README that re-explains decisions duplicates the ADR and rots twice as fast.

A weak-backed general reference describes the README's role as containing "descriptive information about the content of a directory in which the file is located" (https://en.wikipedia.org/wiki/README, jev 0.13, weak backing), and a weak-backed tutorial frames it as "an important document in a repository that introduces the project and explains its purpose, setup, and usage to help users and developers understand and contribute to it" (https://www.geeksforgeeks.org/git/what-is-readme-md-file/, jev 0.10, weak backing). The skill's section list is a concrete, testable version of those descriptions: purpose (description), setup (Quick Start), usage (Commands), understanding (Architecture), contribution (Contributing).

## What the Quick Start format implies

The skill's Quick Start is a 4-step numbered path ending in a running dev server, including the environment setup step (`cp .env.example .env`). Two properties make it work:

1. It is ordered and executable top to bottom with no unstated prerequisites between steps.
2. It ends at a verified-good state (the dev server running), which gives the newcomer a checkpoint before reading further.

The Commands table complements it for the post-setup phase: dev, test, build, and lint as a lookup rather than prose. Tables beat paragraphs for this content because the reader scans for one command, not a narrative.

## Practice notes

1. Write the one-paragraph description first; if it is hard to write, the project's purpose is underspecified and that is a finding, not a writing problem.
2. Keep every Quick Start step a command, and verify the sequence on a clean checkout. A Quick Start that only works on the author's machine is a red flag in disguise.
3. List the dev, test, build, and lint commands even when they are standard; the table is also documentation of which quality gates exist.
4. In Architecture, name the 2 or 3 decisions that define the project and link each to its ADR number rather than summarizing the reasoning.
5. Contributing should name the coding standards source (often the rules files, see doc 09) and the PR process, so agents and humans land changes the same way.
