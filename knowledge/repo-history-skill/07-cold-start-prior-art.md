# Prior art: repo-history summarization and the cold-start problem

Scope: prior art on repo-history summarization: git changelog generators, repo summarizers, and why none of them joins git plus planning data plus a self-improving fit.

## The cold-start problem

A session that opens on a mature repository inherits a large undocumented surface: hundreds of pull requests, thousands of commits, and a planning tracker whose state evolved alongside the code. Reading history from scratch costs a full research pass on every session. An archive that is built once and refreshed incrementally turns that recurring cost into a one-time cost plus a cheap delta. Git itself provides the raw event stream: it is the free and open source distributed version control system designed to handle everything from small to very large projects (https://git-scm.com/, noul 0.9395), but its native log view is per-commit and carries no narrative grouping and no tracker join.

## Changelog generators: conventional commits and its tools

The largest body of prior art is changelog generation from commit messages.

1. git-cliff generates changelog files for any git repository that follows the conventional commits specification, usable as a command-line tool or as a library (https://git-cliff.org/, noul 0.7372).
2. conventional-changelog is a toolset for automatically generating formatted release notes by parsing commit messages that follow a structured specification, with a parser that turns raw strings into structured data (https://github.com/conventional-changelog/conventional-changelog, noul 0.6416).
3. cocogitto is a conventional commits toolbox covering changelog generation, git hooks, and commit templates (https://github.com/cocogitto/cocogitto, noul 0.4732, weak backing), and the specification's own site lists the tool ecosystem (https://www.conventionalcommits.org/, noul 0.9565).

What all of them lack for an archive purpose: they produce a linear, version-oriented view of commit messages. They do not join a planning tracker, they do not group by milestone or intent, and they produce static documents rather than a refreshable corpus with measurable structure. Aggregate listings of such tools confirm the category is crowded on changelogs and empty on tracker joins (https://awesome-repositories.com/q/conventional-commit-helper-and-changelog-generator, noul 0.169, weak backing).

## Repository summarization with language models

A newer wave applies language models to whole-repository understanding.

1. Hierarchical repository-level code summarization treats summarization as a backbone module for other software engineering tasks and reports that accurate repository-level summarization for business applications is difficult (https://arxiv.org/html/2501.07857v1, noul 0.8824).
2. The same line of work demonstrates that hierarchical summarization enables scalable, task-agnostic, structure-aware repository-level comprehension, improving bug localization and code search (https://link.springer.com/chapter/10.1007/978-3-031-97576-9_6, noul 0.8881).
3. Practitioner tools analyze codebases file by file and emit structured JSON documentation of structure, dependencies, and architecture (https://github.com/talmadhoun/codebase_summarizer, noul 0.6523).

These systems summarize the code tree, not the event history. Their output answers "what is this codebase" rather than "what happened here and why", and they are per-session: they recompute from source rather than maintaining a refreshable archive with an incremental contract. Generic summarization tool lists reinforce the gap: the entries are document summarizers, not history joiners (https://medevel.com/12-scripts-to-summrize-large-text/, noul 0.2535, weak backing; https://github.com/topics/ai-summarizer, noul 0.106, weak backing; https://byteable.ai/blog/best-llm-powered-code-comprehension-tool-2025, noul 0.1838, weak backing).

## Tracker-side views

Planning trackers expose their own analytics: cycle velocity, issue flow, progress by project. These views are valuable and incomplete in the opposite direction: they see the plan but not the code events that realized it, so the GitHub-to-tracker join is still manual. An archive that joins both sides gives each view the other's half.

## The structural gap

Combining the categories, the prior art divides into:

| Category | Sees git events | Sees tracker data | Refreshable | Measurable structure |
|---|---|---|---|---|
| Changelog generators | yes | no | per release | no |
| Repo summarizers | partially (code tree) | no | per session | no |
| Tracker analytics | no | yes | live | metrics only |
| This archive | yes | yes | incremental delta | primitive coverage plus curve fit |

The unoccupied cell is the point: git events plus tracker data plus a fit that makes gaps measurable in one artifact. The archive is not a better changelog or a better summarizer; it is the join that neither category attempts.

## What to reuse anyway

Two ideas are worth borrowing rather than reinventing. First, structured parsing of commit messages: the conventional commits parser that turns raw strings into typed fields (noul 0.6416) is exactly the has_purpose detector's upstream. Second, hierarchical summarization: when the archive's human-readable summary grows past a page, the hierarchical pattern of summarizing structure first and details second (noul 0.8881) keeps the summary readable.

## Design summary

1. Changelog generators cover version-oriented commit views only (https://git-cliff.org/, noul 0.7372).
2. Repository summarizers cover the code tree, per session, with no tracker join (https://arxiv.org/html/2501.07857v1, noul 0.8824).
3. Tracker analytics see the plan without the code events (no single-system view exists).
4. The archive's novelty is the three-way join plus measurable structure, not any single view (https://www.conventionalcommits.org/, noul 0.9565).
