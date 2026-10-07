# 03 Commit Message Conventions

Scope: the skill's `<type>: <short description>` format, the six commit types, writing messages that explain why rather than what, and how this maps onto Conventional Commits.

## The format and the types

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) prescribes the message format `<type>: <short description>` with an optional body explaining why, not what. Its six types:

- `feat`: new feature
- `fix`: bug fix
- `refactor`: code change that neither fixes a bug nor adds a feature
- `test`: adding or updating tests
- `docs`: documentation only
- `chore`: tooling, dependencies, config

These six are a subset of the Conventional Commits type vocabulary. The Conventional Commits 1.0.0 specification defines a lightweight convention on top of commit messages that provides an easy set of rules for creating an explicit commit history (https://www.conventionalcommits.org/en/v1.0.0/, weight 0.87). The full community type list is wider (it adds style, perf, ci, build, revert and scoped forms), as cheatsheets enumerate (https://www.variedtools.com/semantic-commit-cheatsheet, weight 0.13, weak backing; https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13, weight 0.18, weak backing). The skill's six are the subset an agent needs day to day; using the full conventional vocabulary is compatible with it.

## Why, not what

The skill's good/bad example is `feat: add email validation to registration endpoint` with a body explaining that the validation prevents invalid email formats from reaching the database and that it uses Zod schema validation at the route handler level, consistent with existing patterns in auth.ts. The bad message is `update auth.ts`, which the skill dismisses as describing what is obvious from the diff.

Practitioner guidance converges on the same principle. The diff shows what changed; the commit body should explain the business context, the bug that triggered it, or the trade-off made (https://www.gitglossary.com/git-commit-best-practices, weight 0.15, weak backing). A 2026 essay puts it bluntly: the primary purpose of a commit message is not to describe what changed but why it changed (https://adhdecode.com/articles/git/git-commit-best-practices/, weight 0.16, weak backing). Baeldung's tutorial frames well-written messages as a skill worth studying deliberately (https://www.baeldung.com/ops/git-commit-messages, weight 0.25, weak backing).

The skill's own justification: "Messages are documentation. Future you (and future agents) will need to understand what changed and why" (source doc, from the rationalizations table). For agent-driven development this is load-bearing: the next agent session reads `git log` as its primary history source.

## What the conventions buy

A typed message format makes history machine-readable. The skill's debugging section leans on this directly: `git log --grep="validation" --oneline` searches commit messages for a keyword (source doc). That search only works if messages carry the relevant vocabulary. Typed prefixes also let changelog tooling infer release notes categories (doc 09 covers the changelog side).

The skill's red flags include commit messages like "fix", "update", "misc" (source doc). These fail on two counts: no type prefix and no why. The per-commit verification checklist includes "message explains the why, follows type conventions" (source doc).

## Practical rules for agents

1. Subject line: `<type>: <short description>`, one logical thing (source doc).
2. Body: optional, explains why, constraint context, and consistency decisions; not a restatement of the diff (source doc, corroborated at weights 0.15 to 0.25 above).
3. Never ship "fix" or "update" as a whole message (source doc red flags).
4. Keep the type honest: a formatting-only change is `chore` or `style`, not `refactor`; this interacts with the concern-separation rule in doc 04.
