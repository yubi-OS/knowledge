# 02 - GitHub Actions CI Configuration

## Scope

How the quality gate pipeline is expressed as GitHub Actions workflows: the basic Node.js pipeline, a Postgres service container for integration tests, and a Playwright E2E job, with the secrets discipline that goes with each.

## Basic CI pipeline (source doc)

The source doc gives a canonical `.github/workflows/ci.yml` that triggers on `pull_request` targeting main and on `push` to main, with a single `quality` job on ubuntu-latest. The step order mirrors the gate pipeline: checkout, setup-node v4 with Node 22 and npm cache, `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test -- --coverage`, `npm run build`, and `npm audit --audit-level=high` (source doc). Two details carry weight beyond boilerplate: `npm ci` over `npm install` (reproducible install from the lockfile) and the `cache: 'npm'` option on setup-node (dependency cache on the runner).

GitHub's own Node.js CI tutorial documents the same shape: a CI workflow to build and test a Node.js project, using setup-node to configure the toolchain (https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs, weight 0.96). That tutorial is the authoritative reference for the action versions and caching behavior the source doc example relies on.

## Integration tests with a Postgres service container (source doc)

For integration tests against a real database, the source doc adds a second `integration` job that uses a GitHub Actions service container: `image: postgres:16`, environment variables for database name, user, and a password sourced from `secrets.CI_DB_PASSWORD`, a port mapping of 5432, and health-check options (`pg_isready`, 10s interval, 5s timeout, 5 retries). Steps then run `npx prisma migrate deploy` followed by the integration test suite, both pointed at `postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb` (source doc).

GitHub's official guide on creating PostgreSQL service containers documents exactly this pattern: a service container configured from the Docker Hub postgres image, with a workflow script that connects to the service, creates a table, and populates it (https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers, weight 0.95). The same guide exists for GitHub Enterprise Server with identical mechanics (https://docs.github.com/en/enterprise-server@3.18/actions/tutorials/use-containerized-services/create-postgresql-service-containers, weight 0.95). The health check options matter operationally: they make the job wait for Postgres readiness rather than racing migrations against a cold database.

## E2E tests (source doc)

The source doc's E2E job installs Playwright with system dependencies (`npx playwright install --with-deps chromium`), builds the app, runs `npx playwright test`, and, on failure, uploads the `playwright-report/` directory using `actions/upload-artifact@v4` with an `if: failure()` condition (source doc). The artifact upload is the part teams omit and later regret: without it, a failed E2E run produces no diagnosable evidence beyond the log tail.

## Secrets in CI-only databases (source doc)

The source doc includes a deliberate note: even for CI-only test databases, use GitHub Secrets for credentials rather than hardcoding values, because this builds good habits and prevents accidental reuse of test credentials in other contexts (source doc). This is the bridge to doc 05 (environment and secrets management) and it applies at the workflow level: any value that authenticates anything, test or production, flows through `secrets.*` references, never through literals in the YAML.

## Structural takeaways

1. One workflow file, multiple jobs, each job owns a distinct gate class (quality, integration, e2e) (source doc).
2. Trigger on pull_request to main and push to main so every change is verified on both entry paths (source doc).
3. Service containers give integration tests a real dependency with health-gated startup (source doc; https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers, weight 0.95).
4. Failure artifacts (playwright-report) are uploaded conditionally so successes pay no storage cost (source doc).
5. Action versions are pinned (`actions/checkout@v4`, `actions/setup-node@v4`) (source doc).

## Verification hooks

The source doc's post-setup checklist requires the pipeline to run on every PR and push to main and to block merge through branch protection (source doc). Branch protection mechanics themselves are covered in doc 06.
