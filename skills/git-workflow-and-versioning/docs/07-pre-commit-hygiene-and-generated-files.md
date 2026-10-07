# 07 Pre-Commit Hygiene and Generated Files

Scope: the five-step pre-commit checklist, automating it with husky and lint-staged, and the commit-versus-ignore rules for generated files, build output, and secrets.

## The pre-commit checklist

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) requires five checks before every commit:

1. `git diff --staged`: check what you are about to commit.
2. `git diff --staged | grep -i "password\|secret\|api_key\|token"`: ensure no secrets.
3. `npm test`: run tests.
4. `npm run lint`: run linting.
5. `npx tsc --noEmit`: run type checking.

Steps 1 and 2 are the review-and-secrets gate; steps 3 to 5 are the correctness gate. Together they implement the per-commit verification items "tests pass before committing" and "no secrets in the diff" (source doc).

## Automating with hooks

The skill prescribes lint-staged plus husky in package.json: eslint --fix and prettier --write on staged `*.{ts,tsx}` files, prettier --write on staged `*.{json,md}` (source doc). Current ecosystem guidance matches: in 2026, husky plus lint-staged remains the industry-standard pre-commit setup for Node projects, with lefthook as an all-in-one faster alternative (https://www.pkgpulse.com/guides/husky-vs-lefthook-vs-lint-staged-git-hooks-nodejs-2026, weight 0.11, weak backing). Setup walkthroughs describe the same division of labor: husky installs the git hooks, lint-staged runs tools on the staged files only (https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/, weight 0.19, weak backing; https://oliviac.dev/blog/set_up_pre_commit_hook_husky_lint_staged/, weight 0.19, weak backing; https://dev.to/_d7eb1c1703182e3ce1782/git-hooks-with-husky-and-lint-staged-the-complete-setup-guide-for-2025-5, weight 0.14, weak backing). Running on staged files only is what keeps the hook fast enough to survive as a habit.

## What gets committed and what does not

The skill's generated-files rules:

- Commit generated files only if the project expects them. Its examples: `package-lock.json`, Prisma migrations (source doc).
- Do not commit build output (`dist/`, `.next/`), environment files (`.env`), or IDE config (`.vscode/settings.json` unless shared) (source doc).
- Have a `.gitignore` that covers `node_modules/`, `dist/`, `.env`, `.env.local`, `*.pem` (source doc).

The mechanism is documented in git itself: a gitignore file specifies intentionally untracked files that git should ignore, and files already tracked are not affected (https://git-scm.com/docs/gitignore, weight 0.97). Template collections provide per-stack starting points: the github/gitignore repository is a curated collection of useful .gitignore templates (https://github.com/github/gitignore, weight 0.71), and gitignore.io generates a file from a selection of 571 operating system, IDE, and language templates (https://www.toptal.com/developers/gitignore, weight 0.19, weak backing). A 2026 best-practices piece frames the design goal as keeping secrets and build files out of git by covering language, OS, editor, build output, environment files, and accidental secrets (https://zerodatatools.com/blog/gitignore-best-practices/, weight 0.15, weak backing). A reference guide lists the same categories: dependencies, build outputs, and secrets (https://gitcheatsheet.dev/docs/getting-started/ignoring-files/, weight 0.18, weak backing).

The skill's rationalizations table supplies the stakes: "I don't need a .gitignore" fails "until `.env` with production secrets gets committed. Set it up immediately" (source doc). Committing `node_modules/`, `.env`, or build artifacts is on the red-flags list (source doc).

## Agent workflow

1. Stage deliberately; read the staged diff before committing (source doc).
2. Grep the staged diff for secret-shaped tokens; treat any hit as a stop (source doc).
3. Let the hook run eslint, prettier, tests, and typecheck; do not bypass a failing hook, fix the change (source doc checklist).
4. If the repo has no `.gitignore` yet, create one covering the skill's five patterns before the first commit (source doc; templates at https://github.com/github/gitignore, weight 0.71).
5. Generated files follow the project's expectation, not the agent's judgment call: lockfiles and migrations in, build output and `.env` out (source doc).
