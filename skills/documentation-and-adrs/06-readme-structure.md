# README Structure

Scope: the 6-section README the source doc prescribes for every project, what each section must contain, and how the architecture section links the README to the ADR corpus.

## The prescription

Per the source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "README Structure"), every project should have a README covering 6 things:

1. **Project name and one-paragraph description** of what the project does. This is the first screen; it answers "what is this" before anything else.
2. **Quick Start**: a numbered setup path. The source doc's example is 4 steps: clone the repo, install dependencies (`npm install`), set up environment (`cp .env.example .env`), run the dev server (`npm run dev`). Each step is copy-pasteable.
3. **Commands**: a table of the commands a contributor needs. The example table covers `npm run dev` (start development server), `npm test`, `npm run build` (production build), and `npm run lint`.
4. **Architecture**: a brief overview of the project structure and key design decisions, with links to ADRs for details. This is the section that ties the README into the decision-record system (doc 03).
5. **Contributing**: how to contribute, coding standards, and the PR process.

The commands table format matters: a table, not prose, so a contributor (or an agent scanning the repo) can enumerate the available operations at a glance.

## Why the README is a first-class surface

The source doc's red-flags list (see doc 09) includes "README that doesn't explain how to run the project" as a violation. That makes the Quick Start section the single most checked item: a README without a runnable path to a working dev environment fails the skill's verification checklist.

Weak-backed external corroboration: freeCodeCamp's README guide (https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/, weight 0.21) recommends the same skeleton (description, getting started, usage, contributing) for GitHub projects, and GitHub's own ReadME guides hub (https://github.com/readme/guides, weight 0.25) collects project README writing practices. Both are below the 0.5 authority threshold; cite them as practitioner echoes of the source doc, not as independent authority. The README Wikipedia entry (https://en.wikipedia.org/wiki/README, weight 0.10) grounds only the origin claim: README files predate GitHub and have long been the standard entry point of a source distribution.

## The architecture section as an ADR index

The source doc's architecture section text is: "Brief overview of the project structure and key design decisions. Link to ADRs for details." Two properties follow:

- The README states *that* a decision exists and where it is recorded, without restating the reasoning. Restating would create a second copy that drifts when a new ADR supersedes the old one.
- The README-to-ADR link keeps a single source of truth for the reasoning (the ADR in docs/decisions/, per doc 03), while the README stays the lightweight entry point.

This division of labor mirrors the skill's overall thesis (doc 01): the code is the what, the README is the orientation layer, and the ADRs are the why.

## The onboarding payoff

Trigger 5 from doc 01 (onboarding new team members or agents) is where the README earns its keep. A new contributor's path is: read the one-paragraph description, run the quick start, glance at the commands table, then follow the architecture links into the ADRs when a design question appears. An agent gets the same path: the README is usually the first file an agent reads in a repo, and the quick-start commands are directly executable, so a README that follows this structure is simultaneously human onboarding and agent setup instructions.

## Verification

The source doc's verification checklist (doc 09) includes the README-specific item: "README covers quick start, commands, and architecture overview". That is the testable core of this doc: 3 of the 6 sections (quick start, commands, architecture) are non-negotiable; the description, contributing, and project-name sections complete the standard shape.

## Gaps and drift notes

The source doc's template is npm-flavored (npm install, npm run dev). The structure ports directly to other ecosystems (cargo, pip, go) by substituting the package manager commands; the corpus records no contradiction on this point, and the dig surfaced no dated corrections to the source doc's README guidance. The strongest external agreement remains the weak-backed freeCodeCamp and GitHub guides cited above.
